import { useEffect, useRef } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import "./FreightNetwork.css";

const NS = "http://www.w3.org/2000/svg";
const ATLAS = `${process.env.PUBLIC_URL || ""}/countries-110m.json`;

const IND = "356"; // India — the network origin
const ATA = "010"; // Antarctica — dropped from the frame

const HOME = [78.9, 21.5];

const REGION_DEFS = [
  { k: "NORTH AMERICA", s: "USA, Canada, Mexico", c: [-98, 41], dx: -2, dy: 104 },
  { k: "EUROPE", s: "UK, Germany, Netherlands", c: [6, 50], dx: -16, dy: 88 },
  { k: "ASIA", s: "China, Japan, South Korea", c: [117, 34], dx: 24, dy: -58 },
  { k: "SOUTH AMERICA", s: "Brazil, Chile", c: [-57, -14], dx: -6, dy: 96 },
  { k: "AFRICA", s: "South Africa, Kenya", c: [24, -13], dx: -6, dy: 100 },
  { k: "AUSTRALIA", s: "Australia", c: [134, -26], dx: -48, dy: 62 },
  { k: "NEW ZEALAND", s: "New Zealand", c: [173, -41], dx: 14, dy: 60 },
];

// choreography (ms)
const T_DOTS = 1500;
const T_ARC0 = 1500;
const T_STAG = 280;
const T_DRAW = 1150;
const T_LEAD = 380;
const PULSE_EVERY = 1000;
const PULSE_DUR = 2100;
const GLOW = 78;
const CELL = 44;

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

const mk = (name, attrs) => {
  const el = document.createElementNS(NS, name);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
};

export default function FreightNetwork({ className = "", labelsFrom = 1024 }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const cv = canvasRef.current;
    const sv = svgRef.current;
    if (!stage || !cv || !sv) return undefined;

    const ctx = cv.getContext("2d");
    if (!ctx) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Per-mount state. REGION_DEFS is cloned so a remount never inherits
    // DOM nodes or measurements from a previous run.
    const regions = REGION_DEFS.map((r) => ({ ...r }));
    let world = null;
    let india = null;
    let proj = null;
    let W = 0;
    let H = 0;
    let dots = [];
    let maxD = 1;
    let cells = new Map();
    let base = null;
    let built = false;
    let t0 = 0;
    let raf = 0;
    let resizeTimer = 0;
    let cancelled = false;
    let pulses = [];
    let nextPulse = 0;
    let pulseIdx = 0;

    function arcPath(a, b, trimA, trimB) {
      // parabolic sweep, trimmed at both ends so it eases out of the origin
      // and stops cleanly at the destination node ring
      const p0 = proj(a);
      const p1 = proj(b);
      const mx = (p0[0] + p1[0]) / 2;
      const my = (p0[1] + p1[1]) / 2;
      const dx = p1[0] - p0[0];
      const dy = p1[1] - p0[1];
      const len = Math.hypot(dx, dy) || 1;
      let nx = dy / len;
      let ny = -dx / len;
      if (ny > 0) {
        nx = -nx;
        ny = -ny;
      }
      const k = Math.min(170, Math.max(40, len * 0.22));
      const q =
        "M" + p0[0].toFixed(1) + " " + p0[1].toFixed(1) +
        "Q" + (mx + nx * k).toFixed(1) + " " + (my + ny * k).toFixed(1) + " " +
        p1[0].toFixed(1) + " " + p1[1].toFixed(1);

      const tmp = mk("path", { d: q });
      sv.appendChild(tmp);
      const L = tmp.getTotalLength();
      const s0 = Math.min(trimA, L * 0.26);
      const s1 = Math.max(L - trimB, s0 + 2);
      let d = "";
      for (let i = 0; i <= 64; i++) {
        const p = tmp.getPointAtLength(s0 + ((s1 - s0) * i) / 64);
        d += (i ? "L" : "M") + p.x.toFixed(1) + " " + p.y.toFixed(1);
      }
      sv.removeChild(tmp);
      return d;
    }

    function buildSvg(home) {
      while (sv.firstChild) sv.removeChild(sv.firstChild);
      const defs = mk("defs", {});
      sv.appendChild(defs);
      // Below `lg` the hero stacks and the map sits behind the copy, so labels
      // are dropped there. Keyed to the viewport, not the stage: the stage is a
      // fraction of it, and a 1366px laptop still has room for labels.
      const compact = window.innerWidth < labelsFrom;
      // Threads converge on India itself; the gradient's soft 0.3-opacity head
      // does the work the hub ring used to, so only gold reads at the origin.
      const originTrim = 5;

      regions.forEach((r, i) => {
        const p = proj(r.c);
        r.p = p;
        const d = arcPath(HOME, r.c, originTrim, 11);

        const grad = mk("linearGradient", {
          id: "fnh-th" + i,
          gradientUnits: "userSpaceOnUse",
          x1: home[0], y1: home[1], x2: p[0], y2: p[1],
        });
        [
          ["0%", "#D9B978", "0.3"],
          ["28%", "#C79A3F", "1"],
          ["100%", "#A9781F", "1"],
        ].forEach((s) => {
          grad.appendChild(mk("stop", { offset: s[0], "stop-color": s[1], "stop-opacity": s[2] }));
        });
        defs.appendChild(grad);

        const glow = mk("path", {
          d, fill: "none", stroke: "rgba(201,158,63,.13)",
          "stroke-width": 3.6, "stroke-linecap": "round",
        });
        glow.style.opacity = 0;
        sv.appendChild(glow);
        r.glow = glow;

        const arc = mk("path", {
          d, fill: "none", stroke: "url(#fnh-th" + i + ")",
          "stroke-width": 1.15, "stroke-linecap": "round",
        });
        arc.style.opacity = 0;
        sv.appendChild(arc);
        r.arc = arc;
        r.len = arc.getTotalLength();

        const n = mk("g", {});
        n.style.opacity = 0;
        sv.appendChild(n);
        r.node = n;
        n.appendChild(mk("circle", { cx: p[0], cy: p[1], r: 10, fill: "none", stroke: "rgba(184,134,43,.28)", "stroke-width": 1 }));
        n.appendChild(mk("circle", { cx: p[0], cy: p[1], r: 4.2, fill: "#B8862B" }));
        const ring = mk("circle", { cx: p[0], cy: p[1], r: 10, fill: "none", stroke: "#C79A3F", "stroke-width": 1 });
        n.appendChild(ring);
        r.ring = ring;

        // On a narrow stage the map sits behind the hero copy, where region
        // labels would collide with it — keep the lanes as ambient texture only.
        if (compact) {
          r.lead = null;
          r.lab = null;
          return;
        }

        // leader + label, clamped inside the stage
        const lx = Math.max(14, Math.min(W - 176, p[0] + r.dx));
        const ly = p[1] + r.dy;
        const elbow = ly - (r.dy > 0 ? 30 : -14);
        const lead = mk("path", {
          d: "M" + p[0] + " " + p[1] + "L" + p[0] + " " + elbow + "L" + (lx + 2) + " " + elbow,
          fill: "none", stroke: "#CFC3A4", "stroke-width": 1, "stroke-dasharray": "2 3",
        });
        lead.style.opacity = 0;
        sv.appendChild(lead);
        r.lead = lead;

        const lab = mk("g", {});
        lab.style.opacity = 0;
        sv.appendChild(lab);
        r.lab = lab;
        const t1 = mk("text", {
          x: lx, y: ly, fill: "#17150F", "font-size": 11, "letter-spacing": 2.1,
          "font-family": "IBM Plex Mono, monospace", "font-weight": 500,
        });
        t1.textContent = r.k;
        lab.appendChild(t1);
        const t2 = mk("text", {
          x: lx, y: ly + 16, fill: "#938D7C", "font-size": 11.5,
          "font-family": "Helvetica Neue, Helvetica, Arial, sans-serif",
        });
        t2.textContent = r.s;
        lab.appendChild(t2);
      });

      pulses = [];
    }

    function build() {
      if (!world) return;
      const b = stage.getBoundingClientRect();
      W = Math.max(360, Math.round(b.width));
      H = Math.max(300, Math.round(b.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sv.setAttribute("viewBox", "0 0 " + W + " " + H);

      // whole world framed inside the stage (Antarctica dropped)
      proj = geoNaturalEarth1()
        .rotate([-22, 0])
        .fitExtent([[W * 0.035, H * 0.055], [W * 0.965, H * 0.945]], world);

      // dot matrix sampled from real Natural Earth geometry; India sampled separately
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const octx = off.getContext("2d");
      octx.fillStyle = "#000";
      octx.beginPath();
      geoPath(proj, octx)(world);
      octx.fill();
      const land = octx.getImageData(0, 0, W, H).data;

      const off2 = document.createElement("canvas");
      off2.width = W;
      off2.height = H;
      const o2 = off2.getContext("2d");
      o2.fillStyle = "#000";
      o2.beginPath();
      geoPath(proj, o2)(india);
      o2.fill();
      const ind = o2.getImageData(0, 0, W, H).data;

      const step = W > 1200 ? 7 : 6;
      const home = proj(HOME);
      dots = [];
      cells = new Map();
      maxD = 1;
      for (let y = step; y < H - 1; y += step) {
        for (let x = step; x < W - 1; x += step) {
          const i = ((y | 0) * W + (x | 0)) * 4 + 3;
          if (land[i] > 96) {
            const d = { x, y, in: ind[i] > 96, d: Math.hypot(x - home[0], y - home[1]) };
            dots.push(d);
            if (d.d > maxD) maxD = d.d;
            const key = ((x / CELL) | 0) + ":" + ((y / CELL) | 0);
            let bucket = cells.get(key);
            if (!bucket) {
              bucket = [];
              cells.set(key, bucket);
            }
            bucket.push(d);
          }
        }
      }

      // pre-render the static globe once; every frame just blits it
      base = document.createElement("canvas");
      base.width = W * dpr;
      base.height = H * dpr;
      const bc = base.getContext("2d");
      bc.setTransform(dpr, 0, 0, dpr, 0, 0);
      const r0 = Math.max(90, W * 0.085);
      const glow = bc.createRadialGradient(home[0], home[1], 0, home[0], home[1], r0);
      glow.addColorStop(0, "rgba(201,158,63,.20)");
      glow.addColorStop(1, "rgba(201,158,63,0)");
      bc.fillStyle = glow;
      bc.beginPath();
      bc.arc(home[0], home[1], r0, 0, 6.2832);
      bc.fill();
      for (const d of dots) {
        bc.fillStyle = d.in ? "#C79A3F" : "#DDD7C6";
        bc.beginPath();
        bc.arc(d.x, d.y, d.in ? 1.65 : 1.25, 0, 6.2832);
        bc.fill();
      }

      buildSvg(home);
      built = true;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(base, 0, 0, W, H);
    }

    function bloom(x, y, a) {
      const rg = ctx.createRadialGradient(x, y, 0, x, y, GLOW);
      rg.addColorStop(0, "rgba(200,157,63," + (0.2 * a).toFixed(3) + ")");
      rg.addColorStop(1, "rgba(200,157,63,0)");
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(x, y, GLOW, 0, 6.2832);
      ctx.fill();

      // relight only the dots inside the bloom radius, via the spatial grid
      const cx = (x / CELL) | 0;
      const cy = (y / CELL) | 0;
      for (let ox = -2; ox <= 2; ox++) {
        for (let oy = -2; oy <= 2; oy++) {
          const arr = cells.get(cx + ox + ":" + (cy + oy));
          if (!arr) continue;
          for (const d of arr) {
            const dist = Math.hypot(d.x - x, d.y - y);
            if (dist > GLOW) continue;
            const k = (1 - dist / GLOW) * a;
            ctx.fillStyle = "rgba(184,134,43," + (0.22 + 0.7 * k).toFixed(3) + ")";
            ctx.beginPath();
            ctx.arc(d.x, d.y, 1.3 + 1.5 * k * k, 0, 6.2832);
            ctx.fill();
          }
        }
      }

      // solid gold bead — nothing white reads anywhere on the network
      ctx.fillStyle = "#C79A3F";
      ctx.beginPath();
      ctx.arc(x, y, 3.4, 0, 6.2832);
      ctx.fill();
      ctx.strokeStyle = "#B8862B";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(x, y, 3.4, 0, 6.2832);
      ctx.stroke();
    }

    function frame(ts) {
      if (!t0) t0 = ts;
      const t = reduced ? 99999 : ts - t0;

      if (built) {
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(base, 0, 0, W, H);

        // dots bloom outward from India
        if (t < T_DOTS) {
          const p = easeOut(t / T_DOTS);
          const rad = p * maxD * 1.15;
          const home = proj(HOME);
          ctx.globalCompositeOperation = "destination-in";
          const g = ctx.createRadialGradient(home[0], home[1], Math.max(0, rad - 90), home[0], home[1], rad);
          g.addColorStop(0, "rgba(0,0,0,1)");
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);
          ctx.globalCompositeOperation = "source-over";
        }

        regions.forEach((r, i) => {
          const st = t - (T_ARC0 + i * T_STAG);
          if (st < 0) return;
          const dp = Math.min(1, st / T_DRAW);
          const dq = easeOut(dp);
          r.arc.style.opacity = 0.95;
          r.glow.style.opacity = 1;
          r.arc.setAttribute("stroke-dasharray", r.len);
          r.arc.setAttribute("stroke-dashoffset", (r.len * (1 - dq)).toFixed(1));
          r.glow.setAttribute("stroke-dasharray", r.len);
          r.glow.setAttribute("stroke-dashoffset", (r.len * (1 - dq)).toFixed(1));

          if (dp < 1) {
            const pt = r.arc.getPointAtLength(dq * r.len);
            bloom(pt.x, pt.y, 1);
            return;
          }

          const after = st - T_DRAW;
          r.node.style.opacity = Math.min(1, after / 240);
          const rp = (after % 3600) / 3600;
          r.ring.setAttribute("r", (10 + rp * 9).toFixed(1));
          r.ring.style.opacity = (0.55 * (1 - rp)).toFixed(2);
          if (r.lead) r.lead.style.opacity = Math.min(1, Math.max(0, (after - 160) / T_LEAD));
          if (r.lab) r.lab.style.opacity = Math.min(1, Math.max(0, (after - 320) / 420));
        });

        // ambient shipment pulses along the established lanes
        const settled = T_ARC0 + regions.length * T_STAG + T_DRAW + 500;
        if (!reduced && t > settled) {
          if (t > nextPulse) {
            nextPulse = t + PULSE_EVERY;
            pulses.push({ i: pulseIdx % regions.length, t0: t });
            pulseIdx++;
          }
          for (let n = pulses.length - 1; n >= 0; n--) {
            const pu = pulses[n];
            const k = (t - pu.t0) / PULSE_DUR;
            if (k >= 1) {
              pulses.splice(n, 1);
              continue;
            }
            const r = regions[pu.i];
            const pt = r.arc.getPointAtLength(easeOut(k) * r.len);
            const fade = k < 0.12 ? k / 0.12 : k > 0.88 ? (1 - k) / 0.12 : 1;
            bloom(pt.x, pt.y, fade);
          }
        }
      }

      raf = requestAnimationFrame(frame);
    }

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (cancelled) return;
        t0 = 0;
        nextPulse = 0;
        pulseIdx = 0;
        build();
      }, 220);
    };
    window.addEventListener("resize", onResize);

    fetch(ATLAS)
      .then((r) => r.json())
      .then((topo) => {
        if (cancelled) return;
        world = feature(topo, topo.objects.countries);
        world.features = world.features.filter((f) => String(f.id) !== ATA);
        india = world.features.filter((f) => String(f.id) === IND)[0] || world.features[0];
        build();
        raf = requestAnimationFrame(frame);
      })
      .catch(() => {
        if (!cancelled) stage.style.display = "none";
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      while (sv.firstChild) sv.removeChild(sv.firstChild);
    };
  }, [labelsFrom]);

  return (
    <div ref={stageRef} data-testid="freight-network" className={`fnh-stage ${className}`}>
      <canvas ref={canvasRef} />
      <svg ref={svgRef} preserveAspectRatio="none" />
    </div>
  );
}
