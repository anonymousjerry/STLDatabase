from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
import asyncio

def get_quality_from_url(url):
    parsed_url = urlparse(url)
    query_params = parse_qs(parsed_url.query)
    quality = query_params.get('q', [None])[0]
    return quality

def update_quality_from_url(url):
    parsed_url = urlparse(url)
    query_params = parse_qs(parsed_url.query)
    quality = query_params.get('q', [None])[0]
    if quality == "75":
        query_params['w'] = [str(3840)]
        query_params['q'] = [str(85)]
    else:
        query_params['w'] = [str(256)]
        query_params['q'] = [str(75)]

    new_query = urlencode(query_params, doseq=True)
    new_url = urlunparse(parsed_url._replace(query=new_query))

    return new_url

def thumbnail_url_from_url(url):
    parsed_url = urlparse(url)
    query_params = parse_qs(parsed_url.query)
    query_params["w"] = [str(640)]
    query_params["q"] = [str(75)]
    new_query = urlencode(query_params, doseq=True)
    new_url = urlunparse(parsed_url._replace(query=new_query))

    return new_url

def get_image_num(text):
    import re
    text = text.strip()
    match = re.search(r'Image\s+\d+\s+of\s+(\d+)', text)
    if match:
        image_num = int(match.group(1))
        return image_num
    else:
        return 1


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

            await page.wait_for_selector('h1[class^="ModelTitle_Text"]')
            title = await page.locator('h1[class^="ModelTitle_Text"]').inner_text()

            description = await page.locator('div.markdown').inner_text()

            locator = page.locator('div[class*="ImageViewer_PageCount"]')

            if await locator.count() > 0:
                text = await locator.nth(1).inner_text()
                image_num = get_image_num(text)
            else:
                image_num = 1
            
            img_urls = []

            if image_num == 1:
                await page.wait_for_selector('div.swiper-slide.swiper-slide-active img')
                img_url = await page.locator('div.swiper-slide.swiper-slide-active img').nth(1).get_attribute('src')
                if get_quality_from_url(img_url) == "75":
                    img_url = await page.locator('div.swiper-slide.swiper-slide-active img').first.get_attribute('src')
                s_img_url = update_quality_from_url(img_url)
                img_urls.append([img_url, s_img_url])
            else:
                thumb_elements = page.locator('img[class*="ModelThumbnail_img"][class*="ModelThumbnail_img_regular"][data-nimg="1"]')
                for i in range(await thumb_elements.count()):
                    img_url = await thumb_elements.nth(i).get_attribute('src')
                    b_img_url = update_quality_from_url(img_url)
                    img_urls.append([b_img_url, img_url])
                print(img_urls)
            
            thumbnail_url = thumbnail_url_from_url(img_urls[0][0])


            tag_elements = await page.query_selector_all('span[class^="ModelDetails_TagText"]')
            tags = [await tag_element.inner_text() for tag_element in tag_elements]
            
            price_type1_el = await page.query_selector('button[class*="SubscribeButton"][class*="Button"][class*="Button__primary"]')
            price_type2_el = await page.query_selector('button[class*="SubscribeButton"][class*="Button"][class*="Button__secondary"]')
            member_el = await page.query_selector('button[class*="SubscribeButton"][class*="Model_ViewPlans"][class*="Button"][class*="Button__primary"]')
            if not member_el:
                price_type1_el = price_type1_el
            else:
                price_type1_el = None
            if price_type1_el or price_type2_el:
                full_price = await page.locator('span[class*="Model_Price"]').nth(1).inner_text()
                price = full_price.replace("USD", "").strip()
            elif member_el:
                price = "Premium"
            else:
                price = "Free"

            info.append({"title" : title})
            info.append({"description" : description})
            info.append({"thumbnail_url" : thumbnail_url})
            info.append({"tags" : tags})
            info.append({"image_urls" : img_urls})
            info.append({"price" : price})

            return info
        except Exception as e:
            return f"Error loading page: {e}"
        finally:
            await browser.close()

if __name__ == "__main__":
    url = 'https://thangs.com/designer/3dprintbunny/3d-model/Ramadan%20String%20Art-1030820'
    result = asyncio.run(get_info(url))
    print(result)