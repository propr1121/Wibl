"use client";

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { chartColors } from '@/lib/chart-config';
import { ChartWrapper } from './ChartWrapper';
import { cn } from '@/lib/utils';

// Mock data - replace with real API data
const generateMockData = (days: number) => {
    const data = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            conversations: Math.floor(Math.random() * 100) + 50,
        });
    }
    return data;
};

type Period = '7d' | '30d' | '90d';

const PERIOD_LABELS: Record<Period, { label: string; days: number }> = {
    '7d': { label: '7 Days', days: 7 },
    '30d': { label: '30 Days', days: 30 },
    '90d': { label: '90 Days', days: 90 },
};

export function ConversationsChart() {
    const [period, setPeriod] = useState<Period>('7d');
    const [isLoading, setIsLoading] = useState(false);

    const data = generateMockData(PERIOD_LABELS[period].days);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white rounded-wibl-sm shadow-wibl border border-navy-100 px-4 py-3">
                    <p className="text-xs font-black text-navy-500 uppercase tracking-wider mb-1">
                        {payload[0].payload.date}
                    </p>
                    <p className="text-lg font-display font-black text-wibl-teal">
                        {payload[0].value.toLocaleString()}
                        <span className="text-xs text-navy-400 font-medium ml-1">
                            conversations
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    const PeriodSelector = () => (
        <div className="inline-flex bg-canvas-muted rounded-wibl-sm p-1">
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
                <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={cn(
                        'px-4 py-1.5 rounded-wibl-xs text-xs font-black transition-all duration-200',
                        period === p
                            ? 'gradient-brand text-white shadow-sm'
                            : 'text-navy-600 hover:text-navy-700'
                    )}
                >
                    {PERIOD_LABELS[p].label}
                </button>
            ))}
        </div>
    );

    return (
        <ChartWrapper
            title="Conversations Over Time"
            subtitle="Total conversations across all agents"
            isLoading={isLoading}
            actions={<PeriodSelector />}
        >
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="conversationsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={chartColors.accent} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke={chartColors.textLight}
                        style={{ fontSize: '12px', fontWeight: '600' }}
                        tickLine={false}
                    />
                    <YAxis
                        stroke={chartColors.textLight}
                        style={{ fontSize: '12px', fontWeight: '600' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: chartColors.primary, strokeWidth: 1 }} />
                    <Area
                        type="monotone"
                        dataKey="conversations"
                        stroke={chartColors.primary}
                        strokeWidth={3}
                        fill="url(#conversationsGradient)"
                        animationDuration={1000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
}
