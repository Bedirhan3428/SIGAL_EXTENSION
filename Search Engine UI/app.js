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
    aiEngine: 'google_ai'
  }, JSON.parse(localStorage.getItem('g_settings') || '{}'));

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
  const settingAiEngine = document.getElementById('setting-ai-engine');

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
    if (settingAiEngine) settingAiEngine.value = settings.aiEngine || 'google_ai';
    shortcutsGrid.style.display = settings.showShortcuts ? 'flex' : 'none';
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

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  // Initialize
  applySettings();
  renderShortcuts();
  updateClock();
  setInterval(updateClock, 1000);

})();
