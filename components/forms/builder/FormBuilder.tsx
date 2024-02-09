"use client";

import { forms } from "@prisma/client";
import PreviewDialogBtn from "./buttons/PreviewDialogBtn";
import SaveFormBtn from "./buttons/SaveFormBtn";
import PublishFormBtn from "./buttons/PublishFormBtn";

function FormBuilder({ form }: { form: forms }) {
  return (
    <main className="flex flex-col w-full">
      <div className="flex justify-between border-b-2 p-4 gap-3 items-center">
        <h2 className="truncate font-medium">
          <span className="text-muted-foreground mr-2">Form:</span>
          {form.title}
        </h2>
        <div className="flex items-center gap-2">
          <PreviewDialogBtn />
          {!form.is_published && (
            <>
              <SaveFormBtn id={form.id} />
              <PublishFormBtn id={form.id} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
export default FormBuilder;
