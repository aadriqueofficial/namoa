import { Suspense, lazy, useRef } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { StoryIntro, StageCaption, StageRail, ProgressBar, FinalStatement } from "@/components/site/story";
import { CapabilityList, ThemeStatement, ChapterNav, PartnerBand } from "@/components/site/VerticalSections";
import { useStoryProgress } from "@/hooks/useStoryProgress";
import { VERTICALS } from "@/data/content";

const ConsultingScene = lazy(() => import("@/components/three/ConsultingScene"));

const STAGES = [
  {
    label: "DISCOVER",
    body: "Markets, audiences and opportunities are identified and mapped.",
    sub: "INSIGHT → DISCOVERY",
  },
  {
    label: "POSITION",
    body: "Brand voice and positioning are defined to stand apart from the noise.",
    sub: "DISCOVERY → POSITIONING",
  },
  {
    label: "CAMPAIGN",
    body: "Campaigns are built across the right channels to reach the right people.",
    sub: "POSITIONING → CAMPAIGN",
  },
  {
    label: "GROW",
    body: "Sustained demand generation and brand growth — measured, refined, repeated.",
    sub: "CAMPAIGN → GROWTH",
  },
  { label: "SCALE", body: "", sub: "" },
];

export default function Marketing() {
  const sectionRef = useRef(null);
  const barRef = useRef(null);
  const { progressRef, stage } = useStoryProgress(sectionRef, 6, barRef);
  const v = VERTICALS[3];

  return (
    <div data-testid="marketing-page" className="bg-white">
      <Navbar />

      <section ref={sectionRef} data-testid="marketing-story-section" style={{ height: "600vh" }} className="relative">
        <div className="sticky top-0 h-screen overflow-hidden bg-gradient-to-b from-white to-[#F7F8FA]">
          <div className="absolute inset-0">
            <Suspense fallback={null}>
              <ConsultingScene progressRef={progressRef} />
            </Suspense>
          </div>

          <StoryIntro
            active={stage === 0}
            num="04"
            eyebrow="MARKETING"
            lines={["Building Brands.", "Driving Growth."]}
            copy="End-to-end marketing support — from brand strategy and digital presence to campaign execution and market positioning."
            cta="Explore Marketing"
            testId="marketing-hero-cta"
          />

          {STAGES.slice(0, 4).map((s, i) => (
            <StageCaption
              key={s.label}
              active={stage === i + 1}
              index={`STAGE ${String(i + 1).padStart(2, "0")} — THE GROWTH ENGINE`}
              title={s.label}
              body={s.body}
              sub={s.sub}
            />
          ))}

          <FinalStatement
            active={stage === 5}
            title="Scale."
            body="From insight to impact — one structured marketing system that builds brands and drives growth."
          />

          <StageRail stages={STAGES.map((s) => s.label)} current={stage} />
          <ProgressBar barRef={barRef} />
        </div>
      </section>

      <CapabilityList eyebrow="04 / MARKETING" title="What We Do" items={v.capabilities} />
      <ThemeStatement word="VISION" line="MARKETING amplifies the network." />
      <PartnerBand />
      <ChapterNav nextNum="01" nextTitle="Trade &amp; Procurement" to="/trade" testId="next-chapter-trade" />
      <Footer />
    </div>
  );
}
