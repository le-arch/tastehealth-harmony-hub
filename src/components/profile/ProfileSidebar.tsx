
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard, User, Calendar, LineChart, Settings, LogOut, Menu, X,
  Heart, Trophy, Sun, Moon, Gamepad, Star, Mountain, Gift, Pencil,
} from "lucide-react";
import Logo from "@/components/Logo";

interface ProfileSidebarProps { activePage?: string; }

export const ProfileSidebar = ({ activePage }: ProfileSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const t = language === 'fr'
    ? { dashboard: "Tableau de Bord", profile: "Profil", mealPlanning: "Planification de Repas", progress: "Progrès", settings: "Paramètres", notifications: "Notifications", signOut: "Déconnexion", mealplan: "Creer des Plans", favorites: "Favoris", goals: "Assistant de but", games: "Jeu de Nutrition", challenges: "Defis", points: "Points Historique", level: "Niveau", toggleTheme: "Changer le Thème", language: "Langue" }
    : { dashboard: "Dashboard", profile: "Profile", mealPlanning: "Meal Planning", progress: "Progress", settings: "Settings", notifications: "Notifications", signOut: "Sign Out", mealplan: "Create Plans", favorites: "Favorites", goals: "Goal Wizard", games: "Nutrition Game", challenges: "Challenges", points: "Points History", level: "Level", toggleTheme: "Toggle Theme", language: "Language" };

  const navItems = [
    { path: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" />, label: t.dashboard },
    { path: "/profile", icon: <User className="h-5 w-5" />, label: t.profile },
    { path: "/meal-planning", icon: <Calendar className="h-5 w-5" />, label: t.mealPlanning },
    { path: "/progress", icon: <LineChart className="h-5 w-5" />, label: t.progress },
    { path: "/meal-plan", icon: <Pencil className="h-5 w-5" />, label: t.mealplan },
    { path: "/favorites", icon: <Heart className="h-5 w-5" />, label: t.favorites },
    { path: "/goals", icon: <Trophy className="h-5 w-5" />, label: t.goals },
    { path: "/games", icon: <Gamepad className="h-5 w-5" />, label: t.games },
    { path: "/points", icon: <Star className="h-5 w-5" />, label: t.points },
    { path: "/challenges", icon: <Mountain className="h-5 w-5" />, label: t.challenges },
    { path: "/benefits", icon: <Gift className="h-5 w-5" />, label: t.level },
    { path: "/settings", icon: <Settings className="h-5 w-5" />, label: t.settings },
  ];

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Sidebar"><Menu className="h-6 w-6" /></Button>
      </div>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={closeSidebar} />}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"} bg-background border-r border-border`}>
        <div className="flex items-center justify-between p-4">
          <Link to="/dashboard" className="flex items-center" onClick={closeSidebar}><Logo size="md" /><span className="ml-2 text-xl font-bold">TH</span></Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={closeSidebar}><X className="h-5 w-5" /></Button>
        </div>
        <div className="flex items-center space-x-3 mx-4 mb-4 p-3 rounded-lg bg-muted">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><User className="h-5 w-5 text-primary" /></div>
          <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">User</p></div>
        </div>
        <ScrollArea className="flex-1 px-2">
          <nav className="space-y-1 pb-6">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={closeSidebar}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  (activePage && item.label.toLowerCase().includes(activePage.toLowerCase())) || location.pathname === item.path
                    ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}>
                <span className="mr-3">{item.icon}</span>{item.label}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="mt-auto p-4 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>{theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</Button>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="text-sm bg-transparent border-none focus:ring-0"><option value="en">English</option><option value="fr">Français</option></select>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => window.location.href = "/"}>
            <LogOut className="mr-3 h-5 w-5" />{t.signOut}
          </Button>
        </div>
      </aside>
    </>
  );
};

export default ProfileSidebar;
