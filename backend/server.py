from flask import Flask, jsonify
from flask_cors import CORS
import random
import requests
import json
from datetime import datetime, timedelta

app = Flask(__name__)

# Enable CORS
CORS(app)

# Path to the cache file
CACHE_FILE = "quotes_cache.json"

# Function to read the cache from the file
def read_cache():
    try:
        with open(CACHE_FILE, "r") as file:
            data = json.load(file)
            return data if isinstance(data, list) else []  # Ensure it's always a list
    except (FileNotFoundError, json.JSONDecodeError):
        return []  # Return an empty list instead of None

# Function to write the cache to the file
def write_cache(quotes):
    with open(CACHE_FILE, "w") as file:
        json.dump(quotes, file, indent=4)

@app.route("/", methods=["GET"])
def read_root():
    return jsonify({"message": "WELCOME TO YOUR AD CLEANER!"})

@app.route("/random_quote", methods=["GET"])
def random_quote():
    """Fetch a random quote from ZenQuotes API, with caching to a JSON file"""
    global latest_quote  # Declare latest_quote as global to modify it inside function

    cache = read_cache()
    
    if cache:
        latest_quote = cache[-1]
        now = datetime.now()
        last_api_call = datetime.fromisoformat(latest_quote["timestamp"])

        # Use cached quote if available and recent
        if (now - last_api_call) < timedelta(minutes=240):
            print("The most recent quote is", latest_quote)
            print(f"Time difference is {now - last_api_call}. You must wait to get a new quote.")
            print("Fetching random data from the cache")
            res = random.choice(cache)
            return jsonify({"quote": res["quote"], "author": res["author"]})

    # Fetch a new quote if cache is empty or outdated
    try:
        response = requests.get("https://zenquotes.io/api/random")
        response.raise_for_status()  # Raise an error for bad responses
        data = response.json()

        if not data or not isinstance(data, list) or "q" not in data[0] or "a" not in data[0]:
            return jsonify({"error": "Invalid response from quote API"}), 500

        # Get the quote and author
        new_quote = {
            "quote": data[0]['q'],
            "author": data[0]['a'],
            "timestamp": datetime.now().isoformat()
        }
        latest_quote = new_quote
        cache.append(new_quote)

        # Store the new quote in the cache
        write_cache(cache)  # Store as a list

        return jsonify({"quote": new_quote["quote"], "author": new_quote["author"]})

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to fetch quote: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
