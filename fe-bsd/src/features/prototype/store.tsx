"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  buildDeposit,
  cancelDeposit as cancelDepositApi,
  confirmDeposit as confirmDepositApi,
  correctDeposit as correctDepositApi,
  findPriceOverlap,
  getNextSequence,
  startInspection as startInspectionApi,
  type ConfirmDepositInput,
  type CorrectionInput,
} from "./api";
import { currentStaff, seedState } from "./mock-data";
import type {
  BankUnit,
  Deposit,
  DepositDraft,
  NasabahProfile,
  PrototypeState,
  Role,
  StaffAccount,
  WasteCategory,
  WastePrice,
} from "./types";

const STORAGE_KEY = "bsd.prototype.v2";
const LEGACY_KEY = "bsd.nasabah.prototype.v1";

export interface UnitInput {
  id?: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  distanceKm: number;
  isActive: boolean;
}

export interface CategoryInput {
  id?: string;
  name: string;
  note: string;
  isActive: boolean;
  initialPricePerKg?: number;
}

export interface PriceInput {
  id?: string;
  categoryId: string;
  unitId: string | null;
  pricePerKg: number;
  validFrom: string;
  validTo: string | null;
}

export interface AccountInput {
  id?: string;
  name: string;
  email: string;
  role: "petugas" | "admin";
  unitId: string | null;
  isActive: boolean;
}

interface PrototypeContextValue {
  deposits: Deposit[];
  profile: NasabahProfile;
  units: BankUnit[];
  categories: WasteCategory[];
  prices: WastePrice[];
  accounts: StaffAccount[];
  currentStaff: StaffAccount;
  submitDeposit: (draft: DepositDraft) => Promise<Deposit>;
  updateProfile: (profile: NasabahProfile) => Promise<void>;
  startInspection: (depositId: string) => Promise<Deposit>;
  confirmDeposit: (input: ConfirmDepositInput) => Promise<Deposit>;
  cancelDeposit: (input: {
    depositId: string;
    reason: string;
    actor: Role;
  }) => Promise<Deposit>;
  correctDeposit: (input: CorrectionInput) => Promise<Deposit>;
  saveUnit: (input: UnitInput) => Promise<BankUnit>;
  saveCategory: (input: CategoryInput) => Promise<WasteCategory>;
  savePrice: (input: PriceInput) => Promise<WastePrice>;
  saveAccount: (input: AccountInput) => Promise<StaffAccount>;
  toggleAccount: (accountId: string) => Promise<void>;
  resetPrototype: () => void;
}

const PrototypeContext = createContext<PrototypeContextValue | null>(null);

let memoryState: PrototypeState | null = null;
const listeners = new Set<() => void>();

function readStorage(): PrototypeState {
  if (typeof window === "undefined") return seedState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isPrototypeState(parsed)) return parsed;
    }

    const legacyRaw = window.localStorage.getItem(LEGACY_KEY);

    if (legacyRaw) {
      const legacy: unknown = JSON.parse(legacyRaw);

      if (isLegacyState(legacy)) {
        return {
          ...seedState,
          deposits: legacy.deposits,
          profile: legacy.profile,
        };
      }
    }
  } catch (error) {
    console.warn("Data prototype tidak dapat dibaca dari localStorage.", error);
  }

  return seedState;
}

function getSnapshot(): PrototypeState {
  if (!memoryState) {
    memoryState = readStorage();
  }

  return memoryState;
}

function getServerSnapshot(): PrototypeState {
  return seedState;
}

function handleStorage(event: StorageEvent): void {
  if (event.key !== null && event.key !== STORAGE_KEY) return;

  memoryState = null;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  if (typeof window !== "undefined" && listeners.size === 1) {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    listeners.delete(listener);

    if (typeof window !== "undefined" && listeners.size === 0) {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function commit(next: PrototypeState): void {
  memoryState = next;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    console.warn("Data prototype tidak dapat disimpan ke localStorage.", error);
  }

  listeners.forEach((listener) => listener());
}

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const submitDeposit = useCallback(async (draft: DepositDraft) => {
    await delay(650);

    const current = getSnapshot();
    const deposit = buildDeposit({
      draft,
      categories: current.categories,
      units: current.units,
      customer: { name: current.profile.name, phone: current.profile.phone },
      sequence: getNextSequence(current.deposits),
    });

    commit({ ...current, deposits: [deposit, ...current.deposits] });

    return deposit;
  }, []);

  const updateProfile = useCallback(async (nextProfile: NasabahProfile) => {
    await delay(500);

    const current = getSnapshot();
    commit({ ...current, profile: nextProfile });
  }, []);

  const startInspection = useCallback(async (depositId: string) => {
    await delay(400);

    const current = getSnapshot();
    const deposit = findDeposit(current, depositId);
    const updated = startInspectionApi(deposit);

    commit({ ...current, deposits: replaceDeposit(current.deposits, updated) });

    return updated;
  }, []);

  const confirmDeposit = useCallback(async (input: ConfirmDepositInput) => {
    await delay(750);

    const current = getSnapshot();
    const deposit = findDeposit(current, input.depositId);
    const updated = confirmDepositApi({
      deposit,
      input,
      prices: current.prices,
      categories: current.categories,
    });

    commit({ ...current, deposits: replaceDeposit(current.deposits, updated) });

    return updated;
  }, []);

  const cancelDeposit = useCallback(
    async (input: { depositId: string; reason: string; actor: Role }) => {
      await delay(500);

      const current = getSnapshot();
      const deposit = findDeposit(current, input.depositId);
      const updated = cancelDepositApi({
        deposit,
        reason: input.reason,
        actor: input.actor,
      });

      commit({ ...current, deposits: replaceDeposit(current.deposits, updated) });

      return updated;
    },
    [],
  );

  const correctDeposit = useCallback(async (input: CorrectionInput) => {
    await delay(650);

    const current = getSnapshot();
    const deposit = findDeposit(current, input.depositId);
    const updated = correctDepositApi({
      deposit,
      input,
      prices: current.prices,
      categories: current.categories,
    });

    commit({ ...current, deposits: replaceDeposit(current.deposits, updated) });

    return updated;
  }, []);

  const saveUnit = useCallback(async (input: UnitInput) => {
    await delay(350);

    const current = getSnapshot();
    const name = input.name.trim();
    const address = input.address.trim();

    if (!name || !address) {
      throw new Error("Nama dan alamat unit wajib diisi.");
    }

    const unit: BankUnit = {
      id: input.id ?? `unit-${Date.now()}`,
      name,
      address,
      hours: input.hours.trim(),
      phone: input.phone.trim(),
      distanceKm: input.distanceKm,
      isActive: input.isActive,
    };

    const units = input.id
      ? current.units.map((candidate) => (candidate.id === unit.id ? unit : candidate))
      : [...current.units, unit];

    commit({ ...current, units });

    return unit;
  }, []);

  const saveCategory = useCallback(async (input: CategoryInput) => {
    await delay(350);

    const current = getSnapshot();
    const name = input.name.trim();

    if (!name) {
      throw new Error("Nama kategori wajib diisi.");
    }

    if (input.id) {
      const existing = current.categories.find((candidate) => candidate.id === input.id);

      if (!existing) {
        throw new Error("Kategori tidak ditemukan.");
      }

      const category: WasteCategory = {
        ...existing,
        name,
        note: input.note.trim(),
        isActive: input.isActive,
      };

      commit({
        ...current,
        categories: current.categories.map((candidate) =>
          candidate.id === category.id ? category : candidate,
        ),
      });

      return category;
    }

    const initialPrice = input.initialPricePerKg ?? 0;

    if (!Number.isFinite(initialPrice) || initialPrice <= 0) {
      throw new Error("Harga global awal wajib diisi lebih dari 0.");
    }

    const categoryId = `kategori-${Date.now()}`;
    const category: WasteCategory = {
      id: categoryId,
      name,
      note: input.note.trim(),
      pricePerKg: initialPrice,
      isActive: input.isActive,
    };
    const price: WastePrice = {
      id: `price-${categoryId}-global`,
      categoryId,
      unitId: null,
      pricePerKg: initialPrice,
      validFrom: new Date().toISOString().slice(0, 10),
      validTo: null,
    };

    commit({
      ...current,
      categories: [...current.categories, category],
      prices: [...current.prices, price],
    });

    return category;
  }, []);

  const savePrice = useCallback(async (input: PriceInput) => {
    await delay(350);

    const current = getSnapshot();

    if (!Number.isFinite(input.pricePerKg) || input.pricePerKg <= 0) {
      throw new Error("Harga per kg wajib diisi lebih dari 0.");
    }

    if (!input.validFrom) {
      throw new Error("Tanggal mulai berlaku wajib diisi.");
    }

    if (input.validTo && Date.parse(input.validTo) < Date.parse(input.validFrom)) {
      throw new Error("Tanggal akhir tidak boleh lebih awal dari tanggal mulai.");
    }

    const overlap = findPriceOverlap(current.prices, input);

    if (overlap) {
      throw new Error(
        "Periode harga tumpang tindih dengan harga lain untuk kategori dan unit yang sama.",
      );
    }

    const price: WastePrice = {
      id: input.id ?? `price-${Date.now()}`,
      categoryId: input.categoryId,
      unitId: input.unitId,
      pricePerKg: input.pricePerKg,
      validFrom: input.validFrom,
      validTo: input.validTo,
    };

    const prices = input.id
      ? current.prices.map((candidate) => (candidate.id === price.id ? price : candidate))
      : [...current.prices, price];

    const now = Date.now();
    const isCurrentGlobal =
      price.unitId === null &&
      Date.parse(price.validFrom) <= now &&
      (price.validTo === null || Date.parse(price.validTo) >= now);

    const categories = isCurrentGlobal
      ? current.categories.map((category) =>
          category.id === price.categoryId
            ? { ...category, pricePerKg: price.pricePerKg }
            : category,
        )
      : current.categories;

    commit({ ...current, prices, categories });

    return price;
  }, []);

  const saveAccount = useCallback(async (input: AccountInput) => {
    await delay(350);

    const current = getSnapshot();
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    if (!name || !email) {
      throw new Error("Nama dan email wajib diisi.");
    }

    if (!email.includes("@")) {
      throw new Error("Format email tidak valid.");
    }

    if (input.role === "petugas" && !input.unitId) {
      throw new Error("Petugas wajib ditugaskan ke satu unit.");
    }

    const duplicate = current.accounts.find(
      (account) => account.email.toLowerCase() === email && account.id !== input.id,
    );

    if (duplicate) {
      throw new Error("Email sudah dipakai akun lain.");
    }

    const account: StaffAccount = {
      id: input.id ?? `acc-${Date.now()}`,
      name,
      email,
      role: input.role,
      unitId: input.role === "admin" ? null : input.unitId,
      isActive: input.isActive,
      createdAt:
        current.accounts.find((candidate) => candidate.id === input.id)?.createdAt ??
        new Date().toISOString(),
    };

    const accounts = input.id
      ? current.accounts.map((candidate) => (candidate.id === account.id ? account : candidate))
      : [...current.accounts, account];

    commit({ ...current, accounts });

    return account;
  }, []);

  const toggleAccount = useCallback(async (accountId: string) => {
    await delay(250);

    const current = getSnapshot();
    const accounts = current.accounts.map((account) =>
      account.id === accountId ? { ...account, isActive: !account.isActive } : account,
    );

    commit({ ...current, accounts });
  }, []);

  const resetPrototype = useCallback(() => {
    commit(seedState);
  }, []);

  const value = useMemo<PrototypeContextValue>(
    () => ({
      deposits: state.deposits,
      profile: state.profile,
      units: state.units,
      categories: state.categories,
      prices: state.prices,
      accounts: state.accounts,
      currentStaff,
      submitDeposit,
      updateProfile,
      startInspection,
      confirmDeposit,
      cancelDeposit,
      correctDeposit,
      saveUnit,
      saveCategory,
      savePrice,
      saveAccount,
      toggleAccount,
      resetPrototype,
    }),
    [
      state,
      submitDeposit,
      updateProfile,
      startInspection,
      confirmDeposit,
      cancelDeposit,
      correctDeposit,
      saveUnit,
      saveCategory,
      savePrice,
      saveAccount,
      toggleAccount,
      resetPrototype,
    ],
  );

  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>;
}

export function usePrototype(): PrototypeContextValue {
  const context = useContext(PrototypeContext);

  if (!context) {
    throw new Error("usePrototype harus dipakai di dalam PrototypeProvider.");
  }

  return context;
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function findDeposit(state: PrototypeState, depositId: string): Deposit {
  const deposit = state.deposits.find((candidate) => candidate.id === depositId);

  if (!deposit) {
    throw new Error("Pengajuan tidak ditemukan.");
  }

  return deposit;
}

function replaceDeposit(deposits: Deposit[], updated: Deposit): Deposit[] {
  return deposits.map((deposit) => (deposit.id === updated.id ? updated : deposit));
}

function isPrototypeState(value: unknown): value is PrototypeState {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Partial<PrototypeState>;

  return (
    Array.isArray(candidate.deposits) &&
    Array.isArray(candidate.units) &&
    Array.isArray(candidate.categories) &&
    Array.isArray(candidate.prices) &&
    Array.isArray(candidate.accounts) &&
    typeof candidate.profile === "object" &&
    candidate.profile !== null
  );
}

function isLegacyState(
  value: unknown,
): value is { deposits: Deposit[]; profile: NasabahProfile } {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as { deposits?: unknown; profile?: unknown };

  return Array.isArray(candidate.deposits) && typeof candidate.profile === "object";
}
