import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  LineChart, 
  Heart, 
  Trophy, 
  Gamepad, 
  Star, 
  Mountain, 
  Gift,
  Pencil,
  Settings,
  ChevronRight,
  BookOpen,
  Target
} from "lucide-react";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { useMobile } from "@/utils/mobile";

// Main HowToUsePage component that provides a comprehensive tutorial for app usage
const HowToUsePage = () => {
  const isMobile = useMobile();

  // Array of tutorial steps with detailed information about each app feature
  const tutorialSteps = [
    {
      id: 1, // Unique identifier for this tutorial step
      title: "Dashboard Overview", // Title displayed in the tutorial card
      description: "Your central hub for tracking progress and accessing all features", // Brief description
      icon: <LayoutDashboard className="h-6 w-6" />, // Icon component to display
      path: "/dashboard", // Route path users can navigate to
      details: [ // Array of detailed explanation points
        "View your daily nutrition summary and progress",
        "Quick access to recent meals and activities", 
        "See your current streak and achievement highlights",
        "Monitor your weekly and monthly health trends"
      ],
      tips: "Check your dashboard daily to stay motivated and track your progress!" // Helpful tip for users
    },
    {
      id: 2, // Unique identifier for profile tutorial step
      title: "Profile Management", // Title for profile section
      description: "Customize your personal information and health goals", // Brief description
      icon: <User className="h-6 w-6" />, // User icon component
      path: "/profile", // Route to profile page
      details: [ // Detailed explanation of profile features
        "Update your personal information (name, age, height, weight)",
        "Set your dietary restrictions and allergies",
        "Define your health and fitness goals",
        "Adjust your daily calorie targets"
      ],
      tips: "Keep your profile updated for personalized meal recommendations!" // User tip
    },
    {
      id: 3, // Unique identifier for meal planning tutorial step
      title: "Meal Planning", // Title for meal planning section
      description: "Plan your meals in advance for better nutrition", // Brief description
      icon: <Calendar className="h-6 w-6" />, // Calendar icon component
      path: "/meal-planning", // Route to meal planning page
      details: [ // Detailed meal planning features
        "Browse and search through our extensive meal database",
        "Plan meals for today, tomorrow, or the entire week",
        "View detailed nutrition information for each meal",
        "Create custom meal combinations that match your goals"
      ],
      tips: "Planning meals in advance helps you stay on track with your nutrition goals!" // Planning tip
    },
    {
      id: 4, // Unique identifier for progress tracking tutorial step
      title: "Progress Tracking", // Title for progress section
      description: "Monitor your health journey with detailed analytics", // Brief description
      icon: <LineChart className="h-6 w-6" />, // Line chart icon component
      path: "/progress", // Route to progress page
      details: [ // Detailed progress tracking features
        "View detailed charts of your nutrition intake over time",
        "Track your weight, BMI, and body composition changes",
        "Monitor your daily activity levels and exercise progress",
        "Set and track custom health metrics"
      ],
      tips: "Regular tracking helps identify patterns and areas for improvement!" // Tracking tip
    },
    {
      id: 5, // Unique identifier for meal plan creation tutorial step
      title: "Create Meal Plans", // Title for meal plan creation
      description: "Build custom meal plans tailored to your needs", // Brief description
      icon: <Pencil className="h-6 w-6" />, // Pencil icon component
      path: "/meal-plan", // Route to meal plan creation page
      details: [ // Detailed meal plan creation features
        "Create personalized meal plans based on your dietary preferences",
        "Set calorie targets and macro nutrient goals",
        "Generate shopping lists automatically from your meal plans",
        "Save and reuse your favorite meal plan templates"
      ],
      tips: "Start with simple meal plans and gradually add more variety!" // Creation tip
    },
    {
      id: 6, // Unique identifier for favorites tutorial step
      title: "Favorites & Bookmarks", // Title for favorites section
      description: "Save and quickly access your favorite meals", // Brief description
      icon: <Heart className="h-6 w-6" />, // Heart icon component
      path: "/favorites", // Route to favorites page
      details: [ // Detailed favorites features
        "Bookmark meals you love for quick access later",
        "Create custom collections of related meals",
        "Rate and review meals to help other users",
        "Export your favorite recipes for offline use"
      ],
      tips: "Building a collection of favorite meals makes meal planning much easier!" // Favorites tip
    },
    {
      id: 7, // Unique identifier for goals tutorial step
      title: "Goal Wizard", // Title for goal setting section
      description: "Set and achieve your health and nutrition goals", // Brief description
      icon: <Trophy className="h-6 w-6" />, // Trophy icon component
      path: "/goals", // Route to goals page
      details: [ // Detailed goal setting features
        "Use our guided wizard to set realistic health goals",
        "Choose from weight loss, muscle gain, or maintenance goals",
        "Set specific targets for calories, macros, and exercise",
        "Track your progress toward each goal with visual indicators"
      ],
      tips: "Set specific, measurable goals that align with your lifestyle!" // Goal setting tip
    },
    {
      id: 8, // Unique identifier for games tutorial step
      title: "Nutrition Games", // Title for gamification section
      description: "Learn nutrition through fun, interactive games", // Brief description
      icon: <Gamepad className="h-6 w-6" />, // Gamepad icon component
      path: "/games", // Route to games page
      details: [ // Detailed nutrition games features
        "Play educational games to learn about nutrition facts",
        "Challenge yourself with food identification quizzes",
        "Earn points and badges for completing game levels",
        "Compete with friends on nutrition knowledge leaderboards"
      ],
      tips: "Games make learning about nutrition fun and memorable!" // Gaming tip
    },
    {
      id: 9, // Unique identifier for points tutorial step
      title: "Points & Rewards", // Title for points system section
      description: "Earn points and unlock rewards for healthy activities", // Brief description
      icon: <Star className="h-6 w-6" />, // Star icon component
      path: "/points", // Route to points page
      details: [ // Detailed points system features
        "Earn points for logging meals, completing workouts, and meeting goals",
        "View your complete points transaction history",
        "Redeem points for app features, recipes, or virtual rewards",
        "Track your total points and see how you rank among users"
      ],
      tips: "Consistent daily activities earn the most points over time!" // Points tip
    },
    {
      id: 10, // Unique identifier for challenges tutorial step
      title: "Challenges", // Title for challenges section
      description: "Join exciting nutrition and fitness challenges", // Brief description
      icon: <Mountain className="h-6 w-6" />, // Mountain icon component
      path: "/challenges", // Route to challenges page
      details: [ // Detailed challenges features
        "Participate in daily, weekly, and monthly nutrition challenges",
        "Create custom challenges and invite friends to join",
        "Track your progress with other challenge participants",
        "Earn special rewards and badges for completing challenges"
      ],
      tips: "Challenges provide motivation and help build healthy habits!" // Challenges tip
    },
    {
      id: 11, // Unique identifier for benefits tutorial step
      title: "Level Benefits", // Title for level system section
      description: "Unlock exclusive features as you level up", // Brief description
      icon: <Gift className="h-6 w-6" />, // Gift icon component
      path: "/benefits", // Route to benefits page
      details: [ // Detailed level benefits features
        "Level up by consistently using the app and meeting goals",
        "Unlock premium features like advanced analytics and custom themes",
        "Access exclusive meal plans and nutrition content",
        "Get priority support and early access to new features"
      ],
      tips: "Higher levels unlock more personalized and advanced features!" // Level benefits tip
    },
    {
      id: 12, // Unique identifier for settings tutorial step
      title: "Settings & Preferences", // Title for settings section
      description: "Customize your app experience and preferences", // Brief description
      icon: <Settings className="h-6 w-6" />, // Settings icon component
      path: "/settings", // Route to settings page
      details: [ // Detailed settings features
        "Adjust notification preferences for reminders and updates",
        "Change app theme (light/dark mode) and language settings",
        "Manage your account security and privacy settings",
        "Configure data export and backup options"
      ],
      tips: "Customize your settings to match your preferences and lifestyle!" // Settings tip
    }
  ];

  // Function to handle navigation to a specific tutorial step's corresponding page
  const handleNavigateToFeature = (path: string) => {
    window.location.href = path; // Navigate to the specified route
  };

  // Main component render function with responsive layout
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile/Tablet: Stack sidebar and content vertically */}
      {isMobile ? (
        <div className="flex flex-col">
          <div className="w-full">
            <ProfileSidebar />
          </div>
          <div className="flex-1 px-4 py-6">
            <HowToUseContent 
              tutorialSteps={tutorialSteps} 
              handleNavigateToFeature={handleNavigateToFeature} 
            />
          </div>
        </div>
      ) : (
        /* Desktop: Side-by-side layout */
        <div className="flex min-h-screen">
          <div className="w-80 flex-shrink-0">
            <ProfileSidebar />
          </div>
          <div className="flex-1 px-6 py-8">
            <HowToUseContent 
              tutorialSteps={tutorialSteps} 
              handleNavigateToFeature={handleNavigateToFeature} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Separate component for the main content to keep it clean and reusable
const HowToUseContent = ({ tutorialSteps, handleNavigateToFeature }: {
  tutorialSteps: any[];
  handleNavigateToFeature: (path: string) => void;
}) => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Page header section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">How to Use TasteHealth</h1>
        </div>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
          Welcome to your comprehensive guide for getting the most out of TasteHealth. 
          Follow these steps to master all the features and achieve your health goals!
        </p>
        <Badge variant="secondary" className="text-xs sm:text-sm">
          {tutorialSteps.length} Features to Explore
        </Badge>
      </div>

      {/* Getting started section */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <CardTitle className="text-lg sm:text-xl">Quick Start Guide</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">New to TasteHealth?</h4>
              <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                <li>• Start by completing your profile information</li>
                <li>• Set your health goals using the Goal Wizard</li>
                <li>• Plan your first meal to get familiar with the interface</li>
                <li>• Explore the dashboard to see your progress</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Pro Tips</h4>
              <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                <li>• Log meals daily for accurate nutrition tracking</li>
                <li>• Join challenges to stay motivated</li>
                <li>• Use the favorites feature for quick meal planning</li>
                <li>• Check your progress weekly to stay on track</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tutorial steps grid - responsive */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {tutorialSteps.map((step) => (
          <Card key={step.id} className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                  {step.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base sm:text-lg leading-tight">{step.title}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1">
                    {step.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-semibold text-xs sm:text-sm mb-2">What you can do:</h4>
                <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                  {step.details.map((detail: string, index: number) => (
                    <li key={index} className="leading-relaxed">• {detail}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-200">
                  💡 Tip: {step.tips}
                </p>
              </div>
              
              <Button 
                onClick={() => handleNavigateToFeature(step.path)}
                className="w-full text-xs sm:text-sm"
                variant="outline"
              >
                Try This Feature
                <ChevronRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer section with additional help */}
      <Card className="text-center">
        <CardContent className="py-6 sm:py-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Need More Help?</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 px-4">
            If you have questions or need additional support, don't hesitate to reach out to our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
            <Button variant="outline" className="text-sm">
              Contact Support
            </Button>
            <Button variant="outline" className="text-sm">
              View FAQ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HowToUsePage;
