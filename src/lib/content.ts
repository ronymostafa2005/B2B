export const agency = {
  name: "B2B.",
  legal: "B2B.",
  former: "2 Agency",
  email: "bbagency@gmail.com",
  phone: "01020738348",
  phoneHref: "tel:+201020738348",
  whatsapp: "+20 10 20736348",
  whatsappHref: "https://wa.me/201020736348",
  facebook: "https://www.facebook.com/share/1DmzzWQXUU/",
  instagram: "https://www.instagram.com/b2b_markting",
  location: "Egypt",
  description:
    "B2B. is the studio for digital marketing, media production, software, and AI product screens. The archive is shipped work: identities, campaigns, and social.",
  vision:
    "To be among the leading marketing and advertising companies in the Middle East, through creative work that uses innovation and current technology, and to be the first partner in a client's success.",
  mission:
    "Professional marketing and advertising that raise awareness of the brand and support growth, and that build a strong link between a company and its customers.",
};

export const whyUs = [
  "A specialized team",
  "Creative ideas",
  "High quality in the files",
  "Deadlines that hold",
  "Integrated solutions",
  "Follow-up that continues",
  "Performance reports on a cycle",
  "A scope set before the files",
] as const;

export const logoClients = [
  "Sweet Home",
  "Chatilli Ghura",
  "Allen X",
  "Zain Store",
  "Balasa Luxury Home Interiors",
  "Tohom",
  "Vitch Chocolate",
  "Sanvix",
  "Blue Outlet",
  "The Invest Real Estate",
  "Metro Mens Wear",
  "Dr. Mahmoud Gobran Dental Clinic",
] as const;

export const marks = [
  { src: "/work/marks/clear/sweet-home.png", name: "Sweet Home" },
  { src: "/work/marks/clear/chatilli.png", name: "Chatilli Ghura" },
  { src: "/work/marks/clear/allen-x.png", name: "Allen X" },
  { src: "/work/marks/clear/zain.png", name: "Zain Store" },
  { src: "/work/marks/clear/balasa.png", name: "Balasa" },
  { src: "/work/marks/clear/tohom.png", name: "Tohom" },
  { src: "/work/marks/clear/vitch.png", name: "Vitch Chocolate" },
  { src: "/work/marks/clear/sanvix.png", name: "Sanvix" },
  { src: "/work/marks/clear/blue-outlet.png", name: "Blue Outlet" },
  { src: "/work/marks/clear/the-invest.png", name: "The Invest" },
  { src: "/work/marks/clear/metro.png", name: "Metro" },
  { src: "/work/marks/clear/gobran.png", name: "Dr. Mahmoud Gobran" },
] as const;

export const studioFrames = [
  { src: "/work/posters/market-01.png", title: "Supermarket", line: "Offers on the phone" },
  { src: "/work/posters/market-02.png", title: "Supermarket", line: "The receipt in the aisle" },
  { src: "/work/posters/market-03.png", title: "Supermarket", line: "Eid box for the week" },
  { src: "/work/posters/market-04.png", title: "Supermarket", line: "The aisle, marked off" },
  { src: "/work/posters/clinic-01.png", title: "Clinic", line: "The pose, with the price" },
  { src: "/work/posters/clinic-02.png", title: "Clinic", line: "Full body, seated" },
  { src: "/work/posters/clinic-03.png", title: "Clinic", line: "The face, close" },
  { src: "/work/posters/clinic-04.png", title: "Clinic", line: "The offer beside the portrait" },
] as const;

export const filmPrograms = [
  {
    id: "production",
    eyebrow: "PROJECT MEDIA PRODUCTION",
    title: "Shot for the brand",
    films: [
      {
        src: "/work/media/prod-01.mp4",
        poster: "/work/media/posters/prod-01.jpg",
        title: "Chicken Hills",
        line: "The shopfront, from the street",
        wide: true,
      },
      {
        src: "/work/media/prod-02.mp4",
        poster: "/work/media/posters/prod-02.jpg",
        title: "At the table",
        line: "A phone, a wallet, the street behind",
      },
      {
        src: "/work/media/prod-03.mp4",
        poster: "/work/media/posters/prod-03.jpg",
        title: "The counter",
        line: "Service, filmed across the glass",
        wide: true,
      },
      {
        src: "/work/media/prod-04.mp4",
        poster: "/work/media/posters/prod-04.jpg",
        title: "On the road",
        line: "A presenter with the car in frame",
      },
    ],
  },
  {
    id: "social",
    eyebrow: "SOCIAL CONTENT",
    title: "Cut for the feed",
    films: [
      {
        src: "/work/media/reel-01.mp4",
        poster: "/work/media/posters/reel-01.jpg",
        title: "The balcony",
        line: "A phone, held in the open air",
      },
      {
        src: "/work/media/reel-02.mp4",
        poster: "/work/media/posters/reel-02.jpg",
        title: "Private universities",
        line: "A presenter, with the campus in frame",
      },
      {
        src: "/work/media/reel-03.mp4",
        poster: "/work/media/posters/reel-03.jpg",
        title: "The square",
        line: "The cafe, seen from above",
        wide: true,
      },
    ],
  },
] as const;

export const studioServices = [
  {
    index: "01",
    title: "Digital Marketing",
    tag: "FEED",
    text: "Offers, seasonal posts, and the supermarket set. The price and the brand stay in the same frame.",
    deliverables: ["Offer posts", "Seasonal set", "Caption direction", "Feed export"],
  },
  {
    index: "02",
    title: "Media Production",
    tag: "FRAME",
    text: "Clinic campaigns, logo films, and the frames that carry a name from the booth to the phone.",
    deliverables: ["Key visual", "Clinic set", "Logo lockup", "Booth frames"],
  },
  {
    index: "03",
    title: "Software Solutions",
    tag: "PRODUCT",
    text: "Product screens for the field and the clinic. Sanvix tracks visits. The Gobran clinic books the next slot.",
    deliverables: ["Sanvix field app", "Clinic booking", "Admin and rep views", "Handover screens"],
  },
  {
    index: "04",
    title: "AI Solutions",
    tag: "ASSIST",
    text: "An assistant inside the product. The clinic screen takes the symptoms and offers a next step.",
    deliverables: ["Clinic assistant", "Symptom prompt", "Next-step screen", "In-product placement"],
  },
] as const;

export const sectors = [
  { id: "all", label: "All" },
  { id: "auto", label: "Automotive" },
  { id: "education", label: "Education" },
  { id: "realestate", label: "Real estate" },
  { id: "places", label: "Places" },
] as const;

export const needs = [
  { id: "all", label: "Any" },
  { id: "campaign", label: "Campaign" },
  { id: "identity", label: "Identity" },
  { id: "social", label: "Social" },
] as const;

export const styles = [
  { id: "all", label: "Any" },
  { id: "bold", label: "Bold" },
  { id: "calm", label: "Calm" },
  { id: "modern", label: "Modern" },
] as const;

export type SectorId = (typeof sectors)[number]["id"];
export type NeedId = Exclude<(typeof needs)[number]["id"], "all">;
export type StyleId = Exclude<(typeof styles)[number]["id"], "all">;
export type NeedFilter = (typeof needs)[number]["id"];
export type StyleFilter = (typeof styles)[number]["id"];

export type Project = {
  slug: string;
  title: string;
  arabic: string;
  sector: Exclude<SectorId, "all">;
  needs: NeedId[];
  styles: StyleId[];
  images: string[];
  alt: string;
  problem: string;
  solution: string;
  keys: string[];
  video?: string;
};

const shots = (slug: string, count: number) =>
  Array.from({ length: count }, (_, index) => `/work/archive/${slug}/${String(index + 1).padStart(2, "0")}.webp`);

export const projects: Project[] = [
  {
    slug: "shark-care",
    title: "Shark Care",
    arabic: "شارك كير",
    sector: "auto",
    needs: ["campaign", "social"],
    styles: ["bold", "modern"],
    images: shots("shark-care", 4),
    alt: "Shark Care greeting campaign over a lit city and mosque.",
    problem: "The brand needed a greeting that still read as Shark Care from across a feed.",
    solution: "Red calligraphy carries the occasion, and the partner marks sit on the road below.",
    keys: ["shark", "شارك", "automotive", "car", "سيارات", "eid", "عيد", "coating", "bold", "حملة", "greeting"],
  },
  {
    slug: "tevo",
    title: "TEVO",
    arabic: "تيفو",
    sector: "auto",
    needs: ["campaign", "social"],
    styles: ["modern", "calm"],
    images: shots("tevo", 3),
    alt: "TEVO night campaign with a crescent, lanterns, and a blue car.",
    problem: "A protection brand can disappear inside a seasonal post.",
    solution: "The crescent, the lanterns, and the car share one night, so the brand stays in the frame.",
    keys: ["tevo", "تيفو", "automotive", "car", "سيارات", "night", "crescent", "eid", "عيد", "حملة"],
  },
  {
    slug: "onyx",
    title: "ONYX Coating",
    arabic: "أونيكس",
    sector: "auto",
    needs: ["campaign", "social"],
    styles: ["calm", "bold"],
    images: shots("onyx", 3),
    alt: "ONYX campaign with a dark SUV in front of a lit mosque.",
    problem: "The coating promise needed a picture people would stop on.",
    solution: "A dark SUV on wet stone, with the mosque holding the occasion behind it.",
    keys: ["onyx", "أونيكس", "coating", "suv", "automotive", "car", "سيارات", "eid", "عيد", "luxury"],
  },
  {
    slug: "protexa",
    title: "PROTEXA",
    arabic: "بروتكسا",
    sector: "auto",
    needs: ["campaign", "social"],
    styles: ["calm", "modern"],
    images: shots("protexa", 4),
    alt: "PROTEXA campaign with a black sedan beside stone arches.",
    problem: "The center needed a greeting that still looked like a paint-protection brand.",
    solution: "Evening stone, a black sedan, and a line that wishes the year well.",
    keys: ["protexa", "بروتكسا", "paint", "protection", "sedan", "mercedes", "automotive", "car", "عيد", "eid"],
  },
  {
    slug: "el-khateeb",
    title: "El-Khateeb",
    arabic: "الخطيب",
    sector: "auto",
    needs: ["identity", "social"],
    styles: ["bold", "modern"],
    images: shots("el-khateeb", 7),
    alt: "El-Khateeb automotive identity applied to social posts.",
    problem: "The name was known, and the posts still changed voice from one week to the next.",
    solution: "One identity system, then a social set that keeps the mark, the type, and the red.",
    keys: ["khateeb", "el-khateeb", "الخطيب", "identity", "هوية", "logo", "شعار", "automotive", "social", "brand"],
  },
  {
    slug: "teachsmart",
    title: "TeachSmart",
    arabic: "تيتش سمارت",
    sector: "education",
    needs: ["campaign", "social"],
    styles: ["modern", "bold"],
    images: shots("teachsmart", 6),
    alt: "TeachSmart education posts for students and programs.",
    problem: "The school offer was split across too many tones.",
    solution: "A social set with one voice for programs, students, and the next intake.",
    keys: ["teachsmart", "teach", "school", "education", "مدرسة", "تعليم", "students", "admissions", "قبول"],
  },
  {
    slug: "applied-school",
    title: "Applied School",
    arabic: "المدرسة التطبيقية",
    sector: "education",
    needs: ["campaign", "social"],
    styles: ["calm", "modern"],
    images: shots("applied-school", 6),
    alt: "Applied School campaign posts.",
    problem: "Parents needed the school to look settled before they asked for a place.",
    solution: "Posts that explain the school in a calm frame, ready for the feed.",
    keys: ["applied", "school", "education", "مدرسة", "تعليم", "parents", "طلاب", "calm", "admissions"],
  },
  {
    slug: "marhaba",
    title: "Marhaba",
    arabic: "مرحبا",
    sector: "education",
    needs: ["campaign", "social"],
    styles: ["bold", "modern"],
    images: shots("marhaba", 6),
    alt: "Marhaba education and camp campaign.",
    problem: "The camp and the plan needed to feel like one place.",
    solution: "A bright set for the camp, the plan, and the welcome.",
    keys: ["marhaba", "مرحبا", "camp", "مخيم", "education", "تعليم", "kids", "أطفال", "school"],
  },
  {
    slug: "new-era",
    title: "New Era",
    arabic: "نيو إيرا",
    sector: "realestate",
    needs: ["campaign", "social"],
    styles: ["modern", "bold"],
    images: shots("new-era", 3),
    alt: "New Era real estate campaign.",
    problem: "A new project needs a first picture that explains the offer.",
    solution: "A short campaign set that puts the project name and the offer in one frame.",
    keys: ["new era", "نيوعيرا", "عقار", "real estate", "property", "tower", "launch", "إطلاق"],
  },
  {
    slug: "aqar-expo",
    title: "Aqar Expo",
    arabic: "عقار إكسبو",
    sector: "realestate",
    needs: ["campaign", "identity"],
    styles: ["modern", "calm"],
    images: shots("aqar-expo", 6),
    alt: "Aqar Expo campaign, including vision and location frames.",
    problem: "An expo lasts a few days, and the booth story has to travel before that.",
    solution: "Frames for the vision, the mission, and the location, built as one exhibition voice.",
    keys: ["aqar", "expo", "عقار", "إكسبو", "exhibition", "معرض", "real estate", "vision", "booth"],
  },
  {
    slug: "rise-tower",
    title: "Rise Tower",
    arabic: "رايز تاور",
    sector: "realestate",
    needs: ["campaign", "social"],
    styles: ["calm", "modern"],
    images: shots("rise-tower", 6),
    alt: "Rise Tower residential campaign.",
    problem: "The tower was real, and the pictures did not yet say who it was for.",
    solution: "A campaign set built around the tower and the offer.",
    keys: ["rise", "tower", "تاور", "برج", "عقار", "real estate", "luxury", "فاخر", "residential"],
  },
  {
    slug: "glory",
    title: "Glory",
    arabic: "جلوري",
    sector: "realestate",
    needs: ["campaign", "social"],
    styles: ["bold", "modern"],
    images: shots("glory", 6),
    alt: "Glory real estate social campaign.",
    problem: "The name needed a picture system, not a single post.",
    solution: "A social run that keeps the Glory name in the same place on every frame.",
    keys: ["glory", "جلوري", "real estate", "عقار", "gold", "luxury", "فاخر", "social"],
  },
  {
    slug: "lux-realty",
    title: "Lux Realty",
    arabic: "لوكس ريالتي",
    sector: "realestate",
    needs: ["campaign", "identity"],
    styles: ["calm", "modern"],
    images: shots("lux-realty", 6),
    alt: "Lux Realty property campaign.",
    problem: "Luxury copy was doing the work the pictures should do.",
    solution: "A property set where the picture leads and the mark stays in place.",
    keys: ["lux", "realty", "luxury", "فاخر", "عقار", "real estate", "property", "calm"],
  },
  {
    slug: "horizon",
    title: "Horizon",
    arabic: "هورايزون",
    sector: "places",
    needs: ["campaign", "social"],
    styles: ["modern", "bold"],
    images: shots("horizon", 6),
    alt: "Horizon social campaign.",
    problem: "The series needed a repeatable frame without looking stamped.",
    solution: "A numbered social run with room for a new line in each post.",
    keys: ["horizon", "هورايزون", "social", "campaign", "حملة", "brand", "modern"],
  },
  {
    slug: "calia",
    title: "Calia",
    arabic: "كاليا",
    sector: "places",
    needs: ["campaign", "social"],
    styles: ["calm", "modern"],
    images: shots("calia", 6),
    alt: "Calia campaign, including a Mother's Day post.",
    problem: "Seasonal posts were drifting away from the brand color.",
    solution: "A soft set that can hold Mother's Day without changing the mark.",
    keys: ["calia", "كاليا", "mother", "عيد الأم", "beauty", "calm", "social", "حملة"],
  },
  {
    slug: "drago",
    title: "Drago",
    arabic: "دراجو",
    sector: "places",
    needs: ["campaign", "social"],
    styles: ["bold", "modern"],
    images: shots("drago", 6),
    alt: "Drago brand campaign.",
    problem: "A strong name still needs a picture people can place.",
    solution: "High-contrast frames that keep Drago loud and readable.",
    keys: ["drago", "دراجو", "bold", "brand", "حملة", "social", "logo"],
  },
  {
    slug: "mas",
    title: "MAS",
    arabic: "ماس",
    sector: "places",
    needs: ["campaign", "social"],
    styles: ["modern", "bold"],
    images: shots("mas", 6),
    alt: "MAS social campaign.",
    problem: "The feed needed a month of posts that still match.",
    solution: "A long social set with one structure and a changing subject.",
    keys: ["mas", "ماس", "social", "feed", "حملة", "brand", "retail"],
  },
];

export const reel = [
  {
    slug: "shark-care",
    src: "/work/reel/shark.webp",
    title: "Shark Care",
    arabic: "شارك كير",
    line: "Red calligraphy over the city. The partners stay on the road.",
  },
  {
    slug: "tevo",
    src: "/work/reel/tevo.webp",
    title: "TEVO",
    arabic: "تيفو",
    line: "A crescent, two lanterns, and the car in the same night.",
  },
  {
    slug: "onyx",
    src: "/work/reel/onyx.webp",
    title: "ONYX",
    arabic: "أونيكس",
    line: "Wet stone, a dark SUV, and the mosque holding the greeting.",
  },
  {
    slug: "protexa",
    src: "/work/reel/protexa.webp",
    title: "PROTEXA",
    arabic: "بروتكسا",
    line: "Evening arches, a black sedan, and a wish for the year.",
  },
] as const;

export const impact = [
  { value: 4, suffix: "+", label: "Years of work" },
  { value: 100, suffix: "+", label: "Projects shipped" },
  { value: 150, suffix: "+", label: "Clients" },
  { value: 15, suffix: "+", label: "People on the team" },
] as const;

export const recipe = [
  {
    step: "01",
    title: "Direction",
    text: "The audience, the season, and the one line the frame has to hold.",
  },
  {
    step: "02",
    title: "Craft",
    text: "Identity, photography, and type. Each piece has to work alone and in the set.",
  },
  {
    step: "03",
    title: "Release",
    text: "Files for the feed, the sign, and the booth. Ready on the morning they are needed.",
  },
] as const;

export const quoteBands = {
  site: { one: [15000, 30000], multi: [28000, 55000] },
  system: { one: [30000, 65000], multi: [55000, 120000] },
  app: { one: [45000, 95000], multi: [80000, 160000] },
  identity: { one: [8000, 18000], multi: [14000, 32000] },
} as const;

export const chapters = [
  { id: "top", label: "Intro" },
  { id: "work", label: "Work" },
  { id: "frame", label: "Frame" },
  { id: "impact", label: "Impact" },
  { id: "contact", label: "Estimate" },
] as const;

export const prompts = [
  "Bold campaign for a car brand",
  "Calm school admissions",
  "Luxury tower launch",
  "A restaurant identity",
] as const;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0) return projects[0];
  return projects[(index + 1) % projects.length];
}

export function filterProjects(sector: SectorId, need: NeedFilter, style: StyleFilter) {
  return projects.filter((project) => {
    const sectorOk = sector === "all" || project.sector === sector;
    const needOk = need === "all" || project.needs.includes(need);
    const styleOk = style === "all" || project.styles.includes(style);
    return sectorOk && needOk && styleOk;
  });
}

export type BriefMatch = {
  slug: string;
  title: string;
  reason: string;
  score: number;
};

const stopWords = new Set([
  "the",
  "a",
  "an",
  "for",
  "and",
  "with",
  "of",
  "to",
  "in",
  "on",
  "or",
  "في",
  "من",
  "على",
  "و",
  "عن",
]);

const fieldLexicon = [
  { id: "auto", label: "Automotive", words: ["automotive", "car", "cars", "suv", "coating", "سيارة", "سيارات"] },
  { id: "education", label: "Education", words: ["school", "schools", "education", "student", "students", "admission", "admissions", "مدرسة", "مدارس", "تعليم"] },
  { id: "realestate", label: "Real estate", words: ["real estate", "tower", "property", "apartment", "villa", "عقار", "عقارات", "برج"] },
  { id: "places", label: "Places and hospitality", words: ["cafe", "café", "restaurant", "mall", "hotel", "hospitality", "كافيه", "مطعم", "مول"] },
  { id: "occasion", label: "Occasions", words: ["world cup", "eid", "ramadan", "occasion", "عيد", "مناسبة", "رمضان", "كأس"] },
] as const;

const outsideWords = ["app", "application", "flutter", "react", "ecommerce", "e-commerce", "software", "saas", "أبلكيشن", "تطبيق", "متجر"];

export type EstimateRead = {
  outside: boolean;
  fieldLabel: string | null;
  kind: keyof typeof quoteBands;
  kindLabel: string;
  sizeLabel: string;
  low: number;
  high: number;
  closestTitle: string | null;
  closestSlug: string | null;
  craft: string;
};

export function readEstimate(query: string): EstimateRead | null {
  const text = query.toLowerCase();
  const tokens = text.split(/[^\p{L}\p{N}]+/u).filter((token) => token.length > 1 && !stopWords.has(token));
  if (tokens.length === 0) return null;

  const includes = (words: readonly string[]) =>
    words.some((word) => {
      if (/[^\p{L}\p{N}]/u.test(word)) return text.includes(word);
      return new RegExp(`(?:^|[^\\p{L}\\p{N}])${word}(?:$|[^\\p{L}\\p{N}])`, "u").test(text);
    });
  if (includes(outsideWords)) {
    return {
      outside: true,
      fieldLabel: null,
      kind: "site",
      kindLabel: "Campaign",
      sizeLabel: "One location",
      low: 0,
      high: 0,
      closestTitle: null,
      closestSlug: null,
      craft: "B2B. designs identities, campaigns, and social. Name the field and the range can be read.",
    };
  }

  const field = fieldLexicon.find((item) => includes(item.words));
  const identity = includes(["logo", "identity", "هوية", "شعار", "packaging", "mark"]);
  const social = includes(["social", "posts", "post", "feed", "سوشيال", "بوست"]);
  const campaign = includes(["campaign", "حملة", "launch", "greeting", "eid", "عيد"]);
  const kind = identity && (campaign || social) ? "app" : identity ? "identity" : social ? "system" : "site";
  const kindLabel = kind === "app" ? "Full brand" : kind === "identity" ? "Identity" : kind === "system" ? "Social set" : "Campaign";
  const multi = includes(["branches", "locations", "several", "multi", "فروع", "more than one"]);
  const size = multi ? "multi" : "one";
  const [low, high] = quoteBands[kind][size];
  const closest = matchBrief(query)[0];
  const craft =
    kind === "identity"
      ? "Identity for the name, the type, and the color."
      : kind === "system"
        ? "A social run that keeps the mark readable from a phone."
        : kind === "app"
          ? "Identity, campaign, and the social set as one job."
          : "A campaign set for the season, the booth, and the feed.";

  return {
    outside: false,
    fieldLabel: field?.label ?? null,
    kind,
    kindLabel,
    sizeLabel: multi ? "More than one" : "One location",
    low,
    high,
    closestTitle: closest?.title ?? null,
    closestSlug: closest?.slug ?? null,
    craft: field ? craft : `${craft} The field is not in the archive, so this is the campaign guide.`,
  };
}

export function matchBrief(query: string): BriefMatch[] {
  const tokens = query
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((token) => token.length > 1 && !stopWords.has(token));

  if (tokens.length === 0) return [];

  return projects
    .map((project) => {
      const hay = [
        project.title,
        project.arabic,
        project.sector,
        project.problem,
        project.solution,
        ...project.needs,
        ...project.styles,
        ...project.keys,
      ]
        .join(" ")
        .toLowerCase();

      const hits = tokens.filter((token) => hay.includes(token));
      const score = hits.reduce((sum, token) => sum + (token.length > 3 ? 3 : 2), 0);
      const lead = hits.slice(0, 3).join(" · ");
      return {
        slug: project.slug,
        title: project.title,
        reason: lead ? `Read “${lead}” in this set. ${project.solution}` : project.solution,
        score,
      };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}
