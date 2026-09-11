// Statistiky, piece by piece: the range switch, the average tag with its
// receipt, the chart by month, the chosen month by category (each against its
// own average) and every number again in a table.

import { formatShortDate, parseIsoDate } from '../dates.js';
import { formatAmount, formatNumber } from '../money.js';
import { daysUntilNextPeriod, formatCountdown, formatPeriodLabel, periodMonthName, periodMonthShort, periodSpanNote } from '../period.js';
import { plural } from '../plural.js';
import { categoriesForPeriod } from '../stats.js';
import { niceScale } from '../summary.js';
import { h, icon, price } from './dom.js';
import { columnChart } from './stats-chart.js';

const RANGES = [3, 6, 12];
const RANGE_LABELS = { 3: '3 měsíce', 6: '6 měsíců', 12: '12 měsíců' };
const COMPLETE_FORMS = ['celý měsíc', 'celé měsíce', 'celých měsíců'];
const ON_AVERAGE = 100; // within 1 Kč of the average counts as right on it

const sum = (amounts) => amounts.reduce((total, amount) => total + amount, 0);
const sentence = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// "březen – září", with years once the range crosses into another one, or a
// single month while there is only one.
export function rangeLabel(stats, year) {
  const first = stats.periods[0].period;
  const last = stats.periods.at(-1).period;
  if (first === last) return periodMonthName(last, year);
  const shownYear = first.anchor.year === last.anchor.year ? year : null;
  return `${periodMonthName(first, shownYear)} – ${periodMonthName(last, shownYear)}`;
}

export function rangeControl(months) {
  return h(
    'div',
    { class: 'range', role: 'group', 'aria-label': 'Kolik měsíců zpátky' },
    ...RANGES.map((value) => h(
      'button',
      { type: 'button', class: 'range__option', 'aria-pressed': String(value === months), dataset: { range: String(value), focusKey: `range-${value}` } },
      RANGE_LABELS[value],
    )),
  );
}

// The view's one tag: the average month. Until a month has finished there is
// nothing to average, and the tag says when there will be.
export function averageTag(stats) {
  const ready = stats.completeCount > 0;
  return h(
    'div',
    { class: 'total-tag' },
    h('span', { class: 'tag__hole', 'aria-hidden': 'true' }),
    h('p', { class: 'total-tag__label' }, 'Průměr za měsíc'),
    ready
      ? h('p', { class: 'total-tag__amount' }, price(stats.average))
      : h('p', { class: 'total-tag__amount is-pending' }, 'Po výplatě'),
    h(
      'p',
      { class: 'total-tag__unit' },
      h('span', {}, ready ? plural(stats.completeCount, COMPLETE_FORMS) : 'Počítá jen celé měsíce'),
      h('span', {}, ready ? 'běžící se nepočítá' : `první skončí ${formatShortDate(stats.firstFullEnd)}`),
    ),
  );
}

function fact(label, detail, amount) {
  return h(
    'div',
    { class: 'facts__row' },
    h('dt', {}, h('span', { class: 'facts__label' }, label), h('span', { class: 'facts__detail' }, detail)),
    h('dd', {}, price(amount)),
  );
}

export function factsList(stats, year) {
  const extremes = stats.completeCount >= 2
    ? [
      fact('Nejvíc', periodMonthName(stats.highest.period, year), stats.highest.total),
      fact('Nejmíň', periodMonthName(stats.lowest.period, year), stats.lowest.total),
    ]
    : [];
  return h('dl', { class: 'facts' }, ...extremes, fact('Celkem', rangeLabel(stats, year), stats.rangeTotal));
}

// Under each month: "zatím" for the running one, "od 14." where writing began
// part-way, and the year where the range crosses into a new one.
function monthColumns(stats, totals, year) {
  const crossesYear = stats.periods[0].period.anchor.year !== stats.periods.at(-1).period.anchor.year;
  const startedOn = stats.firstDate && parseIsoDate(stats.firstDate).day;
  return stats.periods.map(({ period, isCurrent, isPartial }, index) => {
    const showYear = crossesYear && (index === 0 || period.anchor.month === 1);
    const partial = isPartial && !isCurrent;
    return {
      label: periodMonthShort(period),
      sublabel: isCurrent ? 'zatím' : partial ? `od ${startedOn}.` : showYear ? String(period.anchor.year) : null,
      amount: totals[index],
      isCurrent,
      ariaLabel: [
        `${periodMonthName(period, year)}: ${isCurrent ? 'zatím ' : ''}${formatAmount(totals[index])}`,
        partial && `zápisy až od ${formatShortDate(stats.firstDate)}`,
      ].filter(Boolean).join(', '),
    };
  });
}

export function trendSection({ stats, selectedIndex, year, payday }) {
  const keys = [
    stats.completeCount > 0 && { swatch: 'average', text: `průměr ${formatAmount(stats.average)}` },
    { swatch: 'current', text: 'zatím, měsíc ještě běží' },
  ].filter(Boolean);
  return h(
    'section',
    { 'aria-labelledby': 'stats-trend' },
    h(
      'div',
      { class: 'section-head' },
      h('h2', { class: 'section-title', id: 'stats-trend' }, 'Po měsících'),
      h('p', { class: 'section-head__note' }, periodSpanNote(payday)),
    ),
    h('div', { class: 'chart-panel' }, columnChart({
      columns: monthColumns(stats, stats.periods.map((row) => row.total), year),
      selectedIndex,
      average: stats.average,
      focusPrefix: 'month',
      title: 'Útraty po měsících. Ťuknutím na sloupec vybereš měsíc.',
      keys,
    })),
  );
}

function versusAverage(total, stats) {
  const difference = total - stats.average;
  if (Math.abs(difference) < ON_AVERAGE) return 'přesně na průměru';
  return `o ${formatAmount(Math.abs(difference))} ${difference > 0 ? 'nad' : 'pod'} průměrem`;
}

function comparison(row, stats, today) {
  if (row.isCurrent) {
    const countdown = formatCountdown(daysUntilNextPeriod(today, row.period));
    return stats.completeCount > 0 ? [`Zatím ${versusAverage(row.total, stats)}`, countdown] : [countdown];
  }
  if (row.isPartial) return [`Zápisy až od ${formatShortDate(stats.firstDate)}`, 'Do průměru se nepočítá'];
  if (stats.completeCount < 2) return ['První celý měsíc'];
  return [sentence(versusAverage(row.total, stats))];
}

function categoryRow(item, { stats, scale, selectedIndex, year, expanded }) {
  const { category, amount, average, totals } = item;
  const hasAverage = stats.completeCount > 0;
  const share = (value) => (value / scale.max).toFixed(4);
  const panelId = `trend-${category.id}`;
  const classes = ['stat-row', category.archived && 'is-archived', amount === 0 && 'is-empty', expanded && 'is-open'];
  const meta = [hasAverage && `průměr ${formatAmount(average)}`, amount === 0 && 'nic', category.archived && 'vyřazená'];
  return h(
    'li',
    { class: classes.filter(Boolean).join(' ') },
    h(
      'button',
      {
        type: 'button',
        class: 'stat-row__head',
        'aria-expanded': String(expanded),
        'aria-controls': expanded ? panelId : null,
        dataset: { expand: category.id, focusKey: `category-${category.id}` },
      },
      h('span', { class: 'stat-row__name' }, category.name),
      h('span', { class: 'stat-row__amount' }, price(amount)),
      h(
        'span',
        { class: 'stat-row__bar', style: `--share: ${share(amount)}; --average: ${share(average)}`, 'aria-hidden': 'true' },
        h('span', { class: 'stat-row__fill' }),
        hasAverage && h('span', { class: 'stat-row__marker' }),
      ),
      h(
        'span',
        { class: 'stat-row__meta' },
        hasAverage && h('span', { class: 'stat-row__key', 'aria-hidden': 'true' }),
        meta.filter(Boolean).join(' · '),
      ),
      h('span', { class: 'stat-row__chevron' }, icon('right')),
    ),
    expanded && h(
      'div',
      { class: 'stat-row__trend', id: panelId },
      columnChart({
        columns: monthColumns(stats, totals, year),
        selectedIndex,
        average: hasAverage ? average : 0,
        compact: true,
        focusPrefix: `trend-${category.id}`,
        title: `${category.name} po měsících`,
      }),
      h('p', { class: 'stat-row__total' }, h('span', {}, `Celkem ${rangeLabel(stats, year)}`), price(sum(totals))),
    ),
  );
}

// The chosen month: its total against the average, then every category that
// had spend in the range, each on one shared scale with its average marked.
export function periodDetail({ stats, selectedIndex, year, today, expandedId }) {
  const row = stats.periods[selectedIndex];
  const items = categoriesForPeriod(stats, selectedIndex);
  const scale = niceScale(Math.max(0, ...items.map((item) => Math.max(item.amount, item.average))));
  return h(
    'section',
    { 'aria-labelledby': 'stats-month' },
    h(
      'div',
      { class: 'section-head' },
      h('h2', { class: 'section-title', id: 'stats-month' }, periodMonthName(row.period, year)),
      h('p', { class: 'section-head__note' }, formatPeriodLabel(row.period, year)),
    ),
    h(
      'div',
      { class: 'readout' },
      h('p', { class: 'readout__amount' }, price(row.total)),
      h('p', { class: 'readout__compare' }, ...comparison(row, stats, today).map((line) => h('span', {}, line))),
    ),
    items.length > 0 && h('ul', { class: 'stat-rows', role: 'list', 'aria-label': 'Podle kategorií' }, ...items.map((item) => categoryRow(item, {
      stats,
      scale,
      selectedIndex,
      year,
      expanded: item.category.id === expandedId,
    }))),
  );
}

// Every number the charts draw, newest month first.
export function numbersTable(stats, year, open) {
  const { periods, categories } = stats;
  const note = (row) => (row.isCurrent ? ' zatím' : row.isPartial ? ` od ${formatShortDate(stats.firstDate)}` : '');
  const bodyRows = periods.map((row, index) => h(
    'tr',
    {},
    h('th', { scope: 'row' }, periodMonthName(row.period, year), h('span', { class: 'numbers__note' }, note(row))),
    h('td', {}, formatNumber(row.total)),
    ...categories.map((item) => h('td', {}, formatNumber(item.totals[index]))),
  )).reverse();
  const averages = stats.completeCount > 0 && h('tfoot', {}, h(
    'tr',
    {},
    h('th', { scope: 'row' }, 'Průměr'),
    h('td', {}, formatNumber(stats.average)),
    ...categories.map((item) => h('td', {}, formatNumber(item.average))),
  ));
  return h(
    'details',
    { class: 'numbers', open },
    h('summary', { class: 'numbers__summary' }, h('span', {}, 'Všechna čísla'), icon('right')),
    h(
      'div',
      { class: 'numbers__scroll' },
      h(
        'table',
        { class: 'numbers__table' },
        h('caption', { class: 'visually-hidden' }, 'Útraty po měsících a kategoriích v Kč'),
        h('thead', {}, h(
          'tr',
          {},
          h('th', { scope: 'col' }, 'Měsíc'),
          h('th', { scope: 'col' }, 'Celkem'),
          ...categories.map((item) => h('th', { scope: 'col' }, item.category.name)),
        )),
        h('tbody', {}, ...bodyRows),
        averages,
      ),
    ),
    h('p', { class: 'numbers__foot' }, 'Částky v Kč, nejnovější měsíc nahoře. Průměr počítá jen celé měsíce.'),
  );
}

export function emptyState() {
  return h(
    'div',
    { class: 'empty' },
    h('p', {}, 'Statistiky se ukážou, až zapíšeš první útraty.'),
    h('button', { type: 'button', class: 'button', dataset: { action: 'go-add' } }, 'Přidat útratu'),
  );
}
