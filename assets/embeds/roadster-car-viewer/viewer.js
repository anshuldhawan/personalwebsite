import * as THREE from 'three';
import {
  Fn,
  abs,
  cameraPosition,
  clamp,
  cos,
  dot,
  float,
  fract,
  max,
  min,
  mix,
  modelWorldMatrix,
  normalLocal,
  normalMap,
  normalView,
  normalWorld,
  normalize,
  output,
  pass,
  positionLocal,
  positionWorld,
  pow,
  screenUV,
  sin,
  smoothstep,
  texture,
  transformNormalToView,
  uniform,
  uv,
  vec2,
  vec3,
  vec4,
} from 'three/tsl';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';

import {
  uTonemapMode,
  uShaderDebugMode,
  uVignetteStrength,
  uFilmGrainAmount,
  uDitherEnabled,
  finalizeShaderSkillsFrameTSL,
  mixOklabTSL,
  blackbodyTSL,
  cubicPulseTSL,
  fillAATSL,
  fresnelDielectricTSL,
  specularGGXTSL,
  layeredClearcoatEnergyTSL,
  phaseDualHGTSL,
  sunDiskTSL,
  attachSpecializedMaterialOutputTSL,
  registerSpecializablePipeline,
} from './shader_skills_tsl.js';

// ============================================================================
// Asset Base Resolution (Defaults to live CORS-enabled roadsterjump CDN,
// or accepts ?assetBase=... for local offline preview)
// ============================================================================
const params = new URLSearchParams(window.location.search);
const ASSET_BASE = (params.get('assetBase') || 'https://roadsterjump.anshuldhawan.com').replace(/\/$/, '');

const host = document.getElementById('viewer-canvas-host');
const loaderOverlay = document.getElementById('viewer-loader');
const loaderTitle = document.getElementById('loader-title');
const loaderBar = document.getElementById('loader-bar-inner');
const loaderSub = document.getElementById('loader-sub');
const backendBadge = document.getElementById('renderer-backend-badge');
const effectReadout = document.getElementById('effect-readout');
const btnAutoOrbit = document.getElementById('btn-auto-orbit');

// ============================================================================
// Effect & Paint Presets Metadata
// ============================================================================
const EFFECT_DESCRIPTIONS = {
  beauty:
    '<strong>Candy Clearcoat:</strong> Smooth analytical 3D body normals eliminate mesh facet seams on the hood and haunches, paired with a three-stage pigment flop and energy-conserving Weidlich-Wilkie clearcoat reflecting drifting cumulus clouds and sunlit sandstone.',
  thrusters:
    '<strong>SpaceX Cold-Gas Thrusters:</strong> Fires 4 underbody lift/roll nozzles, 2 lateral correction jets, and the 4+4 rear titanium De-Laval array using procedural TSL <code>cubicPulse</code> Mach shock-diamond cores and dynamic cyan ground-bounce lighting.',
  barrelRoll:
    '<strong>360° Barrel Roll Stunt:</strong> Runs the 2.80-second quintic-spline longitudinal roll trajectory around the vehicle center of mass while dynamically gimballing and differentially throttling (<code>r × F</code>) each underbody cold-gas plume.',
  brakes:
    '<strong>1680K Thermal Brake Glow:</strong> Spins the reconstructed 6-sector star-aero wheels, pitches the sprung chassis into braking dive, and heats the carbon-ceramic rotors along Krystek’s Planckian blackbody locus (<code>920 K → 1680 K</code>).',
  aero:
    '<strong>Active Aero &amp; Launch Squat:</strong> Deploys the motorized rear decklid wing around its leading-edge hinge, engages electric torque squat on the sprung suspension, spins wheels at 224 mph, and boosts the continuous laser taillight visor.',
  normals:
    '<strong>TSL Analytical Normals:</strong> Recompiles every car material into a zero-dead-ALU world-space normal debug view (<code>debugNormalTSL</code>), revealing the continuous analytical curvature across the hood, fenders, and canopy.',
  roughness:
    '<strong>Roughness Heat Map:</strong> Specializes the WGSL fragment graph to visualize microfacet GGX roughness (<code>debugHeatTSL</code>) from ultra-smooth <code>0.018</code> laminated glass to <code>0.12</code> clearcoat, <code>0.28</code> carbon twill, and <code>0.58</code> tire tread.',
  wireframe:
    '<strong>4.4 MB GLB Topology:</strong> Overlays occluded mesh wireframe lines over stealth bodywork to inspect the optimized geometry (reduced from 80.9 MB to 4.4 MB, -94.5%), batched sprung buckets, and 6-sector wheel aero shields.',
};

const PAINT_PRESETS = {
  crimson: {
    shadow: [0.028, 0.0006, 0.0010],
    mid: [0.55, 0.0055, 0.0075],
    crown: [0.92, 0.022, 0.012],
    spec: [0.48, 0.024, 0.012],
    crest: [0.82, 0.22, 0.10],
    envTint: [1.0, 0.35, 0.24],
  },
  silver: {
    shadow: [0.032, 0.036, 0.044],
    mid: [0.36, 0.39, 0.43],
    crown: [0.86, 0.89, 0.94],
    spec: [0.46, 0.49, 0.54],
    crest: [0.90, 0.86, 0.78],
    envTint: [0.85, 0.90, 0.98],
  },
  obsidian: {
    shadow: [0.004, 0.005, 0.007],
    mid: [0.028, 0.032, 0.039],
    crown: [0.14, 0.16, 0.19],
    spec: [0.22, 0.26, 0.30],
    crest: [0.48, 0.56, 0.64],
    envTint: [0.58, 0.68, 0.78],
  },
  gold: {
    shadow: [0.032, 0.012, 0.002],
    mid: [0.52, 0.22, 0.022],
    crown: [0.96, 0.56, 0.08],
    spec: [0.56, 0.30, 0.05],
    crest: [0.98, 0.74, 0.26],
    envTint: [1.0, 0.72, 0.34],
  },
};

const CAMERA_PRESETS = {
  hero: { pos: [3.45, 1.26, 3.05], target: [0.05, 0.50, 0.0] },
  rear: { pos: [-3.30, 1.02, 1.88], target: [-0.55, 0.56, 0.0] },
  brake: { pos: [1.56, 0.44, 1.98], target: [1.34, 0.35, 0.68] },
  side: { pos: [0.0, 0.86, 4.35], target: [0.0, 0.48, 0.0] },
  canopy: { pos: [1.75, 2.42, 2.05], target: [-0.05, 0.62, 0.0] },
  underbody: { pos: [2.48, 0.34, 2.38], target: [0.0, 0.72, 0.0] },
};

// ============================================================================
// Quintic Trajectory Knots from canyon_config.js (2.80s 360° Barrel Roll)
// ============================================================================
const HEIGHT_KNOTS = [
  [0.00, 0.00, 0.0, 0],
  [0.55, 2.70, 7.8, 0],
  [1.40, 6.50, 0.0, 0],
  [2.30, 3.00, -7.8, 0],
  [2.80, 0.00, 0.0, 0],
];

const ROLL_KNOTS = [
  [0.55, 0, 0.0, 0],
  [1.40, Math.PI, 6.5, 0],
  [2.30, 2 * Math.PI, 0.0, 0],
];

function quintic(k0, k1, t) {
  const [t0, p0, v0, a0] = k0;
  const [t1, p1, v1, a1] = k1;
  const d = t1 - t0;
  const u = Math.max(0, Math.min(1, (t - t0) / d));
  const c0 = p0;
  const c1 = d * v0;
  const c2 = 0.5 * d * d * a0;
  const A = p1 - c0 - c1 - c2;
  const B = d * v1 - c1 - 2 * c2;
  const C = d * d * a1 - 2 * c2;
  const c3 = 10 * A - 4 * B + 0.5 * C;
  const c4 = -15 * A + 7 * B - C;
  const c5 = 6 * A - 3 * B + 0.5 * C;
  const p = c0 + u * (c1 + u * (c2 + u * (c3 + u * (c4 + u * c5))));
  const v = (c1 + u * (2 * c2 + u * (3 * c3 + u * (4 * c4 + u * 5 * c5)))) / d;
  const a = (2 * c2 + u * (6 * c3 + u * (12 * c4 + u * 20 * c5))) / (d * d);
  return { p, v, a };
}

function sampleTrack(knots, t) {
  if (t <= knots[0][0]) {
    const [, p, v, a] = knots[0];
    return { p, v, a };
  }
  for (let i = 0; i < knots.length - 1; i++) {
    if (t < knots[i + 1][0]) return quintic(knots[i], knots[i + 1], t);
  }
  const [, p, v, a] = knots[knots.length - 1];
  return { p, v, a };
}

// ============================================================================
// WebGPU / TSL Scene & Lighting Setup
// ============================================================================
const GROUNDED_ROOT_HEIGHT = 0.56;
const CANYON_SUN_DIR = new THREE.Vector3(0.86, 0.215, 0.462).normalize();
const CAR_HERO_SUN_DIR = new THREE.Vector3(-0.28, 0.86, 0.42).normalize();

const uSimTime = uniform(0.0);
const uCarAirborneFactor = uniform(0.0);
const uBrakeThermalGlow = uniform(0.0);
const uWireframeDim = uniform(0.0);
const uEnableBloom = uniform(1.0);
const uToneMappingExposure = uniform(0.98);

// Live Paint Uniforms
const uPaintShadow = uniform(new THREE.Vector3(...PAINT_PRESETS.crimson.shadow));
const uPaintMid = uniform(new THREE.Vector3(...PAINT_PRESETS.crimson.mid));
const uPaintCrown = uniform(new THREE.Vector3(...PAINT_PRESETS.crimson.crown));
const uPaintSpec = uniform(new THREE.Vector3(...PAINT_PRESETS.crimson.spec));
const uPaintCrest = uniform(new THREE.Vector3(...PAINT_PRESETS.crimson.crest));
const uPaintEnvTint = uniform(new THREE.Vector3(...PAINT_PRESETS.crimson.envTint));

uVignetteStrength.value = 0.65;
uFilmGrainAmount.value = 0.008;
uDitherEnabled.value = 1.0;

const renderer = new THREE.WebGPURenderer({
  antialias: true,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
renderer.setSize(host.clientWidth || 720, host.clientHeight || 410);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.AgXToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
host.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0d0a);

const camera = new THREE.PerspectiveCamera(
  44,
  (host.clientWidth || 720) / (host.clientHeight || 410),
  0.15,
  120
);
camera.position.set(...CAMERA_PRESETS.hero.pos);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.065;
controls.enablePan = false;
controls.minDistance = 1.65;
controls.maxDistance = 8.5;
controls.maxPolarAngle = Math.PI * 0.515;
controls.minPolarAngle = 0.12;
controls.target.set(...CAMERA_PRESETS.hero.target);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.85;

// Warm golden-hour studio lighting matching the sunlit canyon scene
const hemiLight = new THREE.HemisphereLight(0xffe8d6, 0x261510, 0.72);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xfff0dd, 3.25);
sunLight.position.copy(CAR_HERO_SUN_DIR).multiplyScalar(18);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
sunLight.shadow.camera.near = 2;
sunLight.shadow.camera.far = 36;
sunLight.shadow.camera.left = -4.2;
sunLight.shadow.camera.right = 4.2;
sunLight.shadow.camera.top = 4.2;
sunLight.shadow.camera.bottom = -4.2;
sunLight.shadow.bias = -0.0004;
sunLight.shadow.normalBias = 0.02;
scene.add(sunLight);

const rimFillLight = new THREE.DirectionalLight(0xdbeafe, 0.95);
rimFillLight.position.set(5.5, 2.8, -4.5);
scene.add(rimFillLight);

function createHorizonEnvScene() {
  const envScene = new THREE.Scene();
  const envGeo = new THREE.SphereGeometry(40, 48, 32);
  const envMat = new THREE.MeshBasicNodeMaterial({ side: THREE.BackSide });
  envMat.colorNode = Fn(() => {
    const d = normalize(positionLocal);
    const h = d.y;
    const sunCosRaw = dot(d, CAR_HERO_SUN_DIR);
    const sunCos = clamp(sunCosRaw, 0.0, 1.0);
    const zenith = vec3(0.025, 0.028, 0.038);
    const midSky = vec3(0.10, 0.09, 0.095);
    const horizon = mixOklabTSL(vec3(0.45, 0.27, 0.17), vec3(0.98, 0.62, 0.36), pow(sunCos, 2.0));
    const baseSky = mixOklabTSL(
      mixOklabTSL(horizon, midSky, smoothstep(0.0, 0.28, clamp(h, 0.0, 1.0))),
      zenith,
      smoothstep(0.24, 0.85, clamp(h, 0.0, 1.0))
    );
    const dualMie = clamp(phaseDualHGTSL(sunCosRaw, float(0.75), float(-0.25), float(0.78)).mul(0.28), 0.0, 1.2);
    const upperCol = baseSky
      .add(vec3(0.92, 0.52, 0.26).mul(dualMie).mul(0.35))
      .add(vec3(1.65, 1.32, 0.98).mul(pow(sunCos, 64.0).add(sunDiskTSL(d, CAR_HERO_SUN_DIR, float(0.045)).mul(0.8))));
    const groundDark = mixOklabTSL(vec3(0.015, 0.012, 0.010), vec3(0.075, 0.042, 0.024), sunCos.mul(0.6));
    return vec4(mix(groundDark, upperCol, smoothstep(-0.04, 0.05, h)), 1.0);
  })();
  envScene.add(new THREE.Mesh(envGeo, envMat));
  return envScene;
}

// ============================================================================
// Studio Turntable Plinth & Contact Shadow
// ============================================================================
function createTurntableFloorTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 1024, 1024);

  const bg = ctx.createRadialGradient(512, 512, 40, 512, 512, 500);
  bg.addColorStop(0.0, 'rgba(26, 23, 19, 0.95)');
  bg.addColorStop(0.55, 'rgba(16, 18, 14, 0.82)');
  bg.addColorStop(0.88, 'rgba(11, 13, 10, 0.25)');
  bg.addColorStop(1.0, 'rgba(11, 13, 10, 0.0)');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle CRT phosphor calibration rings matching anshuldhawan.com
  [185, 310, 425].forEach((r, idx) => {
    ctx.beginPath();
    ctx.arc(512, 512, r, 0, Math.PI * 2);
    ctx.strokeStyle = idx === 1 ? 'rgba(124, 242, 160, 0.16)' : 'rgba(124, 242, 160, 0.07)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const plinthMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(9.6, 9.6),
  new THREE.MeshStandardMaterial({
    map: createTurntableFloorTexture(),
    transparent: true,
    roughness: 0.78,
    metalness: 0.08,
    depthWrite: false,
  })
);
plinthMesh.rotation.x = -Math.PI / 2;
plinthMesh.position.y = -0.002;
plinthMesh.receiveShadow = true;
scene.add(plinthMesh);

function createContactShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.save();
  ctx.translate(248, 286);
  ctx.scale(2.42, 0.78);
  const wingGrad = ctx.createRadialGradient(0, 0, 16, 0, 0, 112);
  wingGrad.addColorStop(0.0, 'rgba(10, 6, 4, 0.62)');
  wingGrad.addColorStop(0.55, 'rgba(10, 6, 4, 0.34)');
  wingGrad.addColorStop(1.0, 'rgba(10, 6, 4, 0.0)');
  ctx.fillStyle = wingGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 112, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(256, 250);
  ctx.scale(0.68, 1.68);
  const grad = ctx.createRadialGradient(0, 0, 18, 0, 0, 108);
  grad.addColorStop(0.0, 'rgba(2, 1, 1, 0.96)');
  grad.addColorStop(0.62, 'rgba(5, 3, 2, 0.86)');
  grad.addColorStop(1.0, 'rgba(8, 4, 2, 0.0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, 108, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  [
    [184, 124],
    [328, 124],
    [182, 382],
    [330, 382],
  ].forEach(([tx, ty]) => {
    ctx.save();
    ctx.translate(tx, ty);
    ctx.scale(0.92, 1.35);
    const tGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 22);
    tGrad.addColorStop(0.0, 'rgba(0, 0, 0, 0.96)');
    tGrad.addColorStop(0.6, 'rgba(2, 1, 1, 0.80)');
    tGrad.addColorStop(1.0, 'rgba(4, 2, 1, 0.0)');
    ctx.fillStyle = tGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  return new THREE.CanvasTexture(canvas);
}

const uContactShadowOpacity = uniform(0.95);
const contactShadowTex = createContactShadowTexture();
const contactShadowMat = new THREE.MeshBasicNodeMaterial({
  transparent: true,
  depthWrite: false,
});
const csSample = texture(contactShadowTex, uv());
contactShadowMat.colorNode = csSample.rgb;
contactShadowMat.opacityNode = csSample.a.mul(uContactShadowOpacity);

const contactShadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(5.65, 5.20), contactShadowMat);
contactShadowMesh.rotation.x = -Math.PI / 2;
contactShadowMesh.rotation.z = -Math.PI / 2;
contactShadowMesh.position.y = 0.004;
scene.add(contactShadowMesh);

// ============================================================================
// Vehicle Hierarchy, Laser Halo & SpaceX Cold-Gas Thruster Plumes
// ============================================================================
const carRoot = new THREE.Group();
carRoot.position.set(0, GROUNDED_ROOT_HEIGHT, 0);
scene.add(carRoot);

const carRearKeyLight = new THREE.PointLight(0xffece0, 1.15, 2.5, 2.2);
carRearKeyLight.position.set(-2.45, 0.82, 0.32);
carRoot.add(carRearKeyLight);

const carRearLeftFill = new THREE.PointLight(0xffe4d4, 0.78, 2.25, 2.2);
carRearLeftFill.position.set(-2.38, 0.80, -0.78);
carRoot.add(carRearLeftFill);

const carAdapterGroup = new THREE.Group();
carAdapterGroup.rotation.set(0, -Math.PI / 2, 0);
carAdapterGroup.position.set(0, -GROUNDED_ROOT_HEIGHT, 0);
carRoot.add(carAdapterGroup);

const wheelsUnsprungGroup = new THREE.Group();
carAdapterGroup.add(wheelsUnsprungGroup);

const chassisSprungGroup = new THREE.Group();
carAdapterGroup.add(chassisSprungGroup);

function createLaserHaloMesh() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const vGrad = ctx.createLinearGradient(0, 0, 0, 64);
  vGrad.addColorStop(0.0, 'rgba(255, 0, 14, 0.0)');
  vGrad.addColorStop(0.32, 'rgba(255, 10, 18, 0.42)');
  vGrad.addColorStop(0.5, 'rgba(255, 38, 44, 0.96)');
  vGrad.addColorStop(0.68, 'rgba(255, 10, 18, 0.42)');
  vGrad.addColorStop(1.0, 'rgba(255, 0, 14, 0.0)');
  ctx.fillStyle = vGrad;
  ctx.fillRect(0, 0, 512, 64);

  ctx.globalCompositeOperation = 'destination-in';
  const hGrad = ctx.createLinearGradient(0, 0, 512, 0);
  hGrad.addColorStop(0.0, 'rgba(0, 0, 0, 0.0)');
  hGrad.addColorStop(0.03, 'rgba(0, 0, 0, 1.0)');
  hGrad.addColorStop(0.97, 'rgba(0, 0, 0, 1.0)');
  hGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
  ctx.fillStyle = hGrad;
  ctx.fillRect(0, 0, 512, 64);

  const tex = new THREE.CanvasTexture(canvas);
  const haloMat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
    side: THREE.DoubleSide,
  });
  const haloMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.52, 0.011), haloMat);
  haloMesh.position.set(0, 0.7925, 2.238);
  return haloMesh;
}
const laserHaloMesh = createLaserHaloMesh();
chassisSprungGroup.add(laserHaloMesh);

const plumeGroup = new THREE.Group();
plumeGroup.visible = true;
plumeGroup.scale.setScalar(0.0001);
chassisSprungGroup.add(plumeGroup);

const thrusterGroundLight = new THREE.PointLight(0x9ce6ff, 0.0, 7.5, 1.6);
scene.add(thrusterGroundLight);

const primaryPlumePivots = [];
const correctionPlumePivots = [];
const rearPlumePivots = [];

function buildNozzlePlumes() {
  const plumeMat = new THREE.MeshBasicNodeMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  plumeMat.colorNode = vec3(0.58, 0.90, 1.18);
  plumeMat.opacityNode = Fn(() => {
    const axialRaw = clamp(positionLocal.y.div(0.72).add(0.5), 0.0, 1.0);
    const tipFade = smoothstep(0.0, 0.44, axialRaw);
    const lipFade = mix(float(0.68), float(1.0), smoothstep(1.0, 0.88, axialRaw));
    const axial = tipFade.mul(pow(axialRaw, 0.68)).mul(lipFade);
    const radialFresnel = pow(clamp(abs(normalView.z), 0.0, 1.0), 1.35);
    const machPhase = fract(positionLocal.y.mul(5.8).sub(uSimTime.mul(12.5)));
    const machDiamond = cubicPulseTSL(float(0.5), float(0.34), machPhase);
    return clamp(axial.mul(radialFresnel).mul(mix(float(0.70), float(1.14), machDiamond)).mul(0.88), 0.0, 1.0);
  })();

  const coreMat = new THREE.MeshBasicNodeMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  coreMat.colorNode = Fn(() => {
    const cellPhase = fract(positionLocal.y.mul(8.8).sub(uSimTime.mul(16.5)));
    const shockNode = cubicPulseTSL(float(0.5), float(0.28), cellPhase);
    return mix(vec3(1.05, 1.48, 1.98), vec3(1.72, 2.16, 2.60), shockNode);
  })();
  coreMat.opacityNode = Fn(() => {
    const axialRaw = clamp(positionLocal.y.div(0.38).add(0.5), 0.0, 1.0);
    const tipFade = smoothstep(0.0, 0.42, axialRaw);
    const axial = tipFade.mul(pow(axialRaw, 0.65));
    const radialFresnel = pow(clamp(abs(normalView.z), 0.0, 1.0), 1.25);
    const cellPhase = fract(positionLocal.y.mul(8.8).sub(uSimTime.mul(16.5)));
    const shockRings = cubicPulseTSL(float(0.5), float(0.30), cellPhase);
    return clamp(axial.mul(radialFresnel).mul(mix(float(0.68), float(1.0), shockRings)), 0.0, 1.0);
  })();

  const socketDefs = [
    { id: 'primary_FL', pos: [-0.58, 0.14, -1.25], dir: [0.0, -1.0, 0.0], isCorrection: false },
    { id: 'primary_FR', pos: [0.58, 0.14, -1.25], dir: [0.0, -1.0, 0.0], isCorrection: false },
    { id: 'primary_RL', pos: [-0.60, 0.15, 1.25], dir: [0.0, -1.0, 0.0], isCorrection: false },
    { id: 'primary_RR', pos: [0.60, 0.15, 1.25], dir: [0.0, -1.0, 0.0], isCorrection: false },
    { id: 'corr_Left', pos: [-0.86, 0.22, 0.0], dir: [-0.52, -0.85, 0.0], isCorrection: true },
    { id: 'corr_Right', pos: [0.86, 0.22, 0.0], dir: [0.52, -0.85, 0.0], isCorrection: true },
  ];

  const underbodyPlumeGeo = new THREE.CylinderGeometry(0.036, 0.135, 0.72, 20, 1, true);
  const underbodyCoreGeo = new THREE.CylinderGeometry(0.022, 0.068, 0.38, 16, 1, true);
  const downAxis = new THREE.Vector3(0, -1, 0);

  socketDefs.forEach((def) => {
    const targetDir = new THREE.Vector3(...def.dir).normalize();
    const pivot = new THREE.Group();
    pivot.position.set(...def.pos);
    pivot.quaternion.setFromUnitVectors(downAxis, targetDir);
    pivot.userData = {
      id: def.id,
      sideX: Math.sign(def.pos[0]),
      sideZ: Math.sign(def.pos[2]),
    };

    const vCone = new THREE.Mesh(underbodyPlumeGeo, plumeMat);
    vCone.position.set(0, -0.36, 0);
    pivot.add(vCone);

    const vCore = new THREE.Mesh(underbodyCoreGeo, coreMat);
    vCore.position.set(0, -0.19, 0);
    pivot.add(vCore);

    plumeGroup.add(pivot);
    if (def.isCorrection) correctionPlumePivots.push(pivot);
    else primaryPlumePivots.push(pivot);
  });

  const rearPlumeGeo = new THREE.CylinderGeometry(0.024, 0.082, 0.72, 16, 1, true);
  const rearCoreGeo = new THREE.CylinderGeometry(0.013, 0.042, 0.38, 12, 1, true);
  [-0.366, -0.122, 0.122, 0.366].forEach((x) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, 0.415, 2.08);
    pivot.rotation.x = -Math.PI / 2;
    const cone = new THREE.Mesh(rearPlumeGeo, plumeMat);
    cone.position.set(0, -0.36, 0);
    pivot.add(cone);
    const core = new THREE.Mesh(rearCoreGeo, coreMat);
    core.position.set(0, -0.19, 0);
    pivot.add(core);
    plumeGroup.add(pivot);
    rearPlumePivots.push(pivot);

    const lowerPivot = new THREE.Group();
    lowerPivot.position.set(x * 0.98, 0.255, 2.09);
    lowerPivot.rotation.x = -Math.PI / 2 + 0.14;
    const lCone = new THREE.Mesh(rearPlumeGeo, plumeMat);
    lCone.position.set(0, -0.36, 0);
    lowerPivot.add(lCone);
    const lCore = new THREE.Mesh(rearCoreGeo, coreMat);
    lCore.position.set(0, -0.19, 0);
    lowerPivot.add(lCore);
    plumeGroup.add(lowerPivot);
    rearPlumePivots.push(lowerPivot);
  });
}
buildNozzlePlumes();

// ============================================================================
// PBR Textures & Procedural Cumulus Cloud Reflection FBM
// ============================================================================
const texLoader = new THREE.TextureLoader();
texLoader.setCrossOrigin('anonymous');
const maxAniso = 8;

let loadedCount = 0;
const EXPECTED_TEX_COUNT = 18;
function updateLoaderProgress(glbFrac = null) {
  const texFrac = Math.min(1, loadedCount / EXPECTED_TEX_COUNT);
  const gFrac = glbFrac !== null ? glbFrac : window.__glbFrac || 0;
  window.__glbFrac = gFrac;
  const pct = Math.max(8, Math.min(99, Math.round((texFrac * 0.45 + gFrac * 0.55) * 100)));
  if (loaderBar) loaderBar.style.width = `${pct}%`;
}

function loadCarTexture(relPath, isSRGB = false, repeat = 1, flipY = false) {
  const tex = texLoader.load(
    `${ASSET_BASE}/${relPath}`,
    () => {
      loadedCount++;
      updateLoaderProgress();
    },
    undefined,
    () => {
      loadedCount++;
      updateLoaderProgress();
    }
  );
  tex.colorSpace = isSRGB ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.wrapS = repeat === 1 ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
  tex.wrapT = repeat === 1 ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
  tex.flipY = flipY;
  tex.anisotropy = maxAniso;
  if (repeat !== 1) tex.repeat.set(repeat, repeat);
  return tex;
}

const hdTextures = {
  paintNormal: loadCarTexture('final_car/textures_hd/car_paint_normal_2k.png', false, 8),
  carbonAlbedo: loadCarTexture('final_car/textures_hd/carbon_twill_albedo_2k.png', true, 2),
  carbonNormal: loadCarTexture('final_car/textures_hd/carbon_twill_normal_2k.png', false, 2),
  carbonRoughness: loadCarTexture('final_car/textures_hd/carbon_twill_roughness_2k.png', false, 2),
  tireTreadAlbedo: loadCarTexture('final_car/textures_hd/tire_tread_albedo_2k.png', true, 1),
  tireTreadNormal: loadCarTexture('final_car/textures_hd/tire_tread_normal_2k.png', false, 1),
  tireTreadRoughness: loadCarTexture('final_car/textures_hd/tire_tread_roughness_2k.png', false, 1),
  tireSidewallAlbedo: loadCarTexture('final_car/textures_hd/tire_sidewall_albedo_2k.png', true, 1),
  tireSidewallNormal: loadCarTexture('final_car/textures_hd/tire_sidewall_normal_2k.png', false, 1),
  tireSidewallRoughness: loadCarTexture('final_car/textures_hd/tire_sidewall_roughness_2k.png', false, 1),
  rotorAlbedo: loadCarTexture('final_car/textures_hd/brake_rotor_albedo_2k.png', true, 1),
  rotorNormal: loadCarTexture('final_car/textures_hd/brake_rotor_normal_2k.png', false, 1),
  rotorRoughness: loadCarTexture('final_car/textures_hd/brake_rotor_roughness_2k.png', false, 1),
  rotorMetallic: loadCarTexture('final_car/textures_hd/brake_rotor_metallic_2k.png', false, 1),
  wheelRadialNormal: loadCarTexture('final_car/textures_hd/wheel_radial_normal_2k.png', false, 1),
  wheelRadialRoughness: loadCarTexture('final_car/textures_hd/wheel_radial_roughness_2k.png', false, 1),
  thrusterAlbedo: loadCarTexture('final_car/textures_hd/thruster_titanium_albedo_2k.png', true, 1),
  thrusterNormal: loadCarTexture('final_car/textures_hd/thruster_titanium_normal_2k.png', false, 1),
  thrusterRoughness: loadCarTexture('final_car/textures_hd/thruster_titanium_roughness_2k.png', false, 1),
  canopyRoughness: loadCarTexture('final_car/textures_hd/canopy_glass_roughness_2k.png', false, 1),
  alcantaraNormal: loadCarTexture('final_car/textures_hd/alcantara_normal_2k.png', false, 3),
  alcantaraRoughness: loadCarTexture('final_car/textures_hd/alcantara_roughness_2k.png', false, 3),
  underbodyAlloyNormal: loadCarTexture('final_car/textures_hd/underbody_alloy_normal_2k.png', false, 2),
  underbodyAlloyRoughness: loadCarTexture('final_car/textures_hd/underbody_alloy_roughness_2k.png', false, 2),
  causewayAlbedo: loadCarTexture('textures_canyon_4k/causeway_sandstone_albedo_4k.png', true, 4, true),
};

function createSeamlessCloudNoiseTexture() {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  const hash2D = (ix, iy, seed) => {
    let n = (Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seed, 1442695041)) >>> 0;
    n = Math.imul(n ^ (n >>> 13), 1274126177) >>> 0;
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296.0;
  };
  const samplePeriodicNoise = (u, v, periodX, periodY, seed) => {
    const gx = (((u % 1.0) + 1.0) % 1.0) * periodX;
    const gy = (((v % 1.0) + 1.0) % 1.0) * periodY;
    const ix0 = Math.floor(gx);
    const iy0 = Math.floor(gy);
    const fx = gx - ix0;
    const fy = gy - iy0;
    const sx = fx * fx * (3.0 - 2.0 * fx);
    const sy = fy * fy * (3.0 - 2.0 * fy);
    const x0 = ix0 % periodX;
    const x1 = (ix0 + 1) % periodX;
    const y0 = iy0 % periodY;
    const y1 = (iy0 + 1) % periodY;
    const v00 = hash2D(x0, y0, seed);
    const v10 = hash2D(x1, y0, seed);
    const v01 = hash2D(x0, y1, seed);
    const v11 = hash2D(x1, y1, seed);
    return (v00 * (1.0 - sx) + v10 * sx) * (1.0 - sy) + (v01 * (1.0 - sx) + v11 * sx) * sy;
  };

  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const wx = u + (samplePeriodicNoise(u, v, 4, 4, 11) - 0.5) * 0.14 + (samplePeriodicNoise(u, v, 8, 8, 23) - 0.5) * 0.06;
      const wy = v + (samplePeriodicNoise(u, v, 4, 4, 37) - 0.5) * 0.14 + (samplePeriodicNoise(u, v, 8, 8, 53) - 0.5) * 0.06;
      const fbm1 =
        0.44 * samplePeriodicNoise(wx, wy, 4, 4, 101) +
        0.27 * samplePeriodicNoise(wx, wy, 8, 8, 202) +
        0.16 * samplePeriodicNoise(wx, wy, 16, 16, 303) +
        0.08 * samplePeriodicNoise(wx, wy, 32, 32, 404) +
        0.05 * samplePeriodicNoise(wx, wy, 64, 64, 505);
      const fbm2 =
        0.48 * samplePeriodicNoise(wx + 0.31, wy + 0.17, 6, 6, 606) +
        0.32 * samplePeriodicNoise(wx + 0.31, wy + 0.17, 12, 12, 707) +
        0.20 * samplePeriodicNoise(wx + 0.31, wy + 0.17, 24, 24, 808);
      const idx = (y * size + x) * 4;
      data[idx] = Math.max(0, Math.min(255, Math.round(fbm1 * 255)));
      data[idx + 1] = Math.max(0, Math.min(255, Math.round(fbm2 * 255)));
      data[idx + 2] = data[idx];
      data[idx + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

const cloudNoiseTex = createSeamlessCloudNoiseTexture();
const uCanyonSunDir = uniform(CANYON_SUN_DIR.clone());

const sampleWorldSkyAndCloudsTSL = Fn(([wp, R]) => {
  const R_smooth = normalize(mix(vec3(0.58, 0.80, 0.0), R, float(0.45)));
  const ry = clamp(R_smooth.y, 0.0, 1.0);
  const invRy = float(1.0).div(max(ry.add(0.20), float(0.20)));

  const baseCloudX = wp.x.mul(0.015).add(R_smooth.x.mul(invRy).mul(0.85)).add(uSimTime.mul(0.028));
  const baseCloudZ = wp.z.mul(0.022).add(R_smooth.z.mul(invRy).mul(1.25)).add(uSimTime.mul(0.010));
  const uvOct1 = vec2(baseCloudX, baseCloudZ);
  const uvOct2 = vec2(
    baseCloudX.mul(1.85).sub(baseCloudZ.mul(0.35)).add(uSimTime.mul(0.022)).add(0.29),
    baseCloudZ.mul(2.15).add(baseCloudX.mul(0.28)).sub(uSimTime.mul(0.009)).add(0.53)
  );

  const s1 = texture(cloudNoiseTex, uvOct1);
  const s2 = texture(cloudNoiseTex, uvOct2);
  const cloudField = s1.r.mul(0.56).add(s2.g.mul(0.44));
  const cloudPuff = smoothstep(0.49, 0.72, cloudField);
  const cloudRim = smoothstep(0.59, 0.80, cloudField);

  const sunCos = clamp(dot(R, uCanyonSunDir), 0.0, 1.0);
  const heroSunCos = clamp(dot(R, CAR_HERO_SUN_DIR), 0.0, 1.0);
  const combinedSun = max(sunCos, heroSunCos);

  const skyZenith = vec3(0.003, 0.005, 0.009);
  const skyMid = vec3(0.010, 0.014, 0.022);
  const skyHorizon = mix(vec3(0.032, 0.030, 0.035), vec3(0.078, 0.064, 0.054), combinedSun);
  const reflSky = mix(
    mix(skyHorizon, skyMid, smoothstep(0.32, 0.56, ry)),
    skyZenith,
    smoothstep(0.52, 0.86, ry)
  );
  const cloudBodyCol = vec3(0.062, 0.070, 0.084);
  const cloudRimCol = mix(vec3(0.120, 0.112, 0.102), vec3(0.195, 0.156, 0.118), combinedSun);
  return reflSky.add(cloudBodyCol.mul(cloudPuff)).add(cloudRimCol.mul(cloudRim));
});

const sampleCarBodyEnvReflectionTSL = Fn(([wp, R, upPanelMask]) => {
  const rY_eff = mix(R.y, max(R.y, float(0.09)).add(0.03), upPanelMask);
  const ry = clamp(rY_eff, 0.0, 1.0);

  const sunCosCanyon = clamp(dot(R, uCanyonSunDir), 0.0, 1.0);
  const sunCosHero = clamp(dot(R, CAR_HERO_SUN_DIR), 0.0, 1.0);
  const combinedSun = max(sunCosCanyon, sunCosHero);
  const sunGlow = max(pow(sunCosCanyon, 2.6), pow(sunCosHero, 3.0).mul(0.85));

  const R_cloud = normalize(mix(vec3(0.48, 0.82, 0.0), R, float(0.46)));
  const ryCloud = clamp(R_cloud.y, 0.25, 1.0);
  const invRyCloud = float(1.0).div(ryCloud.add(0.42));

  const baseCloudX = wp.x.mul(0.011).add(R_cloud.x.mul(invRyCloud).mul(0.24)).add(uSimTime.mul(0.022));
  const baseCloudZ = wp.z.mul(0.014).add(R_cloud.z.mul(invRyCloud).mul(0.28)).add(uSimTime.mul(0.008));

  const uvOct1 = vec2(baseCloudX, baseCloudZ);
  const uvOct2 = vec2(
    baseCloudX.mul(1.82).sub(baseCloudZ.mul(0.34)).add(uSimTime.mul(0.018)).add(0.29),
    baseCloudZ.mul(2.08).add(baseCloudX.mul(0.28)).sub(uSimTime.mul(0.008)).add(0.53)
  );

  const s1 = texture(cloudNoiseTex, uvOct1);
  const s2 = texture(cloudNoiseTex, uvOct2);
  const cloudField = s1.r.mul(0.56).add(s2.g.mul(0.44));

  const cloudVis = smoothstep(0.04, 0.22, ry).mul(smoothstep(0.96, 0.26, ry));
  const cloudPuff = smoothstep(0.45, 0.76, cloudField).mul(cloudVis);
  const cloudRim = smoothstep(0.56, 0.83, cloudField).mul(cloudVis);

  const skyZenith = vec3(0.006, 0.005, 0.006);
  const skyMid = vec3(0.018, 0.014, 0.015);
  const skyHorizon = mix(vec3(0.28, 0.14, 0.09), vec3(0.62, 0.36, 0.22), sunGlow).mul(uPaintEnvTint);
  const reflSky = mix(
    mix(skyHorizon, skyMid, smoothstep(0.0, 0.09, ry)),
    skyZenith,
    smoothstep(0.08, 0.48, ry)
  );

  const cloudBodyCol = mix(vec3(0.14, 0.11, 0.10), vec3(0.28, 0.21, 0.17), sunGlow).mul(uPaintEnvTint);
  const cloudRimCol = mix(vec3(0.26, 0.20, 0.16), vec3(0.54, 0.38, 0.26), sunGlow).mul(uPaintEnvTint);
  const solarCorona = vec3(0.85, 0.56, 0.36)
    .mul(pow(combinedSun, 18.0).mul(0.26))
    .add(vec3(1.25, 0.92, 0.68).mul(pow(combinedSun, 64.0).mul(0.38)))
    .mul(uPaintEnvTint);

  const upperEnv = reflSky.add(cloudBodyCol.mul(cloudPuff)).add(cloudRimCol.mul(cloudRim)).add(solarCorona);

  const downY = max(rY_eff.negate(), float(0.18));
  const hAboveRoad = clamp(wp.y, 0.22, 2.8);
  const hitDistXZ = min(hAboveRoad.div(downY), float(12.0));
  const groundHitXZ = wp.xz.add(R.xz.mul(hitDistXZ));

  const roadTexCol = texture(hdTextures.causewayAlbedo, groundHitXZ.mul(1.0 / 10.5)).rgb;
  const roadVerticalWindow = smoothstep(-0.02, -0.14, rY_eff).mul(float(1.0).sub(smoothstep(-0.24, -0.56, rY_eff)));
  const sunlitSandstone = roadTexCol.mul(vec3(0.42, 0.26, 0.16)).mul(uPaintEnvTint);
  const groundedRoadRefl = mix(vec3(0.012, 0.008, 0.007), sunlitSandstone, roadVerticalWindow);
  const chasmRefl = mix(vec3(0.14, 0.08, 0.05), vec3(0.34, 0.20, 0.12), sunGlow.mul(0.7).mul(roadVerticalWindow)).mul(uPaintEnvTint);
  const lowerGround = mix(groundedRoadRefl, chasmRefl, clamp(uCarAirborneFactor, 0.0, 1.0));

  const horizonCrease = smoothstep(-0.06, -0.01, rY_eff).mul(float(1.0).sub(smoothstep(-0.01, 0.04, rY_eff)));
  const lowerWithHorizon = mix(lowerGround, vec3(0.018, 0.010, 0.008), horizonCrease.mul(0.72));

  return mix(lowerWithHorizon, upperEnv, smoothstep(-0.03, 0.04, rY_eff));
});

// ============================================================================
// Upgrade Imported GLB Materials to Specialized TSL NodeMaterials
// ============================================================================
function attachStandardDebugNodes(mat, roughVal, metalVal, customNormalNode = null) {
  attachSpecializedMaterialOutputTSL(mat, {
    postLightingFn: (litRgb) => mix(litRgb, litRgb.mul(0.16), uWireframeDim),
    normalNode: customNormalNode || normalize(normalWorld),
    uvNode: uv(),
    roughnessNode: typeof roughVal === 'number' ? float(roughVal) : roughVal,
    aoOrMetalNode: typeof metalVal === 'number' ? float(metalVal) : metalVal,
  });
}

function makePhysicalNodeMat(props, roughVal, metalVal, normalMapTex = null, normalScaleVal = 1.0) {
  const mat = new THREE.MeshPhysicalNodeMaterial(props);
  if (normalMapTex) {
    mat.normalNode = normalMap(texture(normalMapTex, uv()), vec2(normalScaleVal, normalScaleVal));
  }
  attachStandardDebugNodes(mat, roughVal, metalVal);
  return mat;
}

function upgradeToHyperRealMaterial(m) {
  if (!m) return m;
  const mn = m.name || '';

  if (mn.includes('RevealWhite_Paint')) {
    const paintMat = new THREE.MeshPhysicalNodeMaterial({
      name: mn,
      metalness: 0.05,
      roughness: 0.58,
      specularIntensity: 0.04,
      clearcoat: 0.0,
      clearcoatRoughness: 0.04,
      ior: 1.52,
      envMapIntensity: 0.02,
      side: THREE.DoubleSide,
    });

    const lp = positionLocal;
    const wp = positionWorld;
    const nl = normalize(normalLocal);
    const N_raw = normalize(normalWorld);

    const absX = abs(lp.x);
    const sideSign = lp.x.div(absX.add(0.0001));
    const isRearTransom = smoothstep(2.08, 2.15, lp.z).mul(smoothstep(0.45, 0.85, nl.z));
    const isFrontFascia = float(1.0).sub(smoothstep(-2.12, -1.94, lp.z)).mul(float(1.0).sub(smoothstep(-0.80, -0.45, nl.z)));
    const isHoodOrUpperFender = smoothstep(-2.04, -1.90, lp.z)
      .mul(float(1.0).sub(smoothstep(-0.25, 0.05, lp.z)))
      .mul(smoothstep(0.40, 0.50, lp.y))
      .mul(smoothstep(0.20, 0.42, nl.y))
      .mul(float(1.0).sub(smoothstep(0.74, 0.82, absX)));

    const hoodCenterFlatness = float(1.0)
      .sub(smoothstep(-0.85, -0.25, lp.z))
      .mul(float(1.0).sub(smoothstep(0.44, 0.68, absX)));
    const latCrownScale = mix(float(0.72), float(0.28), hoodCenterFlatness);
    const smoothLatX = clamp(lp.x.div(0.86), -1.0, 1.0);
    const smoothLonZ = mix(nl.z, clamp(lp.z.mul(0.11), -0.28, 0.18), float(1.0).sub(isFrontFascia));
    const idealUpNormal = normalize(vec3(smoothLatX.mul(latCrownScale), float(0.89), smoothLonZ));

    const yBeltline = float(0.665).add(clamp(lp.z.mul(0.025), -0.04, 0.05));
    const aboveBelt = smoothstep(yBeltline.sub(0.02), float(0.89), lp.y);
    const belowBelt = float(1.0).sub(smoothstep(float(0.24), yBeltline.add(0.02), lp.y));
    const rockerLip = float(1.0).sub(smoothstep(float(0.21), float(0.30), lp.y));
    const sideCurvedNy = aboveBelt.mul(0.42).sub(belowBelt.mul(0.22)).add(rockerLip.mul(0.10));

    const dFrontZ = lp.z.add(1.38);
    const dRearZ = lp.z.sub(1.38);
    const frontArchFlare = dFrontZ.mul(smoothstep(0.60, 0.12, abs(dFrontZ))).mul(smoothstep(0.75, 0.30, lp.y)).mul(0.18);
    const rearArchFlare = dRearZ.mul(smoothstep(0.62, 0.12, abs(dRearZ))).mul(smoothstep(0.78, 0.30, lp.y)).mul(0.18);
    const sideCurvedNz = clamp(frontArchFlare.add(rearArchFlare), -0.45, 0.45);
    const idealSideNormal = normalize(vec3(sideSign.mul(0.92), sideCurvedNy, sideCurvedNz));

    const upPanelWeight = max(smoothstep(0.20, 0.52, nl.y), isHoodOrUpperFender).mul(float(1.0).sub(isRearTransom));
    const outerFlankMask = smoothstep(0.62, 0.72, absX);
    const sidePanelWeight = outerFlankMask
      .mul(smoothstep(0.48, 0.85, abs(nl.x)))
      .mul(float(1.0).sub(smoothstep(0.42, 0.72, nl.y)))
      .mul(float(1.0).sub(isRearTransom));

    const N_local = normalize(
      mix(
        mix(nl, idealSideNormal, sidePanelWeight.mul(0.94)),
        idealUpNormal,
        upPanelWeight.mul(0.99)
      )
    );
    const N = normalize(modelWorldMatrix.mul(vec4(N_local, 0.0)).xyz);
    const V = normalize(cameraPosition.sub(wp));
    const NoV = clamp(abs(dot(N, V)), 0.0, 1.0);
    const R = normalize(N.mul(dot(N, V).mul(2.0)).sub(V));

    const flakeMicroTex = texture(hdTextures.paintNormal, uv().mul(28.0));
    const flakePerturb = flakeMicroTex.rgb.sub(0.5).mul(0.010);
    paintMat.normalNode = normalize(transformNormalToView(normalize(N_local.add(flakePerturb))));

    const sunRightKey = normalize(vec3(-0.32, 0.72, 0.62));
    const sunRearKey = normalize(vec3(-0.86, 0.46, 0.22));
    const skyCrownDir = normalize(vec3(-0.18, 0.94, -0.24));
    const frontCrownDir = normalize(vec3(-0.25, 0.88, -0.40));

    const NoL_canyon = clamp(dot(N, uCanyonSunDir), 0.0, 1.0);
    const NoL_right = clamp(dot(N, sunRightKey), 0.0, 1.0);
    const NoL_crown = clamp(dot(N, skyCrownDir), 0.0, 1.0);

    const upFacing = smoothstep(-0.14, 0.66, N.y);
    const rearFacing = float(1.0).sub(smoothstep(-0.88, -0.38, N_raw.x));
    const rearFasciaZone = smoothstep(2.12, 2.20, lp.z).mul(rearFacing);

    const sunSideBoost = max(NoL_right, NoL_canyon.mul(0.75)).mul(0.44);
    const litPanelMask = clamp(upFacing.add(sunSideBoost).add(rearFasciaZone.mul(0.84)), 0.0, 1.0);
    const viewFlop = smoothstep(0.04, 0.54, NoV).mul(mix(float(0.32), float(1.0), litPanelMask));

    const rightSideMask = smoothstep(-0.15, 0.58, lp.x);
    const rightSunCrown = pow(max(NoL_right, NoL_canyon.mul(0.82)), 1.65).mul(rightSideMask).mul(upFacing).mul(0.76);
    const leftTopCrown = pow(NoL_crown, 2.0).mul(smoothstep(0.45, 0.85, N.y)).mul(0.40);
    const beltlineShoulderCrown = smoothstep(0.62, 0.78, lp.y).mul(smoothstep(0.55, 0.86, absX)).mul(0.34);
    const rearCheekCrown = rearFasciaZone.mul(0.58);
    const totalCrown = clamp(rightSunCrown.add(leftTopCrown).add(beltlineShoulderCrown).add(rearCheekCrown), 0.0, 1.0);

    const baseCandyColor = mix(mix(uPaintShadow, uPaintMid, viewFlop), uPaintCrown, totalCrown.mul(0.74));

    const H_right = normalize(V.add(sunRightKey));
    const H_canyon = normalize(V.add(uCanyonSunDir));
    const H_rear = normalize(V.add(sunRearKey));
    const H_crown = normalize(V.add(skyCrownDir));
    const H_front = normalize(V.add(frontCrownDir));

    const rightShoulderSheen = pow(max(clamp(dot(N, H_right), 0.0, 1.0), clamp(dot(N, H_canyon), 0.0, 1.0).mul(0.85)), 11.0)
      .mul(rightSideMask)
      .mul(0.38);
    const outerRightCrestMask = smoothstep(0.78, 0.92, lp.x).mul(smoothstep(0.15, 1.95, lp.z)).mul(smoothstep(0.12, 0.68, nl.y));
    const rightCrestSpec = pow(clamp(dot(N, H_right), 0.0, 1.0), 28.0).mul(outerRightCrestMask).mul(0.78);
    const leftCrownSheen = pow(clamp(dot(N, H_crown), 0.0, 1.0), 14.0).mul(smoothstep(0.50, 0.88, N.y)).mul(0.26);
    const fenderAndHoodSpec = pow(clamp(dot(N, H_front), 0.0, 1.0), 16.0).mul(smoothstep(0.22, 0.85, N.y)).mul(0.34);
    const rearRidgeSpec = pow(clamp(dot(N_raw, H_rear), 0.0, 1.0), 16.0).mul(rearFasciaZone).mul(0.38);

    const sculptedHighlights = uPaintSpec
      .mul(rightShoulderSheen.add(leftCrownSheen).add(fenderAndHoodSpec).add(rearRidgeSpec))
      .add(uPaintCrest.mul(rightCrestSpec));

    const coatEnergy = layeredClearcoatEnergyTSL(float(0.045), float(0.12), NoV);
    const ggxRight = specularGGXTSL(N, V, sunRightKey, float(0.14), vec3(0.04, 0.02, 0.015)).mul(rightSideMask).mul(0.025);
    const fresnelCoat = clamp(coatEnergy.x.mul(1.15).add(0.12), 0.16, 0.72);
    const envCoatRefl = sampleCarBodyEnvReflectionTSL(wp, R, upPanelWeight).mul(fresnelCoat);

    paintMat.colorNode = baseCandyColor.mul(coatEnergy.y);
    paintMat.emissiveNode = sculptedHighlights.mul(coatEnergy.y).add(ggxRight).add(envCoatRefl);
    attachStandardDebugNodes(paintMat, float(0.12), float(0.85), N);
    return paintMat;
  }

  if (mn.includes('BronzeCopper_Glass')) {
    const glassMat = new THREE.MeshPhysicalNodeMaterial({
      name: mn,
      metalness: 0.04,
      roughness: 0.018,
      clearcoat: 0.38,
      clearcoatRoughness: 0.012,
      ior: 1.52,
      transparent: false,
      envMapIntensity: 0.06,
      side: THREE.DoubleSide,
    });
    const roughSample = texture(hdTextures.canopyRoughness, uv());
    const uCoord = uv().x;
    const wCoord = float(1.0).sub(uv().y);
    const inRoofUV = smoothstep(0.07, 0.09, uCoord)
      .mul(float(1.0).sub(smoothstep(0.91, 0.93, uCoord)))
      .mul(smoothstep(0.05, 0.07, wCoord))
      .mul(float(1.0).sub(smoothstep(0.83, 0.85, wCoord)));
    const fritLeftRight = fillAATSL(float(0.119).sub(uCoord)).max(fillAATSL(uCoord.sub(0.881)));
    const fritRearFront = fillAATSL(float(0.090).sub(wCoord)).max(fillAATSL(wCoord.sub(0.813)));
    const targaSeam = fillAATSL(abs(wCoord.sub(0.531)).sub(0.0022)).mul(0.88);
    const fritEdgeMask = fritLeftRight.max(fritRearFront).max(targaSeam).mul(inRoofUV);
    const glassWindowMask = float(1.0).sub(fritEdgeMask);

    const wp = positionWorld;
    const N = normalize(normalWorld);
    const V = normalize(cameraPosition.sub(wp));
    const NoV = clamp(abs(dot(N, V)), 0.001, 1.0);
    const R = normalize(N.mul(dot(N, V).mul(2.0)).sub(V));
    const F_glass = fresnelDielectricTSL(NoV, float(1.0), float(1.52));
    const fresnel = clamp(float(0.28).add(F_glass.mul(0.76)), 0.32, 1.0);
    const dichroicBronze = mix(vec3(1.12, 0.94, 0.78), vec3(0.92, 0.96, 1.04), smoothstep(0.15, 0.75, NoV));
    const worldSkyClouds = sampleWorldSkyAndCloudsTSL(wp, R).mul(dichroicBronze);

    const glassBaseCol = mix(vec3(0.0010, 0.0010, 0.0014), vec3(0.0030, 0.0036, 0.0055), glassWindowMask);
    const glassRough = mix(float(0.45), clamp(roughSample.g.mul(0.035), 0.012, 0.035), glassWindowMask);
    glassMat.colorNode = glassBaseCol.mul(float(1.0).sub(fresnel));
    glassMat.emissiveNode = worldSkyClouds.mul(fresnel).mul(glassWindowMask);
    glassMat.roughnessNode = glassRough;
    attachStandardDebugNodes(glassMat, glassRough, float(0.04), N);
    return glassMat;
  }

  if (mn.includes('Steel_Rotor') || mn.includes('CarbonCeramic_Rotor')) {
    const rotorMat = new THREE.MeshPhysicalNodeMaterial({
      name: mn,
      color: new THREE.Color(0.76, 0.76, 0.78),
      map: hdTextures.rotorAlbedo,
      metalness: 0.85,
      metalnessMap: hdTextures.rotorMetallic,
      roughness: 0.25,
      roughnessMap: hdTextures.rotorRoughness,
      clearcoat: 0.25,
      envMapIntensity: 0.95,
      side: THREE.DoubleSide,
    });
    rotorMat.normalNode = normalMap(texture(hdTextures.rotorNormal, uv()), vec2(0.95, 0.95));
    const rDist = uv().sub(0.5).length().mul(2.0);
    const sweptBand = smoothstep(0.36, 0.52, rDist).mul(float(1.0).sub(smoothstep(0.78, 0.93, rDist)));
    const radialCoreProfile = smoothstep(0.38, 0.64, rDist).mul(float(1.0).sub(smoothstep(0.68, 0.92, rDist)));
    const rotorKelvin = mix(float(920.0), float(1680.0), clamp(uBrakeThermalGlow.mul(radialCoreProfile.mul(0.85).add(0.15)), 0.0, 1.0));
    rotorMat.emissiveNode = blackbodyTSL(rotorKelvin).mul(3.6).mul(sweptBand).mul(uBrakeThermalGlow);
    attachStandardDebugNodes(rotorMat, float(0.25), float(0.85));
    return rotorMat;
  }

  if (mn.includes('Titanium_Nozzle') || mn.includes('Titanium_Exhaust')) {
    const nozMat = new THREE.MeshPhysicalNodeMaterial({
      name: mn,
      color: new THREE.Color(0.84, 0.82, 0.78),
      map: hdTextures.thrusterAlbedo,
      metalness: 0.88,
      roughness: 0.20,
      roughnessMap: hdTextures.thrusterRoughness,
      clearcoat: 0.35,
      envMapIntensity: 0.85,
      side: THREE.DoubleSide,
    });
    nozMat.normalNode = normalMap(texture(hdTextures.thrusterNormal, uv()), vec2(0.30, 0.30));
    const N_noz = normalize(normalWorld);
    const V_noz = normalize(cameraPosition.sub(positionWorld));
    const rimNoz = pow(float(1.0).sub(clamp(abs(dot(N_noz, V_noz)), 0.0, 1.0)), 1.6);
    nozMat.emissiveNode = vec3(0.22, 0.20, 0.18).mul(rimNoz.mul(0.65).add(0.18));
    attachStandardDebugNodes(nozMat, float(0.20), float(0.88), N_noz);
    return nozMat;
  }

  if (mn.includes('Carbon_Woven')) {
    return makePhysicalNodeMat(
      {
        name: mn,
        color: new THREE.Color(0.90, 0.92, 0.95),
        map: hdTextures.carbonAlbedo,
        metalness: 0.24,
        roughness: 0.28,
        roughnessMap: hdTextures.carbonRoughness,
        clearcoat: 0.28,
        clearcoatRoughness: 0.08,
        ior: 1.5,
        envMapIntensity: 0.55,
        side: THREE.DoubleSide,
      },
      0.28,
      0.24,
      hdTextures.carbonNormal,
      0.55
    );
  }
  if (mn.includes('SatinBlack_Trim')) {
    return makePhysicalNodeMat(
      {
        name: mn,
        color: new THREE.Color(0.020, 0.022, 0.026),
        metalness: 0.16,
        roughness: 0.40,
        clearcoat: 0.08,
        clearcoatRoughness: 0.18,
        envMapIntensity: 0.40,
        side: THREE.DoubleSide,
      },
      0.40,
      0.16
    );
  }
  if (mn.includes('DarkGunmetal_Bumper')) {
    return makePhysicalNodeMat(
      {
        name: mn,
        color: new THREE.Color(0.072, 0.076, 0.084),
        metalness: 0.38,
        roughness: 0.34,
        clearcoat: 0.16,
        clearcoatRoughness: 0.14,
        envMapIntensity: 0.60,
        side: THREE.DoubleSide,
      },
      0.34,
      0.38
    );
  }
  if (mn.includes('Tire_Rubber')) {
    return makePhysicalNodeMat(
      {
        name: mn,
        color: new THREE.Color(0.92, 0.93, 0.96),
        map: hdTextures.tireTreadAlbedo,
        metalness: 0.04,
        roughness: 0.58,
        roughnessMap: hdTextures.tireTreadRoughness,
        envMapIntensity: 0.65,
      },
      0.58,
      0.04,
      hdTextures.tireTreadNormal,
      0.95
    );
  }
  if (mn.includes('Tire_Sidewall') || mn.includes('Tire_Lettering')) {
    return makePhysicalNodeMat(
      {
        name: mn,
        color: new THREE.Color(0.90, 0.91, 0.95),
        map: hdTextures.tireSidewallAlbedo,
        metalness: 0.04,
        roughness: 0.48,
        roughnessMap: hdTextures.tireSidewallRoughness,
        clearcoat: 0.10,
        envMapIntensity: 0.65,
      },
      0.48,
      0.04,
      hdTextures.tireSidewallNormal,
      0.8
    );
  }
  if (mn.includes('Bronze_Caliper')) {
    return makePhysicalNodeMat(
      {
        name: mn,
        color: new THREE.Color(0.54, 0.35, 0.15),
        metalness: 0.85,
        roughness: 0.21,
        clearcoat: 0.78,
        envMapIntensity: 1.05,
        side: THREE.DoubleSide,
      },
      0.21,
      0.85
    );
  }
  if (mn.includes('AeroBlade_WhiteSilver')) {
    return makePhysicalNodeMat(
      {
        name: mn,
        color: new THREE.Color(0.68, 0.70, 0.74),
        metalness: 0.38,
        roughness: 0.22,
        clearcoat: 0.65,
        clearcoatRoughness: 0.05,
        envMapIntensity: 0.85,
        side: THREE.DoubleSide,
      },
      0.22,
      0.38,
      hdTextures.wheelRadialNormal,
      0.18
    );
  }
  if (mn.includes('GlossBlack_Spoke')) {
    return makePhysicalNodeMat(
      {
        name: mn,
        color: new THREE.Color(0.012, 0.013, 0.016),
        metalness: 0.45,
        roughness: 0.08,
        clearcoat: 0.9,
        clearcoatRoughness: 0.02,
        envMapIntensity: 0.85,
        side: THREE.DoubleSide,
      },
      0.08,
      0.45
    );
  }
  if (mn.includes('Spoke_MachinedEdge') || mn.includes('Machined_RimFace') || mn.includes('Chrome_Lug')) {
    return makePhysicalNodeMat(
      {
        name: mn,
        color: new THREE.Color(0.76, 0.78, 0.82),
        metalness: 0.92,
        roughness: 0.18,
        roughnessMap: hdTextures.wheelRadialRoughness,
        clearcoat: 0.7,
        envMapIntensity: 1.05,
        side: THREE.DoubleSide,
      },
      0.18,
      0.92,
      hdTextures.wheelRadialNormal,
      0.4
    );
  }
  if (mn.includes('Nozzle_InnerDark') || mn.includes('Shutline_Dark')) {
    return makePhysicalNodeMat(
      {
        name: mn,
        color: new THREE.Color(0.001, 0.001, 0.002),
        metalness: 0.02,
        roughness: 0.98,
        envMapIntensity: 0.0,
        side: THREE.DoubleSide,
      },
      0.98,
      0.02
    );
  }
  if (mn.includes('Plate_Surface') || mn.includes('Plate_White')) {
    return makePhysicalNodeMat(
      {
        name: mn,
        color: new THREE.Color(0.78, 0.77, 0.76),
        metalness: 0.08,
        roughness: 0.36,
        clearcoat: 0.20,
        envMapIntensity: 0.55,
        side: THREE.DoubleSide,
      },
      0.36,
      0.08
    );
  }
  if (mn.includes('Plate_Text')) {
    return makePhysicalNodeMat(
      {
        name: mn,
        color: new THREE.Color(0.26, 0.27, 0.30),
        metalness: 0.25,
        roughness: 0.32,
        clearcoat: 0.25,
        envMapIntensity: 0.50,
        side: THREE.DoubleSide,
      },
      0.32,
      0.25
    );
  }
  if (mn.includes('Underbody_Alloy')) {
    return makePhysicalNodeMat(
      {
        name: mn,
        color: new THREE.Color(0.24, 0.26, 0.29),
        metalness: 0.62,
        roughness: 0.30,
        roughnessMap: hdTextures.underbodyAlloyRoughness,
        envMapIntensity: 0.75,
        side: THREE.DoubleSide,
      },
      0.30,
      0.62,
      hdTextures.underbodyAlloyNormal,
      0.35
    );
  }
  if (mn.includes('Interior_Dark')) {
    return makePhysicalNodeMat(
      {
        name: mn,
        color: new THREE.Color(0.012, 0.012, 0.014),
        metalness: 0.02,
        roughness: 0.78,
        roughnessMap: hdTextures.alcantaraRoughness,
        envMapIntensity: 0.25,
        side: THREE.DoubleSide,
      },
      0.78,
      0.02,
      hdTextures.alcantaraNormal,
      0.65
    );
  }
  if (mn.includes('RedLED_Emissive')) {
    return makePhysicalNodeMat(
      {
        name: mn,
        color: new THREE.Color(0xff1018),
        emissive: new THREE.Color(0xff0812),
        emissiveIntensity: 2.8,
        roughness: 0.05,
        clearcoat: 1.0,
        side: THREE.DoubleSide,
      },
      0.05,
      0.10
    );
  }
  if (mn.includes('WhiteLED_Emissive')) {
    return makePhysicalNodeMat(
      {
        name: mn,
        color: new THREE.Color(0xf8fbff),
        emissive: new THREE.Color(0xf4f9ff),
        emissiveIntensity: 1.85,
        roughness: 0.06,
        clearcoat: 1.0,
        side: THREE.DoubleSide,
      },
      0.06,
      0.10
    );
  }
  if (mn.includes('AmberLED_Emissive')) {
    return makePhysicalNodeMat(
      {
        name: mn,
        color: new THREE.Color(0xff7700),
        emissive: new THREE.Color(0xff6600),
        emissiveIntensity: 1.35,
        roughness: 0.08,
        clearcoat: 0.9,
        side: THREE.DoubleSide,
      },
      0.08,
      0.10
    );
  }
  if (mn.includes('RedReflector_Subtle')) {
    return makePhysicalNodeMat(
      {
        name: mn,
        color: new THREE.Color(0.85, 0.02, 0.02),
        emissive: new THREE.Color(0.95, 0.03, 0.02),
        emissiveIntensity: 1.1,
        metalness: 0.15,
        roughness: 0.12,
        clearcoat: 0.95,
        side: THREE.DoubleSide,
      },
      0.12,
      0.15
    );
  }

  return makePhysicalNodeMat(
    {
      name: mn,
      color: m.color ? m.color.clone() : new THREE.Color(0.5, 0.5, 0.5),
      metalness: m.metalness ?? 0.2,
      roughness: m.roughness ?? 0.5,
      side: THREE.DoubleSide,
    },
    m.roughness ?? 0.5,
    m.metalness ?? 0.2
  );
}

// ============================================================================
// Wireframe Topology Overlay Helper & Car Rigging
// ============================================================================
const wireframeLineMat = new THREE.LineBasicMaterial({
  color: 0x7cf2a0,
  transparent: true,
  opacity: 0.44,
  depthTest: true,
  depthWrite: false,
});
const wireframeOverlays = [];

function attachWireframeOverlay(meshObj) {
  if (!meshObj || !meshObj.geometry) return;
  const wfGeo = new THREE.WireframeGeometry(meshObj.geometry);
  const lines = new THREE.LineSegments(wfGeo, wireframeLineMat);
  lines.scale.setScalar(1.0012);
  lines.visible = false;
  meshObj.add(lines);
  wireframeOverlays.push(lines);
}

const carParts = {
  wheelsSpin: [],
  wingPivotGroup: null,
  wingRestPos: new THREE.Vector3(),
};

const gltfLoader = new GLTFLoader();
gltfLoader.setCrossOrigin('anonymous');
gltfLoader.load(
  `${ASSET_BASE}/final_car/tesla_roadster_2026.glb`,
  (gltf) => {
    const model = gltf.scene;
    model.updateMatrixWorld(true);

    const upgradedMatCache = new Map();
    model.traverse((child) => {
      if (child.isMesh) {
        const combinedName = `${child.parent?.name || ''}_${child.name || ''}`;
        const matName = child.material?.name || '';
        const isHiddenShadow =
          combinedName.includes('Brake_') ||
          combinedName.includes('Suspension_') ||
          combinedName.includes('Cabin_') ||
          combinedName.includes('RimBarrel_') ||
          combinedName.includes('Underbody_') ||
          matName.includes('LED_');
        child.castShadow = !isHiddenShadow;
        child.receiveShadow = false;

        const upgradeOne = (mat) => {
          if (!mat) return mat;
          const key = mat.name || mat.uuid;
          if (!upgradedMatCache.has(key)) {
            upgradedMatCache.set(key, upgradeToHyperRealMaterial(mat));
          }
          return upgradedMatCache.get(key);
        };
        child.material = Array.isArray(child.material)
          ? child.material.map(upgradeOne)
          : upgradeOne(child.material);
      }
    });

    const rootNode = model.getObjectByName('Roadster_2026_Root') || model.children[0] || model;
    rootNode.updateMatrixWorld(true);
    const rootInvMatrix = new THREE.Matrix4().copy(rootNode.matrixWorld).invert();
    const topNodes = [...rootNode.children];

    const rotX180 = new THREE.Matrix4().makeRotationX(Math.PI);
    const completeWheelAeroDiscGeometry = (geo, isLeft) => {
      const posAttr = geo.attributes.position;
      const indexAttr = geo.index;
      if (!posAttr || !indexAttr) return geo;
      const srcIndices = indexAttr.array;
      const keptIndices = [];
      for (let i = 0; i < srcIndices.length; i += 3) {
        const i0 = srcIndices[i];
        const i1 = srcIndices[i + 1];
        const i2 = srcIndices[i + 2];
        const cz = (posAttr.getZ(i0) + posAttr.getZ(i1) + posAttr.getZ(i2)) / 3.0;
        if (isLeft ? cz >= -0.003 : cz <= 0.003) keptIndices.push(i0, i1, i2);
      }
      if (keptIndices.length === 0) return geo;
      const halfA = geo.clone();
      halfA.setIndex(keptIndices);
      const halfB = halfA.clone();
      halfB.applyMatrix4(rotX180);
      const fullGeo = mergeGeometries([halfA, halfB], false);
      halfA.dispose();
      halfB.dispose();
      geo.dispose();
      return fullGeo;
    };

    const mergeMeshBucket = (meshes, targetSpaceInvMatrix, namePrefix, wheelOpts = null) => {
      const prepareClone = (m) => {
        let g = m.geometry.clone();
        if (wheelOpts && m.userData.isStarAeroDisc) {
          g = completeWheelAeroDiscGeometry(g, wheelOpts.isLeft);
        }
        const relMat = new THREE.Matrix4().multiplyMatrices(targetSpaceInvMatrix, m.matrixWorld);
        g.applyMatrix4(relMat);
        return g;
      };
      if (meshes.length === 1) {
        const m = meshes[0];
        const out = new THREE.Mesh(prepareClone(m), m.material);
        out.name = `${namePrefix}_${m.material?.name || 'Mat'}`;
        out.castShadow = m.castShadow;
        attachWireframeOverlay(out);
        return out;
      }
      const geos = [];
      let anyCast = false;
      for (let i = 0; i < meshes.length; i++) {
        geos.push(prepareClone(meshes[i]));
        if (meshes[i].castShadow) anyCast = true;
      }
      const mergedGeo = mergeGeometries(geos, false);
      geos.forEach((g) => g.dispose());
      const out = new THREE.Mesh(mergedGeo, meshes[0].material);
      out.name = `${namePrefix}_${meshes[0].material?.name || 'Mat'}`;
      out.castShadow = anyCast;
      attachWireframeOverlay(out);
      return out;
    };

    const sprungBuckets = {
      body: new Map(),
      suspension: new Map(),
      thrusters: new Map(),
      underbody: new Map(),
    };
    const wheelCorners = {
      FL: { spinNodes: [], brakeNodes: [], refNode: null },
      FR: { spinNodes: [], brakeNodes: [], refNode: null },
      RL: { spinNodes: [], brakeNodes: [], refNode: null },
      RR: { spinNodes: [], brakeNodes: [], refNode: null },
    };

    topNodes.forEach((topNode) => {
      const nodeName = topNode.name || '';
      const cornerMatch = nodeName.match(/_(FL|FR|RL|RR)$/);
      const corner = cornerMatch ? cornerMatch[1] : null;

      if (
        corner &&
        (nodeName.startsWith('Tire_') ||
          nodeName.startsWith('Rim_') ||
          nodeName.startsWith('RimBarrel_') ||
          nodeName.startsWith('RimStarAero_'))
      ) {
        wheelCorners[corner].spinNodes.push(topNode);
        if (nodeName.startsWith('Tire_')) wheelCorners[corner].refNode = topNode;
        return;
      }

      if (corner && nodeName.startsWith('Brake_')) {
        wheelCorners[corner].brakeNodes.push(topNode);
        return;
      }

      if (nodeName === 'Active_Rear_Wing') {
        const wingPivotGroup = new THREE.Group();
        wingPivotGroup.name = 'ActiveRearWingPivot';
        const wingBox = new THREE.Box3();
        const wingMeshes = [];

        topNode.traverse((child) => {
          if (child.isMesh && child.geometry) {
            const g = child.geometry.clone();
            const relMat = new THREE.Matrix4().multiplyMatrices(rootInvMatrix, child.matrixWorld);
            g.applyMatrix4(relMat);
            const posAttr = g.attributes.position;
            const isBlackBacking = (child.material?.name || '').includes('SatinBlack');
            if (posAttr) {
              for (let i = 0; i < posAttr.count; i++) {
                const vx = posAttr.getX(i);
                const vy = posAttr.getY(i);
                const vz = posAttr.getZ(i);
                const tZ = Math.max(0.0, Math.min(1.0, (vz - 1.9866) / (2.2450 - 1.9866)));
                const normX = Math.min(1.0, Math.abs(vx) / 0.443);
                const archFactor = 1.0 - normX * normX;
                const dy = -0.016 * tZ * archFactor - (isBlackBacking ? 0.006 : 0.0);
                const dz = isBlackBacking ? -0.008 * tZ : 0.0;
                posAttr.setXYZ(i, vx, vy + dy, vz + dz);
              }
              posAttr.needsUpdate = true;
            }
            g.computeBoundingBox();
            wingBox.union(g.boundingBox);
            wingMeshes.push({ geo: g, mat: child.material, castShadow: child.castShadow });
          }
        });

        // Hinge around the leading edge of the rear spoiler so deployment lifts & pitches cleanly
        const hingePos = new THREE.Vector3(0, wingBox.max.y, wingBox.min.z);
        const shiftMat = new THREE.Matrix4().makeTranslation(-hingePos.x, -hingePos.y, -hingePos.z);
        wingMeshes.forEach(({ geo, mat, castShadow }) => {
          geo.applyMatrix4(shiftMat);
          const m = new THREE.Mesh(geo, mat);
          m.castShadow = castShadow;
          attachWireframeOverlay(m);
          wingPivotGroup.add(m);
        });

        wingPivotGroup.position.copy(hingePos);
        carParts.wingPivotGroup = wingPivotGroup;
        carParts.wingRestPos.copy(hingePos);
        chassisSprungGroup.add(wingPivotGroup);
        return;
      }

      let category = 'body';
      if (nodeName.includes('Suspension_')) category = 'suspension';
      else if (nodeName.includes('RearDiffuser') || nodeName.includes('RearFascia') || nodeName.includes('RDSTR_')) category = 'thrusters';
      else if (nodeName.includes('Underbody_')) category = 'underbody';

      const catMap = sprungBuckets[category];
      topNode.traverse((child) => {
        if (child.isMesh && child.geometry) {
          const matKey = child.material?.uuid || 'default';
          if (!catMap.has(matKey)) catMap.set(matKey, []);
          catMap.get(matKey).push(child);
        }
      });
    });

    Object.entries(sprungBuckets).forEach(([category, catMap]) => {
      catMap.forEach((meshes) => {
        if (meshes.length > 0) {
          chassisSprungGroup.add(mergeMeshBucket(meshes, rootInvMatrix, `Batched_${category}`));
        }
      });
    });

    ['FL', 'FR', 'RL', 'RR'].forEach((corner) => {
      const info = wheelCorners[corner];
      const isLeft = corner === 'FL' || corner === 'RL';
      const isFront = corner === 'FL' || corner === 'FR';

      if (info.spinNodes.length > 0) {
        const ref = info.refNode || info.spinNodes[0];
        const wheelGroup = new THREE.Group();
        wheelGroup.position.copy(ref.position);
        wheelGroup.quaternion.copy(ref.quaternion);
        wheelGroup.scale.copy(ref.scale);
        wheelGroup.rotation.order = 'YXZ';
        wheelGroup.userData.isLeftWheel = isLeft;
        wheelGroup.userData.isFrontWheel = isFront;

        const refInvMatrix = new THREE.Matrix4().copy(ref.matrixWorld).invert();
        const matMap = new Map();
        info.spinNodes.forEach((n) => {
          const isStarAeroNode = (n.name || '').includes('StarAero');
          n.traverse((child) => {
            if (child.isMesh && child.geometry) {
              const matName = child.material?.name || '';
              if (isStarAeroNode && (matName.includes('AeroBlade_WhiteSilver') || matName.includes('SatinBlack_Trim'))) {
                child.userData.isStarAeroDisc = true;
              }
              const mk = child.material?.uuid || 'default';
              if (!matMap.has(mk)) matMap.set(mk, []);
              matMap.get(mk).push(child);
            }
          });
        });

        matMap.forEach((meshes) => {
          wheelGroup.add(mergeMeshBucket(meshes, refInvMatrix, `Wheel_${corner}`, { isLeft }));
        });

        wheelsUnsprungGroup.add(wheelGroup);
        carParts.wheelsSpin.push(wheelGroup);
      }

      info.brakeNodes.forEach((brakeNode) => {
        brakeNode.rotation.order = 'YXZ';
        brakeNode.position.x += isLeft ? 0.014 : -0.014;
        brakeNode.traverse((c) => {
          if (c.isMesh) attachWireframeOverlay(c);
        });
        wheelsUnsprungGroup.add(brakeNode);
      });
    });

    updateLoaderProgress(1.0);
    window.__roadsterLoaded = true;
    dismissLoaderIfReady();
  },
  (xhr) => {
    if (xhr.total) {
      const frac = Math.min(1.0, xhr.loaded / xhr.total);
      updateLoaderProgress(frac);
      if (loaderTitle) {
        loaderTitle.textContent = `Streaming 2026 Roadster GLB ${Math.round(frac * 100)}% (${(xhr.loaded / 1048576).toFixed(1)} MB)...`;
      }
    }
  },
  () => window.showViewerFailure()
);

function dismissLoaderIfReady() {
  if (window.__roadsterLoaded && window.__gpuReady && loaderOverlay) {
    clearTimeout(window.viewerLoadTimeout);
    loaderOverlay.classList.add('hidden');
    document.querySelectorAll('button').forEach(button => { button.disabled = false; });
  }
}

// ============================================================================
// Interactive State, Camera Transitions &Thruster Vectoring
// ============================================================================
const viewerState = {
  activeEffect: 'beauty',
  rollCycleClock: 0.0,
  wheelSpinAngle: 0.0,
  wingDeploy: 0.0,
  sprungPitchX: 0.0,
  sprungOffsetY: 0.0,
  hoverOffsetY: 0.0,
  brakeGlow: 0.0,
  activeCameraPreset: 'hero',
  camTransition: null,
};

function animateCameraTo(presetKey) {
  const preset = CAMERA_PRESETS[presetKey];
  if (!preset) return;
  viewerState.activeCameraPreset = presetKey;
  viewerState.camTransition = {
    startPos: camera.position.clone(),
    endPos: new THREE.Vector3(...preset.pos),
    startTarget: controls.target.clone(),
    endTarget: new THREE.Vector3(...preset.target),
    t: 0,
    duration: 0.62,
  };
  document.querySelectorAll('.cam-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.cam === presetKey);
  });
}

function applyEffectMode(effectKey) {
  viewerState.activeEffect = effectKey;
  viewerState.rollCycleClock = 0.0;

  // Reset compile-time TSL debug mode unless normals or roughness is active
  if (effectKey === 'normals') uShaderDebugMode.value = 1;
  else if (effectKey === 'roughness') uShaderDebugMode.value = 3;
  else uShaderDebugMode.value = 0;

  // Toggle wireframe overlay
  const isWf = effectKey === 'wireframe';
  uWireframeDim.value = isWf ? 1.0 : 0.0;
  wireframeOverlays.forEach((l) => {
    l.visible = isWf;
  });

  // Helpful automatic camera framing when selecting specialized effects
  if (effectKey === 'brakes') {
    animateCameraTo('brake');
  } else if (effectKey === 'thrusters') {
    animateCameraTo('rear');
  } else if (effectKey === 'aero') {
    viewerState.activeCameraPreset = 'rear';
    viewerState.camTransition = {
      startPos: camera.position.clone(),
      endPos: new THREE.Vector3(-2.92, 1.16, 2.38),
      startTarget: controls.target.clone(),
      endTarget: new THREE.Vector3(-0.15, 0.56, 0.0),
      t: 0,
      duration: 0.65,
    };
    document.querySelectorAll('.cam-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.cam === 'rear');
    });
  } else if (effectKey === 'barrelRoll') {
    // Frame wider so the full mid-air 360° roll stays centered in view
    viewerState.activeCameraPreset = 'hero';
    viewerState.camTransition = {
      startPos: camera.position.clone(),
      endPos: new THREE.Vector3(3.95, 1.55, 4.15),
      startTarget: controls.target.clone(),
      endTarget: new THREE.Vector3(0.0, 1.02, 0.0),
      t: 0,
      duration: 0.65,
    };
    document.querySelectorAll('.cam-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.cam === 'hero');
    });
  } else if (viewerState.activeCameraPreset === 'brake' || viewerState.activeCameraPreset === 'rear') {
    animateCameraTo('hero');
  }

  document.querySelectorAll('.effect-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.effect === effectKey);
  });
  if (effectReadout && EFFECT_DESCRIPTIONS[effectKey]) {
    effectReadout.innerHTML = EFFECT_DESCRIPTIONS[effectKey];
  }
}

// Wire UI Buttons
document.querySelectorAll('.effect-btn').forEach((btn) => {
  btn.addEventListener('click', () => applyEffectMode(btn.dataset.effect));
});

document.querySelectorAll('.cam-btn').forEach((btn) => {
  btn.addEventListener('click', () => animateCameraTo(btn.dataset.cam));
});

document.querySelectorAll('.paint-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const p = PAINT_PRESETS[btn.dataset.paint];
    if (!p) return;
    uPaintShadow.value.set(...p.shadow);
    uPaintMid.value.set(...p.mid);
    uPaintCrown.value.set(...p.crown);
    uPaintSpec.value.set(...p.spec);
    uPaintCrest.value.set(...p.crest);
    uPaintEnvTint.value.set(...p.envTint);
    document.querySelectorAll('.paint-btn').forEach((b) => b.classList.toggle('active', b === btn));
  });
});

document.querySelectorAll('.tm-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    uTonemapMode.value = Number(btn.dataset.tm) || 0;
    document.querySelectorAll('.tm-btn').forEach((b) => b.classList.toggle('active', b === btn));
  });
});

if (btnAutoOrbit) {
  btnAutoOrbit.addEventListener('click', () => {
    controls.autoRotate = !controls.autoRotate;
    btnAutoOrbit.classList.toggle('active', controls.autoRotate);
    btnAutoOrbit.textContent = controls.autoRotate ? 'Orbit: On' : 'Orbit: Off';
  });
}

// ============================================================================
// Thruster Gimbal Vectoring & Animation Loop
// ============================================================================
const _downAxis = new THREE.Vector3(0, -1, 0);
const _targetDir = new THREE.Vector3();
const _axisX = new THREE.Vector3(1, 0, 0);
const _axisZ = new THREE.Vector3(0, 0, 1);
const _qPitch = new THREE.Quaternion();
const _qRoll = new THREE.Quaternion();

function updateThrusterPlumes(tau, isRollStunt, isStaticThrusters) {
  if (!isRollStunt && !isStaticThrusters) {
    plumeGroup.scale.setScalar(0.0001);
    thrusterGroundLight.intensity = 0.0;
    return;
  }

  plumeGroup.scale.set(1, 1, 1);

  if (isStaticThrusters) {
    const pulse = 0.84 + Math.sin(uSimTime.value * 18.0) * 0.07;
    primaryPlumePivots.forEach((piv) => {
      piv.quaternion.identity();
      piv.scale.set(0.96, pulse, 0.96);
    });
    correctionPlumePivots.forEach((piv) => {
      piv.scale.set(0.82, 0.68 + Math.cos(uSimTime.value * 21.0) * 0.07, 0.82);
    });
    rearPlumePivots.forEach((piv) => {
      piv.scale.set(1.22, 1.48 + Math.sin(uSimTime.value * 24.0) * 0.14, 1.22);
    });
    thrusterGroundLight.position.set(-1.35, 0.42, 0.0);
    thrusterGroundLight.intensity = 5.4;
    return;
  }

  // Dynamic r x F differential thruster vectoring during 2.8s 360° Barrel Roll
  const rTrack = sampleTrack(ROLL_KNOTS, tau);
  const yTrack = sampleTrack(HEIGHT_KNOTS, tau);
  const phi = rTrack.p;
  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);

  const preRollLead = tau >= 0.36 && tau <= 0.58 ? Math.sin(((tau - 0.36) / 0.22) * Math.PI) * 0.52 : 0.0;
  const uRoll = Math.max(-1.0, Math.min(1.0, rTrack.a / 13.8 + preRollLead));

  const dtS = 0.05;
  const yPrev = sampleTrack(HEIGHT_KNOTS, Math.max(0, tau - dtS));
  const yNext = sampleTrack(HEIGHT_KNOTS, Math.min(2.8, tau + dtS));
  const verticalJerk = (yNext.v - 2.0 * yTrack.v + yPrev.v) / (dtS * dtS);
  const liftoffPitch = tau < 0.34 ? (1.0 - tau / 0.34) * 0.78 : 0.0;
  const landingPitch = tau > 2.15 ? Math.sin(Math.min(1.0, (tau - 2.15) / 0.65) * Math.PI * 0.85) * 0.82 : 0.0;
  const uPitch = Math.max(-1.0, Math.min(1.0, verticalJerk / 42.0 + liftoffPitch + landingPitch));

  let axialZ = 0.0;
  if (tau < 0.72) axialZ = 0.54 * (1.0 - tau / 0.72);
  else if (tau > 2.05) axialZ = -0.56 * Math.sin(Math.min(1.0, (tau - 2.05) / 0.75) * (Math.PI * 0.5));

  primaryPlumePivots.forEach((piv) => {
    const sideX = piv.userData.sideX;
    const sideZ = piv.userData.sideZ;
    const isDrivingRollSide = sideX * uRoll > 0;
    const dxRoll = -uRoll * (isDrivingRollSide ? 0.50 : 0.90);
    const dxPitchCouple = 0.38 * sideZ * sinPhi;
    const dxGravitySupport = -0.25 * sinPhi;
    const dx = Math.max(-1.05, Math.min(1.05, dxRoll + dxPitchCouple + dxGravitySupport));

    const dzPitchCouple = 0.30 * sideZ * uPitch;
    const dzRollScissor = -0.46 * sideX * uRoll;
    const dz = Math.max(-0.95, Math.min(0.95, axialZ + dzPitchCouple + dzRollScissor));

    _targetDir.set(dx, -1.0, dz).normalize();
    piv.quaternion.setFromUnitVectors(_downAxis, _targetDir);

    const rollDiff = 0.65 * sideX * uRoll;
    const pitchDiff = -0.35 * sideZ * uPitch * cosPhi;
    const lenScale = Math.max(0.68, Math.min(2.25, 1.55 + rollDiff + pitchDiff));
    const radScale = 0.95 + 0.35 * lenScale;
    piv.scale.set(radScale, lenScale, radScale);
  });

  correctionPlumePivots.forEach((piv) => {
    piv.scale.set(1.0, Math.abs(uRoll) > 0.08 ? 0.95 : 0.35, 1.0);
  });
  rearPlumePivots.forEach((piv) => {
    piv.scale.set(1.0, tau < 0.85 ? 1.15 : 0.45, 1.0);
  });
}

let renderPipeline = null;
let lastNow = performance.now();

function buildPostPipeline() {
  const pipeline = new THREE.RenderPipeline(renderer);
  const scenePass = pass(scene, camera);
  const sceneColor = scenePass.getTextureNode('output');
  const bloomPass = bloom(sceneColor, 0.24, 0.45, 1.15);
  const hdrCombined = sceneColor.add(bloomPass.mul(uEnableBloom));
  pipeline.outputColorTransform = false;
  registerSpecializablePipeline(pipeline, () =>
    finalizeShaderSkillsFrameTSL(hdrCombined.rgb, uToneMappingExposure, screenUV)
  );
  return pipeline;
}

function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, Math.max(0.001, (now - lastNow) / 1000));
  lastNow = now;
  uSimTime.value += dt;

  // Smooth camera preset transition
  if (viewerState.camTransition) {
    const tr = viewerState.camTransition;
    tr.t += dt / tr.duration;
    const u = Math.min(1, tr.t);
    const ease = 1 - Math.pow(1 - u, 3);
    camera.position.lerpVectors(tr.startPos, tr.endPos, ease);
    controls.target.lerpVectors(tr.startTarget, tr.endTarget, ease);
    if (u >= 1) viewerState.camTransition = null;
  }

  const ef = viewerState.activeEffect;
  const lerpFast = Math.min(1.0, dt * 8.0);

  // 1. Wheel Spin Speed
  const wheelOmega = ef === 'aero' || ef === 'barrelRoll' ? 32.0 : ef === 'brakes' ? 20.0 : 0.0;
  viewerState.wheelSpinAngle = (viewerState.wheelSpinAngle + wheelOmega * dt) % (Math.PI * 200);
  carParts.wheelsSpin.forEach((w) => {
    const isLeft = w.userData.isLeftWheel;
    const baseY = isLeft ? Math.PI : 0;
    const spinX = isLeft ? viewerState.wheelSpinAngle : -viewerState.wheelSpinAngle;
    w.rotation.set(spinX, baseY, 0, 'YXZ');
  });

  // 2. Active Rear Wing Deployment & Chassis Squat / Dive
  const targetWing = ef === 'aero' ? 1.0 : 0.0;
  viewerState.wingDeploy += (targetWing - viewerState.wingDeploy) * lerpFast;
  if (carParts.wingPivotGroup) {
    carParts.wingPivotGroup.position.set(
      carParts.wingRestPos.x,
      carParts.wingRestPos.y + viewerState.wingDeploy * 0.095,
      carParts.wingRestPos.z - viewerState.wingDeploy * 0.018
    );
    carParts.wingPivotGroup.rotation.x = viewerState.wingDeploy * 0.28;
  }
  laserHaloMesh.scale.set(1.0, 1.0 + viewerState.wingDeploy * 1.15, 1.0);

  const targetPitchX = ef === 'brakes' ? 0.032 : ef === 'aero' ? -0.024 : 0.0;
  const targetSprungY = ef === 'aero' ? -0.018 : ef === 'brakes' ? -0.010 : 0.0;
  viewerState.sprungPitchX += (targetPitchX - viewerState.sprungPitchX) * lerpFast;
  viewerState.sprungOffsetY += (targetSprungY - viewerState.sprungOffsetY) * lerpFast;
  chassisSprungGroup.position.set(0, viewerState.sprungOffsetY, 0);
  chassisSprungGroup.rotation.set(viewerState.sprungPitchX, 0, 0);

  // 3. Planckian Carbon-Ceramic Brake Glow
  const targetGlow = ef === 'brakes' ? 0.92 + Math.sin(uSimTime.value * 5.5) * 0.08 : 0.0;
  viewerState.brakeGlow += (targetGlow - viewerState.brakeGlow) * Math.min(1.0, dt * 5.5);
  uBrakeThermalGlow.value = viewerState.brakeGlow;

  // 4. Stunt Roll / Hover / Grounded Pose
  let rootY = GROUNDED_ROOT_HEIGHT;
  let worldPitch = 0.0;
  let worldRoll = 0.0;

  if (ef === 'barrelRoll') {
    // 2.80s active flight + 0.85s grounded pause before repeating
    viewerState.rollCycleClock = (viewerState.rollCycleClock + dt) % 3.65;
    const tau = viewerState.rollCycleClock;
    if (tau <= 2.80) {
      const yEv = sampleTrack(HEIGHT_KNOTS, tau);
      const rEv = sampleTrack(ROLL_KNOTS, tau);
      rootY = GROUNDED_ROOT_HEIGHT + yEv.p * 0.22; // Studio-scaled arc height so car stays nicely in frame
      worldPitch = Math.atan2(yEv.v * 0.22, 16.0);
      worldRoll = rEv.p;
      uCarAirborneFactor.value = 1.0;
      updateThrusterPlumes(tau, true, false);
      thrusterGroundLight.position.set(0, Math.max(0.25, rootY - 0.35), 0);
      thrusterGroundLight.intensity = Math.max(0, 4.2 * (1.0 - (rootY - GROUNDED_ROOT_HEIGHT) / 1.8));
    } else {
      uCarAirborneFactor.value = 0.0;
      updateThrusterPlumes(0, false, false);
    }
  } else if (ef === 'thrusters') {
    const hoverTarget = 0.34 + Math.sin(uSimTime.value * 3.8) * 0.022;
    viewerState.hoverOffsetY += (hoverTarget - viewerState.hoverOffsetY) * lerpFast;
    rootY = GROUNDED_ROOT_HEIGHT + viewerState.hoverOffsetY;
    worldPitch = 0.042;
    uCarAirborneFactor.value = 0.55;
    updateThrusterPlumes(0, false, true);
  } else {
    const underbodyLift = viewerState.activeCameraPreset === 'underbody' ? 0.52 : 0.0;
    viewerState.hoverOffsetY += (underbodyLift - viewerState.hoverOffsetY) * lerpFast;
    rootY = GROUNDED_ROOT_HEIGHT + viewerState.hoverOffsetY;
    uCarAirborneFactor.value = viewerState.hoverOffsetY > 0.15 ? 0.5 : 0.0;
    updateThrusterPlumes(0, false, false);
  }

  carRoot.position.set(0, rootY, 0);
  _qPitch.setFromAxisAngle(_axisZ, worldPitch);
  _qRoll.setFromAxisAngle(_axisX, worldRoll);
  carRoot.quaternion.copy(_qPitch).multiply(_qRoll);

  // Attenuate contact shadow smoothly with vehicle height above turntable
  const hAboveFloor = Math.max(0, rootY - GROUNDED_ROOT_HEIGHT);
  const shadowFade = Math.max(0.0, 1.0 - hAboveFloor / 1.65);
  uContactShadowOpacity.value = shadowFade * shadowFade * 0.95;
  const spread = 1.0 + hAboveFloor * 0.22;
  contactShadowMesh.scale.set(spread, spread, 1.0);

  // Disable bloom in pure TSL diagnostic modes so false-color ramps stay exact
  uEnableBloom.value = ef === 'normals' || ef === 'roughness' ? 0.0 : 1.0;

  controls.update();
  if (renderPipeline) {
    renderPipeline.render();
  } else {
    renderer.render(scene, camera);
  }
}

window.addEventListener('resize', () => {
  const w = host.clientWidth || window.innerWidth;
  const h = host.clientHeight || 368;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

async function boot() {
  try {
    await renderer.init();
  } catch (error) {
    console.error('Roadster renderer unavailable:', error);
    window.showViewerFailure();
    return;
  }
  try {
    const isWebGPU = Boolean(renderer.backend?.isWebGPUBackend);
    if (backendBadge) {
      backendBadge.textContent = isWebGPU ? 'WebGPU · TSL Live' : 'WebGL2 · TSL Live';
    }
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(createHorizonEnvScene(), 0.0).texture;
    pmrem.dispose();
  } catch (err) {
    console.warn('PMREM fallback:', err);
  }

  try {
    renderPipeline = buildPostPipeline();
  } catch (err) {
    console.warn('Direct renderer fallback:', err);
  }

  window.__gpuReady = true;
  dismissLoaderIfReady();
  lastNow = performance.now();
  requestAnimationFrame(animate);
}

boot();

// Expose API for automated verification & parent-page control
window.RoadsterEffectsViewer = {
  applyEffectMode,
  animateCameraTo,
  viewerState,
};
