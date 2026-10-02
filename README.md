# ŞİGAL • Modern New Tab Chrome Eklentisi

ŞİGAL, Google Chrome ve Chromium tabanlı tarayıcılar (Brave, Edge, Opera) için geliştirilmiş; minimalist estetiği, yüksek performansı ve üretkenlik odaklı araçları bir araya getiren modern yeni sekme (New Tab) eklentisidir.

---

## Genel Özellikler

### 1. Tasarım ve Kişiselleştirme
- **Glassmorphism Estetiği:** Modern cam efektleri, derinlik katan gölgeler ve yumuşak geçişler.
- **Aydınlık / Karanlık Tema:** Kontrol paneli üzerinden göz yormayan aydınlık ve karanlık mod geçişi.
- **Vurgu Renkleri:** Indigo, Zümrüt (Emerald), Amber, Gül (Pink/Rose), Gökyüzü (Sky) ve Mor gibi kişiselleştirilebilir tema renkleri.
- **Özel Arka Plan:** URL ile dilediğiniz duvar kağıdını arka plan olarak belirleme imkanı.

### 2. Arama ve Akıllı Öneriler
- **Çoklu Arama Motoru:** Google, DuckDuckGo, Bing ve Yandex desteği.
- **Doğrudan URL Algılama:** Arama çubuğuna yazılan geçerli web adreslerine arama motoruna gitmeden doğrudan yönlendirme.
- **Arama Geçmişi:** Son yapılan aramaları listeleme, tek tek silme ve tümünü temizleme özellikleri.
- **Google Öngörücü Aramalar:** Arama çubuğuna yazarken hızlı öneri tamamlama.

### 3. Google Araçlar Menüsü (9 Noktalı Waffle Menü)
- Sağ üst köşede yer alan resmi Google araç çekmecesi.
- Her servis için doğrudan yerel vektörel SVG ikonlar:
  - Google Arama
  - Gmail
  - YouTube
  - Haritalar
  - Google Drive
  - Google Takvim
  - Google Fotoğraflar
  - Google Çeviri
  - Google Meet
  - Google Dokümanlar
  - Google E-Tablolar
  - Google Haberler

### 4. Üretkenlik ve Yaşam Araçları
- **Hava Durumu:** Konuma göre otomatik veya manuel şehir seçimi ile anlık sıcaklık ve 7 günlük tahmin kartları.
- **Hızlı Kısayollar:** Sık kullanılan siteleri ekleme, düzenleme ve silme. Otomatik favicon desteği.
- **Günün İlerlemesi:** Günün saat bazlı ilerleme durumunu gösteren minimalist gösterge çubuğu.
- **Motivasyon Sözleri:** Her sekme açılışında yenilenen veya tek tuşla değiştirilebilen ilham verici sözler.
- **Odak & Saat:** Büyük dijital saat, tarih göstergesi ve kişiselleştirilebilir kullanıcı karşılama metni.

### 5. Gizli Detaylar (Easter Eggs)
Arama motoruna veya gizli terminale yazılarak çalıştırılabilen özel modlar:
- **`yksm`**: Özel video oynatıcısını doğrudan tam ekran başlatır.
- **`yksloser`**: Tame Impala - Loser videosunu 45. saniyeden itibaren tam ekran başlatır.
- **`gravity` / `yercekimi`**: Sayfadaki tüm öğelerin yerçekimi fiziğiyle düşüp fırlatılabildiği simülasyonu başlatır.
- **`breakout` / `oyun`**: Tuğla kırma retro atari oyununu başlatır.
- **Gizli Terminal:** Sayfanın sol altındaki logoya peş peşe 7 kez tıklandığında açılan geliştirici konsolu.

---

## Kurulum Rehberi

### Yöntem 1: Geliştirici Modu ile Manuel Kurulum (Hemen Kullanım)

1. Bu proje klasörünü bilgisayarınıza indirin veya arşivden çıkarın.
2. Google Chrome'u açın ve adres çubuğuna şu adresi yazıp Enter'a basın:
   ```text
   chrome://extensions/
   ```
3. Sağ üst köşede bulunan **Geliştirici modu** (Developer mode) anahtarını açın.
4. Sol üstte beliren **Paketlenmemiş öğe yükle** (Load unpacked) butonuna tıklayın.
5. `SIGAL_EXTENSION` klasörünü seçin.
6. Yeni bir sekme (`Ctrl + T`) açtığınızda ŞİGAL karşınıza gelecektir.

### Yöntem 2: Chrome Web Mağazası'nda Yayınlama

1. Klasördeki güncel `SIGAL_Extension_v2.3.zip` arşiv dosyasını kullanın (veya dosyaları kendiniz zipleyin).
2. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/) adresine gidin.
3. Google Geliştirici Hesabınızla giriş yapın (ilk kez kayıt oluyorsanız tek seferlik 5$ kayıt ücreti bulunmaktadır).
4. **Yeni Öğe Ekle** (Add new item) butonuna tıklayarak ZIP dosyasını yükleyin.
5. Mağaza listeleme bilgilerini, ekran görüntülerini ve gizlilik beyanını doldurup incelemeye gönderin.

---

## Dosya Yapısı

```text
SIGAL_EXTENSION/
├── manifest.json       # Chrome Manifest V3 yapılandırma ve izin dosyası
├── newtab.html         # Yeni sekme HTML iskeleti ve CSS stilleri
├── script.js           # Arayüz etkileşimleri, API istekleri ve widget mantığı
├── background.js       # Manifest V3 service worker (CORS ve API köprüsü)
├── icons/              # Eklenti logoları ve Google uygulama vektörleri
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon128.png
│   └── google/         # 12 adet resmi Google servis SVG ikonu
├── logo.png            # ŞİGAL marka logosu
├── favicon.ico         # Sekme favicon görseli
└── README.md           # Proje belgelendirmesi
```

---

## Gizlilik ve Güvenlik

- **Yerel Depolama:** Kullanıcı adı, kısayollar, notlar ve kişisel ayarlar yalnızca tarayıcınızın yerel hafızasında (`chrome.storage.local`) saklanır.
- **Sıfır İzleme:** Eklenti üçüncü taraf izleyici, analitik veya reklam kodu içermez.
- **Ağ İstekleri:** Yalnızca kullanıcının talep ettiği hava durumu, arama önerileri ve Google servis bağlantıları için resmi Google API uç noktalarıyla iletişim kurulur.

---

## Lisans

Bu proje kişisel ve eğitim amaçlı kullanım için hazırlanmıştır. Ticari markalar (Google, YouTube vb.) ilgili sahiplerine aittir.
