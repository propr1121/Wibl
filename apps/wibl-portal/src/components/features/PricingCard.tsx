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
            'relative p-8 rounded-[32px] transition-all duration-500 h-full flex flex-col group overflow-hidden',
            popular
                ? 'bg-white shadow-2xl border border-wibl-teal/30 scale-[1.02] z-10'
                : 'bg-white/50 border border-navy-100 hover:border-wibl-teal/20 hover:bg-white transition-colors shadow-sm',
            className
        )}>
            {/* Background Hit for Popular */}
            {popular && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-wibl-teal/10 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
            )}

            {/* Popular badge */}
            {popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-1.5 px-5 py-2 gradient-brand text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-glow">
                        <Sparkles size={12} className="animate-pulse" />
                        Most Popular
                    </div>
                </div>
            )}

            {/* Plan name and limits */}
            <div className="space-y-1 mb-6">
                <h3 className="text-2xl font-display font-black text-navy-900 tracking-tighter">{name}</h3>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-wibl-teal uppercase tracking-widest bg-wibl-teal/10 px-2 py-0.5 rounded-md">
                        {agents === Infinity ? 'Unlimited' : agents} {agents === 1 ? 'Agent' : 'Agents'}
                    </span>
                    {tools > 0 && (
                        <span className="text-[10px] font-black text-navy-400 uppercase tracking-widest border border-navy-100 px-2 py-0.5 rounded-md">
                            {tools === Infinity ? '∞' : tools} Tools
                        </span>
                    )}
                </div>
            </div>

            {/* Price */}
            <div className="mb-8">
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-display font-black text-navy-900 tracking-tighter leading-none">
                        {formatPrice(price)}
                    </span>
                    {price !== null && (
                        <span className="text-sm text-navy-400 font-bold uppercase tracking-widest ml-1">/ mo</span>
                    )}
                </div>
                {price !== null && (
                    <p className="text-[10px] text-navy-300 font-black uppercase tracking-widest mt-2 ml-1">
                        Billed Monthly
                    </p>
                )}
            </div>

            {/* Features */}
            <div className="mb-8 pt-8 border-t border-navy-50 flex-1">
                <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest mb-4">Included Features</p>
                <ul className="space-y-4">
                    {features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                            <div className="shrink-0 mt-0.5">
                                <div className="w-5 h-5 rounded-full bg-wibl-mint/10 flex items-center justify-center">
                                    <Check size={12} className="text-wibl-mint" strokeWidth={4} />
                                </div>
                            </div>
                            <span className="text-[13px] text-navy-600 font-medium leading-tight">
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* CTA */}
            <Button
                variant={popular ? 'primary' : 'ghost'}
                size="lg"
                className={cn(
                    "w-full py-7 font-black tracking-widest text-[11px] uppercase transition-all duration-300",
                    popular ? "shadow-glow" : "border-navy-100 hover:border-navy-900"
                )}
                onClick={onSelect}
                disabled={isCurrentPlan || isLoading || !priceId}
                isLoading={isLoading}
            >
                {isCurrentPlan ? 'Active Plan' : price === null ? 'Contact Enterprise' : 'Select Plan'}
            </Button>
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
