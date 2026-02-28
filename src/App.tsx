import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NutritionProvider } from "../src/contexts/NutritionContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Layout from "./components/Layout";
//import TasteHealthLoader from "../src/components/TastehealthLoader"
// Import viewport height utility
import { useResponsive } from "../src/hooks/use-responsive";

// Create a client
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
                <Layout>
                  <Suspense fallback={""}>
                    <Routes>
                      {/* Redirect root path to WelcomePage */}
                      <Route path="/" element={<WelcomePage />} />
                      <Route path="/welcome" element={<WelcomePage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route
                        path="/meal-planning"
                        element={<MealPlanningPage />}
                      />
                      <Route
                        path="/meal-plan-id"
                        element={<MealPlanView />}
                      />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/progress" element={<ProgressPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route
                        path="/notifications"
                        element={<NotificationsPage />}
                      />
                      <Route path="/goals" element={<GoalWizard />} />
                      {/* <Route path="/meal-builder" element={<MealBuilder />} /> */}
                      <Route path="/favorites" element={<Favorites />} />
                      <Route
                        path="/games"
                        element={<NutritionGamificationSystem />}
                      />
                      <Route
                        path="/points"
                        element={<PointsTransactionPage />}
                      />
                      <Route path="/meal-plan" element={<MealPlanPage/>} />
                      <Route path="/challenges" element={<ChallengesPage />} />
                      <Route path="/benefits" element={<LevelBenefitsPage />} />
                      <Route path="/journal" element={<DailyJournalPage />} />
                      {/* Catch-all route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </Layout>
              </Router>
            </TooltipProvider>
            </NutritionProvider>
          </ThemeProvider>
        </LanguageProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;
