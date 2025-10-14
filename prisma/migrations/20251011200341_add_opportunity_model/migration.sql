-- CreateTable
CREATE TABLE "public"."opportunity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerLogo" TEXT,
    "bannerImage" TEXT,
    "university" TEXT,
    "department" TEXT,
    "tags" TEXT[],
    "location" TEXT,
    "applicationUrl" TEXT,
    "deadline" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "postedById" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "bookmarks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "opportunity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."opportunity" ADD CONSTRAINT "opportunity_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
