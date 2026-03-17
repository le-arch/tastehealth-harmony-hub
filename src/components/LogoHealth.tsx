
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const LogoHealth = ({ className = '', size = 'md', showText = true }: LogoProps) => {
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

      </div>
        <div className="flex items-center">
          <span> <img src="/favicon-32x32.png" alt="Logo" /> </span>
        </div>
    </div>
  );
};

export default LogoHealth;
