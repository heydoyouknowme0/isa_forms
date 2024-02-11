import {
  ElementsType,
  FormElementInstance,
  FormElements,
} from "@/components/interfaces/FormElements";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import useDragDrop from "../hooks/useDragDrop";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BiSolidTrash } from "react-icons/bi";

export default function FormPageDropable({ page }: { page: number }) {
  const { elements } = useDragDrop();
  const droppable = useDroppable({
    id: `form-droppable-${page}`,
    data: {
      isFormDropArea: true,
      page,
    },
  });

  return (
    <div
      ref={droppable.setNodeRef}
      className={cn(
        "bg-background max-w-[920px] h-[50%] m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto mt-4",
        droppable.isOver && "ring-4 ring-primary ring-inset"
      )}
    >
      <p className="text-right">{page}</p>
      {!droppable.isOver &&
        (!elements[page] || elements[page].length === 0) && (
          <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">
            Drop herefix
          </p>
        )}

      {droppable.isOver && (
        <div className="p-4 w-full">
          <div className="h-[120px] rounded-md bg-primary/20"></div>
        </div>
      )}
      {elements[page] && elements[page].length > 0 && (
        <div className="flex flex-col  w-full gap-2 p-4">
          {elements[page].map((element) => (
            <DroppedElement element={element} key={element.id} />
          ))}
        </div>
      )}
    </div>
  );
}

function DroppedElement({ element }: { element: FormElementInstance }) {
  const { removeElement } = useDragDrop();
  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);
  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.input_type,
      page: element.page_number,
      isTopHalfDragDrop: true,
    },
  });
  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.input_type,
      page: element.page_number,
      isBottomHalfDragDrop: true,
    },
  });
  const Element = FormElements[element.input_type].uiFieldComponent;
  return (
    <div
      className="relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <div
        ref={topHalf.setNodeRef}
        className="absolute w-full h-1/2 rounded-t-md"
      />
      <div
        ref={bottomHalf.setNodeRef}
        className="absolute  w-full bottom-0 h-1/2 rounded-b-md"
      />
      {mouseIsOver && (
        <>
          <div className="absolute right-0 h-full">
            <Button
              className="flex justify-center h-full border rounded-md rounded-l-none bg-red-500"
              variant={"outline"}
              onClick={(e) => {
                e.stopPropagation(); // avoid selection of element while deleting
                removeElement(element.id, element.page_number);
              }}
            >
              <BiSolidTrash className="h-6 w-6" />
            </Button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <p className="text-muted-foreground text-sm">
              Click for properties or drag to move
            </p>
          </div>
        </>
      )}
      <div className="flex w-full h-[120px] items-center rounded-md bg-accent/40 py-4 px-2 pointer-events-none">
        <Element elementInstance={element} />
      </div>
    </div>
  );
}
