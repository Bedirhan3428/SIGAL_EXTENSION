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
    showExamTimer: true,
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
  // Normalize existing shortcuts so they always have https://
  shortcuts = shortcuts.map(item => {
    let u = (item.url || '').trim();
    if (u && !u.startsWith('http://') && !u.startsWith('https://')) {
      u = 'https://' + u;
    }
    return { ...item, url: u };
  });

const GOOGLE_APPS = [
    {
      title: 'Arama',
      url: 'https://www.google.com',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 256 262"><path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"/><path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"/><path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"/><path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"/></svg>'
    },
    {
      title: 'Gemini',
      url: 'https://gemini.google.com',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="sigal-gemini-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1BA1E3"/><stop offset="35%" stop-color="#5B7FFF"/><stop offset="70%" stop-color="#9C59FF"/><stop offset="100%" stop-color="#E25585"/></linearGradient></defs><path fill="url(#sigal-gemini-grad)" d="M24 12.024c-6.437.388-11.59 5.539-11.977 11.976h-.047C11.588 17.563 6.436 12.412 0 12.024v-.047C6.437 11.588 11.588 6.437 11.976 0h.047c.388 6.437 5.54 11.588 11.977 11.977z"/></svg>'
    },
    {
      title: 'Haritalar',
      url: 'https://maps.google.com',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 256 367"><path fill="#34a853" d="M70.585 271.865a371 371 0 0 1 28.911 42.642c7.374 13.982 10.448 23.463 15.837 40.31c3.305 9.308 6.292 12.086 12.714 12.086c6.998 0 10.173-4.726 12.626-12.035c5.094-15.91 9.091-28.052 15.397-39.525c12.374-22.15 27.75-41.833 42.858-60.75c4.09-5.354 30.534-36.545 42.439-61.156c0 0 14.632-27.035 14.632-64.792c0-35.318-14.43-59.813-14.43-59.813l-41.545 11.126l-25.23 66.451l-6.242 9.163l-1.248 1.66l-1.66 2.078l-2.914 3.319l-4.164 4.163l-22.467 18.304l-56.17 32.432z"/><path fill="#fbbc04" d="M12.612 188.892c13.709 31.313 40.145 58.839 58.031 82.995l95.001-112.534s-13.384 17.504-37.662 17.504c-27.043 0-48.89-21.595-48.89-48.825c0-18.673 11.234-31.501 11.234-31.501l-64.489 17.28z"/><path fill="#4285f4" d="M166.705 5.787c31.552 10.173 58.558 31.53 74.893 63.023l-75.925 90.478s11.234-13.06 11.234-31.617c0-27.864-23.463-48.68-48.81-48.68c-23.969 0-37.735 17.475-37.735 17.475v-57z"/><path fill="#1a73e8" d="M30.015 45.765C48.86 23.218 82.02 0 127.736 0c22.18 0 38.89 5.823 38.89 5.823L90.29 96.516H36.205z"/><path fill="#ea4335" d="M12.612 188.892S0 164.194 0 128.414c0-33.817 13.146-63.377 30.015-82.649l60.318 50.759z"/></svg>'
    },
    {
      title: 'YouTube',
      url: 'https://www.youtube.com',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 256 180"><path fill="red" d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134"/><path fill="#fff" d="m102.421 128.06l66.328-38.418l-66.328-38.418z"/></svg>'
    },
    {
      title: 'Play',
      url: 'https://play.google.com',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 256 283"><path fill="#ea4335" d="M119.553 134.916L1.06 259.061a32.14 32.14 0 0 0 47.062 19.071l133.327-75.934z"/><path fill="#fbbc04" d="M239.37 113.814L181.715 80.79l-64.898 56.95l65.162 64.28l57.216-32.67a31.345 31.345 0 0 0 0-55.537z"/><path fill="#4285f4" d="M1.06 23.487A30.6 30.6 0 0 0 0 31.61v219.327a32.3 32.3 0 0 0 1.06 8.124l122.555-120.966z"/><path fill="#34a853" d="m120.436 141.274l61.278-60.483L48.564 4.503A32.85 32.85 0 0 0 32.051 0C17.644-.028 4.978 9.534 1.06 23.399z"/></svg>'
    },
    {
      title: 'Haberler',
      url: 'https://news.google.com',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 24 24"><path fill="#174ea6" d="M21.267 21.2a.614.614 0 0 1-.613.613H3.344a.614.614 0 0 1-.612-.613V8.115a.614.614 0 0 1 .613-.613h17.309a.614.614 0 0 1 .613.613zm-3.032-3.42v-1.195a.08.08 0 0 0-.08-.08h-5.373v1.361h5.373a.08.08 0 0 0 .08-.083zm.817-2.587v-1.201a.08.08 0 0 0-.079-.082h-6.19v1.362h6.189a.08.08 0 0 0 .08-.078v-.004zm-.817-2.588V11.4a.08.08 0 0 0-.08-.08h-5.373v1.361h5.373a.08.08 0 0 0 .08-.079zM8.15 14.045v1.226h1.77c-.145.748-.804 1.292-1.77 1.292a1.976 1.976 0 0 1 0-3.95a1.77 1.77 0 0 1 1.253.49l.934-.932a3.14 3.14 0 0 0-2.187-.853a3.268 3.268 0 1 0 0 6.537c1.89 0 3.133-1.328 3.133-3.197a4 4 0 0 0-.052-.619zM2.27 7.654a.616.616 0 0 1 .613-.613h12.154l-1.269-3.49a.595.595 0 0 0-.743-.383L.368 7.775a.594.594 0 0 0-.323.775l2.225 6.112za.616.616 0 0 1 .613-.613h12.154l-1.269-3.49a.595.595 0 0 0-.743-.383L.368 7.775a.594.594 0 0 0-.323.775l2.225 6.112zm21.312-.31l-8.803-2.37l.751 2.067h5.584a.614.614 0 0 1 .613.613v8.794l2.247-8.365a.59.59 0 0 0-.392-.74m-4.496-1.675V2.795a.61.61 0 0 0-.611-.608H5.524a.61.61 0 0 0-.616.605v2.837l8.39-3.052a.594.594 0 0 1 .743.39l.544 1.497z"/></svg>'
    },
    {
      title: 'Gmail',
      url: 'https://mail.google.com',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 256 204"><defs><linearGradient id="SVGHzDbHcwG" x1="165" x2="165" y1="44" y2="166" gradientUnits="userSpaceOnUse"><stop stop-color="#60d673"/><stop offset=".17" stop-color="#42c868"/><stop offset=".39" stop-color="#0ebc5f"/><stop offset=".62" stop-color="#00a9bb"/><stop offset=".86" stop-color="#3c90ff"/><stop offset="1" stop-color="#3186ff"/></linearGradient><linearGradient id="SVG41ATXboZ" x1="8" x2="184" y1="46.13" y2="46.13" gradientUnits="userSpaceOnUse"><stop offset=".08" stop-color="#ff63a0"/><stop offset=".3" stop-color="#fc413d"/><stop offset=".5" stop-color="#fc413d"/><stop offset=".65" stop-color="#fc413d"/><stop offset=".72" stop-color="#fc5c30"/><stop offset=".86" stop-color="#feb10c"/><stop offset=".91" stop-color="#fec700"/><stop offset=".96" stop-color="#ffdb0f"/></linearGradient></defs><path fill="url(#SVGHzDbHcwG)" d="M146 44h38v110c0 6.627-5.373 12-12 12h-20a6 6 0 0 1-6-6z" transform="translate(-11.636 -37.818)scale(1.45454)"/><path fill="#fc413d" d="M55.273 26.182H0v160c0 9.638 7.816 17.454 17.455 17.454h29.09a8.727 8.727 0 0 0 8.728-8.728z"/><path fill="url(#SVG41ATXboZ)" d="M39.226 30.456c-8.033-6.752-20.018-5.714-26.77 2.319c-6.752 8.032-5.714 20.017 2.319 26.77l76.078 63.949a8 8 0 0 0 10.295 0l76.078-63.95c8.032-6.752 9.07-18.737 2.318-26.77c-6.752-8.032-18.737-9.07-26.769-2.318L96 78.18z" transform="translate(-11.636 -37.818)scale(1.45454)"/></svg>'
    },
    {
      title: 'Meet',
      url: 'https://meet.google.com',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 256 201"><defs><linearGradient id="SVGn7MQdcpE" x1="128.8" x2="227.2" y1="104.44" y2="104.44" gradientUnits="userSpaceOnUse"><stop stop-color="#f6a100"/><stop offset="1" stop-color="#ffbe00"/></linearGradient><linearGradient id="SVGg7gAEeAi" x1="136.22" x2="78.5" y1="91.32" y2="91.19" gradientUnits="userSpaceOnUse"><stop offset=".15" stop-color="#ffb5e8"/><stop offset="1" stop-color="#ffdbf5" stop-opacity="0"/></linearGradient><radialGradient id="SVGYttsNcac" cx="0" cy="0" r="1" gradientTransform="matrix(-159.725 0 0 -135.852 160.325 96)" gradientUnits="userSpaceOnUse"><stop offset=".15" stop-color="#ffe921"/><stop offset="1" stop-color="#fec700"/></radialGradient><filter id="SVG5vOj3Sef" width="166" height="180" x="45.91" y="8" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_37584_9338" stdDeviation="14"/></filter></defs><g transform="translate(-11.636 -39.273)scale(1.45454)"><path fill="url(#SVGn7MQdcpE)" d="M110.015 108.88c-6.829-4.718-6.921-14.778-.179-19.62L165 49.643c7.94-5.701 19-.038 19 9.737v77.755c0 9.675-10.861 15.359-18.821 9.859z"/><path fill="url(#SVGYttsNcac)" d="M8 71c0-24.3 19.7-44 44-44h64c11.046 0 20 8.954 20 20v98c0 11.046-8.954 20-20 20H28c-11.046 0-20-8.954-20-20z"/><g filter="url(#SVG5vOj3Sef)" mask="url(#SVGUq8hDd0H)"><path fill="url(#SVGg7gAEeAi)" d="m73.906 99.198l110-63.198v124z"/></g><circle cx="38" cy="135" r="14" fill="#fff"/></g><mask id="SVGUq8hDd0H" width="129" height="138" x="8" y="27" maskUnits="userSpaceOnUse" style="mask-type:luminance"><path fill="#fff" d="M8 71c0-24.3 19.7-44 44-44h64c11.046 0 20 8.954 20 20v98c0 11.046-8.954 20-20 20H28c-11.046 0-20-8.954-20-20z"/></mask></svg>'
    },
    {
      title: 'Chat',
      url: 'https://chat.google.com',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 311 320"><g fill="none" stroke-width="2"><path stroke="#7e916f" d="m76.37.51l.01 76.47" vector-effect="non-scaling-stroke"/><path stroke="#1375eb" d="M76.38 76.98L0 76.96" vector-effect="non-scaling-stroke"/><path stroke="#f3801d" d="M235.08 1.09q-.16.06-.27.13q-.17.09-.17.28l-.02 75.51" vector-effect="non-scaling-stroke"/><path stroke="#7eb426" d="M234.62 77.01h-.05" vector-effect="non-scaling-stroke"/><path stroke="#91a080" d="m76.41 77.01l-.03-.03" vector-effect="non-scaling-stroke"/><path stroke="#75783e" d="m310.53 76.77l-75.91.24" vector-effect="non-scaling-stroke"/><path stroke="#138495" d="M76.43 182.69L0 182.67" vector-effect="non-scaling-stroke"/><path stroke="#00983a" d="m76.44 259.13l-.01-38.28" vector-effect="non-scaling-stroke"/></g><path fill="#0066da" d="m76.37.51l.01 76.47L0 76.96V20.77q.85-5.96 3.53-10.01Q10.14.74 22.75.67Q49.41.53 76.37.51"/><path fill="#fbbc04" d="m76.37.51l157.42.02a1.61 1.57-26.7 0 1 .92.29l.37.27q-.16.06-.27.13q-.17.09-.17.28l-.02 75.51h-.05l-158.16.01l-.03-.03Z"/><path fill="#ea4335" d="m235.08 1.09l75.45 75.68l-75.91.24l.02-75.51q0-.19.17-.28q.11-.07.27-.13"/><path fill="#2684fc" d="m0 76.96l76.38.02l.03.03l.02 105.68L0 182.67Z"/><path fill="#00ac47" d="m310.53 76.77l.47.34v161.9q-2.66 14.53-15.06 18.77q-4.42 1.52-13.03 1.5q-55.89-.09-112.92-.17q-8.28-.01-16.8.12q-.47.01-.8.34q-27.9 27.77-56 56.02c-2.87 2.89-6.12 4.5-10.24 3.89q-5.76-.85-8.49-5.94q-1.15-2.16-1.17-7.88q-.07-23.19-.05-46.53l-.01-38.28l37.78-37.78a1.79 1.77 22.3 0 1 1.26-.52l118.3.04a.83.83 0 0 0 .83-.83l-.03-104.75h.05Z"/><path fill="#00832d" d="M76.43 182.69v38.16l.01 38.28q-23.97.14-47.53.09q-9.82-.02-14.15-1.54Q2.62 253.44 0 238.88v-56.21Z"/></svg>'
    },
    {
      title: 'Drive',
      url: 'https://drive.google.com',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 256 238"><defs><linearGradient id="SVGjzk6ueva" x1="86.924%" x2="7.63%" y1="94.294%" y2="45.952%"><stop offset="9%" stop-color="#ffe921"/><stop offset="100%" stop-color="#fec700"/></linearGradient><linearGradient id="SVGb0f7AcFJ" x1="99.538%" x2="23.437%" y1="93.901%" y2="54.033%"><stop offset="15%" stop-color="#a9a8ff"/><stop offset="33%" stop-color="#6d97ff"/><stop offset="48%" stop-color="#3186ff"/></linearGradient><linearGradient id="SVGxMwz6dYk" x1="87.128%" x2="-.639%" y1="51.518%" y2="93.078%"><stop offset="55%" stop-color="#0ebc5f"/><stop offset="85%" stop-color="#78c9ff"/></linearGradient><path id="SVGAiIt3btS" d="M77.303 29.27c22.531-39.026 78.863-39.027 101.394 0l69.373 120.158c22.531 39.027-5.633 87.81-50.698 87.81H58.628c-45.065 0-73.23-48.783-50.698-87.81z"/></defs><mask id="SVG6FLXsceq" fill="#fff"><use href="#SVGAiIt3btS"/></mask><g mask="url(#SVG6FLXsceq)"><path fill="url(#SVGjzk6ueva)" d="M341.719 295.937H200.166l-29.293-50.735l70.777-122.589z" transform="translate(-42.87 -58.67)"/><path fill="url(#SVGb0f7AcFJ)" d="m0 295.916l100.069-173.325v.003l-29.282 50.723h58.57l70.783 122.596l-200.138.001z" transform="translate(-42.87 -58.67)"/><path fill="url(#SVGxMwz6dYk)" d="m170.881 0l70.781 122.6l-29.286 50.726H70.812z" transform="translate(-42.87 -58.67)"/></g></svg>'
    },
    {
      title: 'Takvim',
      url: 'https://calendar.google.com',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 256 275"><defs><linearGradient id="SVGAUTqNcwQ" x1="83" x2="83" y1="76" gradientUnits="userSpaceOnUse"><stop stop-color="#4fa0ff"/><stop offset="1" stop-color="#3186ff"/></linearGradient><linearGradient id="SVGMJemac7b" x1="89.06" x2="89.06" y1="21.75" y2="96.39" gradientUnits="userSpaceOnUse"><stop stop-color="#a9a8ff"/><stop offset=".8" stop-color="#3c90ff"/></linearGradient><filter id="SVGGQyK4bRj" width="152" height="112" x="20" y="-4" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_37330_7673" stdDeviation="6"/></filter></defs><mask id="SVGcTVVObIw" width="154" height="152" x="19" y="20" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#3c90ff" d="M19.867 49.392C17.818 33.82 29.94 20 45.645 20h100.71c15.706 0 27.827 13.82 25.778 29.392L166 96l6.133 46.608C174.182 158.18 162.061 172 146.355 172H45.645c-15.706 0-27.827-13.82-25.778-29.392L26 96z"/></mask><mask id="SVGBwV4Xb4k" width="154" height="152" x="19" y="20" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#3186ff" d="M19.867 49.392C17.818 33.82 29.94 20 45.645 20h100.71c15.706 0 27.827 13.82 25.778 29.392L166 96l6.133 46.608C174.182 158.18 162.061 172 146.355 172H45.645c-15.706 0-27.827-13.82-25.778-29.392L26 96z"/></mask><path fill="#bbe2ff" d="M20.824 48.078c0-26.641 21.596-48.239 48.238-48.239h117.917c26.641 0 48.238 21.598 48.238 48.239v50.918c0 26.641-21.597 48.239-48.238 48.239H69.062c-26.642 0-48.238-21.598-48.238-48.239z"/><path fill="#3c90ff" d="M.502 69.169c-3.432-26.082 16.871-49.23 43.177-49.23h168.683c26.306 0 46.609 23.148 43.178 49.23l-10.273 78.066l10.273 78.066c3.431 26.082-16.872 49.23-43.178 49.23H43.679c-26.307 0-46.609-23.148-43.177-49.23l10.272-78.066z"/><g mask="url(#SVGcTVVObIw)" transform="translate(-32.775 -13.56)scale(1.67495)"><path fill="url(#SVGAUTqNcwQ)" d="M0 0h166v76H0z" transform="matrix(1 0 0 -1 13 172)"/></g><g mask="url(#SVGBwV4Xb4k)" transform="translate(-32.775 -13.56)scale(1.67495)"><path fill="url(#SVGMJemac7b)" d="M32 27.2C32 16.596 40.596 8 51.2 8h89.6c10.604 0 19.2 8.596 19.2 19.2V96H32z" filter="url(#SVGGQyK4bRj)"/></g><path fill="#fff" d="M93.438 209.77q-10.521 0-18.051-3.421q-7.528-3.422-12.746-9.153q-5.133-5.82-7.273-11.379q-2.137-5.558-1.711-6.758a3.47 3.47 0 0 1 1.711-1.882l9.497-3.765q1.196-.598 2.395-.17q1.196.34 2.822 3.935q1.714 3.592 4.79 7.613a24 24 0 0 0 7.529 6.245q4.368 2.226 10.779 2.225q10.351 0 16.426-5.99q6.16-5.986 6.16-15.226q0-10.01-6.503-15.4q-6.5-5.476-17.195-5.476h-8.981a3.17 3.17 0 0 1-2.225-.853q-.853-.94-.855-2.139v-9.153q0-1.284.854-2.14a3.06 3.06 0 0 1 2.226-.94h7.783q9.583 0 15.4-5.22q5.817-5.218 5.816-13.517q.002-8.21-5.218-13.258t-14.371-5.049q-5.135.001-8.898 1.712a19.3 19.3 0 0 0-6.502 4.791a38.3 38.3 0 0 0-4.705 6.33q-1.964 3.252-3.165 3.593q-1.195.256-2.31-.426l-8.983-4.364q-1.11-.599-1.454-1.882q-.342-1.284 2.055-5.989q2.48-4.788 7.526-9.752a35.2 35.2 0 0 1 11.807-7.7q6.758-2.74 15.741-2.738q16.681.001 26.434 8.81q9.752 8.73 9.753 23.099q0 9.926-4.79 17.196q-4.706 7.27-13.347 10.268v.341q10.438 3.08 16.425 11.291c4.05 5.421 6.075 11.891 6.074 19.419q0 16.17-11.293 26.522q-11.29 10.35-29.429 10.35zm85.841-1.967q-1.452 0-2.567-1.112a3.78 3.78 0 0 1-1.026-2.652v-95.131l-19.249 13.859q-1.026.77-2.396.514a3.3 3.3 0 0 1-2.052-1.283l-5.561-7.871a3.32 3.32 0 0 1-.6-2.397q.258-1.365 1.369-2.136l34.133-24.382q.43-.343.942-.514q.515-.256 1.197-.256h7.188q1.455.001 2.31 1.027q.941.94.941 2.396v116.174q0 1.542-1.112 2.652a3.35 3.35 0 0 1-2.568 1.112z"/></svg>'
    },
    {
      title: 'Kişiler',
      url: 'https://contacts.google.com',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 512 512"><path fill="#86a9ff" d="M203.5 249.4c-90.7 0-164.1 73.4-164.1 164.1v68.9c0 16.3 13.2 29.5 29.5 29.5h78.8l78.8-262.6h-23z"/><path fill="#578cff" d="M472.6 357.7c0-59.9-48.4-108.3-108.3-108.3h-78.8V512h78.8c59.9 0 108.3-48.4 108.3-108.3"/><path fill="#0057cc" d="M118.2 357.7c0-59.9 48.4-108.3 108.3-108.3h59.1c59.9 0 108.3 48.4 108.3 108.3v45.9c0 59.9-48.4 108.3-108.3 108.3H147.7c-16.3 0-29.5-13.2-29.5-29.5zM256 0c56.2 0 101.7 45.6 101.7 101.7S312.2 203.5 256 203.5s-101.7-45.6-101.7-101.7S199.8 0 256 0"/></svg>'
    },
    {
      title: 'Çeviri',
      url: 'https://translate.google.com',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 24 24"><path fill="#4285f4" d="M22.401 4.818h-9.927L10.927 0H1.599C.72 0 .002.719.002 1.599v16.275c0 .878.72 1.597 1.597 1.597h10L13.072 24H22.4c.878 0 1.597-.707 1.597-1.572V6.39c0-.865-.72-1.572-1.597-1.572zm-15.66 8.68c-2.07 0-3.75-1.68-3.75-3.75s1.68-3.75 3.75-3.75c1.012 0 1.86.375 2.512.976l-.99.952a2.2 2.2 0 0 0-1.522-.584c-1.305 0-2.363 1.08-2.363 2.409S5.436 12.16 6.74 12.16c1.507 0 2.13-1.08 2.19-1.808l-2.188-.002V9.066h3.51c.05.23.09.457.09.764c0 2.147-1.434 3.669-3.602 3.669zm16.757 8.93c0 .59-.492 1.072-1.097 1.072h-8.875l3.649-4.03h.005l-.74-2.302l.006-.005s.568-.488 1.277-1.24c.712.771 1.63 1.699 2.818 2.805l.771-.772c-1.272-1.154-2.204-2.07-2.89-2.805c.919-1.087 1.852-2.455 2.049-3.707h2.034v.002h.002v-.94h-4.532v-1.52h-1.471v1.52H14.3l-1.672-5.21l.006.022h9.767c.605 0 1.097.48 1.097 1.072zm-6.484-7.311c-.536.548-.943.873-.943.873l-.008.004l-1.46-4.548h4.764c-.307 1.084-.988 2.108-1.651 2.904c-1.176-1.392-1.18-1.844-1.18-1.844h-1.222s.05.678 1.7 2.61z"/></svg>'
    },
    {
      title: 'Fotoğraflar',
      url: 'https://photos.google.com',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 256 256"><defs><radialGradient id="SVGEG30kbZK" cx="223.589" cy="229.244" r="170.886" gradientTransform="matrix(.73143 0 0 .76142 -36.884 -43.78)" gradientUnits="userSpaceOnUse"><stop offset=".469" stop-color="#7acaff"/><stop offset=".828" stop-color="#00b054"/></radialGradient><radialGradient id="SVG1x9xkeNY" cx="223.589" cy="229.244" r="170.886" gradientTransform="matrix(0 .73143 -.76142 0 299.78 -36.884)" gradientUnits="userSpaceOnUse"><stop offset=".545" stop-color="#fded1c"/><stop offset=".828" stop-color="#feca01"/></radialGradient><radialGradient id="SVGK7M5xc0s" cx="223.589" cy="229.244" r="170.886" gradientTransform="matrix(-.73143 0 0 -.76142 292.884 299.78)" gradientUnits="userSpaceOnUse"><stop offset=".469" stop-color="#ff81d0"/><stop offset=".828" stop-color="#ff4041"/></radialGradient><radialGradient id="SVGuAtGCePs" cx="223.589" cy="229.244" r="170.886" gradientTransform="matrix(0 -.73143 .76142 0 -43.78 292.884)" gradientUnits="userSpaceOnUse"><stop offset=".469" stop-color="#aaa7ff"/><stop offset=".828" stop-color="#2f89ff"/></radialGradient></defs><path fill="url(#SVGEG30kbZK)" d="M58.222 192c0-35.328 28.672-64 64-64H128v122.222c0 3.218-2.633 5.778-5.778 5.778c-35.328 0-64-28.672-64-64"/><path fill="url(#SVG1x9xkeNY)" d="M64 58.222c35.328 0 64 28.672 64 64V128H5.778C2.56 128 0 125.367 0 122.222c0-35.328 28.672-64 64-64"/><path fill="url(#SVGK7M5xc0s)" d="M197.778 64c0 35.328-28.672 64-64 64H128V5.778C128 2.56 130.633 0 133.778 0c35.328 0 64 28.672 64 64"/><path fill="url(#SVGuAtGCePs)" d="M192 197.778c-35.328 0-64-28.672-64-64V128h122.222c3.218 0 5.778 2.633 5.778 5.778c0 35.328-28.672 64-64 64"/></svg>'
    },
    {
      title: 'Dokümanlar',
      url: 'https://docs.google.com/document',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 24 24"><path fill="#4285f4" d="M14.727 6.727H14V0H4.91c-.905 0-1.637.732-1.637 1.636v20.728c0 .904.732 1.636 1.636 1.636h14.182c.904 0 1.636-.732 1.636-1.636V6.727zm-.545 10.455H7.09v-1.364h7.09v1.364zm2.727-3.273H7.091v-1.364h9.818zm0-3.273H7.091V9.273h9.818zM14.727 6h6l-6-6z"/></svg>'
    },
    {
      title: 'E-Tablolar',
      url: 'https://docs.google.com/spreadsheets',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 74 100"><defs><path id="SVGIGBbGcaJ" fill="#fff" d="M45.398 1.43H7.867c-3.643 0-6.623 2.98-6.623 6.624v83.893c0 3.642 2.98 6.623 6.623 6.623h57.4c3.643 0 6.624-2.98 6.624-6.623V27.923z"/></defs><mask id="SVGeu8TmevZ" width="71" height="98" x="1" y="1" maskUnits="userSpaceOnUse" style="mask-type:alpha"><use href="#SVGIGBbGcaJ"/></mask><g fill="none"><g mask="url(#SVGeu8TmevZ)"><path fill="#0f9d58" d="M45.398 1.43H7.867c-3.643 0-6.623 2.98-6.623 6.624v83.893c0 3.642 2.98 6.623 6.623 6.623h57.4c3.643 0 6.624-2.98 6.624-6.623V27.923L56.436 16.884z"/></g><g mask="url(#SVGeu8TmevZ)"><path fill="#f1f1f1" d="M18.905 48.896v32.012H54.23V48.896zM34.36 76.493H23.321v-5.52h11.038zm0-8.831H23.321v-5.52h11.038zm0-8.831H23.321v-5.52h11.038zm15.454 17.662H38.775v-5.52h11.038zm0-8.831H38.775v-5.52h11.038zm0-8.831H38.775v-5.52h11.038z"/></g><g mask="url(#SVGeu8TmevZ)"><path fill="url(#SVGoPMCPXuN)" d="m47.335 25.986l24.556 24.55V27.922z"/></g><g mask="url(#SVGeu8TmevZ)"><path fill="#87ceac" d="M45.398 1.43V21.3a6.62 6.62 0 0 0 6.623 6.623h19.87z"/></g><g mask="url(#SVGeu8TmevZ)"><path fill="#fff" fill-opacity=".2" d="M7.867 1.43c-3.643 0-6.623 2.98-6.623 6.624v.551c0-3.642 2.98-6.623 6.623-6.623h37.531V1.43z"/></g><g mask="url(#SVGeu8TmevZ)"><path fill="#263238" fill-opacity=".2" d="M65.267 98.018h-57.4c-3.643 0-6.623-2.98-6.623-6.623v.552c0 3.642 2.98 6.623 6.623 6.623h57.4c3.643 0 6.624-2.98 6.624-6.623v-.552c0 3.642-2.98 6.623-6.624 6.623"/></g><g mask="url(#SVGeu8TmevZ)"><path fill="#263238" fill-opacity=".1" d="M52.021 27.923a6.62 6.62 0 0 1-6.623-6.623v.552a6.62 6.62 0 0 0 6.623 6.623h19.87v-.552z"/></g><path fill="url(#SVGXgG8ibSI)" d="M45.398 1.43H7.867c-3.643 0-6.623 2.98-6.623 6.624v83.893c0 3.642 2.98 6.623 6.623 6.623h57.4c3.643 0 6.624-2.98 6.624-6.623V27.923z"/><defs><radialGradient id="SVGXgG8ibSI" cx="0" cy="0" r="1" gradientTransform="translate(3.482 3.361)scale(113.917)" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><linearGradient id="SVGoPMCPXuN" x1="59.614" x2="59.614" y1="28.093" y2="50.539" gradientUnits="userSpaceOnUse"><stop stop-color="#263238" stop-opacity=".2"/><stop offset="1" stop-color="#263238" stop-opacity=".02"/></linearGradient></defs></g></svg>'
    },
    {
      title: 'Slaytlar',
      url: 'https://docs.google.com/presentation',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 73 100"><defs><path id="SVGLqcj4blC" fill="#fff" d="M44.823 0h-38.1C3.026 0 0 3.026 0 6.723v85.165c0 3.697 3.026 6.723 6.723 6.723h58.27c3.699 0 6.724-3.026 6.724-6.723V26.894z"/></defs><mask id="SVGOJaYrdyS" width="72" height="99" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><use href="#SVGLqcj4blC"/></mask><g fill="none"><g mask="url(#SVGOJaYrdyS)"><path fill="#f4b400" d="M44.823 0h-38.1C3.026 0 0 3.026 0 6.723v85.165c0 3.697 3.026 6.723 6.723 6.723h58.27c3.699 0 6.724-3.026 6.724-6.723V26.894L56.03 15.688z"/></g><g mask="url(#SVGOJaYrdyS)"><path fill="#f1f1f1" d="M50.426 44.823H21.291a3.37 3.37 0 0 0-3.362 3.362V77.32a3.37 3.37 0 0 0 3.362 3.362h29.135a3.37 3.37 0 0 0 3.362-3.362V48.185a3.37 3.37 0 0 0-3.362-3.362m-1.12 25.774H22.412V54.909h26.894z"/></g><g mask="url(#SVGOJaYrdyS)"><path fill="url(#SVGHjkXJesw)" d="M46.79 24.927L71.717 49.85V26.894z"/></g><g mask="url(#SVGOJaYrdyS)"><path fill="#fada80" d="M44.823 0v20.17a6.72 6.72 0 0 0 6.724 6.724h20.17z"/></g><g mask="url(#SVGOJaYrdyS)"><path fill="#fff" fill-opacity=".1" d="M44.823 0v.56l26.334 26.334h.56z"/></g><g mask="url(#SVGOJaYrdyS)"><path fill="#fff" fill-opacity=".2" d="M6.723 0C3.026 0 0 3.026 0 6.723v.56C0 3.587 3.026.56 6.723.56h38.1V0z"/></g><g mask="url(#SVGOJaYrdyS)"><path fill="#bf360c" fill-opacity=".2" d="M64.994 98.05H6.724C3.025 98.05 0 95.026 0 91.328v.56c0 3.698 3.026 6.724 6.723 6.724h58.27c3.699 0 6.724-3.026 6.724-6.723v-.56c0 3.697-3.025 6.723-6.723 6.723"/></g><g mask="url(#SVGOJaYrdyS)"><path fill="#bf360c" fill-opacity=".1" d="M51.547 26.894a6.72 6.72 0 0 1-6.724-6.723v.56a6.72 6.72 0 0 0 6.724 6.723h20.17v-.56z"/></g><path fill="url(#SVG6dpJadoi)" d="M44.823 0h-38.1C3.026 0 0 3.026 0 6.723v85.165c0 3.697 3.026 6.723 6.723 6.723h58.27c3.699 0 6.724-3.026 6.724-6.723V26.894z"/><defs><radialGradient id="SVG6dpJadoi" cx="0" cy="0" r="1" gradientTransform="translate(2.272 1.96)scale(115.643)" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><linearGradient id="SVGHjkXJesw" x1="59.255" x2="59.255" y1="27.067" y2="49.852" gradientUnits="userSpaceOnUse"><stop stop-color="#bf360c" stop-opacity=".2"/><stop offset="1" stop-color="#bf360c" stop-opacity=".02"/></linearGradient></defs></g></svg>'
    },
    {
      title: 'Formlar',
      url: 'https://docs.google.com/forms',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 24 24"><path fill="#7248b9" d="M14.727 6h6l-6-6zm0 .727H14V0H4.91c-.905 0-1.637.732-1.637 1.636v20.728c0 .904.732 1.636 1.636 1.636h14.182c.904 0 1.636-.732 1.636-1.636V6.727zM7.91 17.318a.819.819 0 1 1 .001-1.638a.819.819 0 0 1 0 1.638zm0-3.273a.819.819 0 1 1 .001-1.637a.819.819 0 0 1 0 1.637zm0-3.272a.819.819 0 1 1 .001-1.638a.819.819 0 0 1 0 1.638zm9 6.409h-6.818v-1.364h6.818zm0-3.273h-6.818v-1.364h6.818zm0-3.273h-6.818V9.273h6.818z"/></svg>'
    },
    {
      title: 'Keep',
      url: 'https://keep.google.com',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 256 326"><defs><linearGradient id="SVGSFuzrdRn" x1="71.83" x2="156.83" y1="148" y2="8" gradientUnits="userSpaceOnUse"><stop offset=".1" stop-color="#ffe921"/><stop offset=".48" stop-color="#fdd313"/><stop offset=".86" stop-color="#ffbe00"/></linearGradient><linearGradient id="SVGHMZrMdqY" x1="96" x2="96" y1="140.04" y2="8" gradientUnits="userSpaceOnUse"><stop offset=".16" stop-color="#ffe921"/><stop offset=".64" stop-color="#fec700"/><stop offset=".96" stop-color="#ffbe00"/></linearGradient><linearGradient id="SVGPFCCTc3o" x1="96" x2="96" y1="51.19" y2="142.89" gradientUnits="userSpaceOnUse"><stop offset=".11" stop-color="#ffb8dd" stop-opacity="0"/><stop offset=".68" stop-color="#ffb5e8"/></linearGradient><filter id="SVG5GnBoe9J" width="203.2" height="235.2" x="-5.6" y="6.4" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_37487_16896" stdDeviation="28.8"/></filter><filter id="SVGjLHLue4y" width="88" height="140" x="52" y="58" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_37487_16896" stdDeviation="6"/></filter></defs><mask id="SVGBYXnUdIs" width="140" height="140" x="26" y="8" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="url(#SVGSFuzrdRn)" d="M166 78c0 27.13-15.434 50.381-38 62c-9.591 4.938-20.47 8-32 8s-22.41-3.062-32-8c-22.566-11.619-38-34.87-38-62C26 39.34 57.34 8 96 8s70 31.34 70 70"/></mask><g mask="url(#SVGBYXnUdIs)" transform="translate(-47.543 -14.629)scale(1.82857)"><circle cx="96" cy="78" r="70" fill="url(#SVGHMZrMdqY)"/><g filter="url(#SVG5GnBoe9J)"><path fill="#fdfd6d" d="M52 124c0-38.137 14.81-60 44-60s44 21.863 44 60c0 33.137-19.699 60-44 60s-44-26.863-44-60"/></g><g filter="url(#SVGjLHLue4y)"><path fill="url(#SVGPFCCTc3o)" d="M64 102c0-17.673 14.327-32 32-32s32 14.327 32 32v52c0 17.673-14.327 32-32 32s-32-14.327-32-32z"/></g><path fill="#fff" d="M78 127c0-7.18 5.82-13 13-13h10c7.18 0 13 5.82 13 13s-5.82 13-13 13H91c-7.18 0-13-5.82-13-13"/></g><g mask="url(#SVGIRatfbNq)" transform="translate(-47.543 -14.629)scale(1.82857)"><path fill="#f6a100" d="M96 56c-18.4 0-32 14.4-32 33.6v62.8c0 19.2 13.6 33.6 32 33.6s32-14.4 32-33.6V89.6C128 70.4 114.4 56 96 56"/></g><mask id="SVGIRatfbNq" width="80" height="46" x="56" y="140" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#ffbe00" d="M56 140h80v46H56z"/></mask></svg>'
    },
    {
      title: 'Classroom',
      url: 'https://classroom.google.com',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 578.9 500"><path fill="#0f9d58" d="M52.6 52.6h473.7v394.7H52.6z"/><path fill="#57bb8a" d="M394.7 263.2c16.4 0 29.6-13.3 29.6-29.6S411 204 394.7 204s-29.6 13.3-29.6 29.6s13.3 29.6 29.6 29.6m0 19.7c-31.7 0-65.8 16.8-65.8 37.6v21.6h131.6v-21.6c0-20.8-34.1-37.6-65.8-37.6m-210.5-19.7c16.4 0 29.6-13.3 29.6-29.6S200.5 204 184.2 204s-29.6 13.3-29.6 29.6s13.3 29.6 29.6 29.6m0 19.7c-31.7 0-65.8 16.8-65.8 37.6v21.6H250v-21.6c0-20.8-34.1-37.6-65.8-37.6"/><path fill="#f7f7f7" d="M289.5 236.8c21.8 0 39.5-17.7 39.4-39.5c0-21.8-17.7-39.5-39.5-39.4c-21.8 0-39.4 17.7-39.4 39.5s17.7 39.4 39.5 39.4m0 26.4c-44.4 0-92.1 23.6-92.1 52.6v26.3h184.2v-26.3c0-29.1-47.7-52.6-92.1-52.6"/><path fill="#f1f1f1" d="M342.1 421.1h118.4v26.3H342.1z"/><path fill="#f4b400" d="M539.5 0h-500C17.7 0 0 17.7 0 39.5v421.1C0 482.3 17.7 500 39.5 500h500c21.8 0 39.5-17.7 39.5-39.5v-421C578.9 17.7 561.3 0 539.5 0m-13.2 447.4H52.6V52.6h473.7z"/><path fill="#fff" d="M539.5 0h-500C17.7 0 0 17.7 0 39.5v3.3C0 21 17.7 3.3 39.5 3.3h500C561.3 3.3 579 21 579 42.8v-3.3C578.9 17.7 561.3 0 539.5 0" opacity=".2"/><path fill="#bf360c" d="M539.5 496.7h-500C17.7 496.7 0 479 0 457.2v3.3C0 482.3 17.7 500 39.5 500h500c21.8 0 39.5-17.7 39.5-39.5v-3.3c-.1 21.8-17.7 39.5-39.5 39.5" opacity=".2"/><linearGradient id="SVG3AmffecS" x1="154.865" x2="154.865" y1="295.747" y2="282.634" gradientTransform="matrix(12.992 0 0 -4 -1584.623 1631.087)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#bf360c" stop-opacity=".2"/><stop offset="1" stop-color="#bf360c" stop-opacity=".02"/></linearGradient><path fill="url(#SVG3AmffecS)" d="M460.3 447.4H341.9l52.6 52.6h118.3z"/><path fill="#263238" d="M52.6 49.3h473.7v3.3H52.6z" opacity=".2"/><path fill="#fff" d="M52.6 447.4h473.7v3.3H52.6z" opacity=".2"/><radialGradient id="SVG7ajZce2w" cx="131.401" cy="367.2" r="18.197" gradientTransform="matrix(38.0002 0 0 -38 -4973.328 13965.323)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><path fill="url(#SVG7ajZce2w)" d="M539.5 0h-500C17.7 0 0 17.7 0 39.5v421.1C0 482.3 17.7 500 39.5 500h500c21.8 0 39.5-17.7 39.5-39.5v-421C578.9 17.7 561.3 0 539.5 0"/></svg>'
    },
    {
      title: 'Earth',
      url: 'https://earth.google.com/web',
      svg: '<svg class="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 24 24"><path fill="#4285f4" d="M12 0c-1.326 0-2.597.22-3.787.613c4.94-1.243 8.575 1.72 11.096 5.606c1.725 2.695 2.813 2.83 4.207 2.412A11.956 11.956 0 0 0 12 0M7.658 2.156c-1.644.019-3.295.775-4.931 2.207A11.97 11.97 0 0 0 0 12c.184-2.823 2.163-5.128 4.87-5.07c2.104.044 4.648 1.518 7.13 5.289c4.87 7.468 10.917 5.483 11.863 1.51c.081-.566.137-1.14.137-1.729c0-.176-.02-.347-.027-.521c-1.645 1.725-4.899 2.35-8.264-2.97c-2.59-4.363-5.31-6.383-8.05-6.353zM3.33 13.236c-1.675.13-2.657 1.804-2.242 3.756A11.96 11.96 0 0 0 12 24c4.215 0 7.898-2.149 10.037-5.412v-.043c-2.836 3.49-8.946 4.255-13.855-2.182c-1.814-2.386-3.544-3.228-4.852-3.127"/></svg>'
    }
  ];

  // DOM Elements
  const googleAppsTrigger = document.getElementById('google-apps-trigger');
  const googleAppsMenu = document.getElementById('google-apps-menu');
  const googleAppsGrid = document.getElementById('google-apps-grid');
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
  const settingShowExamTimer = document.getElementById('setting-show-exam-timer');
  const settingAiEngine = document.getElementById('setting-ai-engine');

  // Schedule Elements
  const scheduleCard = document.getElementById('schedule-card');
  const statusIndicator = document.getElementById('status-indicator');
  const lessonStatusTitle = document.getElementById('lesson-status-title');
  const lessonStatusSub = document.getElementById('lesson-status-sub');
  const lessonCountdown = document.getElementById('lesson-countdown');
  const lessonCountdownLabel = document.getElementById('lesson-countdown-label');
  const lessonProgressBar = document.getElementById('lesson-progress-bar');

  // Deneme Sayacı Elements
  const examTimerCard = document.getElementById('exam-timer-card');
  const examIndicator = document.getElementById('exam-indicator');
  const examCountdown = document.getElementById('exam-countdown');
  const examPctText = document.getElementById('exam-pct-text');
  const examTimeSub = document.getElementById('exam-time-sub');
  const examMinutesInput = document.getElementById('exam-minutes-input');
  const examToggleBtn = document.getElementById('exam-toggle-btn');
  const examToggleIcon = document.getElementById('exam-toggle-icon');
  const examToggleText = document.getElementById('exam-toggle-text');
  const examResetBtn = document.getElementById('exam-reset-btn');
  const examProgressBar = document.getElementById('exam-progress-bar');
  const examPresets = document.getElementById('exam-presets');
  const examPresetBtns = document.querySelectorAll('.exam-preset-btn');
  const examStatusInfo = document.getElementById('exam-status-info');
  const examStatusLabel = document.getElementById('exam-status-label');
  const examStatusSub = document.getElementById('exam-status-sub');

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
    if (settingShowExamTimer) settingShowExamTimer.checked = settings.showExamTimer !== false;
    if (settingAiEngine) settingAiEngine.value = settings.aiEngine || 'google_ai';
    shortcutsGrid.style.display = settings.showShortcuts ? 'flex' : 'none';
    if (scheduleCard) scheduleCard.style.display = (settings.showSchedule !== false) ? 'block' : 'none';
    if (examTimerCard) examTimerCard.style.display = (settings.showExamTimer !== false) ? 'block' : 'none';
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
    url = (url || '').trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    if (settings.openInNewTab) {
      if (window !== window.top) {
        window.parent.postMessage({ type: 'SIGAL_NAVIGATE', url: url, newTab: true }, '*');
      }
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Break out of iframe so Google Drive, Gmail, etc. never get blocked with 403 Forbidden
    if (window !== window.top) {
      window.parent.postMessage({ type: 'SIGAL_NAVIGATE', url: url, newTab: false }, '*');
      try {
        window.top.location.href = url;
        return;
      } catch (_) {}
    }

    window.location.href = url;
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
      let finalUrl = (item.url || '').trim();
      if (finalUrl && !finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl;
      }

      const el = document.createElement('a');
      el.className = 'group relative flex flex-col items-center gap-2 w-20 text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer no-underline';
      el.href = finalUrl;
      el.target = settings.openInNewTab ? '_blank' : '_top';
      el.rel = 'noopener noreferrer';

      let domain = '';
      try { domain = new URL(finalUrl).hostname; } catch (_) {}
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

      el.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        if (e.button === 1 || e.ctrlKey || e.metaKey) return;
        e.preventDefault();
        navigate(finalUrl);
      });

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

  // Google Apps Menu
  function renderGoogleApps() {
    if (!googleAppsGrid) return;
    googleAppsGrid.innerHTML = '';
    GOOGLE_APPS.forEach(app => {
      const a = document.createElement('a');
      a.className = 'flex flex-col items-center justify-center p-2.5 rounded-2xl hover:bg-slate-100/90 active:scale-95 transition-all duration-150 cursor-pointer no-underline text-center group';
      a.href = app.url;
      a.target = settings.openInNewTab ? '_blank' : '_top';
      a.rel = 'noopener noreferrer';
      a.title = app.title;
      a.innerHTML = `
        <div class="w-11 h-11 rounded-2xl flex items-center justify-center p-1 transition-transform duration-200 group-hover:scale-110 drop-shadow-xs">
          ${app.svg}
        </div>
        <span class="mt-1 text-[11px] font-medium text-slate-700 tracking-tight truncate w-full group-hover:text-slate-900 select-none">${escapeHtml(app.title)}</span>
      `;
      a.addEventListener('click', (e) => {
        if (e.button === 1 || e.ctrlKey || e.metaKey) return;
        e.preventDefault();
        if (googleAppsMenu) {
          googleAppsMenu.classList.add('hidden');
          googleAppsMenu.classList.remove('flex');
        }
        navigate(app.url);
      });
      googleAppsGrid.appendChild(a);
    });
  }

  if (googleAppsTrigger && googleAppsMenu) {
    googleAppsTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = googleAppsMenu.classList.contains('hidden');
      if (isHidden) {
        googleAppsMenu.classList.remove('hidden');
        googleAppsMenu.classList.add('flex');
      } else {
        googleAppsMenu.classList.add('hidden');
        googleAppsMenu.classList.remove('flex');
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (googleAppsMenu && !googleAppsMenu.classList.contains('hidden')) {
      if (!googleAppsMenu.contains(e.target) && e.target !== googleAppsTrigger && !googleAppsTrigger.contains(e.target)) {
        googleAppsMenu.classList.add('hidden');
        googleAppsMenu.classList.remove('flex');
      }
    }
  });

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

  if (settingShowExamTimer) {
    settingShowExamTimer.addEventListener('change', () => {
      settings.showExamTimer = settingShowExamTimer.checked;
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
      if (googleAppsMenu) {
        googleAppsMenu.classList.add('hidden');
        googleAppsMenu.classList.remove('flex');
      }
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
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
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

  // --- Deneme Sayacı (Practice Exam Timer) Controller ---
  let examState = Object.assign({
    minutes: 40,
    totalSec: 40 * 60,
    remainingSec: 40 * 60,
    isRunning: false,
    endTime: null,
    isFinished: false
  }, JSON.parse(localStorage.getItem('sigal_exam_state') || '{}'));

  // Sync state if it was running when tab was closed/reloaded
  if (examState.isRunning && examState.endTime) {
    const now = Date.now();
    const remaining = Math.round((examState.endTime - now) / 1000);
    if (remaining <= 0) {
      examState.remainingSec = 0;
      examState.isRunning = false;
      examState.isFinished = true;
      examState.endTime = null;
    } else {
      examState.remainingSec = remaining;
    }
  }

  function saveExamState() {
    localStorage.setItem('sigal_exam_state', JSON.stringify(examState));
  }

  let activeAudioCtx = null;
  let lastBeepSec = -1;

  function stopAlarmAudio() {
    if (activeAudioCtx) {
      try {
        activeAudioCtx.close();
      } catch (_) {}
      activeAudioCtx = null;
    }
  }

  function playCountdownBeep(secLeft) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      // Urgency ascending pitch for 4, 3, 2, 1 seconds
      const freqs = { 4: 784, 3: 880, 2: 988, 1: 1046.5 };
      const freq = freqs[secLeft] || 880;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
      setTimeout(() => {
        try { ctx.close(); } catch (_) {}
      }, 450);
    } catch (_) {}
  }

  function playFinalAlarm() {
    stopAlarmAudio();
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      activeAudioCtx = new AudioCtx();
      const ctx = activeAudioCtx;
      const now = ctx.currentTime;

      // Powerful, rich 4-second final alarm sequence across 4 chimes
      const pulses = [0, 0.9, 1.8, 2.7];
      pulses.forEach((offset) => {
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(1046.5, now + offset);
        gain1.gain.setValueAtTime(0.5, now + offset);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.65);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now + offset);
        osc1.stop(now + offset + 0.65);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1318.5, now + offset + 0.1);
        gain2.gain.setValueAtTime(0.4, now + offset + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.75);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + offset + 0.1);
        osc2.stop(now + offset + 0.75);
      });
    } catch (_) {}
  }

  function renderExamTimer() {
    if (!examTimerCard || !examCountdown) return;

    const total = examState.totalSec || (examState.minutes * 60) || 2400;
    const remaining = Math.max(0, examState.remainingSec);
    const pct = total > 0 ? Math.min(100, Math.max(0, (remaining / total) * 100)) : 0;

    // Display formatted time
    examCountdown.textContent = formatCountdown(remaining);
    if (examPctText) examPctText.textContent = `${Math.round(pct)}%`;
    if (examProgressBar) examProgressBar.style.width = `${pct}%`;

    if (examMinutesInput) {
      examMinutesInput.disabled = examState.isRunning;
      if (examState.isRunning) {
        examMinutesInput.classList.add('opacity-60', 'cursor-not-allowed');
      } else {
        examMinutesInput.classList.remove('opacity-60', 'cursor-not-allowed');
      }
      if (document.activeElement !== examMinutesInput) {
        examMinutesInput.value = examState.minutes || 40;
      }
    }

    if (examPresetBtns) {
      examPresetBtns.forEach(btn => {
        btn.disabled = examState.isRunning;
        if (examState.isRunning) {
          btn.classList.add('opacity-40', 'cursor-not-allowed');
        } else {
          btn.classList.remove('opacity-40', 'cursor-not-allowed');
        }
      });
    }

    const hasStarted = examState.isRunning || (examState.remainingSec < total) || examState.isFinished;

    // Toggle bottom section: presets when idle, status info once started
    if (examPresets && examStatusInfo) {
      if (hasStarted) {
        examPresets.classList.add('hidden');
        examPresets.classList.remove('flex');
        examStatusInfo.classList.remove('hidden');
        examStatusInfo.classList.add('flex');
      } else {
        examPresets.classList.remove('hidden');
        examPresets.classList.add('flex');
        examStatusInfo.classList.add('hidden');
        examStatusInfo.classList.remove('flex');
      }
    }

    // Dynamic Theme based on remaining %:
    // >= 50%: Yeşil (Emerald)
    // 15% - 50%: Mavi (Blue)
    // < 15%: Kırmızı (Rose/Red)
    if (examState.isFinished || remaining === 0) {
      // Finished state (0%)
      if (examProgressBar) examProgressBar.className = 'h-full bg-rose-600 rounded-full transition-all duration-300';
      if (examIndicator) examIndicator.className = 'w-3 h-3 rounded-full bg-rose-600 ring-4 ring-rose-100 animate-pulse flex-shrink-0';
      if (examStatusLabel) {
        examStatusLabel.className = 'tracking-tight text-rose-600 font-bold animate-pulse';
        examStatusLabel.textContent = 'Süre Bitti!';
      }
      if (examStatusSub) examStatusSub.textContent = 'Tamamlandı';
      if (examTimeSub) examTimeSub.textContent = 'Süre Tamamlandı';
      examCountdown.className = 'text-3xl sm:text-4xl font-black tracking-tight text-rose-600 font-mono leading-none animate-pulse';
      if (examToggleBtn) {
        examToggleBtn.className = 'h-9 px-3.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer';
        examToggleIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
        examToggleText.textContent = 'Yeniden';
      }
    } else if (!examState.isRunning && hasStarted) {
      // Paused mid-exam
      const isGreen = pct >= 50;
      const isBlue = pct >= 15 && pct < 50;
      if (examProgressBar) examProgressBar.className = `h-full ${isGreen ? 'bg-emerald-500' : (isBlue ? 'bg-blue-600' : 'bg-rose-600')} rounded-full transition-all duration-300`;
      if (examIndicator) examIndicator.className = `w-3 h-3 rounded-full ${isGreen ? 'bg-emerald-500 ring-4 ring-emerald-100' : (isBlue ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-rose-600 ring-4 ring-rose-100')} flex-shrink-0`;
      if (examStatusLabel) {
        examStatusLabel.className = 'tracking-tight text-amber-600 font-bold';
        examStatusLabel.textContent = 'Duraklatıldı';
      }
      if (examStatusSub) examStatusSub.textContent = `%${Math.round(pct)} kaldı`;
      if (examTimeSub) examTimeSub.textContent = 'Kalan Süre';
      examCountdown.className = 'text-3xl sm:text-4xl font-black tracking-tight text-slate-800 font-mono leading-none';
      if (examToggleBtn) {
        examToggleBtn.className = `h-9 px-3.5 rounded-xl text-xs font-bold text-white ${isGreen ? 'bg-emerald-600 hover:bg-emerald-700' : (isBlue ? 'bg-blue-600 hover:bg-blue-700' : 'bg-rose-600 hover:bg-rose-700')} shadow-sm flex items-center gap-1.5 transition-all cursor-pointer`;
        examToggleIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
        examToggleText.textContent = 'Devam';
      }
    } else if (pct >= 50) {
      // Green Theme (>= 50%)
      if (examProgressBar) examProgressBar.className = 'h-full bg-emerald-500 rounded-full transition-all duration-300';
      if (examIndicator) examIndicator.className = 'w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 flex-shrink-0';
      if (examStatusLabel) {
        examStatusLabel.className = 'tracking-tight text-emerald-600 font-bold';
        examStatusLabel.textContent = 'Devam Ediyor';
      }
      if (examStatusSub) examStatusSub.textContent = `%${Math.round(pct)} kaldı`;
      if (examTimeSub) examTimeSub.textContent = 'Kalan Süre';
      examCountdown.className = 'text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-mono leading-none';
      if (examToggleBtn) {
        examToggleBtn.className = 'h-9 px-3.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer';
        if (examState.isRunning) {
          examToggleIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
          examToggleText.textContent = 'Duraklat';
        } else {
          examToggleIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
          examToggleText.textContent = 'Başlat';
        }
      }
    } else if (pct >= 15) {
      // Blue Theme (15% to 50%)
      if (examProgressBar) examProgressBar.className = 'h-full bg-blue-600 rounded-full transition-all duration-300';
      if (examIndicator) examIndicator.className = 'w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-100 flex-shrink-0';
      if (examStatusLabel) {
        examStatusLabel.className = 'tracking-tight text-blue-600 font-bold';
        examStatusLabel.textContent = 'Devam Ediyor';
      }
      if (examStatusSub) examStatusSub.textContent = `%${Math.round(pct)} kaldı`;
      if (examTimeSub) examTimeSub.textContent = 'Kalan Süre';
      examCountdown.className = 'text-3xl sm:text-4xl font-black tracking-tight text-blue-900 font-mono leading-none';
      if (examToggleBtn) {
        examToggleBtn.className = 'h-9 px-3.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer';
        if (examState.isRunning) {
          examToggleIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
          examToggleText.textContent = 'Duraklat';
        } else {
          examToggleIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
          examToggleText.textContent = 'Devam';
        }
      }
    } else {
      // Red Theme (< 15%)
      if (examProgressBar) examProgressBar.className = 'h-full bg-rose-600 rounded-full transition-all duration-300';
      if (examIndicator) examIndicator.className = 'w-3 h-3 rounded-full bg-rose-600 ring-4 ring-rose-100 animate-pulse flex-shrink-0';
      if (examStatusLabel) {
        examStatusLabel.className = 'tracking-tight text-rose-600 font-bold animate-pulse';
        examStatusLabel.textContent = 'Devam Ediyor';
      }
      if (examStatusSub) examStatusSub.textContent = `%${Math.round(pct)} kaldı`;
      if (examTimeSub) examTimeSub.textContent = 'Kalan Süre';
      examCountdown.className = 'text-3xl sm:text-4xl font-black tracking-tight text-rose-600 font-mono leading-none animate-pulse';
      if (examToggleBtn) {
        examToggleBtn.className = 'h-9 px-3.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer';
        if (examState.isRunning) {
          examToggleIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
          examToggleText.textContent = 'Duraklat';
        } else {
          examToggleIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
          examToggleText.textContent = 'Devam';
        }
      }
    }
  }

  function tickExamTimer() {
    if (!examState.isRunning) return;

    if (examState.endTime) {
      const remaining = Math.round((examState.endTime - Date.now()) / 1000);
      if (remaining <= 0) {
        examState.remainingSec = 0;
        examState.isRunning = false;
        examState.isFinished = true;
        examState.endTime = null;
        lastBeepSec = -1;
        saveExamState();
        renderExamTimer();
        playFinalAlarm();
        return;
      }
      examState.remainingSec = remaining;
    } else {
      examState.remainingSec = Math.max(0, examState.remainingSec - 1);
      if (examState.remainingSec <= 0) {
        examState.remainingSec = 0;
        examState.isRunning = false;
        examState.isFinished = true;
        lastBeepSec = -1;
        saveExamState();
        renderExamTimer();
        playFinalAlarm();
        return;
      }
    }

    // Son 4 saniye boyunca (4, 3, 2, 1) her saniye güçlü uyarı sesi
    if (examState.remainingSec <= 4 && examState.remainingSec >= 1 && examState.remainingSec !== lastBeepSec) {
      lastBeepSec = examState.remainingSec;
      playCountdownBeep(examState.remainingSec);
    }

    saveExamState();
    renderExamTimer();
  }

  function startExamTimer() {
    stopAlarmAudio();
    lastBeepSec = -1;
    if (examState.isFinished) {
      resetExamTimer();
    }
    examState.isRunning = true;
    examState.isFinished = false;
    examState.endTime = Date.now() + (examState.remainingSec * 1000);
    saveExamState();
    renderExamTimer();
  }

  function pauseExamTimer() {
    stopAlarmAudio();
    if (examState.isRunning && examState.endTime) {
      examState.remainingSec = Math.max(0, Math.round((examState.endTime - Date.now()) / 1000));
    }
    examState.isRunning = false;
    examState.endTime = null;
    saveExamState();
    renderExamTimer();
  }

  function resetExamTimer(mins) {
    stopAlarmAudio();
    lastBeepSec = -1;
    const m = (typeof mins === 'number') ? mins : (parseInt(examMinutesInput.value, 10) || examState.minutes || 40);
    const clampedMins = Math.max(1, Math.min(600, m));
    examState.minutes = clampedMins;
    examState.totalSec = clampedMins * 60;
    examState.remainingSec = clampedMins * 60;
    examState.isRunning = false;
    examState.endTime = null;
    examState.isFinished = false;
    saveExamState();
    renderExamTimer();
  }

  // Event Listeners for Exam Timer
  if (examToggleBtn) {
    examToggleBtn.addEventListener('click', () => {
      if (examState.isRunning) {
        pauseExamTimer();
      } else {
        startExamTimer();
      }
    });
  }

  if (examResetBtn) {
    examResetBtn.addEventListener('click', () => {
      resetExamTimer();
    });
  }

  if (examMinutesInput) {
    examMinutesInput.addEventListener('change', () => {
      resetExamTimer(parseInt(examMinutesInput.value, 10));
    });
    examMinutesInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        examMinutesInput.blur();
      }
    });
  }

  if (examPresetBtns) {
    examPresetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (examState.isRunning) return;
        const mins = parseInt(btn.dataset.mins, 10);
        if (mins) {
          resetExamTimer(mins);
        }
      });
    });
  }

  // Initialize
  applySettings();
  renderShortcuts();
  renderGoogleApps();
  updateLessonCountdown();
  renderExamTimer();
  updateClock();
  setInterval(() => {
    updateClock();
    updateLessonCountdown();
    tickExamTimer();
  }, 1000);

})();
