import React from 'react';
import { cn } from "@/lib/utils";

export interface LogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  animated = false,
  className
}) => {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-6xl",
  };

  return (
    <div className={cn(
      "flex items-center",
      animated && "hover:scale-105 transition-transform duration-300",
      className
    )}>
      <span className={cn(
        "font-display font-black tracking-tight",
        sizes[size]
      )}>
        <span className="text-wibl-teal uppercase">W</span>
        <span className="text-navy-800">{variant === 'full' ? 'ibl' : ''}</span>
        <span className="text-navy-900">.</span>
      </span>
    </div>
  );
};
