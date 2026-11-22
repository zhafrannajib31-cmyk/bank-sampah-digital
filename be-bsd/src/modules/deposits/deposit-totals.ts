import { Decimal } from '@prisma/client-runtime-utils';

export type WeighedItem = { actualWeight: unknown; unitPriceSnapshot: unknown };

/** Nilai per item = berat aktual x snapshot harga, dihitung Decimal (FR-12). */
export function lineTotalOf(item: WeighedItem): Decimal {
  const weight = new Decimal(item.actualWeight?.toString() ?? '0');
  const price = new Decimal(item.unitPriceSnapshot?.toString() ?? '0');
  return weight.times(price);
}

/** Total = jumlah semua nilai item; tanpa float (TC-04). */
export function depositTotals(items: WeighedItem[]) {
  return items.reduce(
    (acc, item) => ({
      totalWeight: acc.totalWeight.plus(new Decimal(item.actualWeight?.toString() ?? '0')),
      totalValue: acc.totalValue.plus(lineTotalOf(item)),
    }),
    { totalWeight: new Decimal(0), totalValue: new Decimal(0) },
  );
}
