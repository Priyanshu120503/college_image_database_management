import psycopg2

conn = psycopg2.connect(
    dbname='your_database_name',
    user='username',
    password='password',
    host='localhost'
)

cur = conn.cursor()

with open('iamge.jpg', 'rb') as f:
    image_data = f.read()

cur.execute("""
    INSERT INTO "Images" (added_by, users_associated, name, tags, description, image)
    VALUES
    (%s, %s, %s, %s, %s, %s)
""", ('John Wood',[21108001, 21108002], 'Image1', ['tag1', 'tag2'], 'Description for Image1', psycopg2.Binary(image_data)))

conn.commit()

cur.close()
conn.close()
