/* =========================================================
   SHUBH DEEPAVALI — Lakshmi Pujan: scene flow and interactions
   ========================================================= */
const screens = [...document.querySelectorAll(".screen")];
const $ = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const messageText = `Tonight, as every home glows and every doorway waits for Maa Lakshmi, I keep thinking about how much light you have already brought into my life.

May Maa Lakshmi bless you with abundance in everything — in health, in happiness, in success and in love. May Lord Ganesha clear every obstacle from your path, and may this new year bring you closer to every dream you hold.

People wish for wealth on this night. I just wish for more days with your smile in them.

Thank you for being my favourite light, on Diwali and on every ordinary day.

Shubh Deepavali, my favourite person. ❤️`;

const diyaWishes = [
  "for your good health 🌿",
  "for your happiness, always 😊",
  "for every dream you're chasing ✨",
  "for peace in your heart 🕊️",
  "for success in all you do 🌟",
  "for your family's blessings 🏡",
  "and one for us ❤️"
];

let currentScreen = "welcome";
let typingTimer = null;
let hasTyped = false;
let rangoliStep = 0;
let litCount = 0;
let aartiTimers = [];
let fireworkInterval = null;

function showScreen(id) {
  screens.forEach((s) => s.classList.toggle("screen--active", s.id === id));
  currentScreen = id;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function makeSparkles(count = 40) {
  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement("span");
    dot.className = "sparkle";
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.animationDelay = `${Math.random() * 7}s`;
    dot.style.animationDuration = `${5 + Math.random() * 6}s`;
    $("sparkles").appendChild(dot);
  }
}

/* Generic particles: sparkles, coins, petals */
function spawnParticles(x, y, {
  count = 20, symbols = ["✦"], colors = ["#ffd58d"], spreadX = 140,
  dyMin = -220, dyMax = -80, size = [12, 24], duration = 1800, startSpread = 0
} = {}) {
  if (reduceMotion) count = Math.ceil(count / 3);
  for (let i = 0; i < count; i += 1) {
    const el = document.createElement("span");
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const s = size[0] + Math.random() * (size[1] - size[0]);
    el.className = "particle";
    if (symbol === "coin") {
      el.classList.add("particle--coin");
      el.style.width = `${s}px`;
      el.style.height = `${s}px`;
    } else {
      el.textContent = symbol;
      el.style.fontSize = `${s}px`;
      el.style.color = colors[Math.floor(Math.random() * colors.length)];
    }
    el.style.left = `${x + (Math.random() - .5) * startSpread}px`;
    el.style.top = `${y}px`;
    el.style.transition = `transform ${duration}ms cubic-bezier(.2,.6,.3,1), opacity ${duration}ms ease-in`;
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const dx = (Math.random() - .5) * spreadX;
      const dy = dyMin + Math.random() * (dyMax - dyMin);
      el.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.random() * 360 - 180}deg)`;
      el.style.opacity = "0";
    }));
    window.setTimeout(() => el.remove(), duration + 200);
  }
}

function burstHearts(amount = 18) {
  spawnParticles(window.innerWidth / 2, window.innerHeight, {
    count: amount, symbols: ["♡", "♥", "✧", "✦"], colors: ["#ffd58d", "#f2aaa2"],
    spreadX: 120, startSpread: window.innerWidth * .8, dyMin: -600, dyMax: -250, size: [14, 36], duration: 3200
  });
}

function petalShower() {
  spawnParticles(window.innerWidth / 2, -30, {
    count: 26, symbols: ["❀", "✿", "❁"], colors: ["#ffb02e", "#ff7b2e", "#ffd43b", "#f783ac"],
    spreadX: 160, startSpread: window.innerWidth, dyMin: window.innerHeight * .6, dyMax: window.innerHeight + 60,
    size: [14, 26], duration: 4200
  });
}

/* =========================================================
   1. Welcome
   ========================================================= */
$("beginBtn").addEventListener("click", () => showScreen("rangoli"));

/* =========================================================
   2. Rangoli — built in SVG, revealed one layer per tap
   ========================================================= */
const SVG_NS = "http://www.w3.org/2000/svg";
const rangoliSvg = $("rangoliSvg");

function svgEl(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

function petalRing(group, d, count, colors, offset = 0) {
  for (let i = 0; i < count; i += 1) {
    group.appendChild(svgEl("path", {
      d, fill: colors[i % colors.length], transform: `rotate(${offset + (360 / count) * i})`
    }));
  }
}

const rangoliLayers = [];
function buildRangoli() {
  const builders = [
    (g) => { // centre
      g.appendChild(svgEl("circle", { r: 15, fill: "#ffd43b" }));
      g.appendChild(svgEl("circle", { r: 8, fill: "#e64980" }));
      for (let i = 0; i < 8; i += 1) {
        const a = (Math.PI / 4) * i;
        g.appendChild(svgEl("circle", { cx: Math.cos(a) * 21, cy: Math.sin(a) * 21, r: 2.6, fill: "#fff4dc" }));
      }
    },
    (g) => petalRing(g, "M0 -16 C-13 -28 -12 -44 0 -54 C12 -44 13 -28 0 -16Z", 8, ["#e64980", "#f06595"]),
    (g) => petalRing(g, "M0 -22 C-17 -42 -15 -64 0 -78 C15 -64 17 -42 0 -22Z", 8, ["#ff922b", "#fd7e14"], 22.5),
    (g) => petalRing(g, "M0 -62 C-7 -71 -6 -83 0 -92 C6 -83 7 -71 0 -62Z", 16, ["#7950f2", "#22b8cf"]),
    (g) => {
      g.appendChild(svgEl("circle", { r: 100, fill: "none", stroke: "#fff4dc", "stroke-width": 4, "stroke-dasharray": "0.1 9", "stroke-linecap": "round" }));
      g.appendChild(svgEl("circle", { r: 106, fill: "none", stroke: "#f6c978", "stroke-width": 1.5 }));
      for (let i = 0; i < 8; i += 1) {
        const a = (Math.PI / 4) * i + Math.PI / 8;
        g.appendChild(svgEl("circle", { cx: Math.cos(a) * 100, cy: Math.sin(a) * 100, r: 6, fill: "#ffd43b", stroke: "#e8590c", "stroke-width": 2 }));
      }
    }
  ];
  const groups = builders.map((build) => {
    const g = svgEl("g", { class: "rangoli-layer" });
    build(g);
    return g;
  });
  /* outer layers sit underneath inner ones, so append in reverse */
  [...groups].reverse().forEach((g) => rangoliSvg.appendChild(g));
  rangoliLayers.push(...groups);
}

$("rangoliBtn").addEventListener("click", () => {
  if (rangoliStep >= rangoliLayers.length) return;
  rangoliLayers[rangoliStep].classList.add("is-on");
  rangoliStep += 1;
  const rect = $("rangoliBtn").getBoundingClientRect();
  spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, {
    count: 10, symbols: ["✦", "✧", "•"], colors: ["#ffd43b", "#f783ac", "#ff922b", "#74c0fc"], spreadX: rect.width, dyMin: -rect.height * .6, dyMax: rect.height * .4
  });
  if (rangoliStep < rangoliLayers.length) {
    $("rangoliHint").textContent = `Tap to add colour ✨ (${rangoliStep} / ${rangoliLayers.length})`;
  } else {
    $("rangoliBtn").classList.add("is-complete");
    $("rangoliHint").textContent = "Beautiful. Maa Lakshmi will love it. 🌸";
    $("diyasNext").classList.remove("is-hidden");
  }
});

$("diyasNext").addEventListener("click", () => showScreen("diyas"));

/* =========================================================
   3. Seven diyas — the whole page warms up as they are lit
   ========================================================= */
function buildDiyas() {
  diyaWishes.forEach((wish, i) => {
    const b = document.createElement("button");
    b.className = "mini-diya";
    b.setAttribute("aria-label", `Light diya ${i + 1}`);
    b.innerHTML = '<span class="mini-diya__halo"></span><span class="mini-diya__flame"></span><span class="mini-diya__bowl"></span>';
    b.addEventListener("click", () => {
      if (b.classList.contains("is-lit")) return;
      b.classList.add("is-lit");
      litCount += 1;
      document.documentElement.style.setProperty("--glow", (litCount / diyaWishes.length).toFixed(2));
      $("diyaWish").textContent = `This one is ${wish}`;
      const r = b.getBoundingClientRect();
      spawnParticles(r.left + r.width / 2, r.top + 20, { count: 8, colors: ["#ffd58d", "#ffb36b"], spreadX: 60, dyMin: -90, dyMax: -30, size: [8, 16], duration: 1200 });
      if (litCount === diyaWishes.length) {
        window.setTimeout(() => {
          $("diyaWish").textContent = "Every corner is glowing now. 🪔";
          $("doorsNext").classList.remove("is-hidden");
        }, 1400);
      }
    });
    $("diyaRow").appendChild(b);
  });
}

$("doorsNext").addEventListener("click", () => showScreen("pujan"));

/* =========================================================
   4. Lakshmi Pujan — open the doors, then aarti with a bell
   ========================================================= */
$("doorBtn").addEventListener("click", () => {
  const door = $("doorBtn");
  if (door.classList.contains("is-open")) return;
  door.classList.add("is-open");
  $("footprints").classList.add("is-walking");
  $("pujanHint").textContent = "Maa Lakshmi has entered your home. 🪷";
  const r = door.getBoundingClientRect();
  window.setTimeout(() => {
    spawnParticles(r.left + r.width / 2, r.top - 20, {
      count: 28, symbols: ["coin"], spreadX: 140, startSpread: r.width * 1.3,
      dyMin: 200, dyMax: r.height + 180, size: [12, 20], duration: 2400
    });
  }, 900);
  window.setTimeout(() => {
    $("mantra").classList.remove("is-hidden");
    $("aartiBtn").classList.remove("is-hidden");
  }, 2200);
});

/* A soft temple bell, synthesised so no audio file is needed */
let audioCtx = null;
function ringBell(when = 0) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const t = audioCtx.currentTime + when;
    [[1, .35], [2.76, .18], [5.4, .09], [8.93, .05]].forEach(([ratio, amp]) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = 620 * ratio;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(amp, t + .006);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.4 / ratio + .4);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 3);
    });
  } catch (e) { /* sound is optional */ }
}

$("aartiBtn").addEventListener("click", () => {
  $("aartiBtn").classList.add("is-hidden");
  $("shrineWrap").classList.add("is-aarti");
  $("pujanHint").textContent = "Om Jai Lakshmi Mata… 🔔";
  for (let i = 0; i < 9; i += 1) ringBell(i * .8);
  petalShower();
  aartiTimers.push(window.setTimeout(petalShower, 2400));
  aartiTimers.push(window.setTimeout(petalShower, 4800));
  aartiTimers.push(window.setTimeout(() => {
    $("shrineWrap").classList.remove("is-aarti");
    $("pujanHint").textContent = "May her blessings stay with you always. 🙏";
    $("letterNext").classList.remove("is-hidden");
  }, 7300));
});

/* =========================================================
   5. Letter
   ========================================================= */
function typeLetter() {
  const target = $("typedMessage");
  if (hasTyped) {
    target.textContent = messageText;
    $("finaleNext").classList.remove("is-hidden");
    return;
  }
  target.textContent = "";
  let index = 0;
  const tick = () => {
    target.textContent += messageText.charAt(index);
    index += 1;
    if (index < messageText.length) {
      typingTimer = window.setTimeout(tick, 24);
    } else {
      hasTyped = true;
      $("finaleNext").classList.remove("is-hidden");
    }
  };
  tick();
}

$("letterNext").addEventListener("click", () => {
  showScreen("letter");
  typeLetter();
});

/* =========================================================
   6. Fireworks finale — canvas, tap anywhere to launch
   ========================================================= */
const canvas = $("fireworks");
const ctx = canvas.getContext("2d");
const rockets = [];
const sparks = [];
const fireColors = ["#ffd43b", "#ff922b", "#f783ac", "#ff6b6b", "#74c0fc", "#b197fc", "#fff4dc", "#8ce99a"];
let fwRunning = false;

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function launchFirework(x, y) {
  rockets.push({ x, y: window.innerHeight + 10, ty: y, color: fireColors[Math.floor(Math.random() * fireColors.length)] });
  if (!fwRunning) { fwRunning = true; requestAnimationFrame(fireworkLoop); }
}

function explode(x, y, color) {
  const n = reduceMotion ? 24 : 70;
  const second = fireColors[Math.floor(Math.random() * fireColors.length)];
  for (let i = 0; i < n; i += 1) {
    const angle = (Math.PI * 2 * i) / n + Math.random() * .2;
    const speed = 1.2 + Math.random() * 3.6;
    sparks.push({
      x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      life: 1, decay: .011 + Math.random() * .012, size: 1.4 + Math.random() * 1.6,
      color: Math.random() > .3 ? color : second
    });
  }
}

function fireworkLoop() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (let i = rockets.length - 1; i >= 0; i -= 1) {
    const r = rockets[i];
    const prevY = r.y;
    r.y += (r.ty - r.y) * .075 - 2;
    ctx.strokeStyle = "rgba(255, 230, 180, .8)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(r.x, prevY + 12); ctx.lineTo(r.x, r.y); ctx.stroke();
    if (r.y <= r.ty + 4) { explode(r.x, r.y, r.color); rockets.splice(i, 1); }
  }
  for (let i = sparks.length - 1; i >= 0; i -= 1) {
    const s = sparks[i];
    s.vx *= .985; s.vy = s.vy * .985 + .035;
    s.x += s.vx; s.y += s.vy; s.life -= s.decay;
    if (s.life <= 0) { sparks.splice(i, 1); continue; }
    ctx.globalAlpha = Math.max(s.life, 0);
    ctx.fillStyle = s.color;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  if (rockets.length || sparks.length) requestAnimationFrame(fireworkLoop);
  else { fwRunning = false; ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
}

function randomFirework() {
  launchFirework(window.innerWidth * (.15 + Math.random() * .7), window.innerHeight * (.12 + Math.random() * .35));
}

$("finaleNext").addEventListener("click", () => {
  showScreen("finale");
  burstHearts(24);
  [0, 500, 1100].forEach((t) => window.setTimeout(randomFirework, t));
  fireworkInterval = window.setInterval(randomFirework, 2600);
});

document.addEventListener("click", (event) => {
  if (currentScreen !== "finale" || event.target.closest("button")) return;
  launchFirework(event.clientX, event.clientY);
});

/* =========================================================
   Replay — reset everything
   ========================================================= */
$("replayBtn").addEventListener("click", () => {
  window.clearInterval(fireworkInterval);
  aartiTimers.forEach(window.clearTimeout); aartiTimers = [];
  if (typingTimer) window.clearTimeout(typingTimer);
  hasTyped = false;
  $("typedMessage").textContent = "";
  $("finaleNext").classList.add("is-hidden");

  rangoliStep = 0;
  rangoliLayers.forEach((g) => g.classList.remove("is-on"));
  $("rangoliBtn").classList.remove("is-complete");
  $("rangoliHint").textContent = `Tap to add colour ✨ (0 / ${rangoliLayers.length})`;
  $("diyasNext").classList.add("is-hidden");

  litCount = 0;
  document.documentElement.style.setProperty("--glow", "0");
  document.querySelectorAll(".mini-diya").forEach((d) => d.classList.remove("is-lit"));
  $("diyaWish").textContent = "Tap a diya to light it ✨";
  $("doorsNext").classList.add("is-hidden");

  $("doorBtn").classList.remove("is-open");
  $("shrineWrap").classList.remove("is-aarti");
  $("footprints").classList.remove("is-walking");
  $("mantra").classList.add("is-hidden");
  $("aartiBtn").classList.add("is-hidden");
  $("letterNext").classList.add("is-hidden");
  $("pujanHint").textContent = "Tap the doors to welcome her 🙏";

  showScreen("welcome");
});

/* =========================================================
   Init
   ========================================================= */
makeSparkles();
buildRangoli();
buildDiyas();
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
