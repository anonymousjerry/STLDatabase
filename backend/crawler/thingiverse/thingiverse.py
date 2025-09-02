from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
import asyncio
from get_thing import get_info
import re
import os
import sys
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.append(project_root)
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from src.utils.injection import inject_database, url_exists_in_db, find_thingiverse_stpoint
from ai_enricher import enrich_data

user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"

async def scrape_thingiverse(num):
    collected_url = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # Set headless=True if you don't want the browser to show
        page = await browser.new_page(
            user_agent=user_agent, 
            viewport={"width": 1280, "height": 800},
            locale="en-US"
        )

        try:
            await page.goto("https://www.thingiverse.com/?page=1&sort=newest", timeout=60000, wait_until="domcontentloaded")
        except PlaywrightTimeoutError:
            print(f"Attempt failed to load: ")
        
        maxId = 0

        await page.wait_for_selector('a[href*="/thing:"]', timeout=10000, state="attached")
        link = await page.query_selector('a[href*="/thing:"]')

        href = await link.get_attribute('href')
        match = re.search(r'thing:(\d+)', href)
        maxId = int(match.group(1))
        print(maxId)

        current = find_thingiverse_stpoint() + 1

        while len(collected_url) < num:
            url = f"https://www.thingiverse.com/thing:{(current)}"
            info = await get_info(url)
            if info is not None:
                merged_info = {}
                for item in info:
                    if isinstance(item, dict):
                        merged_info.update(item)
                merged_info["source_url"] = url
                merged_info["platform"] = "Thingiverse"
                res = enrich_data(merged_info)
                if res == None:
                    continue
                else:
                    await inject_database(res)
                collected_url.append(url)
            current += 1

            if current > maxId:
                print("Reached last modelID")
                break
        
        await browser.close()

if __name__ == "__main__":
    # num = int(sys.argv[1])
    # results = asyncio.run(scrape_thingiverse(num))
    results = asyncio.run(scrape_thingiverse(1))