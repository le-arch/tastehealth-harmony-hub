import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  LayoutDashboard, Calendar, LineChart, LogOut, X,
  Sun, Moon, Gamepad, Mountain, Gift, Bookmark,
  Video, Stethoscope, BookOpen, ChevronRight
} from "lucide-react";
import Logo from "@/components/Logo";

interface ProfileSidebarProps { 
  activePage?: string; 
  isOpen?: boolean; 
  onClose?: () => void; 
}

// Animation variants
const sidebarVariants = {
  open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  closed: { x: "-100%", opacity: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
};

const overlayVariants = {
  open: { opacity: 1, transition: { duration: 0.2 } },
  closed: { opacity: 0, transition: { duration: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, type: "spring", stiffness: 300, damping: 25 }
  })
};

export const ProfileSidebar = ({ activePage, isOpen = false, onClose }: ProfileSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const t = language === 'fr'
    ? { 
        dashboard: "Tableau de Bord", 
        mealPlanning: "Planification", 
        progress: "Progrès",  
        signOut: "Déconnexion", 
        games: "Jeu Nutrition", 
        challenges: "Défis", 
        level: "Niveau", 
        journal: "Journal", 
        cookingVideos: "Vidéos Cuisine", 
        healthTips: "Conseils Santé", 
        howToUse: "Guide d'utilisation",
      }
    : { 
        dashboard: "Dashboard", 
        mealPlanning: "Meal Planning", 
        progress: "Progress", 
        signOut: "Sign Out", 
        games: "Nutrition Game", 
        challenges: "Challenges", 
        level: "Level", 
        journal: "Daily Journal", 
        cookingVideos: "Cooking Videos", 
        healthTips: "Health Tips", 
        howToUse: "How to Use",
      };

  const navItems = [
    { path: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" />, label: t.dashboard, color: "from-cyan-500 to-blue-500", iconBg: "bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-950 dark:to-blue-950" },
    { path: "/progress", icon: <LineChart className="h-5 w-5" />, label: t.progress, color: "from-green-500 to-emerald-500", iconBg: "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950 dark:to-emerald-950" },
    { path: "/meal-planning", icon: <Calendar className="h-5 w-5" />, label: t.mealPlanning, color: "from-blue-500 to-indigo-500", iconBg: "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950" },
    { path: "/journal", icon: <Bookmark className="h-5 w-5" />, label: t.journal, color: "from-red-500 to-pink-500", iconBg: "bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-950 dark:to-pink-950" },
    { path: "/games", icon: <Gamepad className="h-5 w-5" />, label: t.games, color: "from-purple-500 to-violet-500", iconBg: "bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-950 dark:to-violet-950" },
    { path: "/challenges", icon: <Mountain className="h-5 w-5" />, label: t.challenges, color: "from-amber-500 to-orange-500", iconBg: "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950 dark:to-orange-950" },
    { path: "/benefits", icon: <Gift className="h-5 w-5" />, label: t.level, color: "from-yellow-500 to-amber-500", iconBg: "bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-950 dark:to-amber-950" },
    { path: "/cooking-videos", icon: <Video className="h-5 w-5" />, label: t.cookingVideos, color: "from-orange-500 to-red-500", iconBg: "bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-950 dark:to-red-950" },
    { path: "/health-tips", icon: <Stethoscope className="h-5 w-5" />, label: t.healthTips, color: "from-teal-500 to-cyan-500", iconBg: "bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-950 dark:to-cyan-950" },
    { path: "/how-to-use", icon: <BookOpen className="h-5 w-5" />, label: t.howToUse, color: "from-indigo-500 to-purple-500", iconBg: "bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950" },
  ];

  const handleSignOut = () => {
    localStorage.removeItem('th_current_user');
    navigate('/');
  };

  return (
    <TooltipProvider>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="fixed top-0 left-0 z-50 h-full w-72 transform flex flex-col bg-gradient-to-b from-card to-card/95 backdrop-blur-sm border-r border-border shadow-2xl"
      >
        {/* Header with Logo and Close */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="flex items-center"
          >
            <Link to="/dashboard" onClick={onClose}>
              <Logo size="lg" />
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive">
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* Navigation Items - Full height with padding */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.div
                  key={item.path}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ x: 8, transition: { type: "spring", stiffness: 400 } }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-${item.color.split('-')[1]}-500/20`
                        : "text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} opacity-20`}
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    <span className={`mr-3 relative z-10 p-1.5 rounded-lg ${
                      isActive 
                        ? "bg-white/20 text-white" 
                        : `${item.iconBg} group-hover:scale-110 transition-transform`
                    }`}>
                      {React.cloneElement(item.icon, { 
                        className: `h-4 w-4 ${isActive ? 'text-white' : ''}` 
                      })}
                    </span>
                    
                    <span className="relative z-10 flex-1">{item.label}</span>
                    
                    {isActive && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="relative z-10"
                      >
                        <ChevronRight className="h-4 w-4 text-white" />
                      </motion.span>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer with Theme Toggle, Language Selector, and Sign Out */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 border-t border-border space-y-3 bg-gradient-to-t from-muted/50 to-transparent"
        >
          {/* Theme Toggle and Language Selector */}
          <div className="flex items-center justify-between gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={toggleTheme}
                    className="h-9 w-9 rounded-full border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                  >
                    {theme === "dark" ? 
                      <Sun className="h-4 w-4 text-yellow-500" /> : 
                      <Moon className="h-4 w-4 text-indigo-500" />
                    }
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Toggle theme</p>
              </TooltipContent>
            </Tooltip>

            {/* Language Selector - Takes remaining space */}
            <div className="relative flex-1">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)} 
                className="w-full text-sm bg-muted/50 border border-border rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-primary appearance-none cursor-pointer hover:bg-muted/70 transition-colors"
              >
                <option value="en">🇬🇧 English</option>
                <option value="fr">🇫🇷 Français</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronRight className="h-4 w-4 text-muted-foreground rotate-90" />
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="ghost" 
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 border border-destructive/20 hover:border-destructive/40 transition-all group"
              onClick={handleSignOut}
              size="default"
            >
              <LogOut className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
              {t.signOut}
            </Button>
          </motion.div>
        </motion.div>
      </motion.aside>
    </TooltipProvider>
  );
};

export default ProfileSidebar;