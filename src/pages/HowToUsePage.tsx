import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, User, Calendar, LineChart, Heart, Gamepad, Mountain, 
  Gift, Settings, ChevronRight, BookOpen, Target, Video, Stethoscope, 
  BookOpenCheck, ArrowRight, CheckCircle2, Sparkles, Rocket, Star
} from "lucide-react";

const HowToUsePage = () => {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('th_onboarding_steps') || '[]'); } catch { return []; }
  });
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const tutorialSteps = [
    { id: 1, title: "Set Up Your Profile", description: "Tell us about yourself", icon: <User className="h-6 w-6" />, path: "/profile", details: ["Enter your age, height, and weight", "Set dietary restrictions & allergies", "Choose your health goals"], tips: "A complete profile enables personalized recommendations!", priority: "Start here", color: "from-blue-500 to-cyan-500" },
    { id: 2, title: "Set Your Goals", description: "Define nutrition targets", icon: <Target className="h-6 w-6" />, path: "/progress", details: ["Set daily calorie targets", "Define macro ratios (protein, carbs, fats)", "Choose weekly health goals"], tips: "Goals keep you accountable and motivated!", priority: "Step 2", color: "from-red-500 to-orange-500" },
    { id: 3, title: "Explore Dashboard", description: "Your daily command center", icon: <LayoutDashboard className="h-6 w-6" />, path: "/dashboard", details: ["View today's nutrition summary", "Check your streak and points", "See meal recommendations"], tips: "Visit your dashboard every morning!", priority: "Daily", color: "from-green-500 to-emerald-500" },
    { id: 4, title: "Plan Your Meals", description: "Build your weekly menu", icon: <Calendar className="h-6 w-6" />, path: "/meal-planning", details: ["Browse 50+ healthy meals", "Drag meals into your weekly plan", "See nutritional breakdown per day"], tips: "Planning ahead saves time and calories!", priority: "Weekly", color: "from-amber-500 to-yellow-500" },
    { id: 5, title: "Track Your Progress", description: "Log daily health data", icon: <LineChart className="h-6 w-6" />, path: "/progress", details: ["Log calories, water, sleep, exercise", "View charts and trends over time", "Track BMI changes"], tips: "Consistent tracking = consistent results!", priority: "Daily", color: "from-purple-500 to-violet-500" },
    { id: 6, title: "Write in Your Journal", description: "Reflect on meals & mood", icon: <BookOpenCheck className="h-6 w-6" />, path: "/journal", details: ["Log daily meals with rich text", "Track your mood after eating", "Add photos and notes"], tips: "Journaling builds mindful eating habits!", priority: "Daily", color: "from-pink-500 to-rose-500" },
    { id: 7, title: "Take on Challenges", description: "Push yourself further", icon: <Mountain className="h-6 w-6" />, path: "/challenges", details: ["Join preset health challenges", "Create custom challenges", "Earn points and rewards"], tips: "Challenges turn health into a game!", priority: "Anytime", color: "from-indigo-500 to-blue-500" },
    { id: 8, title: "Play Nutrition Games", description: "Learn while having fun", icon: <Gamepad className="h-6 w-6" />, path: "/games", details: ["Take nutrition quizzes", "Complete daily quests", "Climb the leaderboard"], tips: "Games make nutrition education enjoyable!", priority: "Fun", color: "from-teal-500 to-green-500" },
    { id: 9, title: "Watch Cooking Videos", description: "Learn healthy recipes", icon: <Video className="h-6 w-6" />, path: "/cooking-videos", details: ["Browse by meal category", "Watch step-by-step guides", "Get inspiration for meal prep"], tips: "Visual learning makes cooking easier!", priority: "Anytime", color: "from-orange-500 to-red-500" },
    { id: 10, title: "Read Health Tips", description: "Expert wellness advice", icon: <Stethoscope className="h-6 w-6" />, path: "/health-tips", details: ["Daily evidence-based tips", "Save favorites for later", "Learn from expert quotes"], tips: "Small daily tips lead to big changes!", priority: "Daily", color: "from-cyan-500 to-blue-500" },
    { id: 11, title: "Customize Settings", description: "Make it yours", icon: <Settings className="h-6 w-6" />, path: "/settings", details: ["Toggle dark/light theme", "Change language", "Enable sound effects"], tips: "Customize for the best experience!", priority: "Once", color: "from-gray-500 to-slate-500" },
  ];

  const toggleComplete = (id: number) => {
    const updated = completedSteps.includes(id) 
      ? completedSteps.filter(s => s !== id) 
      : [...completedSteps, id];
    setCompletedSteps(updated);
    localStorage.setItem('th_onboarding_steps', JSON.stringify(updated));
  };

  const progressPercent = Math.round((completedSteps.length / tutorialSteps.length) * 100);
  const nextStep = tutorialSteps.find(s => !completedSteps.includes(s.id));

  return (
    <PageLayout activePage="how to use">
      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <BookOpen className="h-7 w-7 text-primary fill-primary/20" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Getting Started Guide</h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">Follow these steps to get the most out of TasteHealth. Complete each step and track your onboarding progress.</p>
        </motion.div>

        {/* Progress Overview */}
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
                    <Sparkles className="h-4 w-4" /> All done! You're a pro! 🎉
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

        {/* Recommended Next Step */}
        {nextStep && progressPercent < 100 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className={`border-2 border-primary/30 bg-gradient-to-r ${nextStep.color} bg-opacity-5 overflow-hidden relative`}>
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

        {/* Steps Grid */}
        <div className="space-y-3">
          {tutorialSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isExpanded = expandedStep === step.id;
            
            return (
              <motion.div 
                key={step.id} 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`transition-all cursor-pointer ${isCompleted ? 'border-green-300 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20' : 'hover:border-primary/30 hover:shadow-md'}`}>
                  {/* Main row */}
                  <div 
                    className="flex items-center gap-3 p-4"
                    onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  >
                    {/* Step number / check */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleComplete(step.id); }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-muted text-muted-foreground hover:bg-primary/20'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-sm font-bold">{step.id}</span>}
                    </button>

                    {/* Icon */}
                    <div className={`p-2 rounded-lg shrink-0 bg-gradient-to-br ${step.color} text-white`}>
                      {step.icon}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>{step.title}</h3>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{step.priority}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                    </div>

                    {/* Arrow */}
                    <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
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
                              <Button 
                                onClick={() => navigate(step.path)} 
                                className={`w-full text-xs bg-gradient-to-r ${step.color} text-white border-0`}
                                size="sm"
                              >
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
