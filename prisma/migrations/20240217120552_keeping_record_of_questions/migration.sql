/*
  Warnings:

  - You are about to alter the column `page_number` on the `form_questions` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `Decimal(5,3)`.

*/
-- AlterTable
ALTER TABLE "form_questions" ALTER COLUMN "page_number" SET DEFAULT 0,
ALTER COLUMN "page_number" SET DATA TYPE DECIMAL(5,3);
