import re

def parse_price_to_value(price: str | None) -> float | int | None:
    if not price:
        return None

    price = price.strip().lower()

    if price == "free":
        return 0
    if price == "premium":
        return -1

    match = re.search(r"\$?([\d,.]+)", price)
    if match:
        number = float(match.group(1).replace(",", ""))
        # Return as int if it has no decimal part
        return int(number) if number.is_integer() else number

    
    return None

# print(parse_price_to_value("Premium"))