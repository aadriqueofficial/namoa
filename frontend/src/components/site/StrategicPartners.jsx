import { FadeUp } from "@/components/site/Reveal";
import { BusinessCard } from "@/components/site/BusinessCard";
import { STRATEGIC_PARTNERS } from "@/data/content";

// Companies that help build NAMOA itself — technology, knowledge, operational
// partners — kept deliberately apart from "Businesses We Supported" above:
// this section is who partners with NAMOA, not who NAMOA supports.
export const StrategicPartners = () => {
  if (STRATEGIC_PARTNERS.length === 0) return null;

  return (
    <section id="partners" className="bg-[#F7F8FA] py-24 md:py-36 border-b border-[#0B2742]/8">
      <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <FadeUp>
          <div className="mb-16">
            <div className="eyebrow mb-5">STRATEGIC PARTNERS</div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[#0B2742] tracking-tight uppercase leading-[1.05] max-w-2xl">
              Strategic Partners Building the Ecosystem.
            </h2>
            <p className="text-[#687583] leading-relaxed mt-7 max-w-xl">
              The organisations NAMOA partners with to run and grow the Group itself —
              technology, knowledge and operational capability behind the platform, distinct
              from the businesses NAMOA supports.
            </p>
          </div>
        </FadeUp>

        <div className="flex flex-col gap-8">
          {STRATEGIC_PARTNERS.map((p, i) => (
            <FadeUp key={p.num} delay={i * 0.08}>
              <BusinessCard b={p} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
};
