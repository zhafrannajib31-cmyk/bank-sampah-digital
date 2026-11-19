"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSessionUser } from "@/lib/auth";
import { userMessage } from "@/lib/api";
import { nasabahApi, resolvePrice, toCategory, toDeposit, toUnit, type ApiPrice } from "./api";
import { profile as seedProfile } from "./mock-data";
import type { BankUnit, Deposit, DepositDraft, NasabahProfile, WasteCategory } from "./types";

/**
 * Sumber data tunggal layar nasabah. Isi asli dari be-bsd; nama file dipertahankan
 * agar impor lama tidak perlu diubah. Profil masih data simulasi sampai BSD-35.
 */
interface NasabahContextValue {
  deposits: Deposit[];
  profile: NasabahProfile;
  units: BankUnit[];
  categories: WasteCategory[];
  /** Kategori beserta harga yang berlaku di unit tersebut (unit menimpa global). */
  categoriesForUnit: (unitId: string) => WasteCategory[];
  submitDeposit: (draft: DepositDraft, idempotencyKey?: string) => Promise<Deposit>;
  cancelDeposit: (id: string, reason: string) => Promise<void>;
  updateProfile: (profile: NasabahProfile) => Promise<void>;
  reload: () => void;
  isLoading: boolean;
  error: string | null;
}

const NasabahContext = createContext<NasabahContextValue | null>(null);

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [units, setUnits] = useState<BankUnit[]>([]);
  const [categories, setCategories] = useState<WasteCategory[]>([]);
  const [prices, setPrices] = useState<ApiPrice[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [profile, setProfile] = useState<NasabahProfile>(seedProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [rawUnits, rawCategories, rawPrices, rawDeposits, transactions] = await Promise.all([
        nasabahApi.units(),
        nasabahApi.categories(),
        nasabahApi.prices(),
        nasabahApi.deposits(),
        nasabahApi.transactions(),
      ]);

      const activePrices = rawPrices.filter((price) => price.status === "active");
      const activeCategories = rawCategories.filter((category) => category.status === "active");
      const hasPrice = (unitId: string, categoryId: string) =>
        resolvePrice(activePrices, categoryId, unitId) !== undefined;

      setPrices(activePrices);
      setCategories(
        activeCategories.map((category) => toCategory(category, resolvePrice(activePrices, category.id))),
      );
      setUnits(
        rawUnits
          .filter((unit) => unit.publicationStatus === "published")
          .map((unit) =>
            toUnit(
              unit,
              activeCategories
                .filter((category) => hasPrice(unit.id, category.id))
                .map((category) => category.id),
            ),
          ),
      );

      const byDeposit = new Map(transactions.map((transaction) => [transaction.depositId, transaction]));
      setDeposits(rawDeposits.map((deposit) => toDeposit(deposit, byDeposit.get(deposit.id))));
      setError(null);

      // Identitas dari sesi; dibaca di sini (setelah hidrasi) agar markup server dan klien sama.
      const user = getSessionUser();
      if (user) setProfile((current) => ({ ...current, name: user.name, email: user.email }));
    } catch (cause) {
      setError(userMessage(cause));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- memuat data API; semua setState terjadi setelah await
    void load();
  }, [load]);

  const categoriesForUnit = useCallback(
    (unitId: string) =>
      categories.flatMap((category) => {
        const price = resolvePrice(prices, category.id, unitId);
        return price ? [{ ...category, pricePerKg: Number(price.pricePerKg) }] : [];
      }),
    [categories, prices],
  );

  const submitDeposit = useCallback(async (draft: DepositDraft, idempotencyKey?: string) => {
    const created = toDeposit(await nasabahApi.createDeposit(draft, idempotencyKey));
    setDeposits((current) => [created, ...current]);
    return created;
  }, []);

  const cancelDeposit = useCallback(async (id: string, reason: string) => {
    const updated = toDeposit(await nasabahApi.cancelDeposit(id, reason));
    setDeposits((current) => current.map((deposit) => (deposit.id === id ? updated : deposit)));
  }, []);

  const updateProfile = useCallback(async (nextProfile: NasabahProfile) => {
    // shortcut: belum ada API profil nasabah (BSD-35); perubahan hanya bertahan di sesi ini.
    setProfile(nextProfile);
  }, []);

  const value = useMemo<NasabahContextValue>(
    () => ({
      deposits,
      profile,
      units,
      categories,
      categoriesForUnit,
      submitDeposit,
      cancelDeposit,
      updateProfile,
      reload: () => {
        setIsLoading(true);
        setError(null);
        void load();
      },
      isLoading,
      error,
    }),
    [
      deposits,
      profile,
      units,
      categories,
      categoriesForUnit,
      submitDeposit,
      cancelDeposit,
      updateProfile,
      load,
      isLoading,
      error,
    ],
  );

  return <NasabahContext.Provider value={value}>{children}</NasabahContext.Provider>;
}

export function usePrototype(): NasabahContextValue {
  const context = useContext(NasabahContext);

  if (!context) {
    throw new Error("usePrototype harus dipakai di dalam PrototypeProvider.");
  }

  return context;
}
