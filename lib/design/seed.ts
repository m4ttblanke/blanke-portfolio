// Deterministic "chaos" for lists of content (projects, cards, stickers).
//
// A designer picks tilts for a hand-built page. For CMS-driven lists the same
// choice has to be made per item WITHOUT randomness: the same slug must get the
// same tilt on the server, on the client, on every request, forever. This picks
// from a small fixed set of presets by hashing a stable id. It is not a layout
// engine; it only chooses between named CSS classes from app/globals.css.
//
// A tool for repeatable collections where variation is the concept (e.g. a
// poster wall). It is NOT a way to compose a page: the hero, major photography,
// flagship project spreads and File 001 are art-directed by hand, never hashed
// into position (docs/ART_DIRECTION.md, §9).

/** FNV-1a, 32-bit. Stable across runtimes. */
export function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function pick<T>(seed: string, presets: readonly T[], salt = ""): T {
  if (presets.length === 0) throw new Error("pick() needs at least one preset");
  return presets[hashString(`${salt}:${seed}`) % presets.length];
}

/** Block tilts stay barely off-axis. Stickers may swing further. */
export const BLOCK_TILTS = ["tilt-cw-1", "tilt-ccw-1", "tilt-cw-2", "tilt-ccw-2"] as const;
export const STICKER_TILTS = ["tilt-cw-3", "tilt-ccw-3", "tilt-cw-4", "tilt-ccw-4"] as const;
export const NUDGES = ["nudge-r-1", "nudge-l-1", "nudge-d-1", "nudge-u-1", "nudge-r-2", "nudge-l-2"] as const;

export function blockTilt(id: string): (typeof BLOCK_TILTS)[number] {
  return pick(id, BLOCK_TILTS, "block-tilt");
}
export function stickerTilt(id: string): (typeof STICKER_TILTS)[number] {
  return pick(id, STICKER_TILTS, "sticker-tilt");
}
export function nudge(id: string): (typeof NUDGES)[number] {
  return pick(id, NUDGES, "nudge");
}
