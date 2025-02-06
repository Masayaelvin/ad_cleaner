console.log("Ad Cleaner Extension Content Script Loaded!");

// Function to find and remove ads
function removeAds() {
  const adSelectors = [
    "iframe", // Most ads are iframes
    '[id*="ad"]:not(body):not(html)', // Ignore entire page removal
    '[class*="ad"]:not(body):not(html)',
    "[data-ad-slot]", // Google Ads
    '[aria-label="Ads"]',
  ];

  adSelectors.forEach((selector) => {
    let ads = document.querySelectorAll(selector);
    ads.forEach((ad) => {
      // Ignore large containers (to avoid removing entire pages)
      let rect = ad.getBoundingClientRect();
      if (rect.width < 800 && rect.height < 600) {
        ad.style.display = "none";
        console.log("Removed Ad:", ad);
      }
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
      "iframe", // Most ads are iframes
      '[id*="ad"]:not(body):not(html)', // Ignore entire page removal
      '[class*="ad"]:not(body):not(html)',
      "[data-ad-slot]", // Google Ads
      '[aria-label="Ads"]',
    ];

    adSelectors.forEach((selector) => {
      let ads = document.querySelectorAll(selector);
      ads.forEach((ad) => {
        // Get ad's current styles
        let adStyle = window.getComputedStyle(ad);
        let width = adStyle.width;
        let height = adStyle.height;
        let display = adStyle.display;
        let margin = adStyle.margin;
        let padding = adStyle.padding;
        let border = adStyle.border;
        let position = adStyle.position;

        // Create the replacement element
        let quoteElement = document.createElement("div");
        quoteElement.innerText = quoteText;
        quoteElement.classList.add("quote-box");

        // Apply styles to match the ad
        quoteElement.style.width = width;
        quoteElement.style.height = height;
        quoteElement.style.display = display;
        quoteElement.style.margin = margin;
        quoteElement.style.padding = padding;
        quoteElement.style.border = border;
        quoteElement.style.position = position;

        // Set text to center
        quoteElement.style.display = "flex";
        quoteElement.style.alignItems = "center";
        quoteElement.style.justifyContent = "center";
        quoteElement.style.textAlign = "center";

        // Replace ad with quote
        ad.replaceWith(quoteElement);
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

console.log("Ad Cleaner Extension Content Script Loaded!");

function hideBlockedAds() {
  let blockedAds = JSON.parse(localStorage.getItem("blockedAds")) || [];
  blockedAds.forEach((selector) => {
    let elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      el.style.display = "none";
    });
  });
}

// Run when the page loads
hideBlockedAds();

