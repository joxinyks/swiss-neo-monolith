/**
 * Swiss Neo-Monolith — colour maths shared by the contrast gate and the
 * preview generator. Both need identical numbers, so they share one file.
 */

export function srgbToLinear(c) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function parseHex(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function luminance(hex) {
  const rgb = parseHex(hex);
  if (!rgb) throw new Error(`not a plain hex colour: ${hex}`);
  const [r, g, b] = rgb.map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio, 1..21. */
export function contrast(fg, bg) {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

/** WCAG thresholds. */
export const AA_BODY = 4.5;
export const AA_LARGE = 3.0;
export const AA_UI = 3.0;

/** Pick whichever of two candidates reads better on `bg`. */
export function bestOn(bg, ...candidates) {
  return candidates
    .map((c) => [c, contrast(c, bg)])
    .sort((a, b) => b[1] - a[1])[0][0];
}
