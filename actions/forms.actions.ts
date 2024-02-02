"use server";
import prisma from "@/lib/prisma";
const currentUser = { id: "1" };

// All forms analytics
export async function getFormStats() {
  if (!currentUser) console.log("User not logged in");
  const stats = await prisma.form.aggregate({
    where: {
      userId: currentUser.id,
    },
    _sum: {
      visits: true,
      submissions: true,
    },
  });

  const visits = stats._sum.visits || 0;
  const submissions = stats._sum.submissions || 0;

  const submissionRate = visits ? (submissions / visits) * 100 : 0;
  const bounceRate = 100 - submissionRate;

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
}
