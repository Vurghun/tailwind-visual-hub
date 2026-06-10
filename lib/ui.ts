/** Shared layout + form classes — all colors from theme tokens, no hard-coded palettes. */
export const uiInput =
  "h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50";

export const uiInputSm =
  "h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25";

export const uiTextarea =
  "min-h-[4.5rem] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25";

export const uiPanel =
  "rounded-xl border border-border bg-card text-card-foreground shadow-sm ring-1 ring-foreground/5";

export const uiPanelMuted =
  "rounded-xl border border-border bg-muted/30 text-foreground ring-1 ring-foreground/5";

export const uiToolbar =
  "flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card/80 p-2 shadow-sm ring-1 ring-foreground/5 backdrop-blur-sm";

export const uiBadge =
  "inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-secondary-foreground";

export const uiKbd =
  "rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground";

export const uiSuccess = "text-success";
export const uiWarning = "text-warning";
