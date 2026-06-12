import type {
  LandingConfig,
  LandingSection,
  LandingSectionId,
  LandingTier,
  SectionBg,
  SectionBlockData,
} from "@/lib/supabase";
import {
  defaultBlockData,
  normalizeSeo,
  normalizePages,
  ALL_SECTION_IDS,
} from "@/lib/landing-model";
import {
  DEFAULT_FAQ,
  DEFAULT_LOGOS,
  DEFAULT_PRICING,
  DEFAULT_STATS,
  finalizeLanding,
  LANDING_TEMPLATES,
} from "@/lib/landing-templates";

const DEFAULT_LANDING: LandingConfig = finalizeLanding(LANDING_TEMPLATES.scratch);

function normalizeBg(raw: unknown): SectionBg | undefined {
  if (raw === "surface" || raw === "brand" || raw === "contrast") return raw;
  return undefined;
}

/** Validate a saved `sections` list; each instance carries its own `uid`. */
function normalizeSections(config: Record<string, unknown>): LandingConfig["sections"] {
  const raw = config.sections;
  if (Array.isArray(raw)) {
    return raw
      .filter(
        (s): s is LandingSection & { visible?: boolean } =>
          !!s &&
          typeof s === "object" &&
          ALL_SECTION_IDS.includes((s as { id: LandingSectionId }).id)
      )
      .map((s, i) => {
        const id = (s as { id: LandingSectionId }).id;
        const rawData = (s as { data?: SectionBlockData }).data;
        return {
          uid: typeof s.uid === "string" && s.uid ? s.uid : `${id}-${i}`,
          id,
          visible: s.visible !== false,
          bg: normalizeBg(s.bg),
          data:
            rawData && typeof rawData === "object"
              ? { ...defaultBlockData(id), ...rawData }
              : defaultBlockData(id),
        };
      });
  }
  const legacy = config as {
    showFeatures?: boolean;
    showPricing?: boolean;
    showFooter?: boolean;
  };
  return [
    { uid: "legacy-features", id: "features", visible: legacy.showFeatures !== false },
    { uid: "legacy-pricing", id: "pricing", visible: legacy.showPricing !== false },
    { uid: "legacy-footer", id: "footer", visible: legacy.showFooter !== false },
  ];
}

function normalizeNavLinks(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    const links = raw.filter((l): l is string => typeof l === "string");
    if (links.length) return links;
  }
  return DEFAULT_LANDING.navLinks;
}

function normalizePricing(raw: unknown): LandingTier[] {
  if (Array.isArray(raw)) {
    const tiers = raw
      .filter((t): t is LandingTier => !!t && typeof t === "object")
      .map((t) => ({
        name: String(t.name ?? "Plan"),
        price: String(t.price ?? "$0"),
        period: String(t.period ?? "/mo"),
        featured: Boolean(t.featured),
        perks: Array.isArray(t.perks)
          ? t.perks.filter((p): p is string => typeof p === "string")
          : [],
      }));
    if (tiers.length) return tiers;
  }
  return DEFAULT_PRICING;
}

function normalizeStrings(raw: unknown, fallback: string[]): string[] {
  if (Array.isArray(raw)) {
    const list = raw.filter((s): s is string => typeof s === "string");
    if (list.length) return list;
  }
  return fallback;
}

function normalizeStats(raw: unknown): LandingConfig["stats"] {
  if (Array.isArray(raw)) {
    const list = raw
      .filter((s): s is LandingConfig["stats"][number] => !!s && typeof s === "object")
      .map((s) => ({ value: String(s.value ?? ""), label: String(s.label ?? "") }));
    if (list.length) return list;
  }
  return DEFAULT_STATS;
}

function normalizeFaq(raw: unknown): LandingConfig["faq"] {
  if (Array.isArray(raw)) {
    const list = raw
      .filter((f): f is LandingConfig["faq"][number] => !!f && typeof f === "object")
      .map((f) => ({ q: String(f.q ?? ""), a: String(f.a ?? "") }));
    if (list.length) return list;
  }
  return DEFAULT_FAQ;
}

/** Normalize raw JSON (AI output, saved design, import) into a full LandingConfig. */
export function parseLanding(config: Record<string, unknown>): LandingConfig {
  const c = config as Partial<LandingConfig>;
  const sections = normalizeSections(config);
  const pages = normalizePages(config, sections);
  const activePageId =
    typeof c.activePageId === "string" && pages.some((p) => p.id === c.activePageId)
      ? c.activePageId
      : pages[0].id;
  const activeSections = pages.find((p) => p.id === activePageId)?.sections ?? sections;
  return finalizeLanding({
    ...DEFAULT_LANDING,
    ...c,
    heroAlign: c.heroAlign === "left" ? "left" : "center",
    density: c.density === "compact" || c.density === "spacious" ? c.density : "cozy",
    showNav: c.showNav !== false,
    showHero: c.showHero !== false,
    showHeroVisual: c.showHeroVisual !== false,
    heroImage: typeof c.heroImage === "string" ? c.heroImage : "",
    featureColumns:
      c.featureColumns === 2 || c.featureColumns === 4 ? c.featureColumns : 3,
    statsColumns: c.statsColumns === 2 || c.statsColumns === 3 ? c.statsColumns : 4,
    showSecondaryCta: c.showSecondaryCta !== false,
    navLinks: normalizeNavLinks(config.navLinks),
    pricing: normalizePricing(config.pricing),
    stats: normalizeStats(config.stats),
    logos: normalizeStrings(config.logos, DEFAULT_LOGOS),
    faq: normalizeFaq(config.faq),
    sections: activeSections,
    pages,
    activePageId,
    seo: normalizeSeo(config.seo, { ...DEFAULT_LANDING, ...c }),
  });
}
