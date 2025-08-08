-- AlterTable
ALTER TABLE "user" ADD COLUMN     "department" TEXT,
ADD COLUMN     "publications" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "researchFocus" TEXT,
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "university" TEXT,
ADD COLUMN     "yearOfStudy" TEXT;
