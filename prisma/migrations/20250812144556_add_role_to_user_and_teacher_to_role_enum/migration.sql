-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'TEACHER';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'STUDENT';
