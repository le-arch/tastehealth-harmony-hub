export interface IngredientNutrition {
    protein: number
    carbs: number
    fats: number
    fiber: number
    vitamins: number
    minerals: number
    calories: number
  }
  
  // This is a simplified service that would normally fetch data from an API
  // For demo purposes, we'll return mock data
  export const getIngredientNutrition = async (ingredient: string): Promise<IngredientNutrition> => {
    // In a real app, this would call a nutrition API
    // For demo purposes, we'll return mock data based on the ingredient name
  
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
  
    // Mock nutrition data for common ingredients
    const mockData: Record<string, IngredientNutrition> = {
      chicken: {
        protein: 26,
        carbs: 0,
        fats: 3.6,
        fiber: 0,
        vitamins: 15,
        minerals: 20,
        calories: 165,
      },
      broccoli: {
        protein: 2.8,
        carbs: 6.6,
        fats: 0.4,
        fiber: 2.6,
        vitamins: 80,
        minerals: 45,
        calories: 34,
      },
      rice: {
        protein: 2.7,
        carbs: 28,
        fats: 0.3,
        fiber: 0.4,
        vitamins: 5,
        minerals: 10,
        calories: 130,
      },
      salmon: {
        protein: 22,
        carbs: 0,
        fats: 13,
        fiber: 0,
        vitamins: 40,
        minerals: 35,
        calories: 208,
      },
      spinach: {
        protein: 2.9,
        carbs: 3.6,
        fats: 0.4,
        fiber: 2.2,
        vitamins: 95,
        minerals: 70,
        calories: 23,
      },
      avocado: {
        protein: 2,
        carbs: 9,
        fats: 15,
        fiber: 7,
        vitamins: 25,
        minerals: 30,
        calories: 160,
      },
      eggs: {
        protein: 13,
        carbs: 1.1,
        fats: 11,
        fiber: 0,
        vitamins: 35,
        minerals: 25,
        calories: 155,
      },
      "sweet potato": {
        protein: 1.6,
        carbs: 20,
        fats: 0.1,
        fiber: 3,
        vitamins: 65,
        minerals: 40,
        calories: 86,
      },
    }
  
    // Return data for the requested ingredient or generate random data if not found
    if (mockData[ingredient]) {
      return mockData[ingredient]
    } else {
      // Generate random nutrition data for unknown ingredients
      return {
        protein: Math.random() * 20,
        carbs: Math.random() * 30,
        fats: Math.random() * 15,
        fiber: Math.random() * 5,
        vitamins: Math.random() * 100,
        minerals: Math.random() * 100,
        calories: Math.floor(Math.random() * 300) + 50,
      }
    }
  }
  export const getNutritionData = async (ingredients: string[]): Promise<IngredientNutrition[]> => {
    const nutritionData: IngredientNutrition[] = []
  
    for (const ingredient of ingredients) {
      const data = await getIngredientNutrition(ingredient)
      nutritionData.push(data)
    }
  
    return nutritionData
  }