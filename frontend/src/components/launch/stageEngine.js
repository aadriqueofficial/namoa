// Canvas effects for the /launch ceremony, all drawn in one requestAnimationFrame loop:
// a drifting gold network, countdown shockwaves, and the ignition (flash, shake,
// rockets, firework bursts, confetti).

const GOLDS = ["#C8A44D", "#E9D49A", "#F5EEDB", "#FFFFFF", "#B48C2E", "#FFE8A3"];
const CONFETTI = ["#C8A44D", "#E9D49A", "#B48C2E", "#F5EEDB", "#FFFFFF", "#174E73"];
const MAX_SPARKS = 2200;

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];

export function createStage(canvas, { shakeEl, onPop } = {}) {
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0;
  let H = 0;

  const nodes = [];
  const waves = [];
  const sparks = [];
  const rockets = [];
  const confetti = [];
  const timers = [];
  let flash = 0;
  let shake = 0;
  let pull = 0; // 0 = free drift, higher = nodes drawn into the centre
  let raf = 0;
  let last = performance.now();

  const seedNodes = () => {
    nodes.length = 0;
    const count = Math.min(110, Math.round((W * H) / 16000));
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: rand(-0.25, 0.25),
        vy: rand(-0.25, 0.25),
        r: rand(0.8, 2),
        gold: Math.random() < 0.35,
      });
    }
  };

  const resize = () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!nodes.length) seedNodes();
  };
  resize();
  window.addEventListener("resize", resize);

  const later = (ms, fn) => timers.push(setTimeout(fn, ms));

  const wave = (opts = {}) =>
    waves.push({ r: opts.r0 ?? 20, speed: opts.speed ?? 9, life: 1, decay: opts.decay ?? 0.012, width: opts.width ?? 2, color: opts.color ?? "200,164,77" });

  const burst = (x, y, { count = 120, speed = 7, shape = "sphere", colors = GOLDS } = {}) => {
    const n = Math.min(count, MAX_SPARKS - sparks.length);
    const base = pick(colors);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rand(-0.05, 0.05);
      let v;
      if (shape === "ring") v = speed * rand(0.92, 1);
      else if (shape === "double") v = speed * (i % 2 ? 1 : 0.55) * rand(0.92, 1);
      else v = speed * Math.cbrt(Math.random());
      sparks.push({
        x,
        y,
        px: x,
        py: y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        life: 1,
        decay: rand(0.008, 0.016),
        w: rand(1, 2.4),
        color: Math.random() < 0.7 ? base : pick(colors),
        twinkle: Math.random() < 0.3,
      });
    }
  };

  const rocket = () => {
    const x = rand(W * 0.12, W * 0.88);
    rockets.push({
      x,
      y: H + 10,
      vx: rand(-1.2, 1.2),
      vy: -Math.sqrt(2 * 0.16 * rand(0.5, 0.82) * H), // apex lands 18-50% down the screen
      color: pick(GOLDS),
    });
  };

  const rainConfetti = (count) => {
    for (let i = 0; i < count; i++) {
      confetti.push({
        x: rand(0, W),
        y: rand(-H * 0.6, -10),
        vx: rand(-1, 1),
        vy: rand(1.5, 3.5),
        w: rand(6, 12),
        h: rand(3, 6),
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.15, 0.15),
        sway: rand(0, Math.PI * 2),
        color: pick(CONFETTI),
        life: 1,
      });
    }
  };

  const frame = (now) => {
    const dt = Math.min(2.5, (now - last) / 16.67); // 1 = one 60fps frame
    last = now;
    const cx = W / 2;
    const cy = H / 2;

    ctx.clearRect(0, 0, W, H);

    // network
    for (const n of nodes) {
      if (pull > 0) {
        const dx = cx - n.x;
        const dy = cy - n.y;
        const d = Math.hypot(dx, dy) || 1;
        // pull in plus a tangential swirl, so the network spirals toward the button
        n.vx += ((dx / d) * 0.06 + (-dy / d) * 0.05) * pull * dt;
        n.vy += ((dy / d) * 0.06 + (dx / d) * 0.05) * pull * dt;
        n.vx *= 0.96;
        n.vy *= 0.96;
      } else {
        n.vx *= 0.985;
        n.vy *= 0.985;
        n.vx += rand(-0.01, 0.01);
        n.vy += rand(-0.01, 0.01);
      }
      n.x += n.vx * dt;
      n.y += n.vy * dt;
      if (n.x < -20) n.x = W + 20;
      if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20;
      if (n.y > H + 20) n.y = -20;
    }
    const linkDist = Math.min(150, W * 0.12);
    ctx.lineWidth = 0.6;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < linkDist * linkDist) {
          const alpha = (1 - Math.sqrt(d2) / linkDist) * 0.22;
          ctx.strokeStyle = `rgba(200,164,77,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      ctx.fillStyle = n.gold ? "rgba(200,164,77,0.85)" : "rgba(255,255,255,0.45)";
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "lighter";

    // shockwaves
    for (let i = waves.length - 1; i >= 0; i--) {
      const w = waves[i];
      w.r += w.speed * dt;
      w.speed *= 0.985;
      w.life -= w.decay * dt;
      if (w.life <= 0) {
        waves.splice(i, 1);
        continue;
      }
      ctx.strokeStyle = `rgba(${w.color},${w.life * 0.8})`;
      ctx.lineWidth = w.width * (0.5 + w.life);
      ctx.beginPath();
      ctx.arc(cx, cy, w.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // rockets, with a short spark trail; they burst at the top of their climb
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.vy += 0.16 * dt;
      r.x += r.vx * dt;
      r.y += r.vy * dt;
      if (sparks.length < MAX_SPARKS)
        sparks.push({ x: r.x, y: r.y, px: r.x, py: r.y, vx: rand(-0.4, 0.4), vy: rand(0.5, 1.5), life: 0.7, decay: 0.04, w: 1.4, color: "#FFE8A3" });
      if (r.vy >= -1) {
        rockets.splice(i, 1);
        burst(r.x, r.y, { count: rand(110, 170), speed: rand(5.5, 8.5), shape: pick(["sphere", "sphere", "ring", "double"]) });
        onPop?.();
      }
    }

    // sparks drawn as short streaks for a motion-blur look
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.px = s.x;
      s.py = s.y;
      s.vx *= 0.975;
      s.vy = s.vy * 0.975 + 0.06 * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.life -= s.decay * dt;
      if (s.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }
      const alpha = s.twinkle && Math.random() < 0.3 ? s.life * 0.3 : s.life;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.w;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(s.px - s.vx * 1.5, s.py - s.vy * 1.5);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    // confetti
    for (let i = confetti.length - 1; i >= 0; i--) {
      const c = confetti[i];
      c.sway += 0.05 * dt;
      c.x += (c.vx + Math.sin(c.sway) * 0.8) * dt;
      c.y += c.vy * dt;
      c.rot += c.vr * dt;
      if (c.y > H + 20) {
        confetti.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      ctx.scale(1, Math.cos(c.sway * 2)); // flip as it tumbles
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();
    }

    // ignition flash
    if (flash > 0.01) {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.75);
      g.addColorStop(0, `rgba(255,250,235,${flash})`);
      g.addColorStop(0.35, `rgba(240,205,120,${flash * 0.75})`);
      g.addColorStop(1, `rgba(200,164,77,${flash * 0.2})`);
      ctx.globalCompositeOperation = "lighter"; // add light, so the flash brightens rather than greys the navy
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
      flash *= Math.pow(0.93, dt);
    }

    if (shakeEl) {
      if (shake > 0.3) {
        shakeEl.style.transform = `translate3d(${rand(-shake, shake)}px, ${rand(-shake, shake)}px, 0)`;
        shake *= Math.pow(0.9, dt);
      } else if (shake) {
        shake = 0;
        shakeEl.style.transform = "";
      }
    }

    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return {
    // Button pressed: the network starts spiralling in.
    charge() {
      pull = 0.6;
      wave({ speed: 4, decay: 0.02, width: 1.5 });
    },
    // One countdown beat; level rises 1..3 as the count falls.
    beat(level) {
      pull = 0.6 + level * 0.45;
      shake = 2 + level * 2.5;
      wave({ speed: 7 + level * 2, decay: 0.014, width: 2 + level });
      later(110, () => wave({ speed: 5 + level, decay: 0.02, width: 1, color: "255,255,255" }));
    },
    ignite() {
      pull = 0;
      flash = 1;
      shake = 22;
      // fling the network outward
      const cx = W / 2;
      const cy = H / 2;
      for (const n of nodes) {
        const dx = n.x - cx;
        const dy = n.y - cy;
        const d = Math.hypot(dx, dy) || 1;
        const v = rand(8, 18);
        n.vx = (dx / d) * v;
        n.vy = (dy / d) * v;
      }
      wave({ speed: 22, decay: 0.008, width: 6 });
      later(90, () => wave({ speed: 17, decay: 0.009, width: 3, color: "255,255,255" }));
      later(220, () => wave({ speed: 12, decay: 0.011, width: 2 }));
      burst(cx, cy, { count: 360, speed: 15 });
      later(140, () => burst(cx, cy, { count: 200, speed: 9, shape: "ring" }));
      rainConfetti(Math.min(220, Math.round(W / 6)));
      [350, 650, 900, 1200, 1450, 1750, 2000, 2300, 2600, 2900, 3200, 3600].forEach((t) => later(t, rocket));
      later(1600, () => rainConfetti(Math.min(120, Math.round(W / 12))));
    },
    destroy() {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", resize);
      if (shakeEl) shakeEl.style.transform = "";
    },
  };
}
