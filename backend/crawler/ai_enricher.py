import openai
from dotenv import load_dotenv
import os
import json
load_dotenv()
import re
import psycopg2
import httpx, base64

conn = psycopg2.connect(
    dbname="projectdb",
    user="postgres",
    password="mypassword",
    host="localhost",
    port="5432"
)

cur = conn.cursor()

cur.execute("""
        SELECT s.name AS subcategory, c.name AS category
        FROM "SubCategory" s
        JOIN "Category" c ON s."categoryId" = c.id
        ORDER BY category, subcategory
""")

rows = cur.fetchall()

# Build list in required format
categories = [[row[0], row[1]] for row in rows]

openai.api_key = os.getenv("OPENAI_API_KEY")

MAX_DESCRIPTION_LEN = 1000

subcategory_to_category = {sub: cat for sub, cat in categories}
print(subcategory_to_category)

def prepare_thingiverse_image(url: str) -> str:
    resp = httpx.get(url, timeout=30)
    b64_img = base64.b64encode(resp.content).decode("utf-8")
    return f"data:image/jpeg;base64,{b64_img}"

def extract_json_from_response(content):
    # Try to extract JSON block inside triple backticks
    match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", content, re.DOTALL)
    if match:
        return match.group(1)

    # Fallback: try to find first valid-looking JSON object
    match = re.search(r"(\{.*\})", content, re.DOTALL)
    if match:
        return match.group(1)

    return None

def make_description(data):
    prompt = f"""
    Rewrite the following into a simple, enticing product description.
    You may use the title, description, and webpage on Source URL.

    Title: {data['title']}
    Description: {data['description']}
    Source URL: {data['source_url']}

    Respond with the new description text
    """

    response = openai.chat.completions.create(
        model='gpt-4o',
        messages = [{"role": "user", "content": prompt}],
        temperature=0.7
    )

    return response.choices[0].message.content.strip()

def define_subcategory(data, subcategories):
    prompt = f"""
    Choose exactly one subcategory from this list (copy-past exactly, do NOT modify or invent): {subcategories}

    Title: {data['title']}
    Description: {data['description']}

    Respond only with the chosen subcategory(must match exactly one from the list).
    """

    response = openai.chat.completions.create(
        model='gpt-4o',
        messages = [{"role": "user", "content": prompt}],
        temperature=0.7
    )

    return response.choices[0].message.content.strip()

def generate_tags(image_url):
    prompt = f"""
    Generate SEO-friendly tags focused only on the primary 3D object(s) in the image on this URL.
    URL: {image_url}

    Rules:
    - Exclude any environmental or background elements.
    - Tags should describe the object's type, material, shape, brand(if applicable), function and any notable design features relevant to 3D printing
    - Return as a JSON list of strings.
    """

    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": image_url}}  # <-- send image here
            ]}
        ],
        temperature=0.7
    )

    raw = response.choices[0].message.content.strip()

    # --- Clean out markdown code fences if present ---
    if raw.startswith("```"):
        raw = raw.strip("`")               # remove backticks
        raw = raw.replace("json", "", 1)   # remove leading 'json' if it exists
        raw = raw.strip()

    try:
        tags = json.loads(raw)
    except:
        # fallback: split manually
        tags = [t.strip().strip('"').strip("'") for t in raw.replace("[","").replace("]","").split(",") if t.strip()]
    return tags

def enrich_data(data):
    subcategories = list(subcategory_to_category.keys())

    
    new_description = make_description(data)
    subcategory = define_subcategory(data, subcategories)
    if(data['platform'] == "Thingiverse"):
        safe_url = prepare_thingiverse_image(data['image_urls'][0][0])
        print(safe_url)
        tags = generate_tags(safe_url)
    else:
        tags = generate_tags(data['image_urls'][0][0])
    print(new_description)
    print(subcategory)
    print(tags)

    category = subcategory_to_category.get(subcategory, "Other")

    enriched = {
        **data,
        "description" : new_description,
        "category" : category,
        "subcategory" : subcategory,
        "tags" : ",".join(tags)
    }
    return enriched

# enrich_data({
#     "title" : "abc",
#     "description" : "what is that?",
#     "source_url" : "https://thangs.com/designer/DaveMakesStuff/3d-model/Eid%20Gift%20Box-1044794",
#     "tags" : "box, gift"
# })