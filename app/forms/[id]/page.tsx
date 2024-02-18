import { getFormForSubmission } from "@/actions/forms.actions";

async function page({ params }: { params: { id: string } }) {
  const { id } = params;
  const data = await getFormForSubmission(Number(params.id));

  return <> {data} </>;
}
export default page;
