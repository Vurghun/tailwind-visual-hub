import * as React from "react";

import { cn } from "@/lib/utils";

/** Figma-style split: scrollable left panel + canvas on the right. */
export function WorkspaceLayout({
  sidebar,
  children,
  className,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("workspace-frame", className)}>
      <aside className="workspace-sidebar scroll-panel">{sidebar}</aside>
      <div className="workspace-canvas">{children}</div>
    </div>
  );
}

/** Toolbar row above the canvas (undo, save, device toggles, etc.). */
export function WorkspaceToolbar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("workspace-toolbar", className)}>{children}</div>;
}

/** Grouped icon buttons in the canvas toolbar. */
export function WorkspaceToolbarGroup({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {label ? (
        <span className="hidden text-[10px] font-medium uppercase tracking-wider text-muted-foreground xl:inline">
          {label}
        </span>
      ) : null}
      <div className="workspace-toolbar-group">{children}</div>
    </div>
  );
}

/** Grouped block inside a sidebar — replaces nested cards. */
export function PanelSection({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("panel-section", className)}>
      <div className="panel-section-header">
        <div className="min-w-0 flex-1">
          <h3 className="panel-section-title">{title}</h3>
          {description ? <p className="panel-section-desc">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="panel-section-body">{children}</div>
    </section>
  );
}

/** Contextual guide with a horizontal stepper under the title. */
export function ToolContextBar({
  title,
  description,
  steps,
}: {
  title: string;
  description: string;
  steps?: readonly string[];
}) {
  return (
    <div className="tool-context-bar">
      <div className="tool-context-top">
        <div className="min-w-0">
          <p className="tool-context-title">{title}</p>
          <p className="tool-context-desc">{description}</p>
        </div>
      </div>
      {steps && steps.length > 0 ? (
        <div className="tool-context-stepper">
          {steps.map((step, i) => (
            <React.Fragment key={step}>
              <div className="tool-context-step">
                <span className="tool-context-step-badge">{i + 1}</span>
                <span className="tool-context-step-text">{step}</span>
              </div>
              {i < steps.length - 1 ? (
                <span className="tool-context-step-connector" aria-hidden />
              ) : null}
            </React.Fragment>
          ))}
        </div>
      ) : null}
    </div>
  );
}
