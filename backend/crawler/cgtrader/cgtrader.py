from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
import asyncio
from get_cgt import get_info
import os
import sys
import psycopg2
from cuid import cuid
import ast
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.append(project_root)
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from ai_enricher import enrich_data
from src.utils.convertPrice import parse_price_to_value
from datetime import datetime
from psycopg2.extras import Json

user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"

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


async def scrape_cgtrader(category, number):
    found_urls = 0
    collected_urls = []
    for i in range(250):        
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=False,
                proxy={
                    "server": "http://pool.infatica.io:10000",
                    "username": "C0aeX1JZjKzfxgTQDpbG",
                    "password": "yl9xbHM8"
                }
            
            )  # Set headless=True if you don't want the browser to show
            page = await browser.new_page(
                user_agent=user_agent, 
                viewport={"width": 1280, "height": 800},
                locale="en-US"
            )
            # await page.goto(f"https://ipinfo.io/what-is-my-ip", timeout=60000, wait_until="domcontentloaded")
            try:
                await page.goto(f"https://www.cgtrader.com/3d-models/{category}?page={i+1}", timeout=60000, wait_until="domcontentloaded")

                await page.wait_for_selector('div.card-3d-model')
                anchors = await page.locator("div.card-3d-model a.cgt-model-card__link").all()
                for a in anchors:
                    href = await a.get_attribute("href")
                    if href and not url_exists_in_db(href) and href not in collected_urls:
                        collected_urls.append(href)
                        found_urls += 1

                        if len(collected_urls) >= number:
                            print(f"Reached target count: {number}")
                            await browser.close()
                            return collected_urls
                
                if i+1 == 250:
                    print("Reached last page")
                    break

            except PlaywrightTimeoutError:
                print(f"Attempt failed to load: ")
                continue
                    
            await browser.close()
            return collected_urls

async def pass_AI(results): 
    for url in results:
        merged_info = {}
        info = await get_info(url)
        if not info:
            continue

        for item in info:
            if isinstance(item, dict):
                merged_info.update(item)
        merged_info["source_url"] = url
        merged_info["platform"] = "CGTrader"
        res = enrich_data(merged_info)
        if res == None:
            continue
        else:
            inject_database(res)

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

if __name__ == "__main__":
    results = asyncio.run(scrape_cgtrader("aircraft", 5))
    asyncio.run(pass_AI(results))