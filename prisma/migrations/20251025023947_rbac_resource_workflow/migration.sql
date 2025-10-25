/*
  Warnings:

  - You are about to drop the column `courseCode` on the `resource` table. All the data in the column will be lost.
  - You are about to drop the column `departmentCode` on the `resource` table. All the data in the column will be lost.
  - You are about to drop the column `universityCode` on the `resource` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."UniversityRole" AS ENUM ('ADMIN', 'CONTRIBUTOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "public"."ResourceStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."ResourceAuditAction" AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED', 'ARCHIVED', 'RESTORED');

-- DropIndex
DROP INDEX "public"."resource_universityCode_idx";

-- AlterTable
ALTER TABLE "public"."resource" DROP COLUMN "courseCode",
DROP COLUMN "departmentCode",
DROP COLUMN "universityCode",
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "reviewNote" TEXT,
ADD COLUMN     "status" "public"."ResourceStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "submittedById" TEXT,
ADD COLUMN     "universityId" TEXT;

-- CreateTable
CREATE TABLE "public"."university" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."university_membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "role" "public"."UniversityRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "university_membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."resource_audit" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" "public"."ResourceAuditAction" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resource_audit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "university_slug_key" ON "public"."university"("slug");

-- CreateIndex
CREATE INDEX "university_membership_universityId_idx" ON "public"."university_membership"("universityId");

-- CreateIndex
CREATE INDEX "university_membership_role_idx" ON "public"."university_membership"("role");

-- CreateIndex
CREATE UNIQUE INDEX "university_membership_userId_universityId_key" ON "public"."university_membership"("userId", "universityId");

-- CreateIndex
CREATE INDEX "resource_audit_resourceId_idx" ON "public"."resource_audit"("resourceId");

-- CreateIndex
CREATE INDEX "resource_audit_actorId_idx" ON "public"."resource_audit"("actorId");

-- CreateIndex
CREATE INDEX "resource_status_idx" ON "public"."resource"("status");

-- CreateIndex
CREATE INDEX "resource_universityId_idx" ON "public"."resource"("universityId");

-- AddForeignKey
ALTER TABLE "public"."resource" ADD CONSTRAINT "resource_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resource" ADD CONSTRAINT "resource_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resource" ADD CONSTRAINT "resource_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "public"."university"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."university_membership" ADD CONSTRAINT "university_membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."university_membership" ADD CONSTRAINT "university_membership_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "public"."university"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resource_audit" ADD CONSTRAINT "resource_audit_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "public"."resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resource_audit" ADD CONSTRAINT "resource_audit_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
