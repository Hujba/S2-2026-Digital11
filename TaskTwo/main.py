from datetime import date
import requests
barcodes = [3017624010701, 5449000000996, 3033710065967]
headers = {
   "User-Agent": "MyBarcodeApp/1.0 lamhujb01@pedarecc.sa.edu.au"
}

def check_carbohydrates(carbs):
	if carbs is None:
		return "Carbohydrates information not available"
	elif carbs < 100:
		return "Carbohydrates content is less than 100g"
	elif carbs >= 100:
		return "Carbohydrates content is equal 100g or higher"

def get_product(barcode):
	url = f"https://world.openfoodfacts.net/api/v2/product/{barcode}"
	try:
		response = requests.get(url, headers=headers, timeout=10)
		response.raise_for_status()
		return response.json().get("product", {})
	except (requests.RequestException, ValueError):
		return {}

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
	print("1. Current Available Product/ Barcode")
	print("2. Choose Product Information to view")
	print("3. Get Recommendation")
	print("4. Exit")

def main():
	selected_product = None
	while True:
		print_menu()
		choice = input("Enter your choice: ")
		if choice == "1":
			print("Available Barcodes:")
			for barcode in barcodes:
				print(f" - {barcode}")
		elif choice == "2":
			barcode_choice = input("Enter the barcode of the product you want to view: ")
			if str(barcode_choice) not in [str(b) for b in barcodes]:
				print("Invalid barcode. Please choose from the available barcodes.")
				continue
			selected_product = get_product(barcode_choice)
			if not selected_product:
				print("Unable to retrieve product information.")
				continue
			nutriments = selected_product.get("nutriments", {})
			print(f"Product Name: {selected_product.get('product_name', 'Product Unknown')}")
			print(f"Product Type: {selected_product.get('product_type', 'Product Unknown')}")
			print(f"Product Quantity: {selected_product.get('product_quantity', 'Product Unknown')}{selected_product.get('product_quantity_unit', '')}")
			print(f"Ingredients: {selected_product.get('ingredients_text', 'Ingredients Unknown')}")
			print(f"Nutriscore Grade: {selected_product.get('nutriscore_grade', 'Nutriscore Unknown')}")
			print(f"Nutriscore Score: {selected_product.get('nutriscore_score', 'Nutriscore Unknown')}")
			print(f"Origin: {selected_product.get('origins', 'Origin Unknown')}")
			carbohydrates = nutriments.get("carbohydrates_100g")
			print(f"Carbohydrates: {carbohydrates}g")
			print(f"Carbohydrates: {check_carbohydrates(carbohydrates)}")
		elif choice == "3":
			if selected_product is None:
				print("Please view a product first.")
			else:
				recommendation = get_recommendation(selected_product.get("nutriscore_grade"), selected_product.get("nutriments", {}).get("sugars_100g"))
				print(f"Recommendation: {recommendation or 'Recommendation unavailable'}")
		elif choice == "4":
			print("Exiting the program.")
			break
		else:
			print("Invalid choice. Please try again.")
			
if __name__ == "__main__":
	main()