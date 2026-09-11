// Tiny DOM builder. Text always goes in as text nodes, never as HTML, so
// category names and notes can never inject markup.

import { formatNumber } from '../money.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

export function h(tag, attributes = {}, ...children) {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) {
    if (value === false || value === null || value === undefined) continue;
    if (name === 'dataset') Object.assign(element.dataset, value);
    else element.setAttribute(name, value === true ? '' : String(value));
  }
  element.append(...children.flat().filter((child) => child !== null && child !== undefined && child !== false && child !== ''));
  return element;
}

export function icon(name) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'icon');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', `#i-${name}`);
  svg.append(use);
  return svg;
}

// Map of data-bind name → element inside root.
export function bindings(root) {
  return Object.fromEntries([...root.querySelectorAll('[data-bind]')].map((element) => [element.dataset.bind, element]));
}

// A price the way shelf tags print it: whole crowns large, haléře small and raised.
export function price(amount, { currency = true } = {}) {
  const [crowns, fraction] = formatNumber(amount).split(',');
  return h(
    'span',
    { class: 'price' },
    h('span', { class: 'price__int' }, crowns),
    fraction ? h('span', { class: 'price__dec' }, `,${fraction}`) : null,
    currency ? h('span', { class: 'price__cur' }, ' Kč') : null,
  );
}
