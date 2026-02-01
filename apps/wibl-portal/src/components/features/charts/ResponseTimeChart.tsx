"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { chartColors } from '@/lib/chart-config';
import { ChartWrapper } from './ChartWrapper';

const mockData = [
    { time: '10:00', latency: 0.8 },
    { time: '11:00', latency: 1.2 },
    { time: '12:00', latency: 0.9 },
    { time: '13:00', latency: 2.1 },
    { time: '14:00', latency: 1.5 },
    { time: '15:00', latency: 0.7 },
    { time: '16:00', latency: 0.95 },
];

export function ResponseTimeChart() {
    const getStatusColor = (value: number) => {
        if (value < 1) return chartColors.primary; // wibl-teal
        if (value < 2) return '#F59E0B'; // amber-500
        return chartColors.warning; // coral
    };

    const CustomDot = (props: any) => {
        const { cx, cy, value, index, data } = props;
        const isLast = index === data.length - 1;

        return (
            <g>
                <circle
                    cx={cx}
                    cy={cy}
                    r={isLast ? 6 : 4}
                    fill={getStatusColor(value)}
                    stroke="#fff"
                    strokeWidth={2}
                    className={isLast ? "animate-pulse" : ""}
                />
                {isLast && (
                    <circle
                        cx={cx}
                        cy={cy}
                        r={10}
                        fill={getStatusColor(value)}
                        opacity={0.3}
                        className="animate-ping"
                    />
                )}
            </g>
        );
    };

    return (
        <ChartWrapper
            title="Response Time"
            subtitle="Average agent latency in seconds"
        >
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                    <XAxis
                        dataKey="time"
                        stroke={chartColors.textLight}
                        style={{ fontSize: '12px', fontWeight: '600' }}
                        tickLine={false}
                    />
                    <YAxis
                        stroke={chartColors.textLight}
                        style={{ fontSize: '12px', fontWeight: '600' }}
                        tickLine={false}
                        axisLine={false}
                        unit="s"
                    />
                    <Tooltip
                        content={({ active, payload }: any) => {
                            if (active && payload && payload.length) {
                                const val = payload[0].value;
                                return (
                                    <div className="bg-white rounded-wibl-sm shadow-wibl border border-navy-100 px-4 py-3">
                                        <p className="text-xs font-black text-navy-500 uppercase tracking-wider mb-1">
                                            {payload[0].payload.time}
                                        </p>
                                        <p className="text-lg font-display font-black" style={{ color: getStatusColor(val) }}>
                                            {val}s
                                        </p>
                                        <p className="text-[10px] font-bold text-navy-400">
                                            {val < 1 ? 'Healthy' : val < 2 ? 'Warning' : 'Critical'}
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />

                    {/* Background Zones */}
                    <ReferenceArea y1={0} y2={1} fill={chartColors.primary} fillOpacity={0.05} />
                    <ReferenceArea y1={1} y2={2} fill="#F59E0B" fillOpacity={0.05} />
                    <ReferenceArea y1={2} y2={3} fill={chartColors.warning} fillOpacity={0.05} />

                    <Line
                        type="monotone"
                        dataKey="latency"
                        stroke={chartColors.primary}
                        strokeWidth={3}
                        dot={<CustomDot data={mockData} />}
                        activeDot={{ r: 8 }}
                        animationDuration={1500}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
}
