
'use client';

import { useMemo } from 'react';
import VotableList from "@/components/votables/VotableList";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateVotableDialog } from "@/components/votables/CreateVotableDialog";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { getVotablesQuery, getVotesQuery } from '@/lib/queries';
import type { Votable, Vote } from '@/lib/definitions';

export default function DashboardPage() {
  const firestore = useFirestore();
  const votablesQuery = useMemoFirebase(() => getVotablesQuery(), [firestore]);
  const votesQuery = useMemoFirebase(() => getVotesQuery(), [firestore]);

  const { data: votables, isLoading: isLoadingVotables } = useCollection<Votable>(votablesQuery);
  const { data: votes, isLoading: isLoadingVotes } = useCollection<Vote>(votesQuery);

  const votablesWithVotes = useMemo(() => {
    if (!votables || !votes) return [];
    
    const votesByVotableId = votes.reduce((acc, vote) => {
      if (!acc[vote.votableId]) {
        acc[vote.votableId] = [];
      }
      acc[vote.votableId].push(vote);
      return acc;
    }, {} as Record<string, Vote[]>);

    return votables.map(votable => ({
      ...votable,
      votes: votesByVotableId[votable.id] || [],
    })).sort((a, b) => (b.isSpecialEvent ? 1 : 0) - (a.isSpecialEvent ? 1 : 0));
  }, [votables, votes]);

  const isLoading = isLoadingVotables || isLoadingVotes;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Vote on predictions and see what others think.
          </p>
        </div>
        <CreateVotableDialog />
      </div>
      
      {isLoading ? (
        <VotableListSkeleton />
      ) : (
        <VotableList votables={votablesWithVotes} />
      )}
    </div>
  );
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
