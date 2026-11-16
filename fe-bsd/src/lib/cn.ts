export type ClassValue = string | false | null | undefined;

/** Gabungkan className tanpa menambahkan dependency baru. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
