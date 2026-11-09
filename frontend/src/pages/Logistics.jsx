import { Suspense, lazy, useRef } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { StoryIntro, StageCaption, StageRail, ProgressBar, FinalStatement } from "@/components/site/story";
import { CapabilityList, ThemeStatement, ChapterNav, PartnerBand } from "@/components/site/VerticalSections";
import { useStoryProgress } from "@/hooks/useStoryProgress";
import { VERTICALS } from "@/data/content";

const LogisticsScene = lazy(() => import("@/components/three/LogisticsScene"));

const STAGES = [
  {
    label: "SOURCE",
    body: "Connecting requirements with the right supply network.",
    sub: "ORIGIN → MOVEMENT",
  },
  {
    label: "COORDINATE",
    body: "Bringing procurement, logistics and delivery requirements together.",
    sub: "MOVEMENT → COORDINATION",
  },
  {
    label: "MOVE",
    body: "Coordinating freight, cargo and delivery.",
    sub: "COORDINATION → DELIVERY",
  },
  { label: "DELIVER", body: "", sub: "" },
];

export default function Logistics() {
  const sectionRef = useRef(null);
  const barRef = useRef(null);
  const { progressRef, stage } = useStoryProgress(sectionRef, 5, barRef);
  const v = VERTICALS[1];

  return (
    <div data-testid="logistics-page" className="bg-white">
      <Navbar />

      <section ref={sectionRef} data-testid="logistics-story-section" style={{ height: "560vh" }} className="relative">
        <div className="sticky top-0 h-screen overflow-hidden bg-gradient-to-b from-white to-[#F7F8FA]">
          <div className="absolute inset-0">
            <Suspense fallback={null}>
              <LogisticsScene progressRef={progressRef} />
            </Suspense>
          </div>

          <StoryIntro
            active={stage === 0}
            num="02"
            eyebrow="LOGISTICS & SUPPLY CHAIN"
            lines={["Moving Products.", "Coordinating Networks."]}
            copy="Logistics and supply-chain coordination through a flexible partner network."
            cta="Explore Supply Chain Solutions"
            testId="logistics-hero-cta"
          />

          {STAGES.slice(0, 3).map((s, i) => (
            <StageCaption
              key={s.label}
              active={stage === i + 1}
              index={`STAGE ${String(i + 1).padStart(2, "0")} — THE JOURNEY`}
              title={s.label}
              body={s.body}
              sub={s.sub}
            />
          ))}

          <FinalStatement
            active={stage === 4}
            title="Deliver."
            body="From origin to destination, NAMOA coordinates the network behind the movement."
          />

          <StageRail stages={STAGES.map((s) => s.label)} current={stage} />
          <ProgressBar barRef={barRef} />
        </div>
      </section>

      <CapabilityList eyebrow="02 / LOGISTICS & SUPPLY CHAIN" title="What We Do" items={v.capabilities} />
      <ThemeStatement word="MOVEMENT" line="LOGISTICS moves through the network." />
      <PartnerBand />
      <ChapterNav nextNum="03" nextTitle="Consulting & Business Support" to="/consulting" testId="next-chapter-consulting" />
      <Footer />
    </div>
  );
}
