/** Expand #abc / #aabbcc into an rgba() string. */
export function hexToRgba(hex: string, alpha: number): string {
  let value = (hex || "").trim().replace("#", "");
  if (value.length === 3) {
    value = value
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return `rgba(229, 9, 20, ${alpha})`;
  const int = parseInt(value, 16);
  return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`;
}

/** Relative luminance, used to decide what reads on top of a colour. */
export function luminance(hex: string): number {
  let value = (hex || "").trim().replace("#", "");
  if (value.length === 3) {
    value = value
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return 0.21;
  const int = parseInt(value, 16);
  const srgb = [(int >> 16) & 255, (int >> 8) & 255, int & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

/**
 * Black or white, whichever reads on the given background.
 *
 * The accent is client-chosen, so a light pick (gold, for instance) would leave
 * white button labels unreadable if the foreground were hard-coded.
 */
export function readableOn(hex: string): string {
  return luminance(hex) > 0.45 ? "#07070a" : "#ffffff";
}
