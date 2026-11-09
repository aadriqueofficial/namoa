import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, animate, useReducedMotion } from "framer-motion";
import { LOGO_URL } from "@/data/content";

const EASE = [0.16, 1, 0.3, 1];

// Timeline in seconds. The whole intro lasts TOTAL; the curtain starts lifting at REVEAL.
const TOTAL = 5;
const REVEAL = 4.2;

const TITLE = "NAMOA GROUP";
const NODES = 8;
const RING_R = 46; // in the 100x100 SVG viewBox

const nodePoint = (i) => {
  const a = (i / NODES) * Math.PI * 2 - Math.PI / 2;
  return { x: 50 + RING_R * Math.cos(a), y: 50 + RING_R * Math.sin(a) };
};

// Full-screen brand intro shown once per page load. Calls onReveal when the
// curtain starts lifting so the site can mount and animate in underneath it.
export const LaunchIntro = ({ onReveal, fadeIn = false }) => {
  const [visible, setVisible] = useState(true);
  const counterRef = useRef(null);
  const barRef = useRef(null);
  const revealed = useRef(false);
  const reduceMotion = useReducedMotion();

  const reveal = () => {
    if (revealed.current) return;
    revealed.current = true;
    onReveal?.();
    setVisible(false);
  };

  useEffect(() => {
    // Warm the hero map chunk while the intro plays.
    import("@/components/site/FreightNetwork").catch(() => {});

    const progress = animate(0, 100, {
      duration: REVEAL,
      ease: [0.4, 0, 0.6, 1],
      onUpdate: (v) => {
        if (counterRef.current) counterRef.current.textContent = String(Math.round(v)).padStart(3, "0");
        if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
      },
    });
    const t = setTimeout(reveal, REVEAL * 1000);
    return () => {
      progress.stop();
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="launch-intro"
          data-testid="launch-intro"
          role="status"
          aria-label="Loading NAMOA Group"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#FBFAF7]"
          // after the launch ceremony the intro opens as a circle from the centre of the stage
          initial={fadeIn ? { clipPath: "circle(0% at 50% 50%)" } : false}
          animate={{ clipPath: "circle(150% at 50% 50%)", transition: { duration: 1.1, ease: [0.65, 0, 0.35, 1] } }}
          exit={reduceMotion ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: TOTAL - REVEAL, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* faint grid, echoing the network theme */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.5] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(11,39,66,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(11,39,66,0.045) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />

          {/* emblem: network ring drawing around the logo */}
          <div className="relative w-[220px] h-[220px] md:w-[260px] md:h-[260px]">
            <motion.svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              aria-hidden
              initial={{ rotate: -90 }}
              animate={{ rotate: reduceMotion ? -90 : 0 }}
              transition={{ duration: 3.6, ease: EASE }}
            >
              {/* spokes to the centre */}
              {Array.from({ length: NODES }, (_, i) => {
                const p = nodePoint(i);
                return (
                  <motion.line
                    key={`s${i}`}
                    x1="50"
                    y1="50"
                    x2={p.x}
                    y2={p.y}
                    stroke="#0B2742"
                    strokeOpacity="0.08"
                    strokeWidth="0.3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, delay: 0.5 + i * 0.06, ease: EASE }}
                  />
                );
              })}
              <circle cx="50" cy="50" r={RING_R} fill="none" stroke="#0B2742" strokeOpacity="0.08" strokeWidth="0.4" />
              <motion.circle
                cx="50"
                cy="50"
                r={RING_R}
                fill="none"
                stroke="#C8A44D"
                strokeWidth="0.8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
              />
              {Array.from({ length: NODES }, (_, i) => {
                const p = nodePoint(i);
                return (
                  <motion.circle
                    key={`n${i}`}
                    cx={p.x}
                    cy={p.y}
                    r={i % 2 ? 1.1 : 1.6}
                    fill={i % 2 ? "#0B2742" : "#C8A44D"}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.25 + i * 0.16, ease: EASE }}
                    style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                  />
                );
              })}
            </motion.svg>

            <motion.img
              src={LOGO_URL}
              alt=""
              className="absolute inset-[16%] w-[68%] h-[68%] object-cover rounded-full mix-blend-multiply"
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.9, ease: EASE }}
            />
          </div>

          {/* wordmark */}
          <div className="relative mt-10 font-display font-extrabold text-[#0B2742] text-3xl md:text-5xl tracking-[0.16em] flex overflow-hidden">
            {TITLE.split("").map((ch, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.7 + i * 0.05, ease: EASE }}
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </div>

          <div className="relative mt-5 flex items-center gap-4">
            <motion.span
              className="h-px w-10 md:w-16 bg-[#C8A44D] origin-right"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 2.5, ease: EASE }}
            />
            <motion.span
              className="font-mono-brand text-[9.5px] md:text-[11px] tracking-[0.32em] text-[#687583] whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.7 }}
            >
              BUILDING BUSINESS ECOSYSTEMS
            </motion.span>
            <motion.span
              className="h-px w-10 md:w-16 bg-[#C8A44D] origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 2.5, ease: EASE }}
            />
          </div>

          {/* progress */}
          <div className="absolute bottom-10 left-6 right-6 md:left-14 md:right-14 flex items-end justify-between gap-6">
            <span className="font-mono-brand text-[10px] tracking-[0.3em] text-[#687583]">
              TRADE • LOGISTICS • CONSULTING
            </span>
            <span className="font-mono-brand text-[#0B2742] text-sm tracking-[0.2em] tabular-nums">
              <span ref={counterRef}>000</span>
              <span className="text-[#C8A44D]">%</span>
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0B2742]/8">
            <div ref={barRef} className="h-full bg-[#C8A44D] origin-left" style={{ transform: "scaleX(0)" }} />
          </div>

          <button
            type="button"
            onClick={reveal}
            data-testid="launch-intro-skip"
            className="absolute top-6 right-6 md:right-14 font-mono-brand text-[10px] tracking-[0.3em] text-[#687583] hover:text-[#0B2742] transition-colors"
          >
            SKIP
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LaunchIntro;
