import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Box-shadow / glassmorphism generator state. */
export type ShadowConfig = {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  shadowOpacity: number;
  radius: number;
  shadowColor: string;
  bgColor: string;
  glass: boolean;
  backdropBlur: number;
  bgOpacity: number;
  inset: boolean;
};

/** Gradient generator state. */
export type GradientConfig = {
  type: "linear" | "radial";
  angle: number;
  color1: string;
  color2: string;
};

/** Body sections + freeform blocks (each instance carries its own `data`). */
export type LandingSectionId =
  | "content"
  | "media"
  | "buttons"
  | "spacer"
  | "features"
  | "stats"
  | "logos"
  | "pricing"
  | "testimonial"
  | "faq"
  | "cta"
  | "footer";

/** Per-instance content for freeform blocks (not shared across duplicates). */
export type SectionBlockData = {
  heading?: string;
  body?: string;
  align?: "left" | "center";
  imageUrl?: string;
  imageAlt?: string;
  caption?: string;
  buttonPrimary?: string;
  buttonSecondary?: string;
  spacerHeight?: number;
  /** Custom layer label in the tree panel. */
  layerName?: string;
  paddingTop?: number;
  paddingBottom?: number;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
};

/** Selectable elements inside freeform / frame blocks. */
export type LandingElementId =
  | "heading"
  | "body"
  | "image"
  | "caption"
  | "button-primary"
  | "button-secondary";

export type LandingSelection =
  | { kind: "none" }
  | { kind: "frame"; frame: "nav" | "hero" }
  | { kind: "section"; uid: string }
  | { kind: "element"; uid: string; elementId: LandingElementId };

export type BuilderMode = "design" | "content";

export type LandingSeo = {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
};

export type LandingPage = {
  id: string;
  name: string;
  slug: string;
  sections: LandingSection[];
};

/** Saved block stored in the local component library. */
export type SavedBlockComponent = {
  id: string;
  name: string;
  createdAt: number;
  section: LandingSection;
};

/** Point-in-time snapshot for version history. */
export type LandingVersion = {
  id: string;
  label: string;
  createdAt: number;
  config: LandingConfig;
};

/** Device width used by the preview frame (`@container` queries follow this, not the browser). */
export type PreviewViewport = "desktop" | "tablet" | "mobile";

/** Per-section background band (Figma-style fill override). */
export type SectionBg = "default" | "surface" | "brand" | "contrast";

export type LandingSection = {
  /** Stable instance id (allows duplicate section types on one page). */
  uid: string;
  id: LandingSectionId;
  visible: boolean;
  bg?: SectionBg;
  /** Instance-owned copy/layout — each block is independent (Figma-style). */
  data?: SectionBlockData;
};

/** Available starting-point templates (`scratch` = blank canvas). */
export type LandingTemplate =
  | "scratch"
  | "saas"
  | "startup"
  | "mobile-app"
  | "course"
  | "agency"
  | "consulting"
  | "ecommerce"
  | "portfolio"
  | "photography"
  | "newsletter"
  | "restaurant"
  | "realestate"
  | "fitness"
  | "event"
  | "wedding"
  | "nonprofit";

/** A single editable feature card. */
export type LandingFeature = { title: string; desc: string };

/** A single editable metric/stat. */
export type LandingStat = { value: string; label: string };

/** A single editable FAQ entry. */
export type LandingFaq = { q: string; a: string };

/** A single editable pricing tier. */
export type LandingTier = {
  name: string;
  price: string;
  period: string;
  featured: boolean;
  perks: string[];
};

/** No-code landing-page builder state (theme tokens + content + sections). */
export type LandingConfig = {
  template: LandingTemplate;
  // Theme
  brandName: string;
  brandColor: string;
  font: "sans" | "serif" | "mono";
  radius: number;
  shadow: "none" | "soft" | "sharp" | "glow";
  mode: "light" | "dark";
  heroAlign: "left" | "center";
  density: "compact" | "cozy" | "spacious";
  // Page frame
  showNav: boolean;
  showHero: boolean;
  /** Show the visual under the hero copy (app mockup or custom image). */
  showHeroVisual: boolean;
  /** Optional image URL rendered instead of the built-in app mockup. */
  heroImage: string;
  // Content
  navLinks: string[];
  heroBadge: string;
  heroHeadline: string;
  heroSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaHeadline: string;
  featuresHeading: string;
  features: LandingFeature[];
  statsHeading: string;
  stats: LandingStat[];
  logosHeading: string;
  logos: string[];
  pricingHeading: string;
  pricing: LandingTier[];
  testimonialQuote: string;
  testimonialAuthor: string;
  faqHeading: string;
  faq: LandingFaq[];
  /** Grid column counts for repeatable sections. */
  featureColumns: 2 | 3 | 4;
  statsColumns: 2 | 3 | 4;
  showSecondaryCta: boolean;
  // Multi-page + SEO
  seo: LandingSeo;
  pages: LandingPage[];
  activePageId: string;
  /** Mirror of the active page's sections (kept for save/export compat). */
  sections: LandingSection[];
};

/** Identifiers for each tool in the hub (also used as the DB `tool` column). */
export type ToolId = "landing" | "box-shadow" | "gradient";

/** A row from the `saved_components` table. */
export type SavedComponent = {
  id: string;
  created_at: string;
  name: string | null;
  tool: ToolId;
  class_string: string | null;
  config: Record<string, unknown>;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Returns true when the public Supabase env vars are present. Used by the UI to
 * gracefully disable persistence features instead of throwing.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * A lazily-created singleton browser client. Returns `null` when env vars are
 * missing so the rest of the app can degrade gracefully.
 */
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(supabaseUrl as string, supabaseAnonKey as string);
  }
  return client;
}
