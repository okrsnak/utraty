// Nastavení → Vzhled: the style (printed or drawn) and the colour scheme, both
// picked like radio buttons. Every card is a small preview of the app drawn in
// what it offers: style cards in the current colours, colour cards in the
// current style.

import { STYLES } from '../styles.js';
import { THEMES } from '../themes.js';
import { h } from './dom.js';

function preview() {
  return h(
    'span',
    { class: 'theme-card__preview', 'aria-hidden': 'true' },
    h('span', { class: 'theme-card__rail' }),
    h(
      'span',
      { class: 'theme-card__tag' },
      h('span', { class: 'theme-card__hole' }),
      h('span', { class: 'theme-card__price' }, '129'),
      h('span', { class: 'theme-card__currency' }, 'Kč'),
    ),
    h('span', { class: 'theme-card__labels' }, h('span'), h('span'), h('span')),
  );
}

function card({ option, checked, group, theme, style }) {
  return h(
    'label',
    { class: 'theme-card', dataset: { theme, style } },
    h('input', {
      type: 'radio',
      name: group,
      value: option.id,
      checked,
      class: 'visually-hidden',
      dataset: { [`${group}Choice`]: option.id, focusKey: `${group}-${option.id}` },
    }),
    preview(),
    h('span', { class: 'theme-card__name' }, option.name),
    h('span', { class: 'theme-card__description' }, checked ? `${option.description} · vybráno` : option.description),
  );
}

export function renderAppearance(state) {
  const { theme, style } = state.settings;
  return [
    h('p', { class: 'settings__help' }, 'Styl mění tvary, písmo a povrch, barvy si vybíráš zvlášť: každý styl jde s každým schématem. Každé schéma má i tmavou podobu, která se zapne s tmavým režimem telefonu.'),
    h('h3', { class: 'settings__subtitle' }, 'Styl'),
    h('div', { class: 'theme-grid', role: 'radiogroup', 'aria-label': 'Styl' }, ...STYLES.map((option) => card({
      option,
      checked: option.id === style,
      group: 'style',
      theme,
      style: option.id,
    }))),
    h('h3', { class: 'settings__subtitle' }, 'Barvy'),
    h('div', { class: 'theme-grid', role: 'radiogroup', 'aria-label': 'Barevné schéma' }, ...THEMES.map((option) => card({
      option,
      checked: option.id === theme,
      group: 'theme',
      theme: option.id,
      style,
    }))),
  ];
}
