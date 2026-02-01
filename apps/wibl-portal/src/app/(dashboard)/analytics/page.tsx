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
        title: 'Analytics',
        breadcrumbs: [{ label: 'Dashboard', href: '/dashboard' }],
    });

    return (
        <div className="space-y-8 pb-12">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        ? (isPositive ? 'text-coral' : 'text-wibl-teal')
        : (isPositive ? 'text-wibl-teal' : 'text-coral');

    return (
        <Card variant="elevated" padding="md" hoverable>
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-wibl-sm bg-gradient-subtle flex items-center justify-center shrink-0">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-black text-navy-400 uppercase tracking-wider">{label}</p>
                    <div className="flex items-baseline gap-2">
                        <h4 className="text-2xl font-display font-black text-navy-700">{value}</h4>
                        <span className={cn("text-xs font-black", colorClass)}>
                            {change}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}

// Utility for cn if not already available in the scope (though it's in @/lib/utils)
import { cn } from '@/lib/utils';
