from playwright.sync_api import sync_playwright
import asyncio
from get_make import get_info
import os
import sys
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.append(project_root)
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from ai_enricher import enrich_data
from src.utils.injection import url_exists_in_db, inject_database

def url_from_id_slug(model_id, slug):
    return f"https://makerworld.com/en/models/{model_id}-{slug}"

def scrape_makerworld(num):
    base_url = "https://makerworld.com/api/v1/search-service/select/design2?orderBy=hotScore&designCreateSince=7&searchSessionId=ux4y8XlWMjWHkUlIQIPhZcjyid09fsqAjHqEvWWfIjeB&entrance=home"
    collected_urls = []
    limit=1
    offset=0
    while len(collected_urls) < num:
        url = f"{base_url}&limit={limit}&offset={offset}"
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False)
            context = browser.new_context()
            page = context.new_page()

            # Intercept and capture the JSON response
            json_data = {}

            def handle_response(response):
                if url in response.url:
                    try:
                        body = response.json()
                        json_data.update(body)
                    except:
                        pass

            page.on("response", handle_response)
            page.goto(url)

            # Wait briefly to ensure response is handled
            page.wait_for_timeout(500)

            if json_data:
                hits = json_data.get("hits", [])
                for item in hits:
                    model_url = url_from_id_slug(item["id"], item["slug"])
                    if model_url and not url_exists_in_db(model_url) and model_url not in collected_urls:
                        collected_urls.append(model_url)
            else:
                print("No JSON data captured.")
                break

            offset += limit
            print(collected_urls, offset, limit)

            browser.close()
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
        merged_info["platform"] = "Makerworld"
        merged_info["thumbnail_url"] = info[3]["image_urls"][0][0]
        merged_info["price"] = "Free"
        res = enrich_data(merged_info)
        if res == None:
            continue
        else:
            inject_database(res)

if __name__ == "__main__":
    results = scrape_makerworld(5)
    asyncio.run(pass_AI(results))