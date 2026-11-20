import { request } from "@/lib/api";
import { toDeposit, type ApiCategory, type ApiDeposit } from "@/features/nasabah/api";
import type { Deposit } from "@/features/nasabah/types";

/** Respons `GET /deposits/petugas`: pengajuan unit + identitas nasabah pengaju. */
export interface ApiPetugasDeposit extends ApiDeposit {
  customerName: string | null;
  customerPhone: string | null;
  finalTotal: string | null;
}

export function toPetugasDeposit(deposit: ApiPetugasDeposit): Deposit {
  const base = toDeposit(deposit);
  return {
    ...base,
    customerName: deposit.customerName ?? "Nasabah",
    finalTotal: deposit.finalTotal === null ? base.finalTotal : Number(deposit.finalTotal),
  };
}

export const petugasApi = {
  deposits: () => request<ApiPetugasDeposit[]>("/deposits/petugas"),
  acceptDeposit: (id: string) =>
    request<ApiPetugasDeposit>(`/deposits/${id}/status`, { method: "PATCH" }),
  updateWeight: (
    id: string,
    items: { itemId: string; actualWeight: string; categoryId?: string }[],
  ) => request<ApiPetugasDeposit>(`/deposits/${id}/weight`, { method: "PATCH", body: { items } }),
  categories: () => request<ApiCategory[]>("/waste-categories"),
};
