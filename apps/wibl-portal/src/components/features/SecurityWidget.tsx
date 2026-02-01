"use client";

import React, { useState } from 'react';
import {
    Shield,
    ShieldAlert,
    ShieldCheck,
    AlertTriangle,
    Lock,
    ExternalLink,
    Clock,
    XCircle
} from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

// --- Mock Data ---

const RECENT_EVENTS = [
    { id: '1', type: 'prompt_injection', severity: 'high', agent: 'Customer Bot', time: '12 min ago', blocked: true },
    { id: '2', type: 'rate_limit', severity: 'low', agent: 'Sales Bot', time: '45 min ago', blocked: true },
    { id: '3', type: 'system_leak_prevented', severity: 'critical', agent: 'Support Bot', time: '2 hours ago', blocked: true },
];

export default function SecurityDashboardWidget() {
    const [isHealthy] = useState(true);

    const severityConfig = {
        low: "bg-navy-50 text-navy-600 border-navy-100",
        medium: "bg-amber-50 text-amber-700 border-amber-200",
        high: "bg-coral/10 text-coral border-coral/20",
        critical: "bg-navy-900 text-white border-transparent"
    };

    return (
        <Card variant="elevated" padding="md" className="space-y-6 bg-white overflow-hidden relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        isHealthy ? "bg-teal-50 text-wibl-teal" : "bg-coral/10 text-coral"
                    )}>
                        {isHealthy ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
                    </div>
                    <div>
                        <h3 className="font-display font-black text-navy-800 text-lg">Security Status</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-wibl-teal animate-pulse-soft" />
                            <span className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Active Protection</span>
                        </div>
                    </div>
                </div>
                <Badge variant="teal" size="sm" className="flex items-center gap-1">
                    <Lock size={10} /> Secure
                </Badge>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-navy-50/50 rounded-2xl p-4 border border-navy-50">
                    <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest mb-1">Blocked Attempts</p>
                    <p className="text-2xl font-display font-black text-navy-800">127</p>
                </div>
                <div className="bg-navy-50/50 rounded-2xl p-4 border border-navy-50">
                    <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest mb-1">Active Threats</p>
                    <p className="text-2xl font-display font-black text-wibl-teal">0</p>
                </div>
            </div>

            {/* Recent Events List */}
            <div className="space-y-3">
                <h4 className="text-xs font-black text-navy-500 uppercase tracking-widest flex items-center justify-between">
                    Recent Anomalies
                    <button className="text-[10px] hover:text-wibl-teal transition-colors underline">View Logs</button>
                </h4>
                <div className="space-y-2">
                    {RECENT_EVENTS.map(event => (
                        <div key={event.id} className="flex items-start gap-3 p-3 bg-white border border-navy-50 rounded-xl group hover:border-wibl-teal/30 transition-all">
                            <div className={cn(
                                "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center",
                                event.severity === 'critical' ? "bg-navy-900 text-white" : "bg-navy-50 text-navy-400"
                            )}>
                                {event.blocked ? <XCircle size={14} /> : <AlertTriangle size={14} />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex justify-between items-start">
                                    <p className="text-xs font-black text-navy-800 truncate capitalize">
                                        {event.type.replace(/_/g, ' ')}
                                    </p>
                                    <span className="text-[9px] font-black text-navy-300 uppercase shrink-0 ml-2">{event.time}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-navy-400 font-medium">Agent: <span className="font-bold text-navy-600">{event.agent}</span></span>
                                    <div className={cn(
                                        "px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter border",
                                        severityConfig[event.severity as keyof typeof severityConfig]
                                    )}>
                                        {event.severity}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Button variant="ghost" className="w-full text-xs" size="sm" rightIcon={<ExternalLink size={12} />}>
                Security Settings
            </Button>

            {/* Decorative background grid */}
            <div className="absolute -bottom-8 -right-8 opacity-[0.03] pointer-events-none">
                <Shield size={160} />
            </div>
        </Card>
    );
}
