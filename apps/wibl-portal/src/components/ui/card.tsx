import React from 'react';
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'elevated' | 'outlined' | 'gradient' | 'glass' | 'glass-dark' | 'premium';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
    glowing?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'elevated', padding = 'md', hoverable = false, glowing = false, ...props }, ref) => {
        const variants = {
            elevated: "bg-white shadow-wibl border border-navy-50",
            outlined: "bg-transparent border-2 border-navy-100",
            gradient: "gradient-subtle border border-wibl-teal/20",
            glass: "glass-premium shadow-wibl",
            'glass-dark': "glass-dark text-white border-white/5 shadow-2xl",
            premium: "glass-premium border-wibl-teal/30 shadow-wibl",
        };

        const paddings = {
            none: "p-0",
            sm: "p-4",
            md: "p-6 md:p-8",
            lg: "p-8 md:p-12",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-[24px] transition-all duration-500 ease-out",
                    variants[variant],
                    paddings[padding],
                    hoverable && "card-hover-lift cursor-pointer",
                    glowing && "hover:shadow-glow",
                    className
                )}
                {...props}
            />
        );
    }
);

Card.displayName = 'Card';
