import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PartnerBand, ChapterNav } from "@/components/site/VerticalSections";
import { BusinessCard } from "@/components/site/BusinessCard";
import { FadeUp } from "@/components/site/Reveal";
import { SUPPORTED_SECTORS, SUPPORTED_BUSINESSES } from "@/data/content";
import { SECTOR_ICONS } from "@/lib/sectorIcons";

const NotFound = () => (
  <div data-testid="work-sector-not-found" className="bg-white">
    <Navbar />
    <section className="pt-40 pb-32 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto text-center">
      <div className="eyebrow mb-5">OUR WORK</div>
      <h1 className="font-display text-3xl md:text-5xl font-extrabold text-[#0B2742] uppercase tracking-tight">
        Sector Not Found
      </h1>
      <p className="text-[#687583] leading-relaxed mt-6 max-w-lg mx-auto">
        We couldn't find a sector at that address. Head back to see the businesses NAMOA
        supports.
      </p>
      <Link
        to="/#supported"
        data-testid="work-sector-not-found-back"
        className="btn-navy inline-flex mt-10"
      >
        <ArrowLeft size={15} /> Back to Our Work
      </Link>
    </section>
    <Footer />
  </div>
);

export default function WorkSector() {
  const { sector: slug } = useParams();
  const activeSectors = SUPPORTED_SECTORS.filter(
    (s) => SUPPORTED_BUSINESSES.some((b) => b.sector === s.title)
  );
  const sector = activeSectors.find((s) => s.slug === slug);

  if (!sector) return <NotFound />;

  const businesses = SUPPORTED_BUSINESSES.filter((b) => b.sector === sector.title);
  const Icon = SECTOR_ICONS[sector.icon];
  const idx = activeSectors.findIndex((s) => s.slug === slug);
  const next = activeSectors[(idx + 1) % activeSectors.length];

  return (
    <div data-testid="work-sector-page" className="bg-white">
      <Navbar />

      <section className="pt-40 pb-20 md:pb-28 bg-[#F7F8FA] border-b border-[#0B2742]/8">
        <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
          <FadeUp>
            <Link
              to="/#supported"
              data-testid="work-sector-back"
              className="inline-flex items-center gap-2.5 font-mono-brand text-[10px] tracking-[0.25em] text-[#687583] hover:text-[#C8A44D] transition-colors mb-10"
            >
              <ArrowLeft size={13} /> OUR WORK
            </Link>

            <div className="flex items-start justify-between gap-8 flex-wrap">
              <div>
                <div className="flex items-center gap-4 mb-5">
                  {Icon && <Icon className="text-[#C8A44D]" size={34} strokeWidth={1.6} />}
                  <span className="font-mono-brand text-[11px] tracking-[0.2em] text-[#0B2742]/30">
                    SECTOR {sector.num}
                  </span>
                </div>
                <h1 className="font-display text-3xl md:text-5xl font-extrabold text-[#0B2742] uppercase tracking-tight leading-[1.05]">
                  {sector.title}
                </h1>
                <div className="font-mono-brand text-[10px] tracking-[0.22em] text-[#C8A44D] mt-4">
                  {sector.tagline}
                </div>
                <p className="text-[#687583] leading-relaxed mt-6 max-w-xl">{sector.description}</p>
              </div>
              <div className="font-mono-brand text-[10px] tracking-[0.25em] text-[#687583] text-right leading-loose shrink-0">
                {String(businesses.length).padStart(2, "0")}
                <br />
                {businesses.length === 1 ? "COMPANY" : "COMPANIES"}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
          {sector.subSectors && sector.subSectors.length > 0 && (
            <FadeUp>
              <div className="mb-14 border-l-2 border-[#C8A44D] pl-6 space-y-4">
                <div className="font-mono-brand text-[9px] tracking-[0.28em] text-[#C8A44D] uppercase">
                  INCLUDES
                </div>
                {sector.subSectors.map((sub) => (
                  <div key={sub.title}>
                    <div className="font-display text-lg md:text-2xl font-extrabold text-[#0B2742] uppercase tracking-tight">
                      {sub.title}
                    </div>
                    {sub.description && (
                      <p className="text-[#687583] text-sm leading-relaxed mt-1 max-w-xl">
                        {sub.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </FadeUp>
          )}
          <div className="flex flex-col gap-8">
            {businesses.map((b, i) => (
              <FadeUp key={b.num} delay={i * 0.08}>
                <BusinessCard b={b} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {next && next.slug !== sector.slug && (
        <ChapterNav
          nextNum={next.num}
          nextTitle={next.title}
          to={`/work/${next.slug}`}
          testId={`next-sector-${next.slug}`}
        />
      )}
      <PartnerBand />
      <Footer />
    </div>
  );
}
