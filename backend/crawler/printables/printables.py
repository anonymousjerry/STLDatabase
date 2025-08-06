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

group_lists = [
    'model',
    'store'
]

async def scrape_printables(category_id, num):
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
        
        collected_urls = []
        while len(collected_urls) < num:
            for group in group_lists:
                try:
                    await page.goto(f"https://www.printables.com/{group}?category={category_id}", timeout=60000, wait_until="domcontentloaded")
                except PlaywrightTimeoutError:
                    print(f"Attempt failed to load: ")
                # Scroll down repeatedly to load more models
                previous_height = 0
                scroll_count = 0
                while True:
                    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                    await page.wait_for_timeout(5000)  # Wait for content to load

                    current_height = await page.evaluate("document.body.scrollHeight")
                    if current_height == previous_height:
                        break
                    previous_height = current_height
                    scroll_count += 1
                    print(f"Scrolled {scroll_count} times...")
                
                anchors = await page.locator("a.card-image").all()
                for a in anchors:
                    href = await a.get_attribute("href")
                    if href and href.startswith("/model/") and "/comments" not in href and not url_exists_in_db(href) and href not in collected_urls:
                        model_link = "https://www.printables.com" + href
                        collected_urls.append(model_link)
                    
                        img = a.locator('img').nth(1)
                        img_src = await img.get_attribute("src")
                        
                        merged_info = {}
                        info = await get_info(model_link)
                        if not info:
                            continue

                        for item in info:
                            if isinstance(item, dict):
                                merged_info.update(item)
                        merged_info["source_url"] = model_link
                        merged_info["platform"] = "Printables"
                        merged_info["thumbnail_url"] = img_src
                        res = enrich_data(merged_info)
                        if res == None:
                            continue
                        else:
                            inject_database(res)
                        if len(collected_urls) == num:
                            break

                if len(collected_urls) == num:
                    break
            break
        
    await browser.close()
            

if __name__ == "__main__":
    category_id = int(sys.argv[1])
    number = int(sys.argv[2])
    asyncio.run(scrape_printables(category_id, number))