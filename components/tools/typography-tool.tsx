"use client";

import * as React from "react";

import { PanelSection, WorkspaceLayout } from "@/components/app-workspace";
import { CodeBlock, SliderRow, SegmentedRow, AdSlot } from "@/components/controls";
import { nearestTextSize } from "@/lib/css";

export function TypographyTool({
  onCopy,
}: {
  showToast: (msg: string, ok?: boolean) => void;
  onCopy: (text: string) => void;
}) {
  const [size, setSize] = React.useState(18);
  const [weight, setWeight] = React.useState<"normal" | "medium" | "semibold" | "bold">("semibold");
  const [leading, setLeading] = React.useState(1.5);

  const sizeClass = nearestTextSize(size);
  const weightClass =
    weight === "normal"
      ? "font-normal"
      : weight === "medium"
        ? "font-medium"
        : weight === "semibold"
          ? "font-semibold"
          : "font-bold";
  const leadingClass =
    leading <= 1.25 ? "leading-tight" : leading <= 1.5 ? "leading-normal" : "leading-relaxed";
  const classString = `${sizeClass} ${weightClass} ${leadingClass}`;

  return (
    <WorkspaceLayout
      sidebar={
        <div className="scroll-panel space-y-6 p-4">
          <PanelSection title="Type scale">
            <SliderRow label="Font size" value={size} min={12} max={48} unit="px" onChange={setSize} />
            <SegmentedRow
              label="Weight"
              value={weight}
              options={[
                { value: "normal", label: "Regular" },
                { value: "semibold", label: "Semi" },
                { value: "bold", label: "Bold" },
              ]}
              onChange={setWeight}
            />
            <SliderRow label="Line height" value={Math.round(leading * 100)} min={120} max={180} step={5} unit="%" onChange={(v) => setLeading(v / 100)} />
          </PanelSection>
        </div>
      }
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-8">
          <p className={classString}>The quick brown fox jumps over the lazy dog.</p>
        </div>
        <CodeBlock code={classString} onCopy={() => onCopy(classString)} />
        <AdSlot placement="footer" label="Typography tool · responsive ad" />
      </div>
    </WorkspaceLayout>
  );
}
