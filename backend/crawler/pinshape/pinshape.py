from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
import asyncio
from get_info import get_info
import random
import csv
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from ai_enricher import enrich_data

user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"

results = []
data = []

async def scrape_pinshape():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # Set headless=True if you don't want the browser to show
        page = await browser.new_page(
            user_agent=user_agent, 
            viewport={"width": 1280, "height": 800},
            locale="en-US"
        )

        try:
            await page.goto("https://pinshape.com/3d-marketplace", timeout=60000, wait_until="domcontentloaded")
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

        pins = await page.query_selector_all('li.pin')

        urls = []

        for pin in pins:
            try:
                href_el = await pin.query_selector('.pin-link')
                src_el = await pin.query_selector('.pin-image')

                href = await href_el.get_attribute("href")
                src = await src_el.get_attribute("src")

                urls.append(["https://pinshape.com" + href, src])
            except Exception as e:
                print("Error extracting pin data: ", e)
        
        
        # for i in range(len(urls)):
        for i in range(10):
            merged_info = {}
            info = await get_info(urls[i][0])

            for item in info:
                merged_info.update(item)
            merged_info["source_url"] = urls[i][0]
            merged_info["thumbnail_url"] = urls[i][1]
            merged_info["platform"] = "Pinshape"
            print(merged_info)
            data.append(merged_info)
        
        for d in data:
            res = enrich_data(d)
            results.append(res)

        await browser.close()
    write_csv()

def write_csv():
    headers = ["platform", "title", "description", "category", "subcategory", "source_url", "thumbnail_url", "tags", "image_urls", "price"]

    with open("pinshape.csv", "a", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=headers)
        writer.writeheader()
        for row in results:
            complete_row = { key: row.get(key, "") for key in headers}
            writer.writerow(complete_row)

if __name__ == "__main__":
    asyncio.run(scrape_pinshape())