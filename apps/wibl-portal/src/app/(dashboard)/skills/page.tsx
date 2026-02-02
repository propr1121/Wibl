"use client";

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Grid2X2,
    List,
    ExternalLink,
    ShieldCheck,
    Zap,
    MessageSquare,
    Calendar,
    Database,
    Settings2,
    CheckCircle2,
    Loader2,
    AlertCircle,
    ShoppingBag,
    Puzzle
} from 'lucide-react';
import { Button, Card, Badge, Input, Modal, Avatar } from '@/components/ui';
import { useHeaderConfig } from '@/components/layouts/DashboardContext';
import { cn } from '@/lib/utils';

export default function SkillsPage() {
    const [skills, setSkills] = useState<any[]>([]);
    const [connections, setConnections] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isConnecting, setIsConnecting] = useState<string | null>(null);

    useHeaderConfig({
        title: "Skill Marketplace",
        breadcrumbs: [{ label: 'Workforce', href: '/agents' }, { label: 'Skills', href: '/skills' }],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [skillsRes, connRes] = await Promise.all([
                    fetch('/api/skills'),
                    fetch('/api/skills/connections')
                ]);

                if (skillsRes.ok) setSkills(await skillsRes.json());
                if (connRes.ok) setConnections(await connRes.json());
            } catch (error) {
                console.error('Failed to fetch skills:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleConnect = async (toolId: string) => {
        setIsConnecting(toolId);
        try {
            const response = await fetch('/api/skills/connections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ toolId }),
            });

            if (response.ok) {
                const newConn = await response.json();
                setConnections(prev => [...prev.filter(c => c.tool_id !== toolId), newConn]);
            }
        } catch (error) {
            console.error('Failed to connect skill:', error);
        } finally {
            setIsConnecting(null);
        }
    };

    const categories = [
        { id: 'all', label: 'All Skills', icon: <ShoppingBag size={14} /> },
        { id: 'communication', label: 'messaging', icon: <MessageSquare size={14} /> },
        { id: 'productivity', label: 'productivity', icon: <Calendar size={14} /> },
        { id: 'data', label: 'CRM & Data', icon: <Database size={14} /> },
        { id: 'automation', label: 'payment', icon: <Zap size={14} /> },
    ];

    const filteredSkills = skills.filter(skill => {
        const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase()) ||
            skill.description?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || skill.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-wibl-teal animate-spin" />
                <p className="text-navy-400 font-display font-black uppercase tracking-widest text-xs">Loading Marketplace...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20 max-w-[1400px] mx-auto animate-reveal relative">
            <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-wibl-teal/5 rounded-full blur-[140px] pointer-events-none" />

            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-4">
                    <h1 className="text-4xl lg:text-5xl font-display font-black text-navy-900 tracking-tighter leading-tight max-w-2xl">
                        Power up with <span className="text-wibl-teal">Enterprise Skills.</span>
                    </h1>
                    <p className="text-navy-500 font-medium text-lg max-w-xl">
                        Connect your agents to the tools they need to perform real actions. Messaging, scheduling, and database access.
                    </p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="sticky top-4 z-30 flex flex-col md:flex-row items-center gap-4 p-2 bg-white/70 backdrop-blur-xl border border-navy-50 rounded-[2rem] shadow-lg">
                <div className="p-1 bg-navy-50 rounded-2xl flex gap-1 w-full md:w-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategoryFilter(cat.id)}
                            className={cn(
                                "flex-1 md:flex-none flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                categoryFilter === cat.id
                                    ? "bg-white text-navy-900 shadow-sm"
                                    : "text-navy-400 hover:text-navy-600"
                            )}
                        >
                            {cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="relative flex-1 w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-navy-300" size={18} />
                    <Input
                        placeholder="Search for a skill (e.g. WhatsApp, HubSpot...)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-14 h-14 bg-white border-transparent focus:bg-white rounded-2xl text-sm transition-all"
                    />
                </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSkills.map((skill) => {
                    const connection = connections.find(c => c.tool_id === skill.id);
                    const isConnectingThis = isConnecting === skill.id;

                    return (
                        <Card
                            key={skill.id}
                            variant="elevated"
                            padding="none"
                            className="group overflow-hidden border-navy-50/50 hover:border-wibl-teal/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                        >
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="w-16 h-16 rounded-[2rem] bg-navy-50 flex items-center justify-center text-navy-400 transition-transform group-hover:scale-110 duration-500 overflow-hidden">
                                        {skill.icon_url ? (
                                            <img src={skill.icon_url} alt={skill.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Puzzle size={28} />
                                        )}
                                    </div>
                                    <Badge variant={skill.risk_level === 'high' ? 'error' : skill.risk_level === 'medium' ? 'warning' : 'teal'} className="font-black uppercase tracking-widest text-[8px]">
                                        {skill.risk_level} Risk
                                    </Badge>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-display font-black text-navy-900 tracking-tight">{skill.name}</h3>
                                    <p className="text-xs text-navy-500 font-medium leading-relaxed line-clamp-2">
                                        {skill.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <Badge variant="info" size="sm" className="bg-navy-50 text-navy-500 border-none text-[8px] font-black uppercase tracking-widest">
                                        {skill.provider}
                                    </Badge>
                                    <Badge variant="info" size="sm" className="bg-navy-50 text-navy-500 border-none text-[8px] font-black uppercase tracking-widest">
                                        {skill.auth_type}
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-6 bg-navy-50/50 border-t border-navy-50 flex items-center justify-between">
                                {connection ? (
                                    <div className="flex items-center gap-2 text-wibl-mint">
                                        <CheckCircle2 size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Connected</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 opacity-40">
                                        <ShieldCheck size={14} className="text-navy-400" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-navy-400">Secure Protocol</span>
                                    </div>
                                )}

                                {connection ? (
                                    <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest hover:bg-navy-100 px-4">
                                        Manage
                                    </Button>
                                ) : (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="shadow-glow px-6"
                                        onClick={() => handleConnect(skill.id)}
                                        isLoading={isConnectingThis}
                                    >
                                        Connect
                                    </Button>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredSkills.length === 0 && (
                <div className="py-32 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 rounded-full bg-navy-50 flex items-center justify-center text-navy-200 mb-8">
                        <ShoppingBag size={48} />
                    </div>
                    <h3 className="text-2xl font-display font-black text-navy-900 mb-2">No skills found</h3>
                    <p className="text-navy-500 font-medium mb-10 max-w-sm">We couldn't find any skills matching your current search or filters.</p>
                    <Button variant="primary" size="lg" onClick={() => { setSearch(''); setCategoryFilter('all'); }}>
                        Clear all filters
                    </Button>
                </div>
            )}
        </div>
    );
}
