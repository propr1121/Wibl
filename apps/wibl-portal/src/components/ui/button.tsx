import React from 'react';
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'coral';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    leftIcon,
    rightIcon,
    children,
    disabled,
    type = 'button',
    ...props
  }, ref) => {
    const variants = {
      primary: "gradient-brand text-white shadow-wibl hover:shadow-glow hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-wibl-teal focus-visible:ring-offset-2",
      secondary: "bg-white border-2 border-wibl-teal text-wibl-teal hover:bg-gradient-subtle hover:border-wibl-sky focus-visible:ring-2 focus-visible:ring-wibl-teal focus-visible:ring-offset-2",
      ghost: "bg-transparent text-navy-700 border border-navy-200 hover:bg-navy-800 hover:text-white hover:border-navy-800 focus-visible:ring-2 focus-visible:ring-wibl-teal/50 focus-visible:ring-offset-1",
      coral: "bg-coral text-white shadow-wibl-coral hover:bg-coral-dark hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs rounded-wibl-xs gap-1.5",
      md: "px-6 py-3 text-sm rounded-wibl-sm gap-2",
      lg: "px-10 py-4 text-base rounded-wibl gap-2.5",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-bold transition-all duration-200 ease-out active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none outline-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="opacity-70">{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0" aria-hidden="true">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0" aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
