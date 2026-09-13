# Shadow Dev — Portfolio

Personal developer portfolio for **Shadow Dev** (Flutter Developer & Software Engineer).

Built with plain **HTML5, CSS3, and vanilla JavaScript** — no frameworks, no build step, no dependencies.

## Stack

- HTML5 with semantic landmarks and accessible navigation
- CSS3 custom properties, glassmorphism, dark futuristic theme
- Vanilla JavaScript: mobile menu, scroll spy, scroll reveal, form validation
- SEO: Open Graph, Twitter cards, JSON-LD structured data

## Structure

```
.
├── index.html         # All content and sections
├── style.css          # Design tokens, layout, components
├── script.js          # Interactivity (vanilla, no libraries)
├── assets/
│   └── images/
│       └── favicon.svg
└── vercel.json        # Static deploy config (root = site root)
```

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
  and does not send email. Placeholder links (LinkedIn, Email, project links) are marked
  "coming soon" until real URLs exist.