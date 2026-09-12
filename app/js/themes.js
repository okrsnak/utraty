// The colour schemes offered in Nastavení → Vzhled. The colours themselves live
// in CSS (base.css for the default, themes.css for the others); a test keeps
// this list and the CSS in step and checks every scheme for contrast.

export const DEFAULT_THEME = 'cenovka';

export const THEMES = [
  { id: 'cenovka', name: 'Cenovka', description: 'žlutá a černá' },
  { id: 'marcipan', name: 'Marcipán', description: 'pastelově růžová' },
  { id: 'cukrova-vata', name: 'Cukrová vata', description: 'růžová s levandulí' },
  { id: 'pudr', name: 'Pudr', description: 'tlumená pudrová růžová' },
  { id: 'broskev', name: 'Broskev', description: 'broskvově růžová' },
  { id: 'mata', name: 'Máta', description: 'pastelově mentolová' },
  { id: 'pomnenka', name: 'Pomněnka', description: 'světle modrá' },
];

export function isThemeId(id) {
  return THEMES.some((theme) => theme.id === id);
}
