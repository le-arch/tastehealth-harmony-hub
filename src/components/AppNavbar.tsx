import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Star, Flame, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LogoHealth from '@/components/LogoHealth';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { getLS, LS_KEYS } from '@/utils/localStorage';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useT } from '@/hooks/useTranslate';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface AppNavbarProps {
  onToggleSidebar: () => void;
}

const AppNavbar: React.FC<AppNavbarProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [points, setPoints] = useState(getLS<number>(LS_KEYS.POINTS, 0));
  const [streak, setStreak] = useState(getLS<number>(LS_KEYS.STREAK, 0));
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Translated tooltip strings
  const tPoints = useT("Points earned from quests, challenges & healthy habits");
  const tStreak = useT("Consecutive daily check-in days — keep your streak alive!");
  const tMenu = useT("Open menu");
  const tHome = useT("Go to dashboard");
  const tNotif = useT("Notifications");
  const tProfile = useT("Profile menu");
  const tProfileItem = useT("Profile");
  const tSettings = useT("Settings");
  const tSignOut = useT("Sign Out");

  const currentUser = JSON.parse(localStorage.getItem('th_current_user') || 'null');
  const displayName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'User';

  useEffect(() => {
    const img = localStorage.getItem('th_profile_image');
    if (img) setProfileImage(img);

    const interval = setInterval(() => {
      setPoints(getLS<number>(LS_KEYS.POINTS, 0));
      setStreak(getLS<number>(LS_KEYS.STREAK, 0));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TooltipProvider delayDuration={150}>
      <nav className="fixed top-0 left-0 right-0 z-40 h-14 bg-card border-b border-border flex items-center justify-between px-3 sm:px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="h-9 w-9" aria-label={tMenu}>
                <Menu className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p className="text-xs">{tMenu}</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/dashboard" aria-label={tHome} className="flex items-center gap-1.5">
                <LogoHealth size="sm" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p className="text-xs">{tHome}</p></TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={tPoints}
                className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2.5 py-1 rounded-full text-xs font-semibold cursor-help focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
              >
                <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" aria-hidden="true" />
                {points}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p className="text-xs max-w-[220px]">{tPoints}</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={tStreak}
                className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2.5 py-1 rounded-full text-xs font-semibold cursor-help focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <Flame className="h-3.5 w-3.5 text-orange-500" aria-hidden="true" />
                {streak}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p className="text-xs max-w-[220px]">{tStreak}</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span aria-label={tNotif}><NotificationDropdown /></span>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p className="text-xs">{tNotif}</p></TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full overflow-hidden p-0" aria-label={tProfile}>
                    {profileImage ? (
                      <img src={profileImage} alt={displayName} className="h-full w-full object-cover rounded-full" />
                    ) : (
                      <div className="h-full w-full bg-primary/10 flex items-center justify-center rounded-full">
                        <User className="h-4 w-4 text-green-500" aria-hidden="true" />
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p className="text-xs">{tProfile}</p></TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-green-500">{displayName}</p>
                {currentUser?.email && <p className="text-xs text-muted-foreground">{currentUser.email}</p>}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="h-4 w-4 mr-2 text-green-500" />{tProfileItem}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="h-4 w-4 mr-2 text-slate-600" />{tSettings}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => { localStorage.removeItem('th_current_user'); navigate('/'); }}>
                {tSignOut}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </TooltipProvider>
  );
};

export default AppNavbar;
