# Shadow Dev Portfolio (Jaspr) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready, premium single-page developer portfolio for "Shadow Dev" using Jaspr (Dart, static SSG).

**Architecture:** Jaspr static-mode site. Server pre-renders the full page (`main.server.dart` → `Document`); the root `App` is `@client` so the whole page hydrates in place. Interactivity is Dart `@client` components (theme, mobile nav, reveal-on-scroll, active-link spy, form validation, footer year). Styling is 100% Jaspr `@css` + one global `Style` — no external CSS files, no Tailwind. All content lives in typed data models in `lib/data/`.

**Tech Stack:** Jaspr 0.23.4, Dart 3.12.2, `package:universal_web/web.dart` for DOM, `jaspr_test` + `dart test` for tests.

**Spec:**
- User spec: "Build a Premium Developer Portfolio with Jaspr" (message in session, authoritative for content + requirements).
- `/home/shadow/me/docs/superpowers/specs/2026-09-13-portfolio-jaspr-devlab-design.md` (visual language, superseded in content specifics by the user spec).

## Global Constraints

- No React, Next.js, Tailwind, or non-Jaspr frameworks. Dart + Jaspr only.
- Content is **exact**: Name `Shadow Dev`, Role `Flutter Developer & Software Engineer`, the exact short bio and About paragraphs, exact 10-skill list grouped into `Frontend`, `Backend & Database`, `Tools`, and the three projects (Velvet & Brew, Study Stash, Flutter Installer) with the exact descriptions/tech/status given.
- **No fabricated data**: no fake statistics, no invented URLs, no client names, no employment history. Placeholder dates for the timeline (phase labels, not invented years). Missing links are clearly-labeled placeholders (`#` + visible "(coming soon)").
- Do not present the subject as a senior developer or claim unlisted expertise.
- Visual language: deep navy/black, purple × electric-blue edge gradients, subtle grid, ambient glow, glassmorphism cards (thin border, soft shadow, blur), clean type, generous spacing, polished animations. Fully responsive from 320px.
- Honest contact form: frontend-only. On submit, validate and *either* open a `mailto:` compose *or* show a clear "not connected to a backend" state — never claim a message was sent.
- Respect `prefers-reduced-motion`; gate decorative animation (`(pointer: fire)` motion) behind it.
- Navbar: Home, About, Projects, Skills, Contact; sticky blur; active indicator; mobile menu.
- SEO metadata + semantic landmarks + accessible form/nav.
- Verification gates: `dart format --output=none --set-exit-if-changed /home/shadow/me`, `dart analyze` (zero issues), `dart test` green, `jaspr build` succeeds, serve + visual check.

## File Structure

```
lib/
  main.server.dart          (Document: title, meta, fonts import, global Style, body)
  app.dart                  (root @client App: ambient bg, sections stack)
  core/
    palette.dart            (design tokens: colors, fonts, radii, spacing, z-index)
    global_styles.dart      (reset, base, utilities: .container, .glass, .grad-text, .btn, .sr-only, .reveal, .grid-bg, .orb, keyframes)
  data/
    profile.dart            (SiteProfile: name, role, bio, about, email, github, linkedin, status, nav links)
    skills.dart             (Skill + SkillCategory {Frontend, Backend & Database, Tools})
    projects.dart           (Project{name, description, tech[], status, cta, github?, demo?})
    journey.dart            (JourneyEntry{phase, title, body})
  components/
    icons.dart              (inline SVG icon components, stroke-width via CSS)
    glass.dart              (GlassCard primitive)
    section_header.dart     (kicker + title + rule)
    reveal.dart             (@client Reveal wrapper: IO add .in-view)
    navbar.dart             (@client: sticky/blur, theme toggle, active spy, mobile menu)
    footer.dart             (@client: year; brand; socials)
    project_card.dart       (render Project)
  sections/
    hero.dart               (headline, badge, CTAs, socials, orbit visual, entrance anims)
    about.dart              (intro, journey, learning focus, compact truthful stats)
    projects.dart           (grid of ProjectCard)
    skills.dart             (category grid with icons)
    journey.dart            (vertical timeline)
    contact.dart            (@client form: validation, mailto, honest status; channels)
test/
  profile_test.dart         (data invariants)
  contact_mailto_test.dart  (mailto builder encodes subject/body)
  widget_smoke_test.dart    (App + each section render without error)
web/                        (favicon + static assets; main.client.dart.js output at build)
```

## Task 1: Scaffold cleanup + palette + global styles

**Files:** Create `lib/core/palette.dart`, `lib/core/global_styles.dart`; modify `lib/main.server.dart`, `lib/app.dart`.

**Interfaces:**
- Consumes: scaffold from `jaspr create -m static`.
- Produces: `Tokens` static class (color/type/radius consts), `GlobalStyles.styles → List<StyleRule>`, `App` with `@client` and ambient layers.

- [ ] **Step 1:** Delete template cruft (`lib/pages/`, `lib/constants/theme.dart`, `lib/components/counter.dart`, `web/images/logo.svg`).
- [ ] **Step 2:** Write `lib/core/palette.dart` with tokens: bg `#05060f`, bg-raise `#0a1030`, surface `rgba(255,255,255,.045)`, border `rgba(255,255,255,.09)`, text `#e9ecff`, muted `#9aa5c4`, violet `#a78bff`, blue `#4dd8ff`, green `#67e8a4`, warm `#ffb36b`, fonts (Space Grotesk / Sora / JetBrains Mono), radii, nav height, glows.
- [ ] **Step 3:** Write `lib/core/global_styles.dart`: `css(':root')` variable emission from palette, reset, body base, `.container` (max-width 72rem), `.section` (padding, scroll-margin), `.glass`, `.grad-text`, `.btn/.btn-primary/.btn-ghost`, `.sr-only`, `.grid-bg` (linear-gradient grid lines + mask), `.orb` + keyframes, entrance/reveal keyframes, reduced-motion overrides.
- [ ] **Step 4:** Rewrite `lib/main.server.dart` `Document(title: 'Shadow Dev — Flutter Developer & Software Engineer', styles: [font css.import + GlobalStyles.styles])`.
- [ ] **Step 5:** Rewrite `lib/app.dart` root `@client App` rendering body layers.
- [ ] **Step 6:** Verify `jaspr build` succeeds; `dart analyze` clean.
- [ ] **Step 7:** Commit.

## Task 2: Data models

**Files:** Create `lib/data/profile.dart`, `lib/data/skills.dart`, `lib/data/projects.dart`, `lib/data/journey.dart`.

**Interfaces:**
- Produces: `SiteProfile`, `NavLink(id,label)`, `Skill(name, iconKey, usedFor)`, `SkillCategory(name, tagline, skills)`, `Project(name, description, tech, status, ctaLabel, github, demo, monogram)`, `JourneyEntry(phase, title, body)` — exact content from user spec; github/demo are `String?` (null → placeholder `#`).

- [ ] **Step 1:** Write the four model files with the verbatim copy/tech from the spec.
- [ ] **Step 2:** Tests in `test/profile_test.dart` asserting the exact count/content of skills (10), categories (3), projects (3) and that no URL/statistic is invented (github/demo nullable).
- [ ] **Step 3:** `dart test` passes.
- [ ] **Step 4:** Commit.

## Task 3: Icons + primitives

**Files:** Create `lib/components/icons.dart`, `lib/components/glass.dart`, `lib/components/section_header.dart`, `lib/components/reveal.dart`.

**Interfaces:**
- Produces: `SvgIcon(name, size)` switch over icon keys (flutter, dart, python, supabase, sql, firebase, rest, git, ui, arch, github, linkedin, mail, arrow, external, check, menu, close, sun, moon, code); `GlassCard(key, child, classes)`; `SectionHeader(index, kicker, title)`; `Reveal([d]): StatefulComponent` with `@client` returning a div with class `reveal${inView?' in-view':''} ${delayClass}`.

- [ ] **Step 1:** Implement `SvgIcon` as a switch returning inline `svg(viewBox: '0 0 24 24', [paths...])` with `class: 'ic ic-$name'`.
- [ ] **Step 2:** Implement `GlassCard`, `SectionHeader`, `Reveal` (@client, sets up IntersectionObserver on itself in `initState` via a `GlobalNodeKey`, adds class on intersect, respects reduced-motion by adding `.in-view` immediately).
- [ ] **Step 3:** `jaspr build` + `dart analyze` clean.
- [ ] **Step 4:** Commit.

## Task 4: Navbar + theme + footer

**Files:** Create `lib/components/navbar.dart`, `lib/components/footer.dart`.

**Interfaces:**
- Consumes: `NavLink`, `SiteProfile`, `SvgIcon`.
- Produces: `Navbar()` — sticky translucent blurred header (`.scrolled` shadow at >12px), brand "Shadow Dev" mark, desktop links with `aria-current` active via IntersectionObserver spy, theme toggle button (reads/writes `localStorage['theme']` guarded, sets `data-theme` + `meta[name=theme-color]`), mobile menu button (aria-expanded, ESC close, click-outside close, focus return) with slide-in panel. `Footer()` — brand, © `year` set client-side via `DateTime.now().year`, social links.

- [ ] **Step 1:** Implement Navbar (@client StatefulComponent holding theme + menu + activeId state).
- [ ] **Step 2:** Implement Footer (@client, sets year in `initState`).
- [ ] **Step 3:** Wire global `data-theme` handling + anti-flash: read localStorage in server-rendered inline script (added in `main.server.dart` head via `raw`?) OR in `App.initState` before first paint. Choose single approach that avoids hydration flash.
- [ ] **Step 4:** `jaspr build`, `dart analyze`, commit.

## Task 5: Hero + About + Skills + Journey + Projects + Contact sections

**Files:** Create `lib/sections/hero.dart`, `lib/sections/about.dart`, `lib/sections/skills.dart`, `lib/sections/journey.dart`, `lib/sections/projects.dart`, `lib/sections/contact.dart`; wire into `app.dart`.

**Interfaces:**
- Consumes: all data models, primitives, icons.
- Produces: `Hero()`, `About()`, `Skills()`, `Journey()`, `Projects()`, `Contact()` (stateless; interactivity only via `@client` subcomponents — form is its own `@client` component inside `contact.dart`).

- [ ] **Step 1:** Hero: badge "Available for opportunities" (pulse dot), headline "Building Digital Experiences That Matter.", lede, `View My Projects` + `Contact Me` buttons, GitHub/LinkedIn socials, CSS orbit visual (concentric rings + floating code chips, `aria-hidden`), entrance animation.
- [ ] **Step 2:** About: intro + developer journey + current learning focus; **truthful** compact stats (counted: 3 projects · 10 technologies · 1 focus); glass layout with `About` data.
- [ ] **Step 3:** Skills: 3 category groups (Frontend, Backend & Database, Tools) with icon cards, hover lift + glow, responsive grid.
- [ ] **Step 4:** Journey: vertical timeline, phase labels (no fake years), dots + connectors.
- [ ] **Step 5:** Projects: `ProjectCard` grid — monogram illustration, name, description, tech tags, status chip, CTA + github + demo (or labeled placeholders). Tilt hover.
- [ ] **Step 6:** Contact: "Let's Build Something Great", invite, form (Name/Email/Message) with validation + `aria-invalid` + `role=status`; on submit build `mailto:` compose via `Uri` and set status "Opening your email client…"; include email/GitHub/LinkedIn channels; note that form opens email client (no backend).
- [ ] **Step 7:** Build + analyze + commit (section commits may be split per major unit).

## Task 6: SEO + a11y + reduced-motion audit

**Files:** modify `lib/main.server.dart`, `lib/app.dart`, sections.

- [ ] **Step 1:** SEO: title, description, theme-color, og/twitter, canonical (https://shadow.dev placeholder — labeled), JSON-LD Person (no invented fields; use real content only).
- [ ] **Step 2:** a11y: skip link, landmarks, `aria-labelledby`, focus-visible, contrast check (muted text ≥4.5:1 on surfaces), reduced-motion (disable reveal/particle-like anims, tighten transitions).
- [ ] **Step 3:** Build + analyze + commit.

## Task 7: Tests + final verification

**Files:** `test/contact_mailto_test.dart`, `test/widget_smoke_test.dart`.

- [ ] **Step 1:** `contact_mailto_test.dart`: the `buildMailto(...)` helper (exported from contact section or `lib/core/mailto.dart`) encodes subject `[Portfolio] …` / body exactly; empty/missing message handled.
- [ ] **Step 2:** `widget_smoke_test.dart`: `runApp` each section (server context) renders without throwing; navlink ids match section ids.
- [ ] **Step 3:** `dart format`, `dart analyze` (0 issues), `dart test` (all green), `jaspr build` succeeds.
- [ ] **Step 4:** Serve `build/jaspr` and visually verify desktop + 320px mobile, both themes, keyboard nav, reduced-motion, no console errors (browser check).
- [ ] **Step 5:** Commit.

## Self-review notes

- No placeholders: all task steps contain concrete deliverables.
- Type consistency: `Reveal` accepts `int d` delay; `SectionHeader` accepts `(String index, String kicker, String title)`; `Project` fields exact per spec.
- Spec coverage: every navbar/hero/about/projects/skills/journey/contact requirement maps to a task; reduced-motion, honest form, no-fabrication, SEO, a11y, responsive all covered.