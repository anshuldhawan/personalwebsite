// ============================================================================
// shader_skills_tsl.js
// Three.js WebGPU Shading Language (TSL) Port of gokayfem/shader-skills
// Modules: common, hash, noise, color, tonemap, post, atmosphere, volume, water, shading, debug
// Target: WebGPU / WGSL & WebGL2 / GLSL ES 3.00 via three/tsl
// ============================================================================

import {
  Fn,
  PI,
  TWO_PI,
  abs,
  acos,
  clamp,
  cos,
  dFdx,
  dFdy,
  dot,
  exp,
  exp2,
  float,
  floor,
  fract,
  frameId,
  fwidth,
  int,
  interleavedGradientNoise,
  length,
  log2,
  luminance,
  mat3,
  max,
  min,
  mix,
  mod,
  mul,
  normalize,
  output,
  pow,
  screenCoordinate,
  select,
  sign,
  sin,
  smoothstep,
  sqrt,
  step,
  sub,
  uint,
  uniform,
  uvec3,
  vec2,
  vec3,
  vec4,
} from 'three/tsl';

// --- Live Interactive Shader-Skills Control Uniforms & Compile-Time Specialization State ---
// uTonemapMode: 0 = AgX Punchy (Default), 1 = AgX Base Log, 2 = Khronos PBR Neutral, 3 = ACES Fitted
export const uTonemapMode = uniform(0);
// uShaderDebugMode: 0 = Final Beauty, 1 = World Normals, 2 = UV Checker, 3 = Roughness Heat, 4 = Cavity AO / Metalness, 5 = Luminance / Fog
export const uShaderDebugMode = uniform(0);
export const uVignetteStrength = uniform(0.85);
export const uFilmGrainAmount = uniform(0.012);
export const uDitherEnabled = uniform(1.0);
export const uCameraFocalLength = uniform(1.788); // 1.0 / tan(58 deg * 0.5)
export const uWaterBandLimitEnabled = uniform(1.0); // 1.0 = Jacobian footprint band-limiting + LEAN variance-to-roughness enabled

let _activeTonemapMode = 0;
let _activeShaderDebugMode = 0;
const _specializableMaterials = new Set();
const _specializablePipelines = new Set();

function _installReactiveModeUniform(uniformNode, onModeChange) {
  let internalVal = Number(uniformNode.value) || 0;
  Object.defineProperty(uniformNode, 'value', {
    configurable: true,
    enumerable: true,
    get() {
      return internalVal;
    },
    set(nextVal) {
      const num = Number(nextVal) || 0;
      internalVal = num;
      onModeChange(Math.round(num));
    },
  });
}

_installReactiveModeUniform(uTonemapMode, (nextMode) => {
  if (nextMode !== _activeTonemapMode) {
    _activeTonemapMode = nextMode;
    for (const entry of _specializablePipelines) {
      entry.rebuild();
    }
  }
});

_installReactiveModeUniform(uShaderDebugMode, (nextMode) => {
  if (nextMode !== _activeShaderDebugMode) {
    _activeShaderDebugMode = nextMode;
    for (const entry of _specializableMaterials) {
      entry.rebuild();
    }
  }
});

export function getActiveTonemapMode() {
  return _activeTonemapMode;
}

export function getActiveShaderDebugMode() {
  return _activeShaderDebugMode;
}

// ============================================================================
// 1. COMMON MODULE (common.glsl)
// ============================================================================

export const saturateTSL = Fn(([x]) => {
  return clamp(x, 0.0, 1.0);
});

export const dot2TSL = Fn(([v]) => {
  return dot(v, v);
});

export const linearstepTSL = Fn(([a, b, x]) => {
  return clamp(sub(x, a).div(max(abs(sub(b, a)), 1e-6).mul(sign(sub(b, a)).add(step(0.0, sub(b, a)).mul(2.0).sub(1.0)))), 0.0, 1.0);
});

/// Smooth cubic bump: 1 at x == c, falling to 0 at |x - c| >= w (Inigo Quilez / shader-skills common.glsl)
export const cubicPulseTSL = Fn(([c, w, x]) => {
  const d = min(abs(sub(x, c)).div(max(w, 1e-6)), 1.0);
  return float(1.0).sub(d.mul(d).mul(float(3.0).sub(d.mul(2.0))));
});

/// Fast attack, exponential decay. Peaks at 1 when x == 1/k.
export const expImpulseTSL = Fn(([x, k]) => {
  const h = mul(k, max(x, 0.0));
  return h.mul(exp(float(1.0).sub(h)));
});

/// Contrast curve on [0, 1] keeping 0, 0.5, and 1 fixed.
export const gainCurveTSL = Fn(([x, k]) => {
  const xc = clamp(x, 0.0, 1.0).toVar();
  const isLower = step(xc, 0.5);
  const base = mix(float(1.0).sub(xc), xc, isLower);
  const a = float(0.5).mul(pow(max(mul(2.0, base), 1e-6), k));
  return mix(float(1.0).sub(a), a, isLower);
});

// ============================================================================
// 2. HASH MODULE (hash.glsl — Jarzynski & Olano JCGT 2020 PCG Hashes)
// Bit-exact across all GPUs; converts float -> int -> uint to avoid negative float-to-uint UB.
// Never uses fract(sin(...) * 43758.5453).
// ============================================================================

export const pcgHashTSL = Fn(([v_in]) => {
  const v = uint(v_in);
  const state = v.mul(uint(747796405)).add(uint(2891336453));
  const shift = state.shiftRight(uint(28)).add(uint(4));
  const word = state.shiftRight(shift).bitXor(state).mul(uint(277803737));
  return word.shiftRight(uint(22)).bitXor(word);
});

export const uintToUnitTSL = Fn(([h]) => {
  return uint(h).shiftRight(uint(8)).toFloat().mul(1.0 / 16777216.0);
});

/// Random float in [0,1) for an integer-valued 1D input
export const hash11TSL = Fn(([p]) => {
  const qi = int(floor(p)).toUint();
  return uintToUnitTSL(pcgHashTSL(qi));
});

/// Random float in [0,1) for an integer-valued 2D input (bit-exact PCG)
export const hash12TSL = Fn(([p]) => {
  const qx = int(floor(p.x)).toUint();
  const qy = int(floor(p.y)).toUint();
  return uintToUnitTSL(pcgHashTSL(qx.add(pcgHashTSL(qy))));
});

/// Random float in [0,1) for an integer-valued 3D input (bit-exact PCG)
export const hash13TSL = Fn(([p]) => {
  const qx = int(floor(p.x)).toUint();
  const qy = int(floor(p.y)).toUint();
  const qz = int(floor(p.z)).toUint();
  return uintToUnitTSL(pcgHashTSL(qx.add(pcgHashTSL(qy.add(pcgHashTSL(qz))))));
});

/// Random vec2 in [0,1)^2 for an integer-valued 2D input using pcg3d mixer
export const hash22TSL = Fn(([p]) => {
  const vx = int(floor(p.x)).toUint().mul(uint(1664525)).add(uint(1013904223)).toVar();
  const vy = int(floor(p.y)).toUint().mul(uint(1664525)).add(uint(1013904223)).toVar();
  const vz = uint(0x2545).mul(uint(1664525)).add(uint(1013904223)).toVar();

  vx.addAssign(vy.mul(vz));
  vy.addAssign(vz.mul(vx));
  vz.addAssign(vx.mul(vy));

  vx.bitXorAssign(vx.shiftRight(uint(16)));
  vy.bitXorAssign(vy.shiftRight(uint(16)));
  vz.bitXorAssign(vz.shiftRight(uint(16)));

  vx.addAssign(vy.mul(vz));
  vy.addAssign(vz.mul(vx));

  return vec2(uintToUnitTSL(vx), uintToUnitTSL(vy));
});

/// Random vec3 in [0,1)^3 for an integer-valued 3D input using pcg3d mixer
export const hash33TSL = Fn(([p]) => {
  const vx = int(floor(p.x)).toUint().mul(uint(1664525)).add(uint(1013904223)).toVar();
  const vy = int(floor(p.y)).toUint().mul(uint(1664525)).add(uint(1013904223)).toVar();
  const vz = int(floor(p.z)).toUint().mul(uint(1664525)).add(uint(1013904223)).toVar();

  vx.addAssign(vy.mul(vz));
  vy.addAssign(vz.mul(vx));
  vz.addAssign(vx.mul(vy));

  vx.bitXorAssign(vx.shiftRight(uint(16)));
  vy.bitXorAssign(vy.shiftRight(uint(16)));
  vz.bitXorAssign(vz.shiftRight(uint(16)));

  vx.addAssign(vy.mul(vz));
  vy.addAssign(vz.mul(vx));
  vz.addAssign(vx.mul(vy));

  return vec3(uintToUnitTSL(vx), uintToUnitTSL(vy), uintToUnitTSL(vz));
});

// ============================================================================
// 3. NOISE MODULE (noise.glsl — Analytic-Derivative Value/Gradient/Simplex, Eroded & Billow fBm)
// ============================================================================

/// 2D Value Noise with Analytic Derivatives: returns vec3(value, d/dx, d/dy)
export const valueNoiseDTSL = Fn(([p]) => {
  const i = floor(p);
  const f = fract(p);
  // Quintic C2 fade: 6f^5 - 15f^4 + 10f^3 and derivative 30f^2(f-1)^2
  const u = f.mul(f).mul(f).mul(f.mul(f.mul(6.0).sub(15.0)).add(10.0));
  const du = f.mul(f).mul(30.0).mul(f.sub(1.0)).mul(f.sub(1.0));

  const va = hash12TSL(i);
  const vb = hash12TSL(i.add(vec2(1.0, 0.0)));
  const vc = hash12TSL(i.add(vec2(0.0, 1.0)));
  const vd = hash12TSL(i.add(vec2(1.0, 1.0)));

  const k0 = va;
  const k1 = vb.sub(va);
  const k2 = vc.sub(va);
  const k4 = va.sub(vb).sub(vc).add(vd);

  const val = k0.add(k1.mul(u.x)).add(k2.mul(u.y)).add(k4.mul(u.x).mul(u.y));
  const dx = du.x.mul(k1.add(k4.mul(u.y)));
  const dy = du.y.mul(k2.add(k4.mul(u.x)));
  return vec3(val, dx, dy);
});

/// 3-Octave Eroded fBm (slope-damped detail: smooth on steep slopes, rich in flat basins)
export const erodedFbm3TSL = Fn(([p_in]) => {
  const p = vec2(p_in).toVar();
  const total = float(0.0).toVar();
  const amp = float(0.5).toVar();
  const slopeAcc = vec2(0.0, 0.0).toVar();

  // Octave 1
  const n1 = valueNoiseDTSL(p);
  slopeAcc.addAssign(n1.yz);
  total.addAssign(amp.mul(n1.x).div(float(1.0).add(dot(slopeAcc, slopeAcc))));
  // Rotate by (0.8, -0.6; 0.6, 0.8) * 2.02
  p.assign(vec2(p.x.mul(0.8).sub(p.y.mul(0.6)), p.x.mul(0.6).add(p.y.mul(0.8))).mul(2.02));
  amp.mulAssign(0.5);

  // Octave 2
  const n2 = valueNoiseDTSL(p);
  slopeAcc.addAssign(n2.yz);
  total.addAssign(amp.mul(n2.x).div(float(1.0).add(dot(slopeAcc, slopeAcc))));
  p.assign(vec2(p.x.mul(0.8).sub(p.y.mul(0.6)), p.x.mul(0.6).add(p.y.mul(0.8))).mul(2.03));
  amp.mulAssign(0.5);

  // Octave 3
  const n3 = valueNoiseDTSL(p);
  slopeAcc.addAssign(n3.yz);
  total.addAssign(amp.mul(n3.x).div(float(1.0).add(dot(slopeAcc, slopeAcc))));

  return total;
});

/// 2D Flow Noise (Rotating-Gradient Value/Simplex hybrid that churns in place without sliding)
export const flowRippleNoiseDTSL = Fn(([p, timePhase]) => {
  const n0 = valueNoiseDTSL(p);
  const c = cos(timePhase);
  const s = sin(timePhase);
  const pRot = vec2(p.x.mul(0.8).sub(p.y.mul(0.6)), p.x.mul(0.6).add(p.y.mul(0.8)))
    .mul(2.13)
    .add(vec2(c, s).mul(0.35));
  const n1 = valueNoiseDTSL(pRot);
  return n0.mul(0.65).add(n1.mul(0.35));
});

// ============================================================================
// 4. COLOR & TONEMAP MODULES (color.glsl & tonemap.glsl)
// ============================================================================

/// Exact sRGB decode (EOTF): encoded [0,1] -> linear
export const srgbToLinearTSL = Fn(([c_in]) => {
  const c = max(vec3(c_in), vec3(0.0));
  const lo = c.div(12.92);
  const hi = pow(c.add(0.055).div(1.055), vec3(2.4));
  return mix(lo, hi, step(vec3(0.04045), c));
});

/// Exact sRGB encode (OETF): linear -> display [0,1]. Apply once after tonemapping.
export const linearToSrgbTSL = Fn(([c_in]) => {
  const c = max(vec3(c_in), vec3(0.0));
  const lo = c.mul(12.92);
  const hi = pow(max(c, vec3(1e-8)), vec3(1.0 / 2.4)).mul(1.055).sub(0.055);
  return mix(lo, hi, step(vec3(0.0031308), c));
});

/// Linear sRGB -> Oklab (Bjorn Ottosson matrices, shader-skills color.glsl)
export const linearSrgbToOklabTSL = Fn(([c_in]) => {
  const c = max(vec3(c_in), vec3(0.0));
  const l = c.r.mul(0.4122214708).add(c.g.mul(0.5363325363)).add(c.b.mul(0.0514459929));
  const m = c.r.mul(0.2119034982).add(c.g.mul(0.6806995451)).add(c.b.mul(0.1073969566));
  const s = c.r.mul(0.0883024619).add(c.g.mul(0.2817188376)).add(c.b.mul(0.6299787005));

  const l_ = pow(max(l, 1e-8), 1.0 / 3.0);
  const m_ = pow(max(m, 1e-8), 1.0 / 3.0);
  const s_ = pow(max(s, 1e-8), 1.0 / 3.0);

  return vec3(
    l_.mul(0.2104542553).add(m_.mul(0.7936177850)).sub(s_.mul(0.0040720468)),
    l_.mul(1.9779984951).sub(m_.mul(2.4285922050)).add(s_.mul(0.4505937099)),
    l_.mul(0.0259040371).add(m_.mul(0.7827717662)).sub(s_.mul(0.8086757660))
  );
});

/// Oklab -> Linear sRGB (shader-skills color.glsl)
export const oklabToLinearSrgbTSL = Fn(([lab]) => {
  const l_ = lab.x.add(lab.y.mul(0.3963377774)).add(lab.z.mul(0.2158037573));
  const m_ = lab.x.sub(lab.y.mul(0.1055613458)).sub(lab.z.mul(0.0638541728));
  const s_ = lab.x.sub(lab.y.mul(0.0894841775)).sub(lab.z.mul(1.2914855480));

  const l = l_.mul(l_).mul(l_);
  const m = m_.mul(m_).mul(m_);
  const s = s_.mul(s_).mul(s_);

  return max(
    vec3(
      l.mul(4.0767416621).sub(m.mul(3.3077115913)).add(s.mul(0.2309699292)),
      l.mul(-1.2684380046).add(m.mul(2.6097574011)).sub(s.mul(0.3413193965)),
      l.mul(-0.0041960863).sub(m.mul(0.7034186147)).add(s.mul(1.7076147010))
    ),
    vec3(0.0)
  );
});

/// Perceptual color mix in Oklab space (eliminates muddy RGB mid-tones in sky/fog ramps)
export const mixOklabTSL = Fn(([a, b, t]) => {
  const labA = linearSrgbToOklabTSL(a);
  const labB = linearSrgbToOklabTSL(b);
  return oklabToLinearSrgbTSL(mix(labA, labB, clamp(t, 0.0, 1.0)));
});

/// Planckian-locus blackbody color in linear sRGB for temperature kelvin (1000..15000 K, Krystek 1985 fit)
export const blackbodyTSL = Fn(([kelvin]) => {
  const T = clamp(kelvin, 1000.0, 15000.0);
  const T2 = T.mul(T);
  const u = float(0.860117757)
    .add(T.mul(1.54118254e-4))
    .add(T2.mul(1.28641212e-7))
    .div(float(1.0).add(T.mul(8.42420235e-4)).add(T2.mul(7.08145163e-7)));
  const v = float(0.317398726)
    .add(T.mul(4.22806245e-5))
    .add(T2.mul(4.20481691e-8))
    .div(float(1.0).sub(T.mul(2.89741816e-5)).add(T2.mul(1.61456053e-7)));

  const denom = max(u.mul(2.0).sub(v.mul(8.0)).add(4.0), 1e-6);
  const x = u.mul(3.0).div(denom);
  const y = max(v.mul(2.0).div(denom), 1e-6);

  const X = x.div(y);
  const Y = float(1.0);
  const Z = float(1.0).sub(x).sub(y).div(y);

  const rgb = max(
    vec3(
      X.mul(3.2406).sub(Y.mul(1.5372)).sub(Z.mul(0.4986)),
      X.mul(-0.9689).add(Y.mul(1.8758)).add(Z.mul(0.0415)),
      X.mul(0.0557).sub(Y.mul(0.2040)).add(Z.mul(1.0570))
    ),
    vec3(0.0)
  );
  const peak = max(max(rgb.r, rgb.g), max(rgb.b, 1e-6));
  return rgb.div(peak);
});

/// Internal AgX polynomial sigmoid helper (Troy Sobotka / Benjamin Wrensch, shader-skills tonemap.glsl)
const agxCoreSigmoidTSL = Fn(([c_in]) => {
  const c = max(vec3(c_in), vec3(0.0)).toVar();
  // Column-major AgX Inset matrix from shader-skills tonemap.glsl
  const insetCol = vec3(
    c.r.mul(0.842479062253094).add(c.g.mul(0.0784335999999992)).add(c.b.mul(0.0792237451477643)),
    c.r.mul(0.0423282422610123).add(c.g.mul(0.878468636469772)).add(c.b.mul(0.0791661274605434)),
    c.r.mul(0.0423756549057051).add(c.g.mul(0.0784336)).add(c.b.mul(0.879142973793104))
  );
  const minEv = float(-12.47393);
  const maxEv = float(4.026069);
  const x = clamp(log2(max(insetCol, vec3(1e-10))).sub(minEv).div(maxEv.sub(minEv)), 0.0, 1.0).toVar();
  const x2 = x.mul(x).toVar();
  const x4 = x2.mul(x2).toVar();
  return x4
    .mul(x2)
    .mul(15.5)
    .sub(x4.mul(x).mul(40.14))
    .add(x4.mul(31.96))
    .sub(x2.mul(x).mul(6.868))
    .add(x2.mul(0.4298))
    .add(x.mul(0.1191))
    .sub(0.00232);
});

const agxOutsetLinearTSL = Fn(([s_in]) => {
  const s = vec3(s_in).toVar();
  // Column-major AgX Outset matrix from shader-skills tonemap.glsl
  const outsetCol = vec3(
    s.r.mul(1.19687900512017).sub(s.g.mul(0.0980208811401368)).sub(s.b.mul(0.0990297440797205)),
    s.r.mul(-0.0528968517574562).add(s.g.mul(1.15190312990417)).sub(s.b.mul(0.0989611768448433)),
    s.r.mul(-0.0529716355144438).sub(s.g.mul(0.0980434501171241)).add(s.b.mul(1.15107367264116))
  );
  return clamp(pow(max(outsetCol, vec3(0.0)), vec3(2.2)), 0.0, 1.0);
});

/// AgX Tonemapper (base log look, shader-skills tonemap.glsl)
export const tonemapAgXTSL = Fn(([c_in]) => {
  const sig = agxCoreSigmoidTSL(c_in);
  return agxOutsetLinearTSL(sig);
});

/// AgX Punchy Tonemapper (default 3D look: contrast power 1.32 + saturation boost 1.32 in log space)
export const tonemapAgXPunchyTSL = Fn(([c_in]) => {
  const sig = pow(max(agxCoreSigmoidTSL(c_in), vec3(1e-8)), vec3(1.32)).toVar();
  const luma = dot(sig, vec3(0.2126, 0.7152, 0.0722));
  const boosted = vec3(luma).add(sig.sub(luma).mul(1.32));
  return agxOutsetLinearTSL(boosted);
});

/// Khronos PBR Neutral Tonemapper (leaves [0, 0.76] untouched and compresses only highlights)
export const tonemapNeutralTSL = Fn(([c_in]) => {
  const startCompression = float(0.76);
  const desaturation = float(0.15);
  const c0 = max(vec3(c_in), vec3(0.0)).toVar();
  const x = min(c0.r, min(c0.g, c0.b)).toVar();
  const offset = mix(float(0.04), x.sub(x.mul(x).mul(6.25)), step(x, 0.08));
  const c = c0.sub(offset).toVar();
  const peak = max(c.r, max(c.g, c.b)).toVar();
  const d = float(1.0).sub(startCompression);
  const newPeak = float(1.0).sub(d.mul(d).div(max(peak.add(d).sub(startCompression), 1e-6))).toVar();
  const compressed = c.mul(newPeak.div(max(peak, 1e-6)));
  const g = float(1.0).sub(float(1.0).div(desaturation.mul(max(peak.sub(newPeak), 0.0)).add(1.0)));
  const mapped = mix(compressed, vec3(newPeak), g);
  return clamp(mix(mapped, c, step(peak, startCompression)), 0.0, 1.0);
});

/// Stephen Hill's ACES Fitted Tonemapper (RRT + ODT, shader-skills tonemap.glsl)
export const tonemapACESTSL = Fn(([c_in]) => {
  const c0 = max(vec3(c_in), vec3(0.0)).toVar();
  const c = vec3(
    c0.r.mul(0.59719).add(c0.g.mul(0.35458)).add(c0.b.mul(0.04823)),
    c0.r.mul(0.07600).add(c0.g.mul(0.90834)).add(c0.b.mul(0.01566)),
    c0.r.mul(0.02840).add(c0.g.mul(0.13383)).add(c0.b.mul(0.83777))
  ).toVar();
  const rrt = c
    .mul(c.add(0.0245786))
    .sub(0.000090537)
    .div(c.mul(c.mul(0.983729).add(0.4329510)).add(0.238081))
    .toVar();
  const odt = vec3(
    rrt.r.mul(1.60475).sub(rrt.g.mul(0.53108)).sub(rrt.b.mul(0.07367)),
    rrt.r.mul(-0.10208).add(rrt.g.mul(1.10813)).sub(rrt.b.mul(0.00605)),
    rrt.r.mul(-0.00327).sub(rrt.g.mul(0.07276)).add(rrt.b.mul(1.07602))
  );
  return clamp(odt, 0.0, 1.0);
});

/// Unified Tonemapper selector specialized at TSL graph-build time by _activeTonemapMode
/// (0 = AgX Punchy, 1 = AgX Base Log, 2 = PBR Neutral, 3 = ACES).
/// Compiles ONLY the active tonemapper into the WGSL fragment shader (zero dead tonemapper polynomials).
export function applySelectedTonemapTSL(hdrLinear) {
  const hdr = max(vec3(hdrLinear), vec3(0.0)).toVar();
  if (_activeTonemapMode === 1) {
    return tonemapAgXTSL(hdr.mul(1.05));
  }
  if (_activeTonemapMode === 2) {
    return tonemapNeutralTSL(hdr.mul(0.95));
  }
  if (_activeTonemapMode === 3) {
    return tonemapACESTSL(hdr.mul(1.45));
  }
  return tonemapAgXPunchyTSL(hdr.mul(1.05));
}

// ============================================================================
// 5. POST & ANTIALIASING MODULE (post.glsl)
// ============================================================================

/// Derivative-aware antialiased fill of a 2D signed distance field d (1 inside, 0 outside)
export const fillAATSL = Fn(([d]) => {
  const w = max(fwidth(d), 1e-5);
  return clamp(float(0.5).sub(d.div(w)), 0.0, 1.0);
});

/// Derivative-aware antialiased stroke of half-width hw around the zero line of a 2D SDF d
export const strokeAATSL = Fn(([d, hw]) => {
  return fillAATSL(abs(d).sub(hw));
});

/// Natural (cos^4) optical vignette for a pinhole camera (shader-skills post.glsl)
export const vignetteTSL = Fn(([uvCentered, focal]) => {
  const f2 = focal.mul(focal);
  const k = f2.div(f2.add(dot(uvCentered, uvCentered)));
  return k.mul(k);
});

/// Signal-dependent film grain: noise grows with sqrt(intensity) like physical photon shot noise (post.glsl)
export const filmGrainTSL = Fn(([col, amount, zeroMeanNoise]) => {
  return max(vec3(col).add(sqrt(max(vec3(col), vec3(0.0))).mul(amount).mul(zeroMeanNoise)), vec3(0.0));
});

/// Triangular-PDF dither of +-1 LSB for 8-bit output. Add AFTER linearToSrgb (post.glsl)
export const ditherTPDFTSL = Fn(([fragCoord, frame]) => {
  const fMod = mod(float(frame), 1024.0);
  const seedPos = floor(fragCoord).add(fMod.mul(7919.0));
  const r = hash22TSL(seedPos);
  return vec3(r.x.add(r.y).sub(1.0).div(255.0));
});

/// Complete Shader-Skills Final Frame Output Chain (post.glsl & rendering-pipeline.md):
/// 1. Linear HDR input * exposure -> 2. cos^4 vignette & photon grain -> 3. Specialized Tonemap -> 4. linearToSrgb -> 5. TPDF Dither
export function finalizeShaderSkillsFrameTSL(hdrLinearColor, exposure, screenUVNode) {
  return Fn(() => {
    const exposed = max(vec3(hdrLinearColor), vec3(0.0)).mul(exposure).toVar();

    // Convert [0, 1] screenUV to centered [-1, 1] lens coordinates
    const uvCentered = screenUVNode.sub(0.5).mul(2.0);
    const vigFactor = mix(float(1.0), vignetteTSL(uvCentered, uCameraFocalLength), uVignetteStrength);
    const vignetted = exposed.mul(vigFactor).toVar();

    // Per-pixel, per-frame zero-mean noise for signal-dependent photon grain
    const ign = interleavedGradientNoise(screenCoordinate.xy.add(float(frameId).mul(5.588238)));
    const zeroMean = ign.mul(2.0).sub(1.0);
    const grained = filmGrainTSL(vignetted, uFilmGrainAmount, zeroMean).toVar();

    // Apply compile-time specialized tonemapper in linear space -> returns linear [0, 1]
    const tonemappedLinear = applySelectedTonemapTSL(grained).toVar();

    // Encode once with exact sRGB OETF (linearToSrgb), then add +-1 LSB TPDF dither right before output
    const srgbOut = linearToSrgbTSL(tonemappedLinear);
    const dither = ditherTPDFTSL(screenCoordinate.xy, frameId).mul(uDitherEnabled);
    return vec4(clamp(srgbOut.add(dither), 0.0, 1.0), 1.0);
  })();
}

/// Registers a Three.js RenderPipeline so changing uTonemapMode rebuilds only the post-processing outputNode
export function registerSpecializablePipeline(pipeline, buildOutputNodeFn) {
  const entry = {
    pipeline,
    rebuild() {
      pipeline.outputNode = buildOutputNodeFn();
      pipeline.needsUpdate = true;
    },
  };
  _specializablePipelines.add(entry);
  entry.rebuild();
  return entry;
}

// ============================================================================
// 6. ATMOSPHERE & VOLUME MODULES (atmosphere.glsl & volume.glsl)
// ============================================================================

/// Rayleigh phase function: 3/(16*pi) * (1 + mu^2)
export const phaseRayleighTSL = Fn(([mu]) => {
  return float(3.0 / (16.0 * Math.PI)).mul(float(1.0).add(mu.mul(mu)));
});

/// Henyey-Greenstein phase function
export const phaseHGTSL = Fn(([mu, g]) => {
  const g2 = g.mul(g);
  const denom = pow(max(float(1.0).add(g2).sub(g.mul(mu).mul(2.0)), 1e-5), 1.5);
  return float(1.0).sub(g2).div(denom.mul(4.0 * Math.PI));
});

/// Two-lobe Henyey-Greenstein phase: forward lobe gF and backward lobe gB mixed by w (Schneider / Hillaire)
export const phaseDualHGTSL = Fn(([mu, gF, gB, w]) => {
  return mix(phaseHGTSL(mu, gB), phaseHGTSL(mu, gF), w);
});

/// Cornette-Shanks phase (normalized Mie aerosol approximation, g ~ 0.8)
export const phaseCornetteShanksTSL = Fn(([mu, g]) => {
  const g2 = g.mul(g);
  const num = float(3.0 / (8.0 * Math.PI)).mul(float(1.0).sub(g2)).mul(float(1.0).add(mu.mul(mu)));
  const denom = float(2.0).add(g2).mul(pow(max(float(1.0).add(g2).sub(g.mul(mu).mul(2.0)), 1e-5), 1.5));
  return num.div(denom);
});

/// Beer-Powder cloud lighting term: 2 * e^-d * (1 - e^-k*d) (Schneider, Horizon Zero Dawn 2015)
export const beerPowderTSL = Fn(([d_in, k_in]) => {
  const d = max(d_in, 0.0);
  const k = k_in ? max(k_in, 0.1) : float(2.0);
  return float(2.0).mul(exp(d.negate())).mul(float(1.0).sub(exp(d.mul(k.negate()))));
});

/// Analytic ray-integrated exponential height fog for density a * exp(-b * y) along ray segment [0, t] (Inigo Quilez)
export const heightFogTSL = Fn(([ro, rd, t, a, b]) => {
  const base = a.mul(exp(clamp(ro.y.mul(b).negate(), -20.0, 20.0))).toVar();
  const rdyB = rd.y.mul(b).toVar();
  const isFlat = float(1.0).sub(step(1e-4, abs(rdyB)));
  const safeRdyB = mix(rdyB, float(1e-4), isFlat);
  const intFog = base.mul(float(1.0).sub(exp(clamp(t.mul(rdyB).negate(), -24.0, 24.0)))).div(safeRdyB);
  const opticalDepth = mix(intFog, base.mul(t), isFlat);
  return float(1.0).sub(exp(max(opticalDepth, 0.0).negate()));
});

/// Post-lighting 1D Radiative Transfer Equation (RTE) along view ray:
/// L_out = T(0, t) * L_surface + (1 - T(0, t)) * L_inScatter + L_crepuscular
/// Guarantees surface NoL and CSM shadows attenuate ONLY L_surface and never darken intervening sunlit air.
export const radiativeTransferFogTSL = Fn(([surfaceRadiance, fogOpacity, inScatterRadiance, crepuscularShaftRadiance]) => {
  const f = clamp(fogOpacity, 0.0, 1.0).toVar();
  const transmittance = float(1.0).sub(f);
  const crep = crepuscularShaftRadiance ? vec3(crepuscularShaftRadiance) : vec3(0.0);
  return max(vec3(surfaceRadiance), vec3(0.0))
    .mul(transmittance)
    .add(vec3(inScatterRadiance).mul(f))
    .add(crep);
});

/// Antialiased Sun Disk with Neckel (1996) solar limb darkening (atmosphere.glsl)
export const sunDiskTSL = Fn(([rd, sunDir, angularRadius]) => {
  const cosAng = clamp(dot(rd, sunDir), -1.0, 1.0);
  // Fast high-precision small-angle approximation sin(theta) ~ sqrt(2*(1 - cos(theta))) avoids acos precision jitter
  const ang = sqrt(max(float(2.0).mul(float(1.0).sub(cosAng)), 0.0));
  const pixelAngle = float(0.0022);
  const edge = float(1.0).sub(smoothstep(angularRadius.sub(pixelAngle), angularRadius.add(pixelAngle), ang));
  const r = clamp(ang.div(max(angularRadius, 1e-5)), 0.0, 1.0);
  const muLimb = sqrt(max(float(1.0).sub(r.mul(r)), 0.0));
  const limb = pow(vec3(muLimb), vec3(0.397, 0.503, 0.652));
  return limb.mul(edge);
});

// ============================================================================
// 7. WATER MODULE (water.glsl — Dispersive Gravity Waves, Jacobian Band-Limiting, LEAN Variance & Beer-Lambert)
// ============================================================================

/// Finite-depth gravity wave angular frequency: sqrt(g * k * tanh(k * depth))
export const waterDispersionTSL = Fn(([k_in, depth_in, gravity_in]) => {
  const k = max(k_in, 0.0);
  const depth = max(depth_in, 0.0);
  const g = gravity_in ? max(gravity_in, 0.0) : float(9.81);
  const e = exp(k.mul(depth).mul(-2.0));
  return sqrt(g.mul(k).mul(float(1.0).sub(e)).div(float(1.0).add(e)));
});

/// Single directional dispersive wave with Jacobian screen-space footprint band-limiting & LEAN slope-variance output:
/// Returns vec4(filteredHeight, dh/dx, dh/dz, unresolvedSlopeVariance)
/// When wavelength = 2*pi/k approaches 2..6x pixel footprint dp, wave amplitude attenuates by w in [0,1]
/// while lost slope variance 0.5 * steepness^2 * (1 - w^2) is returned in .w for roughness filtering.
export const waterWaveDTSL = Fn(([p, dir, k_in, steepness, depth, time, footprint_in]) => {
  const d = normalize(dir).toVar();
  const k = max(k_in, 1e-4).toVar();
  const wavelength = float(2.0 * Math.PI).div(k);
  const dp = footprint_in ? max(footprint_in, 0.0) : float(0.0);
  const nyquistWeight = smoothstep(dp.mul(2.0), max(dp.mul(6.0), 1e-4), wavelength);
  const w = mix(float(1.0), nyquistWeight, uWaterBandLimitEnabled).toVar();

  const omega = waterDispersionTSL(k, depth, float(9.81));
  const phase = dot(d, p).mul(k).sub(omega.mul(time));
  const amp = steepness.div(k);
  const s = sin(phase);
  const c = cos(phase);
  const h = amp.mul(exp(s.sub(1.0))).mul(w).toVar();
  const dhdPhase = h.mul(c);
  const unresolvedVar = float(0.5)
    .mul(steepness)
    .mul(steepness)
    .mul(float(1.0).sub(w.mul(w)))
    .mul(uWaterBandLimitEnabled);
  return vec4(h, d.x.mul(k).mul(dhdPhase), d.y.mul(k).mul(dhdPhase), unresolvedVar);
});

/// Kaplanyan & Dachsbacher (2016) / LEAN variance-to-roughness filter:
/// Converts unresolved normal/wave slope variance into broadened microfacet GGX roughness alpha' = sqrt(r0^2 + 2*sigma_s^2)
export const filterRoughnessVarianceTSL = Fn(([baseRoughness, unresolvedSlopeVariance]) => {
  const r0 = clamp(baseRoughness, 0.02, 1.0);
  const varTerm = max(unresolvedSlopeVariance, 0.0).mul(2.0);
  return sqrt(clamp(r0.mul(r0).add(varTerm), 0.0004, 1.0));
});

/// Exact unpolarized dielectric Fresnel (air = 1.0, water = 1.333, automotive glass = 1.52)
export const fresnelDielectricTSL = Fn(([cosIncident, etaIncident, etaTransmitted]) => {
  const ci = clamp(abs(cosIncident), 0.0, 1.0).toVar();
  const ei = max(etaIncident, 1e-5);
  const et = max(etaTransmitted, 1e-5);
  const sinT2 = ei.mul(ei).div(et.mul(et)).mul(max(float(0.0), float(1.0).sub(ci.mul(ci)))).toVar();
  const ct = sqrt(max(float(0.0), float(1.0).sub(sinT2))).toVar();
  const rs = ei.mul(ci).sub(et.mul(ct)).div(max(ei.mul(ci).add(et.mul(ct)), 1e-5));
  const rp = et.mul(ci).sub(ei.mul(ct)).div(max(et.mul(ci).add(ei.mul(ct)), 1e-5));
  const f = clamp(rs.mul(rs).add(rp.mul(rp)).mul(0.5), 0.0, 1.0);
  return mix(f, float(1.0), step(1.0, sinT2));
});

/// Beer-Lambert RGB optical path transmittance: exp(-extinction * pathLength)
export const beerTransmittanceTSL = Fn(([extinction, pathLength]) => {
  return exp(max(vec3(extinction), vec3(0.0)).mul(max(pathLength, 0.0)).negate());
});

// ============================================================================
// 8. SHADING MODULE (shading.glsl — Filament GGX, Smith Visibility, Karis Split-Sum & Weidlich-Wilkie Clearcoat)
// ============================================================================

export const fresnelSchlickTSL = Fn(([u, f0]) => {
  const m = clamp(float(1.0).sub(u), 0.0, 1.0);
  const m2 = m.mul(m);
  return vec3(f0).add(vec3(1.0).sub(f0).mul(m2.mul(m2).mul(m)));
});

export const distributionGGXTSL = Fn(([NoH, alpha]) => {
  const a2 = alpha.mul(alpha);
  const d = NoH.mul(NoH).mul(a2.sub(1.0)).add(1.0);
  return a2.div(max(d.mul(d).mul(Math.PI), 1e-6));
});

export const visibilitySmithGGXTSL = Fn(([NoV, NoL, alpha]) => {
  const a2 = alpha.mul(alpha);
  const gv = NoL.mul(sqrt(NoV.mul(NoV).mul(float(1.0).sub(a2)).add(a2)));
  const gl = NoV.mul(sqrt(NoL.mul(NoL).mul(float(1.0).sub(a2)).add(a2)));
  return float(0.5).div(max(gv.add(gl), 1e-5));
});

/// Microfacet GGX specular for one directional/key light: pi * D * V * F * NoL (artist units)
export const specularGGXTSL = Fn(([n, v, l, roughnessVal, f0]) => {
  const h = normalize(v.add(l));
  const NoL = clamp(dot(n, l), 0.0, 1.0);
  const NoV = max(abs(dot(n, v)), 1e-4);
  const NoH = clamp(dot(n, h), 0.0, 1.0);
  const VoH = clamp(dot(v, h), 0.0, 1.0);
  const alpha = max(roughnessVal, 0.045);
  const alpha2 = alpha.mul(alpha);
  const D = distributionGGXTSL(NoH, alpha2);
  const V = visibilitySmithGGXTSL(NoV, NoL, alpha2);
  const F = fresnelSchlickTSL(VoH, f0);
  return F.mul(D.mul(V).mul(NoL).mul(Math.PI));
});

/// Split-sum environment specular BRDF approximation without a LUT (Karis 2014 / Lazarov)
export const envBRDFApproxTSL = Fn(([f0, roughnessVal, NoV]) => {
  const r = vec4(-1.0, -0.0275, -0.572, 0.022).mul(roughnessVal).add(vec4(1.0, 0.0425, 1.04, -0.04));
  const a004 = min(r.x.mul(r.x), exp2(NoV.mul(-9.28))).mul(r.x).add(r.y);
  const ab = vec2(-1.04, 1.04).mul(a004).add(r.zw);
  return clamp(vec3(f0).mul(ab.x).add(ab.y), 0.0, 1.0);
});

/// Weidlich-Wilkie / Filament Energy-Conserving Layered Clearcoat Directional-Hemispherical Reflectance:
/// Returns vec2(coatReflectanceFc, baseTransmittance1MinusFc) where Fc + (1 - Fc) === 1.000 for White-Furnace conservation.
export const layeredClearcoatEnergyTSL = Fn(([f0Scalar, coatRoughness, NoV]) => {
  const envBrdf = envBRDFApproxTSL(vec3(f0Scalar), coatRoughness, clamp(NoV, 1e-4, 1.0));
  const Fc = clamp(envBrdf.r, 0.0, 1.0);
  return vec2(Fc, float(1.0).sub(Fc));
});

/// Energy-conserving wrap diffuse: light wraps past the terminator by w (0 = Lambert, 0.45 = foliage)
export const wrapDiffuseTSL = Fn(([n, l, w]) => {
  const denom = float(1.0).add(w);
  return max(dot(n, l).add(w).div(denom.mul(denom)), 0.0);
});

/// Fast subsurface translucency (Barre-Brisebois & Bouchard 2011)
export const translucencyTSL = Fn(([n, v, l, distortion, power, scale, thicknessVal]) => {
  const h = normalize(l.add(n.mul(distortion))).negate();
  const VoH = pow(clamp(dot(v, h), 0.0, 1.0), power).mul(scale);
  return VoH.mul(exp(max(thicknessVal, 0.0).negate()));
});

// ============================================================================
// 9. DEBUG & SPECIALIZATION MODULE (debug.glsl — Zero-Dead-ALU Specialized Field Views)
// ============================================================================

/// Heat ramp / Turbo-style colormap for a scalar value in [0,1]: black -> cobalt blue -> magenta -> orange -> yellow -> white
export const debugHeatTSL = Fn(([t_in]) => {
  const t = clamp(t_in, 0.0, 1.0).toVar();
  const r = clamp(smoothstep(0.22, 0.58, t).add(smoothstep(0.72, 1.0, t).mul(0.25)), 0.0, 1.0);
  const g = clamp(smoothstep(0.54, 0.92, t).mul(0.88).add(pow(t, 4.0).mul(0.22)), 0.0, 1.0);
  const b = clamp(
    smoothstep(0.0, 0.20, t)
      .sub(smoothstep(0.42, 0.72, t))
      .add(pow(t, 6.0).mul(0.65)),
    0.0,
    1.0
  );
  return vec3(r, g, b);
});

/// Normal as RGB in [0,1]
export const debugNormalTSL = Fn(([n]) => {
  return normalize(n).mul(0.5).add(0.5);
});

/// Antialiased UV Checkerboard (debug.glsl)
export const debugCheckerTSL = Fn(([uvCoord]) => {
  const q = floor(uvCoord.mul(8.0));
  const parity = mod(q.x.add(q.y), 2.0);
  return mix(vec3(0.18), vec3(0.82), parity).add(vec3(fract(uvCoord.x), fract(uvCoord.y), float(0.0)).mul(0.18));
});

/// Compile-time specialized debug view selector (backwards-compatible helper).
/// In gameplay (_activeShaderDebugMode === 0), returns finalColor directly with ZERO debug nodes in the TSL AST.
export function applyShaderDebugViewTSL(finalColor, normalVec, uvCoord, roughnessVal, aoOrMetalVal) {
  if (_activeShaderDebugMode === 1) return debugNormalTSL(normalVec);
  if (_activeShaderDebugMode === 2) return debugCheckerTSL(uvCoord);
  if (_activeShaderDebugMode === 3) return debugHeatTSL(roughnessVal);
  if (_activeShaderDebugMode === 4) return debugHeatTSL(aoOrMetalVal);
  if (_activeShaderDebugMode >= 5) {
    const lumaVal = clamp(dot(vec3(finalColor), vec3(0.2126, 0.7152, 0.0722)), 0.0, 1.0);
    return debugHeatTSL(lumaVal);
  }
  return finalColor;
}

/// Attaches a post-lighting Radiative Transfer outputNode (mode 0) and compile-time specialized Debug Field outputNode (modes 1..5)
/// to a Three.js NodeMaterial. When uShaderDebugMode.value changes, rebuilds mat.outputNode and marks mat.needsUpdate = true.
export function attachSpecializedMaterialOutputTSL(mat, config) {
  const entry = {
    mat,
    config,
    rebuild() {
      const m = _activeShaderDebugMode;
      if (m === 0) {
        if (config.postLightingFn) {
          mat.outputNode = vec4(config.postLightingFn(output.rgb), output.a);
        } else {
          mat.outputNode = null;
        }
      } else if (m === 1) {
        mat.outputNode = vec4(debugNormalTSL(config.normalNode), output.a);
      } else if (m === 2) {
        mat.outputNode = vec4(debugCheckerTSL(config.uvNode), output.a);
      } else if (m === 3) {
        mat.outputNode = vec4(debugHeatTSL(config.roughnessNode), output.a);
      } else if (m === 4) {
        mat.outputNode = vec4(debugHeatTSL(config.aoOrMetalNode), output.a);
      } else {
        const litRad = config.postLightingFn ? config.postLightingFn(output.rgb) : output.rgb;
        const lumaVal = clamp(dot(litRad, vec3(0.2126, 0.7152, 0.0722)), 0.0, 1.0);
        mat.outputNode = vec4(debugHeatTSL(lumaVal), output.a);
      }
      mat.needsUpdate = true;
    },
  };
  _specializableMaterials.add(entry);
  entry.rebuild();
  return entry;
}
