import React, { useState } from 'react';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { TabsTrigger, ScrollableTabsList } from '@/components/ui/scrollable-tabs';
import { useScreenSize } from '@/utils/mobile';
import { Play, Clock, ChefHat } from 'lucide-react';

interface CookingVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  category: string;
  tags: string[];
}

const COOKING_VIDEOS: CookingVideo[] = [
  // Breakfast
  { id: 'v1', title: 'Quick Overnight Oats', description: 'Prep the night before for a healthy grab-and-go breakfast', thumbnail: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/hMGMjMSbVPg', duration: '5 min', category: 'breakfast', tags: ['quick', 'healthy', 'meal-prep'] },
  { id: 'v2', title: 'Fluffy Egg White Omelette', description: 'Low-calorie high-protein breakfast in minutes', thumbnail: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/hMGMjMSbVPg', duration: '8 min', category: 'breakfast', tags: ['protein', 'low-cal'] },
  { id: 'v3', title: 'Smoothie Bowl Art', description: 'Beautiful and nutritious smoothie bowls with toppings', thumbnail: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/hMGMjMSbVPg', duration: '6 min', category: 'breakfast', tags: ['smoothie', 'antioxidants'] },
  // Lunch
  { id: 'v4', title: 'Mediterranean Grain Bowl', description: 'Colorful grain bowl with fresh herbs and feta', thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/hMGMjMSbVPg', duration: '12 min', category: 'lunch', tags: ['grains', 'fresh'] },
  { id: 'v5', title: 'Thai Chicken Lettuce Wraps', description: 'Light and flavorful wraps with peanut sauce', thumbnail: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/hMGMjMSbVPg', duration: '10 min', category: 'lunch', tags: ['low-carb', 'protein'] },
  // Dinner
  { id: 'v6', title: 'One-Pan Lemon Herb Salmon', description: 'Easy baked salmon with roasted veggies', thumbnail: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/hMGMjMSbVPg', duration: '20 min', category: 'dinner', tags: ['omega-3', 'one-pan'] },
  { id: 'v7', title: 'Veggie Stir-Fry Masterclass', description: 'Perfect stir-fry technique with maximum nutrition', thumbnail: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/hMGMjMSbVPg', duration: '15 min', category: 'dinner', tags: ['vegetables', 'quick'] },
  // Snacks
  { id: 'v8', title: 'Protein Energy Bites', description: 'No-bake snack balls with nuts and dates', thumbnail: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/hMGMjMSbVPg', duration: '7 min', category: 'snacks', tags: ['no-bake', 'protein'] },
  { id: 'v9', title: 'Baked Kale Chips', description: 'Crispy kale chips seasoned to perfection', thumbnail: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/hMGMjMSbVPg', duration: '10 min', category: 'snacks', tags: ['low-cal', 'crunchy'] },
  // Drinks
  { id: 'v10', title: 'Anti-Inflammatory Golden Milk', description: 'Warm turmeric latte for wellness', thumbnail: 'https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/hMGMjMSbVPg', duration: '5 min', category: 'drinks', tags: ['anti-inflammatory', 'warm'] },
  { id: 'v11', title: 'Green Power Juice', description: 'Detox juice loaded with leafy greens', thumbnail: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=600&auto=format', videoUrl: 'https://www.youtube.com/embed/hMGMjMSbVPg', duration: '4 min', category: 'drinks', tags: ['detox', 'greens'] },
];

const CookingVideosPage: React.FC = () => {
  const { isMobile } = useScreenSize();
  const [activeCategory, setActiveCategory] = useState('all');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const categories = ['all', 'breakfast', 'lunch', 'dinner', 'snacks', 'drinks'];
  const filtered = activeCategory === 'all' ? COOKING_VIDEOS : COOKING_VIDEOS.filter(v => v.category === activeCategory);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <ProfileSidebar activePage="cooking" />
      <div className={`flex-1 p-4 sm:p-6 md:p-8 ${isMobile ? 'mt-16' : 'md:ml-64'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <ChefHat className="h-7 w-7 text-primary" />
              Healthy Cooking Videos
            </h1>
            <p className="text-muted-foreground mt-1">Watch short recipe videos for healthy meals</p>
          </div>

          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <ScrollableTabsList className="mb-6">
              {categories.map(cat => (
                <TabsTrigger key={cat} value={cat} className="capitalize">{cat === 'all' ? 'All Videos' : cat}</TabsTrigger>
              ))}
            </ScrollableTabsList>
          </Tabs>

          {/* Playing video */}
          {playingVideo && (
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="aspect-video w-full">
                  <iframe
                    src={COOKING_VIDEOS.find(v => v.id === playingVideo)?.videoUrl}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Cooking video"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold">{COOKING_VIDEOS.find(v => v.id === playingVideo)?.title}</h2>
                  <p className="text-muted-foreground">{COOKING_VIDEOS.find(v => v.id === playingVideo)?.description}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(video => (
              <Card
                key={video.id}
                className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                onClick={() => setPlayingVideo(video.id)}
              >
                <div className="relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                    <Clock className="h-3 w-3 mr-1" />{video.duration}
                  </Badge>
                  <Badge className="absolute top-2 left-2 capitalize">{video.category}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm">{video.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{video.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {video.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookingVideosPage;
