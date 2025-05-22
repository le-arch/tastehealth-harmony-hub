import React, { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface LeaderboardUser {
  id: string
  user_id: string
  total_points: number
  level: number
  username?: string
  avatar_url?: string
  rank?: number
}

const NutritionLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboardData()
  }, [])

  const fetchLeaderboardData = async () => {
    setIsLoading(true)
    try {
      // Join user_points with profiles to get usernames
      const { data, error } = await supabase
        .from('user_points')
        .select(`
          id,
          user_id,
          total_points,
          level,
          profiles:user_id (username, avatar_url)
        `)
        .order('total_points', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Error fetching leaderboard data:', error)
        setLeaderboardData([])
      } else if (data) {
        // Process the data to add rankings and extract profile info
        const processedData = data.map((item, index) => ({
          id: item.id,
          user_id: item.user_id,
          total_points: item.total_points,
          level: item.level,
          username: item.profiles?.username || `User ${index + 1}`,
          avatar_url: item.profiles?.avatar_url || '',
          rank: index + 1
        }))
        
        setLeaderboardData(processedData)
      }
    } catch (error) {
      console.error('Error in fetchLeaderboardData:', error)
      setLeaderboardData([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Nutrition Leaderboard</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          // Skeleton loading state
          [1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="flex items-center space-x-4 py-2">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))
        ) : leaderboardData.length > 0 ? (
          // Render leaderboard data
          leaderboardData.map((user) => (
            <div key={user.id} className="flex items-center space-x-4 py-2">
              <Avatar>
                <AvatarImage src={user.avatar_url || `https://avatar.vercel.sh/${user.username}.png`} />
                <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-gray-500">Points: {user.total_points} | Level: {user.level} | Rank: {user.rank}</p>
              </div>
            </div>
          ))
        ) : (
          // No data state
          <p>No leaderboard data available.</p>
        )}
      </CardContent>
    </Card>
  )
}

export default NutritionLeaderboard
