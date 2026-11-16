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
  categories as seedCategories,
  profile as seedProfile,
  seedDeposits,
  units as seedUnits,
} from "./mock-data";
import { buildDeposit } from "./prototype-api";
import type { BankUnit, Deposit, DepositDraft, NasabahProfile, WasteCategory } from "./types";

const STORAGE_KEY = "bsd.nasabah.prototype.v1";

interface PersistedState {
  deposits: Deposit[];
  profile: NasabahProfile;
}

interface PrototypeContextValue {
  deposits: Deposit[];
  profile: NasabahProfile;
  units: BankUnit[];
  categories: WasteCategory[];
  submitDeposit: (draft: DepositDraft, idempotencyKey?: string) => Promise<Deposit>;
  updateProfile: (profile: NasabahProfile) => Promise<void>;
  resetPrototype: () => void;
}

const PrototypeContext = createContext<PrototypeContextValue | null>(null);

const serverState: PersistedState = {
  deposits: seedDeposits,
  profile: seedProfile,
};

let cachedRaw: string | null | undefined;
let cachedState: PersistedState = serverState;
const listeners = new Set<() => void>();
const submittedByKey = new Map<string, Deposit>();

function readRaw(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Data prototype tidak dapat dibaca dari localStorage.", error);
    return null;
  }
}

function getSnapshot(): PersistedState {
  const raw = readRaw();

  if (raw === cachedRaw) return cachedState;

  cachedRaw = raw;

  if (!raw) {
    cachedState = serverState;
    return cachedState;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (isPersistedState(parsed)) {
      cachedState = parsed;
      return cachedState;
    }
  } catch (error) {
    console.warn("Data prototype tidak valid.", error);
  }

  cachedState = serverState;
  return cachedState;
}

function getServerSnapshot(): PersistedState {
  return serverState;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }

  return () => {
    listeners.delete(listener);

    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

function writeState(nextState: PersistedState): void {
  const raw = JSON.stringify(nextState);

  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch (error) {
    console.warn("Data prototype tidak dapat disimpan ke localStorage.", error);
  }

  cachedRaw = raw;
  cachedState = nextState;
  listeners.forEach((listener) => listener());
}

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const submitDeposit = useCallback(async (draft: DepositDraft, idempotencyKey?: string) => {
    await delay(650);

    // Kunci yang sama mengembalikan pengajuan yang sama (retry aman, tidak ganda).
    const existing = idempotencyKey ? submittedByKey.get(idempotencyKey) : undefined;
    if (existing) return existing;

    const current = getSnapshot();
    const deposit = buildDeposit({
      draft,
      categories: seedCategories,
      units: seedUnits,
      sequence: getNextSequence(current.deposits),
    });

    writeState({
      deposits: [deposit, ...current.deposits],
      profile: current.profile,
    });

    if (idempotencyKey) submittedByKey.set(idempotencyKey, deposit);
    return deposit;
  }, []);

  const updateProfile = useCallback(async (nextProfile: NasabahProfile) => {
    await delay(500);

    const current = getSnapshot();
    writeState({ deposits: current.deposits, profile: nextProfile });
  }, []);

  const resetPrototype = useCallback(() => {
    writeState(serverState);
  }, []);

  const value = useMemo<PrototypeContextValue>(
    () => ({
      deposits: state.deposits,
      profile: state.profile,
      units: seedUnits,
      categories: seedCategories,
      submitDeposit,
      updateProfile,
      resetPrototype,
    }),
    [state.deposits, state.profile, submitDeposit, updateProfile, resetPrototype],
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

function getNextSequence(deposits: Deposit[]): number {
  return (
    deposits.reduce((highest, deposit) => {
      const match = /(\d+)$/.exec(deposit.code);
      const value = match ? Number(match[1]) : 0;
      return Math.max(highest, value);
    }, 0) + 1
  );
}

function isPersistedState(value: unknown): value is PersistedState {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as { deposits?: unknown; profile?: unknown };
  if (!Array.isArray(candidate.deposits)) return false;
  if (typeof candidate.profile !== "object" || candidate.profile === null) return false;

  const profile = candidate.profile as { name?: unknown; phone?: unknown };
  return typeof profile.name === "string" && typeof profile.phone === "string";
}
