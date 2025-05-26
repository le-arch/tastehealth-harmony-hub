
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Medal, Trophy, Crown, Users, Bot } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { getLeaderboard, type LeaderboardEntry } from "@/services/leaderboardService"

interface NutritionLeaderboardProps {
  userId?: string
}

const NutritionLeaderboard = ({ userId }: NutritionLeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null)
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "alltime">("alltime")
  const [isLoading, setIsLoading] = useState(true)
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
      bot: "Bot"
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
      bot: "Bot"
    },
  }

  const t = translations[language as keyof typeof translations] || translations.en

  // Load leaderboard data
  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true)
      try {
        const { leaderboard: data, userRank: userRankData } = await getLeaderboard(userId)
        setLeaderboard(data)
        setUserRank(userRankData)
      } catch (error) {
        console.error("Error loading leaderboard:", error)
      } finally {
        setIsLoading(false)
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

  const getRowBackground = (entry: LeaderboardEntry) => {
    if (entry.user_id === userId) return "bg-blue-50 dark:bg-blue-900/20 border-blue-200";
    if (entry.rank <= 3) return "bg-yellow-50 dark:bg-yellow-900/20";
    return "hover:bg-gray-50 dark:hover:bg-gray-800/50";
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
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              timeframe === "weekly"
                ? "bg-amber-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {t.weekly}
          </button>
          <button
            onClick={() => setTimeframe("monthly")}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              timeframe === "monthly"
                ? "bg-amber-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {t.monthly}
          </button>
          <button
            onClick={() => setTimeframe("alltime")}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              timeframe === "alltime"
                ? "bg-amber-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {t.allTime}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500 mx-auto mb-2"></div>
            <p>{t.loading}</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p>No leaderboard data available</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 border-b dark:border-gray-700">
                    <th className="font-medium text-left py-2 w-16">{t.rank}</th>
                    <th className="font-medium text-left py-2">{t.user}</th>
                    <th className="font-medium text-right py-2 w-16">{t.level}</th>
                    <th className="font-medium text-right py-2 w-24">{t.points}</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <motion.tr
                      key={entry.user_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`border-b last:border-0 dark:border-gray-700 ${getRowBackground(entry)}`}
                    >
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center">
                          {getMedal(entry.rank) || (
                            <span className={`font-medium ${entry.rank <= 10 ? 'text-amber-600' : 'text-gray-500'}`}>
                              {entry.rank}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={entry.avatar_url || ""} />
                            <AvatarFallback className={entry.is_dummy ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-800"}>
                              {entry.is_dummy ? (
                                <Bot className="h-4 w-4 text-blue-600" />
                              ) : (
                                entry.username.charAt(0).toUpperCase()
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex items-center gap-1">
                            <span className={`font-medium ${entry.user_id === userId ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                              {entry.username}
                            </span>
                            {entry.is_dummy && (
                              <span className="text-xs bg-blue-100 text-blue-600 px-1 py-0.5 rounded dark:bg-blue-900 dark:text-blue-400">
                                {t.bot}
                              </span>
                            )}
                            {entry.user_id === userId && (
                              <span className="text-xs bg-green-100 text-green-600 px-1 py-0.5 rounded dark:bg-green-900 dark:text-green-400">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`font-medium ${entry.level >= 8 ? 'text-purple-600' : entry.level >= 5 ? 'text-blue-600' : 'text-gray-600'}`}>
                          {entry.level}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`font-medium ${entry.points >= 10000 ? 'text-amber-600' : entry.points >= 5000 ? 'text-blue-600' : 'text-gray-600'}`}>
                          {entry.points.toLocaleString()}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {userRank && userRank.rank > 10 && (
              <div className="mt-6 border-t pt-4 dark:border-gray-700">
                <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t.yourRank}</div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-bold text-blue-600 dark:text-blue-400 w-8">#{userRank.rank}</span>
                      <Avatar className="h-8 w-8 mr-2 ml-2">
                        <AvatarImage src={userRank.avatar_url || ""} />
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900">
                          {userRank.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-blue-600 dark:text-blue-400">{userRank.username}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        Level {userRank.level}
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {userRank.points.toLocaleString()} pts
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default NutritionLeaderboard
