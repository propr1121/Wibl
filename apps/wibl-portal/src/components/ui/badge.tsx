import React from 'react';
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'success' | 'warning' | 'error' | 'info' | 'teal' | 'gradient' | 'coral';
    size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
    className,
    variant = 'info',
    size = 'md',
    ...props
}) => {
    const variants = {
        success: "bg-wibl-mint/10 text-teal-800 border-wibl-mint/20",
        warning: "bg-amber-100 text-amber-800 border-amber-200",
        error: "bg-wibl-coral/10 text-wibl-coral-dark border-wibl-coral/20",
        info: "bg-navy-50 text-navy-600 border-navy-100",
        teal: "bg-wibl-teal/10 text-wibl-teal border-wibl-teal/20",
        gradient: "gradient-brand text-white border-transparent shadow-sm",
        coral: "bg-wibl-coral/10 text-wibl-coral border-wibl-coral/20",
    };

    const sizes = {
        sm: "px-2 py-0.5 text-[10px] font-black tracking-wider uppercase",
        md: "px-2.5 py-1 text-xs font-bold",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center justify-center rounded-full border transition-all",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
};
