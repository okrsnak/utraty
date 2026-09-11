---
name: "Útraty"
description: "A pay-period spending log printed as Czech supermarket shelf price tags."
colors:
  yellow: "#ffd400"
  ink: "#111111"
  ink-on-yellow: "rgba(17, 17, 17, 0.74)"
  red: "#e3000f"
  ground: "#e6e7ea"
  surface: "#ffffff"
  key: "#ffffff"
  key-pressed: "#d6d8dc"
  key-alt: "#d9dbe0"
  text: "#111111"
  muted: "#53565c"
  rule: "#111111"
  hairline: "#c7c9ce"
  bar: "#111111"
  focus: "#111111"
  rail: "#111111"
  rail-text: "#ffffff"
  rail-muted: "#b9bbc0"
  rail-track: "#3a3b3e"
  ground-dark: "#1d1e21"
  surface-dark: "#2a2c30"
  key-dark: "#34363b"
  key-pressed-dark: "#474a50"
  key-alt-dark: "#2a2c30"
  text-dark: "#f3f3f1"
  muted-dark: "#a9abb0"
  rule-dark: "#f3f3f1"
  hairline-dark: "#484b51"
  bar-dark: "#ffd400"
  focus-dark: "#ffd400"
  rail-dark: "#000000"
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
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    rounded: "{rounded.tag}"
    padding: "16px 18px 10px"
  total-tag:
    backgroundColor: "{colors.yellow}"
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
    textColor: "{colors.yellow}"
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
    backgroundColor: "{colors.yellow}"
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
    textColor: "{colors.yellow}"
  button-primary:
    backgroundColor: "{colors.yellow}"
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
    textColor: "{colors.yellow}"
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
    backgroundColor: "{colors.yellow}"
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
    backgroundColor: "{colors.yellow}"
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
    backgroundColor: "{colors.yellow}"
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

Cenovka is the Czech supermarket shelf price tag. Each spend is a yellow tag printed in three taps; the pay period is the shelf it lands on. Black shelf-edge rails frame the top and bottom of every view. Between them, a grey ground holds square white labels, each hung from a heavy black top rule, and the tags are the only large yellow on screen. It reads like a shop's own signage, printed and matter-of-fact, not like a finance product.

Density is shelf-like: one narrow column, controls packed 2 to 12px apart, every touch target at least 44px. Hierarchy comes from one condensed grotesque, Archivo, ranked by how narrow it runs, how heavy and how big: prices in the narrowest, heaviest cut, names and actions in condensed capitals, sentences at normal width. Colour does almost no ranking. Yellow means tag or action, ink means numerals and rules, red means cancelled.

The world refuses the fintech dashboard: no rounded, shadowed white cards, no donut chart, no gradient header, no floating plus. Motion prints, short, weighted and downward. Nothing floats.

**Key Characteristics:**
- One yellow tag owns each view; everything else is white label, grey ground or black rail.
- Heavy 3px top rules and square corners; only tags (6px) and standalone controls (4px) are rounded.
- Solid rules hold what is written; dashed rules hold what isn't live.
- One variable family ranked by width (62, 75, 87.5 and 100%), weight and size.
- Flat throughout: depth comes from fill, rule and seam, never shadow.
- Every state carries a form and a word, never colour alone.
- Motion prints downward on one weighted curve.
- Light and dark: the tags and their ink never change; ground, labels, keys, rules and rails do.

## Colors

The palette is a shelf: tag yellow and ink, a grey ground with white labels, black rails, and a single sale red kept for crossing things out.

### Primary
- **Tag Yellow** (#ffd400): the price tag itself (the entry tag and the period total) and everything you act on: primary buttons (Hotovo in the entry editor among them), the undo strip's action, VRÁTIT on a deleted entry, the selected picker option, the active tab's top bar, the countdown fill in the top rail, the stamp flash on a shelf label, and text selection (an amount opened for editing shows selected in yellow). It is also the lettering on the ink date chip and ink buttons, and the focus ring on both rails. It is identical in both themes. In dark mode it also becomes the focus ring everywhere and the category bar fill.

### Secondary
- **Sale Red** (#e3000f): the 3px line through a deleted entry's category and amount, and nothing else. Same in both themes.

### Neutral
- **Ink** (#111111): numerals, rules and text on every tag, the date chip fill and the pressed keypad key. It doesn't change between themes.
- **Ink on Yellow** (rgba(17, 17, 17, 0.74)): secondary text on a tag: the note placeholder and the total tag's count and per-day line (6.8:1 on yellow).
- **Shelf Grey** (`ground`, #e6e7ea; dark #1d1e21): the page ground. It also shows through each tag's hang hole.
- **Label White** (`surface`, #ffffff; dark #2a2c30): shelf labels, category rows, the entry editor, recurring payment rows and their form, field rows, ruled panels, boxed inputs and the undo strip.
- **Key White** (`key`, #ffffff; dark #34363b), **Function Key Grey** (`key-alt`, #d9dbe0; dark #2a2c30), **Pressed Key Grey** (`key-pressed`, #d6d8dc; dark #474a50): keypad faces. The comma and backspace keys take the function grey; the pressed grey is also a shelf label's pressed fill.
- **Text Ink** (`text`, #111111; dark #f3f3f1) and **Muted Slate** (`muted`, #53565c; dark #a9abb0): text and secondary text. Muted carries running totals, counts, help, hints, placeholders, and both the amount and the dashed rule of a payment still to come. Field errors are set in text ink, never red. Muted holds 6.0:1 on the ground and 7.4:1 on white; in dark mode, 7.3:1 and 6.1:1.
- **Shelf Rule** (`rule`, #111111; dark #f3f3f1): the 3px top rules, 2px day-head rules, 2px input and select borders, and the drawn rings on quiet actions and the PRAVIDELNÁ chip.
- **Hairline Grey** (`hairline`, #c7c9ce; dark #484b51): 1px list dividers, the picker list's top edge and the empty track of each category bar.
- **Rail Black** (`rail`, #111111; dark #000000), **Rail White** (`rail-text`, #ffffff), **Rail Grey** (`rail-muted`, #b9bbc0): both rails, the keypad seams and the ink button fill. Rail grey sets the countdown, the period status and inactive tabs (9.8:1).
- **Rail Track** (`rail-track`, #3a3b3e): the empty track of the countdown strip in the top rail, in both themes.
- **Bar Ink** (`bar`, #111111; dark #ffd400): the fill of each category's measured bar. It turns yellow in dark mode.
- **Focus Ink** (`focus`, #111111; dark #ffd400): the 3px focus ring at a 2px offset. On both black rails it switches to tag yellow in either theme, so it never disappears into the black.

### Named Rules
**The Tag Yellow Rule.** Yellow is the tag and what you act on: price tags, primary actions, the undo action, Hotovo, the chosen option, the active tab bar, the countdown fill, the stamp flash, and the focus ring on the rails. It never fills the ground, a section or a plain label.

**The Sale Red Rule.** Red only crosses out: it strikes cancelled amounts and does nothing else. Errors are written in ink, and actions that replace or delete data use the ink button.

**The Tag Doesn't Dim Rule.** Yellow and ink are theme-invariant. Dark mode swaps the ground, labels, keys, rules and rails around the tags; the tags print exactly the same.

## Typography

**Display Font:** Archivo, variable (width 62–125%, weight 100–900), self-hosted as latin and latin-ext woff2 (with 'Helvetica Neue', Arial, sans-serif)
**Body Font:** Archivo, same files, at normal width
**Label/Mono Font:** none; labels are Archivo in condensed capitals

**Character:** One grotesque of the kind printed on shelf tags: narrow, heavy numerals that fit a big price in a small space, and condensed capitals for product names. Nothing is set in a second face. The build sets width with `font-stretch` percentages.

### Hierarchy
- **Display** (800, 62% width, min(58cqh, 34cqw) of the tag, line height 0.9, -0.01em, tabular): the amount on the entry tag, sized by the tag container so it fills the tag. It steps down to min(46cqh, 25cqw) and then min(34cqh, 18.5cqw) as the number grows. The amount is right-aligned, haléře sit at 0.46em against the top, and "Kč" follows at 75% width.
- **Headline** (800, 62%, clamp(3rem, 17vw, 4.5rem), line height 1, tabular): the period total on the Přehled tag.
- **Price** (800, 62%, 1.375rem, tabular): category row amounts. Day-list amounts use the same cut at 1.25rem, an amount being edited at 1.5rem, and payments still to come at 1.125rem in muted.
- **Key** (700, 75%, 1.875rem, tabular): keypad digits.
- **Title** (800, 75%, 1.25rem, 0.01em): the rail's period range and view names.
- **Name** (800, 75%, 1rem, 0.03em, uppercase): shelf label names. Category rows set it at 1.0625rem. Recurring payment names and category names in Nastavení use the same 800 condensed cut at 1.0625rem, in sentence case.
- **Label** (800, 75%, 1rem, 0.05em, uppercase): buttons and the undo strip's actions. VRÁTIT on a deleted entry runs at 0.04em, section heads at 0.9375rem and 0.06em, tabs at 700 and 0.06em, the date chip at 0.9375rem and 0.04em, form labels at 0.8125rem, and the PRAVIDELNÁ chip at 0.6875rem.
- **List** (700, 87.5%, 1rem): entry categories and picker options. Text being written uses the same width: notes at 600 (1.0625rem on the tag and in the undo strip) and labelled form fields at 700 and 1.0625rem. An amount being written keeps the Price cut. The shelf hint is 600 at 0.875rem.
- **Body** (400, normal width, 1rem, line height 1.35): help copy and messages, saved notes under an entry, and the recurring payment line ("12 000 Kč · měsíčně · Nájem"), the last two at 0.875rem in muted. Help paragraphs stop at 60ch.
- **Caption** (600, 0.8125rem, tabular, in muted): running totals under shelf labels, counts, section-head notes (the ruler step, "celkem 259 Kč") and picker option notes.

### Named Rules
**The Width Is Rank Rule.** Rank by width before anything else: 62% for prices, 75% for names, labels, rails, keys and buttons, 87.5% for list lines, hints and text being written, normal width for sentences. Weight follows role: 800 for prices, names and actions, 700 for keys, tabs and list lines, 600 for meta, hints and written notes, 400 for prose.

**The Small Haléře Rule.** Every amount prints like a shelf price: crowns big, haléře small and raised (0.46em on the tag, 0.62em lifted 0.42em inline), "Kč" smaller after the number, tabular figures, never wrapping.

## Layout

A single column of at most 520px (`--app-width`), centred on the grey ground. On desktop the column stays phone-width and never spreads into more columns. The app is a full-height grid (100dvh): each view scrolls between a sticky black top rail and the black tab rail at the bottom, and both rails respect the safe-area insets.

The side gutter is 16px on every view. Přidat stacks top to bottom:

- The rail.
- The tag, which takes the height the rest leaves (176 to 300px, about a third of the screen).
- A three-column shelf of labels 8px apart, with the category picker in the next slot, spanning the columns the labels leave free.
- The keypad: three columns, each row clamp(46px, 7.4dvh, 64px).

Přehled stacks the total tag, then "Ještě přijde" (current period only, and only when a payment is still due), category rows 6px apart and day groups 18px apart, with 26px between sections. Nastavení runs Den výplaty, Kategorie, Pravidelné platby, Záloha and Na plochu, with 30px between sections and 10px inside them. A button set directly in a Nastavení section stretches to the full column width, like "+ Přidat pravidelnou platbu".

Short phones (max-height 700px, the iPhone SE) tighten the entry screen: the tag's minimum height drops to 150px, keypad rows to clamp(44px, 7dvh, 52px), shelf labels to 52px, and the vertical margins to 8 to 10px. While the keyboard is up for the picker, the picker takes the whole shelf and the labels, hint and keypad hide.

### Named Rules
**The Shelf Rail Rule.** Every view hangs between two black rails. The top rail carries what you are looking at (the period with its countdown or status, or the view name); the bottom rail carries the three tabs. Content scrolls between them, never over them.

## Elevation & Depth

Flat by construction. There are no drop shadows and no elevation layers. Depth comes from fill against ground (yellow and white on grey), the heavy black top rule on every label, and the 2px black seams that make the keypad one membrane panel. Pressed things move down, not up: labels and buttons drop 1px, and the stamp lands 3px low.

### Shadow Vocabulary
- **Hang hole** (`box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.4)`): the only soft shadow. It gives the 16px punched hole in each tag its depth. The hole is filled with the ground colour, so it reads as cut through the tag.
- **Drawn ring** (`box-shadow: inset 0 0 0 2px var(--rule)`): the 2px outline on quiet buttons and on the undo strip's Poznámka action, drawn inside so they keep their size. The PRAVIDELNÁ chip uses a 1px ring in `rule`, and archived category rows in Nastavení a 1px hairline ring, the same way.

### Named Rules
**The Printed Flat Rule.** Nothing floats. To make something stand out, give it a fill, a rule or a word, never a shadow.

## Shapes

Square by default: a shelf is cut, not moulded. White labels, category rows, the entry editor, recurring payment rows and their form, field rows, panels, keys and the undo strip have square corners and a 3px top rule (the strip's rule runs along its bottom edge). The price tags are slightly rounded (6px), like die-cut card. Standalone controls you press or type into are rounded 4px: buttons, the date chip, the select and the new-category input. Actions and marks set into a strip or a row stay square: the undo strip's two actions, VRÁTIT on a deleted entry, and the PRAVIDELNÁ chip. Buttons inside a form, like the entry editor's Hotovo and Zrušit, are standalone buttons with 4px corners. The one circle is the 16px hang hole, top left on every tag.

Line styles carry meaning:

- **Solid 3px top rule:** a shelf edge.
- **Dashed rules:** something not live. An archived category takes a dashed 3px top rule; a payment still to come sits on a 1px dashed rule in muted.
- **Dotted underline:** text you can write on. It is 2px under a field (the note on the tag, the picker, category names in Nastavení, the note line in the undo strip, and every labelled form field, dates included), and 1px under the "přidat poznámku" invitation on an entry without a note. A field you are writing in shows a solid underline.
- **1px hairline:** divides list items.

### Named Rules
**The Shelf Edge Rule.** Every white label, row, field and panel hangs from a 3px top rule in `rule` and keeps square corners.

**The Dashed Line Rule.** A dashed rule means not live: an archived category, or a payment not written yet. Everything written sits on a solid rule.

**The Write-Here Rule.** A dotted underline means you can write here: 2px under a field, 1px under the invitation to add a note. While you write, the line goes solid instead of showing a focus outline.

## Components

### Price Tag (signature)
The entry screen's main surface: yellow, 6px corners, 16px 18px 10px padding, and a 16px hang hole 16px from the top and 18px from the left. The amount sits bottom right in Display with "Kč" after it. Under it runs the meta line:

- **The note:** writable, 1.0625rem at 600 and 87.5% width, with a dotted underline in 55% ink and its placeholder in ink on yellow.
- **The date chip:** ink fill, yellow condensed capitals, 44px tall, 4px corners. The native date input sits invisibly over it.

While the tag is empty, its zero is half-strength ink. On save, the amount prints down out of the tag and the fresh zero prints in from above (340ms). Tapping a label with no amount nudges the tag sideways (300ms), and the hint above the shelf jumps to 800-weight text.

The Přehled total tag uses the same yellow, corners and hole. A name line ("CELKEM ZA OBDOBÍ", Label capitals at 0.9375rem, indented past the hole) sits over the total in Headline. Beneath that is a unit line under a 1px rule of 40% ink, holding the entry count and daily average in ink on yellow. The name line says what the price is, like the product name on a shelf tag.

### Shelf Label
- **Shape:** square, 3px top rule, at least 58px tall (52px on short phones), 7px 10px 6px padding, three to a row.
- **Content:** the category name in Name capitals over its running period total as a muted Caption.
- **Press:** fills with pressed grey and drops 1px.
- **Save:** the label stamps, landing 3px low in yellow with ink lettering and settling back as the yellow fades (500ms) while its total ticks up.

### Scale Keypad
Twelve flat, square keys on a black grid: 2px rail-colour seams and a 2px rail border, three columns. Keys are key white with Key digits; the comma and backspace take the function grey. Every key, comma and backspace included, turns ink with a yellow glyph while pressed. Backspace is an inline 24px stroked icon (2px stroke, round joins), like every icon in the app.

### Buttons
- **Shape:** 4px corners, at least 44px tall, 0 16px padding, Label capitals. An optional 20px icon sits 6px before the text.
- **Primary:** yellow fill, ink lettering. The default for any action.
- **Quiet:** transparent with the 2px drawn ring in `rule`, lettering in text colour. For secondary actions (Vyřadit, Upravit, Obnovit ze zálohy, Zrušit).
- **Ink:** rail-black fill, yellow lettering. Only for actions that replace or delete data (Obnovit, Opravdu smazat, Smazat on a recurring payment).
- **Press / Focus:** drops 1px when pressed; the 3px focus ring sits at a 2px offset. There is no hover treatment; this is a touch app.

### Inputs / Fields
- **Writable line:** no box and no fill, just a 2px dotted underline (muted on white labels and in the strip, 55% ink on the tag), square. The underline turns solid while you write, in place of an outline. Used for the note on the tag, the picker, category names, the note line in the undo strip and every labelled form field (native date inputs included). Placeholders always take muted, or ink on yellow on the tag.
- **Labelled field:** a form label (capitals at 0.8125rem, 800 and 75% width, 0.05em) 4px above its control. The recurring form and the entry editor share it. A text or date input inside is a writable line at 1.0625rem, 700 and 87.5% width; a select inside runs the full width.
- **Boxed input:** the new-category input, white with a 2px `rule` border, 4px corners, 48px tall.
- **Select:** white with a 2px `rule` border, 4px corners, 44px tall, set at 1.125rem, 800 and 75% width. A chevron (the right arrow turned 90°) sits 10px from the right edge.
- **Field row:** a white label with a 3px top rule, holding a 700-weight label on the left and the control on the right.
- **Error:** 0.875rem 700 text in text ink directly under the field, announced as an alert. Errors are never red.

### Navigation
- **Top rail:** rail black; top padding is the safe-area inset or 12px, whichever is larger, with 16px sides and 10px below. The period sits left in Title, and the countdown ("Do výplaty N dní") or status sits right in rail grey (0.9375rem, 600). Under both runs a 4px countdown strip: a rail-track track whose yellow fill grows left to right as the period runs (400ms). On Přehled, the rail centres the period and its status between 44px previous and next arrows, and the next arrow hides on the current period.
- **Tab rail:** three equal tabs, 52px tall, in rail grey capitals (1rem, 700, 75% width, 0.06em). The active tab turns rail white and gets a 4px yellow top bar.
- **Focus:** on both rails the focus ring is yellow.

### Category Picker
The next slot on the shelf: a white label with a writable line for searching or naming a new category. Opening it takes over the whole shelf, adds a 44px close button, and drops a list below a hairline:

- Options are 48px rows in List type, divided by hairlines.
- The selected option fills yellow and shows a chevron marker.
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
- **Deleted:** the entry stays in place for a few seconds, muted. A 3px red line strikes its category and amount, the word SMAZÁNO (0.75rem, 800, capitals) sits under the category, and a yellow VRÁTIT button brings it back.

VRÁTIT is a square yellow action: 44px tall, 0 14px padding, capitals at 0.04em. An entry written by a recurring payment carries a PRAVIDELNÁ chip 6px after its category name. The chip is square, with a 1px drawn ring in `rule`, text colour, 1px 5px padding, and capitals at 0.6875rem, 800 and 75% width.

### Entry Editor
A written expense opens into a small form: a white label with a 3px top rule, 12px padding and a two-column grid with 12px gaps.

- **Částka and Datum** sit side by side. The amount is a writable line set in Price at 1.5rem, with "Kč" after it (800, 75% width); the date is a native date input on a writable line.
- **Kategorie** (a select) and **Poznámka** (a writable line) run the full width.
- **Error and actions:** an error line in text ink, then a primary Hotovo and a quiet Zrušit, both standalone buttons.

The form speaks in the app's own words ("Zadej částku.", "Datum nemůže být v budoucnu."), not the browser's. Saving offers undo in the strip ("Uloženo · Ostatní · 150 Kč"); Escape cancels.

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

### Undo Strip
The app's one message strip: white, with a 3px bottom rule, it feeds down from under the top rail (260ms, clipped from the top and dropping 12px), with 8px 16px padding. It never covers the rail. It has two modes:

- **Message:** the message on the left (600, tabular, wrapping when it must) and a yellow action on the right (VRÁTIT, or Ukázat when it announces payments written on opening: "Zapsané pravidelné platby: Nájem"; 44px tall, 0 18px padding). After a save, a quiet Poznámka action sits before it: transparent, the 2px drawn ring in `rule`, 0 14px padding, Label capitals.
- **Note:** the message gives way to a writable line (1.0625rem, 600, 87.5% width, 2px dotted muted underline that goes solid in text colour while you write), and Hotovo becomes the yellow action. It stays open until you finish.

Both strip actions are square, unlike standalone buttons.

### Ruled Panels
Confirmations, the empty period and the install hint take the shelf-label form: white, a 3px top rule in `rule`, square corners, 12 to 16px padding, copy at 600 and buttons below.

### Named Rules
**The Form and Word Rule.** Every state carries a form and a word, never colour alone:

- The active tab gets a yellow top bar.
- The chosen option gets a chevron.
- A deleted entry gets a red strike, SMAZÁNO and VRÁTIT.
- An archived category gets a dashed rule and "vyřazená".
- An empty category reads "nic".
- An entry without a note reads "přidat poznámku" over a dotted line.
- A payment still to come sits on a dashed rule under "Ještě přijde"; one already written carries PRAVIDELNÁ.
- The no-amount warning is heavier and darker, and changes its words.

**The Printing Motion Rule.** Motion prints: short, weighted and downward on `cubic-bezier(0.2, 0.9, 0.3, 1)`, from 260 to 500ms.

- The amount drops out and a fresh one prints in.
- A label stamps down.
- The undo strip feeds down from under the rail.

The only sideways move is the refusal nudge. Reduced motion collapses every animation to 1ms.

## Do's and Don'ts

### Do:
- **Do** print every amount in Archivo at 62% width and 800 weight with tabular figures, small raised haléře and a smaller "Kč" after the number.
- **Do** hang every white label, row, field and panel from a 3px top rule in `rule`, with square corners; round only tags (6px) and standalone controls (4px).
- **Do** keep yellow for tags and for what you act on: primary buttons, undo, Hotovo, the chosen option, the active tab bar.
- **Do** use the ink button (black fill, yellow lettering) for actions that replace or delete data.
- **Do** write field errors in text ink at 700, directly under the field.
- **Do** mark writable text with a dotted underline that goes solid while you write, with its placeholder in muted (ink on yellow on the tag).
- **Do** draw anything not written yet on a dashed rule, with its amount in muted.
- **Do** give every state a form and a word, not just a colour.
- **Do** keep touch targets at least 44px (shelf labels 58px, tabs 52px) and the column no wider than 520px.
- **Do** move things down when they print or are pressed, on `cubic-bezier(0.2, 0.9, 0.3, 1)`, and collapse motion to 1ms under reduced motion.

### Don't:
- **Don't** use red for anything but the strike through a cancelled amount: not for fills, buttons, errors or destructive actions.
- **Don't** build the fintech dashboard: no rounded, shadowed white cards, no donut or pie chart, no gradient header, no floating plus button.
- **Don't** add drop shadows or elevation; the hang hole's inset is the only soft shadow.
- **Don't** introduce a second typeface; rank with Archivo's width, weight and size.
- **Don't** signal a state with colour alone.
- **Don't** make anything float, bounce or rise; the only sideways move is the refusal nudge.
- **Don't** put small uppercase lead-ins above headings. Condensed capitals name the thing itself: a label, a section head, an action or a tag's name line.
- **Don't** dim or invert the tags in dark mode.
