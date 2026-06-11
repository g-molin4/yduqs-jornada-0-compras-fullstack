/*
  Warnings:

  - Added the required column `modality` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CourseModality" AS ENUM ('PRESENCIAL', 'EAD');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "modality" "CourseModality" NOT NULL;
