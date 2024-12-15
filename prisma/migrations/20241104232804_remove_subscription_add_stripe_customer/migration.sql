/*
  Warnings:

  - You are about to drop the column `subscription` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripe_customer_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "subscription",
ADD COLUMN     "stripe_customer_id" TEXT;

-- CreateTable
CREATE TABLE "user_credits" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "stripe_product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "user_credits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_credits_user_id_stripe_product_id_key" ON "user_credits"("user_id", "stripe_product_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_stripe_customer_id_key" ON "user"("stripe_customer_id");
