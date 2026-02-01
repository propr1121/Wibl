import React from 'react';
import { cn } from "@/lib/utils";

interface GradientBorderProps {
    children: React.ReactNode;
    animated?: boolean;
    width?: number;
    className?: string;
    containerClassName?: string;
}

export const GradientBorder: React.FC<GradientBorderProps> = ({
    children,
    animated = false,
    width = 2,
    className,
    containerClassName
}) => {
    return (
        <div className={cn(
            "relative p-[var(--border-width)] overflow-hidden rounded-[calc(var(--radius-wibl)+2px)]",
            animated && "animate-gradient-shift bg-[length:200%_200%]",
            className
        )}
            style={{
                '--border-width': `${width}px`,
                backgroundImage: 'linear-gradient(135deg, var(--wibl-mint) 0%, var(--wibl-teal) 50%, var(--wibl-sky) 100%)'
            } as React.CSSProperties}>
            <div className={cn(
                "relative bg-white rounded-wibl w-full h-full",
                containerClassName
            )}>
                {children}
            </div>
        </div>
    );
};
