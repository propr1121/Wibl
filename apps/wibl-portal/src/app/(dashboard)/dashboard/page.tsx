"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge, Avatar } from '@/components/ui';
import {
    Bot,
    MessageCircle,
    Play,
    Pause,
    Eye,
    Plus,
    Rocket,
    Sparkles,
    TrendingUp,
    Zap,
    Brain,
    ShieldCheck,
    ChevronRight,
    ArrowUpRight,
    Cpu,
    CheckCircle2
} from 'lucide-react';
import { useHeaderConfig } from '@/components/layouts/DashboardContext';
import { ActivityStream } from '@/components/dashboard/ActivityStream';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { chartColors } from '@/lib/chart-config';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Mock data
const MOCK_USER = { name: 'John', plan: 'Pro' };

const MOCK_STATS_CHART = [
    { date: 'Jan 26', conversations: 45 },
    { date: 'Jan 27', conversations: 52 },
    { date: 'Jan 28', conversations: 48 },
    { date: 'Jan 29', conversations: 61 },
    { date: 'Jan 30', conversations: 55 },
    { date: 'Jan 31', conversations: 72 },
    { date: 'Feb 01', conversations: 65 },
];

const MOCK_AGENTS = [
    {
        id: '1',
        name: 'Customer Support Bot',
        description: 'Handles customer inquiries 24/7',
        status: 'active' as const,
        conversationsToday: 32,
        initial: 'C',
    },
    {
        id: '2',
        name: 'Sales Assistant',
        description: 'Qualifies leads and books meetings',
        status: 'active' as const,
        conversationsToday: 15,
        initial: 'S',
    },
];

const CHART_DATA = [
    { x: 0, y: 300, value: 42, day: 'Mon' },
    { x: 166, y: 320, value: 38, day: 'Tue' },
    { x: 333, y: 220, value: 55, day: 'Wed' },
    { x: 500, y: 260, value: 48, day: 'Thu' },
    { x: 666, y: 140, value: 72, day: 'Fri', isPeak: true },
    { x: 833, y: 200, value: 64, day: 'Sat' },
    { x: 1000, y: 180, value: 59, day: 'Sun' }
];

const USAGE = {
    agents: { used: 2, limit: 10 },
    conversations: { used: 1240, limit: 5000 },
    storage: { used: 45, limit: 100 } // MB
};

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false);
    const [agents, setAgents] = useState<any[]>([]);
    const [approvals, setApprovals] = useState<any[]>([]);
    const [analytics, setAnalytics] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hoveredPoint, setHoveredPoint] = useState<any>(null);
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useHeaderConfig({
        breadcrumbs: [{ label: 'Overview', href: '/dashboard' }],
    });

    useEffect(() => {
        setMounted(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [agentsRes, approvalsRes, analyticsRes, activitiesRes] = await Promise.all([
                fetch('/api/agents'),
                fetch('/api/approvals'),
                fetch('/api/analytics'),
                fetch('/api/activities')
            ]);

            if (agentsRes.ok) setAgents(await agentsRes.json());
            if (approvalsRes.ok) setApprovals((await approvalsRes.json()).slice(0, 3));
            if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
            if (activitiesRes.ok) setActivities(await activitiesRes.json());
        } catch (error) {
            console.error('Dashboard fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApproval = async (id: string, status: 'approved' | 'rejected') => {
        try {
            const response = await fetch('/api/approvals', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            if (response.ok) {
                setApprovals(prev => prev.filter(a => a.id !== id));
            }
        } catch (error) {
            console.error('Failed to process approval:', error);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    if (!mounted) return null;

    return (
        <div className="space-y-12 pb-20 max-w-[1600px] mx-auto relative overflow-hidden">
            {/* Background Orbs for Premium feel */}
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-wibl-teal/5 rounded-full blur-[140px] pointer-events-none orb-animated" />
            <div className="absolute bottom-[20%] left-[-5%] w-[500px] h-[500px] bg-wibl-mint/5 rounded-full blur-[120px] pointer-events-none orb-animated-slow" />

            {/* Top Section: Simplified Header (Clean & Focused) */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 animate-reveal">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-wibl-teal uppercase tracking-[0.3em] mb-1">Operational Overview</p>
                    <h1 className="text-4xl lg:text-5xl font-display font-black text-navy-900 tracking-tighter">
                        {getGreeting()}, <span className="text-gradient">John.</span>
                    </h1>
                    <p className="text-navy-400 font-medium text-lg max-w-xl">
                        Your AI workforce is active. Agents have managed <span className="text-navy-900 font-black underline decoration-wibl-teal/30">47 chats</span> today.
                    </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    <Link href="/agents/new">
                        <Button
                            variant="primary"
                            size="lg"
                            className="shadow-glow px-8"
                            leftIcon={<Plus size={20} />}
                        >
                            Create New Agent
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch pt-2">
                {/* Visual Chart - 2/3 width */}
                <Card
                    variant="glass"
                    padding="none"
                    className="xl:col-span-2 overflow-hidden border-navy-50/50 flex flex-col animate-reveal delay-100 group/chart"
                >
                    <div className="p-6 sm:p-8 border-b border-navy-50/50 flex flex-col sm:flex-row sm:items-center justify-between bg-white/40 overflow-hidden relative gap-4">
                        <div className="relative z-10">
                            <h3 className="text-xl font-display font-black text-navy-900 tracking-tighter">Conversation Impact</h3>
                            <div className="flex items-center gap-3 mt-1">
                                <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Last 7 Days</p>
                                <span className="w-1 h-1 rounded-full bg-navy-100" />
                                <div className="flex items-center gap-1">
                                    <Sparkles size={10} className="text-wibl-teal" />
                                    <p className="text-[10px] font-black text-wibl-teal uppercase tracking-widest">Peak: 72 Chats</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 relative z-10 shrink-0">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-wibl-mint/10 rounded-full border border-wibl-mint/20">
                                <TrendingUp size={14} className="text-wibl-mint" />
                                <span className="text-[10px] font-black text-wibl-mint uppercase tracking-widest">+12.4%</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 p-8 bg-gradient-to-b from-white/40 to-transparent flex flex-col justify-center relative">
                        <div
                            ref={chartContainerRef}
                            className="relative h-72 w-full mt-4 cursor-crosshair"
                            onMouseMove={(e) => {
                                if (!chartContainerRef.current) return;
                                const rect = chartContainerRef.current.getBoundingClientRect();
                                const x = ((e.clientX - rect.left) / rect.width) * 1000;

                                // Find nearest point
                                const closest = CHART_DATA.reduce((prev, curr) =>
                                    Math.abs(curr.x - x) < Math.abs(prev.x - x) ? curr : prev
                                );
                                setHoveredPoint(closest);
                            }}
                            onMouseLeave={() => setHoveredPoint(null)}
                        >
                            {/* Interactive Guide Layer (Vertical Line) */}
                            {hoveredPoint && (
                                <div
                                    className="absolute top-0 bottom-0 w-[1px] bg-wibl-teal/20 z-10 transition-all duration-300 pointer-events-none"
                                    style={{ left: `${(hoveredPoint.x / 1000) * 100}%` }}
                                >
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-wibl-teal blur-[4px]" />
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-wibl-teal blur-[4px]" />
                                </div>
                            )}

                            {/* Mock Chart Visualization with Expanded ViewBox */}
                            <svg className="w-full h-full overflow-visible pointer-events-none" viewBox="0 0 1000 400" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--wibl-teal)" stopOpacity="0.1" />
                                        <stop offset="100%" stopColor="var(--wibl-teal)" stopOpacity="0" />
                                    </linearGradient>
                                </defs>

                                <path
                                    d="M0,300 Q83,310 166,320 T333,220 T500,260 T666,140 T833,200 T1000,180"
                                    fill="none"
                                    stroke="var(--wibl-teal)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    className="chart-path-draw"
                                />
                                <path
                                    d="M0,300 Q83,310 166,320 T333,220 T500,260 T666,140 T833,200 T1000,180 V400 H0 Z"
                                    fill="url(#chart-gradient)"
                                />

                                {/* Data Points - Focal Highlights */}
                                {CHART_DATA.map((pt, i) => (
                                    <g key={i}>
                                        {hoveredPoint?.day === pt.day && (
                                            <circle
                                                cx={pt.x}
                                                cy={pt.y}
                                                r="15"
                                                fill="var(--wibl-teal)"
                                                className="opacity-20 animate-pulse"
                                            />
                                        )}
                                        <circle
                                            cx={pt.x}
                                            cy={pt.y}
                                            r={hoveredPoint?.day === pt.day ? "8" : "5"}
                                            fill="white"
                                            stroke="var(--wibl-teal)"
                                            strokeWidth="4"
                                            className="transition-all duration-300 shadow-premium"
                                        />
                                    </g>
                                ))}
                            </svg>

                            {/* Solid Interactive Tooltip (POSITIONED ABOVE DOT) */}
                            {hoveredPoint && (
                                <div
                                    className="absolute p-4 bg-navy-900 border border-white/20 shadow-2xl rounded-[20px] animate-reveal z-50 pointer-events-none transition-all duration-100 ease-out"
                                    style={{
                                        left: `${(hoveredPoint.x / 1000) * 100}%`,
                                        top: `${(hoveredPoint.y / 400) * 100}%`,
                                        transform: 'translate(-50%, calc(-100% - 24px))'
                                    }}
                                >
                                    <div className="relative z-10 min-w-[100px]">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">{hoveredPoint.day} Metric</p>
                                        </div>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-2xl font-display font-black text-white tabular-nums tracking-tighter">
                                                {hoveredPoint.value}
                                            </span>
                                            <span className="text-[10px] text-wibl-teal font-black uppercase tracking-widest">Chats</span>
                                        </div>
                                    </div>
                                    {/* Link Connector Arrow pointing DOWN */}
                                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-navy-900 border-r border-b border-white/20 rotate-45" />
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-7 gap-4 mt-8 pt-8 border-t border-navy-50/50">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                <div key={day} className="text-center">
                                    <p className="text-[10px] font-black text-navy-300 uppercase tracking-widest">{day}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Workforce Health Card - User Friendly usage */}
                <Card variant="glass-dark" padding="none" className="relative overflow-hidden group animate-reveal delay-200 border-white/5 flex flex-col h-full bg-[#1A1F2E]">
                    <div className="relative z-10 h-full flex flex-col p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-10">
                            <div className="space-y-1">
                                <h3 className="text-xl font-display font-black tracking-tighter text-white">Workforce Health</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-wibl-mint animate-pulse" />
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-wibl-mint">Live Monitoring</p>
                                </div>
                            </div>
                            <div className="inline-flex px-2 py-0.5 bg-white/10 rounded-md border border-white/5 backdrop-blur-sm self-start sm:self-auto">
                                <span className="text-[8px] font-black text-white/80 uppercase tracking-widest">PRO PLAN</span>
                            </div>
                        </div>

                        <div className="space-y-7 flex-1">
                            <UsageItem label="Active Agents" used={agents.length} limit={10} unit="Deployed" />
                            <UsageItem
                                label="Chat Volume"
                                used={analytics?.summary?.totalTokens ? Math.floor(analytics.summary.totalTokens / 500) : 1240}
                                limit={5000}
                                unit="Chats"
                                subtitle="Estimated from token usage"
                            />
                            <UsageItem
                                label="Unit Logic Cost"
                                used={analytics?.summary ? Number(analytics.summary.totalCost) : 0.45}
                                limit={10}
                                unit="USD"
                            />
                        </div>

                        <div className="mt-10">
                            <Link href="/settings/billing">
                                <Button className="w-full bg-white text-navy-900 hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] text-[10px] font-black uppercase tracking-[0.2em] py-6 shadow-2xl transition-all duration-300 group">
                                    Plan & Billing <ArrowUpRight size={14} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recommendations & Active Agents */}
            <div className="grid lg:grid-cols-3 gap-12 pt-4">
                {/* Action Approvals - Human in the loop */}
                <div className="lg:col-span-1 space-y-6 animate-reveal delay-300">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-wibl-coral/10 flex items-center justify-center text-wibl-coral shadow-sm">
                                <ShieldCheck size={16} />
                            </div>
                            <h3 className="text-lg font-display font-black text-navy-900 tracking-tight">Pending Approvals</h3>
                            {approvals.length > 0 && <Badge variant="error" size="sm" className="ml-2 animate-pulse">{approvals.length}</Badge>}
                        </div>
                        <p className="text-[10px] font-bold text-navy-400 uppercase tracking-widest ml-1 opacity-70">Actions requiring your authorization</p>
                    </div>

                    <div className="space-y-4">
                        {approvals.length === 0 ? (
                            <Card variant="glass" className="p-6 text-center border-navy-50/50">
                                <CheckCircle2 className="w-10 h-10 text-wibl-mint/40 mx-auto mb-3" />
                                <p className="text-[11px] font-black text-navy-400 uppercase tracking-widest">Workspace Secured</p>
                                <p className="text-[10px] text-navy-300 mt-1 font-medium">All agent actions are within safety thresholds.</p>
                            </Card>
                        ) : (
                            approvals.map((app) => (
                                <Card key={app.id} variant="elevated" padding="sm" className="bg-white border-navy-50/50">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Avatar size="sm" fallback={app.agent?.name?.[0] || 'A'} />
                                                <span className="text-[10px] font-black text-navy-800 uppercase tracking-tighter">{app.agent?.name}</span>
                                            </div>
                                            <Badge variant={app.risk_level === 'high' ? 'error' : 'warning'} className="text-[8px] px-1.5 py-0">
                                                {app.risk_level} Risk
                                            </Badge>
                                        </div>

                                        <div className="p-3 bg-navy-50/50 rounded-xl border border-navy-50">
                                            <p className="text-[11px] font-black text-navy-900 uppercase tracking-widest leading-none mb-1.5">{app.action_type.replace(/_/g, ' ')}</p>
                                            <p className="text-[10px] text-navy-500 font-medium line-clamp-2">
                                                {JSON.stringify(app.parameters)}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="flex-1 bg-wibl-mint hover:bg-wibl-mint/90 h-9 text-[9px] font-black uppercase tracking-widest"
                                                onClick={() => handleApproval(app.id, 'approved')}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 border-navy-100 h-9 text-[9px] font-black uppercase tracking-widest"
                                                onClick={() => handleApproval(app.id, 'rejected')}
                                            >
                                                Deny
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>

                    <div className="pt-4 h-[500px]">
                        <ActivityStream activities={activities} />
                    </div>
                </div>

                {/* Agents List - Taking more space */}
                <div className="lg:col-span-2 space-y-6 animate-reveal delay-400">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-display font-black text-navy-900 tracking-tight">Your AI Workforce</h3>
                        <div className="px-3 py-1 bg-navy-50 rounded-full border border-navy-100 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-wibl-teal" />
                            <span className="text-[10px] font-black text-navy-500 uppercase tracking-widest">{MOCK_AGENTS.length} Agents Live</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {agents.length === 0 && !isLoading ? (
                            <div className="py-20 text-center bg-navy-50/30 rounded-[28px] border-2 border-dashed border-navy-100">
                                <Bot size={40} className="text-navy-200 mx-auto mb-4" />
                                <p className="text-sm font-black text-navy-400 uppercase tracking-widest">No agents deployed</p>
                                <Link href="/agents/new">
                                    <Button variant="primary" size="sm" className="mt-4">Build your first agent</Button>
                                </Link>
                            </div>
                        ) : (
                            agents.map((agent, i) => (
                                <div key={agent.id} className="animate-reveal" style={{ animationDelay: `${500 + (i * 100)}ms` }}>
                                    <AgentCard agent={{
                                        ...agent,
                                        initial: agent.name?.[0] || 'A',
                                        description: agent.profile?.role || 'Custom Agent',
                                        conversationsToday: Math.floor(Math.random() * 50)
                                    }} />
                                </div>
                            ))
                        )}

                        <Link href="/agents" className="block p-5 border-2 border-dashed border-navy-100 rounded-[28px] text-center group hover:border-wibl-teal/50 hover:bg-wibl-teal/5 transition-all duration-300">
                            <span className="text-[13px] font-black text-navy-400 group-hover:text-wibl-teal uppercase tracking-widest">Manage Workforce Catalog</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Sub-components ---

function UsageItem({ label, used, limit, unit, subtitle }: { label: string, used: number, limit: number, unit: string, subtitle?: string }) {
    const percent = Math.min((used / limit) * 100, 100);
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-baseline gap-2">
                <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white/60 truncate">{label}</span>
                    {subtitle && <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-0.5 line-clamp-1">{subtitle}</span>}
                </div>
                <div className="text-right shrink-0">
                    <p className="text-[11px] font-black text-white tabular-nums tracking-tighter leading-none">
                        {used.toLocaleString()}
                        <span className="opacity-30 text-[8px] font-bold uppercase ml-1">/ {limit.toLocaleString()} {unit}</span>
                    </p>
                </div>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px] relative">
                <div
                    className="h-full gradient-brand rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,242,234,0.4)]"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}

function InsightCard({ title, desc, icon, color, link }: { title: string, desc: string, icon: React.ReactNode, color: string, link: string }) {
    return (
        <Link href={link} className="block group">
            <Card variant="elevated" padding="sm" className="bg-white border-navy-50/50 hover:border-wibl-teal/30 transition-all duration-500 overflow-hidden relative">
                <div className="flex gap-4 relative z-10">
                    <div className={cn(
                        "w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 shadow-sm",
                        color === 'teal' ? "bg-wibl-teal/10 text-wibl-teal" :
                            color === 'mint' ? "bg-wibl-mint/10 text-wibl-mint" :
                                "bg-coral/10 text-coral"
                    )}>
                        {icon}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-display font-black text-navy-900 flex items-center justify-between group-hover:text-wibl-teal transition-colors tracking-tight">
                            {title}
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500" />
                        </h4>
                        <p className="text-[11px] text-navy-500 font-bold leading-relaxed line-clamp-2 mt-0.5">{desc}</p>
                    </div>
                </div>
                {/* Subtle background hit */}
                <div className={cn(
                    "absolute top-0 right-0 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none",
                    color === 'teal' ? "bg-wibl-teal" : color === 'mint' ? "bg-wibl-mint" : "bg-coral"
                )} />
            </Card>
        </Link>
    );
}

function AgentCard({ agent }: { agent: any }) {
    return (
        <Card variant="elevated" padding="none" hoverable className="border-navy-50/50 group animate-reveal overflow-hidden">
            <div className="p-4 sm:p-5 flex items-center gap-4 sm:gap-6">
                {/* Agent Brand Identifier */}
                <div className="relative shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[22px] gradient-brand flex items-center justify-center text-white font-display font-black text-2xl group-hover:scale-105 transition-transform duration-500 shadow-premium-sm relative z-10">
                        {agent.initial}
                        <div className="absolute inset-0 bg-white/20 rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {/* Status Glow */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm z-20">
                        <div className="w-2.5 h-2.5 rounded-full bg-wibl-teal status-live" />
                    </div>
                </div>

                {/* Primary Intelligence Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-black text-navy-900 truncate tracking-tight text-base sm:text-lg">{agent.name}</h3>
                        <Badge variant="teal" size="sm" className="bg-wibl-teal/10 text-wibl-teal border-wibl-teal/20 font-black">ACTIVE</Badge>
                    </div>
                    <p className="text-xs text-navy-400 font-bold truncate tracking-tight uppercase opacity-70 leading-none">
                        {agent.description}
                    </p>
                </div>

                {/* Performance Metrics Overlay */}
                <div className="hidden md:flex flex-col items-end px-6 border-l border-navy-50">
                    <p className="text-2xl font-display font-black text-navy-900 leading-none tabular-nums tracking-tighter">{agent.conversationsToday}</p>
                    <p className="text-[10px] font-black text-navy-300 uppercase tracking-widest mt-1">Managed Today</p>
                </div>

                {/* Operational Controls */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <Link href={`/agents/${agent.id}`}>
                        <Button variant="ghost" size="sm" className="hidden sm:flex border-navy-100 text-navy-600 hover:bg-navy-900 hover:text-white hover:border-navy-900 font-black px-4" leftIcon={<Eye size={14} />}>
                            Visualize
                        </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="w-10 h-10 sm:w-11 sm:h-11 p-0 rounded-2xl bg-navy-50 border-transparent hover:bg-coral/10 hover:text-coral transition-colors flex items-center justify-center">
                        <Pause size={18} className="text-navy-400 group-hover:text-coral transition-colors" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
