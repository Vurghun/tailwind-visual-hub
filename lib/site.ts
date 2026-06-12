export const SITE = {
  name: "Tailwind Visual Hub",
  tagline: "Visual tools for Tailwind CSS",
  description:
    "Build landing pages, craft box-shadow and glass effects, and generate Tailwind CSS — visually, in the browser.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://tailwind-visual-hub.vercel.app",
  github: "https://github.com/Vurghun/tailwind-visual-hub",
  contactEmail: "hello@tailwindvisualhub.com",
} as const;

export const FOOTER_LINKS = [
  { href: "/", label: "Tools" },
  { href: "/examples", label: "Examples" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
] as const;
