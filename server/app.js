const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
// const multer = require('multer');
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

const app = express();
const port = 4000;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "College_Image_Database",
  password: "$Jr+N23l#sc(vd",
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

app.get("/courses", async (req, res) => {
  try {
    const coursesQuery = await pool.query(
      'SELECT DISTINCT name FROM "Courses"'
    );
    const courses = coursesQuery.rows.map((row) => row.name);
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/courses/:some_course", async (req, res) => {
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

app.get("/courses/:some_course/:year", async (req, res) => {
  const { some_course, year } = req.params;
  try {
    const imagesQuery = await pool.query(
      'SELECT * FROM "Images" WHERE img_id in (SELECT img_id FROM "course_images" NATURAL JOIN "Courses" WHERE name=$1 AND year=$2);',
      [some_course, year]
    );
    const images = imagesQuery.rows;
    res.json(images);
  } catch (error) {
    console.error("Error fetching images for course and year:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/events", async (req, res) => {
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

app.get("/events/:name", async (req, res) => {
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

app.get("/events/:name/:year", async (req, res) => {
  const { name, year } = req.params;
  try {
    const imagesQuery = await pool.query(
      'SELECT * FROM "Images" WHERE users_associated = $1 AND EXTRACT(YEAR FROM tags::date) = $2',
      [name, year]
    );
    const images = imagesQuery.rows;
    res.json(images);
  } catch (error) {
    console.error("Error fetching images for event and year:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/classes", async (req, res) => {
  try {
    const yearsQuery = await pool.query(
      'SELECT DISTINCT year_of_join FROM "Student"'
    );
    const years = yearsQuery.rows.map((row) => row.year_of_join);
    res.json(years);
  } catch (error) {
    console.error("Error fetching admission years:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/classes/:year", async (req, res) => {
  const { year } = req.params;
  try {
    const departmentsQuery = await pool.query(
      'SELECT DISTINCT branch FROM "Student" WHERE year_of_join = $1',
      [year]
    );
    const departments = departmentsQuery.rows.map((row) => row.branch);
    res.json(departments);
  } catch (error) {
    console.error("Error fetching departments for admission year:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/classes/:year/:dep", async (req, res) => {
  const { year, dep } = req.params;
  try {
    const imagesQuery = await pool.query(
      'SELECT * FROM "Images" WHERE users_associated = $1 AND tags = $2',
      [year, dep]
    );
    const images = imagesQuery.rows;
    res.json(images);
  } catch (error) {
    console.error("Error fetching images for department and year:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// app.post('/upload', upload.single('image'), async (req, res) => {
//   try {
  
//     const imageBuffer = req.file.buffer;

//     const query = `
//       INSERT INTO "Images" (added_by ,users_associated, name, tags, description, image)
//       VALUES
//       ($1, $2, $3, $4, $5 ,$6)
//     `;
//     const values = ['John Wood',
//       [21108001, 21108002],
//       'Image1',              
//       ['tag1', 'tag2'],      
//       'Description for Image1', 
//       imageBuffer            
//     ];
//     await pool.query(query, values);

//     res.status(201).json({ message: 'Image uploaded successfully' });
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.post('/courses/:course/:year', upload.single('image'), async (req, res) => {
//   try {
//     const course = req.params.course;
//     const year = req.params.year;
//     const image = req.file.buffer;
//     const query = `
//       INSERT INTO "Images" (course, year, image)
//       VALUES ($1, $2, $3)
//     `;
//     await pool.query(query, [course, year, image]);

//     res.status(201).json({ message: 'Image added to course successfully' });
//   } catch (error) {
//     console.error('Error adding image to course:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.post('/events/:name/:year', upload.single('image'), async (req, res) => {
//   try {
//     const eventName = req.params.name;
//     const year = req.params.year;
//     const image = req.file.buffer;
//     const query = `
//       INSERT INTO "Images" (event_name, year, image)
//       VALUES ($1, $2, $3)
//     `;
//     await pool.query(query, [eventName, year, image]);

//     res.status(201).json({ message: 'Image added to event successfully' });
//   } catch (error) {
//     console.error('Error adding image to event:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Endpoint to add image to a class for a specific year and department
// app.post('/classes/:year/:dep', upload.single('image'), async (req, res) => {
//   try {
//     const year = req.params.year;
//     const department = req.params.dep;
//     const image = req.file.buffer;
//     const query = `
//       INSERT INTO "Images" (year, department, image)
//       VALUES ($1, $2, $3)
//     `;
//     await pool.query(query, [year, department, image]);

//     res.status(201).json({ message: 'Image added to class successfully' });
//   } catch (error) {
//     console.error('Error adding image to class:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
