/*
  Warnings:

  - You are about to alter the column `page_number` on the `form_questions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,3)` to `Real`.

*/
-- AlterTable
ALTER TABLE "form_questions" ALTER COLUMN "page_number" SET DATA TYPE REAL;
