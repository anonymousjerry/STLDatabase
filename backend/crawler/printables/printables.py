from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
import asyncio
from get_info import get_info
import csv
import os

user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"

For_Crawling_lists = [
    98, 75, 69, 74
]

results = []

async def scrape_printables():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # Set headless=True if you don't want the browser to show
        page = await browser.new_page(
            user_agent=user_agent, 
            viewport={"width": 1280, "height": 800},
            locale="en-US"
        )
        model_data = []
        for crawling_list in For_Crawling_lists:
            try:
                await page.goto(f"https://www.printables.com/model?category={crawling_list}", timeout=60000, wait_until="domcontentloaded")
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
        await browser.close()
            # print(model_data)

        for i in range(len(model_data)):
            result = ["Printables.com"]
            result += await get_info(model_data[i][0])
            result.append(model_data[i][1])
            results.append(result)
            
        print(results)
        
        filename = "models_info.csv"
        file_exists = os.path.isfile(filename)
        headers = ["Platform", "title",  "category", "subcategory", "likes", "downloads", "views", "tags", "thumbnail_url"]

        with open('models_info.csv', mode='a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            if not file_exists:
                writer.writerow(headers)
            writer.writerows(results)


if __name__ == "__main__":
    asyncio.run(scrape_printables())