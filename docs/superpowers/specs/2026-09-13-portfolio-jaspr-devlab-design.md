# Design: Jaspr Portfolio Rebuild — "devlab"

- **Date:** 2026-09-13
- **Status:** Approved (design sign-off)
- **Path:** superpowers architectural → writing-plans

## 1. Objective

Rebuild the existing static portfolio (`index.html`, `css/style.css`,
`js/main.js`) as a **Jaspr** (Dart) web application at the repo root of
`/home/shadow/me`. The visual language is re-imagined as a **"devlab" /
Dart console** motif rather than a pixel-port; all existing content is
preserved verbatim (with SWAP-ME placeholders carried through). The
legacy static files are archived to `legacy/` for reference.

## 2. Scope

**In scope**

- Jaspr project scaffolded at repo root (pubspec.yaml, lib/, test/, web/ output).
- Static-site rendering mode (`jaspr: mode: static`).
- Nine page regions: site head/nav, hero, about, skills, projects, journey, why-me, contact, footer.
- Visual redesign to a terminal/IDE/pub.dev/assert motif.
- Port of every existing interaction from `js/main.js` to Dart `@client` components.
- Styling entirely in Jaspr idioms: global `Style` + per-component `@css`, `ThemeExtension` tokens. No imported CSS files.
- Component + data-model tests; `dart analyze` clean; `jaspr build` succeeds.

**Out of scope**

- Server-side rendering per request (server mode); client-rendered SPA.
- Multi-page routing / additional pages.
- Content management, CMS, or markdown content loading.
- Replacing the SWAP-ME contact handles (stays as placeholders, mirroring the legacy file).
- Deploying to hosting (build artifact is handoff, not deployment).
- flutter/web compatibility shims.

## 3. Architecture

### 3.1 Rendering mode

`pubspec.yaml` sets `jaspr: mode: static`. `jaspr build` emits a static
site under `build/`. Chosen over server mode (no per-request logic
needed) and client mode (a landing page wants instant first paint + SEO
without SPA cost).

### 3.2 Repository layout

Old static files move to `legacy/` untouched. Jaspr project lives at root:

```
/home/shadow/me/
  pubspec.yaml
  analysis_options.yaml
  web/                 (build output / assets; web/index.html if needed)
  lib/
    main.dart          (entrypoint, runs jaspr App)
    app.dart           (root component: html scaffolding, global Style, sections)
    components/
      site_head.dart   (nav + brand + theme toggle + mobile menu)
      site_footer.dart
      icons.dart       (shared inline SVG icon set)
      terminal.dart    (modal-window/panel primitives, file-path headers)
    sections/
      hero.dart
      about.dart
      skills.dart
      projects.dart
      journey.dart
      why.dart
      contact.dart
    widgets/
      theme_toggle.dart     (@client)
      mobile_nav.dart       (@client)
      reveal.dart           (@client)
      counter.dart          (@client)
      spotlight_card.dart   (@client)
      contact_form.dart     (@client)
      particle_canvas.dart  (@client)
    data/
      site.dart        (brand, contact email, github/linkedin, metadata)
      skills.dart
      projects.dart
      journey.dart
      why_items.dart
    styles/
      tokens.dart      (ThemeExtension: colors, type, radius, spacing)
      global_styles.dart (global Style() + reset + token emission)
  test/
    data_test.dart
    contact_mailto_test.dart
    widget_smoke_test.dart
```

### 3.3 Component tree

```
App (server-rendered shell)
├─ Style (global reset + tokens via /* css variables from ThemeExtension */)
├─ head: meta/og/twitter, fonts (JetBrains Mono, Sora, Syne), favicon, theme prehidration inline script
├─ body:
│  ├─ SiteHead
│  │   ├─ Brand (mark + "Shadow.")
│  │   ├─ nav links (About, Skills, Projects, Journey, Contact CTA) + scroll-spy (@client)
│  │   ├─ ThemeToggle (@client)
│  │   └─ MobileNav (@client, hidden ≥ desktop breakpoint)
│  ├─ Hero: console status line, hello, h1, lede, CTAs (magnetic), stats w/ Counter,
│  │        IDE window with syntax-highlighted Dart snippet, particle canvas (@client, aria-hidden)
│  ├─ About: file-path header, lede paragraphs, 5 pillar cards (Beautiful UI, Clean Architecture, High Performance, Cross-platform, Scalable Apps)
│  ├─ Skills: import-card grid (10 cards: name, blurb, level bar `// progress`, level label)
│  ├─ Projects: pub.dev-style package cards (4: Study Stash, Velvet & Brew, Coffee Manager, LifeOS)
│  ├─ Journey: terminal log (6 entries: The spark → Now)
│  ├─ Why: analysis_options.dart assertions (5 points)
│  ├─ Contact: REPL form + channels panel
│  └─ SiteFooter: brand, © year (@client auto-update), socials
```

## 4. Visual language — "devlab / Dart console"

### 4.1 Type & palette

- **Type stack:** JetBrains Mono (terminal voice, primary for labels/headers/paths),
  Sora (body copy), Syne (display accents for h1/h2 punch). Loaded via Google Fonts.
- **Palette (dark default, light override via `data-theme`):**
  - base near-black `#06070d` / raised `#0a0c16` (dark); `#f1f2fa` / `#ffffff` (light)
  - text `#e9ebf7` / muted `#9aa3bd`
  - accent-1 neon violet `#a78bff`, accent-2 electric cyan `#4dd8ff`
  - **terminal-green** (new) `#6eff9e`-family for OK/success/`assert(true)` states
  - warm `#ff9e64` for micro-accent (terminal only)
  - border `rgba(255,255,255,.09)` (+ hi violet .45) / light-mode equivalents
- Managed via `ThemeExtension` (`TokenColors`, `TokenType`, `TokenShape`),
  emitted as CSS variables through the global `Style` component so
  `Color.variable('--accent-1')` works in `@css` styles.

### 4.2 Region motifs

| Region | Motif |
|---|---|
| Hero | Console banner `$ dart run shadow --profile=dev`; floating IDE window (`main.dart` tab) w/ highlighted snippet `class Shadow extends Developer {…}`; pulse status `Available for freelance projects`; count-up stats |
| Section headers | File-path breadcrumb: `~/shadow/sections/about.dart`, numbered `01…06` |
| Skills | `import 'package:shadow/skills/<name>.dart';` cards; level bar as `//──[████]── 95%`; `sr-only` level label |
| Projects | pub.dev-style package card: `shadow/study_stash`, version badge `v1.0.0`, description, tag chips (`Flutter · Firebase · BLoC`), fake pub-likes/score ring, Live Demo + GitHub links |
| Journey | Terminal log `$ flutter logs --journey`; entries `[INFO] 12:04 The spark`, `[OK] now Shipping for clients` |
| Why-me | `analysis_options.dart` block; each point an `assert(cond, 'msg');` line, green `✓` when satisfied |
| Contact | REPL prompt form `~ $ send_message --to contact@shadow.dev`; channels list as terminal `# email`, `# github`, `# linkedin` |

### 4.3 Motion

- Reveal-on-scroll (IntersectionObserver via `Reveal` @client wrapper, respects `prefers-reduced-motion`).
- Skill cards: cursor spotlight (CSS vars `--mx/--my`).
- Project cards: subtle tilt (`--rx/--ry`, reset on leave).
- CTA buttons: magnetic drift.
- Hero stat counters: eased count-up on view.
- Ambient canvas: floating code-glyphs + connecting dots (ported from legacy `#particles`).
- All interaction gated on `(pointer: fine)` and reduced-motion off — same guards as legacy.

## 5. Data models

Consolidated in `lib/data/`. All content equals the legacy source verbatim:

- `SiteProfile`: name `Shadow`, role `Flutter Developer`, tagline, description,
  email `contact@shadow.dev` (SWAP-ME), github `shadow-dev`, linkedin `shadow-dev`,
  og title/description/url `https://shadow.dev/` (SWAP-ME).
- `Skill`: name, blurb, level `double` (0–1), levelLabel (`Expert`/`Advanced`), icon id.
  10 entries: Flutter, Dart, Firebase, Supabase, REST APIs, BLoC/Cubit,
  Clean Architecture, Git & GitHub, UI/UX, State Management.
- `Project`: slug, name, one-line description, `List<String>` tags,
  `monogram` (SS/VB/CM/OS), `device` variant (phone/phone/desktop/focus), demo/github hrefs.
  4 entries: Study Stash, Velvet & Brew, Coffee Manager, LifeOS.
- `JourneyEntry`: phase label (The spark…Now), title, body. 6 entries.
- `WhyItem`: number, title, body. 5 entries.
- `NavLink`: label + anchor. About, Skills, Projects, Journey, Contact.

## 6. Interactivity (ported to Dart `@client`)

| Legacy behavior | Jaspr component |
|---|---|
| Theme toggle + localStorage + `meta[name=theme-color]` | `ThemeToggle` — reads/sets `data-theme`, writes `localStorage['theme']` (guarded try/catch), updates theme-color meta |
| Header `.scrolled` on scroll | in `SiteHead` (`@client`) — adds `.scrolled` class > 12px scroll, rAF-throttled |
| Mobile menu open/close, ESC, click-outside, close-on-link | `MobileNav` (`@client`) — `aria-expanded`, `.open` class, focus return |
| Reveal-on-scroll | `Reveal` (`@client`) — wraps children, observes itself, adds `in-view` once |
| Hero counter | `Counter` (`@client`) — 1200ms cubic-ease-out, counts on intersect (60% threshold) |
| Active nav section | scroll-spy observer inside `SiteHead` — sets `.active` + `aria-current` |
| Skill spotlight `--mx/--my` | `SpotlightCard` (`@client`) — generic wrapper (skills + project cards), sets vars, tilt for projects, magnetic for CTAs |
| Particles canvas | `ParticleCanvas` (`@client`) — dpr-aware, dots + connect-lines + code-glyph drift, visibilitychange pause |
| Contact form → mailto, inline `:invalid` UX, aria-invalid | `ContactForm` (`@client`) — validation (no `novalidate` bypass), builds `mailto:` from `data/site.dart`, status line, clears `aria-invalid` on input |
| Footer year | `SiteFooter` (`@client`) — `DateTime.now().year` |

Reduced-motion and fine-pointer guards are checked in the same way as
legacy (matchMedia at init; components that are purely decorative skip
their effect when reduced-motion is preferred).

## 7. Styling approach

- One global `Style` component rendered in `App`: reset (box-sizing,
  margin 0, `scroll-behavior: smooth`, `scroll-padding-top: calc(var(--nav-h)+12px)`),
  token variables (from `ThemeExtension`), base element styles (`body`,
  headings, links), theme transition, reduced-motion overrides.
- Every component declares scoped `@css static List<StyleRule> get styles`
  keyed to its own class and descendants; responsive breakpoints via
  `css.media(...)`.
- Icons as inline SVG components in `icons.dart` (stroke/currentColor,
  sized by CSS), matching legacy icon set plus terminal motifs.
- Radii/spacing/type scale centralized in tokens.

## 8. Accessibility & SEO

- Skip link; semantic landmarks (`header`, `main`, `section`, `footer`, `nav`);
  labelled by `aria-labelledby` section titles.
- Status pulse, decorative scanline/glyphs and particle canvas are
  `aria-hidden`; level meters carry `sr-only` labels.
- Full keyboard operation: focus-visible rings, ESC close menu with focus return.
- SEO: title, description, og/twitter meta, JSON-LD `Person` (mirrors legacy),
  single canonical `https://shadow.dev/`.
- Theme-color meta updated to match active theme.
- `lang="en"`, `data-theme="dark"` default; pre-hydration inline theme
  script (as legacy, ported into head) prevents flash.

## 9. Testing & verification

1. `dart analyze` — clean, zero issues.
2. `dart test` (with `jaspr_test`):
   - `data_test.dart`: model factories produce expected fields; level bounds 0–1; all projects have hrefs.
   - `contact_mailto_test.dart`: mailto builder composes subject/body exactly (type, name, message, URL-encoding).
   - `widget_smoke_test.dart`: renders `App`/section components without error (server context).
3. `jaspr build` — static build succeeds.
4. Manual preview: `jaspr serve` (or static preview of `build/`), visually
   verify each region at desktop + mobile widths, both themes, keyboard-only
   nav, and reduced-motion bucket.
5. `legacy/` untouched: old site still fully renderable.

## 10. Risks & mitigations

- **Hydration mismatch** (pre-rendered HTML vs client state: theme, year):
  inline pre-hydration script matches legacy approach; avoid rendering
  client-only values in server output (year renders after hydration only).
- **Jaspr CSS API surface** (`StyleRule`, `css.media`, `.px/.rem/.percent`):
  verify against jaspr docs during implementation; fallback is a global
  `Style` block with hand-written rules.
- **Particle canvas in `@client` component**: DOM access via Jaspr
  refs/`dart:html` guards; canvas is `display:none` behind reduced-motion.
- **Static build asset paths**: keep base-href-relative asset references so
  `build/` deploys under any host path.

## 11. Milestones

1. Scaffold: activate `jaspr_cli`, `jaspr create`, layout + tokens + global Style, archive legacy to `legacy/`.
2. Data models + content fixtures + data tests.
3. Shell (App, SiteHead, SiteFooter, icons, terminal primitives).
4. Sections: Hero → About → Skills → Projects → Journey → Why → Contact.
5. `@client` widgets: theme, menu, reveal, counter, spotlight, form, particles.
6. SEO/meta/JSON-LD, a11y pass, reduced-motion.
7. Verify: analyze, tests, build; preview + visual check.