from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import requests

app = FastAPI()

# Enable CORS (Allow Chrome Extension to Access API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domain in production
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "WELCOME TO YOUR AD CLEANER!"}

@app.get("/random_quote")
def random_quote():
    """Fetch a random quote from ZenQuotes API"""
    try:
        response = requests.get("https://zenquotes.io/api/random")
        response.raise_for_status()  # Raise an error for bad responses (4xx, 5xx)
        data = response.json()
        
        if not data or "q" not in data[0] or "a" not in data[0]:
            raise HTTPException(status_code=500, detail="Invalid response from quote API")

        return {"quote": data[0]['q'], "author": data[0]['a']}
    
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch quote: {str(e)}")

@app.get("/filter_emotion/{keyword}")
def filter_emotion(keyword: str):
    """Fetch a quote related to a specific keyword"""
    try:
        url = f"https://zenquotes.io/api/quotes?keyword={keyword}"
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        if not data or "q" not in data[0] or "a" not in data[0]:
            raise HTTPException(status_code=404, detail="No quotes found for this keyword")

        return {"quote": data[0]['q'], "author": data[0]['a']}
    
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch quote: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
