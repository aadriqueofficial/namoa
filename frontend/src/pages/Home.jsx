import { Suspense, lazy } from "react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ArrowDown, Facebook, Instagram, Linkedin } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Marquee } from "@/components/site/Marquee";
import { SupportedBusinesses } from "@/components/site/SupportedBusinesses";
import { StrategicPartners } from "@/components/site/StrategicPartners";
import { LineReveal, FadeUp } from "@/components/site/Reveal";
import { scrollToId } from "@/lib/scroll";
import {
  VERTICALS,
  SUPPORTED_SECTORS,
  WHY_NAMOA,
  MODEL_STEPS,
  FUTURE_FOCUS,
  CONTACT,
  COMPANY_PROFILE_URL,
  NAMOA_SOCIAL,
} from "@/data/content";

const FreightNetwork = lazy(() => import("@/components/site/FreightNetwork"));

const EASE = [0.16, 1, 0.3, 1];

const SOCIAL_ICONS = { Instagram, Facebook, LinkedIn: Linkedin };

const Hero = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden bg-[#FBFAF7]">
    <div className="absolute inset-y-0 right-0 w-full lg:w-[58%]">
      <Suspense fallback={null}>
        <FreightNetwork />
      </Suspense>
      {/* mobile: the map sits behind the copy, so scrim it hard */}
      <div className="absolute inset-0 lg:hidden bg-[#FBFAF7]/85 pointer-events-none" />
      {/* desktop: the map has its own column — only feather the seam */}
      <div className="absolute inset-y-0 left-0 w-24 hidden lg:block bg-gradient-to-r from-[#FBFAF7] to-transparent pointer-events-none" />
    </div>

    <div className="relative z-10 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full pt-28 pb-20">
      <motion.div
        className="flex items-center gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.1 }}
      >
        <span className="eyebrow">NAMOA GROUP</span>
        <span className="h-px w-12 bg-[#C8A44D]" />
        <span className="font-mono-brand text-[10px] tracking-[0.25em] text-[#687583]">
          MULTI-SECTOR BUSINESS PLATFORM
        </span>
      </motion.div>

      <h1 className="font-display display-hero text-[#0B2742] uppercase max-w-4xl">
        <LineReveal lines={["Building", "Business", "Ecosystems."]} delay={0.25} />
      </h1>

      <motion.p
        className="text-[#687583] text-base md:text-lg leading-relaxed max-w-xl mt-8"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
      >
        NAMOA is a multi-sector business platform built to connect businesses, suppliers,
        logistics networks and project opportunities through efficient, scalable and
        partnership-driven execution.
      </motion.p>

      <motion.div
        className="flex flex-wrap gap-4 mt-10"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
      >
        <button data-testid="hero-explore-btn" onClick={() => scrollToId("businesses")} className="btn-navy">
          Explore Our Businesses <ArrowRight size={15} />
        </button>
        <Link to="/contact" data-testid="hero-partner-btn" className="btn-ghost">
          Partner With Us
        </Link>
      </motion.div>

      <motion.div
        className="font-mono-brand text-[10px] tracking-[0.3em] text-[#687583] mt-16 flex flex-wrap items-center gap-x-3 gap-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
      >
        {["TRADE", "PROCUREMENT", "LOGISTICS", "CONSULTING", "PROJECT SUPPORT"].map((w, i) => (
          <span key={w} className="flex items-center gap-3">
            {i > 0 && <span className="text-[#C8A44D]">•</span>}
            {w}
          </span>
        ))}
      </motion.div>
    </div>

    <motion.button
      onClick={() => scrollToId("about")}
      data-testid="hero-scroll-indicator"
      className="absolute bottom-8 right-10 lg:right-14 hidden md:flex flex-col items-center gap-3 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.8, duration: 1 }}
    >
      <span className="font-mono-brand text-[9.5px] tracking-[0.35em] text-[#687583]">SCROLL</span>
      <span className="block w-px h-12 bg-[#0B2742]/15 relative overflow-hidden">
        <span className="scroll-line absolute inset-0 bg-[#C8A44D]" />
      </span>
    </motion.button>
  </section>
);

const About = () => (
  <section id="about" className="bg-white py-24 md:py-36">
    <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto grid lg:grid-cols-12 gap-14">
      <div className="lg:col-span-7">
        <FadeUp>
          <div className="eyebrow mb-6">WHO WE ARE</div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[#0B2742] tracking-tight uppercase leading-[1.05]">
            A Business Platform
            <br />
            Built for Execution.
          </h2>
        </FadeUp>
        <FadeUp delay={0.12}>
          <p className="text-[#687583] leading-relaxed mt-8 max-w-xl">
            NAMOA GLOBAL VENTURES is a multi-sector partnership firm established in January 2026,
            operating through an asset-light, network-driven model. Our approach combines strategic
            partnerships, vendor networks and project-based execution capabilities to deliver
            flexible and scalable business solutions.
          </p>
          <p className="text-[#687583] leading-relaxed mt-5 max-w-xl">
            NAMOA Group represents our long-term vision of building an integrated business
            ecosystem connecting trade, procurement, logistics, consulting and
            infrastructure-linked opportunities.
          </p>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#0B2742]/10 border border-[#0B2742]/10 mt-12">
            {[
              ["Build", "Networks."],
              ["Create", "Opportunities."],
              ["Execute", "Responsibly."],
              ["Scale", "Sustainably."],
            ].map(([a, b]) => (
              <div key={b} className="bg-white p-5">
                <div className="font-mono-brand text-[9px] tracking-[0.25em] text-[#C8A44D] uppercase">{a}</div>
                <div className="font-display font-bold text-[#0B2742] mt-1.5">{b}</div>
              </div>
            ))}
          </div>
        </FadeUp>
        <FadeUp delay={0.28}>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-10">
            <span className="font-mono-brand text-[9px] tracking-[0.25em] text-[#687583]">FOLLOW NAMOA</span>
            {NAMOA_SOCIAL.map((s) => {
              const Icon = SOCIAL_ICONS[s.label];
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`about-social-${s.label.toLowerCase()}`}
                  className="inline-flex items-center gap-2.5 text-[13.5px] font-semibold text-[#0B2742] hover:text-[#C8A44D] transition-colors"
                >
                  {Icon && <Icon size={16} strokeWidth={1.8} className="shrink-0" />}
                  {s.label}
                </a>
              );
            })}
          </div>
        </FadeUp>
      </div>

      <div className="lg:col-span-5">
        <FadeUp delay={0.15}>
          <div className="relative">
            <div className="absolute -top-3 -left-3 w-full h-full border border-[#C8A44D]/50 pointer-events-none" />
            <div className="bg-[#F7F8FA] border border-[#0B2742]/10 p-8 md:p-10 relative">
              <div className="font-mono-brand text-[10px] tracking-[0.3em] text-[#C8A44D] mb-7">QUICK FACTS</div>
              {[
                ["Established", "16 January 2026"],
                ["Entity", "Partnership Firm"],
                ["Business Model", "Asset-Light & Network-Driven"],
                ["Operating Approach", "Multi-Sector"],
                ["Base", "India"],
                ["Founding Partners", "Rishi Boddu & Rajendrasinh Jadeja"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-3.5 border-b border-[#0B2742]/8 last:border-0">
                  <span className="text-[12px] text-[#687583] font-semibold uppercase tracking-wide">{k}</span>
                  <span className="text-[13px] text-[#0B2742] font-bold text-right">{v}</span>
                </div>
              ))}
              <div className="mt-8 pt-2">
                <div className="font-mono-brand text-[9px] tracking-[0.25em] text-[#687583] mb-3">FLAGSHIP OPERATING COMPANY</div>
                <div className="font-display text-lg font-extrabold text-[#0B2742] tracking-wide">NAMOA GLOBAL VENTURES</div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  </section>
);

const Businesses = () => (
  <section id="businesses" className="bg-[#F7F8FA] py-24 md:py-36 border-y border-[#0B2742]/8">
    <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <FadeUp>
        <div className="flex items-end justify-between gap-6 mb-16">
          <div>
            <div className="eyebrow mb-5">OUR BUSINESSES</div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[#0B2742] tracking-tight uppercase leading-[1.05]">
              Four Verticals.
              <br />
              One Ecosystem.
            </h2>
          </div>
          <div className="hidden md:block font-mono-brand text-[10px] tracking-[0.25em] text-[#687583] text-right leading-loose">
            CONNECTION + MOVEMENT
            <br />+ INTELLIGENCE + VISION = NAMOA
          </div>
        </div>
      </FadeUp>

      <div className="border-t border-[#0B2742]/12">
        {VERTICALS.map((v, i) => (
          <FadeUp key={v.slug} delay={i * 0.08}>
            <Link
              to={v.slug}
              data-testid={`chapter-link-${v.slug.slice(1)}`}
              className="chapter-row group relative block border-b border-[#0B2742]/12 py-10 md:py-12 transition-colors duration-500 hover:bg-white"
            >
              <div className="grid md:grid-cols-12 items-center gap-6 px-2 md:px-4">
                <div className="md:col-span-2">
                  <span className="font-display text-4xl md:text-6xl font-extrabold text-[#0B2742]/12 group-hover:text-[#C8A44D] transition-colors duration-500">
                    {v.num}
                  </span>
                </div>
                <div className="md:col-span-6">
                  <h3 className="font-display text-2xl md:text-4xl font-extrabold text-[#0B2742] uppercase tracking-tight">
                    {v.title}
                  </h3>
                  <p className="text-[#687583] text-sm md:text-[15px] mt-3 max-w-lg">{v.tagline}</p>
                </div>
                <div className="md:col-span-3 hidden md:block">
                  <div className="font-mono-brand text-[9px] tracking-[0.22em] text-[#687583] uppercase leading-[2]">
                    {v.capabilities.slice(0, 3).map((c) => (
                      <span key={c} className="block">
                        — {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-1 flex md:justify-end">
                  <ArrowUpRight className="chapter-arrow text-[#0B2742]" size={34} strokeWidth={1.5} />
                </div>
              </div>
              <div className="chapter-line absolute bottom-0 left-0 right-0 h-[3px] bg-[#C8A44D]" />
            </Link>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
);

const Model = () => (
  <section className="bg-white py-24 md:py-32">
    <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <FadeUp>
        <div className="eyebrow mb-5">THE NAMOA BUSINESS MODEL</div>
        <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[#0B2742] tracking-tight uppercase">
          Our Network-Driven Model
        </h2>
      </FadeUp>
      <div className="grid md:grid-cols-5 mt-16 relative">
        <div className="hidden md:block absolute top-[22px] left-[10%] right-[10%] h-px bg-[#C8A44D]/40" />
        {MODEL_STEPS.map((s, i) => (
          <FadeUp key={s.num} delay={i * 0.1} className="relative">
            <div data-testid={`model-step-${s.num}`} className="flex md:flex-col items-start gap-5 md:gap-0 py-5 md:py-0 md:px-4 border-b md:border-0 border-[#0B2742]/8">
              <div className="w-11 h-11 shrink-0 rounded-full border border-[#C8A44D] bg-white flex items-center justify-center font-mono-brand text-[11px] text-[#0B2742] font-semibold relative z-10 md:mx-0">
                {s.num}
              </div>
              <div className="md:mt-6">
                <div className="font-display text-lg font-extrabold text-[#0B2742] uppercase tracking-wide">{s.title}</div>
                <p className="text-[#687583] text-[13px] leading-relaxed mt-2 max-w-[210px]">{s.copy}</p>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
);

const Sectors = () => (
  <section id="sectors" className="bg-[#F7F8FA] py-24 md:py-32 border-y border-[#0B2742]/8">
    <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <FadeUp>
            <div className="eyebrow mb-5">SECTORS</div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#0B2742] tracking-tight uppercase leading-[1.05]">
              Where We
              <br />
              Operate.
            </h2>
            <p className="text-[#687583] text-sm leading-relaxed mt-6 max-w-xs">
              NAMOA's business model is designed to adapt across sectors rather than remain
              limited to one industry.
            </p>
          </FadeUp>
        </div>
        <div className="lg:col-span-8">
          {SUPPORTED_SECTORS.map((s, i) => (
            <FadeUp key={s.slug} delay={i * 0.06}>
              <Link
                to={`/work/${s.slug}`}
                data-testid={`sector-row-${s.slug}`}
                className="group flex items-center justify-between border-b border-[#0B2742]/10 py-7 px-2 hover:bg-white transition-colors duration-400"
              >
                <span className="font-display text-lg md:text-xl font-bold text-[#0B2742] group-hover:text-[#C8A44D] transition-colors duration-300">{s.title}</span>
                <ArrowUpRight className="text-[#0B2742]/20 group-hover:text-[#C8A44D] transition-colors duration-300 shrink-0" size={20} strokeWidth={1.8} />
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Capabilities = () => (
  <section id="capabilities" className="bg-white py-24 md:py-32">
    <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <FadeUp>
        <div className="eyebrow mb-5">WHY NAMOA</div>
        <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[#0B2742] tracking-tight uppercase max-w-2xl leading-[1.05]">
          Why Businesses Choose NAMOA.
        </h2>
      </FadeUp>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#0B2742]/10 border border-[#0B2742]/10 mt-14">
        {WHY_NAMOA.map((w, i) => (
          <FadeUp key={w.title} delay={i * 0.05} className="bg-white">
            <div data-testid={`why-card-${i}`} className="group p-8 md:p-10 h-full hover:bg-[#F7F8FA] transition-colors duration-400">
              <div className="font-mono-brand text-[10px] tracking-[0.25em] text-[#C8A44D] mb-5">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-display text-lg font-extrabold text-[#0B2742] uppercase tracking-wide">{w.title}</h3>
              <div className="gold-rule my-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <p className="text-[#687583] text-[13.5px] leading-relaxed">{w.copy}</p>
            </div>
          </FadeUp>
        ))}
      </div>
      <FadeUp delay={0.1}>
        <div className="flex flex-wrap gap-3 mt-10">
          {["MSME — Udyam Registered", "GeM — Marketplace Eligible", "TReDS — Invoice Financing Eligible", "UNGM — Structured for Onboarding"].map((c) => (
            <span key={c} className="font-mono-brand text-[10px] tracking-[0.18em] text-[#0B2742]/70 border border-[#0B2742]/15 px-4 py-2.5">
              {c}
            </span>
          ))}
        </div>
      </FadeUp>
    </div>
  </section>
);

const FutureFocus = () => (
  <section id="future" className="bg-[#F7F8FA] py-24 md:py-32 border-y border-[#0B2742]/8">
    <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <FadeUp>
        <div className="flex items-center gap-4 mb-5">
          <span className="eyebrow">FUTURE FOCUS</span>
          <span className="font-mono-brand text-[8.5px] tracking-[0.2em] text-[#C8A44D] border border-[#C8A44D]/50 px-2 py-1 bg-[#F5EEDB]/60">
            EXPANDING CAPABILITIES — NOT ESTABLISHED VERTICALS
          </span>
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[#0B2742] tracking-tight uppercase">
          Building What Comes Next.
        </h2>
      </FadeUp>
      <div className="flex flex-wrap gap-4 mt-12">
        {FUTURE_FOCUS.map((f, i) => (
          <FadeUp key={f} delay={i * 0.06}>
            <div
              data-testid={`future-chip-${i}`}
              className="group flex items-center gap-4 border border-[#0B2742]/15 bg-white px-6 py-5 hover:border-[#C8A44D] transition-colors duration-400"
            >
              <span className="w-2 h-2 rounded-full bg-[#C8A44D]/60 group-hover:bg-[#C8A44D] transition-colors" />
              <span className="font-display font-bold text-[#0B2742] text-[15px]">{f}</span>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
);

const Vision = () => (
  <section className="bg-[#0B2742] py-28 md:py-40 relative overflow-hidden">
    <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "34px 34px" }} />
    <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto relative">
      <FadeUp>
        <div className="font-mono-brand text-[10px] tracking-[0.35em] text-[#C8A44D] mb-8">OUR VISION</div>
        <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight uppercase leading-[1.05] max-w-4xl">
          A Globally Integrated Trade & Infrastructure Platform.
        </h2>
        <p className="text-white/60 text-base md:text-lg leading-relaxed mt-8 max-w-2xl">
          Enabling efficient supply chains, sustainable project execution and scalable business
          ecosystems.
        </p>
        <div className="h-[2px] w-20 bg-[#C8A44D] mt-10" />
      </FadeUp>
    </div>
  </section>
);

const Contact = () => (
  <section id="contact" className="bg-white py-24 md:py-36">
    <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto grid lg:grid-cols-12 gap-14">
      <div className="lg:col-span-7">
        <FadeUp>
          <div className="eyebrow mb-6">CONTACT</div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[#0B2742] tracking-tight uppercase leading-[1.05]">
            Let's Build
            <br />
            Something Together.
          </h2>
          <p className="text-[#687583] leading-relaxed mt-8 max-w-xl">
            Whether you are looking for a sourcing partner, procurement support, logistics
            coordination, project execution assistance or strategic business support, NAMOA is
            open to exploring opportunities.
          </p>
        </FadeUp>
        <FadeUp delay={0.12}>
          <div className="mt-10">
            {CONTACT.enquiries.map((e, i) => (
              <div key={e} className="flex items-center gap-5 border-b border-[#0B2742]/8 py-4">
                <span className="font-mono-brand text-[10px] tracking-[0.2em] text-[#C8A44D]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display font-bold text-[#0B2742] text-[15px]">{e}</span>
              </div>
            ))}
          </div>
          <Link to="/contact" data-testid="contact-form-cta" className="btn-navy mt-10">
            Send an Enquiry <ArrowRight size={15} />
          </Link>
        </FadeUp>
      </div>
      <div className="lg:col-span-5">
        <FadeUp delay={0.15}>
          <div data-testid="contact-info-card" className="bg-[#081D30] text-white p-8 md:p-10">
            <div className="font-mono-brand text-[10px] tracking-[0.3em] text-[#C8A44D] mb-7">REGISTERED OFFICE</div>
            <address className="not-italic text-[15px] text-white/80 leading-loose">
              {CONTACT.addressLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
            <div className="border-t border-white/10 mt-8 pt-8">
              <div className="font-mono-brand text-[10px] tracking-[0.3em] text-[#C8A44D] mb-4">COMPANY PROFILE</div>
              <a
                href={COMPANY_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="contact-profile-link"
                className="inline-flex items-center gap-3 text-white font-bold text-sm hover:text-[#C8A44D] transition-colors"
              >
                Download Company Profile <ArrowDown size={15} />
              </a>
            </div>
            <div className="border-t border-white/10 mt-8 pt-8 font-mono-brand text-[10px] tracking-[0.25em] text-white/40 leading-loose">
              NAMOA GLOBAL VENTURES
              <br />
              FLAGSHIP OPERATING COMPANY — EST. 2026
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  </section>
);

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const t = setTimeout(() => scrollToId(id), 350);
      return () => clearTimeout(t);
    }
  }, [location.hash]);

  return (
    <div data-testid="home-page" className="bg-white">
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Businesses />
      <SupportedBusinesses />
      <StrategicPartners />
      <Model />
      <Sectors />
      <Capabilities />
      <FutureFocus />
      <Vision />
      <Contact />
      <Footer />
    </div>
  );
}
