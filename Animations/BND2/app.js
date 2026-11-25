import * as THREE from 'three';

const stage = document.querySelector('#stage');
const replayButton = document.querySelector('#replay');
const animationEnd = 29.7 + 12.2;
replayButton.addEventListener('click', () => window.location.reload());
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#scene') });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

const cream = new THREE.Color('#f3f1eb');
const scene = new THREE.Scene();
scene.background = cream.clone();
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(0, 0, 12);
camera.lookAt(0, 0, 0);
scene.add(new THREE.HemisphereLight(0xffffff, 0x77736d, 2.0));
const key = new THREE.DirectionalLight(0xfff2dc, 3.2);
key.position.set(-4, 6, 8);
scene.add(key);
const fill = new THREE.DirectionalLight(0x8b919b, 1.4);
fill.position.set(4, 1, 5);
scene.add(fill);

const introCanvas = document.createElement('canvas');
introCanvas.width = 1600;
introCanvas.height = 260;
const introCtx = introCanvas.getContext('2d');
introCtx.clearRect(0, 0, 1600, 260);
introCtx.fillStyle = '#17191d';
introCtx.textAlign = 'center';
introCtx.textBaseline = 'middle';
introCtx.font = '82px "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif';
introCtx.fillText('A Viacom Presentation', 800, 132);
const introTexture = new THREE.CanvasTexture(introCanvas);
introTexture.colorSpace = THREE.SRGBColorSpace;
const introMaterial = new THREE.MeshBasicMaterial({ map: introTexture, transparent: true, depthWrite: false, side: THREE.DoubleSide });
const introCard = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 1.02), introMaterial);
introCard.position.set(0, 0, 0.55);
introCard.visible = false;
scene.add(introCard);

const lineGroup = new THREE.Group();
scene.add(lineGroup);
const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 13.8, 16), new THREE.MeshBasicMaterial({ color: 0x111110 }));
bar.rotation.z = Math.PI / 2;
lineGroup.add(bar);
for (const x of [-6.9, 6.9]) {
  const end = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), new THREE.MeshBasicMaterial({ color: 0x111110 }));
  end.position.x = x;
  lineGroup.add(end);
}
lineGroup.position.set(-12, -0.62, 0);

const ballMaterial = new THREE.MeshStandardMaterial({ color: 0x85878a, roughness: 0.37, metalness: 0.2 });
const ball = new THREE.Mesh(new THREE.SphereGeometry(0.245, 48, 32), ballMaterial);
ball.position.set(-20, -0.3, 0.32);
scene.add(ball);
const ballShadow = new THREE.Mesh(new THREE.CircleGeometry(0.28, 40), new THREE.MeshBasicMaterial({ color: 0x393936, transparent: true, opacity: 0.12, depthWrite: false }));
ballShadow.scale.set(1.6, 0.22, 1);
ballShadow.position.set(-20, -0.68, 0.12);
scene.add(ballShadow);

const burstAt = 3.55 + Math.random() * 0.42;
const particleBalls = Array.from({ length: 18 }, () => {
  const mesh = new THREE.Mesh(ball.geometry, ballMaterial);
  const radius = 0.12 + Math.random() * 0.12;
  mesh.scale.setScalar(radius / 0.245);
  mesh.visible = false;
  scene.add(mesh);
  return { mesh, radius, delay: Math.random() * 0.2, vx: (Math.random() - 0.5) * 8.0, vy: 2.7 + Math.random() * 4.2, spin: (Math.random() - 0.5) * 14 };
});

// The macro ball keeps the same geometry so the cut feels continuous.
const rings = [];
for (let i = 0; i < 2; i++) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.027, 10, 128), new THREE.MeshBasicMaterial({ color: 0x080808 }));
  ring.position.set(0, 0, 4.1 + i * 0.01);
  ring.scale.setScalar(0.001);
  ring.visible = false;
  scene.add(ring);
  rings.push(ring);
}
const iris = new THREE.Mesh(new THREE.CircleGeometry(1, 96), new THREE.MeshBasicMaterial({ color: 0x030303 }));
iris.position.set(0, 0, 4.25);
iris.scale.setScalar(0.001);
iris.visible = false;
scene.add(iris);

// The oversized navy V and the final red S are all 3D scene geometry.
const vGroup = new THREE.Group();
vGroup.visible = false;
const vShape = new THREE.Shape();
vShape.moveTo(-1.38, 1.18);
vShape.lineTo(-0.78, 1.18);
vShape.lineTo(0, -0.20);
vShape.lineTo(0.78, 1.18);
vShape.lineTo(1.38, 1.18);
vShape.lineTo(0.24, -1.18);
vShape.quadraticCurveTo(0, -1.31, -0.24, -1.18);
vShape.closePath();
const vMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(vShape, { depth: 0.28, bevelEnabled: true, bevelSegments: 5, bevelSize: 0.055, bevelThickness: 0.06, curveSegments: 18 }), new THREE.MeshStandardMaterial({ color: 0x102f63, roughness: 0.28, metalness: 0.42 }));
vMesh.castShadow = true;
vGroup.add(vMesh);
const vCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.34, 0.13, 0.49), new THREE.Vector3(-0.15, -0.04, 0.51), new THREE.Vector3(0.03, -0.10, 0.52), new THREE.Vector3(0.24, 0.10, 0.50)]);
const vAccent = new THREE.Mesh(new THREE.TubeGeometry(vCurve, 40, 0.035, 10, false), new THREE.MeshStandardMaterial({ color: 0x3e6593, roughness: 0.25, metalness: 0.36 }));
vGroup.add(vAccent);
vGroup.position.set(0, 0.05, 0.2);
scene.add(vGroup);

function parallelogram() {
  const s = new THREE.Shape();
  s.moveTo(-1.75, -0.13); s.lineTo(1.42, -0.13); s.lineTo(1.75, 0.13); s.lineTo(-1.42, 0.13); s.closePath();
  return new THREE.ExtrudeGeometry(s, { depth: 0.09, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.025, bevelThickness: 0.025 });
}
const redBarMatA = new THREE.MeshStandardMaterial({ color: 0xd92227, roughness: 0.3, metalness: 0.18, transparent: true, opacity: 0, depthWrite: false });
const redBarMatB = redBarMatA.clone();
const topBar = new THREE.Mesh(parallelogram(), redBarMatA);
const bottomBar = new THREE.Mesh(parallelogram(), redBarMatB);
topBar.visible = bottomBar.visible = false;
scene.add(topBar, bottomBar);
const redDot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 32, 24), new THREE.MeshBasicMaterial({ color: 0xf02a2e, transparent: true, opacity: 0 }));
redDot.position.set(0, 0, 1.35);
redDot.visible = false;
scene.add(redDot);
const sCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-1.16, 0.94, 0.85), new THREE.Vector3(-0.66, 1.16, 0.85), new THREE.Vector3(0.52, 0.88, 0.85),
  new THREE.Vector3(0.95, 0.48, 0.85), new THREE.Vector3(0.52, 0.16, 0.85), new THREE.Vector3(-0.52, -0.11, 0.85),
  new THREE.Vector3(-0.93, -0.46, 0.85), new THREE.Vector3(-0.62, -0.87, 0.85), new THREE.Vector3(0.38, -1.02, 0.85), new THREE.Vector3(1.12, -0.76, 0.85)
]);
const sMaterial = new THREE.MeshBasicMaterial({ color: 0xe8242a, transparent: true, opacity: 0 });
const sMesh = new THREE.Mesh(new THREE.TubeGeometry(sCurve, 110, 0.095, 14, false), sMaterial);
sMesh.visible = false;
scene.add(sMesh);

// The show only starts once every texture has loaded (or after a short timeout), so nothing pops in late.
let assetsReady = false;
const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => { assetsReady = true; };
setTimeout(() => { assetsReady = true; }, 3500);
const assetLoader = new THREE.TextureLoader(loadingManager);
function asset(path) {
  const texture = assetLoader.load(path);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}
function sprite(path, width, height, z, parent = scene) {
  const material = new THREE.MeshBasicMaterial({ map: asset(path), transparent: true, opacity: 0, depthWrite: false, alphaTest: 0.015, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  mesh.position.z = z;
  mesh.visible = false;
  parent.add(mesh);
  return { mesh, material };
}
const blueSplash = sprite('img/blue-splash.png', 7, 7, 1.2);
const inkStain = sprite('img/black-ink.png', 7, 7, 1.6);
const stainSatellites = Array.from({ length: 4 }, (_, i) => {
  const stain = sprite('img/black-ink.png', 4.2, 4.2, 1.55 + i * 0.005);
  stain.mesh.position.set((i % 2 ? 1 : -1) * (2.8 + Math.random()), (i < 2 ? 1 : -1) * (1.8 + Math.random()), stain.mesh.position.z);
  stain.mesh.rotation.z = (Math.random() - 0.5) * 1.2;
  return stain;
});
const handSprite = sprite('img/hand.png', 5.5, 3.65, 4.4);
const faceCollage = new THREE.Group();
faceCollage.visible = false;
scene.add(faceCollage);
const eyesSprite = sprite('img/eyes-cutout.png', 3.25, 2.17, 3.25, faceCollage);
eyesSprite.mesh.position.set(0, 0.55, 3.25);
const mouthSprite = sprite('img/mouth-cutout.png', 2.85, 1.9, 3.3, faceCollage);
mouthSprite.mesh.position.set(0, -1.08, 3.3);

const speechCanvas = document.createElement('canvas');
speechCanvas.width = 900; speechCanvas.height = 260;
const speechCtx = speechCanvas.getContext('2d');
speechCtx.clearRect(0, 0, 900, 260);
speechCtx.font = '900 190px Georgia, "Times New Roman", serif';
speechCtx.textAlign = 'center'; speechCtx.textBaseline = 'middle';
speechCtx.fillStyle = '#fffef4'; speechCtx.shadowColor = '#172242'; speechCtx.shadowBlur = 12;
speechCtx.fillText('ВИD', 450, 132);
const speechTexture = new THREE.CanvasTexture(speechCanvas);
speechTexture.colorSpace = THREE.SRGBColorSpace;
const speechMaterial = new THREE.MeshBasicMaterial({ map: speechTexture, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
const spokenName = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 0.61), speechMaterial);
spokenName.position.set(0, -1.1, 4.1);
faceCollage.add(spokenName);
const whiteBlockMaterial = new THREE.MeshBasicMaterial({ color: 0xfffdf1, transparent: true, opacity: 0, depthWrite: false });
const speechBlocks = Array.from({ length: 30 }, () => {
  const mat = whiteBlockMaterial.clone();
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.08 + Math.random() * 0.17, 0.06 + Math.random() * 0.13, 0.06 + Math.random() * 0.12), mat);
  mesh.visible = false; scene.add(mesh);
  return { mesh, mat, vx: (Math.random() - .5) * 7, vy: 1.4 + Math.random() * 4.5, vz: (Math.random() - .5) * 4, spin: (Math.random() - .5) * 16, delay: Math.random() * .35, ox: (Math.random() - .5) * 0.16, oy: (Math.random() - .5) * 0.14, oz: (Math.random() - .5) * 0.18 };
});

const hammer = new THREE.Group();
const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.12, 2.25, 16), new THREE.MeshStandardMaterial({ color: 0x654024, roughness: 0.6 }));
const hammerHead = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.44, 0.62), new THREE.MeshStandardMaterial({ color: 0x544b45, roughness: 0.34, metalness: 0.58 }));
handle.position.y = -0.25; hammerHead.position.y = 0.98;
hammer.add(handle, hammerHead); hammer.position.set(5, 5, 5); hammer.visible = false;
scene.add(hammer);

const sculpture = new THREE.Group();
sculpture.visible = false;
scene.add(sculpture);
const bustShape = new THREE.Shape();
bustShape.moveTo(-0.74, -2.37);
bustShape.bezierCurveTo(-1.0, -1.8, -1.55, -1.63, -1.53, -1.08);
bustShape.bezierCurveTo(-1.5, -0.58, -1.18, -0.35, -1.12, 0.15);
bustShape.bezierCurveTo(-1.3, 1.42, -0.72, 2.35, 0, 2.42);
bustShape.bezierCurveTo(0.78, 2.37, 1.27, 1.4, 1.12, 0.12);
bustShape.bezierCurveTo(1.18, -0.48, 1.5, -0.75, 1.56, -1.24);
bustShape.bezierCurveTo(1.58, -1.8, 1.04, -1.95, 0.75, -2.37);
bustShape.closePath();
const stoneMat = new THREE.MeshStandardMaterial({ color: 0x805631, roughness: 0.62, metalness: 0.08 });
const bust = new THREE.Mesh(new THREE.ExtrudeGeometry(bustShape, { depth: 0.52, bevelEnabled: true, bevelSegments: 8, bevelSize: 0.1, bevelThickness: 0.12, curveSegments: 24 }), stoneMat);
bust.position.z = 0.02; bust.castShadow = true; sculpture.add(bust);
const sculptureFace = sprite('img/guo-sculpture.png', 3.35, 4.9, 0.68, sculpture);
sculptureFace.mesh.position.set(0, 0.02, 0.68);
const toadSprite = sprite('img/toad.png', 1.04, 1.04, 1.06, sculpture);
toadSprite.mesh.position.set(-0.84, 2.28, 1.06);
const scream = new THREE.Mesh(new THREE.CircleGeometry(1, 32), new THREE.MeshBasicMaterial({ color: 0x2b1914, transparent: true, opacity: 0.8, depthWrite: false }));
scream.position.set(0, -0.62, 0.74); scream.scale.set(0.12, 0.035, 1); sculpture.add(scream);
const screamLip = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.022, 8, 32), new THREE.MeshStandardMaterial({ color: 0xb08252, roughness: 0.4 }));
screamLip.position.set(0, -0.62, 0.76); screamLip.scale.set(1, 0.44, 1); sculpture.add(screamLip);
const dust = Array.from({ length: 56 }, (_, i) => {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.018 + Math.random() * 0.025, 8, 6), new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0xffd28a : 0xc68b54, transparent: true, opacity: 0.75 }));
  mesh.visible = false; scene.add(mesh);
  return { mesh, phase: Math.random() * Math.PI * 2, radius: 1.5 + Math.random() * 1.1, height: -1.5 + Math.random() * 4.0, speed: 0.55 + Math.random() * 1.2 };
});

const fightLabels = [];
function makeFightLabel(label, color, width) {
  const c = document.createElement('canvas'); c.width = 1200; c.height = 300;
  const g = c.getContext('2d');
  g.clearRect(0, 0, c.width, c.height); g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '900 220px Georgia, "Times New Roman", serif';
  g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 22; g.shadowOffsetY = 10;
  g.strokeStyle = 'rgba(0,0,0,.75)'; g.lineWidth = 17; g.strokeText(label, 600, 150);
  g.shadowBlur = 0; g.shadowOffsetY = 0; g.fillStyle = color; g.fillText(label, 600, 150);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, width * 0.25), mat); mesh.visible = false; scene.add(mesh);
  return { mesh, mat };
}
fightLabels.push(makeFightLabel('BИD', '#ddb568', 3.0));
fightLabels.push(makeFightLabel('PBS', '#80c9f1', 2.6));
fightLabels.push(makeFightLabel('VIACOM', '#f0eee7', 4.1));
fightLabels.push(makeFightLabel('SCREEN GEMS', '#e63130', 1.65));
const fightStarts = [[-5.2, 2.4], [5.2, 2.1], [-5.0, -2.1], [5.0, -2.3]];
const fightToss = fightLabels.map(() => ({ vx: (Math.random() - .5) * 11, vy: (Math.random() - .5) * 9, vz: (Math.random() - .5) * 3, spin: (Math.random() - .5) * 14 }));
const debris = Array.from({ length: 48 }, (_, i) => {
  const colors = [0xf0eee5, 0x418bd2, 0xd93534, 0xc89955];
  const mat = new THREE.MeshBasicMaterial({ color: colors[i % colors.length], transparent: true, opacity: 0, depthWrite: false });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(.08 + Math.random() * .2, .07 + Math.random() * .18, .07 + Math.random() * .16), mat);
  mesh.visible = false; scene.add(mesh);
  return { mesh, mat, vx: (Math.random() - .5) * 10, vy: (Math.random() - .5) * 9, vz: (Math.random() - .5) * 5, spin: (Math.random() - .5) * 18 };
});
const fightFlashMat = new THREE.MeshBasicMaterial({ color: 0xfff8e9, transparent: true, opacity: 0, depthWrite: false });
const fightFlash = new THREE.Mesh(new THREE.CircleGeometry(1, 96), fightFlashMat);
fightFlash.position.set(0, 0, 4.6); fightFlash.visible = false; scene.add(fightFlash);
const encoreBurstAt = 3.58 + Math.random() * 0.42;

const logo = new THREE.Group();
logo.visible = false;
scene.add(logo);
const headMaterials = [];

// A streamlined, right-facing P-shaped profile, built as a small blue stone relief.
const profile = new THREE.Shape();
profile.moveTo(-0.58, -1.22);
profile.bezierCurveTo(-0.83, -0.88, -0.93, -0.38, -0.91, 0.24);
profile.bezierCurveTo(-0.94, 0.91, -0.66, 1.35, -0.13, 1.41);
profile.bezierCurveTo(0.34, 1.46, 0.64, 1.18, 0.59, 0.97);
profile.bezierCurveTo(0.56, 0.88, 0.72, 0.84, 0.86, 0.73);
profile.lineTo(0.62, 0.61);
profile.bezierCurveTo(0.76, 0.54, 0.79, 0.47, 0.60, 0.40);
profile.bezierCurveTo(0.62, 0.11, 0.46, -0.12, 0.23, -0.28);
profile.lineTo(0.25, -0.73);
profile.bezierCurveTo(0.52, -0.91, 0.59, -1.08, 0.62, -1.22);
profile.closePath();
const profileGeometry = new THREE.ExtrudeGeometry(profile, { depth: 0.34, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: 0.065, bevelThickness: 0.075, curveSegments: 24 });
profileGeometry.computeVertexNormals();

function headTube(group, pts, radius, color) {
  const curve = new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.44, transparent: true, opacity: 0, depthWrite: false });
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, radius, 8, false), material);
  group.add(mesh);
  headMaterials.push(material);
}
function makeHead(baseColor, highlightColor, eyeColor) {
  const group = new THREE.Group();
  const baseMat = new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.35, metalness: 0.56, transparent: true, opacity: 0, depthWrite: false });
  const reliefMat = new THREE.MeshStandardMaterial({ color: highlightColor, roughness: 0.3, metalness: 0.52, transparent: true, opacity: 0, depthWrite: false });
  headMaterials.push(baseMat, reliefMat);
  const shell = new THREE.Mesh(profileGeometry, baseMat);
  shell.castShadow = true;
  group.add(shell);
  // A sculpted brow, inset eye, cheek fold, nose ridge and lips give the profile a face.
  headTube(group, [[0.00, 0.86, 0.425], [0.20, 0.91, 0.455], [0.42, 0.85, 0.455]], 0.033, highlightColor);
  const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor, roughness: 0.26, metalness: 0.26, transparent: true, opacity: 0, depthWrite: false });
  headMaterials.push(eyeMat);
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.072, 24, 18), eyeMat);
  eye.scale.set(1.15, 0.62, 0.55);
  eye.position.set(0.27, 0.76, 0.46);
  group.add(eye);
  headTube(group, [[0.43, 0.82, 0.44], [0.49, 0.67, 0.46], [0.66, 0.60, 0.43]], 0.025, highlightColor);
  headTube(group, [[0.56, 0.36, 0.45], [0.39, 0.25, 0.46], [0.29, 0.03, 0.43], [0.39, -0.16, 0.40]], 0.028, highlightColor);
  headTube(group, [[0.47, 0.31, 0.44], [0.62, 0.28, 0.44], [0.72, 0.33, 0.42]], 0.023, highlightColor);
  return group;
}
const headMain = makeHead(0x142d4a, 0x315576, 0x86a5bd);
const headEcho = makeHead(0x0d2037, 0x284767, 0x6688a3);
headMain.position.set(-0.72, 0.7, 0.08);
headEcho.position.set(-0.72, 0.7, 0.02);
const tosses = [0, 1].map(() => ({
  vx: (Math.random() - 0.5) * 8.2,
  vy: 2.8 + Math.random() * 4.1,
  vz: (Math.random() - 0.5) * 1.5,
  rx: (Math.random() - 0.5) * 7,
  ry: (Math.random() - 0.5) * 8,
  rz: (Math.random() - 0.5) * 12
}));
logo.add(headMain, headEcho);

const typeCanvas = document.createElement('canvas');
typeCanvas.width = 1200;
typeCanvas.height = 320;
const typeCtx = typeCanvas.getContext('2d');
function drawWordmark() {
  typeCtx.clearRect(0, 0, 1200, 320);
  typeCtx.textAlign = 'center';
  typeCtx.textBaseline = 'middle';
  typeCtx.font = '900 246px Georgia, "Times New Roman", serif';
  typeCtx.lineJoin = 'round';
  typeCtx.shadowColor = 'rgba(0,0,0,.42)';
  typeCtx.shadowBlur = 18;
  typeCtx.shadowOffsetY = 9;
  typeCtx.strokeStyle = '#28180d';
  typeCtx.lineWidth = 18;
  typeCtx.strokeText('ВИD', 600, 156);
  typeCtx.shadowColor = 'transparent';
  typeCtx.shadowBlur = 0;
  typeCtx.shadowOffsetY = 0;
  const metal = typeCtx.createLinearGradient(0, 42, 0, 270);
  metal.addColorStop(0, '#f0cb82');
  metal.addColorStop(0.18, '#98652f');
  metal.addColorStop(0.44, '#e4b45c');
  metal.addColorStop(0.68, '#805022');
  metal.addColorStop(1, '#d4a24e');
  typeCtx.fillStyle = metal;
  typeCtx.fillText('ВИD', 600, 156);
  typeCtx.strokeStyle = 'rgba(255,232,177,.62)';
  typeCtx.lineWidth = 3;
  typeCtx.strokeText('ВИD', 600, 153);
}
drawWordmark();
const typeTexture = new THREE.CanvasTexture(typeCanvas);
typeTexture.colorSpace = THREE.SRGBColorSpace;
const titleMaterial = new THREE.MeshBasicMaterial({ map: typeTexture, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
const title = new THREE.Mesh(new THREE.PlaneGeometry(4.15, 1.12), titleMaterial);
title.position.set(0, -2.25, 0.22);
logo.add(title);

// An alpha-masked glint sweeps over the bronze lettering.
const shineCanvas = document.createElement('canvas');
shineCanvas.width = 1200;
shineCanvas.height = 320;
const shineCtx = shineCanvas.getContext('2d');
const shineTexture = new THREE.CanvasTexture(shineCanvas);
shineTexture.colorSpace = THREE.SRGBColorSpace;
shineTexture.generateMipmaps = false;
shineTexture.minFilter = THREE.LinearFilter;
const shineMaterial = new THREE.MeshBasicMaterial({ map: shineTexture, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
const shine = new THREE.Mesh(new THREE.PlaneGeometry(4.15, 1.12), shineMaterial);
shine.position.set(0, -2.25, 0.24);
logo.add(shine);
function drawShine(progress) {
  shineCtx.clearRect(0, 0, 1200, 320);
  const x = -180 + progress * 1560;
  const grad = shineCtx.createLinearGradient(x - 150, 0, x + 150, 0);
  grad.addColorStop(0, 'rgba(255,240,194,0)');
  grad.addColorStop(0.42, 'rgba(255,231,165,0.12)');
  grad.addColorStop(0.5, 'rgba(255,255,237,0.98)');
  grad.addColorStop(0.58, 'rgba(255,218,133,0.18)');
  grad.addColorStop(1, 'rgba(255,240,194,0)');
  shineCtx.fillStyle = grad;
  shineCtx.fillRect(0, 0, 1200, 320);
  shineCtx.globalCompositeOperation = 'destination-in';
  shineCtx.font = '900 246px Georgia, "Times New Roman", serif';
  shineCtx.textAlign = 'center';
  shineCtx.textBaseline = 'middle';
  shineCtx.fillStyle = '#fff';
  shineCtx.fillText('ВИD', 600, 156);
  shineCtx.globalCompositeOperation = 'source-over';
  shineTexture.needsUpdate = true;
}

const ease = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const easeOutCubic = x => 1 - Math.pow(1 - clamp(x, 0, 1), 3);
const easeInCubic = x => Math.pow(clamp(x, 0, 1), 3);
// Overshoots slightly past 1 and settles, which gives pop-ins a springy feel.
const easeOutBack = (x, s = 1.70158) => { x = clamp(x, 0, 1) - 1; return 1 + (s + 1) * x * x * x + s * x * x; };

// Parabolic hops: sharp ground contact and a real arc, same height and rhythm as before.
const hop = run => { const f = (run * 11.4 / Math.PI) % 1; return 0.47 * 4 * f * (1 - f); };

// Shared by the opening and the encore so both scatter and bounce identically.
function updateParticleBalls(time, burstTime) {
  const x0 = -5.9 + (burstTime - 1.78) * 3.65;
  for (const p of particleBalls) {
    const elapsed = time - burstTime - p.delay;
    p.mesh.visible = elapsed >= 0;
    if (elapsed < 0) continue;
    const gravity = 5.7, floor = -0.62 + p.radius;
    let y = -0.18, vy = p.vy, remaining = elapsed;
    for (let bounceIndex = 0; bounceIndex < 5 && remaining > 0; bounceIndex++) {
      const impact = (vy + Math.sqrt(vy * vy + 2 * gravity * Math.max(0, y - floor))) / gravity;
      if (remaining < impact) {
        y += vy * remaining - 0.5 * gravity * remaining * remaining;
        vy -= gravity * remaining;
        remaining = 0;
      } else {
        const impactSpeed = Math.sqrt(vy * vy + 2 * gravity * Math.max(0, y - floor));
        y = floor;
        remaining -= impact;
        vy = impactSpeed * 0.58;
      }
    }
    p.mesh.position.set(x0 + p.vx * elapsed, y, 0.44 + p.radius * 0.2);
    p.mesh.rotation.set(elapsed * p.spin, elapsed * p.spin * 0.65, elapsed * p.spin * 0.8);
  }
}

// Camera punches: [time, amplitude, duration]. They decay quickly and are layered on top of the camera moves.
const impacts = [
  [burstAt, 0.16, 0.55],
  [6.69, 0.14, 0.5],
  [7.27, 0.10, 0.45],
  [15.05, 0.22, 0.6],
  [16.75, 0.10, 0.4],
  [23.26, 0.32, 0.7],
  [24.1, 0.08, 0.5],
  [28.22, 0.40, 0.8],
  [29.7 + encoreBurstAt, 0.16, 0.55],
  [29.7 + 6.69, 0.14, 0.5],
  [29.7 + 7.27, 0.10, 0.45]
];
const camSavePos = new THREE.Vector3();
const camSaveQuat = new THREE.Quaternion();
function cameraShake(time) {
  let x = 0, y = 0, roll = 0;
  for (const [at, amp, dur] of impacts) {
    const dt = time - at;
    if (dt < 0 || dt > dur) continue;
    const decay = Math.pow(1 - dt / dur, 2);
    x += Math.sin(dt * 71 + at) * amp * decay;
    y += Math.sin(dt * 59 + at * 2.3 + 1.7) * amp * 0.8 * decay;
    roll += Math.sin(dt * 47 + at * 1.3) * amp * 0.012 * decay;
  }
  return [x, y, roll];
}
let blackBackdrop = false;
let lastShineProgress = -1;
let lastNow = null;
let clock = 0;
function frame(now) {
  requestAnimationFrame(frame);
  if (!assetsReady) {
    replayButton.hidden = true;
    renderer.render(scene, camera);
    return;
  }
  // Clamping the step pauses the show while the tab is hidden instead of skipping ahead.
  clock += lastNow === null ? 0 : Math.min((now - lastNow) * 0.001, 0.1);
  lastNow = now;
  const raw = clock;
  const t = Math.min(animationEnd, Math.max(0, raw - 1.72));
  replayButton.hidden = t < animationEnd;
  if (raw < 1.72) {
    introCard.visible = true;
    const zoom = Math.min(2.05, 0.035 + 2.015 * Math.pow(clamp(raw / 0.5, 0, 1), 0.46));
    introCard.scale.setScalar(zoom);
    introMaterial.opacity = raw < 1.34 ? 1 : 1 - ease((raw - 1.34) / 0.26);
  } else introCard.visible = false;

  // The stroke sweeps in, then shakes violently at a randomly timed impact.
  const lineTravel = ease(t / 3.8);
  const burstShake = ease((t - burstAt) / 0.08) * (1 - ease((t - 5.35) / 0.24));
  const earlyVibration = t > 1.05 && t < burstAt ? 1 : 0;
  lineGroup.position.x = -12 + 12 * lineTravel + earlyVibration * Math.sin(t * 46) * 0.042 + burstShake * (Math.sin(t * 93) * 0.17 + Math.sin(t * 57) * 0.08);
  lineGroup.position.y = -0.62 + earlyVibration * Math.sin(t * 38) * 0.026 + burstShake * Math.sin(t * 107) * 0.15;
  lineGroup.rotation.z = earlyVibration * Math.sin(t * 43) * 0.003 + burstShake * Math.sin(t * 79) * 0.055;
  lineGroup.visible = t < 5.55;

  if (t >= 1.78 && t < 5.55) {
    const run = t - 1.78;
    ball.visible = true;
    let x;
    if (t < 4.65) x = -5.9 + run * 3.65;
    else x = 4.585 + (t - 4.65) * 4.9;
    const bounce = hop(run);
    ball.position.set(x, -0.62 + 0.245 + bounce, 0.34);
    ball.rotation.z = -run * 5.5;
    ball.rotation.x = run * 3.2;
    if (t > 4.92) {
      const fall = (t - 4.92) * (t - 4.92) * 5.8;
      ball.position.y -= fall;
      ball.rotation.z -= fall * 1.8;
    }
    ballShadow.visible = true;
    ballShadow.position.x = x;
    ballShadow.material.opacity = clamp(0.16 - bounce * 0.15, 0.045, 0.16);
    // A random burst scatters extra metal balls from the collision point.
    updateParticleBalls(t, burstAt);
  } else if (t >= 5.55 && t < 7.28) {
    particleBalls.forEach(p => p.mesh.visible = false);
    // Hard cut to a large, falling ball, viewed from a steep overhead angle.
    const drop = ease((t - 5.55) / 1.14);
    camera.position.set(0, 8.0 * ease((t - 5.55) / 0.65), 12 - 6.6 * ease((t - 5.55) / 0.65));
    camera.lookAt(0, 0, 0);
    const fallY = 4.9 * (1 - drop) + 0.12;
    const shrink = t < 6.85 ? 9.4 + 1.5 * drop : 10.9 * (1 - ease((t - 6.85) / 0.43));
    ball.visible = t < 7.28;
    ball.position.set(0, fallY, 0.6);
    ball.scale.setScalar(Math.max(0.001, shrink));
    ball.rotation.set(t * 0.58, t * 0.71, t * 0.32);
    ballShadow.visible = false;
  } else {
    ball.visible = false;
    ballShadow.visible = false;
    particleBalls.forEach(p => p.mesh.visible = false);
  }

  if (t >= 7.26 && t < 8.8) {
    // Camera returns to the frontal ident view beneath the fast expanding rings.
    const restore = ease((t - 7.26) / 0.63);
    camera.position.set(0, 8.0 * (1 - restore), 5.4 + 6.6 * restore);
    camera.lookAt(0, 0, 0);
    for (let i = 0; i < rings.length; i++) {
      const start = 7.27 + i * 0.09;
      const p = ease((t - start) / 1.12);
      rings[i].visible = t >= start && t < 8.65;
      rings[i].scale.setScalar(Math.max(0.001, p * 13));
    }
    const irisP = ease((t - 7.62) / 0.9);
    iris.visible = t >= 7.62 && t < 8.56;
    iris.scale.setScalar(Math.max(0.001, irisP * 18));
    if (t >= 8.54 && !blackBackdrop) {
      blackBackdrop = true;
      scene.background = new THREE.Color(0x030303);
      iris.visible = false;
      rings.forEach(r => r.visible = false);
      camera.position.set(0, 0, 12);
      camera.lookAt(0, 0, 0);
    }
  } else if (t >= 8.8) {
    iris.visible = false;
    rings.forEach(r => r.visible = false);
    camera.position.set(0, 0, 12);
    camera.lookAt(0, 0, 0);
  }

  if (t >= 8.55) {
    logo.visible = true;
    const mainFade = ease((t - 8.55) / 0.92);
    const echoFade = ease((t - 9.05) / 0.72);
    headMaterials.forEach((material, index) => {
      const echoMaterial = index >= headMaterials.length / 2;
      material.opacity = echoMaterial ? echoFade : mainFade;
    });
    const slide = ease((t - 9.2) / 0.95);
    headEcho.position.x = -0.72 + 1.95 * slide;
    headEcho.position.y = 0.7 + Math.sin(slide * Math.PI) * 0.035;
    headMain.scale.setScalar(0.92 + 0.08 * easeOutCubic((t - 8.55) / 1.3));
    headEcho.scale.setScalar(0.92 + 0.08 * easeOutCubic((t - 9.05) / 1.1));
    titleMaterial.opacity = ease((t - 10.05) / 1.0);
    const titleIn = easeOutCubic((t - 10.05) / 1.0);
    title.position.set(0, -2.25 - 0.2 * (1 - titleIn), 0.22);
    title.scale.setScalar(0.9 + 0.1 * titleIn);
    const shineProgress = clamp((t - 11.0) / 1.28, 0, 1);
    shineMaterial.opacity = t >= 11.0 && t < 12.32 ? Math.sin(Math.PI * shineProgress) * 0.9 : 0;
    if (t >= 11.0 && t < 12.28) {
      if (Math.abs(shineProgress - lastShineProgress) > 0.008) {
        drawShine(shineProgress);
        lastShineProgress = shineProgress;
      }
    }
  }

  // Final Viacom-style V zoom, physical logo toss, and red S reveal.
  const vStart = 12.65;
  const launchAt = 15.05;
  const barsAt = 15.55;
  if (t >= vStart) {
    introCard.visible = false;
    if (t < launchAt) {
      logo.visible = false;
      vGroup.visible = true;
      const grow = ease((t - vStart) / (launchAt - vStart));
      vGroup.scale.setScalar(0.045 * Math.pow(3.095 / 0.045, grow));
      vGroup.position.set(0, 0.05, 0.2);
      camera.position.set(0, 0, 12 - grow * 1.25);
      camera.lookAt(0, 0, 0);
    } else {
      vGroup.visible = false;
      camera.position.set(0, 0, 12);
      camera.lookAt(0, 0, 0);
      logo.visible = true;
      const flight = t - launchAt;
      const gravity = 5.4;
      headMain.position.set(-0.72 + tosses[0].vx * flight, 0.7 + tosses[0].vy * flight - 0.5 * gravity * flight * flight, 0.08 + tosses[0].vz * flight);
      headEcho.position.set(1.23 + tosses[1].vx * flight, 0.7 + tosses[1].vy * flight - 0.5 * gravity * flight * flight, 0.02 + tosses[1].vz * flight);
      headMain.rotation.set(tosses[0].rx * flight, tosses[0].ry * flight, tosses[0].rz * flight);
      headEcho.rotation.set(tosses[1].rx * flight, tosses[1].ry * flight, tosses[1].rz * flight);
      const fadeFlight = clamp(1 - flight / 2.8, 0, 1);
      headMaterials.forEach(material => material.opacity = fadeFlight);
      const shake = 0.045 + Math.exp(-flight * 0.42) * 0.13;
      title.position.set(Math.sin(t * 73) * shake, -2.25 + Math.sin(t * 91) * shake * 0.42, 0.22);
      title.rotation.z = Math.sin(t * 67) * 0.025;
      titleMaterial.opacity = 1;
      shineMaterial.opacity = 0;
    }

    const barProgress = ease((t - barsAt) / 1.2);
    const barsVisible = t >= barsAt && t < 18.0;
    topBar.visible = bottomBar.visible = barsVisible;
    if (barsVisible) {
      topBar.position.set(-0.55 - 0.18 * barProgress, 5.4 * (1 - barProgress) + 0.83 * barProgress, -0.65 + 1.05 * barProgress);
      bottomBar.position.set(0.55 + 0.18 * barProgress, -5.4 * (1 - barProgress) - 0.83 * barProgress, 1.25 - 0.85 * barProgress);
      topBar.rotation.z = -0.28;
      bottomBar.rotation.z = 0.28;
      topBar.scale.set(0.12 + 0.88 * barProgress, 1, 1);
      bottomBar.scale.set(0.12 + 0.88 * barProgress, 1, 1);
      const dissolve = 1 - ease((t - 16.65) / 0.55);
      redBarMatA.opacity = redBarMatB.opacity = dissolve;
    }
    const dotProgress = ease((t - 16.45) / 0.42);
    redDot.visible = t >= 16.45;
    redDot.scale.setScalar(Math.max(0.001, easeOutBack((t - 16.45) / 0.42)));
    redDot.material.opacity = dotProgress;
    const sProgress = ease((t - 16.82) / 0.8);
    sMesh.visible = t >= 16.82;
    // Draw the S along its path instead of simply fading it in (110 segments x 14 sides x 6 indices).
    sMesh.geometry.setDrawRange(0, Math.max(1, Math.ceil(sProgress * 110)) * 14 * 6);
    sMaterial.opacity = clamp(sProgress * 4, 0, 1);
  } else {
    vGroup.visible = false;
    topBar.visible = bottomBar.visible = redDot.visible = sMesh.visible = false;
  }

  // Cut-paper ink-face interlude, hammer hit, then the new Guo Xiang sculpture mark.
  const collageStart = 18.55;
  if (t >= collageStart) {
    logo.visible = false;
    vGroup.visible = false;
    sMesh.visible = false;
    redDot.visible = false;
    topBar.visible = bottomBar.visible = false;

    const blueP = ease((t - 18.72) / 1.05);
    if (t < 19.78) scene.background.set(0x593274);
    else scene.background.set(0x145ecb);
    blueSplash.mesh.visible = t >= 18.72 && t < 24.25;
    blueSplash.mesh.scale.setScalar(Math.max(0.001, blueP * 2.35));
    blueSplash.material.opacity = blueP;
    const inkP = ease((t - 19.0) / 0.8);
    inkStain.mesh.visible = t >= 19.0 && t < 24.25;
    inkStain.mesh.scale.setScalar(Math.max(0.001, inkP * 2.15));
    inkStain.mesh.rotation.z = Math.sin(t * 1.6) * 0.035;
    inkStain.material.opacity = inkP;
    stainSatellites.forEach((stain, i) => {
      stain.mesh.visible = t >= 19.2 && t < 24.25;
      const p = ease((t - 19.2 - i * 0.08) / 0.55);
      stain.mesh.scale.setScalar(Math.max(0.001, p * 0.72));
      stain.material.opacity = p * 0.95;
    });

    const handP = ease((t - 20.05) / 1.15);
    handSprite.mesh.visible = t >= 20.05 && t < 21.55;
    handSprite.mesh.position.set(-8.5 + handP * 17, 1.5 + Math.sin(t * 5) * 0.12, 4.4);
    handSprite.mesh.rotation.z = Math.sin(t * 4) * 0.035;
    handSprite.material.opacity = t < 21.25 ? 1 : 1 - ease((t - 21.25) / 0.3);

    faceCollage.visible = t >= 20.45 && t < 24.45;
    const eyeP = ease((t - 20.5) / 0.48);
    const mouthP = ease((t - 21.08) / 0.42);
    eyesSprite.mesh.visible = t >= 20.45;
    mouthSprite.mesh.visible = t >= 21.08;
    eyesSprite.material.opacity = eyeP;
    eyesSprite.mesh.position.y = lerp(3.15, 0.55, easeOutBack((t - 20.5) / 0.48));
    eyesSprite.mesh.rotation.z = t > 21 ? Math.sin(t * 14) * 0.035 : 0;
    const jelly = t > 21 ? 1 + Math.sin(t * 15) * 0.07 : 1;
    eyesSprite.mesh.scale.set(1 + Math.sin(t * 11) * 0.045, jelly, 1);
    mouthSprite.material.opacity = mouthP;
    mouthSprite.mesh.position.y = lerp(1.95, -1.08, easeOutBack((t - 21.08) / 0.42));
    const talk = 1 + Math.abs(Math.sin(t * 18)) * 0.23;
    mouthSprite.mesh.scale.set(1, t > 21.65 && t < 23.0 ? talk : 1, 1);

    const speechOut = ease((t - 22.62) / 0.25);
    const speechP = ease((t - 21.85) / 0.32) * (1 - speechOut);
    spokenName.visible = speechP > 0.01;
    spokenName.scale.setScalar(0.15 + easeOutBack((t - 21.85) / 0.32) * 1.05 * (1 - speechOut * 0.35));
    speechMaterial.opacity = speechP;
    if (t >= 22.08 && t < 24.2) {
      for (const p of speechBlocks) {
        const dt = t - 22.12 - p.delay;
        p.mesh.visible = dt >= 0 && dt < 1.55;
        if (dt < 0) continue;
        p.mesh.position.set(p.ox + p.vx * dt, -1.0 + p.oy + p.vy * dt - 1.9 * dt * dt, 4.05 + p.oz + p.vz * dt);
        p.mesh.rotation.set(dt * p.spin, dt * p.spin * 0.6, dt * p.spin);
        p.mat.opacity = 1 - ease(dt / 1.5);
      }
    } else speechBlocks.forEach(p => p.mesh.visible = false);

    const hitP = easeInCubic((t - 22.68) / 0.58);
    const recoil = easeOutCubic((t - 23.26) / 0.19);
    hammer.visible = t >= 22.68 && t < 23.45;
    hammer.position.set(5.0 * (1 - hitP) + 0.25 * hitP, 4.4 * (1 - hitP) - 0.38 * hitP + recoil * 0.35, 5.1);
    hammer.rotation.z = -0.55 - hitP * 1.05 + recoil * 0.3;
    const throwP = Math.max(0, t - 23.28);
    if (throwP > 0) {
      faceCollage.position.set(-0.25 - 4.2 * throwP, 0.15 + 4.8 * throwP - 3.1 * throwP * throwP, 3.2 + throwP);
      faceCollage.rotation.set(throwP * 1.9, throwP * 2.7, throwP * 4.2);
      const fadeFace = 1 - ease(throwP / 1.05);
      eyesSprite.material.opacity *= fadeFace;
      mouthSprite.material.opacity *= fadeFace;
    }

    if (t >= 24.1) {
      scene.background.set(0x0a080b);
      blueSplash.mesh.visible = inkStain.mesh.visible = false;
      stainSatellites.forEach(s => s.mesh.visible = false);
      handSprite.mesh.visible = false;
      faceCollage.visible = false;
      hammer.visible = false;
      const reveal = ease((t - 24.1) / 0.9);
      sculpture.visible = true;
      sculptureFace.mesh.visible = true;
      sculpture.position.set(0, -0.12, 0);
      sculpture.rotation.set(0.015, 0.09 + Math.sin(t * 0.55) * 0.045, 0);
      sculpture.scale.setScalar(Math.max(0.001, easeOutBack((t - 24.1) / 0.9) * (1 + Math.sin(Math.max(0, t - 25.2) * 7) * 0.012)));
      sculptureFace.material.opacity = reveal;
      toadSprite.material.opacity = ease((t - 24.75) / 0.35);
      toadSprite.mesh.visible = t >= 24.75;
      const walk = ease((t - 24.75) / 1.65);
      toadSprite.mesh.position.set(-0.92 + walk * 1.72, 2.28 + Math.abs(Math.sin(Math.max(0, t - 24.75) * 13)) * 0.075, 1.06);
      toadSprite.mesh.rotation.z = Math.sin(t * 13) * 0.035;
      const screamP = t >= 25.25 ? 1 : 0;
      const mouthOpen = screamP ? 0.04 + Math.abs(Math.sin(t * 7.5)) * 0.22 : 0.035;
      scream.scale.set(0.12, mouthOpen, 1);
      screamLip.scale.set(1, 0.32 + mouthOpen * 1.7, 1);
      dust.forEach((p, i) => {
        p.mesh.visible = t >= 25.15;
        const a = p.phase + t * p.speed;
        p.mesh.position.set(Math.cos(a) * p.radius, -0.12 + p.height + Math.sin(a * 1.7) * 0.18, 1.45 + Math.sin(a) * 0.55);
        p.mesh.material.opacity = t >= 25.15 ? 0.45 + (Math.sin(a * 2) + 1) * 0.25 : 0;
      });
    }
  }

  // A brief collision between the four ident marks, followed by an encore of the classic ball-to-mask reveal.
  if (t >= 27.0 && t < 29.7) {
    scene.background.set(0x07070a);
    sculpture.visible = false; dust.forEach(p => p.mesh.visible = false);
    blueSplash.mesh.visible = inkStain.mesh.visible = false;
    stainSatellites.forEach(p => p.mesh.visible = false);
    handSprite.mesh.visible = faceCollage.visible = hammer.visible = false;
    logo.visible = false; vGroup.visible = false;
    const meet = ease((t - 27.0) / 1.0);
    const flying = Math.max(0, t - 28.22);
    fightLabels.forEach((item, i) => {
      item.mesh.visible = true;
      if (flying <= 0) {
        const wobble = t > 27.6 ? Math.sin(t * 23 + i * 1.9) * 0.34 : 0;
        item.mesh.position.set(fightStarts[i][0] * (1 - meet) + Math.cos(t * 4 + i) * wobble, fightStarts[i][1] * (1 - meet) + Math.sin(t * 5 + i * 2) * wobble, 2.8 + i * 0.025);
        item.mesh.rotation.set(Math.sin(t * 7 + i) * wobble * 0.2, Math.cos(t * 8 + i) * wobble * 0.2, (1 - meet) * (i % 2 ? -0.35 : 0.35) + Math.sin(t * 17 + i) * wobble);
        item.mat.opacity = 1;
      } else {
        const v = fightToss[i];
        item.mesh.position.set(v.vx * flying, v.vy * flying - 1.4 * flying * flying, 2.8 + v.vz * flying);
        item.mesh.rotation.set(flying * v.spin, flying * v.spin * 0.7, flying * v.spin);
        item.mesh.scale.setScalar(1 + flying * 0.35);
        item.mat.opacity = 1 - ease(flying / 0.82);
      }
    });
    const blast = ease((t - 28.22) / 0.28);
    fightFlash.visible = t >= 28.22 && t < 29.18;
    fightFlash.scale.setScalar(Math.max(0.001, blast * 9));
    fightFlashMat.opacity = t >= 28.22 ? 0.92 * (1 - ease(flying / 0.95)) : 0;
    debris.forEach((p, i) => {
      p.mesh.visible = t >= 28.22 && flying < 1.35;
      if (t < 28.22) return;
      p.mesh.position.set(p.vx * flying, p.vy * flying - 1.35 * flying * flying, 2.4 + p.vz * flying);
      p.mesh.rotation.set(flying * p.spin, flying * p.spin * 0.7, flying * p.spin);
      p.mat.opacity = 1 - ease(flying / 1.3);
    });
  } else {
    fightLabels.forEach(p => p.mesh.visible = false);
    fightFlash.visible = false;
    debris.forEach(p => p.mesh.visible = false);
  }

  const replay = t - 29.7;
  if (replay >= 0) {
    // Reset the stage to the paper-white ball sequence.
    logo.visible = false; vGroup.visible = false;
    sculpture.visible = false; dust.forEach(p => p.mesh.visible = false);
    blueSplash.mesh.visible = inkStain.mesh.visible = false;
    stainSatellites.forEach(p => p.mesh.visible = false);
    handSprite.mesh.visible = faceCollage.visible = hammer.visible = false;
    fightLabels.forEach(p => p.mesh.visible = false);
    debris.forEach(p => p.mesh.visible = false);
    fightFlash.visible = false;
    if (replay < 8.54) scene.background.set(0xf3f1eb);
    else scene.background.set(0x030303);

    const replayShake = ease((replay - encoreBurstAt) / 0.08) * (1 - ease((replay - 5.35) / 0.24));
    const replayVibe = replay > 1.05 && replay < encoreBurstAt ? 1 : 0;
    lineGroup.visible = replay < 5.55;
    lineGroup.position.set(-12 + 12 * ease(replay / 3.8) + replayVibe * Math.sin(replay * 46) * 0.042 + replayShake * (Math.sin(replay * 93) * 0.17 + Math.sin(replay * 57) * 0.08), -0.62 + replayVibe * Math.sin(replay * 38) * 0.026 + replayShake * Math.sin(replay * 107) * 0.15, 0);
    lineGroup.rotation.z = replayVibe * Math.sin(replay * 43) * 0.003 + replayShake * Math.sin(replay * 79) * 0.055;
    if (replay >= 1.78 && replay < 5.55) {
      const run = replay - 1.78;
      const x = replay < 4.65 ? -5.9 + run * 3.65 : 4.585 + (replay - 4.65) * 4.9;
      const bounce = hop(run);
      ball.visible = true; ball.scale.setScalar(1);
      ball.position.set(x, -0.62 + 0.245 + bounce - (replay > 4.92 ? (replay - 4.92) ** 2 * 5.8 : 0), 0.34);
      ball.rotation.set(run * 3.2, 0, -run * 5.5);
      ballShadow.visible = true; ballShadow.position.x = x;
      ballShadow.material.opacity = clamp(0.16 - bounce * 0.15, 0.045, 0.16);
      updateParticleBalls(replay, encoreBurstAt);
    } else if (replay >= 5.55 && replay < 7.28) {
      ball.visible = true; ballShadow.visible = false;
      const drop = ease((replay - 5.55) / 1.14);
      const shrink = replay < 6.85 ? 9.4 + 1.5 * drop : 10.9 * (1 - ease((replay - 6.85) / 0.43));
      ball.position.set(0, 4.9 * (1 - drop) + 0.12, 0.6); ball.scale.setScalar(Math.max(0.001, shrink));
      ball.rotation.set(replay * 0.58, replay * 0.71, replay * 0.32);
      particleBalls.forEach(p => p.mesh.visible = false);
      camera.position.set(0, 8 * ease((replay - 5.55) / 0.65), 12 - 6.6 * ease((replay - 5.55) / 0.65)); camera.lookAt(0, 0, 0);
    } else {
      ball.visible = false; ballShadow.visible = false;
      particleBalls.forEach(p => p.mesh.visible = false);
    }
    if (replay >= 7.26 && replay < 8.8) {
      const restore = ease((replay - 7.26) / 0.63);
      camera.position.set(0, 8 * (1 - restore), 5.4 + 6.6 * restore); camera.lookAt(0, 0, 0);
      rings.forEach((ring, i) => {
        const start = 7.27 + i * 0.09, p = ease((replay - start) / 1.12);
        ring.visible = replay >= start && replay < 8.65; ring.scale.setScalar(Math.max(0.001, p * 13));
      });
      const ip = ease((replay - 7.62) / 0.9);
      iris.visible = replay >= 7.62 && replay < 8.56; iris.scale.setScalar(Math.max(0.001, ip * 18));
    } else if (replay >= 8.8) {
      rings.forEach(r => r.visible = false); iris.visible = false;
      camera.position.set(0, 0, 12); camera.lookAt(0, 0, 0);
    }
    if (replay >= 8.54) {
      rings.forEach(r => r.visible = false); iris.visible = false;
      camera.position.set(0, 0, 12); camera.lookAt(0, 0, 0);
      sculpture.visible = true; sculptureFace.mesh.visible = true;
      const reveal = ease((replay - 8.55) / 1.05);
      sculpture.position.set(0, -0.08 + Math.sin(replay * 0.8) * 0.025, 0);
      sculpture.rotation.set(0.01, Math.sin(replay * 0.55) * 0.06, 0);
      sculpture.scale.setScalar(Math.max(0.001, easeOutBack((replay - 8.55) / 1.05)));
      sculptureFace.material.opacity = reveal;
      toadSprite.mesh.visible = replay >= 9.0;
      toadSprite.material.opacity = ease((replay - 8.95) / 0.4);
      toadSprite.mesh.position.set(-0.1, 2.62 + Math.abs(Math.sin(replay * 11)) * 0.025, 1.06);
      toadSprite.mesh.rotation.z = Math.sin(replay * 11) * 0.025;
      scream.scale.set(0.12, 0.035, 1); screamLip.scale.set(1, 0.32, 1);
      logo.visible = true; headMaterials.forEach(m => m.opacity = 0);
      const replayTitleIn = easeOutCubic((replay - 10.0) / 1.0);
      title.position.set(0, -3.0 - 0.2 * (1 - replayTitleIn), 0.95); title.rotation.z = 0;
      title.scale.setScalar(0.9 + 0.1 * replayTitleIn);
      shine.position.set(0, -3.0, 0.97);
      titleMaterial.opacity = ease((replay - 10.0) / 1.0);
      const shineP = clamp((replay - 10.9) / 1.2, 0, 1);
      shineMaterial.opacity = replay >= 10.9 && replay < 12.2 ? Math.sin(Math.PI * shineP) * 0.9 : 0;
      if (replay >= 10.9 && replay < 12.15 && Math.abs(shineP - lastShineProgress) > 0.008) { drawShine(shineP); lastShineProgress = shineP; }
    }
  }
  const [shakeX, shakeY, shakeRoll] = cameraShake(t);
  camSavePos.copy(camera.position);
  camSaveQuat.copy(camera.quaternion);
  camera.position.x += shakeX;
  camera.position.y += shakeY;
  camera.rotateZ(shakeRoll);
  renderer.render(scene, camera);
  camera.position.copy(camSavePos);
  camera.quaternion.copy(camSaveQuat);
}

function resize() {
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.fov = w < 600 ? 39 : 35;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();
requestAnimationFrame(frame);