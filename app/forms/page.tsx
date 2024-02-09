import { getForms } from "@/actions/forms.actions";
import CreateFormBtn from "@/components/forms/CreateFormBtn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { forms } from "@prisma/client";
import Link from "next/link";
import { FaEdit, FaWpforms } from "react-icons/fa";
import { BiRightArrowAlt } from "react-icons/bi";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="container pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CreateFormBtn />
        <Suspense
          fallback={[1, 2, 3, 4].map((i) => (
            <FormCardSkeleton key={i} />
          ))}
        >
          <FormCards />
        </Suspense>
      </div>
    </div>
  );
}
function FormCardSkeleton() {
  return <Skeleton className="border-2 border-primary-/20 h-[170px] w-full" />;
}

async function FormCards() {
  const forms = await getForms();
  return forms.map((form) => <FormCard key={form.id} form={form} />);
}

function FormCard({ form }: { form: forms }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 justify-between">
          <span className="truncate font-bold">{form.title}</span>
          {form.is_published ? (
            <Badge>Published</Badge>
          ) : (
            <Badge variant={"destructive"}>Draft</Badge>
          )}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {form.is_active ? (
            form.is_published ? (
              <span>Form is up and Running</span>
            ) : (
              <span>Form not yet formed</span>
            )
          ) : (
            <span>Form expired</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {form.description || "No description"}
      </CardContent>
      <CardFooter>
        {form.is_published ? (
          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/forms/${form.id}`}>
              View submissions <BiRightArrowAlt />
            </Link>
          </Button>
        ) : (
          <Button
            asChild
            variant={"secondary"}
            className="w-full mt-2 text-md gap-4"
          >
            <Link href={`/forms/builder/${form.id}`}>
              Edit form <FaEdit />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
