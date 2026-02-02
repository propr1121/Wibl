"use client";

import React from 'react';
import { useHeaderConfig } from '@/components/layouts/DashboardContext';
import { Card, Button, Badge } from '@/components/ui';
import { HelpCircle, Mail, MessageSquare, Book, Search, ExternalLink, Zap, LifeBuoy } from 'lucide-react';

export default function SupportPage() {
    useHeaderConfig({
        breadcrumbs: [{ label: 'Overview', href: '/dashboard' }, { label: 'Support', href: '/support' }],
    });

    return (
        <div className="space-y-12 pb-20 max-w-[1400px] mx-auto relative overflow-hidden animate-reveal">
            {/* Background Orbs */}
            <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-wibl-teal/5 rounded-full blur-[140px] pointer-events-none orb-animated" />
            <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-wibl-sky/5 rounded-full blur-[120px] pointer-events-none orb-animated-slow" />

            {/* Support Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-wibl-teal uppercase tracking-[0.3em] mb-1">Help & Resources</p>
                    <h1 className="text-3xl lg:text-4xl font-display font-black text-navy-900 tracking-tighter">
                        Customer <span className="text-gradient">Support.</span>
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="teal" size="md" className="px-4 py-2 font-black tracking-widest uppercase">
                        Enterprise Priority
                    </Badge>
                </div>
            </div>

            {/* Support Search */}
            <Card variant="premium" className="bg-white/80 border-navy-50/50 backdrop-blur-md">
                <div className="flex items-center gap-4 px-2">
                    <Search className="text-navy-300" size={24} />
                    <input
                        type="text"
                        placeholder="Search our knowledge base for answers..."
                        className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium text-navy-800 placeholder:text-navy-300 py-4"
                    />
                    <Button variant="primary" className="hidden md:flex">Search</Button>
                </div>
            </Card>

            {/* Main Support Options */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <SupportCard
                    icon={<MessageSquare className="text-wibl-teal" />}
                    title="Live Assistant"
                    desc="Chat with our specialist agent for real-time troubleshooting and onboarding assistance."
                    action="Start Chat"
                    status="Online"
                />
                <SupportCard
                    icon={<Mail className="text-wibl-sky" />}
                    title="Email Support"
                    desc="Submit a ticket for complex inquiries. Our technical team responds within 4 hours."
                    action="Open Ticket"
                    href="mailto:support@wibl.ai"
                />
                <SupportCard
                    icon={<Book className="text-coral" />}
                    title="Documentation"
                    desc="Explore deep-dives into API integrations, agent personality tuning, and safety protocols."
                    action="Browse Docs"
                    isExternal
                />
            </div>

            {/* FAQ Section */}
            <div className="space-y-8">
                <h2 className="text-2xl font-display font-black text-navy-800 tracking-tight">Frequently Asked Questions</h2>
                <div className="grid lg:grid-cols-2 gap-6">
                    <FAQItem
                        question="How do I integrate my existing CRM?"
                        answer="You can connect HubSpot or Salesforce directly through the Tools configuration in your Agent workspace."
                    />
                    <FAQItem
                        question="Can I customize agent safety protocols?"
                        answer="Yes, every agent has a dedicated safety layer where you can define PII redaction and behavioral guardrails."
                    />
                    <FAQItem
                        question="What is the response latency for WhatsApp?"
                        answer="Our agents typically process and respond to WhatsApp messages in under 1.2 seconds on average."
                    />
                    <FAQItem
                        question="How is billing calculated for multiple agents?"
                        answer="Billing is seat-based for concurrent active agents. You can upgrade your plan in the Billing settings."
                    />
                </div>
            </div>

            {/* Contact Footer */}
            <Card variant="outlined" padding="lg" className="bg-gradient-to-br from-navy-900 to-navy-800 text-white border-transparent">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div className="space-y-2">
                        <h3 className="text-xl font-display font-black tracking-tight">Still need help?</h3>
                        <p className="text-navy-300 font-medium">Our global intelligence team is available 24/7 for Enterprise partners.</p>
                    </div>
                    <Button variant="primary" size="lg" className="shadow-premium-lg px-10 h-14 bg-white text-navy-900 hover:bg-navy-50 border-none font-black uppercase tracking-widest">
                        Talk to an Expert
                    </Button>
                </div>
            </Card>
        </div>
    );
}

function SupportCard({ icon, title, desc, action, status, isExternal = false, href = "#" }: any) {
    return (
        <Card variant="premium" padding="lg" className="bg-white group hover:border-wibl-teal/20 transition-all duration-300">
            <div className="space-y-6">
                <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        {icon}
                    </div>
                    {status && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-wibl-mint/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-wibl-mint animate-pulse" />
                            <span className="text-[9px] font-black text-wibl-mint uppercase tracking-widest">{status}</span>
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="text-xl font-display font-black text-navy-800 mb-2 truncate group-hover:text-wibl-teal transition-colors">{title}</h3>
                    <p className="text-sm text-navy-500 font-medium leading-relaxed opacity-80">{desc}</p>
                </div>
                <Button
                    variant="secondary"
                    className="w-full font-black uppercase tracking-[0.2em] text-[10px] h-11"
                    rightIcon={isExternal ? <ExternalLink size={14} /> : null}
                    onClick={() => href !== "#" && window.open(href, isExternal ? '_blank' : '_self')}
                >
                    {action}
                </Button>
            </div>
        </Card>
    );
}

function FAQItem({ question, answer }: any) {
    return (
        <Card variant="outlined" padding="md" className="bg-white/50 hover:bg-white border-navy-50 transition-colors">
            <h4 className="text-sm font-black text-navy-800 mb-2">{question}</h4>
            <p className="text-xs text-navy-500 font-medium leading-relaxed">{answer}</p>
        </Card>
    );
}
