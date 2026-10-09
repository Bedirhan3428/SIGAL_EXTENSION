// Background Service Worker for ŞİGAL Extension (Manifest V3)
const FIXED_URL = "https://sigal-ex.vercel.app";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ targetUrl: FIXED_URL });
});

// Extension toolbar icon click action
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: "chrome://newtab" });
});
