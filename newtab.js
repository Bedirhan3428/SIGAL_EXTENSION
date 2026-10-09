// ŞİGAL New Tab Loader (Fixed URL: https://sigal-ex.vercel.app)
(function () {
  'use strict';

  const FIXED_URL = "https://sigal-ex.vercel.app";
  const frame = document.getElementById("app-frame");
  const loader = document.getElementById("loader");
  const errorContainer = document.getElementById("error-container");
  const retryBtn = document.getElementById("retry-btn");

  // Ensure iframe src is permanently FIXED_URL
  if (frame && frame.src !== FIXED_URL) {
    frame.src = FIXED_URL;
  }

  // Clear any legacy dynamic storage overrides
  try {
    localStorage.removeItem("targetUrl");
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ targetUrl: FIXED_URL });
    }
  } catch (_) {}

  // Handle navigation requests from inner web application so external services (Drive, etc.) open cleanly at top-level
  window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SIGAL_NAVIGATE" && event.data.url) {
      const targetUrl = event.data.url;
      if (event.data.newTab) {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      } else {
        if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.update) {
          chrome.tabs.update({ url: targetUrl });
        } else {
          window.location.href = targetUrl;
        }
      }
    }
  });

  if (frame) {
    frame.addEventListener("load", () => {
      if (loader) loader.style.opacity = "0";
      if (errorContainer) errorContainer.classList.remove("active");
      try {
        frame.contentWindow?.focus();
      } catch (_) {}
    });
  }

  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      if (loader) loader.style.opacity = "1";
      if (errorContainer) errorContainer.classList.remove("active");
      if (frame) frame.src = FIXED_URL;
    });
  }

  window.addEventListener("online", () => {
    if (errorContainer && errorContainer.classList.contains("active")) {
      if (frame) frame.src = FIXED_URL;
    }
  });

  window.addEventListener("focus", () => {
    try {
      frame?.contentWindow?.focus();
    } catch (_) {}
  });
})();
