import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Star, Flame, User, Home, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { getLS, LS_KEYS } from '@/utils/localStorage';
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
    <nav className="fixed top-0 left-0 right-0 z-40 h-14 bg-card border-b border-border flex items-center justify-between px-3 sm:px-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="h-9 w-9">
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/dashboard" className="flex items-center gap-1.5">
          <Logo size="sm" />
          {/* <span className="font-bold text-sm hidden sm:inline">Dashboard</span> */}
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {/* Points Badge */}
        <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2.5 py-1 rounded-full text-xs font-semibold">
          <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
          {points}
        </div>
        {/* Streak Badge */}
        <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2.5 py-1 rounded-full text-xs font-semibold">
          <Flame className="h-3.5 w-3.5 text-orange-500" />
          {streak}
        </div>

        <NotificationDropdown />

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full overflow-hidden p-0">
              {profileImage ? (
                <img src={profileImage} alt={displayName} className="h-full w-full object-cover rounded-full" />
              ) : (
                <div className="h-full w-full bg-primary/10 flex items-center justify-center rounded-full">
                  <User className="h-4 w-4 text-green-500" />
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-green-500">{displayName}</p>
              {currentUser?.email && <p className="text-xs text-muted-foreground">{currentUser.email}</p>}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="h-4 w-4 mr-2 text-green-500" />Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="h-4 w-4 mr-2 text-slate-600" />
            Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => { localStorage.removeItem('th_current_user'); navigate('/'); }}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default AppNavbar;
