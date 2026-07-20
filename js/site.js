/* shared: menu, footer, burger, hero scaled text, image parallax
   — edit HERE, changes on every page */

/* ============ MENU — EDIT ONCE, CHANGES ON EVERY PAGE ============
   [label, destination]. Destinations starting with "http" are external and open
   in a new tab; anything else is a page of this site and is emitted as a CLEAN,
   root-absolute slug — "about" and "about.html" both become href="/about", and
   "", "/" or "index.html" all become "/". Because they are root-absolute the
   same link works from any folder depth.
   NOTE: the EPK is typically deliberately NOT in this menu — it is an
   unlisted press-kit page, reachable only by its direct URL (/epk). It's been added
   to the menu now. Remove from this list to remove access.*/
const MENU_LINKS = [
	['ABOUT', 'about'],
	['SONICS', 'sonics'],
	['VISUALS', 'visuals'],
	['EPK', 'epk']
];

/* site title shown in the header (links home) */
const SITE_TITLE = 'YSLAS';

/* icon links rendered on the right side of the header (inline SVG) */
const MENU_ICONS = [
	['Instagram', 'https://www.instagram.com/yslas.flac',
	 '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" stroke="none"/></svg>'],
];

/* ============ FOOTER — EDIT ONCE, CHANGES ON EVERY PAGE ============ */
const FOOTER_EMAIL = 'info@alkabil.audio';
const FOOTER_LINKS_LEFT = [
	['alkabil.audio', 'https://www.alkabil.audio'],
];
const FOOTER_LINKS_RIGHT = [
	['IG', 'https://www.instagram.com/yslas.flac'],
	['VIMEO (coming soon)', 'https://vimeo.com'],
	['SOUNDCLOUD', 'https://soundcloud.com/alkabil-audio'],
];

/* Turn a destination into a clean, root-absolute href. Accepts "about",
   "about.html" or "/about" and always emits "/about"; "", "/", "index" and
   "index.html" all collapse to "/". External URLs pass through untouched. */
function cleanHref(dest) {
	if (dest.startsWith('http')) return dest;
	const slug = dest.replace(/\.html$/, '').replace(/^\/+/, '');
	return (slug === '' || slug === 'index') ? '/' : '/' + slug;
}
function linkHTML(label, dest) {
	return dest.startsWith('http')
		? '<a href="' + dest + '" target="_blank" rel="noopener">' + label + '</a>'
		: '<a href="' + cleanHref(dest) + '">' + label + '</a>';
}

/* ============ HEADER SCROLL STATE ============
   The bar is FIXED on every page and always visible. It starts fully clear and
   its dark tint + blur fade in once scrolled past HEADER_SHOW_AFTER, fading
   back out at the very top (the CSS transition does the fading — this only
   toggles the class). Works the same on mobile and desktop.

   Pages that open on a LIGHT section carry <body class="light-top">, which
   flips the nav to dark text while the bar is still clear (white-on-cream would
   be invisible). Once tinted, the nav is white everywhere. */
const HEADER_SHOW_AFTER = 40;   // px scrolled before the bar tints in
function wireHeaderScroll(header) {
	const sync = () => header.classList.toggle('scrolled', window.scrollY > HEADER_SHOW_AFTER);
	sync();
	addEventListener('scroll', sync, { passive: true });
}

/* ---- header: nav left, site title centre, icons right, burger on mobile ---- */
document.querySelectorAll('header.site-header').forEach(header => {
	header.innerHTML =
		'<div class="header-inner">' +
			'<button class="burger" aria-label="Open menu" aria-expanded="false">' +
				'<span></span><span></span>' +
			'</button>' +
			'<nav class="header-nav">' +
				MENU_LINKS.map(([l, d]) => linkHTML(l, d)).join('') +
			'</nav>' +
			'<a class="site-title" href="' + cleanHref('') + '">' + SITE_TITLE + '</a>' +
			'<div class="header-icons">' +
				MENU_ICONS.map(([name, url, svg]) =>
					'<a href="' + url + '" target="_blank" rel="noopener" aria-label="' + name + '">' + svg + '</a>').join('') +
			'</div>' +
		'</div>';

	/* The mobile menu is appended to <body>, NOT nested in the header: once the
	   bar is scrolled it has a backdrop-filter, and a filtered ancestor becomes
	   the containing block for fixed children — which would stop the overlay
	   from covering the viewport. */
	const menu = document.createElement('nav');
	menu.className = 'mobile-menu';
	menu.innerHTML =
		MENU_LINKS.map(([l, d]) => linkHTML(l, d)).join('') +
		MENU_ICONS.map(([name, url, svg]) =>
			'<a href="' + url + '" target="_blank" rel="noopener" aria-label="' + name + '">' + svg + '</a>').join('');
	document.body.appendChild(menu);

	const burger = header.querySelector('.burger');
	const setOpen = (open) => {
		document.body.classList.toggle('menu-open', open);
		burger.setAttribute('aria-expanded', open ? 'true' : 'false');
	};
	burger.addEventListener('click', () => setOpen(!document.body.classList.contains('menu-open')));
	menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));

	wireHeaderScroll(header);
});

/* ---- footer: email + link left, social links stacked right ---- */
document.querySelectorAll('footer.site-foot').forEach(f => {
	f.innerHTML =
		'<div class="foot-left">' +
			'<p class="foot-email">' + FOOTER_EMAIL + '</p>' +
			'<p class="foot-links">' + FOOTER_LINKS_LEFT.map(([l, d]) => linkHTML(l, d)).join(' · ') + '</p>' +
		'</div>' +
		'<div class="foot-right">' +
			'<p class="foot-links">' + FOOTER_LINKS_RIGHT.map(([l, d]) => linkHTML(l, d)).join('') + '</p>' +
		'</div>';
});

/* ---- hero "YSLAS" scaled text: font-size fits the container width, like
        Squarespace's scaled-text block. Mono glyphs are ~0.6em wide. The
        container width is --wordmark-width in css/style.css — that is the
        size dial; this only fits the type to it, always on one line. ---- */
function fitScaledText() {
	document.querySelectorAll('.scaled-text').forEach(el => {
		const chars = (el.textContent || '').length || 1;
		el.style.fontSize = (el.clientWidth / (chars * 0.6)) + 'px';
	});
}
addEventListener('resize', fitScaledText);
document.fonts ? document.fonts.ready.then(fitScaledText) : fitScaledText();
fitScaledText();

/* ============ IMAGE PARALLAX (concentric rings) ============
   Ported from the alkabil site. Each `.parallax` element is redrawn as
   concentric bands — an inner disc plus rings radiating outward — every band
   holding its own copy of the image. Each band shifts with the pointer (touch
   on mobile): the inner disc moves at `baseShift`, each ring outward adds
   `shiftPerRing`, so motion speeds up and the image grows more disjointed
   toward the edge. At rest every shift is 0 and the image is whole again.

   Every `.parallax` gets its OWN instance, tracking the pointer relative to
   itself — so the two gallery images react independently.

   The plain <img> inside each host is the fallback: it is what shows if JS is
   off or the visitor prefers reduced motion (we bail before touching it). */
const PARALLAX = {
	innerDiv: 8.8,     // inner-disc radius = max(hostW, hostH) / innerDiv
	ringDiv: 15,       // each ring's width = max(hostW, hostH) / ringDiv
	baseShift: 10,     // px the inner disc shifts at full pointer deflection
	shiftPerRing: 7,   // extra px each ring adds outward (radiating speed-up)
	ease: 0.09,        // pointer-follow smoothing, 0–1 (smaller = laggier)
	feather: 0,        // px soft edge on the ring masks (0 = hard edges)
};
function buildParallax(host) {
	const imgUrl = host.dataset.img || '';
	if (!imgUrl) return;
	let rings = [];

	function build() {
		host.innerHTML = '';
		rings = [];
		const vw = host.clientWidth, vh = host.clientHeight;
		if (!vw || !vh) return;
		const maxDim = Math.max(vw, vh);
		const r0 = maxDim / PARALLAX.innerDiv;              // inner-disc radius
		const rw = maxDim / PARALLAX.ringDiv;               // outer-ring width
		const reach = Math.hypot(vw, vh) / 2 * 1.06;        // just past the corner
		const bands = 1 + Math.max(0, Math.ceil((reach - r0) / rw));
		const maxK = PARALLAX.baseShift + (bands - 1) * PARALLAX.shiftPerRing;
		const pad = maxK + 40;         // oversize the image so shifts don't reveal edges
		const f = PARALLAX.feather;
		for (let i = 0; i < bands; i++) {
			const rIn = i === 0 ? 0 : r0 + (i - 1) * rw;
			const rOut = i === 0 ? r0 : r0 + i * rw;
			const ring = document.createElement('div');
			ring.className = 'parallax-ring';
			const mask = 'radial-gradient(circle at 50% 50%, ' +
				(rIn > 0 ? 'transparent ' + (rIn - f) + 'px, #000 ' + (rIn + f) + 'px, ' : '#000 0, ') +
				'#000 ' + (rOut - f) + 'px, transparent ' + (rOut + f) + 'px)';
			ring.style.webkitMaskImage = mask;
			ring.style.maskImage = mask;
			const im = document.createElement('div');
			im.className = 'parallax-ring-img';
			im.style.backgroundImage = 'url("' + imgUrl + '")';
			im.style.inset = '-' + pad + 'px';
			ring.appendChild(im);
			host.appendChild(ring);
			rings.push({ im: im, k: PARALLAX.baseShift + i * PARALLAX.shiftPerRing });
		}
	}

	const clamp = (v) => Math.max(-1, Math.min(1, v));
	let tx = 0, ty = 0, cx = 0, cy = 0;   // pointer position, −1 … 1 on each axis
	/* Only the host the pointer is actually OVER reacts; anywhere else we target
	   0,0 so its rings ease back to rest. Without this hit test, an "inactive"
	   image still drifts: for two images side by side the horizontal axis clamps
	   to ±1 but the vertical one keeps tracking, since they share a y-range. */
	function point(px, py) {
		const r = host.getBoundingClientRect();
		const inside = px >= r.left && px <= r.right && py >= r.top && py <= r.bottom;
		if (!inside) { tx = 0; ty = 0; return; }
		tx = clamp(((px - r.left) / r.width - 0.5) * 2);
		ty = clamp(((py - r.top) / r.height - 0.5) * 2);
	}
	addEventListener('pointermove', (e) => point(e.clientX, e.clientY));
	addEventListener('touchmove', (e) => {
		const t = e.touches[0]; if (t) point(t.clientX, t.clientY);
	}, { passive: true });

	function frame() {
		cx += (tx - cx) * PARALLAX.ease;
		cy += (ty - cy) * PARALLAX.ease;
		for (let i = 0; i < rings.length; i++) {
			rings[i].im.style.transform =
				'translate(' + (cx * rings[i].k) + 'px,' + (cy * rings[i].k) + 'px)';
		}
		requestAnimationFrame(frame);
	}

	build();
	frame();
	let t;
	addEventListener('resize', () => { clearTimeout(t); t = setTimeout(build, 200); });
}
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
	document.querySelectorAll('.parallax').forEach(buildParallax);
}
