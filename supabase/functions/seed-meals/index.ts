// Follow Deno runtime specifics
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Sample meal data
const mealCategories = [
  { name: "Breakfast" },
  { name: "Lunch" },
  { name: "Dinner" },
  { name: "Snacks" },
  { name: "Desserts" },
  { name: "Beverages" },
];

const mealSubcategories = [
  { name: "Vegetarian" },
  { name: "Vegan" },
  { name: "Gluten-Free" },
  { name: "Low-Carb" },
  { name: "Keto" },
  { name: "High-Protein" },
  { name: "Dairy-Free" },
  { name: "Nut-Free" },
];

const sampleMeals = [
  {
    name: "Greek Yogurt with Berries",
    category: "Breakfast",
    subcategory: "High-Protein",
    image: "greek-yogurt-berries.jpg",
    instructions: "1. Add Greek yogurt to a bowl\n2. Top with mixed berries\n3. Optionally add honey and granola",
    ingredients: [
      { name: "Greek Yogurt", quantity: "1 cup" },
      { name: "Mixed Berries", quantity: "1/2 cup" },
      { name: "Honey", quantity: "1 tbsp" },
      { name: "Granola", quantity: "1/4 cup" }
    ],
    nutrition: {
      serving_size: "1 bowl",
      calories: "250",
      protein: "15g",
      total_fat: "6g",
      saturated_fat: "3g",
      trans_fat: "0g",
      cholesterol: "15mg",
      sodium: "70mg",
      total_carbohydrate: "35g",
      dietary_fiber: "4g",
      total_sugars: "20g",
      added_sugars: "5g"
    }
  },
  {
    name: "Avocado Toast",
    category: "Breakfast",
    subcategory: "Vegetarian",
    image: "avocado-toast.jpg",
    instructions: "1. Toast bread until golden\n2. Mash avocado and spread on toast\n3. Top with salt, pepper, and red pepper flakes\n4. Optional: add poached egg on top",
    ingredients: [
      { name: "Whole Grain Bread", quantity: "2 slices" },
      { name: "Avocado", quantity: "1 medium" },
      { name: "Salt", quantity: "1/4 tsp" },
      { name: "Pepper", quantity: "1/4 tsp" },
      { name: "Red Pepper Flakes", quantity: "1/4 tsp" },
      { name: "Eggs", quantity: "2 (optional)" }
    ],
    nutrition: {
      serving_size: "2 slices",
      calories: "320",
      protein: "9g",
      total_fat: "22g",
      saturated_fat: "3g",
      trans_fat: "0g",
      cholesterol: "0mg",
      sodium: "390mg",
      total_carbohydrate: "30g",
      dietary_fiber: "12g",
      total_sugars: "2g",
      added_sugars: "0g"
    }
  },
  {
    name: "Chicken Caesar Salad",
    category: "Lunch",
    subcategory: "High-Protein",
    image: "chicken-caesar-salad.jpg",
    instructions: "1. Grill chicken breast and slice\n2. Wash and chop romaine lettuce\n3. Toss with Caesar dressing\n4. Add croutons and parmesan cheese\n5. Top with sliced chicken",
    ingredients: [
      { name: "Chicken Breast", quantity: "1 (6oz)" },
      { name: "Romaine Lettuce", quantity: "2 cups" },
      { name: "Caesar Dressing", quantity: "2 tbsp" },
      { name: "Croutons", quantity: "1/4 cup" },
      { name: "Parmesan Cheese", quantity: "2 tbsp" }
    ],
    nutrition: {
      serving_size: "1 salad",
      calories: "350",
      protein: "30g",
      total_fat: "18g",
      saturated_fat: "4g",
      trans_fat: "0g",
      cholesterol: "75mg",
      sodium: "620mg",
      total_carbohydrate: "12g",
      dietary_fiber: "3g",
      total_sugars: "2g",
      added_sugars: "0g"
    }
  },
  {
    name: "Quinoa Veggie Bowl",
    category: "Lunch",
    subcategory: "Vegan",
    image: "quinoa-veggie-bowl.jpg",
    instructions: "1. Cook quinoa according to package instructions\n2. Roast or sauté vegetables\n3. Add beans of choice\n4. Combine all ingredients in a bowl\n5. Top with dressing or sauce of choice",
    ingredients: [
      { name: "Quinoa", quantity: "1/2 cup dry" },
      { name: "Mixed Vegetables", quantity: "2 cups" },
      { name: "Black Beans", quantity: "1/2 cup" },
      { name: "Olive Oil", quantity: "1 tbsp" },
      { name: "Lemon Juice", quantity: "1 tbsp" },
      { name: "Salt & Pepper", quantity: "to taste" }
    ],
    nutrition: {
      serving_size: "1 bowl",
      calories: "420",
      protein: "14g",
      total_fat: "15g",
      saturated_fat: "2g",
      trans_fat: "0g",
      cholesterol: "0mg",
      sodium: "290mg",
      total_carbohydrate: "60g",
      dietary_fiber: "12g",
      total_sugars: "4g",
      added_sugars: "0g"
    }
  },
  {
    name: "Salmon with Roasted Vegetables",
    category: "Dinner",
    subcategory: "Low-Carb",
    image: "salmon-roasted-vegetables.jpg",
    instructions: "1. Preheat oven to 400°F\n2. Season salmon with salt, pepper, and herbs\n3. Cut vegetables and toss with olive oil\n4. Roast salmon and vegetables for 15-20 minutes\n5. Serve with lemon wedges",
    ingredients: [
      { name: "Salmon Fillet", quantity: "6oz" },
      { name: "Broccoli", quantity: "1 cup" },
      { name: "Bell Peppers", quantity: "1 medium" },
      { name: "Olive Oil", quantity: "2 tbsp" },
      { name: "Lemon", quantity: "1/2" },
      { name: "Herbs", quantity: "to taste" },
      { name: "Salt & Pepper", quantity: "to taste" }
    ],
    nutrition: {
      serving_size: "1 serving",
      calories: "480",
      protein: "36g",
      total_fat: "28g",
      saturated_fat: "5g",
      trans_fat: "0g",
      cholesterol: "95mg",
      sodium: "140mg",
      total_carbohydrate: "15g",
      dietary_fiber: "5g",
      total_sugars: "8g",
      added_sugars: "0g"
    }
  },
  {
    name: "Vegetarian Chili",
    category: "Dinner",
    subcategory: "Vegetarian",
    image: "vegetarian-chili.jpg",
    instructions: "1. Sauté onions and garlic in olive oil\n2. Add diced vegetables and cook until soft\n3. Add beans, tomatoes, and spices\n4. Simmer for 30 minutes\n5. Serve with toppings of choice",
    ingredients: [
      { name: "Kidney Beans", quantity: "1 can" },
      { name: "Black Beans", quantity: "1 can" },
      { name: "Diced Tomatoes", quantity: "1 can" },
      { name: "Onion", quantity: "1 medium" },
      { name: "Bell Pepper", quantity: "1 medium" },
      { name: "Garlic", quantity: "3 cloves" },
      { name: "Chili Powder", quantity: "2 tbsp" },
      { name: "Cumin", quantity: "1 tbsp" }
    ],
    nutrition: {
      serving_size: "1 cup",
      calories: "280",
      protein: "14g",
      total_fat: "5g",
      saturated_fat: "1g",
      trans_fat: "0g",
      cholesterol: "0mg",
      sodium: "480mg",
      total_carbohydrate: "45g",
      dietary_fiber: "15g",
      total_sugars: "7g",
      added_sugars: "0g"
    }
  },
  {
    name: "Trail Mix",
    category: "Snacks",
    subcategory: "High-Protein",
    image: "trail-mix.jpg",
    instructions: "1. Mix all ingredients in a bowl\n2. Store in airtight container",
    ingredients: [
      { name: "Almonds", quantity: "1/4 cup" },
      { name: "Walnuts", quantity: "1/4 cup" },
      { name: "Dried Cranberries", quantity: "1/4 cup" },
      { name: "Dark Chocolate Chips", quantity: "2 tbsp" },
      { name: "Sunflower Seeds", quantity: "2 tbsp" }
    ],
    nutrition: {
      serving_size: "1/4 cup",
      calories: "170",
      protein: "5g",
      total_fat: "12g",
      saturated_fat: "2g",
      trans_fat: "0g",
      cholesterol: "0mg",
      sodium: "5mg",
      total_carbohydrate: "12g",
      dietary_fiber: "3g",
      total_sugars: "8g",
      added_sugars: "5g"
    }
  },
  {
    name: "Berry Smoothie",
    category: "Beverages",
    subcategory: "Vegetarian",
    image: "berry-smoothie.jpg",
    instructions: "1. Add all ingredients to blender\n2. Blend until smooth\n3. Serve immediately",
    ingredients: [
      { name: "Mixed Berries", quantity: "1 cup" },
      { name: "Banana", quantity: "1/2" },
      { name: "Greek Yogurt", quantity: "1/2 cup" },
      { name: "Almond Milk", quantity: "1 cup" },
      { name: "Honey", quantity: "1 tbsp" },
      { name: "Ice", quantity: "1/2 cup" }
    ],
    nutrition: {
      serving_size: "16 oz",
      calories: "220",
      protein: "10g",
      total_fat: "4g",
      saturated_fat: "1g",
      trans_fat: "0g",
      cholesterol: "5mg",
      sodium: "120mg",
      total_carbohydrate: "40g",
      dietary_fiber: "6g",
      total_sugars: "28g",
      added_sugars: "12g"
    }
  },
  {
    name: "Dark Chocolate Avocado Mousse",
    category: "Desserts",
    subcategory: "Vegan",
    image: "dark-chocolate-avocado-mousse.jpg",
    instructions: "1. Blend ripe avocados until smooth\n2. Add cocoa powder, maple syrup and vanilla\n3. Blend again until creamy\n4. Chill for at least 30 minutes\n5. Serve with berries",
    ingredients: [
      { name: "Avocados", quantity: "2 ripe" },
      { name: "Unsweetened Cocoa Powder", quantity: "1/4 cup" },
      { name: "Maple Syrup", quantity: "1/4 cup" },
      { name: "Vanilla Extract", quantity: "1 tsp" },
      { name: "Salt", quantity: "pinch" },
      { name: "Berries", quantity: "1/4 cup" }
    ],
    nutrition: {
      serving_size: "1/2 cup",
      calories: "210",
      protein: "3g",
      total_fat: "15g",
      saturated_fat: "3g",
      trans_fat: "0g",
      cholesterol: "0mg",
      sodium: "60mg",
      total_carbohydrate: "20g",
      dietary_fiber: "8g",
      total_sugars: "10g",
      added_sugars: "7g"
    }
  },
  {
    name: "Steak with Roasted Potatoes",
    category: "Dinner",
    subcategory: "High-Protein",
    image: "steak-roasted-potatoes.jpg",
    instructions: "1. Season steak with salt and pepper\n2. Sear in hot pan to desired doneness\n3. Let rest for 5 minutes before slicing\n4. Toss potatoes with oil and herbs, roast until crispy\n5. Serve steak with potatoes",
    ingredients: [
      { name: "Steak", quantity: "8oz" },
      { name: "Baby Potatoes", quantity: "1 cup" },
      { name: "Olive Oil", quantity: "2 tbsp" },
      { name: "Rosemary", quantity: "1 tsp" },
      { name: "Garlic", quantity: "2 cloves" },
      { name: "Salt & Pepper", quantity: "to taste" }
    ],
    nutrition: {
      serving_size: "1 serving",
      calories: "580",
      protein: "40g",
      total_fat: "35g",
      saturated_fat: "12g",
      trans_fat: "0g",
      cholesterol: "120mg",
      sodium: "320mg",
      total_carbohydrate: "25g",
      dietary_fiber: "3g",
      total_sugars: "1g",
      added_sugars: "0g"
    }
  }
];

async function seedMealData(supabase: any) {
  try {
    console.log("Starting to seed meal data");
    
    // 1. Add categories
    let categoryIdMap = new Map();
    for (const category of mealCategories) {
      const { data: catData, error: catError } = await supabase
        .from('meal_categories')
        .insert({ name: category.name })
        .select()
        .single();
      
      if (catError) throw catError;
      categoryIdMap.set(category.name, catData.id);
      console.log(`Added category: ${category.name}`);
    }
    
    // 2. Add subcategories
    let subcategoryIdMap = new Map();
    for (const subcategory of mealSubcategories) {
      const { data: subData, error: subError } = await supabase
        .from('meal_subcategories')
        .insert({ name: subcategory.name })
        .select()
        .single();
      
      if (subError) throw subError;
      subcategoryIdMap.set(subcategory.name, subData.id);
      console.log(`Added subcategory: ${subcategory.name}`);
    }
    
    // 3. Add meals with recipes and nutrition facts
    for (const meal of sampleMeals) {
      try {
        // Create meal with full storage URL
        const imageUrl = meal.image ? 
          `https://jyjtphsqtfdqrcsjzzoh.supabase.co/storage/v1/s3/tastehealth-store${meal.image}` 
          : null;

        const { data: mealData, error: mealError } = await supabase
          .from('meals')
          .insert({
            meal_name: meal.name,
            image_url: imageUrl,
            category_id: categoryIdMap.get(meal.category),
            subcategory_id: subcategoryIdMap.get(meal.subcategory)
          })
          .select()
          .single();
      
        if (mealError) throw mealError;
        console.log(`Added meal: ${meal.name}`);
        
        // Create recipe
        const { data: recipeData, error: recipeError } = await supabase
          .from('recipes')
          .insert({
            meal_id: mealData.id,
            instructions: meal.instructions
          })
          .select()
          .single();
      
        if (recipeError) throw recipeError;
        
        // Create ingredients and link to recipe
        for (const ingredient of meal.ingredients) {
          // Check if ingredient exists
          let { data: existingIngredient } = await supabase
            .from('ingredients')
            .select('*')
            .eq('name', ingredient.name)
            .maybeSingle();
        
          let ingredientId;
          if (!existingIngredient) {
            const { data: newIngredient, error: ingredientError } = await supabase
              .from('ingredients')
              .insert({ name: ingredient.name })
              .select()
              .single();
          
            if (ingredientError) throw ingredientError;
            ingredientId = newIngredient.id;
          } else {
            ingredientId = existingIngredient.id;
          }
        
          // Link ingredient to recipe
          await supabase
            .from('recipe_ingredients')
            .insert({
              recipe_id: recipeData.id,
              ingredient_id: ingredientId,
              quantity: ingredient.quantity
            });
        }
        
        // Create nutrition facts
        await supabase
          .from('nutrition_facts')
          .insert({
            meal_id: mealData.id,
            serving_size: meal.nutrition.serving_size,
            calories: meal.nutrition.calories,
            total_fat: meal.nutrition.total_fat,
            saturated_fat: meal.nutrition.saturated_fat,
            trans_fat: meal.nutrition.trans_fat,
            cholesterol: meal.nutrition.cholesterol,
            sodium: meal.nutrition.sodium,
            total_carbohydrate: meal.nutrition.total_carbohydrate,
            dietary_fiber: meal.nutrition.dietary_fiber,
            total_sugars: meal.nutrition.total_sugars,
            added_sugars: meal.nutrition.added_sugars,
            protein: meal.nutrition.protein
          });
        
        console.log(`Added recipe and nutrition for: ${meal.name}`);
      } catch (error) {
        console.error("Error seeding meal data:", error);
        return { success: false, error: error.message };
      }
    }
    
    return { success: true, message: "Successfully seeded meal data" };
  } catch (error) {
    console.error("Error seeding meal data:", error);
    return { success: false, error: error.message };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      // Supabase API URL - env var exposed by default in Deno deployments
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exposed by default in Deno deployments
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies will work.
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Execute the seeding function
    const result = await seedMealData(supabaseClient);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 500
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
