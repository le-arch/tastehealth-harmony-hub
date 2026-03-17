import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster as Sonner } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NutritionProvider } from "../src/contexts/NutritionContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { useResponsive } from "../src/hooks/use-responsive";

// Direct imports 
import ProfilePage from "./pages/ProfilePage";
import MealPlanningPage from "./pages/MealPlanningPage";
import DashboardPage from "./pages/DashboardPage";
import ProgressPage from "./pages/ProgressPage";
import SettingsPage from "./pages/SettingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import NotFound from "./pages/NotFound";
import WelcomePage from "./pages/WelcomePage";
import GoalWizard from "./pages/GoalWizard";
import Favorites from "./pages/Favorites";
import NutritionGamificationSystem from "./components/gamification/NutritionGamificationSystem";
import PointsTransactionPage from "./pages/PointsTransactionsPage";
import ChallengesPage from "./pages/ChallengesPage";
import LevelBenefitsPage from "./pages/LevelBenefitsPage";
import DailyJournalPage from "./pages/DailyJournalPage";
import HowToUsePage from "./pages/HowToUsePage";
import CookingVideosPage from "./pages/CookingVideosPage";
import HealthTipsPage from "./pages/HealthTipsPage";

const queryClient = new QueryClient();

function App() {
  useResponsive();
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <LanguageProvider>
          <ThemeProvider>
            <NutritionProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Router>
                  <RouteTransitionWrapper />
                </Router>
              </TooltipProvider>
            </NutritionProvider>
          </ThemeProvider>
        </LanguageProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

function RouteTransitionWrapper() {
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, x: 0, y: 20 },
    in: { opacity: 1, x: 0, y: 0 },
    out: { opacity: 0, x: 0, y: -20 },
  };

  const pageTransition = { duration: 0.3 };

  const wrap = (Component: JSX.Element) => (
    <motion.div
      key={location.pathname}
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={pageTransition}
      className="h-full"
    >
      {Component}
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={wrap(<WelcomePage />)} />
        <Route path="/welcome" element={wrap(<WelcomePage />)} />
        <Route path="/profile" element={wrap(<ProfilePage />)} />
        <Route path="/meal-planning" element={wrap(<MealPlanningPage />)} />
        <Route path="/dashboard" element={wrap(<DashboardPage />)} />
        <Route path="/progress" element={wrap(<ProgressPage />)} />
        <Route path="/settings" element={wrap(<SettingsPage />)} />
        <Route path="/notifications" element={wrap(<NotificationsPage />)} />
        <Route path="/goals" element={wrap(<GoalWizard />)} />
        <Route path="/favorites" element={wrap(<Favorites />)} />
        <Route path="/games" element={wrap(<NutritionGamificationSystem />)} />
        <Route path="/points" element={wrap(<PointsTransactionPage />)} />
        <Route path="/challenges" element={wrap(<ChallengesPage />)} />
        <Route path="/benefits" element={wrap(<LevelBenefitsPage />)} />
        <Route path="/journal" element={wrap(<DailyJournalPage />)} />
        <Route path="/how-to-use" element={wrap(<HowToUsePage />)} />
        <Route path="/cooking-videos" element={wrap(<CookingVideosPage />)} />
        <Route path="/health-tips" element={wrap(<HealthTipsPage />)} />
        <Route path="*" element={wrap(<NotFound />)} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
