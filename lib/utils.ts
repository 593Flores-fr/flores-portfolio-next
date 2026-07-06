import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Convertit un hex ("#5c5cf5") en triplet "r,g,b" pour composer des rgba(). Fallback violet si invalide. */
export function hexToRgb(hex?: string | null): string {
  const fallback = "146,146,245";
  if (!hex) return fallback;
  const m = hex.trim().replace("#", "");
  if (m.length !== 6) return fallback;
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return fallback;
  return `${r},${g},${b}`;
}
