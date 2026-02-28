
export interface MealDBItem {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'drinks';
  recipe: {
    ingredients: string[];
    method: string[];
  };
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
}

export const MEAL_DATABASE: MealDBItem[] = [
  // BREAKFAST
  {
    id: 'b1', name: 'Classic Oatmeal Bowl', description: 'Warm oats topped with fresh berries and honey',
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&auto=format',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 cup rolled oats', '2 cups water or milk', '1/2 cup mixed berries', '1 tbsp honey', '1 tbsp chia seeds', 'Pinch of cinnamon'],
      method: ['Bring water/milk to a boil in a saucepan.', 'Add oats and reduce heat to medium-low.', 'Cook for 5 minutes, stirring occasionally.', 'Top with berries, honey, chia seeds, and cinnamon.']
    },
    nutrition: { calories: 320, protein: 10, carbs: 55, fats: 6, fiber: 8, sugar: 15, sodium: 10 }
  },
  {
    id: 'b2', name: 'Avocado Toast', description: 'Smashed avocado on sourdough with poached egg',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&auto=format',
    category: 'breakfast',
    recipe: {
      ingredients: ['2 slices sourdough bread', '1 ripe avocado', '2 eggs', '1 tbsp lemon juice', 'Salt & pepper', 'Red pepper flakes'],
      method: ['Toast sourdough until golden.', 'Mash avocado with lemon juice, salt, and pepper.', 'Poach eggs in simmering water for 3-4 minutes.', 'Spread avocado on toast and top with poached egg.', 'Garnish with red pepper flakes.']
    },
    nutrition: { calories: 420, protein: 18, carbs: 35, fats: 24, fiber: 10, sugar: 3, sodium: 380 }
  },
  {
    id: 'b3', name: 'Greek Yogurt Parfait', description: 'Layered yogurt with granola and fresh fruit',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 cup Greek yogurt', '1/2 cup granola', '1/2 cup mixed berries', '1 tbsp honey', '1 tbsp sliced almonds'],
      method: ['Layer yogurt at the bottom of a glass.', 'Add a layer of granola.', 'Add berries.', 'Repeat layers.', 'Drizzle with honey and top with almonds.']
    },
    nutrition: { calories: 350, protein: 20, carbs: 45, fats: 10, fiber: 4, sugar: 25, sodium: 80 }
  },
  {
    id: 'b4', name: 'Spinach & Mushroom Omelette', description: 'Fluffy egg omelette with sautéed vegetables',
    image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&auto=format',
    category: 'breakfast',
    recipe: {
      ingredients: ['3 eggs', '1 cup fresh spinach', '1/2 cup sliced mushrooms', '1/4 cup shredded cheese', '1 tbsp butter', 'Salt & pepper'],
      method: ['Beat eggs with salt and pepper.', 'Sauté mushrooms in butter until golden.', 'Add spinach and cook until wilted.', 'Pour eggs over vegetables.', 'Cook until set, add cheese, and fold in half.']
    },
    nutrition: { calories: 380, protein: 28, carbs: 5, fats: 28, fiber: 2, sugar: 2, sodium: 520 }
  },
  // LUNCH
  {
    id: 'l1', name: 'Grilled Chicken Caesar Salad', description: 'Crisp romaine with grilled chicken and parmesan',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&auto=format',
    category: 'lunch',
    recipe: {
      ingredients: ['200g grilled chicken breast', '2 cups romaine lettuce', '1/4 cup parmesan shavings', '1/2 cup croutons', '3 tbsp Caesar dressing', '1 lemon wedge'],
      method: ['Grill chicken breast until cooked through, slice.', 'Chop romaine lettuce and place in bowl.', 'Top with chicken, parmesan, and croutons.', 'Drizzle with Caesar dressing.', 'Squeeze lemon over the top.']
    },
    nutrition: { calories: 450, protein: 42, carbs: 18, fats: 22, fiber: 3, sugar: 4, sodium: 680 }
  },
  {
    id: 'l2', name: 'Quinoa Buddha Bowl', description: 'Nutrient-rich bowl with roasted vegetables and tahini',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format',
    category: 'lunch',
    recipe: {
      ingredients: ['1 cup cooked quinoa', '1/2 cup roasted sweet potato', '1/2 cup chickpeas', '1 cup mixed greens', '1/4 avocado', '2 tbsp tahini dressing'],
      method: ['Cook quinoa according to package directions.', 'Roast sweet potato cubes at 200°C for 25 minutes.', 'Arrange quinoa, sweet potato, chickpeas, and greens in bowl.', 'Top with sliced avocado.', 'Drizzle with tahini dressing.']
    },
    nutrition: { calories: 520, protein: 18, carbs: 65, fats: 20, fiber: 12, sugar: 8, sodium: 320 }
  },
  {
    id: 'l3', name: 'Turkey & Avocado Wrap', description: 'Whole wheat wrap with fresh vegetables',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&auto=format',
    category: 'lunch',
    recipe: {
      ingredients: ['1 whole wheat tortilla', '100g sliced turkey', '1/2 avocado', '1/4 cup shredded lettuce', '2 tomato slices', '1 tbsp mustard'],
      method: ['Lay tortilla flat and spread mustard.', 'Layer turkey, avocado slices, lettuce, and tomato.', 'Roll tightly, tucking in edges.', 'Cut in half diagonally.']
    },
    nutrition: { calories: 380, protein: 28, carbs: 30, fats: 16, fiber: 8, sugar: 3, sodium: 720 }
  },
  {
    id: 'l4', name: 'Tomato Basil Soup', description: 'Creamy tomato soup with fresh basil and crusty bread',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&auto=format',
    category: 'lunch',
    recipe: {
      ingredients: ['6 ripe tomatoes', '1 onion diced', '3 cloves garlic', '1 cup vegetable broth', '1/4 cup fresh basil', '2 tbsp olive oil', 'Salt & pepper'],
      method: ['Sauté onion and garlic in olive oil.', 'Add chopped tomatoes and broth.', 'Simmer for 20 minutes.', 'Blend until smooth.', 'Stir in fresh basil and season to taste.']
    },
    nutrition: { calories: 220, protein: 5, carbs: 28, fats: 10, fiber: 5, sugar: 16, sodium: 480 }
  },
  // DINNER
  {
    id: 'd1', name: 'Grilled Salmon with Vegetables', description: 'Herb-crusted salmon fillet with seasonal vegetables',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&auto=format',
    category: 'dinner',
    recipe: {
      ingredients: ['200g salmon fillet', '1 cup broccoli florets', '1 cup asparagus', '2 tbsp olive oil', '1 lemon', '2 cloves garlic minced', 'Dill, salt & pepper'],
      method: ['Preheat oven to 200°C.', 'Season salmon with garlic, dill, salt, pepper, and lemon juice.', 'Toss vegetables in olive oil and season.', 'Place salmon and vegetables on baking sheet.', 'Bake for 15-18 minutes until salmon flakes easily.']
    },
    nutrition: { calories: 480, protein: 42, carbs: 12, fats: 28, fiber: 5, sugar: 3, sodium: 340 }
  },
  {
    id: 'd2', name: 'Chicken Stir-Fry', description: 'Colorful stir-fry with tender chicken and crisp vegetables',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format',
    category: 'dinner',
    recipe: {
      ingredients: ['200g chicken breast sliced', '1 bell pepper sliced', '1 cup broccoli', '1 carrot julienned', '3 tbsp soy sauce', '1 tbsp sesame oil', '1 tbsp ginger grated', '2 cups steamed rice'],
      method: ['Heat sesame oil in a wok over high heat.', 'Cook chicken until golden, remove and set aside.', 'Stir-fry vegetables for 3-4 minutes.', 'Return chicken, add soy sauce and ginger.', 'Toss everything together and serve over rice.']
    },
    nutrition: { calories: 550, protein: 38, carbs: 55, fats: 16, fiber: 6, sugar: 8, sodium: 920 }
  },
  {
    id: 'd3', name: 'Beef Tacos', description: 'Seasoned ground beef with fresh toppings in corn tortillas',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format',
    category: 'dinner',
    recipe: {
      ingredients: ['250g ground beef', '4 corn tortillas', '1/2 cup diced tomatoes', '1/4 cup diced onion', '1/2 cup shredded lettuce', '1/4 cup shredded cheese', '2 tbsp taco seasoning', 'Sour cream & salsa'],
      method: ['Cook ground beef in a skillet over medium heat.', 'Add taco seasoning and 1/4 cup water.', 'Simmer for 5 minutes.', 'Warm tortillas in a dry pan.', 'Fill tortillas with beef and desired toppings.']
    },
    nutrition: { calories: 520, protein: 32, carbs: 38, fats: 26, fiber: 5, sugar: 4, sodium: 780 }
  },
  {
    id: 'd4', name: 'Vegetable Pasta Primavera', description: 'Penne pasta with seasonal vegetables in garlic olive oil',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&auto=format',
    category: 'dinner',
    recipe: {
      ingredients: ['200g penne pasta', '1 zucchini sliced', '1 bell pepper diced', '1 cup cherry tomatoes', '3 cloves garlic', '3 tbsp olive oil', '1/4 cup parmesan', 'Fresh basil'],
      method: ['Cook pasta according to package directions.', 'Sauté garlic in olive oil for 1 minute.', 'Add zucchini and bell pepper, cook 5 minutes.', 'Add cherry tomatoes and cook until softened.', 'Toss pasta with vegetables, top with parmesan and basil.']
    },
    nutrition: { calories: 480, protein: 16, carbs: 62, fats: 18, fiber: 6, sugar: 8, sodium: 320 }
  },
  // SNACKS
  {
    id: 's1', name: 'Mixed Nuts & Dried Fruit', description: 'A healthy mix of almonds, walnuts, and dried cranberries',
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=400&auto=format',
    category: 'snacks',
    recipe: {
      ingredients: ['1/4 cup almonds', '1/4 cup walnuts', '2 tbsp dried cranberries', '1 tbsp pumpkin seeds', 'Pinch of sea salt'],
      method: ['Combine all ingredients in a bowl.', 'Toss with a pinch of sea salt.', 'Store in an airtight container for grab-and-go snacking.']
    },
    nutrition: { calories: 280, protein: 8, carbs: 18, fats: 22, fiber: 4, sugar: 10, sodium: 50 }
  },
  {
    id: 's2', name: 'Hummus & Veggie Sticks', description: 'Creamy hummus served with fresh cut vegetables',
    image: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=400&auto=format',
    category: 'snacks',
    recipe: {
      ingredients: ['1/2 cup hummus', '1 carrot cut into sticks', '1 cucumber cut into sticks', '1 celery stalk cut into sticks', '1/2 bell pepper sliced'],
      method: ['Wash and cut all vegetables into sticks.', 'Arrange vegetables on a plate around a bowl of hummus.', 'Dip and enjoy!']
    },
    nutrition: { calories: 180, protein: 7, carbs: 22, fats: 8, fiber: 6, sugar: 6, sodium: 320 }
  },
  {
    id: 's3', name: 'Energy Protein Balls', description: 'No-bake oat balls with peanut butter and chocolate chips',
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&auto=format',
    category: 'snacks',
    recipe: {
      ingredients: ['1 cup rolled oats', '1/2 cup peanut butter', '1/3 cup honey', '1/4 cup chocolate chips', '2 tbsp flaxseed', '1 tsp vanilla extract'],
      method: ['Mix all ingredients in a bowl.', 'Refrigerate for 30 minutes.', 'Roll into 12 small balls.', 'Store in the fridge for up to one week.']
    },
    nutrition: { calories: 150, protein: 5, carbs: 18, fats: 7, fiber: 2, sugar: 10, sodium: 45 }
  },
  // DRINKS
  {
    id: 'dr1', name: 'Green Detox Smoothie', description: 'Refreshing blend of spinach, banana, and ginger',
    image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&auto=format',
    category: 'drinks',
    recipe: {
      ingredients: ['1 cup fresh spinach', '1 banana', '1/2 cup mango chunks', '1 cup almond milk', '1 tsp fresh ginger', '1 tbsp chia seeds', 'Ice cubes'],
      method: ['Add all ingredients to a blender.', 'Blend on high until smooth.', 'Add ice cubes and blend again.', 'Pour into a glass and serve immediately.']
    },
    nutrition: { calories: 220, protein: 6, carbs: 42, fats: 5, fiber: 7, sugar: 24, sodium: 160 }
  },
  {
    id: 'dr2', name: 'Berry Protein Shake', description: 'High-protein shake with mixed berries and whey',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&auto=format',
    category: 'drinks',
    recipe: {
      ingredients: ['1 scoop whey protein', '1 cup mixed berries', '1 cup milk', '1 tbsp almond butter', '1/2 banana', 'Ice cubes'],
      method: ['Add protein powder, berries, milk, almond butter, and banana to blender.', 'Add ice cubes.', 'Blend until smooth and creamy.', 'Pour into a tall glass.']
    },
    nutrition: { calories: 350, protein: 30, carbs: 35, fats: 10, fiber: 5, sugar: 20, sodium: 200 }
  },
  {
    id: 'dr3', name: 'Golden Turmeric Latte', description: 'Warm anti-inflammatory drink with turmeric and spices',
    image: 'https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb?w=400&auto=format',
    category: 'drinks',
    recipe: {
      ingredients: ['1 cup milk (any type)', '1 tsp turmeric powder', '1/2 tsp cinnamon', '1/4 tsp ginger', 'Pinch of black pepper', '1 tsp honey'],
      method: ['Heat milk in a saucepan.', 'Add turmeric, cinnamon, ginger, and black pepper.', 'Whisk until well combined and heated through.', 'Sweeten with honey.', 'Pour into a mug and enjoy warm.']
    },
    nutrition: { calories: 120, protein: 4, carbs: 16, fats: 4, fiber: 1, sugar: 12, sodium: 80 }
  },
];

export const MEAL_CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snacks', 'drinks'] as const;
export type MealCategory = typeof MEAL_CATEGORIES[number];
