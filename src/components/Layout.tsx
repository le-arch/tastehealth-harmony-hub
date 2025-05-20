import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  Home,
  Target,
  Utensils,
  BookmarkCheck,
  Sun,
  Moon,
  Settings,
} from "lucide-react";
import NotificationButton from "./NotificationButton";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-softgreen-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Utensils className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl"></span>
          </Link>

          {/* Desktop Navigation */}
          {/* <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-foreground/80 hover:text-primary transition-colors px-3 py-2 rounded-md">
              Home
            </Link>
            <Link to="/goals" className="text-foreground/80 hover:text-primary transition-colors px-3 py-2 rounded-md">
              Goals
            </Link>
            <Link to="/meal-builder" className="text-foreground/80 hover:text-primary transition-colors px-3 py-2 rounded-md">
              Meal Builder
            </Link>
            <Link to="/favorites" className="text-foreground/80 hover:text-primary transition-colors px-3 py-2 rounded-md">
              Favorites
            </Link>
            <Link to="/settings" className="text-foreground/80 hover:text-primary transition-colors px-3 py-2 rounded-md">
              Settings
            </Link>
          </nav> */}

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile menu button */}
  {<Button
      variant="ghost"
      size="icon"
      className="md:hidden"
      onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
      aria-label="Toggle menu"
    >
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isMobileNavOpen ? "hidden" : "block"}
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isMobileNavOpen ? "block" : "hidden"}
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg> */}
      </Button>}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden ${
            isMobileNavOpen ? "block" : "hidden"
          } border-t`}
        >
          <div className="container py-3 space-y-1">
            {/* <Link
              to="/"
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent"
              onClick={() => setIsMobileNavOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/goals"
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent"
              onClick={() => setIsMobileNavOpen(false)}
            >
              <Target className="h-5 w-5" />
              <span>Goals</span>
            </Link>
            <Link
              to="/meal-builder"
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent"
              onClick={() => setIsMobileNavOpen(false)}
            >
              <Utensils className="h-5 w-5" />
              <span>Meal Builder</span>
            </Link>
            <Link
              to="/favorites"
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent"
              onClick={() => setIsMobileNavOpen(false)}
            >
              <BookmarkCheck className="h-5 w-5" />
              <span>Favorites</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent"
              onClick={() => setIsMobileNavOpen(false)}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link> */}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container py-8">{children}</main>

      {/* Notification Button (corner fixed) */}
      {/* <NotificationButton /> */}

      {/* Footer */}
    </div>
  );
};

export default Layout;
