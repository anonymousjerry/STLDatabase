from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
import asyncio

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

            title_el = await page.query_selector('h1.svelte-6cpohy')
            title = await title_el.inner_text() if title_el else "N/A"
            info.append({"title" : title.strip()})

            description_el = await page.query_selector('div.user-inserted')
            description = await description_el.inner_text() if description_el else "N/A"
            info.append({"description" : description.strip()})

            price_el = await page.query_selector('div.price')
            if price_el:
                price = await price_el.inner_text()
            else:
                price = "Free"
            info.append({"price" : price})
            
            await page.wait_for_selector('ul[id*="splide01"] li.splide__slide img', timeout=5000)
            img_els = await page.query_selector_all('ul[id*="splide01"] li.splide__slide img')
            img_urls = []

            for img in img_els:
                src = await img.get_attribute('src')
                new_src = src.replace("/cover/320x240/", "/inside/1600x1200/")
                img_urls.append([new_src, src])
            info.append({"image_urls" : img_urls})

            try:
                await page.wait_for_selector('button.more', state='visible', timeout=5000)
                await page.click('button.more', force=True)
            except Exception as e:
                print("Button not found!")

            tags = await page.query_selector_all('.tags-wrapper a.badge')
            info.append({"tags" : [await tag.inner_text() for tag in tags]})

            return info
        except Exception as e:
            return f"Error loading page: {e}"
        finally:
            await browser.close()

# if __name__ == "__main__":

#     url = 'https://www.printables.com/model/1351835-moving-single-eye'
#     result = asyncio.run(get_info(url))
#     print(result)