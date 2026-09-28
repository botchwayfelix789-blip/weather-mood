# Weather Mood Page 🌤️

Search a city and the entire page re-themes to match the sky — sunny is bright and warm, rain is calm and blue, night brings out the stars.

Built with **plain HTML, CSS, and vanilla JavaScript** — no build step and **no API key to configure**.

## Features
- **City search** with live geocoding.
- **Live weather** — temperature, "feels like", humidity, wind, and local time.
- **Background & theme change based on conditions** — 7 mood palettes driven by WMO weather codes, with an animated sun, drifting clouds, rain, and stars.

## Live API
Uses **[Open-Meteo](https://open-meteo.com)** — a free weather API that needs **no API key**, so the hosted link works instantly for anyone who opens it.
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Forecast: `https://api.open-meteo.com/v1/forecast`

## Run locally
Serve over HTTP (so the `fetch` calls work — opening the file directly with `file://` won't run the API requests):

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Or: `npx serve .`

## Deploy
No build step, so hosting is drag-and-drop:
- **Netlify** — drag this folder onto <https://app.netlify.com/drop>.
- **Vercel** — run `vercel` in this folder (framework preset: *Other*, no build command).
- **GitHub Pages** — push this folder as a repo and enable Pages on `main`.

## Files
| File | Purpose |
|------|---------|
| `index.html` | Markup and page structure |
| `styles.css` | Styling + the 7 mood palettes and scene animations |
| `app.js` | Search, API calls, and condition → mood mapping |
