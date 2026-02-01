"use client";

import React from 'react';
import Link from 'next/link';
import {
    MessageCircle,
    Layers,
    Zap,
    Globe,
    BarChart3,
    ShieldCheck,
    ArrowRight,
    CheckCircle2,
    Cpu,
    Database,
    Share2,
    Lock
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

// --- Feature Sections Data ---

const FEATURE_DETAILS = [
    {
        id: 'builder',
        title: 'Conversational Builder',
        badge: 'ZERO CODE',
        icon: <MessageCircle size={32} className="text-wibl-teal" />,
        desc: 'The world\'s first "describe-to-build" agent creator. No complex flowcharts or node-based drag-and-drops.',
        points: [
            'Describe intent in natural language',
            'Real-time feedback as you build',
            'Advanced personality & tone modeling',
            'Automated fallback strategies'
        ],
        imageAlt: 'Conversational builder UI mockup'
    },
    {
        id: 'knowledge',
        title: 'Precision Knowledge Base',
        badge: 'RAG POWERED',
        icon: <Database size={32} className="text-wibl-coral" />,
        desc: 'Give your agents a permanent memory. Wibl processes documents and live websites into high-performance vector embeddings.',
        points: [
            'PDF, Docx, and URL scanning',
            'Automatic chunking & optimization',
            'Source attribution in every answer',
            'Real-time knowledge synchronization'
        ],
        imageAlt: 'Knowledge uploader and management'
    },
    {
        id: 'integrations',
        title: 'Dynamic Tool Integrations',
        badge: 'CONNECTIVITY',
        icon: <Zap size={32} className="text-wibl-sky" />,
        desc: 'Your agents are built for action. Connect to your existing tech stack via secure webhooks or native integrations.',
        points: [
            'Native CRM syncing (Hubspot, Salesforce)',
            'Secure API key management',
            'Conditional logic based on data',
            'Auto-generated API documentation'
        ],
        imageAlt: 'Tool connection dashboard'
    },
    {
        id: 'deployment',
        title: 'Multi-Channel Deployment',
        badge: 'OMNICHANNEL',
        icon: <Share2 size={32} className="text-wibl-mint" />,
        desc: 'Launch everywhere with one click. Wibl automatically formats your agent for optimal performance on every platform.',
        points: [
            'Customizable Web Chat Widget',
            'Official WhatsApp Business API',
            'Slack, Telegram, and Discord',
            'Custom REST API for developers'
        ],
        imageAlt: 'Deployment channel selector'
    },
    {
        id: 'analytics',
        title: 'Deep-Dive Analytics',
        badge: 'INSIGHTS',
        icon: <BarChart3 size={32} className="text-wibl-teal" />,
        desc: 'Monitor agent performance in real-time. Turn every conversation into actionable data for your business.',
        points: [
            'Sentiment analysis profiling',
            'Conversion & resolution tracking',
            'User satisfaction (CSAT) scores',
            'Conversation transcripts & audit logs'
        ],
        imageAlt: 'Analytics dashboard view'
    },
    {
        id: 'security',
        title: 'Enterprise-Grade Security',
        badge: 'TRUST',
        icon: <Lock size={32} className="text-navy-900" />,
        desc: 'Built on a foundation of trust. We implement security at every layer of the LLM interaction loop.',
        points: [
            'Built-in Prompt Injection Protection',
            'Automatic PII Redaction',
            'End-to-end data encryption',
            'GDPR & SOC 2 compliant architecture'
        ],
        imageAlt: 'Security settings and logs'
    }
];

// --- Page Component ---

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-canvas-light text-navy-800">
            {/* Hero */}
            <section className="pt-32 pb-24 text-center space-y-8 bg-canvas-subtle border-b border-navy-50">
                <div className="max-w-4xl mx-auto px-6">
                    <Badge variant="teal" size="md">THE PLATFORM</Badge>
                    <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-tight">
                        Everything you need to <br />
                        <span className="text-gradient">build AI agents.</span>
                    </h1>
                    <p className="text-xl text-navy-500 font-medium max-w-2xl mx-auto">
                        Wibl is a complete ecosystem for designing, training, and deploying enterprise-grade intelligent assistants.
                    </p>
                </div>
            </section>

            {/* Feature Deep Dive */}
            <div className="py-24 space-y-48">
                {FEATURE_DETAILS.map((feature, idx) => (
                    <section key={feature.id} className="max-w-7xl mx-auto px-6">
                        <div className={cn(
                            "flex flex-col gap-12 lg:gap-24 items-center",
                            idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                        )}>
                            {/* Text Side */}
                            <div className="lg:w-1/2 space-y-8">
                                <div className="space-y-4">
                                    <Badge variant="info" size="sm">{feature.badge}</Badge>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-white shadow-soft border border-navy-50 flex items-center justify-center">
                                            {feature.icon}
                                        </div>
                                        <h2 className="text-3xl lg:text-5xl font-display font-black tracking-tighter leading-tight">
                                            {feature.title}
                                        </h2>
                                    </div>
                                    <p className="text-xl text-navy-500 font-medium leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>

                                <ul className="grid sm:grid-cols-2 gap-4">
                                    {feature.points.map((point, i) => (
                                        <li key={i} className="flex items-center gap-3 text-navy-600 font-medium">
                                            <CheckCircle2 size={18} className="text-wibl-teal shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-4">
                                    <Button variant="primary" size="lg" className="h-14 font-bold" rightIcon={<ArrowRight size={18} />}>
                                        Learn More
                                    </Button>
                                </div>
                            </div>

                            {/* Visual Side */}
                            <div className="lg:w-1/2 w-full">
                                <Card variant="elevated" className="overflow-hidden p-0 aspect-[4/3] bg-navy-50 border-navy-100 flex items-center justify-center relative group">
                                    {/* Abstract UI representation */}
                                    <div className="absolute inset-12 bg-white rounded-3xl shadow-2xl border border-navy-50 flex flex-col p-8 space-y-4 group-hover:scale-105 transition-transform duration-500">
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-coral-light" />
                                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                                <div className="w-3 h-3 rounded-full bg-wibl-teal" />
                                            </div>
                                            <div className="w-32 h-6 bg-navy-50 rounded-full" />
                                        </div>
                                        <div className="flex-1 space-y-4 pt-4">
                                            <div className="h-8 bg-navy-50 rounded-xl w-3/4" />
                                            <div className="h-4 bg-navy-50 rounded-xl w-full opacity-50" />
                                            <div className="h-4 bg-navy-50 rounded-xl w-5/6 opacity-50" />
                                            <div className="h-[200px] bg-canvas-subtle rounded-2xl border-2 border-dashed border-navy-100 flex items-center justify-center text-navy-300 font-display font-black text-xs uppercase tracking-widest">
                                                {feature.title} Preview
                                            </div>
                                        </div>
                                    </div>
                                    {/* Animated flare */}
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-wibl-teal/5 to-transparent pointer-events-none" />
                                </Card>
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            {/* Bottom CTA */}
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-brand p-12 lg:p-24 text-center text-white space-y-8 relative overflow-hidden shadow-glow">
                    <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-white opacity-10 blur-[100px]" />
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter leading-tight">
                            Ready to experience <br />
                            Simply Connected?
                        </h2>
                        <p className="text-xl text-white/80 font-medium max-w-2xl mx-auto">
                            Build your first agent in under 2 minutes. No credit card, no setup fee, no complexity.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                            <Button variant="secondary" size="lg" className="h-16 px-12 text-lg text-navy-900 bg-white hover:bg-navy-50">
                                Start Building Now
                            </Button>
                            <Button variant="ghost" size="lg" className="h-16 px-12 text-lg border-white/20 text-white hover:bg-white/10">
                                View Pricing
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
