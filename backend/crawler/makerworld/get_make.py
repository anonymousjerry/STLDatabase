from playwright.async_api import async_playwright
import asyncio
import urllib.parse

async def get_info(url):
    user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"

    info = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=False,
            proxy={
                "server": "http://pool.infatica.io:10000",
                "username": "C0aeX1JZjKzfxgTQDpbG",
                "password": "yl9xbHM8"
            }    
        )  # Set to True to hide the browser
        page = await browser.new_page(user_agent=user_agent, 
            viewport={"width": 1280, "height": 800},
            locale="en-US"
        )

        try:
            await page.goto(url, timeout=60000, wait_until="domcontentloaded")

            await page.wait_for_selector('h1.title-for-share')
            title = await page.locator('h1.title-for-share').inner_text()

            await page.wait_for_selector('span.MuiChip-label')
            tag_elements = await page.query_selector_all('span.MuiChip-label')
            tags = [await tag.inner_text() for tag in tag_elements]

            await page.wait_for_selector('div.rich_text_show')
            # description = (await page.locator('div.rich_text_show').inner_text()).strip()
            description = await page.evaluate("""
                () => {
                    const container = document.querySelector('div.rich_text_show');
                    const stopNode = container.querySelector('.boostmeroot');
                    let result = '';

                    for (const child of container.childNodes) {
                        if (child === stopNode) break;
                        if (child.textContent) {
                            result += child.textContent.trim() + '\\n';
                        }
                    }
                    return result.trim();
                }
            """)

            image_urls = []
            await page.wait_for_selector('div.swiper-wrapper')

            thumb_imgs = await page.query_selector_all('div.swiper-wrapper div.mw-css-mlkcqi img')
            for thumb in thumb_imgs:
                src = await thumb.get_attribute('src')
                if src:
                    parsed = urllib.parse.urlparse(src)
                    decoded_query = urllib.parse.unquote(parsed.query)
                    decoded_query = decoded_query.replace("w_400", "w_1000")
                    new_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}?{decoded_query}"
                    image_urls.append([new_url, src])


            info.append({"title" : title})
            info.append({"description" : description})
            info.append({"tags" : tags})
            info.append({"image_urls" : image_urls})
            # info.append({"price" : price})
            return(info)

        except Exception as e:
            print(f"Error loading page: {e}")
            return None
        finally:
            await browser.close()

if __name__ == "__main__":
    url = 'https://makerworld.com/en/models/1636612-bambu-lab-silica-desiccant-core-dryboxwiry-v2'
    result = asyncio.run(get_info(url))

    print(result)