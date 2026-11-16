"use client";

import { useMemo, useSyncExternalStore } from "react";
import { formatRupiah } from "./format";
import { usePrototype } from "./prototype-store";
import type { Deposit, DepositStatus } from "./types";

export interface AppNotification {
  id: string;
  depositId: string;
  status: DepositStatus;
  title: string;
  body: string;
  at: string;
}

// shortcut: notifikasi diturunkan dari status terbaru tiap setoran (satu per setoran), bukan dari
// riwayat event; ganti dengan endpoint notifikasi be-bsd (BSD-54) agar tiap perubahan status tercatat.
function toNotification(deposit: Deposit): AppNotification {
  const base = {
    id: `${deposit.id}-${deposit.status}`,
    depositId: deposit.id,
    status: deposit.status,
  };
  switch (deposit.status) {
    case "selesai":
      return {
        ...base,
        title: "Setoran selesai",
        body: `${deposit.code} · ${formatRupiah(deposit.finalTotal ?? 0)} tercatat di saldo setoran.`,
        at: deposit.completedAt ?? deposit.submittedAt,
      };
    case "dibatalkan":
      return {
        ...base,
        title: "Setoran dibatalkan",
        body: `${deposit.code} · ${deposit.cancellationReason ?? "Dibatalkan oleh petugas."}`,
        at: deposit.cancelledAt ?? deposit.submittedAt,
      };
    case "diproses":
      return {
        ...base,
        title: "Setoran sedang diproses",
        body: `${deposit.code} · petugas ${deposit.unitName} sedang memeriksa dan menimbang.`,
        at: deposit.submittedAt,
      };
    default:
      return {
        ...base,
        title: "Pengajuan terkirim",
        body: `${deposit.code} · menunggu petugas ${deposit.unitName}.`,
        at: deposit.submittedAt,
      };
  }
}

const KEY = "bsd.nasabah.notif-read.v1";
const listeners = new Set<() => void>();

function readLastRead(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Tandai semua notifikasi sampai waktu `at` sebagai terbaca. */
export function markNotificationsRead(at: string) {
  if (!at || Date.parse(at) <= Date.parse(readLastRead() || "1970-01-01")) return;
  try {
    window.localStorage.setItem(KEY, at);
  } catch {
    // Penyimpanan diblokir: penanda terbaca hilang saat halaman dimuat ulang.
  }
  listeners.forEach((listener) => listener());
}

/** Notifikasi lebih baru dari penanda baca `since` (null = belum terbaca dari penyimpanan, anggap tidak ada). */
export const isNewerThan = (item: AppNotification, since: string | null) =>
  since !== null && Date.parse(item.at) > Date.parse(since || "1970-01-01");

export function useNotifications() {
  const { deposits } = usePrototype();
  // null di server/hidrasi: jangan tampilkan jumlah belum dibaca sebelum penyimpanan terbaca.
  const lastRead = useSyncExternalStore(subscribe, readLastRead, () => null);

  return useMemo(() => {
    const items = deposits.map(toNotification).sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
    return {
      items,
      lastRead,
      unreadCount: items.filter((item) => isNewerThan(item, lastRead)).length,
      latestAt: items[0]?.at ?? "",
    };
  }, [deposits, lastRead]);
}
