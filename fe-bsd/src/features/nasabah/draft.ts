import { useMemo, useSyncExternalStore } from "react";
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
    return isDepositDraft(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(DRAFT_KEY);
}

/** Draft lengkap = setiap jenis sudah punya estimasi berat > 0 (jenis dipilih lebih dulu, berat menyusul). */
export function isDraftComplete(draft: DepositDraft): boolean {
  return draft.items.length > 0 && draft.items.every((item) => item.estimatedWeight > 0);
}

const subscribe = () => () => {};

/** `ready` false di server dan saat hidrasi; draft hanya dibaca di klien. */
export function useDraft(): { draft: DepositDraft | null; ready: boolean } {
  const raw = useSyncExternalStore(subscribe, getDraftSnapshot, () => null);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const draft = useMemo(() => parseDraft(raw), [raw]);
  return { draft, ready };
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
      draftItem.estimatedWeight >= 0
    );
  });
}
