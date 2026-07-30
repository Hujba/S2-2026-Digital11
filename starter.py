# The raw passphrase to clean:
raw_phrase = "aP!pL3e#S4aU%cE"
symbols_to_remove = "!#%"
clean_phrase = " "

for char in raw_phrase:
    if char not in symbols_to_remove and not char .isdigit():
        clean_phrase += char

final_code = clean_phrase.upper()
print(f"Decoded Code: {final_code}")        
# YOUR GOAL: Clean up this phrase using the 3 Security Rules below!

