import type {
  BankUnit,
  Deposit,
  DepositDraft,
  DepositItem,
  Role,
  WasteCategory,
  WastePrice,
} from "./types";

export interface EstimateItem {
  categoryId: string;
  categoryName: string;
  estimatedWeight: number;
  pricePerKg: number;
  estimatedValue: number;
}

export interface Estimate {
  items: EstimateItem[];
  total: number;
}

export interface InspectionItemInput {
  itemId: string;
  accepted: boolean;
  actualWeight?: number;
  note?: string;
}

export interface ConfirmDepositInput {
  depositId: string;
  idempotencyKey: string;
  items: InspectionItemInput[];
}

export interface CorrectionInput {
  depositId: string;
  reason: string;
  items: { itemId: string; actualWeight: number }[];
}

/**
 * Simulasi perhitungan sisi server untuk prototype.
 * Di aplikasi nyata, nilai transaksi dihitung dan disimpan oleh API, bukan komponen FE.
 */
export function calculateEstimate(
  draft: DepositDraft,
  categories: WasteCategory[],
): Estimate {
  const items = draft.items.map((item) => {
    const category = categories.find((candidate) => candidate.id === item.categoryId);

    if (!category) {
      throw new Error("Kategori sampah tidak ditemukan.");
    }

    return {
      categoryId: category.id,
      categoryName: category.name,
      estimatedWeight: item.estimatedWeight,
      pricePerKg: category.pricePerKg,
      estimatedValue: Math.round(item.estimatedWeight * category.pricePerKg),
    };
  });

  return {
    items,
    total: items.reduce((sum, item) => sum + item.estimatedValue, 0),
  };
}

export function buildDeposit({
  draft,
  categories,
  units,
  customer,
  sequence,
  now = new Date(),
}: {
  draft: DepositDraft;
  categories: WasteCategory[];
  units: BankUnit[];
  customer: { name: string; phone: string };
  sequence: number;
  now?: Date;
}): Deposit {
  const unit = units.find((candidate) => candidate.id === draft.unitId);

  if (!unit) {
    throw new Error("Unit Bank Sampah tidak ditemukan.");
  }

  const estimate = calculateEstimate(draft, categories);
  const id = `dep-${now.getTime()}-${sequence}`;
  const code = `BSD-${now.getFullYear()}-${String(sequence).padStart(4, "0")}`;
  const submittedAt = now.toISOString();

  const items: DepositItem[] = estimate.items.map((item, index) => ({
    id: `${id}-item-${index + 1}`,
    categoryId: item.categoryId,
    categoryName: item.categoryName,
    estimatedWeight: item.estimatedWeight,
    estimatedValue: item.estimatedValue,
  }));

  return {
    id,
    code,
    customerName: customer.name,
    customerPhone: customer.phone,
    unitId: unit.id,
    unitName: unit.name,
    unitAddress: unit.address,
    status: "menunggu",
    submittedAt,
    estimatedTotal: estimate.total,
    items,
    events: [
      {
        id: `${id}-event-1`,
        at: submittedAt,
        title: "Pengajuan dibuat",
        description: `Menunggu sampah diantar ke ${unit.name}.`,
        actor: "nasabah",
      },
    ],
  };
}

/** Harga yang berlaku untuk kategori + unit pada waktu tertentu. */
export function findApplicablePrice(
  prices: WastePrice[],
  categoryId: string,
  unitId: string,
  at: Date,
): WastePrice | undefined {
  const time = at.getTime();
  const isActive = (price: WastePrice) =>
    Date.parse(price.validFrom) <= time &&
    (price.validTo === null || Date.parse(price.validTo) >= time);

  return (
    prices.find(
      (price) =>
        price.categoryId === categoryId && price.unitId === unitId && isActive(price),
    ) ??
    prices.find(
      (price) => price.categoryId === categoryId && price.unitId === null && isActive(price),
    )
  );
}

export function resolvePricePerKg({
  prices,
  categories,
  categoryId,
  unitId,
  at = new Date(),
}: {
  prices: WastePrice[];
  categories: WasteCategory[];
  categoryId: string;
  unitId: string;
  at?: Date;
}): number {
  const price = findApplicablePrice(prices, categoryId, unitId, at);

  if (price) return price.pricePerKg;

  return categories.find((category) => category.id === categoryId)?.pricePerKg ?? 0;
}

export function findPriceOverlap(
  prices: WastePrice[],
  candidate: {
    id?: string;
    categoryId: string;
    unitId: string | null;
    validFrom: string;
    validTo: string | null;
  },
): WastePrice | undefined {
  const start = Date.parse(candidate.validFrom);
  const end = candidate.validTo ? Date.parse(candidate.validTo) : Number.POSITIVE_INFINITY;

  return prices.find((price) => {
    if (price.id === candidate.id) return false;
    if (price.categoryId !== candidate.categoryId) return false;
    if (price.unitId !== candidate.unitId) return false;

    const otherStart = Date.parse(price.validFrom);
    const otherEnd = price.validTo ? Date.parse(price.validTo) : Number.POSITIVE_INFINITY;

    return start <= otherEnd && otherStart <= end;
  });
}

export function startInspection(deposit: Deposit, now = new Date()): Deposit {
  if (deposit.status !== "menunggu") return deposit;

  const at = now.toISOString();

  return {
    ...deposit,
    status: "diproses",
    processedAt: at,
    events: [
      ...deposit.events,
      {
        id: `${deposit.id}-event-${deposit.events.length + 1}`,
        at,
        title: "Sampah diterima petugas",
        description: "Petugas menerima sampah dan mulai memeriksa kondisinya.",
        actor: "petugas",
      },
    ],
  };
}

export function confirmDeposit({
  deposit,
  input,
  prices,
  categories,
  now = new Date(),
}: {
  deposit: Deposit;
  input: ConfirmDepositInput;
  prices: WastePrice[];
  categories: WasteCategory[];
  now?: Date;
}): Deposit {
  // Idempotent: konfirmasi ulang tidak boleh membuat transaksi/event baru.
  if (deposit.status === "selesai") return deposit;

  if (deposit.status === "dibatalkan") {
    throw new Error("Pengajuan yang sudah dibatalkan tidak dapat dikonfirmasi.");
  }

  const inspected = input.items.map((item) => {
    const original = deposit.items.find((candidate) => candidate.id === item.itemId);

    if (!original) {
      throw new Error("Item sampah tidak ditemukan pada pengajuan ini.");
    }

    if (!item.accepted) {
      return { ...original, accepted: false, note: item.note?.trim() || undefined };
    }

    const actualWeight = item.actualWeight ?? 0;

    if (!Number.isFinite(actualWeight) || actualWeight <= 0) {
      throw new Error(
        `Berat aktual untuk ${original.categoryName} wajib diisi lebih dari 0 kg.`,
      );
    }

    return { ...original, accepted: true, actualWeight };
  });

  const rejectedWithoutReason = inspected.find(
    (item) => item.accepted === false && !item.note,
  );

  if (rejectedWithoutReason) {
    throw new Error(
      `Alasan penolakan wajib diisi untuk ${rejectedWithoutReason.categoryName}.`,
    );
  }

  const acceptedItems = inspected.filter((item) => item.accepted);

  if (acceptedItems.length === 0) {
    throw new Error(
      "Semua kategori ditolak. Gunakan pembatalan pengajuan dengan alasan, bukan konfirmasi.",
    );
  }

  const at = now.toISOString();
  const pricedItems = inspected.map((item) => {
    if (!item.accepted) {
      return { ...item, actualWeight: undefined, unitPriceSnapshot: undefined, finalValue: 0 };
    }

    const unitPriceSnapshot = resolvePricePerKg({
      prices,
      categories,
      categoryId: item.categoryId,
      unitId: deposit.unitId,
      at: now,
    });

    return {
      ...item,
      unitPriceSnapshot,
      finalValue: Math.round((item.actualWeight ?? 0) * unitPriceSnapshot),
    };
  });

  const finalTotal = pricedItems.reduce((sum, item) => sum + (item.finalValue ?? 0), 0);

  return {
    ...deposit,
    status: "selesai",
    completedAt: at,
    finalTotal,
    items: pricedItems,
    events: [
      ...deposit.events,
      {
        id: `${deposit.id}-event-${deposit.events.length + 1}`,
        at,
        title: "Transaksi selesai",
        description: `Nilai final ${formatFinalTotal(finalTotal)} dihitung dari berat aktual dan harga snapshot.`,
        actor: "petugas",
      },
    ],
  };
}

export function cancelDeposit({
  deposit,
  reason,
  actor,
  now = new Date(),
}: {
  deposit: Deposit;
  reason: string;
  actor: Role;
  now?: Date;
}): Deposit {
  const trimmed = reason.trim();

  if (trimmed.length < 5) {
    throw new Error("Alasan pembatalan wajib diisi minimal 5 karakter.");
  }

  if (deposit.status === "selesai" && actor !== "admin") {
    throw new Error("Transaksi selesai hanya dapat dikoreksi atau dibatalkan oleh Admin.");
  }

  if (deposit.status === "dibatalkan") {
    throw new Error("Pengajuan ini sudah dibatalkan.");
  }

  const at = now.toISOString();

  return {
    ...deposit,
    status: "dibatalkan",
    cancelledAt: at,
    cancellationReason: trimmed,
    events: [
      ...deposit.events,
      {
        id: `${deposit.id}-event-${deposit.events.length + 1}`,
        at,
        title: actor === "admin" ? "Dibatalkan oleh Admin" : "Dibatalkan oleh petugas",
        description: trimmed,
        actor,
      },
    ],
  };
}

export function correctDeposit({
  deposit,
  input,
  prices,
  categories,
  now = new Date(),
}: {
  deposit: Deposit;
  input: CorrectionInput;
  prices: WastePrice[];
  categories: WasteCategory[];
  now?: Date;
}): Deposit {
  if (deposit.status !== "selesai") {
    throw new Error("Koreksi hanya berlaku untuk transaksi berstatus selesai.");
  }

  const reason = input.reason.trim();

  if (reason.length < 5) {
    throw new Error("Alasan koreksi wajib diisi minimal 5 karakter.");
  }

  const previousTotal = deposit.finalTotal ?? 0;
  const at = now.toISOString();

  const items = deposit.items.map((item) => {
    const correction = input.items.find((candidate) => candidate.itemId === item.id);

    if (!correction) return item;

    if (!Number.isFinite(correction.actualWeight) || correction.actualWeight <= 0) {
      throw new Error(`Berat aktual untuk ${item.categoryName} wajib lebih dari 0 kg.`);
    }

    const unitPriceSnapshot =
      item.unitPriceSnapshot ??
      resolvePricePerKg({
        prices,
        categories,
        categoryId: item.categoryId,
        unitId: deposit.unitId,
        at: new Date(deposit.completedAt ?? deposit.submittedAt),
      });

    return {
      ...item,
      accepted: true,
      actualWeight: correction.actualWeight,
      unitPriceSnapshot,
      finalValue: Math.round(correction.actualWeight * unitPriceSnapshot),
    };
  });

  const finalTotal = items.reduce((sum, item) => sum + (item.finalValue ?? 0), 0);

  return {
    ...deposit,
    finalTotal,
    items,
    events: [
      ...deposit.events,
      {
        id: `${deposit.id}-event-${deposit.events.length + 1}`,
        at,
        title: "Koreksi oleh Admin",
        description: `${reason} (nilai final ${formatFinalTotal(previousTotal)} → ${formatFinalTotal(finalTotal)}).`,
        actor: "admin",
      },
    ],
  };
}

export function getNextSequence(deposits: Deposit[]): number {
  return (
    deposits.reduce((highest, deposit) => {
      const match = /(\d+)$/.exec(deposit.code);
      const value = match ? Number(match[1]) : 0;
      return Math.max(highest, value);
    }, 0) + 1
  );
}

export function createIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `idem-${Date.now()}`;
}

function formatFinalTotal(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
