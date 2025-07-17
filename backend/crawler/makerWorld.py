from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
import asyncio
import random
import os
import csv
from get_makerinfo import get_info

user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"

results = []

async def scrape_makerworld():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # Set headless=True if you don't want the browser to show
        page = await browser.new_page(
            user_agent=user_agent, 
            viewport={"width": 1280, "height": 800},
            locale="en-US"
        )

        try:
            await page.goto("https://thangs.com/category/3D%20Printers/Anker", timeout=60000, wait_until="domcontentloaded")
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

        await page.wait_for_selector('[data-testid="3d-printers-nav-link"]')
        category = await page.locator('[data-testid="3d-printers-nav-link"]').nth(1).inner_text()

        await page.wait_for_selector('a[class*="CategoryNav_Link_active"]')
        subcategory = await page.locator('a[class*="CategoryNav_Link_active"]').nth(1).inner_text()

        await page.wait_for_selector('a[href^="/designer/"][href*="/3d-model/"]')
        anchors = await page.locator('a[href^="/designer/"][href*="/3d-model/"]').all()

        urls = []
        for anchor in anchors:
            href = await anchor.get_attribute("href")
            if href:
                urls.append("https://thangs.com" + href)

        print(f"Found {len(urls)} URLs:")
        for i in range(2):
            result = ["thangs.com", category, subcategory]
            result += await get_info(urls[i])
            results.append(result)

        
        filename = "thangs_models.csv"
        file_exists = os.path.isfile(filename)
        headers = ["Platform",  "category", "subcategory", "title", "likes", "tags", "thumbnail_url"]

        with open('thangs_models.csv', mode='a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            if not file_exists:
                writer.writerow(headers)
            writer.writerows(results)

        print(len(anchors))
        await browser.close()

        

if __name__ == "__main__":
    asyncio.run(scrape_makerworld())