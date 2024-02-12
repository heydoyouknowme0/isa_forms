import useDragDrop from "../../hooks/useDragDrop";
import FormElementsSidebar from "./FormElementsSidebar";
import PropertiesSidebar from "./PropertiesSidebar";

export default function FormElementPicker() {
  const { selectedElement } = useDragDrop();
  return (
    <aside className="w-[400px] max-w-[400px] flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full">
      {selectedElement ? <PropertiesSidebar /> : <FormElementsSidebar />}
    </aside>
  );
}
