# Fonts

Self-hosted variable fonts (latin subset, woff2), loaded with `next/font/local`.
They are committed instead of fetched from Google at build time so CI and Vercel
builds are deterministic and need no network access to a font CDN.

| File | Family | Axes | Source | License |
|---|---|---|---|---|
| `SchibstedGrotesk-Variable.woff2` | Schibsted Grotesk | wght 400-900 | Google Fonts (latin) | SIL OFL 1.1 |
| `Anybody-Variable.woff2` | Anybody | wdth 50-150, wght 100-900 | Google Fonts (latin) | SIL OFL 1.1 |
| `BigShouldersDisplay-Variable.woff2` | Big Shoulders Display | wght 100-900 | Google Fonts (latin) | SIL OFL 1.1 |

Notes

- Google Fonts merged "Big Shoulders Display" into "Big Shoulders" (with an `opsz`
  axis), so `next/font/google` cannot load the Display name. Google's CSS API still
  serves the Display cut, which is the file used here.
- Only the winning display face is loaded site-wide (`app/fonts/display.ts`). The
  other candidate is loaded only by the internal proof sheet (`app/proof/`).
- To refresh a file: request the Google Fonts CSS2 API with a modern browser
  user-agent, take the `/* latin */` block's `.woff2` URL.
