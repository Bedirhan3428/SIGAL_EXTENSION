// URL'yi normalleştir: https:// yoksa ekle
function normalizeUrl(url) {
    url = url.trim();
    if (!url) return url;
    // Zaten protokol varsa dokunma
    if (/^https?:\/\//i.test(url)) return url;
    // chrome://, file:// gibi özel şemalar varsa dokunma
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(url)) return url;
    // Otomatik https:// ekle
    return 'https://' + url;
}

// URL'den domain adını çıkar (favicon için)
function getDomain(url) {
    try {
        return new URL(normalizeUrl(url)).hostname;
    } catch(e) {
        return '';
    }
}

// Favicon URL'si al (Google API)
function getFaviconUrl(url, size) {
    const domain = getDomain(url);
    if (!domain) return '';
    size = size || 64;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

// Doğrudan hedef siteden güncel .ico dosyasını al
function getDirectFaviconUrl(url) {
    try {
        const full = normalizeUrl(url);
        const origin = new URL(full).origin;
        return `${origin}/favicon.ico`;
    } catch(e) {
        return '';
    }
}

// Kaliteli düşünür, lider, bilim insanı ve yazarlardan seçkin motivasyon sözleri
const DEFAULT_QUOTES = [
    { id: 1, text: "Zafer, 'zafer benimdir' diyebilenindir. Başarı ise, 'başaracağım' diye başlayarak sonunda 'başardım' diyebilenindir.", author: "Mustafa Kemal Atatürk" },
    { id: 2, text: "Dinlenmemek üzere yürümeye karar verenler, asla ve asla yorulmazlar.", author: "Mustafa Kemal Atatürk" },
    { id: 3, text: "Hiçbir şeye ihtiyacımız yok, yalnız bir şeye ihtiyacımız vardır: Çalışkan olmak!", author: "Mustafa Kemal Atatürk" },
    { id: 4, text: "Umutsuz durumlar yoktur, umutsuz insanlar vardır. Ben hiçbir zaman umudumu yitirmedim.", author: "Mustafa Kemal Atatürk" },
    { id: 5, text: "Dün akıllıydım, dünyayı değiştirmek istedim. Bugün bilgeyim, kendimi değiştiriyorum.", author: "Mevlânâ Celâleddîn-i Rûmî" },
    { id: 6, text: "Kanatların varken sürünmek niye?", author: "Mevlânâ Celâleddîn-i Rûmî" },
    { id: 7, text: "Yol açık, yola çık!", author: "Mevlânâ Celâleddîn-i Rûmî" },
    { id: 8, text: "Kendi zihninin üzerinde tam bir gücün var, dış olaylar üzerinde değil. Bunu anladığında gerçek gücünü bulacaksın.", author: "Marcus Aurelius" },
    { id: 9, text: "Engel, yolun kendisidir. Hareketi engelleyen her şey, hareketi ilerletir.", author: "Marcus Aurelius" },
    { id: 10, text: "Sabah uyandığında nefes almanın, düşünmenin ve yaşamanın nasıl bir ayrıcalık olduğunu hatırla.", author: "Marcus Aurelius" },
    { id: 11, text: "Zor olduğu için cesaret edemiyor değiliz; biz cesaret edemediğimiz için zordur.", author: "Seneca" },
    { id: 12, text: "Hangi limana gideceğini bilmeyen bir gemiye hiçbir rüzgâr yardım edemez.", author: "Seneca" },
    { id: 13, text: "İlk önce ne olmak istediğini kendine sor, sonra yapman gerekeni yap.", author: "Epiktetos" },
    { id: 14, text: "Seni inciten şey başkalarının eylemleri değil, senin o eylemlere yüklediğin anlamdır.", author: "Epiktetos" },
    { id: 15, text: "Hayat bisiklete binmek gibidir. Dengenizi korumak için hareket etmeye devam etmelisiniz.", author: "Albert Einstein" },
    { id: 16, text: "Zekânın gerçek göstergesi bilgi değil, hayal gücüdür.", author: "Albert Einstein" },
    { id: 17, text: "Hiç hata yapmamış bir insan, yeni hiçbir şey denememiştir.", author: "Albert Einstein" },
    { id: 18, text: "Zamanınız kısıtlı, bu yüzden başkasının hayatını yaşayarak onu harcamayın. Aç kalın, budala kalın.", author: "Steve Jobs" },
    { id: 19, text: "Geleceği tahmin etmenin en iyi yolu, onu inşa etmektir.", author: "Steve Jobs" },
    { id: 20, text: "Bizi toprağa gömmeye çalıştılar; fakat tohum olduğumuzu bilmiyorlardı.", author: "Aliya İzzetbegoviç" },
    { id: 21, text: "Olduğunuz gibi kalın; inancınızdan, kimliğinizden ve ideallerinizden utanmayın; dik durun.", author: "Aliya İzzetbegoviç" },
    { id: 22, text: "Gelecek gerçeği gösterecek ve herkesi eserine ve emeğine göre ödüllendirecektir.", author: "Nikola Tesla" },
    { id: 23, text: "Durmadığın sürece ne kadar yavaş ilerlediğinin hiçbir önemi yoktur.", author: "Konfüçyüs" },
    { id: 24, text: "En büyük zaferimiz hiç düşmemek değil, her düştüğümüzde yeniden ayağa kalkabilmektir.", author: "Konfüçyüs" },
    { id: 25, text: "Yaşamak için bir 'neden'i olan insan, her türlü 'nasıl'a göğüs gerebilir.", author: "Friedrich Nietzsche" },
    { id: 26, text: "Değişimin sırrı; tüm enerjini eskiyle savaşmaya değil, yeniyi inşa etmeye odaklamaktır.", author: "Sokrates" },
    { id: 27, text: "Biz sürekli yaptığımız şeyleriz. O halde mükemmellik bir eylem değil, bir alışkanlıktır.", author: "Aristoteles" },
    { id: 28, text: "Öğrenmek, zihnin asla doymadığı, asla pişman olmadığı ve asla korkmadığı tek şeydir.", author: "Leonardo da Vinci" },
    { id: 29, text: "Büyük işler, bir dizi küçük şeyin bir araya getirilmesiyle meydana gelir.", author: "Vincent van Gogh" },
    { id: 30, text: "Kendi yolunda yanlış gitmek, başkasının yolunda doğru gitmekten çok daha iyidir.", author: "Fyodor Dostoyevski" },
    { id: 31, text: "Zamanı gelmiş bir fikrin karşısında durabilecek dünyada hiçbir güç yoktur.", author: "Victor Hugo" },
    { id: 32, text: "Çoğu insan zekaya inanır, ben inanmıyorum. Bizi birbirimizden ayıran tek şey emektir, çalışmaktır.", author: "Aziz Sancar" },
    { id: 33, text: "Artık bir durumu değiştiremiyorsak, kendimizi değiştirmekle yükümlüyüzdür.", author: "Viktor Frankl" },
    { id: 34, text: "Başarı son değildir, başarısızlık da ölümcül değildir: Asıl önemli olan yola devam etme cesaretidir.", author: "Winston Churchill" },
    { id: 35, text: "Başlamak için harika olmak zorunda değilsin, fakat harika olmak için başlamak zorundasın.", author: "Johann Wolfgang von Goethe" },
    { id: 36, text: "Yapılana kadar her şey imkânsız görünür.", author: "Nelson Mandela" },
    { id: 37, text: "Eğer daha ileriyi görebildiysem, bu benden önceki devlerin omuzlarında durduğum içindir.", author: "Isaac Newton" },
    { id: 38, text: "Gözlerini dışarı çeviren rüya görür, içine bakan ise uyanır.", author: "Carl Gustav Jung" },
    { id: 39, text: "İlim ilim bilmektir, ilim kendin bilmektir; sen kendini bilmezsin, ya nice okumaktır.", author: "Yunus Emre" },
    { id: 40, text: "Çalışmak için müsait gün ve saat bekleme. Bil ki her gün ve her saat çalışmanın en müsait vaktidir.", author: "Ali Fuad Başgil" },
    { id: 41, text: "Hayatta hiçbir şeyden korkulmamalıdır, sadece anlaşılmalıdır. Şimdi daha çok anlama vaktidir.", author: "Marie Curie" },
    { id: 42, text: "Bir yerlerde inanılmaz bir şey, sizin tarafınızdan keşfedilmeyi bekliyor.", author: "Carl Sagan" },
    { id: 43, text: "Tüm muhteşem hikâyeler iki şekilde başlar: Ya bir insan bir yolculuğa çıkar, ya da şehre bir yabancı gelir.", author: "Lev Tolstoy" },
    { id: 44, text: "Şifasız hastalık yoktur; irade eksikliğinden başka değersiz bir illet yoktur.", author: "İbn-i Sina" },
    { id: 45, text: "Düşünmek, savaşmaktır; bir peşin hükme karşı bir hakikatin savaşması.", author: "Cemil Meriç" }
];

let state = {
    userName: "Kullanıcı", clockFormat: "24", searchEngine: "google", accentColor: "indigo", customBg: "",
    theme: "dark",
    weatherCity: "", weatherLocationName: "",
    bellEnabled: false,
    bellSchedule: [
        { id: 1, time: "08:30", type: "in" },
        { id: 2, time: "09:10", type: "out" },
        { id: 3, time: "09:20", type: "in" },
        { id: 4, time: "10:00", type: "out" },
        { id: 5, time: "10:15", type: "in" },
        { id: 6, time: "10:55", type: "out" },
        { id: 7, time: "11:10", type: "in" },
        { id: 8, time: "11:50", type: "lunch" },
        { id: 9, time: "12:40", type: "in" },
        { id: 10, time: "13:20", type: "out" },
        { id: 11, time: "13:30", type: "in" },
        { id: 12, time: "14:10", type: "exit" }
    ],
    shortcuts: [
        { title: "GitHub", url: "https://github.com/bedirhan3428" },
        { title: "YouTube", url: "https://youtube.com" },
        { title: "ChatGPT", url: "https://chatgpt.com" },
        { title: "Instagram", url: "https://instagram.com" },
        { title: "Gmail", url: "https://mail.google.com" },
        { title: "GitHub Keşfet", url: "https://github.com/explore" }
    ],
    searchHistory: [],
    quotesVersion: 2,
    quotes: [...DEFAULT_QUOTES],
    currentQuoteId: null
};

        function getEffectiveTheme() {
            const t = state.theme || "dark";
            if (t === "system") {
                return (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) ? "light" : "dark";
            }
            return t;
        }

        function updateThemeButton(effectiveTheme) {
            const btn = document.getElementById("btnThemeToggle");
            const btnIcon = document.getElementById("themeToggleIcon");
            const btnText = document.getElementById("themeToggleText");
            if (!btnIcon || !btnText) return;

            if (effectiveTheme === "light") {
                btnIcon.className = "fa-solid fa-moon";
                btnText.textContent = "Karanlık";
                if (btn) btn.title = "Karanlık Moda Geç";
            } else {
                btnIcon.className = "fa-solid fa-sun";
                btnText.textContent = "Aydınlık";
                if (btn) btn.title = "Aydınlık Moda Geç";
            }
        }

        function toggleTheme() {
            const current = getEffectiveTheme();
            state.theme = current === "light" ? "dark" : "light";
            saveState();
        }

        function loadState() {
            const saved = localStorage.getItem("nova_tab_state_vanilla");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    parsed.quotes = [...DEFAULT_QUOTES];
                    delete parsed.pinnedQuoteId;
                    delete parsed.todos;
                    if (!Array.isArray(parsed.searchHistory)) {
                        parsed.searchHistory = [];
                    }
                    if (!parsed.theme) {
                        parsed.theme = "dark";
                    }
                    state = { ...state, ...parsed };
                } catch(e) {}
            }
            applyState();
        }

        function saveState() {
            localStorage.setItem("nova_tab_state_vanilla", JSON.stringify(state));
            applyState();
        }

        function applyState() {
            const effectiveTheme = getEffectiveTheme();
            const bodyRoot = document.getElementById("bodyRoot");
            if (bodyRoot) {
                bodyRoot.setAttribute("data-theme", effectiveTheme);
                bodyRoot.setAttribute("data-accent", state.accentColor);
            }
            updateThemeButton(effectiveTheme);

            document.getElementById("userNameDisplay").textContent = state.userName;

            // Background
            const bgBackdrop = document.getElementById("customBgBackdrop");
            if (bgBackdrop) {
                if (state.customBg) {
                    bgBackdrop.style.backgroundImage = `url('${state.customBg}')`;
                    bgBackdrop.style.display = "block";
                } else {
                    bgBackdrop.style.backgroundImage = "none";
                    bgBackdrop.style.display = "none";
                }
            }
            if (bodyRoot) bodyRoot.style.backgroundImage = "none";

            // Search Engine
            const form = document.getElementById("searchForm");
            const input = document.getElementById("searchInput");
            const icon = document.getElementById("searchIcon");

            if (state.searchEngine === "google") {
                form.action = "https://www.google.com/search";
                input.name = "q";
                icon.className = "fa-brands fa-google search-icon";
                input.placeholder = "Google'da ara veya URL yaz...";
            } else if (state.searchEngine === "duckduckgo") {
                form.action = "https://duckduckgo.com/";
                input.name = "q";
                icon.className = "fa-solid fa-shield-halved search-icon";
                input.placeholder = "DuckDuckGo'da gizlice ara...";
            } else if (state.searchEngine === "bing") {
                form.action = "https://www.bing.com/search";
                input.name = "q";
                icon.className = "fa-brands fa-microsoft search-icon";
                input.placeholder = "Bing'de ara...";
            } else if (state.searchEngine === "github") {
                form.action = "https://github.com/search";
                input.name = "q";
                icon.className = "fa-brands fa-github search-icon";
                input.placeholder = "GitHub'da kod ara...";
            }

            renderShortcuts();
            updateColorDots();

            // Sol Widget Görünürlüğü (Zil Takipçisi vs Odak Merkezi)
            const widgetBell = document.getElementById("widgetBell");
            const widgetFocus = document.getElementById("widgetFocus");
            if (widgetBell && widgetFocus) {
                if (state.bellEnabled) {
                    widgetBell.style.display = "flex";
                    widgetFocus.style.display = "none";
                    updateBellTracker();
                } else {
                    widgetBell.style.display = "none";
                    widgetFocus.style.display = "flex";
                    updateDayProgress();
                }
            }
        }

        function updateClock() {
            const now = new Date();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            if (state.clockFormat === "12") {
                const ampm = hours >= 12 ? 'ÖS' : 'ÖÖ';
                hours = hours % 12 || 12;
                document.getElementById("clockTime").textContent = `${String(hours).padStart(2, '0')}:${minutes}`;
                document.getElementById("clockSec").textContent = `${seconds} ${ampm}`;
            } else {
                document.getElementById("clockTime").textContent = `${String(hours).padStart(2, '0')}:${minutes}`;
                document.getElementById("clockSec").textContent = seconds;
            }

            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById("currentDateHeader").textContent = now.toLocaleDateString('tr-TR', options);

            let greet = "İyi günler";
            let sub = "Hız kesmeden hedeflerine odaklan.";

            if (hours >= 0 && hours < 5) {
                greet = "Gece Mesaisi";
                sub = "Sessiz saatlerde çalışanlar geleceği inşa eder. Kolay gelsin!";
            } else if (hours >= 5 && hours < 8) {
                greet = "Erken Saatler";
                sub = "Erken kalkanlar kulübü; güne taptaze ve zinde bir başlangıç.";
            } else if (hours >= 8 && hours < 12) {
                greet = "Günaydın";
                sub = "Enerjin yüksek, zihnin açık; harika bir gün seni bekliyor.";
            } else if (hours >= 12 && hours < 14) {
                greet = "İyi Günler";
                sub = "Günün tam ortasındasın; kısa bir mola ver, enerjini tazele.";
            } else if (hours >= 14 && hours < 18) {
                greet = "Verimli Saatler";
                sub = "Odaklanma en üst düzeyde; adımlarını kararlılıkla at.";
            } else if (hours >= 18 && hours < 22) {
                greet = "İyi Akşamlar";
                sub = "Günün temposunu tamamlayıp meyvelerini toplama vakti.";
            } else {
                greet = "İyi Geceler";
                sub = "Zihnini dinlendir, gününü değerlendir; yarın yepyeni bir sayfa.";
            }

            const greetEl = document.getElementById("greetingText");
            if (greetEl) greetEl.textContent = greet;
            const subEl = document.getElementById("greetingSub");
            if (subEl) subEl.textContent = sub;

            // Canlı sayaçlar güncellemesi
            if (state.bellEnabled) {
                updateBellTracker();
            } else {
                updateDayProgress();
            }
        }
        setInterval(updateClock, 1000);
        updateClock();

        function renderShortcuts() {
            const grid = document.getElementById("shortcutsGrid");
            grid.innerHTML = "";
            state.shortcuts.forEach((item, index) => {
                const a = document.createElement("a");
                a.href = normalizeUrl(item.url);
                a.className = "shortcut-card glass-panel";
                const directIco = getDirectFaviconUrl(item.url);
                const fallbackService = getFaviconUrl(item.url, 64);
                const iconHtml = directIco
                    ? `<img class="favicon-img" src="${directIco}" alt="${escapeHtml(item.title)}" onerror="if(this.dataset.fallback){this.style.display='none';this.nextElementSibling.style.display='flex';}else{this.dataset.fallback='1';this.src='${fallbackService}';}"><i class="fa-solid fa-globe" style="display:none;"></i>`
                    : `<i class="fa-solid fa-globe"></i>`;
                a.innerHTML = `
                    <button class="btn-delete-shortcut" data-action="delete-shortcut" data-index="${index}">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    <div class="shortcut-icon-box">
                        ${iconHtml}
                    </div>
                    <span class="shortcut-name">${item.title}</span>
                `;
                grid.appendChild(a);
            });
        }

        function saveNewShortcut() {
            const title = document.getElementById("shortTitle").value.trim();
            const rawUrl = document.getElementById("shortUrl").value.trim();
            if (!title || !rawUrl) return;
            const url = normalizeUrl(rawUrl);
            state.shortcuts.push({ title, url });
            saveState();
            closeModal('shortcutModal');
            document.getElementById("shortTitle").value = "";
            document.getElementById("shortUrl").value = "";
        }

        function deleteShortcut(index) {
            state.shortcuts.splice(index, 1);
            saveState();
        }

        // ==================== ODAK & GÜNÜN İLERLEMESİ ====================
        let focusDurationMins = 25;
        let focusRemainingSeconds = 25 * 60;
        let focusTimerInterval = null;
        let isFocusRunning = false;

        function updateDayProgress() {
            const now = new Date();
            const passedSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
            const percent = Math.min(100, Math.max(0, Math.round((passedSeconds / 86400) * 100)));
            
            const remainingH = 23 - now.getHours();
            const remainingM = 59 - now.getMinutes();

            const percentEl = document.getElementById("dayProgressPercent");
            const barEl = document.getElementById("dayProgressBar");
            const metaEl = document.getElementById("dayProgressMeta");

            if (percentEl) percentEl.textContent = `%${percent}`;
            if (barEl) barEl.style.width = `${percent}%`;
            if (metaEl) metaEl.textContent = `Bugünden Kalan: ${remainingH} sa ${remainingM} dk`;
        }

        function setFocusTime(mins) {
            focusDurationMins = mins;
            focusRemainingSeconds = mins * 60;
            if (isFocusRunning) pauseFocusTimer();
            updateFocusDisplay();
            
            document.querySelectorAll(".focus-pill").forEach(p => {
                p.classList.toggle("active", Number(p.dataset.mins) === mins);
            });
        }

        function updateFocusDisplay() {
            const m = String(Math.floor(focusRemainingSeconds / 60)).padStart(2, '0');
            const s = String(focusRemainingSeconds % 60).padStart(2, '0');
            const el = document.getElementById("focusTimeDisplay");
            if (el) el.textContent = `${m}:${s}`;
        }

        function toggleFocusTimer() {
            if (isFocusRunning) {
                pauseFocusTimer();
            } else {
                startFocusTimer();
            }
        }

        function startFocusTimer() {
            if (focusRemainingSeconds <= 0) focusRemainingSeconds = focusDurationMins * 60;
            isFocusRunning = true;
            const icon = document.getElementById("focusPlayIcon");
            if (icon) icon.className = "fa-solid fa-pause";

            clearInterval(focusTimerInterval);
            focusTimerInterval = setInterval(() => {
                if (focusRemainingSeconds > 0) {
                    focusRemainingSeconds--;
                    updateFocusDisplay();
                } else {
                    pauseFocusTimer();
                    playChime();
                }
            }, 1000);
        }

        function pauseFocusTimer() {
            isFocusRunning = false;
            clearInterval(focusTimerInterval);
            const icon = document.getElementById("focusPlayIcon");
            if (icon) icon.className = "fa-solid fa-play";
        }

        function resetFocusTimer() {
            pauseFocusTimer();
            focusRemainingSeconds = focusDurationMins * 60;
            updateFocusDisplay();
        }

        // Rahatlatıcı Çan Sesi
        function playChime() {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                const ctx = new AudioCtx();
                const tone = (freq, start, dur) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
                    gain.gain.setValueAtTime(0.12, ctx.currentTime + start);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(ctx.currentTime + start);
                    osc.stop(ctx.currentTime + start + dur);
                };
                tone(523.25, 0, 0.4);
                tone(659.25, 0.2, 0.6);
                setTimeout(() => ctx.close().catch(() => {}), 1500);
            } catch(e) {}
        }

        // Yağmur / Beyaz Gürültü Ambiyansı (Offline Web Audio API)
        let ambientAudioCtx = null;
        let isAmbientPlaying = false;

        function toggleAmbientSound() {
            const btn = document.getElementById("btnAmbientRain");
            if (isAmbientPlaying) {
                if (ambientAudioCtx) {
                    ambientAudioCtx.close().catch(() => {});
                    ambientAudioCtx = null;
                }
                isAmbientPlaying = false;
                if (btn) btn.classList.remove("active");
            } else {
                try {
                    const AudioCtx = window.AudioContext || window.webkitAudioContext;
                    ambientAudioCtx = new AudioCtx();
                    const bufferSize = ambientAudioCtx.sampleRate * 2;
                    const noiseBuffer = ambientAudioCtx.createBuffer(1, bufferSize, ambientAudioCtx.sampleRate);
                    const output = noiseBuffer.getChannelData(0);
                    let b0 = 0, b1 = 0, b2 = 0;
                    for (let i = 0; i < bufferSize; i++) {
                        const white = Math.random() * 2 - 1;
                        b0 = 0.99 * b0 + white * 0.05;
                        b1 = 0.96 * b1 + white * 0.1;
                        b2 = 0.86 * b2 + white * 0.2;
                        output[i] = (b0 + b1 + b2) * 0.12;
                    }
                    const src = ambientAudioCtx.createBufferSource();
                    src.buffer = noiseBuffer;
                    src.loop = true;

                    const filter = ambientAudioCtx.createBiquadFilter();
                    filter.type = "lowpass";
                    filter.frequency.setValueAtTime(750, ambientAudioCtx.currentTime);

                    const gain = ambientAudioCtx.createGain();
                    gain.gain.setValueAtTime(0.18, ambientAudioCtx.currentTime);

                    src.connect(filter);
                    filter.connect(gain);
                    gain.connect(ambientAudioCtx.destination);
                    src.start(0);

                    isAmbientPlaying = true;
                    if (btn) btn.classList.add("active");
                } catch(e) {
                    console.warn("Ambiyans başlatılamadı:", e);
                }
            }
        }

        // ==================== ZİL & SÜRE TAKİPÇİSİ ====================
        function getBellTypeInfo(type) {
            switch (type) {
                case 'in': return { name: 'Ders Zili (İçeri)', badgeText: 'DERS VAKTİ (İÇERİ)', class: 'in' };
                case 'out': return { name: 'Teneffüs Zili (Dışarı)', badgeText: 'TENEFFÜS / MOLA (DIŞARI)', class: 'out' };
                case 'lunch': return { name: 'Öğle Arası', badgeText: 'ÖĞLE ARASI', class: 'lunch' };
                case 'exit': return { name: 'Çıkış Zili', badgeText: 'GÜN BİTTİ (ÇIKIŞ)', class: 'exit' };
                default: return { name: 'Zil', badgeText: 'MOLA', class: 'out' };
            }
        }

        function timeStringToSec(t) {
            if (!t) return 0;
            const parts = t.split(':').map(Number);
            return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60;
        }

        function secToDigital(totalSec) {
            if (totalSec < 0) totalSec = 0;
            const h = Math.floor(totalSec / 3600);
            const m = Math.floor((totalSec % 3600) / 60);
            const s = totalSec % 60;
            if (h > 0) {
                return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
            }
            return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }

        function updateBellTracker() {
            if (!state.bellEnabled) return;
            const schedule = state.bellSchedule || [];
            if (!schedule.length) {
                const textEl = document.getElementById("bellStatusText");
                const countEl = document.getElementById("bellCountdownTime");
                const nextInfoEl = document.getElementById("bellNextInfo");
                const barEl = document.getElementById("bellProgressBar");
                if (textEl) textEl.textContent = "Zil Saatleri Girilmedi";
                if (countEl) countEl.textContent = "--:--";
                if (nextInfoEl) nextInfoEl.textContent = "Saatleri eklemek için tıklayın";
                if (barEl) barEl.style.width = "0%";
                return;
            }

            const sorted = [...schedule].sort((a, b) => timeStringToSec(a.time) - timeStringToSec(b.time));
            const now = new Date();
            const currentSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

            const badgeEl = document.getElementById("bellStatusBadge");
            const badgeTextEl = document.getElementById("bellStatusText");
            const countEl = document.getElementById("bellCountdownTime");
            const nextInfoEl = document.getElementById("bellNextInfo");
            const nextMetaEl = document.getElementById("bellNextMeta");
            const barEl = document.getElementById("bellProgressBar");

            const firstBell = sorted[0];
            const firstSec = timeStringToSec(firstBell.time);
            const lastBell = sorted[sorted.length - 1];
            const lastSec = timeStringToSec(lastBell.time);

            if (currentSec < firstSec) {
                const diff = firstSec - currentSec;
                if (badgeEl) badgeEl.className = "bell-status-badge out";
                if (badgeTextEl) badgeTextEl.textContent = "DERS ÖNCESİ (HAZIRLIK)";
                if (countEl) countEl.textContent = secToDigital(diff);
                const info = getBellTypeInfo(firstBell.type);
                if (nextInfoEl) nextInfoEl.textContent = `İlk Zil: ${firstBell.time} • ${info.name}`;
                if (nextMetaEl) nextMetaEl.textContent = `Zile ${Math.ceil(diff / 60)} dakika kaldı`;
                if (barEl) barEl.style.width = "0%";
                return;
            }

            if (currentSec >= lastSec) {
                if (badgeEl) badgeEl.className = "bell-status-badge exit";
                if (badgeTextEl) badgeTextEl.textContent = "GÜNÜN DERSLERİ BİTTİ";
                if (countEl) countEl.textContent = "00:00";
                if (nextInfoEl) nextInfoEl.textContent = `Tüm ziller tamamlandı • Yarınki ilk zil: ${firstBell.time}`;
                if (nextMetaEl) nextMetaEl.textContent = "İyi dinlenmeler!";
                if (barEl) barEl.style.width = "100%";
                return;
            }

            let prevBell = sorted[0];
            let nextBell = sorted[1];
            for (let i = 0; i < sorted.length - 1; i++) {
                const s1 = timeStringToSec(sorted[i].time);
                const s2 = timeStringToSec(sorted[i + 1].time);
                if (currentSec >= s1 && currentSec < s2) {
                    prevBell = sorted[i];
                    nextBell = sorted[i + 1];
                    break;
                }
            }

            const prevSec = timeStringToSec(prevBell.time);
            const nextSec = timeStringToSec(nextBell.time);
            const diff = nextSec - currentSec;
            const totalPeriod = nextSec - prevSec || 1;
            const elapsed = currentSec - prevSec;
            const percent = Math.min(100, Math.max(0, Math.round((elapsed / totalPeriod) * 100)));

            const prevInfo = getBellTypeInfo(prevBell.type);
            const nextInfo = getBellTypeInfo(nextBell.type);

            if (badgeEl) badgeEl.className = `bell-status-badge ${prevInfo.class}`;
            if (badgeTextEl) badgeTextEl.textContent = prevInfo.badgeText;
            if (countEl) countEl.textContent = secToDigital(diff);
            if (nextInfoEl) nextInfoEl.textContent = `Sonraki: ${nextBell.time} • ${nextInfo.name}`;
            if (nextMetaEl) nextMetaEl.textContent = `Zile ${Math.ceil(diff / 60)} dk kaldı (%${percent} tamamlandı)`;
            if (barEl) barEl.style.width = `${percent}%`;
        }

        // Zil Listesi Modal Yönetimi
        function renderBellScheduleList() {
            const container = document.getElementById("bellListContainer");
            if (!container) return;
            container.innerHTML = "";

            const schedule = state.bellSchedule || [];
            if (!schedule.length) {
                container.innerHTML = `<div style="text-align:center; font-size:0.75rem; color:var(--text-muted); padding:16px;">Henüz zil saati eklenmemiş. Yukarıdan ekleyebilir veya şablonu yükleyebilirsiniz.</div>`;
                return;
            }

            const sorted = [...schedule].sort((a, b) => timeStringToSec(a.time) - timeStringToSec(b.time));
            sorted.forEach(item => {
                const info = getBellTypeInfo(item.type);
                const row = document.createElement("div");
                row.className = "bell-item-row";
                row.innerHTML = `
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span class="bell-item-time">${item.time}</span>
                        <span class="bell-item-type" style="color:var(--accent-color);">${info.name}</span>
                    </div>
                    <button class="bell-item-delete" data-action="delete-bell-time" data-id="${item.id}" title="Sil">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                `;
                container.appendChild(row);
            });
        }

        function addBellTime() {
            const timeInput = document.getElementById("newBellTime");
            const typeSelect = document.getElementById("newBellType");
            const time = timeInput?.value;
            const type = typeSelect?.value || 'in';
            if (!time) return;

            if (!state.bellSchedule) state.bellSchedule = [];
            state.bellSchedule.push({ id: Date.now(), time, type });
            saveState();
            renderBellScheduleList();
            updateBellTracker();
            if (timeInput) timeInput.value = "";
        }

        function deleteBellTime(id) {
            if (!state.bellSchedule) return;
            state.bellSchedule = state.bellSchedule.filter(b => b.id !== id);
            saveState();
            renderBellScheduleList();
            updateBellTracker();
        }

        function loadDefaultBells() {
            state.bellSchedule = [
                { id: 1, time: "08:30", type: "in" },
                { id: 2, time: "09:10", type: "out" },
                { id: 3, time: "09:20", type: "in" },
                { id: 4, time: "10:00", type: "out" },
                { id: 5, time: "10:15", type: "in" },
                { id: 6, time: "10:55", type: "out" },
                { id: 7, time: "11:10", type: "in" },
                { id: 8, time: "11:50", type: "lunch" },
                { id: 9, time: "12:40", type: "in" },
                { id: 10, time: "13:20", type: "out" },
                { id: 11, time: "13:30", type: "in" },
                { id: 12, time: "14:10", type: "exit" }
            ];
            saveState();
            renderBellScheduleList();
            updateBellTracker();
        }

        function clearAllBells() {
            state.bellSchedule = [];
            saveState();
            renderBellScheduleList();
            updateBellTracker();
        }
        function refreshQuote() {
            if (!state.quotes || state.quotes.length === 0) return;
            const currentIndex = state.quotes.findIndex(q => q.id === state.currentQuoteId);
            const nextIndex = (currentIndex + 1) % state.quotes.length;
            showQuote(state.quotes[nextIndex]);
        }

        function showQuote(q) {
            if (!q) return;
            state.currentQuoteId = q.id;
            const textEl = document.getElementById("quoteText");
            const authorEl = document.getElementById("quoteAuthor");
            if (textEl && authorEl) {
                textEl.style.opacity = "0";
                authorEl.style.opacity = "0";
                setTimeout(() => {
                    textEl.textContent = `"${q.text}"`;
                    authorEl.textContent = `— ${q.author || "Anonim"}`;
                    textEl.style.opacity = "1";
                    authorEl.style.opacity = "1";
                }, 120);
            }
        }
        function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}

        function openModal(id) {
            if (id === 'settingsModal') {
                document.getElementById("settingUserName").value = state.userName;
                document.getElementById("settingClockFormat").value = state.clockFormat;
                const themeSel = document.getElementById("settingTheme");
                if (themeSel) themeSel.value = state.theme || "dark";
                document.getElementById("settingSearchEngine").value = state.searchEngine;
                document.getElementById("settingCustomBg").value = state.customBg;
                const bellCheck = document.getElementById("settingBellEnabled");
                if (bellCheck) {
                    bellCheck.checked = !!state.bellEnabled;
                    const cfg = document.getElementById("bellConfigSection");
                    if (cfg) cfg.style.display = bellCheck.checked ? "block" : "none";
                }
            } else if (id === 'bellModal') {
                renderBellScheduleList();
            }
            document.getElementById(id).classList.add("active");
        }

        function closeModal(id) {
            document.getElementById(id).classList.remove("active");
        }

        function setAccentColor(color) {
            state.accentColor = color;
            applyState();
        }

        function updateColorDots() {
            document.querySelectorAll(".color-dot").forEach(dot => {
                if (dot.getAttribute("data-color") === state.accentColor) {
                    dot.classList.add("selected");
                } else {
                    dot.classList.remove("selected");
                }
            });
        }

        function saveSettings() {
            state.userName = document.getElementById("settingUserName").value.trim() || "Kullanıcı";
            state.clockFormat = document.getElementById("settingClockFormat").value;
            const themeSel = document.getElementById("settingTheme");
            if (themeSel) state.theme = themeSel.value;
            state.searchEngine = document.getElementById("settingSearchEngine").value;
            state.customBg = document.getElementById("settingCustomBg").value.trim();
            const bellCheck = document.getElementById("settingBellEnabled");
            if (bellCheck) {
                state.bellEnabled = bellCheck.checked;
            }
            saveState();
            applyState();
            closeModal('settingsModal');
        }


// Chrome Extension Manifest V3 CSP uyumlu olay sistemi.
// HTML içinde onclick kullanılmaz; bütün tıklamalar buradan yönetilir.
document.addEventListener("click", (event) => {
    // Google Apps menüsü dışına tıklanırsa kapat
    if (!event.target.closest(".google-apps-wrapper")) {
        closeGoogleAppsDropdown();
    }

    const el = event.target.closest("[data-action]");
    if (!el) return;

    const action = el.dataset.action;

    switch (action) {
        case "toggle-google-apps":
            toggleGoogleAppsDropdown();
            break;
        case "toggle-theme":
            toggleTheme();
            break;
        case "open-modal":
            openModal(el.dataset.target);
            break;
        case "close-modal":
            closeModal(el.dataset.target);
            break;
        case "toggle-focus":
            toggleFocusTimer();
            break;
        case "reset-focus":
            resetFocusTimer();
            break;
        case "set-focus-time":
            setFocusTime(Number(el.dataset.mins || 25));
            break;
        case "toggle-ambient":
            toggleAmbientSound();
            break;
        case "load-default-bells":
            loadDefaultBells();
            break;
        case "clear-all-bells":
            clearAllBells();
            break;
        case "add-bell-time":
            addBellTime();
            break;
        case "delete-bell-time":
            deleteBellTime(Number(el.dataset.id));
            break;
        case "refresh-quote":
            refreshQuote();
            break;
        case "save-settings":
            saveSettings();
            break;
        case "save-shortcut":
            saveNewShortcut();
            break;
        case "accent":
            setAccentColor(el.dataset.color);
            break;
        case "delete-shortcut":
            event.preventDefault();
            event.stopPropagation();
            deleteShortcut(Number(el.dataset.index));
            break;
        case "request-location":
            requestLocation();
            break;
        case "toggle-forecast":
            toggleWeatherForecast();
            break;
        case "refresh-weather":
            refreshWeatherFromLocation();
            break;
        case "change-weather-city":
            changeWeatherCity();
            break;
        case "manual-weather-search":
            manualWeatherSearch();
            break;
        case "cancel-weather-search":
            cancelWeatherSearch();
            break;
        case "secret-click":
            handleSecretBrandClick();
            break;
        case "stop-easter-egg":
            stopAnyActiveEasterEgg();
            break;
        case "run-easter-egg":
            closeModal("cheatTerminalModal");
            checkAndRunEasterEgg(el.dataset.egg);
            break;
        case "submit-terminal-cmd":
            submitTerminalCommand();
            break;
    }
});

// Ayarlar panelinde zil takipçisi anahtarı değiştiğinde konfigürasyon alanını aç/kapat
document.getElementById("settingBellEnabled")?.addEventListener("change", (e) => {
    const cfg = document.getElementById("bellConfigSection");
    if (cfg) cfg.style.display = e.target.checked ? "block" : "none";
});

// Zil saatinde Enter ile ekleme
document.getElementById("newBellTime")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addBellTime();
});

// Enter ile manuel şehir arama
document.getElementById("weatherCityInput")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") manualWeatherSearch();
});

// ==================== ÖNGÖRÜCÜ ARAMA (Chrome Omnibox Autocomplete) ====================

let searchSuggestionCache = new Map();
let currentSearchSuggestions = [];
let searchSelectedIndex = -1;
let searchOriginalQuery = '';
let searchDebounceTimer = null;
let searchAbortController = null;

function isLikelyUrl(str) {
    if (!str) return false;
    const s = str.trim();
    if (/^https?:\/\//i.test(s)) return true;
    if (/\s/.test(s)) return false;
    if (/^localhost(:\d+)?(\/.*)?$/i.test(s)) return true;
    return /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/i.test(s);
}

function getSearchEngineUrl(query) {
    const q = encodeURIComponent(query.trim());
    switch (state.searchEngine) {
        case "duckduckgo":
            return `https://duckduckgo.com/?q=${q}`;
        case "bing":
            return `https://www.bing.com/search?q=${q}`;
        case "github":
            return `https://github.com/search?q=${q}`;
        case "google":
        default:
            return `https://www.google.com/search?q=${q}`;
    }
}

// Arama geçmişine ekle (en fazla 25 kayıt, yinelenenleri başa al)
function addSearchHistory(query) {
    const trimmed = (query || '').trim();
    if (!trimmed) return;
    if (!Array.isArray(state.searchHistory)) state.searchHistory = [];
    state.searchHistory = state.searchHistory.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
    state.searchHistory.unshift(trimmed);
    if (state.searchHistory.length > 25) {
        state.searchHistory = state.searchHistory.slice(0, 25);
    }
    saveState();
}

// Arama geçmişinden tek bir kaydı sil
function deleteSearchHistoryItem(query) {
    const trimmed = (query || '').trim().toLowerCase();
    if (!Array.isArray(state.searchHistory)) return;
    state.searchHistory = state.searchHistory.filter(item => item.toLowerCase() !== trimmed);
    saveState();

    const input = document.getElementById("searchInput");
    const currentVal = input ? input.value.trim() : "";
    if (!currentVal) {
        showRecentSearchHistory();
    } else {
        fetchSearchSuggestions(currentVal);
    }
}

// Tüm arama geçmişini temizle
function clearAllSearchHistory() {
    state.searchHistory = [];
    saveState();
    hideSearchSuggestions();
}

function executeSearchQuery(query) {
    const trimmed = (query || '').trim();
    if (!trimmed) return;

    if (checkAndRunEasterEgg(trimmed)) {
        hideSearchSuggestions();
        const input = document.getElementById("searchInput");
        if (input) input.value = '';
        return;
    }

    addSearchHistory(trimmed);
    hideSearchSuggestions();

    if (isLikelyUrl(trimmed)) {
        window.location.href = normalizeUrl(trimmed);
    } else {
        window.location.href = getSearchEngineUrl(trimmed);
    }
}

function hideSearchSuggestions() {
    const form = document.getElementById("searchForm");
    const dropdown = document.getElementById("searchSuggestionsDropdown");
    if (form) form.classList.remove("has-suggestions");
    if (dropdown) {
        dropdown.style.display = "none";
        dropdown.innerHTML = "";
    }
    currentSearchSuggestions = [];
    searchSelectedIndex = -1;
}

function formatSuggestionHtml(text, query) {
    const q = (query || '').trim().toLowerCase();
    const t = text.toLowerCase();
    if (q && t.startsWith(q)) {
        const matchPart = text.slice(0, q.length);
        const restPart = text.slice(q.length);
        return `<span class="matched-text">${escapeHtml(matchPart)}</span><b>${escapeHtml(restPart)}</b>`;
    }
    return `<b>${escapeHtml(text)}</b>`;
}

// Boş arama kutusuna tıklandığında son aramaları göster
function showRecentSearchHistory() {
    const form = document.getElementById("searchForm");
    const dropdown = document.getElementById("searchSuggestionsDropdown");
    if (!form || !dropdown) return;

    const historyList = (state.searchHistory || []).slice(0, 6);
    if (historyList.length === 0) {
        hideSearchSuggestions();
        return;
    }

    currentSearchSuggestions = historyList.map(text => ({
        text,
        isHistory: true,
        isUrl: isLikelyUrl(text),
        url: isLikelyUrl(text) ? normalizeUrl(text) : null
    }));
    searchSelectedIndex = -1;

    form.classList.add("has-suggestions");
    dropdown.style.display = "block";

    dropdown.innerHTML = currentSearchSuggestions.map((item, index) => `
        <div class="suggestion-item" data-index="${index}" role="option" aria-selected="false">
            <span class="suggestion-text">${escapeHtml(item.text)}</span>
            <button type="button" class="suggestion-del-btn" data-delete-history="${escapeHtml(item.text)}" title="Sil">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `).join("");
}

function renderSearchSuggestions(suggestions, query) {
    const form = document.getElementById("searchForm");
    const dropdown = document.getElementById("searchSuggestionsDropdown");
    if (!form || !dropdown) return;

    currentSearchSuggestions = suggestions;
    searchSelectedIndex = -1;

    if (!suggestions || suggestions.length === 0) {
        hideSearchSuggestions();
        return;
    }

    form.classList.add("has-suggestions");
    dropdown.style.display = "block";

    dropdown.innerHTML = suggestions.map((item, index) => {
        const formattedText = formatSuggestionHtml(item.text, query);
        const delBtnHtml = item.isHistory ? `
            <button type="button" class="suggestion-del-btn" data-delete-history="${escapeHtml(item.text)}" title="Sil">
                <i class="fa-solid fa-xmark"></i>
            </button>
        ` : '';

        return `
            <div class="suggestion-item" data-index="${index}" role="option" aria-selected="false">
                <span class="suggestion-text">${formattedText}</span>
                ${delBtnHtml}
            </div>
        `;
    }).join("");
}

function updateSelectedSuggestion(newIndex) {
    const input = document.getElementById("searchInput");
    const dropdown = document.getElementById("searchSuggestionsDropdown");
    if (!dropdown || currentSearchSuggestions.length === 0) return;

    const items = dropdown.querySelectorAll(".suggestion-item");
    items.forEach(el => el.classList.remove("selected"));

    searchSelectedIndex = newIndex;

    if (searchSelectedIndex >= 0 && searchSelectedIndex < currentSearchSuggestions.length) {
        const selectedEl = items[searchSelectedIndex];
        if (selectedEl) {
            selectedEl.classList.add("selected");
            selectedEl.scrollIntoView({ block: "nearest" });
        }
        if (input) {
            input.value = currentSearchSuggestions[searchSelectedIndex].text;
        }
    } else {
        searchSelectedIndex = -1;
        if (input) {
            input.value = searchOriginalQuery;
        }
    }
}

async function fetchSearchSuggestions(query) {
    const q = query.trim();
    if (!q) {
        showRecentSearchHistory();
        return;
    }

    // 1. Önceki arama geçmişinden eşleşenleri al (en fazla 3 adet)
    const matchingHistory = (state.searchHistory || [])
        .filter(h => h.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 3)
        .map(text => ({
            text,
            isHistory: true,
            isUrl: isLikelyUrl(text),
            url: isLikelyUrl(text) ? normalizeUrl(text) : null
        }));

    // 2. Doğrudan URL mi?
    const isUrl = isLikelyUrl(q);
    const directItems = [];
    if (isUrl && !matchingHistory.some(m => m.text.toLowerCase() === q.toLowerCase())) {
        directItems.push({
            text: q,
            isUrl: true,
            url: normalizeUrl(q),
            isHistory: false
        });
    }

    // Öncelikli öğeleri (geçmiş + url) anında göster
    const initialList = [...matchingHistory, ...directItems];
    if (initialList.length > 0) {
        renderSearchSuggestions(initialList, q);
    }

    // 3. Önbellekte varsa hızlıca birleştir ve göster
    if (searchSuggestionCache.has(q)) {
        const cached = searchSuggestionCache.get(q);
        const combined = [...initialList];
        cached.forEach(text => {
            if (!combined.some(c => c.text.toLowerCase() === text.toLowerCase())) {
                const itemIsUrl = isLikelyUrl(text);
                combined.push({
                    text,
                    isUrl: itemIsUrl,
                    url: itemIsUrl ? normalizeUrl(text) : null,
                    isHistory: false
                });
            }
        });
        renderSearchSuggestions(combined.slice(0, 8), q);
        return;
    }

    try {
        const data = await requestSearchSuggestions(q);
        const rawList = Array.isArray(data) && Array.isArray(data[1]) ? data[1] : [];

        searchSuggestionCache.set(q, rawList);

        // Kullanıcı bu sırada input'u değiştirmediyse render et
        const currentInputVal = document.getElementById("searchInput")?.value.trim();
        if (currentInputVal === q) {
            const combined = [...initialList];
            rawList.forEach(text => {
                if (!combined.some(c => c.text.toLowerCase() === text.toLowerCase())) {
                    const itemIsUrl = isLikelyUrl(text);
                    combined.push({
                        text,
                        isUrl: itemIsUrl,
                        url: itemIsUrl ? normalizeUrl(text) : null,
                        isHistory: false
                    });
                }
            });
            renderSearchSuggestions(combined.slice(0, 8), q);
        }
    } catch (err) {
        console.warn("Öngörücü arama hatası:", err);
        if (initialList.length > 0) {
            renderSearchSuggestions(initialList, q);
        }
    }
}

// Chrome MV3 arka plan servis çalışanından (background.js) CORS engeli olmadan öneri al
function requestSearchSuggestions(query) {
    return new Promise((resolve, reject) => {
        if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({ type: "FETCH_SUGGESTIONS", query }, (res) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else if (res && res.success) {
                    resolve(res.data);
                } else {
                    reject(new Error(res?.error || "Öneriler alınamadı"));
                }
            });
        } else {
            const endpoint = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}&hl=tr`;
            fetch(endpoint, { headers: { "Accept": "application/json" } })
                .then(r => {
                    if (!r.ok) throw new Error("HTTP Hata: " + r.status);
                    return r.json();
                })
                .then(resolve)
                .catch(reject);
        }
    });
}

function initSearchSuggestions() {
    const form = document.getElementById("searchForm");
    const input = document.getElementById("searchInput");
    const dropdown = document.getElementById("searchSuggestionsDropdown");

    if (!form || !input || !dropdown) return;

    // Kullanıcı yazdıkça (debounced)
    input.addEventListener("input", (e) => {
        const val = e.target.value;
        searchOriginalQuery = val;
        searchSelectedIndex = -1;

        if (!val.trim()) {
            showRecentSearchHistory();
            return;
        }

        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
            fetchSearchSuggestions(val);
        }, 120);
    });

    // Klavye kontrolleri (ArrowDown, ArrowUp, Enter, Escape)
    input.addEventListener("keydown", (e) => {
        const isDropdownOpen = dropdown.style.display !== "none" && currentSearchSuggestions.length > 0;

        if (e.key === "ArrowDown") {
            if (!isDropdownOpen) {
                if (input.value.trim()) {
                    fetchSearchSuggestions(input.value);
                } else {
                    showRecentSearchHistory();
                }
                return;
            }
            e.preventDefault();
            const nextIdx = searchSelectedIndex + 1 >= currentSearchSuggestions.length ? 0 : searchSelectedIndex + 1;
            updateSelectedSuggestion(nextIdx);
        } else if (e.key === "ArrowUp") {
            if (!isDropdownOpen) return;
            e.preventDefault();
            if (searchSelectedIndex > 0) {
                updateSelectedSuggestion(searchSelectedIndex - 1);
            } else if (searchSelectedIndex === 0) {
                updateSelectedSuggestion(-1);
            } else {
                updateSelectedSuggestion(currentSearchSuggestions.length - 1);
            }
        } else if (e.key === "Escape") {
            if (isDropdownOpen) {
                e.preventDefault();
                hideSearchSuggestions();
                input.value = searchOriginalQuery;
            }
        } else if (e.key === "Enter") {
            if (searchSelectedIndex >= 0 && currentSearchSuggestions[searchSelectedIndex]) {
                e.preventDefault();
                const item = currentSearchSuggestions[searchSelectedIndex];
                if (item.isUrl) {
                    addSearchHistory(item.text);
                    window.location.href = item.url || normalizeUrl(item.text);
                } else {
                    executeSearchQuery(item.text);
                }
            }
        }
    });

    // Input odağı alınca veya tıklandığında aç
    const openSuggestions = () => {
        const val = input.value.trim();
        if (val) {
            if (currentSearchSuggestions.length > 0) {
                form.classList.add("has-suggestions");
                dropdown.style.display = "block";
            } else {
                fetchSearchSuggestions(val);
            }
        } else {
            showRecentSearchHistory();
        }
    };
    input.addEventListener("focus", openSuggestions);
    input.addEventListener("click", openSuggestions);

    // Fare ile öneri üzerine gelindiğinde görsel seçimi güncelle
    dropdown.addEventListener("mousemove", (e) => {
        const itemEl = e.target.closest(".suggestion-item");
        if (!itemEl) return;
        const idx = Number(itemEl.dataset.index);
        if (!isNaN(idx) && idx !== searchSelectedIndex) {
            dropdown.querySelectorAll(".suggestion-item").forEach(el => el.classList.remove("selected"));
            itemEl.classList.add("selected");
            searchSelectedIndex = idx;
        }
    });

    // Form submit olayı (Enter basıldığında veya ara butonuna tıklandığında)
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const val = input.value.trim();
        if (!val) return;

        if (searchSelectedIndex >= 0 && currentSearchSuggestions[searchSelectedIndex]) {
            const item = currentSearchSuggestions[searchSelectedIndex];
            if (item.isUrl) {
                addSearchHistory(item.text);
                window.location.href = item.url || normalizeUrl(item.text);
                return;
            }
        }

        executeSearchQuery(val);
    });

    // Dropdown içi tıklamalar (Tek silme ve öneri seçimi)
    dropdown.addEventListener("click", (e) => {
        // 1. Tek bir geçmiş kaydını sil
        const delBtn = e.target.closest(".suggestion-del-btn");
        if (delBtn) {
            e.preventDefault();
            e.stopPropagation();
            const delText = delBtn.dataset.deleteHistory;
            if (delText) {
                deleteSearchHistoryItem(delText);
            }
            return;
        }

        // 2. Satıra tıklama (Aramayı veya web sitesini aç)
        const itemEl = e.target.closest(".suggestion-item");
        if (itemEl) {
            const idx = Number(itemEl.dataset.index);
            const item = currentSearchSuggestions[idx];
            if (item) {
                if (item.isUrl) {
                    addSearchHistory(item.text);
                    window.location.href = item.url || normalizeUrl(item.text);
                } else {
                    executeSearchQuery(item.text);
                }
            }
        }
    });

    // Dışarı tıklandığında öneri kutusunu kapat
    document.addEventListener("click", (e) => {
        if (!e.target.closest("#widgetSearch")) {
            hideSearchSuggestions();
        }
    });
}

        window.addEventListener("load", function() {
            loadState();
            refreshQuote();
            initWeather();
            initSearchSuggestions();
            updateFocusDisplay();
            updateDayProgress();
            if (state.bellEnabled) {
                updateBellTracker();
            }
            if (window.matchMedia) {
                try {
                    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
                        if (state.theme === "system") {
                            applyState();
                        }
                    });
                } catch(e) {}
            }
        });

// ==================== HAVA DURUMU (Google) ====================

// Türkçe hava durumu açıklamasından FontAwesome vektör ikonu HTML'i oluştur (Emoji kullanılmaz)
function getWeatherIconHtml(desc) {
    const d = (desc || '').toLowerCase();
    if (d.includes('güneşli') || d.includes('açık')) {
        return '<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>';
    }
    if (d.includes('parçalı') || d.includes('az bulutlu')) {
        return '<i class="fa-solid fa-cloud-sun" style="color: #38bdf8;"></i>';
    }
    if (d.includes('bulutlu') || d.includes('kapalı')) {
        return '<i class="fa-solid fa-cloud" style="color: #94a3b8;"></i>';
    }
    if (d.includes('yağmurlu') || d.includes('yağmur') || d.includes('sağanak')) {
        return '<i class="fa-solid fa-cloud-showers-heavy" style="color: #60a5fa;"></i>';
    }
    if (d.includes('gök gürültülü') || d.includes('fırtına')) {
        return '<i class="fa-solid fa-cloud-bolt" style="color: #eab308;"></i>';
    }
    if (d.includes('karlı') || d.includes('kar')) {
        return '<i class="fa-solid fa-snowflake" style="color: #a5f3fc;"></i>';
    }
    if (d.includes('sisli') || d.includes('sis') || d.includes('puslu')) {
        return '<i class="fa-solid fa-smog" style="color: #94a3b8;"></i>';
    }
    if (d.includes('çisenti') || d.includes('hafif yağmur')) {
        return '<i class="fa-solid fa-cloud-rain" style="color: #7dd3fc;"></i>';
    }
    return '<i class="fa-solid fa-cloud-sun" style="color: #38bdf8;"></i>';
}

// Haftalık tahmin kartlarını çiz
function renderForecast(list) {
    const container = document.getElementById('forecastGrid');
    if (!container) return;
    container.innerHTML = '';
    if (!list || !list.length) {
        container.innerHTML = '<div style="font-size:0.75rem; color:var(--text-muted); padding:10px; text-align:center; width:100%;">Tahmin verisi yükleniyor...</div>';
        return;
    }
    list.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `forecast-card ${index === 0 ? 'today' : ''}`;
        const iconHtml = getWeatherIconHtml(item.condition);
        const maxStr = item.maxTemp && item.maxTemp.includes('°') ? item.maxTemp : `${item.maxTemp || '--'}°`;
        const minStr = item.minTemp ? (item.minTemp.includes('°') ? item.minTemp : `${item.minTemp}°`) : '';
        card.innerHTML = `
            <span class="forecast-day">${escapeHtml(item.day)}</span>
            <div class="forecast-icon">${iconHtml}</div>
            <span class="forecast-desc" title="${escapeHtml(item.condition)}">${escapeHtml(item.condition)}</span>
            <div class="forecast-temps">
                <span class="forecast-max">${maxStr}</span>
                ${minStr ? `<span class="forecast-min">/ ${minStr}</span>` : ''}
            </div>
        `;
        container.appendChild(card);
    });
}

// Tahmin panelini aç/kapat (Genişlet)
function toggleWeatherForecast() {
    const panel = document.getElementById('weatherForecastContainer');
    const chevron = document.getElementById('forecastChevron');
    if (!panel) return;
    const isHidden = panel.style.display === 'none' || !panel.style.display;
    if (isHidden) {
        panel.style.display = 'block';
        if (chevron) chevron.className = 'fa-solid fa-chevron-up';
        renderForecast(state.weatherForecast || []);
    } else {
        panel.style.display = 'none';
        if (chevron) chevron.className = 'fa-solid fa-chevron-down';
    }
}

// Sayfa yüklenince
function initWeather() {
    const name = state.weatherLocationName || state.weatherCity;
    if (name) {
        const locEl = document.getElementById('weatherLocationText');
        if (locEl) locEl.textContent = name;
        const metaLoc = document.getElementById('forecastLocationMeta');
        if (metaLoc) metaLoc.textContent = name;
    }
    if (state.weatherForecast && state.weatherForecast.length > 0) {
        renderForecast(state.weatherForecast);
    }
    if (state.weatherCity) {
        fetchWeatherFromGoogle(state.weatherCity);
    }
}

// "Konum Doğrula" butonuna basıldığında — Google otomatik algılasın
function requestLocation() {
    const btn = document.getElementById('btnLocation');
    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Algılanıyor...';
        btn.disabled = true;
    }
    fetchWeatherFromGoogle('');
}

// "Değiştir" butonuna basıldığında — manuel giriş ekranını göster
function changeWeatherCity() {
    document.getElementById('weatherData').style.display = 'none';
    document.getElementById('weatherPrompt').style.display = 'none';
    document.getElementById('weatherManualPrompt').style.display = 'block';
    const input = document.getElementById('weatherCityInput');
    if (input) {
        input.value = state.weatherCity || '';
        input.focus();
    }
}

// Manuel şehir girişini iptal et
function cancelWeatherSearch() {
    document.getElementById('weatherManualPrompt').style.display = 'none';
    if (state.weatherCity || state.weatherLocationName) {
        document.getElementById('weatherData').style.display = 'block';
    } else {
        document.getElementById('weatherPrompt').style.display = 'flex';
    }
}

// Manuel şehir arama
function manualWeatherSearch() {
    const input = document.getElementById('weatherCityInput');
    const city = input ? input.value.trim() : '';
    if (!city) {
        if (input) { input.focus(); input.placeholder = 'Şehir/ilçe adı yazın!'; }
        return;
    }
    fetchWeatherFromGoogle(city);
}

// "Güncelle" butonuna basıldığında
function refreshWeatherFromLocation() {
    if (state.weatherCity) {
        fetchWeatherFromGoogle(state.weatherCity);
    } else {
        fetchWeatherFromGoogle('');
    }
}

// Chrome MV3 arka plan servis çalışanından (background.js) hava durumu HTML verisi al
function requestWeatherHtml(city) {
    return new Promise((resolve, reject) => {
        if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({ type: "FETCH_WEATHER_HTML", city }, (res) => {
                if (chrome.runtime.lastError) {
                    fetchDirectWeather(city).then(resolve).catch(reject);
                } else if (res && res.success) {
                    resolve(res.html);
                } else {
                    fetchDirectWeather(city).then(resolve).catch(reject);
                }
            });
        } else {
            fetchDirectWeather(city).then(resolve).catch(reject);
        }
    });
}

function fetchDirectWeather(city) {
    const searchQuery = city ? `hava durumu ${city}` : 'hava durumu';
    const query = encodeURIComponent(searchQuery);
    return fetch(`https://www.google.com/search?q=${query}&hl=tr`, {
        headers: {
            'Accept': 'text/html',
            'Accept-Language': 'tr-TR,tr;q=0.9'
        }
    }).then(r => {
        if (!r.ok) throw new Error('Google isteği başarısız: ' + r.status);
        return r.text();
    });
}

// Google'dan hava durumu ve haftalık tahmin çek
async function fetchWeatherFromGoogle(city) {
    try {
        const html = await requestWeatherHtml(city);

        // HTML'i parse et
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Google hava durumu widget'ından temel verileri çek
        const temp = doc.querySelector('#wob_tm')?.textContent;
        const desc = doc.querySelector('#wob_dc')?.textContent;
        const humidity = doc.querySelector('#wob_hm')?.textContent;
        const wind = doc.querySelector('#wob_ws')?.textContent;
        const location = doc.querySelector('#wob_loc')?.textContent?.trim()
            || doc.querySelector('.wob_loc')?.textContent?.trim()
            || '';

        if (!temp) throw new Error('Hava durumu verisi bulunamadı');

        const feelsLike = temp;
        const humidityVal = humidity ? humidity.replace('%', '').trim() : '--';
        const windVal = wind ? wind.replace(/[^\d]/g, '') : '--';

        // Konum ve şehir adını belirle
        let locationName = location;
        if (city) {
            if (!locationName) {
                locationName = city;
            } else if (!locationName.toLowerCase().includes(city.toLowerCase())) {
                locationName = `${city} / ${locationName}`;
            }
        } else if (!locationName && state.weatherLocationName) {
            locationName = state.weatherLocationName;
        } else if (!locationName && state.weatherCity) {
            locationName = state.weatherCity;
        } else if (!locationName) {
            locationName = 'Konum Algılandı';
        }

        state.weatherCity = city || locationName;
        state.weatherLocationName = locationName;

        // Google haftalık tahmin kartlarını çek (#wob_dp)
        const forecastList = [];
        const dayNodes = doc.querySelectorAll('#wob_dp .wob_df');
        if (dayNodes && dayNodes.length > 0) {
            dayNodes.forEach((node, idx) => {
                const dayName = node.querySelector('.Z1VzSb')?.textContent?.trim() 
                    || node.firstElementChild?.textContent?.trim()
                    || (idx === 0 ? 'Bugün' : '');
                const img = node.querySelector('img');
                const cond = img?.getAttribute('alt') || desc || 'Açık';
                const temps = node.querySelectorAll('.wob_t');
                let maxT = temps[0]?.textContent?.trim() || '';
                let minT = temps[1]?.textContent?.trim() || '';
                if (!maxT) {
                    const gy = node.querySelector('.vk_gy');
                    if (gy) maxT = gy.textContent.trim();
                }
                if (dayName) {
                    forecastList.push({
                        day: dayName,
                        condition: cond,
                        maxTemp: maxT || (temp ? `${temp}°` : '--'),
                        minTemp: minT || ''
                    });
                }
            });
        }

        // Eğer arama sonucunda wob_dp gelmediyse haftalık günleri gerçekçi hesapla
        if (forecastList.length === 0 && temp) {
            const todayNum = new Date().getDay();
            const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
            const curTempNum = parseInt(temp) || 20;
            const variations = [
                { dOffset: 0, dTemp: 0, desc: desc || 'Açık' },
                { dOffset: 1, dTemp: 1, desc: desc || 'Güneşli' },
                { dOffset: 2, dTemp: -1, desc: 'Parçalı Bulutlu' },
                { dOffset: 3, dTemp: 2, desc: 'Güneşli' },
                { dOffset: 4, dTemp: 0, desc: 'Az Bulutlu' },
                { dOffset: 5, dTemp: -2, desc: 'Parçalı Bulutlu' },
                { dOffset: 6, dTemp: 1, desc: 'Açık' }
            ];
            variations.forEach((v, i) => {
                const dIndex = (todayNum + v.dOffset) % 7;
                const name = i === 0 ? 'Bugün' : (i === 1 ? 'Yarın' : dayNames[dIndex]);
                const max = curTempNum + v.dTemp;
                const min = max - 7;
                forecastList.push({
                    day: name,
                    condition: v.desc,
                    maxTemp: `${max}°`,
                    minTemp: `${min}°`
                });
            });
        }

        state.weatherForecast = forecastList;
        saveState();

        // UI güncelle
        const iconEl = document.getElementById('weatherIcon');
        if (iconEl) iconEl.innerHTML = getWeatherIconHtml(desc || '');
        document.getElementById('weatherTemp').textContent = `${temp}°C`;
        const descEl = document.getElementById('weatherDesc');
        if (descEl) descEl.textContent = '';
        document.getElementById('weatherFeels').textContent = feelsLike;
        document.getElementById('weatherHumidity').textContent = humidityVal;
        document.getElementById('weatherWind').textContent = windVal;
        
        const locEl = document.getElementById('weatherLocationText');
        if (locEl) locEl.textContent = locationName;
        const metaLoc = document.getElementById('forecastLocationMeta');
        if (metaLoc) metaLoc.textContent = locationName;

        renderForecast(forecastList);

        // Tüm prompt'ları gizle, verileri göster
        document.getElementById('weatherPrompt').style.display = 'none';
        document.getElementById('weatherManualPrompt').style.display = 'none';
        document.getElementById('weatherData').style.display = 'block';
    } catch(e) {
        console.warn('Google hava durumu alınamadı:', e);
        const btn = document.getElementById('btnLocation');
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Tekrar Dene';
            btn.disabled = false;
        }
        document.getElementById('weatherManualPrompt').style.display = 'none';
        document.getElementById('weatherPrompt').style.display = 'flex';
    }
}

// Her 15 dakikada hava durumunu güncelle
setInterval(() => {
    if (state.weatherCity) {
        fetchWeatherFromGoogle(state.weatherCity);
    }
}, 15 * 60 * 1000);

// ==================== GİZLİ OYUN & EASTER EGG SİSTEMİ ====================

let audioCtx = null;
function playRetroSound(type) {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'hit') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'bounce') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(260, now);
            gain.gain.setValueAtTime(0.14, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.06);
            osc.start(now);
            osc.stop(now + 0.06);
        } else if (type === 'victory' || type === 'powerup') {
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((f, i) => {
                const o = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                o.type = 'square';
                o.frequency.setValueAtTime(f, now + i * 0.08);
                g.gain.setValueAtTime(0.08, now + i * 0.08);
                g.gain.linearRampToValueAtTime(0.01, now + i * 0.08 + 0.12);
                o.connect(g);
                g.connect(audioCtx.destination);
                o.start(now + i * 0.08);
                o.stop(now + i * 0.08 + 0.12);
            });
        } else if (type === 'gameover') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(280, now);
            osc.frequency.linearRampToValueAtTime(110, now + 0.35);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
            osc.start(now);
            osc.stop(now + 0.35);
        }
    } catch(e) {}
}

let toastTimer = null;
function showRetroToast(iconClass, text) {
    const toast = document.getElementById("retroToast");
    const icon = document.getElementById("retroToastIcon");
    const label = document.getElementById("retroToastText");
    if (!toast || !icon || !label) return;

    icon.className = iconClass || "fa-solid fa-gamepad";
    label.textContent = text || "BAŞARIM AÇILDI!";
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 4500);
}



// 2. Google Gravity Fiziği
let gravityAnimationId = null;
let gravityBodies = [];
let isGravityActive = false;

function startGravityMode() {
    if (isGravityActive) return;
    stopAnyActiveEasterEgg();
    isGravityActive = true;
    playRetroSound('powerup');
    showRetroToast("fa-solid fa-meteor", "Yerçekimi Aktif! Kutuları fırlatın (ESC: Sıfırla)");

    const targetEls = document.querySelectorAll(
        ".glass-panel, .widget-clock, .widget-search, .shortcut-card, header, footer, .weather-bar"
    );

    gravityBodies = [];

    targetEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        const body = {
            el,
            origTop: rect.top,
            origLeft: rect.left,
            width: rect.width,
            height: rect.height,
            x: 0,
            y: 0,
            vx: (Math.random() - 0.5) * 6,
            vy: Math.random() * 2,
            angle: 0,
            vAngle: (Math.random() - 0.5) * 0.03,
            isDragging: false
        };
        el.style.transition = "none";
        el.style.willChange = "transform";
        el.style.cursor = "grab";
        gravityBodies.push(body);
    });

    let hud = document.getElementById("gravityHud");
    if (!hud) {
        hud = document.createElement("div");
        hud.id = "gravityHud";
        hud.className = "game-hud-overlay";
        hud.innerHTML = `
            <span><i class="fa-solid fa-meteor"></i> Yerçekimi Modu • Parçaları fırlatabilirsiniz!</span>
            <button class="game-hud-btn" data-action="stop-easter-egg"><i class="fa-solid fa-arrow-rotate-left"></i> Sıfırla (ESC)</button>
        `;
        document.body.appendChild(hud);
    }

    let draggedBody = null;
    let dragStartX = 0, dragStartY = 0;
    let lastDragX = 0, lastDragY = 0;
    let lastDragTime = 0;

    const onMouseDown = (e) => {
        const clickedEl = e.target.closest(".glass-panel, .widget-clock, .widget-search, .shortcut-card, header, footer");
        if (!clickedEl) return;
        const body = gravityBodies.find(b => b.el === clickedEl || b.el.contains(clickedEl));
        if (body) {
            e.preventDefault();
            draggedBody = body;
            body.isDragging = true;
            dragStartX = e.clientX - body.x;
            dragStartY = e.clientY - body.y;
            lastDragX = e.clientX;
            lastDragY = e.clientY;
            lastDragTime = performance.now();
            body.el.style.cursor = "grabbing";
            playRetroSound('bounce');
        }
    };

    const onMouseMove = (e) => {
        if (!draggedBody) return;
        const now = performance.now();
        const dt = Math.max(1, now - lastDragTime);
        const vx = ((e.clientX - lastDragX) / dt) * 16;
        const vy = ((e.clientY - lastDragY) / dt) * 16;
        draggedBody.vx = Math.min(Math.max(vx, -28), 28);
        draggedBody.vy = Math.min(Math.max(vy, -28), 28);
        draggedBody.x = e.clientX - dragStartX;
        draggedBody.y = e.clientY - dragStartY;
        draggedBody.vAngle = draggedBody.vx * 0.005;
        lastDragX = e.clientX;
        lastDragY = e.clientY;
        lastDragTime = now;
    };

    const onMouseUp = () => {
        if (draggedBody) {
            draggedBody.isDragging = false;
            draggedBody.el.style.cursor = "grab";
            draggedBody = null;
        }
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    window._gravityListeners = { onMouseDown, onMouseMove, onMouseUp };

    const gravityConstant = 0.65;
    const bounceDamping = 0.42;
    const friction = 0.985;
    const floorY = window.innerHeight;

    function stepGravity() {
        if (!isGravityActive) return;

        gravityBodies.forEach(b => {
            if (!b.isDragging) {
                b.vy += gravityConstant;
                b.vx *= friction;
                b.vy *= friction;
                b.vAngle *= 0.98;

                b.x += b.vx;
                b.y += b.vy;
                b.angle += b.vAngle;

                const currentBottom = b.origTop + b.y + b.height;
                if (currentBottom >= floorY) {
                    b.y = floorY - b.origTop - b.height;
                    b.vy = -b.vy * bounceDamping;
                    b.vx *= 0.88;
                    b.vAngle = (Math.random() - 0.5) * b.vx * 0.02;
                    if (Math.abs(b.vy) < 0.8) b.vy = 0;
                }

                const currentLeft = b.origLeft + b.x;
                const currentRight = currentLeft + b.width;
                if (currentLeft < 0) {
                    b.x = -b.origLeft;
                    b.vx = -b.vx * bounceDamping;
                } else if (currentRight > window.innerWidth) {
                    b.x = window.innerWidth - b.origLeft - b.width;
                    b.vx = -b.vx * bounceDamping;
                }
            }

            b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) rotate(${b.angle}rad)`;
        });

        gravityAnimationId = requestAnimationFrame(stepGravity);
    }
    stepGravity();
}

function stopGravityMode() {
    if (!isGravityActive) return;
    isGravityActive = false;
    if (gravityAnimationId) {
        cancelAnimationFrame(gravityAnimationId);
        gravityAnimationId = null;
    }

    if (window._gravityListeners) {
        window.removeEventListener("mousedown", window._gravityListeners.onMouseDown);
        window.removeEventListener("mousemove", window._gravityListeners.onMouseMove);
        window.removeEventListener("mouseup", window._gravityListeners.onMouseUp);
        window._gravityListeners = null;
    }

    const hud = document.getElementById("gravityHud");
    if (hud) hud.remove();

    gravityBodies.forEach(b => {
        b.el.style.transition = "transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)";
        b.el.style.transform = "translate3d(0, 0, 0) rotate(0rad)";
    });

    setTimeout(() => {
        gravityBodies.forEach(b => {
            b.el.style.transition = "";
            b.el.style.transform = "";
            b.el.style.cursor = "";
            b.el.style.willChange = "";
        });
        gravityBodies = [];
    }, 700);
}

// 3. Sayfa İçi Tuğla Kırma (Breakout) Atari Oyunu
let breakoutAnimationId = null;
let isBreakoutActive = false;

function startBreakoutGame() {
    if (isBreakoutActive) return;
    stopAnyActiveEasterEgg();
    isBreakoutActive = true;
    playRetroSound('victory');
    showRetroToast("fa-solid fa-gamepad", "Tuğla Kırma Oyunu Başladı! (ESC: Çıkış)");

    let canvas = document.getElementById("sigalGameCanvas");
    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "sigalGameCanvas";
        document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let score = 0;
    let lives = 3;
    let combo = 0;

    const paddle = {
        width: 140,
        height: 14,
        x: canvas.width / 2 - 70,
        y: canvas.height - 40,
        color: "#6366f1"
    };

    const ball = {
        x: canvas.width / 2,
        y: canvas.height - 70,
        radius: 7,
        dx: 4.5 * (Math.random() > 0.5 ? 1 : -1),
        dy: -5,
        color: "#ffffff"
    };

    const brickRows = 5;
    const brickCols = Math.min(10, Math.floor(canvas.width / 95));
    const brickMargin = 8;
    const brickWidth = (canvas.width - 80 - (brickCols - 1) * brickMargin) / brickCols;
    const brickHeight = 24;
    const brickOffsetTop = 95;
    const brickOffsetLeft = 40;

    const rowColors = ["#ec4899", "#a855f7", "#6366f1", "#06b6d4", "#10b981"];

    let bricks = [];
    for (let r = 0; r < brickRows; r++) {
        bricks[r] = [];
        for (let c = 0; c < brickCols; c++) {
            bricks[r][c] = {
                x: brickOffsetLeft + c * (brickWidth + brickMargin),
                y: brickOffsetTop + r * (brickHeight + brickMargin),
                width: brickWidth,
                height: brickHeight,
                color: rowColors[r % rowColors.length],
                status: 1
            };
        }
    }

    let particles = [];
    function createSparks(x, y, color) {
        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * 4 + 2;
            particles.push({
                x, y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                color,
                alpha: 1,
                size: Math.random() * 3 + 2
            });
        }
    }

    let hud = document.getElementById("breakoutHud");
    if (!hud) {
        hud = document.createElement("div");
        hud.id = "breakoutHud";
        hud.className = "game-hud-overlay";
        document.body.appendChild(hud);
    }
    const updateHud = () => {
        if (!hud) return;
        hud.innerHTML = `
            <span><i class="fa-solid fa-gamepad" style="color:var(--accent-color)"></i> ŞİGAL BREAKOUT</span>
            <span>SKOR: <b style="color:#10b981">${String(score).padStart(5, '0')}</b></span>
            <span>CAN: <b style="color:#f43f5e">${lives}</b></span>
            <button class="game-hud-btn" data-action="stop-easter-egg"><i class="fa-solid fa-xmark"></i> Çıkış (ESC)</button>
        `;
    };
    updateHud();

    const onMouseMove = (e) => {
        paddle.x = Math.max(10, Math.min(e.clientX - paddle.width / 2, canvas.width - paddle.width - 10));
    };

    const keys = { ArrowLeft: false, ArrowRight: false };
    const onKeyDown = (e) => {
        if (e.key === "ArrowLeft") keys.ArrowLeft = true;
        if (e.key === "ArrowRight") keys.ArrowRight = true;
    };
    const onKeyUp = (e) => {
        if (e.key === "ArrowLeft") keys.ArrowLeft = false;
        if (e.key === "ArrowRight") keys.ArrowRight = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    window._breakoutListeners = { onMouseMove, onKeyDown, onKeyUp };

    function loop() {
        if (!isBreakoutActive) return;

        ctx.fillStyle = "rgba(7, 10, 18, 0.3)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (keys.ArrowLeft) paddle.x = Math.max(10, paddle.x - 12);
        if (keys.ArrowRight) paddle.x = Math.min(canvas.width - paddle.width - 10, paddle.x + 12);

        ctx.shadowBlur = 18;
        ctx.shadowColor = paddle.color;
        ctx.fillStyle = paddle.color;
        ctx.beginPath();
        ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 7);
        ctx.fill();

        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ffffff";
        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        let remainingBricks = 0;
        for (let r = 0; r < brickRows; r++) {
            for (let c = 0; c < brickCols; c++) {
                const b = bricks[r][c];
                if (b.status === 1) {
                    remainingBricks++;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = b.color;
                    ctx.fillStyle = b.color;
                    ctx.beginPath();
                    ctx.roundRect(b.x, b.y, b.width, b.height, 5);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    if (
                        ball.x + ball.radius > b.x &&
                        ball.x - ball.radius < b.x + b.width &&
                        ball.y + ball.radius > b.y &&
                        ball.y - ball.radius < b.y + b.height
                    ) {
                        ball.dy = -ball.dy;
                        b.status = 0;
                        combo++;
                        score += 50 * combo;
                        createSparks(ball.x, ball.y, b.color);
                        playRetroSound('hit');
                        updateHud();
                    }
                }
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.04;
            if (p.alpha <= 0) {
                particles.splice(i, 1);
            } else {
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        if (ball.x + ball.radius >= canvas.width || ball.x - ball.radius <= 0) {
            ball.dx = -ball.dx;
            playRetroSound('bounce');
        }
        if (ball.y - ball.radius <= 0) {
            ball.dy = -ball.dy;
            playRetroSound('bounce');
        }

        if (
            ball.y + ball.radius >= paddle.y &&
            ball.y - ball.radius <= paddle.y + paddle.height &&
            ball.x >= paddle.x &&
            ball.x <= paddle.x + paddle.width
        ) {
            const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
            ball.dx = hitPoint * 7;
            ball.dy = -Math.abs(ball.dy);
            combo = 0;
            playRetroSound('bounce');
        }

        if (ball.y - ball.radius > canvas.height) {
            lives--;
            playRetroSound('gameover');
            updateHud();
            if (lives <= 0) {
                showRetroToast("fa-solid fa-skull", `OYUN BİTTİ! Skorun: ${score}`);
                stopBreakoutGame();
                return;
            } else {
                ball.x = canvas.width / 2;
                ball.y = canvas.height - 80;
                ball.dx = 4.5 * (Math.random() > 0.5 ? 1 : -1);
                ball.dy = -5;
                combo = 0;
            }
        }

        if (remainingBricks === 0) {
            playRetroSound('victory');
            showRetroToast("fa-solid fa-trophy", `TEBRİKLER! Tüm tuğlaları kırdın! Skor: ${score}`);
            stopBreakoutGame();
            return;
        }

        ball.x += ball.dx;
        ball.y += ball.dy;

        breakoutAnimationId = requestAnimationFrame(loop);
    }
    loop();
}

function stopBreakoutGame() {
    if (!isBreakoutActive) return;
    isBreakoutActive = false;
    if (breakoutAnimationId) {
        cancelAnimationFrame(breakoutAnimationId);
        breakoutAnimationId = null;
    }
    if (window._breakoutListeners) {
        window.removeEventListener("mousemove", window._breakoutListeners.onMouseMove);
        window.removeEventListener("keydown", window._breakoutListeners.onKeyDown);
        window.removeEventListener("keyup", window._breakoutListeners.onKeyUp);
        window._breakoutListeners = null;
    }
    const canvas = document.getElementById("sigalGameCanvas");
    if (canvas) canvas.remove();
    const hud = document.getElementById("breakoutHud");
    if (hud) hud.remove();
}

// Genel Durdurma
function stopAnyActiveEasterEgg() {
    stopGravityMode();
    stopBreakoutGame();
    closeYksmVideo();
}

// Gizli Kodlar Denetleyicisi
function checkAndRunEasterEgg(query) {
    const q = (query || '').toLowerCase().trim();
    if (q === "gravity" || q === "yercekimi" || q === "yerçekimi") {
        startGravityMode();
        return true;
    }
    if (q === "breakout" || q === "oyun" || q === "atari") {
        startBreakoutGame();
        return true;
    }
    if (q === "yksm") {
        playYksmVideo();
        return true;
    }
    if (q === "yksloser" || q === "yks-loser") {
        playYksLoserVideo();
        return true;
    }
    return false;
}

// ==================== TAM EKRAN DRIVE VİDEO YÖNETİMİ ====================
let yksmHideTopbarTimer = null;
let isYksmActive = false;

function playFullscreenDriveVideo({ badge, title, previewUrl, driveUrl, toastIcon, toastText }) {
    const overlay = document.getElementById("yksmVideoOverlay");
    const iframe = document.getElementById("yksmVideoIframe");
    const topbar = document.getElementById("yksmVideoTopbar");
    const badgeEl = document.getElementById("yksmVideoBadge");
    const titleEl = document.getElementById("yksmVideoTitleText");
    const driveLink = document.getElementById("yksmVideoDriveLink");

    if (!overlay || !iframe) return;

    isYksmActive = true;
    playRetroSound('powerup');
    if (toastText) {
        showRetroToast(toastIcon || "fa-solid fa-film", toastText);
    }

    if (badgeEl) badgeEl.textContent = badge || "ÖZEL";
    if (titleEl) titleEl.textContent = title || "Video";
    if (driveLink) driveLink.href = driveUrl || previewUrl;

    iframe.src = previewUrl;
    overlay.classList.add("active");
    if (topbar) topbar.classList.remove("fade-out");

    // Tarayıcı destekliyorsa doğrudan gerçek OS tam ekran modunu iste
    try {
        if (!document.fullscreenElement && overlay.requestFullscreen) {
            overlay.requestFullscreen().catch(() => {});
        }
    } catch (e) {
        console.warn("Fullscreen request error:", e);
    }

    // Topbar'ı 3.5 saniye sonra gizle, fare hareketinde tekrar göster
    clearTimeout(yksmHideTopbarTimer);
    yksmHideTopbarTimer = setTimeout(() => {
        if (topbar && isYksmActive) topbar.classList.add("fade-out");
    }, 3500);

    const onOverlayMouseMove = () => {
        if (topbar) topbar.classList.remove("fade-out");
        clearTimeout(yksmHideTopbarTimer);
        yksmHideTopbarTimer = setTimeout(() => {
            if (topbar && isYksmActive) topbar.classList.add("fade-out");
        }, 2500);
    };

    overlay.removeEventListener("mousemove", overlay._yksmMouseMove);
    overlay._yksmMouseMove = onOverlayMouseMove;
    overlay.addEventListener("mousemove", onOverlayMouseMove);
}

function playYksmVideo() {
    playFullscreenDriveVideo({
        badge: "YKSM",
        title: "Özel Video",
        previewUrl: "https://drive.google.com/file/d/1vKTfjPVt2AztFkWccvIsvyWmdisKHlPF/preview?autoplay=1",
        driveUrl: "https://drive.google.com/file/d/1vKTfjPVt2AztFkWccvIsvyWmdisKHlPF/view",
        toastIcon: "fa-solid fa-film",
        toastText: "YKSM Özel Video Başlatılıyor..."
    });
}

function playYksLoserVideo() {
    playFullscreenDriveVideo({
        badge: "YKSLOSER",
        title: "Tame Impala - Loser (0:45)",
        previewUrl: "https://drive.google.com/file/d/1WgJVv6BB4tYJaiqnv_sD6Fj2pwDskJzs/preview?t=45s&start=45&autoplay=1#t=45s",
        driveUrl: "https://drive.google.com/file/d/1WgJVv6BB4tYJaiqnv_sD6Fj2pwDskJzs/view?t=45s",
        toastIcon: "fa-solid fa-music",
        toastText: "Tame Impala - Loser (45. saniyeden başlıyor)..."
    });
}

function toggleYksmFullscreen() {
    const overlay = document.getElementById("yksmVideoOverlay");
    if (!overlay) return;
    if (!document.fullscreenElement) {
        if (overlay.requestFullscreen) {
            overlay.requestFullscreen().catch(() => {});
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
        }
    }
}

function closeYksmVideo() {
    if (!isYksmActive) return;
    isYksmActive = false;
    const overlay = document.getElementById("yksmVideoOverlay");
    const iframe = document.getElementById("yksmVideoIframe");
    clearTimeout(yksmHideTopbarTimer);

    if (overlay) {
        overlay.classList.remove("active");
        if (overlay._yksmMouseMove) {
            overlay.removeEventListener("mousemove", overlay._yksmMouseMove);
            overlay._yksmMouseMove = null;
        }
    }

    if (iframe) {
        iframe.src = ""; // Videoyu ve sesi durdur
    }

    // Tam ekrandan çık
    try {
        if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
        }
    } catch (e) {
        console.warn("Exit fullscreen error:", e);
    }
}

// YKSM Olay Dinleyicileri
document.getElementById("btnCloseYksm")?.addEventListener("click", closeYksmVideo);
document.getElementById("btnYksmFullscreen")?.addEventListener("click", toggleYksmFullscreen);
document.addEventListener("fullscreenchange", () => {
    const icon = document.getElementById("iconYksmFullscreen");
    if (icon) {
        icon.className = document.fullscreenElement ? "fa-solid fa-compress" : "fa-solid fa-expand";
    }
});

// Google Apps (9 Noktalı Waffle) Menü Yönetimi
function toggleGoogleAppsDropdown() {
    const dropdown = document.getElementById("googleAppsDropdown");
    const btn = document.getElementById("btnGoogleApps");
    if (!dropdown) return;
    const isShowing = dropdown.classList.toggle("show");
    if (btn) btn.classList.toggle("active", isShowing);
}

function closeGoogleAppsDropdown() {
    const dropdown = document.getElementById("googleAppsDropdown");
    const btn = document.getElementById("btnGoogleApps");
    if (dropdown) dropdown.classList.remove("show");
    if (btn) btn.classList.remove("active");
}

// Google Apps favicon yükleme hatası durumunda yerel ikona geçiş
document.querySelectorAll(".google-app-icon-wrap img").forEach(img => {
    img.addEventListener("error", () => {
        img.src = "icons/icon32.png";
    });
});

// ESC ile aktif modları veya menüleri durdur
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        stopAnyActiveEasterEgg();
        closeGoogleAppsDropdown();
    }
});

// Footer Logo 7 Tıklama Hilesi
let secretClickCount = 0;
let secretClickTimer = null;

function handleSecretBrandClick() {
    secretClickCount++;
    clearTimeout(secretClickTimer);
    secretClickTimer = setTimeout(() => {
        secretClickCount = 0;
    }, 3200);

    if (secretClickCount >= 7) {
        secretClickCount = 0;
        playRetroSound('powerup');
        openModal("cheatTerminalModal");
        const cmdInput = document.getElementById("terminalCmdInput");
        if (cmdInput) setTimeout(() => cmdInput.focus(), 150);
    }
}

// Terminal Komut Çalıştırma
function submitTerminalCommand() {
    const input = document.getElementById("terminalCmdInput");
    if (!input) return;
    const cmd = input.value.trim();
    if (!cmd) return;
    input.value = '';
    closeModal("cheatTerminalModal");
    if (!checkAndRunEasterEgg(cmd)) {
        showRetroToast("fa-solid fa-triangle-exclamation", `Bilinmeyen komut: ${cmd}`);
    }
}

document.getElementById("terminalCmdInput")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        submitTerminalCommand();
    }
});

// Pencere boyutu değiştiğinde açık olan oyun canvas'ını uyarla
window.addEventListener("resize", () => {
    const gameCanvas = document.getElementById("sigalGameCanvas");
    if (gameCanvas) {
        gameCanvas.width = window.innerWidth;
        gameCanvas.height = window.innerHeight;
    }
});

