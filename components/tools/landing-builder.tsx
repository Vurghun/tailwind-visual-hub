"use client";

import * as React from "react";
import {
  Palette,
  ArrowCounterClockwise,
  Browser,
  X,
  Lightning,
  Plus,
  Cursor,
  FloppyDisk,
  CircleNotch,
  ArrowUUpLeft,
  ArrowUUpRight,
  CopySimple,
  DeviceMobile,
  DeviceTablet,
  Desktop,
  RocketLaunch,
  Code,
  DownloadSimple,
  SquaresFour,
} from "@phosphor-icons/react";

import type {
  LandingConfig,
  LandingSection,
  LandingSectionId,
  LandingTemplate,
  LandingTier,
  PreviewViewport,
  SectionBg,
  SectionBlockData,
  LandingSelection,
  LandingSeo,
} from "@/lib/supabase";
import {
  withActiveSections,
  defaultBlockData,
  newId,
  normalizeSeo,
  normalizePages,
  ALL_SECTION_IDS,
  SECTION_LABELS,
} from "@/lib/landing-model";
import { hexToRgb } from "@/lib/css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SliderRow,
  ColorRow,
  TextRow,
  SegmentedRow,
  ToggleRow,
} from "@/components/controls";
import { SavedDesigns } from "@/components/saved-designs";
import { useSaveDesign } from "@/components/use-save-design";
import { LandingPreview } from "@/components/tools/landing-preview";
import { LandingSidebarBuild } from "@/components/tools/landing-sidebar-build";
import { LandingSidebarLook } from "@/components/tools/landing-sidebar-look";
import { LandingTemplateGallery } from "@/components/tools/landing-template-gallery";
import { LandingPublishPanel } from "@/components/tools/landing-publish-panel";
import { TEMPLATE_CATALOG } from "@/lib/landing-template-catalog";
import { uiInputSm, uiToolbar } from "@/lib/ui";
import {
  DEFAULT_FAQ,
  DEFAULT_LOGOS,
  DEFAULT_PRICING,
  DEFAULT_STATS,
  finalizeLanding,
  LANDING_TEMPLATES,
} from "@/lib/landing-templates";

/** Default content for every section — used to fill a freshly added section. */
const SECTION_DEFAULTS: Partial<LandingConfig> = {
  featuresHeading: "Everything you need",
  features: [
    { title: "Lightning fast", desc: "Ship in minutes with a workflow built for speed." },
    { title: "Secure by default", desc: "Enterprise-grade security baked into every layer." },
    { title: "Scales with you", desc: "From your first user to your millionth, no rewrites." },
  ],
  statsHeading: "Trusted at scale",
  stats: DEFAULT_STATS,
  logosHeading: "Trusted by teams everywhere",
  logos: DEFAULT_LOGOS,
  pricingHeading: "Simple, transparent pricing",
  pricing: DEFAULT_PRICING,
  testimonialQuote: "This is hands down the best tool we've adopted this year.",
  testimonialAuthor: "Alex Rivera · CTO, Lumen",
  faqHeading: "Frequently asked questions",
  faq: DEFAULT_FAQ,
  ctaHeadline: "Ready to get started?",
};

function newSectionUid(): string {
  return newId("s");
}

const DEFAULT_LANDING: LandingConfig = finalizeLanding(LANDING_TEMPLATES.scratch);

const PREVIEW_WIDTHS: Record<PreviewViewport, number | "100%"> = {
  desktop: "100%",
  tablet: 768,
  mobile: 390,
};

const COLOR_SWATCHES = [
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#F97316",
  "#10B981",
  "#0EA5E9",
  "#EF4444",
  "#14B8A6",
];

function normalizeBg(raw: unknown): SectionBg | undefined {
  if (raw === "surface" || raw === "brand" || raw === "contrast") return raw;
  return undefined;
}

/**
 * Validate a saved `sections` list. Duplicate section types are allowed;
 * each instance carries its own `uid`.
 */
function normalizeSections(
  config: Record<string, unknown>
): LandingConfig["sections"] {
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
          uid:
            typeof s.uid === "string" && s.uid ? s.uid : `${id}-${i}`,
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
  // Migrate legacy boolean flags.
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

function parseLanding(config: Record<string, unknown>): LandingConfig {
  const c = config as Partial<LandingConfig>;
  const sections = normalizeSections(config);
  const pages = normalizePages(config, sections);
  const activePageId =
    typeof c.activePageId === "string" && pages.some((p) => p.id === c.activePageId)
      ? c.activePageId
      : pages[0].id;
  const activeSections =
    pages.find((p) => p.id === activePageId)?.sections ?? sections;
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
    statsColumns:
      c.statsColumns === 2 || c.statsColumns === 3 ? c.statsColumns : 4,
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

function buildHtmlDocument(cfg: LandingConfig, pageHtml: string): string {
  const slug = (cfg.brandName || "acme").toLowerCase().replace(/\s+/g, "");
  const title = cfg.seo?.metaTitle || cfg.brandName || "Acme";
  const desc = cfg.seo?.metaDescription || cfg.heroSubtitle || "";
  const og = cfg.seo?.ogImage || cfg.heroImage || "";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  ${og ? `<meta property="og:image" content="${og}" />` : ""}
  <!-- Layout utility classes are resolved by the Tailwind Play CDN. -->
  <script src="https://cdn.tailwindcss.com"></script>
  <style>*{box-sizing:border-box}body{margin:0}</style>
</head>
<body>
<!-- ${slug}.com — generated with Tailwind Visual Hub -->
${pageHtml}
</body>
</html>`;
}

/* --------------------------------- Intro ---------------------------------- */

const INTRO_KEY = "tvh-builder-intro-dismissed";

function IntroBanner() {
  const [mounted, setMounted] = React.useState(false);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setShow(localStorage.getItem(INTRO_KEY) !== "1");
  }, []);

  if (!mounted || !show) return null;

  const dismiss = () => {
    localStorage.setItem(INTRO_KEY, "1");
    setShow(false);
  };

  const steps = [
    "Templates tab: pick from 17 layouts or start blank.",
    "Build tab: add blocks or edit what the template gave you.",
    "Share tab: save, export HTML, or copy a preview link.",
  ];

  return (
    <Card className="mb-6 border-primary/25 bg-primary/[0.03] shadow-sm">
      <CardContent className="flex items-start gap-4 py-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Lightning weight="fill" className="size-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Build a website in 3 steps — no code</p>
          <ol className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:gap-5">
            {steps.map((s, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <span className="flex size-4 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X weight="bold" className="size-4" />
        </button>
      </CardContent>
    </Card>
  );
}

/* --------------------------------- Tool ----------------------------------- */

export function LandingBuilder({
  showToast,
  onCopy,
}: {
  showToast: (msg: string, ok?: boolean) => void;
  onCopy: (text: string) => void;
}) {
  const [cfg, setCfg] = React.useState<LandingConfig>(DEFAULT_LANDING);
  const [name, setName] = React.useState("");
  const previewRef = React.useRef<HTMLDivElement>(null);

  /* ----------------------------- Undo / redo ------------------------------ */
  // Tracks cfg changes via effect so every mutation path is undoable.
  const past = React.useRef<LandingConfig[]>([]);
  const future = React.useRef<LandingConfig[]>([]);
  const skipHistory = React.useRef(false);
  const prevCfg = React.useRef(cfg);
  const [, bumpHistory] = React.useReducer((n: number) => n + 1, 0);

  React.useEffect(() => {
    if (prevCfg.current === cfg) return;
    if (skipHistory.current) {
      skipHistory.current = false;
    } else {
      past.current.push(prevCfg.current);
      if (past.current.length > 100) past.current.shift();
      future.current = [];
    }
    prevCfg.current = cfg;
    bumpHistory();
  }, [cfg]);

  const undo = React.useCallback(() => {
    const prev = past.current.pop();
    if (!prev) return;
    future.current.push(prevCfg.current);
    skipHistory.current = true;
    setCfg(prev);
  }, []);

  const redo = React.useCallback(() => {
    const next = future.current.pop();
    if (!next) return;
    past.current.push(prevCfg.current);
    skipHistory.current = true;
    setCfg(next);
  }, []);

  // Ctrl/Cmd+Z, shortcuts — see effect after selection handlers below.

  const set = React.useCallback(
    <K extends keyof LandingConfig>(key: K, value: LandingConfig[K]) =>
      setCfg((prev) => ({ ...prev, [key]: value })),
    []
  );

  const { saving, save, reloadSignal } = useSaveDesign("landing", showToast);

  const applyConfig = React.useCallback((config: Record<string, unknown>) => {
    setCfg(parseLanding(config));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const moveSection = React.useCallback((index: number, dir: -1 | 1) => {
    setCfg((prev) => {
      const next = [...prev.sections];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return withActiveSections(prev, next);
    });
  }, []);

  const [selection, setSelection] = React.useState<LandingSelection>({ kind: "none" });
  const [previewDevice, setPreviewDevice] = React.useState<PreviewViewport>("desktop");
  const [componentsRev, setComponentsRev] = React.useState(0);

  const reorderSection = React.useCallback((from: number, to: number) => {
    setCfg((prev) => {
      if (from === to || from < 0 || to < 0) return prev;
      const next = [...prev.sections];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return withActiveSections(prev, next);
    });
  }, []);

  const toggleSection = React.useCallback((uid: string) => {
    setCfg((prev) =>
      withActiveSections(
        prev,
        prev.sections.map((s) => (s.uid === uid ? { ...s, visible: !s.visible } : s))
      )
    );
  }, []);

  const addSection = React.useCallback((id: LandingSectionId) => {
    const uid = newSectionUid();
    setCfg((prev) =>
      withActiveSections(prev, [
        ...prev.sections,
        { uid, id, visible: true, data: defaultBlockData(id) },
      ])
    );
    setSelection({ kind: "section", uid });
    showToast(`Added ${SECTION_LABELS[id]}`);
  }, [showToast]);

  const removeSection = React.useCallback((uid: string) => {
    setCfg((prev) => withActiveSections(prev, prev.sections.filter((s) => s.uid !== uid)));
    setSelection((cur) =>
      (cur.kind === "section" && cur.uid === uid) ||
      (cur.kind === "element" && cur.uid === uid)
        ? { kind: "none" }
        : cur
    );
  }, []);

  const duplicateSection = React.useCallback((uid: string) => {
    setCfg((prev) => {
      const i = prev.sections.findIndex((s) => s.uid === uid);
      if (i < 0) return prev;
      const src = prev.sections[i];
      const copy: LandingSection = {
        ...src,
        uid: newSectionUid(),
        data: src.data ? { ...src.data } : defaultBlockData(src.id),
      };
      const next = [...prev.sections];
      next.splice(i + 1, 0, copy);
      return withActiveSections(prev, next);
    });
  }, []);

  const setSectionBg = React.useCallback((uid: string, bg: SectionBg) => {
    setCfg((prev) =>
      withActiveSections(
        prev,
        prev.sections.map((s) => (s.uid === uid ? { ...s, bg } : s))
      )
    );
  }, []);

  const handleSectionAction = React.useCallback(
    (
      uid: string,
      action: "up" | "down" | "hide" | "duplicate" | "remove" | "bg",
      payload?: SectionBg
    ) => {
      const i = cfg.sections.findIndex((s) => s.uid === uid);
      if (action === "up" && i > 0) moveSection(i, -1);
      else if (action === "down" && i >= 0 && i < cfg.sections.length - 1)
        moveSection(i, 1);
      else if (action === "hide") toggleSection(uid);
      else if (action === "duplicate") duplicateSection(uid);
      else if (action === "remove") removeSection(uid);
      else if (action === "bg" && payload) setSectionBg(uid, payload);
    },
    [cfg.sections, moveSection, toggleSection, duplicateSection, removeSection, setSectionBg]
  );

  const patchCfg = React.useCallback((patch: Partial<LandingConfig>) => {
    setCfg((prev) => ({ ...prev, ...patch }));
  }, []);

  const patchSectionData = React.useCallback(
    (uid: string, data: Partial<SectionBlockData>) => {
      setCfg((prev) =>
        withActiveSections(
          prev,
          prev.sections.map((s) =>
            s.uid === uid ? { ...s, data: { ...s.data, ...data } } : s
          )
        )
      );
    },
    []
  );

  const patchSeo = React.useCallback((seo: Partial<LandingSeo>) => {
    setCfg((prev) => ({ ...prev, seo: { ...prev.seo, ...seo } }));
  }, []);

  const designKey = name.trim() || cfg.brandName || "landing-default";

  const applyTemplate = React.useCallback(
    (template: LandingTemplate, opts?: { reload?: boolean }) => {
      const label =
        TEMPLATE_CATALOG.find((t) => t.id === template)?.name ?? template;
      const hasContent =
        cfg.sections.length > 0 || cfg.showNav || cfg.showHero;
      const isChange = template !== cfg.template || opts?.reload;

      if (isChange && hasContent) {
        const msg = opts?.reload
          ? `Reload "${label}" from defaults? Your edits will be reset. You can undo with Ctrl+Z.`
          : template === "scratch"
            ? "Start a blank canvas? Your current page will be cleared. You can undo with Ctrl+Z."
            : `Load "${label}"? Your current page will be replaced. You can undo with Ctrl+Z.`;
        if (typeof window !== "undefined" && !window.confirm(msg)) return;
      }

      setCfg(finalizeLanding(LANDING_TEMPLATES[template]));
      setSelection({ kind: "none" });
      showToast(
        opts?.reload
          ? `${label} reset to defaults`
          : template === "scratch"
            ? "Blank canvas ready"
            : `${label} loaded — edit anything you want`
      );
    },
    [cfg, showToast]
  );

  React.useEffect(() => {
    const isTyping = () => {
      const el = document.activeElement as HTMLElement | null;
      return (
        !!el &&
        (el.isContentEditable || el.tagName === "INPUT" || el.tagName === "TEXTAREA")
      );
    };
    const onKey = (e: KeyboardEvent) => {
      if (isTyping()) return;
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === "z" && !e.shiftKey) {
          e.preventDefault();
          undo();
          return;
        }
        if (key === "y" || (key === "z" && e.shiftKey)) {
          e.preventDefault();
          redo();
          return;
        }
        if (key === "d" && selection.kind === "section") {
          e.preventDefault();
          duplicateSection(selection.uid);
          return;
        }
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selection.kind === "section") {
        e.preventDefault();
        removeSection(selection.uid);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, selection, duplicateSection, removeSection]);

  const exportHtml = React.useCallback(
    (mode: "copy" | "download") => {
      if (!previewRef.current) {
        showToast("Preview not ready yet", false);
        return;
      }
      // Clone the rendered page and strip builder-only chrome so the export
      // is a clean, static document.
      const clone = previewRef.current.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("[data-ui]").forEach((el) => el.remove());
      clone.querySelectorAll("[data-section-wrap]").forEach((el) => {
        el.removeAttribute("data-section-wrap");
        el.className = el.className.replace(/\bring-[^\s]+/g, "").trim();
      });
      clone.querySelectorAll("[data-edit]").forEach((el) => {
        el.removeAttribute("contenteditable");
        el.removeAttribute("spellcheck");
        el.removeAttribute("data-edit");
      });
      // Preview uses @container variants; exported pages use normal viewport breakpoints.
      clone.querySelectorAll("[class]").forEach((el) => {
        const node = el as HTMLElement;
        if (typeof node.className === "string") {
          node.className = node.className
            .replace(/@sm:/g, "sm:")
            .replace(/@md:/g, "md:")
            .replace(/@lg:/g, "lg:");
        }
      });
      const doc = buildHtmlDocument(cfg, clone.outerHTML);
      if (mode === "copy") {
        onCopy(doc);
        return;
      }
      const blob = new Blob([doc], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(cfg.brandName || "page").toLowerCase().replace(/\s+/g, "-")}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Downloaded HTML file");
    },
    [cfg, onCopy, showToast]
  );

  return (
    <>
      <IntroBanner />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] md:items-start lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        {/* Controls — grouped into tabs + independently scrollable */}
        <div className="scroll-panel md:sticky md:top-20 md:max-h-[calc(100vh-6rem)] md:pr-1.5">
          <Tabs defaultValue="build" className="gap-4">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-4">
              <TabsTrigger value="build" className="gap-1.5">
                <Plus weight="bold" className="size-4" />
                Build
              </TabsTrigger>
              <TabsTrigger value="templates" className="gap-1.5">
                <SquaresFour weight="bold" className="size-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="look" className="gap-1.5">
                <Palette weight="bold" className="size-4" />
                Look
              </TabsTrigger>
              <TabsTrigger value="share" className="gap-1.5">
                <RocketLaunch weight="bold" className="size-4" />
                Share
              </TabsTrigger>
            </TabsList>

            <TabsContent value="build">
              <LandingSidebarBuild
                cfg={cfg}
                selection={selection}
                onAddBlock={addSection}
                onSelect={setSelection}
                onToggleSection={toggleSection}
                onPatch={patchCfg}
                onPatchSection={patchSectionData}
                onSetSectionBg={setSectionBg}
                onSet={set}
                onSaveComponent={() => setComponentsRev((n) => n + 1)}
                showToast={showToast}
              />
            </TabsContent>

            <TabsContent value="templates">
              <LandingTemplateGallery
                activeTemplate={cfg.template}
                onUseTemplate={applyTemplate}
                onReloadTemplate={() => applyTemplate(cfg.template, { reload: true })}
              />
            </TabsContent>

            <TabsContent value="look">
              <LandingSidebarLook
                cfg={cfg}
                onResetTemplate={() => applyTemplate(cfg.template, { reload: true })}
                onSet={set}
              />
            </TabsContent>

            <TabsContent value="share">
              <LandingPublishPanel
                cfg={cfg}
                designKey={designKey}
                onPatchSeo={patchSeo}
                onApplyConfig={(c) => {
                  setCfg(parseLanding(c as unknown as Record<string, unknown>));
                  setSelection({ kind: "none" });
                }}
                onCopy={onCopy}
                showToast={showToast}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview — pinned so the work area is always on screen */}
        <div className="flex flex-col gap-4 md:sticky md:top-20">
          {/* Always-visible action toolbar */}
          <div className={uiToolbar}>
            <div className="flex items-center gap-0.5">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={undo}
                disabled={past.current.length === 0}
                aria-label="Undo (Ctrl+Z)"
                title="Undo (Ctrl+Z)"
              >
                <ArrowUUpLeft weight="bold" />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={redo}
                disabled={future.current.length === 0}
                aria-label="Redo (Ctrl+Y)"
                title="Redo (Ctrl+Y)"
              >
                <ArrowUUpRight weight="bold" />
              </Button>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name this page (optional)"
              spellCheck={false}
              className={uiInputSm + " min-w-0 flex-1"}
            />
            <Button
              size="lg"
              variant="default"
              onClick={() => save({ name, classString: "", config: cfg })}
              disabled={saving}
              className="gap-1.5"
            >
              {saving ? (
                <CircleNotch weight="bold" className="size-3.5 animate-spin" />
              ) : (
                <FloppyDisk weight="bold" className="size-3.5" />
              )}
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button size="lg" variant="outline" className="gap-1.5" onClick={() => exportHtml("copy")}>
              <Code weight="bold" className="size-3.5" />
              Copy HTML
            </Button>
            <Button size="lg" variant="outline" className="gap-1.5" onClick={() => exportHtml("download")}>
              <DownloadSimple weight="bold" className="size-3.5" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Browser weight="bold" className="size-4" />
                Live Website Preview
              </CardTitle>
              <CardDescription className="flex items-center gap-1.5">
                <Cursor weight="bold" className="size-3.5" />
                Click text to edit. Click a block to select it. Add more blocks at the bottom of the page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="preview-frame">
                <div className="preview-chrome">
                  <div className="flex gap-1.5">
                    <span className="size-3 rounded-full bg-destructive/80" />
                    <span className="size-3 rounded-full bg-warning/80" />
                    <span className="size-3 rounded-full bg-success/80" />
                  </div>
                  <div className="ml-1 flex h-7 min-w-0 flex-1 items-center rounded-md border border-input bg-background px-2.5 font-mono text-[10px] text-muted-foreground shadow-xs">
                    https://{(cfg.brandName || "acme").toLowerCase().replace(/\s+/g, "")}.com
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    {(
                      [
                        { id: "desktop" as const, icon: Desktop, label: "Desktop preview" },
                        { id: "tablet" as const, icon: DeviceTablet, label: "Tablet preview" },
                        { id: "mobile" as const, icon: DeviceMobile, label: "Mobile preview" },
                      ] as const
                    ).map(({ id, icon: Icon, label }) => (
                      <Button
                        key={id}
                        size="icon-xs"
                        variant={previewDevice === id ? "default" : "ghost"}
                        aria-label={label}
                        title={label}
                        onClick={() => setPreviewDevice(id)}
                      >
                        <Icon weight="bold" />
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="preview-canvas scroll-panel flex max-h-[60vh] flex-col items-center p-4 md:max-h-[calc(100vh-15rem)]">
                  {previewDevice !== "desktop" && (
                    <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {previewDevice} · {PREVIEW_WIDTHS[previewDevice]}px wide
                    </p>
                  )}
                  <div
                    className="@container w-full transition-[width] duration-200"
                    style={{
                      width: PREVIEW_WIDTHS[previewDevice],
                      maxWidth: "100%",
                    }}
                  >
                    <LandingPreview
                      ref={previewRef}
                      cfg={cfg}
                      editable
                      selection={selection}
                      onPatch={patchCfg}
                      onSectionPatch={patchSectionData}
                      onSelect={setSelection}
                      onReorderSection={reorderSection}
                      onAddBlock={addSection}
                      onSectionAction={handleSectionAction}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <SavedDesigns
        tool="landing"
        reloadSignal={reloadSignal}
        onApply={applyConfig}
        onCopy={onCopy}
        showToast={showToast}
        getLabel={(item) =>
          item.name ||
          (item.config as Partial<LandingConfig>).brandName ||
          "Landing"
        }
        renderPreview={(config) => {
          const c = parseLanding(config);
          const { r, g, b } = hexToRgb(c.brandColor);
          return (
            <div
              className="flex h-full w-full flex-col justify-center gap-1.5 p-3"
              style={{
                background:
                  c.mode === "dark"
                    ? `linear-gradient(160deg, #0B1020, rgba(${r},${g},${b},0.35))`
                    : `linear-gradient(160deg, #FFFFFF, rgba(${r},${g},${b},0.18))`,
                color: c.mode === "dark" ? "#F1F5F9" : "#0F172A",
              }}
            >
              <div
                className="flex size-4 items-center justify-center text-[9px] font-bold text-white"
                style={{ background: c.brandColor, borderRadius: Math.min(c.radius, 6) }}
              >
                {(c.brandName || "A").charAt(0).toUpperCase()}
              </div>
              <div className="line-clamp-2 text-[9px] font-semibold leading-tight">
                {c.heroHeadline}
              </div>
            </div>
          );
        }}
      />
    </>
  );
}
