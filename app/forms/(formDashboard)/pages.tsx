import { getFormStats } from "@/actions/forms.actions";

import { ReactNode, Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";

import { Separator } from "@/components/ui/separator";

import CreateFormBtn from "@/components/create-form/CreateFormBtn";
export default function Home() {
  return (
    <div className="container pt-4">
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
      <Separator className="my-6" />
      <h2 className="col-span-2 text-4xl font-bold">Your forms</h2>
      <Separator className="my-6" />
      <CreateFormBtn />
    </div>
  );
}

async function CardStatsWrapper() {
  const stats = await getFormStats();
  return <StatsCards loading={false} stats={stats} />;
}
interface StatsCardsProps {
  stats?: Awaited<ReturnType<typeof getFormStats>>;
  loading: boolean;
}

function StatsCards({ stats, loading }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 pt-8 w-full md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Visits"
        value={stats?.visits.toLocaleString() || ""}
        helperText="All time form visits"
        className="shadow-md shadow-blue-600"
        loading={loading}
        icon={<LuView className="text-blue-500" />}
      />
      <StatsCard
        title="Total Submissions"
        value={stats?.submissions.toLocaleString() || ""}
        helperText="All time form submissions"
        className="shadow-md shadow-yellow-600"
        loading={loading}
        icon={<FaWpforms className="text-yellow-500" />}
      />
      <StatsCard
        title="Submission Rate"
        value={stats?.submissionRate.toLocaleString() || ""}
        helperText="Visits that result in form submissions"
        className="shadow-md shadow-green-600"
        loading={loading}
        icon={<HiCursorClick className="text-green-500" />}
      />
      <StatsCard
        title="Bounce rate"
        value={stats?.bounceRate.toLocaleString() || ""}
        helperText="Visits that leave without submitting"
        className="shadow-md shadow-red-600"
        loading={loading}
        icon={<TbArrowBounce className="text-red-500" />}
      />
    </div>
  );
}

function StatsCard({
  title,
  value,
  helperText,
  className,
  loading,
  icon,
}: {
  title: string;
  value: string;
  helperText: string;
  className: string;
  loading: boolean;
  icon: ReactNode;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading && (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className="pt-1 text-xs text-muted-foreground">{helperText}</p>
      </CardContent>
    </Card>
  );
}
