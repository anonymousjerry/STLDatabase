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
            """SELECT COUNT(*) FROM "Category" WHERE id = %s""", (id,)
        )
        count = cursor.fetchone()[0]
        if count == 0:
            return id

def add_category(name):
    try:
        cursor.execute(
            """Insert into "Category" (id, name)
            Values (%s, %s)
            ON CONFLICT (id) DO NOTHING""", (generate_unique_id(), name)
        )
        conn.commit()
    except psycopg2.Error as e:
        print(f"Error adding source site: {e}")
        conn.rollback()

def main():
    categories = [
        "Toys & Miniatures", "Art & Decorations", "Home & Living", "Tools & Functional Parts", "Tech & Devices", "Fashion & Accessories",
        "Seasonal & Holidays", "Educational & Scientific", "3D Printers & Mods"
    ]

    for category in categories:
        add_category(category)

main()