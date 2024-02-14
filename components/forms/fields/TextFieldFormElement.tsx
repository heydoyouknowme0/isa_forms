"use client";

import { NameField } from "@/components/inputs/name";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "@/components/interfaces/FormElements";
import { MdTextFields } from "react-icons/md";
import useDragDrop from "../hooks/useDragDrop";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

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
      <p className="text-muted-foreground text-sm w-full">
        {elementInstance.description}
      </p>
    </>
  ),
  formComponent: () => <NameField />,
  propertiesComponent: PropertiesComponent,
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
const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  description: z.string().max(200).optional(),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50),
  marks: z.number().nonnegative().default(0),
});
type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const { updateElement, is_quiz } = useDragDrop();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      label: elementInstance.question,
      description: elementInstance.description || "",
      required: elementInstance.is_required,
      placeHolder: "",
      marks: elementInstance.marks,
    },
  });
  useEffect(() => {
    form.reset({
      label: elementInstance.question,
      description: elementInstance.description,
      required: elementInstance.is_required,
      placeHolder: "",
      marks: elementInstance.marks,
    });
  }, [elementInstance, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { label, description, required } = values;
    updateElement(elementInstance.id, elementInstance.page_number, {
      ...elementInstance,
      question: label,
      description,
      is_required: required,
    });
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The label of the field. <br /> It will be displayed above the
                field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PlaceHolder</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>The placeholder of the field.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The helper text of the field. <br />
                It will be displayed below the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>
                <FormDescription>
                  The helper text of the field. <br />
                  It will be displayed below the field.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {is_quiz ? (
          <FormField
            control={form.control}
            name="marks"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Marks</FormLabel>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                    }}
                    type="number"
                    min={0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          ""
        )}
      </form>
    </Form>
  );
}
