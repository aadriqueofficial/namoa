import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { LOGO_URL, COMPANY_PROFILE_URL } from "@/data/content";
import { scrollToId, getLenis } from "@/lib/scroll";

const LINKS = [
  { label: "About", id: "about" },
  { label: "Businesses", id: "businesses" },
  { label: "Our Work", id: "supported" },
  { label: "Partners", id: "partners" },
  { label: "Sectors", id: "supported" },
  { label: "Capabilities", id: "capabilities" },
  { label: "Future Focus", id: "future" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id) => {
    setOpen(false);
    if (location.pathname === "/") {
      scrollToId(id);
    } else {
      navigate("/#" + id);
    }
  };

  const goHome = (e) => {
    setOpen(false);
    if (location.pathname === "/") {
      e.preventDefault();
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        data-testid="main-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-white/90 backdrop-blur-md border-b border-[#0B2742]/10" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-5 md:px-10 lg:px-14 h-[70px]">
          <Link to="/" onClick={goHome} data-testid="nav-logo-link" className="flex items-center gap-3">
            <img src={LOGO_URL} alt="NAMOA GROUP" className="h-11 w-11 object-cover mix-blend-multiply" />
            <span className="font-display font-800 text-[#0B2742] leading-none">
              <span className="block text-[15px] font-extrabold tracking-[0.14em]">NAMOA GROUP</span>
              <span className="block font-mono-brand text-[8.5px] tracking-[0.3em] text-[#687583] mt-0.5">
                BUILDING BUSINESS ECOSYSTEMS
              </span>
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8">
            {LINKS.map((l) => (
              <button
                key={l.id}
                data-testid={`nav-link-${l.id}`}
                onClick={() => goTo(l.id)}
                className="link-underline whitespace-nowrap text-[12.5px] font-semibold tracking-[0.06em] text-[#13202B] hover:text-[#0B2742]"
              >
                {l.label}
              </button>
            ))}
            <Link
              to="/contact"
              data-testid="nav-partner-btn"
              className="btn-navy whitespace-nowrap ml-2 !py-2.5 !px-5 text-[11px]"
            >
              Partner With NAMOA <ArrowRight size={14} />
            </Link>
          </nav>

          <button
            data-testid="nav-mobile-toggle"
            className="xl:hidden text-[#0B2742] p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-8 flex flex-col gap-6 xl:hidden"
          >
            {LINKS.map((l, i) => (
              <motion.button
                key={l.id}
                data-testid={`mobile-link-${l.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.06 }}
                onClick={() => goTo(l.id)}
                className="text-left font-display text-3xl font-bold text-[#0B2742]"
              >
                {l.label}
              </motion.button>
            ))}
            <a
              href={COMPANY_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-3xl font-bold text-[#0B2742]"
            >
              Company Profile
            </a>
            <Link to="/contact" onClick={() => setOpen(false)} className="btn-navy mt-4 w-fit">
              Partner With NAMOA <ArrowRight size={15} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
