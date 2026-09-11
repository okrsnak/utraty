// Statistiky: spending across recent pay periods. The average month on a tag,
// a chart by month where tapping a column picks that month, the month by
// category against each category's own average, and every number in a table.

import { parseIsoDate, todayIso } from '../dates.js';
import { buildStats } from '../stats.js';
import { bindings, h } from './dom.js';
import { averageTag, emptyState, factsList, numbersTable, periodDetail, rangeControl, rangeLabel, trendSection } from './stats-sections.js';

const DEFAULT_MONTHS = 6;

export function createStatsView({ root, store, onAddRequested, now = () => new Date() }) {
  const rail = bindings(root.querySelector('.rail'));
  const body = root.querySelector('#stats');
  let months = DEFAULT_MONTHS; // finished months shown before the running one
  let selectedOffset = 0; // 0 is the running month, -1 the one before it…
  let expandedId = null; // category whose month-by-month chart is open
  let tableOpen = false;
  let lastIndex = 0; // column of the running month in the latest render

  function sections(state, today) {
    const year = parseIsoDate(today).year;
    const { payday } = state.settings;
    const stats = buildStats({ expenses: state.expenses, categories: state.categories, payday, today, count: months + 1 });
    lastIndex = stats.periods.length - 1;
    const selectedIndex = Math.max(0, lastIndex + selectedOffset);
    rail.status.textContent = rangeLabel(stats, year);
    return [
      h('div', { class: 'stats__head' }, rangeControl(months), averageTag(stats), factsList(stats, year)),
      trendSection({ stats, selectedIndex, year, payday }),
      periodDetail({ stats, selectedIndex, year, today, expandedId }),
      numbersTable(stats, year, tableOpen),
    ];
  }

  // A render replaces every button, so the tapped one is found again by its
  // focus key. It keeps its place on screen, even when the rows above it
  // re-sort, and gets focus back. WebKit does not focus a button on tap, so
  // the key comes from the tap itself. Charts that scroll sideways keep their
  // scroll position.
  function render(state, { focusKey = null } = {}) {
    const active = document.activeElement;
    const key = focusKey ?? (body.contains(active) ? active.dataset.focusKey : null);
    const find = () => (key ? body.querySelector(`[data-focus-key="${CSS.escape(key)}"]`) : null);
    const anchorTop = find()?.getBoundingClientRect().top;
    const scrolled = new Map([...body.querySelectorAll('.chart__scroll')].map((element) => [element.dataset.scrollKey, element.scrollLeft]));
    if (state.expenses.length === 0) {
      rail.status.textContent = '';
      body.replaceChildren(emptyState());
    } else {
      body.replaceChildren(...sections(state, todayIso(now())));
    }
    for (const element of body.querySelectorAll('.chart__scroll')) {
      element.scrollLeft = scrolled.get(element.dataset.scrollKey) ?? 0;
    }
    const target = find();
    if (!target) return;
    if (anchorTop !== undefined) root.scrollTop += target.getBoundingClientRect().top - anchorTop;
    target.focus({ preventScroll: true });
  }

  body.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const { range, columnIndex, expand, action } = button.dataset;
    if (action === 'go-add') {
      onAddRequested();
      return;
    }
    if (range) {
      months = Number(range);
      selectedOffset = Math.max(selectedOffset, -months);
    } else if (columnIndex !== undefined) selectedOffset = Number(columnIndex) - lastIndex;
    else if (expand) expandedId = expandedId === expand ? null : expand;
    else return;
    render(store.get(), { focusKey: button.dataset.focusKey });
  });

  // A re-render builds a new table, so remember whether it was left open.
  body.addEventListener('toggle', (event) => {
    if (event.target.classList?.contains('numbers')) tableOpen = event.target.open;
  }, true);

  return { render };
}
