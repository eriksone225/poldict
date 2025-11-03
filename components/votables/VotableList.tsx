import type { Votable, Vote } from "@/lib/definitions";
import { VotableCard } from "./VotableCard";

type VotableListProps = {
  votables: (Votable & { votes: Vote[] })[];
};

export default function VotableList({ votables }: VotableListProps) {
  if (votables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-20 text-center">
        <h2 className="text-xl font-semibold text-foreground">No Votables Yet</h2>
        <p className="mt-2 text-muted-foreground">Be the first to create a prediction!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {votables.map((votable) => (
        <VotableCard
          key={votable.id}
          votable={votable}
        />
      ))}
    </div>
  );
}
