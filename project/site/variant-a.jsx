// Variant A — CRT Arcade (dark, neon-green accent, scanlines, monospace + serif)
// Readability-first: body in serif at 16-17px on near-black.
// Effects: scanlines, vignette, subtle screen-flicker, cursor sparks.

function VariantA() {
  const [tab, setTab] = React.useState('home');
  const data = window.SITE_DATA;
  const containerRef = React.useRef(null);

  const css = `
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
    }
    .va-tab:hover{ color:#e6efe1; }
    .va-tab.on{ color:#7cf2a0; }
    .va-tab.on::after{
      content:''; position:absolute; left:0; right:0; bottom:-1px; height:2px;
      background:#7cf2a0; box-shadow:0 0 8px rgba(124,242,160,0.6);
    }
    .va-acc{ color:#7cf2a0; }
    .va-h1{ font-family:'JetBrains Mono', monospace; font-weight:500; font-size:36px; letter-spacing:-0.01em; line-height:1.1; margin:0; color:#f1f7ec; }
    .va-h2{ font-family:'JetBrains Mono', monospace; font-weight:500; font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:#7cf2a0; margin:0 0 18px; }
    .va-card{
      border:1px solid rgba(124,242,160,0.14);
      background: linear-gradient(180deg, rgba(124,242,160,0.03), rgba(124,242,160,0.0));
      padding:22px 24px; border-radius:4px; transition: border-color .2s, transform .2s;
      position:relative;
    }
    .va-card:hover{ border-color: rgba(124,242,160,0.35); }
    .va-card .corner{ position:absolute; width:8px; height:8px; border-color:#7cf2a0; }
    .va-corner-tl{ top:-1px; left:-1px; border-top:1px solid; border-left:1px solid; }
    .va-corner-br{ bottom:-1px; right:-1px; border-bottom:1px solid; border-right:1px solid; }
    .va-link{ color:#e6efe1; text-decoration:none; border-bottom:1px solid rgba(124,242,160,0.4); transition:color .15s, border-color .15s; }
    .va-link:hover{ color:#7cf2a0; border-color:#7cf2a0; }
    .va-cursor{ display:inline-block; width:9px; height:1.05em; background:#7cf2a0; vertical-align:-2px; margin-left:4px; animation:vablink 1s steps(2) infinite; }
    @keyframes vablink{ 50%{ opacity:0 } }
    .va-video{
      aspect-ratio: 16 / 9; background:#0e120c;
      border:1px solid rgba(124,242,160,0.18); border-radius:3px;
      display:flex; align-items:center; justify-content:center; position:relative;
      background-image:
        repeating-linear-gradient(45deg, rgba(124,242,160,0.04) 0 8px, transparent 8px 16px);
    }
    .va-play{
      width:48px; height:48px; border-radius:50%;
      border:1px solid #7cf2a0; color:#7cf2a0;
      display:flex; align-items:center; justify-content:center;
      background:rgba(11,13,10,0.6);
    }
    .va-pixel-divider{
      height:6px; background-image: linear-gradient(to right, #7cf2a0 50%, transparent 50%);
      background-size: 6px 6px; opacity:.35;
    }
    .va-meta{ font-family:'JetBrains Mono', monospace; font-size:11px; letter-spacing:.06em; color:#7a8a76; text-transform:uppercase; }
    .va-prose p{ margin:0 0 14px; color:#cfd8c9; }
    .va-row{ display:flex; gap:16px; flex-wrap:wrap; }
    .va-stack > * + *{ margin-top:18px; }
    .va-grid{ display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
    @media (max-width: 720px){ .va-grid{ grid-template-columns: 1fr; } }
    .va-section{ padding:56px 56px 24px; max-width:760px; margin:0 auto; }
    .va-bracket{ color:#7cf2a0; font-family:'JetBrains Mono', monospace; }
  `;

  const Project = ({ p }) => (
    <div className="va-card">
      <span className="corner va-corner-tl" />
      <span className="corner va-corner-br" />
      <div style={{ display:'flex', justifyContent:'space-between', gap:16, alignItems:'baseline', marginBottom:6, flexWrap:'wrap' }}>
        <h3 style={{ margin:0, fontSize:20, fontFamily:"'JetBrains Mono', monospace", fontWeight:500, color:'#f1f7ec', lineHeight:1.3, flex:'1 1 auto' }}>
          <span className="va-bracket">▸</span> {p.title}
        </h3>
        <span className="va-meta" style={{ flex:'0 0 auto' }}>{p.year}</span>
      </div>
      <div className="va-meta" style={{ marginBottom:10 }}>{p.role} · {p.tag}</div>
      <p style={{ margin:'0 0 14px', color:'#cfd8c9' }}>{p.blurb}</p>
      <div className="va-video" style={{ marginBottom:14 }}>
        <div className="va-play">▶</div>
        <span style={{ position:'absolute', bottom:8, left:10, fontSize:10, color:'#7a8a76', fontFamily:"'JetBrains Mono', monospace", letterSpacing:'.1em' }}>
          REEL · 0:42
        </span>
      </div>
      <a className="va-link va-mono" style={{ fontSize:12, letterSpacing:'.06em' }} href={p.href} target="_blank" rel="noreferrer">
        OPEN ↗
      </a>
    </div>
  );

  return (
    <div ref={containerRef} className="va-root va-scanlines va-vignette">
      <style>{css}</style>
      {window.CursorTrail && <window.CursorTrail variant="spark" color="#7cf2a0" />}

      <nav className="va-nav">
        <div style={{ maxWidth:760, margin:'0 auto', padding:'14px 56px', display:'flex', alignItems:'center', gap:24 }}>
          <button onClick={() => setTab('home')} className="va-tab" style={{ color:'#e6efe1', marginRight:'auto', fontSize:13 }}>
            <span className="va-acc">▌</span> ANSHUL.DHAWAN
          </button>
          {['home','projects','writings','about'].map(t => (
            <button key={t} className={`va-tab ${tab===t?'on':''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
      </nav>

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
            <button onClick={() => setTab('projects')} className="va-link va-mono" style={{ background:'none', border:'none', cursor:'pointer', fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', padding:0 }}>
              all {data.projects.length} →
            </button>
          </div>
          <div className="va-stack">
            {data.projects.map(p => (
              <button key={p.title} onClick={() => setTab('projects')} className="va-card" style={{ width:'100%', textAlign:'left', cursor:'pointer', color:'inherit', font:'inherit', background:'transparent', display:'block' }}>
                <span className="corner va-corner-tl" /><span className="corner va-corner-br" />
                <div style={{ display:'flex', justifyContent:'space-between', gap:16, alignItems:'baseline', marginBottom:6, flexWrap:'wrap' }}>
                  <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:18, fontWeight:500, color:'#f1f7ec', lineHeight:1.3, flex:'1 1 auto' }}>
                    <span className="va-bracket">▸</span> {p.title}
                  </span>
                  <span className="va-meta" style={{ flex:'0 0 auto' }}>{p.year}</span>
                </div>
                <div className="va-meta" style={{ marginBottom:8 }}>{p.role} · {p.tag}</div>
                <p style={{ margin:0, color:'#cfd8c9', fontSize:15 }}>{p.blurb}</p>
              </button>
            ))}
          </div>

          <div className="va-pixel-divider" style={{ margin:'40px 0 24px' }} />
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:18 }}>
            <h2 className="va-h2" style={{ margin:0 }}>// writings</h2>
            <button onClick={() => setTab('writings')} className="va-link va-mono" style={{ background:'none', border:'none', cursor:'pointer', fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', padding:0 }}>
              all {data.writings.length} →
            </button>
          </div>
          <div className="va-stack">
            {data.writings.map(w => (
              <button key={w.title} onClick={() => setTab('writings')} className="va-card" style={{ width:'100%', textAlign:'left', cursor:'pointer', color:'inherit', font:'inherit', background:'transparent', display:'block' }}>
                <span className="corner va-corner-tl" /><span className="corner va-corner-br" />
                <div className="va-meta" style={{ marginBottom:6 }}>{w.date}</div>
                <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:18, fontWeight:500, color:'#f1f7ec', marginBottom:6 }}>{w.title}</div>
                <p style={{ margin:0, color:'#cfd8c9', fontSize:15 }}>{w.blurb}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {tab === 'projects' && (
        <section className="va-section" style={{ paddingTop:64, paddingBottom:80 }}>
          <h2 className="va-h2">// projects</h2>
          <div className="va-stack">
            {data.projects.map(p => <Project key={p.title} p={p} />)}
          </div>
        </section>
      )}

      {tab === 'writings' && (
        <section className="va-section" style={{ paddingTop:64, paddingBottom:80 }}>
          <h2 className="va-h2">// writings</h2>
          <div className="va-stack">
            {data.writings.map(w => (
              <article key={w.title} className="va-card">
                <span className="corner va-corner-tl" /><span className="corner va-corner-br" />
                <div className="va-meta" style={{ marginBottom:8 }}>{w.date}</div>
                <h3 style={{ margin:'0 0 8px', fontSize:20, fontFamily:"'JetBrains Mono', monospace", fontWeight:500, color:'#f1f7ec' }}>{w.title}</h3>
                <p style={{ margin:0, color:'#cfd8c9' }}>{w.blurb}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === 'about' && (
        <section className="va-section" style={{ paddingTop:64, paddingBottom:80 }}>
          <h2 className="va-h2">// about</h2>
          <div className="va-prose" style={{ fontSize:18 }}>
            {data.about.map((p, i) => <p key={i}>{p}</p>)}
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
    </div>
  );
}

window.VariantA = VariantA;
