-- CreateEnum
CREATE TYPE "ResourceNodeType" AS ENUM ('FOLDER', 'FILE');

-- CreateEnum
CREATE TYPE "ResourceFolderKind" AS ENUM ('UNIVERSITY', 'DEPARTMENT', 'COURSE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ResourceMediaType" AS ENUM ('DOCUMENT', 'IMAGE', 'VIDEO', 'OTHER');

-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT IF EXISTS "Resource_uploadedById_fkey";

-- DropTable
DROP TABLE IF EXISTS "Resource";

-- CreateTable
CREATE TABLE "resource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nodeType" "ResourceNodeType" NOT NULL,
    "folderKind" "ResourceFolderKind",
    "mediaType" "ResourceMediaType",
    "parentId" TEXT,
    "depth" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "canonicalPath" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "universityCode" TEXT,
    "departmentCode" TEXT,
    "courseCode" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "storageKey" TEXT,
    "downloadUrl" TEXT,
    "externalUrl" TEXT,
    "previewUrl" TEXT,
    "checksum" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "isArchived" BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT "resource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "resource_nodeType_idx" ON "resource"("nodeType");

-- CreateIndex
CREATE INDEX "resource_folderKind_idx" ON "resource"("folderKind");

-- CreateIndex
CREATE INDEX "resource_mediaType_idx" ON "resource"("mediaType");

-- CreateIndex
CREATE INDEX "resource_parentId_idx" ON "resource"("parentId");

-- CreateIndex
CREATE INDEX "resource_universityCode_idx" ON "resource"("universityCode");

-- CreateIndex
CREATE UNIQUE INDEX "resource_parentId_slug_key" ON "resource"("parentId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "resource_canonicalPath_key" ON "resource"("canonicalPath");

-- AddForeignKey
ALTER TABLE "resource"
ADD CONSTRAINT "resource_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource"
ADD CONSTRAINT "resource_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
