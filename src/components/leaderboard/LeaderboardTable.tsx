import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import type { User } from "@/lib/definitions";
import { Trophy } from "lucide-react";

type LeaderboardTableProps = {
  users: User[];
};

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
  if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />;
  if (rank === 3) return <Trophy className="h-5 w-5 text-yellow-700" />;
  return <span className="font-mono">{rank}</span>;
}

export function LeaderboardTable({ users }: LeaderboardTableProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px] text-center">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell className="text-center font-medium">
                <div className="flex justify-center items-center">
                    <RankIcon rank={index + 1} />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="font-medium text-foreground">{user.name}</div>
                </div>
              </TableCell>
              <TableCell className="text-right font-mono text-foreground">{user.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
