"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { userMessage } from "@/lib/api";
import type { Deposit } from "@/features/nasabah/types";
import { petugasApi, toPetugasDeposit, type ApiDepositValue } from "./api";

/**
 * Antrean unit petugas dari be-bsd (hanya unit tempat ia bertugas aktif).
 * Aksi tulis masih lokal untuk sesi ini — lihat shortcut di bawah.
 */
interface QueueState {
  deposits: Deposit[];
  isLoading: boolean;
  error: string | null;
}

const EMPTY: Deposit[] = [];
let state: QueueState = { deposits: EMPTY, isLoading: true, error: null };
const listeners = new Set<() => void>();

function setState(patch: Partial<QueueState>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

async function load() {
  setState({ isLoading: true, error: null });
  try {
    const data = await petugasApi.deposits();
    setState({ deposits: data.map(toPetugasDeposit) });
  } catch (cause) {
    setState({ error: userMessage(cause) });
  } finally {
    setState({ isLoading: false });
  }
}

let started = false;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!started) {
    started = true;
    void load();
  }
  return () => listeners.delete(listener);
}

/** Data mentah antrean; dipakai layar detail yang hanya butuh daftar. */
export function usePetugasDeposits(): Deposit[] {
  return useSyncExternalStore(
    subscribe,
    () => state.deposits,
    () => EMPTY,
  );
}

/** Daftar + status muat untuk layar yang perlu loading/error state. */
export function usePetugasQueue() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
  const reload = useCallback(() => {
    void load();
  }, []);
  return { ...snapshot, reload };
}

function update(id: string, change: (deposit: Deposit) => Deposit) {
  setState({
    deposits: state.deposits.map((deposit) => (deposit.id === id ? change(deposit) : deposit)),
  });
}

const event = (deposit: Deposit, key: string, title: string, description?: string) => ({
  id: `${deposit.id}-${key}`,
  at: new Date().toISOString(),
  title,
  description,
});

// shortcut: penolakan pengajuan masih mengubah state lokal saja; terima, timbang, nilai, dan konfirmasi
// sudah memakai be-bsd. Muat ulang halaman mengembalikan data penolakan ke data server.
/** Terima pengajuan: Menunggu -> Diproses di server, item di state diganti dari respons. */
export async function acceptDeposit(id: string) {
  const updated = toPetugasDeposit(await petugasApi.acceptDeposit(id));
  update(id, () => updated);
}

/** Tolak (Menunggu) atau batalkan (Diproses) setoran: Dibatalkan dengan alasan wajib (aturan 8). */
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
          events: [...deposit.events, event(deposit, "cancel", "Setoran dibatalkan", reason)],
        },
  );
}

/** Salin nilai dari respons server ke state; FE tidak boleh menghitungnya sendiri. */
function applyValue(deposit: Deposit, value: ApiDepositValue): Deposit {
  const lines = new Map(value.items.map((item) => [item.id, item]));
  return {
    ...deposit,
    finalTotal: Number(value.totalValue),
    items: deposit.items.map((item) => {
      const line = lines.get(item.id);
      return line
        ? {
            ...item,
            actualWeight: Number(line.actualWeight),
            unitPriceSnapshot: Number(line.unitPriceSnapshot),
            finalValue: Number(line.lineTotal),
          }
        : item;
    }),
  };
}

/** Ambil nilai hasil timbang dari `POST /deposits/:id/value`. */
export async function loadDepositValue(id: string) {
  const value = await petugasApi.value(id);
  update(id, (deposit) => applyValue(deposit, value));
}

/** Ambil nilai saat ringkasan ditampilkan; `error` memberi tombol retry yang aman. */
export function useDepositValue(id: string, enabled: boolean) {
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    void loadDepositValue(id).catch((cause) => {
      if (active) setError(userMessage(cause));
    });
    return () => {
      active = false;
    };
  }, [id, enabled, attempt]);

  const retry = () => {
    setError(null);
    setAttempt((value) => value + 1);
  };
  return { error, retry };
}

/** Konfirmasi Diproses -> Selesai di server; kunci idempotensi sama dipakai saat retry. */
export async function confirmDeposit(id: string, idempotencyKey: string) {
  const confirmed = await petugasApi.confirm(id, idempotencyKey);
  update(id, (deposit) => ({
    ...deposit,
    status: "selesai",
    finalTotal: Number(confirmed.totalValue),
    completedAt: confirmed.confirmedAt,
    events: [...deposit.events, event(deposit, "confirm", "Transaksi dikonfirmasi petugas")],
  }));
}

/**
 * Simpan berat aktual (dan opsional koreksi kategori) ke server; item di state diganti dari respons.
 * Berat dikirim sebagai string desimal sesuai DTO be-bsd.
 */
export async function weighDeposit(
  id: string,
  items: { itemId: string; actualWeight: string; categoryId?: string }[],
) {
  const updated = toPetugasDeposit(await petugasApi.updateWeight(id, items));
  update(id, () => updated);
}
