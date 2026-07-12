import { Color } from "three";

// Luxury palette: deep sapphire (calm, low vol) through rich amethyst
// into warm champagne gold (hot, high vol), jewel tones only.
const LOW_IV_COLOR = new Color("#0b2f6b");
const MID_IV_COLOR = new Color("#5b2a86");
const HIGH_IV_COLOR = new Color("#d4af37");

export function ivToColor(iv: number, min: number, max: number): Color {
  const t = (iv - min) / (max - min);
  const c = new Color();
  if (t < 0.5) {
    c.lerpColors(LOW_IV_COLOR, MID_IV_COLOR, t * 2);
  } else {
    c.lerpColors(MID_IV_COLOR, HIGH_IV_COLOR, (t - 0.5) * 2);
  }
  return c;
}
