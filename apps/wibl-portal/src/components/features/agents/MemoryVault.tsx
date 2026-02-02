"use client";

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge } from '@/components/ui';
import {
    Brain,
    Search,
    Pin,
    Trash2,
    Filter,
    Sparkles,
    Calendar,
    User,
    Building2,
    Clock,
    ChevronRight,
    Lock,
    Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Memory {
    id: string;
    content: string;
    category: 'preference' | 'logic' | 'entity' | 'transient';
    importance: number; // 0-1
    isPinned: boolean;
    createdAt: Date;
    source: string;
}

const MOCK_MEMORIES: Memory[] = [
    {
        id: '1',
        content: 'Customer preferences: Client prefers late-night viewings after 8 PM due to work schedule.',
        category: 'preference',
        importance: 0.9,
        isPinned: true,
        createdAt: new Date(Date.now() - 3600000 * 2),
        source: 'WhatsApp Chat'
    },
    {
        id: '2',
        content: 'Listing update: 45 Park Lane now has a fixed non-negotiable price of £1.2M.',
        category: 'logic',
        importance: 0.85,
        isPinned: false,
        createdAt: new Date(Date.now() - 3600000 * 5),
        source: 'Internal System'
    },
    {
        id: '3',
        content: 'Entity: Dr. Julian Vane is a high-net-worth investor focusing on Mayfair properties.',
        category: 'entity',
        importance: 0.95,
        isPinned: true,
        createdAt: new Date(Date.now() - 86400000),
        source: 'Telegram'
    },
    {
        id: '4',
        content: 'Temporary: Follow-up with Mrs. Higgins tomorrow about the contract signature.',
        category: 'transient',
        importance: 0.6,
        isPinned: false,
        createdAt: new Date(Date.now() - 3600000),
        source: 'Web Chat'
    }
];

export function MemoryVault({ agentId }: { agentId: string }) {
    const [memories, setMemories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('all');

    useEffect(() => {
        const fetchKnowledge = async () => {
            try {
                const response = await fetch(`/api/knowledge?agentId=${agentId}`);
                if (response.ok) {
                    const data = await response.json();
                    setMemories(data);
                }
            } catch (error) {
                console.error('Failed to fetch knowledge for memory vault:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchKnowledge();
    }, [agentId]);

    const categories = [
        { id: 'all', label: 'All Knowledge', icon: <Brain size={14} /> },
        { id: 'preference', label: 'Preferences', icon: <User size={14} /> },
        { id: 'logic', label: 'Business Logic', icon: <Building2 size={14} /> },
        { id: 'entity', label: 'Entities', icon: <Lock size={14} /> },
        { id: 'transient', label: 'Tasks', icon: <Clock size={14} /> },
    ];

    const filtered = memories.filter(m => {
        const matchesSearch = m.content.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === 'all' || m.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const togglePin = (id: string) => {
        setMemories(prev => prev.map(m => m.id === id ? { ...m, isPinned: !m.isPinned } : m));
    };

    const deleteMemory = (id: string) => {
        setMemories(prev => prev.filter(m => m.id !== id));
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Memory Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 p-6 rounded-[2rem] border border-navy-50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-wibl-teal/10 flex items-center justify-center text-wibl-teal shadow-inner">
                        <Brain size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-display font-black text-navy-900 tracking-tight leading-none">Memory Vault</h2>
                        <p className="text-[11px] font-black text-navy-400 uppercase tracking-widest mt-1">Learned Intelligence Archive</p>
                    </div>
                </div>

                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-300" size={18} />
                    <Input
                        placeholder="Search learned facts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 bg-white border-navy-50 rounded-2xl h-12 text-sm focus:ring-wibl-teal/20"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Categories */}
                <div className="lg:col-span-3 space-y-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={cn(
                                "w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 group",
                                activeCategory === cat.id
                                    ? "bg-navy-900 text-white shadow-glow"
                                    : "bg-white/50 text-navy-400 hover:bg-white hover:text-navy-600 border border-transparent hover:border-navy-50"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                {cat.icon}
                                {cat.label}
                            </div>
                            <ChevronRight size={14} className={cn(
                                "transition-transform duration-300",
                                activeCategory === cat.id ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:opacity-40 group-hover:translate-x-0"
                            )} />
                        </button>
                    ))}

                    <div className="mt-8 p-6 bg-gradient-to-br from-wibl-teal/5 to-transparent rounded-[2rem] border border-wibl-teal/10">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={14} className="text-wibl-teal" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-navy-900">Vault Health</span>
                        </div>
                        <p className="text-[11px] text-navy-500 leading-relaxed font-medium">
                            Your agent has consolidated <span className="text-navy-900 font-bold">124 facts</span> this week. <span className="text-wibl-teal">85% accuracy</span> based on human confirmations.
                        </p>
                        <div className="mt-4 h-1.5 bg-navy-100 rounded-full overflow-hidden">
                            <div className="h-full bg-wibl-teal w-[85%] rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Right: Memory List */}
                <div className="lg:col-span-9 space-y-4">
                    {filtered.length === 0 ? (
                        <div className="h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white/50 rounded-[3rem] border border-dashed border-navy-100">
                            <div className="w-16 h-16 rounded-full bg-navy-50 flex items-center justify-center text-navy-200 mb-4">
                                <Search size={32} />
                            </div>
                            <p className="font-display font-black text-navy-900 uppercase tracking-widest text-sm">No knowledge found</p>
                            <p className="text-xs text-navy-400 mt-2">Adjust your filters or search terms.</p>
                        </div>
                    ) : (
                        filtered.map((memory) => (
                            <Card
                                key={memory.id}
                                variant="glass"
                                className={cn(
                                    "p-6 group hover:translate-x-1 transition-all duration-500",
                                    memory.isPinned ? "border-l-4 border-l-wibl-teal" : "border-navy-50/50"
                                )}
                            >
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Badge variant={
                                                memory.category === 'preference' ? 'teal' :
                                                    memory.category === 'logic' ? 'info' :
                                                        'coral'
                                            } size="sm" className="font-black text-[8px]">
                                                {memory.category}
                                            </Badge>
                                            <div className="flex items-center gap-1.5 text-navy-300 text-[10px] font-bold uppercase tracking-widest">
                                                <Calendar size={12} />
                                                {new Date(memory.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-navy-300 text-[10px] font-bold uppercase tracking-widest">
                                                <Eye size={12} />
                                                Confidence: {Math.round((memory.relevance || 0.9) * 100)}%
                                            </div>
                                        </div>

                                        <p className="text-[14px] text-navy-800 font-medium leading-relaxed">
                                            {memory.content}
                                        </p>

                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-navy-400">
                                            <span>Format: {memory.type}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => togglePin(memory.id)}
                                            className={cn(
                                                "p-2.5 rounded-xl",
                                                memory.isPinned ? "bg-wibl-teal/10 text-wibl-teal" : "bg-navy-50 text-navy-400"
                                            )}
                                        >
                                            <Pin size={16} fill={memory.isPinned ? "currentColor" : "none"} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteMemory(memory.id)}
                                            className="p-2.5 bg-coral/5 text-coral hover:bg-coral/10 rounded-xl"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
