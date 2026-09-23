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
  .va-world{ position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
  .va-world canvas{ display:block; width:100%; height:100%; }
  .va-world::after{
    content:''; position:absolute; inset:0;
    background:linear-gradient(90deg, transparent, rgba(7,14,12,.78) calc(50% - 330px), rgba(7,14,12,.88) 50%, rgba(7,14,12,.78) calc(50% + 330px), transparent);
  }
  .va-world-active .va-card{ background:rgba(9,20,16,.82); backdrop-filter:blur(8px); }
  .va-world-active .va-flicker{ animation:none; }
  @media (max-width:600px){
    .va-world::after{ background:rgba(7,14,12,.76); }
  }
  .va-mono{ font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; }
  .va-faq h3{ font-family:'JetBrains Mono', monospace; font-weight:500; font-size:15px; line-height:1.4; color:#f1f7ec; margin:0 0 8px; }
  .va-faq p{ margin:0 0 26px; color:#cfd8c9; }
  .va-faq > div:last-child p{ margin-bottom:0; }
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
  .va-writing-card{ display:flex; gap:18px; align-items:center; }
  .va-writing-thumb{
    flex:0 0 140px; width:140px; aspect-ratio:1 / 1;
    border-radius:3px; overflow:hidden;
  }
  .va-writing-thumb img{ width:100%; height:100%; object-fit:contain; display:block; }
  .va-writing-body{ flex:1 1 auto; min-width:0; }
  @media (max-width: 600px){
    .va-writing-card{ flex-direction:column; gap:14px; }
    .va-writing-thumb{ width:100%; flex:0 0 auto; }
  }
  .va-category-row{
    display:flex; gap:8px; flex-wrap:wrap; align-items:center;
    margin:0 0 18px;
  }
  .va-category-button{
    min-height:32px; padding:0 12px; border-radius:4px;
    border:1px solid rgba(124,242,160,0.22);
    background:rgba(230,239,225,0.025);
    color:#7a8a76; cursor:pointer;
    font-family:'JetBrains Mono', monospace; font-size:11px; letter-spacing:.08em;
    text-transform:uppercase;
  }
  .va-category-button:hover{ color:#e6efe1; border-color:rgba(124,242,160,0.4); }
  .va-category-button.on{
    color:#0b0d0a; background:#7cf2a0; border-color:#7cf2a0;
    box-shadow:0 0 16px rgba(124,242,160,0.22);
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
  .va-inline-media{ margin:24px 0 30px; }
  .va-inline-media .va-media{ margin:0; }
  .va-inline-media .va-caption{ margin:8px 0 0; }
  .va-asset-grid{
    display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:12px;
    margin:24px 0 30px;
  }
  .va-asset-grid.two-column{ grid-template-columns:repeat(2, minmax(0, 1fr)); }
  .va-asset-card{
    min-width:0; margin:0; overflow:hidden; align-self:start;
    border:1px solid rgba(124,242,160,0.18); border-radius:3px;
    background:linear-gradient(180deg, rgba(124,242,160,0.045), rgba(124,242,160,0.012));
  }
  .va-asset-visual{ width:100%; background:#0e120c; overflow:hidden; }
  .va-asset-visual img{ width:100%; height:100%; object-fit:contain; display:block; }
  .va-asset-card figcaption{
    padding:9px 11px; color:#7a8a76; font-family:'JetBrains Mono', monospace;
    font-size:10px; line-height:1.45; letter-spacing:.06em; text-transform:uppercase;
  }
  .va-asset-card.featured{
    grid-column:1 / -1; display:grid; grid-template-columns:minmax(0, .72fr) minmax(0, 1.28fr);
    align-items:center;
  }
  .va-asset-card.featured .va-asset-visual{ max-height:390px; }
  .va-asset-card.featured figcaption{ padding:24px; text-transform:none; letter-spacing:0; }
  .va-asset-title{
    display:block; margin-bottom:8px; color:#7cf2a0; font-size:12px;
    letter-spacing:.1em; text-transform:uppercase;
  }
  .va-asset-description{
    display:block; color:#cfd8c9; font-family:'Source Serif Pro', 'Source Serif 4', Georgia, serif;
    font-size:16px; line-height:1.6;
  }
  @media (max-width:600px){
    .va-asset-grid{ grid-template-columns:repeat(2, minmax(0, 1fr)); gap:10px; }
    .va-asset-grid.two-column{ grid-template-columns:1fr; }
    .va-asset-card.featured{ grid-template-columns:1fr; }
    .va-asset-card.featured .va-asset-visual{ max-height:360px; }
    .va-asset-card.featured figcaption{ padding:16px; }
  }
  .va-media-placeholder{
    min-height:210px; box-sizing:border-box; margin:24px 0 28px;
    border:1px dashed rgba(124,242,160,0.34); border-radius:4px;
    background:
      linear-gradient(rgba(124,242,160,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,242,160,0.025) 1px, transparent 1px),
      rgba(124,242,160,0.018);
    background-size:24px 24px;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    color:#7a8a76; text-align:center;
  }
  .va-media-placeholder-mark{ color:#7cf2a0; font-size:25px; margin-bottom:12px; text-shadow:0 0 14px rgba(124,242,160,.42); }
  .va-media-placeholder-label{ color:#cfd8c9; font-family:'JetBrains Mono', monospace; font-size:12px; letter-spacing:.12em; text-transform:uppercase; }
  .va-media-placeholder-note{ margin-top:5px; font-family:'JetBrains Mono', monospace; font-size:10px; letter-spacing:.1em; text-transform:uppercase; }
  .va-link-status{
    display:flex; align-items:center; justify-content:space-between; gap:18px;
    margin-top:28px; padding:16px 18px; border:1px solid rgba(124,242,160,0.2); border-radius:4px;
    background:rgba(124,242,160,0.025); font-family:'JetBrains Mono', monospace;
  }
  .va-link-status-label{ color:#e6efe1; font-size:12px; letter-spacing:.06em; text-transform:uppercase; }
  .va-link-status-note{ color:#7a8a76; font-size:10px; letter-spacing:.1em; text-transform:uppercase; white-space:nowrap; }
  .va-row{ display:flex; gap:16px; flex-wrap:wrap; }
  .va-stack > * + *{ margin-top:18px; }
  .va-grid{ display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
  @media (max-width: 720px){ .va-grid{ grid-template-columns: 1fr; } }
  .va-logo-grid{
    display:grid; grid-template-columns: repeat(4, 1fr); gap:16px;
  }
  .va-logo-tile{
    width:100%; aspect-ratio:1; min-width:0; box-sizing:border-box;
    border:1px solid rgba(124,242,160,0.14);
    background:rgba(230,239,225,0.025);
    border-radius:4px; padding:14px;
    display:flex; align-items:center; justify-content:center;
    text-decoration:none; color:inherit;
    transition:border-color .15s, background .15s;
  }
  .va-logo-tile:hover{ border-color:rgba(124,242,160,0.35); background:rgba(124,242,160,0.04); }
  .va-logo-mark{
    width:54px; height:54px; flex:0 0 54px;
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
  .va-hero{ position:relative; }
  .va-hero-copy{ position:relative; z-index:2; }
  .va-mascot-stage{
    position:absolute; width:228px; aspect-ratio:1; right:-148px; top:-62px;
    pointer-events:none; isolation:isolate; z-index:3;
    filter:drop-shadow(0 0 18px rgba(124,242,160,.2));
  }
  .va-mascot-stage::before{
    content:''; position:absolute; inset:17%; z-index:-1; border-radius:50%;
    background:radial-gradient(circle, rgba(124,242,160,.18), rgba(124,242,160,.045) 48%, transparent 72%);
    filter:blur(13px); opacity:.9;
  }
  .va-mascot-sprite{
    position:absolute; inset:0; width:100%; height:100%;
    background-image:url('/assets/sprites/pixel-directions/pixel-directions-spritesheet.png');
    background-repeat:no-repeat; background-size:300% 300%;
    background-position:var(--sprite-x, 50%) var(--sprite-y, 50%);
  }
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
    .va-hero .va-h1{ max-width:220px; }
    .va-mascot-stage{ width:112px; right:-4px; top:-24px; z-index:1; }
  }
`;

const VideoOnView = ({ src, poster, autoplay = true, loop = true, controls = false }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !autoplay) return;
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
  }, [autoplay]);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted={autoplay}
      loop={loop}
      controls={controls}
      playsInline
      preload="metadata"
    />
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
        <VideoOnView
          src={media.src}
          poster={media.poster}
          autoplay={media.autoplay !== false}
          loop={media.loop !== false}
          controls={media.controls === true}
        />
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

const WRITING_CATEGORIES = ['All', 'Technology', 'Philosophy'];

const getWritingCategory = (writing) => writing.category || 'Philosophy';

const filterWritings = (writings, category) => (
  category === 'All' ? writings : writings.filter(w => getWritingCategory(w) === category)
);

function WritingCategoryFilter({ writings, activeCategory, onCategoryChange }) {
  return (
    <div className="va-category-row" role="tablist" aria-label="Writing categories">
      {WRITING_CATEGORIES.map(category => {
        const count = filterWritings(writings, category).length;
        return (
          <button
            key={category}
            type="button"
            className={`va-category-button ${activeCategory === category ? 'on' : ''}`}
            onClick={() => onCategoryChange(category)}
            aria-pressed={activeCategory === category}
          >
            {category} {count}
          </button>
        );
      })}
    </div>
  );
}

function WritingCard({ writing, compact = false }) {
  const hero = (writing.images || []).find(img => img.kind === 'hero');
  const thumbStyle = hero && hero.aspect ? { aspectRatio: hero.aspect.replace('/', ' / ') } : undefined;
  if (compact) {
    return (
      <a href={`/writings/${writing.slug}/`} className="va-card">
        <span className="corner va-corner-tl" /><span className="corner va-corner-br" />
        <div className="va-meta" style={{ marginBottom:6 }}>{writing.date} · {getWritingCategory(writing)}</div>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:18, fontWeight:500, color:'#f1f7ec', marginBottom:6 }}>{writing.title}</div>
        <p style={{ margin:0, color:'#cfd8c9', fontSize:15 }}>{writing.blurb}</p>
      </a>
    );
  }
  return (
    <a href={`/writings/${writing.slug}/`} className="va-card va-writing-card">
      <span className="corner va-corner-tl" /><span className="corner va-corner-br" />
      {hero && (
        <div className="va-writing-thumb va-media" style={thumbStyle}>
          <img src={hero.src} alt={hero.alt || ''} loading="lazy" />
        </div>
      )}
      <div className="va-writing-body">
        <div className="va-meta" style={{ marginBottom:8 }}>{writing.date} · {getWritingCategory(writing)}</div>
        <h3 style={{ margin:'0 0 8px', fontSize:20, fontFamily:"'JetBrains Mono', monospace", fontWeight:500, color:'#f1f7ec' }}>{writing.title}</h3>
        <p style={{ margin:0, color:'#cfd8c9' }}>{writing.blurb}</p>
      </div>
    </a>
  );
}

const clampMascot = (value, min, max) => Math.max(min, Math.min(max, value));
const MASCOT_SPRITES = {
  'up-left':{ x:'0%', y:'0%' },
  up:{ x:'50%', y:'0%' },
  'up-right':{ x:'100%', y:'0%' },
  left:{ x:'0%', y:'50%' },
  center:{ x:'50%', y:'50%' },
  right:{ x:'100%', y:'50%' },
  'down-left':{ x:'0%', y:'100%' },
  down:{ x:'50%', y:'100%' },
  'down-right':{ x:'100%', y:'100%' },
};

function MouseFollowingMascot() {
  const stageRef = React.useRef(null);
  const spriteRef = React.useRef(null);

  React.useEffect(() => {
    const stage = stageRef.current;
    const sprite = spriteRef.current;
    if (!stage || !sprite) return;

    const motion = { x:0, y:0, vx:0, vy:0, targetX:0, targetY:0 };
    let currentPose = 'center';
    let raf = 0;

    const atlas = new Image();
    atlas.src = '/assets/sprites/pixel-directions/pixel-directions-spritesheet.png';

    const poseForDirection = (x, y) => {
      if (Math.hypot(x, y) < .12) return 'center';
      const angle = Math.atan2(y, x) * 180 / Math.PI;
      if (angle >= -22.5 && angle < 22.5) return 'right';
      if (angle >= 22.5 && angle < 67.5) return 'down-right';
      if (angle >= 67.5 && angle < 112.5) return 'down';
      if (angle >= 112.5 && angle < 157.5) return 'down-left';
      if (angle >= 157.5 || angle < -157.5) return 'left';
      if (angle >= -157.5 && angle < -112.5) return 'up-left';
      if (angle >= -112.5 && angle < -67.5) return 'up';
      return 'up-right';
    };

    const renderMotion = () => {
      motion.vx = (motion.vx + (motion.targetX - motion.x) * .14) * .7;
      motion.vy = (motion.vy + (motion.targetY - motion.y) * .14) * .7;
      motion.x += motion.vx;
      motion.y += motion.vy;

      const nextPose = poseForDirection(motion.x, motion.y);
      if (nextPose !== currentPose) {
        currentPose = nextPose;
        const frame = MASCOT_SPRITES[nextPose];
        sprite.style.setProperty('--sprite-x', frame.x);
        sprite.style.setProperty('--sprite-y', frame.y);
        sprite.dataset.pose = nextPose;
      }

      const unsettled = Math.abs(motion.targetX - motion.x) > .001 || Math.abs(motion.targetY - motion.y) > .001 || Math.abs(motion.vx) > .001 || Math.abs(motion.vy) > .001;
      raf = unsettled ? requestAnimationFrame(renderMotion) : 0;
    };

    const startMotion = () => {
      if (!raf) raf = requestAnimationFrame(renderMotion);
    };

    const onPointerMove = (event) => {
      const rect = stage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const directionRange = Math.max(160, Math.min(rect.width, rect.height) * .92);
      motion.targetX = clampMascot(dx / directionRange, -1, 1);
      motion.targetY = clampMascot(dy / directionRange, -1, 1);
      startMotion();
    };

    const reset = () => {
      motion.targetX = 0;
      motion.targetY = 0;
      startMotion();
    };

    window.addEventListener('pointermove', onPointerMove, { passive:true });
    window.addEventListener('blur', reset);
    document.documentElement.addEventListener('mouseleave', reset);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('blur', reset);
      document.documentElement.removeEventListener('mouseleave', reset);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="va-mascot-stage"
      role="img"
      aria-label="Pixel, a friendly robot mascot who looks toward your pointer"
    >
      <span ref={spriteRef} className="va-mascot-sprite" aria-hidden="true" data-pose="center" />
    </div>
  );
}

// ----- Home view -----

function HomeView() {
  const data = window.SITE_DATA;
  const validTabs = ['home','projects','writings','about'];
  const [writingCategory, setWritingCategory] = React.useState('All');
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
          <div className="va-hero">
            <div className="va-hero-copy">
              <h1 className="va-h1" style={{ fontSize:44, marginBottom:14 }}>
                Anshul Dhawan<span className="va-cursor" />
              </h1>
              <p style={{ fontSize:19, color:'#cfd8c9', maxWidth:580, margin:'0 0 28px' }}>
                AI generalist, product leader, and game developer. I work on <span className="va-acc">product, growth, analytics</span>, and <span className="va-acc">AI</span>, usually where games or software are trying to do something new.
              </p>
              <div style={{ display:'flex', gap:18, flexWrap:'wrap', marginBottom:8 }}>
                {data.links.map(l => (
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="va-link va-mono" style={{ fontSize:12, letterSpacing:'.08em', textTransform:'uppercase' }}>
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </div>
            <MouseFollowingMascot />
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
              <WritingCard key={w.slug} writing={w} compact />
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
          <WritingCategoryFilter
            writings={data.writings}
            activeCategory={writingCategory}
            onCategoryChange={setWritingCategory}
          />
          <div className="va-stack">
            {filterWritings(data.writings, writingCategory).map(w => (
              <WritingCard key={w.slug} writing={w} />
            ))}
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
          {data.profile && data.profile.faq.length > 0 && (
            <>
              <div className="va-pixel-divider" style={{ margin:'32px 0' }} />
              <h2 className="va-h2">// quick answers</h2>
              <div className="va-faq">
                {data.profile.faq.map(item => (
                  <div key={item.q}>
                    <h3>{item.q}</h3>
                    <p>{item.a}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="va-pixel-divider" style={{ margin:'32px 0' }} />
          <h2 className="va-h2">// talks</h2>
          <div className="va-stack">
            {(data.talks || []).map(talk => (
              <a key={talk.href} href={talk.href} target="_blank" rel="noreferrer" className="va-card">
                <div className="va-meta" style={{ marginBottom:8 }}>{talk.event} · {talk.company}</div>
                <h3 style={{ fontSize:20, fontWeight:500, color:'#f1f7ec', lineHeight:1.4, margin:'0 0 10px' }}>{talk.title}</h3>
                <p style={{ margin:'0 0 14px', color:'#cfd8c9' }}>{talk.blurb}</p>
                <span className="va-link va-mono" style={{ fontSize:12 }}>Watch on GDC Vault ↗</span>
              </a>
            ))}
          </div>
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
  const images = project.images || [];
  const inlineImages = images.filter((image) => Number.isInteger(image.after));
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
            {paragraphs.map((p, i) => (
              <React.Fragment key={i}>
                <WritingBlock block={p} />
                {inlineImages.filter((image) => image.after === i).map((image) => (
                  <React.Fragment key={image.src}>
                    <ProjectMedia media={{ type:'image', ...image }} style={{ margin:'26px 0 28px' }} />
                    {image.credit && (
                      <div className="va-caption">
                        <a href={image.credit.href} target="_blank" rel="noreferrer">{image.credit.label}</a>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
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
  if (block.type === 'leadParagraph') return <p><strong>{block.lead} </strong>{block.text}</p>;
  if (block.type === 'video') {
    return (
      <figure className="va-inline-media">
        <ProjectMedia media={block} />
        {block.caption && <figcaption className="va-caption">{block.caption}</figcaption>}
      </figure>
    );
  }
  if (block.type === 'assetGrid') {
    const gridClass = block.columns === 2 ? 'va-asset-grid two-column' : 'va-asset-grid';
    return (
      <div className={gridClass}>
        {(block.items || []).map((item) => (
          <figure key={item.src} className={`va-asset-card${item.featured ? ' featured' : ''}`}>
            <div className="va-asset-visual" style={{ aspectRatio:item.aspect || '1 / 1' }}>
              <img src={item.src} alt={item.alt || ''} loading="lazy" />
            </div>
            <figcaption>
              {item.featured ? (
                <>
                  <span className="va-asset-title">{item.label}</span>
                  {item.description && <span className="va-asset-description">{item.description}</span>}
                </>
              ) : item.label}
            </figcaption>
          </figure>
        ))}
      </div>
    );
  }
  if (block.type === 'mediaPlaceholder') {
    return (
      <div className="va-media-placeholder" aria-label={`${block.label}: ${block.note}`}>
        <div className="va-media-placeholder-mark" aria-hidden="true">▱</div>
        <div className="va-media-placeholder-label">{block.label}</div>
        <div className="va-media-placeholder-note">{block.note}</div>
      </div>
    );
  }
  if (block.type === 'linkStatus') {
    return (
      <div className="va-link-status">
        <span className="va-link-status-label">{block.label}</span>
        <span className="va-link-status-note">{block.note}</span>
      </div>
    );
  }
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
  const topHeroImage = heroImage && Number.isInteger(heroImage.after) ? null : heroImage;
  const inlineImages = images.filter((image) => Number.isInteger(image.after));
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

          {topHeroImage && (
            <>
              <ProjectMedia media={{ type:'image', ...topHeroImage }} style={{ marginBottom:30 }} />
              {topHeroImage.credit && (
                <div className="va-caption">
                  <a href={topHeroImage.credit.href} target="_blank" rel="noreferrer">{topHeroImage.credit.label}</a>
                </div>
              )}
            </>
          )}

          <div className="va-prose" style={{ fontSize:17 }}>
            {paragraphs.map((p, i) => (
              <React.Fragment key={i}>
                <WritingBlock block={p} />
                {inlineImages.filter((image) => image.after === i).map((image) => (
                  <React.Fragment key={image.src}>
                    <ProjectMedia media={{ type:'image', ...image }} style={{ margin:'26px 0 28px' }} />
                    {image.credit && (
                      <div className="va-caption">
                        <a href={image.credit.href} target="_blank" rel="noreferrer">{image.credit.label}</a>
                      </div>
                    )}
                  </React.Fragment>
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

let worldRendererPromise;
function loadWorldRenderer() {
  if (window.createSiteWorld) return Promise.resolve(window.createSiteWorld);
  if (!worldRendererPromise) {
    worldRendererPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/project/site/world-background.js?v=1';
      script.onload = () => {
        if (window.createSiteWorld) resolve(window.createSiteWorld);
        else reject(new Error('World renderer unavailable'));
        script.remove();
      };
      script.onerror = () => { script.remove(); reject(new Error('World renderer unavailable')); };
      document.head.appendChild(script);
    }).catch(error => { worldRendererPromise = null; throw error; });
  }
  return worldRendererPromise;
}

function WorldBackground({ onError }) {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    let cancelled = false;
    let dispose;
    // Load the decorative world without delaying the page content.
    loadWorldRenderer().then(createWorld => {
      if (!cancelled) dispose = createWorld(canvasRef.current);
    }).catch(() => { if (!cancelled) onError(); });
    return () => { cancelled = true; if (dispose) dispose(); };
  }, [onError]);
  return <div className="va-world" aria-hidden="true"><canvas ref={canvasRef} /></div>;
}

function VariantA() {
  const containerRef = React.useRef(null);
  const [worldEnabled, setWorldEnabled] = React.useState(true);
  const handleWorldError = React.useCallback(() => {
    // Keep the page usable if the decorative renderer cannot load.
    setWorldEnabled(false);
  }, []);
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
    <div ref={containerRef} className={`va-root va-scanlines va-vignette${worldEnabled ? ' va-world-active' : ''}`}>
      <style>{VA_CSS}</style>
      {worldEnabled && <WorldBackground onError={handleWorldError} />}
      {!worldEnabled && window.CursorTrail && <window.CursorTrail variant="spark" color="#7cf2a0" />}
      {body}

    </div>
  );
}

window.VariantA = VariantA;
