import psycopg2
from cuid import cuid

conn = psycopg2.connect(
    dbname="projectdb",
    user="postgres",
    password="mypassword",
    host="localhost",
    port="5432"
)

cursor = conn.cursor()

def generate_unique_id():
    while True:
        id = cuid()
        cursor.execute(
            """SELECT COUNT(*) FROM "SubCategory" WHERE id = %s""", (id,)
        )
        count = cursor.fetchone()[0]
        if count == 0:
            return id

def get_category_id(category_name):
    cursor.execute(
        """SELECT id FROM "Category" WHERE name = %s""", (category_name,)
    )
    result = cursor.fetchone()
    return result[0] if result else None

def add_subcategory(subcategory_name, category_name):
    try:
        cursor.execute(
            """Insert into "SubCategory" (id, name, "categoryId")
            Values (%s, %s, %s)
            ON CONFLICT (name) DO NOTHING""", (generate_unique_id(), subcategory_name, get_category_id(category_name))
        )
        conn.commit()
    except psycopg2.Error as e:
        print(f"Error adding source site: {e}")
        conn.rollback()

def main():
    subcategories = [
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

    for subcategory in subcategories:
        add_subcategory(subcategory[0], subcategory[1])

main()