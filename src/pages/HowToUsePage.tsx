import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, User, Calendar, LineChart, Heart, Gamepad, Mountain, 
  Settings, ChevronRight, BookOpen, Target, Video, Stethoscope, 
  BookOpenCheck, ArrowRight, CheckCircle2, Sparkles, Rocket, Star,
  ChefHat, Flame, Trophy, Smile, Droplet, Dumbbell
} from "lucide-react";

const HowToUsePage = () => {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('th_onboarding_steps') || '[]'); } catch { return []; }
  });
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const tutorialSteps = [
    { id: 1, title: "Set Up Your Profile", description: "Tell us about yourself to get personalized recommendations", icon: <User className="h-6 w-6" />, path: "/profile", details: ["Enter your age, height, and weight", "Set dietary restrictions & allergies", "Choose your health goals (weight loss, muscle gain, etc.)"], tips: "A complete profile unlocks personalized meal suggestions and calorie targets!", priority: "Start here", color: "from-blue-500 to-cyan-500" },
    { id: 2, title: "Set Your Nutrition Goals", description: "Define daily calorie & macro targets", icon: <Target className="h-6 w-6" />, path: "/progress", details: ["Set your daily calorie target based on your goals", "Customize macro ratios (protein, carbs, fats)", "Set weekly health milestones to stay on track"], tips: "The Goal Wizard will help calculate your ideal targets based on your profile!", priority: "Step 2", color: "from-red-500 to-orange-500" },
    { id: 3, title: "Explore Your Dashboard", description: "Your daily health command center", icon: <LayoutDashboard className="h-6 w-6" />, path: "/dashboard", details: ["Check your daily streak and check in every day 🔥", "View today's nutrition summary and progress wheel", "Get personalized meal recommendations", "Access the meal prep timer for guided cooking"], tips: "Visit your dashboard every morning to check in and plan your day!", priority: "Daily", color: "from-green-500 to-emerald-500" },
    { id: 4, title: "Plan Your Weekly Meals", description: "Build a complete weekly meal timetable", icon: <Calendar className="h-6 w-6" />, path: "/meal-planning", details: ["Create a new meal plan for each week", "Use the Add Meal button to fill your timetable", "Choose from 50+ meals in the database or add custom meals", "Each meal auto-syncs to your daily tracker", "Search meal plans by name to find them quickly"], tips: "Planning ahead saves time and keeps you on track with your nutrition goals!", priority: "Weekly", color: "from-amber-500 to-yellow-500" },
    { id: 5, title: "Track Daily Progress", description: "Log calories, water, sleep & exercise", icon: <LineChart className="h-6 w-6" />, path: "/progress", details: ["Log your daily calorie intake from meals", "Track water intake (aim for 8+ cups daily 💧)", "Record sleep hours and quality 😴", "Log exercise sessions and calories burned 🏋️", "View your weekly health report and trends"], tips: "Consistent daily tracking leads to the best results — even small logs matter!", priority: "Daily", color: "from-purple-500 to-violet-500" },
    { id: 6, title: "Track Your Meal Mood", description: "Record how meals make you feel", icon: <Smile className="h-6 w-6" />, path: "/dashboard", details: ["Rate each meal on a 1-5 mood scale", "Add notes about how the meal affected your energy", "View mood statistics and patterns over time", "Discover which meals make you feel best"], tips: "Understanding meal-mood connections helps you make better food choices!", priority: "After meals", color: "from-pink-500 to-rose-500" },
    { id: 7, title: "Write in Your Journal", description: "Reflect on your nutrition journey", icon: <BookOpenCheck className="h-6 w-6" />, path: "/journal", details: ["Write daily reflections about your meals", "Tag entries for easy organization", "Track your emotional relationship with food"], tips: "Journaling builds mindful eating habits and self-awareness!", priority: "Daily", color: "from-teal-500 to-cyan-500" },
    { id: 8, title: "Take on Challenges", description: "Push yourself with structured goals", icon: <Mountain className="h-6 w-6" />, path: "/games", details: ["Browse preset challenges (hydration, protein, fitness)", "Create custom challenges with the Challenge Creator", "Use quick templates to get started fast", "Log daily progress and build streaks", "Earn points on challenge completion"], tips: "Start with an Easy 7-day challenge to build momentum!", priority: "Anytime", color: "from-indigo-500 to-blue-500" },
    { id: 9, title: "Play Nutrition Games", description: "Learn nutrition through fun activities", icon: <Gamepad className="h-6 w-6" />, path: "/games", details: ["Complete daily nutrition quests for points", "Take nutrition quizzes to test your knowledge", "Earn badges and climb the leaderboard", "Level up through 15 tiers (Beginner → Supreme)", "View your level benefits and unlock rewards"], tips: "Games make learning fun — try to complete at least one quest daily!", priority: "Fun", color: "from-orange-500 to-amber-500" },
    { id: 10, title: "Read Daily Health Tips", description: "Expert wellness advice delivered daily", icon: <Stethoscope className="h-6 w-6" />, path: "/health-tips", details: ["Read 4 curated health tips every day", "Tips cover nutrition, exercise, sleep, and wellness", "Evidence-based advice from health experts"], tips: "Small daily tips compound into big health improvements over time!", priority: "Daily", color: "from-cyan-500 to-blue-500" },
    { id: 11, title: "Customize Your Settings", description: "Make the app work for you", icon: <Settings className="h-6 w-6" />, path: "/settings", details: ["Toggle dark/light theme for comfort", "Switch between English and French", "Enable/disable sound effects", "Manage notification preferences"], tips: "Set up once for the best personalized experience!", priority: "Once", color: "from-gray-500 to-slate-500" },
  ];

  const toggleComplete = (id: number) => {
    const updated = completedSteps.includes(id) 
      ? completedSteps.filter(s => s !== id) 
      : [...completedSteps, id];
    setCompletedSteps(updated);
    localStorage.setItem('th_onboarding_steps', JSON.stringify(updated));
  };

  React.useEffect(() => {
    const auto: number[] = [...completedSteps];
    try {
      const profile = localStorage.getItem('th_profile');
      if (profile && JSON.parse(profile)?.age && !auto.includes(1)) auto.push(1);
      const goals = localStorage.getItem('th_saved_goals');
      if (goals && JSON.parse(goals)?.length > 0 && !auto.includes(2)) auto.push(2);
      const plans = localStorage.getItem('th_meal_plans');
      if (plans && JSON.parse(plans)?.length > 0 && !auto.includes(4)) auto.push(4);
      const calories = localStorage.getItem('th_calorie_log');
      if (calories && JSON.parse(calories)?.length > 0 && !auto.includes(5)) auto.push(5);
      const journal = localStorage.getItem('th_journal_entries');
      if (journal && JSON.parse(journal)?.length > 0 && !auto.includes(7)) auto.push(7);
      const challenges = localStorage.getItem('th_challenges');
      if (challenges && JSON.parse(challenges)?.length > 0 && !auto.includes(8)) auto.push(8);
      const mood = localStorage.getItem('th_mood_log');
      if (mood && JSON.parse(mood)?.length > 0 && !auto.includes(6)) auto.push(6);
    } catch {}
    if (auto.length !== completedSteps.length) {
      setCompletedSteps(auto);
      localStorage.setItem('th_onboarding_steps', JSON.stringify(auto));
    }
  }, []);

  const progressPercent = Math.round((completedSteps.length / tutorialSteps.length) * 100);
  const nextStep = tutorialSteps.find(s => !completedSteps.includes(s.id));

  return (
    <PageLayout activePage="how to use">
      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <BookOpen className="h-7 w-7 text-primary fill-primary/20" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Getting Started Guide</h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">Follow these steps to master TasteHealth. Complete each step and track your onboarding progress.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Onboarding Progress</h3>
                </div>
                <Badge variant={progressPercent === 100 ? "default" : "secondary"}>
                  {completedSteps.length}/{tutorialSteps.length} completed
                </Badge>
              </div>
              <Progress value={progressPercent} className="h-3 mb-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{progressPercent}% complete</span>
                {progressPercent === 100 ? (
                  <span className="text-primary font-medium flex items-center gap-1">
                    <Sparkles className="h-4 w-4" /> All done! You're a TasteHealth pro! 🎉
                  </span>
                ) : nextStep ? (
                  <Button variant="link" size="sm" className="p-0 h-auto text-primary" onClick={() => setExpandedStep(nextStep.id)}>
                    Next: {nextStep.title} <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {nextStep && progressPercent < 100 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className={`border-2 border-primary/30 overflow-hidden relative`}>
              <div className={`absolute inset-0 bg-gradient-to-r ${nextStep.color} opacity-5`} />
              <CardContent className="p-4 relative">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">Recommended Next</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-background rounded-xl shadow-sm">{nextStep.icon}</div>
                    <div>
                      <h3 className="font-bold text-base">{nextStep.title}</h3>
                      <p className="text-xs text-muted-foreground">{nextStep.description}</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => navigate(nextStep.path)} className="shrink-0">
                    Go <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="space-y-3">
          {tutorialSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isExpanded = expandedStep === step.id;
            
            return (
              <motion.div key={step.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
                <Card className={`transition-all cursor-pointer ${isCompleted ? 'border-green-300 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20' : 'hover:border-primary/30 hover:shadow-md'}`}>
                  <div className="flex items-center gap-3 p-4" onClick={() => setExpandedStep(isExpanded ? null : step.id)}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleComplete(step.id); }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isCompleted ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground hover:bg-primary/20'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-sm font-bold">{step.id}</span>}
                    </button>
                    <div className={`p-2 rounded-lg shrink-0 bg-gradient-to-br ${step.color} text-white`}>
                      {step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>{step.title}</h3>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{step.priority}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                    </div>
                    <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="px-4 pb-4 pt-0 border-t border-border/50">
                          <div className="grid gap-3 sm:grid-cols-2 mt-3">
                            <div>
                              <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">What you'll do</h4>
                              <ul className="space-y-1.5">
                                {step.details.map((d, i) => (
                                  <li key={i} className="text-xs flex items-start gap-2">
                                    <span className="text-primary mt-0.5">•</span> {d}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="bg-primary/5 p-3 rounded-lg mb-3">
                                <p className="text-xs font-medium text-primary">💡 {step.tips}</p>
                              </div>
                              <Button onClick={() => navigate(step.path)} className={`w-full text-xs bg-gradient-to-r ${step.color} text-white border-0`} size="sm">
                                Go to {step.title} <ArrowRight className="ml-1 h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};

export default HowToUsePage;
