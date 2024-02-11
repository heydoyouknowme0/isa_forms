import { Button } from "@/components/ui/button";
import useDragDrop from "../hooks/useDragDrop";
import FormElementPicker from "./formElementPicker";
import FormPageDropable from "./FormPageDropable";
import {
  ElementsType,
  FormElements,
} from "@/components/interfaces/FormElements";
import { useDndMonitor } from "@dnd-kit/core";
import { idGenerator } from "@/lib/idGenerator";

export default function FormEditArea() {
  const { pages, addPage, removePage, addElement } = useDragDrop();
  useDndMonitor({
    onDragEnd: (event) => {
      const { active, over } = event;
      if (!active || !over) return;
      const page = over.data?.current?.page;
      const isSidebarBtnElement = active.data?.current?.isDragBtn;
      if (isSidebarBtnElement && page !== undefined) {
        const type = active.data?.current?.type;
        const newElement =
          FormElements[type as ElementsType].construct(idGenerator());
        newElement.page_number = page;
        console.log(page);
        addElement(0, page, newElement);
      }
    },
  });
  return (
    <div className="flex h-full w-full">
      <div className="px-4 pb-4 w-full overflow-auto">
        {Array.from({ length: pages }, (_, index) => (
          <FormPageDropable key={index} page={index} />
        ))}
        <div className="max-w-[920px] rounded-xl flex justify-between items-center m-auto mt-4">
          <Button
            variant="outline"
            className="w-[50%]"
            onClick={() => addPage()}
          >
            Add Page
          </Button>
          <Button
            variant="outline"
            className="w-[50%]"
            onClick={() => removePage()}
            disabled={pages === 1}
          >
            Remove Page
          </Button>
        </div>
      </div>
      <FormElementPicker />
    </div>
  );
}
