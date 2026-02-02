"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Activity, Zap, AlertTriangle } from 'lucide-react';

interface BrainPulseProps {
    status: 'online' | 'busy' | 'offline' | 'error';
    latency?: number;
}

export function BrainPulse({ status, latency }: BrainPulseProps) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (status === 'offline' || status === 'error') return;

        const interval = setInterval(() => {
            setScale(s => s === 1 ? 1.05 : 1);
        }, status === 'busy' ? 400 : 1200); // Faster pulse when busy

        return () => clearInterval(interval);
    }, [status]);

    const statusColors = {
        online: "bg-green-500 text-green-400 border-green-500/30",
        busy: "bg-wibl-teal text-wibl-teal border-wibl-teal/30",
        error: "bg-coral text-coral border-coral/30",
        offline: "bg-navy-200 text-navy-400 border-navy-300/30"
    };

    return (
        <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
                {/* Outer Glow Ring */}
                <div
                    className={cn(
                        "absolute w-8 h-8 rounded-full blur-[8px] transition-all duration-700",
                        status === 'online' ? "bg-green-500/20" :
                            status === 'busy' ? "bg-wibl-teal/20" :
                                status === 'error' ? "bg-coral/20" : "bg-transparent"
                    )}
                    style={{ transform: `scale(${scale * 1.5})` }}
                />

                {/* Middle Pulse Ring */}
                <div
                    className={cn(
                        "absolute w-6 h-6 rounded-full border-2 transition-all duration-500",
                        status === 'online' ? "border-green-500/40" :
                            status === 'busy' ? "border-wibl-teal/40" :
                                status === 'error' ? "border-coral/40" : "border-navy-100"
                    )}
                    style={{ transform: `scale(${scale * 1.2})` }}
                />

                {/* Core Indicator */}
                <div className={cn(
                    "relative w-4 h-4 rounded-full flex items-center justify-center shadow-sm z-10",
                    status === 'online' ? "bg-green-500" :
                        status === 'busy' ? "bg-wibl-teal" :
                            status === 'error' ? "bg-coral" : "bg-navy-300"
                )}>
                    {status === 'busy' && <Zap size={8} className="text-white animate-pulse" />}
                    {status === 'error' && <AlertTriangle size={8} className="text-white" />}
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest",
                        status === 'online' || status === 'busy' ? "text-white" : "text-white/40"
                    )}>
                        {status === 'busy' ? 'Syncing...' : status.toUpperCase()}
                    </span>
                    {latency && (
                        <span className="text-[8px] font-bold text-white/30 tracking-tight">
                            {latency}ms
                        </span>
                    )}
                </div>
                {status === 'online' && (
                    <div className="flex gap-0.5 mt-0.5">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div
                                key={i}
                                className={cn(
                                    "w-1 h-2 rounded-full",
                                    i <= 3 ? "bg-green-500/40" : "bg-white/5"
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
