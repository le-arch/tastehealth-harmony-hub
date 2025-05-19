
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { fetchUserProfile, UserProfile } from "../../services/profileService";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  User,
  Calendar,
  LineChart,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Heart,
  Trophy,
  Sun,
  Moon,
  HouseIcon,
  Gamepad,
  Star,
  Mountain,
  Gift,
  Inspect,
  Pencil,
} from "lucide-react";
import Logo from "@/components/Logo";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import NutritionGamificationSystem from "../gamification/NutritionGamificationSystem";
interface ProfileSidebarProps {
  activePage?: string;
}

export const ProfileSidebar = ({ activePage }: ProfileSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const translations = {
    en: {
      dashboard: "Dashboard",
      profile: "Profile",
      mealPlanning: "Meal Planning",
      progress: "Progress",
      settings: "Settings",
      notifications: "Notifications",
      signOut: "Sign Out",
      mealplan: "Create Plans",
      //mealplanid: "View plans",
      //mealBuilder: "Meal Builder",
      favorites: "Favorites",
      goals: "Goal Wizard",
      games: "Nutrition Game",
      challenges: "Challenges",
      points: "Points History",
      level: "Level",
      toggleTheme: "Toggle Theme",
      language: "Language",
    },
    fr: {
      dashboard: "Tableau de Bord",
      profile: "Profil",
      mealPlanning: "Planification de Repas",
      progress: "Progrès",
      settings: "Paramètres",
      notifications: "Notifications",
      signOut: "Déconnexion",
      mealplan: "Creer des Plans",
     // mealplanid: "Voir les plans",
      //mealBuilder: "Créateur de Repas",
      favorites: "Favoris",
      goals: "Assistant de but",
      games: "Jeu de Nutrition",
      challenges: "Defis",
      points: "Points Histoique",
      level: "Niveau",
      toggleTheme: "Changer le Thème",
      language: "Langue",
    },
  };

  const t =
    translations[language as keyof typeof translations] || translations.en;

  const navItems = [
    // { path: '/notifications', icon: <Bell className="h-5 w-5" />, label: t.notifications },
    {
      path: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: t.dashboard,
    },
    { path: "/profile", icon: <User className="h-5 w-5" />, label: t.profile },
    {
      path: "/meal-planning",
      icon: <Calendar className="h-5 w-5" />,
      label: t.mealPlanning,
    },
    {
      path: "/progress",
      icon: <LineChart className="h-5 w-5" />,
      label: t.progress,
    },
    {
      path: "/meal-plan",
      icon: <Pencil className="h-5 w-5" />,
      label: t.mealplan,
    },
    {
      path: "/favorites",
      icon: <Heart className="h-5 w-5" />,
      label: t.favorites,
    },
    { path: "/goals", icon: <Trophy className="h-5 w-5" />, label: t.goals },
    // GoalWizard
    { path: "/games", icon: <Gamepad className="h-5 w-5" />, label: t.games }, // Nutrition Game
    // {
    //   path: "/meal-builder",
    //   icon: <HouseIcon className="h-5 w-5" />,
    //   label: t.mealBuilder,
    //}, // Added Meal Builder
    {
      path: "/points",
      icon: <Star className="h-5 w-5" />,
      label: t.points,
    },
    {
      path: "/challenges",
      icon: <Mountain className="h-5 w-5" />,
      label: t.challenges,
    },
    {
      path: "/benefits",
      icon: <Gift className="h-5 w-5" />,
      label: t.level,
    },
    {
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
      label: t.settings,
    },
  ];

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            setUserName(profile.first_name || profile.username || "User");
            setUserEmail(session.user.email || "");
            // setUserAvatar(profile.avatar_url || '');
          }
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };

    loadUserProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="flex items-center justify-between p-4">
          <Link
            to="/dashboard"
            className="flex items-center"
            onClick={closeSidebar}
          >
            <Logo size="md" />
            <span className="ml-2 text-xl font-bold">TH</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={closeSidebar}
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center space-x-3 mx-4 mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
          <div className="relative">
            {userAvatar ? (
              <img
                src={userAvatar || "/placeholder.svg"}
                alt={userName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
            )}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-700"></span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {userEmail}
            </p>
          </div>
          <NotificationDropdown />
        </div>

        {/* Scrollable nav area */}
        <ScrollArea className="flex-1 px-2">
          <nav className="space-y-1 pb-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  (activePage &&
                    item.label
                      .toLowerCase()
                      .includes(activePage.toLowerCase())) ||
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                aria-label={item.label}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </ScrollArea>

        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={t.toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-sm bg-transparent border-none focus:ring-0"
              aria-label={t.language}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={handleSignOut}
          >
            <LogOut className="mr-3 h-5 w-5" />
            {t.signOut}
          </Button>
        </div>
      </aside>
    </>
  );
};

export default ProfileSidebar;
