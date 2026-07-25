# YSLAS — yslas.music

Hand-coded static rebuild of the YSLAS website (DJ/VJ duo — BESO GNARLY and
Vicki Outlaw), migrated off Squarespace. Plain HTML/CSS/JS, no build step, no
frameworks — ready to drop into a GitHub repo and deploy on any static host.

## Pages

- `index.html` — home: full-screen hero wordmark with animated static overlay,
  full-bleed crystal gallery, and the newest release cover under "NEW"
- `about.html` — bio
- `sonics.html` — SoundCloud tracks and the current release, over video
- `visuals.html` — mirror of Sonics; still "coming soon", with the finished
  block written and commented out in the file, ready to switch on
- `epk.html` — electronic press kit (**unlisted**: not in the menu, direct URL only)
- `404.html` — not-found page

## Tech in one paragraph

Every page is an empty-shell `<header>` / `<footer>` filled in by
[js/site.js](js/site.js) — menu links, footer links, and the mobile burger menu
are all edited **once** there and change everywhere. Theming (warm off-white /
brown-black, IBM Plex Mono + Lilita One, self-hosted) lives in
[css/style.css](css/style.css). Every content page — About, Sonics, Visuals and
the EPK — plays its own muted, looping background video behind cream text
boxes, and the crystal artwork reacts to the pointer with a concentric-ring
parallax effect. Images, fonts, and video are all local in `assets/`.

See [DOCUMENTATION.md](DOCUMENTATION.md) for quick recipes (edit the menu,
change text, add a page, deploy) and the full file-by-file tour.
