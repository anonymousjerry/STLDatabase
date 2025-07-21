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

            title_el = await page.query_selector('h1.svelte-6cpohy')
            title = await title_el.inner_text() if title_el else "N/A"
            info.append(title.strip())

            description_el = await page.query_selector('div.user-inserted')
            description = await description_el.inner_text() if description_el else "N/A"
            info.append(description.strip())

            more_button_locator = page.locator('.tags-wrapper button.more')
            if await more_button_locator.count() > 0:
                await more_button_locator.scroll_into_view_if_needed()
                await more_button_locator.click()
                await page.wait_for_selector(".tags-wrapper a.badge", timeout=3000)
            else:
                print("More button not found or not visible.")

            tags = await page.query_selector_all('.tags-wrapper a.badge')
            info.append([await tag.inner_text() for tag in tags])

            return info
        except Exception as e:
            return f"Error loading page: {e}"
        finally:
            await browser.close()

if __name__ == "__main__":
    url = 'https://www.printables.com/model/1331354-goalie-stick-knobs'
    result = asyncio.run(get_info(url))
    print(result)