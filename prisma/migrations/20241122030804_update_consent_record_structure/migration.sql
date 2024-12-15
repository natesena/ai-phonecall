-- First, add the new columns
ALTER TABLE "consent_record" ADD COLUMN "type" TEXT;
ALTER TABLE "consent_record" ADD COLUMN "version" TEXT;

-- Update existing records (if any) to move data to new columns
UPDATE "consent_record"
SET "type" = 'terms',
    "version" = "terms_version"
WHERE "terms_version" IS NOT NULL;

UPDATE "consent_record"
SET "type" = 'privacy',
    "version" = "privacy_version"
WHERE "privacy_version" IS NOT NULL;

-- Drop the old columns
ALTER TABLE "consent_record" DROP COLUMN "terms_version";
ALTER TABLE "consent_record" DROP COLUMN "privacy_version";

-- Add the new index
CREATE INDEX "consent_record_user_id_type_version_idx" ON "consent_record"("user_id", "type", "version");