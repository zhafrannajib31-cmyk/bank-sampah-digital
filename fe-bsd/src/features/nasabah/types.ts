export type DepositStatus = "menunggu" | "diproses" | "selesai" | "dibatalkan";

export interface BankUnit {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  distanceKm: number;
  isOpen: boolean;
}

export interface WasteCategory {
  id: string;
  name: string;
  pricePerKg: number;
  note: string;
}

export interface DepositDraftItem {
  categoryId: string;
  estimatedWeight: number;
}

export interface DepositDraft {
  unitId: string;
  items: DepositDraftItem[];
}

export interface DepositItem {
  id: string;
  categoryId: string;
  categoryName: string;
  estimatedWeight: number;
  estimatedValue: number;
  actualWeight?: number;
  unitPriceSnapshot?: number;
  finalValue?: number;
}

export interface DepositEvent {
  id: string;
  at: string;
  title: string;
  description?: string;
}

export interface Deposit {
  id: string;
  code: string;
  unitId: string;
  unitName: string;
  unitAddress: string;
  status: DepositStatus;
  submittedAt: string;
  estimatedTotal: number;
  finalTotal?: number;
  cancellationReason?: string;
  items: DepositItem[];
  events: DepositEvent[];
}

export interface NasabahProfile {
  name: string;
  phone: string;
  email: string;
  address: string;
  memberSince: string;
}
