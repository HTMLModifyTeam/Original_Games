import * as THREE from 'https://esm.sh/three@0.128.0';

const R = new THREE.WebGLRenderer();
R.setPixelRatio(Math.min(devicePixelRatio, 2));
document.body.prepend(R.domElement);

const sm = (a, b, x) => {
  x = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return x * x * (3 - 2 * x)
};
const std = (c, r = .6, m = 0) => new THREE.MeshStandardMaterial({
  color: c,
  roughness: r,
  metalness: m
});

function lights(s, k = 1) {
  s.add(new THREE.HemisphereLight(0xffffff, 0x888880, .7 * k));
  const d = new THREE.DirectionalLight(0xffffff, .9 * k);
  d.position.set(-4, 8, 6);
  s.add(d);
  return d
}
/* Scene A: line + ball (side view) */
const A = new THREE.Scene();
A.background = new THREE.Color(0xf2efe6);
lights(A);
const camA = new THREE.PerspectiveCamera(40, 1, .1, 100);
const bar = new THREE.Mesh(new THREE.BoxGeometry(16, .5, 1.2), std(0x050505, .4));
A.add(bar);
const ball = new THREE.Mesh(new THREE.SphereGeometry(.5, 40, 28), std(0x8a8a8a, .45, .15));
A.add(ball);
/* Scene B: bird's-eye close-up */
const B = new THREE.Scene();
B.background = new THREE.Color(0xf2efe6);
lights(B);
const camB = new THREE.PerspectiveCamera(40, 1, .1, 100);
camB.position.set(0, 6, 0);
camB.up.set(0, 0, -1);
camB.lookAt(0, 0, 0);
const ballB = new THREE.Mesh(new THREE.SphereGeometry(1.2, 48, 32), std(0x8a8a8a, .45, .15));
B.add(ballB);
const blk = new THREE.MeshBasicMaterial({
  color: 0,
  side: THREE.DoubleSide
});
const rings = [0, 1].map(() => {
  const m = new THREE.Mesh(new THREE.RingGeometry(.94, 1, 96), blk);
  m.rotation.x = -Math.PI / 2;
  m.visible = false;
  B.add(m);
  return m
});
const disc = new THREE.Mesh(new THREE.CircleGeometry(1, 96), blk);
disc.rotation.x = -Math.PI / 2;
disc.position.y = .02;
disc.visible = false;
B.add(disc);
/* Scene C: stone mask */
const C = new THREE.Scene();
C.background = new THREE.Color(0);
const key = lights(C, .55);
key.intensity = 1.3;
const rim = new THREE.DirectionalLight(0xffd9a8, .8);
rim.position.set(5, 2, -4);
C.add(rim);
const camC = new THREE.PerspectiveCamera(35, 1, .1, 100);
camC.position.set(0, 0, 11);
const cv = document.createElement('canvas');
cv.width = cv.height = 512;
const cx = cv.getContext('2d');
cx.fillStyle = '#8b8a84';
cx.fillRect(0, 0, 512, 512);
for (let i = 0; i < 9000; i++) {
  const g = 90 + Math.random() * 90 | 0;
  cx.fillStyle = `rgba(${g},${g},${g - 6},.35)`;
  cx.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 3, 1 + Math.random() * 3)
}
for (let i = 0; i < 40; i++) {
  cx.fillStyle = `rgba(60,60,55,${Math.random() * .12})`;
  cx.beginPath();
  cx.arc(Math.random() * 512, Math.random() * 512, 10 + Math.random() * 50, 0, 7);
  cx.fill()
}
const tex = new THREE.CanvasTexture(cv);
tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
tex.repeat.set(2, 2);
const stone = new THREE.MeshStandardMaterial({
  map: tex,
  bumpMap: tex,
  bumpScale: 2.5,
  roughness: .95
});
const dark = std(0x2a2a27, .9);
const mask = new THREE.Group();
mask.position.y = .7;
C.add(mask);

function el(g, mat, sx, sy, sz, x, y, z, rz = 0) {
  const m = new THREE.Mesh(g, mat);
  m.scale.set(sx, sy, sz);
  m.position.set(x, y, z);
  m.rotation.z = rz;
  mask.add(m);
  return m
}
const SP = new THREE.SphereGeometry(1, 40, 28);
el(SP, stone, 1, 1.25, .6, 0, 0, 0); // face
for (const s of [-1, 1]) {
  el(SP, stone, .4, .09, .13, s * .38, .4, .5, -s * .15); // brows
  el(SP, dark, .22, .03, .05, s * .38, .25, .55); // closed eyes
  el(SP, stone, .3, .2, .12, s * .5, -.2, .46); // cheeks
  el(SP, stone, .32, .07, .1, s * .22, -.4, .52, s * .35); // mustache
  el(SP, stone, .12, .3, .1, s, 0, 0); // ears
}
el(SP, stone, .15, .4, .17, 0, -.05, .6); // nose
el(SP, dark, .12, .02, .04, 0, -.52, .53); // mouth
for (let i = -3; i <= 3; i++) {
  const L = 1.6 - Math.abs(i) * .28;
  const c = new THREE.Mesh(new THREE.ConeGeometry(.15, L, 16), stone);
  c.rotation.set(Math.PI, 0, i * .05);
  c.position.set(i * .2, -.75 - L / 2, .35 - Math.abs(i) * .06);
  mask.add(c)
}
const cap = new THREE.Mesh(new THREE.CylinderGeometry(.45, .62, .5, 32), stone);
cap.position.set(0, 1.3, .05);
mask.add(cap);
// three-legged toad
el(SP, stone, .5, .3, .42, 0, 1.75, .05);
el(SP, stone, .3, .2, .28, 0, 1.85, .35);
for (const s of [-1, 1]) {
  el(SP, stone, .1, .1, .1, s * .15, 2.02, .4);
  el(SP, dark, .04, .04, .04, s * .15, 2.04, .49);
  el(SP, stone, .13, .08, .2, s * .38, 1.56, .35)
}
el(SP, stone, .2, .09, .26, 0, 1.56, -.25); // third leg
el(SP, dark, .15, .015, .03, 0, 1.82, .58);
for (let i = 0; i < 14; i++) {
  const a = Math.random() * 6.28, r = Math.random() * .35;
  el(SP, stone, .05, .04, .05, Math.cos(a) * r, 2.0, Math.sin(a) * r * .8)
}

function fit() {
  const w = innerWidth,
    h = innerHeight,
    a = w / h;
  R.setSize(w, h);
  for (const c of [camA, camB, camC]) {
    c.aspect = a;
    c.updateProjectionMatrix()
  }
  camA.position.set(0, 1.5, 14 * Math.max(1, 1.78 / a));
  camA.lookAt(0, .2, 0)
}
addEventListener('resize', fit);
fit();
const fade = document.getElementById('fade'), title = document.getElementById('title');
let t0 = performance.now();
addEventListener('pointerdown', () => {
  t0 = performance.now()
});
const T_STOP = 9.4,
  T_FALL = 9.6,
  T_CUT = 10.9,
  T_C = 14.5;

function frame(now) {
  const t = (now - t0) / 1000;
  let scene = A,
    cam = camA;
  fade.style.opacity = 0;
  title.style.opacity = 0;
  title.classList.remove('on');
  if (t < T_CUT) {
    const u = Math.min(t, T_STOP) / T_STOP,
      Rr = -9 + 13 * (1 - (1 - u) * (1 - u));
    const amp = t < T_STOP ? .07 * sm(1.2, 3, t) : 0;
    bar.position.x = Rr - 8 + Math.sin(t * 75) * amp;
    const bx = -10 + 2.5 * (t - 4),
      bounce = t => .75 + 1.3 * Math.abs(Math.sin(t * 9.5));
    ball.visible = t > 3.9;
    if (t < T_FALL) {
      ball.position.set(bx, bounce(t), 0)
    } else {
      const d = t - T_FALL;
      ball.position.set(4 + 2 * d, bounce(T_FALL) - 11 * d * d, 0)
    }
    ball.rotation.z = -bx / .5;
  } else if (t < T_C) {
    scene = B;
    cam = camB;
    const s = t - T_CUT;
    ballB.visible = s < 1.9;
    ballB.position.y = 1 - 14 * s * s;
    ballB.scale.setScalar(1 - sm(1.2, 1.9, s));
    ballB.rotation.x = s * 3;
    rings.forEach((r, i) => {
      const k = (s - 1.9 - i * .15) / .8;
      r.visible = k > 0;
      r.scale.setScalar(.01 + 9 * (1 - Math.pow(1 - Math.min(k, 1), 3)))
    });
    const dk = (s - 2.7) / .7;
    disc.visible = dk > 0;
    disc.scale.setScalar(.01 + 8 * sm(0, 1, dk));
  } else {
    scene = C;
    cam = camC;
    mask.rotation.y = .35 * Math.sin(t * .6);
    mask.rotation.x = .05 * Math.sin(t * .4);
    fade.style.opacity = 1 - sm(14.6, 16.8, t);
    title.style.opacity = sm(17.4, 19, t);
    if (t > 19) title.classList.add('on');
  }
  R.render(scene, cam);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);