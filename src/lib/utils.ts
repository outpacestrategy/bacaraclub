import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names with conflict resolution.
 * Always use this instead of string concatenation for className props.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
