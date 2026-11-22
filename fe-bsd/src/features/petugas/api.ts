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

/** Respons `POST /deposits/:id/value`: nilai final dihitung be-bsd. */
export interface ApiDepositValue {
  totalWeight: string;
  totalValue: string;
  items: {
    id: string;
    categoryId: string;
    actualWeight: string;
    unitPriceSnapshot: string;
    lineTotal: string;
  }[];
}

/** Respons `POST /deposits/:id/confirm`. */
export interface ApiConfirmedTransaction {
  id: string;
  depositId: string;
  totalValue: string;
  confirmedAt: string;
  status: string;
}

export const petugasApi = {
  deposits: () => request<ApiPetugasDeposit[]>("/deposits/petugas"),
  acceptDeposit: (id: string) =>
    request<ApiPetugasDeposit>(`/deposits/${id}/status`, { method: "PATCH" }),
  updateWeight: (
    id: string,
    items: { itemId: string; actualWeight: string; categoryId?: string }[],
  ) => request<ApiPetugasDeposit>(`/deposits/${id}/weight`, { method: "PATCH", body: { items } }),
  value: (id: string) => request<ApiDepositValue>(`/deposits/${id}/value`, { method: "POST" }),
  confirm: (id: string, idempotencyKey: string) =>
    request<ApiConfirmedTransaction>(`/deposits/${id}/confirm`, {
      method: "POST",
      body: { idempotencyKey },
      idempotencyKey,
    }),
  categories: () => request<ApiCategory[]>("/waste-categories"),
};
