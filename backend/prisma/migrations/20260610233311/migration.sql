/*
  Warnings:

  - You are about to drop the column `description` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `durationMonths` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `workloadHours` on the `Course` table. All the data in the column will be lost.
  - Added the required column `graduationYear` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Made the column `cpf` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `birthDate` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "description",
DROP COLUMN "durationMonths",
DROP COLUMN "workloadHours";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "graduationYear" TEXT NOT NULL,
ALTER COLUMN "cpf" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "birthDate" SET NOT NULL;
