import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { TabsTrigger, ScrollableTabsList } from '@/components/ui/scrollable-tabs';
import { Play, Clock, ChefHat, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface CookingVideo {
  id: string; title: string; description: string; thumbnail: string; video: string; duration: string; category: string; tags: string[];
}

const COOKING_VIDEOS: CookingVideo[] = [
  // BREAKFAST MEALS
  { id: 'v1', title: 'Banana Egg Bakes', description: 'Prep the night before for a healthy grab-and-go breakfast', thumbnail: '/meals/bananas.jpg', video: '/videos/banana egg.mp4', duration: '3 min', category: 'breakfast', tags: ['quick', 'healthy'] },
  { id: 'v2', title: 'Fluffy Egg White Omelette Salad', description: 'Low-calorie high-protein breakfast', thumbnail: '/meals/omelete.jpg', video: '/videos/egg sald.mp4', duration: '1 min', category: 'breakfast', tags: ['protein'] },
  { id: 'v3', title: 'Jellof Rice', description: 'Low-calorie high-protein jellof recipe', thumbnail: '/meals/jellof.jpg', video: '/videos/jellof rice.mp4', duration: '15 min', category: 'breakfast', tags: ['protein'] },
  { id: 'v4', title: 'Poulet Dj', description: 'Beautiful and nutritious chicken and plantain mix', thumbnail: '/meals/poulet dg.jpg', video: '/videos/poulet dg.mp4', duration: '6 min', category: 'breakfast', tags: ['protein', 'mineral'] },
  { id: 'v5', title: 'Puff puff', description: 'Fluffy dough breakfast', thumbnail: '/meals/puffpuff.jpeg', video: '/videos/puff puff.mp4', duration: '1 min', category: 'breakfast', tags: ['carbohydrate'] },
  { id: 'v6', title: 'Red Beans', description: 'Low-calorie high-protein breakfast', thumbnail: '/meals/beans.jpeg', video: '/videos/beans.mp4', duration: '1 min', category: 'breakfast', tags: ['protein'] },
  { id: 'v7', title: 'Chicken Salad', description: 'Low-calorie high-protein breakfast', thumbnail: '/meals/pouletbraise.jpeg', video: '/videos/chicken salad.mp4', duration: '1 min', category: 'breakfast', tags: ['protein', 'vitamin'] },
  // LUNCH MEALS
  { id: 'v8', title: 'Eru', description: 'Delicious vegetable recipe for lunch', thumbnail: '/meals/eru.jpeg', video: '/videos/eru.mp4', duration: '1 min', category: 'lunch', tags: ['protein', 'fat', 'vitamins'] },
  { id: 'v9', title: 'Mbongo Tchobi', description: 'Colorful black soup with fresh herbs and fish', thumbnail: '/meals/Mbongo-Tchobi-1.jpg', video: '/videos/mbongo tchobi.mp4', duration: '1 min', category: 'lunch', tags: ['spices', 'protein'] },
  { id: 'v10', title: 'Koki Beans', description: 'Traditional beans pudding', thumbnail: '/meals/koki.jpg', video: '/videos/koki beans.mp4', duration: '1 min', category: 'lunch', tags: ['grains', 'protein', 'vitamins'] },
  { id: 'v11', title: 'Ndole', description: 'Vegetable bitterleaf and egusi or groundnut mix', thumbnail: '/meals/ndole.jpeg', video: '/videos/ndole.mp4', duration: '1 min', category: 'lunch', tags: ['vitamins', 'protein'] },
  { id: 'v12', title: 'Potatoes Hot Pot', description: 'Potateos stewed with condiments', thumbnail: '/meals/potato hot pot.jpg', video: '/videos/potatoes.mp4', duration: '1 min', category: 'lunch', tags: ['carbohydrate', 'protein'] },
  { id: 'v13', title: 'Egusi Pudding', description: 'Delicious egusi pudding with plantain recipe', thumbnail: '/meals/egusipudding.jpeg', video: '/videos/egusi pudding.mp4', duration: '1 min', category: 'lunch', tags: ['vitamin','high-protein'] },
  { id: 'v14', title: 'Chicken and Salad Mix', description: 'Easy baked Chicken with veggies', thumbnail: '/meals/pouletbraise.jpeg', video: '/videos/salad chicken.mp4', duration: '1 min', category: 'dinner', tags: ['omega-3', 'protein', 'vitamin'] },
  // DINNER MEALS
  {
    id: 'v15',
    title: 'Egg Paratha',
    description: 'Flaky flatbread stuffed with spiced egg filling, perfect for dinner',
    thumbnail: '/meals/egg paratha.jpeg',
    video: '/videos/egg paratha.mp4',
    duration: '1 min',
    category: 'dinner',
    tags: ['high-protein', 'carbs']
  },
  {
    id: 'v16',
    title: 'Grilled Fish',
    description: 'Perfectly seasoned fish grilled to perfection with herbs',
    thumbnail: '/meals/grilled fish.jpg',
    video: '/videos/grilled fish.mp4',
    duration: '1 min',
    category: 'dinner',
    tags: ['high-protein', 'low-carb', 'omega-3']
  },
  {
    id: 'v17',
    title: 'Egg Plantain Frittata',
    description: 'Delicious frittata with ripe plantains and eggs',
    thumbnail: '/meals/plantain frittata.jpeg',
    video: '/videos/egg plantain frittata.mp4',
    duration: '1 min',
    category: 'dinner',
    tags: ['high-protein', 'gluten-free']
  },
  {
    id: 'v18',
    title: 'Chicken Fajitas',
    description: 'Sizzling chicken fajitas with bell peppers and onions',
    thumbnail: '/meals/chicken fajitas.jpeg',
    video: '/videos/chicken fajitas.mp4',
    duration: '1 min',
    category: 'dinner',
    tags: ['high-protein', 'spicy']
  },
  {
    id: 'v19',
    title: 'Avocado Cucumber Salad',
    description: 'Fresh and creamy avocado cucumber salad with light dressing',
    thumbnail: '/meals/avocado cucumber salad.jpeg',
    video: '/videos/avocado cucumber.mp4',
    duration: '10 min',
    category: 'dinner',
    tags: ['vegan', 'low-carb', 'vitamin']
  },

  // SNACKS
  {
    id: 'v20',
    title: 'Fruit Salad',
    description: 'Fresh mixed fruits tossed in light citrus dressing',
    thumbnail: '/meals/fruitsalad.jpg',
    video: '/videos/fruit salad.mp4',
    duration: '1 min',
    category: 'snacks',
    tags: ['vegan', 'vitamin', 'refreshing']
  },
  {
    id: 'v21',
    title: 'Chicken Snack',
    description: 'Bite-sized chicken pieces with savory seasoning',
    thumbnail: '/meals/3ngnam.jpeg',
    video: '/videos/chicken snack.mp4',
    duration: '1 min',
    category: 'snacks',
    tags: ['high-protein', 'quick']
  },
  {
    id: 'v22',
    title: 'Yoghurt',
    description: 'Creamy homemade yoghurt, perfect for any time',
    thumbnail: '/meals/yoghurt.jpg',
    video: '/videos/yoghurt.mp4',
    duration: '1 min',
    category: 'snacks',
    tags: ['probiotic', 'calcium']
  },
  {
    id: 'v23',
    title: 'Fishroll',
    description: 'Crispy pastry filled with spiced fish mixture',
    thumbnail: '/meals/fishroll.jpg',
    video: '/videos/fish roll.mp4',
    duration: '1 min',
    category: 'snacks',
    tags: ['high-protein', 'fried']
  },
  {
    id: 'v24',
    title: 'Gateaux',
    description: 'Fluffy fried dough pastries, lightly sweetened',
    thumbnail: '/meals/gateau.jpg',
    video: '/videos/gateau.mp4',
    duration: '1 min',
    category: 'snacks',
    tags: ['vegetarian', 'sweet']
  },
  {
    id: 'v25',
    title: 'Honey Garlic Chicken Wings',
    description: 'Sticky sweet and savory chicken wings with garlic',
    thumbnail: '/meals/honey garlic chicken.jpeg',
    video: '/videos/honey garlic chicken.mp4',
    duration: '1 min',
    category: 'snacks',
    tags: ['high-protein', 'sweet-savory']
  },
  {
    id: 'v26',
    title: 'Rice Fries',
    description: 'Crispy fries made from rice, a unique twist',
    thumbnail: '/meals/rice fries.jpeg',
    video: '/videos/rice fries.mp4',
    duration: '1 min',
    category: 'snacks',
    tags: ['gluten-free', 'crispy']
  },
  {
    id: 'v27',
    title: 'Chicken Rolls',
    description: 'Flaky rolls stuffed with seasoned chicken filling',
    thumbnail: '/meals/chickenrolls.jpeg',
    video: '/videos/chicken rolls.mp4',
    duration: '1 min',
    category: 'snacks',
    tags: ['high-protein', 'baked']
  },
  {
    id: 'v28',
    title: 'Honey Lemon Fruit Salad',
    description: 'Fresh fruits drizzled with honey lemon syrup',
    thumbnail: '/meals/salad.jpg',
    video: '/videos/honey lime fruit salad.mp4',
    duration: '12 min',
    category: 'snacks',
    tags: ['vegan', 'vitamin', 'refreshing']
  },

  // DRINKS
  {
    id: 'v29',
    title: 'Baobab Drink',
    description: 'Tangy and refreshing drink made from baobab fruit',
    thumbnail: '/meals/baobab.jpeg',
    video: '/videos/baobab.mp4',
    duration: '1 min',
    category: 'drink',
    tags: ['vitamin-c', 'refreshing', 'natural']
  },
  {
    id: 'v30',
    title: 'Zobo Drink',
    description: 'Hibiscus tea sweetened with natural flavors',
    thumbnail: '/meals/zobo.jpeg',
    video: '/videos/zobo.mp4',
    duration: '1 min',
    category: 'drink',
    tags: ['antioxidant', 'caffeine-free']
  },
  {
    id: 'v31',
    title: 'Tiger Nut Drink',
    description: 'Creamy and sweet drink made from tiger nuts',
    thumbnail: '/meals/tiger nut drink.jpeg',
    video: '/videos/tiger nut.mp4',
    duration: '1 min',
    category: 'drink',
    tags: ['dairy-free', 'fiber-rich']
  },
  {
    id: 'v32',
    title: 'Folere Drink',
    description: 'Traditional ginger and hibiscus blend',
    thumbnail: '/meals/folere.jpg',
    video: '/videos/folere.mp4',
    duration: '1 min',
    category: 'drink',
    tags: ['spicy', 'traditional', 'refreshing']
  }

]

const CookingVideosPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const categories = ['all', 'breakfast', 'lunch', 'dinner', 'snacks', 'drinks'];
  const filtered = activeCategory === 'all' ? COOKING_VIDEOS : COOKING_VIDEOS.filter(v => v.category === activeCategory);

  return (
    <PageLayout activePage="cooking">
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
              <ChefHat className="h-7 w-7 text-orange-500 fill-orange-300" />
            </motion.span>
            Healthy Cooking Videos
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Watch short recipe videos for healthy meals</p>
        </motion.div>
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <ScrollableTabsList className="mb-6">
            {categories.map(cat => <TabsTrigger key={cat} value={cat} className="capitalize">{cat === 'all' ? '🎬 All Videos' : `${cat === 'breakfast' ? '🌅' : cat === 'lunch' ? '☀️' : cat === 'dinner' ? '🌙' : cat === 'snacks' ? '🍿' : cat === 'drinks' ? '🥤'} ${cat}`}</TabsTrigger>)}
          </ScrollableTabsList>
        </Tabs>
        <AnimatePresence>
          {playingVideo && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="mb-6 overflow-hidden shadow-xl border-primary/20">
                <CardContent className="p-0 relative">
                  <div className="aspect-video w-full"><iframe src={COOKING_VIDEOS.find(v => v.id === playingVideo)?.video} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Cooking video" /></div>
                  <Button variant="secondary" size="icon" className="absolute top-3 right-3 rounded-full shadow-lg" onClick={() => setPlayingVideo(null)}><X className="h-4 w-4" /></Button>
                  <div className="p-4"><h2 className="text-xl font-bold">{COOKING_VIDEOS.find(v => v.id === playingVideo)?.title}</h2><p className="text-muted-foreground">{COOKING_VIDEOS.find(v => v.id === playingVideo)?.description}</p></div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((video, idx) => (
            <motion.div key={video.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
              <Card className={`cursor-pointer overflow-hidden group transition-all hover:shadow-xl ${playingVideo === video.id ? 'ring-2 ring-primary' : 'hover:border-primary/30'}`} onClick={() => setPlayingVideo(video.id)}>
                <div className="relative overflow-hidden">
                  <motion.img whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.div whileHover={{ scale: 1.2 }} className="bg-white/90 rounded-full p-3 shadow-lg">
                      <Play className="h-8 w-8 text-primary fill-primary" />
                    </motion.div>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-black/70 text-white border-0"><Clock className="h-3 w-3 mr-1" />{video.duration}</Badge>
                  <Badge className="absolute top-2 left-2 capitalize bg-primary/90 border-0">{video.category}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm">{video.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{video.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">{video.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>)}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default CookingVideosPage;
 