import type { BankUnit, Deposit, NasabahProfile, WasteCategory } from "./types";

// Data contoh (SIMULASI) mengikuti desain Figma "Prototype PWA".
export const units: BankUnit[] = [
  {
    id: "unit-sukamaju",
    name: "BSU Sukamaju Hijau",
    address: "Jl. Tamansari No. 12, Bandung",
    hours: "Senin – Sabtu, 08.00 – 16.00 WIB",
    shortHours: "08.00 – 16.00",
    phone: "0812–0000–1122",
    distanceKm: 1.2,
    isOpen: true,
    categoryIds: ["plastik", "kertas", "kardus", "logam"],
  },
  {
    id: "unit-cibeunying",
    name: "BSU Cibeunying Lestari",
    address: "Jl. Cihampelas No. 88, Bandung",
    hours: "Senin – Jumat, 09.00 – 15.00 WIB",
    shortHours: "09.00 – 15.00",
    phone: "0812–0000–3344",
    distanceKm: 2.8,
    isOpen: true,
    categoryIds: ["plastik", "kertas", "botol-kaca"],
  },
  {
    id: "unit-dago",
    name: "BSU Dago Asri",
    address: "Jl. Ir. H. Juanda No. 45, Bandung",
    hours: "Senin – Sabtu, 08.00 – 15.00 WIB",
    shortHours: "Buka lagi besok 08.00",
    phone: "0812–0000–5566",
    distanceKm: 4.1,
    isOpen: false,
    categoryIds: ["plastik", "kardus"],
  },
  {
    id: "unit-antapani",
    name: "BSU Antapani Bersih",
    address: "Jl. Terusan Jakarta No. 7, Bandung",
    hours: "Senin – Sabtu, 08.00 – 14.00 WIB",
    shortHours: "08.00 – 14.00",
    phone: "0812–0000–7788",
    distanceKm: 5.6,
    isOpen: true,
    categoryIds: ["plastik", "kertas", "logam"],
  },
];

/** Harga berlaku (simulasi) yang ditampilkan di Detail Bank Sampah. */
export const PRICE_EFFECTIVE_DATE = "25 Okt 2026";

export const categories: WasteCategory[] = [
  { id: "plastik", name: "Plastik", pricePerKg: 4000, note: "Botol, gelas, kantong plastik" },
  { id: "kertas", name: "Kertas", pricePerKg: 3000, note: "Koran, HVS, majalah" },
  { id: "kardus", name: "Kardus", pricePerKg: 2500, note: "Kardus makanan, paket, box" },
  { id: "logam", name: "Logam", pricePerKg: 8000, note: "Besi, kaleng, plat nomor" },
  { id: "botol-kaca", name: "Botol Kaca", pricePerKg: 3500, note: "Kecap, sirup, toples kaca" },
  { id: "elektronik", name: "Elektronik", pricePerKg: null, note: "PCB, HP, Kabel, Aki" },
];

export const profile: NasabahProfile = {
  name: "Aden Arya Dimas Fauzan",
  phone: "+62 812 3456 7890",
  email: "aden@gmail.com",
  address: "Bandung",
  memberSince: "2026-09-01T00:00:00+07:00",
};

/** "Hari ini" pada data contoh (simulasi). */
export const SEED_TODAY = "2026-10-25";

const priceOf = (categoryId: string) =>
  categories.find((c) => c.id === categoryId)?.pricePerKg ?? 0;
const nameOf = (categoryId: string) =>
  categories.find((c) => c.id === categoryId)?.name ?? categoryId;

/** Item setoran data contoh: nilai dihitung dari berat x harga (simulasi sisi server). */
function seedItem(depositId: string, categoryId: string, estimated: number, actual?: number) {
  const price = priceOf(categoryId);
  return {
    id: `${depositId}-${categoryId}`,
    categoryId,
    categoryName: nameOf(categoryId),
    estimatedWeight: estimated,
    estimatedValue: Math.round(estimated * price),
    ...(actual === undefined
      ? {}
      : {
          actualWeight: actual,
          unitPriceSnapshot: price,
          finalValue: Math.round(actual * price),
        }),
  };
}

function seedDeposit(
  code: string,
  unitId: string,
  status: Deposit["status"],
  submittedAt: string,
  rows: [string, number, number?][],
  extra: Partial<Deposit> = {},
): Deposit {
  const unit = units.find((candidate) => candidate.id === unitId)!;
  const id = `dep-${code.toLowerCase().replace("set-", "")}`;
  const items = rows.map(([categoryId, estimated, actual]) =>
    seedItem(id, categoryId, estimated, actual),
  );
  const weighed = items.every((item) => item.finalValue !== undefined);
  return {
    id,
    code,
    unitId,
    unitName: unit.name,
    unitAddress: unit.address,
    status,
    submittedAt,
    estimatedTotal: items.reduce((sum, item) => sum + item.estimatedValue, 0),
    finalTotal:
      status === "selesai" && weighed
        ? items.reduce((sum, item) => sum + (item.finalValue ?? 0), 0)
        : undefined,
    items,
    events: [{ id: `${id}-e1`, at: submittedAt, title: "Pengajuan dibuat" }],
    ...extra,
  };
}

export const seedDeposits: Deposit[] = [
  seedDeposit("SET-251025-0195", "unit-sukamaju", "menunggu", "2026-10-25T11:05:00+07:00", [
    ["logam", 2.0],
  ]),
  // Diproses: sudah ditimbang petugas, menunggu pemindaian QR dan konfirmasi.
  seedDeposit(
    "SET-251025-0193",
    "unit-cibeunying",
    "diproses",
    "2026-10-25T09:50:00+07:00",
    [["kertas", 3.0, 3.1]],
    { officerName: "Andi Pratama" },
  ),
  seedDeposit(
    "SET-251025-0192",
    "unit-sukamaju",
    "selesai",
    "2026-10-25T08:40:00+07:00",
    [
      ["plastik", 5.0, 5.2],
      ["kardus", 3.0, 3.0],
    ],
    { completedAt: "2026-10-25T10:20:00+07:00", officerName: "Andi Pratama" },
  ),
  seedDeposit(
    "SET-251018-0171",
    "unit-sukamaju",
    "selesai",
    "2026-10-18T10:00:00+07:00",
    [["kertas", 4.0, 4.0]],
    {
      completedAt: "2026-10-18T11:10:00+07:00",
      officerName: "Andi Pratama",
    },
  ),
  seedDeposit(
    "SET-0194",
    "unit-sukamaju",
    "dibatalkan",
    "2026-10-14T09:15:00+07:00",
    [["kardus", 2.0]],
    {
      cancellationReason: "Sampah bercampur limbah B3",
      cancelledAt: "2026-10-14T10:20:00+07:00",
      cancelledBy: "Petugas Unit (Andi Pratama)",
    },
  ),
  seedDeposit(
    "SET-251010-0143",
    "unit-cibeunying",
    "selesai",
    "2026-10-10T13:00:00+07:00",
    [["botol-kaca", 6.0, 6.0]],
    {
      completedAt: "2026-10-10T14:05:00+07:00",
      officerName: "Rina Kusuma",
    },
  ),
  seedDeposit(
    "SET-251003-0120",
    "unit-sukamaju",
    "selesai",
    "2026-10-03T08:30:00+07:00",
    [["plastik", 5.5, 5.5]],
    {
      completedAt: "2026-10-03T09:30:00+07:00",
      officerName: "Andi Pratama",
    },
  ),
  seedDeposit(
    "SET-250918-0088",
    "unit-sukamaju",
    "selesai",
    "2026-09-18T09:00:00+07:00",
    [
      ["logam", 4.0, 4.0],
      ["kertas", 2.0, 1.9],
      ["kardus", 1.5, 1.6],
    ],
    { completedAt: "2026-09-18T10:15:00+07:00", officerName: "Andi Pratama" },
  ),
];
