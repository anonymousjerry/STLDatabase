from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
import asyncio
from get_cgt import get_info
import os
import sys
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.append(project_root)
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from ai_enricher import enrich_data
from src.utils.injection import url_exists_in_db, inject_database

user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"

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

if __name__ == "__main__":
    category = sys.argv[1]
    number = int(sys.argv[2])
    results = asyncio.run(scrape_cgtrader(category, number))
    asyncio.run(pass_AI(results))