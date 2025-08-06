from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
import asyncio
import random
import os
from get_thangsinfo import get_info
import os
import sys
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.append(project_root)
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from ai_enricher import enrich_data
from src.utils.injection import url_exists_in_db, inject_database

user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"

async def scrape_thangs(category, subcategory, num):
    async with async_playwright() as p:
        
        # for i in range(len(List)):
            data = []
            result = []
            browser = await p.chromium.launch(headless=False)  # Set headless=True if you don't want the browser to show
            page = await browser.new_page(
                user_agent=user_agent, 
                viewport={"width": 1280, "height": 800},
                locale="en-US"
            )

            try:
                await page.goto(f"https://thangs.com/category/{category}/{subcategory}", timeout=60000, wait_until="domcontentloaded")
            except PlaywrightTimeoutError:
                print(f"Attempt failed to load: ")

            # Scroll down repeatedly to load more models
            previous_height = 0
            scroll_count = 0
            while True:
                await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                await page.wait_for_timeout(random.randint(2000, 3000))  # Wait for content to load

                current_height = await page.evaluate("document.body.scrollHeight")
                if current_height == previous_height:
                    break
                previous_height = current_height
                scroll_count += 1
                print(f"Scrolled {scroll_count} times...")

            await page.wait_for_selector('section[class*="ModelCard"][class*="ModelCard_white"] a[href^="/designer/"][href*="/3d-model/"]')
            anchors = await page.locator('section[class*="ModelCard"][class*="ModelCard_white"] a[href^="/designer/"][href*="/3d-model/"]').all()

            collected_urls = []
            while len(collected_urls) < num:
                for anchor in anchors:
                    href = await anchor.get_attribute("href")
                    if href and not url_exists_in_db(href) and href not in collected_urls:
                        collected_urls.append("https://thangs.com" + href)
                        if len(collected_urls) == num:
                            break
                break
            
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
        merged_info["platform"] = "Thangs"
        res = enrich_data(merged_info)
        if res == None:
            continue
        else:
            inject_database(res)

if __name__ == "__main__":
    category = sys.argv[1]
    subCategory = sys.argv[2]
    number = int(sys.argv[3])
    results = asyncio.run(scrape_thangs(category, subCategory, number))
    asyncio.run(pass_AI(results))