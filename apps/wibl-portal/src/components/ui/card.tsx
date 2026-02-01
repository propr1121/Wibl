import React from 'react';
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'elevated' | 'outlined' | 'gradient' | 'glass';
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
            glass: "glass shadow-wibl",
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
                    "rounded-wibl transition-all duration-300",
                    variants[variant],
                    paddings[padding],
                    hoverable && "hover:-translate-y-1 hover:shadow-wibl-lg cursor-pointer",
                    glowing && "hover:shadow-glow",
                    className
                )}
                {...props}
            />
        );
    }
);

Card.displayName = 'Card';
