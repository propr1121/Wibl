"use client";

import React from 'react';
import { useHeaderConfig } from '@/components/layouts/DashboardContext';
import { ConversationsChart } from '@/components/features/charts/ConversationsChart';
import { UsageChart } from '@/components/features/charts/UsageChart';
import { ResponseTimeChart } from '@/components/features/charts/ResponseTimeChart';
import { PeakHoursHeatmap } from '@/components/features/charts/PeakHoursHeatmap';
import { Card } from '@/components/ui';
import { TrendingUp, Users, Zap, Clock } from 'lucide-react';

export default function AnalyticsPage() {
    useHeaderConfig({
        breadcrumbs: [{ label: 'Overview', href: '/dashboard' }, { label: 'Analytics', href: '/analytics' }],
    });

    return (
        <div className="space-y-12 pb-20 max-w-[1400px] mx-auto relative overflow-hidden animate-reveal">
            {/* Background Orbs for Premium feel */}
            <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-wibl-teal/5 rounded-full blur-[140px] pointer-events-none orb-animated" />
            <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-wibl-mint/5 rounded-full blur-[120px] pointer-events-none orb-animated-slow" />

            {/* Analytics Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-wibl-teal uppercase tracking-[0.3em] mb-1">Performance Insight</p>
                    <h1 className="text-3xl lg:text-4xl font-display font-black text-navy-900 tracking-tighter">
                        Intelligence <span className="text-gradient">Analytics.</span>
                    </h1>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <SummaryCard
                    icon={<Users className="text-wibl-teal" />}
                    label="Avg Conversations"
                    value="1.2k"
                    change="+12%"
                />
                <SummaryCard
                    icon={<TrendingUp className="text-wibl-mint" />}
                    label="Growth Rate"
                    value="24%"
                    change="+5%"
                />
                <SummaryCard
                    icon={<Zap className="text-wibl-sky" />}
                    label="Total Tokens"
                    value="842k"
                    change="+18%"
                />
                <SummaryCard
                    icon={<Clock className="text-coral" />}
                    label="Avg Latency"
                    value="0.9s"
                    change="-0.1s"
                    isInverse
                />
            </div>

            {/* Main Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
                <ConversationsChart />
                <UsageChart />
                <ResponseTimeChart />
                <PeakHoursHeatmap />
            </div>
        </div>
    );
}

function SummaryCard({ icon, label, value, change, isInverse = false }: any) {
    const isPositive = change.includes('+');
    const colorClass = isInverse
        ? (isPositive ? 'text-coral' : 'text-wibl-mint')
        : (isPositive ? 'text-wibl-mint' : 'text-coral');

    return (
        <Card variant="premium" padding="sm" className="bg-white/60 border-navy-50/50 group hover:border-wibl-teal/20 transition-all duration-300">
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-500">
                        <div className="text-navy-400 group-hover:text-wibl-teal transition-colors">{icon}</div>
                    </div>
                    <div className={cn("px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-navy-50/50", colorClass)}>
                        {change}
                    </div>
                </div>
                <div>
                    <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest mb-1">{label}</p>
                    <h4 className="text-3xl font-display font-black text-navy-900 tabular-nums tracking-tighter leading-none">{value}</h4>
                </div>
            </div>
        </Card>
    );
}

// Utility for cn if not already available in the scope (though it's in @/lib/utils)
import { cn } from '@/lib/utils';
