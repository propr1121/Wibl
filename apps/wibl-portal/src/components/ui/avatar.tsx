import React from 'react';
import { cn } from "@/lib/utils";

interface AvatarProps {
    src?: string;
    fallback: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    status?: 'online' | 'offline' | 'busy';
    ring?: boolean;
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
    src,
    fallback,
    size = 'md',
    status,
    ring = false,
    className
}) => {
    const sizes = {
        sm: "h-8 w-8 text-xs",
        md: "h-11 w-11 text-sm",
        lg: "h-16 w-16 text-lg",
        xl: "h-24 w-24 text-2xl",
    };

    const statusColors = {
        online: "bg-wibl-mint",
        offline: "bg-navy-300",
        busy: "bg-wibl-coral",
    };

    return (
        <div className={cn("relative inline-block", className)}>
            <div className={cn(
                "rounded-full overflow-hidden flex items-center justify-center font-bold transition-all",
                sizes[size],
                ring && "ring-2 ring-offset-2 ring-wibl-teal",
                !src && "gradient-brand text-white shadow-wibl"
            )}>
                {src ? (
                    <img src={src} alt={fallback} className="h-full w-full object-cover" />
                ) : (
                    <span>{fallback.substring(0, 2).toUpperCase()}</span>
                )}
            </div>

            {status && (
                <span className={cn(
                    "absolute bottom-0 right-0 border-2 border-white rounded-full",
                    size === 'sm' ? "h-2 w-2" : "h-3 w-3",
                    statusColors[status]
                )} />
            )}
        </div>
    );
};
