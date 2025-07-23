import csv
import psycopg2
from cuid import cuid
from datetime import datetime

now = datetime.utcnow()

conn = psycopg2.connect(
    dbname="projectdb",
    user="postgres",
    password="mypassword",
    host="localhost",
    port="5432"
)

cursor = conn.cursor()

def generate_unique_id():
    while True:
        id = cuid()
        cursor.execute(
            """SELECT COUNT(*) FROM "Model" WHERE id = %s""", (id,)
        )
        if cursor.fetchone()[0] == 0:
            return id
        
def add_model(data):
    try:
        cursor.execute('SELECT id FROM "SourceSite" WHERE name = %s', (data['platform'],))
        source_site_id = cursor.fetchone()[0]
        cursor.execute('SELECT id FROM "Category" WHERE name=%s', (data['category'],))
        category_id = cursor.fetchone()[0]
        cursor.execute('SELECT id FROM "SubCategory" WHERE name=%s', (data['subcategory'],))
        subcategory_id = cursor.fetchone()[0]
        data['tags'] = [tag.strip() for tag in data['tags'].split(',')]
        data['image_urls'] = [url.strip() for url in data['image_urls'].split(',')]
        cursor.execute(
            """INSERT INTO "Model" (id, "sourceSiteId", title, description, "categoryId", "subCategoryId", tags, "sourceUrl", "thumbnailUrl", "imagesUrl", price, "createdAt", "updatedAt")
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT ("sourceUrl") Do NOTHING
            """,
            (generate_unique_id(), source_site_id, data['title'], data['description'], category_id, subcategory_id, 
             data['tags'],data['source_url'],data['thumbnail_url'], data['image_urls'], data['price'], now, now)
        )
        conn.commit()
    except psycopg2.Error as e:
        print(f"Error adding source site: {e}")
        conn.rollback()


def import_csv(filepath):
    with open(filepath, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            add_model(row)

def main():
    import_csv("../../crawler/thangs/thangs.csv")

main()