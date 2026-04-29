// Subtle cursor-trail particle component.
// Variant: 'spark' (neon dots), 'pixel' (chunky pixel squares), 'binary' (01 chars).
// Stays out of the way of reading: low alpha, fast fade, ignores pointer events.

function CursorTrail({ variant = 'spark', color = '#7cf2a0', container = null }) {
  const canvasRef = React.useRef(null);
  const particles = React.useRef([]);
  const raf = React.useRef(0);
  const last = React.useRef({ x: 0, y: 0, t: 0 });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const target = container || canvas.parentElement;

    function resize() {
      const r = target.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      canvas.style.width = r.width + 'px';
      canvas.style.height = r.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(target);

    function onMove(e) {
      const r = target.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const now = performance.now();
      const dx = x - last.current.x;
      const dy = y - last.current.y;
      const speed = Math.hypot(dx, dy);
      // Only spawn when actually moving — keeps it quiet at rest.
      if (speed > 1.2 && now - last.current.t > 8) {
        const count = variant === 'binary' ? 1 : Math.min(3, 1 + (speed | 0) / 8);
        for (let i = 0; i < count; i++) {
          particles.current.push({
            x: x + (Math.random() - 0.5) * 4,
            y: y + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6 - 0.2,
            life: 1,
            decay: 0.025 + Math.random() * 0.02,
            size: variant === 'pixel' ? 3 : variant === 'binary' ? 10 : 1.6 + Math.random() * 1.4,
            char: variant === 'binary' ? (Math.random() > 0.5 ? '1' : '0') : null,
          });
        }
        last.current = { x, y, t: now };
      } else {
        last.current = { ...last.current, x, y };
      }
    }
    target.addEventListener('mousemove', onMove);

    function tick() {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      const ps = particles.current;
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) {
          ps.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, p.life) * 0.85;
        if (variant === 'pixel') {
          ctx.fillStyle = color;
          // pixel-art look: snap to integer
          ctx.fillRect((p.x | 0), (p.y | 0), p.size, p.size);
        } else if (variant === 'binary') {
          ctx.fillStyle = color;
          ctx.font = '11px ui-monospace, "JetBrains Mono", monospace';
          ctx.fillText(p.char, p.x, p.y);
        } else {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf.current);
      target.removeEventListener('mousemove', onMove);
      ro.disconnect();
    };
  }, [variant, color, container]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  );
}

window.CursorTrail = CursorTrail;
