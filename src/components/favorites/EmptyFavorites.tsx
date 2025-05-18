"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "@/contexts/LanguageContext"

interface EmptyFavoritesProps {
  message: string
}

const EmptyFavorites = ({ message }: EmptyFavoritesProps) => {
  const navigate = useNavigate()
  const { language } = useLanguage()

  const translations = {
    en: {
      browse: "Browse Meals",
      description: "Save your favorite meals and recipes to access them quickly.",
    },
    fr: {
      browse: "Parcourir les Repas",
      description: "Enregistrez vos repas et recettes préférés pour y accéder rapidement.",
    },
  }

  const t = translations[language as keyof typeof translations] || translations.en

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          type: "spring",
          stiffness: 200,
        }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-20 animate-pulse"></div>
        <Heart className="h-16 w-16 text-red-500 relative" />
      </motion.div>

      <motion.h3
        className="text-xl font-semibold mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {message}
      </motion.h3>

      <motion.p
        className="text-gray-500 dark:text-gray-400 mb-6 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {t.description}
      </motion.p>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Button onClick={() => navigate("/meal-planning")} className="bg-th-green-600 hover:bg-th-green-700">
          {t.browse}
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default EmptyFavorites
