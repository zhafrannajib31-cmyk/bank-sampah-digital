-- BSD-22: skema waste_categories dan waste_prices (acuan docs/ERD_KAMUS_DATA.md)

-- CreateEnum
CREATE TYPE "active_status" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "waste_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "status" "active_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "waste_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waste_prices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "unit_id" UUID,
    "category_id" UUID NOT NULL,
    "price_per_kg" DECIMAL(12,2) NOT NULL,
    "effective_from" DATE NOT NULL,
    "effective_to" DATE,
    "status" "active_status" NOT NULL DEFAULT 'active',
    "is_simulated" BOOLEAN NOT NULL DEFAULT false,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "waste_prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "waste_categories_name_key" ON "waste_categories"("name");

-- CreateIndex
CREATE INDEX "waste_prices_category_id_effective_from_idx" ON "waste_prices"("category_id", "effective_from" DESC);

-- CreateIndex
CREATE INDEX "waste_prices_unit_id_category_id_effective_from_idx" ON "waste_prices"("unit_id", "category_id", "effective_from" DESC);

-- AddForeignKey
ALTER TABLE "waste_prices" ADD CONSTRAINT "waste_prices_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "bank_sampah_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waste_prices" ADD CONSTRAINT "waste_prices_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "waste_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waste_prices" ADD CONSTRAINT "waste_prices_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Constraint yang tidak bisa dinyatakan di Prisma.
ALTER TABLE "waste_prices" ADD CONSTRAINT "waste_prices_price_per_kg_check" CHECK ("price_per_kg" >= 0);

ALTER TABLE "waste_prices" ADD CONSTRAINT "waste_prices_period_check" CHECK ("effective_to" IS NULL OR "effective_to" >= "effective_from");

-- Periode harga untuk kategori + unit yang sama tidak boleh tumpang tindih (prasyarat BSD-22).
-- unit_id NULL (harga global) diganti UUID nol karena NULL tidak pernah sama dengan NULL.
-- Butuh extension btree_gist; bila DB terkelola menolak CREATE EXTENSION, ganti dengan validasi
-- transaksi di service waste-prices (BSD-39) dan hapus constraint ini.
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "waste_prices" ADD CONSTRAINT "waste_prices_no_overlap" EXCLUDE USING gist (
    "category_id" WITH =,
    (COALESCE("unit_id", '00000000-0000-0000-0000-000000000000'::uuid)) WITH =,
    (daterange("effective_from", "effective_to", '[]')) WITH &&
);
