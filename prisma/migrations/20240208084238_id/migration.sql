-- AlterTable
CREATE SEQUENCE form_questions_id_seq;
ALTER TABLE "form_questions" ALTER COLUMN "id" SET DEFAULT nextval('form_questions_id_seq');
ALTER SEQUENCE form_questions_id_seq OWNED BY "form_questions"."id";

-- AlterTable
CREATE SEQUENCE form_submissions_id_seq;
ALTER TABLE "form_submissions" ALTER COLUMN "id" SET DEFAULT nextval('form_submissions_id_seq');
ALTER SEQUENCE form_submissions_id_seq OWNED BY "form_submissions"."id";

-- AlterTable
CREATE SEQUENCE forms_id_seq;
ALTER TABLE "forms" ALTER COLUMN "id" SET DEFAULT nextval('forms_id_seq');
ALTER SEQUENCE forms_id_seq OWNED BY "forms"."id";

-- AlterTable
CREATE SEQUENCE persons_id_seq;
ALTER TABLE "persons" ALTER COLUMN "id" SET DEFAULT nextval('persons_id_seq');
ALTER SEQUENCE persons_id_seq OWNED BY "persons"."id";
