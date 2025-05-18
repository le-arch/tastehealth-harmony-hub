"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ExternalLink } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"

interface FavoriteMealCardProps {
  favorite: any
  onRemove: (id: string) => void
}

const FavoriteMealCard = ({ favorite, onRemove }: FavoriteMealCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      variants={item}
      layout
      exit="exit"
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden h-full">
        <div className="relative h-40 overflow-hidden">
          {favorite.image_url ? (
            <motion.img
              src={favorite.image_url}
              alt={favorite.meal_name}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = `https://picsum.photos/seed/${favorite.id}/300/200`
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
              <img
                src={`https://picsum.photos/seed/${favorite.id}/300/200`}
                alt={favorite.meal_name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <motion.div className="absolute top-2 right-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="destructive"
              size="icon"
              className="rounded-full h-8 w-8 bg-white dark:bg-gray-800 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
              onClick={() => onRemove(favorite.id)}
            >
              <Heart className="h-4 w-4 fill-current" />
            </Button>
          </motion.div>

          {favorite.category_name && (
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {favorite.category_name}
            </div>
          )}

          {favorite.subcategory_name && (
            <div className="absolute bottom-2 right-2 bg-th-green-600/80 text-white text-xs px-2 py-1 rounded-full">
              {favorite.subcategory_name}
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg mb-1 line-clamp-1">{favorite.meal_name}</h3>
              {favorite.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{favorite.description}</p>
              )}
            </div>

            <Link to={`/meal-detail/${favorite.id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-th-green-600">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <motion.div
            className="mt-3 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {favorite.tags &&
              favorite.tags.split(",").map((tag: string, index: number) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                >
                  {tag.trim()}
                </span>
              ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default FavoriteMealCard
