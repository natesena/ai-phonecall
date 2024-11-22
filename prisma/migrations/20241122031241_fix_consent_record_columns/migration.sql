/*
  Warnings:

  - You are about to drop the column `privacy_version` on the `consent_record` table. All the data in the column will be lost.
  - You are about to drop the column `terms_version` on the `consent_record` table. All the data in the column will be lost.
  - Added the required column `type` to the `consent_record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `consent_record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "consent_record" DROP COLUMN "privacy_version",
DROP COLUMN "terms_version",
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "version" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "consent_record_user_id_type_version_idx" ON "consent_record"("user_id", "type", "version");
