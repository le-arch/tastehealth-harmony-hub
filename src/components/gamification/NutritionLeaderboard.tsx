
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url?: string;
  points: number;
  level: number;
  rank?: number;
}

export default function NutritionLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);

        // First check if user is logged in
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          setCurrentUserId(userData.user.id);
        }

        // Fetch leaderboard data
        const { data, error } = await supabase
          .from("user_points")
          .select(`
            user_id,
            total_points,
            current_level,
            profiles:user_id (username, avatar_url)
          `)
          .order("total_points", { ascending: false })
          .limit(10);

        if (error) throw error;

        if (data) {
          // Format the leaderboard data with ranks
          const formattedData: LeaderboardEntry[] = data.map((entry, index) => ({
            user_id: entry.user_id,
            username: entry.profiles?.username || `User ${entry.user_id.slice(0, 4)}`,
            avatar_url: entry.profiles?.avatar_url,
            points: entry.total_points,
            level: entry.current_level,
            rank: index + 1,
          }));

          setLeaderboard(formattedData);

          // Find current user's rank
          if (currentUserId) {
            const userEntry = formattedData.find(
              (entry) => entry.user_id === currentUserId
            );
            if (userEntry) {
              setUserRank(userEntry.rank || null);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [currentUserId]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Nutrition Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No leaderboard data available yet.
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((entry) => (
              <div
                key={entry.user_id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  entry.user_id === currentUserId
                    ? "bg-primary/10 border border-primary/30"
                    : "bg-gray-50 dark:bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {entry.rank && entry.rank <= 3 ? (
                      <div
                        className={`absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center 
                        ${
                          entry.rank === 1
                            ? "bg-yellow-500"
                            : entry.rank === 2
                            ? "bg-gray-300"
                            : "bg-amber-700"
                        }`}
                      >
                        <Medal className="h-3 w-3 text-white" />
                      </div>
                    ) : (
                      <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                        {entry.rank}
                      </div>
                    )}
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage
                        src={entry.avatar_url || ""}
                        alt={entry.username}
                      />
                      <AvatarFallback className="bg-gray-200">
                        <User className="h-5 w-5 text-gray-500" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {entry.username}{" "}
                      {entry.user_id === currentUserId && (
                        <span className="text-xs text-primary">(You)</span>
                      )}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-2">Level {entry.level}</span>
                      <span>{entry.points} points</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
