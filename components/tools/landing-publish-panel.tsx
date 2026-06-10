"use client";

import * as React from "react";
import {
  LinkSimple,
  ClockCounterClockwise,
  Warning,
  CheckCircle,
  Sparkle,
  Image as ImageIcon,
  Plus,
} from "@phosphor-icons/react";

import type { LandingConfig, LandingSeo, LandingVersion } from "@/lib/supabase";
import {
  buildAiSuggestions,
  loadAssets,
  loadVersionHistory,
  pushVersionHistory,
  runA11yChecks,
  saveAssets,
  shareUrl,
  newId,
  type AssetItem,
} from "@/lib/landing-model";
import { TextRow } from "@/components/controls";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function LandingPublishPanel({
  cfg,
  designKey,
  onPatchSeo,
  onApplyConfig,
  onCopy,
  showToast,
}: {
  cfg: LandingConfig;
  designKey: string;
  onPatchSeo: (seo: Partial<LandingSeo>) => void;
  onApplyConfig: (cfg: LandingConfig) => void;
  onCopy: (text: string) => void;
  showToast: (msg: string, ok?: boolean) => void;
}) {
  const [versions, setVersions] = React.useState<LandingVersion[]>([]);
  const [assets, setAssets] = React.useState<AssetItem[]>([]);
  const [assetUrl, setAssetUrl] = React.useState("");
  const [assetName, setAssetName] = React.useState("");

  React.useEffect(() => {
    setVersions(loadVersionHistory(designKey));
    setAssets(loadAssets());
  }, [designKey]);

  const a11y = React.useMemo(() => runA11yChecks(cfg), [cfg]);
  const suggestions = React.useMemo(() => buildAiSuggestions(cfg), [cfg]);
  const link =
    typeof window !== "undefined" ? shareUrl(cfg, window.location.origin) : "";

  const snapshot = () => {
    const label = new Date().toLocaleString();
    const next = pushVersionHistory(designKey, cfg, label);
    setVersions(next);
    showToast("Version snapshot saved");
  };

  const addAsset = () => {
    if (!assetUrl.trim()) return;
    const next = [
      { id: newId("asset"), name: assetName.trim() || "Image", url: assetUrl.trim(), createdAt: Date.now() },
      ...assets,
    ].slice(0, 40);
    saveAssets(next);
    setAssets(next);
    setAssetUrl("");
    setAssetName("");
    showToast("Asset added to library");
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <LinkSimple weight="bold" className="size-4" />
            Share & publish
          </CardTitle>
          <CardDescription>Read-only preview link — no account needed.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="break-all rounded-none border border-border bg-muted/40 px-2 py-1.5 font-mono text-[10px]">
            {link || "…"}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            disabled={!link}
            onClick={() => {
              onCopy(link);
              showToast("Share link copied");
            }}
          >
            <LinkSimple weight="bold" className="size-3.5" />
            Copy share link
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">SEO</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <TextRow
            label="Meta title"
            value={cfg.seo.metaTitle}
            onChange={(v) => onPatchSeo({ metaTitle: v })}
          />
          <TextRow
            label="Meta description"
            value={cfg.seo.metaDescription}
            multiline
            onChange={(v) => onPatchSeo({ metaDescription: v })}
          />
          <TextRow
            label="Social preview image URL"
            value={cfg.seo.ogImage}
            onChange={(v) => onPatchSeo({ ogImage: v.trim() })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Warning weight="bold" className="size-4" />
            Accessibility
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {a11y.length === 0 && (
            <p className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle weight="fill" className="size-4" />
              No issues detected.
            </p>
          )}
          {a11y.map((issue, i) => (
            <p
              key={i}
              className={cn(
                "text-xs",
                issue.level === "error" ? "text-destructive" : "text-amber-600 dark:text-amber-400"
              )}
            >
              {issue.message}
            </p>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkle weight="fill" className="size-4 text-primary" />
            Smart suggestions
          </CardTitle>
          <CardDescription>One-click improvements (no API key required).</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {suggestions.length === 0 && (
            <p className="text-xs text-muted-foreground">Looking good — no suggestions right now.</p>
          )}
          {suggestions.map((s) => (
            <Button
              key={s.label}
              size="sm"
              variant="outline"
              className="justify-start text-left"
              onClick={() => {
                onApplyConfig(s.apply(cfg));
                showToast(`Applied: ${s.label}`);
              }}
            >
              {s.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ImageIcon weight="bold" className="size-4" />
            Asset library
          </CardTitle>
          <CardDescription>Store image URLs for quick reuse (local browser).</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <input
            type="text"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            placeholder="Name (optional)"
            className="h-8 rounded-none border border-border bg-background px-2 text-xs outline-none focus-visible:border-ring"
          />
          <input
            type="text"
            value={assetUrl}
            onChange={(e) => setAssetUrl(e.target.value)}
            placeholder="https://…"
            className="h-8 rounded-none border border-border bg-background px-2 text-xs outline-none focus-visible:border-ring"
          />
          <Button size="sm" variant="outline" className="gap-1.5" onClick={addAsset}>
            <Plus weight="bold" className="size-3.5" />
            Add asset
          </Button>
          <div className="max-h-32 overflow-y-auto">
            {assets.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  onCopy(a.url);
                  showToast(`Copied ${a.name}`);
                }}
                className="flex w-full items-center justify-between gap-2 border-b border-border py-1.5 text-left text-[11px] hover:bg-accent"
              >
                <span className="truncate font-medium">{a.name}</span>
                <span className="shrink-0 text-muted-foreground">Copy URL</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ClockCounterClockwise weight="bold" className="size-4" />
            Version history
          </CardTitle>
          <CardDescription>Snapshots stored in this browser.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button size="sm" onClick={snapshot}>
            Save snapshot now
          </Button>
          <div className="max-h-40 overflow-y-auto">
            {versions.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  onApplyConfig(v.config);
                  showToast(`Restored ${v.label}`);
                }}
                className="flex w-full border-b border-border py-2 text-left text-xs hover:bg-accent"
              >
                <span className="font-medium">{v.label}</span>
              </button>
            ))}
            {versions.length === 0 && (
              <p className="py-2 text-xs text-muted-foreground">No snapshots yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
