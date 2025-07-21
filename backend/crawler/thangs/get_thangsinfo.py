from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
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

            await page.wait_for_selector('h1[class^="ModelTitle_Text"]')
            title = await page.locator('h1[class^="ModelTitle_Text"]').inner_text()
            # print(title)

            await page.wait_for_selector('button[test-id="model-page-like-button"] span.Vote_Score')
            likes = await page.locator('button[test-id="model-page-like-button"] span.Vote_Score').inner_text()
            # print(likes)

            await page.wait_for_selector('div.swiper-slide-active img')
            img_url = await page.locator('div.swiper-slide-active img').nth(1).get_attribute('src')
            # print(img_url)

            tag_elements = await page.query_selector_all('span[class^="ModelDetails_TagText"]')
            tags = [await tag_element.inner_text() for tag_element in tag_elements]
            # print(tags)

            info.append(title)
            info.append(likes)
            info.append(tags)
            info.append(img_url)

            return info
        except Exception as e:
            return f"Error loading page: {e}"
        finally:
            await browser.close()

if __name__ == "__main__":
    url = 'https://thangs.com/designer/UR3DCREATER/3d-model/Trump%20Force%20One%20101124.STL-1220281'
    result = asyncio.run(get_info(url))
    print(result)