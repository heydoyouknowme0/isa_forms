"use client";

import { forms } from "@prisma/client";
import PreviewDialogBtn from "./buttons/PreviewDialogBtn";
import SaveFormBtn from "./buttons/SaveFormBtn";
import PublishFormBtn from "./buttons/PublishFormBtn";
import FormEditArea from "./FormEditArea";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DragOverlayWrapper from "./DragOverlayWrapper";

function FormBuilder({ form }: { form: forms }) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10, // 10px
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);
  return (
    <DndContext id={"unique-dnd-id"} sensors={sensors}>
      <main className="flex flex-col h-[100vh] w-full ">
        <div className="flex justify-between border-b-2 p-4 gap-3 items-center">
          <h2 className="truncate font-medium">
            <span className="text-muted-foreground mr-2">Form:</span>
            {form.title}
          </h2>
          <div className="flex items-center gap-2">
            <PreviewDialogBtn />
            {!form.is_published && (
              <>
                <SaveFormBtn id={form.id} />
                <PublishFormBtn id={form.id} />
              </>
            )}
          </div>
        </div>
        <div className="flex w-full grow items-center justify-center relative overflow-y-auto h-[200px] bg-muted">
          <FormEditArea />
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  );
}
export default FormBuilder;
