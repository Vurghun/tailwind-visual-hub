import type { LandingTemplate } from "@/lib/supabase";

export type TemplateCategory = {
  id: string;
  label: string;
  description: string;
};

export type TemplateCatalogEntry = {
  id: LandingTemplate;
  name: string;
  tagline: string;
  bestFor: string;
  includes: string[];
  category: string;
  /** Mini preview card styling (matches full template theme). */
  preview: {
    brandColor: string;
    mode: "light" | "dark";
    brandName: string;
    headline: string;
    radius: number;
  };
};

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: "start",
    label: "Start fresh",
    description: "Empty canvas — add your own blocks.",
  },
  {
    id: "product",
    label: "Products & apps",
    description: "SaaS, mobile apps, courses, and software launches.",
  },
  {
    id: "business",
    label: "Business & services",
    description: "Agencies, consulting, and online stores.",
  },
  {
    id: "personal",
    label: "Personal & creators",
    description: "Portfolios, photography, and newsletters.",
  },
  {
    id: "local",
    label: "Local & lifestyle",
    description: "Restaurants, real estate, gyms, and neighborhood brands.",
  },
  {
    id: "events",
    label: "Events & celebrations",
    description: "Conferences, weddings, and ticketed gatherings.",
  },
  {
    id: "community",
    label: "Community & impact",
    description: "Nonprofits, causes, and mission-driven orgs.",
  },
];

export const TEMPLATE_CATALOG: TemplateCatalogEntry[] = [
  {
    id: "scratch",
    name: "Blank canvas",
    tagline: "No sections, no hero — just you",
    bestFor: "Full creative control from zero",
    includes: ["Empty page", "Add blocks freely", "Optional nav & hero"],
    category: "start",
    preview: {
      brandColor: "#6366F1",
      mode: "light",
      brandName: "Your Brand",
      headline: "Start with a blank page",
      radius: 10,
    },
  },
  {
    id: "saas",
    name: "SaaS product",
    tagline: "Classic software landing page",
    bestFor: "B2B apps, dev tools, subscriptions",
    includes: ["Hero + nav", "Features", "Pricing", "FAQ", "Testimonial", "CTA"],
    category: "product",
    preview: {
      brandColor: "#6366F1",
      mode: "light",
      brandName: "Northwind",
      headline: "Launch your product at the speed of thought",
      radius: 12,
    },
  },
  {
    id: "startup",
    name: "Startup launch",
    tagline: "Bold dark-mode product story",
    bestFor: "Beta invites, product hunts, team tools",
    includes: ["Dark hero", "Features", "Stats", "Testimonial", "CTA"],
    category: "product",
    preview: {
      brandColor: "#8B5CF6",
      mode: "dark",
      brandName: "Nova",
      headline: "The future of teamwork is finally here",
      radius: 18,
    },
  },
  {
    id: "mobile-app",
    name: "Mobile app",
    tagline: "App Store download landing page",
    bestFor: "iOS/Android apps, habit trackers, utilities",
    includes: ["App hero", "Features", "Stats", "FAQ", "Download CTA"],
    category: "product",
    preview: {
      brandColor: "#06B6D4",
      mode: "dark",
      brandName: "Pulse",
      headline: "Your daily habits, beautifully tracked",
      radius: 16,
    },
  },
  {
    id: "course",
    name: "Online course",
    tagline: "Cohort or self-paced education",
    bestFor: "Bootcamps, workshops, coaching programs",
    includes: ["Curriculum hero", "Features", "Pricing tiers", "FAQ", "CTA"],
    category: "product",
    preview: {
      brandColor: "#4F46E5",
      mode: "light",
      brandName: "LearnLab",
      headline: "Master modern web development in 8 weeks",
      radius: 10,
    },
  },
  {
    id: "agency",
    name: "Agency / studio",
    tagline: "Portfolio-forward creative shop",
    bestFor: "Design studios, consultancies, client pitches",
    includes: ["Left-aligned hero", "Services", "Logos", "Testimonial"],
    category: "business",
    preview: {
      brandColor: "#F97316",
      mode: "light",
      brandName: "Atlas Studio",
      headline: "We craft brands that move people",
      radius: 4,
    },
  },
  {
    id: "consulting",
    name: "Consulting firm",
    tagline: "Executive advisory & strategy",
    bestFor: "Management consulting, fractional executives",
    includes: ["Trust logos", "Services", "Stats", "Testimonial", "CTA"],
    category: "business",
    preview: {
      brandColor: "#0F766E",
      mode: "light",
      brandName: "Meridian Advisory",
      headline: "Clarity for leaders navigating change",
      radius: 6,
    },
  },
  {
    id: "ecommerce",
    name: "Online store",
    tagline: "Shop-focused product brand",
    bestFor: "DTC brands, boutiques, artisan goods",
    includes: ["Shop hero", "Product benefits", "Reviews", "Membership", "CTA"],
    category: "business",
    preview: {
      brandColor: "#DB2777",
      mode: "light",
      brandName: "Bloom & Co",
      headline: "Everyday essentials, thoughtfully made",
      radius: 14,
    },
  },
  {
    id: "portfolio",
    name: "Personal portfolio",
    tagline: "Freelancer or creator homepage",
    bestFor: "Designers, developers, consultants",
    includes: ["Compact hero", "Work highlights", "Testimonial", "Contact CTA"],
    category: "personal",
    preview: {
      brandColor: "#10B981",
      mode: "dark",
      brandName: "Jordan Lee",
      headline: "Designer & developer crafting digital products",
      radius: 8,
    },
  },
  {
    id: "photography",
    name: "Photography",
    tagline: "Visual portfolio for photographers",
    bestFor: "Wedding, editorial, and commercial photographers",
    includes: ["Gallery hero", "Services", "Packages", "Testimonial", "CTA"],
    category: "personal",
    preview: {
      brandColor: "#A8A29E",
      mode: "dark",
      brandName: "Lens & Light",
      headline: "Stories told in light and shadow",
      radius: 2,
    },
  },
  {
    id: "newsletter",
    name: "Newsletter",
    tagline: "Writer or creator subscription page",
    bestFor: "Substack-style newsletters, paid memberships",
    includes: ["Subscribe hero", "Benefits", "Stats", "Testimonial", "CTA"],
    category: "personal",
    preview: {
      brandColor: "#9333EA",
      mode: "light",
      brandName: "Signal Weekly",
      headline: "The signal in a noisy world",
      radius: 20,
    },
  },
  {
    id: "restaurant",
    name: "Restaurant",
    tagline: "Dining room & reservations",
    bestFor: "Restaurants, cafés, bars, and food brands",
    includes: ["Menu hero", "Highlights", "Reviews", "Reservations CTA"],
    category: "local",
    preview: {
      brandColor: "#C2410C",
      mode: "light",
      brandName: "Ember Kitchen",
      headline: "Fire, flavor, and the warmth of the table",
      radius: 8,
    },
  },
  {
    id: "realestate",
    name: "Real estate",
    tagline: "Agent or brokerage listings",
    bestFor: "Realtors, property managers, luxury homes",
    includes: ["Listings hero", "Services", "Stats", "Testimonial", "CTA"],
    category: "local",
    preview: {
      brandColor: "#1E40AF",
      mode: "light",
      brandName: "Harbor Homes",
      headline: "Find your place by the water",
      radius: 10,
    },
  },
  {
    id: "fitness",
    name: "Gym & fitness",
    tagline: "Membership and class signup",
    bestFor: "Gyms, studios, personal trainers, wellness",
    includes: ["Bold dark hero", "Classes", "Pricing", "Stats", "Free trial CTA"],
    category: "local",
    preview: {
      brandColor: "#DC2626",
      mode: "dark",
      brandName: "Forge Athletics",
      headline: "Stronger every rep, every day",
      radius: 6,
    },
  },
  {
    id: "event",
    name: "Conference / event",
    tagline: "Ticket sales and speaker lineup",
    bestFor: "Conferences, meetups, summits, workshops",
    includes: ["Date + venue hero", "Tracks", "Ticket tiers", "FAQ", "CTA"],
    category: "events",
    preview: {
      brandColor: "#0284C7",
      mode: "light",
      brandName: "SummitConf",
      headline: "Where builders meet the future",
      radius: 12,
    },
  },
  {
    id: "wedding",
    name: "Wedding planner",
    tagline: "Elegant celebration services",
    bestFor: "Planners, venues, florists, bridal brands",
    includes: ["Romantic hero", "Services", "Packages", "FAQ", "Inquire CTA"],
    category: "events",
    preview: {
      brandColor: "#E11D48",
      mode: "light",
      brandName: "Forever & Co",
      headline: "Your love story, beautifully orchestrated",
      radius: 16,
    },
  },
  {
    id: "nonprofit",
    name: "Nonprofit / charity",
    tagline: "Mission-driven donation page",
    bestFor: "Charities, foundations, social impact orgs",
    includes: ["Impact stats", "Programs", "Testimonial", "Donate CTA"],
    category: "community",
    preview: {
      brandColor: "#059669",
      mode: "light",
      brandName: "HopeForward",
      headline: "Clean water changes everything",
      radius: 10,
    },
  },
];

export function templatesInCategory(categoryId: string): TemplateCatalogEntry[] {
  return TEMPLATE_CATALOG.filter((t) => t.category === categoryId);
}
