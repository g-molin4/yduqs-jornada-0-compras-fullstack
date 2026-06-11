/*
  Warnings:

  - You are about to drop the `CoursePrice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CoursePrice" DROP CONSTRAINT "CoursePrice_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_priceId_fkey";

-- DropTable
DROP TABLE "CoursePrice";

-- CreateTable
CREATE TABLE "CoursePrices" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "installments" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "discount" DECIMAL(65,30) DEFAULT 0,
    "price" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoursePrices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CoursePrices" ADD CONSTRAINT "CoursePrices_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "CoursePrices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
