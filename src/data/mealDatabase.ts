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
  // BREAKFAST (1-50)
  {
    id: 'b1', name: 'Achu & Yellow Soup', description: 'Pounded cocoyam served with vibrant yellow soup made from palm oil, beef broth, and limestone solution.',
    image: '/meals/achu.jpg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Achu: 1 kg Achu cocoyam (Taro)', 'water', 'Soup: 1 cup heated palm oil', '2 cups beef broth', '1 1/2 tbsp Achu spice mix', '1/3 cup limestone solution (kangwa mix)', 'salt', 'bouillon', 'Sides: Boiled garden eggs', 'Njama Njama (huckleberry leaves)'],
      method: ['Wash cocoyams thoroughly.', 'Peel before or after boiling (traditional method is peeling after).', 'Boil until very tender (2–3 hours).', 'Pound cocoyams in a mortar with a pestle while they are still hot until completely smooth, elastic, and dense.', 'Shape into smooth balls.', 'For Yellow Soup: Boil assorted meats to extract rich stock.', 'Heat palm oil just until slightly warm (do not bleach).', 'Dissolve limestone solution in boiling water.', 'In a blender, combine stock, heated oil, limestone solution, and Achu spice mix.', 'Blend briefly until it turns vibrantly yellow and emulsified.', 'Stir in salt and bouillon cubes to taste.', 'Serve Achu fufu with a side of yellow soup, assorted meats, and garden eggs.']
    },
    nutrition: { calories: 720, protein: 32, carbs: 105, fats: 28, fiber: 8, sugar: 4, sodium: 850 }
  },
  {
    id: 'b2', name: 'Millet Pap (Breakfast Porridge)', description: 'Nutritious fermented millet porridge served hot with evaporated milk and sugar.',
    image: '/meals/Mielie Pap Porridge.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['500g Millet paste', 'water', 'evaporated milk (Peak milk)', 'granulated sugar'],
      method: ['Mix millet paste with cold water to thin slightly.', 'Pour this mixture into a pot of vigorously boiling water, stirring constantly and rapidly to prevent lumps.', 'Cook until the pap is thick and translucent (about 5 minutes).', 'Serve hot, stirred with evaporated milk and sugar.']
    },
    nutrition: { calories: 180, protein: 5, carbs: 38, fats: 2, fiber: 4, sugar: 0, sodium: 8 }
  },
  {
    id: 'b3', name: 'Garri Soaked with Sugar', description: 'Quick cassava cereal with roasted groundnuts - a staple breakfast across Cameroon.',
    image: '/meals/drinking garri.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 cup Garri (cassava)', '1/2 cup roasted groundnuts', '1/2 cup granulated sugar'],
      method: ['Mix garri with cold water in a bowl.', 'Drain excess water.', 'Stir in sugar.', 'Serve soft garri with a side of groundnuts.']
    },
    nutrition: { calories: 290, protein: 4, carbs: 62, fats: 5, fiber: 3, sugar: 25, sodium: 15 }
  },
  {
    id: 'b4', name: 'Traditional Omelette', description: 'Fluffy Cameroonian-style omelette with tomatoes, onions, and spices.',
    image: '/meals/omelete.jpg',
    category: 'breakfast',
    recipe: {
      ingredients: ['6 eggs', '3 tomatoes', '1 onion', 'garlic', 'pebe (African nutmeg)', 'bouillon cube', 'salt'],
      method: ['Dice tomatoes and onions finely.', 'Mince garlic.', 'Crack eggs into a bowl and whisk until frothy.', 'Add diced vegetables, minced garlic, pebe, crumbled bouillon cube, and salt to the eggs.', 'Mix well to combine.', 'Heat a pan with oil over medium heat.', 'Pour egg mixture into the pan.', 'Cook until edges are set, then fold and cook through.', 'Serve hot.']
    },
    nutrition: { calories: 280, protein: 18, carbs: 8, fats: 20, fiber: 2, sugar: 4, sodium: 480 }
  },
  {
    id: 'b5', name: 'Boiled Yam & Egg Sauce', description: 'Tender boiled yam served with rich tomato and egg sauce.',
    image: '/meals/Yam and egg.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Yam: 1 kg Yam (Puna)', 'water', 'Sauce: 6 eggs', '3 tomatoes', '1 onion', 'garlic', 'pebe', 'bouillon cube', 'salt'],
      method: ['Peel yam and cut into chunks.', 'Boil yam chunks until tender.', 'For sauce: Dice tomatoes and onions, mince garlic.', 'Heat oil in a pan.', 'Sauté onions and garlic until fragrant.', 'Add tomatoes and cook until soft.', 'Crack eggs into the pan and scramble with vegetables.', 'Add crumbled bouillon cube, pebe, and salt to taste.', 'Serve boiled yam with egg sauce on top.']
    },
    nutrition: { calories: 550, protein: 16, carbs: 78, fats: 22, fiber: 7, sugar: 4, sodium: 490 }
  },
  {
    id: 'b6', name: 'Masa with Pepper Sauce', description: 'Northern-style fermented rice cakes served with spicy pepper sauce.',
    image: '/meals.masa.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Masa: 1 kg Cornflour', 'Sauce: 1 bulb garlic', 'thumb-sized ginger', 'pebe', '2 crayfish seasoning cubes', '1 cup vegetable oil', 'salt'],
      method: ['For Masa: Prepare rice batter and ferment overnight.', 'Add sugar and mix well.', 'Heat special masa pan with indentations.', 'Pour batter into each indentation.', 'Cook until golden brown, flip and cook other side.', 'For Sauce: Blend garlic, ginger, and pebe.', 'Heat oil in a pan.', 'Add blended mixture and fry until fragrant.', 'Crumble in crayfish cubes and add salt.', 'Simmer for 5 minutes.', 'Serve masa with pepper sauce.']
    },
    nutrition: { calories: 350, protein: 6, carbs: 68, fats: 5, fiber: 2, sugar: 18, sodium: 410 }
  },
  {
    id: 'b7', name: 'Koki Corn (Breakfast Wrap)', description: 'Steamed fresh corn pudding wrapped in banana leaves - a nutritious morning meal.',
    image: '/meals/kokicorn.jpg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Corn: 1 kg fresh corn', 'palm oil', '2 cups spinach', 'thumb-sized ginger', 'crayfish', 'salt', 'Fufu: 1 kg Rice flour'],
      method: ['Grate fresh corn kernels and ginger into a coarse paste.', 'Whisk the paste rigorously to incorporate air.', 'Add palm oil, crayfish, salt, and finely chopped spinach.', 'Mix well to form a thick, yellow batter.', 'Place small portions into softened banana leaves.', 'Fold securely to create flat, sealed packages.', 'In a pot, lay down several banana leaves.', 'Arrange the koki packages on top.', 'Add water to cover.', 'Cover and steam for 1.5–2 hours until firm.', 'Serve with rice fufu.']
    },
    nutrition: { calories: 350, protein: 9, carbs: 52, fats: 12, fiber: 7, sugar: 6, sodium: 420 }
  },
  {
    id: 'b8', name: 'Puff Puff & Beans', description: 'Deep-fried sweet dough balls served with stewed brown beans.',
    image: '/meals/puff puff beans.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Puff Puff: 500g All-purpose flour', '150g sugar', '2 tsp active dry yeast', '1 tsp salt', '500ml lukewarm water', 'Vegetable oil', 'Beans: 1 kg brown beans', '1 large onion', '3 tomatoes', '1/4 cup palm oil', '2 crayfish cubes', 'salt'],
      method: ['For Puff Puff: Mix yeast with sugar and warm water; let sit 10 mins until frothy.', 'Whisk flour and salt; add yeast mixture.', 'Mix until smooth, thick batter forms.', 'Cover and let rise 1–2 hours.', 'Heat oil; scoop batter and deep-fry until golden.', 'For Beans: Soak beans overnight.', 'Drain and boil until tender.', 'In separate pot, heat palm oil.', 'Sauté onions, add tomatoes, cook until soft.', 'Add crayfish cubes, salt, and cooked beans with broth.', 'Simmer 15 minutes.', 'Serve together.']
    },
    nutrition: { calories: 550, protein: 18, carbs: 85, fats: 22, fiber: 12, sugar: 14, sodium: 350 }
  },
  {
    id: 'b9', name: 'White Corn Pap (Akamu)', description: 'Smooth fermented white corn porridge.',
    image: '/meals/pap.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['500g White corn paste', 'water', 'evaporated milk', 'granulated sugar'],
      method: ['Mix corn paste with cold water to thin slightly.', 'Pour into boiling water, stirring constantly.', 'Cook until thick and translucent (5 minutes).', 'Serve hot with milk and sugar.']
    },
    nutrition: { calories: 150, protein: 3, carbs: 32, fats: 1, fiber: 2, sugar: 1, sodium: 5 }
  },
  {
    id: 'b10', name: 'Fried Bread & Stew', description: 'Golden fried bread served with savory tomato and egg stew.',
    image: '/meals/Chicken-Peppersoup.jpg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Bread: 1 kg All-purpose flour', 'water', 'Stew: 6 eggs', '3 tomatoes', '1 onion', 'garlic', 'pebe', 'bouillon cube', 'salt'],
      method: ['For Bread: Prepare dough with flour, water, and salt.', 'Knead until smooth.', 'Divide into portions and roll out.', 'Fold and fry in hot oil until golden.', 'For Stew: Sauté onions and garlic.', 'Add tomatoes, cook until soft.', 'Scramble in eggs.', 'Add bouillon and spices.', 'Serve fried bread with stew.']
    },
    nutrition: { calories: 460, protein: 16, carbs: 50, fats: 22, fiber: 2, sugar: 5, sodium: 540 }
  },
  {
    id: 'b11', name: 'Sweet Corn Pap (Akamu)', description: 'Sweet corn porridge made from fermented fresh corn.',
    image: '/meals/Coal roasted Corn.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['500g sweet corn paste', 'water', 'evaporated milk', 'granulated sugar'],
      method: ['Mix sweet corn paste with cold water.', 'Pour into boiling water, stirring constantly.', 'Cook until thick and translucent.', 'Serve hot with milk and sugar.']
    },
    nutrition: { calories: 190, protein: 5, carbs: 42, fats: 2, fiber: 6, sugar: 18, sodium: 15 }
  },
  {
    id: 'b12', name: 'Sorghum Pap', description: 'Dark earthy porridge from the North.',
    image: '/meals/Food.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['500g Sorghum paste', 'water', 'evaporated milk', 'sugar'],
      method: ['Mix sorghum paste with cold water.', 'Pour into boiling water, stirring constantly.', 'Cook until thick.', 'Serve with milk and sugar.']
    },
    nutrition: { calories: 170, protein: 4, carbs: 36, fats: 1, fiber: 5, sugar: 0, sodium: 10 }
  },
  {
    id: 'b13', name: 'Rice Pap', description: 'Smooth rice porridge, perfect for breakfast.',
    image: '/meals/friedrice.jpg',
    category: 'breakfast',
    recipe: {
      ingredients: ['500g Rice paste', 'water', 'evaporated milk', 'sugar'],
      method: ['Mix rice paste with cold water.', 'Pour into boiling water, stirring constantly.', 'Cook until thick and translucent.', 'Serve with milk and sugar.']
    },
    nutrition: { calories: 280, protein: 6, carbs: 55, fats: 4, fiber: 1, sugar: 12, sodium: 45 }
  },
  {
    id: 'b14', name: 'Yellow Corn Pap', description: 'Nutrient-rich yellow corn porridge.',
    image: '/meals/Coal roasted Corn.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['500g yellow corn paste', 'water', 'evaporated milk', 'sugar'],
      method: ['Mix corn paste with cold water.', 'Pour into boiling water, stirring constantly.', 'Cook until thick.', 'Serve with milk and sugar.']
    },
    nutrition: { calories: 160, protein: 3, carbs: 34, fats: 1, fiber: 3, sugar: 1, sodium: 5 }
  },
  {
    id: 'b15', name: 'Millet Couscous', description: 'Steamed millet granules served as breakfast fufu.',
    image: '/meals/Finger Millet.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 kg Millet flour', 'water', 'Stew: 6 eggs', '3 tomatoes', '1 onion', 'garlic', 'pebe', 'bouillon', 'salt'],
      method: ['Stir millet flour into boiling water.', 'Stir until thick and starchy.', 'Shape into balls.', 'Prepare egg stew separately.', 'Serve together.']
    },
    nutrition: { calories: 420, protein: 12, carbs: 75, fats: 8, fiber: 6, sugar: 3, sodium: 380 }
  },
  {
    id: 'b16', name: 'Garri & Milk', description: 'Soaked garri with evaporated milk.',
    image: '/meals/drinking garri.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 cup Garri', '1 cup evaporated milk', '1 cup sugar', '1/2 cup groundnuts'],
      method: ['Mix garri with cold water.', 'Drain excess water.', 'Stir in milk and sugar.', 'Top with groundnuts.']
    },
    nutrition: { calories: 280, protein: 6, carbs: 52, fats: 6, fiber: 3, sugar: 22, sodium: 45 }
  },
  {
    id: 'b17', name: 'Garri & Groundnuts', description: 'Dry garri mixed with roasted peanuts.',
    image: '/meals/drinking garri.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 cup Garri', '1/2 cup groundnuts', '1/2 cup sugar'],
      method: ['Mix garri with sugar.', 'Add groundnuts.', 'Eat as dry cereal or add water.']
    },
    nutrition: { calories: 320, protein: 10, carbs: 55, fats: 10, fiber: 5, sugar: 15, sodium: 85 }
  },
  {
    id: 'b18', name: 'Manioc au Sucre', description: 'Boiled cassava served with sugar.',
    image: '/meals/milkshake.jpg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 kg Cassava', 'sugar'],
      method: ['Peel and boil cassava until tender.', 'Serve with sugar sprinkled on top.']
    },
    nutrition: { calories: 350, protein: 3, carbs: 82, fats: 2, fiber: 8, sugar: 25, sodium: 15 }
  },
  {
    id: 'b19', name: 'Tapioca Porridge', description: 'Cassava pearl cereal with milk.',
    image: '/meals/bananaporridge.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 cup Tapioca pearls', '3 cups water', '1 cup milk', '1 cup sugar', '1/2 cup groundnuts'],
      method: ['Soak tapioca in water.', 'Drain.', 'Mix with milk and sugar.', 'Top with groundnuts.']
    },
    nutrition: { calories: 320, protein: 7, carbs: 50, fats: 10, fiber: 2, sugar: 22, sodium: 65 }
  },
  {
    id: 'b20', name: 'Highland Oats', description: 'Warming oatmeal with milk.',
    image: '/meals/Food.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['1 cup Oats', 'water', 'milk', 'sugar'],
      method: ['Boil oats with milk and water.', 'Cook until thick.', 'Serve with sugar.']
    },
    nutrition: { calories: 310, protein: 9, carbs: 45, fats: 10, fiber: 6, sugar: 10, sodium: 120 }
  },
  {
    id: 'b21', name: 'Custard & Biscuit', description: 'Vanilla custard with biscuits.',
    image: '/meals/biscuits.jpg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Custard powder', 'milk', 'sugar', 'biscuits'],
      method: ['Mix custard with cold water.', 'Stir into boiling water until thick.', 'Add milk and sugar.', 'Serve with biscuits.']
    },
    nutrition: { calories: 340, protein: 6, carbs: 62, fats: 8, fiber: 1, sugar: 28, sodium: 210 }
  },
  {
    id: 'b22', name: 'Egg Bread Tea', description: 'Egg-dipped fried bread with tea.',
    image: '/meals/Traditional Pakistani Chai.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Bread', 'eggs', 'butter', 'tea', 'milk', 'sugar'],
      method: ['Whisk eggs with salt.', 'Dip bread in egg mixture.', 'Fry in butter until golden.', 'Brew tea with milk and sugar.', 'Serve together.']
    },
    nutrition: { calories: 430, protein: 12, carbs: 58, fats: 16, fiber: 2, sugar: 15, sodium: 380 }
  },
  {
    id: 'b23', name: 'Boiled Irish & Butter', description: 'Soft boiled potatoes with butter.',
    image: '/meals/Irish Potato Roast.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Irish potatoes', 'butter', 'salt'],
      method: ['Boil potatoes until tender.', 'Serve with butter and salt.']
    },
    nutrition: { calories: 380, protein: 5, carbs: 62, fats: 12, fiber: 5, sugar: 3, sodium: 210 }
  },
  {
    id: 'b24', name: 'Boiled Cocoyam & Egg', description: 'Simple tuber breakfast with eggs.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Cocoyam', 'eggs', 'salt'],
      method: ['Boil cocoyam until tender.', 'Boil eggs until hard.', 'Serve together with salt.']
    },
    nutrition: { calories: 420, protein: 15, carbs: 65, fats: 12, fiber: 9, sugar: 4, sodium: 390 }
  },
  {
    id: 'b25', name: 'Fried Yam & Egg', description: 'Yam fries with scrambled eggs.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Yam', 'eggs', 'tomatoes', 'onions', 'oil', 'salt'],
      method: ['Peel and slice yam.', 'Deep fry until golden.', 'Scramble eggs with tomatoes and onions.', 'Serve together.']
    },
    nutrition: { calories: 620, protein: 15, carbs: 75, fats: 28, fiber: 6, sugar: 3, sodium: 480 }
  },
  {
    id: 'b26', name: 'Irish Potato & Omelette', description: 'Fried potatoes with omelette.',
    image: '/meals/omelete.jpg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Irish potatoes', 'eggs', 'tomatoes', 'onions', 'oil', 'salt'],
      method: ['Peel and dice potatoes.', 'Fry until golden.', 'Prepare omelette separately.', 'Serve together.']
    },
    nutrition: { calories: 450, protein: 14, carbs: 58, fats: 20, fiber: 5, sugar: 3, sodium: 480 }
  },
  {
    id: 'b27', name: 'Boiled Egg & Avocado', description: 'Simple protein-rich breakfast.',
    image: '/meals/boiled eggs.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Eggs', 'avocado', 'salt'],
      method: ['Boil eggs until hard.', 'Slice avocado.', 'Serve with salt.']
    },
    nutrition: { calories: 310, protein: 12, carbs: 10, fats: 25, fiber: 10, sugar: 2, sodium: 240 }
  },
  {
    id: 'b28', name: 'Boiled Egg & Tomato', description: 'Simple eggs with fresh tomatoes.',
    image: '/meals/boiled eggs.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Eggs', 'tomatoes', 'salt'],
      method: ['Boil eggs.', 'Slice tomatoes.', 'Serve together with salt.']
    },
    nutrition: { calories: 180, protein: 13, carbs: 6, fats: 12, fiber: 2, sugar: 4, sodium: 310 }
  },
  {
    id: 'b29', name: 'Bread & Butter', description: 'Simple buttered baguette.',
    image: '/meals/breadbutter.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Baguette', 'butter'],
      method: ['Slice baguette.', 'Spread with butter.']
    },
    nutrition: { calories: 280, protein: 5, carbs: 42, fats: 12, fiber: 2, sugar: 6, sodium: 310 }
  },
  {
    id: 'b30', name: 'Tartina Bread', description: 'Baguette with chocolate spread.',
    image: '/meals/Tartine Basic Country Bread.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Baguette', 'Tartina spread', 'butter'],
      method: ['Slice baguette.', 'Spread butter and chocolate paste.']
    },
    nutrition: { calories: 400, protein: 6, carbs: 65, fats: 14, fiber: 3, sugar: 30, sodium: 310 }
  },
  {
    id: 'b31', name: 'Avocado Toast', description: 'Mashed avocado on Kumba bread.',
    image: '/meals/avocado toast.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Kumba bread', 'avocado', 'lemon juice', 'onion', 'salt'],
      method: ['Mash avocado with lemon and salt.', 'Toast bread.', 'Spread avocado on toast.', 'Top with onions.']
    },
    nutrition: { calories: 390, protein: 7, carbs: 45, fats: 22, fiber: 10, sugar: 3, sodium: 280 }
  },
  {
    id: 'b32', name: 'Mango & Yogurt', description: 'Fresh mango with yogurt.',
    image: '/meals/Mango yogurt bowl 🥭🍦.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Mango', 'plain yogurt', 'honey'],
      method: ['Slice mango.', 'Mix with yogurt.', 'Drizzle with honey.']
    },
    nutrition: { calories: 220, protein: 8, carbs: 42, fats: 4, fiber: 4, sugar: 35, sodium: 65 }
  },
  {
    id: 'b33', name: 'Papaya & Lime Bowl', description: 'Fresh papaya with lime.',
    image: '/meals/Papaya and Lime.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Papaya', 'lime juice'],
      method: ['Slice papaya.', 'Squeeze lime over it.']
    },
    nutrition: { calories: 110, protein: 1, carbs: 28, fats: 0, fiber: 5, sugar: 24, sodium: 10 }
  },
  {
    id: 'b34', name: 'Market Fruit Salad', description: 'Fresh fruit with condensed milk.',
    image: '/meals/Healthy Brunch Fruit Salad.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Mango', 'papaya', 'banana', 'condensed milk'],
      method: ['Cube all fruits.', 'Toss together.', 'Drizzle with condensed milk.']
    },
    nutrition: { calories: 210, protein: 3, carbs: 48, fats: 2, fiber: 6, sugar: 38, sodium: 10 }
  },
  {
    id: 'b35', name: 'Soya Breakfast', description: 'Grilled beef skewers with bread.',
    image: '/meals/beef soya.jpg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Beef strips', 'suya spice', 'peanuts', 'chili', 'baguette'],
      method: ['Coat beef in suya spice.', 'Grill over charcoal.', 'Serve with bread and onions.']
    },
    nutrition: { calories: 530, protein: 35, carbs: 45, fats: 22, fiber: 1, sugar: 2, sodium: 610 }
  },
  {
    id: 'b36', name: 'Fried Rice with Egg', description: 'Breakfast fried rice with egg.',
    image: '/meals/friedrice.jpg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Rice', 'eggs', 'smoked fish', 'garlic', 'ginger', 'oil', 'salt'],
      method: ['Prepare fried rice.', 'Top with fried egg.']
    },
    nutrition: { calories: 490, protein: 14, carbs: 75, fats: 16, fiber: 4, sugar: 4, sodium: 620 }
  },
  {
    id: 'b37', name: 'Spicy Gizzards', description: 'Gizzards in tomato sauce with bread.',
    image: '/meals/fried gizzard.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Gizzards', 'tomato', 'pepper', 'onions', 'garlic', 'bread'],
      method: ['Boil gizzards until soft.', 'Sauté with peppers and tomatoes.', 'Serve with bread.']
    },
    nutrition: { calories: 470, protein: 28, carbs: 48, fats: 15, fiber: 2, sugar: 4, sodium: 680 }
  },
  {
    id: 'b38', name: 'Masa & Honey', description: 'Rice cakes with wild honey.',
    image: '/meals/masa.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Rice flour', 'yeast', 'honey'],
      method: ['Prepare masa batter.', 'Fry in special pan.', 'Drizzle with honey.']
    },
    nutrition: { calories: 310, protein: 5, carbs: 65, fats: 3, fiber: 2, sugar: 24, sodium: 80 }
  },
  {
    id: 'b39', name: 'Masa & Spicy Oil', description: 'Savory rice cakes with chili oil.',
    image: '/meals/masa.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Rice flour', 'yeast', 'palm oil', 'chili', 'salt'],
      method: ['Prepare masa.', 'Mix oil with chili.', 'Serve masa with spicy oil.']
    },
    nutrition: { calories: 360, protein: 6, carbs: 68, fats: 8, fiber: 2, sugar: 16, sodium: 420 }
  },
  {
    id: 'b40', name: 'Massa', description: 'Northern fermented rice cakes.',
    image: '/meals/Food.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Rice', 'sugar', 'yeast'],
      method: ['Blend rice with sugar and yeast.', 'Ferment overnight.', 'Fry in dimpled pan.']
    },
    nutrition: { calories: 320, protein: 5, carbs: 68, fats: 4, fiber: 2, sugar: 20, sodium: 90 }
  },
  {
    id: 'b41', name: 'Plantain & Scrambled Egg', description: 'Boiled plantain with egg scramble.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Plantains', 'eggs', 'onions', 'tomatoes', 'oil', 'salt'],
      method: ['Boil plantains.', 'Scramble eggs with vegetables.', 'Serve together.']
    },
    nutrition: { calories: 510, protein: 16, carbs: 68, fats: 22, fiber: 6, sugar: 12, sodium: 450 }
  },
  {
    id: 'b42', name: 'Plantain & Gizzard', description: 'Fried plantains with gizzards.',
    image: '/meals/fried gizzard.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Plantains', 'gizzards', 'peppers', 'onions', 'oil'],
      method: ['Fry plantains.', 'Sauté gizzards with peppers.', 'Serve together.']
    },
    nutrition: { calories: 540, protein: 26, carbs: 58, fats: 24, fiber: 5, sugar: 15, sodium: 480 }
  },
  {
    id: 'b43', name: 'Plantain & Plum', description: 'Boiled plantain with African pears.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Plantains', 'African plums (Safou)', 'salt'],
      method: ['Boil plantains.', 'Roast or boil plums until soft.', 'Serve together with salt.']
    },
    nutrition: { calories: 410, protein: 5, carbs: 88, fats: 10, fiber: 8, sugar: 15, sodium: 15 }
  },
  {
    id: 'b44', name: 'Plantain Porridge', description: 'Unripe plantains in oil sauce.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Plantains', 'palm oil', 'fish', 'onions', 'salt'],
      method: ['Cube plantains.', 'Boil with fish and oil.', 'Mash slightly.']
    },
    nutrition: { calories: 460, protein: 12, carbs: 78, fats: 14, fiber: 9, sugar: 12, sodium: 410 }
  },
  {
    id: 'b45', name: 'Porridge Macabo', description: 'Grated cocoyam porridge.',
    image: '/meals/bananaporridge.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Macabo', 'palm oil', 'ginger', 'salt'],
      method: ['Grate macabo.', 'Boil with ginger and oil.', 'Cook until thick.']
    },
    nutrition: { calories: 490, protein: 10, carbs: 82, fats: 16, fiber: 10, sugar: 5, sodium: 320 }
  },
  {
    id: 'b46', name: 'Sweet Potato Porridge', description: 'Orange potatoes in tomato sauce.',
    image: '/meals/bananaporridge.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Sweet potatoes', 'tomato', 'fish', 'onions', 'oil'],
      method: ['Stew potatoes with fish and onions.', 'Cook until thick.']
    },
    nutrition: { calories: 480, protein: 8, carbs: 95, fats: 12, fiber: 9, sugar: 18, sodium: 340 }
  },
  {
    id: 'b47', name: 'Yam Porridge', description: 'Yam chunks in oil base.',
    image: '/meals/bananaporridge.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Yam', 'tomato', 'palm oil', 'onions', 'salt'],
      method: ['Boil yam in tomato sauce.', 'Mash pieces to thicken.']
    },
    nutrition: { calories: 520, protein: 12, carbs: 88, fats: 15, fiber: 7, sugar: 5, sodium: 440 }
  },
  {
    id: 'b48', name: 'Pounded Yam & Egg', description: 'Heavy yam and egg scramble.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Yam', 'eggs', 'tomatoes', 'onions', 'oil'],
      method: ['Pound boiled yam.', 'Serve with tomato egg stew.']
    },
    nutrition: { calories: 590, protein: 16, carbs: 80, fats: 22, fiber: 6, sugar: 4, sodium: 510 }
  },
  {
    id: 'b49', name: 'Yam & Scrambled Tofu', description: 'Vegan yam breakfast.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Yam', 'tofu', 'turmeric', 'onion', 'oil', 'salt'],
      method: ['Boil and pound yam.', 'Scramble tofu with turmeric.', 'Serve together.']
    },
    nutrition: { calories: 410, protein: 18, carbs: 72, fats: 10, fiber: 8, sugar: 5, sodium: 420 }
  },
  {
    id: 'b50', name: 'Tofu Scramble', description: 'Vegan soy curd with bread.',
    image: '/meals/Tofu Scramble with Spinach and Tomato.jpeg',
    category: 'breakfast',
    recipe: {
      ingredients: ['Tofu', 'bread', 'turmeric', 'onion', 'oil', 'salt'],
      method: ['Sauté crumbled tofu with turmeric.', 'Serve in bread.']
    },
    nutrition: { calories: 410, protein: 18, carbs: 52, fats: 14, fiber: 5, sugar: 4, sodium: 580 }
  },

  // LUNCH (51-150)
  {
    id: 'l1', name: 'Ndole', description: 'Cameroon\'s national dish - bitter leaves in peanut sauce.',
    image: '/meals/ndole.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg bitter leaves', '600g peanuts', '500g beef', '300g shrimp', '1/4 lb smoked fish', '2 onions', 'ginger', 'garlic', '1 cup palm oil', '2 crayfish cubes', 'salt', 'white pepper'],
      method: ['Boil peanuts until soft, blend with ginger, garlic, and onion.', 'Heat oil, fry sliced onions.', 'Add peanut paste, simmer 7 minutes.', 'Add beef, smoked fish, crayfish cubes, spices.', 'Stir in bitter leaves.', 'Simmer 15-20 minutes.', 'Sear shrimp separately and fold in.', 'Serve with fried plantains.']
    },
    nutrition: { calories: 820, protein: 52, carbs: 45, fats: 48, fiber: 9, sugar: 6, sodium: 710 }
  },
  {
    id: 'l2', name: 'Ndole with Shrimp', description: 'Shrimp-based bitterleaf stew.',
    image: '/meals/ndole.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Bitterleaves', 'peanuts', 'shrimp', 'onions', 'garlic', 'palm oil', 'crayfish', 'salt'],
      method: ['Prepare Ndole base.', 'Fold in fresh shrimp at the end.']
    },
    nutrition: { calories: 710, protein: 45, carbs: 42, fats: 42, fiber: 9, sugar: 6, sodium: 650 }
  },
  {
    id: 'l3', name: 'Ndole with Crayfish', description: 'Bitterleaf stew with extra crayfish.',
    image: '/meals/ndole.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Bitterleaf', 'peanuts', 'crayfish', 'meat', 'onions', 'palm oil', 'salt'],
      method: ['Prepare Ndole.', 'Add extra ground crayfish.', 'Simmer until oil rises.']
    },
    nutrition: { calories: 740, protein: 48, carbs: 42, fats: 42, fiber: 9, sugar: 6, sodium: 680 }
  },
  {
    id: 'l4', name: 'Ndole & Plantain', description: 'Bitterleaf stew with plantain.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Bitterleaf', 'peanuts', 'plantains', 'beef', 'onions', 'palm oil', 'salt'],
      method: ['Make Ndole.', 'Serve with boiled ripe plantains.']
    },
    nutrition: { calories: 710, protein: 38, carbs: 72, fats: 35, fiber: 9, sugar: 14, sodium: 580 }
  },
  {
    id: 'l5', name: 'Ndole & Miondo', description: 'Bitterleaf stew with cassava sticks.',
    image: '/meals/ndole.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Bitterleaves', 'peanuts', 'beef', 'miondo', 'onions', 'palm oil', 'crayfish'],
      method: ['Grind peanuts, wash leaves.', 'Sauté meat.', 'Simmer all ingredients.', 'Steam miondo separately.', 'Serve together.']
    },
    nutrition: { calories: 750, protein: 42, carbs: 48, fats: 45, fiber: 9, sugar: 6, sodium: 620 }
  },
  {
    id: 'l6', name: 'Ndole & Boiled Irish', description: 'Bitterleaf stew with potatoes.',
    image: '/meals/ndole.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Bitterleaf', 'peanuts', 'Irish potatoes', 'beef', 'onions', 'palm oil'],
      method: ['Prepare Ndole.', 'Boil potatoes separately.', 'Serve together.']
    },
    nutrition: { calories: 520, protein: 24, carbs: 45, fats: 28, fiber: 8, sugar: 5, sodium: 480 }
  },
  {
    id: 'l7', name: 'Eru & Waterfufu', description: 'Wild spinach with cassava fufu.',
    image: '/meals/eru.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['6 cups dried Eru', '3 bundles waterleaf', '2 lbs canda', '1 lb tripe', '2 cups crayfish', '3 cups palm oil', '1/2 cup canola oil', '1 crayfish cube', 'habanero', 'salt', '1 kg Waterfufu paste'],
      method: ['Soak Eru 1 hour, wash, drain.', 'Simmer canda and tripe in broth.', 'Add chopped waterleaf, cook until shrinks.', 'Add Eru, crayfish cube, pepper, oils.', 'Stir continuously, cook 20 minutes.', 'Stir fufu paste into boiling water until smooth.', 'Serve Eru alongside Waterfufu.']
    },
    nutrition: { calories: 850, protein: 38, carbs: 95, fats: 42, fiber: 12, sugar: 2, sodium: 580 }
  },
  {
    id: 'l8', name: 'Koki Corn', description: 'Steamed corn cake in leaves.',
    image: '/meals/koki.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg fresh corn', '300g palm oil', '2 cups spinach', 'ginger', '2 crayfish cubes', 'salt', 'banana leaves'],
      method: ['Grind corn and ginger into paste.', 'Whisk vigorously to incorporate air.', 'Add palm oil, crayfish, salt, chopped spinach.', 'Mix to thick batter.', 'Portion into banana leaves, fold securely.', 'Steam 1.5-2 hours until firm.']
    },
    nutrition: { calories: 550, protein: 15, carbs: 75, fats: 20, fiber: 12, sugar: 8, sodium: 480 }
  },
  {
    id: 'l9', name: 'Koki Corn & Greens', description: 'Corn pudding with spinach.',
    image: '/meals/koki.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['Corn', 'spinach', 'palm oil', 'ginger', 'crayfish', 'salt'],
      method: ['Grind corn.', 'Mix with oil and spinach.', 'Steam in leaves.']
    },
    nutrition: { calories: 550, protein: 15, carbs: 75, fats: 20, fiber: 12, sugar: 8, sodium: 480 }
  },
  {
    id: 'l10', name: 'Koki Beans', description: 'Steamed bean cake.',
    image: '/meals/koki.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['Black-eyed peas', 'palm oil', 'chili', 'onion', 'salt', 'banana leaves'],
      method: ['Grind peeled beans.', 'Mix with oil and spices.', 'Steam in leaves.']
    },
    nutrition: { calories: 410, protein: 24, carbs: 48, fats: 18, fiber: 14, sugar: 4, sodium: 390 }
  },
  {
    id: 'l11', name: 'Koki Beans & Yam', description: 'Bean cake with yam.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Beans', 'palm oil', 'yam', 'onion', 'chili', 'salt'],
      method: ['Prepare koki.', 'Boil yam separately.', 'Serve together.']
    },
    nutrition: { calories: 710, protein: 26, carbs: 95, fats: 28, fiber: 15, sugar: 6, sodium: 420 }
  },
  {
    id: 'l12', name: 'Koki & Plantain', description: 'Bean cake with plantain.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Beans', 'palm oil', 'plantains', 'onion', 'chili'],
      method: ['Steam koki.', 'Boil plantains.', 'Serve together.']
    },
    nutrition: { calories: 680, protein: 28, carbs: 85, fats: 25, fiber: 18, sugar: 12, sodium: 410 }
  },
  {
    id: 'l13', name: 'Mbongo Tchobi', description: 'Black spicy fish stew.',
    image: '/meals/mbongo.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg Tilapia', '2 cups Mbongo spice', '3 tomatoes', '2 onions', 'ginger', 'garlic', 'pebe', 'alligator pepper', 'oil', 'salt', 'bouillon'],
      method: ['Roast barks, grind to black powder.', 'Grind tomatoes, onions, ginger, garlic.', 'Steam fish half-cooked.', 'Sauté paste in oil.', 'Add Mbongo spice.', 'Add fish and broth.', 'Simmer 15 minutes.']
    },
    nutrition: { calories: 550, protein: 40, carbs: 15, fats: 35, fiber: 6, sugar: 3, sodium: 480 }
  },
  {
    id: 'l14', name: 'Mbongo Tchobi Beef', description: 'Black beef stew.',
    image: '/meals/beef stew.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['Beef', 'Mbongo spice', 'tomatoes', 'onions', 'garlic', 'palm oil'],
      method: ['Grind spices.', 'Season beef with Mbongo.', 'Simmer until tender.']
    },
    nutrition: { calories: 650, protein: 42, carbs: 55, fats: 28, fiber: 7, sugar: 10, sodium: 590 }
  },
  {
    id: 'l15', name: 'Bongo\'o de Poisson', description: 'Black fish stew with plantain.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Fish', 'Mbongo spices', 'plantains', 'tomatoes', 'onions'],
      method: ['Coat fish in spice.', 'Stew until cooked.', 'Serve with boiled plantain.']
    },
    nutrition: { calories: 590, protein: 38, carbs: 65, fats: 22, fiber: 7, sugar: 12, sodium: 540 }
  },
  {
    id: 'l16', name: 'Poulet DG', description: 'Chicken & plantain one-pot.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 whole chicken', '6 ripe plantains', '3 tomatoes', '2 onions', '3 carrots', 'bell pepper', 'green beans', 'ginger', 'garlic', 'pebe', 'salt', 'bouillon', 'oil'],
      method: ['Season chicken, steam half-cooked.', 'Deep-fry chicken until golden.', 'Slice and fry plantains.', 'Sauté vegetables.', 'Combine all, simmer 10 minutes.']
    },
    nutrition: { calories: 800, protein: 45, carbs: 65, fats: 38, fiber: 7, sugar: 18, sodium: 710 }
  },
  {
    id: 'l17', name: 'Kondre', description: 'Ceremonial plantain stew.',
    image: '/meals/kondre.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['6 unripe plantains', '1 kg beef', '3 tomatoes', '2 onions', 'ginger', 'garlic', 'palm oil', 'crayfish', 'pebe', '2 cubes', 'salt'],
      method: ['Grind tomatoes, onions, ginger, garlic.', 'Season beef, steam half-cooked.', 'Boil spice paste with beef.', 'Add plantains, palm oil, cubes.', 'Simmer 40 minutes until thick.']
    },
    nutrition: { calories: 710, protein: 38, carbs: 82, fats: 24, fiber: 11, sugar: 14, sodium: 520 }
  },
  {
    id: 'l18', name: 'Ekwang', description: 'Grated cocoyam wraps.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg Malanga', '500g cocoyam leaves', 'ginger', 'garlic', '1 cup palm oil', '1 cup crayfish', 'smoked fish', 'cube', 'pebe', 'salt'],
      method: ['Wash, peel, grate cocoyams.', 'Whisk to sticky paste.', 'Soften leaves over flame.', 'Wrap paste in leaves.', 'Layer in pot on leaves.', 'Make broth with remaining ingredients.', 'Pour over bundles.', 'Steam 1.5-2 hours.']
    },
    nutrition: { calories: 780, protein: 22, carbs: 92, fats: 35, fiber: 14, sugar: 5, sodium: 540 }
  },
  {
    id: 'l19', name: 'Poisson Braisé', description: 'Grilled mackerel.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 large mackerel', 'garlic', 'ginger', 'pebe', 'alligator pepper', '2 onions', '2 cubes', '1 cup oil', 'salt'],
      method: ['Blend marinade ingredients.', 'Clean fish, make diagonal cuts.', 'Coat thoroughly, marinate 2 hours.', 'Grill over charcoal, basting continuously.', 'Serve with plantains and pepper sauce.']
    },
    nutrition: { calories: 480, protein: 42, carbs: 4, fats: 30, fiber: 1, sugar: 1, sodium: 790 }
  },
  {
    id: 'l20', name: 'Poisson Braisé Tilapia', description: 'Grilled tilapia.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['2 large tilapia', 'ginger', 'garlic', 'pebe', 'alligator pepper', 'onions', 'cubes', 'oil', 'salt'],
      method: ['Make spicy paste.', 'Marinate fish 2 hours.', 'Grill over charcoal.', 'Baste continuously.']
    },
    nutrition: { calories: 450, protein: 48, carbs: 5, fats: 22, fiber: 2, sugar: 1, sodium: 850 }
  },
  {
    id: 'l21', name: 'Ebeu', description: 'Fish & nightshade leaves.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['1 kg Tilapia', '6 bundles Zom leaves', '1 cup palm oil', '1 onion', 'salt'],
      method: ['Boil Zom leaves separately to remove tartness.', 'Season fish, steam half-cooked.', 'Layer leaves and fish.', 'Pour oil over.', 'Simmer 15 minutes.']
    },
    nutrition: { calories: 490, protein: 40, carbs: 12, fats: 32, fiber: 9, sugar: 4, sodium: 520 }
  },
  {
    id: 'l22', name: 'Ebom', description: 'Wrapped fish.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Fresh Tilapia', 'tomatoes', 'onions', 'ginger', 'garlic', 'pebe', 'alligator pepper', 'hiomi bark', 'oil', 'banana leaves'],
      method: ['Roast barks, grind to powder.', 'Grind tomatoes, onions, ginger, garlic.', 'Season fish with spice and paste.', 'Wrap in banana leaves.', 'Steam 45 minutes.']
    },
    nutrition: { calories: 410, protein: 38, carbs: 12, fats: 25, fiber: 4, sugar: 2, sodium: 480 }
  },
  {
    id: 'l23', name: 'Katt-Katt', description: 'West Region corn mash.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Fresh corn', 'greens', 'palm oil', 'meat', 'crayfish', 'onions'],
      method: ['Fry ripe plantains.', 'Sauté gizzards with peppers.', 'Combine.']
    },
    nutrition: { calories: 610, protein: 20, carbs: 85, fats: 18, fiber: 15, sugar: 5, sodium: 440 }
  },
  {
    id: 'l24', name: 'Katte Katte', description: 'Grassfields stew.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Beef', 'mackerel', 'garlic', 'huckleberry leaves', 'Candawan', 'pebe', 'palm oil'],
      method: ['Steam beef half-cooked.', 'Boil leaves with Candawan.', 'Fry Candawan spices.', 'Sauté Egusi paste.', 'Mix all together.']
    },
    nutrition: { calories: 540, protein: 32, carbs: 20, fats: 38, fiber: 9, sugar: 3, sodium: 410 }
  },
  {
    id: 'l25', name: 'Kedjenou', description: 'Slow-cooked chicken stew.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Chicken', 'tomato', 'onion', 'eggplant', 'garlic', 'ginger', 'spices'],
      method: ['Layer chicken and vegetables.', 'Seal pot tightly.', 'Slow cook without water.', 'Shake pot occasionally.']
    },
    nutrition: { calories: 580, protein: 48, carbs: 18, fats: 30, fiber: 5, sugar: 8, sodium: 490 }
  },
  {
    id: 'l26', name: 'Kion', description: 'Forest soup with fish.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Fish', 'spices', 'tubers', 'oil', 'smoked fish'],
      method: ['Steam fish in spices.', 'Serve with boiled tubers.']
    },
    nutrition: { calories: 490, protein: 42, carbs: 45, fats: 15, fiber: 6, sugar: 3, sodium: 440 }
  },
  {
    id: 'l27', name: 'Lamsi', description: 'Grassfields soup.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Jute leaves', 'beef', 'mackerel', 'garlic', 'spinach', 'crayfish', 'ginger', 'smoked fish', 'pebe', 'palm oil'],
      method: ['Grate cocoyams.', 'Boil peanuts, blend.', 'Steam beef.', 'Sauté peanut paste.', 'Add meat and leaves.']
    },
    nutrition: { calories: 520, protein: 35, carbs: 15, fats: 40, fiber: 11, sugar: 2, sodium: 480 }
  },
  {
    id: 'l28', name: 'Mbol', description: 'Eastern region leaf stew.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Mbol leaves', 'peanuts', 'meat', 'palm oil', 'crayfish'],
      method: ['Grind peanuts.', 'Cook leaves.', 'Mix with meat and paste.']
    },
    nutrition: { calories: 620, protein: 30, carbs: 25, fats: 45, fiber: 8, sugar: 3, sodium: 410 }
  },
  {
    id: 'l29', name: 'Mbol with Beef', description: 'Forest leaves with beef.',
    image: '/meals/beef stew.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['Mbol leaves', 'beef', 'peanut paste', 'onions', 'palm oil'],
      method: ['Cook leaves.', 'Add beef and peanut paste.', 'Simmer until oil rises.']
    },
    nutrition: { calories: 650, protein: 38, carbs: 25, fats: 48, fiber: 8, sugar: 3, sodium: 520 }
  },
  {
    id: 'l30', name: 'Nnam Owondo', description: 'Wrapped groundnut cake.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Egusi', 'garlic', 'spinach', 'smoked fish', 'crayfish', 'pebe', 'banana leaves'],
      method: ['Mash raw melon seeds.', 'Season.', 'Wrap in leaves.', 'Steam.']
    },
    nutrition: { calories: 580, protein: 24, carbs: 18, fats: 48, fiber: 6, sugar: 3, sodium: 410 }
  },
  {
    id: 'l31', name: 'Nten', description: 'Vegetarian mash.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Grated cocoyam', 'huckleberry leaves', 'garlic', 'ginger', 'pebe', 'salt', 'banana leaves'],
      method: ['Grate cocoyams.', 'Stir paste into boiling water.', 'Whisk for koki.', 'Steam portions in leaves.', 'Serve with boiled leaves.']
    },
    nutrition: { calories: 580, protein: 18, carbs: 82, fats: 24, fiber: 12, sugar: 4, sodium: 410 }
  },
  {
    id: 'l32', name: 'Okok (Salty)', description: 'Savory gnetum leaves.',
    image: '/meals/okok.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Okok leaves', 'Egusi', 'palm oil', 'onion', 'ginger-garlic paste', 'crayfish', 'smoked fish', 'salt'],
      method: ['Soak leaves 1 hour.', 'Wash, drain.', 'Boil until tender.', 'Mix ground Egusi.', 'Add to leaves.', 'Cook Egusi fufu.']
    },
    nutrition: { calories: 750, protein: 25, carbs: 45, fats: 48, fiber: 11, sugar: 5, sodium: 520 }
  },
  {
    id: 'l33', name: 'Okok (Sweet)', description: 'Sweet gnetum leaves.',
    image: '/meals/okok.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Okok leaves', 'Egusi', 'palm oil', 'sugar', 'onion', 'crayfish', 'smoked fish'],
      method: ['Soak leaves.', 'Boil until tender.', 'Add Egusi mix.', 'Add sugar.', 'Cook.']
    },
    nutrition: { calories: 890, protein: 20, carbs: 70, fats: 55, fiber: 11, sugar: 45, sodium: 210 }
  },
  {
    id: 'l34', name: 'Okok with Cassava', description: 'Forest leaves with cassava.',
    image: '/meals/Cassava Fries (Mandioca Frita) - Crumb-Snatched.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Okok leaves', 'peanuts', 'palm oil', 'cassava paste', 'crayfish'],
      method: ['Prepare Okok.', 'Stir cassava paste into boiling water.', 'Serve together.']
    },
    nutrition: { calories: 820, protein: 22, carbs: 95, fats: 45, fiber: 14, sugar: 25, sodium: 310 }
  },
  {
    id: 'l35', name: 'Okra Soup', description: 'Slimy okra and meat stew.',
    image: '/meals/Chicken-Peppersoup.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['Okra', 'palm oil', 'beef', 'canda', 'fish', 'crayfish', 'onions'],
      method: ['Chop okra.', 'Boil meats.', 'Mix okra into broth with oil.']
    },
    nutrition: { calories: 600, protein: 45, carbs: 20, fats: 38, fiber: 10, sugar: 4, sodium: 690 }
  },
  {
    id: 'l36', name: 'Okro Soup (Dry)', description: 'Dried okra stew.',
    image: '/meals/okro soup.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Dried okra', 'beef', 'canda', 'palm oil', 'crayfish', 'fish'],
      method: ['Whisk dried okra powder into meat broth.', 'Add oil.', 'Cook until slimy.']
    },
    nutrition: { calories: 520, protein: 42, carbs: 12, fats: 35, fiber: 11, sugar: 3, sodium: 610 }
  },
  {
    id: 'l37', name: 'Okra & Pounded Yam', description: 'Slimy soup with yam.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Okra', 'beef', 'fish', 'yam', 'palm oil', 'crayfish'],
      method: ['Prepare okra soup.', 'Pound boiled yam.', 'Serve together.']
    },
    nutrition: { calories: 780, protein: 38, carbs: 95, fats: 25, fiber: 12, sugar: 4, sodium: 690 }
  },
  {
    id: 'l38', name: 'Okra & Fufu Corn', description: 'Corn fufu with okra.',
    image: '/meals/Coal roasted Corn.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Corn flour', 'okra', 'beef', 'canda', 'palm oil', 'crayfish'],
      method: ['Cook corn fufu.', 'Prepare okra with beef.', 'Serve together.']
    },
    nutrition: { calories: 680, protein: 40, carbs: 88, fats: 22, fiber: 12, sugar: 4, sodium: 710 }
  },
  {
    id: 'l39', name: 'Egusi & Pounded Yam', description: 'Melon seed soup with yam.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Egusi', 'spinach', 'beef', 'yam', 'palm oil', 'crayfish', 'smoked fish'],
      method: ['Grind egusi.', 'Cook with spinach and meat.', 'Pound boiled yam.', 'Serve together.']
    },
    nutrition: { calories: 820, protein: 40, carbs: 90, fats: 32, fiber: 8, sugar: 5, sodium: 610 }
  },
  {
    id: 'l40', name: 'Egusi & Boiled Yam', description: 'Melon soup with yam slices.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Egusi', 'spinach', 'yam', 'beef', 'palm oil', 'crayfish'],
      method: ['Prepare egusi soup.', 'Boil yam slices.', 'Serve together.']
    },
    nutrition: { calories: 750, protein: 35, carbs: 88, fats: 32, fiber: 8, sugar: 5, sodium: 610 }
  },
  {
    id: 'l41', name: 'Egusi with Okra', description: 'Combined melon and okra soup.',
    image: '/meals/Egusi Soup.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Egusi', 'okra', 'beef', 'fish', 'spinach', 'palm oil', 'crayfish'],
      method: ['Cook egusi sauce.', 'Stir in chopped okra.', 'Add meat.', 'Simmer.']
    },
    nutrition: { calories: 780, protein: 40, carbs: 25, fats: 58, fiber: 9, sugar: 4, sodium: 680 }
  },
  {
    id: 'l42', name: 'Njama Njama & Yam', description: 'Huckleberry leaves with yam.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Huckleberry leaves', 'yam', 'onions', 'palm oil', 'crayfish'],
      method: ['Fry leaves in oil.', 'Serve with pounded yam.']
    },
    nutrition: { calories: 670, protein: 18, carbs: 105, fats: 22, fiber: 11, sugar: 5, sodium: 480 }
  },
  {
    id: 'l43', name: 'Njangsa Fish Soup', description: 'Spicy nutty fish soup.',
    image: '/meals/fishstew.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Fish', 'Njangsa', 'ginger', 'garlic', 'crayfish', 'pebe', 'palm oil'],
      method: ['Grind njangsa.', 'Add to fish broth.', 'Simmer.']
    },
    nutrition: { calories: 380, protein: 38, carbs: 12, fats: 20, fiber: 3, sugar: 2, sodium: 610 }
  },
  {
    id: 'l44', name: 'Kundi', description: 'Dried greens stew.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Dried greens', 'peanuts', 'fish', 'beef', 'palm oil', 'crayfish'],
      method: ['Rehydrate greens.', 'Sauté with peanut paste.', 'Add fish.']
    },
    nutrition: { calories: 410, protein: 28, carbs: 15, fats: 30, fiber: 12, sugar: 2, sodium: 520 }
  },
  {
    id: 'l45', name: 'Kwacoco & Banga', description: 'Cocoyam with palm soup.',
    image: '/meals/kwacoco bible.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['Cocoyam', 'palm nut', 'smoked fish', 'crayfish', 'ginger'],
      method: ['Steam cocoyam.', 'Extract palm juice.', 'Boil with fish.']
    },
    nutrition: { calories: 820, protein: 35, carbs: 90, fats: 40, fiber: 10, sugar: 6, sodium: 620 }
  },
  {
    id: 'l46', name: 'Banga Soup & Starch', description: 'Palm fruit soup with cassava starch.',
    image: '/meals/Chicken-Peppersoup.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['Palm nut', 'fish', 'meat', 'cassava starch', 'crayfish', 'spices'],
      method: ['Extract palm cream.', 'Boil with meats.', 'Serve with starch.']
    },
    nutrition: { calories: 890, protein: 32, carbs: 110, fats: 48, fiber: 7, sugar: 8, sodium: 720 }
  },
  {
    id: 'l47', name: 'Cornchaff', description: 'Corn and beans with meat.',
    image: '/meals/Coal roasted Corn.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Corn', 'beans', 'palm oil', 'beef', 'onions', 'crayfish'],
      method: ['Slow cook corn and beans.', 'Add oil, spices, and meat.']
    },
    nutrition: { calories: 680, protein: 32, carbs: 85, fats: 24, fiber: 22, sugar: 4, sodium: 550 }
  },
  {
    id: 'l48', name: 'Cornchaff (No Meat)', description: 'Vegan corn and beans.',
    image: '/meals/Coal roasted Corn.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Corn', 'beans', 'palm oil', 'onions', 'salt'],
      method: ['Cook corn and beans.', 'Add oil and onions.']
    },
    nutrition: { calories: 540, protein: 18, carbs: 92, fats: 12, fiber: 22, sugar: 5, sodium: 380 }
  },
  {
    id: 'l49', name: 'Corn & Beans (Light)', description: 'Stewed corn and beans.',
    image: '/meals/beans.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Corn', 'beans', 'onions', 'salt'],
      method: ['Boil corn and beans.', 'Minimal palm oil.']
    },
    nutrition: { calories: 380, protein: 14, carbs: 68, fats: 6, fiber: 15, sugar: 4, sodium: 280 }
  },
  {
    id: 'l50', name: 'Sanga', description: 'Fresh corn and greens.',
    image: '/meals/Le sanga recette camerounaise - Alice Pégie Cuisine.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Fresh corn', 'cassava leaves', 'palm pulp', 'onions', 'crayfish'],
      method: ['Boil corn and leaves.', 'Add palm pulp.', 'Simmer until creamy.']
    },
    nutrition: { calories: 520, protein: 12, carbs: 95, fats: 18, fiber: 13, sugar: 22, sodium: 90 }
  },
  {
    id: 'l51', name: 'Sanga (Fresh Corn)', description: 'Maize and leaf pudding.',
    image: '/meals/Coal roasted Corn.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Fresh corn', 'cassava leaves', 'palm oil', 'crayfish'],
      method: ['Grind corn.', 'Mix with leaves.', 'Steam.']
    },
    nutrition: { calories: 510, protein: 12, carbs: 95, fats: 15, fiber: 13, sugar: 24, sodium: 85 }
  },
  {
    id: 'l52', name: 'Cassava Leaf Soup', description: 'Sautéed cassava leaves.',
    image: '/meals/Cassava Fries (Mandioca Frita) - Crumb-Snatched.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Cassava leaves', 'peanuts', 'fish', 'palm oil', 'crayfish'],
      method: ['Grind leaves.', 'Boil with peanuts and fish.']
    },
    nutrition: { calories: 540, protein: 22, carbs: 18, fats: 45, fiber: 12, sugar: 2, sodium: 480 }
  },
  {
    id: 'l53', name: 'Zom', description: 'Nightshade leaves & nuts.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Zom leaves', 'peanuts', 'meat', 'palm oil', 'onions'],
      method: ['Boil leaves.', 'Add peanut paste.', 'Simmer until oil rises.']
    },
    nutrition: { calories: 650, protein: 35, carbs: 20, fats: 48, fiber: 10, sugar: 4, sodium: 520 }
  },
  {
    id: 'l54', name: 'Zom with Meat', description: 'Nightshade leaves and beef.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Zom leaves', 'beef', 'palm oil', 'onions', 'crayfish'],
      method: ['Sauté onions.', 'Add meat and leaves.', 'Simmer until oil rises.']
    },
    nutrition: { calories: 680, protein: 38, carbs: 18, fats: 52, fiber: 10, sugar: 3, sodium: 540 }
  },
  {
    id: 'l55', name: 'Folere Stew (Bayam Sellam)', description: 'Hibiscus leaves with peanuts.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Folere leaves', 'peanuts', 'smoked fish', 'onions', 'palm oil'],
      method: ['Boil leaves to remove tartness.', 'Mix with peanut paste.', 'Add fish.']
    },
    nutrition: { calories: 480, protein: 24, carbs: 15, fats: 38, fiber: 9, sugar: 4, sodium: 420 }
  },
  {
    id: 'l56', name: 'Folere Lunch', description: 'Hibiscus leaf stew.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Folere leaves', 'peanuts', 'fish', 'onions', 'palm oil'],
      method: ['Boil leaves.', 'Mix with peanuts and fish.', 'Serve.']
    },
    nutrition: { calories: 560, protein: 25, carbs: 30, fats: 40, fiber: 10, sugar: 6, sodium: 350 }
  },
  {
    id: 'l57', name: 'Mbakara', description: 'Coastal cocoyam mash.',
    image: '/meals/akarasauce.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Malanga', 'ginger', 'pebe', 'crayfish', 'palm oil', 'smoked fish'],
      method: ['Grate cocoyam.', 'Stir into boiling water.', 'Whisk for koki.', 'Steam portions.', 'Sauté with spices.']
    },
    nutrition: { calories: 590, protein: 15, carbs: 88, fats: 22, fiber: 11, sugar: 5, sodium: 320 }
  },
  {
    id: 'l58', name: 'Achu (Vegetarian)', description: 'Taro and yellow oil soup.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Taro', 'palm oil', 'canwa', 'mushroom', 'spices'],
      method: ['Pound taro.', 'Serve with yellow soup using mushrooms.']
    },
    nutrition: { calories: 590, protein: 12, carbs: 110, fats: 22, fiber: 12, sugar: 4, sodium: 710 }
  },
  {
    id: 'l59', name: 'Akwadu', description: 'Baked plantain & coconut.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Plantains', 'coconut milk', 'honey'],
      method: ['Bake plantains in coconut milk.', 'Mash.', 'Serve.']
    },
    nutrition: { calories: 580, protein: 10, carbs: 95, fats: 20, fiber: 9, sugar: 28, sodium: 110 }
  },
  {
    id: 'l60', name: 'Banana Fufu', description: 'Steamed green banana dough.',
    image: '/meals/how to make fufu.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Green bananas', 'water'],
      method: ['Boil bananas.', 'Pound until smooth.', 'Serve with soup.']
    },
    nutrition: { calories: 580, protein: 6, carbs: 135, fats: 2, fiber: 10, sugar: 25, sodium: 15 }
  },
  {
    id: 'l61', name: 'Bayam Sellam Stew', description: 'Spiced spinach stew.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Spinach', 'smoked fish', 'tomato', 'onions', 'palm oil'],
      method: ['Sauté veggies.', 'Add fish and spices.', 'Simmer.']
    },
    nutrition: { calories: 450, protein: 28, carbs: 20, fats: 30, fiber: 9, sugar: 4, sodium: 480 }
  },
  {
    id: 'l62', name: 'Beef Porridge Macabo', description: 'Grated macabo with beef.',
    image: '/meals/bananaporridge.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Macabo', 'beef', 'palm oil', 'onions', 'crayfish'],
      method: ['Boil beef.', 'Add grated macabo and oil.', 'Stir until thick.']
    },
    nutrition: { calories: 540, protein: 32, carbs: 75, fats: 18, fiber: 12, sugar: 5, sodium: 610 }
  },
  {
    id: 'l63', name: 'Bitosso', description: 'Meat and groundnut stew.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Meat', 'local leaves', 'peanuts', 'onions', 'palm oil'],
      method: ['Boil meat.', 'Add leaves and peanut paste.', 'Cook.']
    },
    nutrition: { calories: 640, protein: 40, carbs: 20, fats: 42, fiber: 9, sugar: 3, sodium: 410 }
  },
  {
    id: 'l64', name: 'Boiled Plantain & Stew', description: 'Starchy plantain lunch.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Plantain', 'tomato', 'meat stew', 'onions'],
      method: ['Boil plantains.', 'Serve with meat stew.']
    },
    nutrition: { calories: 560, protein: 18, carbs: 92, fats: 15, fiber: 9, sugar: 18, sodium: 480 }
  },
  {
    id: 'l65', name: 'Bongo\'o de Viande', description: 'Black beef stew with plantain.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Beef', 'Mbongo spice', 'plantain', 'tomatoes', 'onions'],
      method: ['Cook beef in black spice sauce.', 'Serve with plantain.']
    },
    nutrition: { calories: 650, protein: 42, carbs: 55, fats: 28, fiber: 7, sugar: 10, sodium: 590 }
  },
  {
    id: 'l66', name: 'Cassava & Fried Fish', description: 'Coastal classic lunch.',
    image: '/meals/fishstew.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Cassava', 'white fish', 'oil', 'onions', 'salt'],
      method: ['Boil cassava.', 'Fry fish.', 'Serve together.']
    },
    nutrition: { calories: 540, protein: 35, carbs: 85, fats: 15, fiber: 10, sugar: 4, sodium: 520 }
  },
  {
    id: 'l67', name: 'Cassava & Peanut Dip', description: 'Boiled tuber with nut sauce.',
    image: '/meals/Cassava Fries (Mandioca Frita) - Crumb-Snatched.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Cassava', 'peanut butter', 'chili', 'garlic', 'salt'],
      method: ['Boil cassava.', 'Make spicy peanut dip.', 'Serve together.']
    },
    nutrition: { calories: 520, protein: 12, carbs: 85, fats: 18, fiber: 11, sugar: 5, sodium: 210 }
  },
  {
    id: 'l68', name: 'Coconut Rice', description: 'Rice in coconut milk.',
    image: '/meals/Coconut Fried Rice With Extra veggies - Chef Lolas Kitchen.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Rice', 'coconut milk', 'shrimp', 'ginger', 'salt'],
      method: ['Boil rice in coconut milk.', 'Add dried shrimp.']
    },
    nutrition: { calories: 610, protein: 12, carbs: 85, fats: 25, fiber: 4, sugar: 6, sodium: 420 }
  },
  {
    id: 'l69', name: 'Corn Fufu & Cabbage', description: 'Corn dough with veggie stir-fry.',
    image: '/meals/Coal roasted Corn.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Corn flour', 'cabbage', 'fish', 'carrots', 'onions', 'oil'],
      method: ['Cook corn fufu.', 'Sauté cabbage with vegetables.', 'Add fish.', 'Serve together.']
    },
    nutrition: { calories: 580, protein: 22, carbs: 92, fats: 15, fiber: 12, sugar: 5, sodium: 440 }
  },
  {
    id: 'l70', name: 'Corn Fufu & Okra (Small)', description: 'Lighter corn fufu version.',
    image: '/meals/Coal roasted Corn.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Corn flour', 'okra', 'smoked fish', 'crayfish', 'palm oil'],
      method: ['Make corn fufu.', 'Prepare light okra soup.', 'Serve together.']
    },
    nutrition: { calories: 490, protein: 22, carbs: 88, fats: 12, fiber: 10, sugar: 4, sodium: 520 }
  },
  {
    id: 'l71', name: 'Couscous & Arachide', description: 'Cassava fufu & peanuts.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Cassava flour', 'peanuts', 'beef', 'tomatoes', 'onions'],
      method: ['Cook cassava fufu.', 'Make peanut stew with beef.']
    },
    nutrition: { calories: 790, protein: 35, carbs: 90, fats: 38, fiber: 8, sugar: 6, sodium: 640 }
  },
  {
    id: 'l72', name: 'Couscous & Njama', description: 'Corn fufu and greens.',
    image: '/meals/Njama Njama and FuFu.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Corn flour', 'huckleberry leaves', 'chicken', 'tomatoes', 'onions'],
      method: ['Cook corn fufu.', 'Sauté leaves with tomatoes and chicken.']
    },
    nutrition: { calories: 650, protein: 30, carbs: 88, fats: 20, fiber: 9, sugar: 3, sodium: 440 }
  },
  {
    id: 'l73', name: 'Couscous de Manioc', description: 'Fermented cassava fufu.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Cassava flour', 'water'],
      method: ['Stir flour into boiling water.', 'Beat until translucent.']
    },
    nutrition: { calories: 720, protein: 4, carbs: 165, fats: 2, fiber: 10, sugar: 1, sodium: 25 }
  },
  {
    id: 'l74', name: 'Couscous de Mil & Lalo', description: 'Millet fufu with jute leaves.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Millet flour', 'jute leaves', 'dried fish', 'beef', 'onions', 'palm oil'],
      method: ['Sauté beef and onions.', 'Add shredded leaves and oil.', 'Slow cook.', 'Prepare millet fufu separately.']
    },
    nutrition: { calories: 680, protein: 32, carbs: 95, fats: 18, fiber: 12, sugar: 3, sodium: 610 }
  },
  {
    id: 'l75', name: 'Cow Foot Soup', description: 'Gelatinous spicy hoof soup.',
    image: '/meals/Chicken-Peppersoup.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['Cow foot', 'pepper soup spices', 'onions', 'garlic', 'ginger'],
      method: ['Pressure cook cow foot with spices.', 'Cook until falling off bone.']
    },
    nutrition: { calories: 650, protein: 52, carbs: 5, fats: 48, fiber: 0, sugar: 1, sodium: 890 }
  },
  {
    id: 'l76', name: 'Cow Skin (Canda) Stew', description: 'Spicy stewed cow skin.',
    image: '/meals/beef stew.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['Canda', 'tomato', 'onions', 'oil', 'crayfish', 'pepper'],
      method: ['Boil cow skin until soft.', 'Sauté with tomatoes and spices.']
    },
    nutrition: { calories: 480, protein: 45, carbs: 5, fats: 32, fiber: 0, sugar: 1, sodium: 780 }
  },
  {
    id: 'l77', name: 'Djouka', description: 'Fonio and peanuts.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Fonio', 'peanuts', 'dried fish', 'onions', 'spices'],
      method: ['Steam fonio.', 'Mix with roasted peanut paste.']
    },
    nutrition: { calories: 520, protein: 22, carbs: 70, fats: 20, fiber: 9, sugar: 4, sodium: 450 }
  },
  {
    id: 'l78', name: 'Eba & Egusi', description: 'Garri and melon seed soup.',
    image: '/meals/Egusi Soup.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Garri', 'egusi', 'spinach', 'meat', 'palm oil', 'crayfish'],
      method: ['Mix garri with hot water.', 'Serve with egusi soup.']
    },
    nutrition: { calories: 780, protein: 38, carbs: 75, fats: 40, fiber: 7, sugar: 4, sodium: 710 }
  },
  {
    id: 'l79', name: 'Egusi Pudding', description: 'Steamed melon seed cake.',
    image: '/meals/Egusi Soup.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Egusi', 'eggs', 'smoked fish', 'spinach', 'crayfish', 'pebe'],
      method: ['Grind egusi.', 'Mix with eggs and fish.', 'Steam in leaves.']
    },
    nutrition: { calories: 420, protein: 25, carbs: 12, fats: 32, fiber: 3, sugar: 2, sodium: 380 }
  },
  {
    id: 'l80', name: 'Fried Rice & Chicken', description: 'Veggie rice with chicken.',
    image: '/meals/friedrice.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['Rice', 'carrots', 'peas', 'chicken', 'onions', 'soy sauce'],
      method: ['Fry veggies and rice.', 'Serve with grilled chicken.']
    },
    nutrition: { calories: 720, protein: 35, carbs: 85, fats: 25, fiber: 5, sugar: 4, sodium: 750 }
  },
  {
    id: 'l81', name: 'Fufu & Groundnut', description: 'Cassava fufu & peanut soup.',
    image: '/meals/groundnut.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Cassava fufu', 'peanuts', 'chicken', 'tomatoes', 'onions'],
      method: ['Make peanut sauce.', 'Add chicken.', 'Serve with fufu.']
    },
    nutrition: { calories: 770, protein: 38, carbs: 82, fats: 35, fiber: 9, sugar: 8, sodium: 590 }
  },
  {
    id: 'l82', name: 'Fufu Banana & Okra', description: 'Plantain fufu and okra.',
    image: '/meals/how to make fufu.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Plantains', 'okra', 'fish', 'palm oil', 'crayfish'],
      method: ['Pound plantains.', 'Serve with okra and fish stew.']
    },
    nutrition: { calories: 630, protein: 32, carbs: 85, fats: 20, fiber: 12, sugar: 12, sodium: 580 }
  },
  {
    id: 'l83', name: 'Fufu de Riz & Sauce', description: 'Rice fufu and tomato stew.',
    image: '/meals/how to make fufu.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Rice flour', 'tomato', 'beef', 'onions', 'palm oil'],
      method: ['Make rice fufu.', 'Prepare tomato stew with beef.', 'Serve together.']
    },
    nutrition: { calories: 650, protein: 28, carbs: 105, fats: 12, fiber: 8, sugar: 2, sodium: 540 }
  },
  {
    id: 'l84', name: 'Fufu Riz & Lalo', description: 'Rice fufu & jute leaf.',
    image: '/meals/how to make fufu.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Rice flour', 'jute leaves', 'fish', 'crayfish', 'palm oil'],
      method: ['Cook rice fufu.', 'Prepare slimy Lalo soup with fish.']
    },
    nutrition: { calories: 610, protein: 32, carbs: 80, fats: 18, fiber: 10, sugar: 2, sodium: 630 }
  },
  {
    id: 'l85', name: 'Garri & Fried Fish', description: 'Cassava with crunchy fish.',
    image: '/meals/fishstew.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Garri', 'fish', 'onions', 'tomatoes', 'oil', 'salt'],
      method: ['Soak garri.', 'Fry fish.', 'Serve together with vegetables.']
    },
    nutrition: { calories: 450, protein: 28, carbs: 60, fats: 15, fiber: 4, sugar: 2, sodium: 580 }
  },
  {
    id: 'l86', name: 'Grilled Fish & Dodo', description: 'Tilapia and fried plantain.',
    image: '/meals/fishstew.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Tilapia', 'plantain', 'garlic', 'ginger', 'oil', 'spices'],
      method: ['Grill marinated fish.', 'Serve with fried plantains.']
    },
    nutrition: { calories: 660, protein: 45, carbs: 55, fats: 25, fiber: 7, sugar: 15, sodium: 690 }
  },
  {
    id: 'l87', name: 'Jollof Rice', description: 'Spiced tomato rice.',
    image: '/meals/jellof rice.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['Rice', 'tomato', 'beef', 'garlic', 'ginger', 'onions', 'spices'],
      method: ['Parboil rice.', 'Create tomato base.', 'Cook rice in broth.']
    },
    nutrition: { calories: 650, protein: 25, carbs: 95, fats: 15, fiber: 4, sugar: 6, sodium: 680 }
  },
  {
    id: 'l88', name: 'Mashed Beans (Njama)', description: 'Savory bean and leaf mash.',
    image: '/meals/beans.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Beans', 'greens', 'palm oil', 'onions', 'crayfish'],
      method: ['Mash boiled beans.', 'Sauté with greens and oil.']
    },
    nutrition: { calories: 520, protein: 22, carbs: 82, fats: 14, fiber: 22, sugar: 4, sodium: 480 }
  },
  {
    id: 'l89', name: 'Mashed Corn & Beans', description: 'Savory grain mash.',
    image: '/meals/beans.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Corn', 'beans', 'palm oil', 'onions', 'crayfish'],
      method: ['Cook corn and beans.', 'Mash together.', 'Add oil and spices.']
    },
    nutrition: { calories: 590, protein: 20, carbs: 88, fats: 18, fiber: 20, sugar: 4, sodium: 390 }
  },
  {
    id: 'l90', name: 'Miondo & Fried Fish', description: 'Cassava sticks with fish.',
    image: '/meals/fishstew.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Miondo', 'white fish', 'garlic', 'onions', 'oil'],
      method: ['Steam miondo.', 'Fry fish.', 'Serve together.']
    },
    nutrition: { calories: 540, protein: 38, carbs: 45, fats: 22, fiber: 4, sugar: 2, sodium: 620 }
  },
  {
    id: 'l91', name: 'Palm Nut Soup (Banga)', description: 'Rich palm fruit extract.',
    image: '/meals/Chicken-Peppersoup.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['Palm nuts', 'smoked fish', 'meat', 'crayfish', 'spices'],
      method: ['Extract palm cream.', 'Boil with meats.', 'Simmer with spices.']
    },
    nutrition: { calories: 820, protein: 30, carbs: 25, fats: 75, fiber: 8, sugar: 6, sodium: 680 }
  },
  {
    id: 'l92', name: 'Plantain & Fish Stew', description: 'Starchy fish lunch.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Plantain', 'tilapia', 'tomato', 'onions', 'palm oil'],
      method: ['Cook fish stew.', 'Boil plantains.', 'Serve together.']
    },
    nutrition: { calories: 680, protein: 35, carbs: 88, fats: 25, fiber: 9, sugar: 18, sodium: 620 }
  },
  {
    id: 'l93', name: 'Pounded Macabo', description: 'Smooth pounded cocoyam fufu.',
    image: '/meals/Comment préparer le Macabo malaxé au ndolè_ how to cook cocoyam porridge and bitterleaves.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Macabo', 'water'],
      method: ['Boil macabo.', 'Pound in mortar until smooth.']
    },
    nutrition: { calories: 620, protein: 10, carbs: 128, fats: 4, fiber: 14, sugar: 5, sodium: 35 }
  },
  {
    id: 'l94', name: 'Pounded Yam & Egusi', description: 'Heavy celebration meal.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Yam', 'egusi', 'beef', 'spinach', 'palm oil', 'crayfish'],
      method: ['Pound boiled yam.', 'Prepare egusi soup.', 'Serve together.']
    },
    nutrition: { calories: 850, protein: 42, carbs: 95, fats: 35, fiber: 8, sugar: 5, sodium: 640 }
  },
  {
    id: 'l95', name: 'Rice & Beans (Coconut)', description: 'Coconut milk rice and beans.',
    image: '/meals/beans.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Rice', 'beans', 'coconut milk', 'onions', 'garlic'],
      method: ['Boil beans.', 'Cook rice in coconut milk.', 'Combine.']
    },
    nutrition: { calories: 630, protein: 18, carbs: 92, fats: 25, fiber: 12, sugar: 6, sodium: 440 }
  },
  {
    id: 'l96', name: 'Rice & Tomato Stew', description: 'Beef stew and white rice.',
    image: '/meals/beef stew.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['Rice', 'beef', 'tomato', 'onions', 'oil', 'spices'],
      method: ['Boil rice.', 'Make fried tomato and beef sauce.', 'Serve together.']
    },
    nutrition: { calories: 640, protein: 30, carbs: 90, fats: 18, fiber: 4, sugar: 5, sodium: 690 }
  },
  {
    id: 'l97', name: 'Rice and Beans', description: 'Stir-fry rice and kidney beans.',
    image: '/meals/beans.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Rice', 'beans', 'onions', 'oil', 'crayfish'],
      method: ['Sauté onions.', 'Toss in cooked rice and beans.', 'Stir-fry.']
    },
    nutrition: { calories: 480, protein: 12, carbs: 82, fats: 10, fiber: 9, sugar: 2, sodium: 440 }
  },
  {
    id: 'l98', name: 'Rice Fufu & Okra', description: 'Rice dough and slimy soup.',
    image: '/meals/how to make fufu.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Rice flour', 'okra', 'fish', 'crayfish', 'palm oil'],
      method: ['Make rice fufu.', 'Prepare okra soup.', 'Serve together.']
    },
    nutrition: { calories: 610, protein: 28, carbs: 95, fats: 15, fiber: 10, sugar: 2, sodium: 580 }
  },
  {
    id: 'l99', name: 'Sauce Jaune & Taro', description: 'Yellow soup with taro.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Taro', 'palm oil', 'canwa', 'beef', 'spices'],
      method: ['Boil and pound taro.', 'Create yellow oil soup.', 'Serve together.']
    },
    nutrition: { calories: 690, protein: 28, carbs: 110, fats: 25, fiber: 9, sugar: 4, sodium: 780 }
  },
  {
    id: 'l100', name: 'Tapsi', description: 'Beef and vegetable stew.',
    image: '/meals/Food.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Beef', 'spinach', 'peanuts', 'onions', 'palm oil'],
      method: ['Boil beef.', 'Add ground peanuts and spinach.', 'Simmer.']
    },
    nutrition: { calories: 610, protein: 42, carbs: 15, fats: 40, fiber: 10, sugar: 2, sodium: 420 }
  },
  {
    id: 'l101', name: 'Waterfufu & Okra', description: 'Cassava fufu with okra soup.',
    image: '/meals/how to make fufu.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Waterfufu', 'okra', 'beef', 'crayfish', 'palm oil'],
      method: ['Boil waterfufu.', 'Prepare thick beef-okra stew.', 'Serve together.']
    },
    nutrition: { calories: 680, protein: 35, carbs: 85, fats: 28, fiber: 12, sugar: 2, sodium: 540 }
  },
  {
    id: 'l102', name: 'White Bean Porridge', description: 'Creamy white bean stew.',
    image: '/meals/bananaporridge.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['White beans', 'palm oil', 'onions', 'fish', 'crayfish'],
      method: ['Boil beans until soft.', 'Add oil and onions.', 'Mash slightly.']
    },
    nutrition: { calories: 580, protein: 24, carbs: 88, fats: 15, fiber: 18, sugar: 6, sodium: 410 }
  },
  {
    id: 'l103', name: 'White Beans & Rice', description: 'Savory bean stew and rice.',
    image: '/meals/beans.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['White beans', 'rice', 'tomato', 'onions', 'oil'],
      method: ['Boil beans.', 'Sauté with tomato.', 'Serve over rice.']
    },
    nutrition: { calories: 620, protein: 20, carbs: 95, fats: 15, fiber: 14, sugar: 4, sodium: 520 }
  },
  {
    id: 'l104', name: 'Yam & Beans (One Pot)', description: 'Yam and bean porridge.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Yam', 'brown beans', 'palm oil', 'onions', 'crayfish'],
      method: ['Cook beans.', 'Add yam cubes and oil.', 'Simmer together.']
    },
    nutrition: { calories: 610, protein: 22, carbs: 95, fats: 18, fiber: 16, sugar: 5, sodium: 420 }
  },
  {
    id: 'l105', name: 'Yam Stew', description: 'Tomato meat yam cubes.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Yam', 'beef', 'tomato', 'onions', 'oil', 'spices'],
      method: ['Cube yam.', 'Boil in tomato and meat sauce.']
    },
    nutrition: { calories: 580, protein: 28, carbs: 85, fats: 15, fiber: 7, sugar: 6, sodium: 540 }
  },
  {
    id: 'l106', name: 'Salade de Fruits de Mer', description: 'Seafood avocado salad.',
    image: '/meals/greensalad.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Shrimp', 'calamari', 'avocado', 'lime', 'onions'],
      method: ['Steam seafood.', 'Mix with avocado and lime dressing.']
    },
    nutrition: { calories: 320, protein: 35, carbs: 12, fats: 18, fiber: 4, sugar: 5, sodium: 580 }
  },
  {
    id: 'l107', name: 'Avocado & Egg Salad', description: 'Creamy avocado and eggs.',
    image: '/meals/greensalad.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Avocado', 'eggs', 'onions', 'tomato', 'lime'],
      method: ['Dice eggs and avocado.', 'Toss with onions and salt.']
    },
    nutrition: { calories: 350, protein: 15, carbs: 12, fats: 28, fiber: 9, sugar: 4, sodium: 310 }
  },
  {
    id: 'l108', name: 'Soya & Plantain', description: 'Beef skewers & plantain.',
    image: '/meals/beef soya.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['Beef', 'suya spice', 'plantains', 'onions'],
      method: ['Grill beef.', 'Fry plantains.', 'Serve with onions.']
    },
    nutrition: { calories: 720, protein: 40, carbs: 60, fats: 35, fiber: 6, sugar: 15, sodium: 780 }
  },
  {
    id: 'l109', name: 'Spaghetti Omelette', description: 'Pasta and egg stir-fry.',
    image: '/meals/omelete.jpg',
    category: 'lunch',
    recipe: {
      ingredients: ['Spaghetti', 'eggs', 'tomato', 'onions', 'oil', 'spices'],
      method: ['Boil spaghetti.', 'Fry with eggs and tomatoes.']
    },
    nutrition: { calories: 550, protein: 22, carbs: 65, fats: 25, fiber: 3, sugar: 6, sodium: 680 }
  },
  {
    id: 'l110', name: 'Spicy Gizzards (West Style)', description: 'Gizzards in tomato sauce.',
    image: '/meals/fried gizzard.jpeg',
    category: 'lunch',
    recipe: {
      ingredients: ['Gizzards', 'chili', 'onions', 'garlic', 'pebe', 'oil', 'salt'],
      method: ['Boil spiced gizzards until soft.', 'Sauté with heavy pepper and onions.']
    },
    nutrition: { calories: 380, protein: 32, carbs: 5, fats: 20, fiber: 1, sugar: 2, sodium: 780 }
  },

  // DINNER (151-250)
  {
    id: 'd1', name: 'Corn Fufu & Njama Njama', description: 'Smooth corn fufu with sautéed huckleberry leaves.',
    image: '/meals/Coal roasted Corn.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg Cornflour', 'garlic', 'ginger', '4 bundles huckleberry leaves', '1 crayfish cube', '1/4 cup palm oil', 'salt'],
      method: ['Wash huckleberry leaves thoroughly.', 'Sauté with spices and bouillon.', 'Bring water to boil.', 'Stir cornflour into boiling water until thick.', 'Cover and steam 5 minutes.', 'Serve fufu with greens.']
    },
    nutrition: { calories: 580, protein: 22, carbs: 92, fats: 15, fiber: 12, sugar: 5, sodium: 440 }
  },
  {
    id: 'd2', name: 'Fish Pepper Soup', description: 'Spicy broth with Tilapia.',
    image: '/meals/fishstew.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['500g Tilapia', 'onion', 'ginger', 'garlic', 'pepper soup spice', '2 crayfish cubes', 'salt', 'white pepper', 'chili'],
      method: ['Clean fish.', 'Boil water with spices.', 'Add fish.', 'Simmer until cooked.', 'Serve hot.']
    },
    nutrition: { calories: 280, protein: 35, carbs: 8, fats: 8, fiber: 2, sugar: 2, sodium: 690 }
  },
  {
    id: 'd3', name: 'Rice Fufu & Okra Stew', description: 'Smooth rice fufu with okra.',
    image: '/meals/how to make fufu.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 cups okra', '1 kg beef', 'spinach', 'crayfish', 'ginger', 'smoked fish', 'pebe', '1 cup palm oil', '1 kg Rice flour'],
      method: ['Steam beef half-cooked.', 'Boil leaves with spices.', 'Fry spices in oil.', 'Add meat and fish.', 'Stir in okra.', 'Make rice fufu.', 'Serve together.']
    },
    nutrition: { calories: 610, protein: 28, carbs: 95, fats: 15, fiber: 10, sugar: 2, sodium: 580 }
  },
  {
    id: 'd4', name: 'Pounded Yam & Egusi', description: 'Elastic pounded yam with melon soup.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg Yam', '2 cups egusi', 'garlic', 'spinach', 'crayfish', 'ginger', 'smoked fish', 'pebe', '1 cup palm oil'],
      method: ['Grind egusi.', 'Mix with water to paste.', 'Heat oil, fry egusi.', 'Add broth, fish, spices.', 'Simmer, add spinach.', 'Boil and pound yam.', 'Serve together.']
    },
    nutrition: { calories: 820, protein: 40, carbs: 90, fats: 32, fiber: 8, sugar: 5, sodium: 610 }
  },
  {
    id: 'd5', name: 'Dried Fish Stew', description: 'Rich stew from dried fish.',
    image: '/meals/fishstew.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg dried fish', '4 tomatoes', '2 onions', 'ginger', 'garlic', '1 cup palm oil', '2 crayfish cubes', 'salt', 'white pepper'],
      method: ['Soak fish 1 hour.', 'Remove bones.', 'Boil until tender.', 'Blend ginger, garlic, onion.', 'Sauté sliced onions.', 'Add paste, cook.', 'Add fish and spices.', 'Simmer 15 minutes.']
    },
    nutrition: { calories: 420, protein: 40, carbs: 15, fats: 22, fiber: 4, sugar: 6, sodium: 610 }
  },
  {
    id: 'd6', name: 'Plantain Hot Pot', description: 'Hearty plantain one-pot.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 plantains', 'ginger', '4 bundles spinach', 'crayfish cube', 'garlic', 'smoked fish', 'Candawan spice', 'palm oil', 'salt'],
      method: ['Grind leaves with spices.', 'Fry Candawan spices.', 'Sauté greens.', 'Boil plantains.', 'Pound slightly.', 'Serve hot pot over plantains.']
    },
    nutrition: { calories: 690, protein: 32, carbs: 78, fats: 25, fiber: 8, sugar: 14, sodium: 610 }
  },
  {
    id: 'd7', name: 'Chicken Suya', description: 'Spicy grilled chicken skewers.',
    image: '/meals/chicken.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg chicken breast', 'ginger', '1 cup peanuts', 'pebe', 'chili', 'salt', 'white pepper'],
      method: ['Roast peanuts, grind with spices.', 'Cut chicken into strips.', 'Coat with suya spice.', 'Skewer, marinate.', 'Grill over charcoal.', 'Serve with onions.']
    },
    nutrition: { calories: 440, protein: 42, carbs: 10, fats: 24, fiber: 3, sugar: 4, sodium: 750 }
  },
  {
    id: 'd8', name: 'Eba & Egusi Stew', description: 'Cassava fufu with melon soup.',
    image: '/meals/Egusi Soup.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['2 cups Garri', '4 cups water', '2 cups egusi', '1 kg beef', '4 bundles spinach', 'crayfish', 'ginger', 'garlic', 'smoked fish', '1 cup palm oil'],
      method: ['Steam beef.', 'Blanch spinach.', 'Mix egusi with water.', 'Heat oil, fry egusi.', 'Add meat, fish, spices.', 'Simmer, add spinach.', 'Stir garri into boiling water.', 'Cover, pound smooth.', 'Serve together.']
    },
    nutrition: { calories: 780, protein: 38, carbs: 75, fats: 40, fiber: 7, sugar: 4, sodium: 710 }
  },
  {
    id: 'd9', name: 'Macabo & Peanut Dip', description: 'Boiled cocoyam with spicy peanut sauce.',
    image: '/meals/Comment préparer le Macabo malaxé au ndolè_ how to cook cocoyam porridge and bitterleaves.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg Macabo', '2 cups peanuts', 'onion', 'garlic', 'pebe', 'chili', '1 cup oil', '2 crayfish cubes', 'salt'],
      method: ['Peel macabo, boil until tender.', 'Boil peanuts until soft.', 'Blend with onion, garlic, chili.', 'Heat oil, sauté paste.', 'Add crayfish cubes.', 'Simmer 5-7 minutes.', 'Serve macabo with dip.']
    },
    nutrition: { calories: 510, protein: 15, carbs: 80, fats: 18, fiber: 11, sugar: 6, sodium: 380 }
  },
  {
    id: 'd10', name: 'Beef Pepper Soup', description: 'Spicy broth with tripe.',
    image: '/meals/beef stew.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg beef tripe', '1 tin mackerel', 'garlic', 'ginger', '2 crayfish cubes', 'salt', 'white pepper'],
      method: ['Clean tripe with lime.', 'Boil until tender.', 'Add fresh water, spices.', 'Add tripe, crayfish.', 'Add mackerel.', 'Simmer 15-20 minutes.', 'Serve hot.']
    },
    nutrition: { calories: 380, protein: 42, carbs: 10, fats: 18, fiber: 2, sugar: 3, sodium: 750 }
  },
  {
    id: 'd11', name: 'Eru & Waterfufu', description: 'Southwest greens with fufu.',
    image: '/meals/eru.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 cups Eru', '3 bundles waterleaf', '2 lbs canda', '1 lb tripe', '2 cups crayfish', '3 cups palm oil', '1/2 cup canola oil', 'cube', 'habanero', 'salt', '1 kg Waterfufu'],
      method: ['Soak Eru 1 hour.', 'Simmer canda and tripe.', 'Add waterleaf.', 'Add Eru, crayfish, oils.', 'Cook 20 minutes.', 'Stir fufu into boiling water.', 'Serve together.']
    },
    nutrition: { calories: 850, protein: 38, carbs: 95, fats: 42, fiber: 12, sugar: 2, sodium: 580 }
  },
  {
    id: 'd12', name: 'Poisson Braisé (Mackerel)', description: 'Grilled mackerel dinner.',
    image: '/meals/Food.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['2 large mackerel', 'garlic', 'ginger', 'pebe', 'alligator pepper', '2 onions', '2 cubes', 'oil', 'salt'],
      method: ['Blend marinade.', 'Clean fish, make cuts.', 'Marinate 2 hours.', 'Grill over charcoal.', 'Baste continuously.', 'Serve with pepper sauce.']
    },
    nutrition: { calories: 480, protein: 42, carbs: 4, fats: 30, fiber: 1, sugar: 1, sodium: 790 }
  },
  {
    id: 'd13', name: 'Poisson Braisé (Tilapia)', description: 'Grilled tilapia dinner.',
    image: '/meals/Food.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['2 large tilapia', 'ginger', 'garlic', 'pebe', 'alligator pepper', '2 onions', '2 cubes', 'oil', 'salt'],
      method: ['Blend ginger, garlic, spices.', 'Marinate fish 2 hours.', 'Grill and baste.', 'Serve hot with pepper sauce.']
    },
    nutrition: { calories: 450, protein: 48, carbs: 5, fats: 22, fiber: 2, sugar: 1, sodium: 850 }
  },
  {
    id: 'd14', name: 'Poisson en Papillote', description: 'Steamed fish in leaves.',
    image: '/meals/Food.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['2 large mackerel', 'garlic', 'ginger', 'pebe', 'alligator pepper', 'bouillon', 'oil', 'salt', 'banana leaves'],
      method: ['Roast barks slightly.', 'Grind into powder.', 'Season fish with Mbongo spice.', 'Wrap in banana leaves.', 'Steam 45 minutes.']
    },
    nutrition: { calories: 340, protein: 38, carbs: 8, fats: 12, fiber: 4, sugar: 4, sodium: 520 }
  },
  {
    id: 'd15', name: 'Pork Braisé', description: 'Spiced roasted pork.',
    image: '/meals/Crispy Deep-Fried Ribs Recipe.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg pork', 'ginger', 'garlic', 'pebe', 'alligator pepper', '2 onions', '2 cubes', 'oil', 'salt'],
      method: ['Blend marinade.', 'Marinate pork 2 hours.', 'Grill and baste.', 'Serve with pepper sauce.']
    },
    nutrition: { calories: 610, protein: 38, carbs: 2, fats: 48, fiber: 0, sugar: 1, sodium: 880 }
  },
  {
    id: 'd16', name: 'Porridge Macabo', description: 'Grated cocoyam porridge.',
    image: '/meals/bananaporridge.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg grated Macabo', '1 palm nut concentrate', '1 tin mackerel', 'ginger', '2 crayfish cubes', 'salt'],
      method: ['Grate cocoyam into fufu.', 'Boil banga soup.', 'Serve porridge with soya.']
    },
    nutrition: { calories: 540, protein: 32, carbs: 75, fats: 18, fiber: 12, sugar: 5, sodium: 610 }
  },
  {
    id: 'd17', name: 'Potato Porridge', description: 'Irish potatoes in stew.',
    image: '/meals/bananaporridge.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg potatoes', '6 eggs', '3 tomatoes', '1 onion', 'garlic', 'pebe', 'cube', 'salt'],
      method: ['Scramble eggs with veggies.', 'Boil and pound potatoes.', 'Serve porridge with soya.']
    },
    nutrition: { calories: 420, protein: 6, carbs: 75, fats: 12, fiber: 6, sugar: 7, sodium: 440 }
  },
  {
    id: 'd18', name: 'Poulet DG', description: 'Chicken & plantain one-pot.',
    image: '/meals/Food.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 whole chicken', '6 ripe plantains', '3 tomatoes', '2 onions', 'ginger', 'garlic', 'pebe', '2 cubes', 'salt'],
      method: ['Grind tomatoes, onions, spices.', 'Season chicken, steam.', 'Fry plantains and chicken.', 'Boil spice paste.', 'Add plantains, oil, cubes.', 'Cover and simmer.']
    },
    nutrition: { calories: 800, protein: 45, carbs: 65, fats: 38, fiber: 7, sugar: 18, sodium: 710 }
  },
  {
    id: 'd19', name: 'Rice & Beans (Coconut)', description: 'Coconut rice and beans.',
    image: '/meals/beans.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg Rice', '500g beans', 'garlic', 'ginger', 'cube', '1 coconut', 'oil', 'salt', 'white pepper'],
      method: ['Boil beans.', 'Sauté Candawan spice.', 'Cook rice.', 'Mix coconut milk.', 'Stir fufu with soya.']
    },
    nutrition: { calories: 630, protein: 18, carbs: 92, fats: 25, fiber: 12, sugar: 6, sodium: 440 }
  },
  {
    id: 'd20', name: 'Rice & Tomato Stew', description: 'Beef stew and rice.',
    image: '/meals/beef stew.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg Rice', '500g meat', 'smoked fish', 'garlic', 'ginger', 'cube', 'oil', 'salt', 'white pepper', '1 kg chicken'],
      method: ['Grill suya.', 'Steam meat.', 'Stir fufu rice.', 'Assemble with soya.']
    },
    nutrition: { calories: 640, protein: 30, carbs: 90, fats: 18, fiber: 4, sugar: 5, sodium: 690 }
  },
  {
    id: 'd21', name: 'Rice Fufu & Okra', description: 'Rice dough with okra.',
    image: '/meals/how to make fufu.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg Rice flour', '6 cups dried okra', 'Candawan', 'crayfish', 'ginger', 'garlic', 'smoked fish', 'pebe', '1 cup palm oil', 'salt'],
      method: ['Simmer canda and tripe.', 'Fry Candawan spice.', 'Simmer okra powder with spices.', 'Stir rice fufu.', 'Serve together.']
    },
    nutrition: { calories: 610, protein: 28, carbs: 95, fats: 15, fiber: 10, sugar: 2, sodium: 580 }
  },
  {
    id: 'd22', name: 'Fufu Banana & Okra', description: 'Green banana fufu with okra.',
    image: '/meals/how to make fufu.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg green bananas', '6 cups okra', 'smoked fish', 'Candawan', 'crayfish', 'ginger', 'garlic', 'palm oil', 'salt'],
      method: ['Peel bananas, boil.', 'Mash spicy nut mix.', 'Simmer okra and nut mix.', 'Serve together.']
    },
    nutrition: { calories: 630, protein: 32, carbs: 85, fats: 20, fiber: 12, sugar: 12, sodium: 580 }
  },
  {
    id: 'd23', name: 'Fufu Riz & Sauce Jaune', description: 'Rice fufu with yellow soup.',
    image: '/meals/how to make fufu.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg Rice flour', '1 cup heated palm oil', '2 beef broth', '1 1/2 achu spices', 'Kangwa mix', 'salt'],
      method: ['Boil cocoyam tubers.', 'Pound fufu.', 'Serve with yellow soup.', 'Stir rice fufu.']
    },
    nutrition: { calories: 590, protein: 8, carbs: 125, fats: 4, fiber: 3, sugar: 2, sodium: 45 }
  },
  {
    id: 'd24', name: 'Kati Kati', description: 'West Region mash.',
    image: '/meals/Food.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 fresh okra', 'smoked fish', 'Candawan', 'crayfish', 'ginger', 'garlic', 'palm oil', 'salt', 'fried plantains'],
      method: ['Boil canda and tripe.', 'Sauté Candawan spice.', 'Simmer okra with spices.', 'Serve with dodo.']
    },
    nutrition: { calories: 520, protein: 28, carbs: 58, fats: 22, fiber: 5, sugar: 16, sodium: 610 }
  },
  {
    id: 'd25', name: 'Kion', description: 'Forest soup.',
    image: '/meals/Food.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['Fish', 'smoked fish', 'crayfish', 'ginger', 'salt', 'white pepper'],
      method: ['Pound fufu.', 'Simmer fish.', 'Prepare forest leaf soup.', 'Assemble with soya.']
    },
    nutrition: { calories: 490, protein: 42, carbs: 45, fats: 15, fiber: 6, sugar: 3, sodium: 440 }
  },
  {
    id: 'd26', name: 'Koki Corn (Evening)', description: 'Evening corn pudding.',
    image: '/meals/koki.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg fresh corn', 'palm oil', '2 cups spinach', 'ginger', 'crayfish', 'salt', '1 kg Rice flour'],
      method: ['Grate corn and ginger.', 'Whisk paste.', 'Add oil, crayfish, salt, spinach.', 'Wrap in leaves.', 'Steam.', 'Prepare rice fufu.']
    },
    nutrition: { calories: 310, protein: 10, carbs: 52, fats: 10, fiber: 7, sugar: 6, sodium: 380 }
  },
  {
    id: 'd27', name: 'Koki Corn (Standard Wrap)', description: 'Standard corn wrap.',
    image: '/meals/koki.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg corn', '300g palm oil', '2 spinach', 'ginger', '2 cubes', 'salt'],
      method: ['Grate corn and ginger.', 'Whisk paste.', 'Add oil, crayfish, salt, spinach.', 'Wrap in leaves.', 'Steam.']
    },
    nutrition: { calories: 280, protein: 7, carbs: 45, fats: 10, fiber: 6, sugar: 6, sodium: 310 }
  },
  {
    id: 'd28', name: 'Kondre', description: 'Ceremonial plantain stew.',
    image: '/meals/kondre.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 unripe plantains', '1 kg beef', '3 tomatoes', '2 onions', 'ginger', 'garlic', 'palm oil', 'crayfish', 'pebe', '2 cubes', 'salt'],
      method: ['Grind melon seeds.', 'Season and wrap.', 'Steam pudding.', 'Steam beef.', 'Sauté batter.', 'Add beef, plantains, oil.', 'Cover and simmer.']
    },
    nutrition: { calories: 710, protein: 38, carbs: 82, fats: 24, fiber: 11, sugar: 14, sodium: 520 }
  },
  {
    id: 'd29', name: 'Kundi', description: 'Dried greens stew.',
    image: '/meals/Food.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 cups dried Njama Njama', '1 kg beef', '1 tin mackerel', 'garlic', 'spinach', 'crayfish', 'ginger', 'smoked fish', 'peanuts', 'pebe', 'chili', '1 cup palm oil'],
      method: ['Rehydrate leaves.', 'Steam beef.', 'Fry Candawan.', 'Sauté Egusi.', 'Mix stew.']
    },
    nutrition: { calories: 410, protein: 28, carbs: 15, fats: 30, fiber: 12, sugar: 2, sodium: 520 }
  },
  {
    id: 'd30', name: 'Kwacoco & Banga', description: 'Cocoyam with palm soup.',
    image: '/meals/kwacoco bible.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg grated Malanga', '1 kg palm nut concentrate', '1 tin mackerel', 'ginger', '2 cubes', 'salt'],
      method: ['Grate cocoyam.', 'Boil and pound yam.', 'Sauté fish with onions.', 'Grind peanuts.', 'Boil banga with crayfish.']
    },
    nutrition: { calories: 820, protein: 35, carbs: 90, fats: 40, fiber: 10, sugar: 6, sodium: 620 }
  },
  {
    id: 'd31', name: 'Macabo & Peanut Dip', description: 'Cocoyam with peanut sauce.',
    image: '/meals/Comment préparer le Macabo malaxé au ndolè_ how to cook cocoyam porridge and bitterleaves.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg Macabo', 'garlic', 'ginger', 'pebe', '2 cubes', '1 cup oil', 'salt'],
      method: ['Boil and pound cocoyam.', 'Grind peanuts.', 'Boil spiced nuts.', 'Mix dip with cocoyam.']
    },
    nutrition: { calories: 440, protein: 8, carbs: 82, fats: 10, fiber: 12, sugar: 5, sodium: 310 }
  },
  {
    id: 'd32', name: 'Masa (Evening)', description: 'Evening rice cakes.',
    image: '/meals/masa.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg Cornflour', '1 tin mackerel', 'onion', 'chili', 'salt'],
      method: ['Prepare masa.', 'Debone mackerel.', 'Mix with onions, chili.', 'Serve with pepper sauce.']
    },
    nutrition: { calories: 320, protein: 4, carbs: 65, fats: 3, fiber: 2, sugar: 22, sodium: 110 }
  },
  {
    id: 'd33', name: 'Mbol', description: 'Grassfields stew.',
    image: '/meals/Food.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 fresh okra', 'smoked fish', 'Candawan', 'crayfish', 'ginger', 'garlic', 'palm oil', 'salt', 'fried plantains'],
      method: ['Boil canda and tripe.', 'Sauté Candawan.', 'Simmer okra with spices.']
    },
    nutrition: { calories: 620, protein: 30, carbs: 25, fats: 45, fiber: 8, sugar: 3, sodium: 410 }
  },
  {
    id: 'd34', name: 'Mbongo Tchobi', description: 'Black spicy stew.',
    image: '/meals/mbongo.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['Tilapia', 'smoked fish', 'crayfish', 'ginger', 'salt'],
      method: ['Pound fufu.', 'Simmer fish.', 'Prepare forest leaf soup.', 'Assemble with soya.']
    },
    nutrition: { calories: 480, protein: 40, carbs: 15, fats: 35, fiber: 6, sugar: 3, sodium: 480 }
  },
  {
    id: 'd35', name: 'Mbongo Tchobi Fish', description: 'Black fish stew.',
    image: '/meals/fishstew.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['Tilapia', 'ginger', 'pebe', 'alligator pepper', 'oil', 'salt', 'banana leaves'],
      method: ['Roast alligator pepper.', 'Grind barks.', 'Season fish.', 'Wrap in leaves.', 'Steam.']
    },
    nutrition: { calories: 340, protein: 38, carbs: 8, fats: 12, fiber: 4, sugar: 4, sodium: 520 }
  },
  {
    id: 'd36', name: 'Miondo & Avocado', description: 'Cassava sticks with avocado.',
    image: '/meals/Food.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 Miondo', 'avocado', 'salt'],
      method: ['Prepare miondo.', 'Serve with avocado.']
    },
    nutrition: { calories: 450, protein: 6, carbs: 65, fats: 24, fiber: 12, sugar: 4, sodium: 180 }
  },
  {
    id: 'd37', name: 'Ndole (Light Dinner)', description: 'Light bitterleaf stew.',
    image: '/meals/ndole.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg bitter leaves', '1 kg beef', '600g peanuts', '2 onions', 'garlic', 'pebe', '1 cup oil', 'salt'],
      method: ['Grate cocoyams.', 'Boil peanuts, blend.', 'Steam beef.', 'Sauté paste.', 'Add meat and leaves.']
    },
    nutrition: { calories: 510, protein: 22, carbs: 45, fats: 28, fiber: 6, sugar: 6, sodium: 520 }
  },
  {
    id: 'd38', name: 'Ndole (Small Portion)', description: 'Small bitterleaf stew.',
    image: '/meals/ndole.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg bitter leaves', '1 kg beef', '600g peanuts', '2 onions', 'ginger', 'garlic', '1 cup oil', 'salt'],
      method: ['Grate cocoyams.', 'Boil peanuts, blend.', 'Steam beef.', 'Sauté paste.', 'Add meat and leaves.']
    },
    nutrition: { calories: 420, protein: 22, carbs: 35, fats: 25, fiber: 6, sugar: 6, sodium: 450 }
  },
  {
    id: 'd39', name: 'Ndolé with Crayfish', description: 'Bitterleaf with crayfish.',
    image: '/meals/fishstew.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg bitter leaves', '1 kg beef', '600g peanuts', '2 onions', 'ginger', 'garlic', '1 cup crayfish', 'smoked fish', '1 cup oil'],
      method: ['Grate cocoyams.', 'Boil peanuts, blend.', 'Steam beef.', 'Sauté paste.', 'Add meat, crayfish, leaves.']
    },
    nutrition: { calories: 740, protein: 48, carbs: 42, fats: 42, fiber: 9, sugar: 6, sodium: 680 }
  },
  {
    id: 'd40', name: 'Ndolé with Shrimp', description: 'Shrimp bitterleaf stew.',
    image: '/meals/Food.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg bitter leaves', '600g peanuts', '500g beef', '300g shrimp', '1/4 lb smoked fish', '2 onions', 'ginger', 'garlic', '1 cup oil'],
      method: ['Grate cocoyams.', 'Boil peanuts, blend.', 'Steam beef.', 'Sauté paste.', 'Add meat and leaves.', 'Sear shrimp, fold in.']
    },
    nutrition: { calories: 710, protein: 45, carbs: 42, fats: 42, fiber: 9, sugar: 6, sodium: 650 }
  },
  {
    id: 'd41', name: 'Njangsa Fish Soup', description: 'Spicy nutty fish soup.',
    image: '/meals/fishstew.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['Fish', 'smoked fish', 'garlic', 'ginger', 'crayfish', 'pebe', 'palm oil'],
      method: ['Pound fufu.', 'Sauté Njama Njama.', 'Simmer fish.', 'Prepare soup.', 'Assemble.']
    },
    nutrition: { calories: 380, protein: 38, carbs: 12, fats: 20, fiber: 3, sugar: 2, sodium: 610 }
  },
  {
    id: 'd42', name: 'Njama Njama & Yam', description: 'Huckleberry with yam.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg Yam', '4 bundles huckleberry', 'crayfish', '1/4 cup palm oil', 'salt'],
      method: ['Boil leaves with spices.', 'Fry spices.', 'Sauté mix.', 'Boil yam.', 'Pound yam.', 'Serve mix over yam.']
    },
    nutrition: { calories: 670, protein: 18, carbs: 105, fats: 22, fiber: 11, sugar: 5, sodium: 480 }
  },
  {
    id: 'd43', name: 'Okok (Salty)', description: 'Savory gnetum leaves.',
    image: '/meals/okok.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg Okok leaves', '600g Egusi', '2 cups palm oil', 'onion', 'ginger-garlic paste', 'cube', 'smoked fish', 'salt'],
      method: ['Soak leaves 1 hour.', 'Wash, drain.', 'Boil until tender.', 'Mix ground Egusi.', 'Add to leaves.', 'Cook Egusi fufu.']
    },
    nutrition: { calories: 750, protein: 25, carbs: 45, fats: 48, fiber: 11, sugar: 5, sodium: 520 }
  },
  {
    id: 'd44', name: 'Okok (Sweet)', description: 'Sweet gnetum leaves.',
    image: '/meals/okok.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg Okok leaves', '600g Egusi', '2 sugar', 'onion', 'ginger-garlic paste', 'cube', 'smoked fish', 'salt'],
      method: ['Soak leaves.', 'Wash, drain.', 'Boil until tender.', 'Mix Egusi.', 'Add to leaves.', 'Add sugar.', 'Cook.']
    },
    nutrition: { calories: 890, protein: 20, carbs: 70, fats: 55, fiber: 11, sugar: 45, sodium: 210 }
  },
  {
    id: 'd45', name: 'Okok with Cassava', description: 'Gnetum with cassava.',
    image: '/meals/Cassava Fries (Mandioca Frita) - Crumb-Snatched.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['Okok leaves', 'Egusi', 'onion', 'ginger-garlic paste', 'cube', 'smoked fish', 'salt', 'Cassava paste'],
      method: ['Prepare Okok.', 'Stir cassava paste.', 'Assemble.']
    },
    nutrition: { calories: 820, protein: 22, carbs: 95, fats: 45, fiber: 14, sugar: 25, sodium: 310 }
  },
  {
    id: 'd46', name: 'Okra & Fufu Corn', description: 'Corn fufu with okra.',
    image: '/meals/Coal roasted Corn.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 fresh okra', '1 kg beef', 'spinach', 'smoked fish', 'crayfish', 'ginger', 'garlic', '1 cup oil', '1 kg Cornflour'],
      method: ['Steam beef.', 'Boil leaves.', 'Fry spices.', 'Sauté Egusi.', 'Mix stew.', 'Stir cornflour.', 'Serve together.']
    },
    nutrition: { calories: 680, protein: 40, carbs: 88, fats: 22, fiber: 12, sugar: 4, sodium: 710 }
  },
  {
    id: 'd47', name: 'Okra & Pounded Yam', description: 'Slimy soup with yam.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg Yam', '6 fresh okra', '1 kg beef', 'spinach', 'crayfish', 'ginger', 'garlic', 'smoked fish', '1 cup oil'],
      method: ['Steam beef.', 'Boil leaves.', 'Fry spices.', 'Sauté Egusi.', 'Mix stew.', 'Boil yam.', 'Pound yam.']
    },
    nutrition: { calories: 780, protein: 38, carbs: 95, fats: 25, fiber: 12, sugar: 4, sodium: 690 }
  },
  {
    id: 'd48', name: 'Okra (Standard Dinner)', description: 'Standard okra dinner.',
    image: '/meals/Food.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 okra', '1 kg beef', 'spinach', 'smoked fish', 'crayfish', 'ginger', 'peanuts', 'pebe', 'chili', '1 cup oil'],
      method: ['Prepare meat stew.', 'Fry Candawan.', 'Sauté Egusi.', 'Mix stew.', 'Stir fufu rice.']
    },
    nutrition: { calories: 600, protein: 45, carbs: 20, fats: 38, fiber: 10, sugar: 4, sodium: 690 }
  },
  {
    id: 'd49', name: 'Okra Soup', description: 'Slimy okra stew.',
    image: '/meals/Chicken-Peppersoup.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 cups dried okra', '1 kg canda', 'tripe', '1 tin mackerel', 'garlic', 'huckleberry', 'Candawan', 'crayfish', 'ginger', 'smoked fish', 'pebe', '1 cup oil'],
      method: ['Simmer canda and tripe.', 'Fry Candawan.', 'Mix spices.', 'Simmer okra with spices.', 'Prepare greens.']
    },
    nutrition: { calories: 600, protein: 45, carbs: 20, fats: 38, fiber: 10, sugar: 4, sodium: 690 }
  },
  {
    id: 'd50', name: 'Palm Nut Soup', description: 'Banga soup dinner.',
    image: '/meals/Chicken-Peppersoup.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 palm nut concentrate', 'assorted fish', 'ginger', 'smoked fish', 'crayfish', 'pebe', 'salt', 'Fufu banana'],
      method: ['Sauté fish with onions.', 'Grind peanuts.', 'Boil banga with fish.', 'Simmer.', 'Prepare fufu banana.']
    },
    nutrition: { calories: 820, protein: 30, carbs: 25, fats: 75, fiber: 8, sugar: 6, sodium: 680 }
  },
  {
    id: 'd51', name: 'Pepper Soup Beef', description: 'Spicy beef soup.',
    image: '/meals/beef stew.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg beef tripe', '1 tin mackerel', 'garlic', 'ginger', '2 cubes', 'salt', 'white pepper'],
      method: ['Sauté fish with onions.', 'Grind peanuts.', 'Boil cow skin with fish.']
    },
    nutrition: { calories: 380, protein: 42, carbs: 10, fats: 18, fiber: 2, sugar: 3, sodium: 750 }
  },
  {
    id: 'd52', name: 'Pepper Soup Chicken', description: 'Spicy chicken soup.',
    image: '/meals/chicken.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg chicken', '1 tin mackerel', 'garlic', 'ginger', '2 cubes', 'salt', 'white pepper'],
      method: ['Sauté fish with onions.', 'Grind peanuts.', 'Boil chicken with fish.']
    },
    nutrition: { calories: 390, protein: 38, carbs: 10, fats: 15, fiber: 2, sugar: 2, sodium: 620 }
  },
  {
    id: 'd53', name: 'Pepper Soup Cow Tail', description: 'Gelatinous tail soup.',
    image: '/meals/Chicken-Peppersoup.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg cow tail', '1 tin mackerel', 'garlic', 'ginger', '2 cubes', 'salt', 'white pepper'],
      method: ['Sauté fish with onions.', 'Grind peanuts.', 'Boil cow tail with fish.']
    },
    nutrition: { calories: 480, protein: 45, carbs: 10, fats: 28, fiber: 2, sugar: 3, sodium: 780 }
  },
  {
    id: 'd54', name: 'Pepper Soup Fish', description: 'Spicy fish broth.',
    image: '/meals/fishstew.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg fish', '1 tin mackerel', 'garlic', 'ginger', '2 cubes', 'salt', 'white pepper'],
      method: ['Sauté fish with onions.', 'Grind peanuts.', 'Boil fish chunks with crayfish.']
    },
    nutrition: { calories: 350, protein: 45, carbs: 10, fats: 12, fiber: 2, sugar: 2, sodium: 820 }
  },
  {
    id: 'd55', name: 'Pepper Soup Goat', description: 'Medicinal goat soup.',
    image: '/meals/Goat meat pepper soup.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg goat meat', '1 tin mackerel', 'garlic', 'ginger', '2 cubes', 'salt', 'white pepper'],
      method: ['Sauté fish with onions.', 'Grind peanuts.', 'Boil goat with fish.']
    },
    nutrition: { calories: 410, protein: 35, carbs: 12, fats: 22, fiber: 4, sugar: 2, sodium: 850 }
  },
  {
    id: 'd56', name: 'Pepper Soup Goat (Heavy)', description: 'Thick goat broth.',
    image: '/meals/Goat meat pepper soup.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg goat meat', '1 tin mackerel', 'garlic', 'ginger', '2 cubes', 'salt', 'white pepper'],
      method: ['Sauté fish with onions.', 'Grind peanuts.', 'Boil goat with fish.']
    },
    nutrition: { calories: 450, protein: 42, carbs: 12, fats: 25, fiber: 3, sugar: 4, sodium: 850 }
  },
  {
    id: 'd57', name: 'Pepper Soup Goat (Small)', description: 'Lighter goat broth.',
    image: '/meals/Goat meat pepper soup.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['500g goat meat', '1 tin mackerel', 'garlic', 'ginger', '2 cubes', 'salt', 'white pepper'],
      method: ['Sauté fish with onions.', 'Grind peanuts.', 'Boil goat with fish.']
    },
    nutrition: { calories: 310, protein: 28, carbs: 8, fats: 18, fiber: 2, sugar: 2, sodium: 710 }
  },
  {
    id: 'd58', name: 'Pepper Soup Snail', description: 'Spicy snail broth.',
    image: '/meals/Chicken-Peppersoup.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg snails', '1 tin mackerel', 'garlic', 'ginger', '2 cubes', 'salt', 'white pepper'],
      method: ['Clean snails with lime.', 'Sauté fish with onions.', 'Grind peanuts.', 'Boil snails with fish.']
    },
    nutrition: { calories: 260, protein: 35, carbs: 8, fats: 10, fiber: 1, sugar: 2, sodium: 740 }
  },
  {
    id: 'd59', name: 'Pepper Soup Tripe', description: 'Tripe in spicy broth.',
    image: '/meals/Chicken-Peppersoup.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg tripe', '1 tin mackerel', 'garlic', 'ginger', '2 cubes', 'salt', 'white pepper'],
      method: ['Sauté fish with onions.', 'Grind peanuts.', 'Boil tripe with fish.']
    },
    nutrition: { calories: 320, protein: 38, carbs: 8, fats: 18, fiber: 1, sugar: 2, sodium: 780 }
  },
  {
    id: 'd60', name: 'Plantain & Fish Stew', description: 'Plantain with fish.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 plantains', '1 tin mackerel', 'ginger', '2 cubes', 'salt', 'white pepper'],
      method: ['Sauté fish with onions.', 'Grind peanuts.', 'Boil plantains with fish.']
    },
    nutrition: { calories: 680, protein: 35, carbs: 88, fats: 25, fiber: 9, sugar: 18, sodium: 620 }
  },
  {
    id: 'd61', name: 'Plantain & Hot Pot', description: 'Plantain hot pot.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 plantains', 'ginger', 'spinach', 'crayfish', 'garlic', 'smoked fish', 'Candawan spice', 'palm oil', 'salt'],
      method: ['Grind leaves with spices.', 'Fry Candawan.', 'Sauté mix.', 'Boil plantains.', 'Pound.', 'Serve hot pot over plantains.']
    },
    nutrition: { calories: 690, protein: 32, carbs: 78, fats: 25, fiber: 8, sugar: 14, sodium: 610 }
  },
  {
    id: 'd62', name: 'Sautéed Cabbage & Fish', description: 'Cabbage with fish.',
    image: '/meals/fishstew.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg fish', '1 cabbage', 'chili', 'onions', 'garlic', 'pebe', 'oil', 'salt'],
      method: ['Simmer fish with onions.', 'Toss with cabbage.', 'Boil yam.']
    },
    nutrition: { calories: 310, protein: 25, carbs: 18, fats: 15, fiber: 7, sugar: 6, sodium: 490 }
  },
  {
    id: 'd63', name: 'Sautéed Spinach & Fish', description: 'Spinach with fish.',
    image: '/meals/fishstew.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg Tilapia', '4 bundles spinach', 'crayfish', 'ginger', 'smoked fish', 'salt'],
      method: ['Boil cocoyam.', 'Pound fufu.', 'Steam beef.', 'Sauté spinach.', 'Simmer fish.', 'Assemble.']
    },
    nutrition: { calories: 320, protein: 28, carbs: 15, fats: 18, fiber: 9, sugar: 4, sodium: 410 }
  },
  {
    id: 'd64', name: 'Smoked Fish & Cassava', description: 'Smoked fish with cassava.',
    image: '/meals/fishstew.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg smoked fish', '1 tin mackerel', 'garlic', 'spinach', 'crayfish', 'ginger', 'pebe', '1 cup oil', 'salt'],
      method: ['Steam beef.', 'Boil leaves.', 'Fry Candawan.', 'Sauté Egusi.', 'Mix stew.', 'Stir cassava paste.']
    },
    nutrition: { calories: 480, protein: 42, carbs: 82, fats: 10, fiber: 9, sugar: 4, sodium: 550 }
  },
  {
    id: 'd65', name: 'Soya & Plantain', description: 'Beef skewers with plantain.',
    image: '/meals/beef soya.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg Beef suya', 'fried plantains'],
      method: ['Prepare suya.', 'Sauté dodo.', 'Serve with pepper sauce.']
    },
    nutrition: { calories: 720, protein: 40, carbs: 60, fats: 35, fiber: 6, sugar: 15, sodium: 780 }
  },
  {
    id: 'd66', name: 'Soya de Poulet', description: 'Large chicken skewer.',
    image: '/meals/beef soya.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg chicken', 'ginger', 'peanuts', 'pebe', 'chili', 'salt', 'potatoes'],
      method: ['Boil gizzards.', 'Grill suya.', 'Prepare chips.', 'Skewer.', 'Assemble.']
    },
    nutrition: { calories: 550, protein: 45, carbs: 12, fats: 35, fiber: 3, sugar: 5, sodium: 780 }
  },
  {
    id: 'd67', name: 'Spicy Snail Skewer', description: 'Peppered forest snails.',
    image: '/meals/friedsnails.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['Snails', 'lime', 'salt', 'spices'],
      method: ['Clean snails with lime.', 'Boil until soft.', 'Sauté spicy mash.', 'Toss snails with chili.']
    },
    nutrition: { calories: 190, protein: 25, carbs: 3, fats: 10, fiber: 0, sugar: 1, sodium: 620 }
  },
  {
    id: 'd68', name: 'Spicy Tripe', description: 'Serviette style tripe.',
    image: '/meals/Food.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg tripe', 'Candawan', 'crayfish', 'ginger', 'garlic', 'palm oil', 'salt'],
      method: ['Clean tripe with lime.', 'Simmer canda and tripe.', 'Fry Candawan.', 'Mix spices.', 'Simmer okra with spices.']
    },
    nutrition: { calories: 280, protein: 35, carbs: 2, fats: 15, fiber: 0, sugar: 1, sodium: 810 }
  },
  {
    id: 'd69', name: 'Sweet Potato Porridge', description: 'Sweet potato dinner.',
    image: '/meals/bananaporridge.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['Sweet potatoes', '1 kg beef', '1 tin mackerel', 'garlic', 'spinach', 'crayfish', 'ginger', 'smoked fish', 'pebe', '1 cup oil'],
      method: ['Grate cocoyams.', 'Boil peanuts.', 'Steam beef.', 'Sauté paste.', 'Add meat and leaves.']
    },
    nutrition: { calories: 480, protein: 8, carbs: 95, fats: 12, fiber: 9, sugar: 18, sodium: 340 }
  },
  {
    id: 'd70', name: 'Vegan Pepper Soup', description: 'Tofu pepper soup.',
    image: '/meals/Chicken-Peppersoup.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['500g tofu', '1 tin mackerel', 'garlic', 'ginger', '2 cubes', 'salt'],
      method: ['Sauté fish with onions.', 'Grind peanuts.', 'Boil tofu with fish.']
    },
    nutrition: { calories: 260, protein: 22, carbs: 8, fats: 12, fiber: 3, sugar: 2, sodium: 540 }
  },
  {
    id: 'd71', name: 'Vegetable Soup (North)', description: 'Northern vegetable soup.',
    image: '/meals/Chicken-Peppersoup.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['Achu cocoyam', 'palm nut concentrate', 'ginger', 'smoked fish', 'crayfish', 'pebe', 'salt'],
      method: ['Boil cocoyam.', 'Pound fufu.', 'Steam beef.', 'Simmer banga.', 'Prepare soup.', 'Assemble.']
    },
    nutrition: { calories: 590, protein: 12, carbs: 110, fats: 22, fiber: 12, sugar: 4, sodium: 710 }
  },
  {
    id: 'd72', name: 'Waterfufu & Okra Stew', description: 'Cassava fufu with okra.',
    image: '/meals/how to make fufu.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 okra', '1 kg beef', 'spinach', 'crayfish', 'ginger', 'smoked fish', 'pebe', '1 cup oil', '1 Waterfufu paste'],
      method: ['Steam beef.', 'Boil leaves.', 'Fry Candawan.', 'Sauté Egusi.', 'Mix stew.', 'Stir fufu paste.']
    },
    nutrition: { calories: 680, protein: 35, carbs: 85, fats: 28, fiber: 12, sugar: 2, sodium: 540 }
  },
  {
    id: 'd73', name: 'Yam & Egg Stew', description: 'Yam with egg stew.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg Yam', '6 eggs', '3 tomatoes', '1 onion', 'garlic', 'pebe', '2 cubes', 'salt'],
      method: ['Scramble eggs.', 'Boil and pound yam.', 'Serve with sauce.']
    },
    nutrition: { calories: 550, protein: 16, carbs: 78, fats: 22, fiber: 7, sugar: 4, sodium: 490 }
  },
  {
    id: 'd74', name: 'Yam Porridge', description: 'Yam dinner porridge.',
    image: '/meals/bananaporridge.jpeg',
    category: 'dinner',
    recipe: {
      ingredients: ['1 kg Yam', '1 kg beef', '1 tin mackerel', 'garlic', 'spinach', 'crayfish', 'ginger', 'smoked fish', 'pebe', '1 cup oil'],
      method: ['Grate cocoyams.', 'Boil peanuts.', 'Steam beef.', 'Sauté paste.', 'Add meat and leaves.']
    },
    nutrition: { calories: 520, protein: 12, carbs: 88, fats: 15, fiber: 7, sugar: 5, sodium: 440 }
  },
  {
    id: 'd75', name: 'Zom (Nightshade Soup)', description: 'Nightshade leaves soup.',
    image: '/meals/Chicken-Peppersoup.jpg',
    category: 'dinner',
    recipe: {
      ingredients: ['6 bundles Zom', 'ginger', 'crayfish', '1/4 palm oil', 'salt'],
      method: ['Boil leaves with ginger, crayfish, oil.', 'Strain.', 'Heat oil.', 'Mix.', 'Serve as medicinal drink.']
    },
    nutrition: { calories: 150, protein: 4, carbs: 20, fats: 2, fiber: 6, sugar: 8, sodium: 310 }
  },

  // SNACKS (251-350)
  {
    id: 's1', name: 'Plantain Chips & Dip', description: 'Crispy plantain chips with local biscuit dip.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['6 yellow plantains', 'vegetable oil', '1 packet local biscuits'],
      method: ['Prepare chips according to standard instructions.', 'Prepare standard wraps.', 'Fold and fry wraps in butter.']
    },
    nutrition: { calories: 350, protein: 3, carbs: 55, fats: 14, fiber: 5, sugar: 12, sodium: 380 }
  },
  {
    id: 's2', name: 'Puff Puff', description: 'Deep-fried sweet dough balls.',
    image: '/meals/puff puff beans.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg flour', '150g sugar', '2 tsp yeast', '1 tsp salt', '500ml water', 'oil'],
      method: ['Mix yeast, sugar, water; let sit until frothy.', 'Combine flour, salt.', 'Add yeast mixture.', 'Knead until smooth; let rise 45 mins.', 'Roll dough, fill, deep-fry.']
    },
    nutrition: { calories: 420, protein: 6, carbs: 68, fats: 15, fiber: 2, sugar: 18, sodium: 180 }
  },
  {
    id: 's3', name: 'Puff Puff & Beans', description: 'Puff puff with beans.',
    image: '/meals/beans.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg flour', '1 kg beans', 'onion', 'chili', 'pebe', '1/4 palm oil', 'salt'],
      method: ['Prepare puff puff.', 'Fry Candawan spices.', 'Sauté Egusi paste.', 'Mix Egusi stew.', 'Stir fufu rice.']
    },
    nutrition: { calories: 550, protein: 18, carbs: 85, fats: 22, fiber: 12, sugar: 14, sodium: 350 }
  },
  {
    id: 's4', name: 'Puffed Rice', description: 'Local style puffed rice.',
    image: '/meals/friedrice.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 cup Rice', 'sugar', 'oil'],
      method: ['Boil and pound rice.', 'Pounded fufu rice.', 'Assemble in paper bag with soya.']
    },
    nutrition: { calories: 180, protein: 3, carbs: 40, fats: 1, fiber: 2, sugar: 15, sodium: 120 }
  },
  {
    id: 's5', name: 'Roasted African Plum', description: 'Roasted Safou pears.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['6 Safou', 'salt'],
      method: ['Roast African plums.', 'Boil and slice yam.', 'Serve plum with yam.']
    },
    nutrition: { calories: 150, protein: 3, carbs: 8, fats: 12, fiber: 4, sugar: 2, sodium: 5 }
  },
  {
    id: 's6', name: 'Roasted Cocoyam', description: 'Grilled cocoyam with spicy nut mash.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg Malanga', 'salt', 'standard spicy nut mash'],
      method: ['Grind peanuts.', 'Boil spiced nuts.', 'Mix peanuts.', 'Sauté cocoyam mash.']
    },
    nutrition: { calories: 390, protein: 4, carbs: 82, fats: 2, fiber: 12, sugar: 4, sodium: 85 }
  },
  {
    id: 's7', name: 'Roasted Corn', description: 'Charcoal-grilled maize.',
    image: '/meals/Coal roasted Corn.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['6 corn', 'ginger', 'pebe', 'sugar'],
      method: ['Mash melon seeds.', 'Season and wrap.', 'Steam pudding.', 'Prepare beans.', 'Serve corn with beans.']
    },
    nutrition: { calories: 150, protein: 4, carbs: 32, fats: 1, fiber: 6, sugar: 4, sodium: 380 }
  },
  {
    id: 's8', name: 'Roasted Corn (Large)', description: 'Large roasted corn.',
    image: '/meals/Coal roasted Corn.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['6 corn', '1/4 palm oil', 'salt'],
      method: ['Peel corn.', 'Roast on hot coals.', 'Boil yam.', 'Serve corn with oil.']
    },
    nutrition: { calories: 180, protein: 4, carbs: 38, fats: 2, fiber: 6, sugar: 5, sodium: 80 }
  },
  {
    id: 's9', name: 'Roasted Corn & Groundnut', description: 'Grilled corn with peanuts.',
    image: '/meals/groundnut.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['6 corn', '1 cup peanuts', 'pebe', 'salt', 'white pepper'],
      method: ['Mash melon seeds.', 'Season and wrap.', 'Steam pudding.', 'Sun-dry.']
    },
    nutrition: { calories: 310, protein: 8, carbs: 55, fats: 12, fiber: 8, sugar: 6, sodium: 120 }
  },
  {
    id: 's10', name: 'Roasted Corn & Plums', description: 'Corn with African plums.',
    image: '/meals/Coal roasted Corn.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['6 corn', '6 Safou', 'salt'],
      method: ['Roast plums.', 'Boil yam.', 'Serve corn with plum.']
    },
    nutrition: { calories: 240, protein: 5, carbs: 48, fats: 8, fiber: 10, sugar: 12, sodium: 15 }
  },
  {
    id: 's11', name: 'Roasted Groundnuts', description: 'Dry roasted peanuts.',
    image: '/meals/groundnut.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg peanuts', 'pebe', 'sugar'],
      method: ['Mash melon seeds.', 'Season and wrap.', 'Steam pudding.', 'Prepare beans.', 'Serve with beans.']
    },
    nutrition: { calories: 560, protein: 25, carbs: 16, fats: 48, fiber: 9, sugar: 4, sodium: 110 }
  },
  {
    id: 's12', name: 'Roasted Groundnuts (Salty)', description: 'Salted roasted peanuts.',
    image: '/meals/groundnut.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg peanuts', '1/4 palm oil', 'salt'],
      method: ['Roast plums.', 'Slice plantains, fry.', 'Boil yam.', 'Serve with plum.']
    },
    nutrition: { calories: 580, protein: 26, carbs: 16, fats: 50, fiber: 9, sugar: 3, sodium: 450 }
  },
  {
    id: 's13', name: 'Roasted Irish Potato', description: 'Charcoal-baked potatoes.',
    image: '/meals/Potato Porridge Recipe (Potato Pottage).jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg potatoes', 'salt', '1 tin mackerel', 'onion', 'chili'],
      method: ['Peel potatoes.', 'Roast on coals.', 'Boil yam.', 'Prepare pepper sauce.']
    },
    nutrition: { calories: 210, protein: 3, carbs: 45, fats: 2, fiber: 5, sugar: 2, sodium: 180 }
  },
  {
    id: 's14', name: 'Roasted Pig Ear', description: 'Grilled pork ear snack.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['pig ears', '1 tin mackerel', 'onion', 'chili', 'salt'],
      method: ['Sauté fish with onions.', 'Mix yeast, sugar, water.', 'Combine flour.', 'Add yeast.', 'Knead, rise, fill, fry.']
    },
    nutrition: { calories: 290, protein: 28, carbs: 0, fats: 20, fiber: 0, sugar: 0, sodium: 920 }
  },
  {
    id: 's15', name: 'Roasted Pig Skin', description: 'Grilled cracklings.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['cow skin', '1 tin mackerel', 'onion', 'chili', 'salt'],
      method: ['Clean skin with lime.', 'Sauté fish with onions.', 'Prepare dough.', 'Roll, fill, fry.']
    },
    nutrition: { calories: 350, protein: 32, carbs: 0, fats: 25, fiber: 0, sugar: 0, sodium: 890 }
  },
  {
    id: 's16', name: 'Roasted Plantain (Salt)', description: 'Simple grilled plantain.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['6 plantains', 'ginger', 'huckleberry', 'crayfish', '1/4 palm oil', 'salt'],
      method: ['Roast plantain on coals.', 'Boil and pound yam.', 'Serve in paper bag with soya.']
    },
    nutrition: { calories: 190, protein: 2, carbs: 45, fats: 1, fiber: 5, sugar: 12, sodium: 320 }
  },
  {
    id: 's17', name: 'Roasted Plantain & Beans', description: 'Grilled plantain with beans.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['6 plantains', '1 kg beans', 'onion', 'chili', 'pebe', '1/4 oil', 'salt'],
      method: ['Boil beans.', 'Roast plantain.', 'Boil yam.', 'Prepare beans.', 'Serve together.']
    },
    nutrition: { calories: 490, protein: 14, carbs: 88, fats: 10, fiber: 18, sugar: 22, sodium: 350 }
  },
  {
    id: 's18', name: 'Roasted Plantain & Plum', description: 'Plantain with Safou.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['6 plantains', '6 Safou', '1/4 oil', 'salt'],
      method: ['Roast plums.', 'Slice plantains, fry.', 'Boil yam.', 'Serve together.']
    },
    nutrition: { calories: 380, protein: 4, carbs: 85, fats: 8, fiber: 9, sugar: 22, sodium: 45 }
  },
  {
    id: 's19', name: 'Roasted Sweet Potato', description: 'Coalt-baked sweet potato.',
    image: '/meals/Sweet Potato Fries Recipe.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg sweet potatoes', 'salt', '1 tin mackerel', 'onion', 'chili'],
      method: ['Peel potatoes.', 'Roast on coals.', 'Boil yam.', 'Prepare pepper sauce.']
    },
    nutrition: { calories: 220, protein: 2, carbs: 55, fats: 1, fiber: 6, sugar: 15, sodium: 90 }
  },
  {
    id: 's20', name: 'Roasted Turkey Tail', description: 'Grilled turkey tail.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg turkey tail', 'ginger', 'garlic', 'pebe', 'alligator pepper', '2 onions', '2 cubes', 'oil', 'salt'],
      method: ['Roast barks.', 'Grind powder.', 'Season with Mbongo spice.', 'Wrap in leaves.', 'Steam.']
    },
    nutrition: { calories: 520, protein: 28, carbs: 0, fats: 45, fiber: 0, sugar: 0, sodium: 710 }
  },
  {
    id: 's21', name: 'Sardine Baguette', description: 'Spiced sardine sandwich.',
    image: '/meals/breadsardine.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['baguette', '1 tin sardines', 'chili'],
      method: ['Open sardine tin.', 'Mash with oil and chili.', 'Serve with miondo and dodo.']
    },
    nutrition: { calories: 520, protein: 22, carbs: 50, fats: 28, fiber: 3, sugar: 4, sodium: 820 }
  },
  {
    id: 's22', name: 'Sardine Sandwich', description: 'Breakfast sardine sandwich.',
    image: '/meals/The BEST-EVER Sardine Salad Sandwich _ CRAZY Good 10 Minute Recipe.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 packet biscuits', 'biscuits'],
      method: ['Prepare wraps.', 'Fold and fry in butter.']
    },
    nutrition: { calories: 380, protein: 8, carbs: 55, fats: 14, fiber: 2, sugar: 12, sodium: 410 }
  },
  {
    id: 's23', name: 'Soya (Single skewer)', description: 'Single beef skewer.',
    image: '/meals/beef soya.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg beef', 'ginger', 'peanuts', 'pebe', 'chili', 'salt', '1 cup peanuts'],
      method: ['Roast melon seeds.', 'Mash.', 'Season and wrap.', 'Steam pudding.', 'Sun-dry.', 'Grill suya.']
    },
    nutrition: { calories: 150, protein: 18, carbs: 2, fats: 8, fiber: 0, sugar: 1, sodium: 350 }
  },
  {
    id: 's24', name: 'Soya & Cucumber Salad', description: 'Suya with fresh cucumber.',
    image: '/meals/beef soya.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg Beef suya', 'cucumber', 'pebe', 'sugar'],
      method: ['Prepare suya.', 'Mix spicy mash.', 'Sauté.', 'Toss with cucumbers.', 'Assemble.']
    },
    nutrition: { calories: 220, protein: 24, carbs: 10, fats: 10, fiber: 3, sugar: 5, sodium: 410 }
  },
  {
    id: 's25', name: 'Soya & Onion Salad', description: 'Beef skewers with onions.',
    image: '/meals/beef soya.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg Beef suya', 'onions', 'pebe', 'sugar'],
      method: ['Prepare suya.', 'Mix spicy mash.', 'Sauté.', 'Toss with onions.', 'Assemble.']
    },
    nutrition: { calories: 210, protein: 25, carbs: 8, fats: 10, fiber: 2, sugar: 4, sodium: 580 }
  },
  {
    id: 's26', name: 'Spicy Snail Skewer', description: 'Peppered forest snails.',
    image: '/meals/friedsnails.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['snails', 'lime', 'salt', 'chili', 'onions'],
      method: ['Clean snails with lime.', 'Boil until soft.', 'Sauté spicy mash.', 'Toss with chili.']
    },
    nutrition: { calories: 190, protein: 25, carbs: 3, fats: 10, fiber: 0, sugar: 1, sodium: 620 }
  },
  {
    id: 's27', name: 'Sugar Cane (Peeled)', description: 'Chewable cane stalks.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['sugar cane'],
      method: ['Dice fruits.', 'Skewer and chill.']
    },
    nutrition: { calories: 120, protein: 0, carbs: 32, fats: 0, fiber: 0, sugar: 30, sodium: 5 }
  },
  {
    id: 's28', name: 'Sugarcane Cubes', description: 'Raw sugarcane pieces.',
    image: '/meals/Cana de açucar.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['sugar cane'],
      method: ['Peel green plantains.', 'Slice thin.', 'Heat oil.', 'Fry until golden.', 'Drain.', 'Drizzle with salt.']
    },
    nutrition: { calories: 120, protein: 0, carbs: 32, fats: 0, fiber: 2, sugar: 30, sodium: 5 }
  },
  {
    id: 's29', name: 'Sweet Potato Fries', description: 'Deep-fried sweet potato.',
    image: '/meals/Sweet Potato Fries Recipe.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg sweet potatoes', 'oil', 'salt', 'fried mackerel'],
      method: ['Peel and slice.', 'Deep-fry until golden.', 'Sauté fish with onions and chili.']
    },
    nutrition: { calories: 380, protein: 3, carbs: 70, fats: 10, fiber: 5, sugar: 15, sodium: 220 }
  },
  {
    id: 's30', name: 'Tea & Biscuits', description: 'Hot tea with biscuits.',
    image: '/meals/Traditional Pakistani Chai.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['tea bag', 'water', 'condensed milk', 'sugar', 'biscuits'],
      method: ['Brew tea.', 'Stir in milk and sugar.', 'Prepare biscuit.']
    },
    nutrition: { calories: 250, protein: 5, carbs: 45, fats: 6, fiber: 2, sugar: 24, sodium: 180 }
  },
  {
    id: 's31', name: 'Watermelon Cubes', description: 'Fresh watermelon chunks.',
    image: '/meals/citrus water.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 watermelon'],
      method: ['Slice watermelon.']
    },
    nutrition: { calories: 80, protein: 1, carbs: 20, fats: 0, fiber: 1, sugar: 18, sodium: 2 }
  },
  {
    id: 's32', name: 'Yam & Sardines', description: 'Yam with sardine sauce.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg Malanga', '1 tin sardines', 'salt'],
      method: ['Open sardines.', 'Mash with oil and chili.', 'Serve with miondo and dodo.']
    },
    nutrition: { calories: 520, protein: 18, carbs: 78, fats: 20, fiber: 7, sugar: 4, sodium: 890 }
  },
  {
    id: 's33', name: 'Yam Fries (Koloko)', description: 'Deep fried yam chunks.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg Yam', 'oil', 'salt', 'fried mackerel'],
      method: ['Peel and slice yam.', 'Deep-fry until golden.', 'Sauté fish with onions and chili.']
    },
    nutrition: { calories: 410, protein: 4, carbs: 75, fats: 12, fiber: 6, sugar: 3, sodium: 310 }
  },
  {
    id: 's34', name: 'Accra Banana', description: 'Banana and cassava fritters.',
    image: '/meals/bananas.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['6 bananas', '2 cups cassava flour', 'salt', 'oil'],
      method: ['Mash bananas with flour.', 'Form sticky dough.', 'Heat oil.', 'Drop scoops.', 'Fry until golden.']
    },
    nutrition: { calories: 310, protein: 4, carbs: 58, fats: 9, fiber: 5, sugar: 22, sodium: 110 }
  },
  {
    id: 's35', name: 'Accra Beans', description: 'Savory bean fritters.',
    image: '/meals/beans.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg black-eyed peas', 'onion', 'parsley', 'chili', 'salt', 'oil'],
      method: ['Blend beans into smooth batter.', 'Add onions, parsley, chili.', 'Whisk 10 minutes.', 'Heat oil.', 'Scoop and deep-fry.']
    },
    nutrition: { calories: 310, protein: 14, carbs: 32, fats: 14, fiber: 9, sugar: 2, sodium: 380 }
  },
  {
    id: 's36', name: 'Achu (Vegetarian)', description: 'Taro with yellow soup.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['Taro', 'palm oil', 'canwa', 'mushroom'],
      method: ['Grill snails with spicy onion sauce.']
    },
    nutrition: { calories: 590, protein: 12, carbs: 110, fats: 22, fiber: 12, sugar: 4, sodium: 710 }
  },
  {
    id: 's37', name: 'Akara', description: 'Deep-fried bean cakes.',
    image: '/meals/akarasauce.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['Peeled beans', 'onions', 'chili'],
      method: ['Blend soaked beans.', 'Whisk until airy.', 'Deep fry.']
    },
    nutrition: { calories: 380, protein: 14, carbs: 40, fats: 18, fiber: 8, sugar: 2, sodium: 420 }
  },
  {
    id: 's38', name: 'Akara (Grassfields)', description: 'Bean cake with pap.',
    image: '/meals/akarasauce.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg beans', 'onion', 'parsley', 'chili', 'salt', 'oil'],
      method: ['Blend beans into batter.', 'Add onions, parsley, chili.', 'Whisk.', 'Fry.', 'Prepare kunnu.', 'Serve together.']
    },
    nutrition: { calories: 490, protein: 18, carbs: 65, fats: 15, fiber: 12, sugar: 12, sodium: 380 }
  },
  {
    id: 's39', name: 'Banana Cake', description: 'Dense steamed banana bread.',
    image: '/meals/bananas.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['6 bananas', '2 cups flour', '1 cup sugar', '1/2 cup margarine', '2 eggs', '1 tsp baking soda', 'nutmeg'],
      method: ['Mash bananas.', 'Mix with ingredients.', 'Pour into pan.', 'Bake or steam 30 mins.']
    },
    nutrition: { calories: 310, protein: 5, carbs: 55, fats: 10, fiber: 4, sugar: 28, sodium: 190 }
  },
  {
    id: 's40', name: 'Boiled Groundnuts', description: 'Fresh boiled peanuts.',
    image: '/meals/groundnut.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['Peanuts', 'water', 'salt'],
      method: ['Boil peanuts in shells with salt.', 'Cook 45 minutes.']
    },
    nutrition: { calories: 310, protein: 13, carbs: 18, fats: 22, fiber: 8, sugar: 2, sodium: 280 }
  },
  {
    id: 's41', name: 'Caramel Peanuts', description: 'Sugar coated nuts.',
    image: '/meals/Peanut Sugarcake.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['Peanuts', 'sugar', 'vanilla'],
      method: ['Melt sugar into syrup.', 'Mix with nuts.', 'Flatten.']
    },
    nutrition: { calories: 490, protein: 12, carbs: 52, fats: 28, fiber: 5, sugar: 40, sodium: 15 }
  },
  {
    id: 's42', name: 'Cassava Patties', description: 'Deep-fried mashed cassava.',
    image: '/meals/Cassava Fries (Mandioca Frita) - Crumb-Snatched.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg flour', 'butter', 'yeast', 'baking powder', 'sugar', 'salt', 'water', 'chili'],
      method: ['Grate cassava.', 'Mix with spicy mash.', 'Prepare dough.', 'Fill and fry.']
    },
    nutrition: { calories: 320, protein: 3, carbs: 65, fats: 12, fiber: 4, sugar: 8, sodium: 210 }
  },
  {
    id: 's43', name: 'Chicken Soya Wrap', description: 'Suya wrapped in dough.',
    image: '/meals/beef soya.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg flour', '1 kg chicken', 'chili', 'onions', 'pebe', '1 cup peanuts'],
      method: ['Roast peanuts.', 'Mash.', 'Season.', 'Steam pudding.', 'Grill suya.', 'Prepare wraps.', 'Assemble.']
    },
    nutrition: { calories: 490, protein: 32, carbs: 40, fats: 20, fiber: 4, sugar: 6, sodium: 820 }
  },
  {
    id: 's44', name: 'Chicken Suya (Skewer)', description: 'Spiced chicken stick.',
    image: '/meals/chicken.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg chicken', 'ginger', '1 cup peanuts', 'pebe', 'chili', 'salt'],
      method: ['Roast peanuts.', 'Mash seeds.', 'Season.', 'Wrap.', 'Steam.', 'Grill suya.', 'Skewer.']
    },
    nutrition: { calories: 180, protein: 22, carbs: 4, fats: 10, fiber: 1, sugar: 2, sodium: 390 }
  },
  {
    id: 's45', name: 'Chin Chin', description: 'Crunchy pastry bites.',
    image: '/meals/Chin-Chin.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['5 cups flour', '1/2 cup sugar', '1 tsp baking powder', '1 tsp salt', '1/2 cup margarine', '2 eggs', '1 cup milk', 'nutmeg', 'oil'],
      method: ['Combine ingredients.', 'Knead dough.', 'Cut into strips.', 'Deep-fry until golden.']
    },
    nutrition: { calories: 480, protein: 7, carbs: 72, fats: 20, fiber: 1, sugar: 28, sodium: 210 }
  },
  {
    id: 's46', name: 'Chin Chin (Salty)', description: 'Savory crunchy pastry.',
    image: '/meals/Chin-Chin.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['Flour', 'salt', 'garlic'],
      method: ['Prepare savory dough.', 'Cut and fry.']
    },
    nutrition: { calories: 440, protein: 7, carbs: 65, fats: 18, fiber: 2, sugar: 4, sodium: 520 }
  },
  {
    id: 's47', name: 'Coconut Candy', description: 'Fried shredded coconut.',
    image: '/meals/coconut.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['Coconut', 'sugar'],
      method: ['Fry coconut with caramel sugar.']
    },
    nutrition: { calories: 380, protein: 3, carbs: 42, fats: 24, fiber: 7, sugar: 38, sodium: 35 }
  },
  {
    id: 's48', name: 'Corn & Coconut', description: 'Boiled corn and coconut.',
    image: '/meals/Coal roasted Corn.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['Corn', 'coconut'],
      method: ['Boil corn.', 'Serve with coconut.']
    },
    nutrition: { calories: 320, protein: 6, carbs: 50, fats: 14, fiber: 9, sugar: 8, sodium: 10 }
  },
  {
    id: 's49', name: 'Dandawan', description: 'Fermented locust bean cakes.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['Locust beans', 'salt'],
      method: ['Ferment beans.', 'Form cakes.', 'Sun-dry.']
    },
    nutrition: { calories: 210, protein: 18, carbs: 12, fats: 14, fiber: 3, sugar: 2, sodium: 1100 }
  },
  {
    id: 's50', name: 'Dodo', description: 'Fried ripe plantain.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['6 plantains', 'oil', 'salt'],
      method: ['Peel plantains.', 'Slice diagonally.', 'Fry until caramelized.', 'Flip.', 'Drain.']
    },
    nutrition: { calories: 220, protein: 2, carbs: 35, fats: 9, fiber: 3, sugar: 14, sodium: 10 }
  },
  {
    id: 's51', name: 'Donut (Gateau)', description: 'Heavy fried dough ball.',
    image: '/meals/Traditional Pakistani Chai.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['500g flour', '150g sugar', '1 tbsp butter', '1 tsp baking powder', '1 tsp salt', '2 eggs', '1 cup milk', 'oil', 'nutmeg'],
      method: ['Sift flour, nutmeg, baking powder, salt.', 'Mix sugar.', 'Rub butter.', 'Whisk eggs and milk.', 'Mix to dough.', 'Rest 10 mins.', 'Deep-fry.']
    },
    nutrition: { calories: 420, protein: 8, carbs: 62, fats: 16, fiber: 1, sugar: 30, sodium: 240 }
  },
  {
    id: 's52', name: 'Egusi Pudding (Snack)', description: 'Small melon seed cake.',
    image: '/meals/Egusi Soup.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 cup Egusi', 'smoked fish', 'crayfish', 'ginger', 'garlic', 'pebe', 'salt', 'banana leaves'],
      method: ['Grind Egusi.', 'Mix with fish, spices.', 'Add warm water.', 'Place in leaves.', 'Fold.', 'Steam 1.5 hours.']
    },
    nutrition: { calories: 220, protein: 15, carbs: 5, fats: 18, fiber: 2, sugar: 1, sodium: 210 }
  },
  {
    id: 's53', name: 'Fish Roll', description: 'Fried fish pastry.',
    image: '/meals/fishstew.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['3 cups flour', '3 tbsp butter', '1 tsp yeast', '1 tsp baking powder', '1 tsp sugar', '1/2 tsp salt', '1 1/4 cups water', '1 tin mackerel', 'onion', 'chili'],
      method: ['Sauté fish with onions.', 'Mix yeast, sugar, water.', 'Combine flour, salt, baking powder.', 'Add yeast, butter.', 'Knead, rise.', 'Roll, fill, deep-fry.']
    },
    nutrition: { calories: 320, protein: 12, carbs: 35, fats: 15, fiber: 2, sugar: 3, sodium: 480 }
  },
  {
    id: 's54', name: 'French Fries & Mayo', description: 'Potato chips with mayo.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg potatoes', 'oil', 'salt', 'fried mackerel'],
      method: ['Peel potatoes.', 'Deep-fry until golden.', 'Sauté fish with onions and chili.']
    },
    nutrition: { calories: 580, protein: 5, carbs: 65, fats: 35, fiber: 5, sugar: 4, sodium: 720 }
  },
  {
    id: 's55', name: 'Fresh Pineapple Slices', description: 'Simple tropical fruit.',
    image: '/meals/How to Cut a Pineapple _ Spears, Slices, or Rings!.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 pineapple'],
      method: ['Slice pineapple.', 'Serve immediately.']
    },
    nutrition: { calories: 90, protein: 1, carbs: 22, fats: 0, fiber: 3, sugar: 18, sodium: 2 }
  },
  {
    id: 's56', name: 'Fried Breadfruit', description: 'Fried slices of breadfruit.',
    image: '/meals/bread.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 breadfruit', 'oil', 'salt'],
      method: ['Slice breadfruit.', 'Deep-fry.', 'Boil yam.', 'Sauté fish.', 'Serve together.']
    },
    nutrition: { calories: 320, protein: 4, carbs: 65, fats: 8, fiber: 9, sugar: 12, sodium: 110 }
  },
  {
    id: 's57', name: 'Fried Cassava (Koloko)', description: 'Crunchy cassava fries.',
    image: '/meals/Cassava Fries (Mandioca Frita) - Crumb-Snatched.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg cassava', 'oil', 'salt', 'fried mackerel'],
      method: ['Peel cassava.', 'Slice.', 'Deep-fry until golden.', 'Sauté fish with onions and chili.']
    },
    nutrition: { calories: 420, protein: 3, carbs: 85, fats: 12, fiber: 7, sugar: 4, sodium: 290 }
  },
  {
    id: 's58', name: 'Fried Cassava & Onion', description: 'Savory cassava fries.',
    image: '/meals/Cassava Fries (Mandioca Frita) - Crumb-Snatched.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg cassava', 'garlic', 'chili', 'oil', 'salt'],
      method: ['Boil cassava.', 'Slice.', 'Mash spicy nut mix.', 'Sauté cassava and onions.']
    },
    nutrition: { calories: 410, protein: 3, carbs: 82, fats: 10, fiber: 7, sugar: 4, sodium: 280 }
  },
  {
    id: 's59', name: 'Fried Cassava & Pepper', description: 'Cassava chips with chili.',
    image: '/meals/Cassava Fries (Mandioca Frita) - Crumb-Snatched.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg cassava', 'oil', 'chili sauce', 'salt'],
      method: ['Boil cassava.', 'Slice.', 'Mash spicy nut mix.', 'Sauté cassava and chili.']
    },
    nutrition: { calories: 390, protein: 3, carbs: 80, fats: 10, fiber: 8, sugar: 4, sodium: 320 }
  },
  {
    id: 's60', name: 'Fried Gizzards (Snack)', description: 'Spicy peppered gizzards.',
    image: '/meals/fried gizzard.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg gizzards', 'chili', 'onions', 'garlic', 'pebe', 'oil', 'salt'],
      method: ['Boil gizzards until soft.', 'Sauté spicy mash.', 'Toss with chili and onions.']
    },
    nutrition: { calories: 280, protein: 32, carbs: 4, fats: 15, fiber: 0, sugar: 1, sodium: 610 }
  },
  {
    id: 's61', name: 'Fried Gizzards & Dodo', description: 'Gizzards with plantain.',
    image: '/meals/fried gizzard.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg gizzards', '6 plantains', 'chili', 'onions', 'garlic', 'oil', 'salt'],
      method: ['Boil gizzards.', 'Sauté spicy mash.', 'Slice plantains, fry.', 'Sauté gizzards and chili.']
    },
    nutrition: { calories: 520, protein: 25, carbs: 58, fats: 22, fiber: 5, sugar: 16, sodium: 610 }
  },
  {
    id: 's62', name: 'Fried Gizzards (West)', description: 'West style gizzards.',
    image: '/meals/fried gizzard.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg gizzards', 'chili', 'onions', 'garlic', 'pebe', 'oil', 'salt'],
      method: ['Boil spiced gizzards.', 'Sauté spicy mash.', 'Sauté gizzards and chili.']
    },
    nutrition: { calories: 280, protein: 32, carbs: 5, fats: 20, fiber: 1, sugar: 2, sodium: 780 }
  },
  {
    id: 's63', name: 'Fried Macabo Chips', description: 'Thin cocoyam crisps.',
    image: '/meals/Comment préparer le Macabo malaxé au ndolè_ how to cook cocoyam porridge and bitterleaves.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['Macabo', 'oil', 'salt'],
      method: ['Slice macabo thin.', 'Deep fry until crisp.']
    },
    nutrition: { calories: 390, protein: 3, carbs: 78, fats: 12, fiber: 9, sugar: 4, sodium: 340 }
  },
  {
    id: 's64', name: 'Fried Plantain & Beans', description: 'Dodo and beans.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['Plantain', 'brown beans', 'oil'],
      method: ['Fry plantains.', 'Serve with stewed beans.']
    },
    nutrition: { calories: 520, protein: 15, carbs: 85, fats: 18, fiber: 14, sugar: 22, sodium: 480 }
  },
  {
    id: 's65', name: 'Fried Potato & Sausage', description: 'Street energy snack.',
    image: '/meals/Potato Porridge Recipe (Potato Pottage).jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['Potatoes', 'sausage', 'oil'],
      method: ['Fry potatoes and sausages together.']
    },
    nutrition: { calories: 510, protein: 18, carbs: 55, fats: 28, fiber: 4, sugar: 5, sodium: 740 }
  },
  {
    id: 's66', name: 'Fried Ribs (Local)', description: 'Deep-fried spiced ribs.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['Pork ribs', 'garlic', 'ginger', 'pebe', 'chili', 'salt'],
      method: ['Sauté fish.', 'Boil yam.', 'Prepare ribs.', 'Marinate.', 'Grill.']
    },
    nutrition: { calories: 620, protein: 38, carbs: 5, fats: 52, fiber: 0, sugar: 1, sodium: 810 }
  },
  {
    id: 's67', name: 'Fried Snails', description: 'Giant African snails.',
    image: '/meals/friedsnails.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg snails', 'chili', 'onions', 'garlic', 'oil', 'salt'],
      method: ['Clean snails with lime.', 'Boil until soft.', 'Sauté spicy mash.', 'Toss with chili.']
    },
    nutrition: { calories: 340, protein: 45, carbs: 5, fats: 18, fiber: 0, sugar: 1, sodium: 720 }
  },
  {
    id: 's68', name: 'Fried Yam & Pepper', description: 'Yam with hot dip.',
    image: '/meals/Fried Yam Fries.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg Yam', 'oil', 'chili sauce', 'salt'],
      method: ['Boil yam.', 'Slice.', 'Deep-fry.', 'Mix spicy mash.', 'Serve with pepper sauce.']
    },
    nutrition: { calories: 380, protein: 4, carbs: 72, fats: 10, fiber: 6, sugar: 3, sodium: 320 }
  },
  {
    id: 's69', name: 'Fruit Skewers', description: 'Mixed tropical fruit stick.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['Pineapple', 'mango', 'papaya'],
      method: ['Dice fruits.', 'Skewer.', 'Chill.']
    },
    nutrition: { calories: 110, protein: 1, carbs: 25, fats: 0, fiber: 4, sugar: 22, sodium: 5 }
  },
  {
    id: 's70', name: 'Garri (Dry with Sugar)', description: 'Dry cassava with sugar.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 cup Garri', '1/2 cup groundnuts', '1/2 cup sugar'],
      method: ['Mix garri with water.', 'Drain.', 'Stir sugar.', 'Serve with groundnuts.']
    },
    nutrition: { calories: 350, protein: 10, carbs: 58, fats: 12, fiber: 5, sugar: 15, sodium: 85 }
  },
  {
    id: 's71', name: 'Garri & Coconut', description: 'Garri with coconut flakes.',
    image: '/meals/coconut.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 cup Garri', '1 coconut', '1/2 cup sugar'],
      method: ['Mix garri with water.', 'Drain.', 'Stir sugar and coconut.']
    },
    nutrition: { calories: 340, protein: 5, carbs: 62, fats: 10, fiber: 6, sugar: 18, sodium: 25 }
  },
  {
    id: 's72', name: 'Grated Cassava Cake', description: 'Baked cassava squares.',
    image: '/meals/Cassava Fries (Mandioca Frita) - Crumb-Snatched.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg Malanga', '1 cup sugar', 'smoked fish', 'crayfish', 'pebe', 'oil', 'salt', 'banana leaves'],
      method: ['Wash cocoyams.', 'Grate.', 'Mix with fish, spices.', 'Wrap in leaves.', 'Steam 1.5 hours.']
    },
    nutrition: { calories: 350, protein: 3, carbs: 72, fats: 8, fiber: 6, sugar: 32, sodium: 95 }
  },
  {
    id: 's73', name: 'Grilled Gizzards', description: 'Skewered chicken gizzards.',
    image: '/meals/fried gizzard.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg gizzards', 'chili', 'onions', 'garlic', 'pebe', 'oil', 'salt'],
      method: ['Boil gizzards.', 'Sauté spicy mash.', 'Toss with chili.', 'Grill.']
    },
    nutrition: { calories: 380, protein: 32, carbs: 5, fats: 20, fiber: 1, sugar: 2, sodium: 780 }
  },
  {
    id: 's74', name: 'Grilled Pig Ear', description: 'Grilled pork ear snack.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['Pig ears', '1 tin mackerel', 'onion', 'chili', 'salt'],
      method: ['Sauté fish.', 'Prepare dough.', 'Fill and fry.']
    },
    nutrition: { calories: 290, protein: 28, carbs: 0, fats: 20, fiber: 0, sugar: 0, sodium: 920 }
  },
  {
    id: 's75', name: 'Hard-Boiled Egg & Pepper', description: 'Street egg with salt mix.',
    image: '/meals/boiled eggs.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['6 eggs', 'chili', 'salt'],
      method: ['Mash chili and salt with eggs.']
    },
    nutrition: { calories: 80, protein: 6, carbs: 1, fats: 5, fiber: 0, sugar: 1, sodium: 250 }
  },
  {
    id: 's76', name: 'Irish Potato Fry', description: 'Fried potato snack.',
    image: '/meals/Potato Porridge Recipe (Potato Pottage).jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg potatoes', 'oil', 'salt'],
      method: ['Boil and pound yam.', 'Serve with pepper sauce.']
    },
    nutrition: { calories: 400, protein: 4, carbs: 62, fats: 18, fiber: 4, sugar: 1, sodium: 450 }
  },
  {
    id: 's77', name: 'Kanda (Peanut Cake)', description: 'Peanut brittle.',
    image: '/meals/Peanut Sugarcake.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg peanuts', '1 cup sugar', 'water'],
      method: ['Melt sugar into caramel.', 'Mix with nuts.', 'Flatten.']
    },
    nutrition: { calories: 450, protein: 15, carbs: 45, fats: 28, fiber: 6, sugar: 35, sodium: 45 }
  },
  {
    id: 's78', name: 'Kashat', description: 'Roasted melon seed snack.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 cup Egusi', 'smoked fish', 'crayfish', 'salt', 'banana leaves'],
      method: ['Grind Egusi.', 'Mix with fish.', 'Add water.', 'Wrap in leaves.', 'Steam.']
    },
    nutrition: { calories: 210, protein: 12, carbs: 15, fats: 12, fiber: 4, sugar: 3, sodium: 340 }
  },
  {
    id: 's79', name: 'Kilichi', description: 'Spiced dried beef.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg beef', 'pebe', 'chili', 'salt'],
      method: ['Roast melon seeds.', 'Mash.', 'Season.', 'Wrap.', 'Steam.', 'Sun-dry.']
    },
    nutrition: { calories: 320, protein: 48, carbs: 5, fats: 15, fiber: 1, sugar: 2, sodium: 980 }
  },
  {
    id: 's80', name: 'Koki Beans (Snack)', description: 'Small bean pudding.',
    image: '/meals/koki.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg beans', 'onion', 'ginger', 'pebe', 'chili', 'salt'],
      method: ['Blend beans into batter.', 'Add onions, ginger, chili.', 'Whisk.', 'Fold spinach.', 'Wrap.', 'Steam.']
    },
    nutrition: { calories: 410, protein: 24, carbs: 48, fats: 18, fiber: 14, sugar: 4, sodium: 390 }
  },
  {
    id: 's81', name: 'Koki Corn (Small)', description: 'Small corn snack.',
    image: '/meals/koki.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg corn', '2 cups spinach', 'ginger', 'cube', 'salt'],
      method: ['Mash seeds.', 'Season.', 'Wrap.', 'Steam.', 'Prepare beans.', 'Serve with beans.']
    },
    nutrition: { calories: 280, protein: 7, carbs: 45, fats: 10, fiber: 6, sugar: 6, sodium: 310 }
  },
  {
    id: 's82', name: 'Meat Pie', description: 'Beef filled pastry.',
    image: '/meals/Nigerian Meat Pies.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['5 cups flour', '1 sugar', '1 tbsp butter', '1 tsp yeast', '1 tsp baking powder', '1/2 salt', '2 eggs', 'nutmeg', 'oil', '1 tin mackerel', 'onion', 'chili'],
      method: ['Sauté fish.', 'Mix yeast, sugar, water.', 'Combine flour.', 'Add yeast, butter.', 'Knead, rise.', 'Roll, fill, deep-fry.']
    },
    nutrition: { calories: 380, protein: 14, carbs: 40, fats: 18, fiber: 3, sugar: 4, sodium: 550 }
  },
  {
    id: 's83', name: 'Miondo & Avocado', description: 'Cassava strips with avocado.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['6 Miondo', 'avocado'],
      method: ['Prepare miondo.', 'Serve with avocado.']
    },
    nutrition: { calories: 340, protein: 4, carbs: 45, fats: 18, fiber: 8, sugar: 2, sodium: 120 }
  },
  {
    id: 's84', name: 'Miondo & Pepper Sauce', description: 'Cassava with spicy dip.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['6 Miondo', 'garlic', 'ginger', 'pebe', '2 cubes', '1 cup oil', 'salt'],
      method: ['Prepare miondo.', 'Mix garlic, ginger, spices with oil.', 'Serve with sauce.']
    },
    nutrition: { calories: 290, protein: 2, carbs: 65, fats: 5, fiber: 4, sugar: 2, sodium: 350 }
  },
  {
    id: 's85', name: 'Mixed Berry', description: 'Wild forest berries.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['wild berries'],
      method: ['Skewer fruits.', 'Chill.']
    },
    nutrition: { calories: 130, protein: 1, carbs: 32, fats: 0, fiber: 5, sugar: 28, sodium: 5 }
  },
  {
    id: 's86', name: 'Onion & Pepper Dip', description: 'Spicy condiment.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['2 onions', 'chili', 'salt', '1/4 palm oil'],
      method: ['Sauté onions.', 'Add chili, salt, oil.']
    },
    nutrition: { calories: 50, protein: 1, carbs: 10, fats: 2, fiber: 2, sugar: 6, sodium: 820 }
  },
  {
    id: 's87', name: 'Papaya & Ginger Salad', description: 'Zesty fruit bowl.',
    image: '/meals/Papaya and Lime.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['papaya', 'ginger', 'lime'],
      method: ['Prepare wraps.', 'Fold and fry.']
    },
    nutrition: { calories: 130, protein: 1, carbs: 30, fats: 0, fiber: 6, sugar: 25, sodium: 5 }
  },
  {
    id: 's88', name: 'Papaya & Lime', description: 'Fresh papaya with lime.',
    image: '/meals/Papaya and Lime.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['papaya', 'lime'],
      method: ['Slice papaya.', 'Squeeze lime.']
    },
    nutrition: { calories: 120, protein: 1, carbs: 28, fats: 0, fiber: 5, sugar: 24, sodium: 10 }
  },
  {
    id: 's89', name: 'Pawpaw Seeds (Dried)', description: 'Dried papaya seeds.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['papaya seeds'],
      method: ['Sun-dry seeds.']
    },
    nutrition: { calories: 50, protein: 2, carbs: 8, fats: 2, fiber: 5, sugar: 1, sodium: 10 }
  },
  {
    id: 's90', name: 'Peanut Burger', description: 'Flour coated peanuts.',
    image: '/meals/Peanut Sugarcake.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 kg peanuts', 'ginger', 'pebe', 'sugar'],
      method: ['Mash seeds.', 'Season.', 'Wrap.', 'Steam.', 'Prepare beans.', 'Serve with beans.']
    },
    nutrition: { calories: 510, protein: 14, carbs: 48, fats: 32, fiber: 5, sugar: 15, sodium: 190 }
  },
  {
    id: 's91', name: 'Peppered Snail Skewer', description: 'Spiced grilled snails.',
    image: '/meals/friedsnails.jpg',
    category: 'snacks',
    recipe: {
      ingredients: ['snails', 'lime', 'salt', 'chili', 'onions'],
      method: ['Clean snails.', 'Sauté fish.', 'Prepare dough.', 'Roll, fill, fry.']
    },
    nutrition: { calories: 210, protein: 28, carbs: 4, fats: 10, fiber: 1, sugar: 2, sodium: 580 }
  },
  {
    id: 's92', name: 'Piment de Table', description: 'Hot pepper sauce.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['Habaneros', 'ginger', 'njangsa', 'garlic'],
      method: ['Blend all.', 'Fry in oil.']
    },
    nutrition: { calories: 45, protein: 1, carbs: 8, fats: 2, fiber: 2, sugar: 4, sodium: 850 }
  },
  {
    id: 's93', name: 'Pineapple Wedges', description: 'Fresh pineapple slices.',
    image: '/meals/How to Cut a Pineapple _ Spears, Slices, or Rings!.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['1 pineapple'],
      method: ['Slice pineapple.']
    },
    nutrition: { calories: 100, protein: 1, carbs: 24, fats: 0, fiber: 3, sugar: 20, sodium: 2 }
  },
  {
    id: 's94', name: 'Piyin', description: 'Scotch egg style.',
    image: '/meals/Food.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['5 cups flour', '150g sugar', 'butter', 'yeast', 'baking powder', 'salt', 'eggs', 'nutmeg', 'oil', '1 tin mackerel', 'onion', 'chili'],
      method: ['Sauté fish.', 'Mix yeast, sugar, water.', 'Combine flour.', 'Add yeast, butter.', 'Knead, rise.', 'Roll, fill, deep-fry.']
    },
    nutrition: { calories: 410, protein: 22, carbs: 15, fats: 30, fiber: 1, sugar: 2, sodium: 580 }
  },
  {
    id: 's95', name: 'Plantain Chips (Salty)', description: 'Green plantain crisps.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['6 green plantains', 'oil', 'salt'],
      method: ['Peel plantains.', 'Slice thin.', 'Heat oil.', 'Fry until crisp.', 'Drain.', 'Salt immediately.']
    },
    nutrition: { calories: 330, protein: 2, carbs: 55, fats: 12, fiber: 6, sugar: 2, sodium: 420 }
  },
  {
    id: 's96', name: 'Plantain Chips (Sweet)', description: 'Ripe plantain crisps.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['6 yellow plantains', 'oil'],
      method: ['Peel plantains.', 'Slice diagonally.', 'Fry until caramelized.', 'Drain.']
    },
    nutrition: { calories: 350, protein: 2, carbs: 58, fats: 14, fiber: 5, sugar: 25, sodium: 180 }
  },
  {
    id: 's97', name: 'Plantain & Plum', description: 'Plantain with Safou.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['6 plantains', '6 Safou', '1/4 oil', 'salt'],
      method: ['Roast plums.', 'Fry plantains.', 'Boil yam.', 'Serve together.']
    },
    nutrition: { calories: 350, protein: 3, carbs: 55, fats: 14, fiber: 5, sugar: 12, sodium: 380 }
  },
  {
    id: 's98', name: 'Plantain & Plum (Safou)', description: 'Plantain with African pears.',
    image: '/meals/Roasted Plantain.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['6 Safou', 'water'],
      method: ['Roast plums.', 'Boil yam.', 'Serve together.']
    },
    nutrition: { calories: 160, protein: 3, carbs: 10, fats: 12, fiber: 4, sugar: 2, sodium: 15 }
  },
  {
    id: 's99', name: 'Roasted Macabo (Salty)', description: 'Grilled salty cocoyam.',
    image: '/meals/Comment préparer le Macabo malaxé au ndolè_ how to cook cocoyam porridge and bitterleaves.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['Macabo', 'salt'],
      method: ['Roast on coals.', 'Sprinkle with salt.']
    },
    nutrition: { calories: 390, protein: 6, carbs: 82, fats: 2, fiber: 12, sugar: 4, sodium: 450 }
  },
  {
    id: 's100', name: 'Roasted Macabo & Sauce', description: 'Grilled cocoyam slices.',
    image: '/meals/Comment préparer le Macabo malaxé au ndolè_ how to cook cocoyam porridge and bitterleaves.jpeg',
    category: 'snacks',
    recipe: {
      ingredients: ['Macabo', 'pepper sauce'],
      method: ['Roast macabo.', 'Serve with chili sauce.']
    },
    nutrition: { calories: 440, protein: 8, carbs: 82, fats: 10, fiber: 12, sugar: 5, sodium: 310 }
  },

  // DRINKS (351-400)
  {
    id: 'dr1', name: 'Soursop Juice', description: 'Creamy soursop drink.',
    image: '/meals/soursop.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 ripe soursop', 'water'],
      method: ['Blend fruits with water.', 'Strain.']
    },
    nutrition: { calories: 190, protein: 3, carbs: 40, fats: 2, fiber: 6, sugar: 35, sodium: 15 }
  },
  {
    id: 'dr2', name: 'Soursop Smoothie', description: 'Creamy tropical blend.',
    image: '/meals/soursop smoothie.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 ripe soursop', 'water'],
      method: ['Blend fruits with water.', 'Strain.']
    },
    nutrition: { calories: 180, protein: 2, carbs: 38, fats: 1, fiber: 5, sugar: 32, sodium: 15 }
  },
  {
    id: 'dr3', name: 'Sugar Cane Juice', description: 'Pressed raw sugarcane.',
    image: '/meals/sugarcane juice.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['sugar cane'],
      method: ['Press stalks through juicer.', 'Serve over ice.']
    },
    nutrition: { calories: 140, protein: 0, carbs: 38, fats: 0, fiber: 0, sugar: 36, sodium: 10 }
  },
  {
    id: 'dr4', name: 'Sugarcane Juice & Ginger', description: 'Cane juice with ginger.',
    image: '/meals/sugarcane ginger.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 kg mango', 'pineapple skin', 'sugar', 'water'],
      method: ['Boil mango and pineapple.', 'Strain.', 'Add yeast, sugar.', 'Ferment 24 hours.', 'Chill.']
    },
    nutrition: { calories: 150, protein: 0, carbs: 38, fats: 0, fiber: 1, sugar: 34, sodium: 5 }
  },
  {
    id: 'dr5', name: 'Tamarind Cooler', description: 'Tangy tamarind drink.',
    image: '/meals/tamarind cooler.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 cup Tamarind', 'pineapple skin', '1 kg sugar', '2 yeast', 'ginger', 'water'],
      method: ['Blend millet and pineapple.', 'Strain.', 'Add yeast, sugar.', 'Ferment 24 hours.', 'Chill.']
    },
    nutrition: { calories: 140, protein: 1, carbs: 38, fats: 0, fiber: 4, sugar: 34, sodium: 10 }
  },
  {
    id: 'dr6', name: 'Tamarind Juice', description: 'Traditional tamarind drink.',
    image: '/meals/tamarind juice.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 kg Tamarind', 'pineapple skin', '1 kg sugar', 'water'],
      method: ['Boil tamarind and pineapple.', 'Strain.', 'Add yeast, sugar.', 'Ferment 24 hours.', 'Chill.']
    },
    nutrition: { calories: 140, protein: 1, carbs: 38, fats: 0, fiber: 4, sugar: 34, sodium: 10 }
  },
  {
    id: 'dr7', name: 'Watermelon Cooler', description: 'Hydrating melon juice.',
    image: '/meals/watermelon juice.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['lemon juice', 'water'],
      method: ['Mix lemon juice and water.', 'Serve chilled.']
    },
    nutrition: { calories: 90, protein: 1, carbs: 22, fats: 0, fiber: 1, sugar: 20, sodium: 2 }
  },
  {
    id: 'dr8', name: 'Watermelon Juice', description: 'Pureed fresh watermelon.',
    image: '/meals/watermelon juice.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 watermelon'],
      method: ['Squeeze watermelon.', 'Serve immediately.']
    },
    nutrition: { calories: 80, protein: 1, carbs: 20, fats: 0, fiber: 1, sugar: 18, sodium: 2 }
  },
  {
    id: 'dr9', name: 'Watermelon Juice (Fresh)', description: 'Fresh watermelon juice.',
    image: '/meals/watermelon mint.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 watermelon'],
      method: ['Squeeze watermelon.', 'Serve immediately.']
    },
    nutrition: { calories: 80, protein: 1, carbs: 20, fats: 0, fiber: 1, sugar: 18, sodium: 2 }
  },
  {
    id: 'dr10', name: 'Folere (Hibiscus)', description: 'Red hibiscus tea.',
    image: '/meals/hibiscus drink.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['2 cups hibiscus', 'ginger', 'water'],
      method: ['Boil leaves with ginger.', 'Strain.', 'Serve as tea.']
    },
    nutrition: { calories: 110, protein: 0, carbs: 28, fats: 0, fiber: 1, sugar: 25, sodium: 5 }
  },
  {
    id: 'dr11', name: 'Folere (Iced Sweet)', description: 'Sweet hibiscus cooler.',
    image: '/meals/hibiscus pineapple.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['2 cups hibiscus', 'pineapple skin', '1 kg sugar', '2 tsp yeast', 'ginger', 'water'],
      method: ['Boil hibiscus, ginger, pineapple.', 'Strain.', 'Add yeast, sugar.', 'Ferment 24 hours.', 'Chill.']
    },
    nutrition: { calories: 120, protein: 0, carbs: 30, fats: 0, fiber: 2, sugar: 26, sodium: 8 }
  },
  {
    id: 'dr12', name: 'Folere (No Sugar)', description: 'Tart hibiscus infusion.',
    image: '/meals/hibiscus drink.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['2 cups hibiscus', 'ginger', 'water'],
      method: ['Boil leaves with ginger.', 'Strain.']
    },
    nutrition: { calories: 40, protein: 0, carbs: 10, fats: 0, fiber: 2, sugar: 2, sodium: 5 }
  },
  {
    id: 'dr13', name: 'Folere (Unsweetened Tea)', description: 'Hot hibiscus tea.',
    image: '/meals/hibiscus lemonade.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['2 cups hibiscus', 'ginger', 'water'],
      method: ['Boil leaves with ginger.', 'Strain.', 'Serve hot.']
    },
    nutrition: { calories: 35, protein: 0, carbs: 8, fats: 0, fiber: 1, sugar: 0, sodium: 2 }
  },
  {
    id: 'dr14', name: 'Folere Leaf Juice', description: 'Green hibiscus drink.',
    image: '/meals/hibiscus drink.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['4 bundles huckleberry', 'water', 'ginger', 'crayfish', '1/4 oil', 'salt'],
      method: ['Boil leaves with ginger, crayfish, oil.', 'Strain.', 'Heat oil.', 'Mix.']
    },
    nutrition: { calories: 85, protein: 1, carbs: 18, fats: 0, fiber: 3, sugar: 15, sodium: 10 }
  },
  {
    id: 'dr15', name: 'Ginger & Honey Brew', description: 'Warm soothing tea.',
    image: '/meals/ginger honey.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['ginger', 'honey', 'water'],
      method: ['Boil leaves.', 'Strain.', 'Heat oil.', 'Mix.', 'Serve as medicinal.']
    },
    nutrition: { calories: 50, protein: 0, carbs: 12, fats: 0, fiber: 1, sugar: 10, sodium: 2 }
  },
  {
    id: 'dr16', name: 'Ginger & Honey Tea', description: 'Soothing ginger brew.',
    image: '/meals/ginger tea.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['ginger', 'honey', 'tea'],
      method: ['Boil ginger and tea.', 'Strain.', 'Stir honey.']
    },
    nutrition: { calories: 55, protein: 0, carbs: 14, fats: 0, fiber: 1, sugar: 12, sodium: 2 }
  },
  {
    id: 'dr17', name: 'Ginger Juice (Djino)', description: 'Fresh ginger drink.',
    image: '/meals/ginger drink.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['ginger', 'pineapple skin', '1 kg sugar', 'water'],
      method: ['Blend ginger and pineapple.', 'Strain.', 'Add yeast, sugar.', 'Ferment 24 hours.', 'Chill.']
    },
    nutrition: { calories: 90, protein: 0, carbs: 24, fats: 0, fiber: 1, sugar: 22, sodium: 8 }
  },
  {
    id: 'dr18', name: 'Ginger Lemonade (Djino)', description: 'Zesty ginger cooler.',
    image: '/meals/ginger lemon.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['ginger', 'pineapple skin', '1 kg sugar', 'lemon', 'water'],
      method: ['Boil ginger and pineapple.', 'Strain.', 'Add yeast, sugar.', 'Ferment.', 'Add lemon.', 'Chill.']
    },
    nutrition: { calories: 95, protein: 0, carbs: 24, fats: 0, fiber: 1, sugar: 22, sodium: 5 }
  },
  {
    id: 'dr19', name: 'Fresh Orange Juice', description: 'Squeezed highland oranges.',
    image: '/meals/orange juice.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 kg oranges'],
      method: ['Squeeze oranges.', 'Serve immediately.']
    },
    nutrition: { calories: 110, protein: 2, carbs: 26, fats: 0, fiber: 1, sugar: 22, sodium: 2 }
  },
  {
    id: 'dr20', name: 'Guava & Pineapple Mix', description: 'Tropical fruit nectar.',
    image: '/meals/juice.jpg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 pineapple', '1 mango', 'water'],
      method: ['Blend fruits with water.', 'Strain.']
    },
    nutrition: { calories: 125, protein: 1, carbs: 30, fats: 0, fiber: 5, sugar: 26, sodium: 5 }
  },
  {
    id: 'dr21', name: 'Guava Juice', description: 'Aromatic guava drink.',
    image: '/meals/juice.jpg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 kg guava', 'pineapple skin', 'sugar', 'water'],
      method: ['Boil guava and pineapple.', 'Strain.', 'Add yeast, sugar.', 'Ferment 24 hours.', 'Chill.']
    },
    nutrition: { calories: 120, protein: 2, carbs: 30, fats: 0, fiber: 7, sugar: 25, sodium: 5 }
  },
  {
    id: 'dr22', name: 'Guava Nectar (Fresh)', description: 'High-fiber fruit drink.',
    image: '/meals/guava.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 kg guava', 'water'],
      method: ['Squeeze guava.', 'Serve immediately.']
    },
    nutrition: { calories: 130, protein: 2, carbs: 32, fats: 0, fiber: 9, sugar: 28, sodium: 5 }
  },
  {
    id: 'dr23', name: 'Hibiscus & Pineapple', description: 'Fruity folere blend.',
    image: '/meals/hibiscus drink.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['hibiscus', 'pineapple juice'],
      method: ['Boil hibiscus.', 'Mix with pineapple juice.', 'Chill.']
    },
    nutrition: { calories: 120, protein: 0, carbs: 30, fats: 0, fiber: 2, sugar: 26, sodium: 8 }
  },
  {
    id: 'dr24', name: 'Hibiscus Leaf Juice', description: 'Green hibiscus drink.',
    image: '/meals/juice.jpg',
    category: 'drinks',
    recipe: {
      ingredients: ['hibiscus leaves', 'lime', 'sugar'],
      method: ['Boil leaves.', 'Strain.', 'Add lime and sugar.']
    },
    nutrition: { calories: 85, protein: 1, carbs: 18, fats: 0, fiber: 3, sugar: 15, sodium: 10 }
  },
  {
    id: 'dr25', name: 'Hibiscus Lemonade', description: 'Floral citrus cooler.',
    image: '/meals/hibiscus drink.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['hibiscus', 'lemon', 'honey'],
      method: ['Make hibiscus tea.', 'Add lemon and honey.', 'Chill.']
    },
    nutrition: { calories: 85, protein: 0, carbs: 22, fats: 0, fiber: 1, sugar: 20, sodium: 5 }
  },
  {
    id: 'dr26', name: 'Hot Chocolate (Local)', description: 'Raw cocoa drink.',
    image: '/meals/Food.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 cup cocoa', 'water', 'milk', 'sugar'],
      method: ['Boil cocoa and milk.']
    },
    nutrition: { calories: 250, protein: 8, carbs: 30, fats: 12, fiber: 4, sugar: 22, sodium: 110 }
  },
  {
    id: 'dr27', name: 'Hot Ginger Tea', description: 'Spicy warming brew.',
    image: '/meals/Traditional Pakistani Chai.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['ginger', 'honey'],
      method: ['Boil ginger.', 'Strain.', 'Add honey.']
    },
    nutrition: { calories: 40, protein: 0, carbs: 10, fats: 0, fiber: 1, sugar: 8, sodium: 2 }
  },
  {
    id: 'dr28', name: 'Iced Coffee (Local)', description: 'Bamenda coffee over ice.',
    image: '/meals/coffee.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 cup coffee', 'water', 'milk', 'sugar', 'ice'],
      method: ['Boil coffee.', 'Strain.', 'Add milk and sugar.', 'Serve over ice.']
    },
    nutrition: { calories: 60, protein: 1, carbs: 10, fats: 2, fiber: 0, sugar: 8, sodium: 10 }
  },
  {
    id: 'dr29', name: 'Iced Lemon Tea', description: 'Cold citrus tea brew.',
    image: '/meals/Traditional Pakistani Chai.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['ginger', 'pineapple skin', 'sugar', 'tea', 'lemon', 'ice', 'water'],
      method: ['Boil ginger, pineapple, tea.', 'Strain.', 'Add yeast, sugar.', 'Ferment.', 'Add lemon, ice.']
    },
    nutrition: { calories: 60, protein: 0, carbs: 15, fats: 0, fiber: 1, sugar: 14, sodium: 5 }
  },
  {
    id: 'dr30', name: 'Iced Mint Tea', description: 'Refreshing mint drink.',
    image: '/meals/Traditional Pakistani Chai.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['4 bundles mint', 'water', 'ginger', 'crayfish', 'oil'],
      method: ['Boil mint with ginger.', 'Strain.', 'Heat oil.', 'Mix.']
    },
    nutrition: { calories: 60, protein: 0, carbs: 15, fats: 0, fiber: 0, sugar: 14, sodium: 2 }
  },
  {
    id: 'dr31', name: 'Lemon & Honey Brew', description: 'Soothing citrus tea.',
    image: '/meals/Food.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['lemon', 'honey', 'ginger', 'water'],
      method: ['Boil ginger.', 'Strain.', 'Stir honey and lemon.']
    },
    nutrition: { calories: 45, protein: 0, carbs: 12, fats: 0, fiber: 1, sugar: 10, sodium: 2 }
  },
  {
    id: 'dr32', name: 'Lemon Ginger Tea', description: 'Flu-fighting herbal tea.',
    image: '/meals/Traditional Pakistani Chai.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['ginger', 'lemon', 'honey'],
      method: ['Boil ginger.', 'Add lemon and honey.']
    },
    nutrition: { calories: 45, protein: 0, carbs: 12, fats: 0, fiber: 1, sugar: 8, sodium: 2 }
  },
  {
    id: 'dr33', name: 'Lemonade (Citronnelle)', description: 'Lemongrass infusion.',
    image: '/meals/lemonade.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['lemon', 'lemongrass', 'sugar'],
      method: ['Steep lemongrass.', 'Add lemon and sugar.']
    },
    nutrition: { calories: 80, protein: 0, carbs: 22, fats: 0, fiber: 1, sugar: 20, sodium: 5 }
  },
  {
    id: 'dr34', name: 'Lemonade (Local Style)', description: 'Sweet citrus drink.',
    image: '/meals/lemonade.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['lemons', 'water', 'sugar'],
      method: ['Mix lemon juice and sugar with water.', 'Serve chilled.']
    },
    nutrition: { calories: 90, protein: 0, carbs: 24, fats: 0, fiber: 1, sugar: 22, sodium: 5 }
  },
  {
    id: 'dr35', name: 'Local Cocoa Tea', description: 'Raw roasted cocoa tea.',
    image: '/meals/Traditional Pakistani Chai.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['cocoa husks', 'milk', 'honey'],
      method: ['Steep husks in milk.', 'Sweeten.']
    },
    nutrition: { calories: 120, protein: 4, carbs: 15, fats: 6, fiber: 3, sugar: 10, sodium: 45 }
  },
  {
    id: 'dr36', name: 'Local Coffee (Black)', description: 'Strong black coffee.',
    image: '/meals/coffee.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 cup coffee', 'water', 'sugar'],
      method: ['Boil coffee.', 'Strain.', 'Add sugar.']
    },
    nutrition: { calories: 5, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 2 }
  },
  {
    id: 'dr37', name: 'Local Coffee with Milk', description: 'Coffee with milk.',
    image: '/meals/coffee.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 cup coffee', 'water', 'milk', 'sugar'],
      method: ['Boil coffee.', 'Strain.', 'Add milk and sugar.']
    },
    nutrition: { calories: 60, protein: 2, carbs: 8, fats: 2, fiber: 0, sugar: 6, sodium: 15 }
  },
  {
    id: 'dr38', name: 'Mango & Banana Smoothie', description: 'Thick tropical blend.',
    image: '/meals/Mango yogurt bowl 🥭🍦.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 pineapple', '1 mango', 'water'],
      method: ['Blend fruits with water.', 'Strain.']
    },
    nutrition: { calories: 180, protein: 2, carbs: 45, fats: 1, fiber: 6, sugar: 38, sodium: 10 }
  },
  {
    id: 'dr39', name: 'Mango & Pineapple', description: 'Pure fruit nectar.',
    image: '/meals/Mango yogurt bowl 🥭🍦.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 pineapple', '1 mango', 'water'],
      method: ['Blend fruits.', 'Strain.']
    },
    nutrition: { calories: 140, protein: 1, carbs: 35, fats: 0, fiber: 4, sugar: 30, sodium: 5 }
  },
  {
    id: 'dr40', name: 'Mango & Yogurt Smoothie', description: 'Protein fruit blend.',
    image: '/meals/Mango yogurt bowl 🥭🍦.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['mango', 'yogurt', 'honey'],
      method: ['Blend mango with yogurt and honey.']
    },
    nutrition: { calories: 190, protein: 8, carbs: 35, fats: 4, fiber: 3, sugar: 30, sodium: 65 }
  },
  {
    id: 'dr41', name: 'Mango Nectar', description: 'Thick mango puree.',
    image: '/meals/Mango yogurt bowl 🥭🍦.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 kg mango', 'honey'],
      method: ['Blend mango.', 'Add honey.']
    },
    nutrition: { calories: 160, protein: 1, carbs: 42, fats: 0, fiber: 3, sugar: 38, sodium: 5 }
  },
  {
    id: 'dr42', name: 'Millet Drink (Kunnu)', description: 'Grain drink from North.',
    image: '/meals/Finger Millet.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 cup millet', 'pineapple skin', '1 kg sugar', '2 yeast', 'ginger', 'water'],
      method: ['Blend millet and pineapple.', 'Strain.', 'Add yeast, sugar.', 'Ferment 24 hours.', 'Chill.']
    },
    nutrition: { calories: 180, protein: 5, carbs: 35, fats: 3, fiber: 4, sugar: 12, sodium: 45 }
  },
  {
    id: 'dr43', name: 'Mint & Lime Water', description: 'Refreshing herbal water.',
    image: '/meals/citrus water.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['mint', 'lime', 'water'],
      method: ['Infuse water with mint and lime.']
    },
    nutrition: { calories: 20, protein: 0, carbs: 5, fats: 0, fiber: 1, sugar: 2, sodium: 5 }
  },
  {
    id: 'dr44', name: 'Minty Pineapple Juice', description: 'Fresh pineapple and mint.',
    image: '/meals/juice.jpg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 pineapple', 'mint'],
      method: ['Blend pineapple and mint.', 'Strain.', 'Chill.']
    },
    nutrition: { calories: 115, protein: 1, carbs: 28, fats: 0, fiber: 2, sugar: 24, sodium: 5 }
  },
  {
    id: 'dr45', name: 'Orange & Ginger Mix', description: 'Citrus with spicy kick.',
    image: '/meals/ginger drink.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['oranges', 'ginger', 'sugar'],
      method: ['Squeeze oranges.', 'Boil ginger.', 'Strain.', 'Mix with orange juice.']
    },
    nutrition: { calories: 100, protein: 2, carbs: 25, fats: 0, fiber: 2, sugar: 22, sodium: 2 }
  },
  {
    id: 'dr46', name: 'Palm Wine (Matango)', description: 'Natural fermented sap.',
    image: '/meals/palm wine.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['palm sap'],
      method: ['Tap from tree.', 'Serve fresh.']
    },
    nutrition: { calories: 150, protein: 1, carbs: 15, fats: 0, fiber: 0, sugar: 12, sodium: 12 }
  },
  {
    id: 'dr47', name: 'Palm Wine (Natural)', description: 'Fresh palm sap.',
    image: '/meals/palm wine.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['palm wine'],
      method: ['Squeeze fresh palm wine.', 'Serve immediately.']
    },
    nutrition: { calories: 150, protein: 1, carbs: 15, fats: 0, fiber: 0, sugar: 12, sodium: 12 }
  },
  {
    id: 'dr48', name: 'Papaya & Lime Juice', description: 'Cold pressed papaya.',
    image: '/meals/Papaya and Lime.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['papaya', 'lime'],
      method: ['Squeeze papaya.', 'Add lime.', 'Chill.']
    },
    nutrition: { calories: 110, protein: 1, carbs: 28, fats: 0, fiber: 5, sugar: 24, sodium: 10 }
  },
  {
    id: 'dr49', name: 'Papaya Smoothie', description: 'Papaya and lime blend.',
    image: '/meals/Papaya and Lime.jpeg',
    category: 'drinks',
    recipe: {
      ingredients: ['papaya', 'lime', 'honey'],
      method: ['Blend papaya.', 'Add lime and honey.']
    },
    nutrition: { calories: 150, protein: 1, carbs: 38, fats: 0, fiber: 5, sugar: 32, sodium: 10 }
  },
  {
    id: 'dr50', name: 'Passion Fruit Juice', description: 'Aromatic tart juice.',
    image: '/meals/juice.jpg',
    category: 'drinks',
    recipe: {
      ingredients: ['1 kg passion fruit', 'pineapple skin', '1 kg sugar', 'water'],
      method: ['Boil fruit and pineapple.', 'Strain.', 'Add yeast, sugar.', 'Ferment 24 hours.', 'Chill.']
    },
    nutrition: { calories: 110, protein: 1, carbs: 28, fats: 0, fiber: 4, sugar: 24, sodium: 5 }
  }
];

export const MEAL_CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snacks', 'drinks'] as const;
export type MealCategory = typeof MEAL_CATEGORIES[number];