from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import random
import uvicorn
import requests
import json
from datetime import datetime, timedelta

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to the cache file
CACHE_FILE = "quotes_cache.json"
latest_quote = ""  # Store the latest quote as a dictionary


# Function to read the cache from the file
def read_cache():
    try:
        with open(CACHE_FILE, "r") as file:
            data = json.load(file)
            return data if isinstance(data, list) else []  # Ensure it's always a list
    except (FileNotFoundError, json.JSONDecodeError):
        return []  # Return an empty list instead of None


# Function to write the cache to the file
def write_cache(quote):
    with open(CACHE_FILE, "w") as file:
        json.dump(quote, file, indent=4)


@app.get("/")
def read_root():
    return {"message": "WELCOME TO YOUR AD CLEANER!"}


@app.get("/random_quote")
def random_quote():
    """Fetch a random quote from ZenQuotes API, with caching to a JSON file"""
    cache = read_cache()

    # If cache is available, return a random quote
    if latest_quote != "":
        if cache and datetime.now() - datetime.fromisoformat(latest_quote["timestamp"]) < timedelta(minutes=1):
            QUOTE = random.choice(cache)
            return {"quote": QUOTE["quote"], "author": QUOTE["author"]}
    
    # If cache is invalid or doesn't exist, fetch a new quote
    try:
        
        response = requests.get("https://zenquotes.io/api/random")
        response.raise_for_status()  # Raise an error for bad responses
        data = response.json()

        if not data or "q" not in data[0] or "a" not in data[0]:
            raise HTTPException(status_code=500, detail="Invalid response from quote API")

        # Get the quote and author
        new_quote = {"quote": data[0]['q'], "author": data[0]['a'], "timestamp": datetime.now().isoformat()}
        latest_quote = new_quote
        cache.append(new_quote)

        # Store the new quote in the cache (write it to the JSON file)
        write_cache(cache)  # Store as a list

        return {"quote": new_quote["quote"], "author": new_quote["author"]}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch quote: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
