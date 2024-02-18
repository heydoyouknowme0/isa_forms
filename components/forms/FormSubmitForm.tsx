"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { form_questions, forms } from "@prisma/client";
import {
  ElementsType,
  FormElementInstance,
  FormElements,
} from "../interfaces/FormElements";
import { NameField } from "../inputs/name";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import TextField from "../inputs/text";
interface FormSubmitFormProps {
  form: {
    id: number;
    title: string;
    description: string | undefined;
    on_submit_message: string;
  };
  questions: form_questions[];
}
export default function FormSubmitForm({
  form,
  questions,
}: FormSubmitFormProps) {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  let questionElements: FormElementInstance[][] = [];
  const schemaObject = questions.reduce((acc, question) => {
    let page = ~~question.page_number;
    if (!questionElements[page]) {
      questionElements[page] = [];
    }
    const questionElement = {
      ...question,
      Id: question.id.toString(),
      description: question.description || undefined, // to get around postgress and js behaviour of handling empty fields
      input_type: question.input_type as ElementsType,
    };
    questionElements[page].push(questionElement);
    return FormElements[questionElement.input_type].shouldValidate
      ? {
          ...acc,
          [questionElement.Id]: FormElements[
            questionElement.input_type
          ].schemaObject(question.is_required),
        }
      : acc;
  }, {});
  console.log(schemaObject);
  const FormDataSchema = z.object(schemaObject);

  type Inputs = z.infer<typeof FormDataSchema>;

  const delta = currentStep - previousStep;

  const forms = useForm<z.infer<typeof FormDataSchema>>({
    resolver: zodResolver(FormDataSchema),
    reValidateMode: "onBlur",
  });

  const processForm: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    forms.reset();
  };

  type FieldName = keyof Inputs;

  const next = async (e) => {
    e.preventDefault();
    const fields = questionElements[currentStep].map((question) => question.Id);
    const output = 0;
    console.log(fields);
    if (!output) return;

    if (currentStep < questionElements.length - 1) {
      if (currentStep === questionElements.length - 2) {
        await forms.handleSubmit(processForm)();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = (e) => {
    e.preventDefault();
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const fields = questionElements[currentStep].map((question) => question.Id);
    const partialSchema = FormDataSchema.pick(fields);

    console.log(partialSchema);
    const output = partialSchema.safeParse(data);
    console.log(fields);
    if (!output) return;
    console.log("submitted", data);
  }

  return (
    <div>
      <Form {...forms}>
        <form onSubmit={handleSubmit}>
          {questionElements[currentStep].map((question) => {
            const Element = FormElements[question.input_type].formComponent;
            return (
              <motion.div
                key={question.Id}
                initial={{ x: delta > 0 ? 100 : -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: delta > 0 ? -100 : 100, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FormField
                  control={forms.control}
                  name={question.Id as FieldName}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{question.question}</FormLabel>
                      <FormControl>
                        <TextField
                          placeholder="shadcn"
                          id={question.Id}
                          {...field}
                          defaultValue={""}
                        />
                      </FormControl>
                      <FormDescription>{question.description}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            );
          })}
          <div className="mt-8 pt-5">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prev}
                disabled={currentStep === 0}
                className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button
                type="submit"
                disabled={currentStep === questionElements.length - 1}
                className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
