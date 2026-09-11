// The two looks offered in Nastavení → Vzhled. A style changes shape, texture
// and lettering, never colour: the colours always come from the chosen scheme,
// so every style works with every scheme. The drawn one, with its own
// handwriting, lives in app/css/pastelka.css.

export const DEFAULT_STYLE = 'cenovka';

export const STYLES = [
  { id: 'cenovka', name: 'Hranatý', description: 'tištěná cenovka' },
  { id: 'pastelka', name: 'Kreslený', description: 'nakreslené pastelkou' },
];

export function isStyleId(id) {
  return STYLES.some((style) => style.id === id);
}
