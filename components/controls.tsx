"use client";

import * as React from "react";
import { Copy, Check, FloppyDisk, CircleNotch } from "@phosphor-icons/react";

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
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">
          {label}
        </label>
        <span className="rounded-none bg-muted px-1.5 py-0.5 font-mono text-xs tabular-nums text-foreground">
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
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="h-7 w-24 rounded-none border border-border bg-background px-2 font-mono text-xs uppercase outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
        />
        <div className="relative size-7 shrink-0 overflow-hidden rounded-none border border-border">
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
    <div className="relative mt-1 rounded-none border border-border bg-muted/40">
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
        className="absolute right-2 top-2 gap-1.5"
      >
        {copied ? (
          <Check weight="bold" className="size-3.5 text-emerald-500" />
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
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="resize-none rounded-none border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 rounded-none border border-border bg-background px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
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
    <div className="flex items-center justify-between">
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
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
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
            className={cn("capitalize")}
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
        className="h-8 flex-1 rounded-none border border-border bg-background px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
      />
      <Button
        size="lg"
        variant="default"
        onClick={onSave}
        disabled={saving}
        className="gap-1.5"
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
    <div className="flex h-[250px] w-full items-center justify-center rounded-none border border-dashed border-border bg-zinc-200/60 dark:bg-zinc-800/40">
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="rounded-none bg-zinc-300 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
          Advertisement
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
      </div>
    </div>
  );
}
