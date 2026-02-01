import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
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
    sm: { container: "h-8", icon: "h-8 w-8", text: "text-lg" },
    md: { container: "h-10", icon: "h-10 w-10", text: "text-2xl" },
    lg: { container: "h-14", icon: "h-14 w-14", text: "text-3xl" },
    xl: { container: "h-20", icon: "h-20 w-20", text: "text-5xl" },
  };

  return (
    <div className={cn(
      "flex items-center gap-2.5",
      sizes[size].container,
      className
    )}>
      {/* Fluid Wave/W Mark - matches brand identity */}
      <div className={cn(
        "relative flex items-center justify-center",
        sizes[size].icon,
        animated && "hover:scale-105 transition-transform duration-300"
      )}>
        {animated && (
          <div className="absolute inset-0 gradient-brand rounded-wibl opacity-20 blur-lg animate-pulse-soft" />
        )}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-label="Wibl Logo"
        >
          {/* Gradient definitions matching brand colors */}
          <defs>
            <linearGradient id="wibl-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5EEBBE" />
              <stop offset="50%" stopColor="#4ECDC4" />
              <stop offset="100%" stopColor="#45B7D1" />
            </linearGradient>
          </defs>

          {/* Fluid wave W shape */}
          <path
            d="M15,35 Q20,50 25,65 T35,80 Q40,70 45,60 T55,50 Q60,60 65,70 T75,80 Q80,65 85,50 T95,35"
            stroke="url(#wibl-gradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className={animated ? "animate-float" : ""}
          />
        </svg>
      </div>

      {/* Wordmark */}
      {variant === 'full' && (
        <span className={cn(
          "font-display font-bold tracking-tight text-navy-800 dark:text-white",
          sizes[size].text
        )}>
          wibl<span className="text-wibl-teal">.</span>
        </span>
      )}
    </div>
  );
};
