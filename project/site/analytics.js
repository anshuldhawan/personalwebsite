// Website ID from Umami Cloud → Websites → Edit → Tracking code.
// This is a public identifier, not an API key.
(function () {
  'use strict';

  const websiteId = '8e2f467b-9c15-457e-9fb9-58ef4829f00a';
  const scriptUrl = 'https://cloud.umami.is/script.js';
  const domains = ['anshuldhawan.com', 'www.anshuldhawan.com'];

  // Local previews should never contribute visits or clicks to live analytics.
  if (!domains.includes(window.location.hostname)) return;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(websiteId)) return;

  const script = document.createElement('script');
  script.src = scriptUrl;
  script.defer = true;
  script.dataset.websiteId = websiteId;
  script.dataset.domains = domains.join(',');
  script.dataset.excludeHash = 'true';
  document.head.appendChild(script);

  // Umami automatically records pageviews, referrers, and UTM campaigns.
  // Its delegated click listener also handles links rendered later by React.
})();
