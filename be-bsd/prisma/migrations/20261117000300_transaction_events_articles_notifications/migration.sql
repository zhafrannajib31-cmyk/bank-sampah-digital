-- BSD-24: skema transaction_events, content_articles, notifications (acuan docs/ERD_KAMUS_DATA.md)

-- CreateEnum
CREATE TYPE "article_status" AS ENUM ('draft', 'published', 'archived');

-- CreateTable
CREATE TABLE "transaction_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "deposit_id" UUID,
    "transaction_id" UUID,
    "event_type" VARCHAR(40) NOT NULL,
    "old_status" VARCHAR(30),
    "new_status" VARCHAR(30),
    "actor_id" UUID NOT NULL,
    "reason" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_articles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "body" TEXT NOT NULL,
    "author_id" UUID NOT NULL,
    "status" "article_status" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "content_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "message" TEXT NOT NULL,
    "read_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "transaction_events_deposit_id_created_at_idx" ON "transaction_events"("deposit_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "transaction_events_transaction_id_created_at_idx" ON "transaction_events"("transaction_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "transaction_events_actor_id_created_at_idx" ON "transaction_events"("actor_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "content_articles_slug_key" ON "content_articles"("slug");

-- CreateIndex
CREATE INDEX "content_articles_status_published_at_idx" ON "content_articles"("status", "published_at" DESC);

-- CreateIndex
CREATE INDEX "notifications_user_id_read_at_idx" ON "notifications"("user_id", "read_at");

-- AddForeignKey
ALTER TABLE "transaction_events" ADD CONSTRAINT "transaction_events_deposit_id_fkey" FOREIGN KEY ("deposit_id") REFERENCES "deposits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_events" ADD CONSTRAINT "transaction_events_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_events" ADD CONSTRAINT "transaction_events_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_articles" ADD CONSTRAINT "content_articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Constraint yang tidak bisa dinyatakan di Prisma: event harus menempel pada deposit atau transaksi.
ALTER TABLE "transaction_events" ADD CONSTRAINT "transaction_events_target_check" CHECK ("deposit_id" IS NOT NULL OR "transaction_id" IS NOT NULL);
