import { Color } from "three";

const LOW_IV_COLOR = new Color("#2b6cff");
const MID_IV_COLOR = new Color("#8a5cff");
const HIGH_IV_COLOR = new Color("#ff3b30");

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
