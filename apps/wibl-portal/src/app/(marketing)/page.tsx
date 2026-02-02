"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    Check,
    ChevronDown,
    MessageCircle,
    Zap,
    Globe,
    ShieldCheck,
    BarChart3,
    Layers,
    Rocket,
    Twitter,
    Linkedin,
    Github,
    Menu,
    X,
    Plus,
    ArrowUpRight,
    Star,
    Quote
} from 'lucide-react';
import { Button, Card, Badge, Logo } from '@/components/ui';
import { cn } from '@/lib/utils';

// --- Static Data ---

const FEATURES = [
    { id: 1, title: 'Conversational Builder', desc: 'Just describe what you need. No drag-and-drop, no code.', icon: <MessageCircle className="text-wibl-teal" /> },
    { id: 2, title: 'Multi-Channel Deploy', desc: 'One click to Web, WhatsApp, Slack, Telegram, Discord.', icon: <Rocket className="text-wibl-teal" /> },
    { id: 3, title: 'Knowledge Base', desc: 'PDFs, URLs, Q&A pairs. Precision answers in seconds.', icon: <Layers className="text-wibl-sky" /> },
    { id: 4, title: 'Tool Integrations', desc: 'CRM, Calendar, APIs. Agents that do, not just talk.', icon: <Zap className="text-wibl-mint" /> },
    { id: 5, title: 'Real-Time Analytics', desc: 'Sentiment, resolution rates, satisfaction. Every metric.', icon: <BarChart3 className="text-wibl-teal" /> },
    { id: 6, title: 'Enterprise Security', desc: 'Bank-grade encryption. PII redaction. Injection protection.', icon: <ShieldCheck className="text-wibl-teal" /> },
];

const FAQS = [
    { q: "What is Wibl?", a: "Wibl is a conversational platform that lets you build, train, and deploy intelligent AI agents without writing a single line of code. You just describe what you need, and Wibl builds it for you." },
    { q: "Do I need coding skills?", a: "Absolutely not. Wibl is designed for non-technical users. If you can chat, you can build an AI agent." },
    { q: "Which channels are supported?", a: "Out of the box, we support Web Widgets, WhatsApp, Slack, Telegram, Discord, and a custom API for developers." },
    { q: "Is my data secure?", a: "Security is our top priority. We use end-to-end encryption, PII redaction, and have built-in protection against prompt injection attacks. We are fully GDPR compliant." },
    { q: "How does pricing work?", a: "We offer as-you-go pricing with tiered monthly plans. You can start building for free and upgrade as your scale needs grow." },
];

const TESTIMONIALS = [
    { name: 'Sarah Jenkins', role: 'Head of Support', company: 'FlowPay', quote: "Wibl changed our support game. We built an agent in 10 minutes that now handles 70% of our routine tickets.", rating: 5 },
    { name: 'Marcus Chen', role: 'Product Manager', company: 'Zestly', quote: "The multi-channel deployment is incredible. We went live on WhatsApp and Web in one afternoon.", rating: 5 },
    { name: 'Elena Rodriguez', role: 'CEO', company: 'TechNova', quote: "Finally, an AI platform that doesn't require a data science degree. Simply connected is the perfect way to describe it.", rating: 5 },
];

const PRICING_PLANS = [
    { name: 'Starter', price: '99', period: 'mo', features: ['2 Agents', '1000 Conversations', 'All Standard Channels', 'Email Support'], button: 'Start Free' },
    { name: 'Pro', price: '199', period: 'mo', popular: true, features: ['10 Agents', '5000 Conversations', 'Tool Integrations', 'Step-by-Step Training', '24/7 Priority Support'], button: 'Go Pro' },
    { name: 'Business', price: '299', period: 'mo', features: ['Unlimited Agents', '20k Conversations', 'Custom Domain', 'PII Redaction', 'Advanced Analytics'], button: 'Talk to Sales' },
];

// --- Intersection Observer Hook ---
function useReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.1 });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return { ref, isVisible };
}

// --- Sections ---

function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 py-4",
            isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent"
        )}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center group">
                    <Logo size="md" variant="full" className="group-hover:scale-105 transition-transform duration-300" />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-bold text-navy-600 hover:text-wibl-teal transition-colors">Features</Link>
                    <Link href="#how-it-works" className="text-sm font-bold text-navy-600 hover:text-wibl-teal transition-colors">How it works</Link>
                    <Link href="#pricing" className="text-sm font-bold text-navy-600 hover:text-wibl-teal transition-colors">Pricing</Link>
                    <div className="h-4 w-px bg-navy-100" />
                    <Link href="/login" className="text-sm font-bold text-navy-600 hover:text-wibl-teal transition-colors">Log In</Link>
                    <Link href="/agents/new">
                        <Button variant="primary" size="sm">Get Started</Button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-navy-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-navy-50 p-6 space-y-4 animate-slide-up">
                    <Link href="#features" className="block text-lg font-bold text-navy-800" onClick={() => setMobileMenuOpen(false)}>Features</Link>
                    <Link href="#how-it-works" className="block text-lg font-bold text-navy-800" onClick={() => setMobileMenuOpen(false)}>How it works</Link>
                    <Link href="#pricing" className="block text-lg font-bold text-navy-800" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                    <hr className="border-navy-50" />
                    <Link href="/login" className="block text-lg font-bold text-navy-800">Log In</Link>
                    <Link href="/agents/new">
                        <Button variant="primary" className="w-full">Get Started</Button>
                    </Link>
                </div>
            )}
        </nav>
    );
}

function Hero() {
    const { ref, isVisible } = useReveal();
    const [showTyping, setShowTyping] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowTyping(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex flex-col justify-center">
            {/* Premium Animated Background Orbs */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-wibl-mint/30 to-wibl-teal/20 orb-animated" />
                <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-wibl-sky/25 to-wibl-teal/15 orb-animated-slow" />
                <div className="absolute top-[40%] right-[20%] w-[200px] h-[200px] rounded-full bg-wibl-coral/10 orb-animated" style={{ animationDelay: '5s' }} />
            </div>

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 pointer-events-none -z-10 opacity-[0.02]"
                style={{ backgroundImage: 'radial-gradient(circle, #4ECDC4 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                <div ref={ref} className={cn("space-y-8 transition-all duration-1000", isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12")}>
                    <Badge variant="teal" size="md" className="animate-reveal">🚀 No-Code AI Evolution</Badge>
                    <h1 className="text-5xl md:text-7xl font-display font-black text-navy-800 leading-[1.1] tracking-tighter">
                        Build AI Agents <br />
                        <span className="text-gradient">Through Chat.</span>
                    </h1>
                    <p className="text-xl text-navy-500 font-medium leading-relaxed max-w-lg">
                        Create intelligent assistants by simply describing what you need. Deploy to Web, WhatsApp, and Slack in minutes. Simply connected.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/agents/new">
                            <Button variant="coral" size="lg" className="h-16 text-lg group btn-shine">
                                Start Building Free
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="#how-it-works">
                            <Button variant="ghost" size="lg" className="h-16 text-lg">
                                See How It Works
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-black text-navy-300 uppercase tracking-widest pt-4">
                        <span className="flex items-center gap-1.5"><Check className="text-wibl-teal" size={14} /> NO CREDIT CARD</span>
                        <span className="flex items-center gap-1.5"><Check className="text-wibl-teal" size={14} /> FREE PLAN AVAILABLE</span>
                    </div>
                </div>

                {/* Smart Hero Chat Mockup */}
                <div className={cn("relative transition-all duration-1000 delay-300", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12")}>
                    <div className="relative z-10 p-4 lg:p-8">
                        <div className="glass-premium rounded-[2.5rem] shadow-2xl p-6 animate-float">
                            {/* Header with live status */}
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-navy-100/50">
                                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center shrink-0 shadow-lg">
                                    <span className="text-xl font-display font-black"><span className="text-navy-800">W</span><span className="text-white">.</span></span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest">LIVE SESSION</p>
                                        <div className="w-2 h-2 rounded-full bg-wibl-mint status-live" />
                                    </div>
                                    <p className="text-sm font-bold text-navy-700 truncate">Wibl AI Creator</p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/10 text-xs font-bold text-[#25D366] border border-[#25D366]/20">
                                    <svg viewBox="0 0 24 24" fill="#25D366" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg> WhatsApp ready
                                </div>
                            </div>

                            {/* Smart conversation showing real actions */}
                            <div className="space-y-4">
                                <div className="bg-navy-50/80 rounded-2xl p-4 text-sm font-medium text-navy-600 max-w-[85%]">
                                    I need an agent that can check our inventory, book demo calls, and answer pricing questions.
                                </div>

                                <div className="flex justify-end">
                                    <div className="gradient-brand rounded-2xl p-4 text-sm font-bold text-white max-w-[85%] shadow-lg">
                                        <p className="mb-3">Perfect! I've created <span className="font-black">"SalesBot Pro"</span> with:</p>
                                        <div className="space-y-2 text-xs font-medium bg-white/10 rounded-xl p-3">
                                            <div className="flex items-center gap-2">
                                                <Check size={14} className="text-wibl-mint" />
                                                <span>Inventory API integration</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Check size={14} className="text-wibl-mint" />
                                                <span>Calendly booking flow</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Check size={14} className="text-wibl-mint" />
                                                <span>Pricing knowledge base</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-navy-50/80 rounded-2xl p-4 text-sm font-medium text-navy-600 max-w-[85%]">
                                    Connect it to our WhatsApp and website chat.
                                </div>

                                {showTyping ? (
                                    <div className="flex justify-end">
                                        <div className="gradient-brand rounded-2xl px-5 py-4 flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-white typing-dot" />
                                            <div className="w-2 h-2 rounded-full bg-white typing-dot" />
                                            <div className="w-2 h-2 rounded-full bg-white typing-dot" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-end">
                                        <div className="gradient-brand rounded-2xl p-4 text-sm font-bold text-white max-w-[85%] shadow-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Rocket size={16} className="text-white" />
                                                <span className="text-white font-black">Deployed!</span>
                                            </div>
                                            Your agent is now live on both channels. First visitor already asking about pricing! 🎉
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-wibl-coral/10 blur-xl -z-10" />
                    <div className="absolute -top-4 -left-4 w-32 h-32 rounded-full bg-wibl-mint/10 blur-2xl -z-10" />
                </div>
            </div>
        </section>
    );
}

function SocialProof() {
    return (
        <section className="py-12 border-y border-navy-50 bg-white">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                <p className="text-xs font-black text-navy-300 uppercase tracking-[0.2em] mb-8">Trusted by innovative teams</p>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale filter hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    <span className="font-display font-black text-3xl text-navy-700">FLOWPAY</span>
                    <span className="font-display font-black text-3xl text-navy-700">ZESTLY</span>
                    <span className="font-display font-black text-3xl text-navy-700">TECHNOVA</span>
                    <span className="font-display font-black text-3xl text-navy-700">VOYAGER</span>
                    <span className="font-display font-black text-3xl text-navy-700">GLIDE</span>
                </div>
            </div>
        </section>
    );
}

function HowItWorks() {
    const { ref, isVisible } = useReveal();

    return (
        <section id="how-it-works" className="py-32 bg-canvas-subtle overflow-hidden relative">
            {/* Subtle background decoration */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-wibl-mint/5 rounded-full blur-[150px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-wibl-sky/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <Badge variant="success" size="md">SIMPLY CONNECTED</Badge>
                    <h2 className="text-4xl md:text-5xl font-display font-black text-navy-800 tracking-tighter">
                        From idea to live agent in 3 steps
                    </h2>
                    <p className="text-lg text-navy-500 font-medium">No coding, no complex builders, no headache.</p>
                </div>

                <div ref={ref} className="grid md:grid-cols-3 gap-8">

                    {[
                        { step: '01', title: 'Describe', desc: 'Tell Wibl what you need in plain English. Intent understood, logic built.', icon: <MessageCircle /> },
                        { step: '02', title: 'Train', desc: 'Upload docs, scan URLs, or add Q&A pairs for precision answers.', icon: <Layers /> },
                        { step: '03', title: 'Deploy', desc: 'One click to go live on Web, WhatsApp, or Slack. Instantly.', icon: <Rocket /> },
                    ].map((step, idx) => (
                        <div key={idx} className={cn(
                            "group transition-all duration-700",
                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                        )} style={{ transitionDelay: `${idx * 150}ms` }}>
                            <div className="glass-premium rounded-[2rem] p-8 h-full card-hover-lift group-hover:border-wibl-teal/50 relative overflow-hidden">
                                {/* Shimmer effect on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 shimmer pointer-events-none" />

                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-wibl-teal/10 text-wibl-teal flex items-center justify-center group-hover:bg-white group-hover:shadow-lg transition-all duration-500">
                                        {step.icon}
                                    </div>
                                    <span className="text-5xl font-display font-black text-navy-200 group-hover:text-wibl-teal transition-colors">{step.step}</span>
                                </div>
                                <h3 className="text-2xl font-display font-black text-navy-800 mb-3 relative z-10">{step.title}</h3>
                                <p className="text-navy-600 font-medium leading-relaxed relative z-10">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Features() {
    const { ref, isVisible } = useReveal();

    return (
        <section id="features" className="py-32 bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-[50%] right-[-10%] w-[500px] h-[500px] bg-wibl-teal/5 rounded-full blur-[150px] -z-10" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                    <div className="space-y-6">
                        <Badge variant="info" size="md">POWERFUL FEATURES</Badge>
                        <h2 className="text-4xl md:text-5xl font-display font-black text-navy-800 tracking-tighter">
                            Everything you need. <br />
                            <span className="text-wibl-teal">Nothing you don't.</span>
                        </h2>
                        <p className="text-lg text-navy-500 font-medium leading-relaxed">
                            Enterprise power meets effortless simplicity.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="glass-premium rounded-3xl p-8 flex flex-col items-center justify-center aspect-square text-center group cursor-default border border-transparent hover:border-wibl-teal/30 hover:scale-[1.02] transition-all duration-300">
                            <span className="text-4xl font-display font-black text-navy-800 group-hover:text-wibl-teal transition-colors duration-300">500+</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-navy-400 mt-2">Companies</span>
                        </div>
                        <div className="glass-premium rounded-3xl p-8 flex flex-col items-center justify-center aspect-square text-center mt-8 group cursor-default border border-wibl-teal/20 hover:border-wibl-teal/50 hover:scale-[1.02] transition-all duration-300">
                            <span className="text-4xl font-display font-black text-wibl-teal group-hover:text-wibl-mint transition-colors duration-300">10M+</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-navy-400 mt-2">Conversations</span>
                        </div>
                    </div>
                </div>

                <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map((feature, idx) => (
                        <div key={feature.id} className={cn(
                            "transition-all duration-700",
                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        )} style={{ transitionDelay: `${idx * 80}ms` }}>
                            <div className="p-8 h-full rounded-2xl glass-premium card-hover-lift group border border-transparent hover:border-wibl-teal/30 transition-all duration-300">
                                <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm group-hover:bg-wibl-teal/10 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-display font-black text-navy-800 mb-3">{feature.title}</h3>
                                <p className="text-navy-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const USE_CASES = [
    {
        id: 'support',
        name: 'Customer Support',
        title: 'Instant resolutions, 24/7.',
        desc: 'Automate high-volume tickets, handle product questions, and escalate to humans only when necessary.',
        quote: "Our response time dropped from 4 hours to 0 seconds.",
        logo: "FLOWPAY"
    },
    {
        id: 'sales',
        name: 'SDR & Sales',
        title: 'Qualify leads while you sleep.',
        desc: 'Engage visitors instantly, ask qualifying questions, and book meetings directly into your calendar.',
        quote: "We increased our qualified lead volume by 42% in month one.",
        logo: "ZESTLY"
    },
    {
        id: 'ops',
        name: 'Internal Ops',
        title: 'The brain of your business.',
        desc: 'Connect to your internal knowledge base and let employees find answers to HR and IT queries instantly.',
        quote: "Our HR team recovered 10 hours a week in repetitive inquiries.",
        logo: "TECHNOVA"
    }
];

function UseCases() {
    const [activeTab, setActiveTab] = useState('support');
    const activeCase = USE_CASES.find(c => c.id === activeTab)!;

    return (
        <section className="py-32 bg-canvas-subtle overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-20">
                    <div className="lg:w-1/3 space-y-8">
                        <div>
                            <Badge variant="teal" size="md">USE CASES</Badge>
                            <h2 className="text-4xl font-display font-black text-navy-800 tracking-tighter mt-4">
                                One Wibl, <br />
                                <span className="text-wibl-teal">infinite possibilities.</span>
                            </h2>
                        </div>

                        <div className="space-y-2">
                            {USE_CASES.map((uc) => (
                                <button
                                    key={uc.id}
                                    onClick={() => setActiveTab(uc.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-6 rounded-2xl transition-all text-left",
                                        activeTab === uc.id
                                            ? "bg-white shadow-xl text-navy-800 border-2 border-wibl-teal/20"
                                            : "text-navy-400 hover:text-navy-600 hover:bg-white/50"
                                    )}
                                >
                                    <span className="font-display font-black">{uc.name}</span>
                                    <ArrowRight className={cn("transition-transform", activeTab === uc.id ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0")} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-navy-50 relative overflow-hidden h-full min-h-[500px] flex flex-col justify-center">
                            <div className="absolute top-0 right-0 w-64 h-64 gradient-brand opacity-5 blur-3xl -z-10" />

                            <div className="space-y-8 animate-fade-in" key={activeTab}>
                                <div className="space-y-4">
                                    <h3 className="text-3xl md:text-[2.75rem] font-display font-black text-navy-800 leading-tight">
                                        {activeCase.title}
                                    </h3>
                                    <p className="text-xl text-navy-500 font-medium leading-relaxed max-w-xl">
                                        {activeCase.desc}
                                    </p>
                                </div>

                                <div className="p-5 bg-navy-50 rounded-2xl">
                                    {/* Quote row */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 gradient-brand rounded-full flex items-center justify-center text-white shadow-lg shrink-0">
                                            <Quote size={14} />
                                        </div>
                                        <p className="text-base font-display font-black text-navy-700 italic whitespace-nowrap">
                                            "{activeCase.quote}"
                                        </p>
                                    </div>
                                    {/* Footer row */}
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                                                {activeCase.logo[0]}
                                            </div>
                                            <span className="text-xs font-black text-navy-400 uppercase tracking-widest">{activeCase.logo} Customer</span>
                                        </div>
                                        <Link href="#" className="flex items-center gap-2 text-xs font-black text-wibl-teal hover:text-wibl-sky transition-colors">
                                            Read Case Study <ArrowUpRight size={14} />
                                        </Link>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button variant="primary">Try this template</Button>
                                    <Button variant="ghost">Learn more</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Pricing() {
    const [billingPeriod, setBillingPeriod] = useState<'mo' | 'yr'>('mo');

    return (
        <section id="pricing" className="py-32 bg-navy-900 overflow-hidden relative">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-wibl-teal opacity-[0.03] blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-wibl-coral opacity-[0.03] blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
                    <Badge variant="coral" size="md" className="bg-wibl-coral text-white border-wibl-coral">SIMPLE PRICING</Badge>
                    <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tighter">
                        Choose the right plan for <br />
                        your scaling needs.
                    </h2>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <span className={cn("text-xs font-black uppercase tracking-widest transition-colors", billingPeriod === 'mo' ? "text-white" : "text-white/50")}>Monthly</span>
                        <button
                            onClick={() => setBillingPeriod(billingPeriod === 'mo' ? 'yr' : 'mo')}
                            className="w-14 h-8 bg-navy-800 rounded-full p-1 relative transition-colors border border-navy-700"
                        >
                            <div className={cn(
                                "w-6 h-6 bg-wibl-teal rounded-full shadow-lg transition-all",
                                billingPeriod === 'yr' ? "translate-x-6" : "translate-x-0"
                            )} />
                        </button>
                        <span className={cn("text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2", billingPeriod === 'yr' ? "text-white" : "text-white/50")}>
                            Yearly
                            <Badge variant="teal" size="sm" className="bg-wibl-mint/10 border-transparent text-wibl-mint">Save 15%</Badge>
                        </span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-stretch">
                    {PRICING_PLANS.map((plan) => (
                        <div key={plan.name} className={cn(
                            "relative flex flex-col p-10 rounded-[2.5rem] border bg-navy-800/50 backdrop-blur-sm transition-all duration-500",
                            plan.popular ? "border-wibl-teal scale-105 z-10 shadow-glow" : "border-navy-700 hover:border-navy-500"
                        )}>
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-wibl-teal text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <p className="text-xs font-black text-navy-400 uppercase tracking-widest mb-2">{plan.name}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-display font-black text-white">€{billingPeriod === 'yr' ? Math.floor(parseInt(plan.price) * 0.85) : plan.price}</span>
                                    <span className="text-navy-400 font-bold">/{plan.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-white/80 font-medium text-sm">
                                        <div className="w-5 h-5 rounded-full bg-wibl-teal/10 flex items-center justify-center shrink-0">
                                            <Check className="text-wibl-teal" size={12} />
                                        </div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.popular ? 'primary' : 'secondary'}
                                className={cn("w-full h-14", !plan.popular && "bg-transparent text-white border-white/20 hover:bg-white hover:text-navy-900")}
                            >
                                {plan.button}
                            </Button>
                        </div>
                    ))}
                </div>

                <p className="text-center text-navy-500 text-xs font-medium mt-12">
                    All plans include: Unlimited internal members, 24/7 support, SSL encryption, and GDPR compliance.
                </p>
            </div>
        </section>
    );
}

function Testimonials() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-3 text-center md:text-left">
                        <Badge variant="info" size="md">TRUSTED BY TEAMS</Badge>
                        <h2 className="text-3xl md:text-4xl font-display font-black text-navy-800 tracking-tighter">
                            What our users <span className="text-gradient">are saying.</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="text-wibl-teal" size={20} />)}
                        <span className="text-sm font-bold text-navy-600 ml-2">5.0 average rating</span>
                    </div>
                </div>
            </div>

            {/* Marquee Container */}
            <div className="relative">
                {/* Gradient faders */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused]">
                    {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                        <div key={i} className="flex-shrink-0 w-[400px]">
                            <div className="glass-premium rounded-2xl p-6 h-full">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(t.rating)].map((_, j) => <Star key={j} fill="currentColor" className="text-wibl-teal" size={14} />)}
                                </div>
                                <p className="text-lg font-bold text-navy-700 mb-6 leading-relaxed">
                                    "{t.quote}"
                                </p>
                                <div className="flex items-center gap-3 pt-4 border-t border-navy-100/50">
                                    <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white font-bold text-sm">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-navy-800 text-sm">{t.name}</p>
                                        <p className="text-xs text-navy-500">{t.role}, {t.company}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQ() {
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    return (
        <section className="py-32 bg-canvas-subtle">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-16 space-y-4">
                    <Badge variant="teal" size="md">FAQ</Badge>
                    <h2 className="text-4xl font-display font-black text-navy-800 tracking-tighter">Everything you need to know.</h2>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-navy-50 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <button
                                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-display font-black text-navy-700">{faq.q}</span>
                                <div className={cn("transition-transform duration-300", openIdx === i ? "rotate-180" : "rotate-0")}>
                                    <ChevronDown className="text-navy-300" />
                                </div>
                            </button>
                            <div className={cn(
                                "transition-all duration-300 ease-in-out overflow-hidden bg-navy-50/30",
                                openIdx === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                            )}>
                                <div className="p-6 pt-0 text-navy-500 font-medium leading-relaxed">
                                    {faq.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="bg-white border-t border-navy-50 pt-32 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center">
                            <Logo size="md" variant="full" />
                        </Link>
                        <p className="text-navy-500 font-medium leading-relaxed text-sm">
                            The world's first conversational agent builder.<br />
                            Building the future of artificial intelligence,<br />
                            <span className="text-wibl-teal font-bold">simply connected.</span>
                        </p>
                        <div className="flex gap-4">
                            <button className="w-10 h-10 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center hover:bg-navy-800 hover:text-white transition-all"><Twitter size={18} /></button>
                            <button className="w-10 h-10 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center hover:bg-navy-800 hover:text-white transition-all"><Linkedin size={18} /></button>
                            <button className="w-10 h-10 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center hover:bg-navy-800 hover:text-white transition-all"><Github size={18} /></button>
                        </div>
                    </div>

                    {[
                        { title: 'Product', links: ['Features', 'Pricing', 'Documentation', 'Integrations', 'Changelog'] },
                        { title: 'Company', links: ['About Us', 'Careers', 'Privacy Policy', 'Terms of Service', 'Security'] },
                        { title: 'Resources', links: ['API Docs', 'Webhooks', 'SDKs', 'Support Center', 'Status Page'] }
                    ].map((col) => (
                        <div key={col.title}>
                            <h4 className="text-xs font-black text-navy-400 uppercase tracking-widest mb-6">{col.title}</h4>
                            <ul className="space-y-4">
                                {col.links.map(link => (
                                    <li key={link}>
                                        <Link href="#" className="text-sm font-bold text-navy-600 hover:text-wibl-teal transition-colors">{link}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-navy-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-medium text-navy-300">© 2026 Wibl AI. All rights reserved.</p>
                    <div className="flex items-center gap-8">
                        <Link href="#" className="text-xs font-black text-navy-300 uppercase tracking-widest hover:text-navy-600 transition-colors">Privacy</Link>
                        <Link href="#" className="text-xs font-black text-navy-300 uppercase tracking-widest hover:text-navy-600 transition-colors">Security</Link>
                        <div className="flex items-center gap-2 text-xs font-black text-navy-600 uppercase tracking-widest cursor-pointer hover:text-wibl-teal">
                            <Globe size={14} />
                            English (EU)
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FinalCTA() {
    return (
        <section className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="relative overflow-hidden bg-navy-900 rounded-[3rem] p-12 md:p-24 text-center">
                    {/* Background elements */}
                    <div className="absolute inset-0 gradient-brand opacity-10 blur-[100px]" />
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-wibl-teal opacity-5 rounded-full blur-[120px]" />

                    <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                        <div className="inline-flex rounded-full bg-white/10 p-1 pl-4 items-center gap-3 pr-2 backdrop-blur-sm border border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Beta is now open</span>
                            <div className="bg-wibl-mint px-2 py-0.5 rounded-full text-[8px] font-black text-navy-900 uppercase">New</div>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-display font-black text-white leading-tight tracking-tighter">
                            Ready to build your <br />
                            first AI agent?
                        </h2>
                        <p className="text-lg text-white/60 font-medium">
                            Join thousands of businesses using Wibl to automate customer interactions across every channel.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-4">
                            <div className="relative flex-1 max-w-sm w-full">
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 font-medium text-white placeholder-white/30 focus:bg-white/10 focus:border-wibl-teal outline-none transition-all"
                                />
                            </div>
                            <Button variant="coral" size="lg" className="h-16 px-12 text-lg shadow-wibl-coral">
                                Get Started Free
                            </Button>
                        </div>

                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                            No credit card required • Unlimited free trial • Instant setup
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

// --- Page Main ---

export default function MarketingPage() {
    return (
        <div className="min-h-screen bg-canvas-light selection:bg-wibl-teal selection:text-white grain-overlay">
            <Navbar />
            <Hero />
            <SocialProof />
            <HowItWorks />
            <UseCases />
            <Features />
            <Pricing />
            <Testimonials />
            <FAQ />
            <FinalCTA />
            <Footer />
        </div>
    );
}
