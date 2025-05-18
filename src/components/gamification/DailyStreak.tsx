"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flame, Check } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

interface DailyStreakProps {
  streak: number
  updateStreak: () => Promise<void>
}

const DailyStreak = ({ streak, updateStreak }: DailyStreakProps) => {
  const [checkedIn, setCheckedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { language } = useLanguage()

  const translations = {
    en: {
      dailyStreak: "Daily Streak",
      days: "days",
      checkIn: "Daily Check-in",
      checkedIn: "Checked In",
      streakBonus: "Streak Bonus",
    },
    fr: {
      dailyStreak: "Série Quotidienne",
      days: "jours",
      checkIn: "Présence Quotidienne",
      checkedIn: "Présent",
      streakBonus: "Bonus de Série",
    },
  }

  const t = translations[language as keyof typeof translations] || translations.en

  // Check if user has already checked in today
  useEffect(() => {
    const checkIfCheckedIn = async () => {
      const lastCheckIn = localStorage.getItem("lastCheckIn")
      if (lastCheckIn) {
        const today = new Date().toDateString()
        setCheckedIn(lastCheckIn === today)
      }
    }

    checkIfCheckedIn()
  }, [])

  const handleCheckIn = async () => {
    if (checkedIn) return

    setIsLoading(true)
    try {
      await updateStreak()
      setCheckedIn(true)
      localStorage.setItem("lastCheckIn", new Date().toDateString())
    } catch (error) {
      console.error("Error checking in:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center">
          <Flame className="h-4 w-4 mr-2 text-orange-500" />
          {t.dailyStreak}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", duration: 1.5 }}
            className="text-3xl font-bold"
          >
            {streak}
          </motion.div>
          <div className="ml-2 text-sm text-muted-foreground">{t.days}</div>

          {streak > 0 && streak % 7 === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="ml-auto px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
            >
              {t.streakBonus}
            </motion.div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleCheckIn}
          disabled={checkedIn || isLoading}
          variant={checkedIn ? "outline" : "default"}
          className="w-full"
          size="sm"
        >
          {checkedIn ? (
            <>
              <Check className="mr-1 h-4 w-4" />
              {t.checkedIn}
            </>
          ) : (
            t.checkIn
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default DailyStreak
