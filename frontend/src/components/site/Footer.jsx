import { Link } from "react-router-dom";
import { LOGO_URL, COMPANY_PROFILE_URL, CONTACT, VERTICALS, AADRIQUE_URL } from "@/data/content";

export const Footer = () => (
  <footer data-testid="site-footer" className="bg-[#081D30] text-white">
    <div className="px-6 md:px-12 lg:px-20 py-16 md:py-20 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <Link to="/" data-testid="footer-logo-link" className="flex items-center gap-3 w-fit">
            <div className="bg-white p-1">
              <img src={LOGO_URL} alt="NAMOA" className="h-10 w-10 object-cover" />
            </div>
            <div>
              <div className="font-display font-extrabold tracking-[0.14em] text-[15px]">NAMOA GROUP</div>
              <div className="font-mono-brand text-[9px] tracking-[0.3em] text-white/50 mt-0.5">
                BUILDING BUSINESS ECOSYSTEMS
              </div>
            </div>
          </Link>
          <p className="text-white/55 text-sm leading-relaxed mt-6 max-w-sm">
            NAMOA GLOBAL VENTURES — Flagship Operating Company. A multi-sector partnership firm
            operating through an asset-light, network-driven model.
          </p>
          <div className="font-mono-brand text-[10px] tracking-[0.25em] text-[#C8A44D] mt-6">
            CONNECTION + MOVEMENT + INTELLIGENCE + VISION
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="font-mono-brand text-[10px] tracking-[0.28em] text-[#C8A44D] mb-5">BUSINESSES</div>
          <ul className="space-y-3">
            {VERTICALS.map((v) => (
              <li key={v.slug}>
                <Link
                  to={v.slug}
                  data-testid={`footer-link-${v.slug.slice(1)}`}
                  className="text-sm text-white/70 hover:text-[#C8A44D] transition-colors"
                >
                  {v.num} — {v.title}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={COMPANY_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/70 hover:text-[#C8A44D] transition-colors"
              >
                Company Profile (PDF)
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="font-mono-brand text-[10px] tracking-[0.28em] text-[#C8A44D] mb-5">REGISTERED OFFICE</div>
          <address className="not-italic text-sm text-white/70 leading-relaxed">
            {CONTACT.addressLines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </address>
        </div>
      </div>

      <div className="border-t border-white/10 mt-14 pt-7 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="text-[12px] text-white/40">© 2026 NAMOA GROUP. All Rights Reserved.</div>
        <div className="font-mono-brand text-[10px] tracking-[0.25em] text-white/40">
          NAMOA GLOBAL VENTURES — EST. 2026 — INDIA
        </div>
        <div className="font-mono-brand text-[10px] tracking-[0.25em] text-white/40">
          POWERED BY{" "}
          <a
            href={AADRIQUE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="footer-powered-by"
            className="text-[#C8A44D] hover:text-white transition-colors"
          >
            AADRIQUE
          </a>
        </div>
      </div>
    </div>
  </footer>
);
