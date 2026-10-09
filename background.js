// Background Service Worker for ŞİGAL Extension (Manifest V3)
const DEFAULT_URL = "https://google.com";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["targetUrl"], (result) => {
    if (!result.targetUrl) {
      chrome.storage.local.set({ targetUrl: DEFAULT_URL });
    }
  });
});

// Extension toolbar icon click action
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: "chrome://newtab" });
});
