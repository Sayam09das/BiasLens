import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function StatSkeleton() {
  return (
    <Card className="rounded-[1.75rem] border-[#E7E7E9] bg-white/90 shadow-[0_20px_50px_rgba(13,12,34,0.06)]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="h-10 w-20 rounded-2xl" />
            <Skeleton className="h-4 w-32 rounded-full" />
          </div>
          <Skeleton className="h-12 w-12 rounded-2xl" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatSkeleton key={index} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <Card className="rounded-[1.9rem] border-[#E7E7E9] bg-white/92 shadow-[0_24px_64px_rgba(13,12,34,0.06)]">
          <CardContent className="space-y-6 p-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-56 rounded-full" />
              <Skeleton className="h-4 w-72 rounded-full" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-48 rounded-full" />
                      <Skeleton className="h-4 w-32 rounded-full" />
                    </div>
                    <div className="flex gap-3">
                      <Skeleton className="h-9 w-24 rounded-full" />
                      <Skeleton className="h-9 w-24 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="overflow-hidden rounded-[1.9rem] border-[#DBEAFE] bg-[linear-gradient(180deg,#EFF6FF_0%,#FFFFFF_100%)]">
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-4 w-40 rounded-full bg-white/80" />
              <Skeleton className="h-8 w-full rounded-2xl bg-white/85" />
              <Skeleton className="h-4 w-5/6 rounded-full bg-white/80" />
              <Skeleton className="h-11 w-36 rounded-full bg-white/85" />
            </CardContent>
          </Card>

          <Card className="rounded-[1.9rem] border-[#E7E7E9] bg-white/92">
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-6 w-40 rounded-full" />
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4"
                >
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-2xl" />
                    <div className="w-full space-y-2">
                      <Skeleton className="h-4 w-11/12 rounded-full" />
                      <Skeleton className="h-4 w-8/12 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
