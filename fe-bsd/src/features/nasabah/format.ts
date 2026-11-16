const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const weightFormatter = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 1,
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

/** Rp4.000 tanpa spasi, mengikuti desain. */
export function formatRupiah(value: number): string {
  return rupiahFormatter.format(value).replace(/Rp\s*/, "Rp");
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

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}

const TZ = "Asia/Jakarta";
const dayMonthFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  timeZone: TZ,
});
const dateMediumFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: TZ,
});
const clockFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: TZ,
});
const monthYearFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric",
  timeZone: TZ,
});
const dayKeyFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: TZ });

/** 18 Okt */
export const formatDayMonth = (iso: string) => dayMonthFormatter.format(new Date(iso));
/** 12 Sep 2026 */
export const formatDateMedium = (iso: string) => dateMediumFormatter.format(new Date(iso));
/** 19.00 */
export const formatClock = (iso: string) => clockFormatter.format(new Date(iso)).replace(":", ".");
/** OKTOBER 2026 */
export const formatMonthYear = (iso: string) =>
  monthYearFormatter.format(new Date(iso)).toUpperCase();
/** yyyy-mm-dd menurut zona Asia/Jakarta */
export const dayKey = (iso: string) => dayKeyFormatter.format(new Date(iso));

const monthShortYearFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "short",
  year: "numeric",
  timeZone: TZ,
});
/** Sep 2026 */
export const formatMonthShortYear = (iso: string) => monthShortYearFormatter.format(new Date(iso));
