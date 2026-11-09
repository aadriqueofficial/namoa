import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, BrainCircuit } from "lucide-react";
import { FadeUp } from "@/components/site/Reveal";
import { SUPPORTED_SECTORS, SUPPORTED_BUSINESSES } from "@/data/content";
import { SECTOR_ICONS } from "@/lib/sectorIcons";

const SectorTile = ({ sector, count, index }) => {
  const Icon = SECTOR_ICONS[sector.icon];
  return (
    <FadeUp delay={index * 0.06} className="bg-white h-full">
      <Link
        to={`/work/${sector.slug}`}
        data-testid={`sector-tile-${sector.slug}`}
        className="group flex flex-col h-full p-8 md:p-10 hover:bg-[#F7F8FA] transition-colors duration-400"
      >
        <div className="flex items-start justify-between">
          {Icon && (
            <Icon className="text-[#C8A44D] group-hover:scale-110 transition-transform duration-500" size={28} strokeWidth={1.6} />
          )}
          <span className="font-mono-brand text-[11px] tracking-[0.2em] text-[#0B2742]/25">
            {sector.num}
          </span>
        </div>

        <h3 className="font-display text-xl font-extrabold text-[#0B2742] uppercase tracking-tight mt-6">
          {sector.title}
        </h3>
        <div className="font-mono-brand text-[9.5px] tracking-[0.2em] text-[#C8A44D] mt-2.5">
          {sector.tagline}
        </div>
        <p className="text-[#687583] text-[13.5px] leading-relaxed mt-4">{sector.description}</p>

        <div className="mt-auto pt-8 flex items-center justify-between gap-4">
          <span className="font-mono-brand text-[9px] tracking-[0.2em] text-[#0B2742]/50 uppercase">
            {count} {count === 1 ? "Company" : "Companies"}
          </span>
          <span className="inline-flex items-center gap-2 font-mono-brand text-[10px] tracking-[0.2em] text-[#0B2742] group-hover:text-[#C8A44D] transition-colors">
            VIEW
            <ArrowUpRight
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-400"
              size={14}
            />
          </span>
        </div>
      </Link>
    </FadeUp>
  );
};

// A tile in the grid's own voice rather than a linked sector — same footprint
// and rhythm as SectorTile, different content. Used for the AADRIQUE
// spotlight and the closing CTA below.
const FeatureTile = ({ delay, dark, eyebrow, title, copy, footer, to }) => {
  const Wrapper = to ? Link : "div";
  return (
    <FadeUp delay={delay} className={dark ? "bg-[#0B2742] h-full" : "bg-white h-full"}>
      <Wrapper
        {...(to ? { to } : {})}
        className={`group flex flex-col h-full p-8 md:p-10 ${
          to && !dark ? "hover:bg-[#F7F8FA] transition-colors duration-400" : ""
        }`}
      >
        {eyebrow}
        <h3
          className={`font-display text-xl font-extrabold uppercase tracking-tight mt-3 ${
            dark ? "text-white" : "text-[#0B2742]"
          }`}
        >
          {title}
        </h3>
        <p className={`text-[13.5px] leading-relaxed mt-3 max-w-sm ${dark ? "text-white/55" : "text-[#687583]"}`}>
          {copy}
        </p>
        <div className="mt-auto pt-8">{footer}</div>
      </Wrapper>
    </FadeUp>
  );
};

export const SupportedBusinesses = () => {
  const sectors = SUPPORTED_SECTORS.map((s) => ({
    sector: s,
    count: SUPPORTED_BUSINESSES.filter((b) => b.sector === s.title).length,
  })).filter((s) => s.count > 0);

  if (sectors.length === 0) return null;

  return (
    <section id="supported" className="bg-white py-24 md:py-36 border-b border-[#0B2742]/8">
      <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <FadeUp>
          <div className="mb-16">
            <div className="eyebrow mb-5">OUR KEY SECTORS</div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[#0B2742] tracking-tight uppercase leading-[1.05]">
              Many Sectors.
              <br />
              One Connected Ecosystem.
            </h2>
            <p className="text-[#687583] leading-relaxed mt-7 max-w-2xl">
              NAMOA Group brings together specialised enterprises across technology, healthcare,
              infrastructure, agriculture and professional services, creating opportunities for
              collaboration, innovation and sustainable growth.
            </p>
          </div>
        </FadeUp>

        {/* A fixed 9-tile grid: the 7 live sectors, then the AADRIQUE
            spotlight and the closing partner CTA — the last two aren't
            sector tiles and don't come from SUPPORTED_SECTORS, so this
            stays a 3×3 grid regardless of the live sector count. */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#0B2742]/10 border border-[#0B2742]/10">
          {sectors.map(({ sector, count }, i) => (
            <SectorTile key={sector.slug} sector={sector} count={count} index={i} />
          ))}

          <FeatureTile
            delay={sectors.length * 0.06}
            to="/#partners"
            eyebrow={<BrainCircuit className="text-[#C8A44D]" size={28} strokeWidth={1.6} />}
            title="AADRIQUE"
            copy="Strategic technology & digital transformation partner powering the ecosystem."
            footer={
              <span className="inline-flex items-center gap-2 font-mono-brand text-[10px] tracking-[0.2em] text-[#C8A44D] group-hover:text-[#0B2742] transition-colors">
                VIEW PARTNER
                <ArrowUpRight
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-400"
                  size={14}
                />
              </span>
            }
          />

          <FeatureTile
            delay={(sectors.length + 1) * 0.06}
            dark
            to="/contact"
            eyebrow={
              <div className="font-mono-brand text-[9.5px] tracking-[0.2em] text-[#C8A44D]">
                GROWING NETWORK
              </div>
            }
            title="Building Something?"
            copy="If your sector isn't listed yet, partner with NAMOA and put it on the map."
            footer={
              <span className="inline-flex items-center gap-2.5 font-mono-brand text-[10px] tracking-[0.2em] text-[#C8A44D] group-hover:text-white transition-colors">
                PARTNER WITH US
                <ArrowRight className="group-hover:translate-x-1 transition-transform duration-400" size={14} />
              </span>
            }
          />
        </div>
      </div>
    </section>
  );
};
