import { getFormByIdWithQuestions } from "@/actions/forms.actions";

async function page({ params }: { params: { id: string } }) {
  const { id } = params;
  const data = await getFormByIdWithQuestions(Number(params.id));
  console.log(data);
  return <div>page</div>;
}
export default page;
