/*
  Warnings:

  - Added the required column `priceId` to the `Enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "priceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "CoursePrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
