# shrayio

Personal portfolio site. Plain static HTML/CSS/JS with no build step.

- `index.html` — content (experience and project cards, sidebar)
- `styles.css` — design tokens at the top, then layout and components
- `script.js` — sidebar highlighting and scroll reveal
- `assets/shots/` — 1280×800 WebP screenshots used in the card frames

## Run locally

```sh
python -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Any static host works (GitHub Pages, Cloudflare Pages, Netlify, Vercel). Serve the repository root.
