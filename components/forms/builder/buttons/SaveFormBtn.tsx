import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { HiSaveAs } from "react-icons/hi";

import { toast } from "@/components/ui/use-toast";
import { FaSpinner } from "react-icons/fa";
import useDragDrop from "../../hooks/useDragDrop";
import { UpdateFormQuestions } from "@/actions/forms.actions";

function SaveFormBtn({ id }: { id: number }) {
  const { elements } = useDragDrop();
  const [loading, startTransition] = useTransition();

  const updateFormContent = async () => {
    try {
      const newElements = elements.flat();
      const elementsNoId = newElements.map(({ id, ...rest }) => rest);
      await UpdateFormQuestions(id, elementsNoId);
      toast({
        title: "Success",
        description: "Your form has been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };
  return (
    <Button
      variant={"outline"}
      className="gap-2"
      aria-disabled={loading}
      onClick={() => {
        startTransition(updateFormContent);
      }}
    >
      <HiSaveAs className="h-4 w-4" />
      Save
      {loading && <FaSpinner className="animate-spin" />}
    </Button>
  );
}

export default SaveFormBtn;
