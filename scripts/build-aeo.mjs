// Writes crawler-readable copies of the site for search and answer engines.
// The site renders in the browser, and most AI crawlers do not run JavaScript,
// so this adds static text, meta tags, and JSON-LD to every HTML shell and
// writes llms.txt, llms-full.txt, sitemap.xml, and robots.txt.
//
// Run after editing project/site/data.jsx:  node scripts/build-aeo.mjs
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://anshuldhawan.com';
const PERSON_ID = `${SITE}/#person`;
const WEBSITE_ID = `${SITE}/#website`;

// data.jsx is plain JavaScript that assigns window.SITE_DATA.
const data = new Function('window', `${readFileSync(join(ROOT, 'project/site/data.jsx'), 'utf8')}\nreturn SITE_DATA;`)({});
const { profile } = data;
const today = new Date().toISOString().slice(0, 10);

const escapeHtml = value => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const absolute = path => (/^https?:/.test(path) ? path : `${SITE}${path}`);
const jsonLd = value => `<script type="application/ld+json">${JSON.stringify(value).replace(/</g, '\\u003c')}</script>`;
const monthOf = date => (date ? date.replace(/\s*·\s*/, '-') : undefined);
const yearOf = year => (year ? year.match(/\d{4}/)?.[0] : undefined);
const emailLink = data.links.find(link => link.href.startsWith('mailto:'));
const profileLinks = data.links.filter(link => link !== emailLink);

const aboutText = block => (typeof block === 'string' ? block : [
  block.text, block.link?.label, block.after, block.secondLink?.label, block.secondAfter,
].filter(Boolean).join(''));

// ----- Content blocks, shared by the HTML and Markdown renderers -----

function blocksToHtml(blocks) {
  return blocks.map(block => {
    if (typeof block === 'string') return `<p>${escapeHtml(block)}</p>`;
    switch (block.type) {
      case 'heading': return `<h2>${escapeHtml(block.text)}</h2>`;
      case 'subheading': return `<h3>${escapeHtml(block.text)}</h3>`;
      case 'leadParagraph': return `<p><strong>${escapeHtml(block.lead)}</strong> ${escapeHtml(block.text)}</p>`;
      case 'unorderedList':
      case 'orderedList': {
        const tag = block.type === 'orderedList' ? 'ol' : 'ul';
        const items = block.items.map(item => (typeof item === 'string'
          ? `<li>${escapeHtml(item)}</li>`
          : `<li><strong>${escapeHtml(item.title)}.</strong> ${escapeHtml(item.text)}</li>`));
        return `<${tag}>${items.join('')}</${tag}>`;
      }
      case 'linkList':
        return `<ul>${block.items.map(item => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`).join('')}</ul>`;
      case 'assetGrid':
        return `<ul>${block.items.map(item => `<li>${escapeHtml([item.label, item.description || item.alt].filter(Boolean).join(': '))}</li>`).join('')}</ul>`;
      case 'video': return block.caption ? `<p>Video: ${escapeHtml(block.caption)}</p>` : '';
      default: return block.text ? `<p>${escapeHtml(block.text)}</p>` : '';
    }
  }).filter(Boolean).join('\n');
}

function blocksToMarkdown(blocks) {
  return blocks.map(block => {
    if (typeof block === 'string') return block;
    switch (block.type) {
      case 'heading': return `### ${block.text}`;
      case 'subheading': return `#### ${block.text}`;
      case 'leadParagraph': return `**${block.lead}** ${block.text}`;
      case 'unorderedList':
      case 'orderedList':
        return block.items.map((item, i) => {
          const bullet = block.type === 'orderedList' ? `${i + 1}.` : '-';
          return typeof item === 'string' ? `${bullet} ${item}` : `${bullet} **${item.title}.** ${item.text}`;
        }).join('\n');
      case 'linkList': return block.items.map(item => `- [${item.label}](${item.href})`).join('\n');
      case 'assetGrid': return block.items.map(item => `- ${[item.label, item.description || item.alt].filter(Boolean).join(': ')}`).join('\n');
      case 'video': return block.caption ? `Video: ${block.caption}` : '';
      default: return block.text || '';
    }
  }).filter(Boolean).join('\n\n');
}

const wordCount = blocks => blocksToMarkdown(blocks).split(/\s+/).filter(Boolean).length;

// ----- Structured data -----

const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: data.name,
  url: `${SITE}/`,
  jobTitle: profile.headline,
  description: profile.summary,
  email: emailLink?.href,
  sameAs: profileLinks.map(link => link.href),
  knowsAbout: profile.expertise,
  hasOccupation: ['AI Generalist', 'Product Leader', 'Game Developer'].map(name => ({ '@type': 'Occupation', name })),
  worksFor: { '@id': `${SITE}/#playworlds` },
  award: 'Global Learning XPRIZE semi-finalist (2017)',
};
const organizations = [
  { '@type': 'Organization', '@id': `${SITE}/#playworlds`, name: 'PlayWorlds', description: 'An AI-native creation platform for kids.', founder: { '@id': PERSON_ID } },
  { '@type': 'Organization', '@id': `${SITE}/#social-pixels`, name: 'Social Pixels', description: 'An AI-native gaming studio.', founder: { '@id': PERSON_ID } },
  { '@type': 'Organization', '@id': `${SITE}/#equally`, name: 'Equally', description: 'An AI-powered AR learning platform.', founder: { '@id': PERSON_ID } },
];
const website = { '@type': 'WebSite', '@id': WEBSITE_ID, url: `${SITE}/`, name: data.name, inLanguage: 'en', publisher: { '@id': PERSON_ID } };

// ----- Page templates -----

const bylineHtml = `<p>By <a href="/">${escapeHtml(data.name)}</a>, ${escapeHtml(data.tagline.replace(' & ', ', and '))}.</p>`;

function headBlock({ title, description, path, type, image, graph, noindex }) {
  const url = absolute(path);
  const tags = [
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta name="author" content="${escapeHtml(data.name)}" />`,
    `<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-snippet:-1, max-image-preview:large'}" />`,
  ];
  if (!noindex) {
    tags.push(
      `<link rel="canonical" href="${url}" />`,
      `<meta property="og:site_name" content="${escapeHtml(data.name)}" />`,
      `<meta property="og:type" content="${type}" />`,
      `<meta property="og:title" content="${escapeHtml(title)}" />`,
      `<meta property="og:description" content="${escapeHtml(description)}" />`,
      `<meta property="og:url" content="${url}" />`,
      image ? `<meta property="og:image" content="${absolute(image)}" />` : '',
      `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />`,
      `<meta name="twitter:site" content="@AnshulDhawan001" />`,
      `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
      `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
      image ? `<meta name="twitter:image" content="${absolute(image)}" />` : '',
      jsonLd({ '@context': 'https://schema.org', '@graph': graph }),
    );
  }
  // The static copy stays off-screen while the app loads, then React replaces it.
  // Visitors without JavaScript get it as a plain readable page.
  tags.push(
    '<style>.aeo-static{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}</style>',
    '<noscript><style>.aeo-static{position:static;width:auto;height:auto;margin:0 auto;overflow:visible;clip:auto;white-space:normal;max-width:720px;padding:48px 24px;color:#e6efe1;line-height:1.65}.aeo-static a{color:#7cf2a0}</style></noscript>',
  );
  return tags.filter(Boolean).map(tag => `  ${tag}`).join('\n');
}

function homePage() {
  const title = `${data.name} — ${profile.headline}`;
  const body = [
    `<h1>${escapeHtml(data.name)} — ${escapeHtml(profile.headline)}</h1>`,
    `<p>${escapeHtml(profile.summary)}</p>`,
    '<h2>About</h2>',
    ...data.about.map(block => `<p>${escapeHtml(aboutText(block))}</p>`),
    '<h2>Expertise</h2>',
    `<ul>${profile.expertise.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`,
    '<h2>Quick answers</h2>',
    ...profile.faq.map(item => `<h3>${escapeHtml(item.q)}</h3>\n<p>${escapeHtml(item.a)}</p>`),
    '<h2>Projects</h2>',
    `<ul>${data.projects.map(p => `<li><a href="/projects/${p.slug}/">${escapeHtml(p.title)}</a> (${escapeHtml([p.role, p.year].filter(Boolean).join(', '))}): ${escapeHtml(p.blurb)}</li>`).join('')}</ul>`,
    '<h2>Writings</h2>',
    `<ul>${data.writings.map(w => `<li><a href="/writings/${w.slug}/">${escapeHtml(w.title)}</a> (${escapeHtml(monthOf(w.date))}): ${escapeHtml(w.blurb)}</li>`).join('')}</ul>`,
    '<h2>Talks</h2>',
    `<ul>${(data.talks || []).map(t => `<li><a href="${escapeHtml(t.href)}">${escapeHtml(t.title)}</a> (${escapeHtml(t.event)}, ${escapeHtml(t.company)}): ${escapeHtml(t.blurb)}</li>`).join('')}</ul>`,
    '<h2>Contact</h2>',
    `<ul>${data.links.map(l => `<li><a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a></li>`).join('')}</ul>`,
  ].join('\n');
  const graph = [
    person, website, ...organizations,
    { '@type': 'ProfilePage', '@id': `${SITE}/#profile`, url: `${SITE}/`, name: title, isPartOf: { '@id': WEBSITE_ID }, mainEntity: { '@id': PERSON_ID }, dateModified: today, inLanguage: 'en' },
  ];
  return { file: 'index.html', path: '/', title, head: headBlock({ title, description: profile.description, path: '/', type: 'profile', graph }), body };
}

function projectPage(project) {
  const path = `/projects/${project.slug}/`;
  const title = `${project.title} · ${data.name}`;
  const blocks = project.content?.length ? project.content : [project.blurb];
  const image = project.media?.poster || project.images?.[0]?.src;
  const description = `${project.blurb} A project by ${data.name}, ${data.tagline.replace(' & ', ', and ')}.`;
  const body = [
    `<h1>${escapeHtml(project.title)}</h1>`,
    bylineHtml,
    `<p>${escapeHtml([project.role, project.tag, project.year].filter(Boolean).join(' · '))}</p>`,
    blocksToHtml(blocks),
    project.links?.length ? `<ul>${project.links.map(l => `<li><a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a></li>`).join('')}</ul>` : '',
    `<p><a href="/">More projects and writing by ${escapeHtml(data.name)}</a></p>`,
  ].filter(Boolean).join('\n');
  const graph = [person, website, {
    '@type': 'CreativeWork', '@id': `${absolute(path)}#work`, url: absolute(path), name: project.title,
    headline: project.title, description: project.blurb, creator: { '@id': PERSON_ID }, author: { '@id': PERSON_ID },
    dateCreated: yearOf(project.year), keywords: project.tag, image: image && absolute(image),
    isPartOf: { '@id': WEBSITE_ID }, inLanguage: 'en',
  }];
  return { file: `projects/${project.slug}/index.html`, path, title, head: headBlock({ title, description, path, type: 'article', image, graph }), body };
}

function writingPage(writing) {
  const path = `/writings/${writing.slug}/`;
  const title = `${writing.title} · ${data.name}`;
  const blocks = writing.content?.length ? writing.content : [writing.blurb];
  const image = writing.images?.find(img => img.kind === 'hero')?.src || writing.images?.[0]?.src;
  const description = `${writing.blurb} An essay by ${data.name}, ${data.tagline.replace(' & ', ', and ')}.`;
  const body = [
    `<h1>${escapeHtml(writing.title)}</h1>`,
    bylineHtml,
    `<p>${escapeHtml([writing.category, monthOf(writing.date)].filter(Boolean).join(' · '))}</p>`,
    `<p><em>${escapeHtml(writing.blurb)}</em></p>`,
    blocksToHtml(blocks),
    `<p><a href="/">More writing by ${escapeHtml(data.name)}</a></p>`,
  ].join('\n');
  const graph = [person, website, {
    '@type': 'BlogPosting', '@id': `${absolute(path)}#article`, url: absolute(path), mainEntityOfPage: absolute(path),
    headline: writing.title, description: writing.blurb, author: { '@id': PERSON_ID }, publisher: { '@id': PERSON_ID },
    datePublished: monthOf(writing.date), articleSection: writing.category, wordCount: wordCount(blocks),
    image: image && absolute(image), isPartOf: { '@id': WEBSITE_ID }, inLanguage: 'en',
  }];
  return { file: `writings/${writing.slug}/index.html`, path, title, head: headBlock({ title, description, path, type: 'article', image, graph }), body };
}

// Shells whose slug is no longer in data.jsx render "not found"; keep them out of the index.
function orphanPages(section, known) {
  return readdirSync(join(ROOT, section), { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !known.has(entry.name) && existsSync(join(ROOT, section, entry.name, 'index.html')))
    .map(entry => ({
      file: `${section}/${entry.name}/index.html`,
      head: headBlock({ title: data.name, description: profile.description, path: `/${section}/${entry.name}/`, noindex: true }),
      body: `<p><a href="/">${escapeHtml(data.name)} — ${escapeHtml(profile.headline)}</a></p>`,
    }));
}

// ----- Write HTML shells -----

const pages = [homePage(), ...data.projects.map(projectPage), ...data.writings.map(writingPage)];
const orphans = [
  ...orphanPages('projects', new Set(data.projects.map(p => p.slug))),
  ...orphanPages('writings', new Set(data.writings.map(w => w.slug))),
];

for (const page of [...pages, ...orphans]) {
  const file = join(ROOT, page.file);
  if (!existsSync(file)) { console.warn(`skip: ${page.file} does not exist`); continue; }
  let html = readFileSync(file, 'utf8');
  if (page.title) html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
  html = html.replace(/\n  <!-- aeo:head -->[\s\S]*?<!-- \/aeo:head -->/, '');
  html = html.replace(/(<\/title>)/, `$1\n  <!-- aeo:head -->\n${page.head}\n  <!-- /aeo:head -->`);
  html = html.replace(/<div id="root">(?:<!-- aeo:body -->[\s\S]*?<!-- \/aeo:body -->)?<\/div>/,
    `<div id="root"><!-- aeo:body --><main class="aeo-static">\n${page.body}\n</main><!-- /aeo:body --></div>`);
  writeFileSync(file, html);
}

// ----- llms.txt, llms-full.txt, sitemap.xml, robots.txt -----

const llmsIndex = [
  `# ${data.name}`,
  `> ${profile.summary}`,
  `This is the personal website of ${data.name}, ${data.tagline.replace(' & ', ', and ')}. It collects his projects in AI-native games and products, his product leadership background, and his essays on AI, games, and philosophy.`,
  '## About',
  data.about.map(aboutText).join('\n\n'),
  '## Expertise',
  profile.expertise.map(item => `- ${item}`).join('\n'),
  '## Quick answers',
  profile.faq.map(item => `### ${item.q}\n\n${item.a}`).join('\n\n'),
  '## Projects',
  data.projects.map(p => `- [${p.title}](${SITE}/projects/${p.slug}/): ${p.blurb} (${[p.role, p.tag, p.year].filter(Boolean).join(' · ')})`).join('\n'),
  '## Writings',
  data.writings.map(w => `- [${w.title}](${SITE}/writings/${w.slug}/): ${w.blurb} (${[w.category, monthOf(w.date)].filter(Boolean).join(', ')})`).join('\n'),
  '## Talks',
  (data.talks || []).map(t => `- [${t.title}](${t.href}): ${t.event}, ${t.company}. ${t.blurb}`).join('\n'),
  '## Contact',
  data.links.map(l => `- [${l.label}](${l.href})`).join('\n'),
  '## Optional',
  `- [Full text of every project and essay](${SITE}/llms-full.txt)`,
].join('\n\n');

const llmsFull = [
  llmsIndex.replace(/\n\n## Optional[\s\S]*$/, ''),
  '# Projects',
  ...data.projects.map(p => [
    `## ${p.title}`,
    `URL: ${SITE}/projects/${p.slug}/`,
    `By ${data.name} · ${[p.role, p.tag, p.year].filter(Boolean).join(' · ')}`,
    blocksToMarkdown(p.content?.length ? p.content : [p.blurb]),
    p.links?.length ? p.links.map(l => `- [${l.label}](${l.href})`).join('\n') : '',
  ].filter(Boolean).join('\n\n')),
  '# Writings',
  ...data.writings.map(w => [
    `## ${w.title}`,
    `URL: ${SITE}/writings/${w.slug}/`,
    `By ${data.name} · ${[w.category, monthOf(w.date)].filter(Boolean).join(' · ')}`,
    `_${w.blurb}_`,
    blocksToMarkdown(w.content?.length ? w.content : []),
  ].filter(Boolean).join('\n\n')),
].join('\n\n');

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages.map(page => `  <url><loc>${absolute(page.path)}</loc><lastmod>${today}</lastmod></url>`),
  '</urlset>',
].join('\n');

const aiCrawlers = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot'];
const robots = [
  '# Search engines and AI assistants are welcome to read and cite this site.',
  ...aiCrawlers.map(agent => `User-agent: ${agent}\nAllow: /`),
  'User-agent: *\nAllow: /',
  `Sitemap: ${SITE}/sitemap.xml`,
].join('\n\n');

writeFileSync(join(ROOT, 'llms.txt'), `${llmsIndex}\n`);
writeFileSync(join(ROOT, 'llms-full.txt'), `${llmsFull}\n`);
writeFileSync(join(ROOT, 'sitemap.xml'), `${sitemap}\n`);
writeFileSync(join(ROOT, 'robots.txt'), `${robots}\n`);

console.log(`Updated ${pages.length} pages (${orphans.length} marked noindex), llms.txt, llms-full.txt, sitemap.xml, robots.txt.`);
