"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { chartColors } from '@/lib/chart-config';
import { ChartWrapper } from './ChartWrapper';

// Mock data - replace with real API data
const mockData = [
    { date: 'Jan 20', tokens: 2500, cost: 0.25 },
    { date: 'Jan 21', tokens: 3200, cost: 0.32 },
    { date: 'Jan 22', tokens: 2800, cost: 0.28 },
    { date: 'Jan 23', tokens: 4100, cost: 0.41 },
    { date: 'Jan 24', tokens: 3700, cost: 0.37 },
    { date: 'Jan 25', tokens: 5200, cost: 0.52 },
    { date: 'Jan 26', tokens: 6800, cost: 0.68 },
];

const TOKEN_LIMIT = 10000;

export function UsageChart() {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white rounded-wibl-sm shadow-wibl border border-navy-100 px-4 py-3">
                    <p className="text-xs font-black text-navy-500 uppercase tracking-wider mb-2">
                        {payload[0].payload.date}
                    </p>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-navy-700">
                            <span className="text-wibl-teal font-black">
                                {payload[0].value.toLocaleString()}
                            </span>{' '}
                            tokens
                        </p>
                        <p className="text-xs text-navy-400 font-medium">
                            Est. cost:{' '}
                            <span className="font-black text-navy-600">
                                €{payload[0].payload.cost.toFixed(2)}
                            </span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <ChartWrapper
            title="Token Usage"
            subtitle={`Daily token consumption (Limit: ${TOKEN_LIMIT.toLocaleString()} tokens/day)`}
        >
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={chartColors.accent} stopOpacity={0.4} />
                            <stop offset="100%" stopColor={chartColors.secondary} stopOpacity={0.1} />
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

                    {/* Threshold line */}
                    <ReferenceLine
                        y={TOKEN_LIMIT}
                        stroke={chartColors.warning}
                        strokeDasharray="6 4"
                        strokeWidth={2}
                        label={{
                            value: 'Daily Limit',
                            position: 'insideTopRight',
                            style: {
                                fontSize: '11px',
                                fontWeight: '700',
                                fill: chartColors.warning,
                            },
                        }}
                    />

                    <Area
                        type="monotone"
                        dataKey="tokens"
                        stroke={chartColors.primary}
                        strokeWidth={3}
                        fill="url(#usageGradient)"
                        animationDuration={1000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
}
