
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flame, Check } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { recordDailyStreak, getCurrentStreak } from "@/services/streakService"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface DailyStreakProps {
  streak: number
  updateStreak: () => Promise<void>
}

const DailyStreak = ({ updateStreak }: DailyStreakProps) => {
  const [streak, setStreak] = useState(0)
  const [checkedIn, setCheckedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
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

  useEffect(() => {
    const initializeStreak = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUserId(user.id)
          const currentStreak = await getCurrentStreak(user.id)
          setStreak(currentStreak)
          
          // Check if user has already checked in today
          const today = new Date().toDateString()
          const lastCheckIn = localStorage.getItem(`lastCheckIn_${user.id}`)
          setCheckedIn(lastCheckIn === today)
        }
      } catch (error) {
        console.error('Error initializing streak:', error)
      }
    }

    initializeStreak()
  }, [])

  const handleCheckIn = async () => {
    if (checkedIn || !userId) return

    setIsLoading(true)
    try {
      const result = await recordDailyStreak(userId)
      
      if (result.success) {
        setStreak(result.streakCount)
        setCheckedIn(true)
        const today = new Date().toDateString()
        localStorage.setItem(`lastCheckIn_${userId}`, today)
        
        // Call the parent update function
        await updateStreak()
        
        toast.success(`Streak updated! You're on a ${result.streakCount} day streak!`)
      } else {
        toast.info("You've already checked in today!")
      }
    } catch (error) {
      console.error("Error checking in:", error)
      toast.error("Failed to update streak")
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
