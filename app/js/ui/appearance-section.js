// Nastavení → Vzhled: every colour scheme as a small preview of the app, drawn
// in its own colours (data-theme on the card) and picked like a radio button.

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

function card(theme, current) {
  const checked = theme.id === current;
  return h(
    'label',
    { class: 'theme-card', dataset: { theme: theme.id } },
    h('input', {
      type: 'radio',
      name: 'theme',
      value: theme.id,
      checked,
      class: 'visually-hidden',
      dataset: { themeChoice: theme.id, focusKey: `theme-${theme.id}` },
    }),
    preview(),
    h('span', { class: 'theme-card__name' }, theme.name),
    h('span', { class: 'theme-card__description' }, checked ? `${theme.description} · vybráno` : theme.description),
  );
}

export function renderAppearance(state) {
  return [
    h('p', { class: 'settings__help' }, 'Každé schéma má i tmavou podobu, která se zapne s tmavým režimem telefonu. Ikona na ploše zůstává žlutá.'),
    h('div', { class: 'theme-grid', role: 'radiogroup', 'aria-label': 'Barevné schéma' }, ...THEMES.map((theme) => card(theme, state.settings.theme))),
  ];
}
