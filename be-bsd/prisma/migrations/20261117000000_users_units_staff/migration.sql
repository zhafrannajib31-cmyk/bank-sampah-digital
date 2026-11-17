-- BSD-21: skema users, bank_sampah_units, unit_staff (acuan docs/ERD_KAMUS_DATA.md)

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('nasabah', 'petugas', 'admin');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('active', 'inactive', 'pending');

-- CreateEnum
CREATE TYPE "service_status" AS ENUM ('open', 'closed', 'temporarily_closed');

-- CreateEnum
CREATE TYPE "publication_status" AS ENUM ('draft', 'published', 'unpublished');

-- CreateEnum
CREATE TYPE "unit_staff_status" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "user_role" NOT NULL,
    "status" "user_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_sampah_units" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(150) NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "operating_hours" JSONB,
    "contact_phone" VARCHAR(20),
    "contact_email" VARCHAR(255),
    "service_status" "service_status" NOT NULL DEFAULT 'open',
    "publication_status" "publication_status" NOT NULL DEFAULT 'draft',
    "is_simulated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "bank_sampah_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_staff" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "unit_id" UUID NOT NULL,
    "status" "unit_staff_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "unit_staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "bank_sampah_units_publication_status_idx" ON "bank_sampah_units"("publication_status");

-- CreateIndex
CREATE INDEX "bank_sampah_units_service_status_idx" ON "bank_sampah_units"("service_status");

-- CreateIndex
CREATE INDEX "unit_staff_unit_id_status_idx" ON "unit_staff"("unit_id", "status");

-- CreateIndex
CREATE INDEX "unit_staff_user_id_status_idx" ON "unit_staff"("user_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "unit_staff_user_id_unit_id_key" ON "unit_staff"("user_id", "unit_id");

-- AddForeignKey
ALTER TABLE "unit_staff" ADD CONSTRAINT "unit_staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_staff" ADD CONSTRAINT "unit_staff_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "bank_sampah_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Constraint yang tidak bisa dinyatakan di Prisma: pengguna wajib punya email atau nomor HP.
ALTER TABLE "users" ADD CONSTRAINT "users_email_or_phone_check" CHECK ("email" IS NOT NULL OR "phone" IS NOT NULL);
