export type AdPlacement = "footer" | "shadow" | "gradient";

/** Public AdSense publisher id (safe to expose in the browser). */
export function getAdSenseClient(): string {
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ?? "";
}

export function getAdSenseSlot(placement: AdPlacement): string {
  const slots: Record<AdPlacement, string | undefined> = {
    footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER,
    shadow: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SHADOW,
    gradient: process.env.NEXT_PUBLIC_ADSENSE_SLOT_GRADIENT,
  };
  return slots[placement]?.trim() ?? "";
}

export function isAdSenseConfigured(): boolean {
  return getAdSenseClient().length > 0;
}
