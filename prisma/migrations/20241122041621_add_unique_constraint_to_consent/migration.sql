/*
  Warnings:

  - A unique constraint covering the columns `[user_id,type,version]` on the table `consent_record` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "consent_record_user_id_type_version_idx";

-- CreateIndex
CREATE UNIQUE INDEX "consent_record_user_id_type_version_key" ON "consent_record"("user_id", "type", "version");
