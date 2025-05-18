"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/LanguageContext"
import { ChefHat, Clock, CheckCircle, Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react"
import confetti from "canvas-confetti"

const PREP_STEPS = [
  { id: "gather", label: "Gather Ingredients", icon: "🥕", sound: "gather.mp3", duration: 3 },
  { id: "chop", label: "Chop Vegetables", icon: "🔪", sound: "chop.mp3", duration: 5 },
  { id: "cook", label: "Cook Protein", icon: "🍳", sound: "sizzle.mp3", duration: 8 },
  { id: "mix", label: "Mix Everything", icon: "🥄", sound: "mix.mp3", duration: 3 },
  { id: "plate", label: "Plate Your Meal", icon: "🍽️", sound: "plate.mp3", duration: 2 },
]

const CELEBRATION_MESSAGES = [
  "Amazing job! Your meal is ready!",
  "Fantastic work! Time to enjoy your creation!",
  "You did it! Bon appétit!",
  "Great job prepping your meal!",
  "Success! Your healthy meal is ready to enjoy!",
]

const MealPrepFeedback = () => {
  const [currentStep, setCurrentStep] = useState<number | null>(null)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationMessage, setCelebrationMessage] = useState("")
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null)
  const { language } = useLanguage()

  // Translations
  const translations = {
    en: {
      title: "Meal Prep Assistant",
      startPrep: "Start Meal Prep",
      nextStep: "Next Step",
      resetPrep: "Start Over",
      toggleSound: "Toggle Sound",
      soundOn: "Sound On",
      soundOff: "Sound Off",
      prepComplete: "Preparation Complete!",
      continue: "Continue",
      seconds: "seconds",
    },
    fr: {
      title: "Assistant de Préparation de Repas",
      startPrep: "Commencer la Préparation",
      nextStep: "Étape Suivante",
      resetPrep: "Recommencer",
      toggleSound: "Activer/Désactiver le Son",
      soundOn: "Son Activé",
      soundOff: "Son Désactivé",
      prepComplete: "Préparation Terminée!",
      continue: "Continuer",
      seconds: "secondes",
    },
  }

  const t = translations[language as keyof typeof translations] || translations.en

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const startStep = (stepIndex: number) => {
    if (stepIndex >= PREP_STEPS.length) {
      completePrepProcess()
      return
    }

    const step = PREP_STEPS[stepIndex]
    setCurrentStep(stepIndex)
    setTimeLeft(step.duration)
    setIsPlaying(true)

    if (isSoundEnabled) {
      playSound(step.sound)
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          completeStep(step.id)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const completeStep = (stepId: string) => {
    setCompletedSteps((prev) => [...prev, stepId])
    setIsPlaying(false)

    // Play completion sound
    if (isSoundEnabled) {
      playSound("complete.mp3")
    }
  }

  const completePrepProcess = () => {
    setCurrentStep(null)

    // Select random celebration message
    const randomMessage = CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)]
    setCelebrationMessage(randomMessage)

    // Show celebration animation
    setShowCelebration(true)

    // Play celebration sound
    if (isSoundEnabled) {
      playSound("celebration.mp3")
    }

    // Trigger confetti
    if (confettiCanvasRef.current) {
      const myConfetti = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true,
      })

      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

    // Hide celebration after 5 seconds
    setTimeout(() => {
      setShowCelebration(false)
    }, 5000)
  }

  const playSound = (soundFile: string) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }

    audioRef.current = new Audio(`/sounds/${soundFile}`)
    audioRef.current.play().catch((e) => console.log("Audio play failed:", e))
  }

  const handleToggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled)

    if (audioRef.current && !isSoundEnabled) {
      audioRef.current.pause()
    }
  }

  const handleStartPrep = () => {
    setCompletedSteps([])
    startStep(0)
  }

  const handleNextStep = () => {
    if (currentStep !== null) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      if (audioRef.current) {
        audioRef.current.pause()
      }

      const nextStepIndex = currentStep + 1
      startStep(nextStepIndex)
    }
  }

  const handleResetPrep = () => {
    setCurrentStep(null)
    setCompletedSteps([])
    setIsPlaying(false)
    setShowCelebration(false)

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  return (
    <Card className="w-full relative overflow-hidden">
      <canvas
        ref={confettiCanvasRef}
        className="absolute inset-0 pointer-events-none z-10"
        style={{ width: "100%", height: "100%" }}
      />

      <CardHeader>
        <CardTitle className="flex items-center text-lg font-medium">
          <ChefHat className="mr-2 h-5 w-5 text-orange-500" />
          {t.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          {showCelebration ? (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.2, 1, 1.1, 1],
                }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              >
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              </motion.div>

              <h3 className="text-xl font-bold text-center mb-2">{t.prepComplete}</h3>
              <p className="text-center mb-6">{celebrationMessage}</p>

              <Button onClick={handleResetPrep}>{t.continue}</Button>
            </motion.div>
          ) : currentStep !== null ? (
            <motion.div
              key="prep-steps"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{PREP_STEPS[currentStep].icon}</span>
                  <span className="text-lg font-medium">{PREP_STEPS[currentStep].label}</span>
                </div>

                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {timeLeft} {t.seconds}
                  </span>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <motion.div
                  className="bg-primary h-2.5 rounded-full"
                  initial={{ width: "100%" }}
                  animate={{
                    width: `${(timeLeft / PREP_STEPS[currentStep].duration) * 100}%`,
                  }}
                  transition={{ duration: 1 }}
                ></motion.div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div className="flex space-x-1">
                  {PREP_STEPS.map((step, index) => (
                    <motion.div
                      key={step.id}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        completedSteps.includes(step.id)
                          ? "bg-green-500 text-white"
                          : index === currentStep
                            ? "bg-primary text-white"
                            : "bg-gray-200 dark:bg-gray-700"
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {completedSteps.includes(step.id) ? <CheckCircle className="h-3 w-3" /> : index + 1}
                    </motion.div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={handleToggleSound} title={t.toggleSound}>
                    {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>

                  {isPlaying ? (
                    <Button size="sm" variant="outline" onClick={() => setIsPlaying(false)}>
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsPlaying(true)
                        startStep(currentStep)
                      }}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={handleResetPrep}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  {t.resetPrep}
                </Button>

                <Button onClick={handleNextStep}>{t.nextStep}</Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="start-prep"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-8"
            >
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}>
                <ChefHat className="h-16 w-16 text-orange-500 mb-4" />
              </motion.div>

              <Button size="lg" onClick={handleStartPrep} className="mt-4">
                {t.startPrep}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="text-xs text-gray-500">{isSoundEnabled ? t.soundOn : t.soundOff}</div>
      </CardFooter>
    </Card>
  )
}

export default MealPrepFeedback
