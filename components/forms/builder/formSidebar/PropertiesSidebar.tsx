import {
  FormElementInstance,
  FormElements,
} from "@/components/interfaces/FormElements";
import useDragDrop from "../../hooks/useDragDrop";
import { Button } from "@/components/ui/button";
import { AiOutlineClose } from "react-icons/ai";
import { Separator } from "@radix-ui/react-separator";

export default function PropertiesSidebar() {
  const { selectedElement, setSelectedElement } = useDragDrop();
  if (!selectedElement) return null;

  const PropertiesForm =
    FormElements[selectedElement?.input_type].propertiesComponent;

  return (
    <div className="flex flex-col p-2">
      <div className="flex justify-between items-center">
        <p className="text-sm text-foreground/70">Element properties</p>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => {
            setSelectedElement(null);
          }}
        >
          <AiOutlineClose />
        </Button>
      </div>
      <Separator className="mb-4" />
      <PropertiesForm elementInstance={selectedElement} />
    </div>
  );
}
