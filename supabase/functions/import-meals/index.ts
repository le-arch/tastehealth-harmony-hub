import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { supabase } from "../../../src/lib/SupabaseClient";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Fixed meal data structure
const mealsData = [
  // Breakfast category
  {
    meal: "Akara (Fried Bean Cakes)",
    recipe: {
      ingredients: [
        "1 cup of beans",
        "1 onion",
        "2 cloves of garlic",
        "oil for frying",
        "Salt",
      ],
      instructions:
        "Mash the beans and mix with onion and garlic, then fry until crispy",
    },
    image: "./images/acra beans.jpg",
    nutrition_facts: {
      serving_size: "2 cakes",
      calories: "250",
      total_fat: "14g",
      saturated_fat: "2g",
      trans_fat: "0g",
      cholesterol: "0mg",
      sodium: "180mg",
      total_carbohydrate: "25g",
      dietary_fiber: "5g",
      total_sugars: "2g",
      added_sugars: "0g",
      protein: "10g",
    },
    category: "breakfast",
    subcategory: "meal",
  },
  {
    meal: "Pineapple Ginger Cooler",
    recipe: {
      ingredients: [
        "1 cup fresh pineapple chunks",
        "1 inch ginger, peeled",
        "1/2 lime, juiced",
        "4 cups water",
        "Optional: Mint leaves",
      ],
      instructions:
        "Blend all ingredients until smooth. Strain (optional). Serve chilled with mint.",
    },
    image: "./images/pineapple-ginger-cooler.jpg",
    nutrition_facts: {
      serving_size: "1 cup",
      calories: "70",
      total_fat: "0g",
      saturated_fat: "0g",
      trans_fat: "0g",
      cholesterol: "0mg",
      sodium: "5mg",
      total_carbohydrate: "18g",
      dietary_fiber: "1g",
      total_sugars: "15g",
      added_sugars: "0g",
      protein: "0g",
      vitamin_c: "50%",
      manganese: "10%",
    },
    category: "breakfast",
    subcategory: "drink",
  },
  {
    meal: "Plantain Chips",
    recipe: {
      ingredients: ["2 ripe plantains", "oil for frying", "Salt"],
      instructions: "Slice the plantains and fry until crispy",
    },
    image: "./images/plantainchip.jpeg",
    nutrition_facts: {
      serving_size: "1 cup",
      calories: "280",
      total_fat: "16g",
      saturated_fat: "7g",
      trans_fat: "0g",
      cholesterol: "0mg",
      sodium: "150mg",
      total_carbohydrate: "35g",
      dietary_fiber: "3g",
      total_sugars: "10g",
      added_sugars: "0g",
      protein: "2g",
    },
    category: "breakfast",
    subcategory: "snack",
  },

  // Lunch category
  {
    meal: "Poulet DG (Grilled Chicken with Vegetables)",
    recipe: {
      ingredients: [
        "1 whole chicken",
        "2 onions",
        "2 tomatoes",
        "1 bell pepper",
        "Salt",
        "Pepper",
      ],
      instructions:
        "Grill the chicken and vegetables, serve with rice or plantains",
    },
    image: "./images/poulet.jpeg",
    nutrition_facts: {
      serving_size: "1/4 chicken with vegetables",
      calories: "450",
      total_fat: "25g",
      saturated_fat: "7g",
      trans_fat: "0g",
      cholesterol: "150mg",
      sodium: "300mg",
      total_carbohydrate: "15g",
      dietary_fiber: "3g",
      total_sugars: "8g",
      added_sugars: "0g",
      protein: "40g",
      vitamin_a: "20%",
      vitamin_c: "50%",
      calcium: "4%",
      iron: "8%",
    },
    category: "lunch",
    subcategory: "meal",
  },
  {
    meal: "Ndole (Bitter Leaf Stew)",
    recipe: {
      ingredients: [
        "1 bunch of bitter leaves",
        "1 onion",
        "2 cloves of garlic",
        "1 pound of meat or fish",
        "Salt",
        "Pepper",
      ],
      instructions: "Boil the leaves and meat, then add the onion and garlic",
    },
    image: "./images/ndole.jpeg",
    nutrition_facts: {
      serving_size: "1 cup",
      calories: "300",
      total_fat: "18g",
      saturated_fat: "6g",
      trans_fat: "0g",
      cholesterol: "75mg",
      sodium: "250mg",
      total_carbohydrate: "10g",
      dietary_fiber: "4g",
      total_sugars: "3g",
      added_sugars: "0g",
      protein: "20g",
      vitamin_a: "40%",
      vitamin_c: "30%",
      calcium: "6%",
      iron: "15%",
    },
    category: "lunch",
    subcategory: "meal",
  },
  {
    meal: "Hibiscus Iced Tea (Zobo)",
    recipe: {
      ingredients: [
        "1 cup dried hibiscus flowers",
        "6 cups water",
        "1/2 orange peel",
        "1/4 inch ginger, sliced",
        "Optional: Cloves, cinnamon stick",
        "Optional: Honey or agave (to taste)",
      ],
      instructions:
        "Boil water with hibiscus, orange peel, ginger, and spices (if using). Simmer 15 mins. Strain. Sweeten (optional). Chill and serve.",
    },
    image: "./images/hibiscustea.jpg",
    nutrition_facts: {
      serving_size: "1 cup",
      calories: "15",
      total_fat: "0g",
      saturated_fat: "0g",
      trans_fat: "0g",
      cholesterol: "0mg",
      sodium: "2mg",
      total_carbohydrate: "4g",
      dietary_fiber: "0g",
      total_sugars: "1g",
      added_sugars: "0g",
      protein: "0g",
      vitamin_c: "10%",
      iron: "2%",
    },
    category: "lunch",
    subcategory: "drink",
  },

  // Dinner category
  {
    meal: "Egusi Soup with Fufu",
    recipe: {
      ingredients: [
        "1 cup of egusi seeds",
        "2 cups of water",
        "1 onion",
        "2 cloves of garlic",
        "1 pound of meat or fish",
        "Salt",
      ],
      instructions: "Boil the egusi seeds and meat or fish",
    },
    image: "./images/egusisoup.jpeg",
    nutrition_facts: {
      serving_size: "1 cup soup with 1 cup fufu",
      calories: "450",
      total_fat: "30g",
      saturated_fat: "10g",
      trans_fat: "0g",
      cholesterol: "80mg",
      sodium: "350mg",
      total_carbohydrate: "30g",
      dietary_fiber: "4g",
      total_sugars: "3g",
      added_sugars: "0g",
      protein: "20g",
      vitamin_c: "15%",
      vitamin_e: "12%",
      iron: "8%",
    },
    category: "dinner",
    subcategory: "meal",
  },
  {
    meal: "Cucumber Mint Refresher",
    recipe: {
      ingredients: [
        "1 cucumber, peeled",
        "1/4 cup fresh mint leaves",
        "1/2 lime, juiced",
        "4 cups water",
        "Optional: a pinch of salt",
      ],
      instructions:
        "Blend all ingredients until smooth. Strain (optional). Serve chilled with a cucumber slice.",
    },
    image: "./images/cucumbermint.jpeg",
    nutrition_facts: {
      serving_size: "1 cup",
      calories: "20",
      total_fat: "0g",
      saturated_fat: "0g",
      trans_fat: "0g",
      cholesterol: "0mg",
      sodium: "5mg",
      total_carbohydrate: "5g",
      dietary_fiber: "1g",
      total_sugars: "2g",
      added_sugars: "0g",
      protein: "0g",
      vitamin_k: "10%",
    },
    category: "dinner",
    subcategory: "drink",
  },
  {
    meal: "Suya (Grilled Meat Skewers) with Vegetables",
    recipe: {
      ingredients: [
        "1 pound of meat",
        "2 onions",
        "2 tomatoes",
        "1 bell pepper",
        "Salt",
      ],
      instructions: "Grill the meat and vegetables",
    },
    image: "./images/meat.jpg",
    nutrition_facts: {
      serving_size: "2 skewers",
      calories: "300",
      total_fat: "18g",
      saturated_fat: "6g",
      trans_fat: "0g",
      cholesterol: "90mg",
      sodium: "250mg",
      total_carbohydrate: "10g",
      dietary_fiber: "2g",
      total_sugars: "5g",
      added_sugars: "0g",
      protein: "25g",
      vitamin_a: "20%",
      vitamin_c: "30%",
      iron: "10%",
    },
    category: "dinner",
    subcategory: "meal",
  },
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default when deployed.
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exported by default when deployed.
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      // Create client with Auth context of the user that called the function.
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get meal categories or create them if they don't exist
    const { data: existingCategories } = await supabaseClient
      .from("meal_categories")
      .select("*");

    // Create a map of categories
    const categories = {
      breakfast: "",
      lunch: "",
      dinner: "",
    };

    // If categories don't exist, create them
    if (!existingCategories || existingCategories.length === 0) {
      for (const category of Object.keys(categories)) {
        const { data: newCategory, error } = await supabaseClient
          .from("meal_categories")
          .insert({
            name: category.charAt(0).toUpperCase() + category.slice(1),
          })
          .select()
          .single();

        if (error) {
          console.error(`Error creating ${category} category:`, error);
          continue;
        }

        categories[category] = newCategory.id;
      }
    } else {
      // Map existing categories
      for (const category of existingCategories) {
        const lowerCaseName = category.name.toLowerCase();
        if (
          lowerCaseName === "breakfast" ||
          lowerCaseName === "lunch" ||
          lowerCaseName === "dinner"
        ) {
          categories[lowerCaseName] = category.id;
        }
      }
    }

    // Get meal subcategories or create them if they don't exist
    const { data: existingSubcategories } = await supabaseClient
      .from("meal_subcategories")
      .select("*");

    // Create a map of subcategories
    const subcategories = {
      meal: "",
      snack: "",
      drink: "",
    };

    // If subcategories don't exist, create them
    if (!existingSubcategories || existingSubcategories.length === 0) {
      for (const subcategory of Object.keys(subcategories)) {
        const { data: newSubcategory, error } = await supabaseClient
          .from("meal_subcategories")
          .insert({
            name: subcategory.charAt(0).toUpperCase() + subcategory.slice(1),
          })
          .select()
          .single();

        if (error) {
          console.error(`Error creating ${subcategory} subcategory:`, error);
          continue;
        }

        subcategories[subcategory] = newSubcategory.id;
      }
    } else {
      // Map existing subcategories
      for (const subcategory of existingSubcategories) {
        const lowerCaseName = subcategory.name.toLowerCase();
        if (
          lowerCaseName === "meal" ||
          lowerCaseName === "snack" ||
          lowerCaseName === "drink"
        ) {
          subcategories[lowerCaseName] = subcategory.id;
        }
      }
    }

    // Process meals
    const results = [];
    for (const meal of mealsData) {
      try {
        // Insert the meal with full storage URL
        const categoryId = categories[meal.category] || categories.lunch;
        const subcategoryId =
          subcategories[meal.subcategory] || subcategories.meal;

        const imageUrl = meal.image_url
          ? `https://jyjtphsqtfdqrcsjzzoh.supabase.co/storage/v1/s3/tastehealth-store/${meal.image_url}`
          : null;

        const { data: mealData, error: mealError } = await supabaseClient
          .from("meals")
          .insert({
            meal_name: meal.meal,
            image_url: imageUrl,
            category_id: categoryId,
            subcategory_id: subcategoryId,
          })
          .select()
          .single();

        if (mealError) {
          console.error(`Error inserting meal ${meal.meal}:`, mealError);
          results.push({
            meal: meal.meal,
            status: "error",
            message: mealError.message,
          });
          continue;
        }

        // Insert the recipe
        const { data: recipeData, error: recipeError } = await supabaseClient
          .from("recipes")
          .insert({
            meal_id: mealData.id,
            instructions: meal.recipe.instructions,
          })
          .select()
          .single();

        if (recipeError) {
          console.error(
            `Error inserting recipe for ${meal.meal}:`,
            recipeError
          );
          results.push({
            meal: meal.meal,
            status: "partial",
            message: "Meal created but recipe failed",
          });
          continue;
        }

        // Insert ingredients
        for (const ingredientName of meal.recipe.ingredients) {
          // Check if ingredient exists
          const { data: existingIngredient } = await supabaseClient
            .from("ingredients")
            .select("*")
            .eq("name", ingredientName)
            .maybeSingle();

          let ingredientId;

          if (existingIngredient) {
            ingredientId = existingIngredient.id;
          } else {
            // Create the ingredient
            const { data: newIngredient, error: ingredientError } =
              await supabaseClient
                .from("ingredients")
                .insert({ name: ingredientName })
                .select()
                .single();

            if (ingredientError) {
              console.error(
                `Error inserting ingredient ${ingredientName}:`,
                ingredientError
              );
              continue;
            }

            ingredientId = newIngredient.id;
          }

          // Create recipe-ingredient relationship
          await supabaseClient.from("recipe_ingredients").insert({
            recipe_id: recipeData.id,
            ingredient_id: ingredientId,
            quantity: "1", // Default quantity
          });
        }

        // Insert nutrition facts
        const nutritionFacts = meal.nutrition_facts;
        const {
          serving_size,
          calories,
          total_fat,
          saturated_fat,
          trans_fat,
          cholesterol,
          sodium,
          total_carbohydrate,
          dietary_fiber,
          total_sugars,
          added_sugars,
          protein,
          ...additionalNutrients
        } = nutritionFacts;

        const { error: nutritionError } = await supabaseClient
          .from("nutrition_facts")
          .insert({
            meal_id: mealData.id,
            serving_size,
            calories,
            total_fat,
            saturated_fat,
            trans_fat,
            cholesterol,
            sodium,
            total_carbohydrate,
            dietary_fiber,
            total_sugars,
            added_sugars,
            protein,
            additional_nutrients: additionalNutrients,
          });

        if (nutritionError) {
          console.error(
            `Error inserting nutrition facts for ${meal.meal}:`,
            nutritionError
          );
          results.push({
            meal: meal.meal,
            status: "partial",
            message: "Meal created but nutrition facts failed",
          });
          continue;
        }

        results.push({ meal: meal.meal, status: "success" });
      } catch (error) {
        console.error(`Error processing meal ${meal.meal}:`, error);
        results.push({
          meal: meal.meal,
          status: "error",
          message: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${results.length} meals`,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
