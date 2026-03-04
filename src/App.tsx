import { lazy, Suspense, useEffect } from "react";
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
// import Layout from "./components/Layout";
//import TasteHealthLoader from "../src/components/TastehealthLoader"
// Import viewport height utility
import { useResponsive } from "../src/hooks/use-responsive";

// Create a react-query client instance (no hooks here)
const queryClient = new QueryClient();

// Pages
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const MealPlanningPage = lazy(() => import("./pages/MealPlanningPage"));
const MealPlanView = lazy(() => import("./pages/MealPlanView"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ProgressPage = lazy(() => import("./pages/ProgressPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const WelcomePage = lazy(() => import("./pages/WelcomePage"));
const GoalWizard = lazy(() => import("./pages/GoalWizard"));
//const MealBuilder = lazy(() => import("./pages/MealBuilder"));
const Favorites = lazy(() => import("./pages/Favorites"));
const NutritionGamificationSystem = lazy(
  () => import("./components/gamification/NutritionGamificationSystem")
);
const PointsTransactionPage = lazy(
  () => import("./pages/PointsTransactionsPage")
);
const ChallengesPage = lazy(() => import("./pages/ChallengesPage"));
const LevelBenefitsPage = lazy(() => import("./pages/LevelBenefitsPage"));
const MealPlanPage = lazy(() => import("./pages/MealPlanPage"));
const DailyJournalPage = lazy(() => import("./pages/DailyJournalPage"));
const HowToUsePage = lazy(() => import("./pages/HowToUsePage"));
const CookingVideosPage = lazy(() => import("./pages/CookingVideosPage"));
const HealthTipsPage = lazy(() => import("./pages/HealthTipsPage"));

function App() {
  // // Set up viewport height CSS variable
  // useViewportHeight();

  // // Add meta viewport tag for mobile responsiveness
  // useEffect(() => {
  //   // Check if viewport meta tag exists
  //   if (!document.querySelector('meta[name="viewport"]')) {
  //     const meta = document.createElement("meta");
  //     meta.name = "viewport";
  //     meta.content =
  //       "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";
  //     document.head.appendChild(meta);
  //   }
  // }, []);
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
                  <Suspense fallback="">
                    <RouteTransitionWrapper />
                  </Suspense>
                </Router>
              </TooltipProvider>
            </NutritionProvider>
          </ThemeProvider>
        </LanguageProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}


// wrapper component that renders animated routes based on location
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
        <Route path="/meal-plan-id" element={wrap(<MealPlanView />)} />
        <Route path="/dashboard" element={wrap(<DashboardPage />)} />
        <Route path="/progress" element={wrap(<ProgressPage />)} />
        <Route path="/settings" element={wrap(<SettingsPage />)} />
        <Route path="/notifications" element={wrap(<NotificationsPage />)} />
        <Route path="/goals" element={wrap(<GoalWizard />)} />
        <Route path="/favorites" element={wrap(<Favorites />)} />
        <Route path="/games" element={wrap(<NutritionGamificationSystem />)} />
        <Route path="/points" element={wrap(<PointsTransactionPage />)} />
        <Route path="/meal-plan" element={wrap(<MealPlanPage />)} />
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
