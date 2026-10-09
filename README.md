# ŞİGAL • Web New Tab Chrome Eklentisi (Manifest V3)

ŞİGAL, web sitenizi veya web uygulamanızı doğrudan yeni sekmede (New Tab) sıfır gecikmeyle çalıştıran ultra hafif Chrome eklentisidir.

## Özellikler

- **Dinamik Web Yükleme:** Eklentiyi güncellemeye gerek kalmadan sunucudaki web sitenizin en güncel halini anında çalıştırır.
- **Sıfır Gecikme & Senkron Önbellek:** Sayfa açılışında beyaz ekran parlamasını (flash) önleyen koyu arka plan ve anlık önbellek ile yükleme.
- **Akıllı DNS & Preconnect:** Hedef sunucuya DNS prefetch ve TLS preconnect bağlantılarını anında başlatır.
- **Iframe Güvenlik Başlık Yönetimi:** `rules.json` (Declarative Net Request) ile `X-Frame-Options` ve `frame-ancestors` kısıtlamalarını dinamik olarak aşar, her türlü web sitesini sorunsuz gömer.
- **Kolay URL Yönetimi:** Sağ alttaki minimalist ayar butonu veya `Alt + S` kısayolu ile hedef web adresi dilediğiniz zaman değiştirilebilir.

## Dosya Yapısı

```text
SIGAL_EXTENSION/
├── manifest.json       # Chrome Manifest V3 yapılandırması
├── rules.json          # Declarative Net Request iframe kuralı
├── newtab.html         # Tam ekran web sekme iskeleti ve ayar paneli
├── background.js       # Manifest V3 service worker
├── icons/              # Eklenti simgeleri
├── favicon.ico         # Sekme ikonu
└── logo.png            # ŞİGAL logosu
```

## Kurulum

1. Google Chrome adres çubuğuna `chrome://extensions/` yazın.
2. Sağ üst köşeden **Geliştirici modu** (Developer mode) seçeneğini açın.
3. **Paketlenmemiş öğe yükle** (Load unpacked) butonuna tıklayıp bu klasörü (`SIGAL_EXTENSION`) seçin.
4. Yeni bir sekme açın (`Ctrl + T`).
5. Sağ alttaki ayar simgesine veya `Alt + S` tuşlarına basarak sitenizin adresini belirleyin.
