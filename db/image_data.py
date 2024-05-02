import psycopg2

conn = psycopg2.connect(
    dbname='database',
    user='username',
    password='password',
    host='localhost'
)
cur = conn.cursor()

img_data_in_order = [(211070072, 'Netra Patel', 'Profile Photo'),
(211080065, 'Keyur Doshi', 'Profile Photo'),
(211080050, 'Akshay Potkule', 'Profile Photo'),
(211080051, 'Nikhil Soni', 'Profile Photo'),
(211080037, 'Jinesh Shah', 'Profile Photo'),
(211080038, 'Priyanshu Rathore', 'Profile Photo'),
(211080035, 'Vyomesh Gala', 'Profile Photo'),
(211050023, 'Rushi Jani', 'Profile Photo'),
(211080043, 'Karan Choksey', 'Profile Photo'),
(10110001, 'Shivani Supe', 'Profile Photo'),
(10110002, 'Mahesh Shirole', 'Profile Photo'),
(10110003, 'Sandeep Udmale', 'Profile Photo'),
(10110004, 'Sagar Rawool', 'Profile Photo'),
(10110005, 'Sandeep Shingade', 'Profile Photo'),
(10110006, 'Mansi Kulkarni', 'Profile Photo'),
(211080037, 'Technovanza Science Exhibition', 'Technovanza Presents You Biggest Science And Technology Exhibition'),
(211080037, 'Enthusia Marahton 2k24', 'Excerise And Stay Healthy And Happy Everyday'),
(211080037, 'Pratibimb : Cultural Fest', 'Exclusively Organized for Final Year'),
(211080037, 'DBMS1', 'STUDY1'),
(211080037, 'DBMS2', 'STUDY2'),
(211080037, 'DBMS3', 'STUDY3'),
(211080037, 'DBMS4', 'STUDY4'),
(211080037, 'LA1', 'STUDY1'),
(211080037, 'LA2', 'STUDY2'),
(211080037, 'LA3', 'STUDY3'),
(211080037, 'OS1', 'STUDY1'),
(211080037, 'OS2', 'STUDY2'),
(211080037, 'PC1', 'STUDY1'),
(211080037, 'PC2', 'STUDY2'),
(211080037, 'WN1', 'STUDY1'),
(211080037, 'WN2', 'STUDY2'),
(211080037, 'WN3', 'STUDY3'),
(211080037, 'CD1', 'STUDY1'),
(211080037, 'CD2', 'STUDY2')]

for i in range(1, 35):
    with open(f'../images/{i}.jpeg', 'rb') as f:
        image_data = f.read()
        added_by, name, description = img_data_in_order[i - 1]
        cur.execute("""
            INSERT INTO "Images" (added_by, name, description, image)
            VALUES (%s, %s, %s, %s)""",
            (added_by, name, description, psycopg2.Binary(image_data))
            )



images_with_associated_users = [(211080051, 'Hackathon Winner', 'Won 1st prize at College level Hackathon', [211070072,211080050,211080065]),
(211050023, 'Industrial Visit', 'Group Photo With My Gang',[211080037,211080035,211080038,211080043])]

for i in range(2):
    with open(f'../images/{35 + i}.jpeg', 'rb') as f:
        image_data = f.read()
        added_by, name, description, u_a = images_with_associated_users[i]
        cur.execute("""INSERT INTO "Images" (added_by, name, description, image, users_associated) 
                    VALUES (%s, %s, %s, %s, %s)""",
            (added_by, name, description, psycopg2.Binary(image_data), u_a))

conn.commit()

cur.close()
conn.close()
