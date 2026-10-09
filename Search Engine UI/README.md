# ŞİGAL • Search Engine UI

Modern, yüksek performanslı ve tamamen kişiselleştirilebilir web arama motoru arayüzü.

## Özellikler

- **Çoklu Arama Motoru:** Google, DuckDuckGo, Brave, Bing, Yandex, YouTube, GitHub, Vikipedi, Reddit, Perplexity.
- **DuckDuckGo Bangs Desteği:** `!g`, `!yt`, `!gh`, `!w`, `!r` kısayollarıyla doğrudan hedef serviste arama.
- **Canlı Arama Önerileri:** Anlık otomatik tamamlama ve son arama geçmişi.
- **Arama Filtreleri:** Tümü, Görseller, Videolar, Haberler, Haritalar, Kod.
- **Zengin Temalar & Vurgular:**
  - 6 Farklı Tema: Cyberpunk, Midnight OLED, Nordic Frost, Tokyo Sunset, Emerald Matrix, Aydınlık Minimalist.
  - 6 Vurgu Rengi: Cyan, Indigo, Emerald, Rose, Amber, Mor.
  - 4 Arka Plan Modu: Etkileşimli Yıldız/Parçacık animasyonu, Hareketli Mesh Gradient, Düz Renk, Özel URL Duvar Kağıdı.
- **Üretkenlik Araçları:**
  - Hızlı Kısayollar (Speed Dial) ve otomatik Favicon çekme.
  - Canlı Saat, Tarih, Kişisel Karşılama ve Gün İlerleme Çubuğu.
  - Canlı Hava Durumu (Open-Meteo API).
  - Hızlı Not Defteri ve Yapılacaklar (To-Do) listesi.
  - Hızlı Web Uygulamaları çekmecesi.
  - Odak / Zen Modu (`Z` kısayolu).

## Yerel Olarak Çalıştırma

Herhangi bir statik sunucuyla çalıştırabilirsiniz:

```bash
# Python ile:
python -m http.server 3000

# veya Node.js / npx ile:
npx serve .
```

## Eklentiye Bağlama

1. Bu web arayüzünü Vercel, Netlify veya GitHub Pages üzerinde yayınlayın (veya yerel `http://localhost:3000` kullanın).
2. ŞİGAL eklentisinde yeni bir sekme açın.
3. Sağ alttaki ayarlar butonuna (`Alt + S`) tıklayıp aldığınız URL'yi girin ve kaydedin.
