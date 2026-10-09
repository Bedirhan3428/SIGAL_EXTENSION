// ŞİGAL New Tab Loader & Settings Controller (Manifest V3 Compliant)
(function () {
  const DEFAULT_URL = "https://google.com";
  const frame = document.getElementById("app-frame");
  const loader = document.getElementById("loader");
  const errorContainer = document.getElementById("error-container");
  const retryBtn = document.getElementById("retry-btn");
  const settingsTrigger = document.getElementById("settings-trigger");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const urlInput = document.getElementById("url-input");
  const saveBtn = document.getElementById("save-btn");
  const resetDefaultBtn = document.getElementById("reset-default-btn");

  let currentUrl = "";

  function updateDnsPreconnect(targetUrl) {
    try {
      const origin = new URL(targetUrl).origin;
      let preconnect = document.querySelector('link[rel="preconnect"]');
      if (!preconnect) {
        preconnect = document.createElement("link");
        preconnect.rel = "preconnect";
        preconnect.crossOrigin = "anonymous";
        document.head.appendChild(preconnect);
      }
      preconnect.href = origin;

      let dnsPrefetch = document.querySelector('link[rel="dns-prefetch"]');
      if (!dnsPrefetch) {
        dnsPrefetch = document.createElement("link");
        dnsPrefetch.rel = "dns-prefetch";
        document.head.appendChild(dnsPrefetch);
      }
      dnsPrefetch.href = origin;
    } catch (_) {}
  }

  function loadUrl(target) {
    if (!target) target = DEFAULT_URL;
    target = target.trim();
    if (!target.startsWith("http://") && !target.startsWith("https://")) {
      target = "https://" + target;
    }
    currentUrl = target;
    updateDnsPreconnect(target);
    loader.style.opacity = "1";
    errorContainer.classList.remove("active");
    frame.src = target;
  }

  // Fast synchronous startup from localStorage
  const cached = localStorage.getItem("targetUrl") || DEFAULT_URL;
  loadUrl(cached);

  // Sync with chrome.storage.local
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(["targetUrl"], (res) => {
      if (res && res.targetUrl && res.targetUrl !== cached) {
        localStorage.setItem("targetUrl", res.targetUrl);
        loadUrl(res.targetUrl);
      }
    });
  }

  frame.addEventListener("load", () => {
    loader.style.opacity = "0";
    errorContainer.classList.remove("active");
    try {
      frame.contentWindow?.focus();
    } catch (_) {}
  });

  retryBtn.addEventListener("click", () => {
    loadUrl(currentUrl);
  });

  window.addEventListener("online", () => {
    if (errorContainer.classList.contains("active")) {
      loadUrl(currentUrl);
    }
  });

  window.addEventListener("focus", () => {
    try {
      frame.contentWindow?.focus();
    } catch (_) {}
  });

  // Settings modal
  function openSettings() {
    urlInput.value = currentUrl;
    modalOverlay.classList.add("active");
    setTimeout(() => {
      urlInput.focus();
      urlInput.select();
    }, 50);
  }

  function closeSettings() {
    modalOverlay.classList.remove("active");
    try {
      frame.contentWindow?.focus();
    } catch (_) {}
  }

  settingsTrigger.addEventListener("click", openSettings);
  modalCloseBtn.addEventListener("click", closeSettings);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeSettings();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
      closeSettings();
    }
    if (e.altKey && e.key.toLowerCase() === "s") {
      if (modalOverlay.classList.contains("active")) closeSettings();
      else openSettings();
    }
  });

  urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      saveBtn.click();
    }
  });

  saveBtn.addEventListener("click", () => {
    const val = urlInput.value.trim();
    if (val) {
      localStorage.setItem("targetUrl", val);
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ targetUrl: val });
      }
      loadUrl(val);
    }
    closeSettings();
  });

  resetDefaultBtn.addEventListener("click", () => {
    urlInput.value = DEFAULT_URL;
    localStorage.setItem("targetUrl", DEFAULT_URL);
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ targetUrl: DEFAULT_URL });
    }
    loadUrl(DEFAULT_URL);
    closeSettings();
  });
})();
