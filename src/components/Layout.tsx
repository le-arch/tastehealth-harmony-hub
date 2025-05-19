import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  Home,
  Utensils,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import NotificationButton from "./NotificationButton";
import { useScreenSize } from "@/utils/mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { isMobile, isTablet } = useScreenSize();

  return (
    <div className="min-h-screen flex flex-col bg-softgreen-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center space-x-2">
            <Utensils className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl"></span>
          </Link>

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
{/*             <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              aria-label="Toggle menu"
            >
              {isMobileNavOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button> */}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden ${
            isMobileNavOpen ? "block" : "hidden"
          } border-t`}
        >
          <div className="container py-3 space-y-1">
            {/* Mobile navigation content */}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container py-4 sm:py-6 md:py-8 px-4 sm:px-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
