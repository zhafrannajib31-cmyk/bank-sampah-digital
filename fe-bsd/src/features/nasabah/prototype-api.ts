import type { BankUnit, Deposit, DepositDraft, DepositItem, WasteCategory } from "./types";

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

/**
 * Simulasi perhitungan sisi server untuk prototype.
 * Di aplikasi nyata, nilai transaksi dihitung oleh API, bukan komponen FE.
 */
export function calculateEstimate(draft: DepositDraft, categories: WasteCategory[]): Estimate {
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
  sequence,
  now = new Date(),
}: {
  draft: DepositDraft;
  categories: WasteCategory[];
  units: BankUnit[];
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
      },
    ],
  };
}
