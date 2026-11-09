import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Maximize2, Minimize2, Volume2, VolumeX } from "lucide-react";
import { LOGO_URL } from "@/data/content";
import { createStage } from "@/components/launch/stageEngine";
import { createLaunchSound } from "@/components/launch/launchSound";

const EASE = [0.16, 1, 0.3, 1];
const COUNT_FROM = 3;
const CHARGE_MS = 900;
const CELEBRATE_MS = 4500;

const SLAM = {
  initial: { opacity: 0, scale: 2.4, filter: "blur(14px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
};

// Grand launch ceremony: ready -> charging -> countdown -> live, then
// `onLaunched` opens the brand intro, which hands over to the live site.
export default function Launch({ onLaunched }) {
  const [stage, setStage] = useState("ready");
  const [count, setCount] = useState(COUNT_FROM);
  const [fullscreen, setFullscreen] = useState(false);
  const [muted, setMuted] = useState(false);
  const reduceMotion = useReducedMotion();

  const canvasRef = useRef(null);
  const shakeRef = useRef(null);
  const fx = useRef(null);
  const sound = useRef(null);

  // One canvas engine and one sound engine for the page's lifetime.
  useEffect(() => {
    sound.current = createLaunchSound();
    if (!reduceMotion) {
      fx.current = createStage(canvasRef.current, {
        shakeEl: shakeRef.current,
        onPop: () => sound.current?.pop(),
      });
    }
    return () => {
      fx.current?.destroy();
      fx.current = null;
      sound.current?.destroy();
      sound.current = null;
    };
  }, [reduceMotion]);

  const launched = useRef(false);
  const launch = useCallback(() => {
    if (launched.current) return;
    launched.current = true;
    sound.current?.unlock(); // must run inside the click / key press
    sound.current?.charge();
    fx.current?.charge();
    setStage("charging");
  }, []);

  // Keyboard and presentation clickers (which send arrow / page keys) can trigger the launch.
  useEffect(() => {
    const onKey = (e) => {
      if (["Enter", " ", "ArrowRight", "PageDown"].includes(e.key)) {
        e.preventDefault();
        launch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [launch]);

  useEffect(() => {
    if (stage !== "charging") return;
    const t = setTimeout(() => {
      sound.current?.riser(COUNT_FROM);
      setStage("countdown");
    }, CHARGE_MS);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (stage !== "countdown") return;
    if (count === 0) {
      fx.current?.ignite();
      sound.current?.boom();
      setStage("live");
      return;
    }
    const level = COUNT_FROM + 1 - count; // 1, 2, 3 as the count falls
    fx.current?.beat(level);
    sound.current?.beat(level);
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [stage, count]);

  useEffect(() => {
    if (stage !== "live") return;
    const t = setTimeout(() => onLaunched?.(), CELEBRATE_MS);
    return () => clearTimeout(t);
  }, [stage, onLaunched]);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = (e) => {
    e.currentTarget.blur(); // keep Enter/Space free for the launch
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };

  const toggleSound = (e) => {
    e.currentTarget.blur();
    sound.current?.setMuted(!muted);
    setMuted(!muted);
  };

  return (
    <main
      data-testid="launch-page"
      className="fixed inset-0 overflow-hidden bg-[#06182A] text-white select-none"
    >
      <div ref={shakeRef} className="absolute inset-0 flex flex-col items-center justify-center will-change-transform">
        {/* backdrop glow; it brightens as the countdown builds */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 55%, rgba(23,78,115,0.6) 0%, rgba(6,24,42,0) 60%), radial-gradient(circle at 50% 50%, rgba(200,164,77,0.16) 0%, rgba(200,164,77,0) 38%)",
          }}
          animate={{ opacity: stage === "countdown" ? 1 : 0.75, scale: stage === "countdown" ? 1.15 : 1 }}
          transition={{ duration: 1.2 }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* header */}
        <motion.div
          className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 md:px-14 h-[84px]"
          animate={{ opacity: stage === "ready" || stage === "live" ? 1 : 0.25 }}
        >
          <div className="flex items-center gap-3">
            <span className="block h-11 w-11 rounded-full overflow-hidden bg-white ring-1 ring-[#C8A44D]/60">
              <img src={LOGO_URL} alt="" className="h-full w-full object-cover" />
            </span>
            <span className="font-display font-extrabold tracking-[0.14em] text-[15px]">NAMOA GROUP</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={toggleSound}
              data-testid="launch-sound"
              className="flex items-center gap-2 font-mono-brand text-[10px] tracking-[0.3em] text-white/55 hover:text-[#C8A44D] transition-colors"
            >
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span className="hidden sm:inline">{muted ? "SOUND OFF" : "SOUND ON"}</span>
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              data-testid="launch-fullscreen"
              className="flex items-center gap-2 font-mono-brand text-[10px] tracking-[0.3em] text-white/55 hover:text-[#C8A44D] transition-colors"
            >
              {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              <span className="hidden sm:inline">{fullscreen ? "EXIT FULLSCREEN" : "FULLSCREEN"}</span>
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {stage === "ready" && (
            <motion.div
              key="ready"
              className="relative flex flex-col items-center text-center px-6"
              exit={{ opacity: 0, scale: 0.6, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: [0.7, 0, 0.84, 0] }}
            >
              <motion.div
                className="flex items-center gap-4 mb-6"
                initial={{ opacity: 0, letterSpacing: "0.1em" }}
                animate={{ opacity: 1, letterSpacing: "0.4em" }}
                transition={{ duration: 1.4, ease: EASE }}
              >
                <span className="h-px w-10 md:w-16 bg-[#C8A44D]" />
                <span className="font-mono-brand text-[10px] md:text-[11px] tracking-[0.4em] text-[#C8A44D]">
                  OFFICIAL WEBSITE
                </span>
                <span className="h-px w-10 md:w-16 bg-[#C8A44D]" />
              </motion.div>
              <h1 className="font-display font-extrabold uppercase leading-[0.95] text-5xl md:text-7xl lg:text-8xl">
                <span className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
                  >
                    The Grand
                  </motion.span>
                </span>
                <span className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className="block launch-shine"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
                  >
                    Launch
                  </motion.span>
                </span>
              </h1>
              <motion.p
                className="font-mono-brand text-[10px] md:text-xs tracking-[0.32em] text-white/55 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
              >
                BUILDING BUSINESS ECOSYSTEMS
              </motion.p>

              <motion.div
                className="relative mt-12 md:mt-14 h-44 w-44 md:h-52 md:w-52"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.1, ease: EASE }}
              >
                {/* orbit rings */}
                <svg viewBox="0 0 100 100" className="absolute -inset-[22%] w-[144%] h-[144%] launch-orbit" aria-hidden>
                  <circle cx="50" cy="50" r="48" fill="none" stroke="#C8A44D" strokeOpacity="0.45" strokeWidth="0.35" strokeDasharray="1 3" />
                  <circle cx="50" cy="2" r="1.1" fill="#E9D49A" />
                </svg>
                <svg viewBox="0 0 100 100" className="absolute -inset-[10%] w-[120%] h-[120%] launch-orbit-rev" aria-hidden>
                  <circle cx="50" cy="50" r="48" fill="none" stroke="#C8A44D" strokeOpacity="0.6" strokeWidth="0.5" strokeDasharray="30 10 4 10" />
                </svg>
                <span aria-hidden className="pulse-ring absolute inset-0 rounded-full border border-[#C8A44D]/60" />
                <span
                  aria-hidden
                  className="pulse-ring absolute inset-0 rounded-full border border-[#C8A44D]/40"
                  style={{ animationDelay: "1.2s" }}
                />
                <motion.button
                  type="button"
                  onClick={launch}
                  data-testid="launch-button"
                  className="launch-breathe relative h-full w-full rounded-full text-[#081D30] font-display font-extrabold text-xl md:text-2xl tracking-[0.22em] pl-[0.22em] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F5EEDB]/60"
                  style={{ background: "radial-gradient(circle at 35% 28%, #FBEBB8 0%, #D9B860 38%, #C8A44D 60%, #9C7A2C 100%)" }}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.9 }}
                >
                  LAUNCH
                </motion.button>
              </motion.div>
              <motion.p
                className="font-mono-brand text-[9.5px] tracking-[0.3em] text-white/35 mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 1 }}
              >
                PRESS THE BUTTON TO GO LIVE
              </motion.p>
            </motion.div>
          )}

          {stage === "countdown" && (
            <motion.div
              key="countdown"
              className="relative flex items-center justify-center h-72 w-72 md:h-96 md:w-96"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 2.2, filter: "blur(8px)" }}
              transition={{ duration: 0.35 }}
            >
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90" aria-hidden>
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
                <motion.circle
                  key={count}
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="#C8A44D"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 2px rgba(232,200,120,0.9))" }}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </svg>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={count}
                  className="font-display font-extrabold leading-none text-white"
                  style={{
                    fontSize: `${8 + (COUNT_FROM - count) * 1.6}rem`,
                    textShadow: "0 0 40px rgba(200,164,77,0.65), 0 0 90px rgba(200,164,77,0.35)",
                  }}
                  initial={{ opacity: 0, scale: 2.2, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.4, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  {count}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          )}

          {stage === "live" && (
            <motion.div key="live" className="relative flex flex-col items-center text-center px-6">
              <motion.span
                className="block h-24 w-24 md:h-28 md:w-28 rounded-full overflow-hidden bg-white ring-2 ring-[#C8A44D] shadow-[0_0_60px_rgba(200,164,77,0.6)] mb-8"
                initial={{ opacity: 0, scale: 0, rotate: -120 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.75 }}
              >
                <img src={LOGO_URL} alt="" className="h-full w-full object-cover" />
              </motion.span>
              <h2 className="font-display font-extrabold uppercase leading-[0.95] text-6xl md:text-8xl lg:text-9xl flex flex-wrap justify-center gap-x-[0.25em]">
                <motion.span {...SLAM} transition={{ duration: 0.55, delay: 0.1, ease: EASE }}>
                  We
                </motion.span>
                <motion.span {...SLAM} transition={{ duration: 0.55, delay: 0.25, ease: EASE }}>
                  Are
                </motion.span>
                <motion.span
                  className="launch-shine"
                  {...SLAM}
                  transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
                >
                  Live
                </motion.span>
              </h2>
              <motion.span
                className="block h-px w-48 md:w-80 bg-gradient-to-r from-transparent via-[#C8A44D] to-transparent mt-8"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 1, ease: EASE }}
              />
              <motion.p
                className="font-mono-brand text-[10px] md:text-xs tracking-[0.4em] text-white/70 mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 1.3 }}
              >
                WELCOME TO THE NEW NAMOA GROUP
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p aria-live="polite" className="sr-only">
        {stage === "countdown" ? `${count}` : stage === "live" ? "The website is now live" : ""}
      </p>
    </main>
  );
}
