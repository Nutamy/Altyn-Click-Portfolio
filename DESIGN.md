---
name: Altyn Click
description: Noon over a steppe that does not exist. A liquid-gold shanyrak hangs over sun-bleached dust, and the reading happens on warm felt.
colors:
  gold: "#C9932A"
  gold-hi: "#F1C76A"
  gold-deep: "#7A4F0C"
  gold-wash: "#FFF7E6"
  ultramarine: "#2B3FB8"
  ultramarine-deep: "#1F2E8A"
  sky: "#C9D1EA"
  sky-2: "#DEE2EF"
  stone: "#E8DFD1"
  stone-2: "#DCD0BD"
  stone-3: "#CDBFA9"
  felt: "#F7F4EF"
  felt-2: "#F1ECE4"
  paper: "#FFFDF9"
  ink: "#1A1511"
  ink-2: "#4A3F35"
  ink-3: "#66594B"
  ink-hover: "#2B231C"
  on-ink: "#FBF6EC"
  on-ink-2: "#D9CBB4"
  on-ink-hi: "#FFF6E2"
  line: "rgba(26,21,17,.14)"
  error: "#A3271C"
  error-wash: "#FBEAE6"
  success: "#2E6B3A"
  world-gold: "#E7B65A"
  world-sky-top: "#C4CDE8"
  world-horizon: "#EEEBE6"
  world-felt-mat: "#2A211A"
typography:
  display:
    fontFamily: "Commissioner, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.55rem, 1rem + 4.1vw, 4.9rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.025em"
    fontVariation: "'FLAR' 100, 'VOLM' 45"
  headline:
    fontFamily: "Commissioner, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.25rem + 2.7vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.025em"
    fontVariation: "'FLAR' 100, 'VOLM' 45"
  title:
    fontFamily: "Commissioner, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.3rem, 1.05rem + .85vw, 1.8rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.025em"
    fontVariation: "'FLAR' 100, 'VOLM' 45"
  subtitle:
    fontFamily: "Commissioner, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
    fontVariation: "'FLAR' 100, 'VOLM' 45"
  body:
    fontFamily: "Commissioner, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontVariation: "'FLAR' 0, 'VOLM' 0"
  label:
    fontFamily: "Commissioner, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 700
    letterSpacing: "0.02em"
    fontVariation: "'FLAR' 0, 'VOLM' 0"
  button:
    fontFamily: "Commissioner, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.98rem"
    fontWeight: 650
    lineHeight: 1.15
    letterSpacing: "0.005em"
    fontVariation: "'FLAR' 0, 'VOLM' 0"
  wordmark:
    fontFamily: "Unbounded, Commissioner, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 600
    letterSpacing: "-0.02em"
rounded:
  sm: "12px"
  md: "18px"
  lg: "28px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 64px)"
  sheet-gutter: "clamp(10px, 2.5vw, 40px)"
  sheet-pad: "clamp(1.5rem, 4.5vw, 4.5rem)"
  card-pad: "clamp(1.4rem, 2.4vw, 2.4rem)"
  section-gap: "clamp(3rem, 6vw, 5rem)"
  header: "72px"
  container: "1440px"
  measure: "62ch"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 1.35rem"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.ink-hover}"
    textColor: "{colors.on-ink}"
  button-quiet:
    backgroundColor: "rgba(255,253,248,.55)"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 1.35rem"
    height: "46px"
  button-lg:
    padding: "0 1.9rem"
    height: "58px"
  button-sm:
    padding: "0 1.05rem"
    height: "40px"
  sheet:
    backgroundColor: "{colors.felt}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.sheet-pad}"
  work-card:
    backgroundColor: "{colors.felt}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card-pad}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.8rem 1rem"
    height: "52px"
  segment:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 1.05rem"
    height: "44px"
  segment-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
  option-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "1.25rem 1.3rem 1.3rem 3.3rem"
  option-card-selected:
    backgroundColor: "{colors.gold-wash}"
  ink-panel:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.md}"
    padding: "1.3rem 1.5rem"
  header:
    backgroundColor: "{colors.felt}"
    textColor: "{colors.ink-2}"
    height: "{spacing.header}"
  footer:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink-2}"
---

# Design System: Altyn Click

## Overview

**Creative North Star: "Noon Over the Steppe"**

A high-key world: a pale sky fades into sun-bleached steppe dust, and above it hangs one object, a shanyrak (the yurt crown) cast in liquid gold that reflects both sky and ground. The page scroll flies the camera into that world. The reading happens on dense panels of warm white felt that sit over the landscape like hangings on a yurt wall. Nothing is translucent. Text sits on felt, felt sits in the dust, and gold is the only material that shines.

Density is calm and editorial. Each section is one felt sheet with a narrow reading measure. Lists are ruled lines or quiet middots rather than tiles. The display type is Commissioner with its flared terminals fully open, so headlines read as cast metal, while running text stays plain. Interaction colour is held back. Ultramarine, the felt dye, appears only where the reader can act or is focused: links, focus rings, selection and the text caret. Commands are ink capsules with a gold rim.

The world is staged three ways from one source. **Full** (1100px and wider) runs a scroll-driven camera route with sticky reading stations. **Mobile** (below 1100px, or touch) runs a shorter vertical route behind ordinary cards. **Lite** (no WebGL, reduced motion, weak devices or save-data) shows a static SVG crown. The visual system is the same in all three; only the depth layer changes.

**Key Characteristics:**
- High-key sky-to-dust field (sky → sky-2 → stone), never a dark studio.
- One shining material: liquid gold. Everything else is matte felt, dust or ink.
- Opaque warm felt panels, 28px corners, a soft warm drop shadow, no glass or blur.
- Ultramarine is reserved for links, focus, selection and the caret.
- Commissioner at FLAR 100 / VOLM 45 for display and FLAR 0 for text. The wordmark is Unbounded.
- Ruled lists, middot-separated inline lists and flat gold-deep numerals.

## Colors

A sunlit, low-chroma field of sky and dust. Warm black ink carries the text, one metal (gold in three tones) carries emphasis, and a single saturated dye (ultramarine) marks interaction.

### Primary
- **Liquid Gold** (gold): button rims, the 2px top rule on term and service grids, list dots, selected thumbnails and the gold rim around screenshots. It is the material accent and always a line or a small mark, never a fill behind text.
- **Molten Highlight** (gold-hi): the hover rim on buttons, gold text on ink (pilot price, links in the success panel, the footer wordmark dot) and the focus ring on ink surfaces.
- **Cast Bronze** (gold-deep): text-weight gold on light surfaces, including step numerals, work taglines, option prices, service prices, the wordmark dot, the route gauge progress line, hero-fact diamonds, middots and the scrollbar thumb. Use this tone whenever gold must pass as text contrast on felt.
- **Gold Wash** (gold-wash): the fill of a selected option and of the calculator summary.

### Secondary
- **Felt Ultramarine** (ultramarine): links (`link-out`, `link-btn`, consent and alternative-contact links), the `:focus-visible` outline (3px, 3px offset), input focus border plus a 4px wash at 18%, `::selection` and `caret-color`.
- **Deep Ultramarine** (ultramarine-deep): link hover only.

### Neutral
- **Pale Noon Sky** (sky) and **Haze Sky** (sky-2): the top of the page field. The body gradient runs sky at 0 → sky-2 at 55vh → stone at 115vh.
- **Steppe Dust** (stone): the ground the page settles on, and the 3D ground plane. **Dry Grass** (stone-2) is the scrollbar track. **Packed Earth** (stone-3) is the resting border of inputs, segments and the light case-nav buttons.
- **Warm White Felt** (felt): every reading surface, including sheets, work cards, the form panel (the "tör"), the modal panel, the opaque header and the mobile menu. **Shaded Felt** (felt-2) is the agencies sheet only, so the B2B offer reads as a second room.
- **Paper** (paper): inner surfaces placed on felt, such as inputs, option cards, tier tiles and the case highlight.
- **Warm Black** (ink): text, primary buttons, ink panels (calculator, pilot, success message, case top bar) and the footer. **Ink-2** is secondary text and nav links. **Ink-3** is meta text, hints and labels on fact rows.
- **On-ink** family: on-ink is text on ink, on-ink-2 is muted text on ink, and on-ink-hi is headings and totals on ink.
- **Line** (line): every hairline rule and divider.
- **Error** / **Error Wash** / **Success**: form validation and server states only.

### 3D world palette (written in display colour space, sRGB output, ACES tone mapping at 1.05)
- **world-sky-top → world-horizon**: the sky dome gradient, with a warm sun glint.
- **world-gold**: the base colour of the PBR liquid gold (metalness 1, roughness about 0.06–0.14, noise-driven normal and vertex wave).
- **stone**: the ground, shared with the page token.
- **world-felt-mat**: warm black felt (roughness 1) behind each screenshot panel. Screenshots never float on gold or sky directly.

### Named Rules
**The Felt Dye Rule.** Ultramarine marks only what the reader can act on or is focused on: links, focus, selection and the caret. It never fills a button, a heading or a decoration.

**The One Metal Rule.** Gold is the only material that shines. On light surfaces, text-weight gold uses gold-deep. Bright gold appears as rims, rules and dots, or as gold-hi on ink.

**The Opaque Felt Rule.** Reading surfaces are opaque felt. No glass, backdrop blur or translucent plates over the world. The only blur in the system is the modal backdrop.

## Typography

**Display Font:** Commissioner, variable (FLAR 100, VOLM 45), with ui-sans-serif and system-ui as fallbacks
**Body Font:** Commissioner, variable (FLAR 0, VOLM 0)
**Wordmark:** Unbounded 600, subset to the Latin wordmark glyphs, kept on every language version

**Character:** One family with two tempers. Opened flares make headings look poured and cast, matching the gold. Flat terminals keep running text quiet and legible in Russian, Kazakh and English.

### Hierarchy
- **Display** (h1): the entrance headline only. It is balanced and, on the full route, capped at about 8.8em wide so it stays clear of the crown.
- **Headline** (h2): sheet titles, capped at 22ch. On the full route the size steps down to clamp(2rem, 1.1rem + 1.6vw, 2.9rem) inside the narrow left column.
- **Title** (h3): sub-section and panel headings. Work names use a larger clamp(1.9rem, 1.4rem + 1.6vw, 2.9rem).
- **Subtitle** (h4): step titles and case sub-headings.
- **Body** (1.0625rem / 1.6): paragraphs on felt, capped at the 62ch measure. Lead text runs 1.08–1.3rem in ink-2.
- **Label** (0.82rem, 700, +0.02em, sentence case): term labels in fact rows. Small meta text runs 0.85–0.92rem in ink-3.
- **Display accents in text:** prices, totals, tier figures, option names and step numerals take the display variation (FLAR 100) at weight 700 inside text-sized contexts.

### Named Rules
**The Cast and Woven Rule.** FLAR 100 / VOLM 45 belongs to headings, prices and numerals. Running text, buttons, inputs and labels stay at FLAR 0. Do not set long text in the flared cut.

**The Tabular Figures Rule.** Numbers that compare (prices, counters, step numerals) use tabular lining figures and never wrap.

**The Kept Line Rule.** Text content gets non-breaking spaces after short Russian and Kazakh words and before dashes, so a line never ends on «в», «и» or «және» and never starts with «—». The typograph script applies this to the Russian pages by hand and to the generated Kazakh pages on every build.

## Layout

The container is 1440px with a fluid gutter of clamp(16px, 4vw, 64px). Reading sheets sit in a slightly tighter outer gutter (clamp(10px, 2.5vw, 40px)), cap at 76rem and carry their own padding. Paragraph measure is 62ch everywhere. The fixed header is 72px, and scroll padding clears it by 16px.

- **Full staging (1100px and wider):** each work is a sticky 100vh station inside a 165vh track, with the felt card on one side and the screenshot on the other. Sides alternate between even and odd works, using card columns of 34–36rem. Reading sheets move left into a column of min(46rem, 52vw) so the aerial view of the yurt owns the right half. Multi-column grids collapse to one or two columns inside that column. From 1180px the route gauge is fixed at the right edge, and stations reserve 120px for it.
- **Mobile staging (below 1100px):** works stack as a card plus screenshot. The entrance copy sits low (top padding of about 30–32svh) under the crown, with a dust haze behind the text zone.
- **Breakpoints in use:** 480px (header CTA appears), 768px (two-column grids, desktop screenshot ratio), 900px (step and about grids), 1024px (desktop nav), 1100px (staging switch), 1180px (route gauge).
- **Rhythm:** the gap between sub-sections inside a sheet is clamp(3rem, 6vw, 5rem). Ruled rows use about 1.2–1.6rem vertical padding. Intros use 18vh / 10vh of air above and below.

## Elevation & Depth

Real depth lives in the 3D world. The DOM uses one soft, warm, ambient lift for felt surfaces and keeps everything else flat with inset hairlines. Shadows are tinted brown (rgba(60,40,15,…)), never grey, and always blurred.

### Shadow Vocabulary
- **Felt lift** (`0 1px 0 rgba(255,255,255,.7) inset, 0 18px 40px -22px rgba(60,40,15,.45), 0 4px 10px -6px rgba(60,40,15,.25)`): sheets, work cards, the form panel and the privacy page panel.
- **Place of honour** (felt lift plus `0 0 0 1px rgba(201,147,42,.35), 0 0 0 8px rgba(241,199,106,.14)`): the form panel only. It is a soft gold halo, the "tör" of the yurt.
- **Gold rim frame** (`0 0 0 1.5px gold, 0 0 0 6px rgba(241,199,106,.18), 0 30px 50px -30px rgba(60,40,15,.6)`): screenshot buttons.
- **Capsule** (`inset 0 0 0 1.5px gold, inset 0 1px 0 1.5px rgba(241,199,106,.55), 0 12px 26px -14px rgba(26,21,17,.75)`): primary buttons.
- **Header settle** (`0 1px 0 line, 0 10px 30px -24px rgba(60,40,15,.5)`): the opaque header once the page scrolls.
- **Modal** (`0 40px 80px -30px rgba(26,21,17,.7)`) over a 60% ink backdrop with a 6px blur.

### Named Rules
**The Inset Line Rule.** Borders on controls and tiles are drawn as inset box-shadows (1–2px), not layout borders. The only true borders are the input stroke and the hairline rules between list rows.

## Shapes

Soft, generous corners on surfaces and full capsules on anything pressable. Surfaces use 28px (sheets, cards, the form panel, the modal and the ink pilot block), 18px for mid-size containers (screenshots, option cards, the calculator, the success panel and the case highlight) and 12px for small fields and tiles (inputs, tier tiles, the calculator summary, the form error). Buttons, segments, the language switch, route pills and the burger are full pills (999px). Round icon buttons are 46px circles. The founder portrait is clipped to an arch (28px top corners, square bottom).

Small geometric marks carry structure. They include a 7px gold dot (bulleted lists), a 7px gold-deep diamond rotated 45° (hero facts), a 12px ring that fills with gold (route stations) and a 2px gold top rule (term and service grids).

## Components

### Buttons
Ink capsules with a gold rim: heavy, warm and precise.
- **Shape:** full capsule (999px), 46px tall by default, 40px small and 58px large.
- **Primary:** ink fill, on-ink text, 650 weight, a 1.5px inset gold rim with an upper gold-hi edge, and a soft dark drop.
- **Hover / Active:** fill moves to ink-hover, the rim brightens to gold-hi and the button lifts 2px. Active returns to rest with a tighter shadow. Reduced motion removes the lift.
- **Quiet:** a translucent paper capsule with a 1.5px ink rim at 32%. On hover it goes almost opaque with a full ink rim. On ink panels it becomes transparent with an on-ink rim.
- **Busy:** a gold spinner (gold-hi arc on a faint gold ring) and the progress cursor.

### Links
- **Out-link / link-button:** ultramarine, 650 weight, underlined at 35% opacity with a 0.22em offset. On hover the underline goes solid and the colour deepens to ultramarine-deep. Out-links carry an inline 1em arrow SVG.

### Cards / Containers
- **Sheet:** felt, 28px corners, felt lift and fluid padding. It holds one whole section.
- **Work card:** felt, 28px corners, at most 36rem wide. It contains the name, a gold-deep tagline, a ruled fact list (label column 6.2rem in ink-3, values in ink-2) and actions.
- **Ink panel:** ink fill with on-ink text, used for the calculator total, the agencies pilot offer, the success message (with a 1.5px gold inset rim) and the case-viewer top bar.

### Lists (signature)
- **Ruled list:** rows separated by hairlines (line) with a top rule. Used for doubts, FAQ, fact rows, terms and steps.
- **Gold-topped grid:** term and service grids open with a 2px gold top rule, then use hairline rows.
- **Inline list:** plain text separated by gold-deep middots. These are descriptions, not chips or buttons.
- **Bulleted list:** a 7px gold dot, 1.4rem indent and ink-2 text with an ink lead-in in bold.
- **Steps:** decimal-leading-zero counters (01, 02…) as flat gold-deep numerals, 1.5rem in the display cut, set in a 4.2rem left gutter. They are numerals, not badges.

### Inputs / Fields
- **Style:** paper fill, 1.5px stone-3 stroke, 12px corners, 52px minimum height, labels in 650 weight above the field. Placeholders are ink-3.
- **Hover / Focus:** hover darkens the stroke to ink-3. Focus switches the stroke to ultramarine with a 4px ultramarine wash at 18%.
- **Error:** error stroke with a 4px wash at 12%, and a message in error red with an inline circle-alert SVG. Server errors use an error-wash block.
- **Segments:** paper capsules 44px tall with a stone-3 inset rim. Selected segments become an ink capsule with a gold rim, matching the primary button.
- **Option cards:** paper, 18px corners and an inset line rim. Each has a 1.25rem check square at the left. When selected, the card fills with gold-wash and gets a 2px gold-deep rim, and the check fills ink with a gold-hi tick.

### Navigation
- **Header:** transparent over the sky at the top, then **opaque felt** with a hairline and a soft settle shadow once scrolled or when the menu opens. It holds the Unbounded wordmark (with the dot in gold-deep), nav links in ink-2 at 600 weight that get a 1.5px gold underline on hover, the language switch and the primary CTA.
- **Language switch:** a translucent paper pill with an inset line rim. The current language is an ink pill.
- **Mobile menu:** an opaque felt drop-down with large display-cut links on hairline rows. The CTA link is gold-deep.
- **Footer:** an ink band with muted on-ink text. Links turn gold-hi and underlined on hover, and the focus ring switches to gold-hi.

### Route gauge (signature)
A vertical depth axis fixed at the right edge from 1180px. A hairline track fills with gold-deep as the page scrolls. Stations are felt pills with a 12px ring that fills gold with a soft gold halo on the current step, and tiny dots between stations mark the works.

### Case viewer
A modal felt panel up to 64rem wide, full-screen on phones. It has an ink top bar with a counter and gold-rimmed round buttons, the screenshot on an ink field, thumbnails that light to full opacity with a gold ring, and a felt body with bulleted results and a paper highlight with a gold hairline rim. The panel rises 24px and fades in on the brand ease.

### The world (signature)
The liquid-gold shanyrak is shown at three fidelities (full, mobile, lite). Screenshots hang in the 3D yurt as panels on warm black felt mats inside gold tube frames. The lite staging replaces the scene with a static SVG crown. Canvas fades in over 1.2s. Motion uses one ease, `cubic-bezier(.16,1,.3,1)`.

## Do's and Don'ts

### Do:
- **Do** set every reading surface on opaque felt with 28px corners and the felt lift shadow.
- **Do** keep ultramarine for links, focus, selection and the caret only.
- **Do** make commands ink capsules with a 1.5px gold rim. Quiet actions are paper capsules with an ink rim.
- **Do** use gold-deep for any gold that must read as text on felt or paper. Reserve gold and gold-hi for rims, rules and dots, and for text on ink.
- **Do** separate list rows with hairline rules, separate inline lists with gold-deep middots, and number steps with flat gold-deep numerals.
- **Do** cap paragraphs at the 62ch measure and use tabular figures for prices and counts.
- **Do** draw control and tile borders as inset box-shadows, and tint every drop shadow warm brown.
- **Do** keep all three stagings (full, mobile, lite) visually equivalent apart from the depth layer, and respect prefers-reduced-motion by removing travel while keeping fades and colour changes.

### Don't:
- **Don't** put glass, backdrop blur or translucent plates under reading text. The modal backdrop is the only blur.
- **Don't** fill buttons, headings or decorative shapes with ultramarine.
- **Don't** set running text, buttons or inputs in the flared (FLAR 100) cut.
- **Don't** turn descriptive inline lists into chips or pill tags.
- **Don't** use grey or hard offset shadows. Depth is either warm and blurred or comes from the 3D world.
- **Don't** add kickers, eyebrow labels or section numbers above headings.
- **Don't** let screenshots sit directly on gold or sky. In 3D they hang on a warm black felt mat, and in the DOM they sit in an ink field with a gold rim.
