import React from 'react';
import { cn } from "@/lib/utils";

export interface LoadingDotsProps {
    color?: 'gradient' | 'teal' | 'white';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
    color = 'gradient',
    className
}) => {
    return (
        <div className={cn("flex items-end gap-1.5 h-6 px-1", className)}>
            {[0, 1, 2, 3].map((i) => (
                <div
                    key={i}
                    className={cn(
                        "w-1 rounded-full animate-wibl-pulse",
                        color === 'gradient' ? "bg-gradient-to-t from-wibl-teal to-wibl-mint" :
                            color === 'teal' ? "bg-wibl-teal" : "bg-white"
                    )}
                    style={{
                        animationDelay: `${i * 150}ms`,
                        height: '40%'
                    }}
                />
            ))}
            <style jsx>{`
                @keyframes wibl-pulse {
                    0%, 100% { height: 40%; opacity: 0.4; }
                    50% { height: 100%; opacity: 1; }
                }
                .animate-wibl-pulse {
                    animation: wibl-pulse 1s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};
