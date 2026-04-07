export interface MealDBItem {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'drinks' | 'fruits';
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
  // ==================== BREAKFAST (b1 - b50) ====================
  {
    id: 'b1',
    name: 'Achu & Yellow Soup',
    description: 'Pounded cocoyam served with vibrant yellow soup made from palm oil, beef broth, and limestone solution.',
    image: '/meals/achu.jpg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 kg Achu cocoyam (Taro)', 'water for boiling', '1 cup heated palm oil', '2 cups beef broth', '1½ tbsp Achu spice mix', '⅓ cup limestone solution (kangwa mix)', 'salt to taste', 'bouillon cube', 'Boiled garden eggs for serving', 'Njama Njama (huckleberry leaves) for serving'],
      method: ['Wash cocoyams thoroughly.', 'Boil until very tender (2-3 hours).', 'Peel while still hot.', 'Pound cocoyams in a mortar until completely smooth and elastic.', 'Shape into smooth balls.', 'For Yellow Soup: Boil assorted meats to extract rich stock.', 'Heat palm oil just until slightly warm (do not bleach).', 'Dissolve limestone solution in boiling water.', 'In a blender, combine stock, heated oil, limestone solution, and Achu spice mix.', 'Blend briefly until it turns vibrantly yellow and emulsified.', 'Stir in salt and bouillon cubes to taste.', 'Serve Achu fufu with yellow soup, assorted meats, and garden eggs.']
    },
    nutrition: { calories: 720, protein: 32, carbs: 105, fats: 28, fiber: 8, sugar: 4, sodium: 850 }
  },
  {
    id: 'b2',
    name: 'Millet Pap',
    description: 'Nutritious fermented millet porridge served hot with evaporated milk and sugar.',
    image: '/meals/millet pap.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['500g Millet paste', '4 cups water', 'evaporated milk to taste', 'granulated sugar to taste'],
      method: ['Mix millet paste with cold water to thin slightly.', 'Pour into boiling water, stirring constantly.', 'Cook until thick and translucent (5-7 minutes).', 'Serve hot with milk and sugar.']
    },
    nutrition: { calories: 180, protein: 5, carbs: 38, fats: 2, fiber: 4, sugar: 0, sodium: 8 }
  },
  {
    id: 'b3',
    name: 'Garri Soaked',
    description: 'Quick cassava cereal with roasted groundnuts.',
    image: '/meals/drinking garri.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 cup Garri', '½ cup roasted groundnuts', '¼ cup sugar', '1 cup cold water'],
      method: ['Mix garri with cold water.', 'Drain excess water.', 'Stir in sugar.', 'Top with groundnuts.', 'Serve immediately.']
    },
    nutrition: { calories: 290, protein: 4, carbs: 62, fats: 5, fiber: 3, sugar: 25, sodium: 15 }
  },
  {
    id: 'b4',
    name: 'Traditional Omelette',
    description: 'Fluffy Cameroonian-style omelette with tomatoes, onions, and spices.',
    image: '/meals/omelete.jpg',
    category: 'breakfast',
    recipe: {
      ingredients: ['4 eggs', '2 tomatoes', '1 onion', '2 cloves garlic', '¼ tsp pebe', '1 bouillon cube', '2 tbsp oil', 'salt to taste'],
      method: ['Whisk eggs until frothy.', 'Add diced vegetables and spices.', 'Heat oil in pan.', 'Pour egg mixture and cook until set.', 'Fold and serve hot.']
    },
    nutrition: { calories: 280, protein: 18, carbs: 8, fats: 20, fiber: 2, sugar: 4, sodium: 480 }
  },
  {
    id: 'b5',
    name: 'Boiled Yam & Egg Sauce',
    description: 'Tender boiled yam served with rich tomato and egg sauce.',
    image: '/meals/Yam and egg.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 kg yam', '4 eggs', '3 tomatoes', '1 onion', '2 cloves garlic', '¼ tsp pebe', '1 bouillon cube', '2 tbsp palm oil', 'salt'],
      method: ['Boil yam chunks until tender.', 'For sauce: Sauté onions and garlic, add tomatoes.', 'Scramble in eggs, add spices.', 'Serve yam with egg sauce.']
    },
    nutrition: { calories: 550, protein: 16, carbs: 78, fats: 22, fiber: 7, sugar: 4, sodium: 490 }
  },
  {
    id: 'b6',
    name: 'Pancakes',
    description: 'Fluffy breakfast pancakes served with honey or maple syrup.',
    image: '/meals/pancakes.jpg',
    category: 'breakfast',
    recipe: {
      ingredients: ['2 cups flour', '2 tbsp sugar', '1 tbsp baking powder', '½ tsp salt', '2 eggs', '1¾ cups milk', '¼ cup melted butter', '1 tsp vanilla', 'Butter for cooking', 'Honey for serving'],
      method: ['Mix dry ingredients.', 'Whisk wet ingredients separately.', 'Combine until just mixed (lumpy batter).', 'Cook on hot griddle until bubbles form.', 'Flip and cook until golden.', 'Serve with honey.']
    },
    nutrition: { calories: 350, protein: 10, carbs: 45, fats: 14, fiber: 1, sugar: 12, sodium: 480 }
  },
  {
    id: 'b7',
    name: 'Masa with Pepper Sauce',
    description: 'Northern-style fermented rice cakes with spicy pepper sauce.',
    image: '/meals/masa.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['2 cups rice flour', '½ cup sugar', '1 tbsp yeast', '1½ cups warm water', '½ tsp salt', 'oil for frying', 'For sauce: garlic, ginger, pebe, crayfish cubes, oil'],
      method: ['Dissolve yeast and sugar in water.', 'Mix with flour and salt.', 'Ferment overnight.', 'Fry in masa pan until golden.', 'Blend sauce ingredients and fry.', 'Serve masa with sauce.']
    },
    nutrition: { calories: 350, protein: 6, carbs: 68, fats: 5, fiber: 2, sugar: 18, sodium: 410 }
  },
  {
    id: 'b8',
    name: 'Koki Corn',
    description: 'Steamed fresh corn pudding wrapped in banana leaves.',
    image: '/meals/kokicorn.jpg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 kg fresh corn', '½ cup palm oil', '2 cups spinach', '1 tbsp ginger', '2 tbsp crayfish', 'salt', 'banana leaves'],
      method: ['Grate corn and ginger.', 'Whisk vigorously.', 'Add oil, crayfish, salt, spinach.', 'Wrap in banana leaves.', 'Steam 1½-2 hours.', 'Serve with rice fufu.']
    },
    nutrition: { calories: 350, protein: 9, carbs: 52, fats: 12, fiber: 7, sugar: 6, sodium: 420 }
  },
  {
    id: 'b9',
    name: 'Puff Puff & Beans',
    description: 'Deep-fried sweet dough balls with stewed brown beans.',
    image: '/meals/puff puff beans.jpg',
    category: 'breakfast',
    recipe: {
      ingredients: ['4 cups flour', '¾ cup sugar', '2 tsp yeast', '2 cups water', 'oil', '2 cups brown beans', '1 onion', '3 tomatoes', '¼ cup palm oil', '2 crayfish cubes'],
      method: ['Make puff puff batter, let rise.', 'Deep-fry until golden.', 'Boil beans until tender.', 'Sauté onions and tomatoes, add beans.', 'Serve puff puff with beans.']
    },
    nutrition: { calories: 550, protein: 18, carbs: 85, fats: 22, fiber: 12, sugar: 14, sodium: 350 }
  },
  {
    id: 'b10',
    name: 'White Corn Pap',
    description: 'Smooth fermented white corn porridge.',
    image: '/meals/white corn pap.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 cup white corn paste', '3 cups water', 'evaporated milk', 'sugar'],
      method: ['Mix paste with cold water.', 'Pour into boiling water, stirring.', 'Cook until thick.', 'Serve with milk and sugar.']
    },
    nutrition: { calories: 150, protein: 3, carbs: 32, fats: 1, fiber: 2, sugar: 1, sodium: 5 }
  },
  {
    id: 'b11',
    name: 'Akwa',
    description: 'Traditional fermented corn pudding wrapped in leaves.',
    image: '/meals/akwa.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 kg fresh corn', '1 cup palm oil', '2 cups spinach', '1 tbsp ginger', '2 tbsp crayfish', '2 bouillon cubes', 'salt', 'banana leaves'],
      method: ['Grate corn and ginger.', 'Whisk to incorporate air.', 'Add oil, crayfish, spinach.', 'Wrap in banana leaves.', 'Steam 1½-2 hours.', 'Serve warm.']
    },
    nutrition: { calories: 380, protein: 9, carbs: 48, fats: 18, fiber: 6, sugar: 5, sodium: 420 }
  },
  {
    id: 'b12',
    name: 'Akwata',
    description: 'Steamed bean and corn cake from coastal regions.',
    image: '/meals/akwata.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['2 cups black-eyed peas', '1 cup fresh corn', '1 onion', '2 tbsp crayfish', '1 cup palm oil', '2 bouillon cubes', 'salt', 'chili', 'banana leaves'],
      method: ['Soak and peel beans.', 'Blend with onion until smooth.', 'Add corn, crayfish, spices.', 'Whisk in oil.', 'Wrap in leaves and steam 1½ hours.', 'Serve with pepper sauce.']
    },
    nutrition: { calories: 420, protein: 18, carbs: 52, fats: 18, fiber: 10, sugar: 4, sodium: 480 }
  },
  {
    id: 'b13',
    name: 'Akwadu',
    description: 'Baked plantain and coconut dish from coastal areas.',
    image: '/meals/akwadu.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['6 ripe plantains', '1 cup coconut milk', '¼ cup honey', '½ cup shredded coconut', '¼ cup butter', '1 tsp cinnamon', '½ tsp nutmeg'],
      method: ['Preheat oven to 375°F.', 'Slice plantains and arrange in dish.', 'Mix coconut milk, honey, spices.', 'Pour over plantains.', 'Top with coconut and butter.', 'Bake 30-35 minutes.', 'Serve warm.']
    },
    nutrition: { calories: 410, protein: 4, carbs: 68, fats: 16, fiber: 7, sugar: 28, sodium: 95 }
  },
  {
    id: 'b14',
    name: 'Attieke',
    description: 'Fermented cassava couscous served with fried fish.',
    image: '/meals/attieke.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['500g Attieke', '½ cup water', '2 tbsp oil', '1 onion', '2 tomatoes', '1 cucumber', 'fried fish', 'pepper sauce'],
      method: ['Sprinkle water over attieke.', 'Let absorb for 5 minutes.', 'Heat oil, sauté half the onions.', 'Add attieke and stir-fry 3-5 minutes.', 'Top with fresh vegetables.', 'Serve with fried fish and pepper sauce.']
    },
    nutrition: { calories: 320, protein: 3, carbs: 68, fats: 6, fiber: 4, sugar: 4, sodium: 45 }
  },
  {
    id: 'b15',
    name: 'Sweet Corn Pap',
    description: 'Sweet corn porridge from fermented fresh corn.',
    image: '/meals/akamu pap.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 cup sweet corn paste', '3 cups water', 'evaporated milk', 'sugar'],
      method: ['Mix paste with cold water.', 'Pour into boiling water, stirring.', 'Cook until thick.', 'Serve with milk and sugar.']
    },
    nutrition: { calories: 190, protein: 5, carbs: 42, fats: 2, fiber: 6, sugar: 18, sodium: 15 }
  },
  {
    id: 'b16',
    name: 'Sorghum Pap',
    description: 'Dark earthy porridge from the North.',
    image: '/meals/sorghum.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 cup sorghum paste', '3 cups water', 'evaporated milk', 'sugar'],
      method: ['Mix paste with cold water.', 'Pour into boiling water.', 'Cook until thick.', 'Serve with milk and sugar.']
    },
    nutrition: { calories: 170, protein: 4, carbs: 36, fats: 1, fiber: 5, sugar: 0, sodium: 10 }
  },
  {
    id: 'b17',
    name: 'Rice Pap',
    description: 'Smooth rice porridge for breakfast.',
    image: '/meals/rice pap.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 cup rice paste', '3 cups water', 'evaporated milk', 'sugar'],
      method: ['Mix paste with cold water.', 'Pour into boiling water.', 'Cook until thick.', 'Serve with milk and sugar.']
    },
    nutrition: { calories: 280, protein: 6, carbs: 55, fats: 4, fiber: 1, sugar: 12, sodium: 45 }
  },
  {
    id: 'b18',
    name: 'Yellow Corn Pap',
    description: 'Nutrient-rich yellow corn porridge.',
    image: '/meals/yellow corn pap.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 cup yellow corn paste', '3 cups water', 'evaporated milk', 'sugar'],
      method: ['Mix paste with cold water.', 'Pour into boiling water.', 'Cook until thick.', 'Serve with milk and sugar.']
    },
    nutrition: { calories: 160, protein: 3, carbs: 34, fats: 1, fiber: 3, sugar: 1, sodium: 5 }
  },
  {
    id: 'b19',
    name: 'Millet Couscous',
    description: 'Steamed millet granules served as breakfast fufu.',
    image: '/meals/millet couscous.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['2 cups millet flour', '3 cups water', '4 eggs', '2 tomatoes', '1 onion', '¼ cup palm oil', '1 bouillon cube'],
      method: ['Stir millet into boiling water.', 'Cook until thick.', 'Shape into balls.', 'Prepare egg stew separately.', 'Serve together.']
    },
    nutrition: { calories: 420, protein: 12, carbs: 75, fats: 8, fiber: 6, sugar: 3, sodium: 380 }
  },
  {
    id: 'b20',
    name: 'Garri & Milk',
    description: 'Soaked garri with evaporated milk.',
    image: '/meals/drinking garri.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 cup Garri', '1 cup evaporated milk', '¼ cup sugar', '½ cup groundnuts', '½ cup water'],
      method: ['Mix garri with water.', 'Drain excess.', 'Stir in milk and sugar.', 'Top with groundnuts.']
    },
    nutrition: { calories: 280, protein: 6, carbs: 52, fats: 6, fiber: 3, sugar: 22, sodium: 45 }
  },
  {
    id: 'b21',
    name: 'Garri & Groundnuts',
    description: 'Dry garri mixed with roasted peanuts.',
    image: '/meals/drinking garri.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 cup Garri', '½ cup groundnuts', '¼ cup sugar', '½ cup water (optional)'],
      method: ['Mix garri with sugar.', 'Add groundnuts.', 'Eat dry or add water.']
    },
    nutrition: { calories: 320, protein: 10, carbs: 55, fats: 10, fiber: 5, sugar: 15, sodium: 85 }
  },
  {
    id: 'b22',
    name: 'Manioc au Sucre',
    description: 'Boiled cassava served with sugar.',
    image: '/meals/roastedcassava.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 kg cassava', 'water', 'salt', '¼ cup sugar'],
      method: ['Peel and cut cassava.', 'Boil until tender.', 'Drain.', 'Serve with sugar.']
    },
    nutrition: { calories: 350, protein: 3, carbs: 82, fats: 2, fiber: 8, sugar: 25, sodium: 15 }
  },
  {
    id: 'b23',
    name: 'Tapioca Porridge',
    description: 'Cassava pearl cereal with milk.',
    image: '/meals/tapioca porridge.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 cup tapioca pearls', '3 cups water', '1 cup milk', '¼ cup sugar', '½ cup groundnuts'],
      method: ['Soak tapioca 30 minutes.', 'Drain and rinse.', 'Cook until translucent.', 'Add milk and sugar.', 'Top with groundnuts.']
    },
    nutrition: { calories: 320, protein: 7, carbs: 50, fats: 10, fiber: 2, sugar: 22, sodium: 65 }
  },
  {
    id: 'b24',
    name: 'Highland Oats',
    description: 'Warming oatmeal with milk.',
    image: '/meals/oats.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 cup rolled oats', '2 cups water', '1 cup milk', '2 tbsp sugar', 'pinch salt'],
      method: ['Combine oats, water, milk, salt.', 'Bring to boil.', 'Simmer 5-7 minutes.', 'Add sugar.', 'Serve warm.']
    },
    nutrition: { calories: 310, protein: 9, carbs: 45, fats: 10, fiber: 6, sugar: 10, sodium: 120 }
  },
  {
    id: 'b25',
    name: 'Custard & Biscuit',
    description: 'Vanilla custard with biscuits.',
    image: '/meals/custard biscuit.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['½ cup custard powder', '2 cups water', '1 cup milk', '¼ cup sugar', '8-10 biscuits'],
      method: ['Mix custard with cold water.', 'Pour into boiling milk-water.', 'Stir until thick.', 'Serve with biscuits.']
    },
    nutrition: { calories: 340, protein: 6, carbs: 62, fats: 8, fiber: 1, sugar: 28, sodium: 210 }
  },
  {
    id: 'b26',
    name: 'Egg Bread Tea',
    description: 'Egg-dipped fried bread with tea.',
    image: '/meals/egg bread tea.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['4 slices bread', '2 eggs', '¼ cup milk', '2 tbsp butter', 'tea bags', 'water', 'sugar'],
      method: ['Whisk eggs and milk.', 'Dip bread in mixture.', 'Fry until golden.', 'Brew tea.', 'Serve together.']
    },
    nutrition: { calories: 430, protein: 12, carbs: 58, fats: 16, fiber: 2, sugar: 15, sodium: 380 }
  },
  {
    id: 'b27',
    name: 'Boiled Irish & Butter',
    description: 'Soft boiled potatoes with butter.',
    image: '/meals/irish butter.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['6 Irish potatoes', 'water', 'salt', '3 tbsp butter'],
      method: ['Peel and cut potatoes.', 'Boil until tender.', 'Drain.', 'Add butter.', 'Serve warm.']
    },
    nutrition: { calories: 380, protein: 5, carbs: 62, fats: 12, fiber: 5, sugar: 3, sodium: 210 }
  },
  {
    id: 'b28',
    name: 'Boiled Cocoyam & Egg',
    description: 'Simple tuber breakfast with hard-boiled eggs.',
    image: '/meals/egg sauce yam.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 kg cocoyam', 'water', 'salt', '4 eggs'],
      method: ['Boil cocoyam until tender.', 'Boil eggs 8-10 minutes.', 'Peel both.', 'Serve with salt.']
    },
    nutrition: { calories: 420, protein: 15, carbs: 65, fats: 12, fiber: 9, sugar: 4, sodium: 390 }
  },
  {
    id: 'b29',
    name: 'Fried Yam & Egg',
    description: 'Yam fries with scrambled eggs.',
    image: '/meals/fried yam egg.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 kg yam', 'oil for frying', 'salt', '4 eggs', '2 tomatoes', '1 onion'],
      method: ['Slice yam and deep-fry.', 'Scramble eggs with vegetables.', 'Serve together.']
    },
    nutrition: { calories: 620, protein: 15, carbs: 75, fats: 28, fiber: 6, sugar: 3, sodium: 480 }
  },
  {
    id: 'b30',
    name: 'Irish Potato & Omelette',
    description: 'Fried potatoes with omelette.',
    image: '/meals/Irish potato and fried egg.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['4 potatoes', 'oil', 'salt', '3 eggs', '1 tomato', '½ onion'],
      method: ['Dice and fry potatoes.', 'Make omelette with vegetables.', 'Serve together.']
    },
    nutrition: { calories: 450, protein: 14, carbs: 58, fats: 20, fiber: 5, sugar: 3, sodium: 480 }
  },
  {
    id: 'b31',
    name: 'Boiled Egg & Avocado',
    description: 'Simple protein-rich breakfast.',
    image: '/meals/egg avocado.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['2 eggs', '1 avocado', 'salt', 'pepper'],
      method: ['Boil eggs 8-10 minutes.', 'Slice avocado.', 'Arrange on plate.', 'Season with salt and pepper.']
    },
    nutrition: { calories: 310, protein: 12, carbs: 10, fats: 25, fiber: 10, sugar: 2, sodium: 240 }
  },
  {
    id: 'b32',
    name: 'Boiled Egg & Tomato',
    description: 'Simple eggs with fresh tomatoes.',
    image: '/meals/tomato eggs.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['3 eggs', '2 tomatoes', 'salt', 'pepper'],
      method: ['Boil eggs 8-10 minutes.', 'Slice tomatoes.', 'Arrange on plate.', 'Season.']
    },
    nutrition: { calories: 180, protein: 13, carbs: 6, fats: 12, fiber: 2, sugar: 4, sodium: 310 }
  },
  {
    id: 'b33',
    name: 'Bread & Butter',
    description: 'Simple buttered baguette.',
    image: '/meals/breadbutter.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 baguette', '¼ cup butter', 'jam (optional)'],
      method: ['Slice baguette.', 'Spread butter.', 'Add jam if desired.']
    },
    nutrition: { calories: 280, protein: 5, carbs: 42, fats: 12, fiber: 2, sugar: 6, sodium: 310 }
  },
  {
    id: 'b34',
    name: 'Tartina Bread',
    description: 'Baguette with chocolate spread.',
    image: '/meals/tartine bread.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 baguette', '¼ cup butter', '½ cup chocolate spread'],
      method: ['Slice baguette.', 'Spread butter.', 'Top with chocolate spread.']
    },
    nutrition: { calories: 400, protein: 6, carbs: 65, fats: 14, fiber: 3, sugar: 30, sodium: 310 }
  },
  {
    id: 'b35',
    name: 'Avocado Toast',
    description: 'Mashed avocado on Kumba bread.',
    image: '/meals/avocado toast.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['4 slices bread', '2 avocados', '1 tbsp lemon juice', '¼ onion', 'salt', 'pepper'],
      method: ['Toast bread.', 'Mash avocados with lemon and onion.', 'Spread on toast.', 'Season.']
    },
    nutrition: { calories: 390, protein: 7, carbs: 45, fats: 22, fiber: 10, sugar: 3, sodium: 280 }
  },
  {
    id: 'b36',
    name: 'Mango & Yogurt',
    description: 'Fresh mango with yogurt.',
    image: '/meals/Mango yogurt bowl.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['2 mangoes', '1 cup yogurt', '2 tbsp honey', 'mint'],
      method: ['Cube mangoes.', 'Layer yogurt and mango.', 'Drizzle honey.', 'Garnish with mint.']
    },
    nutrition: { calories: 220, protein: 8, carbs: 42, fats: 4, fiber: 4, sugar: 35, sodium: 65 }
  },
  {
    id: 'b37',
    name: 'Papaya & Lime Bowl',
    description: 'Fresh papaya with lime.',
    image: '/meals/Papaya and Lime.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 papaya', '1 lime', 'honey (optional)'],
      method: ['Cut papaya in half.', 'Remove seeds.', 'Squeeze lime juice.', 'Drizzle honey if desired.']
    },
    nutrition: { calories: 110, protein: 1, carbs: 28, fats: 0, fiber: 5, sugar: 24, sodium: 10 }
  },
  {
    id: 'b38',
    name: 'Market Fruit Salad',
    description: 'Fresh fruit with condensed milk.',
    image: '/meals/fruitsalad.jpg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 mango', '1 papaya', '2 bananas', '1 cup pineapple', '¼ cup condensed milk'],
      method: ['Dice all fruits.', 'Combine in bowl.', 'Drizzle condensed milk.', 'Toss gently.']
    },
    nutrition: { calories: 210, protein: 3, carbs: 48, fats: 2, fiber: 6, sugar: 38, sodium: 10 }
  },
  {
    id: 'b39',
    name: 'Soya Breakfast',
    description: 'Grilled beef skewers with bread.',
    image: '/meals/beef soya.jpg',
    category: 'breakfast',
    recipe: {
      ingredients: ['500g beef', '2 tbsp suya spice', '¼ cup ground peanuts', '1 baguette', '1 onion'],
      method: ['Coat beef in spice mixture.', 'Thread onto skewers.', 'Grill 3-4 minutes per side.', 'Serve with bread and onions.']
    },
    nutrition: { calories: 530, protein: 35, carbs: 45, fats: 22, fiber: 1, sugar: 2, sodium: 610 }
  },
  {
    id: 'b40',
    name: 'Fried Rice with Egg',
    description: 'Breakfast fried rice with egg.',
    image: '/meals/fried rice egg.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['2 cups cooked rice', '2 eggs', '100g smoked fish', '2 cloves garlic', '1 onion', '2 tbsp oil', '1 tbsp soy sauce'],
      method: ['Scramble eggs, set aside.', 'Sauté garlic and onion.', 'Add rice and fish.', 'Add soy sauce.', 'Mix in eggs.', 'Serve hot.']
    },
    nutrition: { calories: 490, protein: 14, carbs: 75, fats: 16, fiber: 4, sugar: 4, sodium: 620 }
  },
  {
    id: 'b41',
    name: 'Spicy Gizzards',
    description: 'Gizzards in tomato sauce with bread.',
    image: '/meals/fried gizzard.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['500g gizzards', '3 tomatoes', '1 onion', '2 cloves garlic', '2 tbsp oil', '1 bouillon cube', '1 baguette'],
      method: ['Boil gizzards until tender.', 'Sauté onions and garlic.', 'Add tomatoes and cook down.', 'Add gizzards and simmer.', 'Serve with bread.']
    },
    nutrition: { calories: 470, protein: 28, carbs: 48, fats: 15, fiber: 2, sugar: 4, sodium: 680 }
  },
  {
    id: 'b42',
    name: 'Masa & Honey',
    description: 'Rice cakes with wild honey.',
    image: '/meals/masa honey bread.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['2 cups rice flour', '½ cup sugar', '1 tbsp yeast', '1½ cups water', 'oil', '¼ cup honey'],
      method: ['Make masa batter and ferment.', 'Fry until golden.', 'Drizzle with honey.', 'Serve warm.']
    },
    nutrition: { calories: 310, protein: 5, carbs: 65, fats: 3, fiber: 2, sugar: 24, sodium: 80 }
  },
  {
    id: 'b43',
    name: 'Masa & Spicy Oil',
    description: 'Savory rice cakes with chili oil.',
    image: '/meals/Masa.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['2 cups rice flour', '½ cup sugar', '1 tbsp yeast', '1½ cups water', 'oil', '½ cup palm oil', '2 tbsp chili flakes'],
      method: ['Make masa and fry.', 'Heat palm oil with chili.', 'Serve masa with spicy oil for dipping.']
    },
    nutrition: { calories: 360, protein: 6, carbs: 68, fats: 8, fiber: 2, sugar: 16, sodium: 420 }
  },
  {
    id: 'b44',
    name: 'Massa',
    description: 'Northern fermented rice cakes.',
    image: '/meals/massa.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['2 cups rice', '½ cup sugar', '1 tbsp yeast', '1½ cups water', 'oil'],
      method: ['Soak rice overnight.', 'Blend with sugar and water.', 'Add yeast and ferment.', 'Fry in special pan.', 'Serve warm.']
    },
    nutrition: { calories: 320, protein: 5, carbs: 68, fats: 4, fiber: 2, sugar: 20, sodium: 90 }
  },
  {
    id: 'b45',
    name: 'Plantain & Scrambled Egg',
    description: 'Boiled plantain with egg scramble.',
    image: '/meals/plantainegg.jpg',
    category: 'breakfast',
    recipe: {
      ingredients: ['3 green plantains', '3 eggs', '1 tomato', '½ onion', '2 tbsp oil', 'salt'],
      method: ['Boil plantains until tender.', 'Scramble eggs with vegetables.', 'Serve together.']
    },
    nutrition: { calories: 510, protein: 16, carbs: 68, fats: 22, fiber: 6, sugar: 12, sodium: 450 }
  },
  {
    id: 'b46',
    name: 'Plantain & Gizzard',
    description: 'Fried plantains with gizzards.',
    image: '/meals/fried gizzard.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['3 ripe plantains', '500g gizzards', '2 tomatoes', '1 onion', 'oil', 'salt'],
      method: ['Boil gizzards until tender.', 'Fry plantains until golden.', 'Make gizzard stew.', 'Serve together.']
    },
    nutrition: { calories: 540, protein: 26, carbs: 58, fats: 24, fiber: 5, sugar: 15, sodium: 480 }
  },
  {
    id: 'b47',
    name: 'Plantain & Plum',
    description: 'Boiled plantain with African pears.',
    image: '/meals/plantain plum.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['3 ripe plantains', '6 Safou', 'salt'],
      method: ['Boil plantains until tender.', 'Boil pears 5-10 minutes.', 'Serve together with salt.']
    },
    nutrition: { calories: 410, protein: 5, carbs: 88, fats: 10, fiber: 8, sugar: 15, sodium: 15 }
  },
  {
    id: 'b48',
    name: 'Plantain Porridge',
    description: 'Unripe plantains in oil sauce.',
    image: '/meals/plantain porridge.jpg',
    category: 'breakfast',
    recipe: {
      ingredients: ['4 unripe plantains', '¼ cup palm oil', '100g smoked fish', '1 onion', '1 bouillon cube', '2 cups water'],
      method: ['Cube plantains.', 'Sauté onion in oil.', 'Add plantains and fish.', 'Add water and simmer.', 'Cook until thick.', 'Mash slightly.']
    },
    nutrition: { calories: 460, protein: 12, carbs: 78, fats: 14, fiber: 9, sugar: 12, sodium: 410 }
  },
  {
    id: 'b49',
    name: 'Porridge Macabo',
    description: 'Grated cocoyam porridge.',
    image: '/meals/cocoyamporridge.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 kg macabo', '¼ cup palm oil', '1 tbsp ginger', '1 bouillon cube', '2 cups water', 'salt'],
      method: ['Grate macabo finely.', 'Heat oil, add grated macabo.', 'Add water and spices.', 'Cook until thick.', 'Serve warm.']
    },
    nutrition: { calories: 490, protein: 10, carbs: 82, fats: 16, fiber: 10, sugar: 5, sodium: 320 }
  },
  {
    id: 'b50',
    name: 'Sweet Potato Porridge',
    description: 'Orange potatoes in tomato sauce.',
    image: '/meals/potatoporridge.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['4 sweet potatoes', '2 tomatoes', '100g smoked fish', '1 onion', '¼ cup palm oil', '1 bouillon cube', '2 cups water'],
      method: ['Cube sweet potatoes.', 'Sauté onion, add tomatoes.', 'Add potatoes, fish, water.', 'Simmer until soft.', 'Serve warm.']
    },
    nutrition: { calories: 480, protein: 8, carbs: 95, fats: 12, fiber: 9, sugar: 18, sodium: 340 }
  },

  // ==================== LUNCH (l1 - l110) ====================
  {
    id: 'l1',
    name: 'Ndole',
    description: 'Cameroon\'s national dish - bitter leaves in rich peanut sauce.',
    image: '/meals/ndole.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['500g bitter leaves', '2 cups peanuts', '500g beef', '200g shrimp', '100g smoked fish', '2 onions', '3 cloves garlic', '1 tbsp ginger', '1 cup palm oil', '2 bouillon cubes', 'salt', 'pepper'],
      method: ['Prepare bitter leaves (boil and squeeze 3 times).', 'Make peanut paste.', 'Heat oil, sauté onions.', 'Add peanut paste, cook 7 minutes.', 'Add meat and fish, simmer 30 minutes.', 'Add bitter leaves, cook 15 minutes.', 'Fold in shrimp.', 'Serve with plantains.']
    },
    nutrition: { calories: 820, protein: 52, carbs: 45, fats: 48, fiber: 9, sugar: 6, sodium: 710 }
  },
  {
    id: 'l2',
    name: 'Ndole with Shrimp',
    description: 'Shrimp-based bitterleaf stew.',
    image: '/meals/ndole shrimp.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['500g bitter leaves', '2 cups peanuts', '400g shrimp', '100g smoked fish', '2 onions', '3 cloves garlic', '1 tbsp ginger', '1 cup palm oil', '2 bouillon cubes', 'salt'],
      method: ['Prepare bitter leaves.', 'Make peanut paste.', 'Cook sauce as in Ndole.', 'Add shrimp last 5 minutes.', 'Serve with plantains.']
    },
    nutrition: { calories: 710, protein: 45, carbs: 42, fats: 42, fiber: 9, sugar: 6, sodium: 650 }
  },
  {
    id: 'l3',
    name: 'Ndole with Crayfish',
    description: 'Bitterleaf stew with extra crayfish.',
    image: '/meals/ndole.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['500g bitter leaves', '2 cups peanuts', '500g beef', '1 cup crayfish', '2 onions', '1 cup palm oil', '2 bouillon cubes', 'salt'],
      method: ['Prepare bitter leaves.', 'Make peanut paste.', 'Cook stew as in Ndole.', 'Add extra crayfish.', 'Simmer until oil rises.']
    },
    nutrition: { calories: 740, protein: 48, carbs: 42, fats: 42, fiber: 9, sugar: 6, sodium: 680 }
  },
  {
    id: 'l4',
    name: 'Ndole & Plantain',
    description: 'Bitterleaf stew with plantain.',
    image: '/meals/ndole.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['500g bitter leaves', '2 cups peanuts', '500g beef', '3 plantains', '2 onions', '1 cup palm oil', 'salt'],
      method: ['Prepare Ndole stew.', 'Boil plantains separately.', 'Serve stew over plantains.']
    },
    nutrition: { calories: 710, protein: 38, carbs: 72, fats: 35, fiber: 9, sugar: 14, sodium: 580 }
  },
  {
    id: 'l5',
    name: 'Ndole & Miondo',
    description: 'Bitterleaf stew with cassava sticks.',
    image: '/meals/ndole bobolo.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['500g bitter leaves', '2 cups peanuts', '500g beef', '6 miondo', '2 onions', '1 cup palm oil', 'crayfish'],
      method: ['Prepare Ndole stew.', 'Steam miondo separately.', 'Serve stew with miondo.']
    },
    nutrition: { calories: 750, protein: 42, carbs: 48, fats: 45, fiber: 9, sugar: 6, sodium: 620 }
  },
  {
    id: 'l6',
    name: 'Ndole & Boiled Irish',
    description: 'Bitterleaf stew with potatoes.',
    image: '/meals/ndole.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['500g bitter leaves', '2 cups peanuts', '500g beef', '4 Irish potatoes', '2 onions', '1 cup palm oil'],
      method: ['Prepare Ndole stew.', 'Boil potatoes separately.', 'Serve together.']
    },
    nutrition: { calories: 520, protein: 24, carbs: 45, fats: 28, fiber: 8, sugar: 5, sodium: 480 }
  },
  {
    id: 'l7',
    name: 'Eru & Waterfufu',
    description: 'Wild spinach with cassava fufu.',
    image: '/meals/eru.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['500g dried eru', '200g waterleaf', '500g beef', '300g tripe', '1 cup crayfish', '1½ cups palm oil', '2 bouillon cubes', 'salt', '2 cups cassava flour', '4 cups water'],
      method: ['Soak eru 1 hour, wash.', 'Boil meat and tripe.', 'Add waterleaf, then eru.', 'Add crayfish and oil.', 'Cook 20 minutes.', 'Make waterfufu with cassava flour.', 'Serve together.']
    },
    nutrition: { calories: 850, protein: 38, carbs: 95, fats: 42, fiber: 12, sugar: 2, sodium: 580 }
  },
  {
    id: 'l8',
    name: 'Koki Corn',
    description: 'Steamed corn cake in leaves.',
    image: '/meals/koki.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg fresh corn', '½ cup palm oil', '2 cups spinach', '1 tbsp ginger', '2 tbsp crayfish', '2 bouillon cubes', 'salt', 'banana leaves'],
      method: ['Blend corn and ginger.', 'Whisk vigorously.', 'Add oil, crayfish, spinach.', 'Wrap in leaves.', 'Steam 1½-2 hours.']
    },
    nutrition: { calories: 550, protein: 15, carbs: 75, fats: 20, fiber: 12, sugar: 8, sodium: 480 }
  },
  {
    id: 'l9',
    name: 'Koki Corn & Greens',
    description: 'Corn pudding with spinach.',
    image: '/meals/koki-corn.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg corn', '½ cup palm oil', '2 cups spinach', '1 tbsp ginger', '2 tbsp crayfish', 'salt', 'banana leaves'],
      method: ['Grind corn.', 'Mix with oil and spinach.', 'Steam in leaves.']
    },
    nutrition: { calories: 550, protein: 15, carbs: 75, fats: 20, fiber: 12, sugar: 8, sodium: 480 }
  },
  {
    id: 'l10',
    name: 'Koki Beans',
    description: 'Steamed bean cake.',
    image: '/meals/Koki-beans.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups black-eyed peas', '1 onion', '½ cup palm oil', '2 tbsp crayfish', '2 bouillon cubes', '1 tsp chili', 'salt', 'banana leaves'],
      method: ['Soak and peel beans.', 'Blend with onion.', 'Whisk in oil and spices.', 'Wrap in leaves.', 'Steam 1½ hours.']
    },
    nutrition: { calories: 410, protein: 24, carbs: 48, fats: 18, fiber: 14, sugar: 4, sodium: 390 }
  },
  {
    id: 'l11',
    name: 'Koki Beans & Yam',
    description: 'Bean cake with yam.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups beans', '½ cup palm oil', '1 kg yam', '1 onion', 'chili', 'salt'],
      method: ['Prepare koki.', 'Boil yam separately.', 'Serve together.']
    },
    nutrition: { calories: 710, protein: 26, carbs: 95, fats: 28, fiber: 15, sugar: 6, sodium: 420 }
  },
  {
    id: 'l12',
    name: 'Koki & Plantain',
    description: 'Bean cake with plantain.',
    image: '/meals/koki.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups beans', '½ cup palm oil', '3 plantains', '1 onion', 'chili'],
      method: ['Steam koki.', 'Boil plantains.', 'Serve together.']
    },
    nutrition: { calories: 680, protein: 28, carbs: 85, fats: 25, fiber: 18, sugar: 12, sodium: 410 }
  },
  {
    id: 'l13',
    name: 'Mbongo Tchobi',
    description: 'Black spicy fish stew.',
    image: '/meals/mbongo.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg tilapia', '3 tbsp mbongo spice', '3 tomatoes', '2 onions', '1 tbsp ginger', '3 cloves garlic', '½ cup palm oil', '2 bouillon cubes', 'salt'],
      method: ['Grind mbongo spice.', 'Marinate fish.', 'Sauté onions and tomatoes.', 'Add fish and water.', 'Simmer 15 minutes.', 'Serve with plantains.']
    },
    nutrition: { calories: 550, protein: 40, carbs: 15, fats: 35, fiber: 6, sugar: 3, sodium: 480 }
  },
  {
    id: 'l14',
    name: 'Mbongo Tchobi Beef',
    description: 'Black beef stew.',
    image: '/meals/mbongo tchobi.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg beef', '3 tbsp mbongo spice', '3 tomatoes', '2 onions', '3 cloves garlic', '½ cup palm oil', '2 bouillon cubes'],
      method: ['Season beef with mbongo.', 'Sauté onions and tomatoes.', 'Add beef and water.', 'Simmer until tender.']
    },
    nutrition: { calories: 650, protein: 42, carbs: 55, fats: 28, fiber: 7, sugar: 10, sodium: 590 }
  },
  {
    id: 'l15',
    name: 'Bongo\'o de Poisson',
    description: 'Black fish stew with plantain.',
    image: '/meals/Mbongo-Tchobi-1.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg fish', '3 tbsp mbongo spice', '3 plantains', '3 tomatoes', '2 onions', '½ cup palm oil'],
      method: ['Coat fish in spice.', 'Stew until cooked.', 'Boil plantains separately.', 'Serve together.']
    },
    nutrition: { calories: 590, protein: 38, carbs: 65, fats: 22, fiber: 7, sugar: 12, sodium: 540 }
  },
  {
    id: 'l16',
    name: 'Poulet DG',
    description: 'Chicken & plantain one-pot.',
    image: '/meals/poulet dg.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 whole chicken', '6 ripe plantains', '3 tomatoes', '2 onions', '3 carrots', '1 bell pepper', '1 cup green beans', '1 tbsp ginger', '3 cloves garlic', '½ cup oil', '2 bouillon cubes', 'salt'],
      method: ['Season chicken, steam 15 minutes.', 'Deep-fry chicken and plantains.', 'Sauté vegetables, add tomatoes.', 'Add chicken and simmer.', 'Fold in plantains.', 'Serve hot.']
    },
    nutrition: { calories: 800, protein: 45, carbs: 65, fats: 38, fiber: 7, sugar: 18, sodium: 710 }
  },
  {
    id: 'l17',
    name: 'Kondre',
    description: 'Ceremonial plantain stew.',
    image: '/meals/kondre.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['6 unripe plantains', '1 kg beef', '3 tomatoes', '2 onions', '1 tbsp ginger', '3 cloves garlic', '½ cup palm oil', '2 tbsp crayfish', '2 bouillon cubes', 'salt'],
      method: ['Cut plantains into chunks.', 'Season beef.', 'Sauté onions and tomatoes.', 'Add beef and water.', 'Simmer 30 minutes.', 'Add plantains.', 'Cook until thick.']
    },
    nutrition: { calories: 710, protein: 38, carbs: 82, fats: 24, fiber: 11, sugar: 14, sodium: 520 }
  },
  {
    id: 'l18',
    name: 'Ekwang',
    description: 'Grated cocoyam wraps.',
    image: '/meals/Ekwang.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg cocoyam', '500g cocoyam leaves', '1 tbsp ginger', '3 cloves garlic', '1 cup palm oil', '1 cup crayfish', '200g smoked fish', '1 tsp pebe', '2 bouillon cubes', 'salt', 'banana leaves'],
      method: ['Grate cocoyam.', 'Whisk until sticky.', 'Wrap in leaves.', 'Arrange in pot.', 'Pour oil and fish mixture.', 'Steam 1½-2 hours.']
    },
    nutrition: { calories: 780, protein: 22, carbs: 92, fats: 35, fiber: 14, sugar: 5, sodium: 540 }
  },
  {
    id: 'l19',
    name: 'Poisson Braisé',
    description: 'Grilled mackerel.',
    image: '/meals/grilled fish.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 large mackerel', '1 tbsp ginger', '3 cloves garlic', '1 tsp pebe', '1 tsp alligator pepper', '2 onions', '2 bouillon cubes', '½ cup oil', 'salt'],
      method: ['Make marinade paste.', 'Marinate fish 2 hours.', 'Grill over charcoal.', 'Baste continuously.', 'Serve with onions and pepper sauce.']
    },
    nutrition: { calories: 480, protein: 42, carbs: 4, fats: 30, fiber: 1, sugar: 1, sodium: 790 }
  },
  {
    id: 'l20',
    name: 'Poisson Braisé Tilapia',
    description: 'Grilled tilapia.',
    image: '/meals/3ngnam.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 large tilapia', '1 tbsp ginger', '3 cloves garlic', '1 tsp pebe', '1 tsp alligator pepper', '2 onions', '2 bouillon cubes', '½ cup oil', 'salt'],
      method: ['Make spicy paste.', 'Marinate fish 2 hours.', 'Grill over charcoal.', 'Baste continuously.', 'Serve hot.']
    },
    nutrition: { calories: 450, protein: 48, carbs: 5, fats: 22, fiber: 2, sugar: 1, sodium: 850 }
  },
  {
    id: 'l21',
    name: 'Ebeu',
    description: 'Fish & nightshade leaves.',
    image: '/meals/ebeu.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg tilapia', '6 bundles zom leaves', '1 cup palm oil', '1 onion', 'salt'],
      method: ['Boil zom leaves to remove tartness.', 'Season fish.', 'Layer leaves and fish.', 'Pour oil over.', 'Simmer 15 minutes.']
    },
    nutrition: { calories: 490, protein: 40, carbs: 12, fats: 32, fiber: 9, sugar: 4, sodium: 520 }
  },
  {
    id: 'l22',
    name: 'Ebom',
    description: 'Wrapped fish.',
    image: '/meals/fish.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg tilapia', '3 tomatoes', '2 onions', '1 tbsp ginger', '3 cloves garlic', '1 tsp pebe', '1 tsp alligator pepper', 'oil', 'banana leaves'],
      method: ['Grind spices.', 'Season fish with paste.', 'Wrap in banana leaves.', 'Steam 45 minutes.']
    },
    nutrition: { calories: 410, protein: 38, carbs: 12, fats: 25, fiber: 4, sugar: 2, sodium: 480 }
  },
  {
    id: 'l23',
    name: 'Katt-Katt',
    description: 'West Region corn mash.',
    image: '/meals/corn vegetable.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg fresh corn', '500g beef', '2 cups greens', '1 cup palm oil', '1 onion', '2 tbsp crayfish'],
      method: ['Grind corn.', 'Sauté onion and meat.', 'Add corn and cook.', 'Add greens and oil.', 'Simmer until thick.']
    },
    nutrition: { calories: 610, protein: 20, carbs: 85, fats: 18, fiber: 15, sugar: 5, sodium: 440 }
  },
  {
    id: 'l24',
    name: 'Katte Katte',
    description: 'Grassfields stew.',
    image: '/meals/katikati.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['500g beef', '200g mackerel', '4 bundles huckleberry leaves', '1 cup palm oil', '2 tbsp egusi', '2 onions', 'spices'],
      method: ['Steam beef.', 'Boil leaves.', 'Fry egusi paste.', 'Mix all together.', 'Simmer 15 minutes.']
    },
    nutrition: { calories: 540, protein: 32, carbs: 20, fats: 38, fiber: 9, sugar: 3, sodium: 410 }
  },
  {
    id: 'l25',
    name: 'Kedjenou',
    description: 'Slow-cooked chicken stew.',
    image: '/meals/chicken stew.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 whole chicken', '4 tomatoes', '2 onions', '1 eggplant', '3 cloves garlic', '1 tbsp ginger', 'spices'],
      method: ['Layer chicken and vegetables in pot.', 'Seal tightly with foil.', 'Cook over low heat without water.', 'Shake pot occasionally.', 'Cook 1 hour.']
    },
    nutrition: { calories: 580, protein: 48, carbs: 18, fats: 30, fiber: 5, sugar: 8, sodium: 490 }
  },
  {
    id: 'l26',
    name: 'Kion',
    description: 'Forest soup with fish.',
    image: '/meals/kion.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg fish', '500g cocoyam', 'spices', 'palm oil', 'smoked fish'],
      method: ['Steam fish in spices.', 'Boil cocoyam.', 'Serve fish over cocoyam.']
    },
    nutrition: { calories: 490, protein: 42, carbs: 45, fats: 15, fiber: 6, sugar: 3, sodium: 440 }
  },
  {
    id: 'l27',
    name: 'Lamsi',
    description: 'Grassfields soup.',
    image: '/meals/lamsi.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['500g jute leaves', '500g beef', '200g mackerel', '1 cup palm oil', '2 tbsp crayfish', 'spices'],
      method: ['Boil peanuts, blend.', 'Steam beef.', 'Sauté peanut paste.', 'Add meat and leaves.', 'Simmer 20 minutes.']
    },
    nutrition: { calories: 520, protein: 35, carbs: 15, fats: 40, fiber: 11, sugar: 2, sodium: 480 }
  },
  {
    id: 'l28',
    name: 'Mbol',
    description: 'Eastern region leaf stew.',
    image: '/meals/mbol.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['500g mbol leaves', '2 cups peanuts', '500g beef', '1 cup palm oil', '2 tbsp crayfish'],
      method: ['Grind peanuts.', 'Cook leaves.', 'Mix with meat and paste.', 'Simmer until oil rises.']
    },
    nutrition: { calories: 620, protein: 30, carbs: 25, fats: 45, fiber: 8, sugar: 3, sodium: 410 }
  },
  {
    id: 'l29',
    name: 'Mbol with Beef',
    description: 'Forest leaves with beef.',
    image: '/meals/mbol.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['500g mbol leaves', '500g beef', '2 cups peanut paste', '1 onion', '1 cup palm oil'],
      method: ['Cook leaves.', 'Add beef and peanut paste.', 'Simmer until oil rises.']
    },
    nutrition: { calories: 650, protein: 38, carbs: 25, fats: 48, fiber: 8, sugar: 3, sodium: 520 }
  },
  {
    id: 'l30',
    name: 'Nnam Owondo',
    description: 'Wrapped egusi pudding.',
    image: '/meals/egusipudding.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups egusi', '3 cloves garlic', '2 cups spinach', '200g smoked fish', '2 tbsp crayfish', '1 tsp pebe', 'banana leaves'],
      method: ['Mash egusi seeds.', 'Mix with fish and spices.', 'Wrap in leaves.', 'Steam 1½ hours.']
    },
    nutrition: { calories: 580, protein: 24, carbs: 18, fats: 48, fiber: 6, sugar: 3, sodium: 410 }
  },
  {
    id: 'l31',
    name: 'Nten',
    description: 'Vegetarian mash.',
    image: '/meals/nten.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg cocoyam', '4 bundles huckleberry leaves', '3 cloves garlic', '1 tbsp ginger', '1 tsp pebe', 'salt', 'banana leaves'],
      method: ['Grate cocoyam.', 'Stir into boiling water.', 'Whisk for koki.', 'Steam portions in leaves.', 'Serve with boiled leaves.']
    },
    nutrition: { calories: 580, protein: 18, carbs: 82, fats: 24, fiber: 12, sugar: 4, sodium: 410 }
  },
  {
    id: 'l32',
    name: 'Okok (Salty)',
    description: 'Savory gnetum leaves.',
    image: '/meals/okok.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg okok leaves', '2 cups egusi', '1 cup palm oil', '1 onion', '2 tbsp ginger-garlic paste', '1 cup crayfish', '200g smoked fish', 'salt'],
      method: ['Soak leaves 1 hour.', 'Wash and drain.', 'Boil until tender.', 'Mix ground egusi.', 'Add to leaves.', 'Cook egusi fufu.']
    },
    nutrition: { calories: 750, protein: 25, carbs: 45, fats: 48, fiber: 11, sugar: 5, sodium: 520 }
  },
  {
    id: 'l33',
    name: 'Okok (Sweet)',
    description: 'Sweet gnetum leaves.',
    image: '/meals/okok.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg okok leaves', '2 cups egusi', '1 cup palm oil', '½ cup sugar', '1 onion', '2 tbsp crayfish', '200g smoked fish'],
      method: ['Soak leaves.', 'Boil until tender.', 'Add egusi mix.', 'Add sugar.', 'Cook.']
    },
    nutrition: { calories: 890, protein: 20, carbs: 70, fats: 55, fiber: 11, sugar: 45, sodium: 210 }
  },
  {
    id: 'l34',
    name: 'Okok with Cassava',
    description: 'Forest leaves with cassava.',
    image: '/meals/okok.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg okok leaves', '2 cups egusi', '1 cup palm oil', '500g cassava paste', '2 tbsp crayfish'],
      method: ['Prepare okok.', 'Stir cassava paste into boiling water.', 'Serve together.']
    },
    nutrition: { calories: 820, protein: 22, carbs: 95, fats: 45, fiber: 14, sugar: 25, sodium: 310 }
  },
  {
    id: 'l35',
    name: 'Okra Soup',
    description: 'Slimy okra and meat stew.',
    image: '/meals/okrosoup.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['500g okra', '500g beef', '300g tripe', '200g smoked fish', '1 cup palm oil', '2 tbsp crayfish', '1 onion', '2 bouillon cubes', 'salt'],
      method: ['Chop okra finely.', 'Boil meats until tender.', 'Heat oil, add okra.', 'Add meat broth.', 'Simmer 10 minutes.', 'Add crayfish and pepper.']
    },
    nutrition: { calories: 600, protein: 45, carbs: 20, fats: 38, fiber: 10, sugar: 4, sodium: 690 }
  },
  {
    id: 'l36',
    name: 'Okro Soup (Dry)',
    description: 'Dried okra stew.',
    image: '/meals/okro soup.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 cup dried okra powder', '500g beef', '300g tripe', '1 cup palm oil', '2 tbsp crayfish', '200g fish'],
      method: ['Whisk dried okra powder into meat broth.', 'Add oil.', 'Cook until slimy.']
    },
    nutrition: { calories: 520, protein: 42, carbs: 12, fats: 35, fiber: 11, sugar: 3, sodium: 610 }
  },
  {
    id: 'l37',
    name: 'Okra & Pounded Yam',
    description: 'Slimy soup with yam.',
    image: '/meals/driedokro.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['500g okra', '500g beef', '200g fish', '1 kg yam', '1 cup palm oil', '2 tbsp crayfish'],
      method: ['Prepare okra soup.', 'Pound boiled yam.', 'Serve together.']
    },
    nutrition: { calories: 780, protein: 38, carbs: 95, fats: 25, fiber: 12, sugar: 4, sodium: 690 }
  },
  {
    id: 'l38',
    name: 'Okra & Fufu Corn',
    description: 'Corn fufu with okra.',
    image: '/meals/cornfufuokro.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups corn flour', '500g okra', '500g beef', '300g tripe', '1 cup palm oil', '2 tbsp crayfish'],
      method: ['Cook corn fufu.', 'Prepare okra with beef.', 'Serve together.']
    },
    nutrition: { calories: 680, protein: 40, carbs: 88, fats: 22, fiber: 12, sugar: 4, sodium: 710 }
  },
  {
    id: 'l39',
    name: 'Egusi & Pounded Yam',
    description: 'Melon seed soup with yam.',
    image: '/meals/egusisoup.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups egusi', '500g beef', '200g spinach', '1 kg yam', '1 cup palm oil', '2 tbsp crayfish', '200g smoked fish'],
      method: ['Grind egusi.', 'Cook with spinach and meat.', 'Pound boiled yam.', 'Serve together.']
    },
    nutrition: { calories: 820, protein: 40, carbs: 90, fats: 32, fiber: 8, sugar: 5, sodium: 610 }
  },
  {
    id: 'l40',
    name: 'Egusi & Boiled Yam',
    description: 'Melon soup with yam slices.',
    image: '/meals/Egusi-Stew.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups egusi', '500g beef', '200g spinach', '1 kg yam', '1 cup palm oil', '2 tbsp crayfish'],
      method: ['Prepare egusi soup.', 'Boil yam slices.', 'Serve together.']
    },
    nutrition: { calories: 750, protein: 35, carbs: 88, fats: 32, fiber: 8, sugar: 5, sodium: 610 }
  },
  {
    id: 'l41',
    name: 'Egusi with Okra',
    description: 'Combined melon and okra soup.',
    image: '/meals/Egusi Soup.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups egusi', '500g okra', '500g beef', '200g fish', '200g spinach', '1 cup palm oil', '2 tbsp crayfish'],
      method: ['Cook egusi sauce.', 'Stir in chopped okra.', 'Add meat.', 'Simmer.']
    },
    nutrition: { calories: 780, protein: 40, carbs: 25, fats: 58, fiber: 9, sugar: 4, sodium: 680 }
  },
  {
    id: 'l42',
    name: 'Njama Njama & Yam',
    description: 'Huckleberry leaves with yam.',
    image: '/meals/Njama Njama.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['4 bundles huckleberry leaves', '1 kg yam', '1 onion', '¼ cup palm oil', '2 tbsp crayfish'],
      method: ['Fry leaves in oil.', 'Serve with pounded yam.']
    },
    nutrition: { calories: 670, protein: 18, carbs: 105, fats: 22, fiber: 11, sugar: 5, sodium: 480 }
  },
  {
    id: 'l43',
    name: 'Njangsa Fish Soup',
    description: 'Spicy nutty fish soup.',
    image: '/meals/njangsa sauce.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg fish', '1 cup njangsa', '1 tbsp ginger', '3 cloves garlic', '2 tbsp crayfish', '1 tsp pebe', '½ cup palm oil'],
      method: ['Grind njangsa.', 'Add to fish broth.', 'Simmer.']
    },
    nutrition: { calories: 380, protein: 38, carbs: 12, fats: 20, fiber: 3, sugar: 2, sodium: 610 }
  },
  {
    id: 'l44',
    name: 'Kundi',
    description: 'Dried greens stew.',
    image: '/meals/kundi.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['500g dried greens', '2 cups peanuts', '500g fish', '500g beef', '1 cup palm oil', '2 tbsp crayfish'],
      method: ['Rehydrate greens.', 'Sauté with peanut paste.', 'Add fish.']
    },
    nutrition: { calories: 410, protein: 28, carbs: 15, fats: 30, fiber: 12, sugar: 2, sodium: 520 }
  },
  {
    id: 'l45',
    name: 'Kwacoco & Banga',
    description: 'Cocoyam with palm soup.',
    image: '/meals/kwacoco banga soup.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg cocoyam', '2 cups palm nut concentrate', '200g smoked fish', '2 tbsp crayfish', '1 tbsp ginger'],
      method: ['Steam cocoyam.', 'Extract palm juice.', 'Boil with fish.']
    },
    nutrition: { calories: 820, protein: 35, carbs: 90, fats: 40, fiber: 10, sugar: 6, sodium: 620 }
  },
  {
    id: 'l46',
    name: 'Banga Soup & Starch',
    description: 'Palm fruit soup with cassava starch.',
    image: '/meals/bangasoup.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups palm nut concentrate', '500g fish', '500g meat', '2 cups cassava starch', '2 tbsp crayfish', 'spices'],
      method: ['Extract palm cream.', 'Boil with meats.', 'Make starch fufu.', 'Serve together.']
    },
    nutrition: { calories: 890, protein: 32, carbs: 110, fats: 48, fiber: 7, sugar: 8, sodium: 720 }
  },
  {
    id: 'l47',
    name: 'Cornchaff',
    description: 'Corn and beans with meat.',
    image: '/meals/cornchaff.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups dried corn', '1 cup brown beans', '300g beef', '1 onion', '¼ cup palm oil', '2 tbsp crayfish', '2 bouillon cubes', 'salt'],
      method: ['Soak corn and beans overnight.', 'Boil corn and beans separately.', 'Sauté beef with onions.', 'Combine all ingredients.', 'Simmer 15-20 minutes.']
    },
    nutrition: { calories: 680, protein: 32, carbs: 85, fats: 24, fiber: 22, sugar: 4, sodium: 550 }
  },
  {
    id: 'l48',
    name: 'Cornchaff (No Meat)',
    description: 'Vegan corn and beans.',
    image: '/meals/cornchaff.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups dried corn', '1 cup brown beans', '1 onion', '¼ cup palm oil', 'salt'],
      method: ['Cook corn and beans.', 'Add oil and onions.', 'Serve warm.']
    },
    nutrition: { calories: 540, protein: 18, carbs: 92, fats: 12, fiber: 22, sugar: 5, sodium: 380 }
  },
  {
    id: 'l49',
    name: 'Corn & Beans (Light)',
    description: 'Stewed corn and beans.',
    image: '/meals/beanscorn.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups corn', '1 cup beans', '1 onion', 'salt'],
      method: ['Boil corn and beans.', 'Add minimal palm oil.']
    },
    nutrition: { calories: 380, protein: 14, carbs: 68, fats: 6, fiber: 15, sugar: 4, sodium: 280 }
  },
  {
    id: 'l50',
    name: 'Sanga',
    description: 'Fresh corn and greens.',
    image: '/meals/corn vegetable.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg fresh corn', '500g cassava leaves', '1 cup palm pulp', '1 onion', '2 tbsp crayfish'],
      method: ['Boil corn and leaves.', 'Add palm pulp.', 'Simmer until creamy.']
    },
    nutrition: { calories: 520, protein: 12, carbs: 95, fats: 18, fiber: 13, sugar: 22, sodium: 90 }
  },
  {
    id: 'l51',
    name: 'Sanga (Fresh Corn)',
    description: 'Maize and leaf pudding.',
    image: '/meals/corn vegetable.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg fresh corn', '500g cassava leaves', '½ cup palm oil', '2 tbsp crayfish'],
      method: ['Grind corn.', 'Mix with leaves.', 'Steam.']
    },
    nutrition: { calories: 510, protein: 12, carbs: 95, fats: 15, fiber: 13, sugar: 24, sodium: 85 }
  },
  {
    id: 'l52',
    name: 'Cassava Leaf Soup',
    description: 'Sautéed cassava leaves.',
    image: '/meals/cassava leaf.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg cassava leaves', '2 cups peanuts', '500g fish', '1 cup palm oil', '2 tbsp crayfish'],
      method: ['Grind leaves.', 'Boil with peanuts and fish.']
    },
    nutrition: { calories: 540, protein: 22, carbs: 18, fats: 45, fiber: 12, sugar: 2, sodium: 480 }
  },
  {
    id: 'l53',
    name: 'Zom',
    description: 'Nightshade leaves & nuts.',
    image: '/meals/nightshade.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['6 bundles zom leaves', '2 cups peanuts', '500g meat', '1 cup palm oil', '1 onion'],
      method: ['Boil leaves.', 'Add peanut paste.', 'Simmer until oil rises.']
    },
    nutrition: { calories: 650, protein: 35, carbs: 20, fats: 48, fiber: 10, sugar: 4, sodium: 520 }
  },
  {
    id: 'l54',
    name: 'Zom with Meat',
    description: 'Nightshade leaves and beef.',
    image: '/meals/nightshade.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['6 bundles zom leaves', '500g beef', '1 cup palm oil', '1 onion', '2 tbsp crayfish'],
      method: ['Sauté onions.', 'Add meat and leaves.', 'Simmer until oil rises.']
    },
    nutrition: { calories: 680, protein: 38, carbs: 18, fats: 52, fiber: 10, sugar: 3, sodium: 540 }
  },
  {
    id: 'l55',
    name: 'Folere Stew',
    description: 'Hibiscus leaves with peanuts.',
    image: '/meals/hibiscus flower.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['6 bundles folere leaves', '2 cups peanuts', '200g smoked fish', '1 onion', '1 cup palm oil'],
      method: ['Boil leaves to remove tartness.', 'Mix with peanut paste.', 'Add fish.']
    },
    nutrition: { calories: 480, protein: 24, carbs: 15, fats: 38, fiber: 9, sugar: 4, sodium: 420 }
  },
  {
    id: 'l56',
    name: 'Folere Lunch',
    description: 'Hibiscus leaf stew.',
    image: '/meals/hibiscus flower.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['6 bundles folere leaves', '2 cups peanuts', '500g fish', '1 onion', '1 cup palm oil'],
      method: ['Boil leaves.', 'Mix with peanuts and fish.', 'Serve.']
    },
    nutrition: { calories: 560, protein: 25, carbs: 30, fats: 40, fiber: 10, sugar: 6, sodium: 350 }
  },
  {
    id: 'l57',
    name: 'Mbakara',
    description: 'Coastal cocoyam mash.',
    image: '/meals/cocoyam boiled.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg malanga', '1 tbsp ginger', '1 tsp pebe', '2 tbsp crayfish', '½ cup palm oil', '200g smoked fish'],
      method: ['Grate cocoyam.', 'Stir into boiling water.', 'Whisk for koki.', 'Steam portions.', 'Sauté with spices.']
    },
    nutrition: { calories: 590, protein: 15, carbs: 88, fats: 22, fiber: 11, sugar: 5, sodium: 320 }
  },
  {
    id: 'l58',
    name: 'Achu (Vegetarian)',
    description: 'Taro and yellow oil soup.',
    image: '/meals/achublacksoup.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg taro', '1 cup palm oil', '¼ cup canwa', '200g mushroom', 'spices'],
      method: ['Pound taro.', 'Serve with yellow soup using mushrooms.']
    },
    nutrition: { calories: 590, protein: 12, carbs: 110, fats: 22, fiber: 12, sugar: 4, sodium: 710 }
  },
  {
    id: 'l59',
    name: 'Akwadu',
    description: 'Baked plantain & coconut.',
    image: '/meals/akwadu.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['6 plantains', '1 cup coconut milk', '¼ cup honey'],
      method: ['Bake plantains in coconut milk.', 'Mash.', 'Serve.']
    },
    nutrition: { calories: 580, protein: 10, carbs: 95, fats: 20, fiber: 9, sugar: 28, sodium: 110 }
  },
  {
    id: 'l60',
    name: 'Banana Fufu',
    description: 'Steamed green banana dough.',
    image: '/meals/banana fufu.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['6 green bananas', 'water'],
      method: ['Boil bananas.', 'Pound until smooth.', 'Serve with soup.']
    },
    nutrition: { calories: 580, protein: 6, carbs: 135, fats: 2, fiber: 10, sugar: 25, sodium: 15 }
  },
  {
    id: 'l61',
    name: 'Spinach Stew',
    description: 'Spiced spinach stew.',
    image: '/meals/Chilli Spinach Stew.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['6 bundles spinach', '200g smoked fish', '3 tomatoes', '1 onion', '½ cup palm oil', 'spices'],
      method: ['Sauté veggies.', 'Add fish and spices.', 'Simmer.']
    },
    nutrition: { calories: 450, protein: 28, carbs: 20, fats: 30, fiber: 9, sugar: 4, sodium: 480 }
  },
  {
    id: 'l62',
    name: 'Beef Porridge Macabo',
    description: 'Grated macabo with beef.',
    image: '/meals/porridge cocoyam.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg macabo', '500g beef', '½ cup palm oil', '1 onion', '2 tbsp crayfish'],
      method: ['Boil beef.', 'Add grated macabo and oil.', 'Stir until thick.']
    },
    nutrition: { calories: 540, protein: 32, carbs: 75, fats: 18, fiber: 12, sugar: 5, sodium: 610 }
  },
  {
    id: 'l63',
    name: 'Bitosso',
    description: 'Meat and groundnut stew.',
    image: '/meals/groundnutstew.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['500g meat', '2 cups peanuts', '4 bundles local leaves', '1 onion', '½ cup palm oil'],
      method: ['Boil meat.', 'Add leaves and peanut paste.', 'Cook.']
    },
    nutrition: { calories: 640, protein: 40, carbs: 20, fats: 42, fiber: 9, sugar: 3, sodium: 410 }
  },
  {
    id: 'l64',
    name: 'Boiled Plantain & Stew',
    description: 'Starchy plantain lunch.',
    image: '/meals/plantain.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['4 plantains', '3 tomatoes', '300g meat stew', '1 onion'],
      method: ['Boil plantains.', 'Serve with meat stew.']
    },
    nutrition: { calories: 560, protein: 18, carbs: 92, fats: 15, fiber: 9, sugar: 18, sodium: 480 }
  },
  {
    id: 'l65',
    name: 'Bongo\'o de Viande',
    description: 'Black beef stew with plantain.',
    image: '/meals/mbongo tchobi.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg beef', '3 tbsp mbongo spice', '3 plantains', '3 tomatoes', '2 onions'],
      method: ['Cook beef in black spice sauce.', 'Serve with plantain.']
    },
    nutrition: { calories: 650, protein: 42, carbs: 55, fats: 28, fiber: 7, sugar: 10, sodium: 590 }
  },
  {
    id: 'l66',
    name: 'Cassava & Fried Fish',
    description: 'Coastal classic lunch.',
    image: '/meals/fish cassava.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg cassava', '500g white fish', 'oil', '1 onion', 'salt'],
      method: ['Boil cassava.', 'Fry fish.', 'Serve together.']
    },
    nutrition: { calories: 540, protein: 35, carbs: 85, fats: 15, fiber: 10, sugar: 4, sodium: 520 }
  },
  {
    id: 'l67',
    name: 'Cassava & Peanut Dip',
    description: 'Boiled tuber with nut sauce.',
    image: '/meals/peanut sauce.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg cassava', '1 cup peanut butter', '1 tsp chili', '2 cloves garlic', 'salt'],
      method: ['Boil cassava.', 'Make spicy peanut dip.', 'Serve together.']
    },
    nutrition: { calories: 520, protein: 12, carbs: 85, fats: 18, fiber: 11, sugar: 5, sodium: 210 }
  },
  {
    id: 'l68',
    name: 'Coconut Rice',
    description: 'Rice in coconut milk.',
    image: '/meals/coconutrice.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['3 cups rice', '2 cups coconut milk', '200g shrimp', '1 tbsp ginger', '1 onion', 'salt'],
      method: ['Sauté onion and ginger.', 'Add rice and coconut milk.', 'Cook until liquid absorbed.', 'Fold in shrimp.']
    },
    nutrition: { calories: 610, protein: 12, carbs: 85, fats: 25, fiber: 4, sugar: 6, sodium: 420 }
  },
  {
    id: 'l69',
    name: 'Corn Fufu & Cabbage',
    description: 'Corn dough with veggie stir-fry.',
    image: '/meals/fufucorn.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups corn flour', '1 cabbage', '200g fish', '1 carrot', '1 onion', '2 tbsp oil'],
      method: ['Cook corn fufu.', 'Sauté cabbage with vegetables.', 'Add fish.', 'Serve together.']
    },
    nutrition: { calories: 580, protein: 22, carbs: 92, fats: 15, fiber: 12, sugar: 5, sodium: 440 }
  },
  {
    id: 'l70',
    name: 'Corn Fufu & Okra (Small)',
    description: 'Lighter corn fufu version.',
    image: '/meals/cornfufuokro.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups corn flour', '300g okra', '200g smoked fish', '2 tbsp crayfish', '½ cup palm oil'],
      method: ['Make corn fufu.', 'Prepare light okra soup.', 'Serve together.']
    },
    nutrition: { calories: 490, protein: 22, carbs: 88, fats: 12, fiber: 10, sugar: 4, sodium: 520 }
  },
  {
    id: 'l71',
    name: 'Couscous & Arachide',
    description: 'Cassava fufu & peanuts.',
    image: '/meals/peanut sauce.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups cassava flour', '2 cups peanuts', '500g beef', '3 tomatoes', '1 onion'],
      method: ['Cook cassava fufu.', 'Make peanut stew with beef.', 'Serve together.']
    },
    nutrition: { calories: 790, protein: 35, carbs: 90, fats: 38, fiber: 8, sugar: 6, sodium: 640 }
  },
  {
    id: 'l72',
    name: 'Couscous & Njama Njama',
    description: 'Corn fufu and greens.',
    image: '/meals/fufu and njama njama.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups corn flour', '4 bundles huckleberry leaves', '500g chicken', '3 tomatoes', '1 onion'],
      method: ['Cook corn fufu.', 'Sauté leaves with tomatoes and chicken.']
    },
    nutrition: { calories: 650, protein: 30, carbs: 88, fats: 20, fiber: 9, sugar: 3, sodium: 440 }
  },
  {
    id: 'l73',
    name: 'Couscous de Manioc',
    description: 'Fermented cassava fufu.',
    image: '/meals/water fufu.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups cassava flour', '4 cups water'],
      method: ['Stir flour into boiling water.', 'Beat until translucent.']
    },
    nutrition: { calories: 720, protein: 4, carbs: 165, fats: 2, fiber: 10, sugar: 1, sodium: 25 }
  },
  {
    id: 'l74',
    name: 'Couscous de Mil & Lalo',
    description: 'Millet fufu with jute leaves.',
    image: '/meals/Finger Millet.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups millet flour', '500g jute leaves', '200g dried fish', '500g beef', '1 onion', '1 cup palm oil'],
      method: ['Sauté beef and onions.', 'Add leaves and oil.', 'Slow cook.', 'Prepare millet fufu.']
    },
    nutrition: { calories: 680, protein: 32, carbs: 95, fats: 18, fiber: 12, sugar: 3, sodium: 610 }
  },
  {
    id: 'l75',
    name: 'Cow Foot Soup',
    description: 'Gelatinous spicy hoof soup.',
    image: '/meals/cow tail pepper soup.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cow feet', '2 tbsp pepper soup spice', '1 onion', '3 cloves garlic', '1 tbsp ginger', '2 bouillon cubes'],
      method: ['Pressure cook cow foot with spices.', 'Cook until falling off bone.']
    },
    nutrition: { calories: 650, protein: 52, carbs: 5, fats: 48, fiber: 0, sugar: 1, sodium: 890 }
  },
  {
    id: 'l76',
    name: 'Cow Skin (Canda) Stew',
    description: 'Spicy stewed cow skin.',
    image: '/meals/canda sauce.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['500g canda', '3 tomatoes', '1 onion', '2 tbsp oil', '2 tbsp crayfish', 'pepper'],
      method: ['Boil cow skin until soft.', 'Sauté with tomatoes and spices.']
    },
    nutrition: { calories: 480, protein: 45, carbs: 5, fats: 32, fiber: 0, sugar: 1, sodium: 780 }
  },
  {
    id: 'l77',
    name: 'Djouka',
    description: 'Fonio and peanuts.',
    image: '/meals/djouka.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups fonio', '1 cup peanuts', '200g dried fish', '1 onion', 'spices'],
      method: ['Steam fonio.', 'Mix with roasted peanut paste.']
    },
    nutrition: { calories: 520, protein: 22, carbs: 70, fats: 20, fiber: 9, sugar: 4, sodium: 450 }
  },
  {
    id: 'l78',
    name: 'Eba & Egusi',
    description: 'Garri and melon seed soup.',
    image: '/meals/egusi soup recipe.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups garri', '2 cups egusi', '500g beef', '200g spinach', '1 cup palm oil', '2 tbsp crayfish'],
      method: ['Mix garri with hot water.', 'Serve with egusi soup.']
    },
    nutrition: { calories: 780, protein: 38, carbs: 75, fats: 40, fiber: 7, sugar: 4, sodium: 710 }
  },
  {
    id: 'l79',
    name: 'Egusi Pudding',
    description: 'Steamed melon seed cake.',
    image: '/meals/egusipudding.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups egusi', '2 eggs', '200g smoked fish', '200g spinach', '2 tbsp crayfish', '1 tsp pebe'],
      method: ['Grind egusi.', 'Mix with eggs and fish.', 'Steam in leaves.']
    },
    nutrition: { calories: 420, protein: 25, carbs: 12, fats: 32, fiber: 3, sugar: 2, sodium: 380 }
  },
  {
    id: 'l80',
    name: 'Fried Rice & Chicken',
    description: 'Veggie rice with chicken.',
    image: '/meals/fried rice chicken.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['3 cups rice', '1 cup mixed vegetables', '500g chicken', '1 onion', '2 tbsp soy sauce'],
      method: ['Fry veggies and rice.', 'Serve with grilled chicken.']
    },
    nutrition: { calories: 720, protein: 35, carbs: 85, fats: 25, fiber: 5, sugar: 4, sodium: 750 }
  },
  {
    id: 'l81',
    name: 'Fufu & Groundnut',
    description: 'Cassava fufu & peanut soup.',
    image: '/meals/groundnut soup.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups cassava fufu', '2 cups peanuts', '500g chicken', '3 tomatoes', '1 onion'],
      method: ['Make peanut sauce.', 'Add chicken.', 'Serve with fufu.']
    },
    nutrition: { calories: 770, protein: 38, carbs: 82, fats: 35, fiber: 9, sugar: 8, sodium: 590 }
  },
  {
    id: 'l82',
    name: 'Fufu Plantain & Okra',
    description: 'Plantain fufu and okra.',
    image: '/meals/plantainfufu.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['4 plantains', '500g okra', '300g fish', '1 cup palm oil', '2 tbsp crayfish'],
      method: ['Pound plantains.', 'Serve with okra and fish stew.']
    },
    nutrition: { calories: 630, protein: 32, carbs: 85, fats: 20, fiber: 12, sugar: 12, sodium: 580 }
  },
  {
    id: 'l83',
    name: 'Fufu de Riz & Sauce',
    description: 'Rice fufu and tomato stew.',
    image: '/meals/tomato.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups rice flour', '3 tomatoes', '500g beef', '1 onion', '½ cup palm oil'],
      method: ['Make rice fufu.', 'Prepare tomato stew with beef.', 'Serve together.']
    },
    nutrition: { calories: 650, protein: 28, carbs: 105, fats: 12, fiber: 8, sugar: 2, sodium: 540 }
  },
  {
    id: 'l84',
    name: 'Fufu Riz & Lalo',
    description: 'Rice fufu & jute leaf.',
    image: '/meals/jute leaves.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups rice flour', '500g jute leaves', '300g fish', '2 tbsp crayfish', '1 cup palm oil'],
      method: ['Cook rice fufu.', 'Prepare slimy lalo soup with fish.']
    },
    nutrition: { calories: 610, protein: 32, carbs: 80, fats: 18, fiber: 10, sugar: 2, sodium: 630 }
  },
  {
    id: 'l85',
    name: 'Garri & Fried Fish',
    description: 'Cassava with crunchy fish.',
    image: '/meals/friedfish.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups garri', '500g fish', '1 onion', '2 tomatoes', 'oil', 'salt'],
      method: ['Soak garri.', 'Fry fish.', 'Serve together with vegetables.']
    },
    nutrition: { calories: 450, protein: 28, carbs: 60, fats: 15, fiber: 4, sugar: 2, sodium: 580 }
  },
  {
    id: 'l86',
    name: 'Grilled Fish & Dodo',
    description: 'Tilapia and fried plantain.',
    image: '/meals/fishdodo.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg tilapia', '3 plantains', '1 tbsp ginger', '3 cloves garlic', 'spices'],
      method: ['Grill marinated fish.', 'Serve with fried plantains.']
    },
    nutrition: { calories: 660, protein: 45, carbs: 55, fats: 25, fiber: 7, sugar: 15, sodium: 690 }
  },
  {
    id: 'l87',
    name: 'Jollof Rice',
    description: 'Spiced tomato rice.',
    image: '/meals/jellof rice.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['3 cups rice', '5 tomatoes', '500g chicken', '1 onion', '1 tbsp ginger', '3 cloves garlic', '2 tbsp tomato paste', 'spices'],
      method: ['Parboil rice.', 'Create tomato base.', 'Cook rice in broth.']
    },
    nutrition: { calories: 650, protein: 25, carbs: 95, fats: 15, fiber: 4, sugar: 6, sodium: 680 }
  },
  {
    id: 'l88',
    name: 'Mashed Beans',
    description: 'Savory bean and leaf mash.',
    image: '/meals/white beans mash.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups beans', '4 bundles greens', '½ cup palm oil', '1 onion', '2 tbsp crayfish'],
      method: ['Mash boiled beans.', 'Sauté with greens and oil.']
    },
    nutrition: { calories: 520, protein: 22, carbs: 82, fats: 14, fiber: 22, sugar: 4, sodium: 480 }
  },
  {
    id: 'l89',
    name: 'Mashed Corn & Beans',
    description: 'Savory grain mash.',
    image: '/meals/beanscorn.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups corn', '1 cup beans', '½ cup palm oil', '1 onion', '2 tbsp crayfish'],
      method: ['Cook corn and beans.', 'Mash together.', 'Add oil and spices.']
    },
    nutrition: { calories: 590, protein: 20, carbs: 88, fats: 18, fiber: 20, sugar: 4, sodium: 390 }
  },
  {
    id: 'l90',
    name: 'Miondo & Fried Fish',
    description: 'Cassava sticks with fish.',
    image: '/meals/miondo.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['6 miondo', '500g white fish', '3 cloves garlic', '1 onion', 'oil'],
      method: ['Steam miondo.', 'Fry fish.', 'Serve together.']
    },
    nutrition: { calories: 540, protein: 38, carbs: 45, fats: 22, fiber: 4, sugar: 2, sodium: 620 }
  },
  {
    id: 'l91',
    name: 'Palm Nut Soup (Banga)',
    description: 'Rich palm fruit extract.',
    image: '/meals/bangasoup.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups palm nut concentrate', '200g smoked fish', '300g meat', '2 tbsp crayfish', 'spices'],
      method: ['Extract palm cream.', 'Boil with meats.', 'Simmer with spices.']
    },
    nutrition: { calories: 820, protein: 30, carbs: 25, fats: 75, fiber: 8, sugar: 6, sodium: 680 }
  },
  {
    id: 'l92',
    name: 'Plantain & Fish Stew',
    description: 'Starchy fish lunch.',
    image: '/meals/plantain fish stew.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['4 plantains', '1 kg tilapia', '3 tomatoes', '1 onion', '½ cup palm oil'],
      method: ['Cook fish stew.', 'Boil plantains.', 'Serve together.']
    },
    nutrition: { calories: 680, protein: 35, carbs: 88, fats: 25, fiber: 9, sugar: 18, sodium: 620 }
  },
  {
    id: 'l93',
    name: 'Pounded Macabo',
    description: 'Smooth pounded cocoyam fufu.',
    image: '/meals/cocoyam.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg macabo', 'water'],
      method: ['Boil macabo.', 'Pound in mortar until smooth.']
    },
    nutrition: { calories: 620, protein: 10, carbs: 128, fats: 4, fiber: 14, sugar: 5, sodium: 35 }
  },
  {
    id: 'l94',
    name: 'Pounded Yam & Egusi',
    description: 'Heavy celebration meal.',
    image: '/meals/Egusi Soup.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg yam', '2 cups egusi', '500g beef', '200g spinach', '1 cup palm oil', '2 tbsp crayfish'],
      method: ['Pound boiled yam.', 'Prepare egusi soup.', 'Serve together.']
    },
    nutrition: { calories: 850, protein: 42, carbs: 95, fats: 35, fiber: 8, sugar: 5, sodium: 640 }
  },
  {
    id: 'l95',
    name: 'Rice & Beans (Coconut)',
    description: 'Coconut milk rice and beans.',
    image: '/meals/ricebeans.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['3 cups rice', '1 cup beans', '2 cups coconut milk', '1 onion', '3 cloves garlic'],
      method: ['Boil beans.', 'Cook rice in coconut milk.', 'Combine.']
    },
    nutrition: { calories: 630, protein: 18, carbs: 92, fats: 25, fiber: 12, sugar: 6, sodium: 440 }
  },
  {
    id: 'l96',
    name: 'Rice & Tomato Stew',
    description: 'Beef stew and white rice.',
    image: '/meals/ricesauce.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['3 cups rice', '500g beef', '4 tomatoes', '1 onion', 'oil', 'spices'],
      method: ['Boil rice.', 'Make fried tomato and beef sauce.', 'Serve together.']
    },
    nutrition: { calories: 640, protein: 30, carbs: 90, fats: 18, fiber: 4, sugar: 5, sodium: 690 }
  },
  {
    id: 'l97',
    name: 'Rice and Beans',
    description: 'Stir-fry rice and kidney beans.',
    image: '/meals/rice and beans.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['3 cups rice', '1 cup beans', '1 onion', '2 tbsp oil', '2 tbsp crayfish'],
      method: ['Sauté onions.', 'Toss in cooked rice and beans.', 'Stir-fry.']
    },
    nutrition: { calories: 480, protein: 12, carbs: 82, fats: 10, fiber: 9, sugar: 2, sodium: 440 }
  },
  {
    id: 'l98',
    name: 'Rice Fufu & Okra',
    description: 'Rice dough and slimy soup.',
    image: '/meals/cornfufuokro.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups rice flour', '500g okra', '300g fish', '2 tbsp crayfish', '1 cup palm oil'],
      method: ['Make rice fufu.', 'Prepare okra soup.', 'Serve together.']
    },
    nutrition: { calories: 610, protein: 28, carbs: 95, fats: 15, fiber: 10, sugar: 2, sodium: 580 }
  },
  {
    id: 'l99',
    name: 'Sauce Jaune & Taro',
    description: 'Yellow soup with taro.',
    image: '/meals/achublacksoup.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg taro', '1 cup palm oil', '¼ cup canwa', '500g beef', 'spices'],
      method: ['Boil and pound taro.', 'Create yellow oil soup.', 'Serve together.']
    },
    nutrition: { calories: 690, protein: 28, carbs: 110, fats: 25, fiber: 9, sugar: 4, sodium: 780 }
  },
  {
    id: 'l100',
    name: 'Tapsi',
    description: 'Beef and vegetable stew.',
    image: '/meals/tapsi.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['500g beef', '4 bundles spinach', '2 cups peanuts', '1 onion', '½ cup palm oil'],
      method: ['Boil beef.', 'Add ground peanuts and spinach.', 'Simmer.']
    },
    nutrition: { calories: 610, protein: 42, carbs: 15, fats: 40, fiber: 10, sugar: 2, sodium: 420 }
  },
  {
    id: 'l101',
    name: 'Waterfufu & Okra',
    description: 'Cassava fufu with okra soup.',
    image: '/meals/okro soup.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups waterfufu', '500g okra', '500g beef', '2 tbsp crayfish', '1 cup palm oil'],
      method: ['Boil waterfufu.', 'Prepare thick beef-okra stew.', 'Serve together.']
    },
    nutrition: { calories: 680, protein: 35, carbs: 85, fats: 28, fiber: 12, sugar: 2, sodium: 540 }
  },
  {
    id: 'l102',
    name: 'White Bean Porridge',
    description: 'Creamy white bean stew.',
    image: '/meals/beansporridge.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups white beans', '½ cup palm oil', '1 onion', '200g fish', '2 tbsp crayfish'],
      method: ['Boil beans until soft.', 'Add oil and onions.', 'Mash slightly.']
    },
    nutrition: { calories: 580, protein: 24, carbs: 88, fats: 15, fiber: 18, sugar: 6, sodium: 410 }
  },
  {
    id: 'l103',
    name: 'White Beans & Rice',
    description: 'Savory bean stew and rice.',
    image: '/meals/white beans rice.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 cups white beans', '3 cups rice', '3 tomatoes', '1 onion', 'oil'],
      method: ['Boil beans.', 'Sauté with tomato.', 'Serve over rice.']
    },
    nutrition: { calories: 620, protein: 20, carbs: 95, fats: 15, fiber: 14, sugar: 4, sodium: 520 }
  },
  {
    id: 'l104',
    name: 'Yam & Beans (One Pot)',
    description: 'Yam and bean porridge.',
    image: '/meals/beans.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg yam', '1 cup brown beans', '½ cup palm oil', '1 onion', '2 tbsp crayfish'],
      method: ['Cook beans.', 'Add yam cubes and oil.', 'Simmer together.']
    },
    nutrition: { calories: 610, protein: 22, carbs: 95, fats: 18, fiber: 16, sugar: 5, sodium: 420 }
  },
  {
    id: 'l105',
    name: 'Yam Stew',
    description: 'Tomato meat yam cubes.',
    image: '/meals/boiled yam beef stew.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg yam', '500g beef', '3 tomatoes', '1 onion', 'oil', 'spices'],
      method: ['Cube yam.', 'Boil in tomato and meat sauce.']
    },
    nutrition: { calories: 580, protein: 28, carbs: 85, fats: 15, fiber: 7, sugar: 6, sodium: 540 }
  },
  {
    id: 'l106',
    name: 'Salade de Fruits de Mer',
    description: 'Seafood avocado salad.',
    image: '/meals/fruitsalad.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['200g shrimp', '200g calamari', '2 avocados', '1 lime', '1 onion'],
      method: ['Steam seafood.', 'Mix with avocado and lime dressing.']
    },
    nutrition: { calories: 320, protein: 35, carbs: 12, fats: 18, fiber: 4, sugar: 5, sodium: 580 }
  },
  {
    id: 'l107',
    name: 'Avocado & Egg Salad',
    description: 'Creamy avocado and eggs.',
    image: '/meals/egg avocado.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 avocados', '3 eggs', '1 onion', '1 tomato', '1 lime'],
      method: ['Dice eggs and avocado.', 'Toss with onions and salt.']
    },
    nutrition: { calories: 350, protein: 15, carbs: 12, fats: 28, fiber: 9, sugar: 4, sodium: 310 }
  },
  {
    id: 'l108',
    name: 'Soya & Plantain',
    description: 'Beef skewers & plantain.',
    image: '/meals/soya.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['500g beef', 'suya spice', '3 plantains', '1 onion'],
      method: ['Grill beef.', 'Fry plantains.', 'Serve with onions.']
    },
    nutrition: { calories: 720, protein: 40, carbs: 60, fats: 35, fiber: 6, sugar: 15, sodium: 780 }
  },
  {
    id: 'l109',
    name: 'Spaghetti Omelette',
    description: 'Pasta and egg stir-fry.',
    image: '/meals/spaghetti omelete.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['500g spaghetti', '3 eggs', '2 tomatoes', '1 onion', 'oil', 'spices'],
      method: ['Boil spaghetti.', 'Fry with eggs and tomatoes.']
    },
    nutrition: { calories: 550, protein: 22, carbs: 65, fats: 25, fiber: 3, sugar: 6, sodium: 680 }
  },
  {
    id: 'l110',
    name: 'Spicy Gizzards (West Style)',
    description: 'Gizzards in tomato sauce.',
    image: '/meals/fried gizzard.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['500g gizzards', 'chili', '1 onion', '3 cloves garlic', '1 tsp pebe', 'oil', 'salt'],
      method: ['Boil spiced gizzards until soft.', 'Sauté with heavy pepper and onions.']
    },
    nutrition: { calories: 380, protein: 32, carbs: 5, fats: 20, fiber: 1, sugar: 2, sodium: 780 }
  },

  // ==================== DINNER (d1 - d75) ====================
  {
    id: 'd1',
    name: 'Corn Fufu & Njama Njama',
    description: 'Smooth corn fufu with sautéed huckleberry leaves.',
    image: '/meals/Njama Njama.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['2 cups corn flour', '4 bundles huckleberry leaves', '1 onion', '2 cloves garlic', '¼ cup palm oil', '2 tbsp crayfish', '1 bouillon cube', '4 cups water', 'salt'],
      method: ['Make corn fufu: Stir corn flour into boiling water until smooth.', 'For njama njama: Chop leaves, sauté with onions and garlic.', 'Add crayfish and bouillon.', 'Serve fufu with njama njama.']
    },
    nutrition: { calories: 580, protein: 22, carbs: 92, fats: 15, fiber: 12, sugar: 5, sodium: 440 }
  },
  {
    id: 'd2',
    name: 'Fish Pepper Soup',
    description: 'Spicy broth with tilapia.',
    image: '/meals/fish-pepper soup.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg tilapia', '2 tbsp pepper soup spice', '1 onion', '1 tbsp ginger', '3 cloves garlic', '2 bouillon cubes', 'salt', '2 habanero', 'scent leaves'],
      method: ['Bring water and spices to boil.', 'Add fish and simmer 10-15 minutes.', 'Add scent leaves.', 'Serve hot.']
    },
    nutrition: { calories: 280, protein: 35, carbs: 8, fats: 8, fiber: 2, sugar: 2, sodium: 690 }
  },
  {
    id: 'd3',
    name: 'Rice Fufu & Okra Stew',
    description: 'Smooth rice fufu with okra.',
    image: '/meals/okrosoup.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['2 cups rice flour', '500g okra', '500g beef', '200g smoked fish', '1 cup palm oil', '2 tbsp crayfish', '1 onion', '2 bouillon cubes'],
      method: ['Make okra stew.', 'Make rice fufu.', 'Serve together.']
    },
    nutrition: { calories: 610, protein: 28, carbs: 95, fats: 15, fiber: 10, sugar: 2, sodium: 580 }
  },
  {
    id: 'd4',
    name: 'Pounded Yam & Egusi',
    description: 'Elastic pounded yam with melon soup.',
    image: '/meals/Egusi Soup.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg yam', '2 cups egusi', '500g beef', '200g spinach', '1 cup palm oil', '2 onions', '2 tbsp crayfish', '2 bouillon cubes'],
      method: ['Pound yam until smooth.', 'Prepare egusi soup.', 'Serve together.']
    },
    nutrition: { calories: 820, protein: 40, carbs: 90, fats: 32, fiber: 8, sugar: 5, sodium: 610 }
  },
  {
    id: 'd5',
    name: 'Dried Fish Stew',
    description: 'Rich stew from dried fish.',
    image: '/meals/fishstew.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['500g dried fish', '4 tomatoes', '2 onions', '1 tbsp ginger', '3 cloves garlic', '1 cup palm oil', '2 bouillon cubes', 'salt', 'pepper'],
      method: ['Soak fish 1 hour.', 'Remove bones.', 'Boil until tender.', 'Sauté onions and tomatoes.', 'Add fish and spices.', 'Simmer 15 minutes.']
    },
    nutrition: { calories: 420, protein: 40, carbs: 15, fats: 22, fiber: 4, sugar: 6, sodium: 610 }
  },
  {
    id: 'd6',
    name: 'Plantain Hot Pot',
    description: 'Hearty plantain one-pot.',
    image: '/meals/Plantain hot pot.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 plantains', '4 bundles spinach', '200g smoked fish', '1 cup palm oil', '2 tbsp crayfish', 'spices'],
      method: ['Boil plantains.', 'Sauté greens with fish.', 'Serve hot pot over plantains.']
    },
    nutrition: { calories: 690, protein: 32, carbs: 78, fats: 25, fiber: 8, sugar: 14, sodium: 610 }
  },
  {
    id: 'd7',
    name: 'Chicken Suya',
    description: 'Spicy grilled chicken skewers.',
    image: '/meals/chicken suya.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg chicken breast', '¼ cup suya spice', '¼ cup ground peanuts', '1 tbsp ginger', '3 cloves garlic', '1 tsp chili', '½ cup oil', 'salt', '1 onion'],
      method: ['Marinate chicken 2 hours.', 'Thread onto skewers.', 'Grill 3-4 minutes per side.', 'Serve with onions.']
    },
    nutrition: { calories: 440, protein: 42, carbs: 10, fats: 24, fiber: 3, sugar: 4, sodium: 750 }
  },
  {
    id: 'd8',
    name: 'Eba & Egusi Stew',
    description: 'Cassava fufu with melon soup.',
    image: '/meals/egusi soup recipe.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['2 cups garri', '2 cups egusi', '500g beef', '200g spinach', '1 cup palm oil', '2 tbsp crayfish'],
      method: ['Make eba with garri.', 'Prepare egusi stew.', 'Serve together.']
    },
    nutrition: { calories: 780, protein: 38, carbs: 75, fats: 40, fiber: 7, sugar: 4, sodium: 710 }
  },
  {
    id: 'd9',
    name: 'Macabo & Peanut Dip',
    description: 'Boiled cocoyam with spicy peanut sauce.',
    image: '/meals/peanut sauce.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg macabo', '2 cups peanuts', '1 onion', '3 cloves garlic', '1 tsp chili', '2 bouillon cubes', 'salt'],
      method: ['Boil macabo until tender.', 'Make peanut dip.', 'Serve macabo with dip.']
    },
    nutrition: { calories: 510, protein: 15, carbs: 80, fats: 18, fiber: 11, sugar: 6, sodium: 380 }
  },
  {
    id: 'd10',
    name: 'Beef Pepper Soup',
    description: 'Spicy broth with tripe.',
    image: '/meals/pepper soup beef.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['500g beef tripe', '300g beef', '2 tbsp pepper soup spice', '1 onion', '1 tbsp ginger', '3 cloves garlic', '2 bouillon cubes', 'salt'],
      method: ['Clean tripe with lime.', 'Boil until tender.', 'Add spices and meat.', 'Simmer 15-20 minutes.', 'Serve hot.']
    },
    nutrition: { calories: 380, protein: 42, carbs: 10, fats: 18, fiber: 2, sugar: 3, sodium: 750 }
  },
  {
    id: 'd11',
    name: 'Eru & Waterfufu',
    description: 'Southwest greens with fufu.',
    image: '/meals/eru.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['500g dried eru', '200g waterleaf', '500g beef', '300g tripe', '1 cup crayfish', '1½ cups palm oil', '2 bouillon cubes', 'salt', '2 cups cassava flour'],
      method: ['Soak eru 1 hour.', 'Boil meat and tripe.', 'Add waterleaf and eru.', 'Add oil and crayfish.', 'Cook 20 minutes.', 'Make waterfufu.', 'Serve together.']
    },
    nutrition: { calories: 850, protein: 38, carbs: 95, fats: 42, fiber: 12, sugar: 2, sodium: 580 }
  },
  {
    id: 'd12',
    name: 'Poisson Braisé (Mackerel)',
    description: 'Grilled mackerel dinner.',
    image: '/meals/grilled fish.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['2 mackerel', '1 tbsp ginger', '3 cloves garlic', '1 tsp pebe', '1 tsp alligator pepper', '2 onions', '2 bouillon cubes', '½ cup oil', 'salt'],
      method: ['Marinate fish 2 hours.', 'Grill over charcoal.', 'Baste continuously.', 'Serve with pepper sauce.']
    },
    nutrition: { calories: 480, protein: 42, carbs: 4, fats: 30, fiber: 1, sugar: 1, sodium: 790 }
  },
  {
    id: 'd13',
    name: 'Poisson Braisé (Tilapia)',
    description: 'Grilled tilapia dinner.',
    image: '/meals/fishdodo.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['2 tilapia', '1 tbsp ginger', '3 cloves garlic', '1 tsp pebe', '1 tsp alligator pepper', '2 onions', '2 bouillon cubes', '½ cup oil', 'salt'],
      method: ['Make marinade.', 'Marinate fish 2 hours.', 'Grill and baste.', 'Serve hot.']
    },
    nutrition: { calories: 450, protein: 48, carbs: 5, fats: 22, fiber: 2, sugar: 1, sodium: 850 }
  },
  {
    id: 'd14',
    name: 'Poisson en Papillote',
    description: 'Steamed fish in leaves.',
    image: '/meals/fish.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['2 mackerel', '1 tbsp ginger', '3 cloves garlic', '1 tsp pebe', '1 tsp alligator pepper', 'oil', 'salt', 'banana leaves'],
      method: ['Grind spices.', 'Season fish with mbongo spice.', 'Wrap in banana leaves.', 'Steam 45 minutes.']
    },
    nutrition: { calories: 340, protein: 38, carbs: 8, fats: 12, fiber: 4, sugar: 4, sodium: 520 }
  },
  {
    id: 'd15',
    name: 'Pork Braisé',
    description: 'Spiced roasted pork.',
    image: '/meals/BBQ Pork Ears.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg pork', '1 tbsp ginger', '3 cloves garlic', '1 tsp pebe', '1 tsp alligator pepper', '2 onions', '2 bouillon cubes', '½ cup oil', 'salt'],
      method: ['Marinate pork 2 hours.', 'Grill and baste.', 'Serve with pepper sauce.']
    },
    nutrition: { calories: 610, protein: 38, carbs: 2, fats: 48, fiber: 0, sugar: 1, sodium: 880 }
  },
  {
    id: 'd16',
    name: 'Porridge Macabo',
    description: 'Grated cocoyam porridge.',
    image: '/meals/porridge cocoyam.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg grated macabo', '1 cup palm nut concentrate', '200g mackerel', '1 tbsp ginger', '2 bouillon cubes', 'salt'],
      method: ['Grate cocoyam.', 'Boil banga soup.', 'Serve porridge with soya.']
    },
    nutrition: { calories: 540, protein: 32, carbs: 75, fats: 18, fiber: 12, sugar: 5, sodium: 610 }
  },
  {
    id: 'd17',
    name: 'Potato Porridge',
    description: 'Irish potatoes in stew.',
    image: '/meals/potato.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg potatoes', '4 eggs', '3 tomatoes', '1 onion', '3 cloves garlic', '1 tsp pebe', '1 bouillon cube', 'salt'],
      method: ['Scramble eggs with veggies.', 'Boil and pound potatoes.', 'Serve porridge.']
    },
    nutrition: { calories: 420, protein: 6, carbs: 75, fats: 12, fiber: 6, sugar: 7, sodium: 440 }
  },
  {
    id: 'd18',
    name: 'Poulet DG',
    description: 'Chicken & plantain one-pot.',
    image: '/meals/poulet.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 chicken', '6 ripe plantains', '3 tomatoes', '2 onions', '1 tbsp ginger', '3 cloves garlic', '1 tsp pebe', '2 bouillon cubes', 'salt', '½ cup oil'],
      method: ['Season chicken, steam 15 minutes.', 'Fry chicken and plantains.', 'Sauté onions and tomatoes.', 'Add chicken and simmer.', 'Add plantains.']
    },
    nutrition: { calories: 800, protein: 45, carbs: 65, fats: 38, fiber: 7, sugar: 18, sodium: 710 }
  },
  {
    id: 'd19',
    name: 'Rice & Beans (Coconut)',
    description: 'Coconut rice and beans.',
    image: '/meals/rice and beans.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['3 cups rice', '1 cup beans', '2 cups coconut milk', '1 onion', '3 cloves garlic', '1 tbsp ginger', 'salt'],
      method: ['Boil beans.', 'Cook rice in coconut milk.', 'Combine.']
    },
    nutrition: { calories: 630, protein: 18, carbs: 92, fats: 25, fiber: 12, sugar: 6, sodium: 440 }
  },
  {
    id: 'd20',
    name: 'Rice & Tomato Stew',
    description: 'Beef stew and rice.',
    image: '/meals/ricestew.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['3 cups rice', '500g beef', '4 tomatoes', '1 onion', '3 cloves garlic', '½ cup oil', '2 bouillon cubes', 'salt'],
      method: ['Boil rice.', 'Make beef and tomato stew.', 'Serve together.']
    },
    nutrition: { calories: 640, protein: 30, carbs: 90, fats: 18, fiber: 4, sugar: 5, sodium: 690 }
  },
  {
    id: 'd21',
    name: 'Rice Fufu & Okra',
    description: 'Rice dough with okra.',
    image: '/meals/driedokro.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['2 cups rice flour', '1 cup dried okra powder', '200g smoked fish', '2 tbsp crayfish', '1 cup palm oil', 'salt'],
      method: ['Simmer okra powder with spices.', 'Make rice fufu.', 'Serve together.']
    },
    nutrition: { calories: 610, protein: 28, carbs: 95, fats: 15, fiber: 10, sugar: 2, sodium: 580 }
  },
  {
    id: 'd22',
    name: 'Fufu Banana & Okra',
    description: 'Green banana fufu with okra.',
    image: '/meals/banana fufu.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 green bananas', '500g okra', '200g smoked fish', '1 cup palm oil', '2 tbsp crayfish', 'salt'],
      method: ['Boil and mash bananas.', 'Prepare okra stew.', 'Serve together.']
    },
    nutrition: { calories: 630, protein: 32, carbs: 85, fats: 20, fiber: 12, sugar: 12, sodium: 580 }
  },
  {
    id: 'd23',
    name: 'Fufu Riz & Sauce Jaune',
    description: 'Rice fufu with yellow soup.',
    image: '/meals/fufu corn.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['2 cups rice flour', '1 cup palm oil', '2 cups beef broth', '1½ tbsp achu spices', '¼ cup canwa', 'salt'],
      method: ['Make rice fufu.', 'Prepare yellow soup.', 'Serve together.']
    },
    nutrition: { calories: 590, protein: 8, carbs: 125, fats: 4, fiber: 3, sugar: 2, sodium: 45 }
  },
  {
    id: 'd24',
    name: 'Kati Kati',
    description: 'West Region mash.',
    image: '/meals/kati kati fufu.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['500g okra', '200g smoked fish', '1 cup palm oil', '2 tbsp crayfish', 'spices', '3 fried plantains'],
      method: ['Boil meat.', 'Sauté spices.', 'Simmer okra with spices.', 'Serve with dodo.']
    },
    nutrition: { calories: 520, protein: 28, carbs: 58, fats: 22, fiber: 5, sugar: 16, sodium: 610 }
  },
  {
    id: 'd25',
    name: 'Kion',
    description: 'Forest soup.',
    image: '/meals/kion.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg fish', '200g smoked fish', '2 tbsp crayfish', '1 tbsp ginger', 'salt', 'pepper'],
      method: ['Pound fufu.', 'Simmer fish.', 'Prepare forest leaf soup.']
    },
    nutrition: { calories: 490, protein: 42, carbs: 45, fats: 15, fiber: 6, sugar: 3, sodium: 440 }
  },
  {
    id: 'd26',
    name: 'Koki Corn (Evening)',
    description: 'Evening corn pudding.',
    image: '/meals/koki-corn.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg fresh corn', '½ cup palm oil', '2 cups spinach', '1 tbsp ginger', '2 tbsp crayfish', 'salt', 'banana leaves', '2 cups rice flour'],
      method: ['Make koki corn.', 'Prepare rice fufu.', 'Serve together.']
    },
    nutrition: { calories: 310, protein: 10, carbs: 52, fats: 10, fiber: 7, sugar: 6, sodium: 380 }
  },
  {
    id: 'd27',
    name: 'Koki Corn (Standard Wrap)',
    description: 'Standard corn wrap.',
    image: '/meals/kokicorn.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg corn', '½ cup palm oil', '2 cups spinach', '1 tbsp ginger', '2 tbsp crayfish', '2 bouillon cubes', 'salt', 'banana leaves'],
      method: ['Grate corn and ginger.', 'Whisk paste.', 'Add oil and spinach.', 'Wrap in leaves.', 'Steam.']
    },
    nutrition: { calories: 280, protein: 7, carbs: 45, fats: 10, fiber: 6, sugar: 6, sodium: 310 }
  },
  {
    id: 'd28',
    name: 'Kondre',
    description: 'Ceremonial plantain stew.',
    image: '/meals/kondre.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 unripe plantains', '1 kg beef', '3 tomatoes', '2 onions', '1 tbsp ginger', '3 cloves garlic', '½ cup palm oil', '2 tbsp crayfish', '2 bouillon cubes', 'salt'],
      method: ['Season beef.', 'Sauté onions and tomatoes.', 'Add beef and water.', 'Simmer 30 minutes.', 'Add plantains.', 'Cook until thick.']
    },
    nutrition: { calories: 710, protein: 38, carbs: 82, fats: 24, fiber: 11, sugar: 14, sodium: 520 }
  },
  {
    id: 'd29',
    name: 'Kundi',
    description: 'Dried greens stew.',
    image: '/meals/kundi.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['500g dried njama njama', '500g beef', '200g mackerel', '1 cup palm oil', '2 tbsp crayfish', 'spices'],
      method: ['Rehydrate leaves.', 'Steam beef.', 'Sauté egusi.', 'Mix stew.']
    },
    nutrition: { calories: 410, protein: 28, carbs: 15, fats: 30, fiber: 12, sugar: 2, sodium: 520 }
  },
  {
    id: 'd30',
    name: 'Kwacoco & Banga Soup',
    description: 'Cocoyam with palm soup.',
    image: '/meals/kwacoco banga soup.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg grated malanga', '2 cups palm nut concentrate', '200g mackerel', '1 tbsp ginger', '2 bouillon cubes', 'salt'],
      method: ['Grate cocoyam.', 'Boil banga with crayfish.', 'Serve kwacoco with banga.']
    },
    nutrition: { calories: 820, protein: 35, carbs: 90, fats: 40, fiber: 10, sugar: 6, sodium: 620 }
  },
  {
    id: 'd31',
    name: 'Macabo & Peanut Dip',
    description: 'Cocoyam with peanut sauce.',
    image: '/meals/peanut sauce.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg macabo', '2 cups peanuts', '1 onion', '3 cloves garlic', '1 tsp chili', '2 bouillon cubes', 'salt'],
      method: ['Boil and pound cocoyam.', 'Grind peanuts.', 'Make dip.', 'Mix dip with cocoyam.']
    },
    nutrition: { calories: 440, protein: 8, carbs: 82, fats: 10, fiber: 12, sugar: 5, sodium: 310 }
  },
  {
    id: 'd32',
    name: 'Masa (Evening)',
    description: 'Evening rice cakes.',
    image: '/meals/masa.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['2 cups rice flour', '½ cup sugar', '1 tbsp yeast', '1½ cups water', 'oil', '200g mackerel', '1 onion', 'chili'],
      method: ['Make masa.', 'Debone mackerel.', 'Mix with onions and chili.', 'Serve with pepper sauce.']
    },
    nutrition: { calories: 320, protein: 4, carbs: 65, fats: 3, fiber: 2, sugar: 22, sodium: 110 }
  },
  {
    id: 'd33',
    name: 'Mbol',
    description: 'Grassfields stew.',
    image: '/meals/mbol.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['500g okra', '200g smoked fish', '1 cup palm oil', '2 tbsp crayfish', 'spices', '3 fried plantains'],
      method: ['Boil meat.', 'Sauté spices.', 'Simmer okra with spices.', 'Serve with dodo.']
    },
    nutrition: { calories: 620, protein: 30, carbs: 25, fats: 45, fiber: 8, sugar: 3, sodium: 410 }
  },
  {
    id: 'd34',
    name: 'Mbongo Tchobi',
    description: 'Black spicy stew.',
    image: '/meals/mbongo.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg tilapia', '3 tbsp mbongo spice', '3 tomatoes', '2 onions', '1 tbsp ginger', '3 cloves garlic', '½ cup palm oil', '2 bouillon cubes', 'salt'],
      method: ['Grind mbongo spice.', 'Marinate fish.', 'Sauté onions and tomatoes.', 'Add fish and water.', 'Simmer 15 minutes.']
    },
    nutrition: { calories: 480, protein: 40, carbs: 15, fats: 35, fiber: 6, sugar: 3, sodium: 480 }
  },
  {
    id: 'd35',
    name: 'Mbongo Tchobi Fish',
    description: 'Black fish stew.',
    image: '/meals/Mbongo-Tchobi-1.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg tilapia', '1 tbsp ginger', '1 tsp pebe', '1 tsp alligator pepper', '½ cup oil', 'salt', 'banana leaves'],
      method: ['Roast alligator pepper.', 'Grind barks.', 'Season fish.', 'Wrap in leaves.', 'Steam.']
    },
    nutrition: { calories: 340, protein: 38, carbs: 8, fats: 12, fiber: 4, sugar: 4, sodium: 520 }
  },
  {
    id: 'd36',
    name: 'Miondo & Avocado',
    description: 'Cassava sticks with avocado.',
    image: '/meals/miondo.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 miondo', '2 avocados', 'salt'],
      method: ['Prepare miondo.', 'Serve with avocado.']
    },
    nutrition: { calories: 450, protein: 6, carbs: 65, fats: 24, fiber: 12, sugar: 4, sodium: 180 }
  },
  {
    id: 'd37',
    name: 'Ndole (Light Dinner)',
    description: 'Light bitterleaf stew.',
    image: '/meals/ndole.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['300g bitter leaves', '1 cup peanuts', '300g beef', '1 onion', '½ cup palm oil', '2 tbsp crayfish', 'salt'],
      method: ['Prepare bitter leaves.', 'Make peanut paste.', 'Cook beef.', 'Combine and simmer.']
    },
    nutrition: { calories: 510, protein: 22, carbs: 45, fats: 28, fiber: 6, sugar: 6, sodium: 520 }
  },
  {
    id: 'd38',
    name: 'Ndole (Small Portion)',
    description: 'Small bitterleaf stew.',
    image: '/meals/ndole.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['300g bitter leaves', '1 cup peanuts', '300g beef', '1 onion', '½ cup palm oil', 'salt'],
      method: ['Grate cocoyams.', 'Make peanut paste.', 'Cook beef.', 'Add meat and leaves.']
    },
    nutrition: { calories: 420, protein: 22, carbs: 35, fats: 25, fiber: 6, sugar: 6, sodium: 450 }
  },
  {
    id: 'd39',
    name: 'Ndolé with Crayfish',
    description: 'Bitterleaf with crayfish.',
    image: '/meals/ndole shrimp.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['300g bitter leaves', '1 cup peanuts', '300g beef', '½ cup crayfish', '1 onion', '½ cup palm oil', 'salt'],
      method: ['Prepare Ndole.', 'Add extra ground crayfish.', 'Simmer until oil rises.']
    },
    nutrition: { calories: 740, protein: 48, carbs: 42, fats: 42, fiber: 9, sugar: 6, sodium: 680 }
  },
  {
    id: 'd40',
    name: 'Ndolé with Shrimp',
    description: 'Shrimp bitterleaf stew.',
    image: '/meals/ndole shrimp.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['300g bitter leaves', '1 cup peanuts', '300g beef', '200g shrimp', '1 onion', '½ cup palm oil', 'salt'],
      method: ['Prepare Ndole.', 'Fold in shrimp at the end.']
    },
    nutrition: { calories: 710, protein: 45, carbs: 42, fats: 42, fiber: 9, sugar: 6, sodium: 650 }
  },
  {
    id: 'd41',
    name: 'Njangsa Fish Soup',
    description: 'Spicy nutty fish soup.',
    image: '/meals/njansa.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg fish', '1 cup njangsa', '1 tbsp ginger', '3 cloves garlic', '2 tbsp crayfish', '1 tsp pebe', '½ cup palm oil'],
      method: ['Pound fufu.', 'Simmer fish.', 'Prepare soup.', 'Assemble.']
    },
    nutrition: { calories: 380, protein: 38, carbs: 12, fats: 20, fiber: 3, sugar: 2, sodium: 610 }
  },
  {
    id: 'd42',
    name: 'Njama Njama & Yam',
    description: 'Huckleberry with yam.',
    image: '/meals/Njama Njama.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg yam', '4 bundles huckleberry', '1 onion', '¼ cup palm oil', '2 tbsp crayfish', 'salt'],
      method: ['Boil yam and pound.', 'Sauté leaves with spices.', 'Serve mix over yam.']
    },
    nutrition: { calories: 670, protein: 18, carbs: 105, fats: 22, fiber: 11, sugar: 5, sodium: 480 }
  },
  {
    id: 'd43',
    name: 'Okok (Salty)',
    description: 'Savory gnetum leaves.',
    image: '/meals/okok.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['500g okok leaves', '1 cup egusi', '1 cup palm oil', '1 onion', '2 tbsp ginger-garlic paste', '200g smoked fish', 'salt'],
      method: ['Soak leaves 1 hour.', 'Boil until tender.', 'Mix ground egusi.', 'Add to leaves.', 'Cook.']
    },
    nutrition: { calories: 750, protein: 25, carbs: 45, fats: 48, fiber: 11, sugar: 5, sodium: 520 }
  },
  {
    id: 'd44',
    name: 'Okok (Sweet)',
    description: 'Sweet gnetum leaves.',
    image: '/meals/okok.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['500g okok leaves', '1 cup egusi', '1 cup palm oil', '½ cup sugar', '1 onion', '200g smoked fish', 'salt'],
      method: ['Soak leaves.', 'Boil until tender.', 'Add egusi mix.', 'Add sugar.', 'Cook.']
    },
    nutrition: { calories: 890, protein: 20, carbs: 70, fats: 55, fiber: 11, sugar: 45, sodium: 210 }
  },
  {
    id: 'd45',
    name: 'Okok with Cassava',
    description: 'Gnetum with cassava.',
    image: '/meals/okok.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['500g okok leaves', '1 cup egusi', '1 cup palm oil', '500g cassava paste', '2 tbsp crayfish'],
      method: ['Prepare okok.', 'Stir cassava paste.', 'Assemble.']
    },
    nutrition: { calories: 820, protein: 22, carbs: 95, fats: 45, fiber: 14, sugar: 25, sodium: 310 }
  },
  {
    id: 'd46',
    name: 'Okra & Fufu Corn',
    description: 'Corn fufu with okra.',
    image: '/meals/cornfufuokro.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['2 cups corn flour', '500g okra', '500g beef', '200g smoked fish', '1 cup palm oil', '2 tbsp crayfish'],
      method: ['Make corn fufu.', 'Prepare okra stew.', 'Serve together.']
    },
    nutrition: { calories: 680, protein: 40, carbs: 88, fats: 22, fiber: 12, sugar: 4, sodium: 710 }
  },
  {
    id: 'd47',
    name: 'Okra & Pounded Yam',
    description: 'Slimy soup with yam.',
    image: '/meals/okro soup.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg yam', '500g okra', '500g beef', '200g smoked fish', '1 cup palm oil', '2 tbsp crayfish'],
      method: ['Make okra stew.', 'Boil and pound yam.', 'Serve together.']
    },
    nutrition: { calories: 780, protein: 38, carbs: 95, fats: 25, fiber: 12, sugar: 4, sodium: 690 }
  },
  {
    id: 'd48',
    name: 'Okra (Standard Dinner)',
    description: 'Standard okra dinner.',
    image: '/meals/okrosoup.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['500g okra', '500g beef', '200g smoked fish', '1 cup palm oil', '2 tbsp crayfish', '1 onion', '2 bouillon cubes'],
      method: ['Prepare meat stew.', 'Add okra and cook.', 'Serve with fufu.']
    },
    nutrition: { calories: 600, protein: 45, carbs: 20, fats: 38, fiber: 10, sugar: 4, sodium: 690 }
  },
  {
    id: 'd49',
    name: 'Okra Soup',
    description: 'Slimy okra stew.',
    image: '/meals/okrogarri.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['500g okra', '500g canda', '300g tripe', '200g mackerel', '1 cup palm oil', '2 tbsp crayfish', 'spices'],
      method: ['Boil meats.', 'Chop okra finely.', 'Add okra to broth.', 'Simmer until slimy.']
    },
    nutrition: { calories: 600, protein: 45, carbs: 20, fats: 38, fiber: 10, sugar: 4, sodium: 690 }
  },
  {
    id: 'd50',
    name: 'Palm Nut Soup',
    description: 'Banga soup dinner.',
    image: '/meals/bangasoup.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['2 cups palm nut concentrate', '200g smoked fish', '200g meat', '1 tbsp ginger', '2 tbsp crayfish', '1 tsp pebe', 'salt', '4 green bananas'],
      method: ['Make banga soup.', 'Prepare fufu banana.', 'Serve together.']
    },
    nutrition: { calories: 820, protein: 30, carbs: 25, fats: 75, fiber: 8, sugar: 6, sodium: 680 }
  },
  {
    id: 'd51',
    name: 'Pepper Soup Beef',
    description: 'Spicy beef soup.',
    image: '/meals/pepper soup beef.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['500g beef tripe', '300g beef', '2 tbsp pepper soup spice', '1 onion', '1 tbsp ginger', '3 cloves garlic', '2 bouillon cubes', 'salt'],
      method: ['Boil tripe and beef.', 'Add spices.', 'Simmer.']
    },
    nutrition: { calories: 380, protein: 42, carbs: 10, fats: 18, fiber: 2, sugar: 3, sodium: 750 }
  },
  {
    id: 'd52',
    name: 'Pepper Soup Chicken',
    description: 'Spicy chicken soup.',
    image: '/meals/pepper soup chicken.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg chicken', '2 tbsp pepper soup spice', '1 onion', '1 tbsp ginger', '3 cloves garlic', '2 bouillon cubes', 'salt'],
      method: ['Boil chicken with spices.', 'Simmer until cooked.']
    },
    nutrition: { calories: 390, protein: 38, carbs: 10, fats: 15, fiber: 2, sugar: 2, sodium: 620 }
  },
  {
    id: 'd53',
    name: 'Pepper Soup Cow Tail',
    description: 'Gelatinous tail soup.',
    image: '/meals/cow tail pepper soup.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg cow tail', '2 tbsp pepper soup spice', '1 onion', '1 tbsp ginger', '3 cloves garlic', '2 bouillon cubes', 'salt'],
      method: ['Boil cow tail with spices.', 'Cook until tender.']
    },
    nutrition: { calories: 480, protein: 45, carbs: 10, fats: 28, fiber: 2, sugar: 3, sodium: 780 }
  },
  {
    id: 'd54',
    name: 'Pepper Soup Fish',
    description: 'Spicy fish broth.',
    image: '/meals/fish pepper soup.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg fish', '2 tbsp pepper soup spice', '1 onion', '1 tbsp ginger', '3 cloves garlic', '2 bouillon cubes', 'salt'],
      method: ['Boil fish with spices.', 'Simmer 10-15 minutes.']
    },
    nutrition: { calories: 350, protein: 45, carbs: 10, fats: 12, fiber: 2, sugar: 2, sodium: 820 }
  },
  {
    id: 'd55',
    name: 'Pepper Soup Goat',
    description: 'Medicinal goat soup.',
    image: '/meals/Goat meat pepper soup.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg goat meat', '2 tbsp pepper soup spice', '1 onion', '1 tbsp ginger', '3 cloves garlic', '2 bouillon cubes', 'salt'],
      method: ['Boil goat meat with spices.', 'Simmer until tender.']
    },
    nutrition: { calories: 410, protein: 35, carbs: 12, fats: 22, fiber: 4, sugar: 2, sodium: 850 }
  },
  {
    id: 'd56',
    name: 'Pepper Soup Goat (Heavy)',
    description: 'Thick goat broth.',
    image: '/meals/Goat-Meat-Pepper-Soup.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg goat meat', '3 tbsp pepper soup spice', '1 onion', '1 tbsp ginger', '3 cloves garlic', '2 bouillon cubes', 'salt'],
      method: ['Boil goat with extra spices.', 'Cook until very tender.']
    },
    nutrition: { calories: 450, protein: 42, carbs: 12, fats: 25, fiber: 3, sugar: 4, sodium: 850 }
  },
  {
    id: 'd57',
    name: 'Pepper Soup Goat (Small)',
    description: 'Lighter goat broth.',
    image: '/meals/Goat meat pepper soup.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['500g goat meat', '1 tbsp pepper soup spice', '1 onion', '1 tbsp ginger', '2 cloves garlic', '1 bouillon cube', 'salt'],
      method: ['Boil goat with spices.', 'Simmer until tender.']
    },
    nutrition: { calories: 310, protein: 28, carbs: 8, fats: 18, fiber: 2, sugar: 2, sodium: 710 }
  },
  {
    id: 'd58',
    name: 'Pepper Soup Snail',
    description: 'Spicy snail broth.',
    image: '/meals/snails.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg snails', '2 tbsp pepper soup spice', '1 onion', '1 tbsp ginger', '3 cloves garlic', '2 bouillon cubes', 'salt', 'lime'],
      method: ['Clean snails with lime.', 'Boil with spices.', 'Simmer 20 minutes.']
    },
    nutrition: { calories: 260, protein: 35, carbs: 8, fats: 10, fiber: 1, sugar: 2, sodium: 740 }
  },
  {
    id: 'd59',
    name: 'Pepper Soup Tripe',
    description: 'Tripe in spicy broth.',
    image: '/meals/pepper soup.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg tripe', '2 tbsp pepper soup spice', '1 onion', '1 tbsp ginger', '3 cloves garlic', '2 bouillon cubes', 'salt', 'lime'],
      method: ['Clean tripe with lime.', 'Boil with spices.', 'Simmer until tender.']
    },
    nutrition: { calories: 320, protein: 38, carbs: 8, fats: 18, fiber: 1, sugar: 2, sodium: 780 }
  },
  {
    id: 'd60',
    name: 'Plantain & Fish Stew',
    description: 'Plantain with fish.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['4 plantains', '500g fish', '3 tomatoes', '1 onion', '½ cup palm oil', '2 bouillon cubes'],
      method: ['Make fish stew.', 'Boil plantains.', 'Serve together.']
    },
    nutrition: { calories: 680, protein: 35, carbs: 88, fats: 25, fiber: 9, sugar: 18, sodium: 620 }
  },
  {
    id: 'd61',
    name: 'Plantain & Hot Pot',
    description: 'Plantain hot pot.',
    image: '/meals/plantain hot pot.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 plantains', '4 bundles spinach', '200g smoked fish', '1 cup palm oil', '2 tbsp crayfish', 'spices'],
      method: ['Boil plantains.', 'Sauté greens with fish.', 'Serve hot pot over plantains.']
    },
    nutrition: { calories: 690, protein: 32, carbs: 78, fats: 25, fiber: 8, sugar: 14, sodium: 610 }
  },
  {
    id: 'd62',
    name: 'Sautéed Cabbage & Fish',
    description: 'Cabbage with fish.',
    image: '/meals/cabbage fish.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['500g fish', '1 cabbage', 'chili', '1 onion', '3 cloves garlic', '1 tsp pebe', 'oil', 'salt'],
      method: ['Simmer fish with onions.', 'Toss with cabbage.', 'Serve with yam.']
    },
    nutrition: { calories: 310, protein: 25, carbs: 18, fats: 15, fiber: 7, sugar: 6, sodium: 490 }
  },
  {
    id: 'd63',
    name: 'Sautéed Spinach & Fish',
    description: 'Spinach with fish.',
    image: '/meals/spinachstew.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg tilapia', '4 bundles spinach', '1 onion', '2 tbsp crayfish', '½ cup palm oil', 'salt'],
      method: ['Sauté spinach.', 'Simmer fish.', 'Serve together.']
    },
    nutrition: { calories: 320, protein: 28, carbs: 15, fats: 18, fiber: 9, sugar: 4, sodium: 410 }
  },
  {
    id: 'd64',
    name: 'Smoked Fish & Cassava',
    description: 'Smoked fish with cassava.',
    image: '/meals/fish cassava.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['500g smoked fish', '1 kg cassava', '1 onion', '2 tbsp crayfish', '½ cup palm oil', 'salt'],
      method: ['Boil cassava.', 'Sauté fish with onions.', 'Serve together.']
    },
    nutrition: { calories: 480, protein: 42, carbs: 82, fats: 10, fiber: 9, sugar: 4, sodium: 550 }
  },
  {
    id: 'd65',
    name: 'Soya & Plantain',
    description: 'Beef skewers with plantain.',
    image: '/meals/suya.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['500g beef suya', '3 plantains', '1 onion', 'suya spice'],
      method: ['Make suya.', 'Fry plantains.', 'Serve with pepper sauce.']
    },
    nutrition: { calories: 720, protein: 40, carbs: 60, fats: 35, fiber: 6, sugar: 15, sodium: 780 }
  },
  {
    id: 'd66',
    name: 'Soya de Poulet',
    description: 'Large chicken skewer.',
    image: '/meals/chicken suya.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg chicken', 'suya spice', '1 cup ground peanuts', '1 tsp chili', 'salt'],
      method: ['Marinate chicken.', 'Grill suya.', 'Skewer.', 'Serve with potatoes.']
    },
    nutrition: { calories: 550, protein: 45, carbs: 12, fats: 35, fiber: 3, sugar: 5, sodium: 780 }
  },
  {
    id: 'd67',
    name: 'Spicy Snail Skewer',
    description: 'Peppered forest snails.',
    image: '/meals/friedsnails.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg snails', 'lime', 'salt', 'chili', '1 onion', '3 cloves garlic'],
      method: ['Clean snails with lime.', 'Boil until soft.', 'Sauté with chili and onions.']
    },
    nutrition: { calories: 190, protein: 25, carbs: 3, fats: 10, fiber: 0, sugar: 1, sodium: 620 }
  },
  {
    id: 'd68',
    name: 'Spicy Tripe',
    description: 'Serviette style tripe.',
    image: '/meals/tripe.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg tripe', '1 onion', '3 cloves garlic', '1 cup palm oil', '2 tbsp crayfish', 'spices'],
      method: ['Clean tripe with lime.', 'Boil until tender.', 'Sauté with spices.']
    },
    nutrition: { calories: 280, protein: 35, carbs: 2, fats: 15, fiber: 0, sugar: 1, sodium: 810 }
  },
  {
    id: 'd69',
    name: 'Sweet Potato Porridge',
    description: 'Sweet potato dinner.',
    image: '/meals/potatoporridge.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg sweet potatoes', '500g beef', '200g smoked fish', '1 onion', '½ cup palm oil', '2 tbsp crayfish', '2 bouillon cubes'],
      method: ['Cube sweet potatoes.', 'Cook with beef and fish.', 'Simmer until thick.']
    },
    nutrition: { calories: 480, protein: 8, carbs: 95, fats: 12, fiber: 9, sugar: 18, sodium: 340 }
  },
  {
    id: 'd70',
    name: 'Vegan Pepper Soup',
    description: 'Tofu pepper soup.',
    image: '/meals/pepper soup.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['500g tofu', '2 tbsp pepper soup spice', '1 onion', '1 tbsp ginger', '3 cloves garlic', '2 bouillon cubes', 'salt'],
      method: ['Boil tofu with spices.', 'Simmer 15 minutes.']
    },
    nutrition: { calories: 260, protein: 22, carbs: 8, fats: 12, fiber: 3, sugar: 2, sodium: 540 }
  },
  {
    id: 'd71',
    name: 'Vegetable Soup (North)',
    description: 'Northern vegetable soup.',
    image: '/meals/Chicken-Peppersoup.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg achu cocoyam', '1 cup palm nut concentrate', '1 tbsp ginger', '200g smoked fish', '2 tbsp crayfish', '1 tsp pebe', 'salt'],
      method: ['Boil cocoyam and pound.', 'Simmer banga.', 'Serve soup over fufu.']
    },
    nutrition: { calories: 590, protein: 12, carbs: 110, fats: 22, fiber: 12, sugar: 4, sodium: 710 }
  },
  {
    id: 'd72',
    name: 'Waterfufu & Okra Stew',
    description: 'Cassava fufu with okra.',
    image: '/meals/okrosoup.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['2 cups waterfufu', '500g okra', '500g beef', '200g smoked fish', '1 cup palm oil', '2 tbsp crayfish'],
      method: ['Make okra stew.', 'Make waterfufu.', 'Serve together.']
    },
    nutrition: { calories: 680, protein: 35, carbs: 85, fats: 28, fiber: 12, sugar: 2, sodium: 540 }
  },
  {
    id: 'd73',
    name: 'Yam & Egg Stew',
    description: 'Yam with egg stew.',
    image: '/meals/egg sauce yam.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg yam', '4 eggs', '3 tomatoes', '1 onion', '3 cloves garlic', '1 tsp pebe', '2 bouillon cubes', 'salt'],
      method: ['Boil and pound yam.', 'Make egg stew.', 'Serve together.']
    },
    nutrition: { calories: 550, protein: 16, carbs: 78, fats: 22, fiber: 7, sugar: 4, sodium: 490 }
  },
  {
    id: 'd74',
    name: 'Yam Porridge',
    description: 'Yam dinner porridge.',
    image: '/meals/yam porridge.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg yam', '500g beef', '200g smoked fish', '1 onion', '½ cup palm oil', '2 tbsp crayfish', '2 bouillon cubes'],
      method: ['Cube yam.', 'Cook with meat and fish.', 'Simmer until thick.']
    },
    nutrition: { calories: 520, protein: 12, carbs: 88, fats: 15, fiber: 7, sugar: 5, sodium: 440 }
  },
  {
    id: 'd75',
    name: 'Zom (Nightshade Soup)',
    description: 'Nightshade leaves soup.',
    image: '/meals/nightshade.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 bundles zom', '1 tbsp ginger', '2 tbsp crayfish', '¼ cup palm oil', 'salt'],
      method: ['Boil leaves with ginger.', 'Add crayfish and oil.', 'Serve as medicinal drink.']
    },
    nutrition: { calories: 150, protein: 4, carbs: 20, fats: 2, fiber: 6, sugar: 8, sodium: 310 }
  },

  // ==================== SNACKS (s1 - s100) ====================
  {
    id: 's1',
    name: 'Puff Puff',
    description: 'Deep-fried sweet dough balls.',
    image: '/meals/puffpuff.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 cups flour', '¾ cup sugar', '2 tsp yeast', '1 tsp salt', '2 cups warm water', 'oil for frying'],
      method: ['Dissolve yeast and sugar in water, let sit 10 minutes.', 'Mix flour and salt.', 'Add yeast mixture, stir until smooth.', 'Cover and let rise 1-2 hours.', 'Heat oil, scoop batter with wet hands.', 'Drop into oil, fry until golden.', 'Drain on paper towels.']
    },
    nutrition: { calories: 420, protein: 6, carbs: 68, fats: 15, fiber: 2, sugar: 18, sodium: 180 }
  },
  {
    id: 's2',
    name: 'Puff Puff & Beans',
    description: 'Puff puff with beans.',
    image: '/meals/puff puff beans.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 cups flour', '¾ cup sugar', '2 tsp yeast', '2 cups water', 'oil', '2 cups beans', '1 onion', '3 tomatoes', '¼ cup palm oil'],
      method: ['Make puff puff.', 'Cook beans until tender.', 'Sauté onions and tomatoes.', 'Add beans.', 'Serve puff puff with beans.']
    },
    nutrition: { calories: 550, protein: 18, carbs: 85, fats: 22, fiber: 12, sugar: 14, sodium: 350 }
  },
  {
    id: 's3',
    name: 'Puffed Rice',
    description: 'Local style puffed rice.',
    image: '/meals/puffed rice.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['2 cups rice', 'oil for frying', 'sugar to taste'],
      method: ['Heat oil.', 'Add rice and fry until puffed.', 'Drain and sprinkle with sugar.']
    },
    nutrition: { calories: 180, protein: 3, carbs: 40, fats: 1, fiber: 2, sugar: 15, sodium: 120 }
  },
  {
    id: 's4',
    name: 'Roasted African Plum',
    description: 'Roasted Safou pears.',
    image: '/meals/plums.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['6 Safou', 'salt'],
      method: ['Roast African plums over coals.', 'Sprinkle with salt.', 'Serve warm.']
    },
    nutrition: { calories: 150, protein: 3, carbs: 8, fats: 12, fiber: 4, sugar: 2, sodium: 5 }
  },
  {
    id: 's5',
    name: 'Roasted Cocoyam',
    description: 'Grilled cocoyam with spicy nut mash.',
    image: '/meals/cocoyam.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg cocoyam', 'salt', 'spicy nut mash'],
      method: ['Roast cocoyam on coals.', 'Make spicy nut dip.', 'Serve together.']
    },
    nutrition: { calories: 390, protein: 4, carbs: 82, fats: 2, fiber: 12, sugar: 4, sodium: 85 }
  },
  {
    id: 's6',
    name: 'Roasted Corn',
    description: 'Charcoal-grilled maize.',
    image: '/meals/roastedcorn.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 ears corn', 'salt', 'butter'],
      method: ['Remove husks.', 'Grill over hot coals until charred.', 'Brush with butter and salt.', 'Serve hot.']
    },
    nutrition: { calories: 150, protein: 4, carbs: 32, fats: 1, fiber: 6, sugar: 4, sodium: 380 }
  },
  {
    id: 's7',
    name: 'Roasted Corn (Large)',
    description: 'Large roasted corn.',
    image: '/meals/roastedcorn.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 large ears corn', '¼ cup palm oil', 'salt'],
      method: ['Peel corn.', 'Roast on hot coals.', 'Brush with palm oil and salt.']
    },
    nutrition: { calories: 180, protein: 4, carbs: 38, fats: 2, fiber: 6, sugar: 5, sodium: 80 }
  },
  {
    id: 's8',
    name: 'Roasted Corn & Groundnut',
    description: 'Grilled corn with peanuts.',
    image: '/meals/roastedcorn.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 ears corn', '1 cup peanuts', 'salt'],
      method: ['Roast corn.', 'Roast peanuts.', 'Serve together.']
    },
    nutrition: { calories: 310, protein: 8, carbs: 55, fats: 12, fiber: 8, sugar: 6, sodium: 120 }
  },
  {
    id: 's9',
    name: 'Roasted Corn & Plums',
    description: 'Corn with African plums.',
    image: '/meals/corn and plum.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 ears corn', '6 Safou', 'salt'],
      method: ['Roast corn.', 'Roast plums.', 'Serve together.']
    },
    nutrition: { calories: 240, protein: 5, carbs: 48, fats: 8, fiber: 10, sugar: 12, sodium: 15 }
  },
  {
    id: 's10',
    name: 'Roasted Groundnuts',
    description: 'Dry roasted peanuts.',
    image: '/meals/groundnut.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['2 cups raw peanuts', 'salt'],
      method: ['Spread peanuts on baking sheet.', 'Roast at 350°F for 15-20 minutes.', 'Sprinkle with salt.']
    },
    nutrition: { calories: 560, protein: 25, carbs: 16, fats: 48, fiber: 9, sugar: 4, sodium: 110 }
  },
  {
    id: 's11',
    name: 'Roasted Groundnuts (Salty)',
    description: 'Salted roasted peanuts.',
    image: '/meals/groundnut fried.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['2 cups peanuts', '¼ cup palm oil', 'salt'],
      method: ['Heat oil in pan.', 'Add peanuts and fry until golden.', 'Drain and salt.']
    },
    nutrition: { calories: 580, protein: 26, carbs: 16, fats: 50, fiber: 9, sugar: 3, sodium: 450 }
  },
  {
    id: 's12',
    name: 'Roasted Irish Potato',
    description: 'Charcoal-baked potatoes.',
    image: '/meals/Irish Potato Roast.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg potatoes', 'salt'],
      method: ['Wrap potatoes in foil.', 'Roast on coals for 30-40 minutes.', 'Serve with salt.']
    },
    nutrition: { calories: 210, protein: 3, carbs: 45, fats: 2, fiber: 5, sugar: 2, sodium: 180 }
  },
  {
    id: 's13',
    name: 'Roasted Pig Ear',
    description: 'Grilled pork ear snack.',
    image: '/meals/BBQ Pork Ears.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 pig ears', 'suya spice', 'oil', 'salt'],
      method: ['Clean ears.', 'Season with suya spice.', 'Grill until crispy.', 'Slice and serve.']
    },
    nutrition: { calories: 290, protein: 28, carbs: 0, fats: 20, fiber: 0, sugar: 0, sodium: 920 }
  },
  {
    id: 's14',
    name: 'Roasted Pig Skin',
    description: 'Grilled cracklings.',
    image: '/meals/roasted pork.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['500g pig skin', 'salt', 'spices'],
      method: ['Clean skin.', 'Score and season.', 'Grill until crispy.']
    },
    nutrition: { calories: 350, protein: 32, carbs: 0, fats: 25, fiber: 0, sugar: 0, sodium: 890 }
  },
  {
    id: 's15',
    name: 'Roasted Plantain (Salt)',
    description: 'Simple grilled plantain.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 plantains', 'salt'],
      method: ['Roast plantain on coals.', 'Peel and slice.', 'Sprinkle with salt.']
    },
    nutrition: { calories: 190, protein: 2, carbs: 45, fats: 1, fiber: 5, sugar: 12, sodium: 320 }
  },
  {
    id: 's16',
    name: 'Roasted Plantain & Beans',
    description: 'Grilled plantain with beans.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 plantains', '2 cups beans', '1 onion', '¼ cup palm oil'],
      method: ['Boil beans.', 'Roast plantain.', 'Serve together.']
    },
    nutrition: { calories: 490, protein: 14, carbs: 88, fats: 10, fiber: 18, sugar: 22, sodium: 350 }
  },
  {
    id: 's17',
    name: 'Roasted Plantain & Plum',
    description: 'Plantain with Safou.',
    image: '/meals/roasted plantains.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 plantains', '6 Safou', 'salt'],
      method: ['Roast plantains.', 'Roast plums.', 'Serve together.']
    },
    nutrition: { calories: 380, protein: 4, carbs: 85, fats: 8, fiber: 9, sugar: 22, sodium: 45 }
  },
  {
    id: 's18',
    name: 'Roasted Sweet Potato',
    description: 'Coal-baked sweet potato.',
    image: '/meals/potato.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg sweet potatoes', 'salt'],
      method: ['Wrap in foil.', 'Roast on coals 30-40 minutes.', 'Serve with salt.']
    },
    nutrition: { calories: 220, protein: 2, carbs: 55, fats: 1, fiber: 6, sugar: 15, sodium: 90 }
  },
  {
    id: 's19',
    name: 'Roasted Turkey Tail',
    description: 'Grilled turkey tail.',
    image: '/meals/Smoked Turkey Tails.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg turkey tail', 'suya spice', 'oil', 'salt'],
      method: ['Season turkey tail.', 'Grill until crispy.', 'Serve hot.']
    },
    nutrition: { calories: 520, protein: 28, carbs: 0, fats: 45, fiber: 0, sugar: 0, sodium: 710 }
  },
  {
    id: 's20',
    name: 'Sardine Baguette',
    description: 'Spiced sardine sandwich.',
    image: '/meals/breadsardine.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 baguette', '1 tin sardines', 'chili', '1 onion'],
      method: ['Mash sardines with chili and onion.', 'Spread on baguette slices.', 'Serve.']
    },
    nutrition: { calories: 520, protein: 22, carbs: 50, fats: 28, fiber: 3, sugar: 4, sodium: 820 }
  },
  {
    id: 's21',
    name: 'Sardine Sandwich',
    description: 'Breakfast sardine sandwich.',
    image: '/meals/sardine bread sandwich.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 slices bread', '1 tin sardines', '1 onion', 'chili'],
      method: ['Mash sardines with onion and chili.', 'Spread on bread.', 'Serve.']
    },
    nutrition: { calories: 380, protein: 8, carbs: 55, fats: 14, fiber: 2, sugar: 12, sodium: 410 }
  },
  {
    id: 's22',
    name: 'Soya (Single skewer)',
    description: 'Single beef skewer.',
    image: '/meals/beef soya.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['100g beef', 'suya spice', 'oil'],
      method: ['Coat beef in suya spice.', 'Skewer and grill.', 'Serve hot.']
    },
    nutrition: { calories: 150, protein: 18, carbs: 2, fats: 8, fiber: 0, sugar: 1, sodium: 350 }
  },
  {
    id: 's23',
    name: 'Soya & Cucumber Salad',
    description: 'Suya with fresh cucumber.',
    image: '/meals/saltedcucumber.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['200g beef suya', '1 cucumber', 'salt'],
      method: ['Make suya.', 'Slice cucumber.', 'Serve together.']
    },
    nutrition: { calories: 220, protein: 24, carbs: 10, fats: 10, fiber: 3, sugar: 5, sodium: 410 }
  },
  {
    id: 's24',
    name: 'Soya & Onion Salad',
    description: 'Beef skewers with onions.',
    image: '/meals/steak.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['200g beef suya', '1 onion', 'suya spice'],
      method: ['Make suya.', 'Slice onion.', 'Serve together.']
    },
    nutrition: { calories: 210, protein: 25, carbs: 8, fats: 10, fiber: 2, sugar: 4, sodium: 580 }
  },
  {
    id: 's25',
    name: 'Spicy Snail Skewer',
    description: 'Peppered forest snails.',
    image: '/meals/friedsnails.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['500g snails', 'lime', 'chili', '1 onion', 'salt'],
      method: ['Clean snails with lime.', 'Boil until soft.', 'Skewer and grill with chili.']
    },
    nutrition: { calories: 190, protein: 25, carbs: 3, fats: 10, fiber: 0, sugar: 1, sodium: 620 }
  },
  {
    id: 's26',
    name: 'Sugar Cane (Peeled)',
    description: 'Chewable cane stalks.',
    image: '/meals/sugarcane.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['sugar cane'],
      method: ['Peel sugar cane.', 'Cut into chewable pieces.', 'Serve.']
    },
    nutrition: { calories: 120, protein: 0, carbs: 32, fats: 0, fiber: 0, sugar: 30, sodium: 5 }
  },
  {
    id: 's27',
    name: 'Sugarcane Cubes',
    description: 'Raw sugarcane pieces.',
    image: '/meals/sugarcane cube.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['sugar cane'],
      method: ['Peel and cut into cubes.', 'Serve chilled.']
    },
    nutrition: { calories: 120, protein: 0, carbs: 32, fats: 0, fiber: 2, sugar: 30, sodium: 5 }
  },
  {
    id: 's28',
    name: 'Sweet Potato Fries',
    description: 'Deep-fried sweet potato.',
    image: '/meals/sweet potatoes fries.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg sweet potatoes', 'oil for frying', 'salt'],
      method: ['Peel and slice into fries.', 'Deep-fry until golden.', 'Salt and serve.']
    },
    nutrition: { calories: 380, protein: 3, carbs: 70, fats: 10, fiber: 5, sugar: 15, sodium: 220 }
  },
  {
    id: 's29',
    name: 'Tea & Biscuits',
    description: 'Hot tea with biscuits.',
    image: '/meals/tea biscuit.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['tea bag', '2 cups water', 'condensed milk', 'sugar', 'biscuits'],
      method: ['Brew tea.', 'Add milk and sugar.', 'Serve with biscuits.']
    },
    nutrition: { calories: 250, protein: 5, carbs: 45, fats: 6, fiber: 2, sugar: 24, sodium: 180 }
  },
  {
    id: 's30',
    name: 'Watermelon Cubes',
    description: 'Fresh watermelon chunks.',
    image: '/meals/watermelon cubes.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['¼ watermelon'],
      method: ['Cut watermelon into cubes.', 'Serve chilled.']
    },
    nutrition: { calories: 80, protein: 1, carbs: 20, fats: 0, fiber: 1, sugar: 18, sodium: 2 }
  },
  {
    id: 's31',
    name: 'Yam & Sardines',
    description: 'Yam with sardine sauce.',
    image: '/meals/yam sardines.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg yam', '1 tin sardines', '1 onion', 'chili'],
      method: ['Boil yam.', 'Mash sardines with onion and chili.', 'Serve together.']
    },
    nutrition: { calories: 520, protein: 18, carbs: 78, fats: 20, fiber: 7, sugar: 4, sodium: 890 }
  },
  {
    id: 's32',
    name: 'Yam Fries (Koloko)',
    description: 'Deep fried yam chunks.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg yam', 'oil for frying', 'salt'],
      method: ['Peel and slice yam.', 'Deep-fry until golden.', 'Salt and serve.']
    },
    nutrition: { calories: 410, protein: 4, carbs: 75, fats: 12, fiber: 6, sugar: 3, sodium: 310 }
  },
  {
    id: 's33',
    name: 'Accra Banana',
    description: 'Banana and cassava fritters.',
    image: '/meals/akarabanana.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 bananas', '1 cup cassava flour', 'salt', 'oil'],
      method: ['Mash bananas.', 'Mix with flour and salt.', 'Drop scoops into hot oil.', 'Fry until golden.']
    },
    nutrition: { calories: 310, protein: 4, carbs: 58, fats: 9, fiber: 5, sugar: 22, sodium: 110 }
  },
  {
    id: 's34',
    name: 'Accra Beans',
    description: 'Savory bean fritters.',
    image: '/meals/acra beans.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['2 cups black-eyed peas', '1 onion', 'parsley', 'chili', 'salt', 'oil'],
      method: ['Blend beans into batter.', 'Add onion, parsley, chili.', 'Whisk 10 minutes.', 'Drop scoops into hot oil.', 'Fry until golden.']
    },
    nutrition: { calories: 310, protein: 14, carbs: 32, fats: 14, fiber: 9, sugar: 2, sodium: 380 }
  },
  {
    id: 's35',
    name: 'Achu (Vegetarian)',
    description: 'Taro with yellow soup.',
    image: '/meals/achu.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg taro', '1 cup palm oil', '¼ cup canwa', '200g mushrooms'],
      method: ['Pound taro.', 'Make yellow soup with mushrooms.', 'Serve together.']
    },
    nutrition: { calories: 590, protein: 12, carbs: 110, fats: 22, fiber: 12, sugar: 4, sodium: 710 }
  },
  {
    id: 's36',
    name: 'Akara',
    description: 'Deep-fried bean cakes.',
    image: '/meals/akarasauce.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['2 cups peeled beans', '1 onion', 'chili', 'salt', 'oil'],
      method: ['Blend beans.', 'Add onion and chili.', 'Whisk until airy.', 'Deep fry.']
    },
    nutrition: { calories: 380, protein: 14, carbs: 40, fats: 18, fiber: 8, sugar: 2, sodium: 420 }
  },
  {
    id: 's37',
    name: 'Akara (Grassfields)',
    description: 'Bean cake with pap.',
    image: '/meals/akarasauce.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['2 cups beans', '1 onion', 'parsley', 'chili', 'salt', 'oil', 'millet pap'],
      method: ['Make akara.', 'Prepare millet pap.', 'Serve together.']
    },
    nutrition: { calories: 490, protein: 18, carbs: 65, fats: 15, fiber: 12, sugar: 12, sodium: 380 }
  },
  {
    id: 's38',
    name: 'Banana Cake',
    description: 'Dense steamed banana bread.',
    image: '/meals/banana cake.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 bananas', '2 cups flour', '1 cup sugar', '½ cup butter', '2 eggs', '1 tsp baking soda', 'nutmeg'],
      method: ['Mash bananas.', 'Mix all ingredients.', 'Pour into pan.', 'Steam or bake 30 minutes.']
    },
    nutrition: { calories: 310, protein: 5, carbs: 55, fats: 10, fiber: 4, sugar: 28, sodium: 190 }
  },
  {
    id: 's39',
    name: 'Boiled Groundnuts',
    description: 'Fresh boiled peanuts.',
    image: '/meals/boiled groundnut.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['2 cups raw peanuts', 'water', 'salt'],
      method: ['Boil peanuts in shells with salt.', 'Cook 45 minutes.', 'Drain and serve.']
    },
    nutrition: { calories: 310, protein: 13, carbs: 18, fats: 22, fiber: 8, sugar: 2, sodium: 280 }
  },
  {
    id: 's40',
    name: 'Caramel Peanuts',
    description: 'Sugar coated nuts.',
    image: '/meals/peanut caramel.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['2 cups peanuts', '1 cup sugar', 'vanilla'],
      method: ['Melt sugar into syrup.', 'Mix with nuts.', 'Spread and cool.']
    },
    nutrition: { calories: 490, protein: 12, carbs: 52, fats: 28, fiber: 5, sugar: 40, sodium: 15 }
  },
  {
    id: 's41',
    name: 'Cassava Patties',
    description: 'Deep-fried mashed cassava.',
    image: '/meals/cassava patties.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg cassava', '1 onion', 'chili', 'salt', 'oil'],
      method: ['Boil and mash cassava.', 'Mix with onion and chili.', 'Form patties.', 'Deep-fry until golden.']
    },
    nutrition: { calories: 320, protein: 3, carbs: 65, fats: 12, fiber: 4, sugar: 8, sodium: 210 }
  },
  {
    id: 's42',
    name: 'Chicken Soya Wrap',
    description: 'Suya wrapped in dough.',
    image: '/meals/chickenshawarma.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['2 cups flour', '500g chicken suya', '1 onion', 'chili sauce'],
      method: ['Make dough and roll out.', 'Grill chicken suya.', 'Wrap chicken in dough.', 'Toast on pan.']
    },
    nutrition: { calories: 490, protein: 32, carbs: 40, fats: 20, fiber: 4, sugar: 6, sodium: 820 }
  },
  {
    id: 's43',
    name: 'Chicken Suya (Skewer)',
    description: 'Spiced chicken stick.',
    image: '/meals/chicken suya.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['200g chicken breast', 'suya spice', 'oil'],
      method: ['Coat chicken in suya spice.', 'Skewer and grill.', 'Serve hot.']
    },
    nutrition: { calories: 180, protein: 22, carbs: 4, fats: 10, fiber: 1, sugar: 2, sodium: 390 }
  },
  {
    id: 's44',
    name: 'Chin Chin',
    description: 'Crunchy pastry bites.',
    image: '/meals/Chin-Chin.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 cups flour', '½ cup sugar', '1 tsp baking powder', '½ tsp salt', '½ cup butter', '2 eggs', '½ cup milk', 'nutmeg', 'oil'],
      method: ['Mix dry ingredients.', 'Rub in butter.', 'Add eggs and milk.', 'Knead dough.', 'Cut into strips.', 'Deep-fry until golden.']
    },
    nutrition: { calories: 480, protein: 7, carbs: 72, fats: 20, fiber: 1, sugar: 28, sodium: 210 }
  },
  {
    id: 's45',
    name: 'Chin Chin (Salty)',
    description: 'Savory crunchy pastry.',
    image: '/meals/Chin-Chin.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 cups flour', '1 tsp salt', '3 cloves garlic', '½ cup butter', '2 eggs', 'oil'],
      method: ['Mix flour and salt.', 'Add garlic and butter.', 'Add eggs, knead.', 'Cut and fry.']
    },
    nutrition: { calories: 440, protein: 7, carbs: 65, fats: 18, fiber: 2, sugar: 4, sodium: 520 }
  },
  {
    id: 's46',
    name: 'Coconut Candy',
    description: 'Fried shredded coconut.',
    image: '/meals/coconut sweet.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['2 cups shredded coconut', '1 cup sugar'],
      method: ['Caramelize sugar.', 'Add coconut and stir.', 'Spread to cool.']
    },
    nutrition: { calories: 380, protein: 3, carbs: 42, fats: 24, fiber: 7, sugar: 38, sodium: 35 }
  },
  {
    id: 's47',
    name: 'Corn & Coconut',
    description: 'Boiled corn and coconut.',
    image: '/meals/corn and coconut.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 ears corn', '1 coconut'],
      method: ['Boil corn.', 'Crack coconut.', 'Serve together.']
    },
    nutrition: { calories: 320, protein: 6, carbs: 50, fats: 14, fiber: 9, sugar: 8, sodium: 10 }
  },
  {
    id: 's48',
    name: 'Dandawan',
    description: 'Fermented locust bean cakes.',
    image: '/meals/beancake.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['locust beans', 'salt'],
      method: ['Ferment beans.', 'Form into cakes.', 'Sun-dry.']
    },
    nutrition: { calories: 210, protein: 18, carbs: 12, fats: 14, fiber: 3, sugar: 2, sodium: 1100 }
  },
  {
    id: 's49',
    name: 'Dodo',
    description: 'Fried ripe plantain.',
    image: '/meals/dodo.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['3 ripe plantains', 'oil for frying', 'salt'],
      method: ['Peel and slice plantains.', 'Heat oil.', 'Fry until caramelized.', 'Drain and salt.']
    },
    nutrition: { calories: 220, protein: 2, carbs: 35, fats: 9, fiber: 3, sugar: 14, sodium: 10 }
  },
  {
    id: 's50',
    name: 'Donut (Gateau)',
    description: 'Heavy fried dough ball.',
    image: '/meals/donut.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 cups flour', '1 cup sugar', '1 tbsp butter', '1 tsp baking powder', '½ tsp salt', '2 eggs', '1 cup milk', 'nutmeg', 'oil'],
      method: ['Mix dry ingredients.', 'Add butter, eggs, milk.', 'Knead dough.', 'Shape into balls.', 'Deep-fry until golden.']
    },
    nutrition: { calories: 420, protein: 8, carbs: 62, fats: 16, fiber: 1, sugar: 30, sodium: 240 }
  },
  {
    id: 's51',
    name: 'Egusi Pudding (Snack)',
    description: 'Small melon seed cake.',
    image: '/meals/egusipudding.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 cup egusi', '100g smoked fish', '2 tbsp crayfish', 'spices', 'banana leaves'],
      method: ['Grind egusi.', 'Mix with fish and spices.', 'Wrap in leaves.', 'Steam 1½ hours.']
    },
    nutrition: { calories: 220, protein: 15, carbs: 5, fats: 18, fiber: 2, sugar: 1, sodium: 210 }
  },
  {
    id: 's52',
    name: 'Fish Roll',
    description: 'Fried fish pastry.',
    image: '/meals/fishroll.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['3 cups flour', '¼ cup butter', '1 tsp yeast', '1 tin mackerel', '1 onion', 'chili', 'oil'],
      method: ['Make dough, let rise.', 'Mash fish with onion and chili.', 'Fill dough, shape rolls.', 'Deep-fry until golden.']
    },
    nutrition: { calories: 320, protein: 12, carbs: 35, fats: 15, fiber: 2, sugar: 3, sodium: 480 }
  },
  {
    id: 's53',
    name: 'French Fries & Mayo',
    description: 'Potato chips with mayo.',
    image: '/meals/irish and mayo.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg potatoes', 'oil for frying', 'salt', 'mayonnaise'],
      method: ['Peel and cut into fries.', 'Deep-fry until golden.', 'Serve with mayonnaise.']
    },
    nutrition: { calories: 580, protein: 5, carbs: 65, fats: 35, fiber: 5, sugar: 4, sodium: 720 }
  },
  {
    id: 's54',
    name: 'Fresh Pineapple Slices',
    description: 'Simple tropical fruit.',
    image: '/meals/pineapple slice.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 pineapple'],
      method: ['Slice pineapple.', 'Serve immediately.']
    },
    nutrition: { calories: 90, protein: 1, carbs: 22, fats: 0, fiber: 3, sugar: 18, sodium: 2 }
  },
  {
    id: 's55',
    name: 'Fried Breadfruit',
    description: 'Fried slices of breadfruit.',
    image: '/meals/fried breadfruit.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 breadfruit', 'oil for frying', 'salt'],
      method: ['Slice breadfruit.', 'Deep-fry until golden.', 'Salt and serve.']
    },
    nutrition: { calories: 320, protein: 4, carbs: 65, fats: 8, fiber: 9, sugar: 12, sodium: 110 }
  },
  {
    id: 's56',
    name: 'Fried Cassava (Koloko)',
    description: 'Crunchy cassava fries.',
    image: '/meals/cassava fries.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg cassava', 'oil for frying', 'salt'],
      method: ['Peel and slice cassava.', 'Deep-fry until golden.', 'Salt and serve.']
    },
    nutrition: { calories: 420, protein: 3, carbs: 85, fats: 12, fiber: 7, sugar: 4, sodium: 290 }
  },
  {
    id: 's57',
    name: 'Fried Cassava & Onion',
    description: 'Savory cassava fries.',
    image: '/meals/friedcassava.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg cassava', '1 onion', 'oil for frying', 'salt'],
      method: ['Boil cassava, then slice.', 'Fry with onions.', 'Salt and serve.']
    },
    nutrition: { calories: 410, protein: 3, carbs: 82, fats: 10, fiber: 7, sugar: 4, sodium: 280 }
  },
  {
    id: 's58',
    name: 'Fried Cassava & Pepper',
    description: 'Cassava chips with chili.',
    image: '/meals/cassava fries.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg cassava', 'oil for frying', 'chili sauce', 'salt'],
      method: ['Slice and fry cassava.', 'Serve with chili sauce.']
    },
    nutrition: { calories: 390, protein: 3, carbs: 80, fats: 10, fiber: 8, sugar: 4, sodium: 320 }
  },
  {
    id: 's59',
    name: 'Fried Gizzards (Snack)',
    description: 'Spicy peppered gizzards.',
    image: '/meals/fried gizzard.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['500g gizzards', 'chili', '1 onion', '3 cloves garlic', 'oil', 'salt'],
      method: ['Boil gizzards until soft.', 'Sauté with chili and onions.', 'Fry until crispy.']
    },
    nutrition: { calories: 280, protein: 32, carbs: 4, fats: 15, fiber: 0, sugar: 1, sodium: 610 }
  },
  {
    id: 's60',
    name: 'Fried Gizzards & Dodo',
    description: 'Gizzards with plantain.',
    image: '/meals/fried gizzard.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['500g gizzards', '2 plantains', 'chili', '1 onion', 'oil'],
      method: ['Make fried gizzards.', 'Fry plantains.', 'Serve together.']
    },
    nutrition: { calories: 520, protein: 25, carbs: 58, fats: 22, fiber: 5, sugar: 16, sodium: 610 }
  },
  {
    id: 's61',
    name: 'Fried Gizzards (West)',
    description: 'West style gizzards.',
    image: '/meals/fried gizzard.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['500g gizzards', 'chili', '1 onion', '3 cloves garlic', '1 tsp pebe', 'oil', 'salt'],
      method: ['Boil gizzards with spices.', 'Sauté with chili and onions.']
    },
    nutrition: { calories: 280, protein: 32, carbs: 5, fats: 20, fiber: 1, sugar: 2, sodium: 780 }
  },
  {
    id: 's62',
    name: 'Fried Macabo Chips',
    description: 'Thin cocoyam crisps.',
    image: '/meals/Fried and crispy yam.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg macabo', 'oil for frying', 'salt'],
      method: ['Slice macabo thin.', 'Deep fry until crisp.', 'Salt and serve.']
    },
    nutrition: { calories: 390, protein: 3, carbs: 78, fats: 12, fiber: 9, sugar: 4, sodium: 340 }
  },
  {
    id: 's63',
    name: 'Fried Plantain & Beans',
    description: 'Dodo and beans.',
    image: '/meals/Beans and plantains.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['2 plantains', '2 cups beans', 'oil for frying'],
      method: ['Fry plantains.', 'Serve with stewed beans.']
    },
    nutrition: { calories: 520, protein: 15, carbs: 85, fats: 18, fiber: 14, sugar: 22, sodium: 480 }
  },
  {
    id: 's64',
    name: 'Fried Potato & Sausage',
    description: 'Street energy snack.',
    image: '/meals/potato sausage.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 potatoes', '4 sausages', 'oil for frying'],
      method: ['Fry potatoes and sausages together.', 'Serve hot.']
    },
    nutrition: { calories: 510, protein: 18, carbs: 55, fats: 28, fiber: 4, sugar: 5, sodium: 740 }
  },
  {
    id: 's65',
    name: 'Fried Ribs',
    description: 'Deep-fried spiced ribs.',
    image: '/meals/fried ribs.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['500g pork ribs', 'garlic', 'ginger', 'chili', 'salt', 'oil'],
      method: ['Season ribs.', 'Deep-fry until crispy.']
    },
    nutrition: { calories: 620, protein: 38, carbs: 5, fats: 52, fiber: 0, sugar: 1, sodium: 810 }
  },
  {
    id: 's66',
    name: 'Fried Snails',
    description: 'Giant African snails.',
    image: '/meals/friedsnails.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg snails', 'chili', '1 onion', '3 cloves garlic', 'oil', 'salt', 'lime'],
      method: ['Clean snails with lime.', 'Boil until soft.', 'Sauté with chili and onions.']
    },
    nutrition: { calories: 340, protein: 45, carbs: 5, fats: 18, fiber: 0, sugar: 1, sodium: 720 }
  },
  {
    id: 's67',
    name: 'Fried Yam & Pepper',
    description: 'Yam with hot dip.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg yam', 'oil for frying', 'chili sauce', 'salt'],
      method: ['Slice and fry yam.', 'Serve with chili sauce.']
    },
    nutrition: { calories: 380, protein: 4, carbs: 72, fats: 10, fiber: 6, sugar: 3, sodium: 320 }
  },
  {
    id: 's68',
    name: 'Fruit Skewers',
    description: 'Mixed tropical fruit stick.',
    image: '/meals/fruitsnack.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['pineapple', 'mango', 'papaya'],
      method: ['Cube fruits.', 'Thread onto skewers.', 'Chill and serve.']
    },
    nutrition: { calories: 110, protein: 1, carbs: 25, fats: 0, fiber: 4, sugar: 22, sodium: 5 }
  },
  {
    id: 's69',
    name: 'Garri (Dry with Sugar)',
    description: 'Dry cassava with sugar.',
    image: '/meals/garri sugar.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 cup garri', '½ cup groundnuts', '¼ cup sugar'],
      method: ['Mix garri with water.', 'Drain.', 'Add sugar and groundnuts.']
    },
    nutrition: { calories: 350, protein: 10, carbs: 58, fats: 12, fiber: 5, sugar: 15, sodium: 85 }
  },
  {
    id: 's70',
    name: 'Garri & Coconut',
    description: 'Garri with coconut flakes.',
    image: '/meals/garri coconut.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 cup garri', '1 cup shredded coconut', '¼ cup sugar'],
      method: ['Mix garri with water.', 'Drain.', 'Add coconut and sugar.']
    },
    nutrition: { calories: 340, protein: 5, carbs: 62, fats: 10, fiber: 6, sugar: 18, sodium: 25 }
  },
  {
    id: 's71',
    name: 'Grated Cassava Cake',
    description: 'Baked cassava squares.',
    image: '/meals/cassava cake.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg cassava', '1 cup sugar', 'coconut milk', 'salt'],
      method: ['Grate cassava.', 'Mix with sugar and coconut milk.', 'Bake until golden.']
    },
    nutrition: { calories: 350, protein: 3, carbs: 72, fats: 8, fiber: 6, sugar: 32, sodium: 95 }
  },
  {
    id: 's72',
    name: 'Grilled Gizzards',
    description: 'Skewered chicken gizzards.',
    image: '/meals/chicken gizzard.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['500g gizzards', 'suya spice', 'oil'],
      method: ['Boil gizzards until soft.', 'Coat with suya spice.', 'Skewer and grill.']
    },
    nutrition: { calories: 380, protein: 32, carbs: 5, fats: 20, fiber: 1, sugar: 2, sodium: 780 }
  },
  {
    id: 's73',
    name: 'Grilled Pig Ear',
    description: 'Grilled pork ear snack.',
    image: '/meals/roasted pork.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 pig ears', 'suya spice', 'oil'],
      method: ['Clean ears.', 'Season with suya spice.', 'Grill until crispy.']
    },
    nutrition: { calories: 290, protein: 28, carbs: 0, fats: 20, fiber: 0, sugar: 0, sodium: 920 }
  },
  {
    id: 's74',
    name: 'Hard-Boiled Egg & Pepper',
    description: 'Street egg with salt mix.',
    image: '/meals/boiled eggs.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['2 eggs', 'chili powder', 'salt'],
      method: ['Boil eggs.', 'Mix chili and salt.', 'Dip eggs in mixture.']
    },
    nutrition: { calories: 80, protein: 6, carbs: 1, fats: 5, fiber: 0, sugar: 1, sodium: 250 }
  },
  {
    id: 's75',
    name: 'Irish Potato Fry',
    description: 'Fried potato snack.',
    image: '/meals/friedirish.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 potatoes', 'oil for frying', 'salt'],
      method: ['Slice potatoes.', 'Deep-fry until golden.', 'Salt and serve.']
    },
    nutrition: { calories: 400, protein: 4, carbs: 62, fats: 18, fiber: 4, sugar: 1, sodium: 450 }
  },
  {
    id: 's76',
    name: 'Peanut Cake',
    description: 'Peanut brittle.',
    image: '/meals/peanut cake.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['2 cups peanuts', '1 cup sugar'],
      method: ['Melt sugar into caramel.', 'Mix with peanuts.', 'Spread and cool.']
    },
    nutrition: { calories: 450, protein: 15, carbs: 45, fats: 28, fiber: 6, sugar: 35, sodium: 45 }
  },
  {
    id: 's77',
    name: 'Kashat',
    description: 'Roasted melon seed snack.',
    image: '/meals/roasted melon seeds.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 cup egusi seeds', 'salt'],
      method: ['Roast egusi seeds in pan.', 'Sprinkle with salt.', 'Serve as snack.']
    },
    nutrition: { calories: 210, protein: 12, carbs: 15, fats: 12, fiber: 4, sugar: 3, sodium: 340 }
  },
  {
    id: 's78',
    name: 'Kilichi',
    description: 'Spiced dried beef.',
    image: '/meals/kilichi.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['500g beef', 'suya spice', 'salt'],
      method: ['Slice beef thin.', 'Coat with suya spice.', 'Sun-dry or dehydrate.']
    },
    nutrition: { calories: 320, protein: 48, carbs: 5, fats: 15, fiber: 1, sugar: 2, sodium: 980 }
  },
  {
    id: 's79',
    name: 'Koki Beans (Snack)',
    description: 'Small bean pudding.',
    image: '/meals/koki.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['2 cups beans', '1 onion', '1 tbsp ginger', 'chili', 'salt', 'banana leaves'],
      method: ['Blend beans.', 'Add ginger and chili.', 'Wrap in leaves.', 'Steam.']
    },
    nutrition: { calories: 410, protein: 24, carbs: 48, fats: 18, fiber: 14, sugar: 4, sodium: 390 }
  },
  {
    id: 's80',
    name: 'Koki Corn (Small)',
    description: 'Small corn snack.',
    image: '/meals/koki-corn.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['500g corn', '¼ cup palm oil', '1 cup spinach', '1 tbsp ginger', 'salt', 'banana leaves'],
      method: ['Grind corn.', 'Mix with oil and spinach.', 'Steam in small leaves.']
    },
    nutrition: { calories: 280, protein: 7, carbs: 45, fats: 10, fiber: 6, sugar: 6, sodium: 310 }
  },
  {
    id: 's81',
    name: 'Meat Pie',
    description: 'Beef filled pastry.',
    image: '/meals/meat pie.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 cups flour', '1 cup butter', '1 tsp salt', '300g ground beef', '1 onion', '2 bouillon cubes'],
      method: ['Make dough.', 'Sauté beef with onion.', 'Fill dough, seal.', 'Bake at 375°F for 25-30 minutes.']
    },
    nutrition: { calories: 380, protein: 14, carbs: 40, fats: 18, fiber: 3, sugar: 4, sodium: 550 }
  },
  {
    id: 's82',
    name: 'Miondo & Avocado',
    description: 'Cassava strips with avocado.',
    image: '/meals/miondo.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 miondo', '2 avocados', 'salt'],
      method: ['Steam miondo.', 'Slice avocado.', 'Serve together.']
    },
    nutrition: { calories: 340, protein: 4, carbs: 45, fats: 18, fiber: 8, sugar: 2, sodium: 120 }
  },
  {
    id: 's83',
    name: 'Miondo & Pepper Sauce',
    description: 'Cassava with spicy dip.',
    image: '/meals/miondo.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 miondo', 'chili', '1 onion', 'oil', 'salt'],
      method: ['Steam miondo.', 'Make pepper sauce.', 'Serve together.']
    },
    nutrition: { calories: 290, protein: 2, carbs: 65, fats: 5, fiber: 4, sugar: 2, sodium: 350 }
  },
  {
    id: 's84',
    name: 'Mixed Berry',
    description: 'Wild forest berries.',
    image: '/meals/berries salad.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['2 cups mixed berries'],
      method: ['Wash berries.', 'Serve fresh.']
    },
    nutrition: { calories: 130, protein: 1, carbs: 32, fats: 0, fiber: 5, sugar: 28, sodium: 5 }
  },
  {
    id: 's85',
    name: 'Onion & Pepper Dip',
    description: 'Spicy condiment.',
    image: '/meals/peppersauce.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['2 onions', 'chili', 'salt', '¼ cup palm oil'],
      method: ['Sauté onions.', 'Add chili and salt.', 'Serve as dip.']
    },
    nutrition: { calories: 50, protein: 1, carbs: 10, fats: 2, fiber: 2, sugar: 6, sodium: 820 }
  },
  {
    id: 's86',
    name: 'Papaya & Ginger Salad',
    description: 'Zesty fruit bowl.',
    image: '/meals/papaya ginger.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 papaya', '1 tbsp ginger', '1 lime'],
      method: ['Dice papaya.', 'Grate ginger.', 'Mix with lime juice.']
    },
    nutrition: { calories: 130, protein: 1, carbs: 30, fats: 0, fiber: 6, sugar: 25, sodium: 5 }
  },
  {
    id: 's87',
    name: 'Papaya & Lime',
    description: 'Fresh papaya with lime.',
    image: '/meals/Papaya and Lime.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 papaya', '1 lime'],
      method: ['Slice papaya.', 'Squeeze lime over top.']
    },
    nutrition: { calories: 120, protein: 1, carbs: 28, fats: 0, fiber: 5, sugar: 24, sodium: 10 }
  },
  {
    id: 's88',
    name: 'Pawpaw Seeds (Dried)',
    description: 'Dried papaya seeds.',
    image: '/meals/papaya seeds.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['papaya seeds'],
      method: ['Remove seeds from papaya.', 'Sun-dry until crisp.']
    },
    nutrition: { calories: 50, protein: 2, carbs: 8, fats: 2, fiber: 5, sugar: 1, sodium: 10 }
  },
  {
    id: 's89',
    name: 'Peanut Burger',
    description: 'Flour coated peanuts.',
    image: '/meals/peanut.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['2 cups peanuts', '1 cup flour', 'sugar', 'oil'],
      method: ['Coat peanuts in flour batter.', 'Deep-fry until golden.', 'Roll in sugar.']
    },
    nutrition: { calories: 510, protein: 14, carbs: 48, fats: 32, fiber: 5, sugar: 15, sodium: 190 }
  },
  {
    id: 's90',
    name: 'Peppered Snail Skewer',
    description: 'Spiced grilled snails.',
    image: '/meals/friedsnails.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['500g snails', 'chili', '1 onion', 'garlic', 'lime'],
      method: ['Clean snails.', 'Season with chili.', 'Skewer and grill.']
    },
    nutrition: { calories: 210, protein: 28, carbs: 4, fats: 10, fiber: 1, sugar: 2, sodium: 580 }
  },
  {
    id: 's91',
    name: 'Piment de Table',
    description: 'Hot pepper sauce.',
    image: '/meals/pepper sauce.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['habaneros', 'ginger', 'njangsa', 'garlic', 'oil'],
      method: ['Blend all ingredients.', 'Fry in oil.', 'Serve as condiment.']
    },
    nutrition: { calories: 45, protein: 1, carbs: 8, fats: 2, fiber: 2, sugar: 4, sodium: 850 }
  },
  {
    id: 's92',
    name: 'Pineapple Wedges',
    description: 'Fresh pineapple slices.',
    image: '/meals/pineapple ring.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 pineapple'],
      method: ['Slice pineapple into wedges.', 'Serve chilled.']
    },
    nutrition: { calories: 100, protein: 1, carbs: 24, fats: 0, fiber: 3, sugar: 20, sodium: 2 }
  },
  {
    id: 's93',
    name: 'Scotch egg',
    description: 'Scotch egg style.',
    image: '/meals/scotch eggs.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 eggs', '500g sausage meat', 'flour', 'breadcrumbs', 'oil'],
      method: ['Boil eggs 6 minutes.', 'Wrap in sausage meat.', 'Coat in flour, egg, breadcrumbs.', 'Deep-fry until golden.']
    },
    nutrition: { calories: 410, protein: 22, carbs: 15, fats: 30, fiber: 1, sugar: 2, sodium: 580 }
  },
  {
    id: 's94',
    name: 'Plantain Chips (Salty)',
    description: 'Green plantain crisps.',
    image: '/meals/plantainchips.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 green plantains', 'oil for frying', 'salt'],
      method: ['Slice plantains thin.', 'Soak in salt water.', 'Deep-fry until crisp.', 'Salt immediately.']
    },
    nutrition: { calories: 330, protein: 2, carbs: 55, fats: 12, fiber: 6, sugar: 2, sodium: 420 }
  },
  {
    id: 's95',
    name: 'Plantain Chips (Sweet)',
    description: 'Ripe plantain crisps.',
    image: '/meals/plantain chips.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 ripe plantains', 'oil for frying'],
      method: ['Slice plantains diagonally.', 'Fry until caramelized.', 'Drain and serve.']
    },
    nutrition: { calories: 350, protein: 2, carbs: 58, fats: 14, fiber: 5, sugar: 25, sodium: 180 }
  },
  {
    id: 's96',
    name: 'Plantain & Plum',
    description: 'Plantain with Safou.',
    image: '/meals/roasted plantains.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['2 plantains', '4 Safou', 'salt'],
      method: ['Fry or boil plantains.', 'Roast plums.', 'Serve together.']
    },
    nutrition: { calories: 350, protein: 3, carbs: 55, fats: 14, fiber: 5, sugar: 12, sodium: 380 }
  },
  {
    id: 's97',
    name: 'Plantain & Plum (Safou)',
    description: 'Plantain with African pears.',
    image: '/meals/plantain plum.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['2 plantains', '4 Safou', 'salt'],
      method: ['Boil plantains.', 'Roast plums.', 'Serve together.']
    },
    nutrition: { calories: 160, protein: 3, carbs: 10, fats: 12, fiber: 4, sugar: 2, sodium: 15 }
  },
  {
    id: 's98',
    name: 'Roasted Macabo (Salty)',
    description: 'Grilled salty cocoyam.',
    image: '/meals/cocoyam.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg macabo', 'salt'],
      method: ['Roast on coals.', 'Sprinkle with salt.']
    },
    nutrition: { calories: 390, protein: 6, carbs: 82, fats: 2, fiber: 12, sugar: 4, sodium: 450 }
  },
  {
    id: 's99',
    name: 'Roasted Macabo & Sauce',
    description: 'Grilled cocoyam slices.',
    image: '/meals/cocoyam.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg macabo', 'pepper sauce'],
      method: ['Roast macabo.', 'Serve with chili sauce.']
    },
    nutrition: { calories: 440, protein: 8, carbs: 82, fats: 10, fiber: 12, sugar: 5, sodium: 310 }
  },
  {
    id: 's100',
    name: 'Roasted Plantain Chips',
    description: 'Baked plantain crisps.',
    image: '/meals/plantain chips.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['4 plantains', 'salt', 'oil'],
      method: ['Slice plantains thin.', 'Toss with oil and salt.', 'Bake at 375°F until crisp.']
    },
    nutrition: { calories: 300, protein: 2, carbs: 52, fats: 10, fiber: 5, sugar: 22, sodium: 280 }
  },

  // ==================== DRINKS (dr1 - dr50) ====================
  {
    id: 'dr1',
    name: 'Ginger Juice (Djino)',
    description: 'Fresh ginger drink - refreshing and spicy.',
    image: '/meals/ginger drink.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 cup fresh ginger', '1 cup sugar', '4 cups water', '1 lemon', 'mint'],
      method: ['Blend ginger with water.', 'Strain.', 'Make simple syrup.', 'Combine all.', 'Chill and serve over ice.']
    },
    nutrition: { calories: 90, protein: 0, carbs: 24, fats: 0, fiber: 1, sugar: 22, sodium: 8 }
  },
  {
    id: 'dr2',
    name: 'Folere (Hibiscus Tea)',
    description: 'Red hibiscus tea - tart and refreshing.',
    image: '/meals/hibiscus drink.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['2 cups dried hibiscus', '1 cup sugar', '1 tbsp ginger', '8 cups water', 'mint'],
      method: ['Boil water with hibiscus and ginger.', 'Strain.', 'Add sugar.', 'Chill and serve over ice.']
    },
    nutrition: { calories: 110, protein: 0, carbs: 28, fats: 0, fiber: 1, sugar: 25, sodium: 5 }
  },
  {
    id: 'dr3',
    name: 'Palm Wine (Matango)',
    description: 'Natural fermented sap from palm trees.',
    image: '/meals/palm wine.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['fresh palm sap'],
      method: ['Tap palm tree to collect sap.', 'Collect in container.', 'Allow to ferment naturally.', 'Serve fresh.']
    },
    nutrition: { calories: 150, protein: 1, carbs: 15, fats: 0, fiber: 0, sugar: 12, sodium: 12 }
  },
  {
    id: 'dr4',
    name: 'Fresh Orange Juice',
    description: 'Squeezed highland oranges.',
    image: '/meals/orange juice.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['6 oranges', 'sugar (optional)'],
      method: ['Roll oranges to soften.', 'Juice oranges.', 'Strain if desired.', 'Add sugar.', 'Serve chilled.']
    },
    nutrition: { calories: 110, protein: 2, carbs: 26, fats: 0, fiber: 1, sugar: 22, sodium: 2 }
  },
  {
    id: 'dr5',
    name: 'Soursop Juice',
    description: 'Creamy soursop drink.',
    image: '/meals/soursop.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 ripe soursop', '½ cup sugar', '4 cups water', 'vanilla'],
      method: ['Peel and seed soursop.', 'Blend with water.', 'Strain.', 'Add sugar and vanilla.', 'Chill.']
    },
    nutrition: { calories: 190, protein: 3, carbs: 40, fats: 2, fiber: 6, sugar: 35, sodium: 15 }
  },
  {
    id: 'dr6',
    name: 'Tamarind Juice',
    description: 'Tangy tamarind drink.',
    image: '/meals/tamarind juice.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 cup tamarind pulp', '1 cup sugar', '8 cups water', 'ginger'],
      method: ['Soak tamarind in warm water.', 'Extract pulp, strain.', 'Add remaining water and sugar.', 'Chill and serve.']
    },
    nutrition: { calories: 140, protein: 1, carbs: 38, fats: 0, fiber: 4, sugar: 34, sodium: 10 }
  },
  {
    id: 'dr7',
    name: 'Watermelon Juice',
    description: 'Pureed fresh watermelon.',
    image: '/meals/watermelon juice.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['4 cups watermelon', 'sugar', 'lime', 'mint'],
      method: ['Blend watermelon until smooth.', 'Strain if desired.', 'Add sugar and lime.', 'Serve over ice.']
    },
    nutrition: { calories: 80, protein: 1, carbs: 20, fats: 0, fiber: 1, sugar: 18, sodium: 2 }
  },
  {
    id: 'dr8',
    name: 'Local Coffee',
    description: 'Strong Cameroonian coffee.',
    image: '/meals/coffee.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['2 tbsp ground coffee', '2 cups water', 'sugar', 'milk'],
      method: ['Boil water with coffee.', 'Let steep 5 minutes.', 'Strain.', 'Add sugar and milk.', 'Serve hot.']
    },
    nutrition: { calories: 5, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 2 }
  },
  {
    id: 'dr9',
    name: 'Mango Smoothie',
    description: 'Thick tropical mango blend.',
    image: '/meals/mangosmooty.jpg',
    category: 'drinks',
    recipe: {
      ingredients: ['2 mangoes', '1 cup yogurt', '2 tbsp honey', '1 cup ice', 'mint'],
      method: ['Peel and cube mangoes.', 'Blend all ingredients until smooth.', 'Serve immediately.']
    },
    nutrition: { calories: 190, protein: 8, carbs: 35, fats: 4, fiber: 3, sugar: 30, sodium: 65 }
  },
  {
    id: 'dr10',
    name: 'Passion Fruit Juice',
    description: 'Aromatic tart juice.',
    image: '/meals/passion fruit juice.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['10 passion fruits', '½ cup sugar', '4 cups water'],
      method: ['Scoop pulp from passion fruits.', 'Blend with water.', 'Strain to remove seeds.', 'Add sugar.', 'Chill.']
    },
    nutrition: { calories: 110, protein: 1, carbs: 28, fats: 0, fiber: 4, sugar: 24, sodium: 5 }
  },
  {
    id: 'dr11',
    name: 'Soursop Smoothie',
    description: 'Creamy tropical blend.',
    image: '/meals/soursop smoothie.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 soursop', '1 cup milk', '¼ cup sugar', '1 cup ice'],
      method: ['Peel and seed soursop.', 'Blend with milk and sugar.', 'Add ice and blend.', 'Serve immediately.']
    },
    nutrition: { calories: 180, protein: 2, carbs: 38, fats: 1, fiber: 5, sugar: 32, sodium: 15 }
  },
  {
    id: 'dr12',
    name: 'Sugar Cane Juice',
    description: 'Pressed raw sugarcane.',
    image: '/meals/sugarcane juice.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['sugar cane'],
      method: ['Peel sugar cane.', 'Press through juicer.', 'Serve over ice.']
    },
    nutrition: { calories: 140, protein: 0, carbs: 38, fats: 0, fiber: 0, sugar: 36, sodium: 10 }
  },
  {
    id: 'dr13',
    name: 'Sugarcane Juice & Ginger',
    description: 'Cane juice with ginger.',
    image: '/meals/sugarcane ginger.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['sugar cane', 'ginger', 'lime'],
      method: ['Press sugar cane and ginger together.', 'Add lime juice.', 'Serve over ice.']
    },
    nutrition: { calories: 150, protein: 0, carbs: 38, fats: 0, fiber: 1, sugar: 34, sodium: 5 }
  },
  {
    id: 'dr14',
    name: 'Tamarind Cooler',
    description: 'Tangy tamarind drink.',
    image: '/meals/tamarind cooler.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 cup tamarind', '1 cup sugar', 'ginger', 'mint', '8 cups water'],
      method: ['Boil tamarind and ginger.', 'Strain.', 'Add sugar and mint.', 'Chill.']
    },
    nutrition: { calories: 140, protein: 1, carbs: 38, fats: 0, fiber: 4, sugar: 34, sodium: 10 }
  },
  {
    id: 'dr15',
    name: 'Ginger & Honey Brew',
    description: 'Warm soothing tea.',
    image: '/meals/ginger honey.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['ginger', 'honey', 'lemon', '2 cups water'],
      method: ['Boil ginger in water.', 'Strain.', 'Add honey and lemon.', 'Serve warm.']
    },
    nutrition: { calories: 50, protein: 0, carbs: 12, fats: 0, fiber: 1, sugar: 10, sodium: 2 }
  },
  {
    id: 'dr16',
    name: 'Ginger & Honey Tea',
    description: 'Soothing ginger brew.',
    image: '/meals/ginger tea.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['ginger', 'honey', 'tea bag', '2 cups water'],
      method: ['Boil ginger and tea.', 'Strain.', 'Stir honey.', 'Serve warm.']
    },
    nutrition: { calories: 55, protein: 0, carbs: 14, fats: 0, fiber: 1, sugar: 12, sodium: 2 }
  },
  {
    id: 'dr17',
    name: 'Ginger Lemonade (Djino)',
    description: 'Zesty ginger cooler.',
    image: '/meals/ginger lemon.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['ginger', 'lemon', 'sugar', '4 cups water', 'mint'],
      method: ['Juice ginger and lemon.', 'Make simple syrup.', 'Combine with water.', 'Serve over ice with mint.']
    },
    nutrition: { calories: 95, protein: 0, carbs: 24, fats: 0, fiber: 1, sugar: 22, sodium: 5 }
  },
  {
    id: 'dr18',
    name: 'Fresh Orange Juice (No Sugar)',
    description: 'Pure orange juice.',
    image: '/meals/orange juice.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['6 oranges'],
      method: ['Juice oranges.', 'Serve immediately.']
    },
    nutrition: { calories: 110, protein: 2, carbs: 26, fats: 0, fiber: 1, sugar: 22, sodium: 2 }
  },
  {
    id: 'dr19',
    name: 'Guava & Pineapple Mix',
    description: 'Tropical fruit nectar.',
    image: '/meals/guava juice.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['4 guavas', '1 cup pineapple', 'sugar', '2 cups water'],
      method: ['Blend guava and pineapple with water.', 'Strain.', 'Add sugar.', 'Chill.']
    },
    nutrition: { calories: 125, protein: 1, carbs: 30, fats: 0, fiber: 5, sugar: 26, sodium: 5 }
  },
  {
    id: 'dr20',
    name: 'Guava Juice',
    description: 'Aromatic guava drink.',
    image: '/meals/guava smoothie.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['6 guavas', 'sugar', '4 cups water', 'lime'],
      method: ['Blend guava with water.', 'Strain.', 'Add sugar and lime.', 'Chill.']
    },
    nutrition: { calories: 120, protein: 2, carbs: 30, fats: 0, fiber: 7, sugar: 25, sodium: 5 }
  },
  {
    id: 'dr21',
    name: 'Guava Nectar (Fresh)',
    description: 'High-fiber fruit drink.',
    image: '/meals/guava juice.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['6 guavas', 'honey', 'water'],
      method: ['Blend guava with water (don\'t strain).', 'Add honey.', 'Serve with pulp.']
    },
    nutrition: { calories: 130, protein: 2, carbs: 32, fats: 0, fiber: 9, sugar: 28, sodium: 5 }
  },
  {
    id: 'dr22',
    name: 'Hibiscus & Pineapple',
    description: 'Fruity folere blend.',
    image: '/meals/hibiscus drink.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['2 cups hibiscus', '1 cup pineapple juice', 'sugar', 'ginger'],
      method: ['Make hibiscus tea.', 'Mix with pineapple juice.', 'Add sugar.', 'Chill.']
    },
    nutrition: { calories: 120, protein: 0, carbs: 30, fats: 0, fiber: 2, sugar: 26, sodium: 8 }
  },
  {
    id: 'dr23',
    name: 'Hibiscus Leaf Juice',
    description: 'Green hibiscus drink.',
    image: '/meals/hibiscustea.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['hibiscus leaves', 'lime', 'sugar'],
      method: ['Boil leaves.', 'Strain.', 'Add lime and sugar.', 'Chill.']
    },
    nutrition: { calories: 85, protein: 1, carbs: 18, fats: 0, fiber: 3, sugar: 15, sodium: 10 }
  },
  {
    id: 'dr24',
    name: 'Hibiscus Lemonade',
    description: 'Floral citrus cooler.',
    image: '/meals/hibiscus lemonade.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['2 cups hibiscus', 'lemon', 'honey', '4 cups water'],
      method: ['Make hibiscus tea.', 'Add lemon juice and honey.', 'Chill and serve.']
    },
    nutrition: { calories: 85, protein: 0, carbs: 22, fats: 0, fiber: 1, sugar: 20, sodium: 5 }
  },
  {
    id: 'dr25',
    name: 'Hot Chocolate (Local)',
    description: 'Raw cocoa drink.',
    image: '/meals/cocoa.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['2 tbsp cocoa powder', '2 cups milk', 'sugar', 'cinnamon'],
      method: ['Heat milk.', 'Whisk in cocoa and sugar.', 'Add cinnamon.', 'Serve hot.']
    },
    nutrition: { calories: 250, protein: 8, carbs: 30, fats: 12, fiber: 4, sugar: 22, sodium: 110 }
  },
  {
    id: 'dr26',
    name: 'Hot Ginger Tea',
    description: 'Spicy warming brew.',
    image: '/meals/ginger tea.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['ginger', 'honey', '2 cups water'],
      method: ['Boil ginger.', 'Strain.', 'Add honey.', 'Serve hot.']
    },
    nutrition: { calories: 40, protein: 0, carbs: 10, fats: 0, fiber: 1, sugar: 8, sodium: 2 }
  },
  {
    id: 'dr27',
    name: 'Iced Coffee (Local)',
    description: 'Bamenda coffee over ice.',
    image: '/meals/iced coffee.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['2 tbsp coffee', '2 cups water', 'milk', 'sugar', 'ice'],
      method: ['Brew coffee.', 'Add milk and sugar.', 'Pour over ice.', 'Serve.']
    },
    nutrition: { calories: 60, protein: 1, carbs: 10, fats: 2, fiber: 0, sugar: 8, sodium: 10 }
  },
  {
    id: 'dr28',
    name: 'Iced Lemon Tea',
    description: 'Cold citrus tea brew.',
    image: '/meals/iced lemon tea.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['tea bags', 'lemon', 'sugar', 'ice', 'mint'],
      method: ['Brew tea.', 'Add lemon and sugar.', 'Chill.', 'Serve over ice with mint.']
    },
    nutrition: { calories: 60, protein: 0, carbs: 15, fats: 0, fiber: 1, sugar: 14, sodium: 5 }
  },
  {
    id: 'dr29',
    name: 'Iced Mint Tea',
    description: 'Refreshing mint drink.',
    image: '/meals/green mint tea.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['mint leaves', 'tea', 'sugar', 'ice'],
      method: ['Brew tea with mint.', 'Add sugar.', 'Chill.', 'Serve over ice.']
    },
    nutrition: { calories: 60, protein: 0, carbs: 15, fats: 0, fiber: 0, sugar: 14, sodium: 2 }
  },
  {
    id: 'dr30',
    name: 'Lemon & Honey Brew',
    description: 'Soothing citrus tea.',
    image: '/meals/ginger honey.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['lemon', 'honey', 'ginger', '2 cups water'],
      method: ['Boil ginger.', 'Strain.', 'Add honey and lemon.', 'Serve warm.']
    },
    nutrition: { calories: 45, protein: 0, carbs: 12, fats: 0, fiber: 1, sugar: 10, sodium: 2 }
  },
  {
    id: 'dr31',
    name: 'Lemon Ginger Tea',
    description: 'Flu-fighting herbal tea.',
    image: '/meals/ginger tea.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['ginger', 'lemon', 'honey', '2 cups water'],
      method: ['Boil ginger.', 'Add lemon and honey.', 'Serve hot.']
    },
    nutrition: { calories: 45, protein: 0, carbs: 12, fats: 0, fiber: 1, sugar: 8, sodium: 2 }
  },
  {
    id: 'dr32',
    name: 'Lemonade (Citronnelle)',
    description: 'Lemongrass infusion.',
    image: '/meals/citrus water.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['lemongrass', 'lemon', 'sugar', '4 cups water'],
      method: ['Boil lemongrass.', 'Strain.', 'Add lemon and sugar.', 'Chill.']
    },
    nutrition: { calories: 80, protein: 0, carbs: 22, fats: 0, fiber: 1, sugar: 20, sodium: 5 }
  },
  {
    id: 'dr33',
    name: 'Lemonade',
    description: 'Sweet citrus drink.',
    image: '/meals/lemonade.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['4 lemons', '1 cup sugar', '4 cups water', 'mint'],
      method: ['Juice lemons.', 'Make simple syrup.', 'Combine with water.', 'Serve over ice with mint.']
    },
    nutrition: { calories: 90, protein: 0, carbs: 24, fats: 0, fiber: 1, sugar: 22, sodium: 5 }
  },
  {
    id: 'dr34',
    name: 'Local Cocoa Tea',
    description: 'Raw roasted cocoa tea.',
    image: '/meals/cocoa.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['cocoa husks', 'milk', 'honey', 'cinnamon'],
      method: ['Steep husks in hot milk.', 'Add honey and cinnamon.', 'Strain and serve.']
    },
    nutrition: { calories: 120, protein: 4, carbs: 15, fats: 6, fiber: 3, sugar: 10, sodium: 45 }
  },
  {
    id: 'dr35',
    name: 'Local Coffee (Black)',
    description: 'Strong black coffee.',
    image: '/meals/coffee.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['2 tbsp coffee', '2 cups water', 'sugar'],
      method: ['Boil coffee grounds in water.', 'Strain.', 'Add sugar.', 'Serve hot.']
    },
    nutrition: { calories: 5, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 2 }
  },
  {
    id: 'dr36',
    name: 'Local Coffee with Milk',
    description: 'Coffee with milk.',
    image: '/meals/coffee milk.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['2 tbsp coffee', '2 cups water', 'milk', 'sugar'],
      method: ['Brew coffee.', 'Add milk and sugar.', 'Serve hot.']
    },
    nutrition: { calories: 60, protein: 2, carbs: 8, fats: 2, fiber: 0, sugar: 6, sodium: 15 }
  },
  {
    id: 'dr37',
    name: 'Mango & Banana Smoothie',
    description: 'Thick tropical blend.',
    image: '/meals/mango banana smoothie.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['2 mangoes', '2 bananas', '1 cup yogurt', '1 cup ice'],
      method: ['Blend all ingredients until smooth.', 'Serve immediately.']
    },
    nutrition: { calories: 180, protein: 2, carbs: 45, fats: 1, fiber: 6, sugar: 38, sodium: 10 }
  },
  {
    id: 'dr38',
    name: 'Mango & Pineapple',
    description: 'Pure fruit nectar.',
    image: '/meals/mango pineapple smoothie.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['2 mangoes', '1 cup pineapple', '1 cup water', 'sugar'],
      method: ['Blend all ingredients.', 'Strain if desired.', 'Chill and serve.']
    },
    nutrition: { calories: 140, protein: 1, carbs: 35, fats: 0, fiber: 4, sugar: 30, sodium: 5 }
  },
  {
    id: 'dr39',
    name: 'Mango & Yogurt Smoothie',
    description: 'Protein fruit blend.',
    image: '/meals/yoghurt mango smoothie.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['2 mangoes', '1 cup yogurt', 'honey', '1 cup ice'],
      method: ['Blend mango with yogurt and honey.', 'Add ice and blend.', 'Serve.']
    },
    nutrition: { calories: 190, protein: 8, carbs: 35, fats: 4, fiber: 3, sugar: 30, sodium: 65 }
  },
  {
    id: 'dr40',
    name: 'Mango Nectar',
    description: 'Thick mango puree.',
    image: '/meals/mango nectar.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['4 mangoes', 'honey', 'water'],
      method: ['Blend mango with water.', 'Add honey.', 'Serve chilled.']
    },
    nutrition: { calories: 160, protein: 1, carbs: 42, fats: 0, fiber: 3, sugar: 38, sodium: 5 }
  },
  {
    id: 'dr41',
    name: 'Millet Drink (Kunnu)',
    description: 'Grain drink from North.',
    image: '/meals/millet drink.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 cup millet', 'ginger', 'sugar', 'water', 'spices'],
      method: ['Soak millet overnight.', 'Blend with ginger and spices.', 'Strain and sweeten.', 'Chill.']
    },
    nutrition: { calories: 180, protein: 5, carbs: 35, fats: 3, fiber: 4, sugar: 12, sodium: 45 }
  },
  {
    id: 'dr42',
    name: 'Mint & Lime Water',
    description: 'Refreshing herbal water.',
    image: '/meals/citrus water.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['mint', 'lime', 'water', 'ice'],
      method: ['Muddle mint and lime.', 'Add water and ice.', 'Serve.']
    },
    nutrition: { calories: 20, protein: 0, carbs: 5, fats: 0, fiber: 1, sugar: 2, sodium: 5 }
  },
  {
    id: 'dr43',
    name: 'Minty Pineapple Juice',
    description: 'Fresh pineapple and mint.',
    image: '/meals/mint pineapple juice.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 pineapple', 'mint', 'sugar', 'water'],
      method: ['Blend pineapple with mint and water.', 'Strain.', 'Add sugar.', 'Chill.']
    },
    nutrition: { calories: 115, protein: 1, carbs: 28, fats: 0, fiber: 2, sugar: 24, sodium: 5 }
  },
  {
    id: 'dr44',
    name: 'Orange & Ginger Mix',
    description: 'Citrus with spicy kick.',
    image: '/meals/ginger orange juice.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['6 oranges', 'ginger', 'sugar'],
      method: ['Juice oranges.', 'Juice ginger.', 'Combine with sugar.', 'Serve over ice.']
    },
    nutrition: { calories: 100, protein: 2, carbs: 25, fats: 0, fiber: 2, sugar: 22, sodium: 2 }
  },
  {
    id: 'dr45',
    name: 'Palm Wine (Natural)',
    description: 'Fresh palm sap.',
    image: '/meals/palm wine.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['palm wine'],
      method: ['Collect fresh palm wine.', 'Serve immediately.']
    },
    nutrition: { calories: 150, protein: 1, carbs: 15, fats: 0, fiber: 0, sugar: 12, sodium: 12 }
  },
  {
    id: 'dr46',
    name: 'Papaya & Lime Juice',
    description: 'Cold pressed papaya.',
    image: '/meals/papaya lemon juice.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 papaya', '2 limes', 'sugar', '2 cups water'],
      method: ['Blend papaya with water.', 'Add lime juice and sugar.', 'Chill and serve.']
    },
    nutrition: { calories: 110, protein: 1, carbs: 28, fats: 0, fiber: 5, sugar: 24, sodium: 10 }
  },
  {
    id: 'dr47',
    name: 'Papaya Smoothie',
    description: 'Papaya and lime blend.',
    image: '/meals/papaya smoothie.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 papaya', '1 lime', 'honey', '1 cup yogurt', '1 cup ice'],
      method: ['Blend all ingredients until smooth.', 'Serve immediately.']
    },
    nutrition: { calories: 150, protein: 1, carbs: 38, fats: 0, fiber: 5, sugar: 32, sodium: 10 }
  },
  {
    id: 'dr48',
    name: 'Passion Fruit Juice (Fresh)',
    description: 'Pure passion fruit.',
    image: '/meals/passion fruit juice.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['10 passion fruits', 'honey', '2 cups water'],
      method: ['Scoop pulp.', 'Blend with water.', 'Strain.', 'Add honey.', 'Serve.']
    },
    nutrition: { calories: 110, protein: 1, carbs: 28, fats: 0, fiber: 4, sugar: 24, sodium: 5 }
  },
  {
    id: 'dr49',
    name: 'Soursop & Ginger',
    description: 'Spiced soursop juice.',
    image: '/meals/soursop.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 soursop', 'ginger', 'sugar', '4 cups water'],
      method: ['Blend soursop and ginger with water.', 'Strain.', 'Add sugar.', 'Chill.']
    },
    nutrition: { calories: 190, protein: 3, carbs: 40, fats: 2, fiber: 6, sugar: 35, sodium: 15 }
  },
  {
    id: 'dr50',
    name: 'Watermelon Cooler',
    description: 'Hydrating melon juice.',
    image: '/meals/watermelon juice.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['4 cups watermelon', 'lime', 'mint', 'ice'],
      method: ['Blend watermelon.', 'Add lime juice.', 'Serve over ice with mint.']
    },
    nutrition: { calories: 90, protein: 1, carbs: 22, fats: 0, fiber: 1, sugar: 20, sodium: 2 }
  },

  // ==================== FRUITS (fr1 - fr30) ====================
  {
    id: 'fr1',
    name: 'Fresh Papaya',
    description: 'Ripe papaya - sweet, juicy, and rich in digestive enzymes.',
    image: '/meals/Papaya and Lime.jpeg',
    category: 'fruits',
    recipe: {
      ingredients: ['1 ripe papaya', 'lime (optional)'],
      method: ['Cut papaya in half lengthwise.', 'Scoop out seeds.', 'Slice or scoop flesh.', 'Serve chilled with lime if desired.']
    },
    nutrition: { calories: 120, protein: 2, carbs: 30, fats: 0, fiber: 5, sugar: 18, sodium: 10 }
  },
  {
    id: 'fr2',
    name: 'Sweet Banana',
    description: 'Ripe sweet bananas - perfect for a quick energy boost.',
    image: '/meals/bananas.jpg',
    category: 'fruits',
    recipe: {
      ingredients: ['2 ripe bananas'],
      method: ['Peel bananas.', 'Slice or eat whole.', 'Serve fresh.']
    },
    nutrition: { calories: 210, protein: 3, carbs: 54, fats: 1, fiber: 6, sugar: 28, sodium: 2 }
  },
  {
    id: 'fr3',
    name: 'Fresh Watermelon',
    description: 'Hydrating and sweet watermelon slices.',
    image: '/meals/watermelon.jpg',
    category: 'fruits',
    recipe: {
      ingredients: ['¼ watermelon'],
      method: ['Slice watermelon into wedges.', 'Serve chilled.']
    },
    nutrition: { calories: 90, protein: 2, carbs: 23, fats: 0, fiber: 1, sugar: 18, sodium: 2 }
  },
  {
    id: 'fr4',
    name: 'Sweet Mango',
    description: 'Ripe juicy mango - nature\'s candy.',
    image: '/meals/mango.jpg',
    category: 'fruits',
    recipe: {
      ingredients: ['2 ripe mangoes'],
      method: ['Peel mangoes.', 'Slice flesh away from pit.', 'Cut into cubes or strips.', 'Serve chilled.']
    },
    nutrition: { calories: 200, protein: 2, carbs: 50, fats: 1, fiber: 5, sugar: 45, sodium: 4 }
  },
  {
    id: 'fr5',
    name: 'Fresh Pineapple',
    description: 'Sweet and tangy pineapple rings.',
    image: '/meals/pineapple.jpg',
    category: 'fruits',
    recipe: {
      ingredients: ['1 ripe pineapple'],
      method: ['Cut off top and bottom.', 'Slice off skin.', 'Remove eyes.', 'Slice into rings or chunks.', 'Remove core.', 'Serve chilled.']
    },
    nutrition: { calories: 82, protein: 1, carbs: 22, fats: 0, fiber: 2, sugar: 16, sodium: 2 }
  },
  {
    id: 'fr6',
    name: 'Fresh Orange',
    description: 'Juicy sweet oranges - packed with vitamin C.',
    image: '/meals/oranges.jpeg',
    category: 'fruits',
    recipe: {
      ingredients: ['2 oranges'],
      method: ['Peel oranges.', 'Separate into segments.', 'Remove white pith.', 'Serve fresh.']
    },
    nutrition: { calories: 124, protein: 2, carbs: 31, fats: 0, fiber: 6, sugar: 24, sodium: 2 }
  },
  {
    id: 'fr7',
    name: 'Fresh Avocado',
    description: 'Creamy ripe avocado - rich in healthy fats.',
    image: '/meals/avocado.jpeg',
    category: 'fruits',
    recipe: {
      ingredients: ['2 ripe avocados', 'salt (optional)'],
      method: ['Cut avocados in half.', 'Remove pit.', 'Scoop out flesh.', 'Sprinkle with salt if desired.', 'Serve fresh.']
    },
    nutrition: { calories: 322, protein: 4, carbs: 17, fats: 29, fiber: 13, sugar: 2, sodium: 14 }
  },
  {
    id: 'fr8',
    name: 'Fresh Guava',
    description: 'Aromatic sweet guava with edible seeds and skin.',
    image: '/meals/guava.jpeg',
    category: 'fruits',
    recipe: {
      ingredients: ['3 ripe guavas'],
      method: ['Wash guavas.', 'Cut into quarters or slices.', 'Eat with or without skin.', 'Serve fresh.']
    },
    nutrition: { calories: 112, protein: 4, carbs: 24, fats: 2, fiber: 9, sugar: 15, sodium: 4 }
  },
  {
    id: 'fr9',
    name: 'Young Coconut',
    description: 'Tender coconut flesh and refreshing coconut water.',
    image: '/meals/coconut.jpg',
    category: 'fruits',
    recipe: {
      ingredients: ['1 young coconut'],
      method: ['Crack open coconut.', 'Pour out water.', 'Scoop out tender flesh.', 'Cut into chunks.']
    },
    nutrition: { calories: 283, protein: 3, carbs: 12, fats: 27, fiber: 7, sugar: 5, sodium: 16 }
  },
  {
    id: 'fr10',
    name: 'Red Apple',
    description: 'Crisp sweet apples - a classic healthy snack.',
    image: '/meals/apple.jpeg',
    category: 'fruits',
    recipe: {
      ingredients: ['2 red apples'],
      method: ['Wash apples.', 'Eat whole or slice into wedges.', 'Remove core if desired.']
    },
    nutrition: { calories: 190, protein: 1, carbs: 50, fats: 1, fiber: 9, sugar: 38, sodium: 4 }
  },
  {
    id: 'fr11',
    name: 'Passion Fruit',
    description: 'Tangy tropical fruit with aromatic pulp and seeds.',
    image: '/meals/passion fruit.jpeg',
    category: 'fruits',
    recipe: {
      ingredients: ['4 passion fruits'],
      method: ['Cut each in half.', 'Scoop out pulp and seeds.', 'Eat directly from shell.']
    },
    nutrition: { calories: 70, protein: 2, carbs: 17, fats: 1, fiber: 7, sugar: 8, sodium: 22 }
  },
  {
    id: 'fr12',
    name: 'Fresh Grapes',
    description: 'Sweet seedless grapes - a refreshing bite-sized snack.',
    image: '/meals/apples.jpg',
    category: 'fruits',
    recipe: {
      ingredients: ['2 cups grapes'],
      method: ['Wash grapes.', 'Remove from stems.', 'Serve chilled.']
    },
    nutrition: { calories: 124, protein: 1, carbs: 31, fats: 0, fiber: 2, sugar: 27, sodium: 4 }
  },
  {
    id: 'fr13',
    name: 'Soursop (Corossol)',
    description: 'Creamy tropical fruit with sweet-tangy flavor.',
    image: '/meals/soursop.jpeg',
    category: 'fruits',
    recipe: {
      ingredients: ['1 ripe soursop'],
      method: ['Cut soursop in half.', 'Scoop out white flesh.', 'Remove black seeds.', 'Eat fresh or chilled.']
    },
    nutrition: { calories: 150, protein: 2, carbs: 38, fats: 1, fiber: 7, sugar: 30, sodium: 14 }
  },
  {
    id: 'fr14',
    name: 'Fresh Strawberries',
    description: 'Sweet red berries - rich in vitamin C.',
    image: '/meals/strawberry.jpg',
    category: 'fruits',
    recipe: {
      ingredients: ['2 cups strawberries'],
      method: ['Wash strawberries.', 'Remove green tops.', 'Serve whole or sliced.']
    },
    nutrition: { calories: 100, protein: 2, carbs: 24, fats: 1, fiber: 6, sugar: 15, sodium: 4 }
  },
  {
    id: 'fr15',
    name: 'African Pear (Safou)',
    description: 'Buttery African pear with avocado-like texture.',
    image: '/meals/pear.jpg',
    category: 'fruits',
    recipe: {
      ingredients: ['6 Safou'],
      method: ['Wash pears.', 'Boil 5-10 minutes.', 'Drain and cool.', 'Peel and eat flesh.']
    },
    nutrition: { calories: 240, protein: 3, carbs: 18, fats: 18, fiber: 8, sugar: 4, sodium: 6 }
  },
  {
    id: 'fr16',
    name: 'Tamarind',
    description: 'Tangy-sweet tamarind pods.',
    image: '/meals/tamarind fruit.jpeg',
    category: 'fruits',
    recipe: {
      ingredients: ['10 tamarind pods', 'sugar (optional)'],
      method: ['Crack open pods.', 'Remove pulp from seeds.', 'Dip in sugar if desired.', 'Suck pulp.']
    },
    nutrition: { calories: 120, protein: 2, carbs: 31, fats: 0, fiber: 5, sugar: 25, sodium: 12 }
  },
  {
    id: 'fr17',
    name: 'Fresh Lychee',
    description: 'Sweet, floral lychee with translucent flesh.',
    image: '/meals/lychee.jpeg',
    category: 'fruits',
    recipe: {
      ingredients: ['20 lychees'],
      method: ['Peel rough outer skin.', 'Remove seed.', 'Eat chilled.']
    },
    nutrition: { calories: 125, protein: 2, carbs: 31, fats: 1, fiber: 3, sugar: 28, sodium: 2 }
  },
  {
    id: 'fr18',
    name: 'Dragon Fruit',
    description: 'Vibrant pink fruit with sweet, seed-speckled flesh.',
    image: '/meals/dragon fruit.jpeg',
    category: 'fruits',
    recipe: {
      ingredients: ['2 dragon fruits'],
      method: ['Cut in half lengthwise.', 'Scoop out flesh.', 'Slice into cubes.']
    },
    nutrition: { calories: 120, protein: 2, carbs: 26, fats: 0, fiber: 5, sugar: 18, sodium: 0 }
  },
  {
    id: 'fr19',
    name: 'Fresh Figs',
    description: 'Sweet, soft figs with edible seeds.',
    image: '/meals/fig.jpeg',
    category: 'fruits',
    recipe: {
      ingredients: ['6 fresh figs'],
      method: ['Wash figs.', 'Cut off stem.', 'Eat whole or halved.']
    },
    nutrition: { calories: 180, protein: 2, carbs: 46, fats: 1, fiber: 7, sugar: 40, sodium: 2 }
  },
  {
    id: 'fr20',
    name: 'Fresh Pear',
    description: 'Sweet, juicy pears.',
    image: '/meals/pear.jpg',
    category: 'fruits',
    recipe: {
      ingredients: ['2 ripe pears'],
      method: ['Wash pears.', 'Eat whole or slice.', 'Remove core if desired.']
    },
    nutrition: { calories: 200, protein: 2, carbs: 54, fats: 1, fiber: 12, sugar: 36, sodium: 4 }
  },
  {
    id: 'fr21',
    name: 'Green Tangerine',
    description: 'Sweet-tangy green tangerines.',
    image: '/meals/tangerine.jpeg',
    category: 'fruits',
    recipe: {
      ingredients: ['4 tangerines'],
      method: ['Peel tangerines.', 'Separate segments.', 'Remove white pith.', 'Serve fresh.']
    },
    nutrition: { calories: 160, protein: 3, carbs: 40, fats: 1, fiber: 6, sugar: 32, sodium: 4 }
  },
  {
    id: 'fr22',
    name: 'Fresh Plum',
    description: 'Sweet and juicy plums.',
    image: '/meals/plum.jpg',
    category: 'fruits',
    recipe: {
      ingredients: ['6 plums'],
      method: ['Wash plums.', 'Cut in half, remove pit.', 'Eat fresh.']
    },
    nutrition: { calories: 180, protein: 2, carbs: 46, fats: 1, fiber: 6, sugar: 40, sodium: 0 }
  },
  {
    id: 'fr23',
    name: 'Fresh Kiwi',
    description: 'Tangy-sweet kiwi with vibrant green flesh.',
    image: '/meals/kiwi.jpeg',
    category: 'fruits',
    recipe: {
      ingredients: ['4 kiwis'],
      method: ['Cut in half.', 'Scoop out flesh.', 'Slice or eat directly.']
    },
    nutrition: { calories: 160, protein: 3, carbs: 38, fats: 2, fiber: 8, sugar: 26, sodium: 8 }
  },
  {
    id: 'fr24',
    name: 'Fresh Raspberries',
    description: 'Delicate sweet-tart berries.',
    image: '/meals/raspberry.jpeg',
    category: 'fruits',
    recipe: {
      ingredients: ['2 cups raspberries'],
      method: ['Gently wash.', 'Serve fresh or chilled.']
    },
    nutrition: { calories: 130, protein: 3, carbs: 30, fats: 2, fiber: 16, sugar: 10, sodium: 2 }
  },
  {
    id: 'fr25',
    name: 'Fresh Blackberries',
    description: 'Sweet-tart blackberries.',
    image: '/meals/blackberry.jpeg',
    category: 'fruits',
    recipe: {
      ingredients: ['2 cups blackberries'],
      method: ['Gently wash.', 'Serve fresh or chilled.']
    },
    nutrition: { calories: 124, protein: 4, carbs: 28, fats: 1, fiber: 14, sugar: 14, sodium: 2 }
  },
  {
    id: 'fr26',
    name: 'Fresh Blueberries',
    description: 'Sweet tiny blueberries.',
    image: '/meals/blueberry.jpeg',
    category: 'fruits',
    recipe: {
      ingredients: ['2 cups blueberries'],
      method: ['Wash gently.', 'Serve fresh or chilled.']
    },
    nutrition: { calories: 170, protein: 2, carbs: 42, fats: 2, fiber: 8, sugar: 30, sodium: 4 }
  },
  {
    id: 'fr27',
    name: 'Fresh Cantaloupe',
    description: 'Sweet orange melon.',
    image: '/meals/cantaloupe.jpeg',
    category: 'fruits',
    recipe: {
      ingredients: ['½ cantaloupe'],
      method: ['Cut in half.', 'Remove seeds.', 'Slice or scoop balls.', 'Serve chilled.']
    },
    nutrition: { calories: 140, protein: 4, carbs: 34, fats: 1, fiber: 4, sugar: 32, sodium: 40 }
  },
  {
    id: 'fr28',
    name: 'Fresh Honeydew',
    description: 'Sweet green melon.',
    image: '/meals/honeydew.jpeg',
    category: 'fruits',
    recipe: {
      ingredients: ['½ honeydew'],
      method: ['Cut in half.', 'Remove seeds.', 'Slice or scoop balls.', 'Serve chilled.']
    },
    nutrition: { calories: 128, protein: 2, carbs: 32, fats: 0, fiber: 3, sugar: 28, sodium: 28 }
  },
  {
    id: 'fr29',
    name: 'Fresh Pomegranate',
    description: 'Jewel-like arils bursting with sweet-tart juice.',
    image: '/meals/pomegranate.jpeg',
    category: 'fruits',
    recipe: {
      ingredients: ['1 pomegranate'],
      method: ['Cut in half.', 'Tap with spoon to release seeds.', 'Remove white pith.', 'Eat arils.']
    },
    nutrition: { calories: 234, protein: 5, carbs: 52, fats: 3, fiber: 11, sugar: 38, sodium: 8 }
  },
  {
    id: 'fr30',
    name: 'Fresh Date',
    description: 'Naturally sweet dates.',
    image: '/meals/dates.jpeg',
    category: 'fruits',
    recipe: {
      ingredients: ['10 Medjool dates'],
      method: ['Remove pits by cutting lengthwise.', 'Eat as is or stuff with nuts.', 'Serve at room temperature.']
    },
    nutrition: { calories: 280, protein: 2, carbs: 75, fats: 0, fiber: 7, sugar: 64, sodium: 4 }
  }
];

export const MEAL_CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snacks', 'drinks', 'fruits'] as const;
export type MealCategory = typeof MEAL_CATEGORIES[number];