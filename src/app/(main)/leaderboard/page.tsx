import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { getUsers } from "@/lib/data";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">
          See who is at the top of their prediction game.
        </p>
      </div>
      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardData />
      </Suspense>
    </div>
  );
}

async function LeaderboardData() {
  const users = await getUsers();
  return <LeaderboardTable users={users} />;
}

function LeaderboardSkeleton() {
  return (
    <div className="border rounded-lg">
      <div className="flex justify-between p-4 border-b">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-16" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border-b">
          <Skeleton className="h-6 w-8" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-6 w-12" />
        </div>
      ))}
    </div>
  )
}
