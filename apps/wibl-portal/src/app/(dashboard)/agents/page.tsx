"use client";

import React, { useState } from 'react';
import { Card, Button, Badge } from '@/components/ui';
import {
    Bot,
    Plus,
    Eye,
    Pause,
    Play,
    Settings,
    Rocket,
    Activity,
    MessageCircle,
    ChevronRight,
    Sparkles,
    Zap,
    LayoutGrid,
    Cpu
} from 'lucide-react';
import { useHeaderConfig } from '@/components/layouts/DashboardContext';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui';

// Mock data
const MOCK_AGENTS = [
    {
        id: '1',
        name: 'Customer Support Bot',
        status: 'active' as const,
        trained: true,
        deployed: true,
        conversations: 124,
        type: 'Support',
        initial: 'C'
    },
    {
        id: '2',
        name: 'Sales Assistant',
        status: 'active' as const,
        trained: true,
        deployed: false,
        conversations: 45,
        type: 'Sales',
        initial: 'S'
    },
    {
        id: '3',
        name: 'Draft Agent',
        status: 'paused' as const,
        trained: false,
        deployed: false,
        conversations: 0,
        type: 'Operations',
        initial: 'D'
    }
];

export default function AgentsPage() {
    useHeaderConfig({
        title: 'Workforce',
        breadcrumbs: [{ label: 'Overview', href: '/dashboard' }, { label: 'Workforce', href: '/agents' }],
    });

    return (
        <div className="space-y-12 pb-20 max-w-[1400px] mx-auto relative overflow-hidden">
            {/* Background Orbs for Premium feel */}
            <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-wibl-teal/5 rounded-full blur-[140px] pointer-events-none orb-animated" />
            <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-wibl-mint/5 rounded-full blur-[120px] pointer-events-none orb-animated-slow" />

            {/* Workforce Management Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 animate-reveal">
                <div className="space-y-2">
                    <p className="text-[11px] font-black text-wibl-teal uppercase tracking-[0.4em] mb-1">Workforce Intelligence</p>
                    <h1 className="text-4xl lg:text-5xl font-display font-black text-navy-900 tracking-tighter">
                        Manage <span className="text-gradient">Workforce.</span>
                    </h1>
                </div>
                <Link href="/agents/new">
                    <Button
                        variant="primary"
                        size="lg"
                        leftIcon={<Plus size={22} />}
                        className="shadow-glow px-10 h-16 text-lg"
                    >
                        Create New Agent
                    </Button>
                </Link>
            </div>

            {/* Strategic Workflow - Detoxified Language */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card variant="glass" className="p-8 group hover:scale-[1.02] transition-all duration-500 border-navy-50/50">
                    <div className="w-14 h-14 rounded-2xl bg-wibl-teal/10 flex items-center justify-center mb-6 text-wibl-teal group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-sm">
                        <Sparkles size={28} />
                    </div>
                    <h3 className="text-xl font-display font-black text-navy-900 mb-3 tracking-tight">1. Personality & Role</h3>
                    <p className="text-[14px] text-navy-500 font-medium leading-relaxed opacity-90">
                        Define your agent's mission, tone of voice, and operational persona in plain English.
                    </p>
                </Card>
                <Card variant="glass" className="p-8 group hover:scale-[1.02] transition-all duration-500 border-navy-50/50">
                    <div className="w-14 h-14 rounded-2xl bg-wibl-mint/10 flex items-center justify-center mb-6 text-wibl-mint group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                        <Cpu size={28} />
                    </div>
                    <h3 className="text-xl font-display font-black text-navy-900 mb-3 tracking-tight">2. Knowledge Library</h3>
                    <p className="text-[14px] text-navy-500 font-medium leading-relaxed opacity-90">
                        Upload technical documents, URLs, or spreadsheets to ground your agent in real-world data.
                    </p>
                </Card>
                <Card variant="glass" className="p-8 group hover:scale-[1.02] transition-all duration-500 border-navy-50/50">
                    <div className="w-14 h-14 rounded-2xl bg-wibl-sky/10 flex items-center justify-center mb-6 text-wibl-sky group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 shadow-sm">
                        <Rocket size={28} />
                    </div>
                    <h3 className="text-xl font-display font-black text-navy-900 mb-3 tracking-tight">3. Channel Activation</h3>
                    <p className="text-[14px] text-navy-500 font-medium leading-relaxed opacity-90">
                        Launch your agent across WhatsApp, Slack, or Web Widgets with a single production click.
                    </p>
                </Card>
            </div>

            {/* Active Inventory */}
            <div className="space-y-6 animate-reveal delay-200">
                <div className="flex items-center justify-between ml-1">
                    <p className="text-[11px] font-black text-navy-400 uppercase tracking-[0.4em]">Active Members ({MOCK_AGENTS.length})</p>
                </div>
                <div className="space-y-4">
                    {MOCK_AGENTS.map((agent, idx) => (
                        <div
                            key={agent.id}
                            className="animate-slide-up"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <AgentListItem agent={agent} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AgentListItem({ agent }: { agent: any }) {
    return (
        <Card
            variant="glass"
            padding="none"
            hoverable
            className="group overflow-hidden border-navy-50/50"
        >
            <div className="flex flex-col lg:flex-row lg:items-center">
                {/* Left: Info */}
                <div className="p-6 sm:p-8 flex items-center gap-6 flex-1">
                    <Avatar
                        fallback={agent.initial}
                        size="xl"
                        ring
                        className="shadow-2xl group-hover:scale-105 transition-transform duration-500 hidden sm:flex"
                    />
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-2xl font-display font-black text-navy-900 tracking-tighter">
                                {agent.name}
                            </h3>
                            <div className="flex gap-2">
                                <Badge variant={agent.status === 'active' ? 'teal' : 'error'} size="sm" className="font-black uppercase tracking-widest text-[9px]">
                                    {agent.status === 'active' ? 'Operational' : 'Idle'}
                                </Badge>
                                <Badge variant="info" size="sm" className="font-black uppercase tracking-widest text-[9px] bg-navy-50 border-navy-100">
                                    {agent.type}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="text-[11px] font-black text-navy-400 uppercase tracking-widest">ID: {agent.id.padStart(4, '0')}</p>
                            <span className="w-1 h-1 rounded-full bg-navy-200" />
                            <div className="flex items-center gap-1.5">
                                <Activity size={12} className="text-wibl-teal" />
                                <p className="text-[11px] font-bold text-navy-500 opacity-70">Latency: 240ms</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center: Intelligence Pipeline */}
                <div className="px-10 py-8 lg:py-0 flex items-center justify-between lg:justify-center gap-8 xl:gap-14 border-y lg:border-y-0 lg:border-x border-navy-50/50 flex-1 lg:max-w-md">
                    <div className="flex flex-col items-center gap-2 group/step">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 bg-wibl-teal/10 text-wibl-teal shadow-inner grayscale-0">
                            <Sparkles size={18} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wibl-teal">Role Set</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 group/step">
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500",
                            agent.trained ? "bg-wibl-mint/10 text-wibl-mint" : "bg-navy-50 text-navy-200"
                        )}>
                            <Cpu size={18} />
                        </div>
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-[0.2em]",
                            agent.trained ? "text-wibl-mint" : "text-navy-300"
                        )}>Data Ready</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 group/step">
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500",
                            agent.deployed ? "bg-wibl-sky/10 text-wibl-sky shadow-sm shadow-wibl-sky/20" : "bg-navy-50 text-navy-200"
                        )}>
                            <Rocket size={18} />
                        </div>
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-[0.2em]",
                            agent.deployed ? "text-wibl-sky" : "text-navy-300"
                        )}>Connected</span>
                    </div>
                </div>

                {/* Right: Telemetry & Actions */}
                <div className="p-8 flex items-center justify-between lg:justify-end gap-12">
                    <div className="text-right hidden xl:block">
                        <p className="text-3xl font-display font-black text-navy-900 tabular-nums tracking-tighter leading-none">{agent.conversations}</p>
                        <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest mt-1">Chats Managed</p>
                    </div>

                    <div className="flex items-center gap-3 ml-auto lg:ml-0">
                        <Link href={`/agents/${agent.id}`}>
                            <Button variant="ghost" size="md" className="font-black uppercase tracking-widest text-[10px] px-8 py-4 border-2 hover:bg-navy-900">
                                View Console
                            </Button>
                        </Link>
                        <Button variant="ghost" size="md" className="p-3 bg-navy-50 border-transparent hover:bg-navy-100 transition-colors">
                            <Settings size={22} className="text-navy-400 group-hover:rotate-90 transition-transform duration-500" />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
