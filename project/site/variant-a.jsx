// Variant A — CRT Arcade (dark, neon-green accent, scanlines, monospace + serif)
// Readability-first: body in serif at 16-17px on near-black.
// Effects: scanlines, vignette, subtle screen-flicker, cursor sparks.
//
// Routing: window.PAGE is set per-HTML-shell to { type: 'home'|'project'|'writing', slug?: string }.
// Default (no PAGE) = home.

const VA_CSS = `
  .va-root{
    width:100%; min-height:100vh; position:relative;
    background:#0b0d0a; color:#e6efe1;
    font-family: 'Source Serif Pro', 'Source Serif 4', Georgia, serif;
    font-size:16.5px; line-height:1.65;
    -webkit-font-smoothing:antialiased;
  }
  .va-mono{ font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; }
  .va-scanlines::before{
    content:''; position:absolute; inset:0; pointer-events:none; z-index:3;
    background: repeating-linear-gradient(
      to bottom,
      rgba(255,255,255,0.025) 0px,
      rgba(255,255,255,0.025) 1px,
      transparent 1px, transparent 3px
    );
    mix-blend-mode: overlay;
  }
  .va-vignette::after{
    content:''; position:absolute; inset:0; pointer-events:none; z-index:4;
    background: radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%);
  }
  .va-flicker{ animation: vaflick 6s steps(1) infinite; }
  @keyframes vaflick{
    0%,97%,100%{ opacity:1 } 97.5%{ opacity:.93 } 98%{ opacity:1 } 98.5%{ opacity:.96 }
  }
  .va-nav{
    position:sticky; top:0; z-index:10;
    backdrop-filter: blur(6px);
    background: rgba(11,13,10,0.72);
    border-bottom:1px solid rgba(124,242,160,0.18);
  }
  .va-tab{
    background:none; border:none; cursor:pointer;
    color:#7a8a76; padding:10px 4px; margin-right:22px;
    font-family: 'JetBrains Mono', monospace; font-size:12px; letter-spacing:.08em;
    text-transform:uppercase; position:relative; transition:color .15s;
    text-decoration:none; display:inline-block;
  }
  .va-tab:hover{ color:#e6efe1; }
  .va-tab.on{ color:#7cf2a0; }
  .va-tab.on::after{
    content:''; position:absolute; left:0; right:0; bottom:-1px; height:2px;
    background:#7cf2a0; box-shadow:0 0 8px rgba(124,242,160,0.6);
  }
  .va-nav-inner{
    width:100%; max-width:760px; box-sizing:border-box;
    margin:0 auto; padding:14px 56px;
    display:flex; align-items:center; gap:24px;
  }
  .va-nav-inner .va-tab{ margin-right:0; }
  .va-brand{ margin-right:auto; }
  .va-acc{ color:#7cf2a0; }
  .va-h1{ font-family:'JetBrains Mono', monospace; font-weight:500; font-size:36px; letter-spacing:-0.01em; line-height:1.1; margin:0; color:#f1f7ec; }
  .va-h2{ font-family:'JetBrains Mono', monospace; font-weight:500; font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:#7cf2a0; margin:0 0 18px; }
  .va-card{
    border:1px solid rgba(124,242,160,0.14);
    background: linear-gradient(180deg, rgba(124,242,160,0.03), rgba(124,242,160,0.0));
    padding:22px 24px; border-radius:4px; transition: border-color .2s, transform .2s;
    position:relative;
    text-decoration:none; color:inherit; display:block;
  }
  .va-card:hover{ border-color: rgba(124,242,160,0.35); }
  .va-writing-card{ display:flex; gap:18px; align-items:flex-start; }
  .va-writing-thumb{
    flex:0 0 104px; width:104px; aspect-ratio:1 / 1;
    border-radius:3px; overflow:hidden;
  }
  .va-writing-thumb img{ width:100%; height:100%; object-fit:cover; display:block; }
  .va-writing-body{ flex:1 1 auto; min-width:0; }
  @media (max-width: 600px){
    .va-writing-card{ flex-direction:column; gap:14px; }
    .va-writing-thumb{ width:100%; flex:0 0 auto; aspect-ratio:16 / 9; }
  }
  .va-card .corner{ position:absolute; width:8px; height:8px; border-color:#7cf2a0; }
  .va-corner-tl{ top:-1px; left:-1px; border-top:1px solid; border-left:1px solid; }
  .va-corner-br{ bottom:-1px; right:-1px; border-bottom:1px solid; border-right:1px solid; }
  .va-link{ color:#e6efe1; text-decoration:none; border-bottom:1px solid rgba(124,242,160,0.4); transition:color .15s, border-color .15s; }
  .va-link:hover{ color:#7cf2a0; border-color:#7cf2a0; }
  .va-link-row{ display:flex; gap:14px; flex-wrap:wrap; align-items:center; }
  .va-patent-link{
    display:inline-flex; align-items:center; justify-content:center;
    min-height:42px; padding:0 16px; box-sizing:border-box;
    border:1px solid rgba(124,242,160,0.78);
    border-bottom-color:rgba(124,242,160,0.78);
    border-radius:4px;
    background:rgba(124,242,160,0.14);
    color:#7cf2a0;
    box-shadow:0 0 18px rgba(124,242,160,0.14), inset 0 0 16px rgba(124,242,160,0.06);
    text-decoration:none;
  }
  .va-patent-link:hover{
    color:#0b0d0a; background:#7cf2a0; border-color:#7cf2a0;
    box-shadow:0 0 24px rgba(124,242,160,0.34);
  }
  .va-cursor{ display:inline-block; width:9px; height:1.05em; background:#7cf2a0; vertical-align:-2px; margin-left:4px; animation:vablink 1s steps(2) infinite; }
  @keyframes vablink{ 50%{ opacity:0 } }
  .va-media{
    background:#0e120c;
    border:1px solid rgba(124,242,160,0.18); border-radius:3px;
    overflow:hidden; position:relative;
  }
  .va-media img, .va-media video{
    width:100%; height:100%; object-fit:contain; display:block;
  }
  .va-pixel-divider{
    height:6px; background-image: linear-gradient(to right, #7cf2a0 50%, transparent 50%);
    background-size: 6px 6px; opacity:.35;
  }
  .va-meta{ font-family:'JetBrains Mono', monospace; font-size:11px; letter-spacing:.06em; color:#7a8a76; text-transform:uppercase; }
  .va-prose p{ margin:0 0 14px; color:#cfd8c9; }
  .va-prose h2{
    font-family:'JetBrains Mono', monospace; font-size:20px; line-height:1.25;
    font-weight:500; color:#f1f7ec; margin:34px 0 14px;
  }
  .va-prose h3{
    font-family:'JetBrains Mono', monospace; font-size:15px; line-height:1.35;
    font-weight:500; color:#7cf2a0; margin:26px 0 10px;
  }
  .va-prose ol, .va-prose ul{ margin:0 0 18px 20px; padding:0; color:#cfd8c9; }
  .va-prose li{ margin:0 0 12px; padding-left:4px; }
  .va-prose a{ color:#e6efe1; text-decoration:none; border-bottom:1px solid rgba(124,242,160,0.4); }
  .va-prose a:hover{ color:#7cf2a0; border-color:#7cf2a0; }
  .va-caption{
    margin:-18px 0 28px; color:#7a8a76; font-family:'JetBrains Mono', monospace;
    font-size:11px; letter-spacing:.06em; text-transform:uppercase;
  }
  .va-caption a{ color:#cfd8c9; text-decoration:none; border-bottom:1px solid rgba(124,242,160,0.35); }
  .va-caption a:hover{ color:#7cf2a0; border-color:#7cf2a0; }
  .va-row{ display:flex; gap:16px; flex-wrap:wrap; }
  .va-stack > * + *{ margin-top:18px; }
  .va-grid{ display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
  @media (max-width: 720px){ .va-grid{ grid-template-columns: 1fr; } }
  .va-logo-grid{
    display:flex; flex-wrap:wrap; gap:12px;
  }
  .va-logo-tile{
    width:58px; height:58px; min-width:0; box-sizing:border-box;
    border:1px solid rgba(124,242,160,0.14);
    background:rgba(230,239,225,0.025);
    border-radius:4px; padding:10px;
    display:flex; align-items:center; justify-content:center;
    text-decoration:none; color:inherit;
    transition:border-color .15s, background .15s;
  }
  .va-logo-tile:hover{ border-color:rgba(124,242,160,0.35); background:rgba(124,242,160,0.04); }
  .va-logo-mark{
    width:36px; height:36px; flex:0 0 36px;
    border:1px solid rgba(124,242,160,0.22);
    border-radius:4px; background:#e6efe1;
    display:flex; align-items:center; justify-content:center;
    overflow:hidden; color:#0b0d0a; position:relative;
    font-family:'JetBrains Mono', monospace; font-size:11px; font-weight:500;
  }
  .va-logo-mark img{ width:100%; height:100%; object-fit:contain; display:block; padding:4px; box-sizing:border-box; background:#e6efe1; position:relative; z-index:1; }
  .va-logo-fallback{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
  .va-logo-name{ position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; }
  .va-section{ width:100%; box-sizing:border-box; padding:56px 56px 24px; max-width:760px; margin:0 auto; }
  .va-bracket{ color:#7cf2a0; font-family:'JetBrains Mono', monospace; }
  .va-back{
    font-family:'JetBrains Mono', monospace; font-size:12px; letter-spacing:.08em;
    text-transform:uppercase; color:#7a8a76; text-decoration:none;
    border-bottom:1px solid transparent; transition:color .15s, border-color .15s;
  }
  .va-back:hover{ color:#7cf2a0; border-color:rgba(124,242,160,0.4); }
  .va-detail-title{
    font-family:'JetBrains Mono', monospace; font-weight:500;
    font-size:32px; line-height:1.15; letter-spacing:-0.01em;
    color:#f1f7ec; margin:0 0 12px;
  }
  @media (max-width: 600px){
    .va-nav-inner{ padding:14px 24px; gap:14px 22px; flex-wrap:wrap; }
    .va-brand{ flex:1 0 100%; margin-right:0; }
    .va-section{ padding:40px 24px 24px; }
    .va-detail-title{ font-size:26px; }
  }
`;

const VideoOnView = ({ src, poster }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const playPromise = el.play();
          if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
        } else {
          el.pause();
        }
      });
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" />
  );
};

const ProjectMedia = ({ media, style }) => {
  if (!media) return null;
  const containerStyle = { ...(media.aspect ? { aspectRatio: media.aspect } : { aspectRatio: '16 / 9' }), ...style };
  if (media.type === 'image') {
    return (
      <div className="va-media" style={containerStyle}>
        <img src={media.src} alt={media.alt || ''} loading="lazy" />
      </div>
    );
  }
  if (media.type === 'video') {
    return (
      <div className="va-media" style={containerStyle}>
        <VideoOnView src={media.src} poster={media.poster} />
      </div>
    );
  }
  return null;
};

const AboutParagraph = ({ block }) => {
  if (typeof block === 'string') return <p>{block}</p>;
  if (!block || typeof block !== 'object') return null;
  return (
    <p>
      {block.text}
      {block.link && <a href={block.link.href}>{block.link.label}</a>}
      {block.after}
      {block.secondLink && <a href={block.secondLink.href}>{block.secondLink.label}</a>}
      {block.secondAfter}
    </p>
  );
};

// Nav: on home, tabs are buttons (in-page state). On detail pages, tabs are anchors to /#tab.
const Nav = ({ activeTab, onTabClick }) => {
  const tabs = ['home','projects','writings','about'];
  const isHome = typeof onTabClick === 'function';
  return (
    <nav className="va-nav">
      <div className="va-nav-inner">
        <a href="/" className="va-tab va-brand" style={{ color:'#e6efe1', fontSize:13, textDecoration:'none' }}>
          <span className="va-acc">▌</span> ANSHUL.DHAWAN
        </a>
        {tabs.map(t => (
          isHome
            ? <button key={t} className={`va-tab ${activeTab===t?'on':''}`} onClick={() => onTabClick(t)}>{t}</button>
            : <a key={t} className="va-tab" href={t === 'home' ? '/' : `/#${t}`}>{t}</a>
        ))}
      </div>
    </nav>
  );
};

// ----- Home view -----

function HomeView() {
  const data = window.SITE_DATA;
  const validTabs = ['home','projects','writings','about'];
  const [tab, setTab] = React.useState(() => {
    const hash = (typeof location !== 'undefined' && location.hash || '').slice(1);
    return validTabs.includes(hash) ? hash : 'home';
  });

  React.useEffect(() => {
    const onHashChange = () => {
      const hash = (location.hash || '').slice(1);
      if (validTabs.includes(hash)) setTab(hash);
      else if (!hash) setTab('home');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleTabClick = (t) => {
    setTab(t);
    // Keep URL hash in sync so the user can copy-share the active section.
    if (typeof history !== 'undefined' && history.replaceState) {
      history.replaceState(null, '', t === 'home' ? location.pathname : `#${t}`);
    }
  };

  return (
    <>
      <Nav activeTab={tab} onTabClick={handleTabClick} />

      <div className="va-flicker" style={{ position:'relative', zIndex:1 }}>

      {tab === 'home' && (
        <section className="va-section" style={{ paddingTop:96, paddingBottom:80 }}>
          <h1 className="va-h1" style={{ fontSize:44, marginBottom:14 }}>
            Anshul Dhawan<span className="va-cursor" />
          </h1>
          <p style={{ fontSize:19, color:'#cfd8c9', maxWidth:580, margin:'0 0 28px' }}>
            Generalist and game developer. I work on <span className="va-acc">product, growth, analytics</span>, and <span className="va-acc">AI</span> — usually where game or software are trying to do something new.
          </p>
          <div style={{ display:'flex', gap:18, flexWrap:'wrap', marginBottom:8 }}>
            {data.links.map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="va-link va-mono" style={{ fontSize:12, letterSpacing:'.08em', textTransform:'uppercase' }}>
                {l.label} ↗
              </a>
            ))}
          </div>

          <div className="va-pixel-divider" style={{ margin:'40px 0 24px' }} />
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:18 }}>
            <h2 className="va-h2" style={{ margin:0 }}>// projects</h2>
            <button onClick={() => handleTabClick('projects')} className="va-link va-mono" style={{ background:'none', border:'none', cursor:'pointer', fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', padding:0 }}>
              all {data.projects.length} →
            </button>
          </div>
          <div className="va-stack">
            {data.projects.map(p => (
              <a key={p.slug} href={`/projects/${p.slug}/`} className="va-card">
                <span className="corner va-corner-tl" /><span className="corner va-corner-br" />
                <div style={{ display:'flex', justifyContent:'space-between', gap:16, alignItems:'baseline', marginBottom:6, flexWrap:'wrap' }}>
                  <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:18, fontWeight:500, color:'#f1f7ec', lineHeight:1.3, flex:'1 1 auto' }}>
                    <span className="va-bracket">▸</span> {p.title}
                  </span>
                  {p.year && <span className="va-meta" style={{ flex:'0 0 auto' }}>{p.year}</span>}
                </div>
                <div className="va-meta" style={{ marginBottom:8 }}>{p.role} · {p.tag}</div>
                <p style={{ margin:0, color:'#cfd8c9', fontSize:15 }}>{p.blurb}</p>
              </a>
            ))}
          </div>

          <div className="va-pixel-divider" style={{ margin:'40px 0 24px' }} />
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:18 }}>
            <h2 className="va-h2" style={{ margin:0 }}>// writings</h2>
            <button onClick={() => handleTabClick('writings')} className="va-link va-mono" style={{ background:'none', border:'none', cursor:'pointer', fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', padding:0 }}>
              all {data.writings.length} →
            </button>
          </div>
          <div className="va-stack">
            {data.writings.map(w => (
              <a key={w.slug} href={`/writings/${w.slug}/`} className="va-card">
                <span className="corner va-corner-tl" /><span className="corner va-corner-br" />
                <div className="va-meta" style={{ marginBottom:6 }}>{w.date}</div>
                <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:18, fontWeight:500, color:'#f1f7ec', marginBottom:6 }}>{w.title}</div>
                <p style={{ margin:0, color:'#cfd8c9', fontSize:15 }}>{w.blurb}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {tab === 'projects' && (
        <section className="va-section" style={{ paddingTop:64, paddingBottom:80 }}>
          <h2 className="va-h2">// projects</h2>
          <div className="va-stack">
            {data.projects.map(p => (
              <a key={p.slug} href={`/projects/${p.slug}/`} className="va-card">
                <span className="corner va-corner-tl" /><span className="corner va-corner-br" />
                <div style={{ display:'flex', justifyContent:'space-between', gap:16, alignItems:'baseline', marginBottom:6, flexWrap:'wrap' }}>
                  <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:20, fontWeight:500, color:'#f1f7ec', lineHeight:1.3, flex:'1 1 auto' }}>
                    <span className="va-bracket">▸</span> {p.title}
                  </span>
                  {p.year && <span className="va-meta" style={{ flex:'0 0 auto' }}>{p.year}</span>}
                </div>
                <div className="va-meta" style={{ marginBottom:10 }}>{p.role} · {p.tag}</div>
                <p style={{ margin:'0 0 14px', color:'#cfd8c9' }}>{p.blurb}</p>
                <ProjectMedia media={p.media} style={{ marginBottom:0 }} />
              </a>
            ))}
          </div>
        </section>
      )}

      {tab === 'writings' && (
        <section className="va-section" style={{ paddingTop:64, paddingBottom:80 }}>
          <h2 className="va-h2">// writings</h2>
          <div className="va-stack">
            {data.writings.map(w => {
              const hero = (w.images || []).find(img => img.kind === 'hero');
              return (
                <a key={w.slug} href={`/writings/${w.slug}/`} className="va-card va-writing-card">
                  <span className="corner va-corner-tl" /><span className="corner va-corner-br" />
                  {hero && (
                    <div className="va-writing-thumb va-media">
                      <img src={hero.src} alt={hero.alt || ''} loading="lazy" />
                    </div>
                  )}
                  <div className="va-writing-body">
                    <div className="va-meta" style={{ marginBottom:8 }}>{w.date}</div>
                    <h3 style={{ margin:'0 0 8px', fontSize:20, fontFamily:"'JetBrains Mono', monospace", fontWeight:500, color:'#f1f7ec' }}>{w.title}</h3>
                    <p style={{ margin:0, color:'#cfd8c9' }}>{w.blurb}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {tab === 'about' && (
        <section className="va-section" style={{ paddingTop:64, paddingBottom:80 }}>
          <h2 className="va-h2">// about</h2>
          <div className="va-prose" style={{ fontSize:18 }}>
            {data.about.map((p, i) => <AboutParagraph key={i} block={p} />)}
          </div>
          {data.companyLogos && data.companyLogos.length > 0 && (
            <>
              <div className="va-pixel-divider" style={{ margin:'32px 0 18px' }} />
              <div className="va-logo-grid">
                {data.companyLogos.map(company => {
                  const initials = company.name.split(/\s+/).map(word => word[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <a key={company.name} href={company.href} target="_blank" rel="noreferrer" className="va-logo-tile" aria-label={`${company.name} website`}>
                      <span className="va-logo-mark" aria-hidden="true">
                        <span className="va-logo-fallback">{initials}</span>
                        <img
                          src={company.logo}
                          alt=""
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none';
                          }}
                        />
                      </span>
                      <span className="va-logo-name">{company.name}</span>
                    </a>
                  );
                })}
              </div>
            </>
          )}
          <div className="va-pixel-divider" style={{ margin:'32px 0' }} />
          <div className="va-meta" style={{ marginBottom:10 }}>// elsewhere</div>
          <div style={{ display:'flex', gap:18, flexWrap:'wrap' }}>
            {data.links.map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="va-link va-mono" style={{ fontSize:13 }}>
                {l.label} ↗
              </a>
            ))}
          </div>
        </section>
      )}

      </div>
    </>
  );
}

// ----- Project detail view -----

function ProjectDetail({ project }) {
  const paragraphs = (project.content && project.content.length > 0) ? project.content : [project.blurb];
  React.useEffect(() => {
    document.title = `${project.title} · Anshul Dhawan`;
  }, [project.title]);

  return (
    <>
      <Nav />
      <div className="va-flicker" style={{ position:'relative', zIndex:1 }}>
        <section className="va-section" style={{ paddingTop:64, paddingBottom:80 }}>
          <a href="/#projects" className="va-back" style={{ display:'inline-block', marginBottom:32 }}>← all projects</a>

          <div style={{ display:'flex', justifyContent:'space-between', gap:16, alignItems:'baseline', flexWrap:'wrap', marginBottom:8 }}>
            <div className="va-meta">{project.tag}</div>
            {project.year && <div className="va-meta">{project.year}</div>}
          </div>

          <h1 className="va-detail-title">
            <span className="va-bracket">▸</span> {project.title}
          </h1>
          <div className="va-meta" style={{ marginBottom:28 }}>{project.role}</div>

          <ProjectMedia media={project.media} style={{ marginBottom:32 }} />

          <div className="va-prose" style={{ fontSize:17 }}>
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {project.links && project.links.length > 0 && (
            <>
              <div className="va-pixel-divider" style={{ margin:'32px 0 20px' }} />
              <div className="va-link-row">
                {project.links.map(l => (
                  <a
                    key={l.label}
                    className={`${l.label.toLowerCase() === 'patent' ? 'va-patent-link' : 'va-link'} va-mono`}
                    style={{ fontSize:12, letterSpacing:'.06em', textTransform:'uppercase' }}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {l.label.toLowerCase() === 'patent' ? 'View patent' : l.label} ↗
                  </a>
                ))}
              </div>
            </>
          )}

          <div className="va-pixel-divider" style={{ margin:'40px 0 20px' }} />
          <a href="/#projects" className="va-back">← all projects</a>
        </section>
      </div>
    </>
  );
}

// ----- Writing detail view -----

function WritingBlock({ block }) {
  if (typeof block === 'string') return <p>{block}</p>;
  if (!block || typeof block !== 'object') return null;

  if (block.type === 'heading') return <h2>{block.text}</h2>;
  if (block.type === 'subheading') return <h3>{block.text}</h3>;
  if (block.type === 'orderedList' || block.type === 'unorderedList') {
    const ListTag = block.type === 'orderedList' ? 'ol' : 'ul';
    return (
      <ListTag>
        {(block.items || []).map((item, i) => (
          <li key={i}>
            {typeof item === 'string'
              ? item
              : (
                <>
                  {item.title && <strong>{item.title}: </strong>}
                  {item.text}
                </>
              )}
          </li>
        ))}
      </ListTag>
    );
  }
  if (block.type === 'linkList') {
    return (
      <ul>
        {(block.items || []).map((item) => (
          <li key={item.href || item.label}>
            <a href={item.href} target="_blank" rel="noreferrer">{item.label}</a>
          </li>
        ))}
      </ul>
    );
  }

  return <p>{block.text || ''}</p>;
}

function WritingDetail({ writing }) {
  const paragraphs = (writing.content && writing.content.length > 0) ? writing.content : [writing.blurb];
  const images = writing.images || [];
  const heroImage = images.find((image) => image.kind === 'hero');
  const inlineImages = images.filter((image) => image.kind !== 'hero' && Number.isInteger(image.after));
  React.useEffect(() => {
    document.title = `${writing.title} · Anshul Dhawan`;
  }, [writing.title]);

  return (
    <>
      <Nav />
      <div className="va-flicker" style={{ position:'relative', zIndex:1 }}>
        <section className="va-section" style={{ paddingTop:64, paddingBottom:80 }}>
          <a href="/#writings" className="va-back" style={{ display:'inline-block', marginBottom:32 }}>← all writings</a>

          <div className="va-meta" style={{ marginBottom:10 }}>{writing.date}</div>
          <h1 className="va-detail-title">{writing.title}</h1>

          <div className="va-pixel-divider" style={{ margin:'28px 0 24px' }} />

          {heroImage && (
            <>
              <ProjectMedia media={{ type:'image', ...heroImage }} style={{ marginBottom:30 }} />
              {heroImage.credit && (
                <div className="va-caption">
                  <a href={heroImage.credit.href} target="_blank" rel="noreferrer">{heroImage.credit.label}</a>
                </div>
              )}
            </>
          )}

          <div className="va-prose" style={{ fontSize:17 }}>
            {paragraphs.map((p, i) => (
              <React.Fragment key={i}>
                <WritingBlock block={p} />
                {inlineImages.filter((image) => image.after === i).map((image) => (
                  <ProjectMedia key={image.src} media={{ type:'image', ...image }} style={{ margin:'26px 0 28px' }} />
                ))}
              </React.Fragment>
            ))}
          </div>

          <div className="va-pixel-divider" style={{ margin:'40px 0 20px' }} />
          <a href="/#writings" className="va-back">← all writings</a>
        </section>
      </div>
    </>
  );
}

// ----- Not-found view (unknown slug) -----

function NotFound({ kind }) {
  return (
    <>
      <Nav />
      <div className="va-flicker" style={{ position:'relative', zIndex:1 }}>
        <section className="va-section" style={{ paddingTop:96, paddingBottom:80 }}>
          <div className="va-meta" style={{ marginBottom:10 }}>// 404</div>
          <h1 className="va-detail-title">{kind === 'writing' ? 'Writing' : 'Project'} not found</h1>
          <p style={{ color:'#cfd8c9', marginBottom:24 }}>That URL doesn't match anything I have on file.</p>
          <a href="/" className="va-back">← back home</a>
        </section>
      </div>
    </>
  );
}

// ----- Top-level dispatch -----

function VariantA() {
  const containerRef = React.useRef(null);
  const data = window.SITE_DATA;
  const page = window.PAGE || { type: 'home' };

  let body;
  if (page.type === 'project') {
    const project = data.projects.find(p => p.slug === page.slug);
    body = project ? <ProjectDetail project={project} /> : <NotFound kind="project" />;
  } else if (page.type === 'writing') {
    const writing = data.writings.find(w => w.slug === page.slug);
    body = writing ? <WritingDetail writing={writing} /> : <NotFound kind="writing" />;
  } else {
    body = <HomeView />;
  }

  return (
    <div ref={containerRef} className="va-root va-scanlines va-vignette">
      <style>{VA_CSS}</style>
      {window.CursorTrail && <window.CursorTrail variant="spark" color="#7cf2a0" />}
      {body}
    </div>
  );
}

window.VariantA = VariantA;
