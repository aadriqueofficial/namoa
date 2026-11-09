import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FadeUp } from "@/components/site/Reveal";

export const CapabilityList = ({ eyebrow, title, items }) => (
  <section className="bg-white py-24 md:py-32">
    <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <FadeUp>
            <div className="eyebrow mb-5">{eyebrow}</div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#0B2742] tracking-tight uppercase leading-[1.05]">
              {title}
            </h2>
          </FadeUp>
        </div>
        <div className="lg:col-span-8">
          {items.map((item, i) => (
            <FadeUp key={item} delay={i * 0.05}>
              <div
                data-testid={`capability-row-${i}`}
                className="group flex items-baseline gap-6 border-b border-[#0B2742]/10 py-6 hover:bg-[#F7F8FA] transition-colors duration-400 px-2"
              >
                <span className="font-mono-brand text-[11px] tracking-[0.2em] text-[#C8A44D]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-xl md:text-2xl font-bold text-[#13202B] group-hover:text-[#0B2742]">
                  {item}
                </span>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const ThemeStatement = ({ word, line }) => (
  <section className="bg-[#F7F8FA] py-24 md:py-36 overflow-hidden">
    <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto text-center">
      <FadeUp>
        <div className="font-mono-brand text-[10px] tracking-[0.35em] text-[#687583] mb-6">
          IN THE NAMOA ECOSYSTEM
        </div>
        {/* Shrink long words (CONNECTION, INTELLIGENCE) to the container width so
            they never overflow on phones; ~0.8em is a black-weight capital's advance. */}
        <div className="[container-type:inline-size]">
          <div
            className="font-display display-huge text-[#0B2742]/8 uppercase select-none leading-none"
            style={{ fontSize: `min(clamp(3.2rem, 9vw, 8.5rem), calc(100cqw / ${word.length * 0.8}))` }}
          >
            {word}
          </div>
        </div>
        <p className="font-display text-xl md:text-2xl font-bold text-[#0B2742] -mt-6 md:-mt-10 relative">
          {line}
        </p>
      </FadeUp>
    </div>
  </section>
);

export const ChapterNav = ({ nextNum, nextTitle, to, testId }) => (
  <section className="bg-white border-t border-[#0B2742]/10">
    <Link to={to} data-testid={testId} className="chapter-row block group relative overflow-hidden">
      <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto py-16 md:py-20 flex items-center justify-between gap-6">
        <div>
          <div className="font-mono-brand text-[10px] tracking-[0.3em] text-[#687583] mb-4 flex items-center gap-3">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#C8A44D]" />
            NEXT CHAPTER — {nextNum}
          </div>
          <div className="font-display text-3xl md:text-5xl font-extrabold text-[#0B2742] uppercase tracking-tight">
            {nextTitle}
          </div>
        </div>
        <ArrowUpRight className="chapter-arrow text-[#0B2742] shrink-0" size={44} strokeWidth={1.5} />
      </div>
      <div className="chapter-line absolute bottom-0 left-0 right-0 h-[3px] bg-[#C8A44D]" />
    </Link>
  </section>
);

export const PartnerBand = () => (
  <section className="bg-[#0B2742] py-20 md:py-28">
    <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
      <FadeUp>
        <div className="font-mono-brand text-[10px] tracking-[0.3em] text-[#C8A44D] mb-4">
          LET'S BUILD SOMETHING TOGETHER
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white uppercase tracking-tight">
          Partner With NAMOA
        </h2>
      </FadeUp>
      <FadeUp delay={0.1}>
        <Link
          to="/contact"
          data-testid="vertical-partner-cta"
          className="inline-flex items-center gap-3 bg-[#C8A44D] text-[#081D30] px-8 py-4 text-[12px] font-bold tracking-[0.08em] uppercase hover:bg-white transition-colors duration-400"
        >
          Contact NAMOA <ArrowRight size={15} />
        </Link>
      </FadeUp>
    </div>
  </section>
);
