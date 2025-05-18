"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Medal, Trophy, Crown, Users } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { supabase } from "@/integrations/supabase/client"

interface NutritionLeaderboardProps {
  userId?: string
}

interface LeaderboardEntry {
  user_id: string
  username: string
  avatar_url: string | null
  points: number
  level: number
  rank: number
}

const NutritionLeaderboard = ({ userId }: NutritionLeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null)
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "alltime">("weekly")
  const { language } = useLanguage()

  const translations = {
    en: {
      title: "Nutrition Leaderboard",
      weekly: "Weekly",
      monthly: "Monthly",
      allTime: "All Time",
      rank: "Rank",
      user: "User",
      level: "Level",
      points: "Points",
      yourRank: "Your Rank",
      loading: "Loading leaderboard...",
    },
    fr: {
      title: "Classement Nutritionnel",
      weekly: "Hebdomadaire",
      monthly: "Mensuel",
      allTime: "Tout Temps",
      rank: "Rang",
      user: "Utilisateur",
      level: "Niveau",
      points: "Points",
      yourRank: "Votre Rang",
      loading: "Chargement du classement...",
    },
  }

  const t = translations[language as keyof typeof translations] || translations.en

  // Load leaderboard data
  useEffect(() => {
    const loadLeaderboard = async () => {
      if (!userId) return

      try {
        let query = supabase
          .from("user_gamification")
          .select(
            `
            user_id,
            points,
            level,
            profiles:user_id (
              username,
              avatar_url
            )
          `,
          )
          .order("points", { ascending: false })
          .limit(100)

        // Apply timeframe filter
        if (timeframe === "weekly") {
          const oneWeekAgo = new Date()
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
          query = query.gte("last_updated", oneWeekAgo.toISOString())
        } else if (timeframe === "monthly") {
          const oneMonthAgo = new Date()
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
          query = query.gte("last_updated", oneMonthAgo.toISOString())
        }

        const { data, error } = await query

        if (error) throw error

        if (data) {
          // Process and format leaderboard data
          const formattedData: LeaderboardEntry[] = data.map((entry, index) => ({
            user_id: entry.user_id,
            username: entry.profiles?.username || `User ${entry.user_id.slice(0, 4)}`,
            avatar_url: entry.profiles?.avatar_url,
            points: entry.points,
            level: entry.level,
            rank: index + 1,
          }))

          setLeaderboard(formattedData)

          // Find current user's rank
          const currentUserRank = formattedData.find((entry) => entry.user_id === userId)
          setUserRank(currentUserRank || null)
        }
      } catch (error) {
        console.error("Error loading leaderboard:", error)
      }
    }

    loadLeaderboard()
  }, [userId, timeframe])

  // Get medal for top 3 ranks
  const getMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <Trophy className="h-5 w-5 mr-2 text-amber-500" />
          {t.title}
        </CardTitle>
        <div className="flex space-x-2 mt-2">
          <button
            onClick={() => setTimeframe("weekly")}
            className={`px-3 py-1 text-sm rounded-full ${
              timeframe === "weekly"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {t.weekly}
          </button>
          <button
            onClick={() => setTimeframe("monthly")}
            className={`px-3 py-1 text-sm rounded-full ${
              timeframe === "monthly"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {t.monthly}
          </button>
          <button
            onClick={() => setTimeframe("alltime")}
            className={`px-3 py-1 text-sm rounded-full ${
              timeframe === "alltime"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {t.allTime}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p>{t.loading}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 border-b">
                    <th className="font-medium text-left py-2 w-16">{t.rank}</th>
                    <th className="font-medium text-left py-2">{t.user}</th>
                    <th className="font-medium text-right py-2 w-16">{t.level}</th>
                    <th className="font-medium text-right py-2 w-24">{t.points}</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <motion.tr
                      key={entry.user_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`border-b last:border-0 ${
                        entry.user_id === userId ? "bg-primary/5" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <td className="py-3 text-center">
                        <div className="flex items-center">{getMedal(entry.rank) || <span>{entry.rank}</span>}</div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={entry.avatar_url || ""} />
                            <AvatarFallback>{entry.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{entry.username}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">{entry.level}</td>
                      <td className="py-3 text-right font-medium">{entry.points}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {userRank && userRank.rank > 10 && (
              <div className="mt-6 border-t pt-4">
                <div className="text-sm font-medium mb-2">{t.yourRank}</div>
                <table className="w-full">
                  <tbody>
                    <tr className="bg-primary/5">
                      <td className="py-3 w-16 text-center">{userRank.rank}</td>
                      <td className="py-3">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={userRank.avatar_url || ""} />
                            <AvatarFallback>{userRank.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{userRank.username}</span>
                        </div>
                      </td>
                      <td className="py-3 w-16 text-right">{userRank.level}</td>
                      <td className="py-3 w-24 text-right font-medium">{userRank.points}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default NutritionLeaderboard
