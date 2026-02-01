"use client";

import React from 'react';
import {
    ShieldCheck,
    Lock,
    EyeOff,
    FileText,
    AlertTriangle,
    Server,
    Zap,
    Globe,
    CheckCircle2,
    Mail,
    Scale
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

// --- Security Pillars ---

const PILLARS = [
    {
        title: 'Data Encryption',
        desc: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256. We use industry-standard security protocols to ensure your data remains private.',
        icon: <Lock className="text-wibl-teal" />
    },
    {
        title: 'PII Redaction',
        desc: 'Our AI engine automatically identifies and redacts Personally Identifiable Information (PII) before it ever reaches our permanent storage or model training loops.',
        icon: <EyeOff className="text-wibl-coral" />
    },
    {
        title: 'Injection Protection',
        desc: 'Advanced heuristic analysis detects and blocks prompt injection attempts, system prompt extraction, and jailbreak maneuvers in real-time.',
        icon: <AlertTriangle className="text-wibl-sky" />
    },
    {
        title: 'GDPR Compliant',
        desc: 'Wibl is built with European privacy standards at its core. We offer data residency options and full compliance with GDPR and CCPA regulations.',
        icon: <FileText className="text-wibl-mint" />
    }
];

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-canvas-light">
            {/* Hero */}
            <section className="pt-32 pb-24 bg-navy-900 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-full h-full gradient-brand opacity-5 blur-[120px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-8">
                    <Badge variant="teal" size="md">SECURITY & TRUST</Badge>
                    <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter leading-tight">
                        Enterprise-grade <br />
                        <span className="text-wibl-teal">security by default.</span>
                    </h1>
                    <p className="text-xl text-navy-400 font-medium max-w-2xl mx-auto">
                        Trust is built on transparency. We implement security at every layer of our stack to protect your business and your users.
                    </p>
                    <div className="flex justify-center gap-12 py-8 opacity-50 grayscale contrast-200">
                        <div className="flex items-center gap-2 text-white"><ShieldCheck size={24} /> SOC2 Type II (Roadmap)</div>
                        <div className="flex items-center gap-2 text-white"><ShieldCheck size={24} /> GDPR COmpliant</div>
                        <div className="flex items-center gap-2 text-white"><ShieldCheck size={24} /> ISO 27001 Ready</div>
                    </div>
                </div>
            </section>

            {/* Pillars Grid */}
            <section className="py-32 max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {PILLARS.map((pillar, i) => (
                        <Card key={i} variant="elevated" className="p-8 h-full space-y-6 border-navy-50 hover:border-wibl-teal transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-canvas-subtle flex items-center justify-center group-hover:scale-110 transition-transform">
                                {pillar.icon}
                            </div>
                            <h3 className="text-xl font-display font-black text-navy-800">{pillar.title}</h3>
                            <p className="text-sm text-navy-500 font-medium leading-relaxed">{pillar.desc}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Architecture Section */}
            <section className="py-24 bg-canvas-subtle">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <h2 className="text-3xl lg:text-5xl font-display font-black text-navy-800 tracking-tighter">
                            Our Security Architecture
                        </h2>
                        <p className="text-lg text-navy-500 font-medium leading-relaxed">
                            We don't just connect an LLM to your data. We build a secure sandbox around every interaction, ensuring your internal prompts and sensitive user data are never leaked.
                        </p>
                        <ul className="space-y-4">
                            {[
                                'Isolated compute containers for every agent',
                                'Real-time output validation filters',
                                'Multi-factor authentication for dashboard access',
                                'Continuous security monitoring & anomaly detection'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-navy-700 font-bold">
                                    <CheckCircle2 size={20} className="text-wibl-teal" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-12 shadow-wibl border border-navy-50 relative">
                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="w-10 h-10 rounded-full bg-navy-800 text-white flex items-center justify-center text-xs font-black">1</div>
                                <div className="flex-1 h-px bg-navy-50" />
                                <div className="text-sm font-black text-navy-400">INPUT GATEWAY</div>
                            </div>
                            <div className="p-4 bg-navy-50 rounded-xl border-l-4 border-wibl-teal text-xs font-medium text-navy-600">
                                Incoming message scanned for injection patterns...
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="w-10 h-10 rounded-full bg-navy-800 text-white flex items-center justify-center text-xs font-black">2</div>
                                <div className="flex-1 h-px bg-navy-50" />
                                <div className="text-sm font-black text-navy-400">REDACTION LAYER</div>
                            </div>
                            <div className="p-4 bg-navy-50 rounded-xl border-l-4 border-wibl-coral text-xs font-medium text-navy-600">
                                PII identified and replaced with secure tokens...
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="w-10 h-10 rounded-full bg-navy-800 text-white flex items-center justify-center text-xs font-black">3</div>
                                <div className="flex-1 h-px bg-navy-50" />
                                <div className="text-sm font-black text-navy-400">OUTPUT VALIDATION</div>
                            </div>
                            <div className="p-4 bg-navy-50 rounded-xl border-l-4 border-wibl-sky text-xs font-medium text-navy-600">
                                Response verified against leaking system prompt...
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Compliance & Contact */}
            <section className="py-32 px-6">
                <div className="max-w-4xl mx-auto rounded-[3rem] border-4 border-navy-900 p-12 md:p-24 text-center space-y-12">
                    <div className="flex justify-center gap-8 flex-wrap">
                        <div className="flex flex-col items-center gap-3">
                            <Server size={32} className="text-navy-900" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-navy-400">Cloud Isolation</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <Scale size={32} className="text-navy-900" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-navy-400">Legal Compliance</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <Mail size={32} className="text-navy-900" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-navy-400">Continuous Audit</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-3xl font-display font-black text-navy-800">Have specific security requirements?</h2>
                        <p className="text-navy-500 font-medium text-lg">
                            Our security team is ready to assist with your DDQ, compliance review, or data residency setup.
                        </p>
                        <Button variant="primary" size="lg" className="h-16 px-12 text-lg">
                            Contact Security Team
                        </Button>
                    </div>

                    <p className="text-xs font-black text-navy-300 uppercase tracking-widest">
                        Questions? Reach us at <span className="text-wibl-teal underline cursor-pointer">security@wibl.io</span>
                    </p>
                </div>
            </section>
        </div>
    );
}
