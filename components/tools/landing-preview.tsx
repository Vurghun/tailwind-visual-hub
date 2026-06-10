"use client";

import * as React from "react";
import {
  Lightning,
  ShieldCheck,
  ChartLineUp,
  Rocket,
  CheckCircle,
  ArrowRight,
  Quotes,
  X,
  Plus,
  Star,
  CaretUp,
  CaretDown,
  EyeSlash,
  CopySimple,
  Trash,
  DotsSixVertical,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { hexToRgb } from "@/lib/css";
import type {
  LandingConfig,
  LandingElementId,
  LandingSection,
  LandingSectionId,
  LandingSelection,
  SectionBg,
  SectionBlockData,
} from "@/lib/supabase";
import {
  responsiveHideClass,
  sectionPaddingStyle,
} from "@/lib/landing-model";
import { LandingBlockPalette } from "@/components/tools/landing-block-palette";

const FONT_STACK: Record<LandingConfig["font"], string> = {
  sans: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  serif: "Georgia, Cambria, 'Times New Roman', serif",
  mono: "var(--font-mono), ui-monospace, SFMono-Regular, monospace",
};

const FEATURE_ICONS = [Lightning, ShieldCheck, ChartLineUp, Rocket];

/** Vertical rhythm per density setting (literal classes so Tailwind compiles them). */
const PAD: Record<
  LandingConfig["density"],
  { section: string; hero: string; band: string }
> = {
  compact: { section: "px-6 py-8", hero: "px-6 py-10", band: "px-6 py-7" },
  cozy: { section: "px-6 py-14", hero: "px-6 py-16", band: "px-6 py-12" },
  spacious: { section: "px-6 py-24", hero: "px-6 py-28", band: "px-6 py-16" },
};

const FEATURE_COLS: Record<LandingConfig["featureColumns"], string> = {
  2: "@sm:grid-cols-2",
  3: "@sm:grid-cols-3",
  4: "@sm:grid-cols-4",
};

const STATS_COLS: Record<LandingConfig["statsColumns"], string> = {
  2: "@sm:grid-cols-2",
  3: "@sm:grid-cols-3",
  4: "@sm:grid-cols-4",
};

function sectionBandStyle(
  bg: SectionBg | undefined,
  pal: Palette,
  brandSoft: string
): React.CSSProperties {
  switch (bg) {
    case "surface":
      return { background: pal.surface };
    case "brand":
      return { background: brandSoft };
    case "contrast":
      return { background: pal.text, color: pal.bg };
    default:
      return {};
  }
}

const EDIT_CLS =
  "cursor-text rounded-[3px] transition-shadow hover:shadow-[0_0_0_1px_currentColor] focus:shadow-[0_0_0_2px_currentColor] focus:outline-none";

type Palette = {
  bg: string;
  surface: string;
  text: string;
  sub: string;
  border: string;
  navBg: string;
};

function paletteFor(mode: LandingConfig["mode"]): Palette {
  return mode === "dark"
    ? {
        bg: "#0B1020",
        surface: "#111A2E",
        text: "#F1F5F9",
        sub: "#94A3B8",
        border: "rgba(255,255,255,0.10)",
        navBg: "rgba(11,16,32,0.75)",
      }
    : {
        bg: "#FFFFFF",
        surface: "#F8FAFC",
        text: "#0F172A",
        sub: "#475569",
        border: "#E2E8F0",
        navBg: "rgba(255,255,255,0.75)",
      };
}

function shadowFor(cfg: LandingConfig): string {
  const { r, g, b } = hexToRgb(cfg.brandColor);
  switch (cfg.shadow) {
    case "none":
      return "none";
    case "sharp":
      // Hard neo-brutalist offset — must contrast with fills. Using brandColor
      // on same-color buttons merges the layers and creates a notched silhouette.
      return cfg.mode === "dark"
        ? "4px 4px 0 0 rgba(255,255,255,0.22)"
        : "4px 4px 0 0 rgba(15,23,42,0.88)";
    case "glow":
      return `0 12px 44px -6px rgba(${r}, ${g}, ${b}, 0.55)`;
    case "soft":
    default:
      return "0 18px 40px -14px rgba(2, 6, 23, 0.35)";
  }
}

type PreviewProps = {
  cfg: LandingConfig;
  editable?: boolean;
  showGrid?: boolean;
  selection?: LandingSelection;
  onPatch?: (patch: Partial<LandingConfig>) => void;
  onSectionPatch?: (uid: string, data: Partial<SectionBlockData>) => void;
  onSelect?: (sel: LandingSelection) => void;
  onReorderSection?: (from: number, to: number) => void;
  onAddBlock?: (id: LandingSectionId) => void;
  onSectionAction?: (
    uid: string,
    action: "up" | "down" | "hide" | "duplicate" | "remove",
  ) => void;
};

export const LandingPreview = React.forwardRef<HTMLDivElement, PreviewProps>(
  function LandingPreview(
    {
      cfg,
      editable = false,
      showGrid = false,
      selection = { kind: "none" },
      onPatch,
      onSectionPatch,
      onSelect,
      onReorderSection,
      onAddBlock,
      onSectionAction,
    },
    ref
  ) {
    const designMode = editable;
    const [dragSectionUid, setDragSectionUid] = React.useState<string | null>(null);
    const resizeRef = React.useRef<{ uid: string; startY: number; startH: number } | null>(null);

    React.useEffect(() => {
      if (!designMode) return;
      const onMove = (e: MouseEvent) => {
        const r = resizeRef.current;
        if (!r || !onSectionPatch) return;
        const next = Math.max(16, Math.min(400, r.startH + (e.clientY - r.startY)));
        onSectionPatch(r.uid, { spacerHeight: Math.round(next) });
      };
      const onUp = () => {
        resizeRef.current = null;
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
    }, [designMode, onSectionPatch]);

    const isSectionSelected = (uid: string) =>
      selection.kind === "section" && selection.uid === uid;
    const isElementSelected = (uid: string, elementId: LandingElementId) =>
      selection.kind === "element" &&
      selection.uid === uid &&
      selection.elementId === elementId;
    const pal = paletteFor(cfg.mode);
    const { r, g, b } = hexToRgb(cfg.brandColor);
    const brandSoft = `rgba(${r}, ${g}, ${b}, 0.12)`;
    const radius = cfg.radius;
    const shadow = shadowFor(cfg);
    const isCenter = cfg.heroAlign === "center";
    const pad = PAD[cfg.density];

    /** Inline-editable text node. Commits on blur to avoid cursor jumps. */
    const Edit = ({
      as: Tag = "span",
      value,
      onCommit,
      className,
      style,
      multiline = false,
      sectionUid,
      elementId,
    }: {
      as?: keyof React.JSX.IntrinsicElements;
      value: string;
      onCommit: (value: string) => void;
      className?: string;
      style?: React.CSSProperties;
      multiline?: boolean;
      sectionUid?: string;
      elementId?: LandingElementId;
    }) => {
      const elSelected =
        sectionUid && elementId ? isElementSelected(sectionUid, elementId) : false;
      if (!editable) {
        return React.createElement(Tag, { className, style }, value);
      }
      return React.createElement(
        Tag,
        {
          className: cn(
            className,
            editable && EDIT_CLS,
            designMode && elSelected && "ring-2 ring-primary ring-offset-2 ring-offset-transparent"
          ),
          style,
          contentEditable: true,
          suppressContentEditableWarning: true,
          spellCheck: false,
          "data-edit": "1",
          onClick: (e: React.MouseEvent) => {
            if (sectionUid && elementId && onSelect) {
              e.stopPropagation();
              onSelect({ kind: "element", uid: sectionUid, elementId });
            }
          },
          onBlur: (e: React.FocusEvent<HTMLElement>) => {
            const text = e.currentTarget.textContent ?? "";
            if (text !== value) onCommit(text);
          },
          onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
            if (!multiline && e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.blur();
            }
          },
        },
        value
      );
    };

    const patch = (p: Partial<LandingConfig>) => onPatch?.(p);
    const patchSection = (uid: string, data: Partial<SectionBlockData>) =>
      onSectionPatch?.(uid, data);
    const editFeature = (i: number, key: "title" | "desc", v: string) =>
      patch({
        features: cfg.features.map((f, idx) => (idx === i ? { ...f, [key]: v } : f)),
      });
    const editTier = (
      i: number,
      key: "name" | "price" | "period",
      v: string
    ) =>
      patch({
        pricing: cfg.pricing.map((t, idx) => (idx === i ? { ...t, [key]: v } : t)),
      });
    const editPerk = (i: number, pj: number, v: string) =>
      patch({
        pricing: cfg.pricing.map((t, idx) =>
          idx === i ? { ...t, perks: t.perks.map((p, k) => (k === pj ? v : p)) } : t
        ),
      });
    const editStat = (i: number, key: "value" | "label", v: string) =>
      patch({ stats: cfg.stats.map((s, idx) => (idx === i ? { ...s, [key]: v } : s)) });
    const editLogo = (i: number, v: string) =>
      patch({ logos: cfg.logos.map((l, idx) => (idx === i ? v : l)) });
    const editFaq = (i: number, key: "q" | "a", v: string) =>
      patch({ faq: cfg.faq.map((f, idx) => (idx === i ? { ...f, [key]: v } : f)) });

    /* ------- Builder-only chrome (marked data-ui, stripped on export) ------- */

    /** Floating × that appears when hovering a repeatable item. */
    const Remove = ({ onClick, label }: { onClick: () => void; label: string }) =>
      !editable ? null : (
        <button
          type="button"
          data-ui="1"
          aria-label={label}
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClick}
          className="absolute -right-2 -top-2 z-10 hidden size-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform hover:scale-110 group-hover/item:flex"
        >
          <X weight="bold" className="size-3" />
        </button>
      );

    /** Dashed "add item" affordance rendered at the end of a list. */
    const AddBtn = ({
      onClick,
      label,
      className,
    }: {
      onClick: () => void;
      label: string;
      className?: string;
    }) =>
      !editable ? null : (
        <button
          type="button"
          data-ui="1"
          onClick={onClick}
          className={cn(
            "flex items-center justify-center gap-1.5 border border-dashed text-xs font-medium opacity-50 transition-opacity hover:opacity-100",
            className
          )}
          style={{ borderColor: pal.sub, color: pal.sub, borderRadius: radius }}
        >
          <Plus weight="bold" className="size-3.5" />
          {label}
        </button>
      );

    const addFeature = () =>
      cfg.features.length < 6 &&
      patch({ features: [...cfg.features, { title: "New feature", desc: "Describe this feature." }] });
    const removeFeature = (i: number) =>
      cfg.features.length > 1 && patch({ features: cfg.features.filter((_, idx) => idx !== i) });
    const addStat = () =>
      cfg.stats.length < 6 && patch({ stats: [...cfg.stats, { value: "42", label: "New metric" }] });
    const removeStat = (i: number) =>
      cfg.stats.length > 1 && patch({ stats: cfg.stats.filter((_, idx) => idx !== i) });
    const addLogo = () =>
      cfg.logos.length < 8 && patch({ logos: [...cfg.logos, "Brand"] });
    const removeLogo = (i: number) =>
      cfg.logos.length > 1 && patch({ logos: cfg.logos.filter((_, idx) => idx !== i) });
    const addFaqItem = () =>
      cfg.faq.length < 8 &&
      patch({ faq: [...cfg.faq, { q: "New question?", a: "Write the answer here." }] });
    const removeFaqItem = (i: number) =>
      cfg.faq.length > 1 && patch({ faq: cfg.faq.filter((_, idx) => idx !== i) });
    const addNavLink = () =>
      cfg.navLinks.length < 5 && patch({ navLinks: [...cfg.navLinks, "Link"] });
    const removeNavLink = (i: number) =>
      cfg.navLinks.length > 1 && patch({ navLinks: cfg.navLinks.filter((_, idx) => idx !== i) });
    const addTier = () =>
      cfg.pricing.length < 4 &&
      patch({
        pricing: [
          ...cfg.pricing,
          { name: "New plan", price: "$19", period: "/mo", featured: false, perks: ["Describe a perk"] },
        ],
      });
    const removeTier = (i: number) =>
      cfg.pricing.length > 1 && patch({ pricing: cfg.pricing.filter((_, idx) => idx !== i) });
    const toggleFeatured = (i: number) =>
      patch({ pricing: cfg.pricing.map((t, idx) => (idx === i ? { ...t, featured: !t.featured } : t)) });
    const addPerk = (i: number) =>
      cfg.pricing[i].perks.length < 6 &&
      patch({
        pricing: cfg.pricing.map((t, idx) =>
          idx === i ? { ...t, perks: [...t.perks, "New perk"] } : t
        ),
      });
    const removePerk = (i: number, pj: number) =>
      cfg.pricing[i].perks.length > 1 &&
      patch({
        pricing: cfg.pricing.map((t, idx) =>
          idx === i ? { ...t, perks: t.perks.filter((_, k) => k !== pj) } : t
        ),
      });

    const root: React.CSSProperties = {
      fontFamily: FONT_STACK[cfg.font],
      background: pal.bg,
      color: pal.text,
    };
    const primaryBtn: React.CSSProperties = {
      background: cfg.brandColor,
      color: "#ffffff",
      borderRadius: radius,
      boxShadow: shadow,
    };
    const secondaryBtn: React.CSSProperties = {
      background: "transparent",
      color: pal.text,
      border: `1px solid ${pal.border}`,
      borderRadius: radius,
    };
    const card: React.CSSProperties = {
      background: pal.surface,
      border: `1px solid ${pal.border}`,
      borderRadius: radius,
    };

    const renderSection = (section: LandingSection): React.ReactNode => {
      const id = section.id;
      const band = sectionBandStyle(section.bg, pal, brandSoft);
      const d = section.data ?? {};
      const alignCenter = d.align === "center";

      switch (id) {
        case "content":
          return (
            <section
              key={section.uid}
              className={cn(pad.section, responsiveHideClass(d))}
              style={{ ...band, ...sectionPaddingStyle(d) }}
            >
              <div
                className={cn(
                  "mx-auto max-w-3xl",
                  alignCenter ? "text-center" : "text-left"
                )}
              >
                <Edit
                  as="h2"
                  value={d.heading ?? ""}
                  onCommit={(v) => patchSection(section.uid, { heading: v })}
                  className="text-2xl font-bold tracking-tight @sm:text-3xl"
                  multiline
                  sectionUid={section.uid}
                  elementId="heading"
                />
                <Edit
                  as="p"
                  value={d.body ?? ""}
                  onCommit={(v) => patchSection(section.uid, { body: v })}
                  className="mt-4 text-sm leading-relaxed @sm:text-base"
                  style={{ color: pal.sub }}
                  multiline
                  sectionUid={section.uid}
                  elementId="body"
                />
              </div>
            </section>
          );
        case "media":
          return (
            <section
              key={section.uid}
              className={cn(pad.section, responsiveHideClass(d))}
              style={{ ...band, ...sectionPaddingStyle(d) }}
            >
              <div className={cn("mx-auto max-w-4xl", alignCenter && "text-center")}>
                {d.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- user-supplied URL
                  <img
                    src={d.imageUrl}
                    alt={d.imageAlt || "Image"}
                    onClick={(e) => {
                      if (designMode && onSelect) {
                        e.stopPropagation();
                        onSelect({ kind: "element", uid: section.uid, elementId: "image" });
                      }
                    }}
                    className={cn(
                      "mx-auto w-full max-h-[420px] object-cover",
                      designMode &&
                        isElementSelected(section.uid, "image") &&
                        "ring-2 ring-primary ring-offset-2"
                    )}
                    style={{ ...card, boxShadow: shadow }}
                  />
                ) : (
                  <div
                    className="flex min-h-40 flex-col items-center justify-center gap-2 border border-dashed px-6 py-10 text-center text-xs"
                    style={{ borderColor: pal.border, color: pal.sub, borderRadius: radius }}
                  >
                    <span className="font-medium">Drop an image here</span>
                    <span>Paste an image URL in the Inspector or Publish → Assets</span>
                  </div>
                )}
                {(d.caption || editable) && (
                  <Edit
                    as="p"
                    value={d.caption ?? ""}
                    onCommit={(v) => patchSection(section.uid, { caption: v })}
                    className="mt-3 text-xs"
                    style={{ color: pal.sub }}
                    sectionUid={section.uid}
                    elementId="caption"
                  />
                )}
              </div>
            </section>
          );
        case "buttons":
          return (
            <section
              key={section.uid}
              className={cn(pad.section, responsiveHideClass(d))}
              style={{ ...band, ...sectionPaddingStyle(d) }}
            >
              <div
                className={cn(
                  "mx-auto flex max-w-3xl flex-wrap gap-3",
                  alignCenter ? "justify-center" : "justify-start"
                )}
              >
                {(d.buttonPrimary || editable) && (
                  <Edit
                    as="button"
                    value={d.buttonPrimary ?? "Get started"}
                    onCommit={(v) => patchSection(section.uid, { buttonPrimary: v })}
                    className="px-5 py-2.5 text-sm font-semibold"
                    style={primaryBtn}
                    sectionUid={section.uid}
                    elementId="button-primary"
                  />
                )}
                {(d.buttonSecondary || editable) && (
                  <Edit
                    as="button"
                    value={d.buttonSecondary ?? ""}
                    onCommit={(v) => patchSection(section.uid, { buttonSecondary: v })}
                    className="px-5 py-2.5 text-sm font-semibold"
                    style={secondaryBtn}
                    sectionUid={section.uid}
                    elementId="button-secondary"
                  />
                )}
              </div>
            </section>
          );
        case "spacer":
          return (
            <div
              key={section.uid}
              className={cn("relative", responsiveHideClass(d))}
              style={{ height: d.spacerHeight ?? 64, ...band, ...sectionPaddingStyle(d) }}
            >
              {designMode && isSectionSelected(section.uid) && onSectionPatch && (
                <div
                  data-ui="1"
                  role="separator"
                  aria-label="Resize spacer"
                  className="absolute inset-x-8 bottom-0 z-20 flex h-3 cursor-ns-resize items-center justify-center"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    resizeRef.current = {
                      uid: section.uid,
                      startY: e.clientY,
                      startH: d.spacerHeight ?? 64,
                    };
                  }}
                >
                  <span className="h-1 w-16 rounded-full bg-primary/80" />
                </div>
              )}
            </div>
          );
        case "features":
          return (
            <section key={section.uid} className={pad.section} style={band}>
              <div className="mx-auto max-w-4xl">
                <Edit
                  as="h2"
                  value={cfg.featuresHeading}
                  onCommit={(v) => patch({ featuresHeading: v })}
                  className="text-center text-2xl font-bold tracking-tight"
                />
                <div className={cn("mt-8 grid grid-cols-1 gap-4", FEATURE_COLS[cfg.featureColumns])}>
                  {cfg.features.map((f, i) => {
                    const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                    return (
                      <div key={i} className="group/item relative p-5" style={{ ...card, boxShadow: shadow }}>
                        <Remove label="Remove feature" onClick={() => removeFeature(i)} />
                        <div
                          className="mb-3 flex size-9 items-center justify-center"
                          style={{ background: brandSoft, color: cfg.brandColor, borderRadius: Math.min(radius, 12) }}
                        >
                          <Icon weight="bold" className="size-5" />
                        </div>
                        <Edit
                          as="h3"
                          value={f.title}
                          onCommit={(v) => editFeature(i, "title", v)}
                          className="text-sm font-semibold"
                        />
                        <Edit
                          as="p"
                          value={f.desc}
                          onCommit={(v) => editFeature(i, "desc", v)}
                          className="mt-1 text-xs leading-relaxed"
                          style={{ color: pal.sub }}
                          multiline
                        />
                      </div>
                    );
                  })}
                  {cfg.features.length < 6 && (
                    <AddBtn label="Add feature" onClick={addFeature} className="min-h-24 p-5" />
                  )}
                </div>
              </div>
            </section>
          );
        case "stats":
          return (
            <section key={section.uid} className={pad.section} style={band}>
              <div className="mx-auto max-w-4xl">
                {cfg.statsHeading && (
                  <Edit
                    as="h2"
                    value={cfg.statsHeading}
                    onCommit={(v) => patch({ statsHeading: v })}
                    className="text-center text-2xl font-bold tracking-tight"
                  />
                )}
                <div className={cn("mt-8 grid grid-cols-2 gap-4", STATS_COLS[cfg.statsColumns])}>
                  {cfg.stats.map((s, i) => (
                    <div key={i} className="group/item relative p-5 text-center" style={{ ...card, boxShadow: shadow }}>
                      <Remove label="Remove stat" onClick={() => removeStat(i)} />
                      <Edit
                        as="div"
                        value={s.value}
                        onCommit={(v) => editStat(i, "value", v)}
                        className="text-2xl font-bold @sm:text-3xl"
                        style={{ color: cfg.brandColor }}
                      />
                      <Edit
                        as="div"
                        value={s.label}
                        onCommit={(v) => editStat(i, "label", v)}
                        className="mt-1 text-xs"
                        style={{ color: pal.sub }}
                      />
                    </div>
                  ))}
                  {cfg.stats.length < 6 && (
                    <AddBtn label="Add stat" onClick={addStat} className="min-h-20 p-5" />
                  )}
                </div>
              </div>
            </section>
          );
        case "logos":
          return (
            <section key={section.uid} className={pad.band} style={band}>
              <div className="mx-auto max-w-4xl text-center">
                <Edit
                  as="p"
                  value={cfg.logosHeading}
                  onCommit={(v) => patch({ logosHeading: v })}
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: pal.sub }}
                />
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                  {cfg.logos.map((l, i) => (
                    <span key={i} className="group/item relative inline-flex">
                      <Remove label="Remove logo" onClick={() => removeLogo(i)} />
                      <Edit
                        as="span"
                        value={l}
                        onCommit={(v) => editLogo(i, v)}
                        className="text-lg font-bold opacity-60"
                      />
                    </span>
                  ))}
                  {cfg.logos.length < 8 && (
                    <AddBtn label="Logo" onClick={addLogo} className="px-3 py-1.5" />
                  )}
                </div>
              </div>
            </section>
          );
        case "pricing":
          return (
            <section key={section.uid} className={pad.section} style={band}>
              <div className="mx-auto max-w-4xl">
                <Edit
                  as="h2"
                  value={cfg.pricingHeading}
                  onCommit={(v) => patch({ pricingHeading: v })}
                  className="text-center text-2xl font-bold tracking-tight"
                />
                <div className="mt-8 grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
                  {cfg.pricing.map((t, i) => (
                    <div
                      key={i}
                      className="group/item relative flex flex-col p-5"
                      style={{
                        background: pal.bg,
                        border: `1px solid ${t.featured ? cfg.brandColor : pal.border}`,
                        borderRadius: radius,
                        boxShadow: t.featured ? shadow : "none",
                      }}
                    >
                      <Remove label="Remove plan" onClick={() => removeTier(i)} />
                      {editable && (
                        <button
                          type="button"
                          data-ui="1"
                          aria-label={t.featured ? "Unmark as featured" : "Mark as featured"}
                          onClick={() => toggleFeatured(i)}
                          className={cn(
                            "absolute right-3 top-3 z-10 transition-opacity",
                            t.featured ? "opacity-100" : "opacity-0 group-hover/item:opacity-60 hover:!opacity-100"
                          )}
                          style={{ color: cfg.brandColor }}
                        >
                          <Star weight={t.featured ? "fill" : "bold"} className="size-4" />
                        </button>
                      )}
                      <Edit
                        as="span"
                        value={t.name}
                        onCommit={(v) => editTier(i, "name", v)}
                        className="text-xs font-semibold uppercase tracking-wide"
                        style={{ color: pal.sub }}
                      />
                      <div className="mt-2 flex items-end gap-1">
                        <Edit
                          as="span"
                          value={t.price}
                          onCommit={(v) => editTier(i, "price", v)}
                          className="text-3xl font-bold"
                        />
                        <Edit
                          as="span"
                          value={t.period}
                          onCommit={(v) => editTier(i, "period", v)}
                          className="mb-1 text-xs"
                          style={{ color: pal.sub }}
                        />
                      </div>
                      <ul className="mt-4 flex flex-col gap-2">
                        {t.perks.map((p, pj) => (
                          <li key={pj} className="group/perk flex items-center gap-2 text-xs">
                            <CheckCircle weight="fill" className="size-4 shrink-0" style={{ color: cfg.brandColor }} />
                            <Edit
                              as="span"
                              value={p}
                              onCommit={(v) => editPerk(i, pj, v)}
                            />
                            {editable && t.perks.length > 1 && (
                              <button
                                type="button"
                                data-ui="1"
                                aria-label="Remove perk"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => removePerk(i, pj)}
                                className="ml-auto hidden text-red-500 group-hover/perk:inline-flex"
                              >
                                <X weight="bold" className="size-3" />
                              </button>
                            )}
                          </li>
                        ))}
                        {editable && t.perks.length < 6 && (
                          <li>
                            <button
                              type="button"
                              data-ui="1"
                              onClick={() => addPerk(i)}
                              className="flex items-center gap-1 text-[11px] font-medium opacity-50 transition-opacity hover:opacity-100"
                              style={{ color: pal.sub }}
                            >
                              <Plus weight="bold" className="size-3" />
                              Add perk
                            </button>
                          </li>
                        )}
                      </ul>
                      <button className="mt-5 px-4 py-2 text-xs font-semibold" style={t.featured ? primaryBtn : secondaryBtn}>
                        Choose {t.name}
                      </button>
                    </div>
                  ))}
                  {cfg.pricing.length < 4 && (
                    <AddBtn label="Add plan" onClick={addTier} className="min-h-40 p-5" />
                  )}
                </div>
              </div>
            </section>
          );
        case "testimonial":
          return (
            <section key={section.uid} className={cn(pad.section, "text-center")} style={band}>
              <div className="mx-auto max-w-2xl">
                <Quotes weight="fill" className="mx-auto mb-4 size-8" style={{ color: cfg.brandColor }} />
                <Edit
                  as="p"
                  value={cfg.testimonialQuote}
                  onCommit={(v) => patch({ testimonialQuote: v })}
                  className="text-lg font-medium leading-relaxed @sm:text-xl"
                  multiline
                />
                <Edit
                  as="p"
                  value={cfg.testimonialAuthor}
                  onCommit={(v) => patch({ testimonialAuthor: v })}
                  className="mt-4 text-xs font-semibold"
                  style={{ color: pal.sub }}
                />
              </div>
            </section>
          );
        case "faq":
          return (
            <section key={section.uid} className={pad.section} style={band}>
              <div className="mx-auto max-w-2xl">
                <Edit
                  as="h2"
                  value={cfg.faqHeading}
                  onCommit={(v) => patch({ faqHeading: v })}
                  className="text-center text-2xl font-bold tracking-tight"
                />
                <div className="mt-8 flex flex-col gap-3">
                  {cfg.faq.map((f, i) => (
                    <div key={i} className="group/item relative p-4" style={{ ...card, boxShadow: "none" }}>
                      <Remove label="Remove question" onClick={() => removeFaqItem(i)} />
                      <Edit
                        as="p"
                        value={f.q}
                        onCommit={(v) => editFaq(i, "q", v)}
                        className="text-sm font-semibold"
                      />
                      <Edit
                        as="p"
                        value={f.a}
                        onCommit={(v) => editFaq(i, "a", v)}
                        className="mt-1.5 text-xs leading-relaxed"
                        style={{ color: pal.sub }}
                        multiline
                      />
                    </div>
                  ))}
                  {cfg.faq.length < 8 && (
                    <AddBtn label="Add question" onClick={addFaqItem} className="p-3" />
                  )}
                </div>
              </div>
            </section>
          );
        case "cta":
          return (
            <section key={section.uid} className={pad.section} style={band}>
              <div
                className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-12 text-center"
                style={{ background: cfg.brandColor, borderRadius: radius, boxShadow: shadow }}
              >
                <Edit
                  as="h2"
                  value={cfg.ctaHeadline}
                  onCommit={(v) => patch({ ctaHeadline: v })}
                  className="max-w-xl text-2xl font-bold tracking-tight text-white"
                  multiline
                />
                <button
                  className="px-5 py-2.5 text-sm font-semibold"
                  style={{ background: "#fff", color: cfg.brandColor, borderRadius: radius }}
                >
                  {cfg.ctaPrimary || "Get Started"}
                </button>
              </div>
            </section>
          );
        case "footer":
          return (
            <footer key={section.uid} className={pad.band} style={{ ...band, borderTop: `1px solid ${pal.border}` }}>
              <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 @sm:flex-row">
                <div className="flex items-center gap-2">
                  <div
                    className="flex size-5 items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: cfg.brandColor, borderRadius: Math.min(radius, 8) }}
                  >
                    {cfg.brandName.charAt(0).toUpperCase() || "A"}
                  </div>
                  <span className="text-xs font-semibold">{cfg.brandName || "Acme"}</span>
                </div>
                <span className="text-[11px]" style={{ color: pal.sub }} suppressHydrationWarning>
                  © {new Date().getFullYear()} {cfg.brandName || "Acme"}. All rights reserved.
                </span>
              </div>
            </footer>
          );
        default:
          return null;
      }
    };

    const visibleSections = cfg.sections.filter((s) => s.visible);
    const isEmptyCanvas =
      editable && !cfg.showNav && !cfg.showHero && visibleSections.length === 0;
    const isFrameSelected = (frame: "nav" | "hero") =>
      selection.kind === "frame" && selection.frame === frame;

    return (
      <div ref={ref} style={root} className="relative w-full text-left">
        {showGrid && designMode && (
          <div
            data-ui="1"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.08) 1px, transparent 1px)",
              backgroundSize: "8px 8px",
            }}
          />
        )}
        {/* Nav */}
        {cfg.showNav && (
        <header
          className={cn(
            "sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 px-5 py-3 backdrop-blur @sm:flex-nowrap",
            designMode && "cursor-pointer",
            isFrameSelected("nav") && "ring-2 ring-inset ring-primary/50"
          )}
          style={{ background: pal.navBg, borderBottom: `1px solid ${pal.border}` }}
          onClick={(e) => {
            if (!designMode || !onSelect) return;
            if ((e.target as HTMLElement).closest("[data-edit],[data-ui]")) return;
            onSelect({ kind: "frame", frame: "nav" });
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex size-6 items-center justify-center text-[11px] font-bold text-white"
              style={{ background: cfg.brandColor, borderRadius: Math.min(radius, 10) }}
            >
              {cfg.brandName.charAt(0).toUpperCase() || "A"}
            </div>
            <Edit as="span" value={cfg.brandName} onCommit={(v) => patch({ brandName: v })} className="text-sm font-semibold" />
          </div>
          <Edit
            as="button"
            value={cfg.ctaPrimary}
            onCommit={(v) => patch({ ctaPrimary: v })}
            className="order-2 px-3 py-1.5 text-xs font-medium @sm:order-none"
            style={primaryBtn}
          />
          <nav
            className="order-last flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs @sm:order-none @sm:w-auto @sm:justify-end"
            style={{ color: pal.sub }}
          >
            {cfg.navLinks.map((link, i) => (
              <span key={i} className="group/item relative inline-flex">
                <Remove label="Remove link" onClick={() => removeNavLink(i)} />
                <Edit
                  as="span"
                  value={link}
                  onCommit={(v) => patch({ navLinks: cfg.navLinks.map((x, idx) => (idx === i ? v : x)) })}
                />
              </span>
            ))}
            {editable && cfg.navLinks.length < 5 && (
              <button
                type="button"
                data-ui="1"
                aria-label="Add nav link"
                onClick={addNavLink}
                className="flex size-5 items-center justify-center rounded-full border border-dashed opacity-50 transition-opacity hover:opacity-100"
                style={{ borderColor: pal.sub, color: pal.sub }}
              >
                <Plus weight="bold" className="size-3" />
              </button>
            )}
          </nav>
        </header>
        )}

        {/* Hero */}
        {cfg.showHero && (
        <section
          className={cn(
            "relative overflow-hidden",
            pad.hero,
            designMode && "cursor-pointer",
            isFrameSelected("hero") && "ring-2 ring-inset ring-primary/50"
          )}
          style={{ backgroundImage: `radial-gradient(60% 80% at 50% 0%, ${brandSoft}, transparent 70%)` }}
          onClick={(e) => {
            if (!designMode || !onSelect) return;
            if ((e.target as HTMLElement).closest("[data-edit],[data-ui],button")) return;
            onSelect({ kind: "frame", frame: "hero" });
          }}
        >
          <div className={cn("flex flex-col", isCenter ? "items-center text-center" : "items-start text-left")}>
            {cfg.heroBadge && (
              <Edit
                as="span"
                value={cfg.heroBadge}
                onCommit={(v) => patch({ heroBadge: v })}
                className="mb-5 inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium"
                style={{ background: brandSoft, color: cfg.brandColor, borderRadius: 999, border: `1px solid ${pal.border}` }}
              />
            )}
            <Edit
              as="h1"
              value={cfg.heroHeadline}
              onCommit={(v) => patch({ heroHeadline: v })}
              className="max-w-2xl text-3xl font-bold leading-tight tracking-tight @sm:text-5xl"
              multiline
            />
            <Edit
              as="p"
              value={cfg.heroSubtitle}
              onCommit={(v) => patch({ heroSubtitle: v })}
              className="mt-4 max-w-xl text-sm @sm:text-base"
              style={{ color: pal.sub }}
              multiline
            />
            <div className={cn("mt-7 flex flex-wrap gap-3", isCenter ? "justify-center" : "justify-start")}>
              <button className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold" style={primaryBtn}>
                {cfg.ctaPrimary || "Get Started"}
                <ArrowRight weight="bold" className="size-4" />
              </button>
              {cfg.showSecondaryCta && cfg.ctaSecondary && (
                <Edit
                  as="button"
                  value={cfg.ctaSecondary}
                  onCommit={(v) => patch({ ctaSecondary: v })}
                  className="px-5 py-2.5 text-sm font-semibold"
                  style={secondaryBtn}
                />
              )}
            </div>
          </div>

          {/* Hero visual: custom image when provided, app mockup otherwise */}
          {cfg.showHeroVisual &&
            (cfg.heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element -- user-supplied external URL in exported page
              <img
                src={cfg.heroImage}
                alt="Hero visual"
                className="mx-auto mt-12 w-full max-w-3xl object-cover"
                style={{ ...card, boxShadow: shadow }}
              />
            ) : (
              <div
                className="mx-auto mt-12 flex w-full max-w-3xl flex-col items-center justify-center gap-2 border border-dashed px-6 py-16 text-center text-xs"
                style={{ borderColor: pal.border, color: pal.sub, borderRadius: radius }}
              >
                <span className="font-medium">Hero image placeholder</span>
                <span>Add a URL under Content → Hero image URL</span>
              </div>
            ))}
        </section>
        )}

        {isEmptyCanvas && onAddBlock && (
          <div
            data-ui="1"
            className="flex flex-col items-center justify-center gap-6 px-6 py-20 text-center [color:hsl(var(--foreground))] text-foreground"
          >
            <div>
              <p className="text-lg font-semibold text-foreground">
                Your page is empty — that&apos;s the point
              </p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Add blocks below or from the sidebar. Click text anytime to edit on the page.
              </p>
            </div>
            <LandingBlockPalette embedded onAdd={onAddBlock} className="max-w-md" />
          </div>
        )}

        {/* Ordered body sections — click a band to select it (Figma-style) */}
        {visibleSections.map((section, index) => {
            const selected = designMode && isSectionSelected(section.uid);
            return (
              <div
                key={section.uid}
                data-section-wrap={editable ? "1" : undefined}
                draggable={designMode}
                onDragStart={(e) => {
                  if (!designMode) return;
                  setDragSectionUid(section.uid);
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(e) => {
                  if (!designMode || !dragSectionUid) return;
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  if (!designMode || !dragSectionUid || !onReorderSection) return;
                  e.preventDefault();
                  const from = visibleSections.findIndex((s) => s.uid === dragSectionUid);
                  const to = index;
                  if (from >= 0 && from !== to) onReorderSection(from, to);
                  setDragSectionUid(null);
                }}
                onDragEnd={() => setDragSectionUid(null)}
                className={cn(
                  "relative",
                  designMode && "cursor-pointer",
                  selected && "ring-2 ring-inset ring-primary/60",
                  dragSectionUid === section.uid && "opacity-60"
                )}
                onClick={(e) => {
                  if (!editable) return;
                  const t = e.target as HTMLElement;
                  if (t.closest("[data-edit],[data-ui]")) return;
                  onSelect?.({ kind: "section", uid: section.uid });
                }}
              >
                {designMode && selected && onSectionAction && (
                  <div
                    data-ui="1"
                    className="absolute left-2 top-1/2 z-30 flex -translate-y-1/2 cursor-grab items-center text-primary active:cursor-grabbing"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DotsSixVertical weight="bold" className="size-5" />
                  </div>
                )}
                {designMode && selected && onSectionAction && (
                  <div
                    data-ui="1"
                    className="absolute right-3 top-3 z-30 flex items-center gap-0.5 rounded-md border border-border bg-background/95 p-0.5 shadow-lg backdrop-blur"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {(
                      [
                        { action: "up" as const, icon: CaretUp, label: "Move up" },
                        { action: "down" as const, icon: CaretDown, label: "Move down" },
                        { action: "hide" as const, icon: EyeSlash, label: "Hide section" },
                        { action: "duplicate" as const, icon: CopySimple, label: "Duplicate" },
                        { action: "remove" as const, icon: Trash, label: "Remove" },
                      ] as const
                    ).map(({ action, icon: Icon, label }) => (
                      <button
                        key={action}
                        type="button"
                        data-ui="1"
                        aria-label={label}
                        onClick={() => onSectionAction(section.uid, action)}
                        className={cn(
                          "flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                          action === "remove" && "hover:text-destructive"
                        )}
                      >
                        <Icon weight="bold" className="size-3.5" />
                      </button>
                    ))}
                  </div>
                )}
                {renderSection(section)}
              </div>
            );
          })}
        {editable && onAddBlock && visibleSections.length > 0 && (
          <div
            data-ui="1"
            className="border-t border-dashed border-border bg-muted/30 px-4 py-6 [color:hsl(var(--foreground))] text-foreground"
          >
            <p className="mb-3 text-center text-[11px] font-medium text-muted-foreground">
              Add another block
            </p>
            <LandingBlockPalette
              embedded
              onAdd={onAddBlock}
              compact
              className="mx-auto max-w-lg"
            />
          </div>
        )}
      </div>
    );
  }
);
