"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input, Avatar, Badge } from '@/components/ui';
import {
    VenetianMask,
    Zap,
    ArrowRight,
    MessageSquare,
    Settings,
    RotateCcw,
    CheckCircle2,
    Search,
    User,
    Bot,
    Loader2,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShadowMessage {
    id: string;
    role: 'user' | 'assistant';
    content: {
        alpha: string;
        beta: string;
    };
    timestamp: Date;
    status: 'stable' | 'streaming' | 'final';
}

export function ShadowMode() {
    const [messages, setMessages] = useState<ShadowMessage[]>([]);
    const [input, setInput] = useState('');
    const [alphaPrompt, setAlphaPrompt] = useState('You are a helpful customer support assistant.');
    const [betaPrompt, setBetaPrompt] = useState('You are a helpful assistant, but speak in a very professional, concise, and executive tone.');
    const [isProcessing, setIsProcessing] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isProcessing) return;

        const userMsg: ShadowMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: { alpha: input, beta: input },
            timestamp: new Date(),
            status: 'final'
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsProcessing(true);

        // Simulate Split Response
        setTimeout(() => {
            const assistantMsg: ShadowMessage = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: {
                    alpha: "I can certainly help you with that! What specific details are you looking for regarding the Mayfair listing?",
                    beta: "Acknowledged. I have retrieved the Mayfair dossier. Please specify the parameters you wish to review."
                },
                timestamp: new Date(),
                status: 'final'
            };
            setMessages(prev => [...prev, assistantMsg]);
            setIsProcessing(false);
        }, 1500);
    };

    const promoteToProduction = () => {
        setAlphaPrompt(betaPrompt);
        // In a real app, this would call /api/agents/:id/config
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Split Chat Area */}
            <div className="lg:col-span-8 flex flex-col h-[700px] bg-white/50 rounded-[3rem] border border-navy-50 overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="p-6 border-b border-navy-50/50 bg-white/50 backdrop-blur-md flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-wibl-teal/10 flex items-center justify-center text-wibl-teal">
                            <VenetianMask size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-display font-black text-navy-900 tracking-tight leading-none uppercase">Shadow Mode</h2>
                            <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest mt-1">Split-Testing Engine</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-navy-50 rounded-full border border-navy-100 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase text-navy-400 tracking-widest">Protocol Active</span>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-8 space-y-12 bg-gradient-to-b from-transparent to-navy-50/20"
                >
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                            <Sparkles size={48} className="text-navy-200 mb-4" />
                            <p className="font-display font-black text-navy-900 uppercase tracking-[0.2em] text-sm">Awaiting Comparison</p>
                            <p className="text-xs text-navy-500 mt-2 max-w-[280px]">Messages sent here will be processed by both Stable (Alpha) and Candidate (Beta) models.</p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div key={msg.id} className="space-y-4">
                            {msg.role === 'user' ? (
                                <div className="flex justify-center">
                                    <div className="bg-navy-900 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg">
                                        {msg.content.alpha}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Alpha Response */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 px-2">
                                            <Badge variant="info" size="sm" className="text-[7px] py-0 h-4">Alpha (Stable)</Badge>
                                        </div>
                                        <div className="p-5 bg-white border border-navy-100 rounded-[1.5rem] rounded-tl-none text-[13px] leading-relaxed text-navy-800 shadow-sm border-l-4 border-l-navy-200">
                                            {msg.content.alpha}
                                        </div>
                                    </div>
                                    {/* Beta Response */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 px-2 justify-end">
                                            <Badge variant="teal" size="sm" className="text-[7px] py-0 h-4">Beta (Candidate)</Badge>
                                        </div>
                                        <div className="p-5 bg-navy-900 text-white rounded-[1.5rem] rounded-tr-none text-[13px] leading-relaxed shadow-glow border-r-4 border-r-wibl-teal">
                                            {msg.content.beta}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {isProcessing && (
                        <div className="grid grid-cols-2 gap-4 animate-pulse">
                            <div className="h-20 bg-white rounded-2xl border border-navy-100" />
                            <div className="h-20 bg-navy-900/5 rounded-2xl border border-navy-100" />
                        </div>
                    )}
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-navy-50">
                    <div className="relative">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message to compare responses..."
                            className="pr-14 h-14 bg-navy-50 border-none rounded-2xl text-sm"
                            disabled={isProcessing}
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            className="absolute right-2 top-2 h-10 w-10 p-0 rounded-xl"
                            disabled={!input.trim() || isProcessing}
                        >
                            <RotateCcw size={18} className={cn(isProcessing && "animate-spin")} />
                        </Button>
                    </div>
                </form>
            </div>

            {/* Config Sidebar */}
            <div className="lg:col-span-4 space-y-6">
                <Card variant="glass" className="p-8 border-navy-100 bg-white/80">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-white">
                            <Settings size={20} />
                        </div>
                        <h3 className="text-lg font-display font-black text-navy-900 tracking-tight">Experiment Config</h3>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <p className="text-[10px] font-black uppercase text-navy-400 tracking-widest mb-3">Beta System Prompt</p>
                            <textarea
                                value={betaPrompt}
                                onChange={(e) => setBetaPrompt(e.target.value)}
                                className="w-full min-h-[160px] p-4 bg-navy-50/50 rounded-2xl border border-navy-100 text-[12px] font-medium leading-relaxed focus:border-wibl-teal/50 transition-all outline-none"
                            />
                        </div>

                        <div className="p-5 bg-wibl-teal/5 rounded-2xl border border-wibl-teal/10 space-y-3">
                            <div className="flex items-center gap-2">
                                <Zap size={14} className="text-wibl-teal" />
                                <span className="text-[10px] font-black uppercase text-navy-900 tracking-widest">Shadow Advantage</span>
                            </div>
                            <p className="text-[11px] text-navy-500 leading-relaxed">
                                Promoting the Beta model will update the <span className="text-navy-900 font-bold">production gateway settings</span> instantly. All channels will adopt the new persona.
                            </p>
                        </div>

                        <Button
                            variant="primary"
                            size="lg"
                            className="w-full h-14 shadow-glow"
                            leftIcon={<CheckCircle2 size={20} />}
                            onClick={promoteToProduction}
                        >
                            Promote to Live
                        </Button>
                    </div>
                </Card>

                <Card variant="glass" className="p-8 border-dashed border-navy-200 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                        <MessageSquare size={18} className="text-navy-400" />
                        <h3 className="text-[11px] font-black uppercase text-navy-900 tracking-widest">Model Selection</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-navy-50">
                            <span className="text-[10px] font-bold text-navy-600">Beta Provider</span>
                            <Badge variant="info" size="sm" className="text-[7px]">Claude 3.5</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-navy-50">
                            <span className="text-[10px] font-bold text-navy-600">Alpha Provider</span>
                            <Badge variant="teal" size="sm" className="text-[7px]">GPT-4o</Badge>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
