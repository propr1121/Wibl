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
    Brain,
    MessageCircle,
    ChevronRight,
    Sparkles
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
        title: 'Agents',
        breadcrumbs: [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Agents', href: '/agents' }],
    });

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="animate-fade-in">
                    <h1 className="text-4xl font-display font-black text-navy-700 mb-2">
                        Your Agents
                    </h1>
                    <p className="text-navy-500 font-medium text-lg">
                        Build, train, and manage your AI workforce
                    </p>
                </div>
                <Link href="/agents/new">
                    <Button
                        variant="primary"
                        size="lg"
                        leftIcon={<Plus size={20} />}
                        className="shadow-wibl"
                    >
                        Create New Agent
                    </Button>
                </Link>
            </div>

            {/* List View */}
            <div className="space-y-4 animate-fade-in">
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

            {/* Help/Guide section for No-Code Users */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
                <div className="glass-premium p-6 rounded-3xl border border-navy-50">
                    <div className="w-12 h-12 rounded-2xl bg-wibl-teal/10 flex items-center justify-center mb-4 text-wibl-teal">
                        <Sparkles size={24} />
                    </div>
                    <h3 className="text-xl font-display font-black text-navy-700 mb-2">1. Describe</h3>
                    <p className="text-sm text-navy-500 font-medium">Talk to Wibl in plain English to define what your agent should do and how it should behave.</p>
                </div>
                <div className="glass-premium p-6 rounded-3xl border border-navy-50">
                    <div className="w-12 h-12 rounded-2xl bg-wibl-mint/10 flex items-center justify-center mb-4 text-wibl-mint">
                        <Brain size={24} />
                    </div>
                    <h3 className="text-xl font-display font-black text-navy-700 mb-2">2. Train</h3>
                    <p className="text-sm text-navy-500 font-medium">Upload docs or links to your Library. Your agent will master this information in seconds.</p>
                </div>
                <div className="glass-premium p-6 rounded-3xl border border-navy-50">
                    <div className="w-12 h-12 rounded-2xl bg-wibl-sky/10 flex items-center justify-center mb-4 text-wibl-sky">
                        <Rocket size={24} />
                    </div>
                    <h3 className="text-xl font-display font-black text-navy-700 mb-2">3. Deploy</h3>
                    <p className="text-sm text-navy-500 font-medium">Connect to WhatsApp, Slack, or your website with one click. Your AI is now live.</p>
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
            className="group overflow-hidden border-navy-50"
        >
            <div className="flex flex-col md:flex-row md:items-center">
                {/* Left: Info */}
                <div className="p-6 flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center shrink-0 text-white font-display font-black text-2xl shadow-lg group-hover:scale-105 transition-transform">
                        {agent.initial}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-display font-black text-navy-800 truncate">
                                {agent.name}
                            </h3>
                            <Badge variant={agent.status === 'active' ? 'teal' : 'warning'} size="sm">
                                {agent.status === 'active' ? 'Active' : 'Paused'}
                            </Badge>
                        </div>
                        <p className="text-xs font-black text-navy-400 uppercase tracking-widest">{agent.type}</p>
                    </div>
                </div>

                {/* Center: Steps Progress */}
                <div className="px-6 py-4 md:py-0 flex items-center gap-8 border-y md:border-y-0 md:border-x border-navy-50">
                    <div className="flex flex-col items-center">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-colors",
                            "bg-wibl-teal text-white"
                        )}>
                            <Sparkles size={14} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-navy-400">Describe</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-colors",
                            agent.trained ? "bg-wibl-teal text-white" : "bg-navy-50 text-navy-400"
                        )}>
                            <Brain size={14} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-navy-400">Train</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-colors",
                            agent.deployed ? "bg-wibl-teal text-white" : "bg-navy-50 text-navy-400"
                        )}>
                            <Rocket size={14} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-navy-400">Deploy</span>
                    </div>
                </div>

                {/* Right: Stats & Actions */}
                <div className="p-6 flex items-center justify-between gap-8">
                    <div className="text-center hidden lg:block">
                        <p className="text-2xl font-display font-black text-navy-700">{agent.conversations}</p>
                        <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Chats</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={`/agents/${agent.id}`}>
                            <Button variant="ghost" size="md" leftIcon={<Eye size={16} />}>
                                View
                            </Button>
                        </Link>
                        <Button variant="ghost" size="md">
                            <Settings size={18} className="text-navy-400" />
                        </Button>
                        <Button variant="primary" size="md">
                            <ChevronRight size={18} />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
