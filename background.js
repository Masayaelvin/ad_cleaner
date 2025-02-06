chrome.runtime.onInstalled.addListener(() => {
  // Add "Block this ad" option
  chrome.contextMenus.create({
    id: "blockAd",
    title: "Block this ad",
    contexts: ["all"],
  });

  // Add "Unblock Last Ad" option
  chrome.contextMenus.create({
    id: "unblockAd",
    title: "Unblock last ad",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "blockAd") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: manuallyBlockAd,
    });
  } else if (info.menuItemId === "unblockAd") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: unblockLastAd,
    });
  }
});

function manuallyBlockAd() {
  document.addEventListener(
    "click",
    function (event) {
      let element = event.target;

      let blockedAds = JSON.parse(localStorage.getItem("blockedAds")) || [];
      let selector = getElementSelector(element);

      if (!blockedAds.includes(selector)) {
        blockedAds.push(selector);
        localStorage.setItem("blockedAds", JSON.stringify(blockedAds));
      }

      // Hide the ad
      element.style.display = "none";

      alert("Ad blocked!");
    },
    { once: true }
  );
}

function unblockLastAd() {
  let blockedAds = JSON.parse(localStorage.getItem("blockedAds")) || [];

  if (blockedAds.length === 0) {
    alert("No ads to unblock.");
    return;
  }

  let lastBlockedSelector = blockedAds.pop(); // Remove the last blocked ad
  localStorage.setItem("blockedAds", JSON.stringify(blockedAds)); // Save updated list

  let element = document.querySelector(lastBlockedSelector);
  if (element) {
    element.style.display = ""; // Restore the original display
    alert("Ad unblocked!");
  } else {
    alert("Ad not found. It may no longer exist on this page.");
  }
}

function getElementSelector(element) {
  if (!element) return "";
  let path = [];
  while (element.parentElement) {
    let tag = element.tagName.toLowerCase();
    let index = Array.from(element.parentElement.children).indexOf(element) + 1;
    path.unshift(`${tag}:nth-child(${index})`);
    element = element.parentElement;
  }
  return path.join(" > ");
}
