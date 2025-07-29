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

            try:
                await page.wait_for_selector('div[class*="Layout__errorPage"]', timeout=3000)
                return None
            except:
                pass

            await page.wait_for_selector('h1[title]')
            title = await page.locator('h1[title]').inner_text()

            await page.wait_for_selector('div[class*="DetailDescriptionSummary__detailDescriptionSummary"]')
            description = await page.locator('div[class*="DetailDescriptionSummary__detailDescriptionSummary"]').inner_text()

            try:
                await page.wait_for_selector('div[class*="TagList__tagList"]', timeout=3000)
                tag_elements = page.locator('div[class*="TagList__tagList"] span.button-content')
                tags = await tag_elements.all_inner_texts()
            except:
                tags= []
            

            image_urls = []
            await page.wait_for_selector('li.slide.selected img.mediaItem--image')
            selected_img = page.locator('li.slide.selected img.mediaItem--image')
            await page.wait_for_selector('div[class*="CarouselThumbnails__selected"] img.mediaItem--image')
            selected_thumb = page.locator('div[class*="CarouselThumbnails__selected"] img.mediaItem--image')

            selected_src = await selected_img.get_attribute('src')
            thumb_src = await selected_thumb.get_attribute('src')
            image_urls.append([selected_src, thumb_src])
            info.append({"thumbnail_url" : thumb_src})

            while True:
                try:
                    await page.click('button[aria-label="next slide / item"]')
                    await page.wait_for_timeout(500)
                    await page.wait_for_selector('li.slide.selected img.mediaItem--image')
                    selected_img = page.locator('li.slide.selected img.mediaItem--image')
                    await page.wait_for_selector('div[class*="CarouselThumbnails__selected"] img.mediaItem--image')
                    selected_thumb = page.locator('div[class*="CarouselThumbnails__selected"] img.mediaItem--image')

                    selected_src = await selected_img.get_attribute('src')
                    thumb_src = await selected_thumb.get_attribute('src')
                    image_urls.append([selected_src, thumb_src])
                except:
                    break

            info.append({"title" : title})
            info.append({"description" : description})
            info.append({"tags" : tags})
            info.append({"image_urls" : image_urls})
            info.append({"price" : "Free"})
            return(info)

        except Exception as e:
            print(f"Error loading page: {e}")
            return None
        finally:
            await browser.close()

if __name__ == "__main__":
    url = 'https://www.thingiverse.com/thing:8'
    result = asyncio.run(get_info(url))

    print(result)