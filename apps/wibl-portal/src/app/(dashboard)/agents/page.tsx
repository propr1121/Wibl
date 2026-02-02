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
        <div className="space-y-10 pb-20 max-w-[1400px] mx-auto relative animate-reveal">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-wibl-teal/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Workforce Controls */}
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-navy-400 uppercase tracking-[0.3em]">Operational Overview</p>
                    <h2 className="text-3xl font-display font-black text-navy-900 tracking-tighter">Your AI Workforce</h2>
                </div>
                <Link href="/agents/new">
                    <Button
                        variant="primary"
                        size="lg"
                        leftIcon={<Plus size={20} />}
                        className="shadow-glow px-8"
                    >
                        Create New Agent
                    </Button>
                </Link>
            </div>

            {/* Onboarding Guide - Strategic Mapping */}
            <div className="grid md:grid-cols-3 gap-8">
                <div className="glass-premium p-8 rounded-[32px] border border-navy-50/50 hover:border-wibl-teal/20 transition-all duration-500 group">
                    <div className="w-12 h-12 rounded-2xl bg-wibl-teal/10 flex items-center justify-center mb-6 text-wibl-teal group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <Sparkles size={24} />
                    </div>
                    <h3 className="text-xl font-display font-black text-navy-900 mb-2 tracking-tight">1. Architectural Context</h3>
                    <p className="text-[13px] text-navy-500 font-medium leading-relaxed opacity-80">Define mission parameters and core intelligence persona in plain English.</p>
                </div>
                <div className="glass-premium p-8 rounded-[32px] border border-navy-50/50 hover:border-wibl-mint/20 transition-all duration-500 group border-dashed">
                    <div className="w-12 h-12 rounded-2xl bg-wibl-mint/10 flex items-center justify-center mb-6 text-wibl-mint group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <Cpu size={24} />
                    </div>
                    <h3 className="text-xl font-display font-black text-navy-900 mb-2 tracking-tight">2. Intelligence Training</h3>
                    <p className="text-[13px] text-navy-500 font-medium leading-relaxed opacity-80">Ingest technical documentation or URL structures for real-time model synthesis.</p>
                </div>
                <div className="glass-premium p-8 rounded-[32px] border border-navy-50/50 hover:border-wibl-sky/20 transition-all duration-500 group">
                    <div className="w-12 h-12 rounded-2xl bg-wibl-sky/10 flex items-center justify-center mb-6 text-wibl-sky group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
                        <Rocket size={24} />
                    </div>
                    <h3 className="text-xl font-display font-black text-navy-900 mb-2 tracking-tight">3. Global Deployment</h3>
                    <p className="text-[13px] text-navy-500 font-medium leading-relaxed opacity-80">Activate production endpoints across WhatsApp, Slack, or any web architecture.</p>
                </div>
            </div>

            {/* List View */}
            <div className="space-y-4 animate-reveal">
                <p className="text-[10px] font-black text-navy-400 uppercase tracking-[0.3em] ml-1">Your AI Workforce</p>
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
            variant="elevated"
            padding="none"
            hoverable
            className="group overflow-hidden border-navy-50/50 bg-white/60 backdrop-blur-sm"
        >
            <div className="flex flex-col md:flex-row md:items-center">
                {/* Left: Info */}
                <div className="p-8 flex items-center gap-6 flex-1">
                    <div className="w-20 h-20 rounded-[24px] gradient-brand flex items-center justify-center shrink-0 text-white font-display font-black text-3xl shadow-xl group-hover:scale-105 transition-all duration-500 relative">
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[24px]" />
                        {agent.initial}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-display font-black text-navy-900 tracking-tighter">
                                {agent.name}
                            </h3>
                            <Badge variant={agent.status === 'active' ? 'teal' : 'warning'} size="sm" className="font-black uppercase tracking-widest text-[9px]">
                                {agent.status === 'active' ? 'Operational' : 'Paused'}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest bg-navy-50 px-2 py-0.5 rounded-md">{agent.type} Agent</p>
                            <span className="w-1 h-1 rounded-full bg-navy-200" />
                            <p className="text-[10px] font-bold text-navy-300 uppercase tracking-tight">ID: {agent.id.padStart(4, '0')}</p>
                        </div>
                    </div>
                </div>

                {/* Center: System Status Pipeline */}
                <div className="px-10 py-6 md:py-0 flex items-center gap-12 border-y md:border-y-0 md:border-x border-navy-50/50">
                    <div className="flex flex-col items-center group/step">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-500 bg-wibl-teal text-white shadow-glow">
                            <Sparkles size={16} />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-wibl-teal">Defined</span>
                    </div>
                    <div className="flex flex-col items-center group/step">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-500 shadow-premium",
                            agent.trained ? "bg-wibl-teal text-white shadow-glow" : "bg-navy-50/50 text-navy-300"
                        )}>
                            <Cpu size={16} />
                        </div>
                        <span className={cn(
                            "text-[9px] font-black uppercase tracking-[0.2em]",
                            agent.trained ? "text-wibl-teal" : "text-navy-300"
                        )}>Trained</span>
                    </div>
                    <div className="flex flex-col items-center group/step">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-500 shadow-premium",
                            agent.deployed ? "bg-wibl-teal text-white shadow-glow" : "bg-navy-50/50 text-navy-300"
                        )}>
                            <Rocket size={16} />
                        </div>
                        <span className={cn(
                            "text-[9px] font-black uppercase tracking-[0.2em]",
                            agent.deployed ? "text-wibl-teal" : "text-navy-300"
                        )}>Deployed</span>
                    </div>
                </div>

                {/* Right: Telemetry & Navigation */}
                <div className="p-8 flex items-center justify-between md:justify-end gap-12">
                    <div className="text-right hidden lg:block">
                        <p className="text-3xl font-display font-black text-navy-900 tabular-nums tracking-tighter leading-none">{agent.conversations}</p>
                        <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest mt-1">Interactions</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={`/agents/${agent.id}`}>
                            <Button variant="secondary" size="md" className="border-navy-100 font-black uppercase tracking-widest text-[10px] px-6">
                                View Console
                            </Button>
                        </Link>
                        <Button variant="ghost" size="md" className="p-2 transition-colors">
                            <Settings size={20} className="text-navy-400 hover:text-navy-900" />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
