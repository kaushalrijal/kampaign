import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")                 // normalize unicode
    .replace(/[\u0300-\u036f]/g, "")   // remove diacritics
    .replace(/[^a-z0-9]+/g, "-")       // replace non-alphanum with hyphen
    .replace(/-+/g, "-")               // collapse multiple hyphens
    .replace(/^-|-$/g, "")             // trim leading/trailing hyphen
    || "campaign";                     // fallback if empty
}