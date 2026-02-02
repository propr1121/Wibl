"use client";

import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Avatar } from '@/components/ui';
import {
    Activity,
    Settings,
    Zap,
    Shield,
    Terminal,
    ExternalLink,
    Share2,
    RefreshCcw,
    MessageCircle,
    Layout
} from 'lucide-react';
import { useHeaderConfig } from '@/components/layouts/DashboardContext';
import Link from 'next/link';
import { ChannelManager } from '@/components/features/channels/ChannelManager';
import { WebChatTester } from '@/components/features/chat/WebChatTester';
import { MemoryVault } from '@/components/features/agents/MemoryVault';
import { BrainPulse } from '@/components/features/agents/BrainPulse';
import { ShadowMode } from '@/components/features/agents/ShadowMode';
import { cn } from '@/lib/utils';
import { Brain, VenetianMask } from 'lucide-react';

export default function AgentConsolePage({ params }: { params: { id: string } }) {
    const [agent, setAgent] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'channels' | 'tester' | 'memory' | 'shadow'>('channels');
    const [engineStatus, setEngineStatus] = useState<'online' | 'busy' | 'offline' | 'error'>('online');

    useHeaderConfig({
        title: agent?.name || "Agent Console",
        breadcrumbs: [
            { label: 'Workforce', href: '/agents' },
            { label: agent?.name || 'Agent Console' }
        ],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [agentRes, analyticsRes] = await Promise.all([
                    fetch(`/api/agents/${params.id}`),
                    fetch(`/api/analytics?agentId=${params.id}`)
                ]);

                if (agentRes.ok) setAgent(await agentRes.json());
                if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
            } catch (error) {
                console.error('Failed to fetch agent console data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-wibl-teal border-t-transparent rounded-full animate-spin" />
                <p className="text-navy-400 font-display font-black uppercase tracking-widest text-xs">Accessing Console...</p>
            </div>
        );
    }

    if (!agent) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 bg-navy-50 rounded-full flex items-center justify-center text-navy-200">
                    <Shield size={40} />
                </div>
                <h3 className="text-2xl font-display font-black text-navy-900">Agent not found</h3>
                <Link href="/agents">
                    <Button variant="primary">Back to Workforce</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 max-w-[1400px] mx-auto animate-reveal">
            {/* Header: Agent Identity */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-navy-50/50">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <Avatar size="xl" fallback={agent.name[0]} src={agent.avatar_url} className="shadow-2xl ring-4 ring-wibl-teal/10" />
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-wibl-teal border-4 border-white rounded-full shadow-sm" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-display font-black text-navy-900 tracking-tighter">{agent.name}</h1>
                            <Badge variant={agent.deployment?.status === 'active' ? 'teal' : 'error'} size="sm" className="bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                                <div className={cn("w-2 h-2 rounded-full", agent.deployment?.status === 'active' ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                                <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">{agent.deployment?.status === 'active' ? 'Active' : 'Offline'}</span>
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="text-[11px] font-black text-navy-400 uppercase tracking-[0.2em]">Instance ID: {params.id}</p>
                            <div className="w-1.5 h-1.5 rounded-full bg-navy-200" />
                            <p className="text-[11px] font-bold text-navy-500 opacity-70 uppercase tracking-tight">Active since {new Date(agent.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="font-black uppercase tracking-widest text-[9px] px-5 border border-navy-100" leftIcon={<Share2 size={14} />}>Share Access</Button>
                    <Button variant="ghost" size="sm" className="p-3 bg-navy-50 border-transparent"><Settings size={20} className="text-navy-400" /></Button>
                    <Link href="/agents">
                        <Button variant="primary" size="lg" className="shadow-glow h-14 px-8" leftIcon={<Zap size={20} />}>Sync Engine</Button>
                    </Link>
                </div>
            </div>

            {/* Main Tabs Navigation */}
            <div className="flex items-center gap-2 p-1 bg-navy-50/50 rounded-2xl w-fit border border-navy-50">
                <button
                    onClick={() => setActiveTab('channels')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                        activeTab === 'channels' ? "bg-white text-navy-900 shadow-sm" : "text-navy-400 hover:text-navy-600"
                    )}
                >
                    <Layout size={14} />
                    Channels
                </button>
                <button
                    onClick={() => setActiveTab('tester')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                        activeTab === 'tester' ? "bg-white text-navy-900 shadow-sm" : "text-navy-400 hover:text-navy-600"
                    )}
                >
                    <MessageCircle size={14} />
                    Live Tester
                </button>
                <button
                    onClick={() => setActiveTab('memory')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                        activeTab === 'memory' ? "bg-white text-navy-900 shadow-sm" : "text-navy-400 hover:text-navy-600"
                    )}
                >
                    <Brain size={14} />
                    Memory Vault
                </button>
                <button
                    onClick={() => setActiveTab('shadow')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                        activeTab === 'shadow' ? "bg-white text-navy-900 shadow-sm" : "text-navy-400 hover:text-navy-600"
                    )}
                >
                    <VenetianMask size={14} />
                    Shadow Mode
                </button>
            </div>

            {/* Main Grid: Telemetry & Management */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Content Area (8 cols) */}
                <div className="lg:col-span-8 space-y-8">
                    {activeTab === 'channels' ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-wibl-teal/10 flex items-center justify-center text-wibl-teal">
                                        <Activity size={18} />
                                    </div>
                                    <h2 className="text-xl font-display font-black text-navy-900 tracking-tight">Channel Activation</h2>
                                </div>
                                <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest">4 Available Connectors</p>
                            </div>

                            <ChannelManager agentId={params.id} />

                            {/* Agent Logs / Terminal View */}
                            <div className="bg-navy-900 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-wibl-teal/10 blur-[100px] pointer-events-none" />
                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <Terminal size={18} className="text-wibl-teal" />
                                        <h3 className="text-[11px] font-black text-white/90 uppercase tracking-[0.3em]">Execution Logs</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors"><RefreshCcw size={12} className="text-white/40" /></button>
                                        <div className="h-4 w-px bg-white/10 mx-1" />
                                        <BrainPulse status={engineStatus} latency={12} />
                                    </div>
                                </div>

                                <div className="font-mono text-[12px] space-y-1.5 text-white/60 min-h-[160px] relative z-10">
                                    <p><span className="text-wibl-teal/50">[18:52:10]</span> Initializing Clawdbot Engine v1.4.2...</p>
                                    <p><span className="text-wibl-teal/50">[18:52:11]</span> Protocol: Handshake with Supabase Secure Registry - OK</p>
                                    <p><span className="text-wibl-teal/50">[18:52:11]</span> Model: Anthropic Claude-3.5-Sonnet - Ready</p>
                                    <p><span className="text-wibl-teal/50">[18:52:12]</span> Gateway: Listening on port 19482 (loopback)</p>
                                    <p><span className="text-wibl-teal/50">[18:54:05]</span> Web: Incoming channel connection: 127.0.0.1 - Session active</p>
                                    <p className="animate-pulse"><span className="text-wibl-teal/50">[{new Date().toLocaleTimeString()}]</span> Waiting for events...</p>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'tester' ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <WebChatTester
                                gatewayUrl={agent.deployment?.gatewayUrl || `http://localhost:19000`}
                                authToken={btoa(agent.id).substring(0, 16)}
                                agentName={agent.name}
                                agentId={params.id}
                            />
                        </div>
                    ) : activeTab === 'memory' ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <MemoryVault agentId={params.id} />
                        </div>
                    ) : (
                        <ShadowMode />
                    )}
                </div>

                {/* Right: Security & Identity (4 cols) */}
                <div className="lg:col-span-4 space-y-8">
                    <Card variant="glass" className="p-8 border-navy-50/40">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center text-coral">
                                <Shield size={20} />
                            </div>
                            <h3 className="text-lg font-display font-black text-navy-900 tracking-tight">Security Protocol</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between group/audit cursor-pointer">
                                <div className="space-y-0.5">
                                    <p className="text-[11px] font-black text-navy-900 uppercase tracking-tight">PII Redaction</p>
                                    <p className="text-[10px] text-navy-400 font-medium">Automatic data masking active</p>
                                </div>
                                <div className="w-10 h-6 bg-wibl-teal/20 rounded-full relative p-1 cursor-pointer">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-wibl-teal rounded-full shadow-sm" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between group/audit cursor-pointer opacity-60">
                                <div className="space-y-0.5">
                                    <p className="text-[11px] font-black text-navy-900 uppercase tracking-tight">Strict Sandboxing</p>
                                    <p className="text-[10px] text-navy-400 font-medium font-medium">Safe code execution only</p>
                                </div>
                                <div className="w-10 h-6 bg-navy-100 rounded-full relative p-1 cursor-pointer">
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>
                        </div>

                        <Button variant="ghost" size="sm" className="w-full mt-8 font-black uppercase tracking-widest text-[9px] border border-navy-100" rightIcon={<ExternalLink size={12} />}>
                            View Security Audit
                        </Button>
                    </Card>

                    {/* Shadow Mode - Secret Sauce */}
                    <Card variant="glass" className="p-8 border-dashed border-wibl-mint/40 bg-wibl-mint/5 relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-wibl-mint/10 blur-2xl rounded-full group-hover:bg-wibl-mint/20 transition-colors" />
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-wibl-mint/10 flex items-center justify-center text-wibl-mint">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-display font-black text-navy-900 tracking-tight leading-none uppercase">Shadow Mode</h3>
                                <Badge variant="teal" size="sm" className="mt-1 text-[8px] font-black uppercase">Coming Soon</Badge>
                            </div>
                        </div>
                        <p className="text-[12px] text-navy-500 font-medium leading-relaxed mb-6">
                            Split-test your agent with an experimental persona on a private channel before promoting to production.
                        </p>
                    </Card>

                    {/* Stats Widget */}
                    <Card variant="glass" className="p-8 bg-gradient-to-br from-navy-900 to-navy-800 text-white border-none shadow-glow">
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-wibl-teal">
                                <Zap size={20} />
                            </div>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">Performance</p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex-1 space-y-4">
                                <BrainPulse status={agent.status} />
                                <div className="p-4 bg-navy-50/50 rounded-2xl border border-navy-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-wibl-mint animate-pulse" />
                                        <span className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Daemon Thread Active</span>
                                    </div>
                                    <span className="text-[9px] font-black text-wibl-teal uppercase tracking-widest">Self-Healing Enabled</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-4xl font-display font-black tracking-tighter leading-none mb-1">
                                    {analytics?.summary?.successRate ? analytics.summary.successRate.toFixed(1) : '98.2'}
                                    <span className="text-[16px] text-wibl-teal ml-1">%</span>
                                </p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Success Rate</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xl font-display font-black tracking-tighter leading-none mb-1">
                                        {analytics?.summary?.totalCost || '0.00'}
                                        <span className="text-[10px] text-wibl-teal ml-1">$</span>
                                    </p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Logic Cost</p>
                                </div>
                                <div>
                                    <p className="text-xl font-display font-black tracking-tighter leading-none mb-1">
                                        {analytics?.summary?.totalTokens ? (analytics.summary.totalTokens / 1000).toFixed(1) : '0.0'}
                                        <span className="text-[12px] opacity-60 ml-0.5">k</span>
                                    </p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Tokens</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
