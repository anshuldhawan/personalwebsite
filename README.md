# anshuldhawan.com

Personal website. Static site hosted on GitHub Pages.

Built with React (via CDN) and served directly from this repo — no build step.

The mouse-responsive 3D terrain background is enabled by default on every page.
The dependency-free renderer rests when the pointer stops and shows a static
view on touch devices or when reduced motion is preferred. If the renderer
cannot load, the site remains usable with its plain background.

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
