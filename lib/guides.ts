export type Guide = {
  slug: string;
  title: string;
  summary: string;
  readMinutes: number;
  sections: { heading: string; body: string }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "export-landing-pages",
    title: "How to export landing pages as HTML",
    summary: "Copy, download, or open your page in CodePen — with or without the Tailwind CDN.",
    readMinutes: 4,
    sections: [
      {
        heading: "Start from a template",
        body: "Open the Website tool, pick a template from the Templates tab, then customize copy and colors on the canvas or in the Build sidebar.",
      },
      {
        heading: "Export options",
        body: "Use the toolbar Export menu: Copy HTML (Tailwind CDN), Download HTML, Copy self-contained HTML (inlined styles), Copy JSX snippet, or Open in CodePen for a live sandbox.",
      },
      {
        heading: "Ship it",
        body: "Drop the downloaded .html file on any static host (Netlify, GitHub Pages, S3). For production apps, paste the JSX into a React project and ensure Tailwind is configured.",
      },
    ],
  },
  {
    slug: "box-shadow-recipes",
    title: "Box shadow recipes for Tailwind",
    summary: "Soft cards, glass panels, glow effects, and inset shadows — with copy-ready classes.",
    readMinutes: 3,
    sections: [
      {
        heading: "Pick a preset",
        body: "The Shadow tool includes Soft, Material, Frosted, Brutal, Glow, and Inset presets. Each maps to arbitrary Tailwind shadow and rounded utilities.",
      },
      {
        heading: "Glassmorphism",
        body: "Enable Glass to combine backdrop blur, semi-transparent background, and a subtle border. Tune blur and opacity until the preview matches your design system.",
      },
      {
        heading: "Save and reuse",
        body: "Save designs to Supabase (enable anonymous sign-in) so you can reload exact shadow configs across sessions.",
      },
    ],
  },
  {
    slug: "gradient-backgrounds",
    title: "Gradient backgrounds in Tailwind",
    summary: "Linear and radial gradients as bg-[...] utilities you can paste into any component.",
    readMinutes: 3,
    sections: [
      {
        heading: "Linear vs radial",
        body: "Linear gradients use an angle (degrees) and two color stops. Radial gradients radiate from the center — great for hero backgrounds and badges.",
      },
      {
        heading: "Copy the class",
        body: "The Gradient tool outputs a single Tailwind arbitrary value class like bg-[linear-gradient(...)]. Paste it on any element with a defined size.",
      },
      {
        heading: "Pair with the palette tool",
        body: "Generate a harmonious palette from your brand hex, then plug two shades into the gradient sliders for on-brand backgrounds.",
      },
    ],
  },
  {
    slug: "multi-page-sites",
    title: "Building multi-page sites",
    summary: "Add About, Pricing, and Contact pages inside one project and export each page.",
    readMinutes: 3,
    sections: [
      {
        heading: "Pages panel",
        body: "In the Website builder Build tab, open Pages to add, rename, or switch between pages. Each page has its own section stack.",
      },
      {
        heading: "Shared theme",
        body: "Brand color, fonts, radius, and shadow apply across all pages. Edit content per page in the canvas or inspector.",
      },
      {
        heading: "Export per page",
        body: "Switch to the page you want, then export HTML. Repeat for each route when deploying a static multi-page site.",
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
