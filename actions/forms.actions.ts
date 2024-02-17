"use server";
import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";
import { form_questions, forms } from "@prisma/client";

//TODO
async function currentUser() {
  return { id: 1 };
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
  const upsertOperations = questions.map(async (question) => {
    const { id, Id, ...rest } = question;
    if (!id)
      return prisma.form_questions.create({
        data: {
          ...rest,
          form_id,
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
