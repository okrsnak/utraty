---
name: "Útraty"
description: "A pay-period spending log printed as Czech supermarket shelf price tags, in six colour schemes."
colors:
  tag: "#ffd400"
  ink: "#111111"
  ink-soft: "#4f440d"
  ink-line: "#7c6909"
  ink-faint: "#887309"
  strike: "#e3000f"
  bar: "#111111"
  ground: "#e6e7ea"
  surface: "#ffffff"
  key: "#ffffff"
  key-pressed: "#d6d8dc"
  key-alt: "#d9dbe0"
  text: "#111111"
  muted: "#53565c"
  rule: "#111111"
  hairline: "#c7c9ce"
  rail: "#111111"
  rail-text: "#ffffff"
  rail-muted: "#b9bbc0"
  rail-track: "#3a3b3e"
  focus: "#111111"
  strike-dark: "#ff4d5e"
  bar-dark: "#ffd400"
  ground-dark: "#1d1e21"
  surface-dark: "#2a2c30"
  key-dark: "#34363b"
  key-pressed-dark: "#474a50"
  key-alt-dark: "#2a2c30"
  text-dark: "#f3f3f1"
  muted-dark: "#a9abb0"
  rule-dark: "#f3f3f1"
  hairline-dark: "#484b51"
  rail-dark: "#000000"
  focus-dark: "#ffd400"
typography:
  display:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "min(58cqh, 34cqw)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.01em"
    fontFeature: "'tnum'"
    fontVariation: "'wdth' 62"
  headline:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(3rem, 17vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1
    fontFeature: "'tnum'"
    fontVariation: "'wdth' 62"
  price:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 800
    fontFeature: "'tnum'"
    fontVariation: "'wdth' 62"
  key:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    fontFeature: "'tnum'"
    fontVariation: "'wdth' 75"
  title:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    letterSpacing: "0.01em"
    fontVariation: "'wdth' 75"
  name:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 800
    letterSpacing: "0.03em"
    fontVariation: "'wdth' 75"
  label:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 800
    letterSpacing: "0.05em"
    fontVariation: "'wdth' 75"
  list:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    fontVariation: "'wdth' 87.5"
  body:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.35
  caption:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    fontFeature: "'tnum'"
rounded:
  square: "0px"
  control: "4px"
  tag: "6px"
  hole: "50%"
spacing:
  seam: "2px"
  tight: "6px"
  shelf: "8px"
  stack: "10px"
  inline: "12px"
  gutter: "16px"
components:
  price-tag:
    backgroundColor: "{colors.tag}"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    rounded: "{rounded.tag}"
    padding: "16px 18px 10px"
  total-tag:
    backgroundColor: "{colors.tag}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.tag}"
    padding: "12px 16px 10px"
  tag-hole:
    backgroundColor: "{colors.ground}"
    rounded: "{rounded.hole}"
    size: "16px"
  date-chip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.tag}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "44px"
  shelf-label:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.name}"
    rounded: "{rounded.square}"
    padding: "7px 10px 6px"
    height: "58px"
  shelf-label-pressed:
    backgroundColor: "{colors.key-pressed}"
  shelf-label-stamped:
    backgroundColor: "{colors.tag}"
    textColor: "{colors.ink}"
  keypad-key:
    backgroundColor: "{colors.key}"
    textColor: "{colors.text}"
    typography: "{typography.key}"
    rounded: "{rounded.square}"
    height: "clamp(46px, 7.4dvh, 64px)"
  keypad-key-alt:
    backgroundColor: "{colors.key-alt}"
  keypad-key-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.tag}"
  button-primary:
    backgroundColor: "{colors.tag}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-ink:
    backgroundColor: "{colors.rail}"
    textColor: "{colors.tag}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  writable-line:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.square}"
    height: "44px"
  text-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "48px"
  select:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "0 40px 0 14px"
    height: "44px"
  picker-option:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.list}"
    padding: "0 14px"
    height: "48px"
  picker-option-selected:
    backgroundColor: "{colors.tag}"
    textColor: "{colors.ink}"
  category-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.name}"
    rounded: "{rounded.square}"
    padding: "8px 12px 10px"
  category-bar:
    backgroundColor: "{colors.hairline}"
    height: "8px"
  category-bar-fill:
    backgroundColor: "{colors.bar}"
    height: "8px"
  entry-action:
    backgroundColor: "{colors.tag}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "0 14px"
    height: "44px"
  entry-editor:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.square}"
    padding: "12px"
  entry-chip:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.square}"
    padding: "1px 5px"
  upcoming-row:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    padding: "10px 2px"
    height: "44px"
  recurring-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.square}"
    padding: "8px 4px 8px 12px"
  recurring-form:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.square}"
    padding: "12px"
  scheme-card:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.text}"
    rounded: "{rounded.square}"
    padding: "8px 8px 10px"
  range-option:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 6px"
    height: "44px"
  range-option-selected:
    backgroundColor: "{colors.tag}"
    textColor: "{colors.ink}"
  facts-list:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.square}"
    padding: "10px 12px"
  chart-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.square}"
    padding: "12px 12px 10px"
  chart-bar:
    backgroundColor: "{colors.bar}"
    rounded: "{rounded.square}"
    width: "min(24px, 62%)"
  chart-band:
    backgroundColor: "{colors.ground}"
  chart-month-chip:
    backgroundColor: "{colors.tag}"
    textColor: "{colors.ink}"
    padding: "1px 3px"
  readout:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.square}"
    padding: "10px 12px 12px"
  stat-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.name}"
    rounded: "{rounded.square}"
    padding: "8px 8px 8px 12px"
  stat-row-pressed:
    backgroundColor: "{colors.key-pressed}"
  numbers-table:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.square}"
    padding: "8px 12px"
  rail:
    backgroundColor: "{colors.rail}"
    textColor: "{colors.rail-text}"
    typography: "{typography.title}"
    padding: "12px 16px 10px"
  rail-strip:
    backgroundColor: "{colors.rail-track}"
    height: "4px"
  tab:
    backgroundColor: "{colors.rail}"
    textColor: "{colors.rail-muted}"
    height: "52px"
  tab-active:
    textColor: "{colors.rail-text}"
  undo-strip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    padding: "8px 16px"
  undo-action:
    backgroundColor: "{colors.tag}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "0 18px"
    height: "44px"
  undo-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "0 14px"
    height: "44px"
---

# Design System: Útraty

## Overview

**Creative North Star: "Cenovka"**

Cenovka is the Czech supermarket shelf price tag. Each spend is a tag printed in three taps; the pay period is the shelf it lands on. In the canonical Cenovka scheme the tag is shop yellow and black shelf-edge rails frame the top and bottom of every view. Between them, a grey ground holds square white labels, each hung from a heavy black top rule, and the tags are the only large block of colour on screen. It reads like a shop's own signage, printed and matter-of-fact, not like a finance product. Five colourways recolour the same shelf through the same tokens.

Density is shelf-like: one narrow column, controls packed 2 to 12px apart, every touch target at least 44px. Hierarchy comes from one condensed grotesque, Archivo, ranked by how narrow it runs, how heavy and how big: prices in the narrowest, heaviest cut, names and actions in condensed capitals, sentences at normal width. Colour does almost no ranking. The tag colour means tag or action, ink means numerals and rules, strike red means cancelled.

The world refuses the fintech dashboard: no rounded, shadowed white cards, no donut chart, no gradient header, no floating plus. Motion prints, short, weighted and downward. Nothing floats.

Appearance has two independent axes. `data-theme` carries one of the six colour schemes; `data-style` carries one of two styles: Cenovka, the printed look this file describes throughout, and Pastelka, the same app drawn by hand in a squared notebook. A style changes shape, texture and lettering only and takes every colour from the scheme's tokens, so all twelve combinations hold in light and dark. Where a rule below belongs to one style, it says so; the Tag Colour Rule, the Dashed Line Rule and the Form and Word Rule hold in both.

**Key Characteristics:**
- One tag-coloured tag owns each view; everything else is white label, ground or rail.
- Heavy 3px top rules and square corners; only tags (6px) and standalone controls (4px) are rounded.
- Solid rules hold what is written and finished; dashed lines hold what isn't live or isn't finished.
- One chart form: square columns on one baseline, the running month hatched, the average a line.
- One variable family ranked by width (62, 75, 87.5 and 100%), weight and size.
- Flat throughout: depth comes from fill, rule and seam, never shadow.
- Every state carries a form and a word, never colour alone.
- Motion prints downward on one weighted curve.
- Six colour schemes on the same 21 tokens, light and dark; the tag and its ink never change between modes.
- Two styles on one structure: printed by default, drawn on request, with colour always from the scheme.

## Colors

The palette is a shelf: a tag colour and its ink, a ground with white labels, rails, and a strike red kept for crossing things out. Colour lives in 21 tokens, each a solid hex. The frontmatter and the components below describe the printed style; a style of its own adds no colour. The frontmatter holds Cenovka, the canonical scheme; five colourways set the same tokens to other values (see Colour Schemes).

### Primary
- **Tag Yellow** (`tag`, #ffd400): the price tag itself (the entry tag and the period total) and everything you act on:
  - Primary buttons, Hotovo in the entry editor among them.
  - The undo strip's action and VRÁTIT on a deleted entry.
  - The selected picker option, the chosen range and the chosen month's chip on Statistiky, and the active tab's top bar.
  - The countdown fill in the top rail and the stamp flash on a shelf label.
  - Text selection: an amount opened for editing shows selected in the tag colour.

  It is also the lettering on the ink date chip and ink buttons, and the focus ring on both rails. It keeps its colour in dark mode, where it also becomes the focus ring everywhere and the category bar fill. In the colourways the tag is pink, rose, peach or mint.

### Secondary
- **Sale Red** (`strike`, #e3000f; dark #ff4d5e): the 3px line through a deleted entry's category and amount, and nothing else. In dark mode it is lifted: the light value measured only about 2.9:1 on the dark surface, the dark one holds 4.3:1.

### Neutral
- **Ink** (`ink`, #111111): numerals, rules and text on every tag, the date chip fill and the pressed keypad key.
- **Soft Ink** (`ink-soft`, #4f440d), **Ink Line** (`ink-line`, #7c6909) and **Faint Ink** (`ink-faint`, #887309): ink mixed into the tag colour, stored as solid colours. Each is the lightest mix that still clears its floor on the tag.
  - Soft ink carries secondary text on a tag: the note placeholder and the total tag's count and per-day line (6.8:1).
  - Ink line draws the dotted note line on the entry tag and the rule over the total tag's unit line (3.8:1).
  - Faint ink sets the empty zero on the entry tag (3.3:1).
- **Shelf Grey** (`ground`, #e6e7ea; dark #1d1e21): the page ground. It also shows through each tag's hang hole and bands the chosen column in the chart.
- **Label White** (`surface`, #ffffff; dark #2a2c30): shelf labels, category rows, the entry editor, recurring payment rows and their form, field rows, ruled panels, boxed inputs and the undo strip; on Statistiky, the receipt, the chart panel, the readout, the stat rows and the numbers table.
- **Key White** (`key`, #ffffff; dark #34363b), **Function Key Grey** (`key-alt`, #d9dbe0; dark #2a2c30), **Pressed Key Grey** (`key-pressed`, #d6d8dc; dark #474a50): keypad faces. The comma and backspace keys take the function grey; the pressed grey is also the pressed fill of a shelf label and a stat row.
- **Text Ink** (`text`, #111111; dark #f3f3f1) and **Muted Slate** (`muted`, #53565c; dark #a9abb0): text and secondary text. Muted carries running totals, counts, help, hints, placeholders, both the amount and the dashed rule of a payment still to come, and the chart's ticks, month labels and key row. Text ink also draws the chart's average line and the average markers on stat rows. Field errors are set in text ink, never red. Muted holds 6.0:1 on the ground and 7.4:1 on white; in dark mode, 7.3:1 and 6.1:1.
- **Shelf Rule** (`rule`, #111111; dark #f3f3f1): the 3px top rules, 2px day-head rules, the chart's 2px baseline and the table's footer rule, plus 2px input and select borders. It also draws the rings on quiet actions and unchosen range options, the PRAVIDELNÁ chip and the chosen scheme card.
- **Hairline Grey** (`hairline`, #c7c9ce; dark #484b51): 1px list dividers (receipt and table rows among them), chart gridlines, the picker list's top edge, the empty track of each category and stat bar, and the ring around each scheme card.
- **Rail Black** (`rail`, #111111; dark #000000), **Rail White** (`rail-text`, #ffffff), **Rail Grey** (`rail-muted`, #b9bbc0): both rails, the keypad seams and the ink button fill. Rail grey sets the countdown, the period status, the range on Statistiky and inactive tabs (9.8:1). The browser bar follows the rail colour.
- **Rail Track** (`rail-track`, #3a3b3e): the empty track of the countdown strip in the top rail, in both modes.
- **Bar Ink** (`bar`, #111111; dark #ffd400): the fill of each category's measured bar and stat bar, every chart column, and the hatch and dashed outline of the running month. It takes the tag colour in dark mode.
- **Focus Ink** (`focus`, #111111; dark #ffd400): the 3px focus ring at a 2px offset. On both rails it switches to the tag colour in either mode, so it never disappears into them.

### Colour Schemes
A scheme is one full set of the 21 colour tokens for light mode, plus a dark block that reassigns the ground, labels, keys, rules, rails and strike. It changes colour only: layout, type, shape and motion are the same in every scheme. The scheme is chosen in Nastavení → Vzhled and applied as `data-theme` on `<html>` before the first paint; an unknown scheme falls back to Cenovka. The browser bar takes the scheme's rail colour, and the home-screen icon stays Cenovka yellow.

Five roles make a scheme:

- **Tag** (`tag`): a light, clear colour the ink reads on. The same in dark mode.
- **Ink family** (`ink`, `ink-soft`, `ink-line`, `ink-faint`): a deep ink in the tag's hue and its solid mixes over the tag. The same in dark mode.
- **Rails** (`rail`, `rail-text`, `rail-muted`, `rail-track`, with `rule`, `focus` and `bar`): a deep colour for both rails and the keypad seams. In light mode the same colour draws the shelf rules and the focus ring, and in every scheme but Cukrová vata the bar. In dark mode the rail goes near-black, rules take the text colour, and the focus ring and bar take the tag colour.
- **Ground and surface** (`ground`, `surface`, `key`, `key-pressed`, `key-alt`, `hairline`, with `text` and `muted`): a ground tinted towards the scheme, near-white labels and keys, and the text that sits on them. In dark mode, tinted near-blacks.
- **Strike** (`strike`): always a red (sale red, raspberry, brick or crimson), lifted in dark mode.

The six schemes in light mode (full sets, dark included, live in `app/css/base.css`, `app/css/themes.css` and the sidecar's `extensions.schemes`):

| Scheme | Character | Tag | Ink | Rails | Ground | Strike |
|---|---|---|---|---|---|---|
| **Cenovka** (canonical) | žlutá a černá: shop yellow, black rails | #ffd400 | #111111 | #111111 | #e6e7ea | #e3000f |
| **Marcipán** | pastelově růžová: pastel pink, plum rails | #f7c3d4 | #3a1627 | #3a1627 | #f6eaef | #c2185b |
| **Cukrová vata** | růžová s levandulí: pink on lavender, violet rails | #ffc7de | #2a1d47 | #45357a | #efebfa | #c2185b |
| **Pudr** | tlumená pudrová růžová: powder rose, mauve rails | #e8b7bf | #33201f | #4a2f36 | #efe7e5 | #b3261e |
| **Broskev** | broskvově růžová: peach-pink, cocoa rails | #ffcdb5 | #3b1d12 | #4a2620 | #f8ece6 | #a3123a |
| **Máta** | pastelově mentolová: pastel mint, deep teal rails | #bfe9d5 | #0f2b25 | #15403a | #e7f1ed | #c62828 |

Every scheme, in both modes, sets all 21 tokens as solid hex and clears these contrast floors, checked by `tests/themes.test.js`:

- **4.5:1:**
  - text and muted on the ground and the surface;
  - text on key and key-alt;
  - ink and soft ink on the tag;
  - rail text and rail grey on the rail.
- **3:1:**
  - ink line and faint ink on the tag (ink line is tuned to clear 3.4:1);
  - the tag on the rail and on the rail track;
  - strike and bar on the surface, and bar on the hairline;
  - rule and focus on the ground.

The ink button sets text in the tag colour on the rail. That needs 4.5:1, not the 3:1 the test asks for. Every current scheme clears 6.8:1 there, and a new scheme has to as well.

**Overlays in the drawn style.** Pastelka adds only translucent black and white over the scheme's own colours: two crayon passes on a fill (white at 11% covering 1px in 9, black at 1.8% covering 1px in 13; 9% and 2% in dark mode), a grain at 16% on the cards, blended multiply in light and soft-light in dark, and grid lines on the paper at 5% black in light and 6% white in dark. The ground carries no grain of its own.

Measured across all six schemes in both modes, at the darkest pixel of every overlay, each pair clears its floor. The thin margins are worth knowing:

- **Faint ink**, the empty zero on the tag, reads 3.06–3.20:1 where a black crayon streak lands, against a 3 floor. On the plain tag it reads 3.20–3.32:1, so that margin is thin by construction rather than by overlay.
- **Soft ink on a crayoned tag** bottoms out at 4.56:1 (Pudr dark), against a 4.5 floor.
- **Muted text** holds 5.30:1 and up on the ruled paper, and 4.67:1 and up on a grained card, against a 4.5 floor.

An overlay has to leave every pair above its floor at its darkest pixel.

### Named Rules
**The Tag Colour Rule.** The tag colour is the tag and what you act on: price tags, primary actions, the undo action, Hotovo, the chosen option, range and month, the active tab bar, the countdown fill, the stamp flash, and the focus ring on the rails. It never fills the ground, a section or a plain label. It holds in both styles; the drawn style colours the same fills in with crayon.

**The Strike Rule.** Strike red only crosses out: it strikes cancelled amounts and does nothing else. Errors are written in ink, and actions that replace or delete data use the ink button.

**The Tag Doesn't Dim Rule.** The tag and its ink family are the same in light and dark, in every scheme. Dark mode swaps the ground, labels, keys, rules and rails around the tags; the tags print exactly the same.

**The Colourway Rule.** A scheme recolours tokens and nothing else. Components take every colour role from a token, never a hex, so a screen designed in Cenovka holds in every colourway, light and dark.

## Typography

**Display Font:** Archivo, variable (width 62–125%, weight 100–900), self-hosted as latin and latin-ext woff2 (with 'Helvetica Neue', Arial, sans-serif)
**Body Font:** Archivo, same files, at normal width
**Label/Mono Font:** none; labels are Archivo in condensed capitals
**Drawn Font (Pastelka):** Patrick Hand, self-hosted as latin and latin-ext woff2 (about 25 kB, OFL, licence at `app/fonts/patrick-hand-ofl.txt`), with 'Bradley Hand', 'Segoe Print', cursive

**Character:** One grotesque of the kind printed on shelf tags: narrow, heavy numerals that fit a big price in a small space, and condensed capitals for product names. Nothing is set in a second face. The build sets width with `font-stretch` percentages.

### Hierarchy
- **Display** (800, 62% width, min(58cqh, 34cqw) of the tag, line height 0.9, -0.01em, tabular): the amount on the entry tag, sized by the tag container so it fills the tag. It steps down to min(46cqh, 25cqw) and then min(34cqh, 18.5cqw) as the number grows. The amount is right-aligned, haléře sit at 0.46em against the top, and "Kč" follows at 75% width.
- **Headline** (800, 62%, clamp(3rem, 17vw, 4.5rem), line height 1, tabular): the period total on the Přehled tag and the monthly average on Statistiky. Until a month has finished, "Po výplatě" stands in for the average at 2.25rem and 75% width.
- **Price** (800, 62%, 1.375rem, tabular): category row amounts. The same cut sets:
  - day-list and receipt amounts at 1.25rem;
  - category stat rows at 1.375rem, like category rows;
  - the chosen month's readout at 2rem;
  - an amount being edited at 1.5rem;
  - payments still to come at 1.125rem in muted, and the range total under a category's trend at 1.125rem;
  - the 129 on each scheme card at 1.875rem.
- **Key** (700, 75%, 1.875rem, tabular): keypad digits.
- **Title** (800, 75%, 1.25rem, 0.01em): the rail's period range and view names.
- **Name** (800, 75%, 1rem, 0.03em, uppercase): shelf label names. Category rows and stat rows set it at 1.0625rem. The same 800 condensed cut, in sentence case, sets recurring payment names and category names in Nastavení (1.0625rem) and scheme names in Vzhled (1rem).
- **Label** (800, 75%, 1rem, 0.05em, uppercase): buttons and the undo strip's actions. Close variants:
  - VRÁTIT on a deleted entry at 0.04em;
  - section heads at 0.9375rem and 0.06em;
  - tabs at 700 and 0.06em;
  - the date chip at 0.9375rem and 0.04em;
  - form labels at 0.8125rem;
  - the PRAVIDELNÁ chip at 0.6875rem;
  - receipt labels (NEJVÍC, NEJMÍŇ, CELKEM) at 0.9375rem;
  - table header cells at 0.75rem, in muted.
- **List** (700, 87.5%, 1rem): entry categories and picker options. Text being written uses the same width: notes at 600 (1.0625rem on the tag and in the undo strip) and labelled form fields at 700 and 1.0625rem. An amount being written keeps the Price cut. The shelf hint is 600 at 0.875rem.
- **Body** (400, normal width, 1rem, line height 1.35): help copy and messages. At 0.875rem in muted it also sets saved notes under an entry and the recurring payment line ("12 000 Kč · měsíčně · Nájem"). Help paragraphs stop at 60ch.
- **Caption** (600, 0.8125rem, tabular, in muted): running totals under shelf labels, counts, section-head notes (the ruler step, "celkem 259 Kč"), picker option notes, stat-row meta and the chart's key row. The chart's own labels are condensed and muted: month labels at 0.8125rem and 700, ticks at 0.75rem and 600, sublabels at 0.6875rem and 600, all at 75% width. Larger meta keeps the 600 weight: receipt months and the readout's comparison lines at 0.9375rem, and table cells at 0.875rem in text colour.

### Drawn Lettering (Pastelka)
The hand carries names, labels, headings, tabs, sentences and every written word, at weight 400, normal width, sentence case and 0.01em. There are no tracked capitals: handwriting says the word rather than shouting it.

Titles and names step up about 6%, because the hand runs smaller than Archivo at the same size: section titles, the total tag's name line, receipt labels, settings subtitles and the table's summary to 1.125rem; shelf, category and stat names and the rail's period to 1.1875rem.

Amounts, keypad digits, chart ticks, shelf-label totals, the editor's amount and every table figure stay in Archivo. The numbers must read at a glance.

### Named Rules
**The Width Is Rank Rule.** Rank by width before anything else: 62% for prices, 75% for names, labels, rails, keys and buttons, 87.5% for list lines, hints and text being written, normal width for sentences. Weight follows role: 800 for prices, names and actions, 700 for keys, tabs and list lines, 600 for meta, hints and written notes, 400 for prose. This ranks the printed style; the drawn style has one hand at one weight and ranks by size alone.

**The Small Haléře Rule.** Every amount prints like a shelf price: crowns big, haléře small and raised (0.46em on the tag, 0.62em lifted 0.42em inline), "Kč" smaller after the number, tabular figures, never wrapping. It holds in both styles, because amounts stay in Archivo in the drawn one.

## Layout

A single column of at most 520px (`--app-width`), centred on the ground. On desktop the column stays phone-width and never spreads into more columns. The app is a full-height grid (100dvh): each view scrolls between a sticky top rail and the tab rail at the bottom, and both rails respect the safe-area insets.

The side gutter is 16px on every view. Přidat stacks top to bottom:

- The rail.
- The tag, which takes the height the rest leaves (176 to 300px, about a third of the screen).
- A three-column shelf of labels 8px apart, with the category picker in the next slot, spanning the columns the labels leave free.
- The keypad: three columns, each row clamp(46px, 7.4dvh, 64px).

Přehled stacks the total tag, then "Ještě přijde" (current period only, and only when a payment is still due), category rows 6px apart and day groups 18px apart, with 26px between sections.

Statistiky stacks a head block (the range switch, the average tag and the receipt, 10px apart), then Po měsících, the chosen month and the numbers table, with 14px top padding and 26px between sections. Its grid column is minmax(0, 1fr), so the wide table scrolls inside its own box and the page never scrolls sideways.

Nastavení runs Den výplaty, Kategorie, Pravidelné platby, Vzhled, Záloha and, until the app is installed, Na plochu. Sections sit 30px apart with 10px inside them. A button set directly in a Nastavení section stretches to the full column width, like "+ Přidat pravidelnou platbu".

Short phones (max-height 700px, the iPhone SE) tighten the entry screen: the tag's minimum height drops to 150px, keypad rows to clamp(44px, 7dvh, 52px), shelf labels to 52px, and the vertical margins to 8 to 10px. While the keyboard is up for the picker, the picker takes the whole shelf and the labels, hint and keypad hide.

Both styles share these measurements. The drawn style changes edges, texture and lettering, never the grid.

### Named Rules
**The Shelf Rail Rule.** Every view hangs between two rails in the rail colour. The top rail carries what you are looking at (the period with its countdown or status, or the view name); the bottom rail carries the four tabs. Content scrolls between them, never over them.

## Elevation & Depth

Flat by construction. There are no drop shadows and no elevation layers. Depth comes from three things:

- Fill against ground: the tag colour and white labels on the ground.
- The heavy top rule on every label.
- The 2px seams in the rail colour that make the keypad one membrane panel.

Pressed things move down, not up: labels and buttons drop 1px, and the stamp lands 3px low.

### Shadow Vocabulary
- **Hang hole** (`box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.4)`): the only soft shadow. It gives the 16px punched hole in each tag its depth. The hole is filled with the ground colour, so it reads as cut through the tag.
- **Drawn ring** (`box-shadow: inset 0 0 0 2px var(--rule)`): the 2px outline on quiet buttons and on the undo strip's Poznámka action, drawn inside so they keep their size. The same inset ring appears on:
  - the PRAVIDELNÁ chip, 1px in `rule`;
  - archived category rows in Nastavení, 1px in hairline;
  - the scheme cards: 1px in hairline, or 3px in `rule` on the chosen card;
  - the range options on Statistiky until one is chosen, 2px in `rule`.
- **Surface ring** (`box-shadow: 0 0 0 2px var(--surface)`): drawn outside the average marker on stat rows and its key, so the text-ink upright stays apart from a bar fill of the same colour.

### Drawn Texture (Pastelka)
The drawn style stays flat and adds material instead. All of it is translucent black or white, so every scheme keeps its own hue.

- **Paper:** the ground carries a 22px squared ruling in `--grid-line` and nothing else. The grain, an SVG noise at 16% blended multiply in light and soft-light in dark, sits on the cards.
- **Crayon:** fills are coloured in with `--crayon`, two uneven translucent passes at 112° and 97°, never an even stripe. It covers the tag and total tag, the date chip, primary and ink buttons, the chosen picker option, VRÁTIT, the undo action, the chosen range option, the chosen month's chip and the measured bar fills.
- **Torn edges:** the top rail and the tab bar end in a strip of `rail` masked by `--edge-wave`.
- **Squiggles:** `--squiggle` masks the chosen tab's underline (in the tag colour), section titles and day heads (in `rule`), the total tag's unit rule (in `ink-line`), the chart's baseline, the average line and its key, and the table's footer rule.
- **Shaky icons:** one SVG displacement filter (`#pastelka-rough`, feTurbulence plus feDisplacementMap at scale 1.8) shakes every icon's line, and the stroke goes to 2.2.

### Named Rules
**The Printed Flat Rule.** Nothing floats. To make something stand out, give it a fill, a rule or a word, never a shadow. It holds in both styles: the drawn one adds texture, not elevation, and even the tag's hole is drawn rather than shadowed.

## Shapes

Square by default: a shelf is cut, not moulded. This is the printed style's form language; the drawn style replaces it, below.

- **Square with a 3px top rule:** white labels, category rows, the entry editor, recurring payment rows and their form, field rows, panels, the undo strip, and on Statistiky the receipt, chart panel, readout, stat rows and numbers table. The strip's rule runs along its bottom edge.
- **Square with no rule:** keypad keys and chart columns.
- **Square with an inset ring instead:** the scheme cards in Vzhled.
- **6px corners:** the price tags, like die-cut card.
- **4px corners:** standalone controls you press or type into (buttons, the range options, the date chip, the select, the new-category input) and the miniature tag on each scheme card.
- **Square actions and marks:** anything set into a strip or a row, meaning the undo strip's two actions, VRÁTIT on a deleted entry and the PRAVIDELNÁ chip. Buttons inside a form, like the entry editor's Hotovo and Zrušit, are standalone buttons with 4px corners.
- **The one circle:** the 16px hang hole, top left on every tag (6px on a scheme card's miniature).

Line styles carry meaning:

- **Solid 3px top rule:** a shelf edge.
- **Dashed lines:** something not live or not finished. An archived category takes a dashed 3px top rule, on category rows and stat rows alike; a payment still to come sits on a 1px dashed rule in muted; the running month's column is hatched inside a 2px dashed outline in `bar`.
- **Dotted underline:** text you can write on. It is 2px under a field: the note on the tag, the picker, category names in Nastavení, the note line in the undo strip, and every labelled form field, dates included. It is 1px under the "přidat poznámku" invitation on an entry without a note. A field you are writing in shows a solid underline.
- **1px hairline:** divides list items.

### Drawn Shapes (Pastelka)
The drawn style drops the 3px top rule and the square default for drawn paper.

- **Paper cards:** every white label, row, field and panel takes a full 2px outline in `rule` with an uneven radius, cycled across `--paper-1`, `--paper-2` and `--paper-3` by nth-child, plus a second 1px outline at 32% opacity offset up and to the left: the line drawn once more, never quite on top. Archived rows keep the dashed rule.
- **The tag:** a 2px outline in `ink` with an uneven radius, and a hand-drawn circle for the punched hole in place of the printed one and its inset shadow.
- **The keypad:** twelve drawn keys 6px apart with uneven radii and no panel behind them. Pressing one still inverts to ink.
- **Bars:** a drawn track, 2px in `hairline` with an uneven radius, with the crayoned fill inside it.
- **Chart columns:** a 2px outline in `bar` with uneven top corners. The running month keeps its hatch and dashed outline, and the chosen month's chip becomes a crayon circle.
- **Actions:** buttons, strip actions and chips take the uneven radii too.

### Named Rules
**The Shelf Edge Rule.** Every white label, row, field and panel hangs from a 3px top rule in `rule` and keeps square corners. In the drawn style the same labels take the double drawn outline instead.

**The Dashed Line Rule.** A dashed line means not live or not finished: an archived category, a payment not written yet, or the month still running. Everything written and finished sits on a solid line. It holds in both styles: archived rows keep their dashed edge and the running month keeps its dashed outline and hatch.

**The Write-Here Rule.** A dotted underline means you can write here: 2px under a field, 1px under the invitation to add a note. While you write, the line goes solid instead of showing a focus outline.

## Components

### Price Tag (signature)
The entry screen's main surface: the tag colour, 6px corners, 16px 18px 10px padding, and a 16px hang hole 16px from the top and 18px from the left. The amount sits bottom right in Display with "Kč" after it. Under it runs the meta line:

- **The note:** writable, 1.0625rem at 600 and 87.5% width, with a 2px dotted underline in ink line and its placeholder in soft ink.
- **The date chip:** ink fill, capitals in the tag colour, 44px tall, 4px corners. The native date input sits invisibly over it.

While the tag is empty, its zero is set in faint ink. On save, the amount prints down out of the tag and the fresh zero prints in from above (340ms). Tapping a label with no amount nudges the tag sideways (300ms), and the hint above the shelf jumps to 800-weight text.

The Přehled total tag uses the same colour, corners and hole. A name line ("CELKEM ZA OBDOBÍ", Label capitals at 0.9375rem, indented past the hole) sits over the total in Headline. Beneath that is a unit line under a 1px rule in ink line, holding the entry count and daily average in soft ink. The name line says what the price is, like the product name on a shelf tag.

### Shelf Label
- **Shape:** square, 3px top rule, at least 58px tall (52px on short phones), 7px 10px 6px padding, three to a row.
- **Content:** the category name in Name capitals over its running period total as a muted Caption.
- **Press:** fills with pressed grey and drops 1px.
- **Save:** the label stamps, landing 3px low in the tag colour with ink lettering and settling back as the colour fades (500ms) while its total ticks up.

### Scale Keypad
Twelve flat, square keys on a grid in the rail colour: 2px seams and a 2px border, three columns. Keys are key white with Key digits; the comma and backspace take the function grey. Every key, comma and backspace included, turns ink with a tag-coloured glyph while pressed. Backspace is an inline 24px stroked icon (2px stroke, round joins), like every icon in the app.

### Buttons
- **Shape:** 4px corners, at least 44px tall, 0 16px padding, Label capitals. An optional 20px icon sits 6px before the text.
- **Primary:** tag fill, ink lettering. The default for any action.
- **Quiet:** transparent with the 2px drawn ring in `rule`, lettering in text colour. For secondary actions (Vyřadit, Upravit, Obnovit ze zálohy, Zrušit).
- **Ink:** rail fill, lettering in the tag colour. Only for actions that replace or delete data (Obnovit, Opravdu smazat, Smazat on a recurring payment).
- **Press / Focus:** drops 1px when pressed; the 3px focus ring sits at a 2px offset. There is no hover treatment; this is a touch app.

### Inputs / Fields
- **Writable line:** no box and no fill, just a 2px dotted underline, square: muted on white labels and in the strip, ink line on the tag. The underline turns solid while you write, in place of an outline. Used for the note on the tag, the picker, category names, the note line in the undo strip and every labelled form field (native date inputs included). Placeholders always take muted, or soft ink on the tag.
- **Labelled field:** a form label (capitals at 0.8125rem, 800 and 75% width, 0.05em) 4px above its control. The recurring form and the entry editor share it. A text or date input inside is a writable line at 1.0625rem, 700 and 87.5% width; a select inside runs the full width.
- **Boxed input:** the new-category input, white with a 2px `rule` border, 4px corners, 48px tall.
- **Select:** white with a 2px `rule` border, 4px corners, 44px tall, set at 1.125rem, 800 and 75% width. A chevron (the right arrow turned 90°) sits 10px from the right edge.
- **Field row:** a white label with a 3px top rule, holding a 700-weight label on the left and the control on the right.
- **Error:** 0.875rem 700 text in text ink directly under the field, announced as an alert. Errors are never red.

### Navigation
- **Top rail:** the rail colour; top padding is the safe-area inset or 12px, whichever is larger, with 16px sides and 10px below. The period sits left in Title, and the countdown ("Do výplaty N dní") or status sits right in rail grey (0.9375rem, 600). Under both runs a 4px countdown strip: a rail-track track whose fill, in the tag colour, grows left to right as the period runs (400ms). On Přehled, the rail centres the period and its status between 44px previous and next arrows, and the next arrow hides on the current period. On Statistiky, the rail carries the title and, on the right in rail grey, the range ("březen – září", with years when it crosses one).
- **Tab rail:** four equal tabs (Přidat, Přehled, Statistiky, Nastavení), 52px tall, in rail grey capitals (1rem, 700, 75% width, 0.06em). The active tab turns rail white and gets a 4px top bar in the tag colour.
- **Focus:** on both rails the focus ring takes the tag colour.

### Category Picker
The next slot on the shelf: a white label with a writable line for searching or naming a new category. Opening it takes over the whole shelf, adds a 44px close button, and drops a list below a hairline:

- Options are 48px rows in List type, divided by hairlines.
- The selected option fills with the tag colour and shows a chevron marker.
- Create and restore options lead with a plus icon; notes are muted Captions.

### Category Row with Ruler (signature)
Přehled's category totals, all on one measured scale. Each is a white row with a 3px top rule: the name in capitals with its count as a Caption, the amount in Price on the right, and an 8px bar below. The bar has a hairline track, a fill in `bar` at the category's share of the scale maximum, and a 5px ruler of 1px muted ticks, one per scale step, beneath it. The step is printed once, in the section head ("dílek 500 Kč"). An archived category gets a dashed top rule and the word "vyřazená"; an empty one goes muted and reads "nic".

### Payments Still to Come (Ještě přijde)
A block under the total tag, shown for the current period only and only when something is still due. A section head ("JEŠTĚ PŘIJDE") carries the total as its note ("celkem 259 Kč"). Each payment is a row at least 44px tall with 10px 2px padding, in three columns:

- The date (700, tabular), in a 4.5em column.
- The name (600, normal width).
- The amount in Price at 1.125rem, in muted.

Rows sit on 1px dashed muted rules instead of the solid hairlines of the day list, because nothing has been written yet.

### Day List and Entries
Day heads are 1rem, 800 and 75% width, with the day's total on the right, over a 2px rule. Entries are 56px rows divided by hairlines, in three states:

- **Plain:** the category in List type with its saved note beneath (0.875rem, muted), the amount in Price at 1.25rem, and a 44px close icon that deletes. Two buttons open the entry editor. Category and note together (at least 44px tall) open it on the note; the amount, right-aligned and at least 44px tall, opens it with the amount selected. An entry without a note shows "přidat poznámku" in muted over a 1px dotted line.
- **Editing:** the row opens in place into the entry editor, 8px from the row above and 14px from the rule below.
- **Deleted:** the entry stays in place for a few seconds, muted. A 3px strike-red line crosses its category and amount, the word SMAZÁNO (0.75rem, 800, capitals) sits under the category, and a VRÁTIT button in the tag colour brings it back.

VRÁTIT is a square action in the tag colour: 44px tall, 0 14px padding, capitals at 0.04em. An entry written by a recurring payment carries a PRAVIDELNÁ chip 6px after its category name. The chip is square, with a 1px drawn ring in `rule`, text colour, 1px 5px padding, and capitals at 0.6875rem, 800 and 75% width.

### Entry Editor
A written expense opens into a small form: a white label with a 3px top rule, 12px padding and a two-column grid with 12px gaps.

- **Částka and Datum** sit side by side. The amount is a writable line set in Price at 1.5rem, with "Kč" after it (800, 75% width); the date is a native date input on a writable line.
- **Kategorie** (a select) and **Poznámka** (a writable line) run the full width.
- **Error and actions:** an error line in text ink, then a primary Hotovo and a quiet Zrušit, both standalone buttons.

The form speaks in the app's own words ("Zadej částku.", "Datum nemůže být v budoucnu."), not the browser's. Saving offers undo in the strip ("Uloženo · Ostatní · 150 Kč"); Escape cancels.

### Statistiky Head
Three things, 10px apart:

- **Range switch:** three standalone options in a row, 6px apart ("3 měsíce", "6 měsíců", "12 měsíců"), 44px tall with 4px corners and Label capitals. The chosen one takes the tag fill with ink lettering; the others are quiet, with the 2px drawn ring in `rule`. They drop 1px when pressed.
- **Average tag:** the Přehled total tag reused. The name line reads "PRŮMĚR ZA MĚSÍC", the average is in Headline, and the unit line holds the finished months ("6 celých měsíců") and "běžící se nepočítá". Before any month has finished, it reads "Po výplatě" (2.25rem, 75% width) over "Počítá jen celé měsíce" and "první skončí 9. 10.".
- **Receipt:** a white label with a 3px top rule and hairline-divided rows, 10px 12px padding. Each row holds a label in capitals (0.9375rem, 800, 75% width), the month in muted 600 text and the amount in Price at 1.25rem: NEJVÍC and NEJMÍŇ once at least two months have finished, then CELKEM with the range.

### Column Chart (signature)
The one chart form: months as square columns on one baseline. It sits in a white panel with a 3px top rule and 12px 12px 10px padding, under a section head ("PO MĚSÍCÍCH") whose note gives the pay-period span ("vždy od 10. do 9.", or "kalendářní měsíce" when payday is the 1st).

- **Plot and axis:** the plot is 168px tall, with a 44px left gutter for compact Czech ticks ("10 tis."). Gridlines are 1px hairlines; the baseline is a 2px rule.
- **Columns:** every column is a full-height button that picks its month. Its bar is filled with `bar`, square, min(24px, 62%) wide and at least 2px tall when above zero. The focus ring is drawn inside the column.
- **Chosen month:** a full-height band in `ground` behind its column (only when there is more than one), and its month label turns into a chip: tag fill, ink lettering, 800, 1px 3px padding.
- **Running month:** hatched at 135° in `bar` (2px lines every 6px) inside a 2px dashed outline in `bar`, with "zatím" under its label.
- **Labels:** short months ("zář"). The sublabel reads "zatím", "od 14." for a month where writing started part-way, or the year where the range crosses one.
- **Average:** a 2px line in text colour, painted behind the columns (band, gridlines, average, then columns), so it reads in the gaps between them instead of slicing through them.
- **Key row:** under the axis, as a muted Caption: a 16×2px line swatch with "průměr 27 610,80 Kč", and a hatched swatch with "zatím, měsíc ještě běží".

A compact variant, 72px tall with no ticks and no key row, draws one category's trend inside its stat row.

### Chosen Month
The section head carries the chosen month's name as its title ("KVĚTEN") and its date range as the note. Under it sits the readout: a white label with a 3px top rule and 10px 12px 12px padding, with the total in Price at 2rem. Comparison lines follow at 0.9375rem and 600, the first in text colour and the rest in muted:

- "O 3 136,53 Kč nad průměrem"
- "Zatím o … pod průměrem" over "Do výplaty 29 dní"
- "Zápisy až od 14. 2." over "Do průměru se nepočítá"
- "První celý měsíc"

### Category Stat Row (signature)
A sibling of the category row with ruler: one per category, 6px apart, each a white label with a 3px top rule (dashed when the category is archived). The whole head is one button that opens the category's trend.

- **Head:** the name in Name capitals at 1.0625rem, the amount in Price at 1.375rem, and a muted 20px chevron that turns on the print curve (260ms). Pressed, it fills with pressed grey; an empty row goes muted.
- **Bar:** 8px, a hairline track with a `bar` fill at the month's share of one scale shared by every row. The category's average is a 2px upright in text colour reaching 5px above and below the bar, cut out with the 2px surface ring.
- **Meta:** a muted Caption led by the same upright at 14px as its key, "průměr 8 167,87 Kč", then "nic" when the month is empty and "vyřazená" when the category is archived.
- **Open:** below a hairline, with 10px 12px 12px padding, the compact chart and a "Celkem únor – září" line with the total in Price at 1.125rem.

### Numbers Table
Every number again, behind a ruled summary: a `<details>` white label with a 3px top rule.

- **Summary:** 48px, "VŠECHNA ČÍSLA" in Label capitals, a muted chevron.
- **Table:** in its own horizontal scroll box under a hairline, with the month column sticking to the left on the surface. Header cells are 0.75rem, 800, 75% width capitals in muted; cells are 0.875rem, 600 and tabular, with 8px 12px padding on hairline dividers. The newest month is on top, with muted notes after its name (" zatím", " od 14. 2."). A "Průměr" footer row in 800 sits on a 2px rule.
- **Foot note:** in muted: "Částky v Kč, nejnovější měsíc nahoře. Průměr počítá jen celé měsíce."

### Recurring Payments (Nastavení)
The Pravidelné platby section opens with a help paragraph, then lists each payment as a white row with a 3px top rule, 6px apart, with 8px 4px 8px 12px padding. The left of a row stacks three lines:

- The name, 1.0625rem, 800, 75% width.
- The payment line in muted ("12 000 Kč · měsíčně · Nájem", 0.875rem).
- The next date in 700 text ink ("další 10. 10.", with the year only when it differs).

A quiet Upravit button sits on the right. Below the list, a full-width primary button with a plus icon adds a payment.

The form takes the edited row's place, or appears below the list for a new payment. It is a white label with a 3px top rule, 12px padding and 12px between fields:

- Název and Částka are labelled writable lines, the same labelled fields as the entry editor.
- Kategorie and Jak často are selects; Jak často offers měsíčně, čtvrtletně, pololetně and ročně.
- První platba is a native date input on a writable line.

An error line in text ink sits above the actions: a primary Přidat or Uložit, a quiet Zrušit, and, when editing, an ink Smazat. Smazat asks no confirmation; the strip offers undo.

### Drawn Style (Pastelka)
Every component keeps its composition, its measurements and its colour tokens; only edges, texture and lettering change.

- **Price tag and total tag:** crayoned and outlined in ink, with a drawn hole; the unit rule becomes a squiggle in ink line.
- **Shelf labels, category rows, stat rows, fields, panels and the undo strip:** paper cards with the double drawn outline.
- **Keypad:** twelve drawn keys on the paper, with no membrane panel behind them.
- **Buttons:** primary and ink crayoned inside a drawn ring; quiet keeps its 2px ring with an uneven radius.
- **Rails and tabs:** torn edges, and the chosen tab underlined with a squiggle in the tag colour instead of the printed 4px bar.
- **Statistiky:** finished columns coloured in inside a drawn outline, the running month still hatched and dashed, the average line and its key drawn as squiggles, and the chosen month circled in crayon.
- **Icons:** shaken by the displacement filter, at stroke 2.2.

### Style and Colour Picker (Vzhled)
A help paragraph, then two radio groups under their own subtitles: Styl, with a card per style, and Barvy, with a card per scheme. Both use the same two-column grid of preview cards 10px apart. Each card carries its own style and scheme, so it previews exactly what it offers: the drawn card is drawn while the app is still printed, and the printed card stays printed while the app is drawn. A scheme card also shows that scheme's dark variant in dark mode. A card is square, on its scheme's ground, with a 1px hairline ring and 8px 8px 10px padding. It holds a miniature of the app:

- A 10px rail bar.
- A 44px tag (4px corners, 6px hang hole) with "129 Kč" in ink, the 129 in Price at 1.875rem.
- Three mini shelf labels with 2px top rules.

Under the miniature come the scheme name (1rem, 800, 75% width) and its description in muted (0.8125rem). The chosen card gets a 3px ring in `rule` and adds "· vybráno" to its description; the focus ring sits on the whole card.

### Undo Strip
The app's one message strip: white, with a 3px bottom rule, it feeds down from under the top rail (260ms, clipped from the top and dropping 12px), with 8px 16px padding. It never covers the rail. It has two modes:

- **Message:** the message on the left (600, tabular, wrapping when it must) and an action in the tag colour on the right: VRÁTIT, or Ukázat when it announces payments written on opening ("Zapsané pravidelné platby: Nájem"). The action is 44px tall with 0 18px padding. After a save, a quiet Poznámka action sits before it: transparent, the 2px drawn ring in `rule`, 0 14px padding, Label capitals.
- **Note:** the message gives way to a writable line (1.0625rem, 600, 87.5% width, 2px dotted muted underline that goes solid in text colour while you write), and Hotovo becomes the action. It stays open until you finish.

Both strip actions are square, unlike standalone buttons.

### Ruled Panels
Confirmations, the empty period, empty statistics ("Statistiky se ukážou, až zapíšeš první útraty." over a primary Přidat útratu) and the install hint take the shelf-label form: white, a 3px top rule in `rule`, square corners, 12 to 16px padding, copy at 600 and buttons below.

### Named Rules
**The Form and Word Rule.** Every state carries a form and a word, never colour alone:

- The active tab gets a top bar.
- The chosen option gets a chevron.
- A deleted entry gets a strike, SMAZÁNO and VRÁTIT.
- An archived category gets a dashed rule and "vyřazená".
- An empty category reads "nic".
- An entry without a note reads "přidat poznámku" over a dotted line.
- A payment still to come sits on a dashed rule under "Ještě přijde"; one already written carries PRAVIDELNÁ.
- The chosen style and the chosen scheme each get a 3px ring and "· vybráno".
- The chosen range fills with the tag colour; the chosen month gets a chip under its column and a band behind it, and reads as pressed to a screen reader.
- The running month is hatched inside a dashed outline and says "zatím"; a month where writing began part-way says "od 14.".
- The average is a line and the word "průměr", in the chart's key and in every stat row.
- The no-amount warning is heavier and darker, and changes its words.

**The Printing Motion Rule.** Motion prints: short, weighted and downward on `cubic-bezier(0.2, 0.9, 0.3, 1)`, from 260 to 500ms.

- The amount drops out and a fresh one prints in.
- A label stamps down.
- The undo strip feeds down from under the rail.

The only sideways move is the refusal nudge. Disclosure chevrons turn on the same curve in 260ms. Reduced motion collapses every animation to 1ms.

## Do's and Don'ts

### Do:
- **Do** print every amount in Archivo at 62% width and 800 weight with tabular figures, small raised haléře and a smaller "Kč" after the number.
- **Do** hang every white label, row, field and panel from a 3px top rule in `rule`, with square corners; round only tags (6px) and standalone controls (4px).
- **Do** keep the tag colour for tags and for what you act on: primary buttons, undo, Hotovo, the chosen option, the active tab bar.
- **Do** use the ink button (rail fill, lettering in the tag colour) for actions that replace or delete data.
- **Do** write field errors in text ink at 700, directly under the field.
- **Do** mark writable text with a dotted underline that goes solid while you write, with its placeholder in muted (soft ink on the tag).
- **Do** draw anything not written yet on a dashed rule, with its amount in muted.
- **Do** chart months as square columns in `bar` on one baseline, hatch the running month inside a dashed outline, and draw the average as a 2px line behind the columns with a key that names it.
- **Do** give every state a form and a word, not just a colour.
- **Do** take every colour from a token, and check a new screen in more than one scheme and in both styles, in light and dark.
- **Do** keep a style to shape, texture and lettering, taking every colour from the scheme's tokens, so all twelve combinations hold.
- **Do** keep touch targets at least 44px (shelf labels 58px, tabs 52px) and the column no wider than 520px.
- **Do** move things down when they print or are pressed, on `cubic-bezier(0.2, 0.9, 0.3, 1)`, and collapse motion to 1ms under reduced motion.

### Don't:
- **Don't** use strike red for anything but the line through a cancelled amount: not for fills, buttons, errors or destructive actions.
- **Don't** build the fintech dashboard: no rounded, shadowed white cards, no donut or pie chart (the column chart is the one chart form), no gradient header, no floating plus button.
- **Don't** add drop shadows or elevation; the hang hole's inset is the only soft shadow.
- **Don't** introduce a third typeface. The printed style is Archivo alone; the drawn style adds Patrick Hand for words and keeps Archivo for numbers.
- **Don't** mix the two vocabularies on one screen: printed labels keep the 3px top rule and tracked capitals, drawn labels keep the double outline and handwriting.
- **Don't** signal a state with colour alone.
- **Don't** make anything float, bounce or rise; the only sideways move is the refusal nudge.
- **Don't** put small uppercase lead-ins above headings. Condensed capitals name the thing itself: a label, a section head, an action or a tag's name line.
- **Don't** dim or invert the tags in dark mode.
- **Don't** hard-code a colour, or add a scheme that leaves out a token or misses a floor in the contrast contract.
