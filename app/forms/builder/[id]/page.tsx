import { getFormById } from "@/actions/forms.actions";
import FormBuilder from "@/components/forms/builder/FormBuilder";

async function BuilderPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const form = await getFormById(Number(params.id));
  if (!form) return <div>Form not found</div>;
  return <FormBuilder form={form} />;
}
export default BuilderPage;
