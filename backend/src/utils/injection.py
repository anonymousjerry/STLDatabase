import psycopg2
from cuid import cuid
from datetime import datetime
from psycopg2.extras import Json
import ast
import httpx
import boto3
import asyncio
import os
from .convertPrice import parse_price_to_value
from dotenv import load_dotenv

load_dotenv()

aws_key_id = os.getenv("keyID")
aws_secret_key = os.getenv("applicationKey")
base_url = "https://img.3ddatabase.com/file/3ddatabase/"

s3 = boto3.client(
    service_name = 's3',
    endpoint_url='https://s3.us-west-004.backblazeb2.com',
    aws_access_key_id=aws_key_id,
    aws_secret_access_key=aws_secret_key
)


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

async def transfer_image_to_backblaze(image_url, bucket_name, key_path):
    async with httpx.AsyncClient() as client:
        response = await client.get(image_url)
        response.raise_for_status()
        print(response)
        await asyncio.to_thread(
            s3.put_object,
            Bucket = bucket_name,
            Key = key_path.lstrip('/'),
            Body = response.content,
            ACL = 'public-read',
            ContentType = response.headers.get("Content-Type", "image/jpeg")
        )


def generate_unique_id():
    while True:
        id = cuid()
        cursor.execute(
            """SELECT COUNT(*) FROM "Model" WHERE id = %s""", (id,)
        )
        if cursor.fetchone()[0] == 0:
            return id

def format(text):
    result = text.replace(" ", "_")
    return result

async def inject_database(data):
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
        model_id = generate_unique_id()
        key_path = data['platform'] + f"/{model_id}/thumb/" + format(data['title']) + "_" + data['tags'][0] + ".png"
        full_path = base_url + key_path
        await transfer_image_to_backblaze(data['thumbnail_url'], '3ddatabase', key_path)
        image_urls = []
        for i in range(len(data['image_urls'])):
            big_path = data['platform'] + f"/{model_id}/carousel/big/{i+1}/" + format(data['title']) + "_" + data['tags'][0] + ".png"
            small_path = data['platform'] + f"/{model_id}/carousel/small/{i+1}/" + format(data['title']) + "_" + data['tags'][0] + ".png"
            await transfer_image_to_backblaze(data['image_urls'][i][0], '3ddatabase', big_path)
            await transfer_image_to_backblaze(data['image_urls'][i][1], '3ddatabase', small_path)
            full_big_path = base_url + big_path
            full_small_path = base_url + small_path
            image_urls.append([full_big_path, full_small_path])

        cursor.execute(
            """INSERT INTO "Model" (id, "sourceSiteId", title, description, "categoryId", "subCategoryId", tags, "sourceUrl", "thumbnailUrl", "imagesUrl", price, "priceValue", "createdAt", "updatedAt")
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT ("sourceUrl") Do NOTHING
            """,
            (model_id, source_site_id, data['title'], data['description'], category_id, subcategory_id, 
            data['tags'],data['source_url'],full_path, Json(image_urls), data['price'],  parse_price_to_value(data['price']),now, now)
        )
        conn.commit()
    except psycopg2.Error as e:
        print(f"Error adding source site: {e}")
        conn.rollback()