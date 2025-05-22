import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useLanguage } from "@/contexts/LanguageContext"
import { ProfileSidebar } from "@/components/profile/ProfileSidebar"
import MealSearch from "@/components/MealSearch"
import { FavoriteButton } from "@/components/FavoriteButton"
import { getMealPlan, saveMealPlan, type MealPlanDay } from "@/services/mealPlanService"
import { getMealById } from "@/services/mealService"
import { getMealCalories } from "@/services/mealPlanCalorieService"
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile"

interface MealSearchProps {
  onSelectMeal: (mealId: string) => void;
}

const MealPlanningPage = () => {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const [date, setDate] = useState<Date>(new Date())
  const [mealPlan, setMealPlan] = useState<MealPlanDay[]>([])
  const [selectedDay, setSelectedDay] = useState<MealPlanDay | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("breakfast")
  const [totalCalories, setTotalCalories] = useState<Record<string, number>>({})

  const translations = {
    en: {
      title: "Meal Planning",
      subtitle: "Plan your meals for the week",
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      snacks: "Snacks",
      addMeal: "Add Meal",
      removeMeal: "Remove",
      savePlan: "Save Plan",
      caloriesLabel: "Calories",
      noMeals: "No meals planned for this day",
      selectDate: "Select a date to view or edit meal plan",
      mealAdded: "Meal added to your plan",
      mealRemoved: "Meal removed from your plan",
      planSaved: "Meal plan saved successfully",
      errorLoading: "Error loading meal plan",
      errorSaving: "Error saving meal plan",
    },
    fr: {
      title: "Planification des repas",
      subtitle: "Planifiez vos repas pour la semaine",
      breakfast: "Petit déjeuner",
      lunch: "Déjeuner",
      dinner: "Dîner",
      snacks: "Collations",
      addMeal: "Ajouter un repas",
      removeMeal: "Supprimer",
      savePlan: "Enregistrer le plan",
      caloriesLabel: "Calories",
      noMeals: "Aucun repas prévu pour ce jour",
      selectDate: "Sélectionnez une date pour afficher ou modifier le plan de repas",
      mealAdded: "Repas ajouté à votre plan",
      mealRemoved: "Repas supprimé de votre plan",
      planSaved: "Plan de repas enregistré avec succès",
      errorLoading: "Erreur lors du chargement du plan de repas",
      errorSaving: "Erreur lors de l'enregistrement du plan de repas",
    },
  }

  const t = translations[language as keyof typeof translations]

  useEffect(() => {
    loadMealPlan()
  }, [])

  useEffect(() => {
    if (mealPlan.length > 0) {
      const day = mealPlan.find(
        (d) => new Date(d.date).toDateString() === date.toDateString(),
      )
      setSelectedDay(day || createEmptyDay(date))
    }
  }, [date, mealPlan])

  useEffect(() => {
    if (selectedDay) {
      calculateTotalCalories()
    }
  }, [selectedDay])

  const loadMealPlan = async () => {
    setIsLoading(true)
    try {
      const plan = await getMealPlan()
      if (plan.length === 0) {
        // Create an empty plan for the current week
        const today = new Date()
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())

        const emptyPlan = []
        for (let i = 0; i < 7; i++) {
          const day = new Date(startOfWeek)
          day.setDate(startOfWeek.getDate() + i)
          emptyPlan.push(createEmptyDay(day))
        }
        setMealPlan(emptyPlan)
      } else {
        setMealPlan(plan)
      }

      // Set selected day to today
      const today = new Date()
      const day = plan.find(
        (d) => new Date(d.date).toDateString() === today.toDateString(),
      )
      setSelectedDay(day || createEmptyDay(today))
    } catch (error) {
      console.error("Error loading meal plan:", error)
      toast.error(t.errorLoading)
    } finally {
      setIsLoading(false)
    }
  }

  const createEmptyDay = (date: Date): MealPlanDay => {
    return {
      date: date.toISOString().split("T")[0],
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date)
    }
  }

  const handleMealSelect = async (mealId: string) => {
    if (!selectedDay) return

    try {
      const meal = await getMealById(mealId)
      if (!meal) return

      const updatedDay = { ...selectedDay }
      updatedDay[activeTab as keyof Omit<MealPlanDay, "date">].push({
        id: mealId,
        name: meal.name,
        image: meal.image || "",
      })

      // Update the meal plan
      const updatedPlan = mealPlan.map((day) =>
        day.date === updatedDay.date ? updatedDay : day,
      )

      // If the day doesn't exist in the plan, add it
      if (!updatedPlan.some((day) => day.date === updatedDay.date)) {
        updatedPlan.push(updatedDay)
      }

      setMealPlan(updatedPlan)
      setSelectedDay(updatedDay)
      toast.success(t.mealAdded)
    } catch (error) {
      console.error("Error adding meal:", error)
    }
  }

  const handleRemoveMeal = (mealType: string, index: number) => {
    if (!selectedDay) return

    const updatedDay = { ...selectedDay }
    updatedDay[mealType as keyof Omit<MealPlanDay, "date">].splice(index, 1)

    // Update the meal plan
    const updatedPlan = mealPlan.map((day) =>
      day.date === updatedDay.date ? updatedDay : day,
    )

    setMealPlan(updatedPlan)
    setSelectedDay(updatedDay)
    toast.success(t.mealRemoved)
  }

  const handleSavePlan = async () => {
    try {
      await saveMealPlan(mealPlan)
      toast.success(t.planSaved)
    } catch (error) {
      console.error("Error saving meal plan:", error)
      toast.error(t.errorSaving)
    }
  }

  const calculateTotalCalories = async () => {
    if (!selectedDay) return

    const mealTypes = ["breakfast", "lunch", "dinner", "snacks"]
    const allMealIds: string[] = []

    // Collect all meal IDs
    mealTypes.forEach((type) => {
      const meals = selectedDay[type as keyof Omit<MealPlanDay, "date">]
      meals.forEach((meal) => {
        if (meal.id) {
          allMealIds.push(meal.id)
        }
      })
    })

    if (allMealIds.length === 0) {
      setTotalCalories({})
      return
    }

    try {
      // Get calories for all meals
      const mealCalories = await getMealCalories(allMealIds)
      const caloriesMap: Record<string, number> = {}

      mealCalories.forEach((item) => {
        caloriesMap[item.id] = item.calories
      })

      // Calculate total calories for each meal type
      const totals: Record<string, number> = {}

      mealTypes.forEach((type) => {
        const meals = selectedDay[type as keyof Omit<MealPlanDay, "date">]
        totals[type] = meals.reduce((sum, meal) => {
          return sum + (caloriesMap[meal.id] || 0)
        }, 0)
      })

      // Add daily total
      totals.total = Object.values(totals).reduce((sum, cal) => sum + cal, 0)

      setTotalCalories(totals)
    } catch (error) {
      console.error("Error calculating calories:", error)
    }
  }

  const renderMealList = (mealType: string) => {
    if (!selectedDay) return null

    const meals = selectedDay[mealType as keyof Omit<MealPlanDay, "date">]

    if (meals.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {t.noMeals}
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {meals.map((meal, index) => (
          <Card key={`${meal.id}-${index}`} className="overflow-hidden">
            <div className="flex items-center">
              {meal.image && (
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="h-16 w-16 object-cover"
                />
              )}
              <CardContent className="flex-1 p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-sm">{meal.name}</h4>
                    {totalCalories[mealType] && (
                      <p className="text-xs text-gray-500">
                        {totalCalories[meal.id] || "~"} {t.caloriesLabel}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <FavoriteButton mealId={meal.id} />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMeal(mealType, index)}
                    >
                      {t.removeMeal}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-900 min-h-screen">
      <ProfileSidebar activePage="meal-planning" />

      <div className={`p-4 w-full ${isMobile ? 'mt-16' : 'sm:ml-0 lg:ml-64'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{t.subtitle}</p>
          </div>

          <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : isTablet ? 'grid-cols-1 md:grid-cols-3 gap-6' : 'grid-cols-4 gap-6'}`}>
            <div className={`${isMobile || isTablet ? 'order-1' : 'col-span-1'}`}>
              <Card>
                <CardContent className="p-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    className="rounded-md border"
                  />

                  {selectedDay && totalCalories.total && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <h3 className="font-medium text-sm mb-2">
                        {new Date(selectedDay.date).toLocaleDateString(
                          language === "en" ? "en-US" : "fr-FR",
                          { weekday: "long", month: "long", day: "numeric" },
                        )}
                      </h3>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{t.breakfast}:</span>
                          <span>
                            {totalCalories.breakfast || 0} {t.caloriesLabel}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>{t.lunch}:</span>
                          <span>
                            {totalCalories.lunch || 0} {t.caloriesLabel}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>{t.dinner}:</span>
                          <span>
                            {totalCalories.dinner || 0} {t.caloriesLabel}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>{t.snacks}:</span>
                          <span>
                            {totalCalories.snacks || 0} {t.caloriesLabel}
                          </span>
                        </div>
                        <div className="border-t pt-1 mt-1 flex justify-between font-medium">
                          <span>Total:</span>
                          <span>
                            {totalCalories.total} {t.caloriesLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full mt-4"
                    onClick={handleSavePlan}
                    disabled={isLoading}
                  >
                    {t.savePlan}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className={`${isMobile || isTablet ? 'order-2' : 'col-span-3'}`}>
              {selectedDay ? (
                <Card>
                  <CardContent className="p-4">
                    <Tabs
                      defaultValue="breakfast"
                      value={activeTab}
                      onValueChange={setActiveTab}
                    >
                      <TabsList className="grid grid-cols-4 mb-4">
                        <TabsTrigger value="breakfast">
                          {t.breakfast}
                          {selectedDay.breakfast.length > 0 && (
                            <Badge
                              variant="secondary"
                              className="ml-1 bg-primary text-primary-foreground"
                            >
                              {selectedDay.breakfast.length}
                            </Badge>
                          )}
                        </TabsTrigger>
                        <TabsTrigger value="lunch">
                          {t.lunch}
                          {selectedDay.lunch.length > 0 && (
                            <Badge
                              variant="secondary"
                              className="ml-1 bg-primary text-primary-foreground"
                            >
                              {selectedDay.lunch.length}
                            </Badge>
                          )}
                        </TabsTrigger>
                        <TabsTrigger value="dinner">
                          {t.dinner}
                          {selectedDay.dinner.length > 0 && (
                            <Badge
                              variant="secondary"
                              className="ml-1 bg-primary text-primary-foreground"
                            >
                              {selectedDay.dinner.length}
                            </Badge>
                          )}
                        </TabsTrigger>
                        <TabsTrigger value="snacks">
                          {t.snacks}
                          {selectedDay.snacks.length > 0 && (
                            <Badge
                              variant="secondary"
                              className="ml-1 bg-primary text-primary-foreground"
                            >
                              {selectedDay.snacks.length}
                            </Badge>
                          )}
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="breakfast">
                        {renderMealList("breakfast")}
                      </TabsContent>
                      <TabsContent value="lunch">
                        {renderMealList("lunch")}
                      </TabsContent>
                      <TabsContent value="dinner">
                        {renderMealList("dinner")}
                      </TabsContent>
                      <TabsContent value="snacks">
                        {renderMealList("snacks")}
                      </TabsContent>
                    </Tabs>

                    <div className="mt-6">
                      <h3 className="font-medium mb-3">{t.addMeal}</h3>
                      <MealSearch onSelectMeal={(mealId) => handleMealSelect(mealId)} />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p>{t.selectDate}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MealPlanningPage
