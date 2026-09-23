// A small, dependency-free 3D renderer. Geometry is projected through a moving
// perspective camera; the canvas is decorative and never captures page input.
window.createSiteWorld = function createWorld(canvas) {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canvas is unavailable');

  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const pointerQuery = matchMedia('(pointer: fine)');
  let width = 0, height = 0, frame = 0, disposed = false;
  let x = 0, y = 0, targetX = 0, targetY = 0;
  let lastTime = 0;
  const vertices = [], triangles = [], stars = [], orbits = [];
  let seed = 73;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  // A quiet valley between two ridges, with a triangulated arcade landscape.
  const columns = 45, rows = 43;
  for (let row = 0; row < rows; row++) {
    const z = 10 - row * 3;
    for (let col = 0; col < columns; col++) {
      const vx = (col - (columns - 1) / 2) * 3;
      const ridge = Math.pow(Math.max(0, Math.sin(vx * .105 + .4)), 2);
      const valley = Math.min(1, Math.max(0, (Math.abs(vx) - 7) / 18));
      const elevation = valley * (3 + ridge * 9 + Math.sin(z * .13 + vx * .06) * 3);
      vertices.push([vx, -5 + elevation + valley * random() * 1.8, z]);
      if (row && col) {
        const i = row * columns + col;
        triangles.push([i - columns - 1, i - columns, i]);
        triangles.push([i - columns - 1, i, i - 1]);
      }
    }
  }
  for (let i = 0; i < 150; i++) {
    stars.push([[(random() - .5) * 300, 12 + random() * 100, -80 - random() * 120], random()]);
  }
  // Wireframe planet and inclined orbital ring, positioned beyond the terrain.
  const planet = [-37, 13, -68], radius = 7.5;
  for (let latitude = -3; latitude <= 3; latitude++) {
    const phi = latitude * Math.PI / 8;
    const line = [];
    for (let i = 0; i <= 64; i++) {
      const theta = i / 64 * Math.PI * 2;
      line.push([planet[0] + Math.cos(theta) * Math.cos(phi) * radius,
        planet[1] + Math.sin(phi) * radius,
        planet[2] + Math.sin(theta) * Math.cos(phi) * radius]);
    }
    orbits.push(line);
  }
  for (let longitude = 0; longitude < 6; longitude++) {
    const angle = longitude * Math.PI / 6;
    const line = [];
    for (let i = 0; i <= 64; i++) {
      const theta = i / 64 * Math.PI * 2;
      line.push([planet[0] + Math.cos(theta) * Math.cos(angle) * radius,
        planet[1] + Math.sin(theta) * radius,
        planet[2] + Math.cos(theta) * Math.sin(angle) * radius]);
    }
    orbits.push(line);
  }
  const ring = [];
  for (let i = 0; i <= 96; i++) {
    const angle = i / 96 * Math.PI * 2;
    ring.push([planet[0] + Math.cos(angle) * 13,
      planet[1] + Math.cos(angle) * 3 + Math.sin(angle) * 1.5,
      planet[2] + Math.sin(angle) * 13]);
  }
  orbits.push(ring);

  function draw() {
    const focal = Math.max(width, height) * .8;
    const cameraX = x * 5, cameraY = 6 + y * 2;
    const yaw = -x * .065, pitch = -.065 - y * .035;
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const project = ([vx, vy, vz]) => {
      const dx = vx - cameraX, dy = vy - cameraY, dz = 28 - vz;
      const rx = dx * cy + dz * sy, rz = dz * cy - dx * sy;
      const ry = dy * cp - rz * sp, depth = rz * cp + dy * sp;
      if (depth <= 1) return null;
      return [width / 2 + rx * focal / depth, height * .46 - ry * focal / depth, depth];
    };

    ctx.fillStyle = '#070e0e';
    ctx.fillRect(0, 0, width, height);
    const glow = ctx.createRadialGradient(width * .5, height * .46, 0, width * .5, height * .46, width * .7);
    glow.addColorStop(0, '#122c25');
    glow.addColorStop(.5, '#0a1917');
    glow.addColorStop(1, '#070e0e');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    stars.forEach(([vertex, brightness]) => {
      const p = project(vertex);
      if (!p) return;
      ctx.fillStyle = `rgba(174,236,212,${.2 + brightness * .5})`;
      const size = brightness > .92 ? 2 : 1;
      ctx.fillRect(p[0], p[1], size, size);
    });
    orbits.forEach((line, index) => {
      ctx.beginPath();
      line.forEach((vertex, i) => {
        const p = project(vertex);
        if (p) { if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); }
      });
      ctx.strokeStyle = index === orbits.length - 1 ? 'rgba(148,240,200,.45)' : 'rgba(124,242,160,.16)';
      ctx.lineWidth = index === orbits.length - 1 ? 1.3 : .7;
      ctx.stroke();
    });

    const projected = vertices.map(project);
    // Painter's order handles overlapping ridges as the camera moves.
    const faces = triangles.map(indices => ({
      points: indices.map(i => projected[i]),
      depth: indices.reduce((sum, i) => sum + (projected[i] ? projected[i][2] : 0), 0) / 3,
      elevation: indices.reduce((sum, i) => sum + vertices[i][1], 0) / 3,
    })).sort((a, b) => b.depth - a.depth);
    ctx.lineWidth = .65;
    faces.forEach(({ points, depth, elevation }) => {
      if (points.some(p => !p)) return;
      if (points.every(p => p[0] < 0) || points.every(p => p[0] > width) || points.every(p => p[1] > height)) return;
      const fog = Math.max(.08, 1 - depth / 160);
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      ctx.lineTo(points[1][0], points[1][1]);
      ctx.lineTo(points[2][0], points[2][1]);
      ctx.closePath();
      ctx.fillStyle = `rgb(${7 + elevation * .2},${20 + fog * 10 + elevation * .5},${18 + fog * 6})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(100,220,157,${fog * .36})`;
      ctx.stroke();
    });
  }

  function render(time) {
    frame = 0;
    if (disposed || document.hidden) return;
    const blend = 1 - Math.exp(-Math.min(64, time - (lastTime || time - 16)) / 110);
    lastTime = time;
    x += (targetX - x) * blend;
    y += (targetY - y) * blend;
    draw();
    if (Math.abs(targetX - x) + Math.abs(targetY - y) > .0005) schedule();
  }
  function schedule() {
    if (!frame && !disposed && !document.hidden) frame = requestAnimationFrame(render);
  }
  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    schedule();
  }
  function move(event) {
    if (motionQuery.matches || !pointerQuery.matches || event.pointerType === 'touch') return;
    targetX = Math.max(-1, Math.min(1, event.clientX / width * 2 - 1));
    targetY = Math.max(-1, Math.min(1, event.clientY / height * 2 - 1));
    schedule();
  }
  function reset() {
    targetX = targetY = 0;
    if (motionQuery.matches || !pointerQuery.matches) x = y = 0;
    schedule();
  }
  function visibility() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    if (!document.hidden) reset();
  }
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('blur', reset);
  window.addEventListener('resize', resize, { passive: true });
  document.documentElement.addEventListener('pointerleave', reset);
  document.addEventListener('visibilitychange', visibility);
  motionQuery.addEventListener('change', reset);
  pointerQuery.addEventListener('change', reset);
  resize();

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    window.removeEventListener('pointermove', move);
    window.removeEventListener('blur', reset);
    window.removeEventListener('resize', resize);
    document.documentElement.removeEventListener('pointerleave', reset);
    document.removeEventListener('visibilitychange', visibility);
    motionQuery.removeEventListener('change', reset);
    pointerQuery.removeEventListener('change', reset);
    canvas.width = canvas.height = 0;
  };
};
