/*
  Warnings:

  - You are about to drop the column `course` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `Resource` table. All the data in the column will be lost.
  - Added the required column `author` to the `Resource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Resource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `downloadUrl` to the `Resource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "course",
DROP COLUMN "fileUrl",
ADD COLUMN     "author" TEXT NOT NULL,
ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "downloadUrl" TEXT NOT NULL,
ADD COLUMN     "downloads" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "externalUrl" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
