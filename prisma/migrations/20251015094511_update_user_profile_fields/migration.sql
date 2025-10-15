/*
  Warnings:

  - You are about to drop the column `bio` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `publications` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `researchFocus` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "bio",
DROP COLUMN "publications",
DROP COLUMN "researchFocus",
DROP COLUMN "skills",
ADD COLUMN     "about" TEXT,
ADD COLUMN     "researchFocusSkills" TEXT;
