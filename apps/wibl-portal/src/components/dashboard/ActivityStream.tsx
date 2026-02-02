"use client";

import React from 'react';
import { Card, Avatar } from '@/components/ui';
import {
    MessageSquare,
    Zap,
    RefreshCcw,
    ShieldCheck,
    AlertCircle,
    ArrowUpRight,
    Search,
    Database
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
    id: string;
    type: 'message' | 'action' | 'system' | 'safety' | 'knowledge';
    title: string;
    description: string;
    timestamp: string;
    agent?: {
        name: string;
        avatar?: string;
    };
    status: 'success' | 'warning' | 'info' | 'critical';
}

const ICON_MAP = {
    message: MessageSquare,
    action: Zap,
    system: RefreshCcw,
    safety: ShieldCheck,
    knowledge: Database
};

const COLOR_MAP = {
    success: 'text-wibl-teal bg-wibl-teal/10',
    warning: 'text-amber-500 bg-amber-500/10',
    info: 'text-navy-400 bg-navy-400/10',
    critical: 'text-red-500 bg-red-500/10'
};

export function ActivityStream({ activities = [] }: { activities?: Activity[] }) {
    return (
        <Card variant="glass" className="p-0 border-navy-50/50 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-navy-50/50 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-navy-900 flex items-center justify-center text-wibl-teal shadow-lg shadow-wibl-teal/10">
                        <Zap size={16} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-navy-900 uppercase tracking-widest">Operational Pulse</h3>
                        <p className="text-[10px] font-bold text-navy-400 uppercase tracking-tighter">Live workforce activity feed</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-wibl-mint animate-pulse" />
                    <span className="text-[9px] font-black text-navy-400 uppercase tracking-widest">Real-time sync</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                <div className="divide-y divide-navy-50/50">
                    {activities.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-center px-8">
                            <div className="w-12 h-12 rounded-full bg-navy-50 flex items-center justify-center text-navy-200 mb-4">
                                <Search size={24} />
                            </div>
                            <p className="text-[11px] font-black text-navy-400 uppercase tracking-widest">Scanning for life signs...</p>
                        </div>
                    ) : (
                        activities.map((activity, idx) => {
                            const Icon = ICON_MAP[activity.type] || MessageSquare;
                            return (
                                <div key={activity.id} className="p-4 hover:bg-navy-50/30 transition-all duration-300 group cursor-default">
                                    <div className="flex gap-4">
                                        <div className="relative shrink-0">
                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm", COLOR_MAP[activity.status])}>
                                                <Icon size={18} />
                                            </div>
                                            {activity.agent && (
                                                <div className="absolute -bottom-1 -right-1 ring-2 ring-white rounded-full">
                                                    <Avatar size="sm" src={activity.agent.avatar} fallback={activity.agent.name[0]} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <p className="text-[11px] font-black text-navy-900 uppercase tracking-tight truncate">
                                                    {activity.title}
                                                </p>
                                                <span className="text-[9px] font-bold text-navy-300 uppercase shrink-0">
                                                    {activity.timestamp}
                                                </span>
                                            </div>
                                            <p className="text-[12px] text-navy-500 font-medium leading-tight line-clamp-2">
                                                {activity.description}
                                            </p>

                                            {idx === 0 && (
                                                <div className="mt-3 flex items-center gap-2">
                                                    <div className="flex -space-x-1">
                                                        {[1, 2, 3].map(i => (
                                                            <div key={i} className="w-4 h-4 rounded-full bg-wibl-teal/20 border border-white" />
                                                        ))}
                                                    </div>
                                                    <span className="text-[9px] font-black text-wibl-teal uppercase tracking-widest">Active Thread</span>
                                                </div>
                                            )}
                                        </div>
                                        <button className="self-start opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white rounded-lg shadow-sm">
                                            <ArrowUpRight size={14} className="text-navy-400" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="p-4 bg-navy-50/20 border-t border-navy-50/50">
                <button className="w-full py-2 bg-white rounded-xl border border-navy-50 text-[10px] font-black text-navy-400 uppercase tracking-widest hover:bg-white/80 hover:text-navy-900 transition-all">
                    View Network Audit
                </button>
            </div>
        </Card>
    );
}
