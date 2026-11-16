"use client";

import { useSyncExternalStore } from "react";
import { categories } from "@/features/nasabah/mock-data";
import type { Deposit } from "@/features/nasabah/types";
import { OFFICER_NAME, petugasDeposits } from "./mock-data";

// shortcut: data antrean petugas disimpan di localStorage perangkat dan terpisah dari data nasabah;
// ganti dengan lib/api (BSD-55/56/57) saat endpoint tersedia.
const KEY = "bsd.petugas.v1";
const listeners = new Set<() => void>();
let cache: Deposit[] | null = null;

function read(): Deposit[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    cache = Array.isArray(parsed) ? (parsed as Deposit[]) : petugasDeposits;
  } catch {
    cache = petugasDeposits;
  }
  return cache;
}

function write(next: Deposit[]) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Penyimpanan diblokir: perubahan tetap berlaku selama halaman terbuka.
  }
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function usePetugasDeposits(): Deposit[] {
  return useSyncExternalStore(subscribe, read, () => petugasDeposits);
}

function update(id: string, change: (deposit: Deposit) => Deposit) {
  write(read().map((deposit) => (deposit.id === id ? change(deposit) : deposit)));
}

const event = (deposit: Deposit, key: string, title: string, description?: string) => ({
  id: `${deposit.id}-${key}`,
  at: new Date().toISOString(),
  title,
  description,
});

/** Terima pengajuan: Menunggu -> Diproses. Idempotent: pengajuan yang sudah bukan Menunggu tidak berubah. */
export function acceptDeposit(id: string) {
  update(id, (deposit) =>
    deposit.status !== "menunggu"
      ? deposit
      : {
          ...deposit,
          status: "diproses",
          officerName: OFFICER_NAME,
          events: [...deposit.events, event(deposit, "accept", "Pengajuan diterima petugas")],
        },
  );
}

/**
 * Tolak (Menunggu) atau batalkan (Diproses) setoran: menjadi Dibatalkan dengan alasan wajib,
 * tercatat sebagai event (aturan 8). Idempotent untuk status lain.
 */
export function rejectDeposit(id: string, reason: string) {
  const now = new Date().toISOString();
  update(id, (deposit) =>
    deposit.status !== "menunggu" && deposit.status !== "diproses"
      ? deposit
      : {
          ...deposit,
          status: "dibatalkan",
          cancellationReason: reason,
          cancelledAt: now,
          cancelledBy: `Petugas Unit (${OFFICER_NAME})`,
          events: [...deposit.events, event(deposit, "cancel", "Setoran dibatalkan", reason)],
        },
  );
}

/**
 * Simpan hasil timbang per jenis. Harga disimpan sebagai snapshot saat penimbangan (aturan 2);
 * nilai per baris dihitung di sini sebagai pengganti server (aturan 1).
 */
export function weighDeposit(id: string, weights: Record<string, number>) {
  update(id, (deposit) =>
    deposit.status !== "diproses"
      ? deposit
      : {
          ...deposit,
          items: deposit.items.map((item) => {
            const price = categories.find((c) => c.id === item.categoryId)?.pricePerKg ?? 0;
            const actual = weights[item.categoryId] ?? item.estimatedWeight;
            return {
              ...item,
              actualWeight: actual,
              unitPriceSnapshot: price,
              finalValue: Math.round(actual * price),
            };
          }),
          events: [...deposit.events, event(deposit, "weigh", "Berat aktual diinput petugas")],
        },
  );
}
