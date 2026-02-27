
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { Star } from "lucide-react";
import { getLS, LS_KEYS } from "@/utils/localStorage";

interface UserLevelCardProps { userId: string; showDetails?: boolean; }

export function UserLevelCard({ userId, showDetails = true }: UserLevelCardProps) {
  const level = getLS<number>(LS_KEYS.LEVEL, 1);
  const points = getLS<number>(LS_KEYS.POINTS, 0);
  const nextLevel = Math.floor(100 * Math.pow(1.5, level - 1));
  const progress = Math.min(100, Math.round((points / nextLevel) * 100));

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <Star className="h-6 w-6 text-yellow-500" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-lg">Level {level}</span>
              <span className="text-sm text-muted-foreground">{points} pts</span>
            </div>
            {showDetails && (
              <>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{nextLevel - points} points to level {level + 1}</p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
