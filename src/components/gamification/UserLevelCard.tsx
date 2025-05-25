
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Sparkles } from "lucide-react";
import gamificationService, {
  type UserPoints,
} from "../../services/gamificationService";

interface UserLevel {
  level: number;
  title: string;
  min_points: number;
  max_points: number;
}

interface UserLevelCardProps {
  userId: string;
  showDetails?: boolean;
}

export function UserLevelCard({
  userId,
  showDetails = true,
}: UserLevelCardProps) {
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [levelInfo, setLevelInfo] = useState<UserLevel | null>(null);
  const [nextLevelInfo, setNextLevelInfo] = useState<UserLevel | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [pointsToNextLevel, setPointsToNextLevel] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const points = await gamificationService.getUserPoints(userId);
        if (!points) return;

        setUserPoints(points);

        // Create mock level info since getUserLevels doesn't exist
        const currentLevel = points.current_level;
        const currentLevelInfo: UserLevel = {
          level: currentLevel,
          title: `Level ${currentLevel}`,
          min_points: (currentLevel - 1) * 100,
          max_points: currentLevel * 100
        };
        
        setLevelInfo(currentLevelInfo);

        // Create next level info
        const nextLevel: UserLevel = {
          level: currentLevel + 1,
          title: `Level ${currentLevel + 1}`,
          min_points: currentLevel * 100,
          max_points: (currentLevel + 1) * 100
        };
        
        if (points.points_to_next_level > 0) {
          setNextLevelInfo(nextLevel);
          
          // Calculate progress to next level
          const pointsInCurrentLevel = points.total_points - currentLevelInfo.min_points;
          const pointsRequiredForNextLevel = nextLevel.min_points - currentLevelInfo.min_points;
          const calculatedProgress = Math.round(
            (pointsInCurrentLevel / pointsRequiredForNextLevel) * 100
          );
          setProgress(calculatedProgress);
          setPointsToNextLevel(points.points_to_next_level);
        } else {
          // Max level reached
          setProgress(100);
          setPointsToNextLevel(0);
        }
      } catch (error) {
        console.error("Error fetching level data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="h-24 flex items-center justify-center">
            <p className="text-muted-foreground">
              Loading level information...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userPoints || !levelInfo) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="h-24 flex items-center justify-center">
            <p className="text-muted-foreground">
              No level information available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Level {levelInfo.level}</CardTitle>
          <Badge variant="outline" className="flex gap-1 items-center">
            <Sparkles className="h-3 w-3" />
            <span>{userPoints.total_points} Points</span>
          </Badge>
        </div>
        <CardDescription>{levelInfo.title}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>
                Progress to Level {nextLevelInfo ? nextLevelInfo.level : "MAX"}
              </span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {showDetails && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Current Level</p>
                <p className="font-medium">{levelInfo.title}</p>
              </div>
              {nextLevelInfo && (
                <div>
                  <p className="text-muted-foreground">Next Level</p>
                  <p className="font-medium">{nextLevelInfo.title}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      {nextLevelInfo && (
        <CardFooter className="pt-0">
          <p className="text-sm text-muted-foreground">
            {pointsToNextLevel} more points needed for Level{" "}
            {nextLevelInfo.level}
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
