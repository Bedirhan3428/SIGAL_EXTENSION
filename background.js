// Background Service Worker for ŞİGAL Extension (Manifest V3)
// Chrome Manifest V3'te cross-origin istekler (CORS kısıtlamalarına takılmadan)
// host_permissions yetkisiyle bu arka plan servis çalışanı üzerinden gerçekleştirilir.

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || !message.type) return false;

    // 1. Google Öngörücü Arama (Autocomplete) İstekleri
    if (message.type === "FETCH_SUGGESTIONS") {
        const query = encodeURIComponent(message.query || "");
        const url = `https://suggestqueries.google.com/complete/search?client=chrome&q=${query}&hl=tr`;

        fetch(url, {
            headers: {
                "Accept": "application/json"
            }
        })
        .then(res => {
            if (!res.ok) throw new Error("HTTP Hata: " + res.status);
            return res.json();
        })
        .then(data => {
            sendResponse({ success: true, data });
        })
        .catch(err => {
            sendResponse({ success: false, error: err.message });
        });

        return true; // Asenkron sendResponse için kanal açık tutulur
    }

    // 2. Google Hava Durumu HTML İsteği
    if (message.type === "FETCH_WEATHER_HTML") {
        const searchQuery = message.city ? `hava durumu ${message.city}` : "hava durumu";
        const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&hl=tr`;

        fetch(url, {
            headers: {
                "Accept": "text/html",
                "Accept-Language": "tr-TR,tr;q=0.9"
            }
        })
        .then(res => {
            if (!res.ok) throw new Error("HTTP Hata: " + res.status);
            return res.text();
        })
        .then(html => {
            sendResponse({ success: true, html });
        })
        .catch(err => {
            sendResponse({ success: false, error: err.message });
        });

        return true; // Asenkron sendResponse için kanal açık tutulur
    }

    return false;
});
