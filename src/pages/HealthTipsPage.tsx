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
  Zap,
  Wind 
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
  },
  // Add these new tips to the ALL_TIPS array

// ... existing tips ...

// New Tips Start Here

{
  id: 't7',
  title: 'Gut Health & Microbiome Balance',
  shortDescription: 'Nurture your gut for better digestion and immunity',
  detailedDescription: 'Your gut houses trillions of bacteria that influence everything from digestion to mood, immunity, and even weight. Learn how to cultivate a diverse and healthy microbiome for optimal wellness.',
  category: 'nutrition',
  icon: '🦠',
  image: '/health/gut-health.jpeg',
  benefits: [
    'Strengthens immune system by 70-80%',
    'Improves mood and reduces anxiety',
    'Enhances nutrient absorption',
    'Reduces bloating and digestive discomfort',
    'Supports healthy weight management',
    'May reduce inflammation throughout body'
  ],
  methods: [
    {
      title: 'Microbiome Diversity Protocol',
      steps: [
        'Eat 30+ different plant foods weekly',
        'Include fermented foods daily (kimchi, sauerkraut, kefir)',
        'Take a high-quality probiotic with multiple strains',
        'Consume prebiotic fibers (garlic, onions, bananas, oats)',
        'Reduce processed foods and artificial sweeteners'
      ],
      duration: 'Ongoing',
      frequency: 'Daily commitment'
    },
    {
      title: 'Fermented Foods Introduction',
      steps: [
        'Start with 1 tablespoon of sauerkraut daily',
        'Gradually increase to 1/4 cup over 2 weeks',
        'Try different varieties: kimchi, kefir, kombucha',
        'Make your own fermented vegetables at home',
        'Rotate fermented foods for diverse bacteria strains'
      ],
      duration: '5-10 minutes daily',
      frequency: 'Every day'
    }
  ],
  precautions: [
    'Start slowly if new to fermented foods (may cause bloating)',
    'Consult doctor if immunocompromised or on immunosuppressants',
    'Some people with histamine intolerance may react to fermented foods',
    'Avoid if you have SIBO without professional guidance'
  ],
  scientificFacts: [
    'Gut bacteria outnumber human cells 10 to 1',
    'The gut produces 90% of your body\'s serotonin',
    'A diverse microbiome is linked to longevity',
    'Antibiotics can disrupt gut flora for up to a year'
  ],
  recommendedFor: ['Everyone', 'Those with digestive issues', 'Immunocompromised individuals', 'Anyone taking antibiotics'],
  successRate: 86,
  expertQuotes: [
    {
      name: 'Dr. Emeran Mayer',
      credentials: 'Gastroenterologist, Author of "The Mind-Gut Connection"',
      quote: 'The gut microbiome is like a forgotten organ that influences every aspect of our health.'
    }
  ],
  resources: [
    { title: 'Fermentation Guide', type: 'pdf', url: '#' },
    { title: 'Probiotic Buying Guide', type: 'article', url: '#' }
  ],
  tags: ['gut health', 'digestion', 'probiotics', 'immunity', 'microbiome']
},
{
  id: 't8',
  title: 'Morning Sunlight Exposure',
  shortDescription: 'Harness the power of morning light for circadian health',
  detailedDescription: 'Morning sunlight is the most powerful regulator of your internal clock. Proper light exposure sets your circadian rhythm, improves sleep quality, boosts mood, and optimizes hormone production.',
  category: 'wellness',
  icon: '☀️',
  image: '/health/sunlight.jpeg',
  benefits: [
    'Resets circadian rhythm for better sleep',
    'Boosts morning cortisol (healthy stress response)',
    'Increases serotonin production',
    'Supports vitamin D synthesis',
    'Improves alertness and cognitive function',
    'Reduces risk of seasonal affective disorder'
  ],
  methods: [
    {
      title: 'Morning Light Protocol',
      steps: [
        'Go outside within 30-60 minutes of waking',
        'Expose eyes to sunlight for 10-20 minutes (no sunglasses)',
        'Don\'t look directly at the sun—just be outside',
        'If overcast, extend to 20-30 minutes',
        'Combine with morning walk or stretching'
      ],
      duration: '10-30 minutes',
      frequency: 'Daily, preferably every morning'
    },
    {
      title: 'Winter/Cloudy Day Alternatives',
      steps: [
        'Use a light therapy lamp (10,000 lux) for 20-30 minutes',
        'Position lamp at eye level while eating breakfast',
        'Open all curtains immediately upon waking',
        'Take morning breaks near windows',
        'Consider SAD lamp if seasonal depression'
      ],
      duration: '20-30 minutes',
      frequency: 'Daily during darker months'
    }
  ],
  precautions: [
    'Protect skin with sunscreen after initial exposure',
    'Never look directly at the sun',
    'Avoid if you have photosensitivity conditions',
    'Consult doctor if taking photosensitizing medications'
  ],
  scientificFacts: [
    'Morning light suppresses melatonin and sets circadian clock',
    'Light exposure before 10 AM has strongest circadian benefits',
    'Even cloudy days provide 10x more light than indoor lighting',
    'Light exposure timing affects sleep quality that night'
  ],
  recommendedFor: ['Everyone', 'Poor sleepers', 'Shift workers', 'Depression sufferers'],
  successRate: 94,
  expertQuotes: [
    {
      name: 'Dr. Andrew Huberman',
      credentials: 'Neuroscientist, Stanford University',
      quote: 'Morning sunlight viewing is the most powerful tool we have for regulating our entire biology.'
    }
  ],
  resources: [
    { title: 'Circadian Rhythm Guide', type: 'pdf', url: '#' },
    { title: 'Light Therapy Explained', type: 'video', url: '#' }
  ],
  tags: ['circadian rhythm', 'sunlight', 'sleep', 'hormones', 'mood']
},
{
  id: 't9',
  title: 'Mobility & Flexibility Routine',
  shortDescription: 'Maintain movement freedom with daily mobility work',
  detailedDescription: 'Mobility training keeps your joints healthy and movement patterns efficient. Unlike static stretching, mobility work strengthens through full range of motion, preventing injuries and maintaining independence as you age.',
  category: 'exercise',
  icon: '🧘‍♀️',
  image: '/health/mobility.jpeg',
  benefits: [
    'Reduces injury risk by up to 50%',
    'Improves posture and reduces back pain',
    'Enhances athletic performance',
    'Maintains independence in older age',
    'Increases blood flow to joints',
    'Corrects movement compensations'
  ],
  methods: [
    {
      title: '10-Minute Daily Mobility Flow',
      steps: [
        'Cat-cow stretches for spine (10 reps)',
        'World\'s greatest stretch (30 sec each side)',
        'Thoracic spine rotations on hands/knees (10 each side)',
        'Hip CARs (controlled articular rotations) (5 each leg)',
        'Deep squat hold (60 seconds)',
        'Neck CARs in all directions (slowly)'
      ],
      duration: '10 minutes',
      frequency: 'Daily, especially before exercise'
    },
    {
      title: 'Joint-by-Joint Reset',
      steps: [
        'Ankles: ankle CARs (10 each direction)',
        'Hips: 90/90 hip switches (10 each side)',
        'Spine: seated spinal twists (30 sec each side)',
        'Shoulders: arm circles and thread-the-needle',
        'Wrists: wrist CARs and stretches'
      ],
      duration: '15 minutes',
      frequency: '3-4 times weekly'
    }
  ],
  precautions: [
    'Never push through sharp pain',
    'Move within pain-free range of motion',
    'Warm up before intense mobility work',
    'Avoid bouncing during stretches'
  ],
  scientificFacts: [
    'Mobility training increases synovial fluid production',
    'Regular movement prevents fascial adhesions',
    'Joint mobility declines after just 2 weeks of inactivity',
    'Better mobility correlates with longer lifespan'
  ],
  recommendedFor: ['Everyone', 'Desk workers', 'Athletes', 'Seniors'],
  successRate: 90,
  expertQuotes: [
    {
      name: 'Dr. Kelly Starrett',
      credentials: 'Physical Therapist, MobilityWOD',
      quote: 'Every human being deserves to move with total freedom and live without pain.'
    }
  ],
  resources: [
    { title: 'Daily Mobility PDF', type: 'pdf', url: '#' },
    { title: 'Mobility Video Tutorials', type: 'video', url: '#' }
  ],
  tags: ['mobility', 'flexibility', 'joint health', 'prevention', 'movement']
},
{
  id: 't10',
  title: 'Breathwork Fundamentals',
  shortDescription: 'Transform your physiology through conscious breathing',
  detailedDescription: 'Breath is the bridge between body and mind. Specific breathing techniques can activate the parasympathetic nervous system, reduce stress, improve focus, and enhance physical performance.',
  category: 'mental',
  icon: '🌬️',
  image: '/health/breathwork.jpeg',
  benefits: [
    'Activates relaxation response in seconds',
    'Reduces anxiety and panic symptoms',
    'Improves heart rate variability',
    'Enhances focus and mental clarity',
    'Lowers blood pressure',
    'Increases oxygen efficiency'
  ],
  methods: [
    {
      title: 'Box Breathing (4-4-4-4)',
      steps: [
        'Find comfortable seated position',
        'Inhale slowly for 4 counts',
        'Hold breath for 4 counts',
        'Exhale slowly for 4 counts',
        'Hold empty for 4 counts',
        'Repeat for 5-10 minutes'
      ],
      duration: '5-10 minutes',
      frequency: 'Daily, especially during stress'
    },
    {
      title: 'Physiological Sigh',
      steps: [
        'Take a deep inhale through nose',
        'Take a second, sharper inhale to fully inflate lungs',
        'Exhale slowly and completely through mouth',
        'Repeat 2-3 times',
        'Notice immediate calmness'
      ],
      duration: '30 seconds',
      frequency: 'As needed for stress relief'
    },
    {
      title: 'Extended Exhale Technique',
      steps: [
        'Inhale through nose for 4 counts',
        'Exhale through mouth for 6-8 counts',
        'Focus on making exhale longer than inhale',
        'Continue for 5-10 minutes',
        'Use before sleep for better rest'
      ],
      duration: '5-10 minutes',
      frequency: 'Daily or before sleep'
    }
  ],
  precautions: [
    'Stop if feeling dizzy or lightheaded',
    'Don\'t hyperventilate intentionally',
    'Consult doctor if you have respiratory conditions',
    'Avoid breath holds if pregnant or with certain heart conditions'
  ],
  scientificFacts: [
    'Slow breathing increases HRV (marker of resilience)',
    'Breathwork activates the vagus nerve (parasympathetic)',
    'Conscious breathing changes brain wave patterns',
    'Extended exhale shifts nervous system to rest mode'
  ],
  recommendedFor: ['Everyone', 'Anxiety sufferers', 'Meditators', 'High-stress professionals'],
  successRate: 91,
  expertQuotes: [
    {
      name: 'James Nestor',
      credentials: 'Author of "Breath"',
      quote: 'How we breathe matters—it\'s the most underrated tool for health optimization.'
    }
  ],
  resources: [
    { title: 'Breathing Techniques Guide', type: 'pdf', url: '#' },
    { title: 'Guided Breathwork Audio', type: 'video', url: '#' }
  ],
  tags: ['breathing', 'stress', 'relaxation', 'nervous system', 'anxiety']
},
{
  id: 't11',
  title: 'Cold Exposure Therapy',
  shortDescription: 'Harness cold water for resilience and recovery',
  detailedDescription: 'Controlled cold exposure activates powerful physiological responses: increased dopamine, reduced inflammation, improved circulation, and enhanced mental toughness. Start slowly and build tolerance.',
  category: 'wellness',
  icon: '❄️',
  image: '/health/cold-therapy.jpeg',
  benefits: [
    'Increases dopamine by 250% (long-lasting)',
    'Reduces inflammation and muscle soreness',
    'Boosts immune function',
    'Improves mood and mental resilience',
    'Increases brown fat activation',
    'Enhances recovery after exercise'
  ],
  methods: [
    {
      title: 'Gradual Cold Shower Protocol',
      steps: [
        'Start with 30 seconds of cold at end of shower',
        'Gradually increase to 1 minute after 1 week',
        'Work up to 2-3 minutes over several weeks',
        'Focus on controlled breathing',
        'Don\'t tense up—relax into the cold'
      ],
      duration: '30 seconds to 3 minutes',
      frequency: 'Daily or 3-4 times weekly'
    },
    {
      title: 'Advanced: Ice Bath',
      steps: [
        'Fill tub with cold water (50-60°F/10-15°C)',
        'Start with 1-2 minutes',
        'Work up to 5-10 minutes max',
        'Use breathing to stay calm',
        'Exit immediately if shivering uncontrollably'
      ],
      duration: '2-10 minutes',
      frequency: '2-3 times weekly'
    }
  ],
  precautions: [
    'Never do alone if advanced exposure',
    'Avoid if you have Raynaud\'s or cardiovascular conditions',
    'Warm up gradually after—don\'t take hot shower immediately',
    'Stop if numbness or severe pain',
    'Consult doctor if pregnant or have blood pressure issues'
  ],
  scientificFacts: [
    'Cold exposure increases norepinephrine (focus hormone)',
    'Regular exposure improves insulin sensitivity',
    'Cold water immersion reduces cortisol',
    'Activates brown adipose tissue (metabolism boost)'
  ],
  recommendedFor: ['Athletes', 'Depression sufferers', 'Anyone wanting mental resilience'],
  successRate: 88,
  expertQuotes: [
    {
      name: 'Dr. Susanna Søberg',
      credentials: 'Cold Exposure Researcher',
      quote: 'The discomfort of cold is temporary, but the benefits—both mental and physical—last.'
    }
  ],
  resources: [
    { title: 'Cold Therapy Safety Guide', type: 'pdf', url: '#' },
    { title: 'Wim Hof Method Intro', type: 'video', url: '#' }
  ],
  tags: ['cold therapy', 'recovery', 'resilience', 'hormones', 'inflammation']
},
{
  id: 't12',
  title: 'Blue Light Management',
  shortDescription: 'Protect your sleep by managing artificial light',
  detailedDescription: 'Artificial blue light from screens disrupts melatonin production and circadian rhythms. Learn to manage light exposure for better sleep, reduced eye strain, and improved overall health.',
  category: 'sleep',
  icon: '📱',
  image: '/health/blue-light.jpeg',
  benefits: [
    'Improves sleep onset and quality',
    'Reduces eye strain and headaches',
    'Protects long-term eye health',
    'Supports natural melatonin production',
    'Improves next-day alertness',
    'Reduces circadian disruption'
  ],
  methods: [
    {
      title: 'Evening Light Protocol',
      steps: [
        'Dim lights 2-3 hours before bed',
        'Enable night mode on all devices',
        'Use blue light blocking glasses after sunset',
        'Switch to warm/red light bulbs in evening',
        'No screens in bedroom—use books instead',
        'Set phone to grayscale mode before bed'
      ],
      duration: '2-3 hours nightly',
      frequency: 'Every evening'
    },
    {
      title: 'Screen Protection Setup',
      steps: [
        'Install f.lux or use built-in night shift',
        'Set to activate at sunset automatically',
        'Reduce screen brightness significantly',
        'Position screens at arm\'s length',
        'Follow 20-20-20 rule: every 20 min, look 20 ft away for 20 sec'
      ],
      duration: 'Ongoing',
      frequency: 'Daily during screen use'
    }
  ],
  precautions: [
    'Get morning sunlight to offset evening light exposure',
    'Not all blue light is bad—daytime exposure is beneficial',
    'Consistency matters more than perfection'
  ],
  scientificFacts: [
    'Blue light suppresses melatonin 2x more than other wavelengths',
    'Evening screen use delays sleep onset by 10-30 minutes',
    'Circadian disruption linked to metabolic diseases',
    'Light at night increases breast cancer risk (studies show)'
  ],
  recommendedFor: ['Everyone', 'Late-night screen users', 'Poor sleepers', 'Office workers'],
  successRate: 89,
  expertQuotes: [
    {
      name: 'Dr. Matthew Walker',
      credentials: 'Sleep Scientist',
      quote: 'Your eyes are not designed to see bright light at night. Every light after sunset is a signal to your brain that it\'s still daytime.'
    }
  ],
  resources: [
    { title: 'Blue Light Guide', type: 'pdf', url: '#' },
    { title: 'Sleep Hygiene Checklist', type: 'pdf', url: '#' }
  ],
  tags: ['blue light', 'sleep', 'circadian rhythm', 'eye health', 'digital wellness']
},
{
  id: 't13',
  title: 'Intermittent Fasting Fundamentals',
  shortDescription: 'Time your eating for metabolic flexibility',
  detailedDescription: 'Intermittent fasting isn\'t about what you eat, but when. Time-restricted eating aligns with your circadian biology, giving your digestive system rest and triggering cellular repair processes.',
  category: 'nutrition',
  icon: '⏰',
  image: '/health/fasting.jpeg',
  benefits: [
    'Improves insulin sensitivity by 25-30%',
    'Triggers autophagy (cellular cleanup)',
    'Supports healthy weight management',
    'Reduces inflammation markers',
    'Improves mental clarity and focus',
    'May increase longevity'
  ],
  methods: [
    {
      title: '16:8 Time-Restricted Eating',
      steps: [
        'Choose 8-hour eating window (e.g., 12 PM - 8 PM)',
        'Fast for remaining 16 hours (water, black coffee only)',
        'Start eating window with nutrient-dense meal',
        'Finish last meal 2-3 hours before bed',
        'Stay consistent with timing daily'
      ],
      duration: 'Ongoing',
      frequency: 'Daily'
    },
    {
      title: 'Gradual Introduction',
      steps: [
        'Start with 12-hour fast (eat 7 AM - 7 PM)',
        'Extend to 14 hours after 1 week',
        'Work up to 16 hours after 2-3 weeks',
        'Listen to hunger cues—don\'t force it',
        'Stay hydrated with electrolytes'
      ],
      duration: '2-3 weeks to adapt',
      frequency: 'Daily'
    }
  ],
  precautions: [
    'Not recommended for underweight, pregnant, or breastfeeding',
    'Consult doctor if diabetic or on medications',
    'May not be suitable for eating disorder history',
    'Ensure adequate nutrition during eating window',
    'Women may need shorter fasts (12-14 hours)'
  ],
  scientificFacts: [
    'Autophagy peaks after 16-18 hours of fasting',
    'Time-restricted eating aligns with circadian biology',
    'Fasting increases BDNF (brain health protein)',
    'Alternate-day fasting shows similar benefits'
  ],
  recommendedFor: ['Metabolic health seekers', 'Weight management', 'Anti-aging enthusiasts'],
  successRate: 84,
  expertQuotes: [
    {
      name: 'Dr. Satchin Panda',
      credentials: 'Circadian Biology Researcher, Salk Institute',
      quote: 'When you eat may be as important as what you eat. Time-restricted eating aligns with our biology.'
    }
  ],
  resources: [
    { title: 'Fasting Protocol Guide', type: 'pdf', url: '#' },
    { title: 'Electrolyte Recipe', type: 'article', url: '#' }
  ],
  tags: ['fasting', 'metabolism', 'longevity', 'insulin', 'autophagy']
},
{
  id: 't14',
  title: 'Nature Exposure & Forest Bathing',
  shortDescription: 'Reconnect with nature for profound health benefits',
  detailedDescription: 'Shinrin-yoku, or forest bathing, is the Japanese practice of immersing yourself in nature. Studies show time in green spaces reduces stress hormones, boosts immunity, and improves mood.',
  category: 'mental',
  icon: '🌲',
  image: '/health/forest-bathing.jpeg',
  benefits: [
    'Reduces cortisol by 16%',
    'Increases natural killer (NK) cells by 50%',
    'Lowers blood pressure and heart rate',
    'Improves mood and reduces anxiety',
    'Enhances creativity and focus',
    'Reduces symptoms of depression'
  ],
  methods: [
    {
      title: 'Forest Bathing Protocol',
      steps: [
        'Find a natural area with trees',
        'Leave phone on airplane mode',
        'Walk slowly with no destination',
        'Engage all senses: smell, touch, listen',
        'Sit quietly for 10-15 minutes',
        'Aim for 2 hours total (research-backed)'
      ],
      duration: '1-2 hours',
      frequency: 'Weekly minimum'
    },
    {
      title: 'Urban Nature Adaptation',
      steps: [
        'Visit parks or botanical gardens',
        'Sit under a tree for 20 minutes',
        'Bring nature indoors with plants',
        'Open windows for fresh air',
        'Look at nature images if indoors'
      ],
      duration: '20-60 minutes',
      frequency: 'Daily if possible'
    }
  ],
  precautions: [
    'Wear appropriate clothing and insect protection',
    'Check for ticks after walks',
    'Stay on marked trails in wilderness areas',
    'Avoid during poor air quality alerts'
  ],
  scientificFacts: [
    'Phytoncides from trees increase NK cell activity',
    '20 minutes in nature significantly lowers stress markers',
    'Nature sounds activate parasympathetic nervous system',
    'Green space exposure linked to 12% lower mortality'
  ],
  recommendedFor: ['Everyone', 'Urban dwellers', 'High-stress individuals', 'Nature lovers'],
  successRate: 92,
  expertQuotes: [
    {
      name: 'Dr. Qing Li',
      credentials: 'Author of "Forest Bathing"',
      quote: 'Forest bathing is not exercise, not hiking—it\'s simply being in nature, connecting with it through your senses.'
    }
  ],
  resources: [
    { title: 'Local Park Finder', type: 'link', url: '#' },
    { title: 'Forest Bathing Guide PDF', type: 'pdf', url: '#' }
  ],
  tags: ['nature', 'stress reduction', 'immunity', 'mental health', 'wellness']
},
{
  id: 't15',
  title: 'Posture Correction & Ergonomics',
  shortDescription: 'Fix your posture for pain-free living',
  detailedDescription: 'Modern sedentary lifestyles have created an epidemic of poor posture. Learn to correct "tech neck," rounded shoulders, and anterior pelvic tilt for better health, breathing, and appearance.',
  category: 'exercise',
  icon: '🪑',
  image: '/health/posture.jpeg',
  benefits: [
    'Eliminates chronic neck and back pain',
    'Improves breathing capacity by 30%',
    'Reduces tension headaches',
    'Enhances athletic performance',
    'Boosts confidence and presence',
    'Prevents degenerative spine issues'
  ],
  methods: [
    {
      title: 'Ergonomic Workspace Setup',
      steps: [
        'Monitor at eye level (top of screen at or below eye level)',
        'Elbows at 90 degrees, wrists straight',
        'Feet flat on floor, knees at 90 degrees',
        'Chair supporting lower back',
        'Screen arm\'s length away',
        'Use external keyboard and mouse'
      ],
      duration: 'Ongoing',
      frequency: 'Daily during work'
    },
    {
      title: 'Posture Reset Exercises',
      steps: [
        'Wall angels (10-15 reps)',
        'Chin tucks (10 reps, hold 3 sec)',
        'Thoracic extensions over foam roller',
        'Doorway chest stretch (30 sec each side)',
        'Glute bridges (15 reps)',
        'Set hourly posture check reminders'
      ],
      duration: '10 minutes',
      frequency: 'Every 1-2 hours during sitting'
    }
  ],
  precautions: [
    'Don\'t overcorrect—posture should feel natural',
    'Consult physical therapist if chronic pain',
    'Avoid prolonged static positions',
    'Movement breaks are more important than perfect posture'
  ],
  scientificFacts: [
    'For every inch of forward head posture, head weight increases 10 lbs',
    'Poor posture reduces lung capacity',
    'Posture affects hormone levels (testosterone, cortisol)',
    'Upright posture increases pain tolerance'
  ],
  recommendedFor: ['Desk workers', 'Students', 'Smartphone users', 'Anyone with back pain'],
  successRate: 87,
  expertQuotes: [
    {
      name: 'Dr. Stuart McGill',
      credentials: 'Back Pain Specialist, Author',
      quote: 'The best posture is your next posture. Movement and variability are key to spinal health.'
    }
  ],
  resources: [
    { title: 'Ergonomics Checklist', type: 'pdf', url: '#' },
    { title: 'Posture Exercise Videos', type: 'video', url: '#' }
  ],
  tags: ['posture', 'ergonomics', 'back pain', 'desk health', 'alignment']
},
{
  id: 't16',
  title: 'Social Connection & Longevity',
  shortDescription: 'Cultivate relationships for a longer, healthier life',
  detailedDescription: 'Strong social connections are one of the strongest predictors of longevity. Loneliness and social isolation rival smoking and obesity as mortality risk factors. Learn to build and maintain meaningful relationships.',
  category: 'wellness',
  icon: '👥',
  image: '/health/social-connection.jpeg',
  benefits: [
    'Reduces mortality risk by 50%',
    'Lowers inflammation markers',
    'Improves cardiovascular health',
    'Boosts immune function',
    'Provides emotional resilience',
    'Protects against cognitive decline'
  ],
  methods: [
    {
      title: 'Weekly Connection Plan',
      steps: [
        'Schedule 2-3 quality social interactions weekly',
        'Call one friend you haven\'t spoken to recently',
        'Join a group or class with shared interests',
        'Eat meals with others when possible',
        'Volunteer in your community',
        'Practice active listening in conversations'
      ],
      duration: 'Ongoing',
      frequency: 'Weekly'
    },
    {
      title: 'Building New Connections',
      steps: [
        'Identify communities around interests (sports, books, faith)',
        'Attend regularly to build familiarity',
        'Start with small talk and shared activities',
        'Initiate follow-up after meeting',
        'Be vulnerable and authentic',
        'Focus on quality over quantity of connections'
      ],
      duration: 'Ongoing',
      frequency: 'Consistent effort'
    }
  ],
  precautions: [
    'Quality matters more than quantity',
    'Protect boundaries with toxic relationships',
    'Don\'t force connections—let them develop naturally',
    'Seek professional help if social anxiety is severe'
  ],
  scientificFacts: [
    'Harvard Study of Adult Development: relationships are #1 predictor of happiness',
    'Loneliness increases cortisol and inflammation',
    'Social support improves recovery from illness',
    'Having 5+ close friends reduces depression risk by 60%'
  ],
  recommendedFor: ['Everyone', 'Those feeling isolated', 'New movers', 'Retirees'],
  successRate: 85,
  expertQuotes: [
    {
      name: 'Dr. Robert Waldinger',
      credentials: 'Harvard Study of Adult Development Director',
      quote: 'The people who were most satisfied in their relationships at age 50 were the healthiest at age 80.'
    }
  ],
  resources: [
    { title: 'Connection Challenge', type: 'pdf', url: '#' },
    { title: 'TED Talk: What Makes a Good Life', type: 'video', url: '#' }
  ],
  tags: ['social health', 'longevity', 'relationships', 'community', 'mental health']
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
    wellness: <Sun className="h-4 w-4" />,
    circadian: <Sun className="h-4 w-4" />,
    breathing: <Wind className="h-4 w-4" />,
    mobility: <Activity className="h-4 w-4" />
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      nutrition: 'from-green-500 to-emerald-500',
      exercise: 'from-orange-500 to-red-500',
      sleep: 'from-indigo-500 to-purple-500',
      mental: 'from-pink-500 to-rose-500',
      hydration: 'from-blue-500 to-cyan-500',
      wellness: 'from-yellow-500 to-amber-500',
      circadian: 'from-amber-500 to-orange-500',
      breathing: 'from-sky-500 to-blue-500',
      mobility: 'from-teal-500 to-emerald-500'
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