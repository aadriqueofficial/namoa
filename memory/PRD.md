# NAMOA GROUP — Premium Corporate Website (PRD)

## Original Problem Statement
Build a premium, high-end corporate website experience for NAMOA GROUP (operating entity: NAMOA GLOBAL VENTURES). Primary focus: HERO EXPERIENCES and SCROLL-DRIVEN 3D STORYTELLING for the three core business verticals — 01 Trade & Procurement, 02 Logistics & Supply Chain, 03 Consulting & Business Support. Light/white dominant theme (75% white, 15% navy #0B2742, 10% gold #C8A44D). Shared metaphor: NETWORK + MOVEMENT + CONNECTION. Scroll controls the story; motion rule: STATIC→INTRODUCE, SCROLL→TRANSFORM, INTERACT→REVEAL, ARRIVE→RESOLVE. Must feel like an emerging global business group, not a template.

## User Choices
- Separate pages per vertical (Home + /trade, /logistics, /consulting)
- Real content pulled from uploaded Company Profile + Website Content PDFs
- Contact = section with address/enquiry info only (no form)
- Uploaded NAMOA logo used in navigation

## Architecture
- Frontend: React 19 (CRA/craco), react-router-dom 7
- 3D: three.js + @react-three/fiber 9 + @react-three/drei (Grid)
- Motion: GSAP ScrollTrigger (story progress), Lenis (smooth momentum scroll), framer-motion (reveals/micro-interactions)
- Backend: FastAPI + MongoDB (template default, no custom endpoints needed — content is static)
- Fonts: Archivo (display), Manrope (body), IBM Plex Mono (metadata/eyebrows)

## Key Files
- `src/App.js` — routes + SmoothScroll + RouteReset (ScrollTrigger refresh)
- `src/lib/scroll.js` — Lenis + GSAP ticker integration, scrollToId
- `src/hooks/useStoryProgress.js` — ScrollTrigger progress → progressRef (read in useFrame) + stage state + progress bar
- `src/components/three/` — HomeScene (ecosystem node sphere), TradeScene (supply network organizes around gold NAMOA core), LogisticsScene (truck journey: warehouse→containers→cranes→destination, gold route tube draws with truck), ConsultingScene (scattered blocks organize into execution architecture + gold pathway)
- `src/components/site/story.jsx` — StoryIntro (masked line reveal + scrim), StageCaption, FinalStatement, StageRail, ProgressBar
- `src/components/site/` — Navbar, Footer, Marquee, Reveal (LineReveal/FadeUp), VerticalSections (CapabilityList, ThemeStatement, ChapterNav, PartnerBand)
- `src/pages/` — Home, Trade (520vh pinned, 4 stages), Logistics (560vh, SOURCE/COORDINATE/MOVE/DELIVER + huge DELIVER. final), Consulting (600vh, 5 stages + EXECUTE. final)
- `src/data/content.js` — all copy from PDFs (verticals, sectors, model steps, future focus, contact, quick facts)

## Implemented (June 2026)
- Homepage: signature line-by-line masked hero reveal + 3D ecosystem sphere, editorial marquee, Who We Are + Quick Facts card, numbered chapter rows (01/02/03) linking to vertical pages, network-driven model flow (Understand→Source→Coordinate→Execute→Deliver), Sectors (with EMERGING tags), Why NAMOA grid + compliance chips (MSME/GeM/TReDS/UNGM), Future Focus (clearly labeled emerging), navy Vision band, Contact section (address + profile PDF download), corporate footer
- Three scroll-driven pinned 3D vertical stories with staged text reveals, stage rail indicators, gold progress bar, next-chapter navigation, Partner band
- Responsive: mobile reduces 3D geometry counts, captions move to bottom, hierarchy preserved
- data-testids across all interactive elements

## Notes / Constraints
- No email/phone in source PDFs — contact section shows registered office address + enquiry categories only. Add real email/phone when user provides them.
- No backend data flows required; backend untouched (template hello world).

## Backlog (P0/P1/P2)
- P0: none — core experience complete and verified
- P1: real email/phone in contact section; favicon + og-image with NAMOA logo
- P2: page transitions between chapters (shared gold node motif), About/leadership page, multilingual, SEO meta per route, deploy to custom domain
