
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { fetchUserProfile } from "../../services/profileService";
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
  Pencil,
} from "lucide-react";
import Logo from "@/components/Logo";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import { useScreenSize } from "@/utils/mobile";

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
  const { isMobile, isTablet } = useScreenSize();

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
    { path: "/games", icon: <Gamepad className="h-5 w-5" />, label: t.games },
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
          }
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };

    loadUserProfile();
  }, []);

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile, isOpen]);

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

  const sidebarWidth = isTablet && !isOpen ? "w-16" : "w-64";
  const sidebarClass = `fixed top-0 left-0 z-50 h-full ${sidebarWidth} transform transition-transform duration-300 ease-in-out ${
    isOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
  } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col`;

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
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside className={sidebarClass}>
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <Link
            to="/dashboard"
            className="flex items-center"
            onClick={closeSidebar}
          >
            <Logo size={isTablet && !isOpen ? "sm" : "md"} />
            {(!isTablet || isOpen) && (
              <span className="ml-2 text-xl font-bold">TH</span>
            )}
          </Link>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={closeSidebar}
              aria-label="Close Sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Profile section - hide text in tablet mini sidebar mode */}
        {(!isTablet || isOpen) && (
          <div className="flex items-center space-x-3 mb-6 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
            <div className="relative">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              )}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-700"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {userEmail}
              </p>
            </div>
            <NotificationDropdown />
          </div>
        )}

        {/* Icons-only view for tablet without text */}
        {isTablet && !isOpen && (
          <div className="flex flex-col items-center py-3 mb-4">
            <div className="relative mb-4">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              )}
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border-2 border-white dark:border-gray-700"></span>
            </div>
            <NotificationDropdown />
          </div>
        )}

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isMobile && closeSidebar()}
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
              {(!isTablet || isOpen) && item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
            {(!isTablet || isOpen) && (
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm bg-transparent border-none focus:ring-0"
                aria-label={t.language}
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            )}
          </div>
          <Button
            variant="ghost"
            className={`${
              isTablet && !isOpen ? "" : "w-full justify-start"
            } text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20`}
            onClick={handleSignOut}
          >
            <LogOut className={`${isTablet && !isOpen ? "" : "mr-3"} h-5 w-5`} />
            {(!isTablet || isOpen) && t.signOut}
          </Button>
        </div>
      </aside>
    </>
  );
};

export default ProfileSidebar;
