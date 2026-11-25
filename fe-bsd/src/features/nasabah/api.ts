import { request } from "@/lib/api";
import type { BankUnit, Deposit, DepositDraft, DepositStatus, NasabahProfile, WasteCategory } from "./types";

/** Query daftar unit yang didukung be-bsd (BSD-45). */
export interface UnitQuery {
  search?: string;
  publicationStatus?: "draft" | "published" | "unpublished";
  serviceStatus?: "open" | "closed" | "temporarily_closed";
}

/** Bentuk respons be-bsd (angka desimal dikirim sebagai string). */
export interface ApiUnit {
  id: string;
  name: string;
  address: string;
  operatingHours: Record<string, string> | null;
  contactPhone: string | null;
  serviceStatus: "open" | "closed" | "temporarily_closed";
  publicationStatus: "draft" | "published" | "unpublished";
}

export interface ApiCategory {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "inactive";
}

export interface ApiPrice {
  unitId: string | null;
  categoryId: string;
  pricePerKg: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  status: "active" | "inactive";
}

export interface ApiDepositItem {
  id: string;
  categoryId: string;
  categoryName: string | null;
  estimatedWeight: string;
  actualWeight: string | null;
  unitPriceSnapshot: string | null;
  pricePerKg: string | null;
  estimatedValue: string | null;
}

export interface ApiDeposit {
  id: string;
  code: string;
  unitId: string;
  unitName: string | null;
  unitAddress: string | null;
  status: DepositStatus;
  submittedAt: string;
  cancelledAt: string | null;
  cancellationReason: string | null;
  estimatedTotal: string;
  items: ApiDepositItem[];
}

export interface ApiTransaction {
  id: string;
  depositId: string;
  totalValue: string;
  confirmedAt: string;
  saldo: string;
}

const num = (value: string | null): number | null => (value === null ? null : Number(value));

/** Jam operasional pertama sebagai ringkasan kartu: "08.00 – 15.00". */
function shortHours(hours: Record<string, string> | null): string {
  const first = hours ? Object.values(hours)[0] : undefined;
  return first ? first.replace(/:/g, ".").replace("-", " – ").replace(/\s+/g, " ").trim() : "Jam menyusul";
}

export function toUnit(unit: ApiUnit, categoryIds: string[]): BankUnit {
  return {
    id: unit.id,
    name: unit.name,
    address: unit.address,
    hours: unit.operatingHours
      ? Object.entries(unit.operatingHours)
          .map(([day, range]) => `${day} ${range}`)
          .join(" · ")
      : "Belum diisi",
    shortHours: shortHours(unit.operatingHours),
    phone: unit.contactPhone ?? "-",
    distanceKm: undefined,
    isOpen: unit.serviceStatus === "open",
    categoryIds,
  };
}

export function toCategory(category: ApiCategory, price: ApiPrice | undefined): WasteCategory {
  return {
    id: category.id,
    name: category.name,
    pricePerKg: price ? Number(price.pricePerKg) : null,
    note: category.description ?? "",
  };
}

export function toDeposit(deposit: ApiDeposit, transaction?: ApiTransaction): Deposit {
  return {
    id: deposit.id,
    code: deposit.code,
    unitId: deposit.unitId,
    unitName: deposit.unitName ?? "Bank Sampah",
    unitAddress: deposit.unitAddress ?? "",
    status: deposit.status,
    submittedAt: deposit.submittedAt,
    estimatedTotal: Number(deposit.estimatedTotal),
    finalTotal: transaction ? Number(transaction.totalValue) : undefined,
    completedAt: transaction?.confirmedAt,
    cancellationReason: deposit.cancellationReason ?? undefined,
    cancelledAt: deposit.cancelledAt ?? undefined,
    items: deposit.items.map((item) => ({
      id: item.id,
      categoryId: item.categoryId,
      categoryName: item.categoryName ?? "Kategori",
      estimatedWeight: Number(item.estimatedWeight),
      estimatedValue: num(item.estimatedValue) ?? 0,
      actualWeight: num(item.actualWeight) ?? undefined,
      pricePerKg: num(item.pricePerKg) ?? undefined,
      unitPriceSnapshot: num(item.unitPriceSnapshot) ?? undefined,
    })),
    events: [],
  };
}

/** Harga aktif: harga unit menimpa harga global (sama dengan aturan be-bsd). */
export function resolvePrice(
  prices: ApiPrice[],
  categoryId: string,
  unitId?: string,
): ApiPrice | undefined {
  const forCategory = prices.filter((price) => price.categoryId === categoryId);
  return (
    forCategory.find((price) => price.unitId === unitId) ??
    forCategory.find((price) => price.unitId === null)
  );
}

export const nasabahApi = {
  units: (query: UnitQuery = {}, signal?: AbortSignal) => {
    const params = new URLSearchParams();
    const search = query.search?.trim();
    if (search) params.set("search", search);
    if (query.publicationStatus) params.set("publicationStatus", query.publicationStatus);
    if (query.serviceStatus) params.set("serviceStatus", query.serviceStatus);
    const suffix = params.toString();
    return request<ApiUnit[]>(`/units${suffix ? `?${suffix}` : ""}`, { signal });
  },
  categories: () => request<ApiCategory[]>("/waste-categories"),
  prices: () => request<ApiPrice[]>("/waste-prices"),
  deposits: () => request<ApiDeposit[]>("/deposits"),
  transactions: () => request<ApiTransaction[]>("/transactions"),
  createDeposit: (draft: DepositDraft, idempotencyKey?: string) =>
    request<ApiDeposit>("/deposits", {
      method: "POST",
      // be-bsd menerima berat estimasi sebagai string desimal.
      body: {
        unitId: draft.unitId,
        items: draft.items.map((item) => ({
          categoryId: item.categoryId,
          estimatedWeight: String(item.estimatedWeight),
        })),
      },
      // shortcut: be-bsd belum menyimpan kunci idempotensi pengajuan; retry setelah
      // respons hilang bisa membuat pengajuan ganda. Upgrade saat BSD-49 ditambah kolom kunci.
      idempotencyKey,
    }),
  cancelDeposit: (id: string, reason: string) =>
    request<ApiDeposit>(`/deposits/${id}/batal`, { method: "PATCH", body: { reason } }),
  /** Profil nasabah (read + update). */
  profile: () => request<NasabahProfile>("/auth/me"),
  updateProfile: (data: { name?: string; email?: string; phone?: string }) =>
    request<NasabahProfile>("/auth/me", {
      method: "PATCH",
      body: data,
    }),
};
