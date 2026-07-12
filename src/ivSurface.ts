export const SPOT_PRICE = 400;
export const EXPIRIES_DAYS = [7, 14, 30, 60, 90, 180];
export const STRIKE_MIN = 350;
export const STRIKE_MAX = 550;
export const STRIKE_STEPS = 11;

export const IV_MIN = 0.15;
export const IV_MAX = 0.8;

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
    strikes.push(Math.round(STRIKE_MIN + t * (STRIKE_MAX - STRIKE_MIN)));
  }

  return EXPIRIES_DAYS.map((days, expiryIdx) => {
    // Term structure: short-dated options carry an elevated IV premium
    // that decays toward a long-run level as expiry lengthens.
    const termFactor = Math.exp(-days / 45);
    const baseIv = 0.24 + 0.34 * termFactor;

    return strikes.map((strike, strikeIdx) => {
      const moneyness = Math.log(strike / SPOT_PRICE);

      // Volatility smile: curves up on both wings, more strongly for
      // near-dated expiries (the smile flattens as expiry lengthens).
      const smileStrength = 1.1 + 1.4 * termFactor;
      const smile = smileStrength * moneyness * moneyness;

      // Skew: OTM puts (low strikes) get an extra lift vs OTM calls,
      // typical of equity/index-like volatility surfaces.
      const skew = moneyness < 0 ? -0.55 * moneyness : -0.15 * moneyness;

      const jitter = (seededRandom(expiryIdx * 97 + strikeIdx * 13 + 7) - 0.5) * 0.02;
      const iv = clamp(baseIv + smile + skew + jitter, IV_MIN, IV_MAX);
      return { daysToExpiry: days, strike, iv };
    });
  });
}
