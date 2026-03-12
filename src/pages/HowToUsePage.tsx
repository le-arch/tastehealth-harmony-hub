import React from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, User, Calendar, LineChart, Heart, Gamepad, Mountain, Gift, Pencil, Settings, ChevronRight, BookOpen, Target, Video, Stethoscope, BookOpenCheck } from "lucide-react";

const HowToUsePage = () => {
  const navigate = useNavigate();

  const tutorialSteps = [
    { id: 1, title: "Dashboard Overview", description: "Your central hub", icon: <LayoutDashboard className="h-6 w-6" />, path: "/dashboard", details: ["View daily nutrition summary", "Quick access to meals", "See streak and achievements"], tips: "Check your dashboard daily!" },
    { id: 2, title: "Profile Management", description: "Customize your info", icon: <User className="h-6 w-6" />, path: "/profile", details: ["Update personal info", "Set dietary restrictions", "Auto-calculate BMI"], tips: "Keep your profile updated!" },
    { id: 3, title: "Meal Planning", description: "Plan your meals", icon: <Calendar className="h-6 w-6" />, path: "/meal-planning", details: ["Browse meal database", "Plan weekly meals", "View nutrition info"], tips: "Plan meals in advance!" },
    { id: 4, title: "Progress Tracking", description: "Monitor your health", icon: <LineChart className="h-6 w-6" />, path: "/progress", details: ["View nutrition charts", "Track weight and BMI", "Set health goals"], tips: "Track regularly!" },
    { id: 5, title: "Daily Journal", description: "Track meals and recipes", icon: <BookOpenCheck className="h-6 w-6" />, path: "/journal", details: ["Log daily meals", "Add custom recipes", "Track mood"], tips: "Journal helps mindfulness!" },
    { id: 6, title: "Nutrition Games", description: "Learn interactively", icon: <Gamepad className="h-6 w-6" />, path: "/games", details: ["Take quizzes", "Complete quests", "Earn badges"], tips: "Games make learning fun!" },
    { id: 7, title: "Challenges", description: "Join challenges", icon: <Mountain className="h-6 w-6" />, path: "/challenges", details: ["Daily and weekly challenges", "Track progress", "Earn rewards"], tips: "Challenges build habits!" },
    { id: 8, title: "Cooking Videos", description: "Watch healthy recipes", icon: <Video className="h-6 w-6" />, path: "/cooking-videos", details: ["Browse by category", "Quick meal prep videos"], tips: "Watch for inspiration!" },
    { id: 9, title: "Health Tips", description: "Daily health advice", icon: <Stethoscope className="h-6 w-6" />, path: "/health-tips", details: ["Daily tips", "Save favorites", "Learn nutrition"], tips: "Check daily for new tips!" },
    { id: 10, title: "Settings", description: "Customize experience", icon: <Settings className="h-6 w-6" />, path: "/settings", details: ["Theme and language", "Nutrition preferences", "Send feedback"], tips: "Customize for best experience!" },
  ];

  return (
    <PageLayout activePage="how to use">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2"><BookOpen className="h-7 w-7 text-primary fill-green-500" /><h1 className="text-2xl sm:text-3xl font-bold text-primary">How to Use TasteHealth</h1></div>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">Your comprehensive guide to all features.</p>
          <Badge variant="secondary">{tutorialSteps.length} Features to Explore</Badge>
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><Target className="h-5 w-5 text-primary" />Quick Start</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><h4 className="font-semibold mb-2">New?</h4><ul className="text-xs space-y-1 text-muted-foreground"><li>• Complete your profile</li><li>• Set goals</li><li>• Plan your first meal</li></ul></div>
              <div><h4 className="font-semibold mb-2">Pro Tips</h4><ul className="text-xs space-y-1 text-muted-foreground"><li>• Log meals daily</li><li>• Join challenges</li><li>• Check progress weekly</li></ul></div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {tutorialSteps.map(step => (
            <Card key={step.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3"><div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">{step.icon}</div><div><CardTitle className="text-base">{step.title}</CardTitle><CardDescription className="text-xs mt-1">{step.description}</CardDescription></div></div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between space-y-3">
                <ul className="text-xs space-y-1 text-muted-foreground">{step.details.map((d, i) => <li key={i}>• {d}</li>)}</ul>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg"><p className="text-xs font-medium text-blue-800 dark:text-blue-200">💡 {step.tips}</p></div>
                <Button onClick={() => navigate(step.path)} className="w-full text-xs" variant="outline">Try This<ChevronRight className="ml-1 h-3 w-3" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default HowToUsePage;
