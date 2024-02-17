"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { finalFormSchema } from "@/schemas/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FaSpinner } from "react-icons/fa";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useFormStatus } from "react-dom";
import { forms } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import useDragDrop from "../hooks/useDragDrop";
import { PublishForm } from "@/actions/forms.actions";
import { useTransition } from "react";

export default function FormPublishForm({ sForm }: { sForm: forms }) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const { elements, is_quiz } = useDragDrop();
  const form = useForm<z.infer<typeof finalFormSchema>>({
    resolver: zodResolver(finalFormSchema),
    defaultValues: {
      title: sForm.title,
      description: sForm.description,
      on_submit_message: sForm.on_submit_message,
      is_editing_allowed: sForm.is_editing_allowed,
      is_single_response: sForm.is_single_response,
      is_shuffled: sForm.is_shuffled,
      is_view_analytics_allowed: sForm.is_view_analytics_allowed,
    },
    mode: "onSubmit",
  });
  async function publishForm(formData: z.infer<typeof finalFormSchema>) {
    try {
      console.log("Form data", formData);
      const validatedFields = finalFormSchema.safeParse(formData);
      if (!validatedFields.success) {
        throw new Error("Invalid form data");
      }

      const newElements = elements.flat();
      const elementsNoId = newElements.map(({ Id, ...rest }) => rest);

      await PublishForm(
        { ...validatedFields.data, is_quiz },
        sForm.id,
        elementsNoId
      );
      toast({
        title: "Success",
        description: "Your form is now available to the public",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(publishForm)}
        className="w-[36rem] text-foreground space-y-2"
      >
        <div className="flex">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-[50%] pr-4">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Form Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-[50%]">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide a short description of the form"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex ">
          <FormField
            control={form.control}
            name="on_submit_message"
            render={({ field }) => (
              <FormItem className="w-[50%] pr-4">
                <FormLabel>Submit Message</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expiry_date"
            render={({ field }) => (
              <FormItem className="w-[50%]">
                <FormLabel>Expiry Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[250]" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date: Date) => date < new Date()}
                      className="z-[250]"
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex">
          <div className="w-[50%]">
            <FormField
              control={form.control}
              name="is_editing_allowed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between py-3 pr-3">
                  <FormLabel className="mr-2 mt-2">Can be Edited</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_single_response"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between py-3 pr-3">
                  <FormLabel className="mr-2 mt-2">
                    Only single Response allowed
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="w-[50%]">
            <FormField
              control={form.control}
              name="is_shuffled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-3">
                  <FormLabel className="mr-2 mt-2">Shuffled</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_view_analytics_allowed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-3 ">
                  <FormLabel className="mr-2 mt-2">
                    Able to View Analytics
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button type="submit" disabled={loading}>
            Proceed {loading && <FaSpinner className="animate-spin" />}
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
}
