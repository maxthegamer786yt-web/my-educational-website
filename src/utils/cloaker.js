export const CLOAK_PRESETS = [
  {
    id: 'default',
    name: 'Goon Arcade -moksh (Default)',
    title: 'Goon Arcade -moksh',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23a855f7"><path d="M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3zm1 7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h1v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1V9a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v1H7zm10 2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-3 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>'
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="44" height="34" x="2" y="7" rx="4" fill="%23137333"/><path fill="%23f9ab00" d="M24 16a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm-8 18c0-3.3 5.3-5 8-5s8 1.7 8 5v1H16v-1z"/><circle cx="15" cy="20" r="3" fill="%23ea4335"/><circle cx="33" cy="20" r="3" fill="%231a73e8"/></svg>'
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="%234285F4" d="M30 6H14a4 4 0 0 0-4 4v28a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4V14L30 6z"/><path fill="%23A1C2FA" d="M30 6v8h8L30 6z"/><path fill="%23FFF" d="M16 22h16v2.5H16zm0 6h16v2.5H16zm0 6h10v2.5H16z"/></svg>'
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="%23FFC107" d="M17 6h14l13 22H30L17 6z"/><path fill="%232196F3" d="M4 36l6.5-11 13.5 23H10.5L4 36z"/><path fill="%234CAF50" d="M10.5 48L24 25l13 23H10.5z"/></svg>'
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard | Canvas LMS',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="%23E02424"/><circle cx="24" cy="24" r="9" fill="%23FFF"/><circle cx="24" cy="8" r="4" fill="%23FFF"/><circle cx="24" cy="40" r="4" fill="%23FFF"/><circle cx="8" cy="24" r="4" fill="%23FFF"/><circle cx="40" cy="24" r="4" fill="%23FFF"/></svg>'
  },
  {
    id: 'desmos',
    name: 'Desmos Calculator',
    title: 'Desmos | Graphing Calculator',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="%23127842"/><path stroke="%23FFF" stroke-width="4" fill="none" stroke-linecap="round" d="M10 32c6-16 12-16 14 0s8 16 14 0"/></svg>'
  }
];

export function applyTabCloak(presetId, customTitle, customIcon) {
  const preset = CLOAK_PRESETS.find((p) => p.id === presetId) || CLOAK_PRESETS[0];
  const targetTitle = customTitle?.trim() || preset.title;
  const targetIcon = customIcon?.trim() || preset.icon;

  document.title = targetTitle;

  let link = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'shortcut icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = targetIcon;

  localStorage.setItem('goon_tab_cloak', presetId);
  if (customTitle) localStorage.setItem('goon_tab_cloak_custom_title', customTitle);
  if (customIcon) localStorage.setItem('goon_tab_cloak_custom_icon', customIcon);
}

export function getSavedTabCloak() {
  const presetId = localStorage.getItem('goon_tab_cloak') || 'classroom';
  const customTitle = localStorage.getItem('goon_tab_cloak_custom_title') || '';
  const customIcon = localStorage.getItem('goon_tab_cloak_custom_icon') || '';
  return { presetId, customTitle, customIcon };
}
