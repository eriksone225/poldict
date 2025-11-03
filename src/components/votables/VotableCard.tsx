
'use client';

import { useTransition, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import type { Votable, Vote } from '@/lib/definitions';
import { deleteVotable, submitVote, resolveVotableAction } from '@/lib/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, Loader2, Trash2, X, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoteDialog } from './VoteDialog';
import { AdminActionDialog } from './AdminActionDialog';


type VotableCardProps = {
  votable: Votable & { votes: Vote[] };
};

export function VotableCard({ votable }: VotableCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isVoteDialogOpen, setVoteDialogOpen] = useState(false);
  const [voteType, setVoteType] = useState<'happened' | 'not_happened'>('happened');
  const [isAdminDialogOpen, setAdminDialogOpen] = useState(false);
  const [adminActionType, setAdminActionType] = useState<'resolve' | 'delete' | null>(null);
  const [resolveOutcome, setResolveOutcome] = useState<'happened' | 'not_happened'>('happened');

  const votesHappened = votable.votes.filter(v => v.prediction === 'happened').length;
  const votesNotHappened = votable.votes.filter(v => v.prediction === 'not_happened').length;
  const totalVotes = votesHappened + votesNotHappened;
  const happenedPercentage = totalVotes > 0 ? (votesHappened / totalVotes) * 100 : 50;
  
  const handleVoteClick = (prediction: 'happened' | 'not_happened') => {
    setVoteType(prediction);
    setVoteDialogOpen(true);
  };
  
  const handleVoteSubmit = (voterName: string) => {
    if (!voterName || voterName.trim().length < 2) {
      toast({ variant: 'destructive', title: 'Name required', description: 'You must enter a valid name to vote.'});
      return;
    }
    setVoteDialogOpen(false);
    startTransition(async () => {
      try {
        await submitVote(votable.id, voteType, voterName.trim());
        toast({
          title: 'Vote Submitted!',
          description: 'Your prediction has been recorded.',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Vote Failed',
          description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
      }
    });
  };

  const openAdminDialog = (action: 'resolve' | 'delete', outcome?: 'happened' | 'not_happened') => {
    setAdminActionType(action);
    if(action === 'resolve' && outcome) {
      setResolveOutcome(outcome);
    }
    setAdminDialogOpen(true);
  };

  const handleAdminAction = (name: string, passcode: string) => {
    setAdminDialogOpen(false);
    startTransition(async () => {
        if(adminActionType === 'delete') {
            try {
                await deleteVotable(votable.id, name, passcode);
                toast({ title: 'Votable Deleted' });
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Deletion Failed',
                    description: error instanceof Error ? error.message : 'An unknown error occurred.',
                });
            }
        } else if (adminActionType === 'resolve') {
            const result = await resolveVotableAction(votable.id, resolveOutcome, name, passcode);
            if (result?.message === 'success') {
                 toast({
                    title: 'Votable Resolved',
                    description: 'Points have been distributed based on the outcome.',
                });
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Resolution Failed',
                    description: result.message || 'An unknown error occurred.',
                });
            }
        }
    });
  };


  return (
    <>
      <Card className={cn(
          "flex flex-col",
          votable.isSpecialEvent && "border-primary/50 border-2 shadow-lg"
      )}>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-xl leading-snug">{votable.title}</CardTitle>
              {votable.isSpecialEvent && <Star className="h-6 w-6 text-primary shrink-0" />}
          </div>
          <CardDescription className="flex items-center pt-1">
              <span>Created by {votable.creatorName}</span>
          </CardDescription>
           {votable.description && <CardDescription className="pt-2">{votable.description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          {votable.status === 'open' && (
              <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-muted-foreground">
                      <span>Will Happen</span>
                      <span>{totalVotes > 0 ? `${Math.round(happenedPercentage)}%` : '50%'}</span>
                      <span>Won't Happen</span>
                  </div>
                  <Progress value={happenedPercentage} className="h-2" />
              </div>
          )}
          {votable.status === 'open' ? (
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleVoteClick('happened')}
                disabled={isPending}
                className="bg-success text-success-foreground hover:bg-success/90"
              >
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Will Happen
              </Button>
              <Button
                onClick={() => handleVoteClick('not_happened')}
                disabled={isPending}
                variant="destructive"
              >
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                Won't Happen
              </Button>
            </div>
          ) : (
             <div className="text-center font-semibold text-lg text-foreground pt-4">
              {votable.outcome === 'happened' ? "It Happened!" : "It Didn't Happen."}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
              {votable.status === 'open' ? (
                  <Badge variant="outline" className={cn(votable.isSpecialEvent && "border-primary/50 text-primary")}>Open</Badge>
              ) : (
                  <Badge variant="secondary">Closed</Badge>
              )}
               <Badge variant="secondary">{totalVotes} {totalVotes === 1 ? 'Vote' : 'Votes'}</Badge>
          </div>
          <div className="flex items-center gap-1">
              {votable.status === 'open' && (
                  <>
                  <Button size="sm" variant="ghost" onClick={() => openAdminDialog('resolve', 'happened')} disabled={isPending}>Resolve ✓</Button>
                  <Button size="sm" variant="ghost" onClick={() => openAdminDialog('resolve', 'not_happened')} disabled={isPending}>Resolve ✕</Button>
                  </>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" disabled={isPending} onClick={() => openAdminDialog('delete')}>
                    <Trash2 className="h-4 w-4" />
              </Button>
          </div>
        </CardFooter>
      </Card>
      
      <VoteDialog
        isOpen={isVoteDialogOpen}
        onOpenChange={setVoteDialogOpen}
        voteType={voteType}
        onSubmit={handleVoteSubmit}
        isSubmitting={isPending}
      />
      
      {adminActionType && (
        <AdminActionDialog
            isOpen={isAdminDialogOpen}
            onOpenChange={setAdminDialogOpen}
            actionType={adminActionType}
            onSubmit={handleAdminAction}
            isSubmitting={isPending}
        />
      )}
    </>
  );
}
