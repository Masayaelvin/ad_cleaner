console.log("Ad Cleaner Extension Content Script Loaded!");

// Listen for toggle updates from popup.js
window.addEventListener("message", (event) => {
  if (event.data.type === "UPDATE_TOTAL_SILENCE") {
    chrome.storage.sync.set({ totalSilence: event.data.value });
    applyAdBlockingMode();
  }
});

// Function to completely remove all ads (Total Silence Mode)
function removeAllAds() {
  const adSelectors = [
    'iframe[src*="google.com"]',
    'iframe[src*="doubleclick.net"]',
    "[data-ad-client]",
    "[data-ad-slot]",
    ".adsbygoogle",
    'div[id^="google_ads_"]',
    "ins.adsbygoogle",
    'iframe[src*="adservice.google.com"]',
    'iframe[src*="adsystem.com"]',
    'iframe[src*="ad"]',
    'ins[class*="ad"]',
  ];

  adSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((ad) => {
      ad.remove(); // Completely remove ad elements
      console.log("Removed Ad:", ad);
    });
  });
}

// Function to hide ads (Default Mode - Hide but do not remove completely)
function removeAds() {
  const adSelectors = [
    'iframe[src*="google.com"]',
    'iframe[src*="doubleclick.net"]',
    "[data-ad-client]",
    "[data-ad-slot]",
    ".adsbygoogle",
    'div[id^="google_ads_"]',
    "ins.adsbygoogle",
    'iframe[src*="adservice.google.com"]',
    'iframe[src*="adsystem.com"]',
    'iframe[src*="ad"]',
    'ins[class*="ad"]',
  ];

  adSelectors.forEach((selector) => {
    let ads = document.querySelectorAll(selector);
    ads.forEach((ad) => {
      // Avoid removing large sections
      let rect = ad.getBoundingClientRect();
      if (rect.width < 800 && rect.height < 600) {
        ad.style.display = "none";
        console.log("Hid Ad:", ad);
      }
    });
  });
}

// Function to replace ads with a quote from the API
async function replaceAdsWithQuote() {
  try {
    let response = await fetch("https://backend.jaliwafreshexportersltd.co.ke/random_quote"); // Fetch quote from FastAPI
    let data = await response.json();
    let quoteText = `"${data.quote}" - ${data.author}`;

    const adSelectors = [
      'iframe[src*="google.com"]',
      'iframe[src*="doubleclick.net"]',
      "[data-ad-client]",
      "[data-ad-slot]",
      ".adsbygoogle",
      'div[id^="google_ads_"]',
      "ins.adsbygoogle",
      'iframe[src*="adservice.google.com"]',
      'iframe[src*="adsystem.com"]',
      'iframe[src*="ad"]',
      'ins[class*="ad"]',
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

        // Center text
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

// Function to apply the correct ad-blocking mode based on toggle state
function applyAdBlockingMode() {
  chrome.storage.sync.get("totalSilence", (data) => {
    if (data.totalSilence) {
      console.log("Total Silence Mode Activated: Removing All Ads");
      removeAllAds();
    } else {
      console.log("Quote Replacement Mode Activated");
      removeAds();
      replaceAdsWithQuote();
    }
  });
}

// Monitor page for dynamically loaded ads
function observeAds() {
  const observer = new MutationObserver(() => {
    applyAdBlockingMode(); // Re-run blocking based on mode
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Run the function on page load
applyAdBlockingMode();
observeAds();

// Function to hide manually blocked ads
function hideBlockedAds() {
  let blockedAds = JSON.parse(localStorage.getItem("blockedAds")) || [];
  blockedAds.forEach((selector) => {
    let elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      el.style.display = "none";
    });
  });
}

// Run manually blocked ad removal when page loads
hideBlockedAds();

console.log("Ad Cleaner Extension Content Script Fully Loaded!");
