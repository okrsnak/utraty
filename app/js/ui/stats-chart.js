// Column chart of amounts per pay period. One series, so one colour and no
// legend box. Columns stand on one baseline and stay square like everything on
// the shelf. The chosen column sits in a band (once there is more than one)
// and its month turns into a tag-coloured chip.
// The running period is hatched inside a dashed outline, because it is not
// finished yet. The average is a line painted behind the columns, so it reads
// in the air between them without slicing them. Every column is a button.
// When the columns would get too narrow to tap, the plot scrolls sideways and
// opens at the running month, while the ticks stay put in their own gutter.

import { niceScale } from '../summary.js';
import { h } from './dom.js';

const compactNumber = new Intl.NumberFormat('cs-CZ', { notation: 'compact', maximumFractionDigits: 1 });
const percent = (value, max) => `${((value / max) * 100).toFixed(2)}%`;
const barHeight = (amount, max) => (amount > 0 ? `max(2px, ${percent(amount, max)})` : '0');

const scaleSteps = (scale) => Array.from({ length: Math.round(scale.max / scale.step) + 1 }, (_, step) => step * scale.step);

function tickLabels(scale) {
  return h('div', { class: 'chart__ticks', 'aria-hidden': 'true' }, ...scaleSteps(scale).map((value) => h(
    'span',
    { class: 'chart__tick', style: `bottom: ${percent(value, scale.max)}` },
    compactNumber.format(value / 100),
  )));
}

// The baseline is the plot's own bottom rule, so gridlines start one step up.
function gridLines(scale) {
  return scaleSteps(scale).slice(1).map((value) => h(
    'span',
    { class: 'chart__grid', style: `bottom: ${percent(value, scale.max)}`, 'aria-hidden': 'true' },
  ));
}

function keyRow(keys) {
  return h('p', { class: 'chart__keys' }, ...keys.map(({ swatch, text }) => h(
    'span',
    { class: 'chart__key' },
    h('span', { class: `chart__swatch chart__swatch--${swatch}`, 'aria-hidden': 'true' }),
    text,
  )));
}

// columns: [{ label, sublabel (or null), amount, isCurrent, ariaLabel }]
// keys: [{ swatch: 'average' | 'current', text }], shown under a full-size chart.
export function columnChart({ columns, selectedIndex, average = 0, compact = false, focusPrefix, title, keys = [] }) {
  const scale = niceScale(Math.max(average, ...columns.map((column) => column.amount)));
  const bars = columns.map((column, index) => h(
    'button',
    {
      type: 'button',
      class: ['chart__column', index === selectedIndex && columns.length > 1 && 'is-selected', column.isCurrent && 'is-current'].filter(Boolean).join(' '),
      'aria-pressed': String(index === selectedIndex),
      'aria-label': column.ariaLabel,
      dataset: { columnIndex: String(index), focusKey: `${focusPrefix}-${index}` },
    },
    h('span', { class: 'chart__bar', style: `height: ${barHeight(column.amount, scale.max)}` }),
  ));
  const labels = columns.map((column, index) => h(
    'span',
    { class: 'chart__label' },
    h('span', { class: index === selectedIndex ? 'chart__month is-selected' : 'chart__month' }, column.label),
    column.sublabel && h('span', { class: 'chart__sublabel' }, column.sublabel),
  ));
  return h(
    'figure',
    { class: compact ? 'chart is-compact' : 'chart', 'aria-label': title },
    h(
      'div',
      { class: 'chart__frame' },
      !compact && tickLabels(scale),
      h(
        'div',
        { class: 'chart__scroll', dataset: { scrollKey: `${focusPrefix}:${columns.length}` } },
        h(
          'div',
          { class: 'chart__canvas', style: `--columns: ${columns.length}` },
          h(
            'div',
            { class: 'chart__area' },
            !compact && gridLines(scale),
            h('div', { class: 'chart__columns' }, ...bars),
            average > 0 && h('span', { class: 'chart__average', style: `bottom: ${percent(average, scale.max)}`, 'aria-hidden': 'true' }),
          ),
          h('div', { class: 'chart__axis', 'aria-hidden': 'true' }, ...labels),
        ),
      ),
    ),
    !compact && keys.length > 0 && keyRow(keys),
  );
}
