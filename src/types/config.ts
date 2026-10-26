export type SectorId = "auto" | "education" | "realestate" | "places" | string;
export type NeedId = "campaign" | "identity" | "social" | string;
export type StyleId = "bold" | "calm" | "modern" | string;

export interface ProjectConfig {
  slug: string;
  title: string;
  arabic: string;
  sector: SectorId;
  needs: NeedId[];
  styles: StyleId[];
  images: string[];
  alt: string;
  problem: string;
  solution: string;
  keys: string[];
  video?: string;
}

export interface ClientMarkConfig {
  name: string;
  src: string;
}

export interface FilmItemConfig {
  src: string;
  poster: string;
  title: string;
  line: string;
  wide?: boolean;
}

export interface FilmProgramConfig {
  id: string;
  eyebrow: string;
  title: string;
  films: FilmItemConfig[];
}

export interface ServiceItemConfig {
  index: string;
  title: string;
  tag: string;
  text: string;
  deliverables: string[];
}

export interface ImpactItemConfig {
  value: number;
  suffix: string;
  label: string;
}

export interface RecipeStepConfig {
  step: string;
  title: string;
  text: string;
}

export interface NavLinkConfig {
  id: string;
  label: string;
  href: string;
  visible: boolean;
}

export interface TypographyConfig {
  brandFont: string; // e.g. "Playfair Display", "Cairo", "Amiri", "Tajawal", "Outfit", "Montserrat", "Syne"
  bodyFont: string; // e.g. "Plus Jakarta Sans", "Cairo", "Almarai", "Inter", "Tajawal", "Roboto"
  baseFontSize: number; // in pixels (default 16)
  headingScale: number; // multiplier (default 1.0)
  primaryColor: string; // e.g. "#E50914"
  primaryGlow: string; // e.g. "rgba(229, 9, 20, 0.4)"
  backgroundColor: string; // e.g. "#070709"
  cardBackground: string; // e.g. "#0c0c10"
  textColor: string; // e.g. "#F3F4F6"
}

export interface HeaderConfig {
  logoUrl: string;
  logoAlt: string;
  logoHeight: number;
  showNav: boolean;
  navLinks: NavLinkConfig[];
  whatsappCta: {
    label: string;
    show: boolean;
  };
}

export interface HeroSectionConfig {
  visible: boolean;
  badgeText: string;
  titleLead: string;
  titleHighlight: string;
  fields: string[];
  description: string;
  btnShowroomText: string;
  btnArchiveText: string;
  stats: ImpactItemConfig[];
}

export interface ShowroomSectionConfig {
  visible: boolean;
  badgeText: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export interface PortfolioSectionConfig {
  visible: boolean;
  badgeText: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export interface DataStatsSectionConfig {
  visible: boolean;
  badgeText: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export interface ServicesSectionConfig {
  visible: boolean;
  badgeText: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export interface StudioBoardsSectionConfig {
  visible: boolean;
  badgeText: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export interface AboutSectionConfig {
  visible: boolean;
  badgeText: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export interface ContactSectionConfig {
  visible: boolean;
  badgeText: string;
  title: string;
  description: string;
  consultTime: string;
  submitNote: string;
}

export interface SectionsConfig {
  hero: HeroSectionConfig;
  showroom3d: ShowroomSectionConfig;
  portfolio: PortfolioSectionConfig;
  dataStats: DataStatsSectionConfig;
  services: ServicesSectionConfig;
  studioBoards: StudioBoardsSectionConfig;
  about: AboutSectionConfig;
  contact: ContactSectionConfig;
}

export interface AgencyConfig {
  name: string;
  legal: string;
  former: string;
  email: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  whatsappHref: string;
  facebook: string;
  instagram: string;
  location: string;
  description: string;
  vision: string;
  mission: string;
}

export interface FooterConfig {
  logoUrl: string;
  description: string;
  copyrightText: string;
  links: { label: string; href: string }[];
  showBackToTop: boolean;
}

export interface SiteConfig {
  typography: TypographyConfig;
  header: HeaderConfig;
  sections: SectionsConfig;
  agency: AgencyConfig;
  whyUs: string[];
  studioServices: ServiceItemConfig[];
  impact: ImpactItemConfig[];
  recipe: RecipeStepConfig[];
  marks: ClientMarkConfig[];
  filmPrograms: FilmProgramConfig[];
  projects: ProjectConfig[];
  footer: FooterConfig;
}
