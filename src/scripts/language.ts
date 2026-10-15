const storageKey = 'valentinnsh.language';
type Locale = 'en' | 'ru';
const isLocale = (value: unknown): value is Locale => value === 'en' || value === 'ru';

// Real links remain the navigation mechanism, including when storage is blocked.
const links = document.querySelectorAll<HTMLAnchorElement>('a[data-language]');
function preserveFragment() {
  links.forEach((link) => {
    const url = new URL(link.href);
    url.hash = location.hash;
    link.href = url.href;
  });
}
preserveFragment();
window.addEventListener('hashchange', preserveFragment);
links.forEach((link) => {
  link.addEventListener('click', () => {
    const locale = link.dataset.language;
    if (!isLocale(locale)) return;
    try { localStorage.setItem(storageKey, locale); } catch { /* Preference is optional. */ }
  });
});

// Only the root opts into detection. Shared /en/ and /ru/ URLs always win.
const chooser = document.querySelector<HTMLElement>('[data-language-root]');
if (chooser) {
  let preferred: Locale | undefined;
  try {
    const saved = localStorage.getItem(storageKey);
    if (isLocale(saved)) preferred = saved;
  } catch { /* Fall back to the browser language. */ }

  if (!preferred) {
    preferred = (navigator.languages || [navigator.language])
      .map((language) => language.toLowerCase().split('-')[0])
      .find(isLocale) ?? 'en';
  }
  const destination = new URL(`${chooser.dataset.base}${preferred}/`, location.origin);
  destination.search = location.search;
  destination.hash = location.hash;
  location.replace(destination.href);
}
