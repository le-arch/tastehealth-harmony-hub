import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollableTabsList } from '@/components/ui/scrollable-tabs';
import { 
  Lightbulb, 
  RefreshCw, 
  Bookmark, 
  BookmarkCheck,
  Heart,
  Brain,
  Apple,
  Moon,
  Activity,
  Droplet,
  Sun,
  Leaf,
  Coffee,
  Dumbbell,
  Sparkles,
  Star,
  Flame,
  Footprints,
  Clock,
  Calendar,
  Award,
  TrendingUp,
  ChevronRight,
  Info,
  CheckCircle,
  AlertCircle,
  Video,
  FileText,
  PlayCircle,
  Download,
  Share2,
  ThumbsUp,
  Users,
  Target,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScreenSize } from '@/utils/mobile';

// Enhanced Health Tip Interface with rich content
interface HealthTip {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  category: string;
  icon: string;
  image: string;
  benefits: string[];
  methods: {
    title: string;
    steps: string[];
    duration?: string;
    frequency?: string;
  }[];
  precautions?: string[];
  scientificFacts: string[];
  recommendedFor?: string[];
  contraindications?: string[];
  successRate?: number;
  expertQuotes?: {
    name: string;
    credentials: string;
    quote: string;
  }[];
  resources?: {
    title: string;
    type: 'video' | 'article' | 'pdf' | 'link';
    url: string;
  }[];
  tags: string[];
}

// Comprehensive Health Tips Database with rich content
const ALL_TIPS: HealthTip[] = [
  {
    id: 't1',
    title: 'Hydration for Vitality',
    shortDescription: 'Master your water intake for optimal health',
    detailedDescription: 'Proper hydration is essential for every cell in your body. Water regulates temperature, lubricates joints, transports nutrients, and flushes waste. Learn how to optimize your hydration for peak performance and health.',
    category: 'hydration',
    icon: '💧',
    image: '/health/hydration.jpeg',
    benefits: [
      'Improves energy levels and brain function by up to 30%',
      'Flushes toxins through urine and sweat',
      'Prevents headaches and kidney stones',
      'Supports healthy skin and complexion',
      'Aids digestion and prevents constipation',
      'Regulates body temperature during exercise'
    ],
    methods: [
      {
        title: 'The 8x8 Rule',
        steps: [
          'Drink eight 8-ounce glasses of water daily (about 2 liters)',
          'Start with 2 glasses immediately upon waking',
          'Drink 1 glass before each meal',
          'Finish 1 glass between meals',
          'Have 1 glass before exercise and 1 after'
        ],
        duration: '2 minutes per glass',
        frequency: 'Spread throughout the day'
      },
      {
        title: 'Hydration Tracking Method',
        steps: [
          'Use a marked water bottle with time goals',
          'Set hourly reminders on your phone',
          'Track intake in our app or journal',
          'Monitor urine color (pale yellow = hydrated)',
          'Increase intake during exercise or hot weather'
        ],
        duration: 'Ongoing',
        frequency: 'Daily'
      }
    ],
    precautions: [
      'Consult your doctor if you have kidney issues',
      'Avoid drinking 2L+ in short periods (risk of hyponatremia)',
      'Reduce intake if you have heart failure or liver disease'
    ],
    scientificFacts: [
      'Even 1-2% dehydration can impair cognitive function',
      'Water makes up 60% of the human body',
      'Your brain is 73% water',
      'Thirst signals diminish with age (older adults need reminders)'
    ],
    recommendedFor: ['Everyone', 'Athletes', 'Office workers', 'Older adults'],
    successRate: 95,
    expertQuotes: [
      {
        name: 'Dr. Sarah Mitchell',
        credentials: 'MD, Nephrology',
        quote: 'Proper hydration is the single most underrated health intervention. I see patients transform their health simply by drinking enough water.'
      }
    ],
    resources: [
      { title: 'Hydration Guide PDF', type: 'pdf', url: '#' },
      { title: 'Benefits of Water Video', type: 'video', url: '#' }
    ],
    tags: ['water', 'hydration', 'wellness', 'basics']
  },
  {
    id: 't2',
    title: 'Mediterranean Diet Mastery',
    shortDescription: 'Embrace the heart-healthy Mediterranean lifestyle',
    detailedDescription: 'The Mediterranean diet is more than a meal plan—it\'s a lifestyle rich in fruits, vegetables, whole grains, olive oil, and fish. Studies show it reduces heart disease, diabetes, and cognitive decline.',
    category: 'nutrition',
    icon: '🌊',
    image: '/health/meal.jpeg',
    benefits: [
      'Reduces heart disease risk by 30%',
      'Lowers inflammation throughout the body',
      'Protects against type 2 diabetes',
      'Supports healthy brain aging',
      'Promotes weight management naturally',
      'Improves gut microbiome diversity'
    ],
    methods: [
      {
        title: '7-Day Transition Plan',
        steps: [
          'Day 1-2: Add olive oil to meals, eat fish twice',
          'Day 3-4: Replace red meat with legumes and fish',
          'Day 5-6: Add vegetables to every meal',
          'Day 7: Try a traditional Greek salad',
          'Continue: Gradually phase out processed foods'
        ],
        duration: '7 days',
        frequency: 'Lifelong adoption'
      },
      {
        title: 'Weekly Meal Prep',
        steps: [
          'Shop for fresh vegetables, fruits, and fish',
          'Prepare quinoa and lentils in bulk',
          'Make Greek yogurt with berries for breakfast',
          'Pack olives and nuts for snacks',
          'Cook with herbs instead of salt'
        ],
        duration: '2 hours',
        frequency: 'Weekly'
      }
    ],
    precautions: [
      'Watch portion sizes of nuts and olive oil (calorie dense)',
      'Consult doctor if on blood thinners (vitamin K in greens)',
      'Choose low-mercury fish options'
    ],
    scientificFacts: [
      'PREDIMED study showed 30% reduction in cardiovascular events',
      'Rich in polyphenols that reduce inflammation',
      'Omega-3s from fish support brain health',
      'Fiber from plants feeds beneficial gut bacteria'
    ],
    recommendedFor: ['Heart patients', 'Anyone wanting to prevent disease'],
    successRate: 89,
    expertQuotes: [
      {
        name: 'Dr. Elena Rodriguez',
        credentials: 'Cardiologist',
        quote: 'The Mediterranean diet is the most studied and proven dietary pattern for longevity and heart health.'
      }
    ],
    resources: [
      { title: 'Mediterranean Recipes', type: 'article', url: '#' },
      { title: 'Shopping List PDF', type: 'pdf', url: '#' }
    ],
    tags: ['nutrition', 'heart health', 'diet', 'longevity']
  },
  {
    id: 't3',
    title: 'Sleep Optimization Protocol',
    shortDescription: 'Transform your sleep quality with science-backed methods',
    detailedDescription: 'Quality sleep is the foundation of good health. This comprehensive guide helps you optimize your sleep environment, routine, and habits for restorative rest that repairs your body and consolidates memory.',
    category: 'sleep',
    icon: '😴',
    image: '/health/sleep.jpeg',
    benefits: [
      'Enhances memory consolidation by 40%',
      'Reduces cortisol and stress hormones',
      'Supports immune function',
      'Regulates appetite hormones',
      'Improves athletic recovery',
      'Boosts mood and emotional stability'
    ],
    methods: [
      {
        title: '90-Minute Wind-Down Routine',
        steps: [
          '90 min before bed: Dim lights, stop screens',
          '60 min before: Take warm bath/shower',
          '45 min before: Read fiction or meditate',
          '30 min before: Gentle stretching or journaling',
          '15 min before: Herbal tea, prepare bedroom'
        ],
        duration: '90 minutes',
        frequency: 'Every night'
      },
      {
        title: 'Sleep Environment Optimization',
        steps: [
          'Keep bedroom temperature 65-68°F (18-20°C)',
          'Use blackout curtains or eye mask',
          'Try white noise or earplugs',
          'Replace pillows every 1-2 years',
          'Remove electronics from bedroom'
        ],
        duration: '1 hour setup',
        frequency: 'One-time with maintenance'
      }
    ],
    precautions: [
      'Avoid alcohol before bed (disrupts REM)',
      'Limit caffeine after 2 PM',
      'Consult sleep specialist if snoring (sleep apnea risk)'
    ],
    scientificFacts: [
      'Sleep clears beta-amyloid from the brain (Alzheimer\'s prevention)',
      'Deep sleep triggers growth hormone release',
      'REM sleep processes emotional memories',
      'Sleep deprivation mimics insulin resistance'
    ],
    recommendedFor: ['Everyone', 'Shift workers', 'New parents', 'Students'],
    successRate: 92,
    expertQuotes: [
      {
        name: 'Dr. Matthew Walker',
        credentials: 'Sleep Scientist, Author',
        quote: 'Sleep is the Swiss Army knife of health. When you get enough, everything improves.'
      }
    ],
    resources: [
      { title: 'Sleep Hygiene Checklist', type: 'pdf', url: '#' },
      { title: 'Guided Sleep Meditation', type: 'video', url: '#' }
    ],
    tags: ['sleep', 'recovery', 'mental health', 'hormones']
  },
  {
    id: 't4',
    title: 'Stress Management Through Mindfulness',
    shortDescription: 'Master evidence-based techniques to reduce stress',
    detailedDescription: 'Chronic stress damages your health. Learn mindfulness-based stress reduction (MBSR) techniques proven to lower cortisol, reduce anxiety, and improve quality of life.',
    category: 'mental',
    icon: '🧘',
    image: '/health/meditation.jpeg',
    benefits: [
      'Reduces cortisol levels by 25-30%',
      'Lowers blood pressure naturally',
      'Improves emotional regulation',
      'Enhances focus and concentration',
      'Boosts immune function',
      'Decreases anxiety and depression symptoms'
    ],
    methods: [
      {
        title: '5-Minute Emergency De-stress',
        steps: [
          'Find a quiet spot, sit comfortably',
          'Close eyes, take 3 deep breaths',
          'Scan body from head to toe, releasing tension',
          'Focus on breath for 2 minutes',
          'Notice thoughts without judgment, return to breath'
        ],
        duration: '5 minutes',
        frequency: 'As needed, especially during stress'
      },
      {
        title: 'Daily Mindfulness Practice',
        steps: [
          'Set aside 10-20 minutes same time daily',
          'Use guided app (Calm, Headspace)',
          'Practice mindful eating one meal',
          'Take 3 mindful breaths before meetings',
          'End day with gratitude journaling'
        ],
        duration: '15-20 minutes',
        frequency: 'Daily'
      }
    ],
    precautions: [
      'Start with short sessions if trauma history',
      'Consult therapist if anxiety increases',
      'Not a substitute for medical treatment'
    ],
    scientificFacts: [
      'MBSR changes brain structure (increases gray matter)',
      'Mindfulness reduces activity in amygdala (fear center)',
      'Regular practice lowers inflammatory markers',
      '8 weeks of practice can shrink amygdala size'
    ],
    recommendedFor: ['Everyone', 'High-stress professionals', 'Anxiety sufferers'],
    successRate: 87,
    expertQuotes: [
      {
        name: 'Jon Kabat-Zinn',
        credentials: 'Founder of MBSR',
        quote: 'You can\'t stop the waves, but you can learn to surf.'
      }
    ],
    resources: [
      { title: 'Guided Body Scan', type: 'video', url: '#' },
      { title: 'MBSR Course PDF', type: 'pdf', url: '#' }
    ],
    tags: ['mental health', 'stress', 'mindfulness', 'meditation']
  },
  {
    id: 't5',
    title: 'Functional Fitness for Daily Life',
    shortDescription: 'Build strength that translates to real-world activities',
    detailedDescription: 'Functional fitness trains your muscles to work together for daily activities. These exercises improve balance, coordination, and strength for everything from carrying groceries to playing with kids.',
    category: 'exercise',
    icon: '🏋️',
    image: '/health/fitness.jpeg',
    benefits: [
      'Prevents falls in older adults by 35%',
      'Improves posture and reduces back pain',
      'Enhances athletic performance',
      'Builds core strength for stability',
      'Increases bone density',
      'Makes daily tasks easier'
    ],
    methods: [
      {
        title: 'Beginner Functional Circuit',
        steps: [
          'Bodyweight squats (10-15 reps)',
          'Push-ups (modified if needed) (8-12 reps)',
          'Plank hold (30-60 seconds)',
          'Lunges (10 each leg)',
          'Glute bridges (15 reps)',
          'Rest 60 sec, repeat 3 rounds'
        ],
        duration: '20 minutes',
        frequency: '3-4 times per week'
      },
      {
        title: 'Progress to Advanced',
        steps: [
          'Add resistance bands or dumbbells',
          'Incorporate kettlebell swings',
          'Try single-leg exercises',
          'Add medicine ball throws',
          'Include farmer\'s carries'
        ],
        duration: '30-40 minutes',
        frequency: '3-4 times per week'
      }
    ],
    precautions: [
      'Start with bodyweight, master form',
      'Stop if sharp pain, not muscle fatigue',
      'Consult PT if previous injuries',
      'Stay hydrated during workout'
    ],
    scientificFacts: [
      'Functional training recruits more muscle fibers',
      'Improves neuromuscular coordination',
      'Mirrors real-life movement patterns',
      'Better carryover to daily activities than machine isolation'
    ],
    recommendedFor: ['All adults', 'Seniors', 'Athletes', 'Office workers'],
    successRate: 88,
    expertQuotes: [
      {
        name: 'Coach Mike Boyle',
        credentials: 'Strength Coach',
        quote: 'Train movements, not muscles. Your body doesn\'t know isolation—it knows patterns.'
      }
    ],
    resources: [
      { title: 'Home Workout Guide', type: 'pdf', url: '#' },
      { title: 'Form Tutorial Videos', type: 'video', url: '#' }
    ],
    tags: ['exercise', 'strength', 'fitness', 'functional']
  },
  {
    id: 't6',
    title: 'Heart Health Monitoring',
    shortDescription: 'Track and improve your cardiovascular wellness',
    detailedDescription: 'Your heart is your body\'s engine. Learn to monitor key indicators, understand your numbers, and implement lifestyle changes that strengthen your cardiovascular system for longevity.',
    category: 'wellness',
    icon: '❤️',
    image: '/health/heart.jpeg',
    benefits: [
      'Early detection of potential issues',
      'Reduces heart attack risk by 40%',
      'Lowers blood pressure naturally',
      'Improves cholesterol profiles',
      'Increases cardiovascular endurance',
      'Better circulation throughout body'
    ],
    methods: [
      {
        title: 'Weekly Heart Health Check',
        steps: [
          'Check resting heart rate (normal 60-100 bpm)',
          'Monitor blood pressure (target <120/80)',
          'Track exercise heart rate recovery',
          'Note any chest pain or palpitations',
          'Record in health app or journal'
        ],
        duration: '10 minutes',
        frequency: 'Weekly'
      },
      {
        title: 'Cardio Training Zones',
        steps: [
          'Calculate max heart rate (220 - age)',
          'Zone 2: 60-70% of max (conversational pace)',
          'Zone 3: 70-80% (moderate intensity)',
          'Zone 4: 80-90% (high intensity intervals)',
          'Mix zones for best results'
        ],
        duration: '20-45 minutes',
        frequency: '3-5 times weekly'
      }
    ],
    precautions: [
      'Seek emergency care for chest pain',
      'Consult doctor before starting exercise if heart condition',
      'Don\'t obsess over numbers—trends matter more',
      'Consider family history in risk assessment'
    ],
    scientificFacts: [
      'Lower resting heart rate correlates with longevity',
      'VO2 max is strongest predictor of lifespan',
      'Heart rate variability indicates stress levels',
      'Exercise creates new blood vessels (angiogenesis)'
    ],
    recommendedFor: ['Everyone over 40', 'Family history of heart disease'],
    successRate: 91,
    expertQuotes: [
      {
        name: 'Dr. Steven Gundry',
        credentials: 'Cardiothoracic Surgeon',
        quote: 'Your heart is designed to beat 2.5 billion times. Protect it with lifestyle, not just medication.'
      }
    ],
    resources: [
      { title: 'Heart Health Tracker', type: 'pdf', url: '#' },
      { title: 'Understanding BP Video', type: 'video', url: '#' }
    ],
    tags: ['heart', 'cardiovascular', 'prevention', 'monitoring']
  }
];

const HealthTipsPage: React.FC = () => {
  const { language } = useLanguage();
  const { isMobile } = useScreenSize();
  const [dailyTips, setDailyTips] = useState<HealthTip[]>([]);
  const [savedTips, setSavedTips] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTip, setSelectedTip] = useState<HealthTip | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [activeMethod, setActiveMethod] = useState(0);

  // Load saved tips from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('th_saved_tips');
    if (saved) {
      try {
        setSavedTips(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing saved tips', e);
      }
    }
    
    // Load daily tips - always show 4 tips
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('th_daily_tips_date');
    const storedTips = localStorage.getItem('th_daily_tips');
    
    if (storedDate === today && storedTips) { 
      try {
        const parsed = JSON.parse(storedTips);
        setDailyTips(parsed);
      } catch (e) {
        console.error('Error parsing daily tips', e);
        refreshTips();
      }
    } else { 
      refreshTips(); 
    }
  }, []);

  const refreshTips = () => {
    // Select exactly 4 random tips for daily view
    const shuffled = [...ALL_TIPS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 4);
    setDailyTips(selected);
    localStorage.setItem('th_daily_tips', JSON.stringify(selected));
    localStorage.setItem('th_daily_tips_date', new Date().toDateString());
    toast.success('Fresh health tips loaded! ✨');
  };

  const toggleSave = (tipId: string) => {
    const updated = savedTips.includes(tipId) 
      ? savedTips.filter(id => id !== tipId) 
      : [...savedTips, tipId];
    setSavedTips(updated);
    localStorage.setItem('th_saved_tips', JSON.stringify(updated));
    toast.success(savedTips.includes(tipId) ? 'Tip removed' : 'Tip saved to collection');
  };

  const categories = ['all', ...new Set(ALL_TIPS.map(t => t.category))];
  
  const filteredTips = selectedCategory === 'all' 
    ? ALL_TIPS 
    : ALL_TIPS.filter(t => t.category === selectedCategory);

  const savedTipsList = ALL_TIPS.filter(t => savedTips.includes(t.id));

  const categoryIcons: Record<string, JSX.Element> = {
    all: <Sparkles className="h-4 w-4" />,
    nutrition: <Apple className="h-4 w-4" />,
    exercise: <Dumbbell className="h-4 w-4" />,
    sleep: <Moon className="h-4 w-4" />,
    mental: <Brain className="h-4 w-4" />,
    hydration: <Droplet className="h-4 w-4" />,
    wellness: <Sun className="h-4 w-4" />
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      nutrition: 'from-green-500 to-emerald-500',
      exercise: 'from-orange-500 to-red-500',
      sleep: 'from-indigo-500 to-purple-500',
      mental: 'from-pink-500 to-rose-500',
      hydration: 'from-blue-500 to-cyan-500',
      wellness: 'from-yellow-500 to-amber-500'
    };
    return colors[category] || 'from-primary to-primary/70';
  };

  // Safe helper functions to handle undefined values
  const getBenefits = (tip: HealthTip) => tip.benefits || [];
  const getMethods = (tip: HealthTip) => tip.methods || [];
  const getScientificFacts = (tip: HealthTip) => tip.scientificFacts || [];
  const getPrecautions = (tip: HealthTip) => tip.precautions || [];
  const getExpertQuotes = (tip: HealthTip) => tip.expertQuotes || [];
  const getTags = (tip: HealthTip) => tip.tags || [];
  const getResources = (tip: HealthTip) => tip.resources || [];

  return (
    <PageLayout activePage="health">
      <div className="p-3 sm:p-6 max-w-7xl mx-auto">
        {/* Header with animated elements */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <motion.div
                animate={{ 
                  rotate: [0, -15, 15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Lightbulb className="h-8 w-8 text-yellow-500 fill-yellow-500" />
              </motion.div>
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Health & Wellness Guide
              </span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Evidence-based tips and methods to transform your health journey
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={refreshTips}
              className="group"
            >
              <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              New Tips
            </Button>
          </div>
        </motion.div>

        {/* Daily Tips Section - Now showing exactly 4 tips */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Today's Featured Tips
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dailyTips.map((tip, index) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedTip(tip);
                  setShowDetail(true);
                }}
              >
                <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={tip.image} 
                      alt={tip.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        // Fallback image if the main image fails to load
                        (e.target as HTMLImageElement).src = '/health';
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent`} />
                    <Badge 
                      className={`absolute top-3 right-3 bg-gradient-to-r ${getCategoryColor(tip.category)} text-white border-0`}
                    >
                      {tip.category}
                    </Badge>
                    <div className="absolute bottom-3 left-3 text-white">
                      <span className="text-3xl">{tip.icon}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold line-clamp-1">{tip.title}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(tip.id);
                        }}
                      >
                        {savedTips.includes(tip.id) ? (
                          <BookmarkCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {tip.shortDescription}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-primary">
                      <Award className="h-3 w-3" />
                      <span>{getBenefits(tip).length} benefits</span>
                      <span className="text-muted-foreground">•</span>
                      <span>{getMethods(tip).length} methods</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Category Tabs and All Tips */}
        <div className="mb-8">
          <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
            <ScrollableTabsList className="mb-4">
              {categories.map(cat => (
                <TabsTrigger key={cat} value={cat} className="flex items-center gap-2 capitalize">
                  {categoryIcons[cat] || <Sparkles className="h-4 w-4" />}
                  {cat}
                </TabsTrigger>
              ))}
            </ScrollableTabsList>

            <TabsContent value={selectedCategory} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTips.map((tip, index) => (
                  <motion.div
                    key={tip.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedTip(tip);
                      setShowDetail(true);
                    }}
                  >
                    <Card className="hover:shadow-md transition-all border-l-4" style={{ borderLeftColor: `var(--${tip.category})` }}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 text-4xl">{tip.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold">{tip.title}</h3>
                                <Badge variant="outline" className="mt-1 text-xs capitalize">
                                  {tip.category}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSave(tip.id);
                                }}
                              >
                                {savedTips.includes(tip.id) ? (
                                  <BookmarkCheck className="h-4 w-4 text-primary" />
                                ) : (
                                  <Bookmark className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {tip.shortDescription}
                            </p>
                            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {getBenefits(tip).length} benefits
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-blue-500" />
                                {tip.successRate || 0}% success
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Saved Tips Section */}
        {savedTipsList.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookmarkCheck className="h-5 w-5 text-primary" />
              Your Saved Tips ({savedTipsList.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {savedTipsList.map(tip => (
                <Card key={tip.id} className="bg-primary/5 border-primary/20">
                  <CardContent className="p-3 flex items-center gap-3">
                    <span className="text-2xl">{tip.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{tip.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{tip.category}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => toggleSave(tip.id)}
                    >
                      <BookmarkCheck className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Tip Modal - FIXED VERSION */}
        <AnimatePresence>
          {showDetail && selectedTip && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
              onClick={(e) => {
                // Only close if clicking directly on the overlay backdrop
                if (e.target === e.currentTarget) {
                  setShowDetail(false);
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-background rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button at top right */}
                <button
                  onClick={() => setShowDetail(false)}
                  className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors flex items-center justify-center text-lg font-bold"
                  aria-label="Close"
                >
                  ✕
                </button>

                {/* Hero Image */}
                <div className="relative h-64 md:h-80">
                  <img 
                    src={selectedTip.image} 
                    alt={selectedTip.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-5xl">{selectedTip.icon}</span>
                      <div>
                        <Badge className={`bg-gradient-to-r ${getCategoryColor(selectedTip.category)} text-white border-0 mb-2`}>
                          {selectedTip.category}
                        </Badge>
                        <h2 className="text-3xl font-bold">{selectedTip.title}</h2>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" />
                      Overview
                    </h3>
                    <p className="text-muted-foreground">{selectedTip.detailedDescription}</p>
                  </div>

                  {/* Key Benefits */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Key Benefits
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {getBenefits(selectedTip).map((benefit, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-950/30"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Methods/Tutorials */}
                  {getMethods(selectedTip).length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Step-by-Step Methods
                      </h3>
                      
                      {/* Method tabs */}
                      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        {getMethods(selectedTip).map((method, i) => (
                          <Button
                            key={i}
                            variant={activeMethod === i ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveMethod(i)}
                            className="flex-shrink-0"
                          >
                            {method.title}
                          </Button>
                        ))}
                      </div>

                      {/* Active method content */}
                      {getMethods(selectedTip)[activeMethod] && (
                        <motion.div
                          key={activeMethod}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-muted/50 rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {getMethods(selectedTip)[activeMethod].duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {getMethods(selectedTip)[activeMethod].duration}
                              </span>
                            )}
                            {getMethods(selectedTip)[activeMethod].frequency && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {getMethods(selectedTip)[activeMethod].frequency}
                              </span>
                            )}
                          </div>
                          
                          <ol className="space-y-2">
                            {getMethods(selectedTip)[activeMethod].steps.map((step, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                  {i + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Scientific Facts */}
                  {getScientificFacts(selectedTip).length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-500" />
                        Scientific Facts
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {getScientificFacts(selectedTip).map((fact, i) => (
                          <div key={i} className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                            <p className="text-sm">{fact}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Precautions */}
                  {getPrecautions(selectedTip).length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        Important Precautions
                      </h3>
                      <ul className="space-y-2">
                        {getPrecautions(selectedTip).map((precaution, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
                            <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span>{precaution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Expert Quote */}
                  {getExpertQuotes(selectedTip).length > 0 && (
                    <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
                      <p className="text-sm italic mb-2">"{getExpertQuotes(selectedTip)[0].quote}"</p>
                      <p className="text-xs font-semibold">
                        — {getExpertQuotes(selectedTip)[0].name}, {getExpertQuotes(selectedTip)[0].credentials}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-primary to-primary/80"
                      onClick={() => {
                        toggleSave(selectedTip.id);
                      }}
                    >
                      {savedTips.includes(selectedTip.id) ? (
                        <>
                          <BookmarkCheck className="h-4 w-4 mr-2" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4 mr-2" />
                          Save for Later
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  {/* Tags */}
                  {getTags(selectedTip).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {getTags(selectedTip).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
};

export default HealthTipsPage;