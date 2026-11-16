import type { BankUnit, Deposit, NasabahProfile, WasteCategory } from "./types";

export const units: BankUnit[] = [
  {
    id: "unit-sukamaju",
    name: "Bank Sampah Unit Sukamaju",
    address: "Jl. Sukamaju No. 12, Kec. Cibeunying",
    hours: "Senin–Sabtu, 08.00–15.00",
    phone: "0812-3456-7890",
    distanceKm: 1.2,
    isOpen: true,
  },
  {
    id: "unit-cendana",
    name: "Bank Sampah Unit Cendana",
    address: "Jl. Cendana Raya No. 5, Kec. Antapani",
    hours: "Senin–Jumat, 09.00–16.00",
    phone: "0812-9876-5432",
    distanceKm: 2.4,
    isOpen: true,
  },
  {
    id: "unit-melati",
    name: "Bank Sampah Unit Melati",
    address: "Jl. Melati No. 8, Kec. Lengkong",
    hours: "Sabtu, 08.00–12.00",
    phone: "0813-2222-1111",
    distanceKm: 3.1,
    isOpen: false,
  },
];

export const categories: WasteCategory[] = [
  {
    id: "plastik-pet",
    name: "Plastik PET",
    pricePerKg: 3500,
    note: "Botol plastik bening, bersih, tanpa tutup.",
  },
  {
    id: "kertas-kardus",
    name: "Kertas & Kardus",
    pricePerKg: 2000,
    note: "Kardus kering dan dilipat rapi.",
  },
  {
    id: "kaleng-aluminium",
    name: "Kaleng Aluminium",
    pricePerKg: 12000,
    note: "Kaleng minuman bersih dan tidak penyok berat.",
  },
  {
    id: "botol-kaca",
    name: "Botol Kaca",
    pricePerKg: 1000,
    note: "Botol kaca utuh, tidak pecah, dan sudah dicuci.",
  },
];

export const profile: NasabahProfile = {
  name: "Siti Rahma",
  phone: "0812-3456-7890",
  email: "siti.rahma@contoh.id",
  address: "Jl. Kenanga No. 21, Bandung",
  memberSince: "2026-08-14T00:00:00+07:00",
};

export const seedDeposits: Deposit[] = [
  {
    id: "dep-2026-0018",
    code: "BSD-2026-0018",
    unitId: "unit-sukamaju",
    unitName: "Bank Sampah Unit Sukamaju",
    unitAddress: "Jl. Sukamaju No. 12, Kec. Cibeunying",
    status: "menunggu",
    submittedAt: "2026-11-12T08:15:00+07:00",
    estimatedTotal: 18000,
    items: [
      {
        id: "dep-2026-0018-item-1",
        categoryId: "kaleng-aluminium",
        categoryName: "Kaleng Aluminium",
        estimatedWeight: 1.5,
        estimatedValue: 18000,
      },
    ],
    events: [
      {
        id: "dep-2026-0018-event-1",
        at: "2026-11-12T08:15:00+07:00",
        title: "Pengajuan dibuat",
        description: "Menunggu sampah diantar ke unit Sukamaju.",
      },
    ],
  },
  {
    id: "dep-2026-0015",
    code: "BSD-2026-0015",
    unitId: "unit-sukamaju",
    unitName: "Bank Sampah Unit Sukamaju",
    unitAddress: "Jl. Sukamaju No. 12, Kec. Cibeunying",
    status: "diproses",
    submittedAt: "2026-11-11T16:40:00+07:00",
    estimatedTotal: 14000,
    items: [
      {
        id: "dep-2026-0015-item-1",
        categoryId: "plastik-pet",
        categoryName: "Plastik PET",
        estimatedWeight: 4,
        estimatedValue: 14000,
      },
    ],
    events: [
      {
        id: "dep-2026-0015-event-1",
        at: "2026-11-11T16:40:00+07:00",
        title: "Pengajuan dibuat",
        description: "Nasabah mengajukan setoran 4 kg Plastik PET.",
      },
      {
        id: "dep-2026-0015-event-2",
        at: "2026-11-12T09:05:00+07:00",
        title: "Sampah diterima di unit",
        description: "Petugas menerima sampah dan mulai memeriksa kondisi.",
      },
      {
        id: "dep-2026-0015-event-3",
        at: "2026-11-12T09:20:00+07:00",
        title: "Sedang ditimbang",
        description: "Berat aktual akan menjadi dasar nilai final.",
      },
    ],
  },
  {
    id: "dep-2026-0012",
    code: "BSD-2026-0012",
    unitId: "unit-sukamaju",
    unitName: "Bank Sampah Unit Sukamaju",
    unitAddress: "Jl. Sukamaju No. 12, Kec. Cibeunying",
    status: "selesai",
    submittedAt: "2026-11-08T09:20:00+07:00",
    estimatedTotal: 17500,
    finalTotal: 14200,
    items: [
      {
        id: "dep-2026-0012-item-1",
        categoryId: "plastik-pet",
        categoryName: "Plastik PET",
        estimatedWeight: 3,
        estimatedValue: 10500,
        actualWeight: 2.8,
        unitPriceSnapshot: 3500,
        finalValue: 9800,
      },
      {
        id: "dep-2026-0012-item-2",
        categoryId: "kertas-kardus",
        categoryName: "Kertas & Kardus",
        estimatedWeight: 2,
        estimatedValue: 4000,
        actualWeight: 2.2,
        unitPriceSnapshot: 2000,
        finalValue: 4400,
      },
    ],
    events: [
      {
        id: "dep-2026-0012-event-1",
        at: "2026-11-08T09:20:00+07:00",
        title: "Pengajuan dibuat",
        description: "Estimasi 5 kg dari 2 jenis sampah.",
      },
      {
        id: "dep-2026-0012-event-2",
        at: "2026-11-08T10:10:00+07:00",
        title: "Sampah diterima dan ditimbang",
        description: "Berat aktual 2,8 kg Plastik PET dan 2,2 kg Kertas & Kardus.",
      },
      {
        id: "dep-2026-0012-event-3",
        at: "2026-11-08T10:25:00+07:00",
        title: "Transaksi selesai",
        description: "Petugas mengonfirmasi nilai final Rp14.200.",
      },
    ],
  },
  {
    id: "dep-2026-0009",
    code: "BSD-2026-0009",
    unitId: "unit-cendana",
    unitName: "Bank Sampah Unit Cendana",
    unitAddress: "Jl. Cendana Raya No. 5, Kec. Antapani",
    status: "dibatalkan",
    submittedAt: "2026-11-03T10:05:00+07:00",
    estimatedTotal: 3000,
    cancellationReason: "Sampah tercampur dan tidak memenuhi kriteria unit.",
    items: [
      {
        id: "dep-2026-0009-item-1",
        categoryId: "botol-kaca",
        categoryName: "Botol Kaca",
        estimatedWeight: 3,
        estimatedValue: 3000,
      },
    ],
    events: [
      {
        id: "dep-2026-0009-event-1",
        at: "2026-11-03T10:05:00+07:00",
        title: "Pengajuan dibuat",
        description: "Estimasi 3 kg Botol Kaca.",
      },
      {
        id: "dep-2026-0009-event-2",
        at: "2026-11-03T10:30:00+07:00",
        title: "Pengajuan dibatalkan",
        description: "Sampah tercampur dan tidak memenuhi kriteria unit.",
      },
    ],
  },
  {
    id: "dep-2026-0008",
    code: "BSD-2026-0008",
    unitId: "unit-cendana",
    unitName: "Bank Sampah Unit Cendana",
    unitAddress: "Jl. Cendana Raya No. 5, Kec. Antapani",
    status: "selesai",
    submittedAt: "2026-10-28T14:10:00+07:00",
    estimatedTotal: 10000,
    finalTotal: 10000,
    items: [
      {
        id: "dep-2026-0008-item-1",
        categoryId: "kertas-kardus",
        categoryName: "Kertas & Kardus",
        estimatedWeight: 5,
        estimatedValue: 10000,
        actualWeight: 5,
        unitPriceSnapshot: 2000,
        finalValue: 10000,
      },
    ],
    events: [
      {
        id: "dep-2026-0008-event-1",
        at: "2026-10-28T14:10:00+07:00",
        title: "Pengajuan dibuat",
        description: "Estimasi 5 kg Kertas & Kardus.",
      },
      {
        id: "dep-2026-0008-event-2",
        at: "2026-10-28T15:00:00+07:00",
        title: "Transaksi selesai",
        description: "Berat aktual sesuai estimasi; nilai final Rp10.000.",
      },
    ],
  },
];
