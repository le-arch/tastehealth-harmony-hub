"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

interface UserLevelProps {
  level: number
  points: number
  pointsForNextLevel: number
}

const LEVEL_TITLES: Record<number, string> = {
  1: 'Beginner', 2: 'Novice', 3: 'Apprentice', 4: 'Learner', 5: 'Enthusiast',
  6: 'Skilled', 7: 'Expert', 8: 'Master', 9: 'Champion', 10: 'Legend',
  11: 'Titan', 12: 'Mythic', 13: 'Immortal', 14: 'Divine', 15: 'Supreme',
};

const UserLevel = ({ level, points, pointsForNextLevel }: UserLevelProps) => {
  const [animate, setAnimate] = useState(false)
  const { language } = useLanguage()

  const t = language === 'fr'
    ? { yourLevel: "Votre Niveau", pointsToNextLevel: "points pour le niveau suivant" }
    : { yourLevel: "Your Level", pointsToNextLevel: "points to next level" };

  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 1000)
    return () => clearTimeout(timer)
  }, [level])

  const progress = Math.min(100, Math.round((points / pointsForNextLevel) * 100))
  const title = LEVEL_TITLES[Math.min(level, 15)] || 'Supreme'
  const cappedLevel = Math.min(level, 15);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center">
          <Star className="h-4 w-4 mr-2 text-yellow-500 fill-yellow-500" />
          {t.yourLevel}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <motion.div
            animate={animate ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold"
          >
            {cappedLevel}
          </motion.div>
          <div className="ml-4 flex-1">
            <div className="text-xs font-medium text-primary mb-0.5">{title}</div>
            <Progress value={cappedLevel >= 15 ? 100 : progress} className="h-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {cappedLevel >= 15 ? 'Max level reached! 🏆' : `${pointsForNextLevel - points} ${t.pointsToNextLevel}`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserLevel
