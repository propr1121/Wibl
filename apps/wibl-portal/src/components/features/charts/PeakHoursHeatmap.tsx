"use client";

import React, { useState } from 'react';
import { ChartWrapper } from './ChartWrapper';
import { cn } from '@/lib/utils';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

// Mock data generator
const generateHeatmapData = () => {
    return DAYS.map(() => HOURS.map(() => Math.floor(Math.random() * 100)));
};

export function PeakHoursHeatmap() {
    const [data] = useState(generateHeatmapData());
    const [hoveredCell, setHoveredCell] = useState<{ day: number; hour: number; count: number } | null>(null);

    const maxCount = Math.max(...data.flat());

    const getColor = (count: number) => {
        const intensity = count / maxCount;
        if (intensity < 0.2) return 'bg-canvas-muted';
        if (intensity < 0.4) return 'bg-wibl-mint/40';
        if (intensity < 0.6) return 'bg-wibl-mint';
        if (intensity < 0.8) return 'bg-wibl-teal';
        return 'bg-wibl-sky';
    };

    const findPeak = () => {
        let peak = { day: 0, hour: 0, count: 0 };
        data.forEach((dayData, dayIndex) => {
            dayData.forEach((count, hourIndex) => {
                if (count > peak.count) {
                    peak = { day: dayIndex, hour: hourIndex, count };
                }
            });
        });
        return peak;
    };

    const peak = findPeak();

    return (
        <ChartWrapper
            title="Peak Hours"
            subtitle="Conversation volume by day and hour"
            className="overflow-hidden"
        >
            <div className="mt-4 overflow-x-auto">
                <div className="min-w-[700px]">
                    {/* Header (Hours) */}
                    <div className="flex mb-2 ml-10">
                        {HOURS.map((hour) => (
                            <div key={hour} className="flex-1 text-[10px] font-bold text-navy-400 text-center">
                                {hour === 0 || hour === 12 ? `${hour === 0 ? '12a' : '12p'}` : hour % 6 === 0 ? hour % 12 : ''}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="space-y-1">
                        {DAYS.map((day, dayIndex) => (
                            <div key={day} className="flex items-center gap-2">
                                <div className="w-8 text-[11px] font-black text-navy-500 uppercase tracking-tighter">
                                    {day}
                                </div>
                                <div className="flex-1 flex gap-1 h-6">
                                    {data[dayIndex].map((count, hourIndex) => (
                                        <div
                                            key={hourIndex}
                                            className={cn(
                                                "flex-1 rounded-[2px] cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-glow relative group",
                                                getColor(count)
                                            )}
                                            onMouseEnter={() => setHoveredCell({ day: dayIndex, hour: hourIndex, count })}
                                            onMouseLeave={() => setHoveredCell(null)}
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-navy-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20">
                                                {DAYS[dayIndex]} {hourIndex}:00 — <span className="font-black">{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-4 border-t border-navy-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <p className="text-xs font-medium text-navy-500">
                        Most active: <span className="font-black text-navy-700">{DAYS[peak.day]} {peak.hour}:00</span>
                    </p>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-navy-400">Scale:</span>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 bg-canvas-muted rounded-sm" />
                            <div className="w-3 h-3 bg-wibl-mint/40 rounded-sm" />
                            <div className="w-3 h-3 bg-wibl-mint rounded-sm" />
                            <div className="w-3 h-3 bg-wibl-teal rounded-sm" />
                            <div className="w-3 h-3 bg-wibl-sky rounded-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </ChartWrapper>
    );
}
