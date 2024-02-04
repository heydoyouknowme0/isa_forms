/*
  Warnings:

  - You are about to drop the `Form` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FormSubmission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FormSubmission" DROP CONSTRAINT "FormSubmission_formId_fkey";

-- DropTable
DROP TABLE "Form";

-- DropTable
DROP TABLE "FormSubmission";

-- CreateTable
CREATE TABLE "form" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "visible_to" TEXT[],
    "questions" TEXT NOT NULL DEFAULT '[]',
    "on_submit_message" TEXT NOT NULL DEFAULT 'Your response has been recorded.',
    "is_editing_allowed" BOOLEAN NOT NULL,
    "is_single_response" BOOLEAN NOT NULL DEFAULT true,
    "is_view_analytics_allowed" BOOLEAN NOT NULL DEFAULT false,
    "is_shuffled" BOOLEAN NOT NULL DEFAULT false,
    "is_copy_sent" BOOLEAN NOT NULL DEFAULT false,
    "is_quiz" BOOLEAN NOT NULL DEFAULT false,
    "expiry_date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "persistant_url" TEXT,
    "is_pulished" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_submission" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "form_id" INTEGER NOT NULL,

    CONSTRAINT "form_submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_questions" (
    "id" SERIAL NOT NULL,
    "form_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "input_type" TEXT NOT NULL,
    "choices" TEXT,
    "mime_type" TEXT,
    "range" TEXT,
    "page_number" INTEGER NOT NULL DEFAULT 0,
    "marks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "form_questions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "form_submission" ADD CONSTRAINT "form_submission_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_questions" ADD CONSTRAINT "form_questions_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
