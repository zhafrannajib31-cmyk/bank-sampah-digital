import type { Deposit } from "./types";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const weightFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 2,
});

const distanceFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 1,
});

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

const shortDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

export function formatRupiah(value: number): string {
  return rupiahFormatter.format(value);
}

export function formatWeight(value: number): string {
  return `${weightFormatter.format(value)} kg`;
}

export function formatDistance(value: number): string {
  return `${distanceFormatter.format(value)} km`;
}

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function formatShortDate(iso: string): string {
  return shortDateFormatter.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}

/** Berat aktual bila sudah ditimbang, jika belum memakai estimasi nasabah. */
export function getDepositWeight(deposit: Deposit): number {
  return deposit.items.reduce(
    (total, item) => total + (item.actualWeight ?? item.estimatedWeight),
    0,
  );
}

export function formatInputDate(iso: string): string {
  return iso.slice(0, 10);
}
