const ITEMS = ["TRADE", "PROCUREMENT", "LOGISTICS", "SUPPLY CHAIN", "CONSULTING", "PROJECT SUPPORT"];

export const Marquee = () => {
  const row = (key) => (
    <div key={key} className="flex items-center shrink-0">
      {ITEMS.map((item) => (
        <div key={key + item} className="flex items-center">
          <span className="font-display text-[clamp(1.6rem,3.2vw,2.8rem)] font-extrabold text-[#0B2742] px-8 whitespace-nowrap">
            {item}
          </span>
          <span className="text-[#C8A44D] text-lg">◆</span>
        </div>
      ))}
    </div>
  );
  return (
    <div data-testid="editorial-marquee" className="border-y border-[#0B2742]/10 bg-white py-6 overflow-hidden">
      <div className="marquee-track">{[0, 1].map((i) => row(i))}</div>
    </div>
  );
};
