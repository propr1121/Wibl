import React from 'react';
import { Button, GradientBorder } from '@/components/ui';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingCardProps {
    name: string;
    price: number | null;
    priceId: string | null | undefined;
    features: string[];
    popular?: boolean;
    agents: number;
    tools: number;
    onSelect: () => void;
    isCurrentPlan?: boolean;
    isLoading?: boolean;
    className?: string;
}

export function PricingCard({
    name,
    price,
    priceId,
    features,
    popular = false,
    agents,
    tools,
    onSelect,
    isCurrentPlan = false,
    isLoading = false,
    className,
}: PricingCardProps) {
    const formatPrice = (priceInCents: number | null) => {
        if (priceInCents === null) return 'Custom';
        return `€${(priceInCents / 100).toFixed(0)}`;
    };

    const CardContent = () => (
        <div className={cn(
            'relative p-8 rounded-wibl transition-all duration-300 h-full flex flex-col',
            popular
                ? 'bg-white shadow-wibl-lg'
                : 'bg-canvas-subtle hover:bg-white hover:shadow-wibl border-2 border-navy-100 hover:border-wibl-teal/30',
            'hover:scale-[1.02] active:scale-[0.98]',
            className
        )}>
            {/* Popular badge */}
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 gradient-brand text-white text-xs font-black rounded-full shadow-wibl-lg">
                        <Sparkles size={12} />
                        MOST POPULAR
                    </div>
                </div>
            )}

            {/* Plan name and limits */}
            <div className="space-y-2 mb-6">
                <h3 className="text-2xl font-display font-black text-navy-700">{name}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-xs text-navy-400 font-bold">Up to</span>
                    <span className="text-sm text-wibl-teal font-black">
                        {agents === Infinity ? '∞' : agents} {agents === 1 ? 'agent' : 'agents'}
                    </span>
                    {tools > 0 && (
                        <>
                            <span className="text-xs text-navy-400">•</span>
                            <span className="text-sm text-wibl-teal font-black">
                                {tools === Infinity ? '∞' : tools} {tools === 1 ? 'tool' : 'tools'}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Price */}
            <div className="mb-8">
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-display font-black text-gradient">
                        {formatPrice(price)}
                    </span>
                    {price !== null && (
                        <span className="text-navy-400 font-bold">/month</span>
                    )}
                </div>
                {price !== null && (
                    <p className="text-xs text-navy-400 font-medium mt-1">
                        Billed monthly
                    </p>
                )}
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8 flex-1">
                {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                        <div className="shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-wibl-teal/10 flex items-center justify-center">
                                <Check size={14} className="text-wibl-teal" strokeWidth={3} />
                            </div>
                        </div>
                        <span className="text-sm text-navy-600 font-medium leading-relaxed">
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <Button
                variant={popular ? 'coral' : 'secondary'}
                size="lg"
                className="w-full"
                onClick={onSelect}
                disabled={isCurrentPlan || isLoading || !priceId}
                isLoading={isLoading}
            >
                {isCurrentPlan ? 'Current Plan' : price === null ? 'Contact Sales' : 'Get Started'}
            </Button>

            {isCurrentPlan && (
                <p className="text-xs text-center text-wibl-teal font-black mt-3">
                    ✓ Active Plan
                </p>
            )}
        </div>
    );

    if (popular) {
        return (
            <GradientBorder animated width={3} className="h-full">
                <CardContent />
            </GradientBorder>
        );
    }

    return <CardContent />;
}
