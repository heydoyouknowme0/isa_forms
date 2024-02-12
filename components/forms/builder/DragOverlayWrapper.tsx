import {
  ElementsType,
  FormElements,
} from "@/components/interfaces/FormElements";
import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import { useState } from "react";
import { PickerBtnDragOverlay } from "./formSidebar/PickerBtn";
import useDragDrop from "../hooks/useDragDrop";

export default function DragOverlayWrapper() {
  const { elements } = useDragDrop();
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);

  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
  });

  if (!draggedItem) return null;

  let node = <div>No drag overlay</div>;
  const isSidebarBtnElement = draggedItem.data?.current?.isDragBtn;
  if (isSidebarBtnElement) {
    const type = draggedItem.data?.current?.type as ElementsType;
    node = <PickerBtnDragOverlay formElement={FormElements[type]} />;
  }

  const isDragDropElement = draggedItem.data?.current?.isDragDropElement;

  if (isDragDropElement) {
    const elementId = draggedItem.data?.current?.elementId;
    const page = draggedItem.data?.current?.page;
    const element = elements[page].find((el) => el.id === elementId);
    if (!element) node = <div>Element not found!</div>;
    else {
      const DragDrapElementComponent =
        FormElements[element.input_type].uiFieldComponent;
      node = (
        <div className="flex bg-accent border rounded-md h-[120px] w-full py-2 px-4 opacity-80 pointer pointer-events-none">
          <DragDrapElementComponent elementInstance={element} />
        </div>
      );
    }
  }
  return <DragOverlay>{node}</DragOverlay>;
}
