"use client";

import React from 'react';
import { Card, Button, Badge } from '@/components/ui';
import {
    MessageCircle,
    Smartphone,
    Send,
    Slack,
    Loader2,
    QrCode
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChannelCardProps {
    type: 'whatsapp' | 'telegram' | 'slack' | 'web';
    status: 'connected' | 'disconnected' | 'pairing';
    onConnect: () => void;
}

export function ChannelCard({ type, status, onConnect }: ChannelCardProps) {
    const config = {
        whatsapp: {
            icon: <Smartphone className="text-[#25D366]" />,
            name: 'WhatsApp',
            description: 'Customer-facing chat via WhatsApp Business.',
            color: 'hover:border-[#25D366]/30 group-hover:bg-[#25D366]/5'
        },
        telegram: {
            icon: <Send className="text-[#0088cc]" />,
            name: 'Telegram',
            description: 'Direct communication via Telegram Bot.',
            color: 'hover:border-[#0088cc]/30 group-hover:bg-[#0088cc]/5'
        },
        slack: {
            icon: <Slack className="text-[#4A154B]" />,
            name: 'Slack',
            description: 'Enable AI in your internal Slack workspace.',
            color: 'hover:border-[#4A154B]/30 group-hover:bg-[#4A154B]/5'
        },
        web: {
            icon: <MessageCircle className="text-wibl-teal" />,
            name: 'Web Chat',
            description: 'Embeddable widget for your website.',
            color: 'hover:border-wibl-teal/30 group-hover:bg-wibl-teal/5'
        }
    }[type];

    return (
        <Card variant="glass" className={cn(
            "p-6 group transition-all duration-500",
            config.color,
            status === 'connected' && 'border-green-100 bg-green-50/10'
        )}>
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl border border-navy-50 group-hover:scale-110 transition-transform duration-500">
                    {config.icon}
                </div>
                <Badge
                    variant={status === 'connected' ? 'teal' : 'info'}
                    size="sm"
                    className="font-black uppercase tracking-widest text-[8px]"
                >
                    {status === 'connected' ? 'Connected' : 'Ready to Pair'}
                </Badge>
            </div>

            <h3 className="text-lg font-display font-black text-navy-900 mb-2 tracking-tight">
                {config.name}
            </h3>
            <p className="text-[13px] text-navy-500 font-medium leading-relaxed opacity-80 mb-6">
                {config.description}
            </p>

            <div className="mt-auto">
                {status === 'connected' ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full font-black uppercase tracking-widest text-[9px] border border-green-100 text-green-600 hover:bg-green-50"
                    >
                        Manage Session
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        size="sm"
                        className="w-full font-black uppercase tracking-widest text-[9px] shadow-glow"
                        leftIcon={status === 'pairing' ? <Loader2 className="animate-spin" size={14} /> : <QrCode size={14} />}
                        onClick={onConnect}
                        disabled={status === 'pairing'}
                    >
                        {status === 'pairing' ? 'Initializing...' : 'Pair Device'}
                    </Button>
                )}
            </div>
        </Card>
    );
}
