import type { DepositDraft, WasteCategory } from "./types";

export interface EstimateItem {
  categoryId: string;
  categoryName: string;
  estimatedWeight: number;
  pricePerKg: number | null;
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
      estimatedValue: Math.round(item.estimatedWeight * (category.pricePerKg ?? 0)),
    };
  });

  return {
    items,
    total: items.reduce((sum, item) => sum + item.estimatedValue, 0),
  };
}
