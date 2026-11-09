import { ArrowUpRight, Mail, Phone } from "lucide-react";

/* A labelled row inside the dark facts panel. Renders nothing when empty, so a
   partially-filled company entry never leaves a dangling label behind. */
const Detail = ({ label, children }) => {
  if (!children) return null;
  return (
    <div className="py-4 border-b border-white/10 last:border-0">
      <div className="font-mono-brand text-[9px] tracking-[0.25em] text-[#C8A44D] mb-2">{label}</div>
      <div className="text-[13.5px] text-white/85 leading-relaxed">{children}</div>
    </div>
  );
};

/* A labelled row of chips (services, projects, what's coming next). Renders
   nothing when the list is absent, like every other optional block here. */
const ChipRow = ({ label, items, dot = false }) => {
  if (!items?.length) return null;
  return (
    <div className="mt-9">
      <div className="font-mono-brand text-[9px] tracking-[0.25em] text-[#687583] mb-3.5">
        {label}
      </div>
      <div className="flex flex-wrap gap-2.5">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-2.5 border border-[#0B2742]/15 bg-white px-3.5 py-2 font-display font-bold text-[14px] text-[#0B2742]"
          >
            {dot && <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-[#C8A44D]" />}
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

/* A labelled two-column bullet list. `gold` marks NAMOA's own commentary apart
   from the company's copy. */
const BulletList = ({ label, items, gold = false }) => {
  if (!items?.length) return null;
  return (
    <div className={`mt-9 ${gold ? "pt-8 border-t border-[#0B2742]/10" : ""}`}>
      <div
        className={`font-mono-brand text-[9px] tracking-[0.25em] mb-4 ${
          gold ? "text-[#C8A44D]" : "text-[#687583]"
        }`}
      >
        {label}
      </div>
      <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-[13.5px] text-[#0B2742] font-semibold"
          >
            <span className="mt-[7px] w-1.5 h-1.5 shrink-0 bg-[#C8A44D]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const BusinessCard = ({ b }) => (
  <article
    data-testid={`supported-card-${b.num}`}
    className="group bg-[#F7F8FA] border border-[#0B2742]/10 hover:border-[#C8A44D]/60 transition-colors duration-500"
  >
    <div className="grid lg:grid-cols-12">
      {/* Identity + story. Flex column so the contact block can sit flush with
          the bottom edge and hold the card square against the facts panel. */}
      <div className="lg:col-span-7 p-8 md:p-11 flex flex-col">
        <div className="flex flex-wrap gap-2">
          {b.sector && (
            <span className="font-mono-brand text-[8.5px] tracking-[0.2em] text-[#0B2742]/70 border border-[#0B2742]/15 px-2.5 py-1.5 uppercase">
              {b.sector}
            </span>
          )}
          {b.established && (
            <span className="font-mono-brand text-[8.5px] tracking-[0.2em] text-[#C8A44D] border border-[#C8A44D]/50 bg-[#F5EEDB]/60 px-2.5 py-1.5">
              EST. {b.established}
            </span>
          )}
        </div>

        {b.logo && <img src={b.logo} alt={b.name} className="h-14 w-auto object-contain mt-8" />}

        <h3
          className={`font-display font-extrabold text-[#0B2742] uppercase tracking-tight leading-[1.08] mt-7 ${
            b.name.length > 45 ? "text-xl md:text-[1.6rem]" : "text-2xl md:text-[2.1rem]"
          }`}
        >
          {b.website ? (
            <a
              href={b.website}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`supported-site-${b.num}`}
              className="inline-flex items-start gap-3 hover:text-[#174E73] transition-colors"
            >
              {b.name}
              <ArrowUpRight className="shrink-0 mt-1 text-[#C8A44D]" size={26} strokeWidth={1.6} />
            </a>
          ) : (
            b.name
          )}
        </h3>

        <div className="gold-rule mt-5" />

        <div className="font-mono-brand text-[10px] tracking-[0.22em] text-[#687583] uppercase mt-5">
          {[b.business, b.location].filter(Boolean).join("  ·  ")}
        </div>

        {b.vision && (
          <blockquote className="font-display text-lg md:text-[1.4rem] font-bold text-[#0B2742] leading-[1.35] tracking-tight mt-8 pl-5 border-l-2 border-[#C8A44D]">
            &ldquo;{b.vision}&rdquo;
          </blockquote>
        )}

        {b.highlight && (
          <div className="flex items-baseline gap-5 mt-8 pl-5 border-l-2 border-[#C8A44D]">
            <span className="font-display text-4xl md:text-5xl font-extrabold text-[#0B2742] leading-none">
              {b.highlight.value}
            </span>
            <span className="text-[#687583] text-[14px] leading-snug max-w-[230px]">
              {b.highlight.label}
            </span>
          </div>
        )}

        {b.about && (
          <p className="text-[#687583] text-[14.5px] leading-relaxed mt-6 max-w-lg">{b.about}</p>
        )}

        {b.mission && (
          <p className="text-[#687583] text-[14.5px] leading-relaxed mt-6 max-w-md">{b.mission}</p>
        )}

        {b.namoaServices && (
          <div className="mt-8 border border-[#C8A44D]/40 bg-[#F5EEDB]/50 px-5 py-4 max-w-lg">
            <div className="font-mono-brand text-[9px] tracking-[0.25em] text-[#C8A44D] mb-2">
              NAMOA’S SERVICES
            </div>
            <p className="text-[#0B2742] text-[14px] leading-relaxed font-semibold">{b.namoaServices}</p>
          </div>
        )}

        <ChipRow label="PRODUCTS" items={b.products} />
        <ChipRow label="SERVICES" items={b.services} />
        <ChipRow label="MAJOR PROJECTS" items={b.clients} />
        <ChipRow label="COMING NEXT" items={b.future} dot />

        <BulletList label="OUR COMMITMENTS" items={b.principles} />
        <BulletList label="NAMOA’S ROLE" items={b.namoaRole} gold />

        {(b.contact?.email || b.contact?.phone || b.social?.length > 0) && (
          <div className="mt-auto pt-10">
            <div className="font-mono-brand text-[9px] tracking-[0.25em] text-[#C8A44D] mb-3.5">
              CONTACT
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {b.contact.email && (
                <a
                  href={`mailto:${b.contact.email}`}
                  data-testid={`supported-email-${b.num}`}
                  className="inline-flex items-center gap-2.5 text-[13.5px] font-semibold text-[#0B2742] hover:text-[#C8A44D] transition-colors break-all"
                >
                  <Mail size={15} className="shrink-0 text-[#687583]" />
                  {b.contact.email}
                </a>
              )}
              {b.contact.phone && (
                <a
                  href={`tel:${b.contact.phoneRaw || b.contact.phone}`}
                  data-testid={`supported-phone-${b.num}`}
                  className="inline-flex items-center gap-2.5 text-[13.5px] font-semibold text-[#0B2742] hover:text-[#C8A44D] transition-colors"
                >
                  <Phone size={15} className="shrink-0 text-[#687583]" />
                  {b.contact.phone}
                </a>
              )}
              {b.social?.map((sn) => (
                <a
                  key={sn.label}
                  href={sn.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`supported-social-${b.num}-${sn.label.toLowerCase()}`}
                  className="inline-flex items-center gap-2.5 text-[13.5px] font-semibold text-[#0B2742] hover:text-[#C8A44D] transition-colors"
                >
                  <ArrowUpRight size={15} className="shrink-0 text-[#687583]" />
                  {sn.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Facts panel */}
      <div className="lg:col-span-5 bg-[#081D30] text-white p-8 md:p-11">
        <div className="font-mono-brand text-[10px] tracking-[0.3em] text-white/40 mb-5">
          AT A GLANCE
        </div>

        <Detail label="REGISTERED AS">{b.legalName}</Detail>

        <Detail label="GSTIN">
          {b.gstin && <span className="font-mono-brand text-[12px]">{b.gstin}</span>}
        </Detail>

        <Detail label="EXPERIENCE">{b.experience}</Detail>

        <Detail label="EXPERTISE">
          {b.expertise?.length > 0 &&
            b.expertise.map((e) => (
              <span key={e} className="block font-semibold">
                {e}
              </span>
            ))}
        </Detail>

        <Detail label="IN-HOUSE TRADES">
          {b.trades?.length > 0 && b.trades.join(" · ")}
        </Detail>

        <Detail label="LEADERSHIP">
          {b.leadership?.length > 0 &&
            b.leadership.map((p) => (
              <span key={p.name} className="block py-0.5">
                <span className="font-semibold text-white">{p.name}</span>
                {p.role && <span className="text-white/45"> — {p.role}</span>}
              </span>
            ))}
        </Detail>

        <Detail label="INSTRUMENTS">{b.instruments}</Detail>

        <Detail label="PARTNERS">{b.partners?.length > 0 && b.partners.join(" · ")}</Detail>

        <Detail label="MARKET">{b.market}</Detail>

        <Detail label="RECOGNITION">{b.recognition}</Detail>

        <Detail label="STRENGTH">{b.usp}</Detail>

        <Detail label="PARTNERSHIPS">{b.partnerships}</Detail>
      </div>
    </div>
  </article>
);
