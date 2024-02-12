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

  updateElement: (
    id: string,
    page: number,
    element: FormElementInstance
  ) => void;
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

  const addElement = (
    index: number,
    page: number,
    element: FormElementInstance
  ) => {
    setElements((prev) => {
      const newElements = [...prev];
      newElements[page] = [...prev[page]];
      newElements[page].splice(index, 0, element);
      return newElements;
    });
  };
  const removeElement = (id: string, page: number) => {
    console.log("removing", id, "from", page);
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

  const updateElement = (
    id: string,
    page: number,
    element: FormElementInstance
  ) => {
    setElements((prev) => {
      const newElements = [...prev];
      const index = newElements[page].findIndex((el) => el.id === id);
      newElements[page][index] = element;
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
        updateElement,
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
}
