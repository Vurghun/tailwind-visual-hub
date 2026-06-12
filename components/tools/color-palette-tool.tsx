"use client";

import * as React from "react";

import { PanelSection, WorkspaceLayout } from "@/components/app-workspace";
import { CodeBlock, ColorRow, AdSlot } from "@/components/controls";
import { generatePalette } from "@/lib/css";

export function ColorPaletteTool({
  showToast,
  onCopy,
}: {
  showToast: (msg: string, ok?: boolean) => void;
  onCopy: (text: string) => void;
}) {
  const [base, setBase] = React.useState("#6366F1");
  const palette = React.useMemo(() => generatePalette(base), [base]);
  const allClasses = palette.map((p) => p.className).join(" ");

  return (
    <WorkspaceLayout
      sidebar={
        <div className="scroll-panel p-4">
          <PanelSection title="Brand color" description="Generate a 5-step palette for backgrounds and accents.">
            <ColorRow label="Base hex" value={base} onChange={setBase} />
          </PanelSection>
        </div>
      }
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-5 gap-2 rounded-xl border border-border p-4">
          {palette.map((step) => (
            <button
              key={step.label}
              type="button"
              onClick={() => {
                onCopy(step.className);
                showToast(`Copied ${step.className}`);
              }}
              className="group flex flex-col gap-2 rounded-lg p-2 text-left transition-colors hover:bg-muted/50"
            >
              <div className="aspect-square w-full rounded-md ring-1 ring-border" style={{ background: step.hex }} />
              <span className="font-mono text-[10px] text-muted-foreground group-hover:text-foreground">{step.hex}</span>
              <span className="font-mono text-[9px] text-primary">{step.className}</span>
            </button>
          ))}
        </div>
        <CodeBlock code={allClasses} onCopy={() => onCopy(allClasses)} />
        <p className="text-xs text-muted-foreground">
          Click a swatch to copy one class, or copy all five for a quick design system starter.
        </p>
        <AdSlot placement="gradient" label="Palette tool · responsive ad" />
      </div>
    </WorkspaceLayout>
  );
}
