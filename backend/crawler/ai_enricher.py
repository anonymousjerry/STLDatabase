import openai
from dotenv import load_dotenv
import os
import json
load_dotenv()
import re

openai.api_key = os.getenv("OPENAI_API_KEY")

categories = [
        ["Action Figures", "Toys & Miniatures"], ["Anime", "Toys & Miniatures"], ["Board Game Part", "Toys & Miniatures"],
        ["Educational Toys", "Toys & Miniatures"], ["Fantasy Miniatures", "Toys & Miniatures"], ["Fidget Toys", "Toys & Miniatures"],
        ["Gaming Characters", "Toys & Miniatures"], ["Puzzle Games", "Toys & Miniatures"], ["RC Parts", "Toys & Miniatures"],
        ["Sci-Fi Miniatures", "Toys & Miniatures"], ["Superheroes", "Toys & Miniatures"], ["Tabletop Accessories", "Toys & Miniatures"],
        ["Terrain Scenary", "Toys & Miniatures"], ["Miniature Bases", "Toys & Miniatures"],
        # 14 items 
        ["Abstract Objects", "Art & Decorations"], ["Sculptures", "Art & Decorations"], ["Wall Art", "Art & Decorations"], 
        ["Movie Props", "Art & Decorations"], ["Star Wars", "Art & Decorations"], ["Masks", "Art & Decorations"], 
        ["Musical Instruments", "Art & Decorations"],
        # 7
        ["Bathroom Items", "Home & Living"], ["Bins", "Home & Living"], ["Boxes & Containers", "Home & Living"],
        ["Drawers", "Home & Living"], ["Hooks & Mounts", "Home & Living"], ["Kitchen Tools", "Home & Living"], 
        ["Lamps & Lighting", "Home & Living"], ["Lighting Fixtures", "Home & Living"], ["Pill Organizers", "Home & Living"], 
        ["Plant Pots", "Home & Living"], ["Vases", "Home & Living"], ["Furniture Accessories", "Home & Living"], 
        ["Sports", "Home & Living"],
        # 13
        ["Calibration Tools", "Tools & Functional Parts"], ["Engineering Part", "Tools & Functional Parts"], 
        ["Spinning Tools", "Tools & Functional Parts"], ["Tool Holders", "Tools & Functional Parts"], ["Tools", "Tools & Functional Parts"],
        # 6
        ["Gadgets", "Tech & Devices"], ["Phone Accessories", "Tech & Devices"], ["Photography Gear", "Tech & Devices"],
        ["Exercise Equipment", "Tech & Devices"], ["Wellness Tools", "Tech & Devices"], ["Drones", "Tech & Devices"], 
        # 6
        ["Armor", "Fashion & Accessories"], ["Bags & Purse", "Fashion & Accessories"], ["Bracelets", "Fashion & Accessories"], 
        ["Earrings", "Fashion & Accessories"], ["Helmets", "Fashion & Accessories"],
        ["Necklaces", "Fashion & Accessories"], ["Rings", "Fashion & Accessories"], ["Weapons", "Fashion & Accessories"],
        # 8 
        ["Christmas", "Seasonal & Holidays"], ["Easter", "Seasonal & Holidays"], ["Halloween", "Seasonal & Holidays"], ["New Year", "Seasonal & Holidays"],
        ["Valentine Day", "Seasonal & Holidays"],
        # 5
        ["Classroom Aids", "Educational & Scientific"], ["Geography Models", "Educational & Scientific"], 
        ["Math Models", "Educational & Scientific"], ["Medical Accessories", "Educational & Scientific"], ["Science Tools", "Educational & Scientific"],
        # 5 
        ["FDM Printers", "3D Printers & Mods"], ["Resin Printers", "3D Printers & Mods"], ["Printer Mods", "3D Printers & Mods"]
        #2
]
subcategory_to_category = {sub: cat for sub, cat in categories}

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

MAX_DESCRIPTION_LEN = 1000

def enrich_data(data):
    subcategories = list(subcategory_to_category.keys())

    prompt = f"""
        You are an assistant that enriches 3D model metadata.propert.property
        Given the following input:
        - Title: {data['title']}
        - Desciption: {data['description'][:MAX_DESCRIPTION_LEN]}
        - Source URL: {data['source_url']}

        1. Rewrite description simply and make it enticing product description.
        2. Choose exactly one subcategory from this list (copy-paste, do NOT modify or invent). 
           You must choose exactly one string from this Python list (case-sensitive, no alterations): {subcategories}
           If the subcategory is not in the list, your output will be discarded. So double-check it matches exactly, character for character.
        3. Generate a list of 10~15 relevant tags. Include the original tags: [{data['tags']}]

        Respond in this JSON format:
        {{
            "new_description" : "...",
            "subcategory" : "...",
            "tags" : ["...", "..."]
        }}
    """

    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    raw_content = response.choices[0].message.content
    json_str = extract_json_from_response(raw_content)
    if json_str:
        result = json.loads(json_str)
    else:
        result = None
    subcategory = result['subcategory']
    category = subcategory_to_category.get(subcategory, "Other")

    if result == None:
        return None
    else:
        enriched = {
            **data,
            "description" : result["new_description"],
            "category" : category,
            "subcategory" : subcategory,
            "tags" : ",".join(result["tags"])
        }
        return enriched

# enrich_data({
#     "title" : "abc",
#     "description" : "what is that?",
#     "source_url" : "https://thangs.com/designer/DaveMakesStuff/3d-model/Eid%20Gift%20Box-1044794",
#     "tags" : "box, gift"
# })