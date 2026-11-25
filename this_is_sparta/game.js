import * as THREE from 'https://esm.sh/three@0.160.0';

/* ---------- DOM ---------- */
const $ = (s) => document.querySelector(s);
const stage = $('#stage'), speaker = $('#speaker'), line = $('#line'), button = $('#kick'),
      flash = $('#flash'), toast = $('#toast');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Script of the scene ---------- */
const DIALOGUE = {
  messenger: { who: 'Persian messenger', text: 'This is blasphemy! This is madness!', btn: 'Continue' },
  leonidas:  { who: 'Leonidas',          text: 'Madness? This is Sparta!',            btn: 'Kick' },
  done:      { who: '',                  text: '',                                    btn: 'Play again' },
};

/* ---------- Renderer (with graceful failure) ---------- */
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: false });
} catch (err) {
  speaker.textContent = 'WebGL unavailable';
  line.textContent = 'Try a different browser or enable hardware acceleration.';
  button.classList.add('hidden');
  throw err;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
stage.appendChild(renderer.domElement);

/* ---------- Scene, camera, lights ---------- */
const scene = new THREE.Scene();
scene.background = new THREE.Color('#b98555');
scene.fog = new THREE.FogExp2('#b98555', 0.045);

const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 100);
const camBase = new THREE.Vector3();
const camTarget = new THREE.Vector3(0, 0.75, -0.15);

scene.add(new THREE.HemisphereLight(0xffdfb0, 0x30201b, 2.2));
const sun = new THREE.DirectionalLight(0xffcb83, 4.1);
sun.position.set(-5, 9, 7);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8 });
scene.add(sun);
const fill = new THREE.DirectionalLight(0x7393a3, 1.05);
fill.position.set(5, 4, -4);
scene.add(fill);

/* ---------- Materials & helpers ---------- */
const mat = (color, roughness = 0.9) => new THREE.MeshStandardMaterial({ color, roughness });
const groundMat = mat('#806046'), rockMat = mat('#67503d'), edgeMat = mat('#a47b52'),
      redMat = mat('#8e2018'), bronze = mat('#a8793e', 0.55), skin = mat('#c58b62'),
      dark = mat('#33251d'), gold = mat('#c89a53');
const blackMat = new THREE.MeshBasicMaterial({ color: 0x070605 });

/** Add a shadow-casting mesh to a parent. */
function part(parent, geo, material, pos = [0, 0, 0], rot) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(...pos);
  if (rot) m.rotation.set(...rot);
  m.castShadow = m.receiveShadow = true;
  parent.add(m);
  return m;
}
const capsule = (g, r, len, material, pos) => part(g, new THREE.CapsuleGeometry(r, len, 4, 8), material, pos);

/* Small seeded RNG so the arena looks the same every run. */
let seed = 41;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

/* ---------- Arena ---------- */
const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.08;
ground.receiveShadow = true;
scene.add(ground);

const PIT = { x: 1.65, z: -0.7 };
const pitWall = part(scene, new THREE.CylinderGeometry(1.45, 1.72, 0.55, 48, 1, true), rockMat, [PIT.x, -0.26, PIT.z]);
pitWall.castShadow = false;
const pitVoid = new THREE.Mesh(new THREE.CircleGeometry(1.46, 48), blackMat);
pitVoid.rotation.x = -Math.PI / 2;
pitVoid.position.set(PIT.x, -0.01, PIT.z);
scene.add(pitVoid);
part(scene, new THREE.TorusGeometry(1.48, 0.16, 10, 56), edgeMat, [PIT.x, 0.015, PIT.z], [Math.PI / 2, 0, 0]);

for (let i = 0; i < 40; i++) {
  const x = (rand() - 0.5) * 17, z = -2 - rand() * 11;
  if (Math.hypot(x - PIT.x, z - PIT.z) < 2.3) continue;
  const s = part(scene, new THREE.DodecahedronGeometry(0.12 + rand() * 0.28, 0), i % 3 ? rockMat : edgeMat, [x, 0.02, z],
                 [rand(), rand() * 3, rand()]);
  s.scale.set(1 + rand(), 0.4 + rand() * 0.5, 0.7 + rand());
}
for (let i = 0; i < 11; i++) {
  const h = 2 + rand() * 4;
  const m = new THREE.Mesh(new THREE.ConeGeometry(1.7 + rand() * 2, h, 5), mat(i % 2 ? '#73503c' : '#886044'));
  m.position.set((i - 5) * 3, h / 2 - 1.6, -13 - rand() * 2);
  m.rotation.y = rand();
  scene.add(m);
}

/* ---------- Characters ---------- */
const SPARTAN_HOME = { x: -1.35, z: 0.55 };
const MESSENGER_HOME = { x: 0.35, z: 0.22 };

function makeSpartan() {
  const root = new THREE.Group();
  scene.add(root);
  const cape = part(root, new THREE.BoxGeometry(0.09, 1.65, 0.82), redMat, [-0.31, 0.97, -0.12], [0, 0, -0.08]);
  capsule(root, 0.34, 0.68, skin, [0, 1.35, 0]);
  part(root, new THREE.CylinderGeometry(0.34, 0.4, 0.62, 8), bronze, [0, 1.48, 0]);
  part(root, new THREE.SphereGeometry(0.24, 12, 10), skin, [0, 1.98, 0]);
  part(root, new THREE.SphereGeometry(0.29, 12, 9, 0, Math.PI * 2, 0, Math.PI * 0.63), bronze, [0, 2.12, 0]).scale.set(1, 1.05, 1);
  part(root, new THREE.BoxGeometry(0.12, 0.32, 0.48), bronze, [0, 1.96, 0.17], [0.2, 0, 0.08]);
  part(root, new THREE.BoxGeometry(0.08, 0.52, 0.14), redMat, [0, 2.46, -0.02], [0, 0, -0.1]);

  const leg = (x) => {
    const g = new THREE.Group();
    g.position.set(x, 0.76, 0);
    root.add(g);
    capsule(g, 0.13, 0.52, skin, [0, -0.28, 0]);
    part(g, new THREE.CylinderGeometry(0.14, 0.17, 0.29, 8), bronze, [0, -0.44, 0.02]);
    return g;
  };
  const leftLeg = leg(-0.18), rightLeg = leg(0.18);

  const shield = part(root, new THREE.CylinderGeometry(0.42, 0.42, 0.12, 16), bronze, [-0.48, 1.38, 0.32], [Math.PI / 2, 0, 0]);
  shield.receiveShadow = false;
  part(root, new THREE.CircleGeometry(0.16, 12), gold, [-0.48, 1.38, 0.395]);
  part(root, new THREE.CylinderGeometry(0.025, 0.03, 2.45, 6), dark, [0.48, 1.5, -0.08], [0, 0, 0.08]);
  part(root, new THREE.ConeGeometry(0.09, 0.28, 5), bronze, [0.48, 2.84, -0.08]);
  return { root, leftLeg, rightLeg, cape };
}

function makeMessenger() {
  const root = new THREE.Group();
  scene.add(root);
  part(root, new THREE.ConeGeometry(0.47, 1.22, 8), mat('#713628'), [0, 0.82, 0], [0, 0, Math.PI]);
  part(root, new THREE.CylinderGeometry(0.3, 0.31, 0.48, 9), mat('#5b3025'), [0, 1.35, 0]);
  capsule(root, 0.095, 0.42, skin, [-0.35, 1.2, 0.04]);
  capsule(root, 0.095, 0.42, skin, [0.35, 1.2, 0.04]);
  part(root, new THREE.SphereGeometry(0.22, 12, 10), skin, [0, 1.82, 0]);
  part(root, new THREE.ConeGeometry(0.24, 0.45, 6), gold, [0, 2.15, 0]);
  part(root, new THREE.TorusGeometry(0.29, 0.06, 6, 12), mat('#ba8840'), [0, 1.93, 0], [Math.PI / 2, 0, 0]);
  part(root, new THREE.CylinderGeometry(0.04, 0.04, 0.38, 8), mat('#e1c28c'), [0.41, 1.25, 0.25], [0, 0, Math.PI / 2]);
  return root;
}

const spartan = makeSpartan();
const messenger = makeMessenger();

/* ---------- Dust burst on impact ---------- */
const DUST_N = 28;
const dustGeo = new THREE.BufferGeometry();
dustGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(DUST_N * 3), 3));
const dustMat = new THREE.PointsMaterial({ color: 0xd9b78a, size: 0.22, transparent: true, opacity: 0, depthWrite: false });
const dust = new THREE.Points(dustGeo, dustMat);
dust.frustumCulled = false;
scene.add(dust);
const dustVel = Array.from({ length: DUST_N }, () => new THREE.Vector3());
let dustAge = 99;

function burstDust(x, z) {
  const p = dustGeo.attributes.position;
  for (let i = 0; i < DUST_N; i++) {
    p.setXYZ(i, x, 0.1, z);
    dustVel[i].set((Math.random() - 0.3) * 2.4, 0.6 + Math.random() * 1.4, (Math.random() - 0.5) * 2);
  }
  p.needsUpdate = true;
  dustAge = 0;
}
function updateDust(dt) {
  if (dustAge > 1) { dustMat.opacity = 0; return; }
  dustAge += dt;
  const p = dustGeo.attributes.position;
  for (let i = 0; i < DUST_N; i++) {
    dustVel[i].y -= 3 * dt;
    p.setXYZ(i, p.getX(i) + dustVel[i].x * dt, Math.max(0.02, p.getY(i) + dustVel[i].y * dt), p.getZ(i) + dustVel[i].z * dt);
  }
  p.needsUpdate = true;
  dustMat.opacity = Math.max(0, 0.8 * (1 - dustAge));
}

/* ---------- Tiny synthesized sound effects (no assets needed) ---------- */
let audio;
function tone({ type = 'sine', from, to, dur, gain = 0.25, delay = 0 }) {
  try {
    audio ??= new (window.AudioContext || window.webkitAudioContext)();
    const t0 = audio.currentTime + delay, osc = audio.createOscillator(), g = audio.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t0);
    osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(g).connect(audio.destination);
    osc.start(t0);
    osc.stop(t0 + dur);
  } catch { /* audio is optional */ }
}
const sfxThump = () => tone({ from: 140, to: 40, dur: 0.35, gain: 0.5 });
const sfxScream = () => tone({ type: 'sawtooth', from: 700, to: 160, dur: 1.0, gain: 0.05 });

/* ---------- Layout ---------- */
function resize() {
  const w = innerWidth, h = innerHeight;
  camera.aspect = w / h;
  camBase.set(0, h < 560 ? 6.8 : 5.7, w < 700 ? 14 : 12.5);
  camera.position.copy(camBase);
  camera.lookAt(camTarget);
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
addEventListener('resize', resize);

/* ---------- State machine ---------- */
let state = 'messenger';        // messenger -> leonidas -> kick -> done
let elapsed = 0, shake = 0, impacted = false, screamed = false;
let typeToken = 0;

function say(key) {
  const d = DIALOGUE[key], token = ++typeToken;
  speaker.textContent = d.who;
  line.textContent = '';
  if (reduceMotion || !d.text) { line.textContent = d.text; return; }
  let i = 0;
  (function step() {
    if (token !== typeToken) return;           // a newer line took over
    line.textContent = d.text.slice(0, ++i);
    if (i < d.text.length) setTimeout(step, 26);
  })();
}
function setButton(label, arrow = true) {
  button.replaceChildren(label + ' ');
  if (arrow) { const b = document.createElement('b'); b.textContent = '↗'; b.setAttribute('aria-hidden', 'true'); button.append(b); }
}

function resetScene() {
  spartan.root.position.set(SPARTAN_HOME.x, 0, SPARTAN_HOME.z);
  spartan.root.rotation.set(0, Math.PI / 2, 0);
  spartan.leftLeg.rotation.set(0, 0, 0);
  messenger.position.set(MESSENGER_HOME.x, 0, MESSENGER_HOME.z);
  messenger.rotation.set(0, -Math.PI / 2, 0);
  messenger.scale.setScalar(1);
  messenger.visible = true;
  elapsed = 0; shake = 0; impacted = false; screamed = false;
}

function begin() {
  if (state === 'messenger') {
    state = 'leonidas';
    say('leonidas');
    setButton(DIALOGUE.leonidas.btn);
    button.setAttribute('aria-label', 'Kick the Persian messenger');
  } else if (state === 'leonidas') {
    state = 'kick';
    elapsed = 0;
    button.classList.add('hidden');
    say('done');
    for (const el of [flash, toast]) { el.classList.remove('pop', 'show'); void el.offsetWidth; }
    flash.classList.add('pop');
    toast.classList.add('show');
  } else if (state === 'done') {
    restart();
  }
}
function restart() {
  state = 'messenger';
  resetScene();
  say('messenger');
  setButton(DIALOGUE.messenger.btn);
  button.setAttribute('aria-label', 'Continue the dialogue');
  button.classList.remove('hidden');
  button.focus({ preventScroll: true });
}
function finish() {
  state = 'done';
  messenger.visible = false;
  setTimeout(() => {
    if (state !== 'done') return;
    setButton(DIALOGUE.done.btn, false);
    button.setAttribute('aria-label', 'Play again');
    button.classList.remove('hidden');
    button.focus({ preventScroll: true });
  }, 400);
}

button.addEventListener('click', begin);
renderer.domElement.addEventListener('pointerdown', begin);
addEventListener('keydown', (e) => {
  if (e.repeat || (e.code !== 'Space' && e.code !== 'Enter')) return;
  e.preventDefault();
  if (e.target === button) return;      // the button's own click handles it
  begin();
});

/* ---------- Animation ---------- */
const smooth = (t) => t * t * (3 - 2 * t);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const seg = (t, a, b) => clamp01((t - a) / (b - a));   // progress of t within [a, b]

// Timeline (seconds)
const T = { windEnd: 0.35, hit: 0.55, legBack: 1.05, flyEnd: 1.5, fallEnd: 2.05 };

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.04), now = performance.now();

  if (state !== 'kick') {
    // idle breathing; cape sways gently
    spartan.root.position.y = Math.sin(now * 0.0017) * 0.012;
    spartan.cape.rotation.z = -0.08 + Math.sin(now * 0.0023) * 0.02;
    if (state !== 'done') messenger.position.y = Math.sin(now * 0.0019 + 0.7) * 0.01;
  } else {
    elapsed += dt;
    const t = elapsed;

    // Spartan: wind up (leg back), strike (leg forward), recover
    const back = smooth(seg(t, 0, T.windEnd)), strike = smooth(seg(t, T.windEnd, T.hit)), recover = smooth(seg(t, T.hit + 0.1, T.legBack));
    spartan.leftLeg.rotation.x = (0.5 * back * (1 - strike) - 1.5 * strike) * (1 - recover);
    spartan.root.rotation.z = -0.08 * strike * (1 - recover);
    spartan.root.position.x = SPARTAN_HOME.x + 0.12 * strike * (1 - recover);
    spartan.cape.rotation.z = -0.08 - 0.35 * strike * (1 - recover);

    // Impact moment: dust, camera shake, thump
    if (!impacted && t >= T.hit) {
      impacted = true;
      shake = reduceMotion ? 0 : 0.3;
      burstDust(MESSENGER_HOME.x - 0.2, MESSENGER_HOME.z);
      sfxThump();
    }

    // Messenger: arcs through the air, then drops into the pit
    if (t >= T.hit) {
      const fly = smooth(seg(t, T.hit, T.flyEnd)), fall = seg(t, T.flyEnd, T.fallEnd);
      messenger.position.x = MESSENGER_HOME.x + (PIT.x - MESSENGER_HOME.x) * fly;
      messenger.position.z = MESSENGER_HOME.z + (PIT.z - MESSENGER_HOME.z) * fly;
      messenger.position.y = 1.1 * Math.sin(fly * Math.PI * 0.75) - 2.6 * fall * fall;
      messenger.rotation.z = -Math.PI * 1.5 * fly;
      messenger.rotation.x = 0.7 * fly + fall * 2;
      messenger.scale.setScalar(1 - 0.6 * fall);
      if (!screamed && fly > 0.5) { screamed = true; sfxScream(); }
    }
    if (t >= T.fallEnd) finish();
  }

  updateDust(dt);

  // Camera shake decays quickly; otherwise the camera sits on its base mark.
  shake *= Math.pow(0.001, dt);
  camera.position.set(
    camBase.x + (Math.random() - 0.5) * shake,
    camBase.y + (Math.random() - 0.5) * shake,
    camBase.z
  );
  camera.lookAt(camTarget);

  renderer.render(scene, camera);
}

resize();
resetScene();
say('messenger');
animate();