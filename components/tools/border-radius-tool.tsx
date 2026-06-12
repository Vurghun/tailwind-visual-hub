"use client";

import * as React from "react";
import { ArrowCounterClockwise } from "@phosphor-icons/react";

import { PanelSection, WorkspaceLayout } from "@/components/app-workspace";
import { CodeBlock, SliderRow, AdSlot } from "@/components/controls";
import { Button } from "@/components/ui/button";

type RadiusConfig = { radius: number; topLeft: number; topRight: number; bottomRight: number; bottomLeft: number; uniform: boolean };

const DEFAULT: RadiusConfig = { radius: 16, topLeft: 16, topRight: 16, bottomRight: 16, bottomLeft: 16, uniform: true };

const PRESETS = [
  { name: "None", config: { ...DEFAULT, radius: 0, topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 } },
  { name: "Soft", config: { ...DEFAULT, radius: 12 } },
  { name: "Card", config: { ...DEFAULT, radius: 16 } },
  { name: "Pill", config: { ...DEFAULT, radius: 9999 } },
  { name: "Bubble", config: { ...DEFAULT, radius: 24, uniform: false, topLeft: 32, topRight: 32, bottomRight: 8, bottomLeft: 8 } },
];

function toClass(c: RadiusConfig): string {
  if (c.uniform || (c.topLeft === c.topRight && c.topRight === c.bottomRight && c.bottomRight === c.bottomLeft)) {
    if (c.radius >= 9999) return "rounded-full";
    return `rounded-[${c.radius}px]`;
  }
  return `rounded-tl-[${c.topLeft}px] rounded-tr-[${c.topRight}px] rounded-br-[${c.bottomRight}px] rounded-bl-[${c.bottomLeft}px]`;
}

function toStyle(c: RadiusConfig): React.CSSProperties {
  if (c.uniform) return { borderRadius: c.radius >= 9999 ? 9999 : c.radius };
  return {
    borderTopLeftRadius: c.topLeft,
    borderTopRightRadius: c.topRight,
    borderBottomRightRadius: c.bottomRight,
    borderBottomLeftRadius: c.bottomLeft,
  };
}

export function BorderRadiusTool({
  showToast,
  onCopy,
}: {
  showToast: (msg: string, ok?: boolean) => void;
  onCopy: (text: string) => void;
}) {
  const [cfg, setCfg] = React.useState(DEFAULT);
  const set = (patch: Partial<RadiusConfig>) =>
    setCfg((prev) => {
      const next = { ...prev, ...patch };
      if (next.uniform && patch.radius !== undefined) {
        next.topLeft = next.topRight = next.bottomRight = next.bottomLeft = next.radius;
      }
      return next;
    });

  const classString = toClass(cfg);

  return (
    <WorkspaceLayout
      sidebar={
        <div className="scroll-panel min-h-0 flex-1 space-y-6 p-4">
          <PanelSection title="Presets">
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <Button key={p.name} size="sm" variant="outline" onClick={() => setCfg({ ...p.config })}>
                  {p.name}
                </Button>
              ))}
            </div>
          </PanelSection>
          <PanelSection title="Radius">
            <SliderRow label="All corners" value={cfg.radius} min={0} max={48} onChange={(v) => set({ radius: v, uniform: true })} />
          </PanelSection>
        </div>
      }
    >
      <div className="flex min-h-[420px] flex-col gap-4 p-4">
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-8">
          <div className="size-40 bg-primary shadow-lg" style={toStyle(cfg)} />
        </div>
        <CodeBlock code={classString} onCopy={() => onCopy(classString)} />
        <Button size="sm" variant="ghost" className="gap-1.5 self-start" onClick={() => setCfg(DEFAULT)}>
          <ArrowCounterClockwise weight="bold" className="size-3.5" /> Reset
        </Button>
        <AdSlot placement="shadow" label="Radius tool · responsive ad" />
      </div>
    </WorkspaceLayout>
  );
}
