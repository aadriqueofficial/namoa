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
    label: "UNDERSTAND",
    body: "Scattered requirements are mapped, assessed and prioritized.",
    sub: "COMPLEXITY → UNDERSTANDING",
  },
  {
    label: "PLAN",
    body: "Strategy pathways form around clear business priorities.",
    sub: "UNDERSTAND → PLAN",
  },
  {
    label: "CONNECT",
    body: "Vendor and project nodes align with the strategy.",
    sub: "PLAN → CONNECT",
  },
  {
    label: "COORDINATE",
    body: "Workstreams synchronize into one operating structure.",
    sub: "CONNECT → COORDINATE",
  },
  { label: "EXECUTE", body: "", sub: "" },
];

export default function Consulting() {
  const sectionRef = useRef(null);
  const barRef = useRef(null);
  const { progressRef, stage } = useStoryProgress(sectionRef, 6, barRef);
  const v = VERTICALS[2];

  return (
    <div data-testid="consulting-page" className="bg-white">
      <Navbar />

      <section ref={sectionRef} data-testid="consulting-story-section" style={{ height: "600vh" }} className="relative">
        <div className="sticky top-0 h-screen overflow-hidden bg-gradient-to-b from-white to-[#F7F8FA]">
          <div className="absolute inset-0">
            <Suspense fallback={null}>
              <ConsultingScene progressRef={progressRef} />
            </Suspense>
          </div>

          <StoryIntro
            active={stage === 0}
            num="03"
            eyebrow="CONSULTING & BUSINESS SUPPORT"
            lines={["From Strategy", "To Execution."]}
            copy="Supporting organizations with procurement advisory, project coordination, vendor development and operational strategy."
            cta="Explore Business Support"
            testId="consulting-hero-cta"
          />

          {STAGES.slice(0, 4).map((s, i) => (
            <StageCaption
              key={s.label}
              active={stage === i + 1}
              index={`STAGE ${String(i + 1).padStart(2, "0")} — THE STRATEGY ENGINE`}
              title={s.label}
              body={s.body}
              sub={s.sub}
            />
          ))}

          <FinalStatement
            active={stage === 5}
            title="Execute."
            body="From complexity, to clarity, to execution — one structured business system."
          />

          <StageRail stages={STAGES.map((s) => s.label)} current={stage} />
          <ProgressBar barRef={barRef} />
        </div>
      </section>

      <CapabilityList eyebrow="03 / CONSULTING & BUSINESS SUPPORT" title="What We Do" items={v.capabilities} />
      <ThemeStatement word="INTELLIGENCE" line="CONSULTING organizes the network." />
      <PartnerBand />
      <ChapterNav nextNum="04" nextTitle="Marketing" to="/marketing" testId="next-chapter-marketing" />
      <Footer />
    </div>
  );
}
