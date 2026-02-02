"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge } from '@/components/ui';
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
    Info
} from 'lucide-react';
import { useHeaderConfig } from '@/components/layouts/DashboardContext';
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

const USAGE = {
    agents: { used: 2, limit: 10 },
    conversations: { used: 1240, limit: 5000 },
    storage: { used: 45, limit: 100 } // MB
};

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false);

    useHeaderConfig({
        title: 'Overview',
        breadcrumbs: [],
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    if (!mounted) return null;

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            {/* Top Section: Greeting & Quick Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 animate-reveal">
                <div>
                    <h1 className="text-4xl font-display font-black text-navy-800 mb-2 tracking-tight">
                        {getGreeting()}, {MOCK_USER.name}<span className="text-wibl-teal">.</span>
                    </h1>
                    <p className="text-navy-500 font-bold text-lg opacity-70">
                        Everything is running smoothly. Your agents have handled <span className="text-navy-800">47 chats</span> today.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/agents/new">
                        <Button variant="primary" size="lg" leftIcon={<Plus size={20} />} className="shadow-premium-lg">
                            Create New Agent
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Trend Chart - Takes 2 columns */}
                <Card variant="elevated" padding="none" className="lg:col-span-2 overflow-hidden animate-reveal delay-100">
                    <div className="p-6 border-b border-navy-50 flex justify-between items-center">
                        <div>
                            <h3 className="font-display font-black text-navy-700">Conversation Impact</h3>
                            <p className="text-xs font-bold text-navy-400 uppercase tracking-widest">Last 7 Days</p>
                        </div>
                        <Badge variant="teal" size="sm" className="flex items-center gap-1">
                            <TrendingUp size={12} /> +12% vs last week
                        </Badge>
                    </div>
                    <div className="h-[240px] w-full p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_STATS_CHART} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorConvo" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.15} />
                                        <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#94A3B8"
                                    fontSize={10}
                                    fontWeight="bold"
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#94A3B8"
                                    fontSize={10}
                                    fontWeight="bold"
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-navy-900 text-white rounded-xl py-2 px-3 shadow-xl border border-white/10">
                                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{payload[0].payload.date}</p>
                                                    <p className="text-lg font-display font-black leading-none">{payload[0].value} <span className="text-xs opacity-60">Chats</span></p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="conversations"
                                    stroke={chartColors.primary}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorConvo)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Plan Usage Card */}
                <Card variant="elevated" className="animate-reveal delay-200 bg-navy-900 border-navy-800 text-white overflow-hidden relative group">
                    <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-wibl-teal opacity-10 blur-[80px] rounded-full group-hover:opacity-20 transition-opacity duration-1000" />

                    <div className="relative z-10 h-full flex flex-col">
                        <h3 className="text-lg font-display font-black mb-6 flex items-center justify-between">
                            Plan Capacity
                            <Badge variant="gradient" size="sm">{MOCK_USER.plan}</Badge>
                        </h3>

                        <div className="space-y-6 flex-1">
                            <UsageItem
                                label="Active Agents"
                                used={USAGE.agents.used}
                                limit={USAGE.agents.limit}
                                unit="agents"
                            />
                            <UsageItem
                                label="Conversations"
                                used={USAGE.conversations.used}
                                limit={USAGE.conversations.limit}
                                unit="this month"
                            />
                            <UsageItem
                                label="Memory Used"
                                used={USAGE.storage.used}
                                limit={USAGE.storage.limit}
                                unit="MB"
                            />
                        </div>

                        <Link href="/settings/billing" className="mt-8">
                            <Button variant="ghost" className="w-full bg-white/5 hover:bg-white/10 border-white/5 text-xs font-black uppercase tracking-widest py-4">
                                Upgrade Plan <ArrowUpRight size={14} className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>

            {/* Recommendations & Active Agents */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recommendations - Strategic Prompting */}
                <div className="space-y-4 animate-reveal delay-300">
                    <p className="text-xs font-black text-navy-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Sparkles size={14} className="text-wibl-teal" /> Recommended Settings
                    </p>
                    <div className="space-y-4">
                        <InsightCard
                            title="Boost Accuracy"
                            desc="Add 2 new library sources to Support Bot to reduce 'I don't know' responses."
                            icon={<Brain size={20} />}
                            color="teal"
                            link="/knowledge"
                        />
                        <InsightCard
                            title="Connect WhatsApp"
                            desc="Sales Assistant is ready to go live on WhatsApp. Start qualification now."
                            icon={<MessageCircle size={20} />}
                            color="mint"
                            link="/agents/2/deploy"
                        />
                        <InsightCard
                            title="Security Check"
                            desc="One of your agents has PII redaction turned off. Privacy risk."
                            icon={<ShieldCheck size={20} />}
                            color="coral"
                            link="/settings"
                        />
                    </div>
                </div>

                {/* Agents List - Taking more space */}
                <div className="lg:col-span-2 space-y-4 animate-reveal delay-400">
                    <p className="text-xs font-black text-navy-400 uppercase tracking-widest ml-1">Your AI Workforce</p>
                    <div className="space-y-4">
                        {MOCK_AGENTS.map((agent) => (
                            <AgentCard key={agent.id} agent={agent} />
                        ))}

                        <Link href="/agents" className="block p-4 border-2 border-dashed border-navy-100 rounded-3xl text-center group hover:border-wibl-teal/50 hover:bg-wibl-teal/5 transition-all">
                            <span className="text-sm font-black text-navy-400 group-hover:text-wibl-teal">View all agents</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Sub-components ---

function UsageItem({ label, used, limit, unit }: { label: string, used: number, limit: number, unit: string }) {
    const percent = (used / limit) * 100;
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-60">
                <span>{label}</span>
                <span>{used.toLocaleString()} / {limit.toLocaleString()} {unit}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full gradient-brand rounded-full transition-all duration-1000"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}

function InsightCard({ title, desc, icon, color, link }: { title: string, desc: string, icon: React.ReactNode, color: string, link: string }) {
    return (
        <Link href={link}>
            <Card variant="elevated" hoverable padding="sm" className="bg-white border-navy-50 group">
                <div className="flex gap-4">
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                        color === 'teal' ? "bg-wibl-teal/10 text-wibl-teal" :
                            color === 'mint' ? "bg-wibl-mint/10 text-wibl-mint" :
                                "bg-coral/10 text-coral"
                    )}>
                        {icon}
                    </div>
                    <div className="min-w-0 pr-2">
                        <h4 className="text-sm font-display font-black text-navy-800 flex items-center gap-1 group-hover:text-wibl-teal transition-colors">
                            {title} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-1 transition-all" />
                        </h4>
                        <p className="text-xs text-navy-500 font-medium leading-relaxed">{desc}</p>
                    </div>
                </div>
            </Card>
        </Link>
    );
}

function AgentCard({ agent }: { agent: any }) {
    return (
        <Card variant="elevated" padding="md" hoverable className="border-navy-50 group animate-slide-up">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center text-white font-display font-black text-xl group-hover:scale-105 transition-transform shadow-lg shrink-0">
                    {agent.initial}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-display font-black text-navy-700 truncate">{agent.name}</h3>
                        <Badge variant="teal" size="sm">Active</Badge>
                    </div>
                    <p className="text-xs text-navy-500 font-medium truncate">{agent.description}</p>
                </div>
                <div className="text-right px-4 hidden sm:block">
                    <p className="text-xl font-display font-black text-navy-800 leading-none">{agent.conversationsToday}</p>
                    <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest mt-1">Today</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={`/agents/${agent.id}`}>
                        <Button variant="ghost" size="sm" leftIcon={<Eye size={16} />}>View</Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-xl bg-navy-50 hover:bg-navy-100">
                        <Pause size={16} className="text-navy-400" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
