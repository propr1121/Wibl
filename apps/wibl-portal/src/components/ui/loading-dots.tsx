import React from 'react';
import { cn } from "@/lib/utils";

interface LoadingDotsProps {
    color?: 'gradient' | 'teal' | 'white';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
    color = 'gradient',
    size = 'md',
    className
}) => {
    const sizes = {
        sm: "h-1 w-1",
        md: "h-2 w-2",
        lg: "h-3 w-3",
    };

    const colors = {
        gradient: "bg-wibl-teal", // Will use stagger and gradient logic
        teal: "bg-wibl-teal",
        white: "bg-white",
    };

    const dotClass = cn("rounded-full animate-bounce", sizes[size]);

    return (
        <div className={cn("flex items-center gap-1", className)}>
            <div className={cn(dotClass, color === 'gradient' ? "bg-wibl-mint" : colors[color])} style={{ animationDelay: '0ms' }} />
            <div className={cn(dotClass, color === 'gradient' ? "bg-wibl-teal" : colors[color])} style={{ animationDelay: '150ms' }} />
            <div className={cn(dotClass, color === 'gradient' ? "bg-wibl-sky" : colors[color])} style={{ animationDelay: '300ms' }} />
        </div>
    );
};
