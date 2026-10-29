from datetime import date
import requests

barcodes = [3017624010701, 5449000000996, 3033710065967]
headers = {
    "User-Agent": "MyBarcodeApp/1.0 (lamhujb01@pedarecc.sa.edu.au)"
}

def parse_float(val):
    if val is None:
        return None
    try:
        return float(val)
    except (ValueError, TypeError):
        return None

def extract_ingredients(product_data):
    if not product_data:
        return "Ingredients Unknown"

    ingredients_en = product_data.get("ingredients_text_en")
    if ingredients_en:
        return ingredients_en

    ingredients_list = product_data.get("ingredients", [])
    if isinstance(ingredients_list, list) and len(ingredients_list) > 0:
        extracted = [item.get("text") for item in ingredients_list if isinstance(item, dict) and item.get("text")]
        if extracted:
            return ", ".join(extracted)

    return product_data.get("ingredients_text", "Ingredients Unknown")

def check_carbohydrates(carbs):
    carbs = parse_float(carbs)
    if carbs is None:
        return "Carbohydrates information not available"
    elif carbs < 100:
        return "Carbohydrates content is less than 100g"
    else:
        return "Carbohydrates content is equal to 100g or higher"

def get_product(barcode):
    url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}.json"
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        if data.get("status") == 1:
            return data.get("product", {})
        return {}
    except (requests.RequestException, ValueError):
        return {}

def get_recommendation(grade, sugars):
    sugars = parse_float(sugars)
    
    if grade:
        grade = str(grade).upper()
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
            
    return "Recommendation unavailable"

def print_menu():
    print("\n--- Main Menu ---")
    print("1. Current Available Product / Barcode")
    print("2. Choose Product Information to view")
    print("3. Get Recommendation")
    print("4. Exit")

def main():
    selected_product = None
    while True:
        print_menu()
        choice = input("Enter your choice: ").strip()
        if choice == "1":
            print("\nAvailable Barcodes:")
            for barcode in barcodes:
                print(f" - {barcode}")
        elif choice == "2":
            barcode_choice = input("Enter the barcode of the product you want to view: ").strip()
            if not barcode_choice.isdigit():
                print("Invalid barcode. Please enter numbers only.")
                continue
            selected_product = get_product(barcode_choice)
            if not selected_product:
                print("Unable to retrieve product information.")
                continue
            
            nutriments = selected_product.get("nutriments", {})
            ingredients_display = extract_ingredients(selected_product)

            print(f"\nProduct Name: {selected_product.get('product_name', 'Product Unknown')}")
            print(f"Product Type: {selected_product.get('product_type', 'Product Unknown')}")
            print(f"Product Quantity: {selected_product.get('quantity', 'Product Unknown')}")
            print(f"Ingredients: {ingredients_display}")
            print(f"Nutriscore Grade: {selected_product.get('nutriscore_grade', 'Nutriscore Unknown')}")
            print(f"Nutriscore Score: {selected_product.get('nutriscore_score', 'Nutriscore Unknown')}")
            print(f"Origin: {selected_product.get('origins', 'Origin Unknown')}")
            
            carbohydrates = nutriments.get("carbohydrates_100g")
            print(f"Carbohydrates: {carbohydrates}g" if carbohydrates is not None else "Carbohydrates: N/A")
            print(f"Carbohydrates Status: {check_carbohydrates(carbohydrates)}")
        elif choice == "3":
            if selected_product is None:
                print("Please view a product first.")
            else:
                grade = selected_product.get("nutriscore_grade")
                sugars = selected_product.get("nutriments", {}).get("sugars_100g")
                recommendation = get_recommendation(grade, sugars)
                print(f"Recommendation: {recommendation}")
        elif choice == "4":
            print("Exiting the program.")
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()