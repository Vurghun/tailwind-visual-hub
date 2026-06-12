"use client";

import * as React from "react";

import { PanelSection, WorkspaceLayout } from "@/components/app-workspace";
import { CodeBlock, SegmentedRow, SliderRow, AdSlot } from "@/components/controls";
import { cn } from "@/lib/utils";

type FlexConfig = {
  direction: "row" | "col";
  justify: "start" | "center" | "between" | "end";
  align: "start" | "center" | "stretch" | "end";
  gap: number;
  wrap: boolean;
};

const DEFAULT: FlexConfig = { direction: "row", justify: "center", align: "center", gap: 16, wrap: false };

const justifyMap = { start: "justify-start", center: "justify-center", between: "justify-between", end: "justify-end" };
const alignMap = { start: "items-start", center: "items-center", stretch: "items-stretch", end: "items-end" };

function toClass(c: FlexConfig): string {
  return [
    "flex",
    c.direction === "col" ? "flex-col" : "flex-row",
    justifyMap[c.justify],
    alignMap[c.align],
    c.wrap ? "flex-wrap" : "flex-nowrap",
    `gap-[${c.gap}px]`,
  ].join(" ");
}

export function FlexboxTool({
  onCopy,
}: {
  showToast: (msg: string, ok?: boolean) => void;
  onCopy: (text: string) => void;
}) {
  const [cfg, setCfg] = React.useState(DEFAULT);
  const classString = toClass(cfg);

  return (
    <WorkspaceLayout
      sidebar={
        <div className="scroll-panel space-y-6 p-4">
          <PanelSection title="Flex container">
            <SegmentedRow
              label="Direction"
              value={cfg.direction}
              options={[
                { value: "row", label: "Row" },
                { value: "col", label: "Column" },
              ]}
              onChange={(v) => setCfg((p) => ({ ...p, direction: v as FlexConfig["direction"] }))}
            />
            <SegmentedRow
              label="Justify"
              value={cfg.justify}
              options={[
                { value: "start", label: "Start" },
                { value: "center", label: "Center" },
                { value: "between", label: "Between" },
              ]}
              onChange={(v) => setCfg((p) => ({ ...p, justify: v as FlexConfig["justify"] }))}
            />
            <SegmentedRow
              label="Align"
              value={cfg.align}
              options={[
                { value: "start", label: "Start" },
                { value: "center", label: "Center" },
                { value: "stretch", label: "Stretch" },
              ]}
              onChange={(v) => setCfg((p) => ({ ...p, align: v as FlexConfig["align"] }))}
            />
            <SliderRow label="Gap" value={cfg.gap} min={0} max={48} onChange={(v) => setCfg((p) => ({ ...p, gap: v }))} />
          </PanelSection>
        </div>
      }
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="min-h-[240px] rounded-xl border border-dashed border-border bg-muted/20 p-4">
          <div className={cn(classString, "min-h-[200px] rounded-lg border border-border/60 bg-background/80 p-4")}>
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex h-16 min-w-[4rem] flex-1 items-center justify-center rounded-md bg-primary/80 text-sm font-medium text-primary-foreground">
                {n}
              </div>
            ))}
          </div>
        </div>
        <CodeBlock code={classString} onCopy={() => onCopy(classString)} />
        <AdSlot placement="shadow" label="Flexbox tool · responsive ad" />
      </div>
    </WorkspaceLayout>
  );
}
