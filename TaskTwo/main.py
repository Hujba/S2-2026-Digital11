from datetime import date
import requests
barcode = 3017624010701
url = f"https://world.openfoodfacts.net/api/v2/product/{barcode}"
headers = {
   "User-Agent": "MyBarcodeApp/1.0 lamhujb01@pedarecc.sa.edu.au"
}
response = requests.get(url, headers=headers)
data = response.json()
product_name=data.get("product", {}).get("product_name", "Product Unknown")
product_type=data.get("product", {}).get("product_type", "Product Unknown")
product_quantity=data.get("product", {}).get("product_quantity", "Product Unknown")
product_quantity_unit=data.get("product", {}).get("product_quantity_unit", "Product Unknown")
ingredients=data.get("product", {}).get("ingredients_text", "Ingredients Unknown")
nutriscore_grade=data.get("product", {}).get("nutriscore_grade", "Nutriscore Unknown")
nutriscore_score=data.get("product", {}).get("nutriscore_score", "Nutriscore Unknown")
origin=data.get("product", {}).get("origins", "Origin Unknown")

def get_recommendation(grade, sugars):
	if grade is not None:
		grade = grade.upper()
		if grade == "A":
			return "Nutri score A: Healthy Choice"
		elif grade == "B":
			return "Nutri score B: Good Choice"
		elif grade == "C":
			return "Nutri score C: Moderate Choice"
		elif grade == "D":
			return "Nutri score D: Less Healthy Choice"
		elif grade == "E":
			return "Nutri score E: Unhealthy Choice"
	if sugars is not None:
		if sugars < 5:
			return "Low sugar content: Healthy Choice"
		elif 5 <= sugars < 10:
			return "Moderate sugar content: Moderate Choice"
		else:
			return "High sugar content: Less Healthy Choice"

def print_menu():
	print("1. View Product Information")
	print("2. Get Recommendation")
	print("3. Exit")

def main():
	while True:
		print_menu()
		choice = input("Enter your choice: ")
		if choice == "1":
			print(f"Product Name: {product_name}")
			print(f"Product Type: {product_type}")
			print(f"Product Quantity: {product_quantity}{product_quantity_unit}")
			print(f"Ingredients: {ingredients}")
			print(f"Nutriscore Grade: {nutriscore_grade}")
			print(f"Nutriscore Score: {nutriscore_score}")
			print(f"Origin: {origin}")
		elif choice == "2":
			recommendation = get_recommendation(nutriscore_grade, data.get("product", {}).get("nutriments", {}).get("sugars_100g"))
			print(f"Recommendation: {recommendation}")
		elif choice == "3":
			print("Exiting the program.")
			break
		else:
			print("Invalid choice. Please try again.")

if __name__ == "__main__":
	main()