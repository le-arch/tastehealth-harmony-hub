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
  id: string; title: string; description: string; thumbnail: string; videoUrl: string; duration: string; category: string; tags: string[];
}

const COOKING_VIDEOS: CookingVideo[] = [
  { id: 'v1', title: 'Quick Overnight Oats', description: 'Prep the night before for a healthy grab-and-go breakfast', thumbnail: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/B0jMkm2Lr5I', duration: '5 min', category: 'breakfast', tags: ['quick', 'healthy'] },
  { id: 'v2', title: 'Fluffy Egg White Omelette', description: 'Low-calorie high-protein breakfast', thumbnail: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/OQSMr-3GGvQ', duration: '8 min', category: 'breakfast', tags: ['protein'] },
  { id: 'v3', title: 'Smoothie Bowl Art', description: 'Beautiful and nutritious smoothie bowls', thumbnail: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/gxf8JEPhydo', duration: '6 min', category: 'breakfast', tags: ['smoothie'] },
  { id: 'v4', title: 'Mediterranean Grain Bowl', description: 'Colorful grain bowl with fresh herbs and feta', thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/ByC3GStIMCk', duration: '12 min', category: 'lunch', tags: ['grains'] },
  { id: 'v5', title: 'Thai Chicken Lettuce Wraps', description: 'Light and flavorful wraps', thumbnail: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/8yrLpAoRDKE', duration: '10 min', category: 'lunch', tags: ['protein'] },
  { id: 'v6', title: 'One-Pan Lemon Herb Salmon', description: 'Easy baked salmon with veggies', thumbnail: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/4MBfB0F2LMs', duration: '20 min', category: 'dinner', tags: ['omega-3'] },
  { id: 'v7', title: 'Veggie Stir-Fry Masterclass', description: 'Perfect stir-fry technique', thumbnail: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/hjUhF_NIUKY', duration: '15 min', category: 'dinner', tags: ['vegetables'] },
  { id: 'v8', title: 'Protein Energy Bites', description: 'No-bake snack balls', thumbnail: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/kj5mllIxMIU', duration: '7 min', category: 'snacks', tags: ['protein'] },
  { id: 'v9', title: 'Baked Kale Chips', description: 'Crispy seasoned kale chips', thumbnail: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/yFNNEt7LJxI', duration: '10 min', category: 'snacks', tags: ['low-cal'] },
  { id: 'v10', title: 'Anti-Inflammatory Golden Milk', description: 'Warm turmeric latte', thumbnail: 'https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/SqJcwQP0eU4', duration: '5 min', category: 'drinks', tags: ['wellness'] },
  { id: 'v11', title: 'Green Power Juice', description: 'Detox juice loaded with greens', thumbnail: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/mfp5HKPOEMY', duration: '4 min', category: 'drinks', tags: ['detox'] },
];

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
            {categories.map(cat => <TabsTrigger key={cat} value={cat} className="capitalize">{cat === 'all' ? '🎬 All Videos' : `${cat === 'breakfast' ? '🌅' : cat === 'lunch' ? '☀️' : cat === 'dinner' ? '🌙' : cat === 'snacks' ? '🍿' : '🥤'} ${cat}`}</TabsTrigger>)}
          </ScrollableTabsList>
        </Tabs>
        <AnimatePresence>
          {playingVideo && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="mb-6 overflow-hidden shadow-xl border-primary/20">
                <CardContent className="p-0 relative">
                  <div className="aspect-video w-full"><iframe src={COOKING_VIDEOS.find(v => v.id === playingVideo)?.videoUrl} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Cooking video" /></div>
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
