export const SPOT_PRICE = 400;
export const EXPIRIES_DAYS = [7, 14, 30, 60, 90, 180];
export const STRIKE_STEPS = 11;
export const STRIKE_RANGE = 0.3;

export interface IVPoint {
  daysToExpiry: number;
  strike: number;
  iv: number;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function generateIVSurface(): IVPoint[][] {
  const strikes: number[] = [];
  for (let i = 0; i < STRIKE_STEPS; i++) {
    const t = i / (STRIKE_STEPS - 1);
    const pct = -STRIKE_RANGE + t * (2 * STRIKE_RANGE);
    strikes.push(Math.round(SPOT_PRICE * (1 + pct)));
  }

  return EXPIRIES_DAYS.map((days, expiryIdx) => {
    const termFactor = 1 / Math.sqrt(days / 30);
    const baseIv = 0.32 * termFactor + 0.14;

    return strikes.map((strike, strikeIdx) => {
      const moneyness = Math.log(strike / SPOT_PRICE);
      const smile = 0.9 * moneyness * moneyness;
      const skew = moneyness < 0 ? -0.35 * moneyness : -0.12 * moneyness;
      const jitter = (seededRandom(expiryIdx * 97 + strikeIdx * 13 + 7) - 0.5) * 0.015;
      const iv = clamp(baseIv + smile + skew + jitter, 0.15, 0.8);
      return { daysToExpiry: days, strike, iv };
    });
  });
}
