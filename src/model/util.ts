// Generic deep clone for plain objects and arrays.

import { CARDS } from "./cards";
import { CardId } from "./types";

// Note: Not intended for functions, Dates, Maps, Sets, etc.
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map((item) => deepClone(item)) as unknown as T;
  const result: Record<string, unknown> = {};
  for (const key in obj as Record<string, unknown>) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = deepClone((obj as Record<string, unknown>)[key]);
    }
  }
  return result as T;
};

// Non-mutating shuffle; returns a new array
export const shuffle = <T>(arr: readonly T[], rng: () => number = Math.random): T[] => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

