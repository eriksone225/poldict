
import { getVotables, getVotesForVotables } from "@/lib/data";
import VotableList from "@/components/votables/VotableList";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateVotableDialog } from "@/components/votables/CreateVotableDialog";

// This is now a Server Component
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Vote on predictions and see what others think.
          </p>
        </div>
        <div className="hidden md:block">
            <CreateVotableDialog />
        </div>
      </div>
      <Suspense fallback={<VotableListSkeleton />}>
        {/* VotableData is now directly awaited inside the Server Component */}
        <VotableData />
      </Suspense>
    </div>
  );
}

// VotableData remains an async function to fetch data on the server
async function VotableData() {
  const votables = await getVotables();
  const votableIds = votables.map(v => v.id);
  const votesByVotable = await getVotesForVotables(votableIds);

  const votablesWithVotes = votables.map(votable => ({
    ...votable,
    votes: votesByVotable[votable.id] || [],
  }));

  // VotableList is a Client Component that receives the fetched data as props
  return <VotableList votables={votablesWithVotes} />;
}

function VotableListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 border rounded-lg space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <div className="flex justify-between gap-2 pt-2">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
