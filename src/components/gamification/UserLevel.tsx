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

const UserLevel = ({ level, points, pointsForNextLevel }: UserLevelProps) => {
  const [animate, setAnimate] = useState(false)
  const { language } = useLanguage()

  const translations = {
    en: {
      yourLevel: "Your Level",
      pointsToNextLevel: "points to next level",
    },
    fr: {
      yourLevel: "Votre Niveau",
      pointsToNextLevel: "points pour le niveau suivant",
    },
  }

  const t = translations[language as keyof typeof translations] || translations.en

  // Trigger animation when level changes
  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 1000)
    return () => clearTimeout(timer)
  }, [level])

  const progress = Math.min(100, Math.round((points / pointsForNextLevel) * 100))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center">
          <Star className="h-4 w-4 mr-2 text-yellow-500" />
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
            {level}
          </motion.div>
          <div className="ml-4 flex-1">
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {pointsForNextLevel - points} {t.pointsToNextLevel}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserLevel
