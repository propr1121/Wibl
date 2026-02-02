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
        breadcrumbs: [{ label: 'Overview', href: '/dashboard' }, { label: 'Workforce', href: '/agents' }],
    });

    return (
        <div className="space-y-12 pb-20 max-w-[1400px] mx-auto relative overflow-hidden">
            {/* Background Orbs for Premium feel */}
            <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-wibl-teal/5 rounded-full blur-[140px] pointer-events-none orb-animated" />
            <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-wibl-mint/5 rounded-full blur-[120px] pointer-events-none orb-animated-slow" />

            {/* Workforce Management Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 animate-reveal">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-wibl-teal uppercase tracking-[0.3em] mb-1">Workforce Intelligence</p>
                    <h1 className="text-3xl lg:text-4xl font-display font-black text-navy-900 tracking-tighter">
                        Manage <span className="text-gradient">Workforce.</span>
                    </h1>
                </div>
                <Link href="/agents/new">
                    <Button
                        variant="primary"
                        size="lg"
                        leftIcon={<Plus size={20} />}
                        className="shadow-glow px-8 h-14"
                    >
                        Create New Agent
                    </Button>
                </Link>
            </div>

            {/* Strategic Workflow - Detoxified Language */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card variant="glass" className="p-6 group hover:translate-y-[-4px] transition-all duration-500 border-navy-50/40">
                    <div className="w-12 h-12 rounded-xl bg-wibl-teal/10 flex items-center justify-center mb-5 text-wibl-teal group-hover:scale-110 transition-all duration-500 shadow-sm border border-wibl-teal/10">
                        <Sparkles size={24} />
                    </div>
                    <h3 className="text-lg font-display font-black text-navy-900 mb-2 tracking-tight">1. Personality & Role</h3>
                    <p className="text-[13px] text-navy-500 font-medium leading-relaxed opacity-80">
                        Define mission, tone of voice, and operational persona in plain English.
                    </p>
                </Card>
                <Card variant="glass" className="p-6 group hover:translate-y-[-4px] transition-all duration-500 border-navy-50/40">
                    <div className="w-12 h-12 rounded-xl bg-wibl-mint/10 flex items-center justify-center mb-5 text-wibl-mint group-hover:scale-110 transition-all duration-500 shadow-sm border border-wibl-mint/10">
                        <Cpu size={24} />
                    </div>
                    <h3 className="text-lg font-display font-black text-navy-900 mb-2 tracking-tight">2. Knowledge Library</h3>
                    <p className="text-[13px] text-navy-500 font-medium leading-relaxed opacity-80">
                        Upload documents or URLs to ground your agent in real-world data.
                    </p>
                </Card>
                <Card variant="glass" className="p-6 group hover:translate-y-[-4px] transition-all duration-500 border-navy-50/40">
                    <div className="w-12 h-12 rounded-xl bg-wibl-sky/10 flex items-center justify-center mb-5 text-wibl-sky group-hover:scale-110 transition-all duration-500 shadow-sm border border-wibl-sky/10">
                        <Rocket size={24} />
                    </div>
                    <h3 className="text-lg font-display font-black text-navy-900 mb-2 tracking-tight">3. Channel Activation</h3>
                    <p className="text-[13px] text-navy-500 font-medium leading-relaxed opacity-80">
                        Launch your agent across WhatsApp or Web with a single production click.
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
            className="group overflow-hidden border-navy-50/40 hover:translate-y-[-2px] transition-all duration-300"
        >
            <div className="flex flex-col lg:flex-row lg:items-center">
                {/* Left: Identity & Core Info */}
                <div className="p-5 sm:p-6 flex items-center gap-5 flex-1 min-w-0">
                    <Avatar
                        fallback={agent.initial}
                        size="lg"
                        className="shadow-xl group-hover:scale-105 transition-transform duration-500 shrink-0 ring-2 ring-wibl-teal/20"
                    />
                    <div className="min-w-0">
                        <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                            <h3 className="text-xl font-display font-black text-navy-900 tracking-tight truncate">
                                {agent.name}
                            </h3>
                            <Badge variant={agent.status === 'active' ? 'teal' : 'error'} size="sm" className="font-black uppercase tracking-widest text-[8px] h-4 leading-none">
                                {agent.status === 'active' ? 'Operational' : 'Idle'}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest">ID: {agent.id.padStart(4, '0')}</p>
                            <div className="h-3 w-px bg-navy-100 hidden sm:block" />
                            <div className="hidden sm:flex items-center gap-1.5">
                                <Activity size={10} className="text-wibl-teal" />
                                <p className="text-[10px] font-bold text-navy-400 opacity-80 uppercase tracking-tight">{agent.type}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center: Intelligence Pipeline (Compact) */}
                <div className="px-8 py-6 lg:py-0 flex items-center justify-between lg:justify-center gap-8 xl:gap-14 border-y lg:border-y-0 lg:border-x border-navy-50/40 lg:w-[400px]">
                    <div className="flex flex-col items-center gap-1.5 group/step">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-wibl-teal/5 text-wibl-teal border border-wibl-teal/10">
                            <Sparkles size={16} />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-wibl-teal opacity-80">Role Set</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 group/step">
                        <div className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300",
                            agent.trained ? "bg-wibl-mint/5 text-wibl-mint border-wibl-mint/10" : "bg-navy-50/50 text-navy-200 border-navy-50"
                        )}>
                            <Cpu size={16} />
                        </div>
                        <span className={cn(
                            "text-[9px] font-black uppercase tracking-widest",
                            agent.trained ? "text-wibl-mint/80" : "text-navy-300"
                        )}>Knowledge</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 group/step">
                        <div className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300",
                            agent.deployed ? "bg-wibl-sky/5 text-wibl-sky border-wibl-sky/10" : "bg-navy-50/50 text-navy-200 border-navy-50"
                        )}>
                            <Rocket size={16} />
                        </div>
                        <span className={cn(
                            "text-[9px] font-black uppercase tracking-widest",
                            agent.deployed ? "text-wibl-sky/80" : "text-navy-300"
                        )}>Live</span>
                    </div>
                </div>

                {/* Right: Telemetry & Navigation */}
                <div className="p-6 sm:p-7 flex items-center justify-between lg:justify-end gap-10">
                    <div className="text-right hidden xl:block min-w-[100px]">
                        <p className="text-2xl font-display font-black text-navy-900 tabular-nums tracking-tighter leading-none">{agent.conversations}</p>
                        <p className="text-[9px] font-black text-navy-400 uppercase tracking-widest mt-1">Total Chats</p>
                    </div>

                    <div className="flex items-center gap-2.5 ml-auto lg:ml-0">
                        <Link href={`/agents/${agent.id}`}>
                            <Button variant="ghost" size="sm" className="font-black uppercase tracking-widest text-[9px] px-6 py-3 border border-navy-100 hover:border-navy-900">
                                View Console
                            </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="p-2.5 bg-navy-50 border-transparent hover:bg-navy-100 transition-colors">
                            <Settings size={18} className="text-navy-400 group-hover:rotate-90 transition-transform duration-500" />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
