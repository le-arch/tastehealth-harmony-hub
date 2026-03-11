import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard, Calendar, LineChart, Settings, LogOut, X,
  Heart, Trophy, Sun, Moon, Gamepad, Mountain, Gift, Pencil, Bookmark,
  Video, Stethoscope, BookOpen,
} from "lucide-react";
import Logo from "@/components/Logo";

interface ProfileSidebarProps { activePage?: string; isOpen?: boolean; onClose?: () => void; }

export const ProfileSidebar = ({ activePage, isOpen = false, onClose }: ProfileSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const t = language === 'fr'
    ? { dashboard: "Tableau de Bord", mealPlanning: "Repas", progress: "Progrès",  signOut: "Déconnexion", games: "Jeu", challenges: "Défis", level: "Niveau", journal: "Journal", cookingVideos: "Vidéos", healthTips: "Conseils", howToUse: "Guide" }
    : { dashboard: "Dashboard", mealPlanning: "Meal Planning", progress: "Progress", signOut: "Sign Out", games: "Nutrition Game", challenges: "Challenges", level: "Level", journal: "Daily Journal", cookingVideos: "Cooking Videos", healthTips: "Health Tips", howToUse: "How to Use" };

  const navItems = [
    { path: "/dashboard", icon: <LayoutDashboard className="h-5 w-5 text-cyan-600 fill-cyan-500" />, label: t.dashboard },
    { path: "/progress", icon: <LineChart className="h-5 w-5 text-green-500" />, label: t.progress },
    { path: "/meal-planning", icon: <Calendar className="h-5 w-5 text-blue-500 fill-blue-300" />, label: t.mealPlanning },
    { path: "/journal", icon: <Bookmark className="h-5 w-5 text-red-600 fill-red-300" />, label: t.journal },
    { path: "/games", icon: <Gamepad className="h-5 w-5 text-purple-600 fill-purple-200" />, label: t.games },
    { path: "/challenges", icon: <Mountain className="h-5 w-5 text-stone-600 fill-stone-200" />, label: t.challenges },
    { path: "/benefits", icon: <Gift className="h-5 w-5 text-amber-500 fill-amber-200" />, label: t.level },
    { path: "/cooking-videos", icon: <Video className="h-5 w-5 text-orange-500 fill-orange-200" />, label: t.cookingVideos },
    { path: "/health-tips", icon: <Stethoscope className="h-5 w-5 text-slate-600" />, label: t.healthTips },
    // { path: "/settings", icon: <Settings className="h-5 w-5" />, label: t.settings },
    { path: "/how-to-use", icon: <BookOpen className="h-5 w-5 text-indigo-600 fill-blue-200" />, label: t.howToUse },
  ];

  const handleSignOut = () => {
    localStorage.removeItem('th_current_user');
    navigate('/');
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
      <aside className={`fixed top-14 left-0 z-50 h-[calc(100vh-3.5rem)] w-64 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"} bg-card border-r border-border shadow-xl`}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link to="/dashboard" className="flex items-center" onClick={onClose}>
            <Logo size="md" />
            {/* <span className="ml-2 text-lg font-bold text-primary"></span> */}
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-5 w-5 text-green-500" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3 py-2">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.div key={item.path} whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
              {theme === "dark" ? <Sun className="h-4 w-4 text-yellow-500 fill-yellow-500" /> : <Moon className="h-4 w-4 text-yellow-600 fill-yellow-600" />}
            </Button>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="text-sm bg-transparent border border-border rounded-md px-2 py-1 focus:ring-1 focus:ring-primary">
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleSignOut} size="sm">
            <LogOut className="mr-2 h-4 w-4" />{t.signOut}
          </Button>
        </div>
      </aside>
    </>
  );
};

export default ProfileSidebar;
