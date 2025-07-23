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
            """SELECT COUNT(*) FROM "SourceSite" WHERE id = %s""", (id,)
        )
        count = cursor.fetchone()[0]
        if count == 0:
            return id

def add_source_site(name, url):
    try:
        cursor.execute(
            """Insert into "SourceSite" (id, name, url)
            Values (%s, %s, %s)
            ON CONFLICT (url) DO NOTHING""", (generate_unique_id(), name, url)
        )
        conn.commit()
    except psycopg2.Error as e:
        print(f"Error adding source site: {e}")
        conn.rollback()

def main():
    source_sites = [
        ("Printables", "https://www.printables.com"),
        ("Thingiverse", "https://www.thingiverse.com"),
        ("Thangs", "https://www.thangs.com"),
        ("Makerworld", "https://www.makerworld.com"),
        ("Pinshpe", "https://pinshape.com/"),
        ("cgtrader", "https://www.cgtrader.com/"),
        ("MyMiniFactory", "https://www.myminifactory.com"),
        ("Cults3D", "https://cults3d.com"),
        ("YouMagine", "https://www.youmagine.com")
    ]

    for source_site in source_sites:
        add_source_site(source_site[0], source_site[1])

main()