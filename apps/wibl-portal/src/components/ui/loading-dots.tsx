import React from 'react';
import { cn } from "@/lib/utils";

export interface LoadingDotsProps {
    color?: 'gradient' | 'teal' | 'white' | 'gray';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

/**
 * Refined typing dots animation - clean, minimal, professional
 * Inspired by Claude's elegant design
 */
export const LoadingDots: React.FC<LoadingDotsProps> = ({
    color = 'gray',
    size = 'sm',
    className
}) => {
    // Size mappings for refined dots
    const sizeClasses = {
        sm: 'w-1 h-1',      // 4px - very subtle
        md: 'w-1.5 h-1.5',  // 6px - balanced
        lg: 'w-2 h-2'       // 8px - visible
    };

    // Color mappings
    const colorClasses = {
        gradient: 'bg-gradient-to-r from-wibl-teal to-wibl-mint',
        teal: 'bg-wibl-teal',
        white: 'bg-white',
        gray: 'bg-navy-400'
    };

    return (
        <div className={cn("flex items-center gap-1", className)}>
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className={cn(
                        "rounded-full animate-typing-dot",
                        sizeClasses[size],
                        colorClasses[color]
                    )}
                    style={{
                        animationDelay: `${i * 150}ms`
                    }}
                />
            ))}
            <style jsx>{`
                @keyframes typing-dot {
                    0%, 60%, 100% {
                        opacity: 0.25;
                        transform: translateY(0);
                    }
                    30% {
                        opacity: 1;
                        transform: translateY(-2px);
                    }
                }
                .animate-typing-dot {
                    animation: typing-dot 1.4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};
