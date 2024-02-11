"use client";

import { FormElementInstance } from "@/components/interfaces/FormElements";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useState,
} from "react";

type DragDropContextType = {
  elements: FormElementInstance[][];
  addElement: (
    index: number,
    page: number,
    element: FormElementInstance
  ) => void;
  removeElement: (id: string, page: number) => void;
  pages: number;
  addPage: () => void;
  removePage: () => void;

  selectedElement: FormElementInstance | null;
  setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>;
};

export const DragDropContext = createContext<DragDropContextType | null>(null);

export default function DragDropContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [elements, setElements] = useState<FormElementInstance[][]>([[]]);
  const [pages, setPages] = useState<number>(1);
  const [selectedElement, setSelectedElement] =
    useState<FormElementInstance | null>(null);

  const addElement = useCallback(
    (index: number, page: number, element: FormElementInstance) => {
      setElements((prev) => {
        const newElements = [...prev];
        newElements[page] = [...prev[page]];
        newElements[page].splice(index, 0, element);
        return newElements;
      });
    },
    []
  );

  const removeElement = (id: string, page: number) => {
    setElements((prev) => {
      const newElements = [...prev];
      newElements[page] = prev[page].filter((element) => element.id !== id);
      return newElements;
    });
  };

  const addPage = () => {
    setPages((prev) => prev + 1);
    setElements((prev) => {
      return [...prev, []];
    });
  };
  const removePage = () => {
    setPages((prev) => prev - 1);
    setElements((prev) => {
      const newElements = [...prev];
      newElements.pop();
      return newElements;
    });
  };

  return (
    <DragDropContext.Provider
      value={{
        elements,
        addElement,
        removeElement,
        pages,
        addPage,
        removePage,
        selectedElement,
        setSelectedElement,
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
}
