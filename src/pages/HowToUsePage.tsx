
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, User, Calendar, LineChart, Heart, Trophy, Gamepad, Star, Mountain, Gift, Pencil, Settings, ChevronRight, BookOpen, Target, Video, Stethoscope, BookOpenCheck } from "lucide-react";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { useScreenSize } from "@/utils/mobile";

const HowToUsePage = () => {
  const { isMobile } = useScreenSize();
  const navigate = useNavigate();

  const tutorialSteps = [
    { id: 1, title: "Dashboard Overview", description: "Your central hub for tracking progress", icon: <LayoutDashboard className="h-6 w-6" />, path: "/dashboard", details: ["View daily nutrition summary", "Quick access to recent meals", "See current streak and achievements", "Monitor weekly health trends"], tips: "Check your dashboard daily to stay motivated!" },
    { id: 2, title: "Profile Management", description: "Customize your personal information", icon: <User className="h-6 w-6" />, path: "/profile", details: ["Update personal info", "Set dietary restrictions", "Define health goals", "Adjust calorie targets"], tips: "Keep your profile updated for personalized recommendations!" },
    { id: 3, title: "Meal Planning", description: "Plan your meals for better nutrition", icon: <Calendar className="h-6 w-6" />, path: "/meal-planning", details: ["Browse meal database", "Plan meals for the week", "View nutrition information", "Create custom meal combos"], tips: "Planning meals in advance helps you stay on track!" },
    { id: 4, title: "Progress Tracking", description: "Monitor your health journey", icon: <LineChart className="h-6 w-6" />, path: "/progress", details: ["View nutrition charts", "Track weight and BMI", "Monitor activity levels", "Set and track health goals"], tips: "Regular tracking helps identify patterns!" },
    { id: 5, title: "Create Meal Plans", description: "Build custom meal plans", icon: <Pencil className="h-6 w-6" />, path: "/meal-plan", details: ["Create personalized meal plans", "Set calorie and macro targets", "Save and reuse templates"], tips: "Start simple and add variety!" },
    { id: 6, title: "Favorites", description: "Save your favorite meals", icon: <Heart className="h-6 w-6" />, path: "/favorites", details: ["Bookmark meals you love", "Filter by category", "Quick access for meal planning"], tips: "Building favorites makes meal planning easier!" },
    { id: 7, title: "Goal Wizard", description: "Set nutrition goals", icon: <Trophy className="h-6 w-6" />, path: "/goals", details: ["Set realistic health goals", "Choose weight loss, gain or maintenance", "Set specific calorie and macro targets"], tips: "Set specific, measurable goals!" },
    { id: 8, title: "Nutrition Games", description: "Learn through interactive games", icon: <Gamepad className="h-6 w-6" />, path: "/games", details: ["Take nutrition quizzes", "Complete quests", "Earn points and badges", "Compete on leaderboards"], tips: "Games make learning fun!" },
    { id: 9, title: "Points & Rewards", description: "Earn points for activities", icon: <Star className="h-6 w-6" />, path: "/points", details: ["Earn points for logging", "View transaction history", "Auto-claim rewards"], tips: "Consistent activities earn the most points!" },
    { id: 10, title: "Challenges", description: "Join nutrition challenges", icon: <Mountain className="h-6 w-6" />, path: "/challenges", details: ["Join daily and weekly challenges", "Create custom challenges", "Track progress", "Earn rewards for completion"], tips: "Challenges build healthy habits!" },
    { id: 11, title: "Level Benefits", description: "Unlock features as you level up", icon: <Gift className="h-6 w-6" />, path: "/benefits", details: ["Level up by using the app", "Unlock premium features", "Access exclusive content"], tips: "Higher levels unlock more features!" },
    { id: 12, title: "Daily Journal", description: "Track meals and add recipes", icon: <BookOpenCheck className="h-6 w-6" />, path: "/journal", details: ["Log daily meals", "Add custom recipes", "Track mood and notes"], tips: "Journaling helps you stay mindful!" },
    { id: 13, title: "Cooking Videos", description: "Watch healthy cooking recipes", icon: <Video className="h-6 w-6" />, path: "/cooking-videos", details: ["Browse recipe videos by category", "Learn healthy cooking techniques", "Watch quick meal prep videos"], tips: "Watch videos for inspiration!" },
    { id: 14, title: "Health Tips", description: "Daily health tips and advice", icon: <Stethoscope className="h-6 w-6" />, path: "/health-tips", details: ["Get daily health tips", "Save your favorite tips", "Learn about nutrition science"], tips: "Check daily for new health insights!" },
    { id: 15, title: "Settings", description: "Customize your experience", icon: <Settings className="h-6 w-6" />, path: "/settings", details: ["Adjust notifications", "Change theme and language", "Manage nutrition preferences", "Send feedback"], tips: "Customize settings for the best experience!" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <ProfileSidebar activePage="How to Use" />
      <div className={`flex-1 p-4 sm:p-6 ${isMobile ? '' : 'md:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">How to Use TasteHealth</h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">Your comprehensive guide to all features.</p>
            <Badge variant="secondary">{tutorialSteps.length} Features to Explore</Badge>
          </div>

          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2"><Target className="h-5 w-5 text-primary" />Quick Start Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">New to TasteHealth?</h4>
                  <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                    <li>• Complete your profile information</li>
                    <li>• Set goals using the Goal Wizard</li>
                    <li>• Plan your first meal</li>
                    <li>• Explore the dashboard</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Pro Tips</h4>
                  <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                    <li>• Log meals daily for accurate tracking</li>
                    <li>• Join challenges to stay motivated</li>
                    <li>• Use favorites for quick planning</li>
                    <li>• Check progress weekly</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {tutorialSteps.map(step => (
              <Card key={step.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">{step.icon}</div>
                    <div><CardTitle className="text-base sm:text-lg">{step.title}</CardTitle><CardDescription className="text-xs sm:text-sm mt-1">{step.description}</CardDescription></div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm mb-2">What you can do:</h4>
                    <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                      {step.details.map((d, i) => <li key={i}>• {d}</li>)}
                    </ul>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-200">💡 Tip: {step.tips}</p>
                  </div>
                  <Button onClick={() => navigate(step.path)} className="w-full text-xs sm:text-sm" variant="outline">
                    Try This Feature<ChevronRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToUsePage;
