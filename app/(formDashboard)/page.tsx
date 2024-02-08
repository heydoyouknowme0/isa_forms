import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import CreateFormBtn from "@/components/create-form/CreateFormBtn";

export default function Home() {
  return (
    <div className="container pt-4">
      <CreateFormBtn />
    </div>
  );
}
