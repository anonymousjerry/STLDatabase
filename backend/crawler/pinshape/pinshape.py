from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
import asyncio
from get_info import get_info
import os
import sys
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.append(project_root)
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from ai_enricher import enrich_data
from src.utils.injection import url_exists_in_db, inject_database

user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"

results = []
data = []

async def scrape_pinshape(category_id, num):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # Set headless=True if you don't want the browser to show
        page = await browser.new_page(
            user_agent=user_agent, 
            viewport={"width": 1280, "height": 800},
            locale="en-US"
        )
        pagenum = 1
        collected_urls = []
        while len(collected_urls) < num:
            try:
                await page.goto(f"https://pinshape.com/items?page={pagenum}&category={category_id}", timeout=60000, wait_until="domcontentloaded")
            except PlaywrightTimeoutError:
                print(f"Attempt failed to load: ")

            # Scroll down repeatedly to load more models

            cards = page.locator('div.card-item')
            count = await cards.count()
            
            for i in range(count):
                card = cards.nth(i)

                href_el = card.locator("a.text-decoration-none")
                href = await href_el.first.get_attribute('href')
                img_src_el = card.locator('img.item-image')
                img_src = await img_src_el.get_attribute('src')

                full_href = "https://pinshape.com" + href if href and href.startswith("/") else href
                full_img_src = "https:" + img_src if img_src and img_src.startswith("//") else img_src

                if full_href and not url_exists_in_db(full_href) and full_href not in collected_urls:
                    collected_urls.append(full_href)
                    merged_info = {}
                    info = await get_info(full_href)
                    if not info:
                        continue

                    for item in info:
                        if isinstance(item, dict):
                            merged_info.update(item)
                    merged_info["source_url"] = full_href
                    merged_info["platform"] = "Pinshape"
                    merged_info["thumbnail_url"] = full_img_src
                    res = enrich_data(merged_info)
                    if res == None:
                        continue
                    else:
                        inject_database(res)
                    if len(collected_urls) == num:
                        break
            pagenum += 1

        await browser.close()

if __name__ == "__main__":
    asyncio.run(scrape_pinshape(1, 16))