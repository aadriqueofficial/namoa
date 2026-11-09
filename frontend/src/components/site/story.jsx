import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { LineReveal } from "@/components/site/Reveal";
import { getLenis } from "@/lib/scroll";

const EASE = [0.16, 1, 0.3, 1];

const scrollDown = () => {
  const lenis = getLenis();
  const y = window.scrollY + window.innerHeight * 1.35;
  if (lenis) lenis.scrollTo(y, { duration: 1.6 });
  else window.scrollTo({ top: y, behavior: "smooth" });
};

export const StoryIntro = ({ active, num, eyebrow, lines, copy, cta, testId }) => (
  <motion.div
    className="absolute inset-0 z-20 flex items-center"
    animate={{ opacity: active ? 1 : 0, y: active ? 0 : -50 }}
    transition={{ duration: 0.7, ease: EASE }}
    style={{ pointerEvents: active ? "auto" : "none" }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 via-40% to-transparent pointer-events-none" />
    <div className="relative px-6 md:px-14 lg:px-24 max-w-4xl">
      <motion.div
        className="flex items-center gap-4 mb-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.15 }}
      >
        <span className="font-mono-brand text-[11px] tracking-[0.28em] text-[#687583]">{num}</span>
        <span className="h-px w-10 bg-[#C8A44D]" />
        <span className="eyebrow">{eyebrow}</span>
      </motion.div>
      <h1 className="font-display display-hero text-[#0B2742] uppercase">
        <LineReveal lines={lines} delay={0.25} />
      </h1>
      <motion.p
        className="text-[#687583] text-base md:text-lg leading-relaxed max-w-xl mt-7"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
      >
        {copy}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.95, ease: EASE }}
        className="mt-9"
      >
        <button data-testid={testId} onClick={scrollDown} className="btn-navy">
          {cta} <ArrowRight size={15} />
        </button>
      </motion.div>
    </div>

    <motion.button
      onClick={scrollDown}
      data-testid="story-scroll-indicator"
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 1 }}
    >
      <span className="font-mono-brand text-[9.5px] tracking-[0.35em] text-[#687583]">SCROLL</span>
      <span className="block w-px h-12 bg-[#0B2742]/15 relative overflow-hidden">
        <span className="scroll-line absolute inset-0 bg-[#C8A44D]" />
      </span>
    </motion.button>
  </motion.div>
);

export const StageCaption = ({ active, index, title, body, sub }) => (
  <motion.div
    className="absolute left-6 md:left-14 lg:left-24 bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-20 max-w-[320px] md:max-w-sm pointer-events-none"
    animate={{ opacity: active ? 1 : 0, y: active ? 0 : 34 }}
    transition={{ duration: 0.65, ease: EASE }}
  >
    <div className="font-mono-brand text-[11px] tracking-[0.3em] text-[#C8A44D] mb-4">{index}</div>
    <h3 className="font-display display-stage text-[#0B2742] uppercase">{title}</h3>
    <div className="gold-rule my-5" style={{ transform: active ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s" }} />
    <p className="text-[#687583] text-sm md:text-[15px] leading-relaxed">{body}</p>
    {sub && (
      <p className="font-mono-brand text-[10px] tracking-[0.22em] text-[#0B2742]/60 mt-5 uppercase">{sub}</p>
    )}
  </motion.div>
);

export const FinalStatement = ({ active, title, body }) => (
  <motion.div
    className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
    animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.96 }}
    transition={{ duration: 0.8, ease: EASE }}
  >
    <div className="absolute w-[70vw] h-[55vh] rounded-full bg-white/60 blur-3xl pointer-events-none" />
    <h2 className="font-display display-huge text-[#0B2742] uppercase relative">{title}</h2>
    <div className="h-[2px] w-16 bg-[#C8A44D] my-7 relative" />
    <p className="text-[#687583] text-base md:text-lg max-w-xl leading-relaxed relative">{body}</p>
  </motion.div>
);

export const StageRail = ({ stages, current }) => (
  <div className="hidden md:flex absolute right-10 lg:right-14 top-1/2 -translate-y-1/2 z-20 flex-col gap-7">
    {stages.map((s, i) => {
      const active = current === i + 1;
      return (
        <div key={s} data-testid={`stage-indicator-${i + 1}`} className="flex items-center justify-end gap-3">
          <span
            className={`font-mono-brand text-[9.5px] tracking-[0.25em] transition-all duration-500 ${
              active ? "text-[#0B2742] opacity-100" : "opacity-0"
            }`}
          >
            {s}
          </span>
          <span
            className={`block h-px transition-all duration-500 ${
              active ? "w-9 bg-[#C8A44D]" : "w-4 bg-[#0B2742]/20"
            }`}
          />
          <span
            className={`font-mono-brand text-[10px] transition-colors duration-500 ${
              active ? "text-[#C8A44D]" : "text-[#0B2742]/30"
            }`}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
        </div>
      );
    })}
  </div>
);

export const ProgressBar = ({ barRef }) => (
  <div className="absolute bottom-0 left-0 right-0 z-30 h-[3px] bg-[#0B2742]/8">
    <div
      ref={barRef}
      className="h-full bg-[#C8A44D] origin-left"
      style={{ transform: "scaleX(0)" }}
    />
  </div>
);
