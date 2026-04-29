// Variant B — Pixel Zine (warm cream paper, ink black, pixel dividers, serif body)
// Readability-first: serif body on cream at 17px.
// Effects: occasional pixel sparks; pixel-art hr; small chunky icons; gentle paper grain.

function VariantB() {
  const [tab, setTab] = React.useState('home');
  const data = window.SITE_DATA;

  const css = `
    .vb-root{
      width:100%; height:100%; overflow-y:auto; position:relative;
      background:#f3ede1; color:#1a1612;
      font-family: 'Newsreader', 'Source Serif Pro', Georgia, serif;
      font-size:17px; line-height:1.7;
      -webkit-font-smoothing:antialiased;
    }
    .vb-paper::before{
      content:''; position:absolute; inset:0; pointer-events:none; z-index:1;
      background-image:
        radial-gradient(rgba(60,40,20,0.04) 1px, transparent 1px),
        radial-gradient(rgba(60,40,20,0.03) 1px, transparent 1px);
      background-size: 3px 3px, 7px 7px;
      background-position: 0 0, 1px 2px;
      opacity:.7;
    }
    .vb-mono{ font-family:'JetBrains Mono', ui-monospace, Menlo, monospace; }
    .vb-nav{
      position:sticky; top:0; z-index:10;
      background: rgba(243,237,225,0.85);
      backdrop-filter: blur(6px);
      border-bottom:2px solid #1a1612;
    }
    .vb-tab{
      background:none; border:none; cursor:pointer;
      color:#5a4a3a; padding:8px 0; margin-right:22px;
      font-family:'JetBrains Mono', monospace; font-size:12px; letter-spacing:.06em;
      text-transform:lowercase; position:relative;
    }
    .vb-tab:hover{ color:#1a1612; }
    .vb-tab.on{ color:#1a1612; }
    .vb-tab.on::before{ content:'▮ '; color:#d94a26; }
    .vb-h1{ font-family:'Newsreader', Georgia, serif; font-weight:500; font-size:54px; line-height:1.05; letter-spacing:-0.02em; margin:0; }
    .vb-h2{ font-family:'JetBrains Mono', monospace; font-weight:500; font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:#d94a26; margin:0 0 18px; }
    .vb-acc{ color:#d94a26; }
    .vb-card{
      background:#fdf9ee; border:1.5px solid #1a1612;
      padding:22px 24px; position:relative;
      box-shadow: 4px 4px 0 #1a1612;
      transition: transform .15s, box-shadow .15s;
    }
    .vb-card:hover{ transform: translate(-1px,-1px); box-shadow: 6px 6px 0 #1a1612; }
    .vb-link{
      color:#1a1612; text-decoration:none;
      background-image: linear-gradient(#d94a26, #d94a26);
      background-size: 100% 2px; background-repeat: no-repeat; background-position: 0 100%;
      padding-bottom:1px;
      transition: background-size .2s;
    }
    .vb-link:hover{ background-size: 100% 100%; color:#fdf9ee; }
    .vb-divider{
      height:8px; margin:28px 0;
      background-image: linear-gradient(to right, #1a1612 50%, transparent 50%);
      background-size: 8px 8px;
    }
    .vb-meta{ font-family:'JetBrains Mono', monospace; font-size:11px; letter-spacing:.08em; color:#5a4a3a; text-transform:uppercase; }
    .vb-section{ padding:56px 56px 24px; max-width:760px; margin:0 auto; position:relative; z-index:2; }
    .vb-grid{ display:grid; grid-template-columns: 1fr 1fr; gap:18px; }
    @media (max-width:720px){ .vb-grid{ grid-template-columns:1fr } }
    .vb-stack > * + *{ margin-top:22px; }
    .vb-video{
      aspect-ratio:16/9; border:1.5px solid #1a1612; background:#1a1612; color:#fdf9ee;
      display:flex; align-items:center; justify-content:center; position:relative;
      background-image:
        repeating-linear-gradient(0deg, rgba(253,249,238,0.08) 0 2px, transparent 2px 4px);
    }
    .vb-play{
      width:0; height:0;
      border-left:18px solid #fdf9ee; border-top:12px solid transparent; border-bottom:12px solid transparent;
      filter: drop-shadow(2px 2px 0 #d94a26);
    }
    .vb-stamp{
      display:inline-block; padding:3px 8px; border:1.5px solid #1a1612;
      font-family:'JetBrains Mono', monospace; font-size:10px; letter-spacing:.1em; text-transform:uppercase;
      background:#fdf9ee; transform: rotate(-1.5deg);
    }
    .vb-prose p{ margin:0 0 16px; }
    .vb-pixicon{
      display:inline-block; width:14px; height:14px; vertical-align:-2px; margin-right:8px;
      background:
        linear-gradient(#d94a26,#d94a26) 0 0/3px 3px no-repeat,
        linear-gradient(#d94a26,#d94a26) 3px 3px/3px 3px no-repeat,
        linear-gradient(#d94a26,#d94a26) 6px 0/3px 3px no-repeat,
        linear-gradient(#d94a26,#d94a26) 9px 3px/3px 3px no-repeat,
        linear-gradient(#d94a26,#d94a26) 0 6px/12px 3px no-repeat,
        linear-gradient(#d94a26,#d94a26) 3px 9px/6px 3px no-repeat;
    }
  `;

  const Project = ({ p }) => (
    <article className="vb-card">
      <div style={{ display:'flex', justifyContent:'space-between', gap:16, alignItems:'baseline', marginBottom:4 }}>
        <h3 style={{ margin:0, fontSize:24, fontFamily:"'Newsreader', Georgia, serif", fontWeight:500 }}>
          {p.title}
        </h3>
        <span className="vb-stamp">{p.year}</span>
      </div>
      <div className="vb-meta" style={{ marginBottom:10 }}>{p.role} · {p.tag}</div>
      <p style={{ margin:'0 0 14px' }}>{p.blurb}</p>
      <div className="vb-video" style={{ marginBottom:14 }}>
        <div className="vb-play" />
        <span style={{ position:'absolute', bottom:8, left:10, fontSize:10, fontFamily:"'JetBrains Mono', monospace", letterSpacing:'.1em' }}>REEL · 0:42</span>
      </div>
      <a className="vb-link vb-mono" style={{ fontSize:13 }} href={p.href} target="_blank" rel="noreferrer">
        Open ↗
      </a>
    </article>
  );

  return (
    <div className="vb-root vb-paper">
      <style>{css}</style>
      {window.CursorTrail && <window.CursorTrail variant="pixel" color="#d94a26" />}

      <nav className="vb-nav">
        <div style={{ maxWidth:760, margin:'0 auto', padding:'14px 56px', display:'flex', alignItems:'center', gap:24 }}>
          <button onClick={() => setTab('home')} style={{ background:'none', border:'none', cursor:'pointer', marginRight:'auto', padding:0, fontFamily:"'Newsreader', Georgia, serif", fontSize:18, fontWeight:500, color:'#1a1612' }}>
            Anshul Dhawan
          </button>
          {['home','projects','writings','about'].map(t => (
            <button key={t} className={`vb-tab ${tab===t?'on':''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
      </nav>

      {tab === 'home' && (
        <section className="vb-section" style={{ paddingTop:80, paddingBottom:60 }}>
          <div className="vb-meta" style={{ marginBottom:18 }}><span className="vb-pixicon" />issue 01 — 2026</div>
          <h1 className="vb-h1">
            Generalist.<br/>Game developer.<br/>
            <span style={{ color:'#d94a26' }}>Sometimes both at once.</span>
          </h1>
          <p style={{ fontSize:19, maxWidth:560, marginTop:24 }}>
            I'm <span className="vb-acc" style={{ fontWeight:500 }}>Anshul</span>. I work on product, growth, analytics, and AI — usually where games and software are trying to do something new.
          </p>
          <div className="vb-divider" />
          <div className="vb-grid">
            <button onClick={() => setTab('projects')} className="vb-card" style={{ textAlign:'left', cursor:'pointer', color:'inherit', font:'inherit' }}>
              <div className="vb-meta" style={{ marginBottom:6 }}>01 — projects</div>
              <div style={{ fontSize:18 }}>Six things, treated equally →</div>
            </button>
            <button onClick={() => setTab('writings')} className="vb-card" style={{ textAlign:'left', cursor:'pointer', color:'inherit', font:'inherit' }}>
              <div className="vb-meta" style={{ marginBottom:6 }}>02 — writings</div>
              <div style={{ fontSize:18 }}>Notes from the field →</div>
            </button>
          </div>
          <div style={{ marginTop:32, display:'flex', gap:22, flexWrap:'wrap' }}>
            {data.links.map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="vb-link vb-mono" style={{ fontSize:13 }}>
                {l.label} ↗
              </a>
            ))}
          </div>
        </section>
      )}

      {tab === 'projects' && (
        <section className="vb-section" style={{ paddingTop:64, paddingBottom:80 }}>
          <h2 className="vb-h2">— projects —</h2>
          <div className="vb-stack">
            {data.projects.map(p => <Project key={p.title} p={p} />)}
          </div>
        </section>
      )}

      {tab === 'writings' && (
        <section className="vb-section" style={{ paddingTop:64, paddingBottom:80 }}>
          <h2 className="vb-h2">— writings —</h2>
          <div className="vb-stack">
            {data.writings.map(w => (
              <article key={w.title} className="vb-card">
                <div className="vb-meta" style={{ marginBottom:8 }}>{w.date}</div>
                <h3 style={{ margin:'0 0 8px', fontSize:24, fontFamily:"'Newsreader', Georgia, serif", fontWeight:500 }}>{w.title}</h3>
                <p style={{ margin:0 }}>{w.blurb}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === 'about' && (
        <section className="vb-section" style={{ paddingTop:64, paddingBottom:80 }}>
          <h2 className="vb-h2">— about —</h2>
          <div className="vb-prose" style={{ fontSize:19 }}>
            {data.about.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="vb-divider" />
          <div className="vb-meta" style={{ marginBottom:10 }}>elsewhere</div>
          <div style={{ display:'flex', gap:22, flexWrap:'wrap' }}>
            {data.links.map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="vb-link vb-mono" style={{ fontSize:13 }}>
                {l.label} ↗
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

window.VariantB = VariantB;
