"use client";

import { useSyncExternalStore } from "react";
import type { Deposit } from "@/features/nasabah/types";
import { OFFICER_NAME, petugasDeposits } from "./mock-data";

// shortcut: data antrean petugas disimpan di localStorage perangkat dan terpisah dari data nasabah;
// ganti dengan lib/api (BSD-55/56) saat endpoint tersedia.
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

/** Terima pengajuan: Menunggu -> Diproses. Idempotent: pengajuan yang sudah bukan Menunggu tidak berubah. */
export function acceptDeposit(id: string) {
  update(id, (deposit) =>
    deposit.status !== "menunggu"
      ? deposit
      : {
          ...deposit,
          status: "diproses",
          officerName: OFFICER_NAME,
          events: [
            ...deposit.events,
            {
              id: `${deposit.id}-accept`,
              at: new Date().toISOString(),
              title: "Pengajuan diterima petugas",
            },
          ],
        },
  );
}

/** Tolak pengajuan: Menunggu -> Dibatalkan dengan alasan wajib, tercatat sebagai event (aturan 8). */
export function rejectDeposit(id: string, reason: string) {
  const now = new Date().toISOString();
  update(id, (deposit) =>
    deposit.status !== "menunggu"
      ? deposit
      : {
          ...deposit,
          status: "dibatalkan",
          cancellationReason: reason,
          cancelledAt: now,
          cancelledBy: `Petugas Unit (${OFFICER_NAME})`,
          events: [
            ...deposit.events,
            {
              id: `${deposit.id}-reject`,
              at: now,
              title: "Pengajuan ditolak",
              description: reason,
            },
          ],
        },
  );
}
