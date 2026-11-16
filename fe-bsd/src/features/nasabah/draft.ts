import type { DepositDraft } from "./types";

const DRAFT_KEY = "bsd.nasabah.draft.v1";

export function saveDraft(draft: DepositDraft): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function getDraftSnapshot(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return window.sessionStorage.getItem(DRAFT_KEY);
  } catch {
    return null;
  }
}

export function parseDraft(raw: string | null): DepositDraft | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isDepositDraft(parsed)) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function readDraft(): DepositDraft | null {
  return parseDraft(getDraftSnapshot());
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(DRAFT_KEY);
}

function isDepositDraft(value: unknown): value is DepositDraft {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as { unitId?: unknown; items?: unknown };
  if (typeof candidate.unitId !== "string" || !Array.isArray(candidate.items)) return false;
  if (candidate.items.length === 0) return false;

  return candidate.items.every((item) => {
    if (typeof item !== "object" || item === null) return false;
    const draftItem = item as { categoryId?: unknown; estimatedWeight?: unknown };
    return (
      typeof draftItem.categoryId === "string" &&
      typeof draftItem.estimatedWeight === "number" &&
      draftItem.estimatedWeight > 0
    );
  });
}
