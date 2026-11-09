import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SmoothScroll, getLenis } from "@/lib/scroll";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Home from "@/pages/Home";
import Trade from "@/pages/Trade";
import Logistics from "@/pages/Logistics";
import Consulting from "@/pages/Consulting";
import Marketing from "@/pages/Marketing";
import WorkSector from "@/pages/WorkSector";
import Contact from "@/pages/Contact";

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

function App() {
  return (
    <div className="App">
      <BrowserRouter>
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
          </Routes>
        </SmoothScroll>
      </BrowserRouter>
    </div>
  );
}

export default App;
