import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Award, ListChecks, Users } from "lucide-react"
import NutritionQuest from "./NutritionQuest"
import NutritionBadges from "./NutritionBadges"
import NutritionLeaderboard from "./NutritionLeaderboard"
import ChallengeList from "./ChallengeList"
import { useUserPoints } from "@/hooks/useUserPoints"

const NutritionGamificationSystem = () => {
  const [activeTab, setActiveTab] = useState("quests")
  const { userPoints, isLoading } = useUserPoints()

  // Calculate level progress
  const currentLevel = userPoints?.level || 1
  const pointsForCurrentLevel = currentLevel * 100
  const pointsForNextLevel = (currentLevel + 1) * 100
  const pointsNeeded = pointsForNextLevel - pointsForCurrentLevel
  const currentPoints = userPoints?.total_points || 0
  const pointsAboveCurrentLevel = currentPoints - pointsForCurrentLevel
  const progressPercentage = Math.min(Math.floor((pointsAboveCurrentLevel / pointsNeeded) * 100), 100)

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">Your Level</CardTitle>
            <CardDescription>Track your nutrition journey progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">{currentLevel}</p>
                <p className="text-sm text-muted-foreground">Current Level</p>
              </div>
              <div>
                <Trophy className="h-10 w-10 text-yellow-500" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Progress to Level {currentLevel + 1}</span>
                <span className="text-sm font-medium">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="mt-2 text-sm text-muted-foreground">
                {pointsAboveCurrentLevel} / {pointsNeeded} points
              </p>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium">Total Points: {currentPoints}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Daily Streak</CardTitle>
            <CardDescription>Keep your nutrition tracking streak going</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">7</p>
                <p className="text-sm text-muted-foreground">Days in a row</p>
              </div>
              <div className="flex space-x-1">
                <div className="w-3 h-10 bg-green-500 rounded-sm"></div>
                <div className="w-3 h-10 bg-green-500 rounded-sm"></div>
                <div className="w-3 h-10 bg-green-500 rounded-sm"></div>
                <div className="w-3 h-10 bg-green-500 rounded-sm"></div>
                <div className="w-3 h-10 bg-green-500 rounded-sm"></div>
                <div className="w-3 h-10 bg-green-500 rounded-sm"></div>
                <div className="w-3 h-10 bg-green-500 rounded-sm"></div>
              </div>
            </div>
            <p className="mt-4 text-sm">Log your meals daily to maintain your streak!</p>
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Recent Achievements</CardTitle>
            <CardDescription>Your latest nutrition milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Protein Champion</p>
                  <p className="text-sm text-muted-foreground">Met protein goals 5 days in a row</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <ListChecks className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Meal Planner</p>
                  <p className="text-sm text-muted-foreground">Created 3 weekly meal plans</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">View All Achievements</Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="quests" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              <span className="hidden sm:inline">Quests</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Badges</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Challenges</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="quests">
            <NutritionQuest />
          </TabsContent>
          <TabsContent value="badges">
            <NutritionBadges />
          </TabsContent>
          <TabsContent value="leaderboard">
            <NutritionLeaderboard />
          </TabsContent>
          <TabsContent value="challenges">
            <ChallengeList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default NutritionGamificationSystem
