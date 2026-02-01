import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { GradientBorder } from '@/components/ui/gradient-border';

interface PricingCardProps {
    name: string;
    price: number | null;
    features: string[];
    popular?: boolean;
    ctaText?: string;
    onCtaClick?: () => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
    name,
    price,
    features,
    popular = false,
    ctaText = "Get Started",
    onCtaClick
}) => {
    const CardContent = (
        <Card
            variant={popular ? 'elevated' : 'outlined'}
            padding="lg"
            className={cn(
                "h-full flex flex-col gap-8 transition-all hover:scale-[1.02]",
                popular && "shadow-wibl-lg border-wibl-teal/20"
            )}
        >
            <div className="space-y-2">
                {popular && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-wibl-teal bg-wibl-mint/10 px-2 py-0.5 rounded-full border border-wibl-mint/20">
                        Most Popular
                    </span>
                )}
                <h3 className="text-2xl font-display font-black text-navy-700">{name}</h3>
                <div className="flex items-baseline gap-1">
                    {price !== null ? (
                        <>
                            <span className="text-4xl font-display font-black text-navy-800">€{price / 100}</span>
                            <span className="text-navy-400 font-bold">/mo</span>
                        </>
                    ) : (
                        <span className="text-3xl font-display font-black text-navy-800">Custom</span>
                    )}
                </div>
            </div>

            <ul className="flex-1 space-y-4">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-navy-500">
                        <Check size={18} className="text-wibl-teal mt-0.5 shrink-0" />
                        {feature}
                    </li>
                ))}
            </ul>

            <Button
                variant={popular ? 'coral' : 'secondary'}
                size="lg"
                className="w-full"
                onClick={onCtaClick}
            >
                {ctaText}
            </Button>
        </Card>
    );

    if (popular) {
        return (
            <GradientBorder width={2} animated className="h-full">
                {CardContent}
            </GradientBorder>
        );
    }

    return CardContent;
};
