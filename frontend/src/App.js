import { useCallback, useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { SmoothScroll, getLenis } from "@/lib/scroll";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Home from "@/pages/Home";
import Trade from "@/pages/Trade";
import Logistics from "@/pages/Logistics";
import Consulting from "@/pages/Consulting";
import Marketing from "@/pages/Marketing";
import WorkSector from "@/pages/WorkSector";
import Contact from "@/pages/Contact";
import Launch from "@/pages/Launch";
import { LaunchIntro } from "@/components/site/LaunchIntro";

const RouteReset = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    const t = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => clearTimeout(t);
  }, [pathname]);
  return null;
};

const isLaunchPath = (path) => path.replace(/\/+$/, "") === "/launch";

const AppShell = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // The brand intro plays on every page load, except on the launch ceremony page,
  // which plays it on demand after the countdown. `next` is where to go on reveal.
  const [intro, setIntro] = useState(() => (isLaunchPath(pathname) ? null : { id: 0, next: null }));
  // The site mounts as the intro starts lifting, so its own entrance animations play on reveal.
  const [siteReady, setSiteReady] = useState(intro === null);

  const onReveal = () => {
    setSiteReady(true);
    if (intro?.next) navigate(intro.next);
  };

  const goLive = useCallback(() => setIntro({ id: Date.now(), next: "/" }), []);

  return (
    <>
      {intro && <LaunchIntro key={intro.id} onReveal={onReveal} fadeIn={Boolean(intro.next)} />}
      {siteReady && (
        <SmoothScroll>
          <RouteReset />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/logistics" element={<Logistics />} />
            <Route path="/consulting" element={<Consulting />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/work/:sector" element={<WorkSector />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/launch" element={<Launch onLaunched={goLive} />} />
          </Routes>
        </SmoothScroll>
      )}
    </>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </div>
  );
}

export default App;
