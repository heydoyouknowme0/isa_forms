import DragDropContextProvider from "@/components/forms/context/DragDropContext";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <DragDropContextProvider>
      <div className="flex w-full flex-grow mx-auto">{children}</div>
    </DragDropContextProvider>
  );
}

export default layout;
