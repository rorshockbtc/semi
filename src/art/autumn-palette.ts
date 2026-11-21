export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/**
 * West Nashville Late-Autumn Watercolor Pigments & Crisp White Linen.
 * Paired with Warm Sandstone (#E8E2D5) paper and CHB Sovereign Pink (#FE299E).
 */
export const AUTUMN_PIGMENTS = {
  goldenrodOchre: { r: 221, g: 153, b: 51 },  // #DD9933
  burntSienna: { r: 212, g: 98, b: 52 },      // #D46234
  sumacCrimson: { r: 200, g: 62, b: 91 },     // #C83E5B
  copperRusset: { r: 158, g: 71, b: 42 },     // #9E472A
  cedarSage: { r: 110, g: 130, b: 94 },       // #6E825E
  sovereignPink: { r: 254, g: 41, b: 158 },   // #FE299E
  crispLinen: { r: 250, g: 248, b: 245 },     // #FAF8F5
  sandstonePaper: { r: 232, g: 226, b: 213 }, // #E8E2D5
} as const;

export const AUTUMN_WASH_CYCLE: Rgb[] = [
  AUTUMN_PIGMENTS.goldenrodOchre,
  AUTUMN_PIGMENTS.burntSienna,
  AUTUMN_PIGMENTS.sumacCrimson,
  AUTUMN_PIGMENTS.copperRusset,
  AUTUMN_PIGMENTS.cedarSage,
  AUTUMN_PIGMENTS.sovereignPink,
];

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / Math.max(0.0001, edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function lerpRgb(a: Rgb, b: Rgb, t: number): Rgb {
  const c = Math.max(0, Math.min(1, t));
  return {
    r: Math.round(a.r + (b.r - a.r) * c),
    g: Math.round(a.g + (b.g - a.g) * c),
    b: Math.round(a.b + (b.b - a.b) * c),
  };
}

export function sampleAutumnPalette(distance: number, palette: Rgb[] = AUTUMN_WASH_CYCLE): Rgb {
  const cycle = (Math.abs(distance) / 260) % palette.length;
  const idx = Math.floor(cycle);
  const next = (idx + 1) % palette.length;
  return lerpRgb(palette[idx], palette[next], cycle - idx);
}

export function scheduleSoftEvaporate<T extends { evaporateAt?: number }>(
  list: T[],
  softCap: number,
  now: number
): void {
  let activeCount = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i].evaporateAt === undefined) activeCount += 1;
  }
  for (let i = 0; i < list.length && activeCount > softCap; i++) {
    if (list[i].evaporateAt === undefined) {
      list[i].evaporateAt = now;
      activeCount -= 1;
    }
  }
}
