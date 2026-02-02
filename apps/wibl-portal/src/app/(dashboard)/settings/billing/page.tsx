"use client";

import React, { useState, useEffect } from 'react';
import { Button, Card, Badge, LoadingDots, GradientBorder } from '@/components/ui';
import { PricingCard } from '@/components/features/PricingCard';
import { PLANS, PlanKey } from '@/lib/stripe/plans';
import { createClient } from '@/lib/supabase/client';
import { ExternalLink, Zap, Users, Wrench, TrendingUp, Activity, Database, Shield } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { useHeaderConfig } from '@/components/layouts/DashboardContext';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Subscription {
    plan_name: PlanKey;
    status: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    stripe_customer_id: string;
}

interface UsageStats {
    agents: number;
    tools: number;
    messages: number;
}

export default function BillingPage() {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [usage, setUsage] = useState<UsageStats>({ agents: 0, tools: 0, messages: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
    const supabase = createClient();

    useHeaderConfig({
        title: 'Billing & Subscription',
        breadcrumbs: [{ label: 'Settings', href: '/settings' }],
    });

    useEffect(() => {
        loadBillingData();
    }, []);

    const loadBillingData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch subscription
            const { data: subData } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (subData) {
                setSubscription(subData);
            }

            // Fetch usage stats
            const [agentsData, toolsData] = await Promise.all([
                supabase.from('agents').select('id', { count: 'exact' }).eq('user_id', user.id),
                supabase.from('tools').select('id', { count: 'exact' }).eq('user_id', user.id),
            ]);

            setUsage({
                agents: agentsData.count || 0,
                tools: toolsData.count || 0,
                messages: 1247, // Example: fetch from analytics
            });
        } catch (error) {
            console.error('Error loading billing data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpgrade = async (priceId: string, planName: string) => {
        try {
            setCheckoutLoading(planName);

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId, planName }),
            });

            const { url } = await response.json();

            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error('Checkout error:', error);
        } finally {
            setCheckoutLoading(null);
        }
    };

    const openCustomerPortal = async () => {
        if (!subscription?.stripe_customer_id) return;

        try {
            const response = await fetch('/api/customer-portal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: subscription.stripe_customer_id
                }),
            });

            const { url } = await response.json();
            if (url) {
                window.open(url, '_blank');
            }
        } catch (error) {
            console.error('Portal error:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingDots color="gradient" size="lg" />
            </div>
        );
    }

    const currentPlan = subscription ? PLANS[subscription.plan_name] : PLANS.starter;
    const currentPlanKey = subscription?.plan_name || 'starter';

    return (
        <div className="space-y-10 pb-20 max-w-[1200px] mx-auto animate-reveal">
            {/* Background Decor */}
            <div className="absolute top-[-5%] right-[-5%] w-[400px] h-[400px] bg-wibl-teal/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Current Plan Overview - Premium Architecture */}

            {/* Current Plan Card */}
            <GradientBorder animated width={2}>
                <Card variant="elevated" padding="lg" className="bg-gradient-to-br from-white to-canvas-subtle">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-display font-black text-navy-700">
                                    {currentPlan.name} Plan
                                </h2>
                                <Badge variant={subscription?.status === 'active' ? 'teal' : 'warning'}>
                                    {subscription?.status || 'Free'}
                                </Badge>
                            </div>
                            <p className="text-navy-400 font-medium">
                                {subscription?.cancel_at_period_end ? (
                                    <>Cancels on {new Date(subscription.current_period_end).toLocaleDateString()}</>
                                ) : subscription?.current_period_end ? (
                                    <>Renews on {new Date(subscription.current_period_end).toLocaleDateString()}</>
                                ) : (
                                    'Get started with a paid plan'
                                )}
                            </p>
                            {currentPlan.price && (
                                <p className="text-3xl font-display font-black text-gradient">
                                    €{(currentPlan.price / 100).toFixed(0)}/mo
                                </p>
                            )}
                        </div>
                        {subscription?.stripe_customer_id && (
                            <Button
                                variant="secondary"
                                rightIcon={<ExternalLink size={16} />}
                                onClick={openCustomerPortal}
                            >
                                Manage Subscription
                            </Button>
                        )}
                    </div>
                </Card>
            </GradientBorder>

            {/* Usage Metrics - High Density Informatics */}
            <div className="grid lg:grid-cols-3 gap-8">
                <UsageMeter
                    icon={<Activity size={18} />}
                    label="Active Agents"
                    current={usage.agents}
                    limit={currentPlan.agents}
                    subtitle="Concurrent active instances"
                />
                <UsageMeter
                    icon={<Database size={18} />}
                    label="Connected systems"
                    current={usage.tools}
                    limit={currentPlan.tools}
                    subtitle="External data Integrations"
                />
                <UsageMeter
                    icon={<TrendingUp size={18} />}
                    label="Total Volume"
                    current={usage.messages}
                    limit={10000}
                    subtitle="Aggregate monthly chats"
                    hideProgress
                />
            </div>

            {/* Upgrade Options */}
            {currentPlanKey !== 'enterprise' && (
                <div>
                    <h2 className="text-2xl font-display font-black text-navy-700 mb-6">
                        {subscription ? 'Upgrade Your Plan' : 'Choose a Plan'}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Object.entries(PLANS).map(([key, plan]) => (
                            <PricingCard
                                key={key}
                                name={plan.name}
                                price={plan.price}
                                priceId={plan.priceId}
                                features={plan.features}
                                popular={plan.popular}
                                agents={plan.agents}
                                tools={plan.tools}
                                isCurrentPlan={currentPlanKey === key}
                                isLoading={checkoutLoading === key}
                                onSelect={() => {
                                    if (plan.priceId) {
                                        handleUpgrade(plan.priceId, key);
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Billing Note */}
            <Card variant="outlined" padding="md" className="bg-gradient-subtle">
                <div className="flex items-start gap-3">
                    <Zap size={20} className="text-wibl-teal shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="font-black text-navy-700">
                            Need more? Contact us for Enterprise
                        </p>
                        <p className="text-sm text-navy-500 font-medium">
                            Get unlimited agents, custom integrations, and dedicated support for your team.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

// Enhanced Usage Meter Component
interface UsageMeterProps {
    icon: React.ReactNode;
    label: string;
    current: number;
    limit: number;
    subtitle?: string;
    hideProgress?: boolean;
}

function UsageMeter({ icon, label, current, limit, subtitle, hideProgress }: UsageMeterProps) {
    const percentage = limit === Infinity ? 0 : Math.min((current / limit) * 100, 100);
    const isNearLimit = percentage > 85;

    return (
        <Card variant="premium" padding="sm" className="bg-white border-navy-50 group hover:border-wibl-teal/20 transition-all duration-300">
            <div className="space-y-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="text-wibl-teal group-hover:scale-110 transition-transform duration-500">{icon}</div>
                            <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest leading-none">
                                {label}
                            </p>
                        </div>
                        {subtitle && <p className="text-[9px] font-bold text-navy-300 uppercase tracking-tight opacity-70">{subtitle}</p>}
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-display font-black text-navy-900 leading-none tabular-nums tracking-tighter">
                            {current.toLocaleString()}
                        </p>
                        {limit !== Infinity && (
                            <p className="text-[10px] font-bold text-navy-300 uppercase mt-1">
                                of {limit.toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>

                {!hideProgress && limit !== Infinity && (
                    <div className="space-y-2">
                        <div className="h-1.5 bg-navy-50/50 rounded-full overflow-hidden p-[1px]">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-1000 ease-out",
                                    isNearLimit ? 'bg-coral' : 'gradient-brand'
                                )}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        {isNearLimit && (
                            <p className="text-[9px] text-coral font-black uppercase tracking-widest animate-pulse">
                                Critical Capacity
                            </p>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
