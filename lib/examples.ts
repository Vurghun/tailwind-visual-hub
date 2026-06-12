import type { LandingTemplate } from "@/lib/supabase";
import { TEMPLATE_CATALOG } from "@/lib/landing-template-catalog";

export type ExampleEntry = {
  template: LandingTemplate;
  name: string;
  tagline: string;
  category: string;
  brandColor: string;
  mode: "light" | "dark";
};

export const EXAMPLES: ExampleEntry[] = TEMPLATE_CATALOG.filter((t) => t.id !== "scratch").map(
  (t) => ({
    template: t.id,
    name: t.name,
    tagline: t.tagline,
    category: t.category,
    brandColor: t.preview.brandColor,
    mode: t.preview.mode,
  })
);

export const EXAMPLE_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "product", label: "Products" },
  { id: "business", label: "Business" },
  { id: "personal", label: "Personal" },
  { id: "local", label: "Local" },
  { id: "events", label: "Events" },
  { id: "community", label: "Community" },
  { id: "professional", label: "Professional" },
] as const;
