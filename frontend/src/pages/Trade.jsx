import { Suspense, lazy, useRef } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { StoryIntro, StageCaption, StageRail, ProgressBar } from "@/components/site/story";
import { CapabilityList, ThemeStatement, ChapterNav, PartnerBand } from "@/components/site/VerticalSections";
import { useStoryProgress } from "@/hooks/useStoryProgress";
import { VERTICALS } from "@/data/content";

const TradeScene = lazy(() => import("@/components/three/TradeScene"));

const STAGES = [
  {
    label: "SOURCE",
    body: "Supplier and product nodes are identified across markets, categories and geographies.",
    sub: "DEMAND → SOURCE",
  },
  {
    label: "CONNECT",
    body: "Relevant vendors begin connecting. Procurement routes take shape across the network.",
    sub: "SOURCE → CONNECT",
  },
  {
    label: "PROCURE",
    body: "Product clusters converge toward the NAMOA core. Sourcing becomes structured procurement.",
    sub: "CONNECT → PROCURE",
  },
  {
    label: "DISTRIBUTE",
    body: "An organized supply network — with NAMOA at the center of the ecosystem.",
    sub: "NAMOA CONNECTS DEMAND WITH SUPPLY",
  },
];

export default function Trade() {
  const sectionRef = useRef(null);
  const barRef = useRef(null);
  const { progressRef, stage } = useStoryProgress(sectionRef, 5, barRef);
  const v = VERTICALS[0];

  return (
    <div data-testid="trade-page" className="bg-white">
      <Navbar />

      <section ref={sectionRef} data-testid="trade-story-section" style={{ height: "520vh" }} className="relative">
        <div className="sticky top-0 h-screen overflow-hidden bg-gradient-to-b from-white to-[#F7F8FA]">
          <div className="absolute inset-0">
            <Suspense fallback={null}>
              <TradeScene progressRef={progressRef} />
            </Suspense>
          </div>

          <StoryIntro
            active={stage === 0}
            num="01"
            eyebrow="TRADE & PROCUREMENT"
            lines={["Connecting Demand", "With Reliable Supply."]}
            copy="Sourcing, procurement and distribution through connected vendor networks."
            cta="Explore Trade & Procurement"
            testId="trade-hero-cta"
          />

          {STAGES.map((s, i) => (
            <StageCaption
              key={s.label}
              active={stage === i + 1}
              index={`STAGE ${String(i + 1).padStart(2, "0")} — THE GLOBAL SUPPLY NETWORK`}
              title={s.label}
              body={s.body}
              sub={s.sub}
            />
          ))}

          <StageRail stages={STAGES.map((s) => s.label)} current={stage} />
          <ProgressBar barRef={barRef} />
        </div>
      </section>

      <CapabilityList eyebrow="01 / TRADE & PROCUREMENT" title="What We Do" items={v.capabilities} />
      <ThemeStatement word="CONNECTION" line="TRADE connects the network." />
      <PartnerBand />
      <ChapterNav nextNum="02" nextTitle="Logistics & Supply Chain" to="/logistics" testId="next-chapter-logistics" />
      <Footer />
    </div>
  );
}
