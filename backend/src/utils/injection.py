import psycopg2
from cuid import cuid
from datetime import datetime
from psycopg2.extras import Json
import ast
from .convertPrice import parse_price_to_value

conn = psycopg2.connect(
    dbname="projectdb",
    user="postgres",
    password="mypassword",
    host="localhost",
    port="5432"
)

cursor = conn.cursor()

def url_exists_in_db(href):
    query = 'SELECT 1 FROM "Model" WHERE "sourceUrl" = %s'
    cursor.execute(query, (href,))
    result = cursor.fetchone()
    return result is not None

def find_thingiverse_stpoint():
    cursor.execute('SELECT id FROM "SourceSite" WHERE name = %s', ("Thingiverse",))
    source_site_id = cursor.fetchone()[0]
    cursor.execute("""
        SELECT MAX(CAST(SUBSTRING("sourceUrl" FROM 'thing:(\\d+)$') AS INTEGER))
        FROM "Model"
        WHERE "sourceSiteId" = %s AND "sourceUrl" LIKE '%%thingiverse.com/thing:%%'
    """, (source_site_id,))
    
    max_id = cursor.fetchone()[0]
    return max_id if max_id is not None else 0


def generate_unique_id():
    while True:
        id = cuid()
        cursor.execute(
            """SELECT COUNT(*) FROM "Model" WHERE id = %s""", (id,)
        )
        if cursor.fetchone()[0] == 0:
            return id

def inject_database(data):
    now = datetime.utcnow()
    try:
        cursor.execute('SELECT id FROM "SourceSite" WHERE name = %s', (data['platform'],))
        source_site_id = cursor.fetchone()[0]
        cursor.execute('SELECT id FROM "Category" WHERE name=%s', (data['category'],))
        category_id = cursor.fetchone()[0]
        if data['category'] == 'Other':
            cursor.execute('SELECT id FROM "SubCategory" WHERE name=%s', ("Other",))
            subcategory_id = cursor.fetchone()[0]
        else:
            cursor.execute('SELECT id FROM "SubCategory" WHERE name=%s', (data['subcategory'],))
            subcategory_id = cursor.fetchone()[0]
        data['tags'] = [tag.strip() for tag in data['tags'].split(',')]
        if isinstance(data['image_urls'], str):
            data['image_urls'] = ast.literal_eval(data['image_urls'])
        cursor.execute(
            """INSERT INTO "Model" (id, "sourceSiteId", title, description, "categoryId", "subCategoryId", tags, "sourceUrl", "thumbnailUrl", "imagesUrl", price, "priceValue", "createdAt", "updatedAt")
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT ("sourceUrl") Do NOTHING
            """,
            (generate_unique_id(), source_site_id, data['title'], data['description'], category_id, subcategory_id, 
            data['tags'],data['source_url'],data['thumbnail_url'], Json(data['image_urls']), data['price'],  parse_price_to_value(data['price']),now, now)
        )
        conn.commit()
    except psycopg2.Error as e:
        print(f"Error adding source site: {e}")
        conn.rollback()