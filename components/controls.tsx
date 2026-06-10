"use client";

import * as React from "react";
import { Copy, Check, FloppyDisk, CircleNotch } from "@phosphor-icons/react";

import {
  uiBadge,
  uiInput,
  uiInputSm,
  uiKbd,
  uiPanelMuted,
  uiSuccess,
  uiTextarea,
} from "@/lib/ui";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "px",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-medium text-foreground">{label}</label>
        <span className={cn(uiBadge, "font-mono tabular-nums")}>
          {value}
          {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
      />
    </div>
  );
}

export function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-xs font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className={cn(uiInputSm, "h-8 w-24 font-mono uppercase")}
        />
        <div className="relative size-8 shrink-0 overflow-hidden rounded-md border border-input shadow-xs">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -inset-2 cursor-pointer appearance-none border-0 bg-transparent p-0"
          />
        </div>
      </div>
    </div>
  );
}

export function CodeBlock({
  code,
  onCopy,
}: {
  code: string;
  onCopy: (text: string) => void;
}) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div className={cn(uiPanelMuted, "relative mt-1 overflow-hidden p-0")}>
      <pre className="overflow-x-auto p-4 pr-24 font-mono text-xs leading-relaxed text-foreground">
        <code className="break-words whitespace-pre-wrap">{code}</code>
      </pre>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          onCopy(code);
          setCopied(true);
        }}
        className="absolute right-2 top-2 gap-1.5 shadow-xs"
      >
        {copied ? (
          <Check weight="bold" className={cn("size-3.5", uiSuccess)} />
        ) : (
          <Copy weight="bold" className="size-3.5" />
        )}
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>
  );
}

export function TextRow({
  label,
  value,
  placeholder,
  multiline = false,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  multiline?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-foreground">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className={uiTextarea}
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={uiInputSm}
        />
      )}
    </div>
  );
}

export function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
      <label className="text-xs font-medium text-foreground">{label}</label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function SegmentedRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-foreground">{label}</label>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))` }}
      >
        {options.map((o) => (
          <Button
            key={o.value}
            size="sm"
            variant={value === o.value ? "default" : "outline"}
            onClick={() => onChange(o.value)}
            className="capitalize shadow-xs"
          >
            {o.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function SaveBar({
  name,
  onNameChange,
  saving,
  onSave,
}: {
  name: string;
  onNameChange: (v: string) => void;
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Name this design (optional)"
        spellCheck={false}
        className={cn(uiInputSm, "flex-1 sm:min-w-0")}
      />
      <Button
        size="lg"
        variant="default"
        onClick={onSave}
        disabled={saving}
        className="gap-1.5 shadow-sm"
      >
        {saving ? (
          <CircleNotch weight="bold" className="size-3.5 animate-spin" />
        ) : (
          <FloppyDisk weight="bold" className="size-3.5" />
        )}
        {saving ? "Saving…" : "Save Design"}
      </Button>
    </div>
  );
}

export function AdSlot({ label }: { label: string }) {
  return (
    <div className="flex min-h-[220px] w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-6 ring-1 ring-foreground/5">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className={uiBadge}>Advertisement</span>
        <span className="max-w-sm text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

export { uiKbd };
