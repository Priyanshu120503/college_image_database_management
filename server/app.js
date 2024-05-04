const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
const port = 4000;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "College_Image_Database",
  password: "password",
  port: 5432,
});


app.use(bodyParser.json());

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error connecting to the database:", err);
  }
  console.log("Connected to the database successfully");
  release();
});

function byteArrayToBase64(byteArray) {
  // Convert byte array to string
  const binaryString = byteArray.reduce((acc, byte) => {
    return acc + String.fromCharCode(byte);
  }, '');

  // Convert string to Base64
  return btoa(binaryString);
}

function base64ToByteArray(base64String) {
  // Decode the base64 string
  const binaryString = atob(base64String);

  // Create a Uint8Array to hold the byte values
  const byteArray = new Uint8Array(binaryString.length);

  // Iterate through each character of the binary string and store its char code in the byte array
  for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
  }

  return byteArray;
}

function combineTagsToAnArray(tags) {
  const tagObj = {}
  tags.forEach((tag) => {
    if(!(tag.img_id in tagObj))
      tagObj[tag.img_id] = [];
    tagObj[tag.img_id].push(tag.tag);
  });

  return tagObj;
}

// app.get('/image/:id', async (req, res) => {
//   try {
//     const imageId = parseInt(req.params.id);

//     const query = 'SELECT image FROM "Images" WHERE img_id = $1';
//     const result = await pool.query(query, [imageId]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Image not found' });
//     }

//     const imageData = result.rows[0].image;

//     res.set('Content-Type', 'image/jpg');

//     res.send(imageData);
//   } catch (error) {
//     console.error('Error retrieving image:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userQuery = await pool.query(
      'SELECT * FROM "User" WHERE mail=$1 AND password=$2',
      [email, password]
    );
    const user = userQuery.rows;
    if (user.length === 1) {
      let moreDetails;
      let user_type = 'teacher';

      // Search in teacher table
      const moreQuery = await pool.query(
        'SELECT * FROM "teachers" WHERE teacher_id=$1',
        [user[0].user_id]
      );
      moreDetails = moreQuery.rows;
      
      // Search in student table
      if(moreDetails.length !== 1) {
        user_type = 'student';
        const moreQuery = await pool.query(
          'SELECT * FROM "Students" WHERE student_id=$1',
          [user[0].user_id]
        );
        moreDetails = moreQuery.rows;
      }

      res.json({ success: true, user: {...user[0], ...moreDetails[0], user_type} });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal server error" });
  }  
});

app.get("/user_img/:id", async(req, res) => {
  const { id } = req.params;
  try {
    const userImgQuery = await pool.query(
      'SELECT * FROM "Images" WHERE img_id=(SELECT img_id FROM "User" WHERE user_id=$1);',
      [id]
    );
    const userImg = userImgQuery.rows;

    let user;
    const userQuery = await pool.query(
      'SELECT * FROM "User" INNER JOIN "teachers" ON user_id=teacher_id WHERE user_id=$1;',
      [id]
    );
    user = userQuery.rows;

    if(user.length === 0) {
      const userQuery = await pool.query(
        'SELECT * FROM "User" INNER JOIN "Students" ON user_id=student_id WHERE user_id=$1;',
        [id]
      );
      user = userQuery.rows;
    }

    const tagQuery = await pool.query(
      'SELECT * FROM "Image_tags" WHERE img_id=(SELECT img_id FROM "User" WHERE user_id=$1);',
      [id]
    );
    const tags = tagQuery.rows.map((row) => row.tags);
    if (userImg.length === 1) {
      userImg[0].image = byteArrayToBase64(userImg[0].image);
      userImg[0].tags = tags;

      const result = {...userImg[0], ...user[0]};
      res.json(result);
    } else {
      res.status(500);
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal server error" });
  }  
});

app.get("/find_imgs/:query", async(req, res) => {
  const { query } = req.params;
  try {
    const imgQuery = await pool.query(
      'SELECT * FROM "Images" WHERE LOWER(name) LIKE $1 UNION\
      SELECT * FROM "Images" WHERE img_id in (SELECT DISTINCT img_id FROM "Image_tags" WHERE LOWER(tag) LIKE $1)',
      ['%' + query + '%']
    );
    let imgs = imgQuery.rows;
    
    const tagQuery = await pool.query(
      'SELECT * FROM "Image_tags" WHERE img_id in (SELECT img_id FROM "Image_tags" WHERE LOWER(tag) LIKE $1) OR\
       img_id in (SELECT img_id FROM "Images" WHERE LOWER(name) LIKE $1)',
      ['%' + query + '%']
    );
    const tags = tagQuery.rows;

    // If the image is of any teacher
    const teacherQuery = await pool.query(
      'SELECT * FROM "User" INNER JOIN "teachers" ON user_id=teacher_id WHERE img_id = ANY($1)',
      ["{" + (imgs.map((img) => img.img_id)).toString()+ "}"]
    );
    const teachers = teacherQuery.rows;

    // If the image is of any student
    const studentQuery = await pool.query(
      'SELECT * FROM "User" INNER JOIN "Students" ON user_id=student_id WHERE img_id = ANY($1)',
      ["{" + (imgs.map((img) => img.img_id)) + "}"]
    );
    const students = studentQuery.rows;
    
    if (imgs.length > 0) {
      const tagObj = combineTagsToAnArray(tags);

      imgs = imgs.map(img => {
        for(const teacher of teachers) {
          if(teacher.img_id === img.img_id) {
            img = {...img, ...teacher};
          }
        }
        for(const student of students) {
          if(student.img_id === img.img_id) {
            img = {...img, ...student};
          }
        }
        
        img.image = byteArrayToBase64(img.image);
        img.tags = (img.img_id in tagObj) ? tagObj[img.img_id] : [];
        return img;
      });
      res.json(imgs);
    } else {
      res.status(500);
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal server error" });
  }  
});

app.get("/Courses/list/:user_type/:id", async (req, res) => {
  const { user_type, id } = req.params;
  try {
    let coursesQuery;
    if(user_type === 'student') {
      coursesQuery = await pool.query(
        'SELECT name FROM "Courses" NATURAL JOIN "student_courses" WHERE student_id=$1',
        [id]
      );
    } else {
      coursesQuery = await pool.query(
        'SELECT DISTINCT name FROM "Courses" WHERE teacher_id=$1',
        [id]
      );
    }

    const courses = coursesQuery.rows.map((row) => row.name);
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/Courses/:some_course", async (req, res) => {
  const { some_course } = req.params;
  try {
    const yearsQuery = await pool.query(
      'SELECT DISTINCT year FROM "Courses" WHERE name = $1',
      [some_course]
    );
    const years = yearsQuery.rows.map((row) => row.year);
    res.json(years);
  } catch (error) {
    console.error("Error fetching years for course:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/Courses/:some_course/:year", async (req, res) => {
  const { some_course, year } = req.params;
  try {
    const imagesQuery = await pool.query(
      'SELECT * FROM "Images" WHERE img_id in (SELECT img_id FROM "course_images" NATURAL JOIN "Courses" WHERE name=$1 AND year=$2)',
      [some_course, year]
    );
    const images = imagesQuery.rows;

    const tagQuery = await pool.query(
      'SELECT * FROM "Image_tags" WHERE img_id in (SELECT img_id FROM "course_images" NATURAL JOIN "Courses" WHERE name=$1 AND year=$2)',
      [some_course, year]
    );
    const tags = tagQuery.rows;
    const tagObj = combineTagsToAnArray(tags);

    images.map(img => {
      img.image = byteArrayToBase64(img.image);
      img.tags = (img.img_id in tagObj) ? tagObj[img.img_id] : [];
    });
    res.json(images);
  } catch (error) {
    console.error("Error fetching images for course and year:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/Events", async (req, res) => {
  try {
    const eventsQuery = await pool.query(
      'SELECT DISTINCT event_name FROM "Events"'
    );
    const events = eventsQuery.rows.map((row) => row.event_name);
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/Events/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const yearsQuery = await pool.query(
      'SELECT DISTINCT EXTRACT(YEAR FROM date) AS year FROM "Events" WHERE event_name = $1',
      [name]
    );
    const years = yearsQuery.rows.map((row) => row.year);
    res.json(years);
  } catch (error) {
    console.error("Error fetching years for event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/Events/:name/:year", async (req, res) => {
  const { name, year } = req.params;
  try {
    const imagesQuery = await pool.query(
      'SELECT * FROM "Images" WHERE img_id in (SELECT img_id FROM "Event_Images" NATURAL JOIN "Events" WHERE event_name=$1 AND EXTRACT(year FROM date)=$2);',
      [name, year]
    );
    const images = imagesQuery.rows;

    const tagQuery = await pool.query(
      'SELECT * FROM "Image_tags" WHERE img_id in (SELECT img_id FROM "Event_Images" NATURAL JOIN "Events" WHERE event_name=$1 AND EXTRACT(year FROM date)=$2);',
      [name, year]
    );
    const tags = tagQuery.rows;
    const tagObj = combineTagsToAnArray(tags);

    images.map(img => {
      img.image = byteArrayToBase64(img.image);
      img.tags = (img.img_id in tagObj) ? tagObj[img.img_id] : [];
    });
    res.json(images);
  } catch (error) {
    console.error("Error fetching images for event and year:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/Classes", async (req, res) => {
  try {
    const yearsQuery = await pool.query(
      'SELECT DISTINCT year_of_join FROM "Students"'
    );
    const years = yearsQuery.rows.map((row) => row.year_of_join);
    res.json(years);
  } catch (error) {
    console.error("Error fetching admission years:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/Classes/:year", async (req, res) => {
  const { year } = req.params;
  try {
    const departmentsQuery = await pool.query(
      'SELECT DISTINCT branch FROM "Students" WHERE year_of_join = $1',
      [year]
    );
    const departments = departmentsQuery.rows.map((row) => row.branch);
    res.json(departments);
  } catch (error) {
    console.error("Error fetching departments for admission year:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/Classes/:year/:dep", async (req, res) => {
  const { year, dep } = req.params;
  try {
    const imagesQuery = await pool.query(
      'SELECT * FROM "Images" WHERE img_id in (SELECT img_id FROM "Students" INNER JOIN "User" ON student_id=user_id WHERE year_of_join=$1 AND branch=$2)',
      [year, dep]
    );
    let images = imagesQuery.rows;

    const tagQuery = await pool.query(
      'SELECT * FROM "Image_tags" WHERE img_id in (SELECT img_id FROM "Students" INNER JOIN "User" ON student_id=user_id WHERE year_of_join=$1 AND branch=$2)',
      [year, dep]
    );
    const tags = tagQuery.rows;
    const tagObj = combineTagsToAnArray(tags);

    const studentQuery = await pool.query(
      'SELECT * FROM "User" INNER JOIN "Students" ON user_id=student_id WHERE img_id = ANY($1)',
      ["{" + (images.map((img) => img.img_id)) + "}"]
    );
    const students = studentQuery.rows;
 
    images = images.map(img => {
      for(const student of students) {
        if(student.img_id === img.img_id) {
          img = {...img, ...student};
          break;
        }
      }

      img.image = byteArrayToBase64(img.image);
      img.tags = (img.img_id in tagObj) ? tagObj[img.img_id] : [];
      return img;
    });
    res.json(images);
  } catch (error) {
    console.error("Error fetching images for department and year:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/image/:folder/:sub_f1/:sub_f2", async (req, res) => {
  const { folder, sub_f1, sub_f2 } = req.params;
  
  try {
    if(folder === "Courses") {
      const { name, img, description, tags, users_associated, added_by } = req.body;
      const imgQuery = await pool.query(
        'INSERT INTO "Images"(users_associated, name, description, image, added_by) VALUES($1, $2, $3, $4, $5)',
        [users_associated, name, description, base64ToByteArray(img), added_by]
      );

      const imgIdQuery = await pool.query('SELECT MAX(img_id) FROM "Images"');
      const img_id = imgIdQuery.rows[0].max;

      for(const tag of tags) {
        const tagQuery = await pool.query('INSERT INTO "Image_tags" VALUES ($1, $2)', [img_id, tag]);
      }

      const courseImagesQuery = await pool.query(
        'INSERT INTO "course_images" VALUES((SELECT course_code FROM "Courses" WHERE name=$1), $2, $3)',
        [sub_f1, sub_f2, img_id]
      );
      const course = courseImagesQuery.rows;

      res.status(200).send("Data stored successfully");
    }
  } catch(error) {
    console.error("Error putting data", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
