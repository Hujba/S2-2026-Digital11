import requests
barcode = input("Barcode")
url = f"https://world.openfoodfacts.net/api/v2/product/{barcode}"
response = requests.get(url)
# print(response.json())

data = response.json()

product_name=data.get("product", {}).get("product_name", "Product Unknown")
print(f"Product Name: {product_name}")

product_type=data.get("product", {}).get("product_type", "Product Unknown")
print(f"Product Type: {product_type}")

product_quantity=data.get("product", {}).get("product_quantity", "Product Unknown")
product_quantity_unit=data.get("product", {}).get("product_quantity_unit", "Product Unknown")
print(f"Product Quantity: {product_quantity}{product_quantity_unit}")

ingredients=data.get("product", {}).get("ingredients_text", "Ingredients Unknown")
print(f"Ingredients: {ingredients}")