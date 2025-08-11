-- AlterTable
ALTER TABLE "post" ADD COLUMN     "attachments" JSONB,
ADD COLUMN     "citation" TEXT,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "doi" TEXT,
ADD COLUMN     "downloads" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "resourceType" TEXT,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "university" TEXT,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "visibility" TEXT;
