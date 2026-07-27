# Fitness Buddy

A personal, equipment-aware training companion. Single-file web app — no build step, no backend,
no accounts. Everything you enter stays in your own browser's `localStorage`.

## Install on your phone

1. Open the app URL in Chrome (Android) or Safari (iPhone)
2. **Android:** menu → *Install app* / *Add to Home screen*
   **iPhone:** Share → *Add to Home Screen*
3. It launches full-screen with its own icon and works offline

## Your data

Stored locally in your browser under `fitnessBuddy.v1`. It is never uploaded anywhere.

Because it is tied to the browser and the site's address, it does **not** transfer between
devices, and clearing site data will erase it. Use **Export** in the app to save a backup file,
and **Import** to restore it — including when moving to a new phone.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The entire app |
| `index-v2.html` | Design-polish draft, kept feature-synced |
| `manifest.json` | PWA metadata (name, icons, standalone display) |
| `sw.js` | Service worker — offline caching and installability |
| `icon-*.png`, `icon.svg` | App icons |
