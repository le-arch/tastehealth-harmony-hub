
import React from 'react';
import { Leaf } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo = ({ className = '', size = 'md', showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div className={`flex items-center gap-2 font-display font-semibold ${sizeClasses[size]} ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-th-green-600 blur-sm opacity-30 animate-pulse-slow"></div>
        <div className="relative bg-th-green-600 text-white p-1.5 rounded-full">
          <Leaf size={iconSize[size]} className="text-white" />
        </div>
      </div>
      {showText && (
        <div className="flex items-center">
          <span className="text-th-green-600">Taste</span>
          <span className="text-th-green-800">Health</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
