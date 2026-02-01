"use client";

import React, { useState, useEffect } from 'react';
import { Button, Card, Badge, LoadingDots, GradientBorder } from '@/components/ui';
import { PricingCard } from '@/components/features/PricingCard';
import { PLANS, PlanKey } from '@/lib/stripe/plans';
import { createClient } from '@/lib/supabase/client';
import { ExternalLink, Zap, Users, Wrench, TrendingUp } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

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
        <div className="max-w-7xl mx-auto p-8 space-y-10">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-display font-black text-navy-700 mb-2">
                    Billing & Subscription
                </h1>
                <p className="text-navy-400 font-medium">
                    Manage your plan, usage, and billing information
                </p>
            </div>

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

            {/* Usage Meters */}
            <div>
                <h2 className="text-2xl font-display font-black text-navy-700 mb-6">
                    Current Usage
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <UsageMeter
                        icon={<Users className="text-wibl-teal" />}
                        label="AI Agents"
                        current={usage.agents}
                        limit={currentPlan.agents}
                    />
                    <UsageMeter
                        icon={<Wrench className="text-wibl-teal" />}
                        label="Tool Integrations"
                        current={usage.tools}
                        limit={currentPlan.tools}
                    />
                    <UsageMeter
                        icon={<TrendingUp className="text-wibl-teal" />}
                        label="Messages This Month"
                        current={usage.messages}
                        limit={10000}
                        hideProgress
                    />
                </div>
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

// Usage Meter Component
interface UsageMeterProps {
    icon: React.ReactNode;
    label: string;
    current: number;
    limit: number;
    hideProgress?: boolean;
}

function UsageMeter({ icon, label, current, limit, hideProgress }: UsageMeterProps) {
    const percentage = limit === Infinity ? 0 : Math.min((current / limit) * 100, 100);
    const isNearLimit = percentage > 80;

    return (
        <Card variant="elevated" padding="md" hoverable>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-wibl-sm bg-wibl-teal/10 flex items-center justify-center">
                        {icon}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-black text-navy-500 uppercase tracking-wider">
                            {label}
                        </p>
                        <p className="text-2xl font-display font-black text-navy-700">
                            {current}
                            {limit !== Infinity && (
                                <span className="text-sm text-navy-400 font-medium"> / {limit}</span>
                            )}
                        </p>
                    </div>
                </div>

                {!hideProgress && limit !== Infinity && (
                    <div className="space-y-2">
                        <div className="h-2 bg-navy-50 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${isNearLimit ? 'bg-coral' : 'gradient-brand'
                                    }`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        {isNearLimit && (
                            <p className="text-xs text-coral font-bold">
                                ⚠️ Approaching limit
                            </p>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
