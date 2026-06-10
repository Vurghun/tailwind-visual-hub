"use client";

import * as React from "react";

import { getSupabase, type ToolId } from "@/lib/supabase";

type SavePayload = {
  name: string;
  classString: string;
  config: Record<string, unknown>;
};

/**
 * Encapsulates the "Save Design" insert flow for a given tool. Returns a
 * `reloadSignal` that the matching <SavedDesigns> grid can watch to refetch.
 */
export function useSaveDesign(
  tool: ToolId,
  showToast: (msg: string, ok?: boolean) => void
) {
  const [saving, setSaving] = React.useState(false);
  const [reloadSignal, setReloadSignal] = React.useState(0);

  const save = React.useCallback(
    async ({ name, classString, config }: SavePayload) => {
      const supabase = getSupabase();
      if (!supabase) {
        showToast("Connect Supabase to save designs", false);
        return;
      }
      setSaving(true);
      const { error } = await supabase.from("saved_components").insert({
        name: name.trim() || null,
        tool,
        class_string: classString,
        config,
      });
      setSaving(false);

      if (error) {
        showToast("Couldn't save design", false);
        return;
      }
      showToast("Design saved!");
      setReloadSignal((s) => s + 1);
    },
    [tool, showToast]
  );

  return { saving, save, reloadSignal };
}
