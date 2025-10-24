/*
  Warnings:

  - You are about to drop the column `about` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `researchFocusSkills` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "about",
DROP COLUMN "researchFocusSkills",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "publications" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "researchFocus" TEXT,
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[];
