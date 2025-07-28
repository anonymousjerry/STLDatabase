from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
import asyncio
from get_thing import get_info
import re
import random
import csv
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from ai_enricher import enrich_data

user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"

async def scrape_thingiverse():
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

        await page.wait_for_selector('a[href*="/thing:"]', timeout=5000, state="attached")
        link = await page.query_selector('a[href*="/thing:"]')

        href = await link.get_attribute('href')
        match = re.search(r'thing:(\d+)', href)
        maxId = int(match.group(1))
        print(maxId)
        #for i in range(maxId):
        for i in range(10):
            url = f"https://www.thingiverse.com/thing:{(i+1)}"
            try:
                merged_info = {}
                info = await get_info(url)
                if info != None:
                    for item in info:
                        merged_info.update(item)

                    merged_info["source_url"] = url
                    merged_info["platform"] = "Thingiverse"
                    result = enrich_data(merged_info)
                    write_csv(result)
            except Exception as e:
                print(e)
               

        await browser.close()

def write_csv(row):
    filename = "thingiverse.csv"
    headers = ["platform", "title", "description", "category", "subcategory", "source_url", "thumbnail_url", "tags", "image_urls", "price"]
    file_exists = os.path.isfile(filename) and os.path.getsize(filename) > 0
    with open(filename, "a", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=headers)
        if not file_exists:
            writer.writeheader()
        complete_row = { key: row.get(key, "") for key in headers}
        writer.writerow(complete_row)

if __name__ == "__main__":
    asyncio.run(scrape_thingiverse())