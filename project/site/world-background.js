// Xbox Labs-inspired ASCII footage, phosphor trails, and click shockwaves.
// Uses our own game footage, a cached glyph atlas, and no rendering dependencies.
window.createSiteWorld = function createWorld(canvas) {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canvas is unavailable');

  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const pointerQuery = matchMedia('(hover: hover) and (pointer: fine)');
  const connection = navigator.connection;
  const sample = document.createElement('canvas');
  const sampleCtx = sample.getContext('2d', { willReadFrequently: true });
  if (!sampleCtx) throw new Error('Canvas sampling is unavailable');
  const atlas = document.createElement('canvas');
  const atlasCtx = atlas.getContext('2d');
  if (!atlasCtx) throw new Error('Canvas glyphs are unavailable');
  const poster = new Image();
  const video = document.createElement('video');
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'none';

  const glyphs = ' .,:;i!+*?%#@';
  const trailLife = 1100, rippleLife = 1250;
  const trails = [], ripples = [];
  let width = 0, height = 0, columns = 0, rows = 0, cellW = 7, cellH = 11;
  let frame = 0, lastFrame = 0, lastTime = 0, disposed = false;
  let leanX = 0, leanY = 0, targetX = 0, targetY = 0;
  let lastPointer = null, videoFailed = false;
  let cells = [], energy = new Float32Array(0), blast = new Float32Array(0);

  const animated = () => !motionQuery.matches && pointerQuery.matches && !connection?.saveData;
  const hash = (x, y) => {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return n - Math.floor(n);
  };
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function buildAtlas(ratio) {
    atlas.width = Math.ceil(cellW * ratio) * glyphs.length;
    atlas.height = Math.ceil(cellH * ratio) * 2;
    atlasCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
    atlasCtx.font = `${cellH - 1}px ui-monospace, Menlo, Consolas, monospace`;
    atlasCtx.textAlign = 'center';
    atlasCtx.textBaseline = 'middle';
    for (let row = 0; row < 2; row++) {
      atlasCtx.fillStyle = row ? '#a5ffb0' : '#a0bc9b';
      for (let i = 1; i < glyphs.length; i++) {
        atlasCtx.fillText(glyphs[i], (i + .5) * atlas.width / glyphs.length / ratio,
          (row + .5) * atlas.height / 2 / ratio);
      }
    }
  }

  function resize() {
    width = Math.max(1, canvas.clientWidth);
    height = Math.max(1, canvas.clientHeight);
    cellW = Math.max(width < 600 ? 8 : 7, Math.ceil(width / 220));
    cellH = Math.max(11, Math.ceil(height / 135));
    columns = Math.ceil(width / cellW);
    rows = Math.ceil(height / cellH);
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    sample.width = columns;
    sample.height = rows;
    buildAtlas(ratio);
    cells = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const x = col * cellW, y = row * cellH;
        // Keep the reading column quiet; let the margins carry the picture.
        const margin = clamp((Math.abs(x - width / 2) - Math.min(270, width * .28)) / 170, 0, 1);
        cells.push({ x, y, noise: hash(col, row), shade: .26 + margin * .74 });
      }
    }
    energy = new Float32Array(cells.length);
    blast = new Float32Array(cells.length);
    trails.length = ripples.length = 0;
    lastPointer = null;
    schedule();
  }

  function addEnergy(x, y, radius, strength, ring = false) {
    const fromCol = Math.max(0, Math.floor((x - radius - 24) / cellW));
    const toCol = Math.min(columns - 1, Math.ceil((x + radius + 24) / cellW));
    const fromRow = Math.max(0, Math.floor((y - radius - 24) / cellH));
    const toRow = Math.min(rows - 1, Math.ceil((y + radius + 24) / cellH));
    for (let row = fromRow; row <= toRow; row++) {
      for (let col = fromCol; col <= toCol; col++) {
        const i = row * columns + col, cell = cells[i];
        const distance = Math.hypot(cell.x - x, cell.y - y);
        const reach = ring ? Math.max(0, 1 - Math.abs(distance - radius) / 24)
          : Math.max(0, 1 - distance / radius);
        const value = reach * reach * strength;
        energy[i] = Math.min(1, energy[i] + value);
        if (ring) blast[i] = Math.max(blast[i], value);
      }
    }
  }

  function sampleMedia() {
    const source = animated() && !video.paused && video.readyState >= 2 && !videoFailed
      ? video : poster.complete && poster.naturalWidth ? poster : null;
    if (!source) return null;
    const sw = source.videoWidth || source.naturalWidth;
    const sh = source.videoHeight || source.naturalHeight;
    const scale = Math.max(width / sw, height / sh) * 1.08;
    const cropW = width / scale, cropH = height / scale;
    const sx = (sw - cropW) * (.5 + leanX * .3);
    const sy = (sh - cropH) * (.5 + leanY * .3);
    sampleCtx.drawImage(source, sx, sy, cropW, cropH, 0, 0, columns, rows);
    return sampleCtx.getImageData(0, 0, columns, rows).data;
  }

  function draw(time) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#0b100a';
    ctx.fillRect(0, 0, width, height);
    const pixels = sampleMedia();
    energy.fill(0);
    blast.fill(0);
    for (let i = trails.length - 1; i >= 0; i--) {
      const stamp = trails[i], life = 1 - (time - stamp.t) / trailLife;
      if (life <= 0) { trails.splice(i, 1); continue; }
      addEnergy(stamp.x, stamp.y, 64 * (.35 + life * .65), life * .65);
    }
    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i], age = (time - ripple.t) / rippleLife;
      if (age >= 1) { ripples.splice(i, 1); continue; }
      addEnergy(ripple.x, ripple.y, 250 * (1 - Math.pow(1 - age, 2)), (1 - age) * .95, true);
    }

    const glyphW = atlas.width / glyphs.length, glyphH = atlas.height / 2;
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i], offset = i * 4;
      const luma = pixels ? (pixels[offset] * .2126 + pixels[offset + 1] * .7152 + pixels[offset + 2] * .0722) / 255
        : .06 + .08 * cell.noise;
      const brightness = clamp((luma - .045) * 1.65, 0, 1);
      const glow = energy[i];
      const density = clamp(brightness * .85 + glow * .75, 0, 1);
      let glyph = Math.floor(density * (glyphs.length - 1));
      // A ripple briefly decodes the picture into scattered characters.
      if (blast[i] > .08) glyph = 2 + Math.floor(hash(i, Math.floor(time / 80)) * (glyphs.length - 2));
      if (!glyph) continue;
      const alpha = clamp((.10 + brightness * .39 + glow * .8) * cell.shade, 0, .9);
      ctx.globalAlpha = alpha;
      const kick = blast[i] * 16;
      if (glow > .12) {
        ctx.fillStyle = `rgba(94,255,117,${glow * .12})`;
        ctx.fillRect(cell.x, cell.y, cellW, cellH);
      }
      ctx.drawImage(atlas, glyph * glyphW, glow > .08 ? glyphH : 0, glyphW, glyphH,
        cell.x + (cell.noise - .5) * kick, cell.y - kick * .4, cellW, cellH);
    }
    ctx.globalAlpha = 1;
  }

  function render(time) {
    frame = 0;
    if (disposed || document.hidden) return;
    // 24fps is plenty for a decorative character grid and limits CPU use.
    if (time - lastFrame < 1000 / 24) { schedule(); return; }
    const dt = Math.min(100, time - (lastTime || time - 16));
    const blend = 1 - Math.exp(-dt / 180);
    lastFrame = lastTime = time;
    leanX += (targetX - leanX) * blend;
    leanY += (targetY - leanY) * blend;
    draw(time);
    if ((animated() && !video.paused) || trails.length || ripples.length
      || Math.abs(targetX - leanX) + Math.abs(targetY - leanY) > .001) schedule();
  }

  function schedule() {
    if (!disposed && !document.hidden && !frame) frame = requestAnimationFrame(render);
  }

  function move(event) {
    if (!animated() || event.pointerType === 'touch') return;
    targetX = clamp(event.clientX / width * 2 - 1, -1, 1);
    targetY = clamp(event.clientY / height * 2 - 1, -1, 1);
    const now = performance.now();
    const distance = lastPointer ? Math.hypot(event.clientX - lastPointer.x, event.clientY - lastPointer.y) : 0;
    if (lastPointer && distance < 3 && now - lastPointer.t < 32) return;
    // Interpolate short gaps so fast movement leaves one continuous glow.
    const steps = lastPointer && now - lastPointer.t < 120 ? Math.min(16, Math.ceil(distance / 12)) : 1;
    for (let step = 1; step <= Math.max(1, steps); step++) {
      const mix = step / Math.max(1, steps);
      trails.push({ x: lastPointer ? lastPointer.x + (event.clientX - lastPointer.x) * mix : event.clientX,
        y: lastPointer ? lastPointer.y + (event.clientY - lastPointer.y) * mix : event.clientY, t: now });
    }
    if (trails.length > 64) trails.splice(0, trails.length - 64);
    lastPointer = { x: event.clientX, y: event.clientY, t: now };
    schedule();
  }

  function click(event) {
    if (!animated() || event.pointerType === 'touch' || event.button !== 0 || event.isPrimary === false) return;
    if (event.target instanceof Element && event.target.closest('a, button, input, select, textarea, label, video, [role="button"], [contenteditable]')) return;
    ripples.push({ x: event.clientX, y: event.clientY, t: performance.now() });
    if (ripples.length > 4) ripples.shift();
    schedule();
  }

  function reset() {
    targetX = targetY = 0;
    lastPointer = null;
    schedule();
  }

  function syncPlayback() {
    if (disposed) return;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastTime = lastFrame = 0;
    if (!animated() || document.hidden) {
      video.pause();
      trails.length = ripples.length = 0;
      leanX = leanY = targetX = targetY = 0;
    } else if (!videoFailed) {
      if (!video.getAttribute('src')) video.src = '/assets/videos/ascii-background.mp4';
      video.play().then(schedule).catch(() => { if (!disposed) schedule(); });
    }
    schedule();
  }

  poster.onload = schedule;
  poster.onerror = schedule;
  poster.src = '/assets/posters/ascii-background.jpg';
  video.onloadeddata = schedule;
  video.onplaying = schedule;
  video.onerror = () => { videoFailed = true; video.pause(); schedule(); };
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointerdown', click, { passive: true });
  window.addEventListener('blur', reset);
  window.addEventListener('resize', resize, { passive: true });
  document.documentElement.addEventListener('pointerleave', reset);
  document.addEventListener('visibilitychange', syncPlayback);
  motionQuery.addEventListener('change', syncPlayback);
  pointerQuery.addEventListener('change', syncPlayback);
  connection?.addEventListener('change', syncPlayback);
  resize();
  syncPlayback();

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerdown', click);
    window.removeEventListener('blur', reset);
    window.removeEventListener('resize', resize);
    document.documentElement.removeEventListener('pointerleave', reset);
    document.removeEventListener('visibilitychange', syncPlayback);
    motionQuery.removeEventListener('change', syncPlayback);
    pointerQuery.removeEventListener('change', syncPlayback);
    connection?.removeEventListener('change', syncPlayback);
    poster.onload = poster.onerror = video.onloadeddata = video.onplaying = video.onerror = null;
    video.pause();
    video.removeAttribute('src');
    video.load();
    canvas.width = canvas.height = sample.width = sample.height = atlas.width = atlas.height = 0;
  };
};
