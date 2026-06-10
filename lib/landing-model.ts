import type { CSSProperties } from "react";
import type {
  LandingConfig,
  LandingElementId,
  LandingPage,
  LandingSection,
  LandingSectionId,
  LandingSeo,
  LandingSelection,
  LandingVersion,
  SavedBlockComponent,
  SectionBg,
  SectionBlockData,
} from "@/lib/supabase";

export const SECTION_LABELS: Record<LandingSectionId, string> = {
  content: "Text block",
  media: "Image block",
  buttons: "Button row",
  spacer: "Spacer",
  logos: "Logo cloud",
  features: "Features",
  stats: "Stats / metrics",
  pricing: "Pricing",
  testimonial: "Testimonial",
  faq: "FAQ",
  cta: "Call to action",
  footer: "Footer",
};

export const ELEMENT_LABELS: Record<LandingElementId, string> = {
  heading: "Heading",
  body: "Body",
  image: "Image",
  caption: "Caption",
  "button-primary": "Primary button",
  "button-secondary": "Secondary button",
};

export const SECTION_BLURBS: Record<LandingSectionId, string> = {
  content: "Heading + paragraph — yours alone, not shared",
  media: "Full-width image with optional caption",
  buttons: "Primary / secondary buttons in a row",
  spacer: "Empty vertical breathing room",
  logos: "A row of customer / partner logos",
  features: "A grid of feature cards",
  stats: "Big-number metrics row",
  pricing: "Pricing tiers with perks",
  testimonial: "A standout customer quote",
  faq: "Common questions, answered",
  cta: "A bold call-to-action banner",
  footer: "Brand mark + copyright",
};

export const FREEFORM_BLOCKS = ["content", "media", "buttons", "spacer"] as const;
export type FreeformBlockId = (typeof FREEFORM_BLOCKS)[number];

export function isFreeformBlock(id: LandingSectionId): id is FreeformBlockId {
  return (FREEFORM_BLOCKS as readonly string[]).includes(id);
}

export const TEMPLATE_SECTIONS: LandingSectionId[] = [
  "logos",
  "features",
  "stats",
  "pricing",
  "testimonial",
  "faq",
  "cta",
  "footer",
];

export const ALL_SECTION_IDS: LandingSectionId[] = [
  ...FREEFORM_BLOCKS,
  ...TEMPLATE_SECTIONS,
];

export type LayerNode = {
  id: string;
  label: string;
  kind: "frame" | "section" | "element";
  uid?: string;
  frame?: "nav" | "hero";
  elementId?: LandingElementId;
  visible: boolean;
  children?: LayerNode[];
};

const COMPONENTS_KEY = "tvh-saved-components";
const VERSIONS_KEY = "tvh-version-history";
const ASSETS_KEY = "tvh-asset-library";

export type AssetItem = { id: string; name: string; url: string; createdAt: number };

export function newId(prefix = "id"): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function defaultBlockData(id: LandingSectionId): SectionBlockData | undefined {
  const defaults: Partial<Record<LandingSectionId, SectionBlockData>> = {
    content: {
      heading: "Your heading",
      body: "Write anything here — click to edit on the page or in the sidebar.",
      align: "left",
    },
    media: { imageUrl: "", imageAlt: "Image", caption: "", align: "center" },
    buttons: {
      buttonPrimary: "Get started",
      buttonSecondary: "Learn more",
      align: "center",
    },
    spacer: { spacerHeight: 64 },
  };
  const d = defaults[id];
  return d ? { ...d } : undefined;
}

export function sectionLabel(section: LandingSection): string {
  return section.data?.layerName?.trim() || SECTION_LABELS[section.id] || section.id;
}

export function getActivePage(cfg: LandingConfig): LandingPage {
  return cfg.pages.find((p) => p.id === cfg.activePageId) ?? cfg.pages[0];
}

/** Keep `sections` in sync with the active page after any section mutation. */
export function withActiveSections(
  cfg: LandingConfig,
  sections: LandingSection[]
): LandingConfig {
  return {
    ...cfg,
    sections,
    pages: cfg.pages.map((p) =>
      p.id === cfg.activePageId ? { ...p, sections } : p
    ),
  };
}

export function withActivePageId(cfg: LandingConfig, pageId: string): LandingConfig {
  const page = cfg.pages.find((p) => p.id === pageId);
  if (!page) return cfg;
  return { ...cfg, activePageId: pageId, sections: page.sections };
}

export function addPage(cfg: LandingConfig, name: string): LandingConfig {
  const id = newId("page");
  const slug = name.toLowerCase().replace(/\s+/g, "-") || "page";
  const page: LandingPage = { id, name, slug, sections: [] };
  return { ...cfg, pages: [...cfg.pages, page], activePageId: id, sections: [] };
}

export function removePage(cfg: LandingConfig, pageId: string): LandingConfig {
  if (cfg.pages.length <= 1) return cfg;
  const pages = cfg.pages.filter((p) => p.id !== pageId);
  const nextActive = pages[0];
  return {
    ...cfg,
    pages,
    activePageId: nextActive.id,
    sections: nextActive.sections,
  };
}

export function renamePage(cfg: LandingConfig, pageId: string, name: string): LandingConfig {
  return {
    ...cfg,
    pages: cfg.pages.map((p) =>
      p.id === pageId ? { ...p, name, slug: name.toLowerCase().replace(/\s+/g, "-") || p.slug } : p
    ),
  };
}

export function buildLayerTree(cfg: LandingConfig): LayerNode[] {
  const nodes: LayerNode[] = [];
  if (cfg.showNav) {
    nodes.push({ id: "frame-nav", label: "Navigation", kind: "frame", frame: "nav", visible: true });
  }
  if (cfg.showHero) {
    nodes.push({
      id: "frame-hero",
      label: "Hero",
      kind: "frame",
      frame: "hero",
      visible: true,
      children: [
        { id: "hero-headline", label: "Headline", kind: "element", visible: true },
        { id: "hero-subtitle", label: "Subtitle", kind: "element", visible: true },
      ],
    });
  }
  for (const s of cfg.sections) {
    const children: LayerNode[] = [];
    if (s.id === "content") {
      children.push(
        { id: `${s.uid}-heading`, label: "Heading", kind: "element", uid: s.uid, elementId: "heading", visible: s.visible },
        { id: `${s.uid}-body`, label: "Body", kind: "element", uid: s.uid, elementId: "body", visible: s.visible }
      );
    } else if (s.id === "media") {
      children.push(
        { id: `${s.uid}-image`, label: "Image", kind: "element", uid: s.uid, elementId: "image", visible: s.visible },
        { id: `${s.uid}-caption`, label: "Caption", kind: "element", uid: s.uid, elementId: "caption", visible: s.visible }
      );
    } else if (s.id === "buttons") {
      children.push(
        { id: `${s.uid}-bp`, label: "Primary", kind: "element", uid: s.uid, elementId: "button-primary", visible: s.visible },
        { id: `${s.uid}-bs`, label: "Secondary", kind: "element", uid: s.uid, elementId: "button-secondary", visible: s.visible }
      );
    }
    nodes.push({
      id: s.uid,
      label: sectionLabel(s),
      kind: "section",
      uid: s.uid,
      visible: s.visible,
      children: children.length ? children : undefined,
    });
  }
  return nodes;
}

export function responsiveHideClass(d: SectionBlockData | undefined): string {
  const parts: string[] = [];
  if (d?.hideOnMobile) parts.push("hidden", "@sm:block");
  if (d?.hideOnTablet) parts.push("@sm:hidden", "@lg:block");
  return parts.join(" ");
}

export function sectionPaddingStyle(d: SectionBlockData | undefined): CSSProperties {
  return {
    paddingTop: d?.paddingTop,
    paddingBottom: d?.paddingBottom,
  };
}

export type A11yIssue = { level: "error" | "warn"; message: string };

export function runA11yChecks(cfg: LandingConfig): A11yIssue[] {
  const issues: A11yIssue[] = [];
  if (!cfg.seo.metaTitle.trim()) {
    issues.push({ level: "warn", message: "Missing page title (SEO tab)." });
  }
  if (!cfg.heroHeadline.trim() && cfg.showHero) {
    issues.push({ level: "warn", message: "Hero has no headline." });
  }
  for (const s of cfg.sections) {
    if (!s.visible) continue;
    if (s.id === "media" && s.data?.imageUrl && !s.data.imageAlt?.trim()) {
      issues.push({
        level: "error",
        message: `Image block "${sectionLabel(s)}" is missing alt text.`,
      });
    }
  }
  const ratio = contrastRatio(cfg.mode === "dark" ? "#F1F5F9" : "#0F172A", cfg.brandColor);
  if (ratio < 4.5) {
    issues.push({
      level: "warn",
      message: `Brand color contrast vs text is ${ratio.toFixed(1)}:1 (aim for 4.5:1).`,
    });
  }
  return issues;
}

function contrastRatio(fg: string, bg: string): number {
  const l1 = relLuminance(parseHex(fg));
  const l2 = relLuminance(parseHex(bg));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function relLuminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function encodeShareConfig(cfg: LandingConfig): string {
  const json = JSON.stringify(cfg);
  if (typeof btoa !== "undefined") {
    return btoa(unescape(encodeURIComponent(json)));
  }
  return Buffer.from(json, "utf-8").toString("base64");
}

export function decodeShareConfig(encoded: string): LandingConfig | null {
  try {
    const json =
      typeof atob !== "undefined"
        ? decodeURIComponent(escape(atob(encoded)))
        : Buffer.from(encoded, "base64").toString("utf-8");
    const raw = JSON.parse(json) as Partial<LandingConfig> & { sections?: LandingSection[] };
    const sections = Array.isArray(raw.sections) ? raw.sections : [];
    const pages = raw.pages ?? normalizePages({}, sections);
    const activePageId =
      raw.activePageId && pages.some((p) => p.id === raw.activePageId)
        ? raw.activePageId
        : pages[0]?.id ?? "home";
    return {
      ...(raw as LandingConfig),
      sections: pages.find((p) => p.id === activePageId)?.sections ?? sections,
      pages,
      activePageId,
      seo: normalizeSeo(raw.seo, raw),
    };
  } catch {
    return null;
  }
}

export function shareUrl(cfg: LandingConfig, origin: string): string {
  return `${origin}/share?d=${encodeURIComponent(encodeShareConfig(cfg))}`;
}

export function loadSavedComponents(): SavedBlockComponent[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPONENTS_KEY);
    return raw ? (JSON.parse(raw) as SavedBlockComponent[]) : [];
  } catch {
    return [];
  }
}

export function saveSavedComponents(list: SavedBlockComponent[]): void {
  localStorage.setItem(COMPONENTS_KEY, JSON.stringify(list));
}

export function loadVersionHistory(designKey: string): LandingVersion[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${VERSIONS_KEY}:${designKey}`);
    return raw ? (JSON.parse(raw) as LandingVersion[]) : [];
  } catch {
    return [];
  }
}

export function pushVersionHistory(
  designKey: string,
  cfg: LandingConfig,
  label: string
): LandingVersion[] {
  const list = loadVersionHistory(designKey).slice(0, 19);
  const entry: LandingVersion = {
    id: newId("v"),
    label,
    createdAt: Date.now(),
    config: structuredClone ? structuredClone(cfg) : JSON.parse(JSON.stringify(cfg)),
  };
  const next = [entry, ...list];
  localStorage.setItem(`${VERSIONS_KEY}:${designKey}`, JSON.stringify(next));
  return next;
}

export function loadAssets(): AssetItem[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(ASSETS_KEY);
    return raw ? (JSON.parse(raw) as AssetItem[]) : [];
  } catch {
    return [];
  }
}

export function saveAssets(list: AssetItem[]): void {
  localStorage.setItem(ASSETS_KEY, JSON.stringify(list));
}

export type AiSuggestion = { label: string; apply: (cfg: LandingConfig) => LandingConfig };

export function buildAiSuggestions(cfg: LandingConfig): AiSuggestion[] {
  const suggestions: AiSuggestion[] = [];
  if (cfg.heroHeadline.length > 60) {
    suggestions.push({
      label: "Shorten hero headline",
      apply: (c) => ({
        ...c,
        heroHeadline: c.heroHeadline.slice(0, 57).trim() + "…",
      }),
    });
  }
  if (cfg.showHero && !cfg.heroSubtitle.trim()) {
    suggestions.push({
      label: "Add hero subtitle",
      apply: (c) => ({
        ...c,
        heroSubtitle: "One clear sentence about what you offer and who it's for.",
      }),
    });
  }
  if (cfg.sections.filter((s) => s.visible && s.id === "cta").length === 0) {
    suggestions.push({
      label: "Add a CTA section",
      apply: (c) =>
        withActiveSections(c, [
          ...c.sections,
          {
            uid: newId("s"),
            id: "cta",
            visible: true,
            bg: "brand" as SectionBg,
          },
        ]),
    });
  }
  if (!cfg.seo.metaDescription.trim()) {
    suggestions.push({
      label: "Fill SEO description from hero",
      apply: (c) => ({
        ...c,
        seo: {
          ...c.seo,
          metaDescription: c.heroSubtitle.slice(0, 160) || c.seo.metaDescription,
          metaTitle: c.seo.metaTitle || c.brandName,
        },
      }),
    });
  }
  return suggestions;
}

export function normalizeSeo(raw: unknown, cfg: Partial<LandingConfig>): LandingSeo {
  const s = raw as Partial<LandingSeo> | undefined;
  return {
    metaTitle: typeof s?.metaTitle === "string" ? s.metaTitle : cfg.brandName || "My Site",
    metaDescription:
      typeof s?.metaDescription === "string"
        ? s.metaDescription
        : cfg.heroSubtitle || "",
    ogImage: typeof s?.ogImage === "string" ? s.ogImage : cfg.heroImage || "",
  };
}

export function normalizePages(
  config: Record<string, unknown>,
  sections: LandingSection[]
): LandingPage[] {
  const raw = config.pages;
  if (Array.isArray(raw) && raw.length) {
    return raw
      .filter((p): p is LandingPage => !!p && typeof p === "object")
      .map((p, i) => ({
        id: typeof p.id === "string" ? p.id : `page-${i}`,
        name: typeof p.name === "string" ? p.name : `Page ${i + 1}`,
        slug: typeof p.slug === "string" ? p.slug : `page-${i}`,
        sections: Array.isArray(p.sections)
          ? (p.sections as LandingSection[])
          : i === 0
            ? sections
            : [],
      }));
  }
  return [{ id: "home", name: "Home", slug: "home", sections }];
}

export function selectionFromLayer(node: LayerNode): LandingSelection {
  if (node.kind === "frame" && node.frame) return { kind: "frame", frame: node.frame };
  if (node.kind === "element" && node.uid && node.elementId) {
    return { kind: "element", uid: node.uid, elementId: node.elementId };
  }
  if (node.kind === "section" && node.uid) return { kind: "section", uid: node.uid };
  return { kind: "none" };
}

export function selectionEquals(a: LandingSelection, b: LandingSelection): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "none" && b.kind === "none") return true;
  if (a.kind === "frame" && b.kind === "frame") return a.frame === b.frame;
  if (a.kind === "section" && b.kind === "section") return a.uid === b.uid;
  if (a.kind === "element" && b.kind === "element") {
    return a.uid === b.uid && a.elementId === b.elementId;
  }
  return false;
}
