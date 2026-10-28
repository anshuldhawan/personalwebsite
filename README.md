# anshuldhawan.com

Personal website. Static site hosted on GitHub Pages.

Built with React (via CDN) and served directly from this repo — no build step.

The Xbox Labs-inspired ASCII background is enabled on every page. A small,
silent loop from the site's own game footage becomes a green character grid;
the mouse lights up fading phosphor trails, gently shifts the picture, and
clicking empty space sends a ripple through the characters. Content stays
readable above the effect. The dependency-free renderer runs at up to 24fps,
pauses in hidden tabs, and uses a static poster on touch devices, with reduced
motion, or with data saver enabled. Blocked autoplay and video errors also fall
back to the poster. If the renderer cannot load, the plain background remains.

## Analytics (Umami Cloud)

Every content HTML shell loads `project/site/analytics.js`, configured for the
`anshuldhawan.com` website in Umami Cloud. Redirects do not collect duplicate
pageviews. To connect a different Umami website:

1. Create a free Hobby account at https://cloud.umami.is and add
   `anshuldhawan.com` under Websites.
2. Open that website's Edit → Tracking code. Copy the `data-website-id` into
   `websiteId` in `project/site/analytics.js`. If the provided script URL differs,
   copy its `src` into `scriptUrl` too. The website ID is public; no API key is needed.
3. Deploy the changes through GitHub Pages, visit the live site, and check the
   Umami dashboard for a pageview and the events below.

Pageviews, referring websites, and UTM campaign parameters are automatic. Each
article/project URL appears separately in the Pages report. Contact links emit
`contact-email`, `contact-linkedin`, or `contact-x`. Project links emit
`project-demo-click` when their entry in `data.jsx` has `kind: 'demo'`; other
project links emit `project-link-click`. Both include the link label, and Umami
records the originating page. Manual plays of videos with controls emit
`project-demo-play` once per video element, with the video filename. Automatic
video previews do not emit play events.

Only `anshuldhawan.com` and `www.anshuldhawan.com` collect analytics; local previews
do not. Tracking failures must not prevent the website from working. Six months
of history are available on the free plan; pageviews, clicks, and additional
event properties count toward the monthly allowance.

For new blog/project HTML shells, include
`<script defer src="/project/site/analytics.js"></script>` in the head. Running
`node scripts/build-aeo.mjs` also ensures the script is present on all shells.

## Project articles

Roadster Jump is available at `/projects/roadster-canyon-jump/` and appears first
on the home and Projects views. Its imported article source is
`roadster-canyon-jump.md`; the rendered content and image placement are maintained
in `project/site/data.jsx`, following the existing project article format.

The poster and four illustrations live in `assets/posters/` and `assets/images/`.
The shader pipeline WebP was created with ImageGen; the other three diagrams are
editable SVGs. The diagrams visualize the supplied project specifications;
runtime timing estimates in the performance diagram are hardware dependent.

The standalone 3D lab is in `assets/embeds/roadster-car-viewer/`. It streams
Three.js modules, the GLB, and textures from `https://roadsterjump.anshuldhawan.com/`
and requires a network connection plus WebGPU or WebGL2. The article lazily loads
the iframe, checks its message source and origin before resizing, and provides a
standalone link. The lab displays a failure message if startup fails or times out.

After editing site content or the shared renderer, run `node scripts/build-aeo.mjs`.
This creates missing project/writing HTML shells, refreshes metadata, static text,
sitemap and LLM exports, and updates shared script URLs using content hashes.
Preview locally with `python3 -m http.server 8000`, then open
`http://localhost:8000/projects/roadster-canyon-jump/`. These commands do not publish.
