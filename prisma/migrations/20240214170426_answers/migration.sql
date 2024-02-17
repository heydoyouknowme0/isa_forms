-- AlterTable
ALTER TABLE "form_questions" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "form_questions_id_seq";

-- AlterTable
ALTER TABLE "form_submissions" ADD COLUMN     "is_submitted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "form_submissions_id_seq";

-- AlterTable
ALTER TABLE "forms" ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "form_answers" (
    "id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "submission_id" INTEGER NOT NULL,
    "answer" VARCHAR NOT NULL,

    CONSTRAINT "pk_form_answers" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "form_answers" ADD CONSTRAINT "fk_form_answers_form_questions" FOREIGN KEY ("question_id") REFERENCES "form_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "form_answers" ADD CONSTRAINT "fk_form_answers_form_submissions" FOREIGN KEY ("submission_id") REFERENCES "form_submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
