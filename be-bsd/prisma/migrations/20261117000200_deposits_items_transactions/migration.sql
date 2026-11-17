-- BSD-23: skema deposits, deposit_items, transactions (acuan docs/ERD_KAMUS_DATA.md)
-- Berat dan nilai memakai DECIMAL (bukan float); unit_price_snapshot menyimpan harga saat konfirmasi.

-- CreateEnum
CREATE TYPE "deposit_status" AS ENUM ('menunggu', 'diproses', 'selesai', 'dibatalkan');

-- CreateEnum
CREATE TYPE "inspection_status" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "transaction_status" AS ENUM ('active', 'cancelled', 'corrected');

-- CreateTable
CREATE TABLE "deposits" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID NOT NULL,
    "unit_id" UUID NOT NULL,
    "status" "deposit_status" NOT NULL DEFAULT 'menunggu',
    "submitted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "cancelled_at" TIMESTAMPTZ(6),
    "cancellation_reason" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposit_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "deposit_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "estimated_weight" DECIMAL(10,3) NOT NULL,
    "actual_weight" DECIMAL(10,3),
    "unit_price_snapshot" DECIMAL(12,2),
    "line_total" DECIMAL(14,2),
    "inspection_status" "inspection_status" NOT NULL DEFAULT 'pending',
    "rejection_reason" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "deposit_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "deposit_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "unit_id" UUID NOT NULL,
    "total_weight" DECIMAL(12,3) NOT NULL,
    "total_value" DECIMAL(14,2) NOT NULL,
    "confirmed_by" UUID NOT NULL,
    "confirmed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idempotency_key" VARCHAR(100),
    "status" "transaction_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "deposits_customer_id_submitted_at_idx" ON "deposits"("customer_id", "submitted_at" DESC);

-- CreateIndex
CREATE INDEX "deposits_unit_id_status_submitted_at_idx" ON "deposits"("unit_id", "status", "submitted_at");

-- CreateIndex
CREATE INDEX "deposit_items_deposit_id_idx" ON "deposit_items"("deposit_id");

-- CreateIndex
CREATE UNIQUE INDEX "deposit_items_deposit_id_category_id_key" ON "deposit_items"("deposit_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_deposit_id_key" ON "transactions"("deposit_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_idempotency_key_key" ON "transactions"("idempotency_key");

-- CreateIndex
CREATE INDEX "transactions_customer_id_confirmed_at_idx" ON "transactions"("customer_id", "confirmed_at" DESC);

-- CreateIndex
CREATE INDEX "transactions_unit_id_confirmed_at_idx" ON "transactions"("unit_id", "confirmed_at" DESC);

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "bank_sampah_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit_items" ADD CONSTRAINT "deposit_items_deposit_id_fkey" FOREIGN KEY ("deposit_id") REFERENCES "deposits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit_items" ADD CONSTRAINT "deposit_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "waste_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_deposit_id_fkey" FOREIGN KEY ("deposit_id") REFERENCES "deposits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "bank_sampah_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_confirmed_by_fkey" FOREIGN KEY ("confirmed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Constraint yang tidak bisa dinyatakan di Prisma (acuan kamus data ERD bagian 3.6-3.7).
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_cancellation_reason_check" CHECK ("status" <> 'dibatalkan' OR "cancellation_reason" IS NOT NULL);

ALTER TABLE "deposit_items" ADD CONSTRAINT "deposit_items_estimated_weight_check" CHECK ("estimated_weight" > 0);

ALTER TABLE "deposit_items" ADD CONSTRAINT "deposit_items_actual_weight_check" CHECK ("actual_weight" IS NULL OR "actual_weight" >= 0);

ALTER TABLE "deposit_items" ADD CONSTRAINT "deposit_items_rejection_reason_check" CHECK ("inspection_status" <> 'rejected' OR "rejection_reason" IS NOT NULL);
