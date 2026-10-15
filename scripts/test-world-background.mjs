// Dependency-free lifecycle checks: node scripts/test-world-background.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../project/site/world-background.js', import.meta.url), 'utf8');

class Events {
  listeners = new Map();
  addEventListener(name, callback) {
    if (!this.listeners.has(name)) this.listeners.set(name, new Set());
    this.listeners.get(name).add(callback);
  }
  removeEventListener(name, callback) { this.listeners.get(name)?.delete(callback); }
  emit(name, event = {}) { for (const callback of this.listeners.get(name) || []) callback(event); }
  get count() { return [...this.listeners.values()].reduce((sum, set) => sum + set.size, 0); }
}

async function setup({ reduced = false, fine = true, saveData = false, blocked = false } = {}) {
  const window = new Events(), document = new Events();
  const motion = Object.assign(new Events(), { matches: reduced });
  const pointer = Object.assign(new Events(), { matches: fine });
  const connection = Object.assign(new Events(), { saveData });
  const queue = new Map(), contexts = [], media = [];
  let id = 0, now = 1000;
  class Element {
    constructor(interactive = false) { this.interactive = interactive; }
    closest() { return this.interactive ? this : null; }
  }
  function makeCanvas() {
    const context = {
      glyphs: 0, paints: 0,
      setTransform() {}, fillText() {},
      fillRect() { this.paints++; },
      drawImage() { this.glyphs++; },
      getImageData: () => ({ data: new Uint8ClampedArray(400 * 200 * 4).fill(150) }),
    };
    contexts.push(context);
    return { width: 0, height: 0, clientWidth: 1280, clientHeight: 720, getContext: () => context };
  }
  const canvas = makeCanvas();
  document.hidden = false;
  document.documentElement = new Events();
  document.createElement = (tag) => {
    if (tag === 'canvas') return makeCanvas();
    const video = {
      paused: true, readyState: 0, videoWidth: 480, videoHeight: 270,
      play() {
        if (blocked) return Promise.reject(new Error('Autoplay blocked'));
        this.paused = false;
        this.readyState = 2;
        return Promise.resolve();
      },
      pause() { this.paused = true; },
      getAttribute(name) { return this[name]; },
      removeAttribute(name) { delete this[name]; },
      load() {},
    };
    media.push(video);
    return video;
  };
  const sandbox = {
    window, document, navigator: { connection }, Element,
    Image: class { complete = true; naturalWidth = 480; naturalHeight = 270; },
    matchMedia: (query) => query.includes('reduced-motion') ? motion : pointer,
    performance: { now: () => now },
    requestAnimationFrame: (callback) => { queue.set(++id, callback); return id; },
    cancelAnimationFrame: (key) => queue.delete(key),
  };
  vm.runInNewContext(source, sandbox);
  const dispose = window.createSiteWorld(canvas);
  await Promise.resolve();
  async function tick(count = 1) {
    for (let step = 0; step < count; step++) {
      now += 50;
      const callbacks = [...queue.values()];
      queue.clear();
      callbacks.forEach(callback => callback(now));
      await Promise.resolve();
    }
  }
  const event = (interactive = false) => ({ clientX: 130, clientY: 340, pointerType: 'mouse', button: 0, isPrimary: true, target: new Element(interactive) });
  const cleanup = () => {
    dispose();
    assert.equal(queue.size, 0, 'Cleanup cancels pending animation');
    assert.equal(window.count + document.count + document.documentElement.count + motion.count + pointer.count + connection.count, 0, 'Cleanup removes every listener');
    assert.equal(media[0].paused, true);
    assert.equal(media[0].src, undefined, 'Cleanup releases the video');
    assert.equal(canvas.width, 0, 'Cleanup releases canvas storage');
  };
  return { window, document, motion, pointer, connection, queue, canvas, context: contexts[0], video: media[0], event, tick, cleanup };
}

for (const options of [{ reduced: true }, { fine: false }, { saveData: true }]) {
  const test = await setup(options);
  await test.tick(3);
  assert.ok(test.context.glyphs > 0, 'Static fallback paints characters');
  assert.equal(test.video.src, undefined, 'Static preferences never request video');
  assert.equal(test.queue.size, 0, 'Static fallback rests');
  test.window.emit('pointermove', test.event());
  test.window.emit('pointerdown', test.event());
  assert.equal(test.queue.size, 0, 'Static preferences suppress pointer animation');
  test.cleanup();
}

const live = await setup();
await live.tick(2);
assert.ok(live.context.glyphs > 0, 'Video frames paint characters');
assert.equal(live.video.paused, false);
assert.equal(live.queue.size, 1, 'Animation keeps a single pending frame');
live.document.hidden = true;
live.document.emit('visibilitychange');
assert.equal(live.video.paused, true, 'Hidden tabs pause video');
assert.equal(live.queue.size, 0, 'Hidden tabs stop drawing');
live.document.hidden = false;
live.document.emit('visibilitychange');
await live.tick();
assert.equal(live.video.paused, false, 'Visible tabs resume playback');
live.motion.matches = true;
live.motion.emit('change');
await live.tick(2);
assert.equal(live.video.paused, true, 'Changing reduced motion pauses playback');
assert.equal(live.queue.size, 0, 'Changing reduced motion stops drawing');
live.cleanup();

const fallback = await setup({ blocked: true });
await fallback.tick(3);
assert.equal(fallback.queue.size, 0, 'Blocked autoplay settles into a static view');
fallback.window.emit('pointerdown', fallback.event(true));
assert.equal(fallback.queue.size, 0, 'Interactive controls do not trigger ripples');
fallback.window.emit('pointerdown', fallback.event());
assert.equal(fallback.queue.size, 1, 'Empty-space clicks trigger a ripple');
await fallback.tick(30);
assert.equal(fallback.queue.size, 0, 'Ripples expire and stop drawing');
fallback.window.emit('pointermove', fallback.event());
assert.equal(fallback.queue.size, 1, 'Pointer trails work without video playback');
await fallback.tick(45);
assert.equal(fallback.queue.size, 0, 'Trails fade and parallax settles');
fallback.canvas.clientWidth = 390;
fallback.canvas.clientHeight = 844;
fallback.window.emit('resize');
await fallback.tick(2);
assert.equal(fallback.canvas.width, 390, 'Canvas follows responsive dimensions');
fallback.video.onerror();
await fallback.tick(2);
assert.equal(fallback.queue.size, 0, 'Video errors retain a resting fallback');
fallback.cleanup();

console.log('ASCII background checks passed: rendering, static preferences, autoplay fallback, pointer effects, visibility, resize, and cleanup.');
