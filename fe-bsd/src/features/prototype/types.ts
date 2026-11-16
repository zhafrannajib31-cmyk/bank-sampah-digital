export type Role = "nasabah" | "petugas" | "admin";

export type DepositStatus = "menunggu" | "diproses" | "selesai" | "dibatalkan";

export interface BankUnit {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  distanceKm: number;
  isActive: boolean;
}

export interface WasteCategory {
  id: string;
  name: string;
  note: string;
  pricePerKg: number;
  isActive: boolean;
}

export interface WastePrice {
  id: string;
  categoryId: string;
  /** null = harga global; selain itu = override untuk unit tertentu. */
  unitId: string | null;
  pricePerKg: number;
  validFrom: string;
  validTo: string | null;
}

export interface StaffAccount {
  id: string;
  name: string;
  email: string;
  role: "petugas" | "admin";
  unitId: string | null;
  isActive: boolean;
  createdAt: string;
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
  accepted?: boolean;
  note?: string;
  actualWeight?: number;
  unitPriceSnapshot?: number;
  finalValue?: number;
}

export interface DepositEvent {
  id: string;
  at: string;
  title: string;
  description?: string;
  actor?: Role;
}

export interface Deposit {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  unitId: string;
  unitName: string;
  unitAddress: string;
  status: DepositStatus;
  submittedAt: string;
  processedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
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

export interface PrototypeState {
  deposits: Deposit[];
  profile: NasabahProfile;
  units: BankUnit[];
  categories: WasteCategory[];
  prices: WastePrice[];
  accounts: StaffAccount[];
}
