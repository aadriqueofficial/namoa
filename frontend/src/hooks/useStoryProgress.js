import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useStoryProgress(sectionRef, numStages, barRef) {
  const progressRef = useRef(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progressRef.current = self.progress;
        if (barRef && barRef.current) {
          barRef.current.style.transform = `scaleX(${self.progress})`;
        }
        const s = Math.min(numStages - 1, Math.floor(self.progress * numStages));
        setStage((prev) => (prev === s ? prev : s));
      },
    });
    const t = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => {
      clearTimeout(t);
      st.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numStages]);

  return { progressRef, stage };
}
