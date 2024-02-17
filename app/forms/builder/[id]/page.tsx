import { getFormById, getFormByIdWithQuestions } from "@/actions/forms.actions";
import FormBuilder from "@/components/forms/builder/FormBuilder";

async function BuilderPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const formWithQuestions = await getFormByIdWithQuestions(Number(params.id));
  if (!formWithQuestions) return <div>Form not found</div>;
  const { form_questions, ...form } = formWithQuestions;
  return <FormBuilder form={form} questions={form_questions} />;
}
export default BuilderPage;
