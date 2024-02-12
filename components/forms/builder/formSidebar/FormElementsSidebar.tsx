import { FormElements } from "@/components/interfaces/FormElements";
import PickerBtn from "./PickerBtn";

export default function FormElementsSidebar() {
  return (
    <>
      Elements
      <PickerBtn formElement={FormElements.TextField} />
    </>
  );
}
