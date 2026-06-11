-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_priceId_fkey";

-- AlterTable
ALTER TABLE "Enrollment" ALTER COLUMN "priceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "CoursePrices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
