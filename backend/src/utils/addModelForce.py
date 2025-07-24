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


def main():
    add_model({
        'platform': 'Makerworld', 
        'title': "Ejection tray for P1S/P1P", 
        'description': "Ejection tray for P1S/P1P- TPU Lid is a must-have Ramadan-themed toy! This playful item offers the perfect blend of tradition and fun. Crafted with precision, this model can be adjusted to fit different clicker dimensions. It's not just a toy, but a celebration of Ramadan in a unique and interactive way. Plus, you can enjoy the full CAD modelling session on YouTube and get all the assistance you need to print it perfectly.", 
        'category': 'Toys & Miniatures', 
        'subcategory': 'Fidget Toys', 
        'source_url': 'https://makerworld.com/en/models/1626235-ejection-tray-for-p1s-p1p#profileId-1717074', 
        'thumbnail_url': '	https://makerworld.bblmw.com/makerworld/model/US5b…jpg?x-oss-process=image/resize,w_1000/format,webp', 
        'tags': 'breath-of-the-wild,overwatch,tortoise,overwatch,sniper,assault,Interactive Toy,Customizable,Holiday Toy,Religious,Unique,Fun,Adjustable,YouTube Tutorial,3MF File', 
        'image_urls': "[['https://thangs.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fproduction-thangs-public%2Fuploads%2Fattachments%2F590f276f-b440-46fd-8ba2-fa9eca47212b%2FPXL_20250126_152744524.jpg&w=3840&q=85', 'https://thangs.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fproduction-thangs-public%2Fuploads%2Fattachments%2F590f276f-b440-46fd-8ba2-fa9eca47212b%2FPXL_20250126_152744524.jpg&w=256&q=75'], ['https://thangs.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fproduction-thangs-public%2Fuploads%2Fattachments%2F3ad4f15c-a27e-4503-9c61-b0aeb818e709%2FPXL_20250126_152806424.jpg&w=3840&q=85', 'https://thangs.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fproduction-thangs-public%2Fuploads%2Fattachments%2F3ad4f15c-a27e-4503-9c61-b0aeb818e709%2FPXL_20250126_152806424.jpg&w=256&q=75'], ['https://thangs.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fthangs-thumbnails%2Fproduction%2Fa4e12174-3894-4168-ab72-62a9e2f61c21%2FFFC-R15.png&w=3840&q=85', 'https://thangs.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fthangs-thumbnails%2Fproduction%2Fa4e12174-3894-4168-ab72-62a9e2f61c21%2FFFC-R15.png&w=256&q=75']]", 	
        'price': 'Free'
    })

main()