from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import random
import uvicorn
import requests
import json
from datetime import datetime, timedelta

app = FastAPI()

# Enable CORS (Allow Chrome Extension to Access API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to the cache file
CACHE_FILE = "../quotes_cache.json"
QUOTES = []

# Function to read the cache from the file
def read_cache():
    try:
        with open(CACHE_FILE, "r") as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return None

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
    
    
    # Check if cache is available and if it's still valid (within 20 minutes)
    if cache and datetime.now() - datetime.fromisoformat(cache["timestamp"]) < timedelta(minutes=20):
        return {"quote": cache["quote"]}

    # If cache is invalid or doesn't exist, fetch a new quote
    try:
        response = requests.get("https://zenquotes.io/api/random")
        response.raise_for_status()  # Raise an error for bad responses (4xx, 5xx)
        data = response.json()

        if not data or "q" not in data[0] or "a" not in data[0]:
            raise HTTPException(status_code=500, detail="Invalid response from quote API")

        # Get the quote and author
        new_quote = data[0]['q']
        author = data[0]['a']
        
                
        # Store the new quote in the cache (write it to the JSON file)
        timestamp = datetime.now().isoformat()  # Save the current timestamp
        write_cache({"quote": new_quote, "author": author, "timestamp": timestamp})

        return {"quote": new_quote, "author": author}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch quote: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
