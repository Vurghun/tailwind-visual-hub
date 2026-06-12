import type { LandingSectionId, LandingTemplate, LandingTier } from "@/lib/supabase";
import { defaultBlockData } from "@/lib/landing-model";
import type { LandingConfig, LandingSection, SectionBg, SectionBlockData } from "@/lib/supabase";

type TemplateBase = Omit<LandingConfig, "seo" | "pages" | "activePageId">;

const DEFAULT_PRICING: LandingTier[] = [
  { name: "Starter", price: "$0", period: "/mo", featured: false, perks: ["Core features", "Email support"] },
  { name: "Pro", price: "$29", period: "/mo", featured: true, perks: ["Everything in Starter", "Priority support"] },
  { name: "Team", price: "$99", period: "/mo", featured: false, perks: ["Team seats", "Admin tools"] },
];
const DEFAULT_STATS = [
  { value: "10k+", label: "Active users" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "Avg. rating" },
  { value: "120+", label: "Integrations" },
];
const DEFAULT_LOGOS = ["Acme", "Globex", "Initech", "Umbra", "Hooli"];
const DEFAULT_FAQ = [
  { q: "Can I cancel anytime?", a: "Yes — plans are month-to-month." },
  { q: "Do you offer a free trial?", a: "Every paid plan starts with a 14-day trial." },
  { q: "Is my data secure?", a: "We encrypt data in transit and at rest." },
];

function sec(
  id: LandingSectionId,
  uid: string,
  bg: SectionBg = "default",
  data?: SectionBlockData
): LandingSection {
  return { uid, id, visible: true, bg, data: data ?? defaultBlockData(id) };
}

function base(id: LandingTemplate, brandName: string, brandColor: string, overrides: Partial<TemplateBase>): TemplateBase {
  return {
    template: id,
    brandName,
    brandColor,
    font: "sans",
    radius: 10,
    shadow: "soft",
    mode: "light",
    heroAlign: "center",
    density: "cozy",
    showNav: true,
    showHero: true,
    showHeroVisual: true,
    heroImage: "",
    navLinks: ["Services", "About", "Contact"],
    heroBadge: "",
    heroHeadline: "Your headline",
    heroSubtitle: "Your subtitle.",
    ctaPrimary: "Get started",
    ctaSecondary: "Learn more",
    ctaHeadline: "Ready to get started?",
    featuresHeading: "Why choose us",
    features: [
      { title: "Expert care", desc: "Professional service tailored to your needs." },
      { title: "Trusted team", desc: "Experienced staff focused on quality." },
      { title: "Easy booking", desc: "Schedule online in minutes." },
    ],
    statsHeading: "By the numbers",
    stats: DEFAULT_STATS,
    logosHeading: "Trusted by",
    logos: DEFAULT_LOGOS,
    pricingHeading: "Plans & pricing",
    pricing: DEFAULT_PRICING,
    testimonialQuote: "Outstanding experience from start to finish.",
    testimonialAuthor: "Happy customer",
    faqHeading: "FAQ",
    faq: DEFAULT_FAQ,
    featureColumns: 3,
    statsColumns: 4,
    showSecondaryCta: true,
    sections: [
      sec("features", `${id}-features`),
      sec("testimonial", `${id}-testimonial`),
      sec("cta", `${id}-cta`),
      sec("footer", `${id}-footer`),
    ],
    ...overrides,
  };
}

export const EXTRA_LANDING_TEMPLATES: Pick<
  Record<LandingTemplate, TemplateBase>,
  "dental" | "legal" | "spa" | "podcast" | "hotel"
> = {
  dental: base("dental", "Bright Smile Dental", "#0EA5E9", {
    font: "sans",
    navLinks: ["Services", "Team", "Book"],
    heroBadge: "Family & cosmetic dentistry",
    heroHeadline: "Gentle care for every smile",
    heroSubtitle: "Modern dentistry with same-week appointments, transparent pricing, and a team that puts you at ease.",
    ctaPrimary: "Book appointment",
    ctaSecondary: "Our services",
    featuresHeading: "Comprehensive dental care",
    features: [
      { title: "Preventive care", desc: "Cleanings, exams, and digital X-rays to catch issues early." },
      { title: "Cosmetic dentistry", desc: "Whitening, veneers, and smile makeovers." },
      { title: "Emergency visits", desc: "Same-day slots for urgent dental needs." },
    ],
    stats: [
      { value: "15+", label: "Years serving" },
      { value: "4.9★", label: "Patient rating" },
      { value: "12k", label: "Smiles cared for" },
      { value: "Same week", label: "New patient slots" },
    ],
  }),
  legal: base("legal", "Whitmore & Associates", "#1E3A5F", {
    font: "serif",
    radius: 4,
    heroAlign: "left",
    navLinks: ["Practice areas", "Attorneys", "Consult"],
    heroBadge: "Trial-ready advocacy",
    heroHeadline: "Clear counsel when stakes are high",
    heroSubtitle: "Business litigation, contracts, and advisory services for companies that need decisive legal strategy.",
    ctaPrimary: "Schedule consultation",
    ctaSecondary: "Practice areas",
    logosHeading: "Representing clients featured in",
    logos: ["Wall Street Journal", "Reuters", "American Bar", "Chambers", "Best Lawyers"],
  }),
  spa: base("spa", "Serene Day Spa", "#A855F7", {
    font: "serif",
    mode: "light",
    brandColor: "#9333EA",
    navLinks: ["Treatments", "Packages", "Book"],
    heroBadge: "Wellness · Massage · Skin",
    heroHeadline: "Restore balance, inside and out",
    heroSubtitle: "Luxury treatments in a calm sanctuary — massage, facials, and holistic rituals designed to reset.",
    ctaPrimary: "Book a treatment",
    featuresHeading: "Signature experiences",
    pricingHeading: "Spa packages",
  }),
  podcast: base("podcast", "Signal & Noise", "#F97316", {
    mode: "dark",
    brandColor: "#EA580C",
    navLinks: ["Episodes", "Hosts", "Subscribe"],
    heroBadge: "New episodes every Tuesday",
    heroHeadline: "Stories at the edge of tech and culture",
    heroSubtitle: "Weekly conversations with builders, artists, and thinkers — unfiltered and deeply human.",
    ctaPrimary: "Listen now",
    ctaSecondary: "View episodes",
    showSecondaryCta: true,
    sections: [
      sec("features", "podcast-features"),
      sec("stats", "podcast-stats"),
      sec("testimonial", "podcast-testimonial"),
      sec("cta", "podcast-cta"),
      sec("footer", "podcast-footer"),
    ],
    featuresHeading: "Why listeners subscribe",
    statsHeading: "The show",
    stats: [
      { value: "200+", label: "Episodes" },
      { value: "50k", label: "Weekly listeners" },
      { value: "4.8★", label: "Apple Podcasts" },
      { value: "40+", label: "Countries" },
    ],
  }),
  hotel: base("hotel", "The Linden Hotel", "#854D0E", {
    font: "serif",
    brandColor: "#92400E",
    navLinks: ["Rooms", "Dining", "Reserve"],
    heroBadge: "Boutique · Downtown · 4-star",
    heroHeadline: "A quiet luxury in the heart of the city",
    heroSubtitle: "Thoughtfully designed rooms, seasonal dining, and concierge service that remembers your name.",
    ctaPrimary: "Check availability",
    ctaSecondary: "Explore rooms",
    featuresHeading: "Stay with us",
    pricingHeading: "Room types",
    pricing: [
      { name: "Classic", price: "$189", period: "/night", featured: false, perks: ["Queen bed", "City view", "Breakfast"] },
      { name: "Deluxe", price: "$249", period: "/night", featured: true, perks: ["King bed", "Lounge access", "Late checkout"] },
      { name: "Suite", price: "$399", period: "/night", featured: false, perks: ["Separate living", "Minibar", "Concierge"] },
    ],
  }),
};
