"use client";

import * as React from "react";
import {
  ClockCounterClockwise,
  Warning,
  Copy,
  Trash,
  CircleNotch,
} from "@phosphor-icons/react";

import {
  getSupabase,
  isSupabaseConfigured,
  type SavedComponent,
  type ToolId,
} from "@/lib/supabase";
import { ensureSaveSession, resetSaveSession } from "@/lib/save-session";
import { timeAgo } from "@/lib/css";
import { Card, CardContent } from "@/components/ui/card";

export function SavedDesigns({
  tool,
  reloadSignal,
  onApply,
  onCopy,
  showToast,
  renderPreview,
  getLabel,
}: {
  tool: ToolId;
  reloadSignal: number;
  onApply: (config: Record<string, unknown>) => void;
  onCopy: (text: string) => void;
  showToast: (msg: string, ok?: boolean) => void;
  renderPreview: (config: Record<string, unknown>) => React.ReactNode;
  getLabel: (item: SavedComponent) => string;
}) {
  const [items, setItems] = React.useState<SavedComponent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    const run = async () => {
      const supabase = getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const authed = await ensureSaveSession(supabase);
      if (!authed) {
        if (active) {
          setItems([]);
          setLoading(false);
        }
        return;
      }
      const { data, error } = await supabase
        .from("saved_components")
        .select("*")
        .eq("tool", tool)
        .order("created_at", { ascending: false })
        .limit(6);
      if (active && !error && data) setItems(data as SavedComponent[]);
      if (active && error) {
        resetSaveSession();
        setItems([]);
      }
      if (active) setLoading(false);
    };
    run();
    return () => {
      active = false;
    };
  }, [tool, reloadSignal]);

  const handleDelete = React.useCallback(
    async (id: string) => {
      const supabase = getSupabase();
      if (!supabase) return;
      setDeletingId(id);
      const authed = await ensureSaveSession(supabase);
      if (!authed) {
        setDeletingId(null);
        showToast("Couldn't verify your save session", false);
        return;
      }
      const { error } = await supabase
        .from("saved_components")
        .delete()
        .eq("id", id);
      setDeletingId(null);
      if (error) {
        showToast("Couldn't delete design", false);
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== id));
      showToast("Design deleted");
    },
    [showToast]
  );

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClockCounterClockwise weight="bold" className="size-4 text-muted-foreground" />
          <div>
            <h2 className="font-heading text-base font-semibold tracking-tight">
              Your saved work
            </h2>
            <p className="text-xs text-muted-foreground">Click a tile to load it again.</p>
          </div>
        </div>
        {!isSupabaseConfigured && (
          <span className="flex items-center gap-1.5 rounded-none bg-amber-500/10 px-2 py-1 text-[10px] font-medium text-amber-600 dark:text-amber-400">
            <Warning weight="bold" className="size-3.5" />
            Supabase not configured
          </span>
        )}
      </div>

      {!isSupabaseConfigured ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Add your{" "}
            <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
            <code className="font-mono">.env.local</code>, enable{" "}
            <span className="font-medium text-foreground">Anonymous sign-ins</span>{" "}
            in Supabase, run the SQL in{" "}
            <code className="font-mono">supabase/saved_components.sql</code>,
            then restart the dev server. Saves are private to each browser.
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-xl border border-border bg-muted/40"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No saved designs yet — tweak the controls and hit{" "}
            <span className="font-medium text-foreground">Save Design</span>.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="saved-tile group"
            >
              {/* Hover actions */}
              <div className="absolute right-1.5 top-1.5 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                {item.class_string && (
                  <button
                    type="button"
                    title="Copy classes"
                    onClick={() => onCopy(item.class_string as string)}
                    className="flex size-7 items-center justify-center rounded-md border border-border/80 bg-background/95 text-foreground shadow-sm backdrop-blur hover:bg-background"
                  >
                    <Copy weight="bold" className="size-3" />
                  </button>
                )}
                <button
                  type="button"
                  title="Delete design"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="flex size-7 items-center justify-center rounded-md border border-border/80 bg-background/95 text-destructive shadow-sm backdrop-blur hover:bg-background disabled:opacity-50"
                >
                  {deletingId === item.id ? (
                    <CircleNotch weight="bold" className="size-3 animate-spin" />
                  ) : (
                    <Trash weight="bold" className="size-3" />
                  )}
                </button>
              </div>

              {/* Clickable preview to load */}
              <button
                type="button"
                onClick={() => onApply(item.config)}
                title="Click to load this design"
                className="block h-24 w-full overflow-hidden focus-visible:outline-1 focus-visible:outline-ring"
              >
                {renderPreview(item.config)}
              </button>

              <div className="flex items-center justify-between gap-1 border-t border-border px-2 py-1.5">
                <span className="truncate font-mono text-[10px] text-muted-foreground">
                  {getLabel(item)}
                </span>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {timeAgo(item.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
