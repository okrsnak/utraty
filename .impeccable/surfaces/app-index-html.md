---
version: 1
slug: "app-index-html"
primary_target: "app/index.html"
related_targets: []
---

# Surface: Útraty app shell (app/index.html)

## Scope and mode
The whole app: Přidat (entry), Přehled (pay-period overview), Nastavení (payday, categories, backup). Mode: Operate.

## Audience, job, constraints
She logs a spend one-handed seconds after paying and reviews the period in the evening or around payday. Entry must take under five seconds. iPhone home-screen PWA, Czech UI, CZK, offline, data only on the phone.

## Chosen direction and memorable moment
Cenovka: Czech supermarket shelf price tags. Memorable moment: tapping a shelf label prints the yellow tag onto the shelf and that label's running total ticks up.

## Unresolved
App name (working name "Útraty"); final category list.

## Direction contract
THESIS: Every spend is a price tag printed in three taps; the pay period is the shelf it lands on. Refuses the fintech dashboard: white cards, donut chart, gradient header, floating plus.

OWN-WORLD: Tag yellow #FFD400 owns the entry screen as one big tag; ink #111 carries every numeral and rule; white shelf labels with a black top rule; a black shelf-edge rail frames top and bottom; sale red #E3000F only strikes cancelled amounts. One condensed grotesque (Archivo, width axis) for everything, ranked by width, weight and size (raise from the design annual). Flat square scale-keypad keys. Every state carries form and label, never colour alone (raise from the cyclorama). Motion grammar: printing, short and weighted, downward; nothing floats.

STORY: At the counter she types 129,90 on the scale keypad and taps the Jídlo label. The tag prints down onto it, its period total ticks up, and an undo strip slides out of the rail. Přehled shows every category's total on one measured scale above a day-by-day list; earlier periods are one tap away.

FIRST VIEWPORT: At 390×844, the black rail on top carries the period range left and "Do výplaty N dní" right over a thin countdown strip. Below it sits the full-width yellow tag, about a third of the height: hang hole top left, the amount in 96px+ condensed black numerals right-aligned with a small Kč, a dotted "za co?" line and a date chip. Then comes the shelf of category labels, each with name and running total; tapping one saves. The scale keypad fills the lower third, and the tab bar sits in the bottom rail.

FORM: Cenovka, #4 of seven grounded candidates, assigned by the roll and kept by the user; seed key d81c7339; code-led build.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Direction contract — Pastelka (second style, user-pinned)

THESIS: The same shelf, drawn by hand in a squared notebook instead of printed. A style switch in Nastavení, not a scheme: it changes shape, texture and lettering, never colour, so it rides on all six schemes. Refuses the usual "soft mode" of rounded corners plus lighter grey.

OWN-WORLD: Squared paper (22px grid) with grain; every label, row and panel is a paper card with a hand-drawn double outline and uneven corners; fills are coloured in with crayon streaks; rails and the tab bar end in a torn wavy edge; the chosen tab and section titles are underlined with a squiggle; icons wobble through a displacement filter. Patrick Hand carries names, labels and sentences in sentence case, with no tracked capitals; amounts stay in Archivo, because the numbers must read at a glance. The scheme's own tokens supply every colour.

STORY: She switches to Kreslený in Nastavení → Vzhled and the same app comes back as her notebook: the pink tag is now crayoned in, "Jídlo" is handwritten, and the chart's columns are scribbled bars on squared paper.

FIRST VIEWPORT: At 390×844 the entry screen keeps its composition: wavy-edged rail on top, the crayon-filled tag with a drawn punched hole and the amount still in Archivo, the shelf of hand-lettered paper labels, the keypad as drawn keys on a paper panel, the tab bar ending in a torn edge.

FORM: User-pinned world ("kreslené, namalované pastelkami"), no roll: a precisely specified narrow request, built directly. Code-led.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
