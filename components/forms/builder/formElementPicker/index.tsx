import { FormElements } from "@/components/interfaces/FormElements";
import PickerBtn from "./PickerBtn";

export default function FormElementPicker() {
  return (
    <aside className="w-[400px] max-w-[400px] flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full">
      Elements
      <PickerBtn formElement={FormElements.TextField} />
    </aside>
  );
}
