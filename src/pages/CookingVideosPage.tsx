
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { TabsTrigger, ScrollableTabsList } from '@/components/ui/scrollable-tabs';
import { Play, Clock, ChefHat, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface CookingVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  localVideoUrl?: string;
  duration: string;
  category: string;
  tags: string[];
}

const DEFAULT_VIDEOS: CookingVideo[] = [
  { id: 'v1', title: 'Quick Overnight Oats', description: 'Prep the night before for a healthy grab-and-go breakfast', thumbnail: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=600&auto=format', videoUrl: '', duration: '5 min', category: 'breakfast', tags: ['quick', 'healthy'], localVideoUrl: '/videos/overnight-oats.mp4' },
  { id: 'v2', title: 'Fluffy Egg White Omelette', description: 'Low-calorie high-protein breakfast', thumbnail: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&auto=format', videoUrl: '', duration: '8 min', category: 'breakfast', tags: ['protein'], localVideoUrl: '/videos/egg-omelette.mp4' },
  { id: 'v3', title: 'Smoothie Bowl Art', description: 'Beautiful and nutritious smoothie bowls', thumbnail: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format', videoUrl: '', duration: '6 min', category: 'breakfast', tags: ['smoothie'], localVideoUrl: '/videos/smoothie-bowl.mp4' },
  { id: 'v4', title: 'Mediterranean Grain Bowl', description: 'Colorful grain bowl with fresh herbs and feta', thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format', videoUrl: '', duration: '12 min', category: 'lunch', tags: ['grains'], localVideoUrl: '/videos/mediterranean-bowl.mp4' },
  { id: 'v5', title: 'Thai Chicken Lettuce Wraps', description: 'Light and flavorful wraps', thumbnail: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format', videoUrl: '', duration: '10 min', category: 'lunch', tags: ['protein'], localVideoUrl: '/videos/thai-wraps.mp4' },
  { id: 'v6', title: 'One-Pan Lemon Herb Salmon', description: 'Easy baked salmon with veggies', thumbnail: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format', videoUrl: '', duration: '20 min', category: 'dinner', tags: ['omega-3'], localVideoUrl: '/videos/salmon.mp4' },
  { id: 'v7', title: 'Veggie Stir-Fry Masterclass', description: 'Perfect stir-fry technique', thumbnail: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format', videoUrl: '', duration: '15 min', category: 'dinner', tags: ['vegetables'], localVideoUrl: '/videos/stir-fry.mp4' },
  { id: 'v8', title: 'Protein Energy Bites', description: 'No-bake snack balls', thumbnail: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&auto=format', videoUrl: '', duration: '7 min', category: 'snacks', tags: ['protein'], localVideoUrl: '/videos/energy-bites.mp4' },
  { id: 'v9', title: 'Baked Kale Chips', description: 'Crispy seasoned kale chips', thumbnail: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=600&auto=format', videoUrl: '', duration: '10 min', category: 'snacks', tags: ['low-cal'], localVideoUrl: '/videos/kale-chips.mp4' },
  { id: 'v10', title: 'Anti-Inflammatory Golden Milk', description: 'Warm turmeric latte', thumbnail: 'https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb?w=600&auto=format', videoUrl: '', duration: '5 min', category: 'drinks', tags: ['wellness'], localVideoUrl: '/videos/golden-milk.mp4' },
  { id: 'v11', title: 'Green Power Juice', description: 'Detox juice loaded with greens', thumbnail: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=600&auto=format', videoUrl: '', duration: '4 min', category: 'drinks', tags: ['detox'], localVideoUrl: '/videos/green-juice.mp4' },
];

const CookingVideosPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const categories = ['all', 'breakfast', 'lunch', 'dinner', 'snacks', 'drinks'];
  
  const filtered = activeCategory === 'all' 
    ? DEFAULT_VIDEOS 
    : DEFAULT_VIDEOS.filter(v => v.category === activeCategory);

  const currentVideo = playingVideo ? DEFAULT_VIDEOS.find(v => v.id === playingVideo) : null;

  useEffect(() => {
    if (videoRef) {
      videoRef.muted = isMuted;
    }
  }, [isMuted, videoRef]);

  const handlePlayVideo = (videoId: string) => {
    setPlayingVideo(videoId);
  };

  const handleCloseVideo = () => {
    if (videoRef) {
      videoRef.pause();
    }
    setPlayingVideo(null);
  };

  const toggleFullscreen = () => {
    if (videoRef) {
      if (videoRef.requestFullscreen) {
        videoRef.requestFullscreen();
      }
    }
  };

  return (
    <PageLayout activePage="cooking">
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ChefHat className="h-7 w-7 text-primary" />
            Healthy Cooking Videos
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Watch recipe videos for healthy meals</p>
        </div>
        
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <ScrollableTabsList className="mb-6">
            {categories.map(cat => (
              <TabsTrigger key={cat} value={cat} className="capitalize">
                {cat === 'all' ? 'All Videos' : cat}
              </TabsTrigger>
            ))}
          </ScrollableTabsList>
        </Tabs>

        {playingVideo && currentVideo && (
          <Card className="mb-6 glow-effect">
            <CardContent className="p-0">
              <div className="relative bg-black rounded-t-lg overflow-hidden">
                <video
                  ref={(el) => setVideoRef(el)}
                  src={currentVideo.localVideoUrl}
                  poster={currentVideo.thumbnail}
                  controls
                  autoPlay
                  className="w-full aspect-video"
                  onError={(e) => {
                    console.log('Video load error, falling back to placeholder');
                  }}
                >
                  Your browser does not support the video tag.
                </video>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5 text-white" /> : <Volume2 className="h-5 w-5 text-white" />}
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <Maximize2 className="h-5 w-5 text-white" />
                  </button>
                  <button
                    onClick={handleCloseVideo}
                    className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold">{currentVideo.title}</h2>
                <p className="text-muted-foreground mt-1">{currentVideo.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {currentVideo.duration}
                  </Badge>
                  <Badge>{currentVideo.category}</Badge>
                  {currentVideo.tags.map(tag => (
                    <Badge key={tag} variant="outline">#{tag}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(video => (
            <Card 
              key={video.id} 
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] overflow-hidden group"
              onClick={() => handlePlayVideo(video.id)}
            >
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-48 object-cover transition-transform group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 rounded-full p-3 animate-pulse">
                    <Play className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <Badge className="absolute top-2 right-2 bg-black/70 text-white flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {video.duration}
                </Badge>
                <Badge className="absolute top-2 left-2 capitalize bg-primary/80">
                  {video.category}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{video.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{video.description}</p>
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
    </PageLayout>
  );
};

export default CookingVideosPage;
