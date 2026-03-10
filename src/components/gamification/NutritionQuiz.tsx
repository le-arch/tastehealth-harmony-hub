import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, CheckCircle, XCircle, Trophy, RotateCcw, Shuffle } from 'lucide-react';
import { getLS, setLS, LS_KEYS, PointsTransaction } from '@/utils/localStorage';
import Confetti from '@/components/Confetti';
import { playMilestoneSound } from '@/utils/sounds';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuizQuestion { id: string; question: string; options: string[]; correct: number; explanation: string; }

const QUIZ_SETS: Record<string, QuizQuestion[]> = {
  'Vitamins & Minerals': [
    { id: 'vm1', question: 'Which vitamin is primarily obtained from sunlight?', options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K'], correct: 2, explanation: 'Vitamin D is synthesized in the skin upon exposure to UVB radiation.' },
    { id: 'vm2', question: 'What mineral is essential for bone health?', options: ['Iron', 'Calcium', 'Zinc', 'Potassium'], correct: 1, explanation: 'Calcium is the primary mineral for bone structure.' },
    { id: 'vm3', question: 'Which vitamin helps with iron absorption?', options: ['Vitamin A', 'Vitamin C', 'Vitamin E', 'Vitamin B12'], correct: 1, explanation: 'Vitamin C enhances non-heme iron absorption from plant foods.' },
    { id: 'vm4', question: 'What mineral deficiency causes anemia?', options: ['Calcium', 'Magnesium', 'Iron', 'Zinc'], correct: 2, explanation: 'Iron deficiency is the most common cause of anemia worldwide.' },
    { id: 'vm5', question: 'Which B vitamin is crucial during pregnancy?', options: ['B1', 'B6', 'B9 (Folate)', 'B12'], correct: 2, explanation: 'Folate prevents neural tube defects in developing babies.' },
    { id: 'vm6', question: 'Where do you get most Vitamin K?', options: ['Dairy', 'Leafy greens', 'Meat', 'Grains'], correct: 1, explanation: 'Dark leafy greens like kale and spinach are rich in Vitamin K.' },
    { id: 'vm7', question: 'Which mineral regulates heartbeat?', options: ['Sodium', 'Calcium', 'Potassium', 'Iron'], correct: 2, explanation: 'Potassium helps maintain a regular heartbeat and muscle function.' },
    { id: 'vm8', question: 'What is the best food source of Vitamin E?', options: ['Citrus fruits', 'Almonds', 'Chicken', 'Rice'], correct: 1, explanation: 'Almonds and sunflower seeds are excellent sources of Vitamin E.' },
    { id: 'vm9', question: 'Which vitamin is important for vision?', options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'], correct: 0, explanation: 'Vitamin A is essential for maintaining healthy vision, especially night vision.' },
    { id: 'vm10', question: 'What mineral strengthens tooth enamel?', options: ['Calcium', 'Fluoride', 'Iron', 'Zinc'], correct: 1, explanation: 'Fluoride helps remineralize and strengthen tooth enamel.' },
    { id: 'vm11', question: 'Which vitamin acts as an antioxidant?', options: ['Vitamin D', 'Vitamin K', 'Vitamin E', 'Vitamin B1'], correct: 2, explanation: 'Vitamin E protects cells from oxidative damage as a fat-soluble antioxidant.' },
    { id: 'vm12', question: 'What mineral is important for thyroid function?', options: ['Zinc', 'Iodine', 'Iron', 'Calcium'], correct: 1, explanation: 'Iodine is essential for producing thyroid hormones.' },
  ],
  'Macronutrients': [
    { id: 'mn1', question: 'Which macronutrient has the most calories per gram?', options: ['Protein', 'Carbohydrates', 'Fat', 'Fiber'], correct: 2, explanation: 'Fat provides 9 calories per gram vs 4 for protein and carbs.' },
    { id: 'mn2', question: 'Which nutrient builds and repairs muscle?', options: ['Vitamin C', 'Carbohydrates', 'Protein', 'Fat'], correct: 2, explanation: 'Protein provides amino acids for muscle repair.' },
    { id: 'mn3', question: 'What % of daily calories should come from carbs?', options: ['10-20%', '25-35%', '45-65%', '70-80%'], correct: 2, explanation: 'Guidelines recommend 45-65% from carbohydrates.' },
    { id: 'mn4', question: 'Which is a complete protein source?', options: ['Rice', 'Beans', 'Quinoa', 'Corn'], correct: 2, explanation: 'Quinoa has all 9 essential amino acids.' },
    { id: 'mn5', question: 'How many essential amino acids exist?', options: ['6', '9', '12', '20'], correct: 1, explanation: 'There are 9 essential amino acids that must come from food.' },
    { id: 'mn6', question: 'What type of fat is heart-healthy?', options: ['Saturated', 'Trans', 'Monounsaturated', 'Hydrogenated'], correct: 2, explanation: 'Monounsaturated fats (olive oil, avocado) support heart health.' },
    { id: 'mn7', question: 'What is the recommended daily protein intake per kg?', options: ['0.4g', '0.8g', '1.5g', '3.0g'], correct: 1, explanation: 'The RDA for protein is 0.8g per kg of body weight for adults.' },
    { id: 'mn8', question: 'Which carb type provides sustained energy?', options: ['Simple sugars', 'Complex carbs', 'Fructose', 'Glucose'], correct: 1, explanation: 'Complex carbs are digested slowly, providing sustained energy.' },
    { id: 'mn9', question: 'Which food has the highest protein per 100g?', options: ['Chicken breast', 'Tofu', 'Eggs', 'Greek yogurt'], correct: 0, explanation: 'Chicken breast has about 31g protein per 100g.' },
    { id: 'mn10', question: 'What are trans fats commonly found in?', options: ['Olive oil', 'Processed foods', 'Fresh fruit', 'Vegetables'], correct: 1, explanation: 'Trans fats are commonly found in processed and fried foods.' },
    { id: 'mn11', question: 'How many calories does 1g of protein provide?', options: ['2 kcal', '4 kcal', '7 kcal', '9 kcal'], correct: 1, explanation: 'Protein provides 4 calories per gram.' },
    { id: 'mn12', question: 'Which food is highest in healthy fats?', options: ['Banana', 'Avocado', 'Apple', 'Bread'], correct: 1, explanation: 'Avocados are rich in heart-healthy monounsaturated fats.' },
  ],
  'Hydration & Wellness': [
    { id: 'hw1', question: 'How many glasses of water should you drink daily?', options: ['4 glasses', '6 glasses', '8 glasses', '12 glasses'], correct: 2, explanation: 'The general recommendation is about 8 glasses (2 liters) per day.' },
    { id: 'hw2', question: 'How many hours of sleep do adults need?', options: ['4-5 hours', '5-6 hours', '7-9 hours', '10-12 hours'], correct: 2, explanation: 'Most adults need 7-9 hours per night.' },
    { id: 'hw3', question: 'What % of your body is water?', options: ['30%', '45%', '60%', '80%'], correct: 2, explanation: 'The human body is approximately 60% water.' },
    { id: 'hw4', question: 'When is the best time to drink water?', options: ['Only at meals', 'Before meals', 'Only when thirsty', 'Never'], correct: 1, explanation: 'Drinking water 30 min before meals aids digestion and hydration.' },
    { id: 'hw5', question: 'Which drink is most hydrating?', options: ['Coffee', 'Soda', 'Water', 'Energy drinks'], correct: 2, explanation: 'Water is the most effective hydrating beverage.' },
    { id: 'hw6', question: 'How much does mild dehydration affect performance?', options: ['5%', '10%', '15-25%', '50%'], correct: 2, explanation: 'Even 1-2% dehydration can reduce cognitive and physical performance by 15-25%.' },
    { id: 'hw7', question: 'Which fruit has the highest water content?', options: ['Apple', 'Banana', 'Watermelon', 'Grape'], correct: 2, explanation: 'Watermelon is about 92% water.' },
    { id: 'hw8', question: 'What is a sign of dehydration?', options: ['Clear urine', 'Dark yellow urine', 'Sweating', 'Cold hands'], correct: 1, explanation: 'Dark yellow urine is a common sign of dehydration.' },
    { id: 'hw9', question: 'How much water do you lose during exercise?', options: ['0.2L/hr', '0.5-1L/hr', '2L/hr', '3L/hr'], correct: 1, explanation: 'You can lose 0.5-1 liter of water per hour during moderate exercise.' },
    { id: 'hw10', question: 'Which electrolyte is lost most in sweat?', options: ['Calcium', 'Potassium', 'Sodium', 'Magnesium'], correct: 2, explanation: 'Sodium is the primary electrolyte lost through sweat.' },
    { id: 'hw11', question: 'What is the best recovery drink after exercise?', options: ['Soda', 'Coffee', 'Chocolate milk', 'Energy drink'], correct: 2, explanation: 'Chocolate milk has an ideal ratio of carbs to protein for recovery.' },
    { id: 'hw12', question: 'How long before bed should you stop caffeine?', options: ['2 hours', '4 hours', '6 hours', '8 hours'], correct: 2, explanation: 'Caffeine has a half-life of ~6 hours, so stop 6+ hours before bed.' },
  ],
  'Superfoods & Diet': [
    { id: 'sd1', question: 'Which food is the best source of omega-3?', options: ['Chicken', 'Salmon', 'Rice', 'Bread'], correct: 1, explanation: 'Fatty fish like salmon are richest in omega-3.' },
    { id: 'sd2', question: 'What is the recommended daily fiber intake?', options: ['10-15g', '15-20g', '25-30g', '40-50g'], correct: 2, explanation: 'Adults should aim for 25-30g of fiber daily.' },
    { id: 'sd3', question: 'Which fruit has the highest potassium?', options: ['Apple', 'Orange', 'Banana', 'Grape'], correct: 2, explanation: 'Bananas have ~422mg potassium per medium banana.' },
    { id: 'sd4', question: 'What is the healthiest oil for high-heat cooking?', options: ['Butter', 'Olive oil', 'Avocado oil', 'Coconut oil'], correct: 2, explanation: 'Avocado oil has the highest smoke point (~520°F).' },
    { id: 'sd5', question: 'Which spice has anti-inflammatory properties?', options: ['Salt', 'Turmeric', 'Pepper', 'Paprika'], correct: 1, explanation: 'Turmeric contains curcumin, a powerful anti-inflammatory compound.' },
    { id: 'sd6', question: 'What superfood is highest in antioxidants?', options: ['Kale', 'Blueberries', 'Spinach', 'Broccoli'], correct: 1, explanation: 'Blueberries have one of the highest antioxidant capacities of all fruits.' },
    { id: 'sd7', question: 'Which nut is highest in protein?', options: ['Cashews', 'Almonds', 'Peanuts', 'Walnuts'], correct: 2, explanation: 'Peanuts have about 26g protein per 100g.' },
    { id: 'sd8', question: 'What is a prebiotic food?', options: ['Yogurt', 'Garlic', 'Chicken', 'Rice'], correct: 1, explanation: 'Garlic contains inulin, a prebiotic fiber that feeds beneficial gut bacteria.' },
    { id: 'sd9', question: 'Which vegetable has the most Vitamin C?', options: ['Carrot', 'Broccoli', 'Red bell pepper', 'Lettuce'], correct: 2, explanation: 'Red bell peppers have about 190mg Vitamin C per cup, more than oranges.' },
    { id: 'sd10', question: 'What makes dark chocolate healthy?', options: ['Sugar', 'Milk', 'Flavanols', 'Caffeine'], correct: 2, explanation: 'Flavanols in dark chocolate have antioxidant and heart-protective effects.' },
    { id: 'sd11', question: 'Which grain is gluten-free?', options: ['Wheat', 'Barley', 'Quinoa', 'Rye'], correct: 2, explanation: 'Quinoa is naturally gluten-free and rich in protein.' },
    { id: 'sd12', question: 'What food is a natural probiotic?', options: ['Bread', 'Yogurt', 'Pasta', 'Rice'], correct: 1, explanation: 'Yogurt contains live beneficial bacteria cultures.' },
  ],
  'Meal Planning': [
    { id: 'mp1', question: 'How many meals per day is generally recommended?', options: ['1-2', '3-5', '6-8', '10+'], correct: 1, explanation: '3 meals with 1-2 snacks is a common recommendation.' },
    { id: 'mp2', question: 'What should a balanced plate look like?', options: ['All protein', '½ veggies, ¼ protein, ¼ grains', 'All carbs', '½ protein, ½ carbs'], correct: 1, explanation: 'The MyPlate model recommends ½ vegetables/fruits, ¼ protein, ¼ grains.' },
    { id: 'mp3', question: 'When should you eat your biggest meal?', options: ['Breakfast', 'Lunch', 'Dinner', 'Midnight'], correct: 1, explanation: 'Eating your largest meal at lunch aligns with your circadian rhythm.' },
    { id: 'mp4', question: 'How far in advance should you meal prep?', options: ['1 day', '3-5 days', '2 weeks', '1 month'], correct: 1, explanation: '3-5 days ensures food stays fresh while saving time.' },
    { id: 'mp5', question: 'What is portion distortion?', options: ['Eating too little', 'Underestimating portion sizes', 'Skipping meals', 'Eating too fast'], correct: 1, explanation: 'Portion distortion is the tendency to underestimate serving sizes.' },
    { id: 'mp6', question: 'Best pre-workout meal timing?', options: ['Right before', '1-2 hours before', '4 hours before', 'After workout'], correct: 1, explanation: 'Eating 1-2 hours before exercise provides optimal energy.' },
    { id: 'mp7', question: 'How long do cooked meals last in the fridge?', options: ['1 day', '3-4 days', '2 weeks', '1 month'], correct: 1, explanation: 'Most cooked meals are safe for 3-4 days when properly refrigerated.' },
    { id: 'mp8', question: 'What should you eat for recovery after exercise?', options: ['Just water', 'Protein + carbs', 'Only fat', 'Nothing'], correct: 1, explanation: 'A mix of protein and carbs within 30-60 min aids recovery.' },
    { id: 'mp9', question: 'How can you reduce food waste?', options: ['Buy more', 'Plan meals ahead', 'Cook extra', 'Ignore expiry'], correct: 1, explanation: 'Meal planning reduces impulse buying and food waste.' },
    { id: 'mp10', question: 'What is intermittent fasting?', options: ['Never eating', 'Cycling eating/fasting periods', 'Only eating once', 'Eating nonstop'], correct: 1, explanation: 'IF cycles between eating and fasting windows (e.g., 16:8).' },
    { id: 'mp11', question: 'Best snack for sustained energy?', options: ['Candy bar', 'Apple with peanut butter', 'Chips', 'Soda'], correct: 1, explanation: 'Apple + peanut butter combines fiber, natural sugar, protein and healthy fats.' },
    { id: 'mp12', question: 'How much sodium per day is recommended?', options: ['500mg', '1500mg', '2300mg', '5000mg'], correct: 2, explanation: 'The AHA recommends no more than 2300mg sodium per day.' },
  ],
  'Weight Management': [
    { id: 'wm1', question: 'How many calories equal 1 pound of fat?', options: ['1000', '2500', '3500', '5000'], correct: 2, explanation: 'Approximately 3500 calories equals one pound of body fat.' },
    { id: 'wm2', question: 'What is a healthy rate of weight loss?', options: ['5 lbs/week', '1-2 lbs/week', '10 lbs/week', '0.1 lb/week'], correct: 1, explanation: 'Losing 1-2 pounds per week is considered safe and sustainable.' },
    { id: 'wm3', question: 'What is BMR?', options: ['Body Mass Rate', 'Basal Metabolic Rate', 'Body Muscle Ratio', 'Basic Meal Requirement'], correct: 1, explanation: 'BMR is the number of calories your body burns at rest.' },
    { id: 'wm4', question: 'Which has more impact on weight loss?', options: ['Exercise alone', 'Diet alone', 'Both equally', 'Neither'], correct: 1, explanation: 'Diet has a greater impact on weight loss than exercise alone.' },
    { id: 'wm5', question: 'What is a caloric deficit?', options: ['Eating more', 'Burning more than you eat', 'Eating exact amount', 'Skipping meals'], correct: 1, explanation: 'A caloric deficit means burning more calories than you consume.' },
    { id: 'wm6', question: 'Does muscle weigh more than fat?', options: ['Yes', 'No', 'Same weight', 'Depends on age'], correct: 0, explanation: 'Muscle is denser than fat, so it weighs more per unit of volume.' },
    { id: 'wm7', question: 'What is the thermic effect of food?', options: ['Food temperature', 'Calories burned digesting', 'Spicy food effect', 'Cooking heat'], correct: 1, explanation: 'TEF is the energy used to digest, absorb, and metabolize nutrients.' },
    { id: 'wm8', question: 'Which macronutrient has the highest thermic effect?', options: ['Fat', 'Carbs', 'Protein', 'Alcohol'], correct: 2, explanation: 'Protein uses 20-30% of its calories for digestion vs 5-10% for carbs.' },
    { id: 'wm9', question: 'What is a weight loss plateau?', options: ['Gaining weight', 'Rapid loss', 'Stalled progress', 'Perfect weight'], correct: 2, explanation: 'A plateau is when weight loss stalls despite continued effort.' },
    { id: 'wm10', question: 'Best way to break a plateau?', options: ['Eat less', 'Change routine', 'Give up', 'Skip meals'], correct: 1, explanation: 'Varying your exercise and diet routine can help overcome plateaus.' },
    { id: 'wm11', question: 'What affects metabolism most?', options: ['Age', 'Muscle mass', 'Gender', 'All of these'], correct: 3, explanation: 'Age, muscle mass, and gender all significantly affect metabolic rate.' },
    { id: 'wm12', question: 'Is spot reduction of fat possible?', options: ['Yes, with exercises', 'No, fat loss is overall', 'Only with supplements', 'Only with surgery'], correct: 1, explanation: 'You cannot target fat loss in specific areas through exercise alone.' },
  ],
  'Food Safety': [
    { id: 'fs1', question: 'At what temperature should a fridge be?', options: ['0°C', '4°C', '10°C', '15°C'], correct: 1, explanation: 'Refrigerators should be kept at 4°C (40°F) or below.' },
    { id: 'fs2', question: 'How long can cooked food sit at room temp?', options: ['30 min', '2 hours', '6 hours', '12 hours'], correct: 1, explanation: 'The "2-hour rule" states perishable food shouldn\'t sit out over 2 hours.' },
    { id: 'fs3', question: 'What is the danger zone temperature?', options: ['0-10°C', '4-60°C', '60-100°C', '100°C+'], correct: 1, explanation: 'Bacteria grow rapidly between 4-60°C (40-140°F).' },
    { id: 'fs4', question: 'How should you thaw frozen meat?', options: ['On counter', 'In fridge', 'In sun', 'In warm water'], correct: 1, explanation: 'Thawing in the refrigerator is the safest method.' },
    { id: 'fs5', question: 'What temp should chicken be cooked to?', options: ['55°C', '65°C', '74°C', '85°C'], correct: 2, explanation: 'Chicken must reach 74°C (165°F) internal temperature.' },
    { id: 'fs6', question: 'How long do eggs last in the fridge?', options: ['1 week', '3-5 weeks', '3 months', '6 months'], correct: 1, explanation: 'Fresh eggs last 3-5 weeks in the refrigerator.' },
    { id: 'fs7', question: 'Which surface harbors the most bacteria?', options: ['Cutting board', 'Counter', 'Fridge handle', 'Kitchen sponge'], correct: 3, explanation: 'Kitchen sponges can harbor millions of bacteria per square inch.' },
    { id: 'fs8', question: 'Should you wash raw chicken?', options: ['Always', 'Never', 'Sometimes', 'Only organic'], correct: 1, explanation: 'Washing raw chicken spreads bacteria; cooking kills them.' },
    { id: 'fs9', question: 'How long should you wash hands?', options: ['5 seconds', '10 seconds', '20 seconds', '60 seconds'], correct: 2, explanation: 'Wash hands for at least 20 seconds with soap and water.' },
    { id: 'fs10', question: 'Can you refreeze thawed meat?', options: ['Yes always', 'Only if thawed in fridge', 'Never', 'Only if cooked'], correct: 1, explanation: 'Meat thawed in the refrigerator can be safely refrozen.' },
    { id: 'fs11', question: 'What causes most food poisoning?', options: ['Chemicals', 'Bacteria', 'Allergens', 'Spices'], correct: 1, explanation: 'Bacteria like Salmonella and E. coli cause most foodborne illness.' },
    { id: 'fs12', question: 'Best practice for leftover rice?', options: ['Leave on counter', 'Cool quickly, refrigerate', 'Reheat once', 'Eat cold'], correct: 1, explanation: 'Cool rice quickly and refrigerate to prevent Bacillus cereus growth.' },
  ],
  'Digestive Health': [
    { id: 'dh1', question: 'What is the gut microbiome?', options: ['A diet plan', 'Gut bacteria ecosystem', 'A supplement', 'An organ'], correct: 1, explanation: 'The gut microbiome is the community of trillions of microorganisms in your digestive tract.' },
    { id: 'dh2', question: 'Which food is best for gut health?', options: ['Candy', 'Kimchi', 'White bread', 'Soda'], correct: 1, explanation: 'Fermented foods like kimchi provide beneficial probiotics.' },
    { id: 'dh3', question: 'What is the role of fiber in digestion?', options: ['Slows digestion', 'Adds bulk to stool', 'Reduces nutrients', 'Nothing'], correct: 1, explanation: 'Fiber adds bulk to stool and promotes regular bowel movements.' },
    { id: 'dh4', question: 'How long does digestion take?', options: ['1-2 hours', '6-8 hours', '24-72 hours', '1 week'], correct: 2, explanation: 'Complete digestion can take 24-72 hours from eating to elimination.' },
    { id: 'dh5', question: 'What enzyme breaks down protein?', options: ['Amylase', 'Lipase', 'Pepsin', 'Lactase'], correct: 2, explanation: 'Pepsin is the main enzyme for protein digestion in the stomach.' },
    { id: 'dh6', question: 'Where are most nutrients absorbed?', options: ['Stomach', 'Small intestine', 'Large intestine', 'Mouth'], correct: 1, explanation: 'The small intestine is where most nutrient absorption occurs.' },
    { id: 'dh7', question: 'What causes bloating?', options: ['Exercise', 'Gas production', 'Sleeping', 'Reading'], correct: 1, explanation: 'Bloating is often caused by excess gas production during digestion.' },
    { id: 'dh8', question: 'Which helps with lactose intolerance?', options: ['More milk', 'Lactase enzyme', 'Antibiotics', 'Fasting'], correct: 1, explanation: 'Lactase supplements help digest lactose in dairy products.' },
    { id: 'dh9', question: 'Best food for constipation?', options: ['Cheese', 'Prunes', 'White rice', 'Bananas'], correct: 1, explanation: 'Prunes contain sorbitol and fiber, natural laxative compounds.' },
    { id: 'dh10', question: 'What is leaky gut?', options: ['Stomach leak', 'Increased intestinal permeability', 'Food allergy', 'Ulcer'], correct: 1, explanation: 'Leaky gut refers to increased intestinal permeability allowing substances to pass through.' },
    { id: 'dh11', question: 'How many bacteria are in your gut?', options: ['Thousands', 'Millions', 'Billions', 'Trillions'], correct: 3, explanation: 'Your gut contains approximately 100 trillion bacteria.' },
    { id: 'dh12', question: 'Which tea aids digestion?', options: ['Black tea', 'Peppermint tea', 'Sweet tea', 'Bubble tea'], correct: 1, explanation: 'Peppermint tea relaxes digestive muscles and reduces bloating.' },
  ],
  'Sports Nutrition': [
    { id: 'sn1', question: 'Best pre-workout fuel?', options: ['Steak', 'Banana + oats', 'Ice cream', 'Salad'], correct: 1, explanation: 'Banana and oats provide quick and sustained energy for workouts.' },
    { id: 'sn2', question: 'When is the anabolic window?', options: ['Before workout', '30-60 min after', '4 hours after', 'Next day'], correct: 1, explanation: 'The 30-60 minutes post-workout is optimal for protein synthesis.' },
    { id: 'sn3', question: 'How much protein after a workout?', options: ['5g', '10g', '20-40g', '100g'], correct: 2, explanation: '20-40g of protein post-workout maximizes muscle protein synthesis.' },
    { id: 'sn4', question: 'What is carb loading?', options: ['Avoiding carbs', 'Eating extra carbs before endurance events', 'Low carb diet', 'Eating candy'], correct: 1, explanation: 'Carb loading maximizes glycogen stores before endurance events.' },
    { id: 'sn5', question: 'Do athletes need more protein?', options: ['No', 'Yes, 1.2-2.0g/kg', 'Only bodybuilders', 'Only runners'], correct: 1, explanation: 'Athletes need 1.2-2.0g protein per kg body weight.' },
    { id: 'sn6', question: 'Best hydration for sports over 1 hour?', options: ['Water only', 'Sports drink with electrolytes', 'Energy drink', 'Juice'], correct: 1, explanation: 'Sports drinks replace electrolytes and provide carbs for exercise over 1 hour.' },
    { id: 'sn7', question: 'What is DOMS?', options: ['A diet', 'Delayed muscle soreness', 'A supplement', 'An exercise'], correct: 1, explanation: 'DOMS (Delayed Onset Muscle Soreness) peaks 24-72 hours after exercise.' },
    { id: 'sn8', question: 'Which nutrient helps reduce inflammation?', options: ['Sugar', 'Omega-3', 'Sodium', 'Caffeine'], correct: 1, explanation: 'Omega-3 fatty acids have natural anti-inflammatory properties.' },
    { id: 'sn9', question: 'Best natural energy booster?', options: ['Sugar', 'Caffeine', 'Complex carbs', 'Fat'], correct: 2, explanation: 'Complex carbs provide sustained energy without crashes.' },
    { id: 'sn10', question: 'How does creatine work?', options: ['Burns fat', 'Increases ATP production', 'Reduces appetite', 'Builds bone'], correct: 1, explanation: 'Creatine helps regenerate ATP, the body\'s primary energy currency.' },
    { id: 'sn11', question: 'What is glycogen?', options: ['A protein', 'Stored form of glucose', 'A vitamin', 'A mineral'], correct: 1, explanation: 'Glycogen is how the body stores glucose in muscles and liver.' },
    { id: 'sn12', question: 'Best food for endurance?', options: ['Steak', 'Pasta', 'Salad', 'Protein shake'], correct: 1, explanation: 'Pasta and complex carbs are staple endurance foods for glycogen loading.' },
  ],
  'Healthy Aging': [
    { id: 'ha1', question: 'Which nutrient supports brain health in aging?', options: ['Sugar', 'Omega-3 DHA', 'Sodium', 'Trans fats'], correct: 1, explanation: 'DHA omega-3 is crucial for maintaining brain function in aging.' },
    { id: 'ha2', question: 'How does caloric need change with age?', options: ['Increases', 'Decreases', 'Stays same', 'Doubles'], correct: 1, explanation: 'Metabolic rate decreases with age, reducing caloric needs.' },
    { id: 'ha3', question: 'Best exercise for bone density?', options: ['Swimming', 'Weight-bearing exercise', 'Yoga only', 'Stretching'], correct: 1, explanation: 'Weight-bearing exercises like walking and lifting help maintain bone density.' },
    { id: 'ha4', question: 'Which antioxidant fights aging?', options: ['Sodium', 'Resveratrol', 'Cholesterol', 'Glucose'], correct: 1, explanation: 'Resveratrol, found in grapes and berries, has anti-aging properties.' },
    { id: 'ha5', question: 'What vitamin do seniors often lack?', options: ['Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin K'], correct: 1, explanation: 'B12 absorption decreases with age, making deficiency common in seniors.' },
    { id: 'ha6', question: 'How does protein need change after 50?', options: ['Decreases', 'Increases to 1.0-1.2g/kg', 'Stays same', 'Not needed'], correct: 1, explanation: 'Protein needs increase after 50 to prevent muscle loss (sarcopenia).' },
    { id: 'ha7', question: 'Best food for eye health?', options: ['Bread', 'Carrots and leafy greens', 'Pasta', 'Rice'], correct: 1, explanation: 'Carrots (beta-carotene) and leafy greens (lutein) support eye health.' },
    { id: 'ha8', question: 'What is sarcopenia?', options: ['Bone loss', 'Age-related muscle loss', 'Fat gain', 'Joint pain'], correct: 1, explanation: 'Sarcopenia is the progressive loss of muscle mass with aging.' },
    { id: 'ha9', question: 'Which diet pattern promotes longevity?', options: ['Fast food', 'Mediterranean diet', 'All-meat diet', 'Juice only'], correct: 1, explanation: 'The Mediterranean diet is associated with longer lifespan and less disease.' },
    { id: 'ha10', question: 'How much calcium do adults 50+ need daily?', options: ['500mg', '800mg', '1200mg', '2000mg'], correct: 2, explanation: 'Adults over 50 need about 1200mg of calcium daily for bone health.' },
    { id: 'ha11', question: 'What food helps memory?', options: ['Chips', 'Blueberries', 'Candy', 'Soda'], correct: 1, explanation: 'Blueberries contain flavonoids that improve memory and cognitive function.' },
    { id: 'ha12', question: 'Best way to maintain muscle after 60?', options: ['Rest only', 'Resistance training + protein', 'Cardio only', 'Supplements only'], correct: 1, explanation: 'Combining resistance training with adequate protein best preserves muscle.' },
  ],
  'Mental Health & Nutrition': [
    { id: 'mh1', question: 'Which nutrient is linked to mood?', options: ['Sodium', 'Serotonin precursor tryptophan', 'Chloride', 'Fluoride'], correct: 1, explanation: 'Tryptophan is converted to serotonin, the "happiness" neurotransmitter.' },
    { id: 'mh2', question: 'Best food for reducing anxiety?', options: ['Coffee', 'Dark chocolate', 'Energy drinks', 'Candy'], correct: 1, explanation: 'Dark chocolate contains magnesium and flavonoids that reduce stress hormones.' },
    { id: 'mh3', question: 'Does gut health affect mood?', options: ['No', 'Yes, via gut-brain axis', 'Only in children', 'Unknown'], correct: 1, explanation: '95% of serotonin is produced in the gut, directly affecting mood.' },
    { id: 'mh4', question: 'Which vitamin deficiency causes depression?', options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K'], correct: 2, explanation: 'Vitamin D deficiency is strongly linked to depression and mood disorders.' },
    { id: 'mh5', question: 'Best food for stress relief?', options: ['Fried food', 'Fatty fish', 'Sugary drinks', 'Alcohol'], correct: 1, explanation: 'Omega-3s in fatty fish reduce cortisol and inflammation linked to stress.' },
    { id: 'mh6', question: 'How does sugar affect mood?', options: ['Stabilizes it', 'Causes crashes', 'No effect', 'Always improves'], correct: 1, explanation: 'Sugar causes rapid blood sugar spikes followed by crashes, worsening mood.' },
    { id: 'mh7', question: 'Which mineral helps with sleep?', options: ['Iron', 'Magnesium', 'Sodium', 'Calcium'], correct: 1, explanation: 'Magnesium helps regulate neurotransmitters and melatonin for better sleep.' },
    { id: 'mh8', question: 'Best breakfast for mental clarity?', options: ['Sugary cereal', 'Eggs and avocado', 'Donuts', 'Skip breakfast'], correct: 1, explanation: 'Protein and healthy fats provide sustained energy for mental focus.' },
    { id: 'mh9', question: 'Does caffeine affect anxiety?', options: ['No', 'Yes, can increase it', 'Reduces it', 'Only in children'], correct: 1, explanation: 'Caffeine stimulates the nervous system and can worsen anxiety symptoms.' },
    { id: 'mh10', question: 'Which herb helps with relaxation?', options: ['Basil', 'Chamomile', 'Oregano', 'Thyme'], correct: 1, explanation: 'Chamomile contains apigenin, which has calming and anxiety-reducing effects.' },
    { id: 'mh11', question: 'Best food for brain fog?', options: ['Processed snacks', 'Walnuts', 'White bread', 'Soda'], correct: 1, explanation: 'Walnuts are rich in DHA and vitamin E, supporting cognitive function.' },
    { id: 'mh12', question: 'How does alcohol affect sleep quality?', options: ['Improves it', 'Disrupts REM sleep', 'No effect', 'Helps deep sleep'], correct: 1, explanation: 'Alcohol disrupts REM sleep, reducing overall sleep quality.' },
  ],
  'Children\'s Nutrition': [
    { id: 'cn1', question: 'How much milk should toddlers drink daily?', options: ['1 cup', '2 cups', '4 cups', '6 cups'], correct: 1, explanation: 'Toddlers should drink about 2 cups of milk daily for calcium and vitamin D.' },
    { id: 'cn2', question: 'At what age can babies eat solid food?', options: ['2 months', '4-6 months', '1 year', '2 years'], correct: 1, explanation: 'Most babies are ready for solid foods around 4-6 months of age.' },
    { id: 'cn3', question: 'Best snack for school children?', options: ['Candy', 'Apple slices with cheese', 'Chips', 'Soda'], correct: 1, explanation: 'Apple slices with cheese provide fiber, vitamins, protein, and calcium.' },
    { id: 'cn4', question: 'How many servings of fruit should kids eat?', options: ['0-1', '1-2', '3-5', '6+'], correct: 1, explanation: 'Children should eat 1-2 cups of fruit per day depending on age.' },
    { id: 'cn5', question: 'Is juice as healthy as whole fruit?', options: ['Yes, same', 'No, whole fruit is better', 'Juice is better', 'They\'re equal'], correct: 1, explanation: 'Whole fruit has fiber and is more filling; juice has concentrated sugar.' },
    { id: 'cn6', question: 'What causes picky eating in children?', options: ['Bad parenting', 'Normal development phase', 'Food allergies', 'Vitamin deficiency'], correct: 1, explanation: 'Picky eating is a normal developmental phase, especially ages 2-6.' },
    { id: 'cn7', question: 'Best way to introduce new foods to kids?', options: ['Force them', 'Repeated exposure (10-15 times)', 'Hide in other food', 'Give up after once'], correct: 1, explanation: 'It can take 10-15 exposures before a child accepts a new food.' },
    { id: 'cn8', question: 'How much sugar should kids limit?', options: ['No limit', 'Less than 25g/day', 'Less than 50g/day', '100g/day'], correct: 1, explanation: 'The AHA recommends children limit added sugars to less than 25g per day.' },
    { id: 'cn9', question: 'Best iron source for kids?', options: ['Milk', 'Lean red meat', 'White bread', 'Juice'], correct: 1, explanation: 'Lean red meat provides highly absorbable heme iron for growing children.' },
    { id: 'cn10', question: 'Should kids take multivitamins?', options: ['Always', 'Only if diet is inadequate', 'Never', 'Every day'], correct: 1, explanation: 'Multivitamins are only needed if a child\'s diet doesn\'t meet nutritional needs.' },
    { id: 'cn11', question: 'What is the best drink for kids?', options: ['Juice', 'Soda', 'Water', 'Sports drinks'], correct: 2, explanation: 'Water is the healthiest beverage choice for children.' },
    { id: 'cn12', question: 'How does breakfast affect learning?', options: ['No effect', 'Improves concentration and grades', 'Makes kids sleepy', 'Reduces appetite'], correct: 1, explanation: 'Eating breakfast improves concentration, memory, and academic performance.' },
  ],
  'Sustainable Eating': [
    { id: 'se1', question: 'Which protein has the lowest carbon footprint?', options: ['Beef', 'Chicken', 'Lentils', 'Pork'], correct: 2, explanation: 'Lentils produce about 40x less CO2 than beef per gram of protein.' },
    { id: 'se2', question: 'What % of food is wasted globally?', options: ['5%', '15%', '33%', '50%'], correct: 2, explanation: 'About one-third of all food produced globally is wasted.' },
    { id: 'se3', question: 'Best way to eat sustainably?', options: ['Eat more meat', 'Eat local and seasonal', 'Eat imported foods', 'Eat processed foods'], correct: 1, explanation: 'Eating local and seasonal foods reduces transportation emissions.' },
    { id: 'se4', question: 'Which food uses the most water to produce?', options: ['Rice', 'Beef', 'Vegetables', 'Fruit'], correct: 1, explanation: 'Beef requires about 15,000 liters of water per kilogram produced.' },
    { id: 'se5', question: 'What is a plant-forward diet?', options: ['Only plants', 'Mostly plants with some animal products', 'No carbs', 'Raw food only'], correct: 1, explanation: 'A plant-forward diet emphasizes plants while allowing some animal products.' },
    { id: 'se6', question: 'Why are seasonal foods better?', options: ['They\'re cheaper', 'Fresher and less transport', 'They taste worse', 'No difference'], correct: 1, explanation: 'Seasonal foods are fresher, more nutritious, and require less transportation.' },
    { id: 'se7', question: 'Best way to reduce food packaging waste?', options: ['Buy bulk', 'Buy individually wrapped', 'Use plastic bags', 'Order delivery'], correct: 0, explanation: 'Buying in bulk reduces packaging waste significantly.' },
    { id: 'se8', question: 'What is the flexitarian diet?', options: ['Strict vegan', 'Mostly vegetarian with occasional meat', 'All meat', 'Raw food'], correct: 1, explanation: 'Flexitarians eat mostly plant-based but occasionally include meat.' },
    { id: 'se9', question: 'Which fish is most sustainably caught?', options: ['Bluefin tuna', 'Wild salmon', 'MSC-certified fish', 'Shark'], correct: 2, explanation: 'MSC (Marine Stewardship Council) certified fish ensures sustainable fishing.' },
    { id: 'se10', question: 'How can you reduce meat\'s environmental impact?', options: ['Eat more beef', 'Choose chicken over beef', 'Eat only fish', 'Eat more pork'], correct: 1, explanation: 'Chicken has about 1/5 the carbon footprint of beef.' },
    { id: 'se11', question: 'What is composting?', options: ['Burning food', 'Decomposing organic waste into soil', 'Freezing leftovers', 'Recycling plastic'], correct: 1, explanation: 'Composting converts organic waste into nutrient-rich soil amendment.' },
    { id: 'se12', question: 'Best alternative to single-use plastics?', options: ['Paper bags', 'Reusable containers', 'Aluminum foil', 'More plastic'], correct: 1, explanation: 'Reusable containers significantly reduce plastic waste over time.' },
  ],
};

const QUIZ_SET_NAMES = Object.keys(QUIZ_SETS);

const NutritionQuiz: React.FC = () => {
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const questions = selectedSet ? QUIZ_SETS[selectedSet] : [];
  const question = questions[currentQ];
  const totalQ = questions.length;

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelected(idx); setShowResult(true);
    const correct = idx === question.correct;
    if (correct) { setScore(s => s + 1); playMilestoneSound('success'); }
    setAnswered([...answered, correct]);
  };

  const nextQuestion = () => {
    if (currentQ < totalQ - 1) { setCurrentQ(currentQ + 1); setSelected(null); setShowResult(false); }
    else {
      setQuizDone(true);
      const points = score * 10;
      if (points > 0) {
        const current = getLS<number>(LS_KEYS.POINTS, 0);
        setLS(LS_KEYS.POINTS, current + points);
        // Save to points history
        const history = getLS<PointsTransaction[]>(LS_KEYS.POINTS_HISTORY, []);
        history.unshift({ id: crypto.randomUUID(), date: new Date().toISOString(), points, reason: `Quiz: ${selectedSet} (${score}/${totalQ})` });
        setLS(LS_KEYS.POINTS_HISTORY, history.slice(0, 100));
      }
      // Save quiz score
      const scores = getLS<any[]>('th_quiz_scores', []);
      scores.unshift({ date: new Date().toISOString(), score: Math.round((score / totalQ) * 100), total: totalQ, correct: score, setName: selectedSet });
      setLS('th_quiz_scores', scores.slice(0, 50));
      if (score >= totalQ * 0.7) { setShowConfetti(true); playMilestoneSound('reward'); setTimeout(() => setShowConfetti(false), 3500); }
    }
  };

  const restart = () => { setCurrentQ(0); setSelected(null); setShowResult(false); setScore(0); setAnswered([]); setQuizDone(false); };
  const backToSets = () => { setSelectedSet(null); restart(); };

  // Quiz set selection
  if (!selectedSet) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-purple-500" />Choose a Quiz Set</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {QUIZ_SET_NAMES.map((name, idx) => (
                <button key={name} onClick={() => setSelectedSet(name)}
                  className="p-4 border rounded-xl text-left hover:border-primary hover:bg-primary/5 transition-all group">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{'🧪🍎💧🥗📋⚖️🦠🏋️👴🧠👶🌱'.split('').filter((_, i) => i % 2 === 0)[idx % 6]}</span>
                    <h3 className="font-semibold text-sm group-hover:text-primary">{name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{QUIZ_SETS[name].length} questions</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizDone) {
    const pct = Math.round((score / totalQ) * 100);
    return (
      <>
        <Confetti active={showConfetti} />
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <Trophy className={`h-16 w-16 mx-auto ${pct >= 70 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
            <h2 className="text-2xl font-bold">Quiz Complete!</h2>
            <p className="text-sm text-muted-foreground">{selectedSet}</p>
            <p className="text-4xl font-bold text-primary">{score}/{totalQ}</p>
            <p className="text-muted-foreground">{pct}% — {score * 10} points earned!</p>
            <Progress value={pct} className="h-3 max-w-xs mx-auto" />
            <Badge variant={pct >= 70 ? 'default' : 'secondary'}>
              {pct >= 90 ? 'Nutrition Expert! 🏆' : pct >= 70 ? 'Well Done! 🎉' : pct >= 50 ? 'Good Try! 💪' : 'Keep Learning! 📚'}
            </Badge>
            <div className="flex gap-2 justify-center mt-4">
              <Button onClick={restart}><RotateCcw className="h-4 w-4 mr-2" />Try Again</Button>
              <Button variant="outline" onClick={backToSets}><Shuffle className="h-4 w-4 mr-2" />Other Quizzes</Button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-purple-500" />{selectedSet}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{currentQ + 1}/{totalQ}</Badge>
            <Button variant="ghost" size="sm" onClick={backToSets} className="text-xs">Back</Button>
          </div>
        </div>
        <Progress value={(currentQ / totalQ) * 100} className="h-2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">{question.question}</h3>
        <div className="space-y-2">
          {question.options.map((opt, idx) => {
            let cls = 'w-full text-left p-3 rounded-lg border transition-colors ';
            if (showResult) {
              if (idx === question.correct) cls += 'border-green-500 bg-green-50 dark:bg-green-900/20';
              else if (idx === selected) cls += 'border-red-500 bg-red-50 dark:bg-red-900/20';
              else cls += 'border-muted opacity-50';
            } else { cls += selected === idx ? 'border-primary bg-primary/10' : 'border-muted hover:border-primary/50 hover:bg-muted/50 cursor-pointer'; }
            return (
              <button key={idx} onClick={() => handleAnswer(idx)} className={cls} disabled={showResult}>
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0">{String.fromCharCode(65 + idx)}</span>
                  {opt}
                  {showResult && idx === question.correct && <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />}
                  {showResult && idx === selected && idx !== question.correct && <XCircle className="h-4 w-4 text-red-500 ml-auto" />}
                </span>
              </button>
            );
          })}
        </div>
        {showResult && <div className="bg-muted p-3 rounded-lg"><p className="text-sm"><strong>Explanation:</strong> {question.explanation}</p></div>}
        {showResult && <Button onClick={nextQuestion} className="w-full">{currentQ < totalQ - 1 ? 'Next Question' : 'See Results'}</Button>}
        <div className="flex items-center justify-between text-sm text-muted-foreground"><span>Score: {score}/{answered.length}</span><span>{totalQ - currentQ - (showResult ? 0 : 1)} remaining</span></div>
      </CardContent>
    </Card>
  );
};

export default NutritionQuiz;
