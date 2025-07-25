from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
import asyncio
import random
import os
import csv
from get_thangsinfo import get_info
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from ai_enricher import enrich_data

user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"


List = [["3D Printers", "Anker"], ["3D Printers", "Anycubic"], ["3D Printers", "Bambu Lab"], ["3D Printers", "Cocoa Press"], ["3D Printers", "Creality"], ["3D Printers", "Elegoo"],
        ["3D Printers", "Flashforge"], ["3D Printers", "Generic"], ["3D Printers", "Prusa"], ["3D Printers", "Snapmaker"], ["3D Printers", "Sovol"], ["3D Printers", "Voron & Build Your Own"],
        ["3D Printers", "Other"], ["Articulated", ""], ["Art", "Hueforge"], ["Art", "Low Poly"], ["Art", "Shadow Box"], ["Art", "Sculptures & Statues"], ["Art", "Topographical"], 
        ["Art", "Other"], ["Costumes & Cosplay", "Masks"], ["Costumes & Cosplay", "Outfits"], ["Costumes & Cosplay", "Props"], ["Costumes & Cosplay", "Other"],
        ["Education", "Astronomy"], ["Education", "Biology"], ["Education", "Chemistry"], ["Education", "Math"], ["Education", "Physics"], ["Education", "Other"],
        ["Fashion", "Accessories"], ["Fashion", "Bags & Purses"], ["Fashion", "Clothing"], ["Fashion", "Jewelry"], ["Fashion", "Other"], ["Functional", "Business & Industrial"],
        ["Functional", "Gridfinity"], ["Functional", "Organizers"], ["Functional", "Repairs"], ["Functional", "Tools"], ["Functional", "Other"], ["Gridfinity", "Base"],
        ["Gridfinity", "Bins"], ["Gridfinity", "Other"], ["Health & Fitness", "Accessibility"], ["Health & Fitness", "Sports"], ["Health & Fitness", "Wellness"], ["Health & Fitness", "Other"],
        ["Hobbies", "Automotive"], ["Hobbies", "Electronics & Gadgets"], ["Hobbies", "Music"], ["Hobbies", "Outdoors"], ["Hobbies", "RC"], ["Hobbies", "Robotics"], ["Hobbies", "Sports"],
        ["Hobbies", "Other"], ["Home", "Architecture"], ["Home", "Gardening"], ["Home", "Interior Design"], ["Home", "Home Improvement"], ["Home", "Pets"], ["Home", "Other"],
        ["Miniatures", "Fantasy"], ["Miniatures", "Sci-Fi"], ["Miniatures", "War & Tactics"], ["Miniatures", "Other"], ["Multiboard", ""], ["Pop Culture", "Characters"],
        ["Pop Culture", "Media"], ["Pop Culture", "Memes & Trends"], ["Pop Culture", "People"], ["Pop Culture", "Other"], ["Print In Place", ""], ["Seasonal", "Christmas"],
        ["Seasonal", "Diwali"], ["Seasonal", "Easter"], ["Seasonal", "New Years"], ["Seasonal", "Independence Day"], ["Seasonal", "Halloween"],
        ["Seasonal", "Hanukkah"], ["Seasonal", "Ramadan"], ["Seasonal", "Thanksgiving"], ["Seasonal", "Other"], ["Toys & Games", "Action Figures"],
        ["Toys & Games", "Board Games"], ["Toys & Games", "Building Toys"], ["Toys & Games", "Outdoor Toys"], ["Toys & Games", "Puzzles"],
        ["Toys & Games", "Vehicles"], ["Toys & Games", "Other"]]
async def scrape_thangs():
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
                # await page.goto(f"https://thangs.com/category/{List[i][0]}/{List[i][1]}", timeout=60000, wait_until="domcontentloaded")
                await page.goto("https://thangs.com/category/Seasonal/Ramadan", timeout=60000, wait_until="domcontentloaded")
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

            urls = []
            for anchor in anchors:
                href = await anchor.get_attribute("href")
                if href:
                    urls.append("https://thangs.com" + href)

            print(f"Found {len(urls)} URLs:")

            for url in urls:
                merged_info = {}
                info = await get_info(url)

                for item in info:
                    merged_info.update(item)
                merged_info["source_url"] = url
                merged_info["platform"] = "Thangs"
                data.append(merged_info)

            for d in data:
                res = enrich_data(d)
                result.append(res)
        
            await browser.close()
            write_csv(result)

def write_csv(result):
    headers = ["platform", "title", "description", "category", "subcategory", "source_url", "thumbnail_url", "tags", "image_urls", "price"]

    with open("thangs.csv", "a", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=headers)
        writer.writeheader()
        for row in result:
            complete_row = { key: row.get(key, "") for key in headers}
            writer.writerow(complete_row)

        

if __name__ == "__main__":
    asyncio.run(scrape_thangs())