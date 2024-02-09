"use server";
import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";
import { number } from "zod";

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
