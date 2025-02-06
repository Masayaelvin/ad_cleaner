console.log("Ad Cleaner Extension Content Script Loaded!");

// Function to find and remove ads
function removeAds() {
    const adSelectors = [
        'iframe',  // Most ads are in iframes
        '[id*="ad"]',  // Elements with "ad" in the ID
        '[class*="ad"]',  // Elements with "ad" in the class
        '[data-ad-slot]', // Google AdSense ads
        '[aria-label="Ads"]' // Some accessible ads
    ];

    adSelectors.forEach(selector => {
        let ads = document.querySelectorAll(selector);
        ads.forEach(ad => {
            ad.style.display = "none"; // Hide the ad
            console.log("Removed Ad: ", ad);
        });
    });
}

// Function to replace ads with a quote from the API
async function replaceAdsWithQuote() {
    try {
        let response = await fetch("http://127.0.0.1:8000/random_quote"); // Fetch quote from FastAPI
        let data = await response.json();

        let quoteText = `"${data.quote}" - ${data.author}`;

        const adSelectors = [
            'iframe', '[id*="ad"]', '[class*="ad"]', '[data-ad-slot]', '[aria-label="Ads"]'
        ];

        adSelectors.forEach(selector => {
            let ads = document.querySelectorAll(selector);
            ads.forEach(ad => {
                let quoteElement = document.createElement("div");
                quoteElement.innerText = quoteText;
                quoteElement.style.cssText = `
                    background: #f9f9f9; 
                    border-left: 4px solid #4CAF50;
                    padding: 10px;
                    font-size: 16px;
                    font-family: Arial, sans-serif;
                    color: #333;
                    margin: 10px 0;
                `;
                
                ad.parentNode.replaceChild(quoteElement, ad); // Replace ad with quote
                console.log("Replaced Ad with Quote:", quoteElement);
            });
        });
    } catch (error) {
        console.error("Error fetching quote:", error);
    }
}

// Run the functions when the page loads
removeAds();
replaceAdsWithQuote();

// Run again when the user scrolls (to catch dynamically loaded ads)
window.addEventListener("scroll", () => {
    removeAds();
    replaceAdsWithQuote();
});
