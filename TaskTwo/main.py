import requests
barcode = input("Barcode")
url = f"https://world.openfoodfacts.net/api/v2/product/{barcode}"
response = requests.get(url)
# print(response.json())
data = response.json()
product_name=data.get("product", {}).get("product_name", "Product Unknown")
product_type=data.get("product", {}).get("product_type", "Product Unknown")
product_quantity=data.get("product", {}).get("product_quantity", "Product Unknown")
product_quantity_unit=data.get("product", {}).get("product_quantity_unit", "Product Unknown")
ingredients=data.get("product", {}).get("ingredients_text", "Ingredients Unknown")

def print_menu():
	print("1. View Product Information")
	print("2. Exit")

def main():
	while True:
		print_menu()
		choice = input("Enter your choice: ")
		if choice == "1":
			print(f"Product Name: {product_name}")
			print(f"Product Type: {product_type}")
			print(f"Product Quantity: {product_quantity}{product_quantity_unit}")
			print(f"Ingredients: {ingredients}")
		elif choice == "2":
			print("Exiting the program.")
			break
		else:
			print("Invalid choice. Please try again.")

main()
