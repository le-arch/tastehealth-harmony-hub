"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/LanguageContext"
import { Leaf, Plus, X, Info, Search } from "lucide-react"
import { getIngredientNutrition, type IngredientNutrition } from "../../services/nutritionService"

const NUTRITION_COLORS = {
  protein: "#10B981", // green
  carbs: "#F59E0B", // amber
  fats: "#3B82F6", // blue
  fiber: "#8B5CF6", // purple
  vitamins: "#EC4899", // pink
  minerals: "#6366F1", // indigo
}

const IngredientNutritionVisualizer = () => {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [newIngredient, setNewIngredient] = useState("")
  const [nutritionData, setNutritionData] = useState<Record<string, IngredientNutrition>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null)
  const { language } = useLanguage()

  // Translations
  const translations = {
    en: {
      title: "Ingredient Nutrition Visualizer",
      addIngredient: "Add Ingredient",
      enterIngredient: "Enter an ingredient",
      noIngredients: "No ingredients added. Add some to see their nutritional profile!",
      protein: "Protein",
      carbs: "Carbohydrates",
      fats: "Fats",
      fiber: "Fiber",
      vitamins: "Vitamins",
      minerals: "Minerals",
      nutritionProfile: "Nutrition Profile",
      perServing: "per serving",
      grams: "g",
      milligrams: "mg",
      searchIngredient: "Search",
      searching: "Searching...",
      viewDetails: "View Details",
      back: "Back to List",
    },
    fr: {
      title: "Visualiseur Nutritionnel des Ingrédients",
      addIngredient: "Ajouter un Ingrédient",
      enterIngredient: "Entrez un ingrédient",
      noIngredients: "Aucun ingrédient ajouté. Ajoutez-en pour voir leur profil nutritionnel!",
      protein: "Protéines",
      carbs: "Glucides",
      fats: "Lipides",
      fiber: "Fibres",
      vitamins: "Vitamines",
      minerals: "Minéraux",
      nutritionProfile: "Profil Nutritionnel",
      perServing: "par portion",
      grams: "g",
      milligrams: "mg",
      searchIngredient: "Rechercher",
      searching: "Recherche...",
      viewDetails: "Voir les Détails",
      back: "Retour à la Liste",
    },
  }

  const t = translations[language as keyof typeof translations] || translations.en

  const handleAddIngredient = async () => {
    if (!newIngredient.trim()) return

    const ingredient = newIngredient.trim().toLowerCase()

    if (ingredients.includes(ingredient)) {
      toast.error("This ingredient is already in your list")
      return
    }

    setIsLoading(true)

    try {
      const nutritionInfo = await getIngredientNutrition(ingredient)

      setIngredients((prev) => [...prev, ingredient])
      setNutritionData((prev) => ({
        ...prev,
        [ingredient]: nutritionInfo,
      }))

      setNewIngredient("")
    } catch (error) {
      console.error("Error fetching nutrition data:", error)
      toast.error("Could not find nutrition data for this ingredient")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients((prev) => prev.filter((item) => item !== ingredient))

    // Remove from nutrition data
    const newNutritionData = { ...nutritionData }
    delete newNutritionData[ingredient]
    setNutritionData(newNutritionData)

    // If the removed ingredient was selected, clear selection
    if (selectedIngredient === ingredient) {
      setSelectedIngredient(null)
    }
  }

  const getNutrientColor = (nutrient: string) => {
    return NUTRITION_COLORS[nutrient as keyof typeof NUTRITION_COLORS] || "#64748b"
  }

  const getNutrientPercentage = (ingredient: string, nutrient: keyof IngredientNutrition) => {
    if (!nutritionData[ingredient]) return 0

    const data = nutritionData[ingredient]

    // Calculate percentage based on recommended daily values
    switch (nutrient) {
      case "protein":
        return Math.min((data.protein / 50) * 100, 100) // Assuming 50g is 100%
      case "carbs":
        return Math.min((data.carbs / 300) * 100, 100) // Assuming 300g is 100%
      case "fats":
        return Math.min((data.fats / 70) * 100, 100) // Assuming 70g is 100%
      case "fiber":
        return Math.min((data.fiber / 30) * 100, 100) // Assuming 30g is 100%
      case "vitamins":
        // Simplified - in reality would be more complex
        return Math.min((data.vitamins / 100) * 100, 100)
      case "minerals":
        // Simplified - in reality would be more complex
        return Math.min((data.minerals / 100) * 100, 100)
      default:
        return 0
    }
  }

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-medium">
          <Leaf className="mr-2 h-5 w-5 text-green-500" />
          {t.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex space-x-2 mb-6">
          <Input
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            placeholder={t.enterIngredient}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddIngredient()
              }
            }}
          />
          <Button onClick={handleAddIngredient} disabled={isLoading || !newIngredient.trim()}>
            {isLoading ? (
              <span className="flex items-center">
                <Search className="animate-spin h-4 w-4 mr-1" />
                {t.searching}
              </span>
            ) : (
              <span className="flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                {t.searchIngredient}
              </span>
            )}
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {selectedIngredient ? (
            <motion.div
              key="ingredient-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{capitalizeFirstLetter(selectedIngredient)}</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedIngredient(null)}>
                  {t.back}
                </Button>
              </div>

              <div className="space-y-4">
                {Object.entries(NUTRITION_COLORS).map(([nutrient, color]) => {
                  const value = nutritionData[selectedIngredient]?.[nutrient as keyof IngredientNutrition] || 0
                  const percentage = getNutrientPercentage(selectedIngredient, nutrient as keyof IngredientNutrition)

                  return (
                    <div key={nutrient} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                          <span className="text-sm font-medium">{t[nutrient as keyof typeof t]}</span>
                        </div>
                        <span className="text-sm">
                          {value} {nutrient === "vitamins" || nutrient === "minerals" ? t.milligrams : t.grams}
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <motion.div
                          className="h-2 rounded-full"
                          style={{ backgroundColor: color, width: `${percentage}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1 }}
                        ></motion.div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                <div className="flex items-start">
                  <Info className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t.nutritionProfile}</p>
                    <p className="text-xs text-gray-500">
                      {selectedIngredient} {t.perServing}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="ingredients-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {ingredients.length === 0 ? (
                <div className="text-center py-8">
                  <Leaf className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">{t.noIngredients}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ingredients.map((ingredient) => (
                    <motion.div
                      key={ingredient}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-md p-3 relative"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => handleRemoveIngredient(ingredient)}
                      >
                        <X className="h-4 w-4" />
                      </Button>

                      <h4 className="font-medium mb-2">{capitalizeFirstLetter(ingredient)}</h4>

                      <div className="flex space-x-1 mb-3">
                        {Object.entries(NUTRITION_COLORS).map(([nutrient, color]) => (
                          <motion.div
                            key={nutrient}
                            className="h-2 rounded-full"
                            style={{
                              backgroundColor: color,
                              width: `${(1 / 6) * 100}%`,
                            }}
                            whileHover={{ scale: 1.1 }}
                          ></motion.div>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-1">
                        {Object.entries(NUTRITION_COLORS)
                          .slice(0, 3)
                          .map(([nutrient, color]) => {
                            const value = nutritionData[ingredient]?.[nutrient as keyof IngredientNutrition] || 0

                            return (
                              <div
                                key={nutrient}
                                className="text-center p-1 rounded"
                                style={{ backgroundColor: `${color}20` }}
                              >
                                <div className="text-xs font-medium" style={{ color }}>
                                  {t[nutrient as keyof typeof t]}
                                </div>
                                <div className="text-sm">
                                  {value}
                                  {nutrient === "vitamins" || nutrient === "minerals" ? "mg" : "g"}
                                </div>
                              </div>
                            )
                          })}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => setSelectedIngredient(ingredient)}
                      >
                        {t.viewDetails}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

export default IngredientNutritionVisualizer
