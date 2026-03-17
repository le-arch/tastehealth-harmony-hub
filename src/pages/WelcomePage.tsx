import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import AuthForm from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Utensils, Activity, DropletIcon, Award, Flame, Sparkles,
  CheckCircle2, Target, Heart, Brain, Calendar, Zap, Apple, Dumbbell,
  Moon, BookOpen, Gamepad, ChevronDown
} from "lucide-react";

const WelcomePage = () => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem('th_current_user');
    if (currentUser) navigate('/dashboard');
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => setActiveFeature(prev => (prev + 1) % 6), 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAuthenticated = async (user: any) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const existingNotifs = JSON.parse(localStorage.getItem('th_notifications') || '[]');
    if (existingNotifs.length === 0) {
      const welcomeNotifs = [
        { id: crypto.randomUUID(), date: new Date().toISOString(), title: `Welcome to TasteHealth, ${user.firstName}!`, message: "Your journey to better nutrition starts now!", read: false, type: 'welcome' },
        { id: crypto.randomUUID(), date: new Date().toISOString(), title: 'Complete Your Profile', message: 'Set up your profile for personalized recommendations.', read: false, type: 'profile' },
        { id: crypto.randomUUID(), date: new Date().toISOString(), title: 'Set Your First Goal', message: 'Use the Goal Wizard to set nutrition targets.', read: false, type: 'goal' },
      ];
      localStorage.setItem('th_notifications', JSON.stringify(welcomeNotifs));
    }
    setIsLoading(false);
    navigate("/dashboard");
  };

  const features = [
    { icon: <Utensils className="h-5 w-5" />, title: 'Smart Meal Planning', desc: 'Browse 50+ healthy meals. Build weekly plans with auto nutrition tracking.', color: 'bg-green-100 dark:bg-green-900/30 text-green-600' },
    { icon: <Activity className="h-5 w-5" />, title: 'Health Tracking', desc: 'Track calories, water, sleep, exercise, and BMI with beautiful charts.', color: 'bg-red-100 dark:bg-red-900/30 text-red-500' },
    { icon: <DropletIcon className="h-5 w-5" />, title: 'Hydration Reminders', desc: 'Smart water reminders with sound notifications and daily tracking.', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
    { icon: <Award className="h-5 w-5" />, title: 'Gamification', desc: 'Earn points, badges, and rewards. Complete challenges and climb levels.', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' },
    { icon: <BookOpen className="h-5 w-5" />, title: 'Daily Journal', desc: 'Log meals with rich text formatting. Track mood and build mindful eating habits.', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' },
    { icon: <Gamepad className="h-5 w-5" />, title: 'Nutrition Games', desc: 'Take quizzes, complete quests, and learn nutrition in a fun interactive way.', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600' },
  ];

  const highlights = [
    { icon: <Apple className="h-4 w-4" />, text: "50+ Healthy Meals" },
    { icon: <Target className="h-4 w-4" />, text: "Goal Tracking" },
    { icon: <Flame className="h-4 w-4" />, text: "Calorie Counter" },
    { icon: <Moon className="h-4 w-4" />, text: "Sleep Tracker" },
    { icon: <Dumbbell className="h-4 w-4" />, text: "Exercise Log" },
    { icon: <Brain className="h-4 w-4" />, text: "Health Insights" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-3" />
            <p className="text-primary font-medium">Setting up your account...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="w-full py-3 px-4 flex justify-between items-center bg-background/50 backdrop-blur-sm sticky top-0 z-10 border-b border-border/50">
        <Logo size="lg" />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowAuthForm(true)}>Sign In</Button>
          <Button size="sm" onClick={() => setShowAuthForm(true)} className="bg-primary hover:bg-primary/90">Get Started</Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-4">
        <AnimatePresence mode="wait">
          {showAuthForm ? (
            <motion.div key="auth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md mx-auto py-8">
              <Button variant="ghost" size="sm" onClick={() => setShowAuthForm(false)} className="mb-4">← Back</Button>
              <AuthForm onAuthenticated={handleAuthenticated} />
            </motion.div>
          ) : (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto py-6 sm:py-12 space-y-8">
              
              {/* Hero Section */}
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  <Badge variant="secondary" className="mb-3">
                    <Sparkles className="h-3 w-3 mr-1" /> Your Complete Health Companion
                  </Badge>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-foreground"
                >
                  Eat Smarter. <span className="text-primary">Live Healthier.</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  className="text-base sm:text-lg text-muted-foreground"
                >
                  TasteHealth helps you plan nutritious meals, track your health metrics, build healthy habits through gamification, and become the healthiest version of yourself.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Button size="lg" onClick={() => setShowAuthForm(true)} className="bg-primary hover:bg-primary/90 text-lg px-8">
                    Start Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                    See Features <ChevronDown className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>

                {/* Quick highlights */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap justify-center gap-2 pt-4">
                  {highlights.map((h, i) => (
                    <Badge key={i} variant="outline" className="gap-1 py-1">
                      {h.icon} {h.text}
                    </Badge>
                  ))}
                </motion.div>
              </div>

              {/* What TasteHealth Does */}
              <div id="features" className="space-y-4 pt-4">
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Everything You Need for Better Health</h2>
                  <p className="text-sm text-muted-foreground mt-1">All-in-one nutrition, fitness, and wellness platform</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {features.map((feature, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.08 }}>
                      <Card className={`h-full hover:shadow-lg transition-all cursor-default ${activeFeature === index ? 'ring-2 ring-primary/30 shadow-md' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg shrink-0 ${feature.color}`}>{feature.icon}</div>
                            <div>
                              <h3 className="font-semibold text-sm">{feature.title}</h3>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{feature.desc}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* How It Works */}
              <div className="space-y-4 pt-4">
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">How It Works</h2>
                  <p className="text-sm text-muted-foreground mt-1">Get started in 3 simple steps</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { step: 1, title: "Create Your Profile", desc: "Tell us your goals, dietary preferences, and health targets for personalized recommendations.", icon: <Heart className="h-6 w-6 text-red-500" /> },
                    { step: 2, title: "Plan & Track", desc: "Plan weekly meals, log calories, water, sleep, and exercise. See everything in beautiful charts.", icon: <Calendar className="h-6 w-6 text-blue-500" /> },
                    { step: 3, title: "Grow & Achieve", desc: "Complete challenges, earn rewards, level up, and build lasting healthy habits through gamification.", icon: <Zap className="h-6 w-6 text-amber-500" /> },
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                      <Card className="text-center h-full">
                        <CardContent className="p-5 flex flex-col items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">{item.step}</div>
                          <div className="p-3 rounded-xl bg-muted/50">{item.icon}</div>
                          <h3 className="font-bold text-sm">{item.title}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Key Benefits */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-center mb-4">Why TasteHealth?</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { text: "100% Free", sub: "No hidden costs" },
                        { text: "No Account Needed*", sub: "Try features instantly" },
                        { text: "Works Offline", sub: "Data stored locally" },
                        { text: "Privacy First", sub: "Your data stays yours" },
                      ].map((b, i) => (
                        <div key={i} className="text-center p-3 rounded-lg bg-background/60">
                          <CheckCircle2 className="h-5 w-5 text-primary mx-auto mb-1" />
                          <p className="text-sm font-semibold">{b.text}</p>
                          <p className="text-[10px] text-muted-foreground">{b.sub}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Final CTA */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-center pb-8">
                <h2 className="text-xl font-bold mb-2">Ready to Transform Your Health?</h2>
                <p className="text-sm text-muted-foreground mb-4">Join TasteHealth today — it's free and takes less than a minute.</p>
                <Button size="lg" onClick={() => setShowAuthForm(true)} className="bg-primary hover:bg-primary/90 text-lg px-10">
                  Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-4 px-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} TasteHealth. Built with ❤️ for your wellness.</p>
      </footer>
    </div>
  );
};

export default WelcomePage;
