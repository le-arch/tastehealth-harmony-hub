
import React from 'react';

interface AnimatedIconProps {
  type: 'trophy' | 'flame' | 'droplet' | 'moon' | 'dumbbell' | 'apple' | 'calendar' | 'book' | 'chef' | 'heart' | 'star' | 'target' | 'award' | 'video' | 'chart';
  size?: number;
  className?: string;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({ type, size = 24, className = '' }) => {
  const iconStyles = {
    trophy: { gradient: 'from-yellow-400 via-amber-500 to-orange-500', shadow: 'shadow-yellow-400/50' },
    flame: { gradient: 'from-red-400 via-orange-500 to-yellow-500', shadow: 'shadow-orange-500/50' },
    droplet: { gradient: 'from-cyan-400 via-blue-500 to-indigo-500', shadow: 'shadow-blue-500/50' },
    moon: { gradient: 'from-indigo-400 via-purple-500 to-pink-500', shadow: 'shadow-purple-500/50' },
    dumbbell: { gradient: 'from-green-400 via-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/50' },
    apple: { gradient: 'from-red-400 via-rose-500 to-pink-500', shadow: 'shadow-rose-500/50' },
    calendar: { gradient: 'from-blue-400 via-indigo-500 to-violet-500', shadow: 'shadow-indigo-500/50' },
    book: { gradient: 'from-amber-400 via-orange-500 to-red-500', shadow: 'shadow-orange-500/50' },
    chef: { gradient: 'from-orange-400 via-red-500 to-rose-500', shadow: 'shadow-red-500/50' },
    heart: { gradient: 'from-pink-400 via-red-500 to-rose-500', shadow: 'shadow-red-500/50' },
    star: { gradient: 'from-yellow-400 via-amber-500 to-orange-500', shadow: 'shadow-amber-500/50' },
    target: { gradient: 'from-green-400 via-emerald-500 to-cyan-500', shadow: 'shadow-emerald-500/50' },
    award: { gradient: 'from-violet-400 via-purple-500 to-fuchsia-500', shadow: 'shadow-purple-500/50' },
    video: { gradient: 'from-blue-400 via-indigo-500 to-purple-500', shadow: 'shadow-indigo-500/50' },
    chart: { gradient: 'from-emerald-400 via-teal-500 to-cyan-500', shadow: 'shadow-teal-500/50' },
  };

  const style = iconStyles[type] || iconStyles.chart;

  const getIcon = () => {
    switch (type) {
      case 'trophy':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-bounce-slow ${className}`}>
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
        );
      case 'flame':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-pulse-slow ${className}`}>
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
        );
      case 'droplet':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-drop ${className}`}>
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
        );
      case 'moon':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-glow ${className}`}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        );
      case 'dumbbell':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-shake ${className}`}>
            <path d="M6.5 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
            <path d="M17.5 21.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
            <path d="M4 17h4v4H4z" />
            <path d="M16 3h4v4h-4z" />
            <path d="M3 17V9h10" />
            <path d="M21 17V9h-6" />
          </svg>
        );
      case 'apple':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-bounce-subtle ${className}`}>
            <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
            <path d="M10 2c1 .5 2 2 2 5" />
          </svg>
        );
      case 'calendar':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin-slow ${className}`}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        );
      case 'book':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-flip ${className}`}>
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
        );
      case 'chef':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-cook ${className}`}>
            <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
            <line x1="6" y1="17" x2="18" y2="17" />
          </svg>
        );
      case 'heart':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-beat ${className}`}>
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        );
      case 'star':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-sparkle ${className}`}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      case 'target':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-pulse ${className}`}>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        );
      case 'award':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-bounce-slow ${className}`}>
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
          </svg>
        );
      case 'video':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-vibrate ${className}`}>
            <path d="m22 8-6 4 6 4V8Z" />
            <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
          </svg>
        );
      case 'chart':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-grow ${className}`}>
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`inline-flex items-center justify-center ${style.shadow}`}>
      <div className={`bg-gradient-to-br ${style.gradient} rounded-lg p-1`}>
        <div className="text-white">
          {getIcon()}
        </div>
      </div>
    </div>
  );
};

export const PageAnimatedIcon: React.FC<{ page: string; className?: string }> = ({ page, className }) => {
  const iconMap: Record<string, AnimatedIconProps['type']> = {
    dashboard: 'chart',
    progress: 'target',
    'meal planning': 'calendar',
    journal: 'book',
    favorites: 'heart',
    challenges: 'trophy',
    settings: 'flame',
    notifications: 'droplet',
    goals: 'star',
    games: 'award',
    'cooking': 'chef',
    profile: 'apple',
  };
  
  return <AnimatedIcon type={iconMap[page.toLowerCase()] || 'star'} size={28} className={className} />;
};
