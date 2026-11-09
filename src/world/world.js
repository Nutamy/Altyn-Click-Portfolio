// The 3D world of altyn-click.com: a shanyrak of liquid gold over a steppe that does not exist.
// Native page scroll drives the camera along a route of stations; every station is anchored to a DOM
// section, so text, buttons and the form stay ordinary HTML above the canvas.
// Build: npm run world  →  dist/world.js (bundled with three, loaded by app.js on capable devices).

import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Vector3, Vector2, Object3D,
  Mesh, InstancedMesh, Group, SphereGeometry, BoxGeometry, TorusGeometry, TubeGeometry, PlaneGeometry, RingGeometry, CircleGeometry,
  MeshStandardMaterial, MeshBasicMaterial, ShaderMaterial, BackSide,
  CatmullRomCurve3, QuadraticBezierCurve3, Raycaster, TextureLoader, SRGBColorSpace, ACESFilmicToneMapping,
  PMREMGenerator, MathUtils, Clock,
} from 'three';

/* ---------- World dimensions (metres) ---------- */
const RK = 20;          // kerege (lattice wall) radius
const K_LOW = 1.3;      // the wall floats above the ground
const K_HIGH = 6.4;
const RS = 3.2;         // shanyrak ring radius
const S_Y = 15.6;       // shanyrak height; it hovers above the ends of its poles
const UYK_END_Y = 14.9;
const PANEL_W = 7.4, PANEL_H = PANEL_W * 768 / 1416, PANEL_Y = 3.85, PANEL_R = RK - 0.55;
// Nine works hang around the wall, leaving the door (facing +z, towards the arriving camera) open
const DOOR = Math.PI / 2;
const panelAngle = i => DOOR + MathUtils.degToRad(40 + i * 35);

const GOLD = new Color('#E7B65A');
const SKY_TOP = new Color('#C4CDE8'), SKY_HORIZON = new Color('#EEEBE6'), STONE = new Color('#E8DFD1');

/* ---------- GLSL: simplex noise (Ashima / Ian McEwan, MIT) ---------- */
const NOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}
`;

/* ---------- Camera routes ----------
   Keyframes are poses; stations bind DOM sections to keyframes. Between stations the camera eases
   along a Catmull-Rom curve through the poses (and any waypoints between them). */
const V = (x, y, z) => new Vector3(x, y, z);

function workPose(i, wide) {
  const a = panelAngle(i);
  const out = V(Math.cos(a), 0, Math.sin(a));          // from the centre towards the wall
  const right = V(-Math.sin(a), 0, Math.cos(a));       // screen-right when facing the wall
  const p = out.clone().multiplyScalar(PANEL_R).setY(PANEL_Y);
  const side = i % 2 === 0 ? 1 : -1;                   // even works: card left, panel right
  const shift = wide ? 3.9 : 0;
  const pos = p.clone().addScaledVector(out, -12.6).addScaledVector(right, -side * shift).setY(PANEL_Y + 0.15);
  const look = p.clone().addScaledVector(right, -side * shift * 0.62);
  return { pos, look, fov: 38 };
}

function routeFull() {
  const k = [
    { id: 'hero', pos: V(-14, 13, 11), look: V(-7, 13.8, 1.5), fov: 40 },
    { pos: V(-9, 6, 22), look: V(-1, 7.5, 0), fov: 42 },
    { pos: V(0, 2.5, 19), look: V(0, 7.5, -6), fov: 44 },
    { id: 'dive', pos: V(0.4, 2.1, 3.2), look: V(0, 17, -3.2), fov: 56 },
  ];
  for (let i = 0; i < 9; i++) k.push({ id: 'work' + i, ...workPose(i, true) });
  k.push(
    { pos: V(0, 7.5, 2), look: V(0, 16, -12), fov: 48 },
    { pos: V(0, 23, 5), look: V(0, 17, -34), fov: 46 },
    { id: 'approach', pos: V(-30, 135, 118), look: V(-38, 0, -14), fov: 30 },
    { id: 'approach-end', pos: V(-18, 138, 121), look: V(-37, 0, -17), fov: 30 },
    { pos: V(0, 30, -10), look: V(0, 2, 12), fov: 40 },
    { pos: V(0, 10.5, -10.5), look: V(0, 7, 10), fov: 44 },
    { id: 'contact', pos: V(0, 2.7, -14), look: V(0, 7.6, 5), fov: 50 },
  );
  return k;
}
function routeMobile() {
  return [
    { id: 'hero', pos: V(0, 10.5, 17), look: V(0, 10.1, 0), fov: 60 },
    { pos: V(0, 2.2, 21), look: V(0, 10, 0), fov: 64 },
    { id: 'dive', pos: V(0.4, 2.1, 3.2), look: V(0, 17, -3.2), fov: 70 },
    { id: 'works', pos: V(0.8, 2.4, 3.4), look: V(3, 16, -3), fov: 66 },
    { id: 'works-end', pos: V(-0.8, 2.4, -3.4), look: V(-3, 16, 3), fov: 66 },
    { pos: V(0, 22, 4), look: V(0, 16, -34), fov: 60 },
    { id: 'approach', pos: V(-16, 78, 44), look: V(0, 0, 0), fov: 46 },
    { id: 'approach-end', pos: V(16, 84, 40), look: V(0, 0, 0), fov: 46 },
    { pos: V(0, 12, -10), look: V(0, 7, 10), fov: 56 },
    { id: 'contact', pos: V(0, 2.4, -13), look: V(0, 9, 5), fov: 66 },
  ];
}

// Stations: [first key, last key (a slow drift while the section holds), DOM range]
function stationsFor(staging) {
  const $ = s => document.querySelector(s);
  const works = [...document.querySelectorAll('.work')];
  const list = [];
  list.push({ a: 'hero', b: 'hero', start: () => 0, end: () => 0 });
  const intro = $('.works-intro');
  if (staging === 'full') {
    list.push({ a: 'dive', b: 'dive', start: () => top(intro), end: () => top(intro) + intro.offsetHeight - innerHeight });
    works.forEach((w, i) => list.push({ a: 'work' + i, b: 'work' + i, start: () => top(w), end: () => top(w) + w.offsetHeight - innerHeight }));
  } else {
    list.push({ a: 'dive', b: 'dive', start: () => top(intro) - innerHeight * 0.2, end: () => top(intro) + intro.offsetHeight * 0.4 });
    const last = works[works.length - 1];
    list.push({ a: 'works', b: 'works-end', start: () => top(works[0]) - innerHeight * 0.3, end: () => top(last) + last.offsetHeight - innerHeight * 0.6 });
  }
  const ap = $('#approach'), faq = $('#faq'), contact = $('#contact');
  list.push({ a: 'approach', b: 'approach-end', start: () => top(ap) - innerHeight * 0.15, end: () => top(faq) + faq.offsetHeight - innerHeight });
  list.push({ a: 'contact', b: 'contact', start: () => top(contact), end: () => document.documentElement.scrollHeight });
  return list;
}
function top(el) {
  let y = 0;
  for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
  return y;
}
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* ---------- Geometry helpers ---------- */
function roundedRectCurve(w, h, r) {
  const pts = [], seg = 7;
  const corner = (cx, cy, a0) => { for (let i = 0; i <= seg; i++) { const a = a0 + i / seg * Math.PI / 2; pts.push(V(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0)); } };
  const x = w / 2 - r, y = h / 2 - r;
  corner(x, y, 0); corner(-x, y, Math.PI / 2); corner(-x, -y, Math.PI); corner(x, -y, Math.PI * 1.5);
  return new CatmullRomCurve3(pts, true, 'centripetal');
}

/* ---------- Materials ---------- */
function liquidGold(uniforms, { amp = 0.05, freq = 0.32, speed = 0.22, rough = 0.14 } = {}) {
  const m = new MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: rough, envMapIntensity: 1.25 });
  m.onBeforeCompile = sh => {
    sh.uniforms.uTime = uniforms.uTime;
    sh.uniforms.uPulse = uniforms.uPulse;
    sh.vertexShader = 'uniform float uTime;\nuniform float uPulse;\n' + NOISE + sh.vertexShader
      .replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>
        vec3 lqP = position;
        #ifdef USE_INSTANCING
          lqP = (instanceMatrix * vec4(position, 1.)).xyz;
        #endif
        vec3 lqQ = lqP * ${freq.toFixed(3)} + vec3(0., uTime * ${speed.toFixed(3)}, uTime * ${(speed * .6).toFixed(3)});
        float lqN = snoise(lqQ);
        vec3 lqG = vec3(snoise(lqQ + vec3(.2, 0., 0.)) - lqN, snoise(lqQ + vec3(0., .2, 0.)) - lqN, snoise(lqQ + vec3(0., 0., .2)) - lqN) / .2;
        float lqA = ${amp.toFixed(3)} * (1. + uPulse * 2.5);
        objectNormal = normalize(objectNormal - lqA * ${(freq * 9).toFixed(3)} * (lqG - dot(lqG, objectNormal) * objectNormal));`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        transformed += normal * lqN * lqA;`);
  };
  return m;
}

function skyMaterial() {
  return new ShaderMaterial({
    side: BackSide, depthWrite: false, fog: false,
    uniforms: { uTop: { value: SKY_TOP }, uHorizon: { value: SKY_HORIZON }, uSun: { value: V(-.35, .42, -.84).normalize() } },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
    fragmentShader: `uniform vec3 uTop; uniform vec3 uHorizon; uniform vec3 uSun; varying vec3 vDir;
      void main(){
        float h = clamp(vDir.y, 0., 1.);
        vec3 c = mix(uHorizon, uTop, pow(h, .55));
        float s = max(dot(normalize(vDir), uSun), 0.);
        c += vec3(1., .93, .78) * (pow(s, 48.) * .55 + pow(s, 6.) * .08);
        c = mix(c, uHorizon * vec3(1.02, 1.0, .97), smoothstep(.06, -.02, vDir.y));
        gl_FragColor = vec4(c, 1.);
        #include <colorspace_fragment>
      }`,
  });
}

function groundMaterial(uniforms) {
  return new ShaderMaterial({
    uniforms: { uTime: uniforms.uTime, uStone: { value: STONE }, uHaze: { value: SKY_HORIZON }, uRK: { value: RK } },
    vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: NOISE + `uniform float uTime; uniform vec3 uStone; uniform vec3 uHaze; uniform float uRK; varying vec3 vW;
      void main(){
        float r = length(vW.xz);
        float n = snoise(vec3(vW.xz * .025, 0.)) * .5 + snoise(vec3(vW.xz * .12, 3.)) * .2;
        vec3 c = uStone * (1. + n * .035);
        // soft shadow of the floating wall and of the crown's pool of light
        c *= 1. - .16 * exp(-pow((r - uRK) / 3.2, 2.)) - .12 * exp(-pow(r / 9., 2.));
        // the space is not quite solid: faint rings travel out from the hearth
        float ring = sin(r * .55 - uTime * .45 + snoise(vec3(vW.xz * .03, uTime * .05)) * 1.6);
        c *= 1. - .03 * smoothstep(.75, 1., ring) * smoothstep(320., 30., r);
        float d = length(vW - cameraPosition);
        c = mix(c, uHaze, smoothstep(70., 520., d));
        gl_FragColor = vec4(c, 1.);
        #include <colorspace_fragment>
      }`,
  });
}

// Reflections: an authored studio of the same world (bright sky above, dark umber band at the horizon
// for contrast on the gold, a warm floor) rather than a photo HDRI
function makeEnvironment(renderer) {
  const scene = new Scene();
  const env = new Mesh(new SphereGeometry(50, 48, 24), new ShaderMaterial({
    side: BackSide,
    vertexShader: `varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
    fragmentShader: `varying vec3 vD; void main(){
      float y = vD.y;
      vec3 sky = mix(vec3(1.25, 1.22, 1.2), vec3(.62, .7, .95), smoothstep(.1, 1., y));
      vec3 band = vec3(.12, .08, .05);
      vec3 floorC = mix(vec3(.55, .44, .32), vec3(.9, .78, .6), smoothstep(-1., -.2, y));
      vec3 c = y > .04 ? sky : (y > -.12 ? band : floorC);
      c = mix(c, band, smoothstep(.12, .0, abs(y - .02)) * .7);
      float s = max(dot(vD, normalize(vec3(-.35, .55, -.75))), 0.);
      c += vec3(4., 3.4, 2.6) * pow(s, 90.);
      float s2 = max(dot(vD, normalize(vec3(.8, .25, .5))), 0.);
      c += vec3(1.4, 1.5, 1.8) * pow(s2, 30.);
      gl_FragColor = vec4(c, 1.); }`,
  }));
  scene.add(env);
  const pm = new PMREMGenerator(renderer);
  const rt = pm.fromScene(scene, 0.02);
  pm.dispose();
  env.geometry.dispose(); env.material.dispose();
  return rt;
}

/* ---------- The world ---------- */
export function createWorld({ root, staging, assets, onReady, onDegrade, onOpen }) {
  const lowEnd = staging !== 'full';
  const renderer = new WebGLRenderer({ antialias: !lowEnd, alpha: false, powerPreference: 'high-performance' });
  const maxDpr = () => Math.min(devicePixelRatio || 1, staging === 'full' ? 2 : 1.5);
  let dpr = maxDpr();
  renderer.setPixelRatio(dpr);
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  root.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');

  const scene = new Scene();
  scene.background = SKY_HORIZON.clone();
  const envRT = makeEnvironment(renderer);
  scene.environment = envRT.texture;

  const uniforms = { uTime: { value: 0 }, uPulse: { value: 0 } };
  const disposables = [];
  const keep = o => (disposables.push(o), o);

  // Sky and ground
  scene.add(new Mesh(keep(new SphereGeometry(900, 32, 16)), keep(skyMaterial())));
  const ground = new Mesh(keep(new CircleGeometry(900, 96)), keep(groundMaterial(uniforms)));
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const yurt = new Group();
  scene.add(yurt);
  const gold = keep(liquidGold(uniforms, { amp: 0.035, freq: 0.22, speed: 0.18, rough: 0.16 }));
  const goldLiquid = keep(liquidGold(uniforms, { amp: 0.09, freq: 0.55, speed: 0.35, rough: 0.09 }));
  const dummy = new Object3D();

  // Kerege: a floating lattice of crossing gold slats, with an open door facing the arriving camera
  const slatCount = lowEnd ? 72 : 120, slatAngle = MathUtils.degToRad(36);
  const slatLen = (K_HIGH - K_LOW) / Math.cos(slatAngle);
  const slatGeo = keep(new BoxGeometry(0.085, slatLen, 0.06));
  const slats = new InstancedMesh(slatGeo, gold, slatCount * 2);
  let n = 0;
  for (let i = 0; i < slatCount; i++) {
    const a = i / slatCount * Math.PI * 2;
    if (Math.abs(Math.atan2(Math.sin(a - DOOR), Math.cos(a - DOOR))) < 0.13) continue;
    for (const dir of [1, -1]) {
      dummy.position.set(Math.cos(a) * RK, (K_LOW + K_HIGH) / 2, Math.sin(a) * RK);
      dummy.rotation.set(0, -a + Math.PI / 2, dir * slatAngle);
      dummy.updateMatrix();
      slats.setMatrixAt(n++, dummy.matrix);
    }
  }
  slats.count = n;
  yurt.add(slats);
  for (const y of [K_LOW, K_HIGH]) {
    const ring = new Mesh(keep(new TorusGeometry(RK, 0.12, 8, 180)), gold);
    ring.rotation.x = Math.PI / 2; ring.position.y = y;
    yurt.add(ring);
  }

  // Uyks: roof poles rising from the wall towards a crown that hovers just out of their reach
  const uykCount = lowEnd ? 48 : 72;
  const uykCurve = new QuadraticBezierCurve3(V(RK - 0.1, K_HIGH, 0), V(RK * 0.5, 13.4, 0), V(RS + 0.35, UYK_END_Y, 0));
  const uykGeo = keep(new TubeGeometry(uykCurve, lowEnd ? 24 : 40, 0.11, 6, false));
  const uyks = new InstancedMesh(uykGeo, gold, uykCount);
  for (let i = 0; i < uykCount; i++) {
    dummy.position.set(0, 0, 0);
    dummy.rotation.set(0, i / uykCount * Math.PI * 2, 0);
    dummy.updateMatrix();
    uyks.setMatrixAt(i, dummy.matrix);
  }
  yurt.add(uyks);

  // Shanyrak: outer and inner rings plus two families of crossing arches, all liquid
  const crown = new Group();
  crown.position.y = S_Y;
  const outer = new Mesh(keep(new TorusGeometry(RS, 0.34, 20, 120)), goldLiquid);
  outer.rotation.x = Math.PI / 2;
  const inner = new Mesh(keep(new TorusGeometry(RS - 0.42, 0.13, 12, 120)), goldLiquid);
  inner.rotation.x = Math.PI / 2; inner.position.y = 0.05;
  crown.add(outer, inner);
  for (const c of [-1.25, 0, 1.25]) for (const axis of [0, 1]) {
    const half = Math.sqrt((RS - 0.3) ** 2 - c * c), pts = [];
    for (let i = 0; i <= 24; i++) {
      const t = -half + 2 * half * i / 24, h = 1.45 * Math.sqrt(Math.max(0, 1 - t * t / (half * half)));
      pts.push(axis ? V(c, h, t) : V(t, h, c));
    }
    crown.add(new Mesh(keep(new TubeGeometry(new CatmullRomCurve3(pts), 48, 0.12, 8, false)), goldLiquid));
  }
  yurt.add(crown);

  // The hearth: a pool of liquid gold under the crown, fed by slow drops
  const poolGeo = keep(new RingGeometry(0.001, 2.6, 96, 28));
  poolGeo.rotateX(-Math.PI / 2);
  const poolMat = keep(new MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.06, envMapIntensity: 1.4 }));
  poolMat.onBeforeCompile = sh => {
    sh.uniforms.uTime = uniforms.uTime; sh.uniforms.uPulse = uniforms.uPulse;
    sh.vertexShader = 'uniform float uTime;\nuniform float uPulse;\n' + sh.vertexShader
      .replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>
        float pr = length(position.xz);
        float fall = exp(-pr * .5) * smoothstep(2.6, 1.9, pr);
        float ph = pr * 5.5 - uTime * 2.4;
        float amp = .05 + uPulse * .1;
        float dy = amp * (5.5 * cos(ph) * fall - .5 * sin(ph) * fall);
        vec2 dir = pr > .0001 ? position.xz / pr : vec2(0.);
        objectNormal = normalize(vec3(-dy * dir.x, 1., -dy * dir.y));`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        transformed.y += amp * sin(ph) * fall;`);
  };
  const pool = new Mesh(poolGeo, poolMat);
  pool.position.y = 0.04;
  yurt.add(pool);
  const rim = new Mesh(keep(new TorusGeometry(2.62, 0.09, 8, 96)), gold);
  rim.rotation.x = Math.PI / 2; rim.position.y = 0.06;
  yurt.add(rim);
  const dropGeo = keep(new SphereGeometry(0.11, 16, 12));
  const drops = Array.from({ length: 4 }, (_, i) => {
    const d = new Mesh(dropGeo, goldLiquid);
    d.userData.phase = i / 4;
    yurt.add(d);
    return d;
  });

  // The works: screenshots in gold frames hung on the inside of the wall
  const MAT = 0.42; // felt passe-partout around each screenshot, inside the gold frame
  const frameGeo = keep(new TubeGeometry(roundedRectCurve(PANEL_W + MAT * 2 + 0.1, PANEL_H + MAT * 2 + 0.1, 0.38), 180, 0.1, 8, true));
  const panelGeo = keep(new PlaneGeometry(PANEL_W, PANEL_H));
  const ids = [...document.querySelectorAll('.work')].map(w => w.dataset.work);
  // Warm black felt behind each screenshot, lit by the same sky as the gold
  const feltMat = keep(new MeshStandardMaterial({ color: '#2A211A', roughness: 1, metalness: 0 }));
  const loader = new TextureLoader();
  const panels = ids.map((id, i) => {
    const a = panelAngle(i);
    const g = new Group();
    g.position.set(Math.cos(a) * PANEL_R, PANEL_Y, Math.sin(a) * PANEL_R);
    g.lookAt(0, PANEL_Y, 0);
    const mat = keep(new MeshBasicMaterial({ color: '#2A2119', toneMapped: false }));
    const plane = new Mesh(panelGeo, mat);
    plane.userData.id = id;
    const frame = new Mesh(frameGeo, gold);
    frame.position.z = -0.02;
    // A felt backing gives the screenshot an edge against the lattice behind it
    const back = new Mesh(keep(new PlaneGeometry(PANEL_W + MAT * 2, PANEL_H + MAT * 2)), feltMat);
    back.position.z = -0.06;
    g.add(back, plane, frame);
    g.userData = { id, plane, mat, loaded: false, hover: 0 };
    yurt.add(g);
    return g;
  });
  function loadPanel(p) {
    if (p.userData.loaded) return;
    p.userData.loaded = true;
    loader.load(assets + 'screenshots/' + p.userData.id + '/01.webp', tex => {
      tex.colorSpace = SRGBColorSpace;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      p.userData.mat.map = tex;
      p.userData.mat.color.set('#ffffff');
      p.userData.mat.needsUpdate = true;
      disposables.push(tex);
    });
  }

  /* ---------- Camera and route ---------- */
  const camera = new PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 2000);
  let keys, posCurve, lookCurve, keyIndex, stations, ranges = [];
  function build() {
    keys = staging === 'full' ? routeFull() : routeMobile();
    keyIndex = Object.fromEntries(keys.map((k, i) => [k.id, i]).filter(e => e[0]));
    posCurve = new CatmullRomCurve3(keys.map(k => k.pos), false, 'centripetal');
    lookCurve = new CatmullRomCurve3(keys.map(k => k.look), false, 'centripetal');
    stations = stationsFor(staging);
    measure();
  }
  function measure() {
    ranges = stations.map(s => ({ a: keyIndex[s.a], b: keyIndex[s.b], start: s.start(), end: Math.max(s.start(), s.end()) }));
  }
  // Scroll position → position on the route, in keyframe units
  function routeAt(y) {
    for (let i = 0; i < ranges.length; i++) {
      const r = ranges[i];
      if (y <= r.end || i === ranges.length - 1) {
        if (y >= r.start) return r.end > r.start ? MathUtils.lerp(r.a, r.b, (y - r.start) / (r.end - r.start)) : r.a;
        const prev = ranges[i - 1];
        if (!prev) return r.a;
        const t = MathUtils.clamp((y - prev.end) / Math.max(1, r.start - prev.end), 0, 1);
        return MathUtils.lerp(prev.b, r.a, ease(t));
      }
    }
    return ranges[ranges.length - 1].b;
  }
  const tmpP = new Vector3(), lookNow = new Vector3();
  function poseAt(k, outPos, outLook) {
    const u = MathUtils.clamp(k / (keys.length - 1), 0, 1);
    posCurve.getPoint(u, outPos);
    lookCurve.getPoint(u, outLook);
    const i = Math.min(keys.length - 2, Math.floor(k)), f = MathUtils.clamp(k - i, 0, 1);
    return MathUtils.lerp(keys[i].fov, keys[i + 1].fov, f);
  }

  build();
  let kNow = routeAt(scrollY);
  let pointer = new Vector2(), pointerSm = new Vector2();
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Interaction: hover and click on the hung works ---------- */
  const ray = new Raycaster();
  const ndc = new Vector2();
  let hovered = null;
  const canvas = renderer.domElement;
  function pick(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(panels.map(p => p.userData.plane), false)[0];
    return hit && hit.distance < 40 ? panels.find(p => p.userData.plane === hit.object) : null;
  }
  function onMove(e) {
    pointer.set(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1);
    if (staging !== 'full') return;
    hovered = pick(e);
    canvas.style.cursor = hovered ? 'zoom-in' : '';
  }
  function onClick(e) {
    if (staging !== 'full') return;
    const p = pick(e);
    if (p) onOpen(p.userData.id);
  }
  // A lost GPU context (driver reset, memory pressure) hands the page to the lite staging
  const onLost = e => { e.preventDefault(); if (!degraded) { degraded = true; onDegrade(); } };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('click', onClick);
  if (fine) addEventListener('pointermove', onMove, { passive: true });

  let pulseAt = -10;
  const onLead = () => { pulseAt = clock.getElapsedTime(); };
  document.addEventListener('lead:sent', onLead);

  /* ---------- Resize and layout ---------- */
  function onResize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    measure();
  }
  addEventListener('resize', onResize, { passive: true });
  // Sections change height when fonts arrive or content opens (FAQ, form errors): re-anchor the stations
  const ro = new ResizeObserver(() => measure());
  ro.observe(document.querySelector('main'));

  /* ---------- Loop ---------- */
  const clock = new Clock();
  let frames = 0, slowFrames = 0, ready = false, last = performance.now(), checkFrom = 0, degraded = false;
  function frame() {
    const now = performance.now();
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;
    uniforms.uPulse.value = Math.max(0, 1 - (t - pulseAt) / 3.5) * (t > pulseAt ? 1 : 0);

    // The camera follows the scroll with a short, critically damped lag; reversing returns exactly
    const target = routeAt(scrollY);
    kNow += (target - kNow) * (1 - Math.exp(-dt * 7));
    if (Math.abs(target - kNow) < 1e-4) kNow = target;
    const fov = poseAt(kNow, tmpP, lookNow);
    pointerSm.lerp(pointer, 1 - Math.exp(-dt * 3));
    // A breath of life at rest plus a little pointer parallax on desktop
    const sway = Math.sin(t * 0.35) * 0.18;
    camera.position.copy(tmpP);
    // Arrival: on first paint the camera is still drifting in from further out, then settles on the route
    const intro = Math.max(0, 1 - t / 2.6), introE = intro * intro * intro;
    if (introE > 0) camera.position.addScaledVector(tmpP.sub(lookNow).normalize(), introE * 9).y += introE * 2.5;
    camera.position.x += fine ? pointerSm.x * 0.45 : 0;
    camera.position.y += sway + (fine ? -pointerSm.y * 0.25 : 0);
    camera.lookAt(lookNow);
    if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }

    // Works load as the camera nears them; a hovered frame leans out of the wall
    const near = staging === 'full' ? kNow - (keyIndex.work0 ?? 0) : 0;
    panels.forEach((p, i) => {
      if (staging !== 'full' || near > i - 2.5) loadPanel(p);
      p.userData.hover += ((hovered === p ? 1 : 0) - p.userData.hover) * (1 - Math.exp(-dt * 10));
      const h = p.userData.hover;
      p.userData.plane.position.z = h * 0.18;
      p.scale.setScalar(1 + h * 0.025);
    });

    // Drops fall from the crown's apex into the hearth
    drops.forEach(d => {
      const ph = (t * 0.22 + d.userData.phase) % 1;
      const y = S_Y + 1.35 - ph * ph * (S_Y + 1.3);
      d.position.set(0, Math.max(0.1, y), 0);
      d.scale.set(1, 1 + ph * 2.2, 1);
      d.visible = y > 0.15;
    });
    crown.rotation.y = t * 0.02;

    renderer.render(scene, camera);

    if (!ready && ++frames > 2) {
      ready = true; checkFrom = now + 1500; onReady();
      // All nine screenshots follow the first frame, one after another, so the walls are never blank
      panels.forEach((p, i) => setTimeout(() => loadPanel(p), 400 + i * 250));
    }
    // Watchdog: if the device cannot hold the frame rate, first lower the resolution, then step down to lite
    if (ready && !degraded && now > checkFrom && !document.hidden) {
      if (dt > 1 / 28) slowFrames++; else slowFrames = Math.max(0, slowFrames - 0.5);
      if (slowFrames > 45) {
        slowFrames = 0;
        if (dpr > 1) { dpr = Math.max(1, dpr * 0.7); renderer.setPixelRatio(dpr); renderer.setSize(innerWidth, innerHeight, false); checkFrom = now + 1500; }
        else { degraded = true; onDegrade(); }
      }
    }
  }
  renderer.setAnimationLoop(frame);

  return {
    setStaging(next) {
      staging = next;
      dpr = maxDpr();
      renderer.setPixelRatio(dpr);
      build();
      hovered = null;
      canvas.style.cursor = '';
    },
    dispose() {
      renderer.setAnimationLoop(null);
      removeEventListener('resize', onResize);
      removeEventListener('pointermove', onMove);
      document.removeEventListener('lead:sent', onLead);
      ro.disconnect();
      disposables.forEach(d => d.dispose && d.dispose());
      envRT.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
