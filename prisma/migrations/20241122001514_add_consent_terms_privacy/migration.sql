/*
  Warnings:

  - A unique constraint covering the columns `[subscription_id,user_id]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "ConsentRecord" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "terms_version" TEXT NOT NULL,
    "privacy_version" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConsentRecord_user_id_idx" ON "ConsentRecord"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_subscription_id_user_id_key" ON "subscriptions"("subscription_id", "user_id");
