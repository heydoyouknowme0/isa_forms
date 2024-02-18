"use client";

import { form_questions, forms } from "@prisma/client";
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
import { Switch } from "@/components/ui/switch";
import useDragDrop from "../hooks/useDragDrop";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { idGenerator } from "@/lib/idGenerator";
import { FormElementInstance } from "@/components/interfaces/FormElements";

function FormBuilder({
  form,
  questions,
}: {
  form: forms;
  questions: form_questions[];
}) {
  const { setIsQuiz, is_quiz, setElements, setPages } = useDragDrop();
  useEffect(() => {
    setIsQuiz(form.is_quiz);
    if (questions.length === 0) return;
    let groupedQuestions: FormElementInstance[][] = [];
    questions.sort((a, b) => a.page_number - b.page_number);

    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      let page = ~~question.page_number;

      if (!groupedQuestions[page]) {
        groupedQuestions[page] = [];
      }

      const questionWithId = { ...question, Id: idGenerator() };
      //TODO: fix types
      groupedQuestions[page].push(questionWithId);
    }
    setPages(groupedQuestions.length);
    setElements(groupedQuestions);
  }, []);
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
        <div className="flex justify-between border-b-2 p-4 gap-3 items-center flex-col md:flex-row">
          <h2 className="truncate font-medium">
            <span className="text-muted-foreground mr-2">Form:</span>
            {form.title}
          </h2>
          <div className="flex items-center gap-2 flex-wrap ">
            <div>
              <Switch
                id={"switch"}
                checked={is_quiz}
                onCheckedChange={(checked) => {
                  setIsQuiz(checked);
                }}
              />
              <Label htmlFor="switch">Quiz</Label>
            </div>
            <PreviewDialogBtn />
            {!form.is_published && (
              <>
                <SaveFormBtn id={form.id} />
                <PublishFormBtn form={form} />
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
