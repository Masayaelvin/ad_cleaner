import requests
import json
import os


def random_quote():
    response = requests.get("https://zenquotes.io/api/random")
    data = response.json()
    quote = data[0]['q']
    author = data[0]['a']
    
    def save_quote_to_file(quote_data):
        file_path = "quotes.json"
        if os.path.exists(file_path):
            with open(file_path, "r") as file:
                quotes = json.load(file)
        else:
            quotes = []

        if len(quotes) < 10:
            quotes.append(quote_data)
            with open(file_path, "w") as file:
                json.dump(quotes, file, indent=4)

    def get_cached_quotes():
        file_path = "quotes.json"
        if os.path.exists(file_path):
            with open(file_path, "r") as file:
                quotes = json.load(file)
                if len(quotes) == 10:
                    return quotes
        return None

    cached_quotes = get_cached_quotes()
    if cached_quotes:
        quote_data = cached_quotes.pop(0)
    else:
        quote_data = {"quote": quote, "author": author}
        save_quote_to_file(quote_data)
    
    return {"quote": quote, "author": author}


print(random_quote())

