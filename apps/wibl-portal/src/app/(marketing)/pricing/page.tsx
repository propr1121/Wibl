"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Check,
    ChevronDown,
    HelpCircle,
    Calculator,
    ArrowRight,
    ShieldCheck,
    Zap,
    Globe,
    Bot
} from 'lucide-react';
import { Button, Card, Badge, Logo } from '@/components/ui';
import { cn } from '@/lib/utils';

// --- Static Data ---

const COMPARISON_FEATURES = [
    { name: 'Number of Agents', starter: '2', pro: '10', business: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Monthly Conversations', starter: '1,000', pro: '5,000', business: '20,000', enterprise: 'Custom' },
    { name: 'Knowledge Base Size', starter: '10 MB', pro: '100 MB', business: '1 GB', enterprise: 'Unlimited' },
    { name: 'Web Widget', starter: true, pro: true, business: true, enterprise: true },
    { name: 'WhatsApp Channel', starter: false, pro: true, business: true, enterprise: true },
    { name: 'Slack & Telegram', starter: false, pro: true, business: true, enterprise: true },
    { name: 'Custom API access', starter: false, pro: false, business: true, enterprise: true },
    { name: 'PII Redaction', starter: false, pro: false, business: true, enterprise: true },
    { name: 'Role-Based Access', starter: false, pro: false, business: false, enterprise: true },
    { name: 'White-labeling', starter: false, pro: false, business: false, enterprise: true },
];

const BILLING_FAQS = [
    { q: "Can I change plans at any time?", a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle." },
    { q: "What happens if I exceed my conversation limit?", a: "We won't cut you off immediately. We'll notify you and provide an option to upgrade or pay for extra volume at a small per-message rate." },
    { q: "Do you offer a free trial?", a: "Every new Wibl account starts on our Free tier, which includes all basic features and 50 conversations so you can test everything out." },
    { q: "Is there a discount for non-profits?", a: "Yes! We offer a 25% discount for verified non-profit organizations. Reach out to our support team to apply." },
];

// --- Sub-components ---

function PricingHero() {
    return (
        <section className="pt-32 pb-20 text-center space-y-6">
            <Badge variant="teal" size="md">PRICING</Badge>
            <h1 className="text-5xl md:text-7xl font-display font-black text-navy-800 tracking-tighter">
                The Right Plan for <br />
                <span className="text-gradient">Every Scale.</span>
            </h1>
            <p className="text-xl text-navy-500 font-medium max-w-2xl mx-auto">
                From solo founders to global enterprises, Wibl scales with you. No hidden fees, just simple pricing.
            </p>
        </section>
    );
}

function CostCalculator() {
    const [conversations, setConversations] = useState(5000);

    const estimate = Math.floor(conversations * 0.04);

    return (
        <section className="py-24 bg-white rounded-[3rem] border border-navy-100 shadow-wibl mx-6 max-w-5xl lg:mx-auto mb-32">
            <div className="max-w-3xl mx-auto px-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-wibl-teal flex items-center justify-center">
                        <Calculator size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-display font-black text-navy-800">Estimate your monthly cost</h3>
                        <p className="text-navy-500 text-sm font-medium">Use our volume calculator to find your ideal plan.</p>
                    </div>
                </div>

                <div className="space-y-12">
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-black text-navy-400 uppercase tracking-widest">Monthly Conversations</label>
                            <span className="text-2xl font-display font-black text-navy-800">{conversations.toLocaleString()}</span>
                        </div>
                        <input
                            type="range"
                            min="1000"
                            max="100000"
                            step="1000"
                            value={conversations}
                            onChange={(e) => setConversations(parseInt(e.target.value))}
                            className="w-full h-3 bg-navy-50 rounded-full appearance-none cursor-pointer accent-wibl-teal"
                        />
                        <div className="flex justify-between text-[10px] font-black text-navy-300 uppercase tracking-widest">
                            <span>1k</span>
                            <span>50k</span>
                            <span>100k+</span>
                        </div>
                    </div>

                    <div className="p-8 bg-canvas-subtle rounded-3xl grid md:grid-cols-2 gap-8 items-center border border-navy-50">
                        <div>
                            <p className="text-xs font-black text-navy-400 uppercase tracking-widest mb-1">Estimated Monthly Cost</p>
                            <p className="text-4xl font-display font-black text-navy-800">€{estimate}</p>
                            <p className="text-xs text-navy-400 mt-2 font-medium italic">*Approximate cost based on average usage patterns.</p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm font-bold text-navy-600">Recommended Plan:</p>
                            <Badge variant="teal" size="md" className="text-lg py-2 px-6">
                                {conversations < 2000 ? 'Starter' : conversations < 10000 ? 'Pro' : 'Business'}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeatureComparisonTable() {
    return (
        <section className="py-24 max-w-7xl mx-auto px-6 overflow-x-auto">
            <h2 className="text-3xl font-display font-black text-navy-800 mb-12 text-center tracking-tighter">Detailed Comparison</h2>

            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                    <tr className="border-b-2 border-navy-100">
                        <th className="py-6 font-display font-black text-navy-400 uppercase tracking-widest text-xs">Features</th>
                        <th className="py-6 font-display font-black text-navy-800 px-4">Starter</th>
                        <th className="py-6 font-display font-black text-wibl-teal px-4">Pro</th>
                        <th className="py-6 font-display font-black text-navy-800 px-4">Business</th>
                        <th className="py-6 font-display font-black text-navy-800 px-4">Enterprise</th>
                    </tr>
                </thead>
                <tbody>
                    {COMPARISON_FEATURES.map((feature, idx) => (
                        <tr key={idx} className="border-b border-navy-50 hover:bg-canvas-subtle transition-colors group">
                            <td className="py-5 font-bold text-navy-700 text-sm">{feature.name}</td>
                            <td className="py-5 px-4 text-sm text-navy-500">
                                {typeof feature.starter === 'boolean' ? (feature.starter ? <Check className="text-wibl-teal" size={18} /> : '-') : feature.starter}
                            </td>
                            <td className="py-5 px-4 text-sm font-bold text-wibl-teal">
                                {typeof feature.pro === 'boolean' ? (feature.pro ? <Check className="text-wibl-teal" size={18} /> : '-') : feature.pro}
                            </td>
                            <td className="py-5 px-4 text-sm text-navy-500 uppercase font-black text-[10px]">
                                {typeof feature.business === 'boolean' ? (feature.business ? <Check className="text-wibl-teal" size={18} /> : '-') : feature.business}
                            </td>
                            <td className="py-5 px-4 text-sm text-navy-500 uppercase font-black text-[10px]">
                                {typeof feature.enterprise === 'boolean' ? (feature.enterprise ? <Check className="text-wibl-teal" size={18} /> : '-') : feature.enterprise}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

// Reuse Navbar and Footer from page.tsx by extracting them or rewriting for now
// Actually, I'll rewrite a simplified version for common use

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-canvas-light">
            <PricingHero />

            {/* Pricing Cards repeated from landing for consistency */}
            <section className="py-12 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-4 gap-8">
                    {[
                        { name: 'Free', price: '0', features: ['1 Agent', '50 Conversations', 'Web Widget'], button: 'Get Started' },
                        { name: 'Starter', price: '99', features: ['2 Agents', '1000 Conversations', 'All Standard Channels', 'Email Support'], button: 'Choose Starter' },
                        { name: 'Pro', price: '199', popular: true, features: ['10 Agents', '5000 Conversations', 'Tool Integrations', 'Step-by-Step Training', 'Priority Support'], button: 'Choose Pro' },
                        { name: 'Enterprise', price: 'Custom', features: ['Unlimited Agents', 'SSO & IAM', 'Service Level Agreement', 'Dedicated Manager'], button: 'Contact Sales' }
                    ].map((plan) => (
                        <div key={plan.name} className={cn(
                            "relative flex flex-col p-8 rounded-wibl-lg border bg-white transition-all duration-300",
                            plan.popular ? "border-wibl-teal shadow-xl scale-105 z-10" : "border-navy-50 hover:shadow-lg"
                        )}>
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-wibl-teal text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-6">
                                <p className="text-xs font-black text-navy-400 uppercase tracking-widest mb-1">{plan.name}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-display font-black text-navy-800">{plan.price !== 'Custom' ? `€${plan.price}` : plan.price}</span>
                                    {plan.price !== 'Custom' && <span className="text-navy-400 font-bold text-sm">/mo</span>}
                                </div>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map(f => (
                                    <li key={f} className="flex items-center gap-2 text-xs font-medium text-navy-600">
                                        <Check size={14} className="text-wibl-teal shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Button variant={plan.popular ? 'primary' : 'ghost'} className="w-full">
                                {plan.button}
                            </Button>
                        </div>
                    ))}
                </div>
            </section>

            <CostCalculator />
            <FeatureComparisonTable />

            <section className="py-24 bg-canvas-subtle">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-display font-black text-navy-800 mb-12">Billing FAQ</h2>
                    <div className="space-y-4">
                        {BILLING_FAQS.map((faq, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-navy-50 text-left">
                                <p className="font-display font-black text-navy-700 mb-2">{faq.q}</p>
                                <p className="text-navy-500 text-sm font-medium leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="enterprise" className="py-32 px-6 bg-navy-900 border-t border-navy-800">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <Badge variant="coral" size="md">ENTERPRISE</Badge>
                        <h2 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter leading-tight">
                            Global scale. <br />
                            <span className="text-wibl-mint">Zero friction.</span>
                        </h2>
                        <p className="text-xl text-navy-400 font-medium">
                            Custom solutions for organizations requiring high volume, dedicated support, and advanced security.
                        </p>
                        <ul className="space-y-4">
                            {[
                                'Custom conversation limits',
                                'SLA-backed priority support',
                                'Dedicated Account Manager',
                                'SSO / SAML Authentication',
                                'White-labeling options'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-white font-bold">
                                    <Check size={20} className="text-wibl-teal" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Card variant="elevated" className="p-8 bg-white/5 border-white/10 backdrop-blur-xl rounded-[2.5rem]">
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-white/40 uppercase tracking-widest">Work Email</label>
                                <input type="email" placeholder="you@company.com" className="w-full h-14 bg-white/5 border-2 border-white/10 rounded-2xl px-4 text-white outline-none focus:border-wibl-teal transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-white/40 uppercase tracking-widest">Company Size</label>
                                <select className="w-full h-14 bg-white/5 border-2 border-white/10 rounded-2xl px-4 text-white/60 outline-none focus:border-wibl-teal transition-all appearance-none">
                                    <option>50-200 employees</option>
                                    <option>201-500 employees</option>
                                    <option>501-1000 employees</option>
                                    <option>1000+ employees</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-white/40 uppercase tracking-widest">Tell us about your needs</label>
                                <textarea rows={4} className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-4 text-white outline-none focus:border-wibl-teal transition-all resize-none" />
                            </div>
                            <Button variant="primary" className="w-full h-16 text-lg font-bold">Request Enterprise Quote</Button>
                        </form>
                    </Card>
                </div>
            </section>
        </div>
    );
}
