// Czech plural forms by CLDR rules: 1 útrata, 2–4 útraty, 0 and 5+ útrat.

const rules = new Intl.PluralRules('cs');

export function plural(count, [one, few, other]) {
  const form = rules.select(count);
  const word = form === 'one' ? one : form === 'few' ? few : other;
  return `${count} ${word}`;
}
