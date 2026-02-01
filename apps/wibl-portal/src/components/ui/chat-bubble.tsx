import React from 'react';
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
    variant?: 'user' | 'assistant' | 'system';
    children: React.ReactNode;
    timestamp?: string;
    animated?: boolean;
    className?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
    variant = 'assistant',
    children,
    timestamp,
    animated = false,
    className
}) => {
    const variants = {
        user: "bg-wibl-gradient text-white ml-auto rounded-tr-none shadow-wibl",
        assistant: "bg-canvas-subtle text-navy-700 border border-navy-50 mr-auto rounded-tl-none",
        system: "bg-navy-50/50 text-navy-400 mx-auto rounded-full text-center px-4 py-1 border border-navy-100/50",
    };

    return (
        <div className={cn(
            "max-w-[85%] group flex flex-col gap-1",
            variant === 'user' ? "items-end" : variant === 'system' ? "items-center w-full" : "items-start",
            className
        )}>
            <div className={cn(
                "px-5 py-3.5 rounded-2xl font-medium leading-relaxed transition-all",
                variants[variant],
                animated && "animate-slide-up"
            )}>
                {children}
            </div>

            {timestamp && (
                <span className="text-[10px] font-black text-navy-300 uppercase tracking-widest px-1">
                    {timestamp}
                </span>
            )}
        </div>
    );
};
