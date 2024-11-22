/*
  Warnings:

  - You are about to drop the column `type` on the `consent_record` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `consent_record` table. All the data in the column will be lost.
  - Added the required column `privacy_version` to the `consent_record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `terms_version` to the `consent_record` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "consent_record_user_id_type_version_idx";

-- AlterTable
ALTER TABLE "consent_record" DROP COLUMN "type",
DROP COLUMN "version",
ADD COLUMN     "privacy_version" TEXT NOT NULL,
ADD COLUMN     "terms_version" TEXT NOT NULL;
