// Variant C — Dev-log Terminal (full monospace, amber accent, ASCII frames)
// Readability-first: 16px mono on near-black, generous line height.
// Effects: blinking caret, particle binary trail, ASCII section frames.

function VariantC() {
  const [tab, setTab] = React.useState('home');
  const data = window.SITE_DATA;

  const css = `
    .vc-root{
      width:100%; height:100%; overflow-y:auto; position:relative;
      background:#0d0c08; color:#e8dfc4;
      font-family:'JetBrains Mono', ui-monospace, Menlo, monospace;
      font-size:14.5px; line-height:1.75;
      -webkit-font-smoothing:antialiased;
    }
    .vc-amber{ color:#f0b441; }
    .vc-dim{ color:#8a8264; }
    .vc-nav{
      position:sticky; top:0; z-index:10;
      background: rgba(13,12,8,0.85);
      backdrop-filter: blur(6px);
      border-bottom:1px solid rgba(240,180,65,0.2);
    }
    .vc-tab{
      background:none; border:none; cursor:pointer;
      color:#8a8264; padding:8px 12px; margin-right:6px;
      font-family:inherit; font-size:13px;
    }
    .vc-tab:hover{ color:#e8dfc4; }
    .vc-tab.on{ color:#0d0c08; background:#f0b441; }
    .vc-section{ padding:48px 48px 24px; max-width:760px; margin:0 auto; position:relative; z-index:2; }
    .vc-prompt::before{ content:'$ '; color:#f0b441; }
    .vc-cursor{ display:inline-block; width:10px; height:1.2em; background:#f0b441; vertical-align:-3px; margin-left:2px; animation: vcblink 1.05s steps(2) infinite; }
    @keyframes vcblink{ 50%{ opacity:0 } }
    .vc-h1{ font-size:30px; font-weight:500; letter-spacing:-0.005em; line-height:1.2; margin:0; color:#fbf3d8; }
    .vc-h2{ color:#f0b441; font-size:13px; letter-spacing:.06em; margin:0 0 6px; }
    .vc-frame{
      border:1px solid rgba(240,180,65,0.35); padding:18px 20px;
      position:relative; background: rgba(240,180,65,0.025);
    }
    .vc-frame .lab{
      position:absolute; top:-9px; left:14px; padding:0 8px;
      background:#0d0c08; color:#f0b441; font-size:11px; letter-spacing:.1em;
    }
    .vc-link{
      color:#f0b441; text-decoration:none; border-bottom:1px dashed rgba(240,180,65,0.5);
    }
    .vc-link:hover{ color:#fbf3d8; border-color:#fbf3d8; }
    .vc-meta{ color:#8a8264; font-size:12px; }
    .vc-row{ display:flex; gap:8px; align-items:baseline; }
    .vc-stack > * + *{ margin-top:18px; }
    .vc-video{
      aspect-ratio:16/9; border:1px solid rgba(240,180,65,0.35);
      background:#0a0906;
      background-image:
        repeating-linear-gradient(45deg, rgba(240,180,65,0.05) 0 8px, transparent 8px 16px);
      position:relative; display:flex; align-items:center; justify-content:center;
    }
    .vc-play{
      width:44px; height:44px; border:1px solid #f0b441; color:#f0b441;
      display:flex; align-items:center; justify-content:center; background:rgba(13,12,8,0.5);
    }
    .vc-tag{
      display:inline-block; padding:1px 7px; border:1px solid rgba(240,180,65,0.4);
      color:#f0b441; font-size:11px; letter-spacing:.06em;
    }
    .vc-rule{
      color:#3a3526; user-select:none; line-height:1; letter-spacing:0;
      font-size:12px; margin:18px 0;
    }
  `;

  const Project = ({ p, i }) => (
    <div className="vc-frame">
      <span className="lab">PROJECT_{String(i+1).padStart(2,'0')}</span>
      <div style={{ display:'flex', justifyContent:'space-between', gap:16, alignItems:'baseline' }}>
        <span className="vc-amber" style={{ fontSize:18 }}>{p.title}</span>
        <span className="vc-meta">{p.year}</span>
      </div>
      <div className="vc-meta" style={{ marginTop:2 }}>
        <span className="vc-tag" style={{ marginRight:8 }}>{p.role}</span>
        {p.tag}
      </div>
      <p style={{ margin:'12px 0 14px', color:'#cfc6a8' }}>{p.blurb}</p>
      <div className="vc-video" style={{ marginBottom:14 }}>
        <div className="vc-play">▶</div>
        <span style={{ position:'absolute', bottom:6, left:10, fontSize:10, color:'#8a8264' }}>./reel.mp4 · 00:42</span>
      </div>
      <a className="vc-link" href={p.href} target="_blank" rel="noreferrer">open ↗</a>
    </div>
  );

  return (
    <div className="vc-root">
      <style>{css}</style>
      {window.CursorTrail && <window.CursorTrail variant="binary" color="#f0b441" />}

      <nav className="vc-nav">
        <div style={{ maxWidth:760, margin:'0 auto', padding:'12px 48px', display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ marginRight:'auto', color:'#f0b441' }}>~/anshul</span>
          {['home','projects','writings','about'].map(t => (
            <button key={t} className={`vc-tab ${tab===t?'on':''}`} onClick={() => setTab(t)}>:{t}</button>
          ))}
        </div>
      </nav>

      {tab === 'home' && (
        <section className="vc-section" style={{ paddingTop:64, paddingBottom:64 }}>
          <div className="vc-prompt vc-meta" style={{ marginBottom:14 }}>whoami</div>
          <h1 className="vc-h1">Anshul Dhawan<span className="vc-cursor" /></h1>
          <p style={{ marginTop:8, color:'#cfc6a8', fontSize:15.5 }}>
            <span className="vc-amber">&gt;</span> generalist &amp; game developer.<br/>
            <span className="vc-amber">&gt;</span> product · growth · analytics · ai
          </p>

          <div className="vc-rule">{'═'.repeat(60)}</div>

          <div className="vc-prompt vc-meta">ls ~/</div>
          <div className="vc-stack" style={{ marginTop:10 }}>
            <button onClick={() => setTab('projects')} className="vc-frame" style={{ width:'100%', textAlign:'left', cursor:'pointer', color:'inherit', font:'inherit', background:'transparent' }}>
              <span className="lab">DIR</span>
              <div className="vc-row">
                <span className="vc-amber">drwxr-xr-x</span>
                <span style={{ fontSize:16 }}>projects/</span>
                <span className="vc-meta" style={{ marginLeft:'auto' }}>{data.projects.length} items</span>
              </div>
              <div className="vc-meta" style={{ marginTop:4 }}>// six things, all treated equally</div>
            </button>
            <button onClick={() => setTab('writings')} className="vc-frame" style={{ width:'100%', textAlign:'left', cursor:'pointer', color:'inherit', font:'inherit', background:'transparent' }}>
              <span className="lab">DIR</span>
              <div className="vc-row">
                <span className="vc-amber">drwxr-xr-x</span>
                <span style={{ fontSize:16 }}>writings/</span>
                <span className="vc-meta" style={{ marginLeft:'auto' }}>{data.writings.length} items</span>
              </div>
              <div className="vc-meta" style={{ marginTop:4 }}>// notes from the field</div>
            </button>
            <button onClick={() => setTab('about')} className="vc-frame" style={{ width:'100%', textAlign:'left', cursor:'pointer', color:'inherit', font:'inherit', background:'transparent' }}>
              <span className="lab">FILE</span>
              <div className="vc-row">
                <span className="vc-amber">-rw-r--r--</span>
                <span style={{ fontSize:16 }}>about.md</span>
              </div>
              <div className="vc-meta" style={{ marginTop:4 }}>// who, what, where</div>
            </button>
          </div>

          <div className="vc-rule">{'═'.repeat(60)}</div>
          <div className="vc-prompt vc-meta">cat ./contact</div>
          <div style={{ marginTop:8, display:'flex', gap:18, flexWrap:'wrap' }}>
            {data.links.map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="vc-link">{l.label.toLowerCase()} ↗</a>
            ))}
          </div>
        </section>
      )}

      {tab === 'projects' && (
        <section className="vc-section" style={{ paddingTop:48, paddingBottom:64 }}>
          <div className="vc-prompt vc-meta" style={{ marginBottom:6 }}>ls ./projects</div>
          <h2 className="vc-h2">// {data.projects.length} entries · sorted: equal</h2>
          <div className="vc-rule">{'─'.repeat(60)}</div>
          <div className="vc-stack">
            {data.projects.map((p, i) => <Project key={p.title} p={p} i={i} />)}
          </div>
        </section>
      )}

      {tab === 'writings' && (
        <section className="vc-section" style={{ paddingTop:48, paddingBottom:64 }}>
          <div className="vc-prompt vc-meta" style={{ marginBottom:6 }}>ls ./writings</div>
          <h2 className="vc-h2">// {data.writings.length} entries</h2>
          <div className="vc-rule">{'─'.repeat(60)}</div>
          <div className="vc-stack">
            {data.writings.map((w, i) => (
              <article key={w.title} className="vc-frame">
                <span className="lab">POST_{String(i+1).padStart(2,'0')}</span>
                <div className="vc-meta">{w.date}</div>
                <h3 style={{ margin:'4px 0 8px', fontSize:18, fontWeight:500, color:'#fbf3d8' }}>{w.title}</h3>
                <p style={{ margin:0, color:'#cfc6a8' }}>{w.blurb}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === 'about' && (
        <section className="vc-section" style={{ paddingTop:48, paddingBottom:64 }}>
          <div className="vc-prompt vc-meta" style={{ marginBottom:6 }}>cat about.md</div>
          <h2 className="vc-h2">// who is anshul</h2>
          <div className="vc-rule">{'─'.repeat(60)}</div>
          <div style={{ fontSize:15, color:'#cfc6a8' }}>
            {data.about.map((p, i) => <p key={i} style={{ margin:'0 0 14px' }}>{p}</p>)}
          </div>
          <div className="vc-rule">{'─'.repeat(60)}</div>
          <div className="vc-prompt vc-meta">ls ./contact</div>
          <div style={{ marginTop:8, display:'flex', gap:18, flexWrap:'wrap' }}>
            {data.links.map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="vc-link">{l.label.toLowerCase()} ↗</a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

window.VariantC = VariantC;
