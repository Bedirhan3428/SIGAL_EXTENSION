/**
 * Google Search Engine UI - Tailwind Edition
 */

(function () {
  'use strict';

  const GOOGLE_SEARCH_URL = 'https://www.google.com/search?q=';
  const GOOGLE_LUCKY_URL = 'https://www.google.com/search?btnI=I&q=';

  const DEFAULT_SHORTCUTS = [
    { id: '1', title: 'YouTube', url: 'https://www.youtube.com' },
    { id: '2', title: 'GitHub', url: 'https://github.com' },
    { id: '3', title: 'ChatGPT', url: 'https://chatgpt.com' },
    { id: '4', title: 'X', url: 'https://x.com' },
    { id: '5', title: 'Reddit', url: 'https://www.reddit.com' },
    { id: '6', title: 'Vikipedi', url: 'https://tr.wikipedia.org' },
    { id: '7', title: 'Gmail', url: 'https://mail.google.com' }
  ];

  // State
  let settings = Object.assign({
    openInNewTab: false,
    showShortcuts: true,
    showSchedule: true,
    aiEngine: 'google_ai'
  }, JSON.parse(localStorage.getItem('g_settings') || '{}'));

  const SCHEDULE_DATA = {
    week: [
      { num: 1, start: '12:45', end: '13:15' },
      { num: 2, start: '13:25', end: '13:55' },
      { num: 3, start: '14:05', end: '14:35' },
      { num: 4, start: '14:45', end: '15:15' },
      { num: 5, start: '15:25', end: '15:55' },
      { num: 6, start: '16:00', end: '16:30' },
      { num: 7, start: '16:35', end: '17:05' },
      { num: 8, start: '17:10', end: '17:40' }
    ],
    fri: [
      { num: 1, start: '13:05', end: '13:35' },
      { num: 2, start: '13:40', end: '14:10' },
      { num: 3, start: '14:15', end: '14:45' },
      { num: 4, start: '14:50', end: '15:20' },
      { num: 5, start: '15:25', end: '15:55' },
      { num: 6, start: '16:00', end: '16:30' },
      { num: 7, start: '16:35', end: '17:05' },
      { num: 8, start: '17:10', end: '17:40' }
    ]
  };

  // Default to google_ai if not set or previously set to perplexity
  if (!settings.aiEngine || settings.aiEngine === 'perplexity') {
    settings.aiEngine = 'google_ai';
    localStorage.setItem('g_settings', JSON.stringify(settings));
  }

  const AI_ENGINES = {
    google_ai: (q) => q ? `https://www.google.com/search?q=${encodeURIComponent(q)}&udm=50` : 'https://gemini.google.com',
    gemini: (q) => q ? `https://gemini.google.com/app` : 'https://gemini.google.com',
    perplexity: (q) => q ? `https://www.perplexity.ai/search?q=${encodeURIComponent(q)}` : 'https://www.perplexity.ai',
    chatgpt: (q) => q ? `https://chatgpt.com/?q=${encodeURIComponent(q)}` : 'https://chatgpt.com',
    claude: (q) => q ? `https://claude.ai/new?q=${encodeURIComponent(q)}` : 'https://claude.ai'
  };

  let shortcuts = JSON.parse(localStorage.getItem('g_shortcuts') || JSON.stringify(DEFAULT_SHORTCUTS));

  // DOM Elements
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-btn');
  const aiSearchBtn = document.getElementById('ai-search-btn');
  const suggestionsBox = document.getElementById('suggestions-box');
  const shortcutsGrid = document.getElementById('shortcuts-grid');

  // Clock Elements
  const clockHm = document.getElementById('clock-hm');
  const clockSec = document.getElementById('clock-sec');
  const clockDate = document.getElementById('clock-date');

  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    if (clockHm) clockHm.textContent = `${h}:${m}`;
    if (clockSec) clockSec.textContent = s;
    if (clockDate) {
      clockDate.textContent = now.toLocaleDateString('tr-TR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    }
  }

  // Modals
  const settingsTrigger = document.getElementById('settings-trigger');
  const settingsModal = document.getElementById('settings-modal');
  const modalClose = document.getElementById('modal-close');
  const settingNewTab = document.getElementById('setting-new-tab');
  const settingShowShortcuts = document.getElementById('setting-show-shortcuts');
  const settingShowSchedule = document.getElementById('setting-show-schedule');
  const settingAiEngine = document.getElementById('setting-ai-engine');

  // Schedule Elements
  const scheduleCard = document.getElementById('schedule-card');
  const statusIndicator = document.getElementById('status-indicator');
  const lessonStatusTitle = document.getElementById('lesson-status-title');
  const lessonStatusSub = document.getElementById('lesson-status-sub');
  const lessonCountdown = document.getElementById('lesson-countdown');
  const lessonCountdownLabel = document.getElementById('lesson-countdown-label');
  const lessonProgressBar = document.getElementById('lesson-progress-bar');

  const shortcutModal = document.getElementById('shortcut-modal');
  const shortcutModalClose = document.getElementById('shortcut-modal-close');
  const shortcutForm = document.getElementById('shortcut-form');
  const scTitle = document.getElementById('sc-title');
  const scUrl = document.getElementById('sc-url');
  const scCancel = document.getElementById('sc-cancel');

  function openModal(el) {
    el.classList.remove('hidden');
    el.classList.add('flex');
  }

  function closeModal(el) {
    el.classList.remove('flex');
    el.classList.add('hidden');
  }

  // Apply Settings
  function applySettings() {
    settingNewTab.checked = settings.openInNewTab;
    settingShowShortcuts.checked = settings.showShortcuts;
    if (settingShowSchedule) settingShowSchedule.checked = settings.showSchedule !== false;
    if (settingAiEngine) settingAiEngine.value = settings.aiEngine || 'google_ai';
    shortcutsGrid.style.display = settings.showShortcuts ? 'flex' : 'none';
    if (scheduleCard) scheduleCard.style.display = (settings.showSchedule !== false) ? 'block' : 'none';
    localStorage.setItem('g_settings', JSON.stringify(settings));
  }

  // Direct URL check
  function isDirectUrl(val) {
    return /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/i.test(val) || /^localhost(:\d+)?(\/.*)?$/i.test(val);
  }

  function executeSearch(query, isLucky = false) {
    query = (query || '').trim();
    if (!query) return;

    if (isDirectUrl(query)) {
      let finalUrl = query;
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl;
      }
      navigate(finalUrl);
      return;
    }

    const base = isLucky ? GOOGLE_LUCKY_URL : GOOGLE_SEARCH_URL;
    navigate(base + encodeURIComponent(query));
  }

  function executeAiSearch(query) {
    query = (query || '').trim();
    const engineKey = settings.aiEngine || 'google_ai';
    const engineFn = AI_ENGINES[engineKey] || AI_ENGINES.google_ai;
    const url = engineFn(query);
    navigate(url);
  }

  function navigate(url) {
    if (settings.openInNewTab) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  }

  // Events
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    executeSearch(searchInput.value);
  });

  if (aiSearchBtn) {
    aiSearchBtn.addEventListener('click', () => {
      executeAiSearch(searchInput.value);
    });
  }

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      executeAiSearch(searchInput.value);
    }
  });

  searchInput.addEventListener('input', () => {
    const val = searchInput.value;
    clearBtn.style.display = val ? 'flex' : 'none';
    if (val.trim()) {
      fetchSuggestions(val.trim());
    } else {
      suggestionsBox.classList.add('hidden');
      suggestionsBox.classList.remove('flex');
    }
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    suggestionsBox.classList.add('hidden');
    suggestionsBox.classList.remove('flex');
    searchInput.focus();
  });

  document.addEventListener('click', (e) => {
    if (!searchForm.contains(e.target)) {
      suggestionsBox.classList.add('hidden');
      suggestionsBox.classList.remove('flex');
    }
  });

  // Google Suggestions (JSONP)
  let suggestionScript = null;
  window.handleGoogleSuggestions = function (data) {
    if (data && Array.isArray(data[1])) {
      renderSuggestions(data[1].map(item => (Array.isArray(item) ? item[0] : item)));
    }
  };

  function fetchSuggestions(query) {
    if (suggestionScript) suggestionScript.remove();
    suggestionScript = document.createElement('script');
    suggestionScript.src = `https://suggestqueries.google.com/complete/search?client=youtube&q=${encodeURIComponent(query)}&jsonp=handleGoogleSuggestions`;
    document.body.appendChild(suggestionScript);
  }

  function renderSuggestions(list) {
    suggestionsBox.innerHTML = '';
    if (!list || list.length === 0) {
      suggestionsBox.classList.add('hidden');
      suggestionsBox.classList.remove('flex');
      return;
    }

    list.slice(0, 6).forEach(text => {
      const item = document.createElement('div');
      item.className = 'flex items-center gap-3.5 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-white/70 cursor-pointer transition-colors rounded-xl mx-1';
      item.innerHTML = `
        <span class="text-slate-400 flex items-center">
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span>
        <span class="truncate">${escapeHtml(text)}</span>
      `;
      item.addEventListener('click', () => {
        searchInput.value = text;
        executeSearch(text);
      });
      suggestionsBox.appendChild(item);
    });

    suggestionsBox.classList.remove('hidden');
    suggestionsBox.classList.add('flex');
  }

  // Shortcuts
  function renderShortcuts() {
    shortcutsGrid.innerHTML = '';

    shortcuts.forEach(item => {
      const el = document.createElement('a');
      el.className = 'group relative flex flex-col items-center gap-2 w-20 text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer no-underline';
      el.href = item.url;
      el.target = settings.openInNewTab ? '_blank' : '_self';

      let domain = '';
      try { domain = new URL(item.url).hostname; } catch (_) {}
      const iconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : '';

      el.innerHTML = `
        <button type="button" class="absolute -top-1.5 right-1.5 w-4 h-4 rounded-full bg-slate-400 hover:bg-red-500 text-white hidden group-hover:flex items-center justify-center cursor-pointer shadow-sm transition-colors z-10" title="Kaldır">
          <svg viewBox="0 0 24 24" class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div class="liquid-tile-box w-13 h-13 rounded-2xl flex items-center justify-center overflow-hidden p-3.5">
          <img class="w-6 h-6 object-contain" src="${iconUrl}" alt="" onerror="this.style.display='none'">
        </div>
        <span class="truncate max-w-[76px] text-center drop-shadow-sm">${escapeHtml(item.title)}</span>
      `;

      el.querySelector('button').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        shortcuts = shortcuts.filter(s => s.id !== item.id);
        localStorage.setItem('g_shortcuts', JSON.stringify(shortcuts));
        renderShortcuts();
      });

      shortcutsGrid.appendChild(el);
    });

    // Add Shortcut Button
    const addBtn = document.createElement('div');
    addBtn.className = 'group flex flex-col items-center gap-2 w-20 text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer';
    addBtn.innerHTML = `
      <div class="liquid-tile-box w-13 h-13 rounded-2xl text-slate-600 flex items-center justify-center p-3.5">
        <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </div>
      <span class="truncate max-w-[76px] text-center drop-shadow-sm">Kısayol ekle</span>
    `;
    addBtn.addEventListener('click', () => {
      shortcutForm.reset();
      openModal(shortcutModal);
      scTitle.focus();
    });
    shortcutsGrid.appendChild(addBtn);
  }

  // Modals Handlers
  settingsTrigger.addEventListener('click', () => openModal(settingsModal));
  modalClose.addEventListener('click', () => closeModal(settingsModal));
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) closeModal(settingsModal);
  });

  settingNewTab.addEventListener('change', () => {
    settings.openInNewTab = settingNewTab.checked;
    applySettings();
    renderShortcuts();
  });

  settingShowShortcuts.addEventListener('change', () => {
    settings.showShortcuts = settingShowShortcuts.checked;
    applySettings();
  });

  if (settingShowSchedule) {
    settingShowSchedule.addEventListener('change', () => {
      settings.showSchedule = settingShowSchedule.checked;
      applySettings();
    });
  }

  if (settingAiEngine) {
    settingAiEngine.addEventListener('change', () => {
      settings.aiEngine = settingAiEngine.value;
      localStorage.setItem('g_settings', JSON.stringify(settings));
    });
  }

  shortcutModalClose.addEventListener('click', () => closeModal(shortcutModal));
  scCancel.addEventListener('click', () => closeModal(shortcutModal));
  shortcutModal.addEventListener('click', (e) => {
    if (e.target === shortcutModal) closeModal(shortcutModal);
  });

  shortcutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = scTitle.value.trim();
    let url = scUrl.value.trim();
    if (!title || !url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    shortcuts.push({ id: Date.now().toString(), title, url });
    localStorage.setItem('g_shortcuts', JSON.stringify(shortcuts));
    closeModal(shortcutModal);
    renderShortcuts();
  });

  // Keyboard shortcut '/' focuses search, 'Escape' closes modals
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput && settingsModal.classList.contains('hidden') && shortcutModal.classList.contains('hidden')) {
      e.preventDefault();
      searchInput.focus();
    }
    if (e.key === 'Escape') {
      closeModal(settingsModal);
      closeModal(shortcutModal);
      suggestionsBox.classList.add('hidden');
      suggestionsBox.classList.remove('flex');
      searchInput.blur();
    }
  });

  // Live Lesson / Break Countdown Controller
  function toSeconds(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 3600 + m * 60;
  }

  function formatCountdown(sec) {
    if (sec < 0) sec = 0;
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function updateLessonCountdown() {
    if (!scheduleCard || !lessonStatusTitle) return;

    const now = new Date();
    const day = now.getDay(); // 0: Sun, 1: Mon, ..., 5: Fri, 6: Sat
    const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    // Weekend (Cumartesi / Pazar)
    if (day === 0 || day === 6) {
      lessonStatusTitle.textContent = 'Hafta Sonu';
      lessonStatusSub.textContent = 'Pazartesi 12:45\'te dersler başlıyor';
      lessonCountdown.textContent = '--:--';
      lessonCountdownLabel.textContent = 'Tatil';
      statusIndicator.className = 'w-3 h-3 rounded-full bg-slate-400 ring-4 ring-slate-100 flex-shrink-0';
      lessonProgressBar.className = 'h-full bg-slate-300 rounded-full';
      lessonProgressBar.style.width = '0%';
      return;
    }

    const schedule = (day === 5) ? SCHEDULE_DATA.fri : SCHEDULE_DATA.week;
    const firstLesson = schedule[0];
    const lastLesson = schedule[schedule.length - 1];

    const firstStartSec = toSeconds(firstLesson.start);
    const lastEndSec = toSeconds(lastLesson.end);

    // Before school starts today
    if (nowSec < firstStartSec) {
      const remainingSec = firstStartSec - nowSec;
      lessonStatusTitle.textContent = 'Dersler Başlamadı';
      lessonStatusSub.textContent = `1. Ders: ${firstLesson.start} - ${firstLesson.end}`;
      lessonCountdown.textContent = formatCountdown(remainingSec);
      lessonCountdownLabel.textContent = '1. derse kaldı';
      statusIndicator.className = 'w-3 h-3 rounded-full bg-amber-500 animate-pulse ring-4 ring-amber-100 flex-shrink-0';
      lessonProgressBar.className = 'h-full bg-amber-500 rounded-full';
      lessonProgressBar.style.width = '0%';
      return;
    }

    // After all lessons end today
    if (nowSec >= lastEndSec) {
      lessonStatusTitle.textContent = 'Dersler Bitti';
      lessonStatusSub.textContent = (day === 4) ? 'Yarın ilk ders: 13:05' : (day === 5 ? 'Pazartesi ilk ders: 12:45' : 'Yarın ilk ders: 12:45');
      lessonCountdown.textContent = '--:--';
      lessonCountdownLabel.textContent = 'İyi Dinlenmeler';
      statusIndicator.className = 'w-3 h-3 rounded-full bg-slate-400 ring-4 ring-slate-100 flex-shrink-0';
      lessonProgressBar.className = 'h-full bg-slate-400 rounded-full';
      lessonProgressBar.style.width = '100%';
      return;
    }

    // Check lessons and breaks
    for (let i = 0; i < schedule.length; i++) {
      const lesson = schedule[i];
      const startSec = toSeconds(lesson.start);
      const endSec = toSeconds(lesson.end);

      // Currently in Lesson i
      if (nowSec >= startSec && nowSec < endSec) {
        const remainingSec = endSec - nowSec;
        const totalDuration = endSec - startSec;
        const elapsed = nowSec - startSec;
        const pct = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

        lessonStatusTitle.textContent = `${lesson.num}. Ders`;
        lessonStatusSub.textContent = `${lesson.start} - ${lesson.end}`;
        lessonCountdown.textContent = formatCountdown(remainingSec);
        lessonCountdownLabel.textContent = 'teneffüse kaldı';
        statusIndicator.className = 'w-3 h-3 rounded-full bg-blue-600 animate-pulse ring-4 ring-blue-100 flex-shrink-0';
        lessonProgressBar.className = 'h-full bg-blue-600 rounded-full transition-all duration-1000 ease-linear';
        lessonProgressBar.style.width = `${pct}%`;
        return;
      }

      // Currently in Break between Lesson i and Lesson i+1
      if (i < schedule.length - 1) {
        const nextLesson = schedule[i + 1];
        const breakStartSec = endSec;
        const breakEndSec = toSeconds(nextLesson.start);

        if (nowSec >= breakStartSec && nowSec < breakEndSec) {
          const remainingSec = breakEndSec - nowSec;
          const totalBreak = breakEndSec - breakStartSec;
          const elapsed = nowSec - breakStartSec;
          const pct = Math.min(100, Math.max(0, (elapsed / totalBreak) * 100));

          lessonStatusTitle.textContent = 'Teneffüs';
          lessonStatusSub.textContent = `Sıradaki: ${nextLesson.num}. Ders (${nextLesson.start})`;
          lessonCountdown.textContent = formatCountdown(remainingSec);
          lessonCountdownLabel.textContent = `${nextLesson.num}. derse kaldı`;
          statusIndicator.className = 'w-3 h-3 rounded-full bg-amber-500 animate-pulse ring-4 ring-amber-100 flex-shrink-0';
          lessonProgressBar.className = 'h-full bg-amber-500 rounded-full transition-all duration-1000 ease-linear';
          lessonProgressBar.style.width = `${pct}%`;
          return;
        }
      }
    }
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  // Initialize
  applySettings();
  renderShortcuts();
  updateLessonCountdown();
  updateClock();
  setInterval(() => {
    updateClock();
    updateLessonCountdown();
  }, 1000);

})();
