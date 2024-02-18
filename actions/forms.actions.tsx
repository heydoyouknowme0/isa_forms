"use server";
import FormEditNotAllowed from "@/components/forms/FormEditNotAllowed";
import FormExpired from "@/components/forms/FormExpired";
import FormNotFound from "@/components/forms/FormNotFound";
import FormSingleResponse from "@/components/forms/FormSingleResponse";
import FormSubmitForm from "@/components/forms/FormSubmitForm";
import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";
import { form_questions, forms } from "@prisma/client";
import { revalidatePath } from "next/cache";

//TODO
async function currentUser() {
  return { id: 1, institute_email: "akr@gmail.com" };
}
class UserNotFoundErr extends Error {}

// All forms analytics
// export async function getFormStats() {
//   const user = await currentUser();
//   if (!currentUser) console.log("User not logged in");
//   const stats = await prisma.forms.aggregate({
//     where: {
//       userId: user.id,
//     },
//     _sum: {
//       visits: true,
//       submissions: true,
//     },
//   });

//   const visits = stats._sum.visits || 0;
//   const submissions = stats._sum.submissions || 0;

//   const submissionRate = visits ? (submissions / visits) * 100 : 0;
//   const bounceRate = 100 - submissionRate;

//   return {
//     visits,
//     submissions,
//     submissionRate,
//     bounceRate,
//   };
// }
export async function CreateForm(values: formSchemaType) {
  const validation = formSchema.safeParse(values);
  if (!validation.success) {
    throw new Error("Invalid form data");
  }
  const user = await currentUser();

  if (!user) throw new UserNotFoundErr();

  try {
    const form = await prisma.forms.create({
      data: {
        title: values.title,
        description: values.description || "",
        is_editing_allowed: values.isEditable,
        modifiable_by: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    revalidatePath("/forms");
    return form.id;
  } catch (e) {
    throw new Error("something went wrong");
  }
}

export async function getForms() {
  const user = await currentUser();
  if (!user) throw new UserNotFoundErr();

  return prisma.forms.findMany({
    where: {
      modifiable_by: {
        some: {
          id: user.id,
        },
      },
    },
  });
}

export async function getFormById(id: number) {
  const user = await currentUser();
  if (!user) throw new UserNotFoundErr();

  return prisma.forms.findUnique({
    where: {
      id,
      modifiable_by: {
        some: {
          id: user.id,
        },
      },
    },
  });
}
type new_form_questions = Omit<form_questions, "form_id"> & {
  Id: string;
};

export async function UpdateFormQuestions(
  form_id: number,
  questions: new_form_questions[]
) {
  const user = await currentUser();
  if (!user) throw new UserNotFoundErr();
  const upsertOperations = questions.map(async (question, index) => {
    const { id, Id, page_number, ...rest } = question;
    const page_number_with_index = page_number + index * 0.001;
    if (!id)
      return prisma.form_questions.create({
        data: {
          ...rest,
          form_id,
          page_number: page_number_with_index,
        },
      });
    else {
      return prisma.form_questions.upsert({
        where: {
          id,
        },
        update: rest,
        create: {
          ...rest,
          form_id: id,
          page_number: page_number_with_index,
        },
      });
    }
  });

  await Promise.all(upsertOperations);
}

type formSum = Omit<
  forms,
  | "id"
  | "is_published"
  | "questions"
  | "is_active"
  | "persistent_url"
  | "old_persistent_urls"
>;
export async function PublishForm(
  form: formSum,
  id: number,
  questions: new_form_questions[]
) {
  const newForm = {
    ...form,
    is_published: true,
    id,
  };
  await UpdateFormQuestions(id, questions);
  return prisma.forms.update({
    where: {
      id,
    },
    data: newForm,
  });
}

export async function getFormByIdWithQuestions(id: number) {
  const user = await currentUser();
  if (!user) throw new UserNotFoundErr();
  return prisma.forms.findUnique({
    where: {
      id,
      modifiable_by: {
        some: {
          id: user.id,
        },
      },
    },
    include: {
      form_questions: true,
    },
  });
}
export async function getFormForSubmission(id: number) {
  const user = await currentUser();
  if (!user) throw new UserNotFoundErr();
  const form = await prisma.forms.findUnique({
    where: {
      id,
      modifiable_by: {
        some: {
          id: user.id,
        },
      },
    },
    include: {
      form_questions: true,
    },
  });
  if (!form || !form.is_published) return <FormNotFound />;
  if (!form.is_active) return <FormExpired />;
  if (form.expiry_date && form.expiry_date < new Date()) {
    await prisma.forms.update({
      where: {
        id,
      },
      data: {
        is_active: false,
      },
    });
    return <FormExpired />;
  }
  const response = await prisma.form_submissions.findFirst({
    where: {
      form_id: id,
      email: user.institute_email,
    },
  });
  if (!form.is_single_response && response) return <FormSingleResponse />;
  if (!form.is_editing_allowed && response) return <FormEditNotAllowed />;
  if (form.is_shuffled) {
    form.form_questions = form.form_questions.sort(() => Math.random() - 0.5);
    form.form_questions = form.form_questions.map((question) => {
      question.page_number = question.page_number / 1;
      return question;
    });
  } else {
    form.form_questions = form.form_questions.sort(
      (a, b) => a.page_number - b.page_number
    );
  }

  return (
    <FormSubmitForm
      form={{
        id: form.id,
        title: form.title,
        description: form.description || undefined,
        on_submit_message: form.on_submit_message,
      }}
      questions={form.form_questions}
    />
  );
}
