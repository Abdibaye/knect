-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "commentId" TEXT;

-- AlterTable
ALTER TABLE "post" ADD COLUMN     "eventDetails" JSONB;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
