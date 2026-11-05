# Idoumou Chekhne Ahmed Ibrahim — Portfolio

Personal developer portfolio for **Idoumou Chekhne Ahmed Ibrahim** (Shadow Dev), Flutter developer
and software engineer. Content mirrors the CV in [resume/](resume/).

Built with plain **HTML5, CSS3, and vanilla JavaScript** — no frameworks, no build step, no dependencies.

## Stack

- HTML5 with semantic landmarks and accessible navigation
- CSS3 custom properties, glassmorphism, dark futuristic theme
- Vanilla JavaScript: mobile menu, scroll spy, scroll reveal, form validation
- SEO: Open Graph, Twitter cards, JSON-LD structured data

## Structure

```
.
├── index.html          # All content and sections
├── style.css           # Design tokens, layout, components
├── script.js           # Interactivity (vanilla, ES module)
├── lib/
│   └── core.js         # Pure validation and scroll-spy logic (DOM-free)
├── tests/
│   ├── core.test.js    # Unit tests for lib/core.js
│   └── markup.test.js  # Contract tests: markup hooks script.js relies on
├── package.json        # ESM + `npm test` (no dependencies)
├── resume/
│   ├── resume.html     # Printable CV (single A4 page)
│   ├── resume.css      # Print-first stylesheet
│   └── resume.pdf      # Generated from resume.html
├── assets/
│   └── images/
│       └── favicon.svg
└── vercel.json         # Static deploy config (root = site root)
```

## Run the tests

No install step — the suite uses Node's built-in runner (`node:test`), so it needs nothing
beyond Node 22+.

```bash
npm test          # or: node --test
```

`tests/core.test.js` covers the pure logic in `lib/core.js` (field validators, scroll-spy
section maths). `tests/markup.test.js` guards the contract between `script.js` and the page:
unique ids, every id the script queries, nav anchors resolving to real sections, the module
script tag, https-only outbound links, and the shipped CV PDF.

Browser behaviour that cannot be unit tested without a DOM — reveal animation, mobile menu,
scroll-spy class toggling, form error styling — is verified by loading the page, not by the
suite.

## Regenerate the CV PDF

```bash
cd resume
chromium-browser --headless --no-sandbox --no-pdf-header-footer \
  --print-to-pdf=resume.pdf resume.html
```

The CSS is print-first: one A4 page, a margin rail for dates and repository links, and no
scripts, so the PDF stays text-selectable for applicant tracking systems.

## Run locally

Any static server works. For example:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to Vercel

The repo root is the site root, so Vercel deploys the static files as-is:

1. Import the repository on [vercel.com](https://vercel.com).
2. Framework preset: **Other** — no build command, no output directory (see `vercel.json`).
3. Deploy.

## Notes

- No backend is connected yet, so the contact form validates inputs client-side only
  and does not send email; the form note points visitors to the real address.
- All outbound links (GitHub, LinkedIn, live Brew build) resolve to real destinations.
- StudyStash and Drape have no public repository yet, so their cards offer the APK demo on
  request instead of a dead link.