// BSD-25 — seed data simulasi. Semua data di file ini FIKTIF, bukan data unit/harga nyata.
// Jalankan: npx prisma db seed (butuh DATABASE_URL yang hidup dan migrasi sudah diterapkan).
import "dotenv/config";
import { scryptSync } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"] });
const prisma = new PrismaClient({ adapter });

// Password akun uji: "Simulasi123!" — format hash scrypt$<salt>$<key> (BSD-28 wajib memakai format ini).
const PASSWORD = "Simulasi123!";

function hashPassword(password: string, salt: string): string {
  return `scrypt$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;
}

const UNITS = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "BSDU Simulasi Cibeunying",
    address: "Jl. Contoh Simulasi No. 1, Bandung (data fiktif)",
    operatingHours: { mon: "08:00-15:00", wed: "08:00-15:00", sat: "08:00-12:00" },
  },
  {
    id: "11111111-1111-4111-8111-111111111112",
    name: "BSDU Simulasi Sukajadi",
    address: "Jl. Contoh Simulasi No. 2, Bandung (data fiktif)",
    operatingHours: { tue: "09:00-16:00", thu: "09:00-16:00" },
  },
];

const CATEGORIES = [
  { id: "22222222-2222-4222-8222-222222222221", name: "Plastik PET", description: "Botol plastik bening (simulasi)" },
  { id: "22222222-2222-4222-8222-222222222222", name: "Kertas & Kardus", description: "Kardus, kertas HVS (simulasi)" },
  { id: "22222222-2222-4222-8222-222222222223", name: "Kaleng & Logam", description: "Kaleng aluminium, besi (simulasi)" },
  { id: "22222222-2222-4222-8222-222222222224", name: "Botol Kaca", description: "Botol kaca utuh (simulasi)" },
];

// Harga global (unit_id NULL) + satu contoh override per unit. Nilai fiktif.
const PRICES = [
  { id: "33333333-3333-4333-8333-333333333331", categoryId: CATEGORIES[0].id, pricePerKg: "3500.00" },
  { id: "33333333-3333-4333-8333-333333333332", categoryId: CATEGORIES[1].id, pricePerKg: "2000.00" },
  { id: "33333333-3333-4333-8333-333333333333", categoryId: CATEGORIES[2].id, pricePerKg: "8000.00" },
  { id: "33333333-3333-4333-8333-333333333334", categoryId: CATEGORIES[3].id, pricePerKg: "500.00" },
  { id: "33333333-3333-4333-8333-333333333335", categoryId: CATEGORIES[0].id, pricePerKg: "4000.00", unitId: UNITS[0].id },
];

const ACCOUNTS = [
  {
    id: "44444444-4444-4444-8444-444444444441",
    name: "Admin Simulasi",
    email: "admin@contoh.test",
    role: "admin" as const,
    salt: "seed-admin",
    units: [],
  },
  {
    id: "44444444-4444-4444-8444-444444444442",
    name: "Petugas Simulasi Cibeunying",
    email: "petugas.cibeunying@contoh.test",
    role: "petugas" as const,
    salt: "seed-petugas-1",
    units: [UNITS[0].id],
  },
  {
    id: "44444444-4444-4444-8444-444444444443",
    name: "Petugas Simulasi Sukajadi",
    email: "petugas.sukajadi@contoh.test",
    role: "petugas" as const,
    salt: "seed-petugas-2",
    units: [UNITS[1].id],
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    name: "Nasabah Simulasi",
    email: "nasabah@contoh.test",
    role: "nasabah" as const,
    salt: "seed-nasabah",
    units: [],
  },
];

async function main() {
  for (const unit of UNITS) {
    await prisma.bankSampahUnit.upsert({
      where: { id: unit.id },
      create: {
        ...unit,
        contactPhone: "0800000000",
        serviceStatus: "open",
        publicationStatus: "published",
        isSimulated: true,
      },
      update: { ...unit, isSimulated: true },
    });
  }

  for (const category of CATEGORIES) {
    await prisma.wasteCategory.upsert({
      where: { id: category.id },
      create: category,
      update: { name: category.name, description: category.description },
    });
  }

  for (const price of PRICES) {
    const data = {
      categoryId: price.categoryId,
      unitId: price.unitId ?? null,
      pricePerKg: price.pricePerKg,
      effectiveFrom: new Date("2026-01-01T00:00:00.000Z"),
      isSimulated: true,
    };
    await prisma.wastePrice.upsert({ where: { id: price.id }, create: { id: price.id, ...data }, update: data });
  }

  for (const account of ACCOUNTS) {
    const data = {
      name: account.name,
      email: account.email,
      role: account.role,
      passwordHash: hashPassword(PASSWORD, account.salt),
    };
    await prisma.user.upsert({ where: { id: account.id }, create: { id: account.id, ...data }, update: data });

    for (const unitId of account.units) {
      await prisma.unitStaff.upsert({
        where: { userId_unitId: { userId: account.id, unitId } },
        create: { userId: account.id, unitId },
        update: { status: "active" },
      });
    }
  }

  console.log(
    `Seed simulasi selesai: ${UNITS.length} unit, ${CATEGORIES.length} kategori, ${PRICES.length} harga, ${ACCOUNTS.length} akun uji (password: ${PASSWORD}).`,
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
