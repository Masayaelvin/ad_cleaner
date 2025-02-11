document.addEventListener("DOMContentLoaded", () => {
  const totalSilenceToggle = document.getElementById("totalSilenceToggle");

  // Load the current state of Total Silence from storage
  chrome.storage.sync.get("totalSilence", (data) => {
    totalSilenceToggle.checked = data.totalSilence || false;
  });

  // Listen for toggle changes
  totalSilenceToggle.addEventListener("change", () => {
    chrome.storage.sync.set({ totalSilence: totalSilenceToggle.checked });
    console.log("Total Silence Mode:", totalSilenceToggle.checked);

    // Notify content script to update immediately
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: updateTotalSilenceMode,
        });
      }
    });
  });
});

// Function to be executed in content.js when toggle changes
function updateTotalSilenceMode() {
  chrome.storage.sync.get("totalSilence", (data) => {
    window.postMessage(
      { type: "UPDATE_TOTAL_SILENCE", value: data.totalSilence },
      "*"
    );
  });
}
