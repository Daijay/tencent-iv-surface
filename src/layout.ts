export const SURFACE_WIDTH = 12; // X axis: strike price
export const SURFACE_DEPTH = 9; // Z axis: time to expiry
export const SURFACE_HEIGHT = 4.5; // Y axis: implied vol

export const ORIGIN_X = -SURFACE_WIDTH / 2;
export const ORIGIN_Z = -SURFACE_DEPTH / 2;
export const ORIGIN_Y = -SURFACE_HEIGHT / 2;

export function ivToY(iv: number, ivMin: number, ivMax: number): number {
  const t = (iv - ivMin) / (ivMax - ivMin);
  return t * SURFACE_HEIGHT - SURFACE_HEIGHT / 2;
}
