from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
import asyncio
from get_info import get_info
import csv
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from ai_enricher import enrich_data

user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"

group_lists = [
    'model',
    'store'
]

number_lists = [
    134, 40, 138, 136, 135, 2, 137, 12, 16, 14, 15, 41, 77, 78, 81, 80, 18, 20, 42, 25, 27, 26, 28, 100, 140, 43, 88, 99, 89, 52, 51, 95, 50,
    64, 49, 82, 5, 6, 139, 44, 4, 7, 29, 53, 45, 57, 92, 93, 98, 94, 96, 91, 69, 68, 71, 70, 84, 85, 83, 74, 97, 104, 103, 105, 36, 31, 37, 34,
    33, 38, 47, 61, 62, 75, 60
]

async def scrape_printables():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # Set headless=True if you don't want the browser to show
        page = await browser.new_page(
            user_agent=user_agent, 
            viewport={"width": 1280, "height": 800},
            locale="en-US"
        )
        for group in group_lists:
            for number in number_lists:
                model_data = []
                data = []
                results = []
                try:
                    await page.goto(f"https://www.printables.com/{group}?category={number}", timeout=60000, wait_until="domcontentloaded")
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
                    if href and href.startswith("/model/") and "/comments" not in href:
                        model_link = "https://www.printables.com" + href
                    
                    img = a.locator('img').nth(1)
                    img_src = await img.get_attribute("src")

                    model_data.append([model_link, img_src])

                print(f"Found {len(model_data)} model links.")

                for i in range(len(model_data)):
                    merged_info = {}
                    info = await get_info(model_data[i][0])
                    print(info)

                    for item in info:
                        merged_info.update(item)
                    merged_info["source_url"] = model_data[i][0]
                    merged_info["thumbnail_url"] = model_data[i][1]
                    merged_info["platform"] = "Printables"
                    data.append(merged_info)
                
                for d in data:
                    res = enrich_data(d)
                    results.append(res)

                write_csv(results)
            
        await browser.close()
                
        
def write_csv(results):
    filename = 'printables.csv'
    headers = ["platform", "title", "description", "category", "subcategory", "source_url", "thumbnail_url", "tags", "image_urls", "price"]

    file_exists = os.path.isfile(filename) and os.path.getsize(filename) > 0

    with open(filename, "a", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=headers)
        if not file_exists:
            writer.writeheader()
        for row in results:
            complete_row = { key: row.get(key, "") for key in headers}
            writer.writerow(complete_row)


if __name__ == "__main__":
    asyncio.run(scrape_printables())