"use client";

import { NameField } from "@/components/inputs/name";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "@/components/interfaces/FormElements";
import { MdTextFields } from "react-icons/md";

const input_type: ElementsType = "TextField";

export const TextFieldFormElement: FormElement = {
  input_type,
  uiFieldComponent: ({
    elementInstance,
  }: {
    elementInstance: FormElementInstance;
  }) => (
    <>
      <NameField
        className="w-full"
        readOnly
        label={elementInstance.question}
        required={elementInstance.is_required}
      />
      <p>{elementInstance.description}</p>
    </>
  ),
  formComponent: () => <NameField />,
  propertiesComponent: () => <div>propertiesComponent</div>,
  construct: (id: string, page_number: number) => {
    return {
      id,
      question: "Text Field",
      input_type,
      is_required: false,
      page_number,
      marks: 0,
    };
  },
  dragBtnElement: {
    icon: MdTextFields,
    label: "Text Field",
  },
};
