"use client";

import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Avatar } from '@/components/ui';
import {
    Bot,
    MessageCircle,
    Activity,
    CreditCard,
    TrendingUp,
    TrendingDown,
    Play,
    Pause,
    Eye,
    Plus,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Clock,
    Rocket,
    ArrowRight
} from 'lucide-react';
import { useHeaderConfig } from '@/components/layouts/DashboardContext';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import SecurityDashboardWidget from '@/components/features/SecurityWidget';

// Mock data - replace with real data from API
const MOCK_USER = { name: 'John' };
const MOCK_STATS = {
    totalAgents: { current: 3, limit: 5 },
    conversationsToday: { count: 47, change: 12 },
    apiCalls: { count: 1247, limit: 10000 },
    estimatedCost: { amount: 28.50, currency: '€' },
};

const MOCK_AGENTS = [
    {
        id: '1',
        name: 'Customer Support Bot',
        status: 'active' as const,
        conversationsToday: 32,
        initial: 'C',
    },
    {
        id: '2',
        name: 'Sales Assistant',
        status: 'active' as const,
        conversationsToday: 15,
        initial: 'S',
    },
    {
        id: '3',
        name: 'FAQ Helper',
        status: 'paused' as const,
        conversationsToday: 0,
        initial: 'F',
    },
];

const MOCK_ACTIVITY = [
    {
        id: '1',
        type: 'conversation' as const,
        description: 'New conversation started',
        agent: 'Customer Support Bot',
        timestamp: '2 min ago',
    },
    {
        id: '2',
        type: 'deploy' as const,
        description: 'Agent deployed successfully',
        agent: 'Sales Assistant',
        timestamp: '15 min ago',
    },
    {
        id: '3',
        type: 'conversation' as const,
        description: 'Conversation completed',
        agent: 'Customer Support Bot',
        timestamp: '1 hour ago',
    },
    {
        id: '4',
        type: 'error' as const,
        description: 'Rate limit warning',
        agent: 'FAQ Helper',
        timestamp: '2 hours ago',
    },
];

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false);
    const [animateWave, setAnimateWave] = useState(false);

    useHeaderConfig({
        title: 'Dashboard',
        breadcrumbs: [],
    });

    useEffect(() => {
        setMounted(true);
        setAnimateWave(true);
        const timer = setTimeout(() => setAnimateWave(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="animate-fade-in">
                <h1 className="text-4xl font-display font-black text-navy-700 mb-2">
                    {getGreeting()}, {MOCK_USER.name}!{' '}
                    <span className={cn("inline-block", animateWave && "animate-wave")}>
                        👋
                    </span>
                </h1>
                <p className="text-navy-500 font-medium text-lg">
                    Here's what's happening with your agents today.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Bot size={20} />}
                    label="Total Agents"
                    value={MOCK_STATS.totalAgents.current.toString()}
                    subtitle={`of ${MOCK_STATS.totalAgents.limit} available`}
                    delay={0}
                />
                <StatCard
                    icon={<MessageCircle size={20} />}
                    label="Conversations Today"
                    value={MOCK_STATS.conversationsToday.count.toString()}
                    subtitle={`+${MOCK_STATS.conversationsToday.change}% vs yesterday`}
                    trend="up"
                    delay={100}
                />
                <StatCard
                    icon={<Activity size={20} />}
                    label="API Calls"
                    value={MOCK_STATS.apiCalls.count.toLocaleString()}
                    subtitle={
                        <div className="space-y-1">
                            <p className="text-xs text-navy-400 font-medium">
                                {((MOCK_STATS.apiCalls.count / MOCK_STATS.apiCalls.limit) * 100).toFixed(0)}% of limit
                            </p>
                            <div className="h-1.5 bg-navy-50 rounded-full overflow-hidden">
                                <div
                                    className="h-full gradient-brand rounded-full transition-all duration-1000"
                                    style={{
                                        width: `${(MOCK_STATS.apiCalls.count / MOCK_STATS.apiCalls.limit) * 100}%`
                                    }}
                                />
                            </div>
                        </div>
                    }
                    delay={200}
                />
                <StatCard
                    icon={<CreditCard size={20} />}
                    label="Est. Cost"
                    value={`${MOCK_STATS.estimatedCost.currency}${MOCK_STATS.estimatedCost.amount.toFixed(2)}`}
                    subtitle="This month"
                    delay={300}
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Agents Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-display font-black text-navy-700">
                            Your Agents
                        </h2>
                        <Link href="/agents/new">
                            <Button variant="primary" size="sm" leftIcon={<Plus size={16} />}>
                                Create Agent
                            </Button>
                        </Link>
                    </div>

                    {MOCK_AGENTS.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {MOCK_AGENTS.map((agent, index) => (
                                <AgentCard
                                    key={agent.id}
                                    agent={agent}
                                    delay={400 + index * 100}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Security Widget */}
                    <SecurityDashboardWidget />

                    {/* Activity Feed */}
                    <ActivityFeed activities={MOCK_ACTIVITY} />
                </div>
            </div>

            <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-15deg); }
        }
        .animate-wave {
          animation: wave 0.6s ease-in-out 2;
          display: inline-block;
          transform-origin: 70% 70%;
        }
      `}</style>
        </div>
    );
}

// Stat Card Component
function StatCard({
    icon,
    label,
    value,
    subtitle,
    trend,
    delay = 0
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    subtitle: React.ReactNode | string;
    trend?: 'up' | 'down';
    delay?: number;
}) {
    const [displayValue, setDisplayValue] = useState(0);
    const targetValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;

    useEffect(() => {
        if (targetValue === 0 || isNaN(targetValue)) {
            setDisplayValue(targetValue);
            return;
        }

        const duration = 1000;
        const steps = 30;
        const increment = targetValue / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
                setDisplayValue(targetValue);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [targetValue]);

    return (
        <Card
            variant="elevated"
            padding="md"
            hoverable
            className="animate-slide-up"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-wibl-sm bg-gradient-subtle flex items-center justify-center">
                    <div className="text-wibl-teal">
                        {icon}
                    </div>
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center gap-1 text-xs font-black",
                        trend === 'up' ? 'text-wibl-teal' : 'text-coral'
                    )}>
                        {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    </div>
                )}
            </div>
            <p className="text-sm font-black text-navy-500 uppercase tracking-wider mb-2">
                {label}
            </p>
            <p className="text-3xl font-display font-black text-navy-700 mb-2">
                {isNaN(targetValue) ? value : (
                    value.includes('€') ? `€${displayValue.toFixed(2)}` : displayValue.toLocaleString()
                )}
            </p>
            {typeof subtitle === 'string' ? (
                <p className="text-xs text-navy-400 font-medium">{subtitle}</p>
            ) : (
                subtitle
            )}
        </Card>
    );
}

// Agent Card Component
function AgentCard({
    agent,
    delay
}: {
    agent: typeof MOCK_AGENTS[0];
    delay: number;
}) {
    const statusConfig = {
        active: { color: 'teal' as const, label: 'Active' },
        paused: { color: 'warning' as const, label: 'Paused' },
        error: { color: 'error' as const, label: 'Error' },
    };

    return (
        <Card
            variant="elevated"
            padding="md"
            hoverable
            className="animate-slide-up"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-wibl gradient-brand flex items-center justify-center shrink-0 text-white font-display font-black text-lg">
                    {agent.initial}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-display font-black text-navy-700 truncate mb-1">
                        {agent.name}
                    </h3>
                    <Badge variant={statusConfig[agent.status].color} size="sm">
                        {statusConfig[agent.status].label}
                    </Badge>
                </div>
            </div>

            <p className="text-sm text-navy-500 font-medium mb-4">
                <span className="font-black text-wibl-teal">{agent.conversationsToday}</span> conversations today
            </p>

            <div className="flex gap-2">
                <Link href={`/agents/${agent.id}`} className="flex-1">
                    <Button variant="ghost" size="sm" className="w-full" leftIcon={<Eye size={14} />}>
                        View
                    </Button>
                </Link>
                <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={agent.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                >
                    {agent.status === 'active' ? 'Pause' : 'Resume'}
                </Button>
            </div>
        </Card>
    );
}

// Empty State Component
function EmptyState() {
    return (
        <Card variant="elevated" padding="lg" className="text-center py-12">
            {/* Abstract gradient illustration */}
            <div className="mb-6 flex justify-center">
                <div className="relative w-32 h-32">
                    <div className="absolute inset-0 gradient-brand rounded-full opacity-20 blur-2xl animate-pulse-soft" />
                    <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-wibl-mint rounded-full opacity-40 animate-float" />
                    <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-wibl-sky rounded-full opacity-40 animate-float" style={{ animationDelay: '1s' }} />
                    <div className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-wibl-teal rounded-full opacity-40 animate-float" style={{ animationDelay: '0.5s' }} />
                </div>
            </div>

            <h3 className="text-2xl font-display font-black text-navy-700 mb-2">
                Create your first AI agent
            </h3>
            <p className="text-navy-500 font-medium mb-6 max-w-md mx-auto">
                Tell Wibl what you need and watch the magic happen ✨
            </p>

            <Link href="/agents/new">
                <Button variant="coral" size="lg" leftIcon={<Rocket size={18} />}>
                    Create Agent
                </Button>
            </Link>
        </Card>
    );
}

// Activity Feed Component
function ActivityFeed({ activities }: { activities: typeof MOCK_ACTIVITY }) {
    const getActivityIcon = (type: typeof MOCK_ACTIVITY[0]['type']) => {
        switch (type) {
            case 'conversation':
                return <MessageCircle size={16} className="text-wibl-teal" />;
            case 'deploy':
                return <CheckCircle2 size={16} className="text-wibl-teal" />;
            case 'error':
                return <AlertCircle size={16} className="text-coral" />;
            default:
                return <Activity size={16} className="text-navy-400" />;
        }
    };

    return (
        <Card variant="elevated" padding="md">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-black text-navy-700">
                    Recent Activity
                </h3>
                <Link
                    href="/activity"
                    className="text-xs font-black text-wibl-teal hover:text-wibl-sky transition-colors"
                >
                    View all
                </Link>
            </div>

            <div className="space-y-3">
                {activities.map((activity, index) => (
                    <div
                        key={activity.id}
                        className="flex gap-3 animate-fade-in"
                        style={{ animationDelay: `${600 + index * 100}ms` }}
                    >
                        <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-subtle flex items-center justify-center">
                            {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-navy-700">
                                {activity.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="info" size="sm">
                                    {activity.agent}
                                </Badge>
                                <span className="text-[10px] text-navy-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Clock size={10} />
                                    {activity.timestamp}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

// API Health Widget Component
function APIHealthWidget() {
    const [isExpanded, setIsExpanded] = useState(false);
    const status = 'healthy' as 'healthy' | 'degraded' | 'down';

    const statusConfig = {
        healthy: {
            dot: 'bg-wibl-teal',
            text: 'All systems operational',
            icon: <CheckCircle2 size={16} className="text-wibl-teal" />,
        },
        degraded: {
            dot: 'bg-amber-500',
            text: 'Degraded performance',
            icon: <AlertCircle size={16} className="text-amber-500" />,
        },
        down: {
            dot: 'bg-coral',
            text: 'Service disruption',
            icon: <XCircle size={16} className="text-coral" />,
        },
    };

    return (
        <Card variant="elevated" padding="md">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-left"
            >
                <div className="flex items-center gap-3 mb-3">
                    <div className={cn("w-2.5 h-2.5 rounded-full animate-pulse-soft", statusConfig[status].dot)} />
                    <h3 className="font-display font-black text-navy-700 flex-1">
                        API Health
                    </h3>
                    <div className="text-navy-400">
                        {statusConfig[status].icon}
                    </div>
                </div>
            </button>

            <p className="text-sm font-medium text-navy-600 mb-2">
                {statusConfig[status].text}
            </p>
            <p className="text-xs text-navy-400 font-medium">
                Avg response: <span className="font-black text-wibl-teal">120ms</span>
            </p>

            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-navy-50 space-y-2 animate-slide-up">
                    <div className="flex justify-between text-xs">
                        <span className="text-navy-500 font-medium">Uptime</span>
                        <span className="font-black text-wibl-teal">99.9%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-navy-500 font-medium">Requests/min</span>
                        <span className="font-black text-navy-700">1,247</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-navy-500 font-medium">Error rate</span>
                        <span className="font-black text-navy-700">0.01%</span>
                    </div>
                </div>
            )}
        </Card>
    );
}
