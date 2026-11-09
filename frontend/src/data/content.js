export const LOGO_URL =
  "https://customer-assets-gfyr7b9c.emergentagent.net/job_6745efc5-4bf1-4735-a85e-a56c3ad41191/artifacts/dyi28ztd_WhatsApp%20Image%202026-08-22%20at%2012.09.51%20%281%29.jpeg";

export const COMPANY_PROFILE_URL =
  "https://customer-assets-gfyr7b9c.emergentagent.net/job_6745efc5-4bf1-4735-a85e-a56c3ad41191/artifacts/3cs16ap6_COMPANY%20PROFILE%20NAMOA.pdf";

export const VERTICALS = [
  {
    num: "01",
    slug: "/trade",
    title: "Trade & Procurement",
    theme: "CONNECTION",
    tagline: "Connecting Demand with Reliable Supply.",
    description:
      "Sourcing, procurement and distribution across multiple product categories, supported by vendor aggregation and trade networks.",
    capabilities: [
      "Multi-category goods supply",
      "Wholesale trading",
      "Distribution",
      "Import–export facilitation",
      "Vendor sourcing",
      "Vendor aggregation",
    ],
    cta: "Explore Trade & Procurement",
  },
  {
    num: "02",
    slug: "/logistics",
    title: "Logistics & Supply Chain",
    theme: "MOVEMENT",
    tagline: "Moving Products. Coordinating Networks.",
    description:
      "Logistics and supply-chain coordination through a flexible partner network designed to support diverse project and commercial requirements.",
    capabilities: [
      "End-to-end logistics coordination",
      "Freight and cargo handling support",
      "Warehousing coordination",
      "Supply-chain optimization",
      "Delivery management",
    ],
    cta: "Explore Supply Chain Solutions",
  },
  {
    num: "03",
    slug: "/consulting",
    title: "Consulting & Business Support",
    theme: "INTELLIGENCE",
    tagline: "From Strategy to Execution.",
    description:
      "Supporting organizations with procurement advisory, project coordination, vendor development and operational strategy.",
    capabilities: [
      "Procurement advisory",
      "Business consulting",
      "Operational strategy",
      "Project coordination",
      "Execution support",
      "Vendor development",
      "Vendor management",
    ],
    cta: "Explore Business Support",
  },
  {
    num: "04",
    slug: "/marketing",
    title: "Marketing",
    theme: "VISION",
    tagline: "Building Brands. Driving Growth.",
    description:
      "End-to-end marketing support — from brand strategy and digital presence to campaign execution and market positioning.",
    capabilities: [
      "Brand strategy & identity",
      "Digital marketing",
      "Campaign management",
      "Market positioning",
      "Content & communications",
      "Growth & demand generation",
    ],
    cta: "Explore Marketing",
  },
];

export const SECTORS = [
  {
    num: "01",
    title: "General Trading & Commodities",
    copy: "Sourcing, trading and distribution across diverse product categories.",
  },
  {
    num: "02",
    title: "Infrastructure & Project Supply Chains",
    copy: "Supporting procurement and coordination requirements associated with infrastructure and project execution.",
  },
  {
    num: "03",
    title: "Logistics & Transportation",
    copy: "Coordinating movement, freight and delivery through partner networks.",
  },
  {
    num: "04",
    title: "Renewable Energy",
    copy: "Solar infrastructure and large-scale renewable energy projects.",
    emerging: true,
  },
  {
    num: "05",
    title: "Government & Institutional Procurement",
    copy: "Building capabilities to participate in institutional and public procurement opportunities.",
    emerging: true,
  },
];

export const WHY_NAMOA = [
  {
    title: "Multi-Sector Capability",
    copy: "One platform capable of supporting diverse commercial and project requirements.",
  },
  {
    title: "Network-Driven Execution",
    copy: "Strategic vendor, logistics and business partnerships rather than heavy internal infrastructure.",
  },
  {
    title: "Scalable Operations",
    copy: "A model that expands capabilities according to project requirements.",
  },
  {
    title: "Integrated Solutions",
    copy: "Procurement, logistics and delivery coordination brought together through one platform.",
  },
  {
    title: "Project-Based Flexibility",
    copy: "Execution models adapted to the requirements of individual projects.",
  },
  {
    title: "Cost-Efficient Approach",
    copy: "An asset-light operating model with no heavy upfront infrastructure dependency.",
  },
];

export const MODEL_STEPS = [
  { num: "01", title: "Understand", copy: "Identify client requirements." },
  { num: "02", title: "Source", copy: "Connect with suitable suppliers and vendors." },
  { num: "03", title: "Coordinate", copy: "Integrate procurement, logistics and project requirements." },
  { num: "04", title: "Execute", copy: "Manage project-based delivery through our partner network." },
  { num: "05", title: "Deliver", copy: "Create reliable and efficient outcomes." },
];

export const FUTURE_FOCUS = [
  "Renewable Energy",
  "Infrastructure & Project Facilitation",
  "Government & International Procurement",
  "Multi-Country Supply Networks",
  "Land & Project Facilitation",
];

export const CONTACT = {
  addressLines: [
    "Shop No. 136, First Floor,",
    "Vasudev Sky High, Kanakia Road,",
    "Mira Road (East), Thane – 401107,",
    "Maharashtra, India",
  ],
  enquiries: [
    "Business Enquiries",
    "Partnership Opportunities",
    "Vendor & Supplier Registration",
    "Project Opportunities",
    "Procurement Requirements",
  ],
};

// NAMOA's own social profiles, linked from the About section. Tracking
// parameters from the share links (utm_source, mibextid) are stripped.
export const NAMOA_SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/namoaglobalventures/" },
  { label: "Facebook", href: "https://www.facebook.com/share/1LiqFwLN6q/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/namoa-global-ventures/" },
];

// Sector tiles for the "Our Work" section on the home page. Each business in
// SUPPORTED_BUSINESSES below carries a `sector` field matching one `title`
// here — the section groups by that match rather than listing businesses
// individually, and a tile only appears once a business names its sector.
// Order here is display order. `icon` is a key into SECTOR_ICONS
// (lib/sectorIcons.js) — kept as a string so this file stays plain data.
export const SUPPORTED_SECTORS = [
  {
    num: "01",
    slug: "healthcare-medical-services",
    title: "Healthcare & Medical Services",
    tagline: "PRECISION IN CARE.",
    description: "Diagnostic imaging, dental and maxillofacial surgical care.",
    icon: "HeartPulse",
  },
  {
    num: "02",
    slug: "infrastructure-development",
    title: "Infrastructure & Development",
    tagline: "BUILT TO LAST.",
    description: "Civil infrastructure, fabrication and project build.",
    icon: "HardHat",
  },
  {
    num: "03",
    slug: "agriculture-organic-products",
    title: "Agriculture & Organic Products",
    tagline: "GROWN WITH CARE.",
    description: "Organic farming, cold-pressed oils and agro products.",
    icon: "Sprout",
  },
  {
    num: "04",
    slug: "design-built-environment",
    title: "Design & Built Environment",
    tagline: "SPACES, REALIZED.",
    description: "Interior and exterior design, build and finishing.",
    icon: "Sofa",
  },
  {
    num: "05",
    slug: "automotive-services-mobility",
    title: "Automotive Services & Mobility",
    tagline: "KEEPING FLEETS MOVING.",
    description: "Vehicle service and genuine spare parts supply.",
    icon: "Car",
  },
  {
    num: "06",
    slug: "geological-survey-solutions",
    title: "Geological & Survey Solutions",
    tagline: "READING THE GROUND.",
    description: "Geological, hydrogeological and geospatial survey consultancy.",
    icon: "Compass",
  },
  {
    num: "07",
    slug: "hospitality",
    title: "Hospitality",
    tagline: "STAY. DINE. CELEBRATE. EXPERIENCE.",
    description: "Resort stays, dining and event venues for every occasion.",
    subSectors: [
      {
        title: "Events & Experiences",
        description:
          "Curated events, celebrations and experiential activations — from weddings and corporate offsites to themed gatherings and live experiences.",
      },
    ],
    icon: "ConciergeBell",
  },
];

// Businesses NAMOA has supported. Rendered grouped by sector (SUPPORTED_SECTORS
// above) on the home page and on each /work/:slug sector page. Optional fields
// (website, logo, namoaRole, results, about) are omitted rather than left
// blank — the section only renders what is present, so a partially-filled
// entry still looks finished. `namoaServices` is the one-line account of what
// NAMOA did for the company, shown on its card in NAMOA's voice.
export const SUPPORTED_BUSINESSES = [
  {
    num: "01",
    name: "Dr Sandhyas Diagnostics and Scan Centre",
    sector: "Healthcare & Medical Services",
    business: "Diagnostic Services",
    location: "Nalgonda, Telangana",
    established: "2025",
    expertise: ["Fetal Medicine"],
    vision: "Precision in every test, care in every touch.",
    mission: "Connecting technology with compassionate diagnostic care.",
    usp: "Affordable and compassionate diagnostic care.",
    market: "Nalgonda",
    leadership: [
      { name: "Dr Sandhya Rani Borra", role: "Managing Director" },
      { name: "Shankar Padidhala", role: "Leadership Team" },
    ],
    contact: {
      email: "drsandhyasscan@gmail.com",
      phone: "+91 92464 92595",
      phoneRaw: "+919246492595",
    },
    namoaServices:
      "NAMOA provided business consulting and marketing services to Dr Sandhyas Diagnostics — positioning its fetal medicine and diagnostic care, and building patient reach across Nalgonda.",
    // Pending from NAMOA management (section 8 of the intake form).
    namoaRole: [],
  },
  {
    num: "02",
    name: "PR Samrat Associates",
    sector: "Design & Built Environment",
    business: "Interior & Exterior Design",
    location: "Suryapet, Telangana",
    market: "Telangana",
    // Their strongest, hardest-to-dispute number — carries the card in place
    // of a vision quote.
    highlight: { value: "60+", label: "Projects delivered for Aparna" },
    clients: ["Aparna", "Rajapushpa", "Aditya"],
    trades: ["Carpentry", "Painting", "Electrical", "Contracting", "Building"],
    recognition: "Iconic Interiors",
    leadership: [
      { name: "Shanker P.", role: "Founder" },
      { name: "Mrs. Mercy Lilly Janakiram", role: "Managing Director" },
    ],
    contact: {
      phone: "+91 89773 60767",
      phoneRaw: "+918977360767",
    },
    namoaServices:
      "NAMOA provided procurement and vendor coordination services to PR Samrat Associates — connecting its interior and exterior projects with dependable material suppliers across Telangana.",
    // About / vision / mission / USP as submitted were generic industry
    // boilerplate (and named competitor brands), so they are held back pending
    // copy written about this firm.
    namoaRole: [],
  },
  {
    num: "03",
    name: "BVK Super Speciality Dental Maxillofacial Trauma Care and Implant Center",
    sector: "Healthcare & Medical Services",
    business: "Dental & Maxillofacial Surgery",
    location: "Suryapet, Telangana",
    established: "2020",
    market: "Suryapet, Telangana",
    expertise: ["Facial Trauma & Pathologies", "Dental Implants"],
    vision: "To provide oral health care to rural areas and to those in need.",
    mission: "Advancing surgical expertise across the head and neck region.",
    usp: "Minor and major oral and facial surgery alongside general dental care.",
    future: ["Hair Transplant", "Facial Aesthetics"],
    leadership: [
      { name: "Dr B. Vamshi Krishna", role: "Founder & Managing Director" },
      { name: "Rishi Boddu", role: "NAMOA Global Ventures" },
    ],
    contact: {
      email: "bvkomfs@gmail.com",
      phone: "+91 94945 28628",
      phoneRaw: "+919494528628",
    },
    social: [{ label: "Instagram", href: "https://www.instagram.com/bvkomfs" }],
    namoaServices:
      "NAMOA provided business consulting and marketing services to BVK Super Speciality Dental — strengthening its brand and patient outreach, and planning its move into hair transplant and facial aesthetics.",
    namoaRole: [],
  },
  {
    num: "04",
    name: "SpareHub",
    legalName: "Eshwaraa Enterprises",
    sector: "Automotive Services & Mobility",
    business: "Automotive Spare Parts & Service",
    location: "Nagole, Hyderabad",
    established: "2025",
    // Submitted as "all over the world"; held to the head-office region until
    // NAMOA confirms what the reach actually is.
    market: "Hyderabad, Telangana",
    expertise: ["Vehicle Service", "Spare Parts Supply"],
    highlight: {
      value: "12 yrs",
      label: "Leadership experience in automobile sales and service",
    },
    services: [
      "Doorstep vehicle service",
      "Doorstep delivery",
      "Genuine quality parts",
      "Fast delivery",
    ],
    partnerships: "Open to partnership and investment",
    leadership: [
      { name: "T Archana", role: "Founder & Managing Director" },
      { name: "G Sreenadh", role: "Leadership Team" },
    ],
    contact: {
      email: "tarchana1359@gmail.com",
      phone: "+91 94935 20549",
      phoneRaw: "+919493520549",
    },
    namoaServices:
      "NAMOA provided procurement and logistics services to SpareHub — sourcing genuine spare parts through its vendor network and coordinating the supply behind doorstep service and delivery.",
    namoaRole: [],
  },
  {
    num: "05",
    name: "Farmstory",
    sector: "Agriculture & Organic Products",
    business: "Cold-Pressed Oils & Spices",
    location: "Bachupally, Hyderabad",
    established: "2026",
    market: "India",
    expertise: ["Retail & B2C"],
    vision:
      "To bring the goodness of traditionally made, cold-pressed oils from farmers to every family.",
    about:
      "Farmstory is our journey from farmers to your family. We carefully source quality seeds from farmers and make cold-pressed cooking oils with care. Our goal is to bring the natural taste and goodness of traditional oils to your kitchen — from every seed to every bottle.",
    products: ["Cold-pressed oils", "Spices"],
    partners: ["PJR Farms"],
    partnerships: "Open to partnership and investment",
    leadership: [
      { name: "Rajashekar Borra", role: "Founder & Managing Director" },
      { name: "Navaneeth Reddy", role: "Leadership Team" },
    ],
    contact: {
      email: "farmstory.oils@gmail.com",
      phone: "+91 80745 41248",
      phoneRaw: "+918074541248",
    },
    social: [{ label: "Instagram", href: "https://www.instagram.com/farm.story1" }],
    namoaServices:
      "NAMOA provided marketing and supply-chain services to Farmstory — building the brand behind its cold-pressed oils and coordinating the journey from farm sourcing to family kitchens.",
    namoaRole: [],
  },
  {
    num: "06",
    name: "Nexus Rover Survey",
    gstin: "36APGPP6107G2ZV",
    sector: "Geological & Survey Solutions",
    business: "Geological & Hydrogeological Survey Consultancy",
    location: "Khammam & Hyderabad, Telangana",
    established: "2025",
    market: "India · Tanzania, Zambia, Nigeria, Saudi Arabia",
    experience: "17+ years in groundwater exploration and surface geophysics",
    expertise: [
      "Subsurface resistivity & magnetic mapping",
      "2D Electrical Resistivity Tomography",
      "Aquifer parameter estimation",
      "Mineral target generation",
      "Spatial watershed modelling",
    ],
    instruments: "Advanced resistivity meters · High-precision GPS · UAV survey · Res2dINV, Surfer, ArcGIS",
    vision:
      "To be a premier Earth Science and Hydrogeological consulting firm in India, distinguished for technical rigour, innovative methodologies and sustainable environmental stewardship.",
    about:
      "An integrated Earth Science consultancy delivering multidisciplinary geological, hydrogeological, geophysical and geospatial solutions. The firm supports natural resource governance, environmental impact mitigation and infrastructure site suitability through accurate subterranean data — combining seasoned field hydrogeologists with advanced computational processing.",
    services: [
      "Hydrogeological studies",
      "Groundwater exploration",
      "Resistivity surveys (VES / ERT)",
      "Remote sensing & GIS mapping",
      "Watershed delineation",
      "Artificial recharge design",
      "Rock & soil profiling",
      "Environmental impact assessment",
      "Mineral exploration surveys",
    ],
    future: [
      "3D ERT subsurface modelling",
      "UAV photogrammetry",
      "Precision agri hydro-analytics",
    ],
    partners: ["Geotechnical laboratories", "Civil engineering contractors", "Drilling enterprises"],
    recognition:
      "Registered and empanelled hydrogeological practitioner, Telangana State Ground Water Department",
    partnerships:
      "Consortium bids for municipal and industrial water security, watershed restoration and mineral exploration joint ventures",
    leadership: [
      { name: "Palle Narender", role: "Founder, Managing Partner & Sr. Hydrogeologist" },
      { name: "Sainadh Ponugoti", role: "Chief Executive Officer & Geologist" },
      { name: "Anand Kumar Veravalli", role: "Chief Advisor" },
      { name: "Thogaru Rajesh", role: "Sr. Geologist" },
      { name: "Ponugoti ShabariNadh", role: "Geologist" },
    ],
    contact: {
      email: "nexusroversurvey@gmail.com",
      phone: "+91 98486 82704",
      phoneRaw: "+919848682704",
    },
    namoaServices:
      "NAMOA provided business consulting and project coordination services to Nexus Rover Survey — structuring consortium bids and connecting its survey expertise with infrastructure and water-security projects.",
    // First company to return section 8 of the intake form.
    namoaRole: [
      "Earth Sciences and geo-analytics vertical for the Group",
      "Groundwater auditing and statutory certification",
      "Mine and quarry siting, GIS-based spatial planning",
      "Ground stability and land-use risk on NAMOA projects",
    ],
  },
  {
    num: "07",
    name: "PJR Farm & Agro Products",
    sector: "Agriculture & Organic Products",
    business: "Organic Agro Products",
    location: "Suryapet, Telangana",
    established: "2017",
    market: "Beebiguda, Suryapet",
    products: ["Organic Brown Rice"],
    future: ["Turmeric", "Honey", "A2 Ghee", "Cold-Pressed Oils"],
    partners: ["Farm Story"],
    partnerships: "Partnership with Farm Story",
    leadership: [
      { name: "Padidhala Janakiram", role: "Founder & Promoter" },
      { name: "Shankar Padidhala", role: "Managing Director & CEO" },
      { name: "Rishi Boddu", role: "Leadership Team" },
    ],
    contact: {
      phone: "+91 99121 14178",
      phoneRaw: "+919912114178",
    },
    social: [
      { label: "Instagram", href: "https://www.instagram.com/pjr_farm_agroproducts/" },
    ],
    namoaServices:
      "NAMOA provided marketing and distribution services to PJR Farm & Agro Products — taking its organic brown rice to wider markets and supporting its expansion into turmeric, honey, A2 ghee and cold-pressed oils.",
    // About / vision / mission / USP not yet supplied.
    namoaRole: [],
  },
  {
    num: "08",
    name: "Vasishta Infrabuild",
    legalName: "Vasishta Infrabuild Private Limited",
    sector: "Infrastructure & Development",
    location: "Gandhidham, Gujarat",
    established: "2021",
    market: "Gujarat, Hyderabad",
    leadership: [
      { name: "Chaitanya Talla", role: "Founder & Promoter" },
      { name: "Rishi Boddu", role: "Leadership Team" },
    ],
    contact: {
      phone: "+91 99894 79267",
      phoneRaw: "+919989479267",
    },
    namoaServices:
      "NAMOA provided procurement and project coordination services to Vasishta Infrabuild — sourcing materials and vendors for its infrastructure projects across Gujarat and Hyderabad.",
    // Primary business, about / vision / mission / USP not yet supplied.
    namoaRole: [],
  },
  {
    num: "09",
    name: "Steel Span Infra",
    website: "https://steelspaninfra.com/",
    sector: "Infrastructure & Development",
    business: "Fabrication Works",
    location: "Kismatpur, Hyderabad",
    established: "2024",
    market: "Hyderabad, Bengaluru",
    highlight: {
      value: "30,000 sq ft",
      label: "Shed constructed in 90 days for Sai Paradise Machine Tools",
    },
    clients: ["Sai Paradise Machine Tools"],
    leadership: [{ name: "Kama Deepak", role: "Founder & Promoter" }],
    contact: {
      phone: "+91 90597 59748",
      phoneRaw: "+919059759748",
    },
    namoaServices:
      "NAMOA provided procurement and logistics services to Steel Span Infra — coordinating steel sourcing and material movement for its fabrication projects across Hyderabad and Bengaluru.",
    // About / vision / mission / USP not yet supplied.
    namoaRole: [],
  },
  {
    num: "10",
    name: "Tridalam Resort",
    sector: "Hospitality",
    business: "Resort, Dining & Event Venue",
    location: "North Bangalore, Karnataka",
    market: "Bangalore Region · Near Kempegowda International Airport",
    highlight: {
      value: "1,000",
      label: "Guests hosted at the Grand Open Lawn",
    },
    expertise: [
      "Banquet Hall — up to 250 guests",
      "Grand Open Lawn — up to 1,000 guests",
      "Amphitheatre — up to 150 guests",
    ],
    about:
      "Tridalam Resort brings comfort, luxury and nature together in North Bangalore, minutes from Kempegowda International Airport — 12 Deluxe Rooms and 2 Luxury Suites, multi-cuisine dining, and indoor and outdoor venues built for everything from weddings to corporate offsites.",
    services: [
      "Multi-Cuisine Restaurant",
      "Coffee Shop",
      "Swimming Pool",
      "Bonfire Area",
      "Landscaped Gardens",
      "Indoor & Outdoor Event Spaces",
    ],
    principles: [
      "Prime location near Kempegowda International Airport",
      "Elegant stay with premium comfort",
      "Delicious food and warm hospitality",
      "Spacious indoor and outdoor venues",
      "Ideal destination for every celebration",
    ],
    namoaServices:
      "NAMOA provided marketing and events services to Tridalam Resort — promoting its stays, dining and venues, and bringing weddings, corporate offsites and curated experiences to its spaces.",
    // Established year, leadership, contact and social not yet supplied —
    // the submission was promotional copy rather than the intake form.
    namoaRole: [],
  },
];

// Companies that partner with NAMOA itself — building or running parts of the
// ecosystem (technology, knowledge, operational) — rather than businesses
// NAMOA supports. Kept deliberately separate from SUPPORTED_BUSINESSES so the
// two never blur together: this is "who helps build NAMOA", not "who NAMOA
// helps build". Rendered by the StrategicPartners section, reusing BusinessCard
// — `sector` here holds the partner's role instead of an industry, since that's
// the badge BusinessCard already renders top-right.
export const STRATEGIC_PARTNERS = [
  {
    num: "01",
    name: "AADRIQUE",
    legalName: "AADRIQUE Tech Pvt. Ltd.",
    website: "https://aadrique.in",
    sector: "Strategic Technology & Digital Transformation Partner",
    business: "AI Transformation & Software Engineering",
    location: "Kondapur, Hyderabad",
    established: "2026",
    market: "India · Global (remote-enabled)",
    expertise: [
      "Artificial Intelligence & Generative AI",
      "AI Agents & Voice AI",
      "Custom Software Engineering",
      "Digital Transformation",
      "Business Process Automation",
      "System & Solution Architecture",
      "Web & Application Development",
      "Scalable Digital Platforms",
    ],
    vision:
      "To enable businesses to become more intelligent, scalable and future-ready through purposeful technology and AI.",
    about:
      "AADRIQUE Tech Pvt. Ltd. is an AI Transformation and Software Engineering company focused on building technology solutions that create measurable business value. We work with businesses to identify core operational and technology challenges before designing and implementing the right digital, AI and software solutions — from custom platforms and intelligent automation to AI-powered systems.",
    mission:
      "To engineer practical digital and AI solutions that solve real business problems, improve operational efficiency and create measurable business impact.",
    usp: "Build. Transform. Scale.",
    services: [
      "AI Transformation",
      "Custom Software Engineering",
      "Digital Product Development",
      "AI-Powered Applications & Systems",
      "Business Process Automation",
      "AI Voice Agents",
      "Web & Digital Platform Development",
      "Technology Consulting",
      "System & Solution Architecture",
    ],
    future: [
      "Agentic AI",
      "Generative AI",
      "Industry-Specific AI Solutions",
      "AI-Powered Enterprise Platforms",
    ],
    principles: [
      "Business-first technology approach",
      "Senior-led engineering and architecture",
      "Custom technology solutions",
      "AI applied to real business problems",
      "End-to-end product development",
      "Intelligent automation",
      "Scalable and future-ready systems",
      "Focus on measurable business outcomes",
    ],
    partnerships: "Open to technology partnerships in AI, software engineering and digital transformation.",
    leadership: [{ name: "Guna Sanjay Sagar", role: "Founder & Managing Director" }],
    contact: {
      email: "info@aadrique.in",
    },
    social: [
      { label: "Instagram", href: "https://www.instagram.com/aadriqueofficial/" },
      { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61593019507941" },
    ],
    // Named clients/projects (Balcony Originals, NAMOA Group) held back — the
    // submission itself flags they need confirmation from both organisations
    // before publishing. Phone number also not yet supplied.
    namoaRole: [],
  },
];
