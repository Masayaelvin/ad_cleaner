chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "blockAd",
    title: "Block this ad",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "blockAd") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: manuallyBlockAd,
    });
  }
});

function manuallyBlockAd() {
  document.addEventListener(
    "click",
    function (event) {
      let element = event.target;

      // Store the blocked element in localStorage
      let blockedAds = JSON.parse(localStorage.getItem("blockedAds")) || [];
      blockedAds.push(getElementSelector(element));
      localStorage.setItem("blockedAds", JSON.stringify(blockedAds));

      // Hide the element
      element.style.display = "none";

      alert("Ad blocked!");
    },
    { once: true }
  ); // Runs only for the next click
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
