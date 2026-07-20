# YSLAS — site documentation (`.html` build)

> **This folder is the `.html` build.** Internal links are relative and keep
> their extension (`about.html`), so it deploys anywhere with no pretty-URL
> support and no redirect rules. The sibling `yslas/` folder is the clean-slug
> build (`/about`) for use once the custom domain is connected; §6a there
> describes that setup. Everything else below applies to both builds.


Hand-coded static rebuild of yslas.music, migrated off Squarespace.

## Table of contents

1. [Quick recipes](#1-quick-recipes)
   - [1.1 Change a menu or footer link](#11-change-a-menu-or-footer-link)
   - [1.2 Edit page text](#12-edit-page-text)
   - [1.3 Swap an image](#13-swap-an-image)
   - [1.4 Add a new page](#14-add-a-new-page)
   - [1.5 Link the EPK in the menu (when ready)](#15-link-the-epk-in-the-menu-when-ready)
   - [1.6 Fill in the LISTEN / WATCH buttons](#16-fill-in-the-listen--watch-buttons)
   - [1.7 Change colors or fonts](#17-change-colors-or-fonts)
   - [1.8 Change the SoundCloud track on the EPK](#18-change-the-soundcloud-track-on-the-epk)
   - [1.9 Replace the background video](#19-replace-the-background-video)
   - [1.10 Change the newest release](#110-change-the-newest-release-home-new-section)
   - [1.11 Deploy](#111-deploy)
2. [How the site is organized](#2-how-the-site-is-organized)
3. [Page anatomy](#3-page-anatomy)
   - [3.1 Header and mobile menu](#31-header-and-mobile-menu)
   - [3.2 Home](#32-home)
   - [3.3 About](#33-about)
   - [3.4 Sonics and Visuals](#34-sonics-and-visuals)
   - [3.5 EPK (unlisted)](#35-epk-unlisted)
   - [3.6 Footer](#36-footer)
4. [The fluid grid](#4-the-fluid-grid)
5. [Config reference](#5-config-reference)
6. [Troubleshooting](#6-troubleshooting)
7. [Changelog](#7-changelog)

---

## 1. Quick recipes

### 1.1 Change a menu or footer link

1. Open `js/site.js`.
2. Edit `MENU_LINKS` (top of the file) for the header, or `FOOTER_LINKS_LEFT`
   / `FOOTER_LINKS_RIGHT` for the footer. Each entry is `['LABEL', 'destination']`.
3. Destinations that start with `http` open in a new tab; anything else is a
   page of this site (e.g. `'about.html'`).
4. Save — every page updates, including the mobile burger menu.

### 1.2 Edit page text

1. Open the page's `.html` file (bio lives in **both** `about.html` and
   `epk.html` — the EPK repeats it on purpose; edit both if it changes).
2. Find the paragraph and edit it in place. Use `&rsquo;` for apostrophes to
   match the original typography.

### 1.3 Swap an image

1. Drop the new file into `assets/img/`.
2. Update the `src` in the page's `.html` (or the `url(...)` in
   `css/style.css` for the two background images: hero and "NEW" section).

### 1.4 Add a new page

1. Copy `about.html` to `newpage.html` (files keep their `.html` extension —
   only the *links* are clean, see §6a).
2. Change `<title>` and replace the `<section>` content.
3. Keep the empty `<header class="site-header">` / `<footer class="site-foot">`
   shells and the `<script src="js/site.js">` line — they auto-fill.
4. To put it in the menu, add `['NEWPAGE', 'newpage']` to `MENU_LINKS`
   in `js/site.js` — `cleanHref()` turns that into `newpage.html` for you.

### 1.5 Link the EPK in the menu (when ready)

1. Open `js/site.js`.
2. Add `['EPK', 'epk'],` to `MENU_LINKS`.
3. Optionally remove the `<meta name="robots" content="noindex">` line from
   `epk.html` so search engines may index it.

### 1.6 Fill in the LISTEN / WATCH buttons

1. Open `sonics.html` (LISTEN) or `visuals.html` (WATCH).
2. Put the destination URL in the `href=""` of the `<a class="btn split-btn">`.
   (They are empty because the original site's buttons point nowhere yet.)

### 1.7 Change colors or fonts

1. Open `css/style.css`.
2. The whole palette is the HSL triplet variables at the top of `:root`
   (`--black-hsl`, `--white-hsl`, `--accent-hsl`, …) — see §5.
3. Fonts are the `@font-face` blocks + `--body-font` / `--heading-font`.
   Font files live in `assets/fonts/`.

### 1.8 Add or change a SoundCloud embed on the EPK

The EPK has a two-column audio block (`<div class="epk-audio">`): **Tracks**
(three) on the left, **Mixes** on the right. All embeds are the same fixed
height (160 px, set once in `css/style.css`).

1. To add one, copy an existing `<iframe>` inside the column you want and swap
   the track URL in its `src`. The URL is percent-encoded after `?url=` —
   e.g. `https://soundcloud.com/alkabil-audio/uno` becomes
   `https%3A%2F%2Fsoundcloud.com%2Falkabil-audio%2Funo`.
2. Order on the page is just DOM order — reorder the `<iframe>` tags to
   reorder the list.
3. Keep `&amp;` (not a bare `&`) between URL parameters so the HTML stays valid.
4. To change every embed's height at once, edit `.epk-audio iframe { height }`.

### 1.9 Replace the background video

The About and EPK pages play a muted, looping background video
(`assets/video/yatik-bg.mp4`) with a still poster
(`assets/video/yatik-bg-poster.jpg`) shown until it loads.

1. Keep it **small** so the site stays snappy — target ~2 MB. The current clip
   is a 12-second, 640-px-wide, audio-stripped H.264 MP4 (~1.9 MB).
2. To re-encode a source with ffmpeg (trim example: start 4 s, length 12 s):
   ```
   ffmpeg -ss 4 -i SOURCE.mp4 -t 12 -an -vf "scale=640:-2,fps=24" \
     -c:v libx264 -pix_fmt yuv420p -crf 31 -preset slow -movflags +faststart \
     assets/video/yatik-bg.mp4
   ```
   `-an` drops audio (a background video must be silent to autoplay).
3. Refresh the poster from the first frame:
   ```
   ffmpeg -ss 4 -i SOURCE.mp4 -frames:v 1 -vf "scale=640:-2" -q:v 4 \
     assets/video/yatik-bg-poster.jpg
   ```
4. Keep the same filenames and both pages pick it up automatically. To put the
   video on another page, copy the `<video class="bg-video">` block and wrap
   that page's content in `<section class="video-hero">` (see §3.3 / §3.5).

### 1.10 Change the newest release (home "NEW" section)

1. Drop the new cover art into `assets/img/` (square, ~1000 px is plenty —
   keep it well under a megabyte so the home page stays fast).
2. In `index.html`, inside `<div class="release-cover">`, update the `<img>`
   `src`/`alt` and the `<a href="...">` to point at the new release.
3. Nothing else to touch — the hover grow, shadow and sizing are all in
   `.release-cover` in `css/style.css`. To change how much it grows, edit
   `--cover-hover-scale` (`1` = no grow).

### 1.11 Deploy

1. Push the whole folder to a GitHub repo (or drag into Netlify).
2. Keep `.nojekyll` at the root — without it GitHub Pages runs Jekyll and can
   silently drop files (inner pages 404). Check it survived the upload:
   dotfiles are often hidden in file pickers.
3. No build step: the repo root **is** the site root.

---

## 2. How the site is organized

```
yslas/
├── index.html          # home — hero wordmark, crystal gallery, NEW/COMING SOON
├── about.html          # bio page
├── sonics.html         # "coming soon" page, image left / text right
├── visuals.html        # same, mirrored (image right)
├── epk.html            # UNLISTED press kit — not in the menu, noindex
├── css/
│   └── style.css       # all styling: fonts, palette vars, per-page grids
├── js/
│   └── site.js         # menu + footer config, burger menu, hero text fitter
├── assets/
│   ├── img/            # all images (originals pulled from the Squarespace CDN)
│   ├── video/          # background loop (yatik-bg.mp4) + poster (yatik-bg-poster.jpg)
│   └── fonts/          # IBM Plex Mono 600/700 (+italics), Lilita One 400 (woff2, latin)
├── .nojekyll           # keeps GitHub Pages from running Jekyll (do not delete)
├── LICENSE             # proprietary, source-available (same text as sibling projects)
├── README.md           # 30-second overview
└── DOCUMENTATION.md    # this file
```

## 3. Page anatomy

### 3.1 Header and mobile menu

Every page has an **empty** `<header class="site-header">`; `js/site.js`
injects a `.header-inner` holding: burger button (mobile only) · nav links
(ABOUT / SONICS / VISUALS) · centered YSLAS title (links home) · Instagram icon.

**The bar is persistent — `position: fixed`, always visible, on mobile and
desktop.** It starts fully clear and its dark tint + blur fade in once the page
is scrolled past `HEADER_SHOW_AFTER` (40 px), fading back out at the very top;
`js/site.js` only toggles the `.scrolled` class and CSS does the fading. This is
the same mechanic as the sibling alkabil site.

Because white-on-cream would be invisible, pages that **open on a light
section** carry `<body class="light-top">` (Sonics, Visuals): their nav is dark
while the bar is clear, turning white once the tint arrives. Pages opening on a
dark backdrop (home hero, the video-backed About/EPK) keep white text plus a
soft drop shadow for legibility over bright patches.

Under 760 px the nav collapses into the burger, which opens a full-screen dark
menu. **That menu is appended to `<body>`, not nested in the header** — once
scrolled, the header has a `backdrop-filter`, and a filtered ancestor becomes
the containing block for `position: fixed` children, which would stop the
overlay covering the viewport. Open state is `body.menu-open`.

### 3.1a Cream text box, pill button, background video (shared pieces)

- **Cream text box** (`.text-box`) — body copy over the video sits in a warm
  off-white box (`--white`, `--box-radius` corners). Used for the bio on About
  and EPK and the little "more logos" label.
- **Pill button** (`.btn`) — solid dark fill, cream text, fully rounded
  (`border-radius: 999px`). Used for LISTEN / WATCH / download assets.
- **Background video** (`.video-hero` + `.bg-video`) — a muted, looping,
  autoplaying MP4 (`assets/video/yatik-bg.mp4`) sits behind the content on
  About and EPK with **no tint or overlay** — just the raw video. A poster
  image paints first. The header padding on `.hero-inner` clears the fixed
  header. See recipe 1.9 to swap the clip.
- **Static / film-grain overlay** (`.grain`) — the animated noise over the home
  hero image. Same mechanic as the sibling alkabil site: a procedural inline
  SVG `feTurbulence` pattern (no image asset) that jitters on a 4-step loop and
  blends with `mix-blend-mode: overlay`. It sits above the background and below
  the content, is `inset: -8%` so the jitter never exposes an edge, and it
  honours `prefers-reduced-motion`. Drop `<div class="grain"></div>` as the
  first child of any positioned section to use it; tune `opacity` for strength
  and the animation duration for how busy it reads.

### 3.1c Concentric-ring parallax

`.parallax` is the pointer-driven effect on the home crystal gallery, ported
from the alkabil site's hero. `js/site.js` redraws each host as concentric bands
— an inner disc plus rings radiating outward — with every band holding its own
copy of the image, masked to its ring by an inline `radial-gradient`. Each band
shifts with the pointer (touch on mobile): the inner disc moves at `baseShift`,
each ring outward adds `shiftPerRing`, so the motion speeds up and the image
grows more disjointed toward the edge. At rest all shifts are 0 and the image is
whole again.

Every `.parallax` element gets its **own instance**, tracking the pointer
relative to its own bounding box — which is why the two gallery images react
independently. Ring counts are recomputed on resize (debounced 200 ms).

To use it: `<div class="parallax" data-img="path/to.jpg"><img src="path/to.jpg"
alt="…"></div>`. The inner `<img>` is the **fallback** — it is what shows if JS
is off or the visitor prefers reduced motion, since the script bails before
touching the host. Tunables live in the `PARALLAX` config at the bottom of
`js/site.js` (see §5).

### 3.1b Release cover (grow + shadow)

`.release-cover` is the linked album cover on the home **NEW** section, carried
over from the alkabil site. The image has a soft drop shadow and scales up
slightly on hover, with both shadow and scale eased over 0.45 s. The hover is
bound to the wrapper rather than the `<a>`, so it still works if the cover is
ever left unlinked. Grow amount is the `--cover-hover-scale` variable (§5), and
the effect is disabled under `prefers-reduced-motion`.

### 3.2 Home

Three sections:

1. **Hero** (`.hero`) — 100 vh, background `yslas-main-graficc-bitmap.jpg`,
   with an animated **static/grain overlay** (`.grain`, see §3.1a) on top of
   it. The YSLAS wordmark is IBM Plex Mono scaled by `fitScaledText()` in
   `site.js` to always span 66 % of the viewport width (this reproduces
   Squarespace's "scaled text" block); it is absolutely positioned at
   **75 % down** the hero — centred horizontally, below centre vertically.
2. **Crystal gallery** (`.gallery-2`) — two square bitmap graphics side by
   side, **full bleed with no gaps or padding**, stacking on mobile. Each one is
   its own **concentric-ring parallax** host (see §3.1c) and reacts to the
   pointer independently.
3. **NEW** (`.home-new`) — centred column over `yslas-light-bitmap.jpg`: the
   "NEW" headline and the newest release cover, which links out to the release
   and grows slightly on hover (see §3.1b and recipe 1.10). The cover is the
   page's featured element, so it runs wide (up to 920 px).

### 3.3 About

A `.video-hero` section (looping video background, no overlay) holding a CSS
grid (`.about-layout`): `/// \\\` heading, the bio in a cream `.text-box`
(left), the live headshot (right), `\\\ ///` closing heading. **Desktop:** box
left, square headshot right. **Mobile (≤760 px):** everything stacks in one
column — `/// \\\`, box, `\\\ ///`, then the headshot as a wide 16∶9 rectangle
(the image is placed last in the DOM so it lands at the bottom on mobile).

### 3.4 Sonics and Visuals

Mirrored twins (`.split`, Visuals adds `.flip`) on a plain light background —
**no video here**. Square crystal artwork on one side; "COMING SOON", `///`,
and a pill button (LISTEN / WATCH, href empty for now — see recipe 1.6) on the
other. Sonics is image-left; Visuals is image-right. Stacks on mobile.

### 3.5 EPK (unlisted)

Not linked anywhere in the menu; share the URL directly. Carries
`<meta name="robots" content="noindex">`. Same `.video-hero` background as
About. Top-to-bottom: white YSLAS logo · a portrait unit (`.epk-portrait`:
`/// \\\`, bio in a cream box, `\\\ ///`, and the headshot) · "more logos"
cream label · three logo variants (crystal-dark / dark / crystal) on their own
cream panel · a two-column **Tracks / Mixes** audio block (`.epk-audio`) ·
**download assets** pill (Google Drive) · photo credits · then a full-bleed
responsive live-photo gallery (`.epk-gallery`) and the footer.
**Mobile:** the headshot is first in the `.epk-portrait` DOM so it appears at
the top (just under the logo), as a 16∶9 rectangle; the text box starts its
copy right at the top edge (no empty gap).

### 3.6 Footer

Empty `<footer class="site-foot">` shell filled by `site.js`, on a warm
dark-brown bar (`--brown` = `--dark-accent-hsl`) with cream text:
left — `info@alkabil.audio` and a link to alkabil.audio; right — IG /
VIMEO (coming soon) / SOUNDCLOUD stacked vertically. (The original also had an
invisible link to a not-yet-existing `/link` page; dropped here until that
page exists.)

## 4. Layout notes

Nothing here uses Squarespace's 24-column "fluid engine" any more — the last
holdout was the home "NEW" section, and it is now a simple centred flex column.
(The old `.fluid` helper and its `--cell` variable were removed with it.)

**About / EPK / Sonics / Visuals** were rebuilt with simple, purpose-built CSS
grids/flex (`.about-layout`, `.epk-portrait`, `.split`) rather than the 24-cell
grid — cleaner to reason about and easier to keep responsive. The one trick
worth knowing: to make an image appear in a *different* stacking order on
mobile than its desktop position, it is placed explicitly by grid coordinates
on desktop while its **DOM order** is chosen for the mobile stack (About puts
the headshot last → bottom on mobile; EPK puts it first → top on mobile).

## 5. Config reference

| Setting | Where | Default | What it does |
|---|---|---|---|
| `MENU_LINKS` | js/site.js | ABOUT, SONICS, VISUALS | header + burger nav (EPK intentionally absent) |
| `SITE_TITLE` | js/site.js | `YSLAS` | centered header wordmark, links home |
| `MENU_ICONS` | js/site.js | Instagram | icon links, right side of header |
| `FOOTER_EMAIL` | js/site.js | info@alkabil.audio | big line, footer left |
| `FOOTER_LINKS_LEFT` | js/site.js | alkabil.audio | links under the email |
| `FOOTER_LINKS_RIGHT` | js/site.js | IG / VIMEO / SOUNDCLOUD | links, footer right |
| `--black-hsl` | css/style.css | `30, 12.5%, 18.82%` | warm brown-black (dark sections, header) |
| `--white-hsl` | css/style.css | `42, 35.71%, 94.51%` | warm off-white (light sections, text on dark) |
| `--accent-hsl` | css/style.css | `30.73, 22.65%, 64.51%` | taupe accent (kept for future use) |
| `--dark-accent-hsl` / `--brown` | css/style.css | `32.5, 16%, 29.41%` | warm mid-brown — the footer bar |
| `--pad` | css/style.css | `6vw` | side padding of every section |
| `--header-h` | css/style.css | `72px` | header height (video-hero top padding + mobile menu offset use it) |
| `--box-radius` | css/style.css | `3px` | corner radius of cream text boxes |
| `--cover-hover-scale` | css/style.css | `1.04` | how much the release cover grows on hover (`1` = no grow) |
| `.grain { opacity }` | css/style.css | `0.82` | strength of the hero static overlay |
| `--wordmark-top` | css/style.css | `75%` | how far down the hero the YSLAS wordmark sits (`50%` = dead centre) |
| `--wordmark-width` | css/style.css | `33%` desktop / `66%` mobile | width the wordmark is fitted to — **this is the size dial**: halve it to halve the type |
| `HEADER_SHOW_AFTER` | js/site.js | `40` | px scrolled before the header tints in |
| `header.scrolled { background }` | css/style.css | `hsla(--black-hsl, 0.72)` | how solid the scrolled bar is (`0` = clear … `1` = solid) |
| `PARALLAX.innerDiv` | js/site.js | `8.8` | inner-disc radius = host's larger side / this |
| `PARALLAX.ringDiv` | js/site.js | `15` | each ring's width = host's larger side / this |
| `PARALLAX.baseShift` | js/site.js | `10` | px the inner disc shifts at full pointer deflection |
| `PARALLAX.shiftPerRing` | js/site.js | `7` | extra px each ring adds outward (radiating speed-up) |
| `PARALLAX.ease` | js/site.js | `0.09` | pointer-follow smoothing, 0–1 (smaller = laggier) |
| `PARALLAX.feather` | js/site.js | `0` | px soft edge on the ring masks (`0` = hard edges) |

## 6a. URLs in this build

Every internal link is **relative and keeps its `.html` extension** —
`about.html`, not `/about`. That is the whole point of this folder: it needs no
pretty-URL support, no redirect rules and no custom domain, so it works on a
bare GitHub Pages repo and straight off the file system.

- Links are built in one place: `cleanHref()` in `js/site.js` (§5). It accepts
  `about`, `about.html` or `/about` and always emits `about.html`, so you
  cannot break this by writing the wrong form in `MENU_LINKS`.
- Links are **relative**, not root-absolute, so the site also works when served
  from a subfolder (e.g. `user.github.io/repo/`) — a root-absolute `/about.html`
  would break there.
- There is deliberately **no `_redirects`** file here; it only applies to the
  clean-slug build.

### Switching to the clean-slug build later

Use the sibling `yslas/` folder once the custom domain is connected. It is the
same site with `cleanHref()` emitting `/about` and a Netlify `_redirects` file
that 301s the old `.html` URLs to the clean ones. Nothing else differs, so any
edit made here can be carried over by copying the changed file.

## 6. Troubleshooting

- **Inner pages 404 on GitHub Pages** → `.nojekyll` didn't make it into the
  repo (dotfiles get hidden in upload pickers). Re-add it.
- **Hero wordmark wrong size on first paint** → `fitScaledText()` runs again
  after fonts load (`document.fonts.ready`); if you add another scaled block,
  give it class `scaled-text` and it's handled automatically.
- **Menu/footer empty** → the page is missing the `<script src="js/site.js">`
  tag, or the shells lost their `site-header` / `site-foot` classes.
- **SoundCloud player blank locally** → some browsers block third-party
  iframes on `file://`; serve the folder over HTTP (`python -m http.server`)
  or check the deployed site.
- **Fonts not loading** → paths in `@font-face` are relative to `css/`, so
  the files must stay in `assets/fonts/`.
- **Background video not playing / not autoplaying** → it must be `muted` (it
  is) and small; browsers block autoplay of videos with audio. On `file://`
  some browsers also defer autoplay — check over HTTP or on the deployed site.
  The poster image shows until the clip is ready.

## 7. Changelog

### 2026-07-19 — clean URLs, parallax hit test

- **Clean slugs across the site:** internal links are now `/about`, `/sonics`,
  `/visuals`, `/epk` and `/` instead of `.html` paths. Files on disk keep their
  extensions; a new `cleanHref()` helper in `js/site.js` normalises every
  destination, so writing either form in `MENU_LINKS` works. Added `_redirects`
  with Netlify 301s from the old `.html` URLs. See §6a for host behaviour and
  the local-testing caveat.
- **Parallax bug:** an inactive image kept drifting vertically while the pointer
  was over its neighbour — the clamp pinned the horizontal axis to ±1 but the
  vertical axis kept tracking, since side-by-side images share a y-range. Each
  host now hit-tests the pointer and eases back to rest unless it is the one
  actually being hovered.

### 2026-07-19 — persistent header, gallery parallax

- **Header is now persistent:** `position: fixed` on every page, mobile and
  desktop, always visible. It stays fully clear at the top of the page and its
  dark tint + blur fade in past 40 px of scroll (`HEADER_SHOW_AFTER`), fading
  back out on return — the appear-on-scroll behaviour from the alkabil site.
  - Header markup now wraps in a `.header-inner`, so the legibility drop-shadow
    can be applied without the header becoming a containing block for fixed
    children.
  - The mobile menu moved from inside the header to a direct child of `<body>`,
    because the scrolled header's `backdrop-filter` would otherwise trap its
    fixed positioning and stop the overlay covering the screen. Open state moved
    from `.site-header.menu-open` to `body.menu-open`.
  - `<body class="solid-header">` (Sonics, Visuals) became
    `<body class="light-top">`: rather than a solid bar, those pages now get
    dark nav text while the bar is clear, matching alkabil's `on-light`. Their
    `.split` gained top padding to clear the now-fixed bar.
- **Home crystal gallery:** each of the two images is now its own
  concentric-ring pointer parallax (`.parallax`), ported from the alkabil hero —
  they react to the pointer independently. Plain `<img>` fallback retained for
  no-JS and `prefers-reduced-motion`. Tunables in the `PARALLAX` config.

### 2026-07-19 — hero wordmark sizing, larger release cover

- **Hero wordmark:** halved on desktop. Its size is now driven by the new
  `--wordmark-width` variable (`33%` desktop, `66%` mobile) — site.js fits the
  type to exactly that width, so halving the width halves the type. Position is
  now `--wordmark-top` (`75%`), applied at every breakpoint. `white-space:
  nowrap` guarantees it stays on one line at any viewport.
- **Release cover:** doubled to a 920 px max width (it is the featured element
  on the index), and re-exported at 1600 px so it stays sharp at that size and
  on high-DPI screens (~638 kB, up from 417 kB).
- **Release cover hover:** the cover no longer fades — it was inheriting the
  global `a:hover { opacity: 0.7 }`, now explicitly opted out. Grow and shadow
  are unchanged.

### 2026-07-19 — home page: static overlay, full-bleed gallery, release cover

- **Hero:** added the animated static/film-grain overlay (`.grain`) over the
  hero image — the same procedural SVG `feTurbulence` mechanic used on the
  sibling alkabil site, no image asset required. Respects
  `prefers-reduced-motion`.
- **Hero wordmark:** was vertically dead-centre; now absolutely positioned at
  75 % down so it sits below centre, matching the original.
- **Crystal gallery:** now full bleed — removed the `2vw` gap and padding (and
  the larger mobile ones) so the two graphics meet edge to edge.
- **NEW section:** replaced the crystal artwork + "COMING SOON" placeholder
  with the newest release cover (Yatik), linked to the release and carrying the
  hover-grow + drop-shadow mechanic ported from alkabil. Deliberately **no
  marquee** — just the cover, the effect and the link.
- Removed the last of the Squarespace fluid-grid scaffolding (`.fluid`,
  `--cell`) now that nothing uses it; added `--cover-hover-scale`.
- **Added asset:** `assets/img/yatik-cover.jpg` (downscaled from the alkabil
  2 k master to 1000 px / ~417 kB to keep the home page snappy).

### 2026-07-19 — wider desktop layout, EPK audio columns, gallery sizing

- **About + EPK:** widened the content column (`.hero-inner` max-width
  1500 → 1750 px) and bumped the cream text box to `1.2rem` on desktop only
  (scoped to `min-width: 761px`, so mobile keeps its 1rem size).
- **EPK audio:** replaced the single tall SoundCloud player with a two-column
  **Tracks / Mixes** block. Tracks are Bodegata, Uno, Yatik (top to bottom);
  Mixes keeps the existing set. Every embed is now a uniform 160 px tall
  (about a third of the old height); stacks to one column on mobile.
- **EPK logos:** the three logo variants now sit on a padded cream panel with a
  drop shadow on each mark, so the light logos read against it.
- **EPK gallery:** all 6 photos now fit one row on wide screens (~⅔ their
  previous size), stepping to 4 + 2 below 1500 px and 2 columns below 1000 px,
  which is the floor. Trailing photos keep their cell size and are never
  stretched.

### 2026-07-19 — layout rework: video background, cream boxes, pill buttons

- Added a muted, looping **background video** (`assets/video/yatik-bg.mp4`,
  ~1.9 MB, plus a poster JPG) behind the **About** and **EPK** pages only, with
  no tint/overlay. Encoded from "Yatik Redux" (trimmed 4–16 s, audio removed,
  downscaled to 640 px) for a snappy load.
- Bio copy now sits in a **cream text box** (`.text-box`) over the video;
  buttons became solid **dark pills** (`.btn`, LISTEN / WATCH / download assets).
- Rebuilt About/EPK/Sonics/Visuals on purpose-built CSS grids instead of the
  24-cell fluid grid. Headshot now reflows to a **16∶9 rectangle** on mobile
  (bottom on About, top on EPK); EPK text box no longer has an empty gap above
  its copy on mobile.
- EPK live-photo gallery changed from 3 columns to **2 columns**.
- **Footer** restyled to a warm dark-brown bar with cream text and the social
  links stacked vertically (was a white bar).
- Added `assets/video/`; new var `--brown` / `--box-radius`; `--pad` widened to
  `6vw`.

### 2026-07-19 — initial rebuild

- Cloned yslas.music off Squarespace as a hand-coded static site: `index.html`,
  `about.html`, `sonics.html`, `visuals.html`, plus unlisted `epk.html`
  (kept out of the menu on request; direct URL only, noindex).
- All 18 images and 5 font files (IBM Plex Mono 600/700 + italics, Lilita One
  400) pulled from the Squarespace CDN and self-hosted in `assets/`.
- Layout rebuilt on a 24-column square-cell grid using the block coordinates
  extracted from the original's fluid-engine CSS; palette and type scale
  copied from the original's theme variables.
- Centralized menu/footer/burger in `js/site.js` (edit-once pattern), added
  `README.md`, this file, `LICENSE` (copied from sibling project, holder set
  to YSLAS), and `.nojekyll`.
- Known intentional gaps, matching the original: LISTEN/WATCH buttons have
  empty hrefs; footer VIMEO link is a placeholder; the original's hidden
  `/link` footer anchor (a 404 on the live site) was dropped.
