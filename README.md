# YSLAS — yslas.music (`.html` build)

> **Which folder am I in?** This is the **`.html` build**: every internal link
> points at `about.html`, `sonics.html`, etc. It works on any host, including a
> bare GitHub Pages repo with no custom domain, and even straight off the file
> system. **Ship this one for now.**
>
> The sibling `yslas/` folder is the **clean-slug build** (`/about`, no
> extension) plus a Netlify `_redirects` file — use that once the domain is
> connected. Keep edits in sync between the two, or make changes in one and
> re-copy.


Hand-coded static rebuild of the YSLAS website (DJ/VJ duo — BESO GNARLY and
Vicki Outlaw), migrated off Squarespace. Plain HTML/CSS/JS, no build step, no
frameworks — ready to drop into a GitHub repo and deploy on any static host.

## Pages

- `index.html` — home: full-screen hero wordmark with animated static overlay,
  full-bleed crystal gallery, and the newest release cover under "NEW"
- `about.html` — bio
- `sonics.html` / `visuals.html` — mirrored "coming soon" pages
- `epk.html` — electronic press kit (**unlisted**: not in the menu, direct URL only)

## Tech in one paragraph

Every page is an empty-shell `<header>` / `<footer>` filled in by
[js/site.js](js/site.js) — menu links, footer links, and the mobile burger menu
are all edited **once** there and change everywhere. Theming (warm off-white /
brown-black, IBM Plex Mono + Lilita One, self-hosted) lives in
[css/style.css](css/style.css). About and EPK play a muted, looping background
video (`assets/video/yatik-bg.mp4`) behind cream text boxes. Images, fonts, and
video are all local in `assets/`.

See [DOCUMENTATION.md](DOCUMENTATION.md) for quick recipes (edit the menu,
change text, add a page, deploy) and the full file-by-file tour.
