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

            await page.wait_for_selector('span[itemprop="item"] span[itemprop="name"]')
            title = await page.locator('span[itemprop="item"] span[itemprop="name"]').inner_text()

            await page.wait_for_selector('.product-description')

            tags = []
            tag_els = await page.query_selector_all('.tags-list .labels-list .label')
            for el in tag_els:
                text = await el.evaluate('(el) => el.childNodes[0]?.textContent.trim()')
                if not text:
                    a = await el.query_selector('a:not(.js-remove-tag)')
                    if a:
                        text = await a.text_content()
                        text = text.strip()
                        if text:
                            tags.append(text)
                else:
                    tags.append(text)
            
            await page.eval_on_selector('.product-description .tags-list', 'el => el.remove()')
            description_text = await page.text_content('.product-description')
            full_description = description_text.strip()
            description = full_description.replace("Description", "", 1).strip()

            elements = await page.query_selector_all('#product-price-final')
            first_el = elements[0]
            price = await first_el.text_content()

            image_urls = []
            thumb_els = await page.query_selector_all('.thumb-list-wrapper img')
            for el in thumb_els:
                main_src = await el.get_attribute('data-src')
                thumb_src = await el.get_attribute('data-thumb-src')
                if main_src and main_src.startswith("https://img-new.cgtrader.com/items/"):
                    image_urls.append([main_src, thumb_src])

            info.append({"title" : title})
            info.append({"description" : description})
            info.append({"tags" : tags})
            info.append({"image_urls" : image_urls})
            info.append({"price" : price})
            return(info)

        except Exception as e:
            print(f"Error loading page: {e}")
            return None
        finally:
            await browser.close()

if __name__ == "__main__":
    url = 'https://www.cgtrader.com/3d-models/aircraft/commercial-aircraft/boeing-737-800-turkish-airlines-high-detailed'
    result = asyncio.run(get_info(url))

    print(result)