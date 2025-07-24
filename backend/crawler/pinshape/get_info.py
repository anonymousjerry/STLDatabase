from playwright.async_api import async_playwright
import asyncio

async def get_info(url):
    user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"

    info = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # Set to True to hide the browser
        page = await browser.new_page(user_agent=user_agent, 
            viewport={"width": 1280, "height": 800},
            locale="en-US"
        )

        try:
            await page.goto(url, timeout=60000, wait_until="domcontentloaded")
            
            await page.wait_for_selector('h1#design-name')
            title = await page.locator('h1#design-name').inner_text()

            price_locator = page.locator('span.price [itemprop="price"]')
            price_text = await price_locator.inner_text()
            price = price_text.strip()
            if price == "":
                price = "Free"

            paragraphs = await page.locator('div.mh-description p').all_inner_texts()
            # Filter out empty strings and join the rest
            description = " ".join(p.strip() for p in paragraphs if p.strip())

            tag_locator = page.locator('div.tags a.tag')
            tags = await tag_locator.all_inner_texts()
            tags = [tag.strip() for tag in tags if tag.strip()]
            # carousel_locator = page.locator('div.article-image img')
            # carousel_urls = await carousel_locator.evaluate_all(
            #     '(elements) => elements.map(img => img.getAttribute("src"))'
            # )

            # # Optional: prepend "https:" if URLs start with "//"
            # carousel_urls = [f"https:{url}" if url.startswith("//") else url for url in carousel_urls]

            thumbnail_locator = page.locator('div.owl-dot img')
            thumbnail_urls = await thumbnail_locator.evaluate_all(
                '(elements) => elements.map(img => img.getAttribute("src"))'
            )

            # Normalize URLs (prepend "https:" if needed)
            thumbnail_urls = [f"https:{url}" if url.startswith("//") else url for url in thumbnail_urls]

            filtered_thumbnail_urls = [thumbnail_url for thumbnail_url in thumbnail_urls if '/shape_file/' not in thumbnail_url]

            carousel_urls = [
                url.replace('horizontal_thumbnail_', 'container_')
                for url in filtered_thumbnail_urls
            ]

            image_urls = []
            for i in range(len(carousel_urls)):
                image_urls.append([carousel_urls[i], filtered_thumbnail_urls[i]])
            # print(image_urls)

            info.append({"title" : title})
            info.append({"description" : description})
            info.append({"tags" : tags})
            info.append({"image_urls" : image_urls})
            info.append({"price" : price})

            return info
            
        except Exception as e:
            return f"Error loading page: {e}"
        finally:
            await browser.close()

if __name__ == "__main__":
    url = 'https://pinshape.com/items/34605-3d-printed-fully-3d-printed-fidget-spinner'
    result = asyncio.run(get_info(url))

    print(result)
    merged_info = {}
    for item in result:
        merged_info.update(item)
    print(merged_info)