"use client";

import * as React from "react";
import {
  Palette,
  ArrowCounterClockwise,
  Plus,
  FloppyDisk,
  CircleNotch,
  ArrowUUpLeft,
  ArrowUUpRight,
  Code,
  DownloadSimple,
  SquaresFour,
  DeviceMobile,
  DeviceTablet,
  Desktop,
  RocketLaunch,
} from "@phosphor-icons/react";

import type {
  LandingConfig,
  LandingSection,
  LandingSectionId,
  LandingTemplate,
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
  SECTION_LABELS,
} from "@/lib/landing-model";
import { hexToRgb } from "@/lib/css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { LandingPagesPanel } from "@/components/tools/landing-pages-panel";
import { BuilderOnboarding, useBuilderOnboarding } from "@/components/tools/builder-onboarding";
import { parseLanding } from "@/lib/landing-parse";
import {
  buildHtmlDocument,
  codePenUrl,
  htmlToJsxSnippet,
  prepareExportHtml,
} from "@/lib/landing-export";
import { decodeShareConfig } from "@/lib/landing-model";
import { TEMPLATE_CATALOG } from "@/lib/landing-template-catalog";
import { WorkspaceLayout, WorkspaceToolbar, WorkspaceToolbarGroup } from "@/components/app-workspace";
import { uiInputSm } from "@/lib/ui";
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

/* --------------------------------- Tool ----------------------------------- */

export function LandingBuilder({
  showToast,
  onCopy,
  initialTemplate,
  remixEncoded,
}: {
  showToast: (msg: string, ok?: boolean) => void;
  onCopy: (text: string) => void;
  initialTemplate?: string | null;
  remixEncoded?: string | null;
}) {
  const [cfg, setCfg] = React.useState<LandingConfig>(DEFAULT_LANDING);
  const [name, setName] = React.useState("");
  const [sidebarTab, setSidebarTab] = React.useState("build");
  const [showOnboarding, dismissOnboarding] = useBuilderOnboarding();
  const previewRef = React.useRef<HTMLDivElement>(null);
  const bootstrapped = React.useRef(false);

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

  React.useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    if (remixEncoded) {
      const decoded = decodeShareConfig(remixEncoded);
      if (decoded) {
        setCfg(parseLanding(decoded as unknown as Record<string, unknown>));
        dismissOnboarding();
      }
      return;
    }
    if (
      initialTemplate &&
      initialTemplate in LANDING_TEMPLATES &&
      initialTemplate !== "scratch"
    ) {
      setCfg(finalizeLanding(LANDING_TEMPLATES[initialTemplate as LandingTemplate]));
      dismissOnboarding();
    }
  }, [initialTemplate, remixEncoded, dismissOnboarding]);

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

  const getExportClone = React.useCallback(() => {
    if (!previewRef.current) return null;
    return prepareExportHtml(previewRef.current.cloneNode(true) as HTMLElement);
  }, []);

  const exportPage = React.useCallback(
    (mode: "copy" | "download" | "inline" | "jsx" | "codepen") => {
      const clone = getExportClone();
      if (!clone) {
        showToast("Preview not ready yet", false);
        return;
      }
      const pageHtml = clone.outerHTML;
      const title = cfg.seo?.metaTitle || cfg.brandName || "Landing page";

      if (mode === "jsx") {
        onCopy(htmlToJsxSnippet(pageHtml));
        return;
      }

      const inline = mode === "inline";
      const doc = buildHtmlDocument(cfg, pageHtml, { inlineTailwind: inline });

      if (mode === "codepen") {
        window.open(codePenUrl(doc, title), "_blank", "noopener,noreferrer");
        showToast("Opened in CodePen");
        return;
      }
      if (mode === "copy" || mode === "inline") {
        onCopy(doc);
        showToast(mode === "inline" ? "Copied self-contained HTML" : "Copied HTML");
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
    [cfg, getExportClone, onCopy, showToast]
  );

  const exportHtml = React.useCallback(
    (mode: "copy" | "download") => exportPage(mode),
    [exportPage]
  );

  return (
    <>
      <WorkspaceLayout
        sidebar={
          <Tabs value={sidebarTab} onValueChange={setSidebarTab} className="flex h-full min-h-0 flex-col gap-0">
            <TabsList className="sidebar-tabs grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-4">
              <TabsTrigger value="build" className="gap-1.5 text-[11px]">
                <Plus weight="bold" className="size-3.5" />
                Build
              </TabsTrigger>
              <TabsTrigger value="templates" className="gap-1.5 text-[11px]">
                <SquaresFour weight="bold" className="size-3.5" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="look" className="gap-1.5 text-[11px]">
                <Palette weight="bold" className="size-3.5" />
                Look
              </TabsTrigger>
              <TabsTrigger value="share" className="gap-1.5 text-[11px]">
                <RocketLaunch weight="bold" className="size-3.5" />
                Share
              </TabsTrigger>
            </TabsList>

            <div className="scroll-panel min-h-0 flex-1">
              <TabsContent value="build" className="mt-0 outline-none">
                <LandingSidebarBuild
                  cfg={cfg}
                  selection={selection}
                  onApplyCfg={setCfg}
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

              <TabsContent value="templates" className="mt-0 p-4 outline-none">
                <LandingTemplateGallery
                  activeTemplate={cfg.template}
                  onUseTemplate={applyTemplate}
                  onReloadTemplate={() => applyTemplate(cfg.template, { reload: true })}
                />
              </TabsContent>

              <TabsContent value="look" className="mt-0 p-4 outline-none">
                <LandingSidebarLook
                  cfg={cfg}
                  onResetTemplate={() => applyTemplate(cfg.template, { reload: true })}
                  onSet={set}
                />
              </TabsContent>

              <TabsContent value="share" className="mt-0 p-4 outline-none">
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
            </div>
          </Tabs>
        }
      >
        <WorkspaceToolbar>
          <WorkspaceToolbarGroup label="History">
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
          </WorkspaceToolbarGroup>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Page name (optional)"
            spellCheck={false}
            className={uiInputSm + " min-w-0 flex-1"}
          />
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button
              size="sm"
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
              Save
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => exportHtml("copy")}>
              <Code weight="bold" className="size-3.5" />
              Copy HTML
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => exportPage("jsx")}>
              JSX
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => exportPage("codepen")}>
              CodePen
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => exportHtml("download")}>
              <DownloadSimple weight="bold" className="size-3.5" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </WorkspaceToolbar>

        <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:p-4">
          <div className="preview-frame relative flex min-h-[min(520px,60vh)] flex-1 flex-col">
            {showOnboarding && cfg.sections.length === 0 && cfg.template === "scratch" ? (
              <BuilderOnboarding
                onPickTemplate={() => {
                  setSidebarTab("templates");
                  dismissOnboarding();
                }}
                onDismiss={dismissOnboarding}
              />
            ) : null}
            <div className="preview-chrome">
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-destructive/80" />
                <span className="size-2.5 rounded-full bg-warning/80" />
                <span className="size-2.5 rounded-full bg-success/80" />
              </div>
              <div className="preview-url-bar">
                <span className="preview-url-lock" title="Secure preview" />
                https://{(cfg.brandName || "yourbrand").toLowerCase().replace(/\s+/g, "")}.com
              </div>
              <div className="workspace-toolbar-group flex shrink-0 items-center gap-0.5">
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
            <div className="preview-canvas scroll-panel flex min-h-0 flex-1 flex-col items-center p-4">
              {previewDevice !== "desktop" ? (
                <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {previewDevice} · {PREVIEW_WIDTHS[previewDevice]}px
                </p>
              ) : null}
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
          <div className="canvas-status-bar">
            <span>Click text to edit · Select a block to change properties in the left panel</span>
            <span className="hidden font-mono text-[10px] sm:inline">
              {previewDevice}
              {previewDevice !== "desktop" ? ` · ${PREVIEW_WIDTHS[previewDevice]}px` : " · full width"}
            </span>
          </div>
        </div>
      </WorkspaceLayout>

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
