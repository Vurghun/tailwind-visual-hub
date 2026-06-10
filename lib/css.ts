/** Pure, framework-agnostic helpers shared across the generator tools. */

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let normalized = (hex || "").replace("#", "");
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const int = parseInt(normalized || "000000", 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

/** Snap a px value to the nearest Tailwind backdrop-blur token. */
export function nearestBlurToken(px: number): string {
  const tokens: [number, string][] = [
    [0, "backdrop-blur-none"],
    [4, "backdrop-blur-sm"],
    [8, "backdrop-blur"],
    [12, "backdrop-blur-md"],
    [16, "backdrop-blur-lg"],
    [24, "backdrop-blur-xl"],
    [40, "backdrop-blur-2xl"],
    [64, "backdrop-blur-3xl"],
  ];
  let best = tokens[0];
  for (const t of tokens) {
    if (Math.abs(t[0] - px) < Math.abs(best[0] - px)) best = t;
  }
  return best[1];
}

/** Compact "x minutes ago" formatter. */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}
