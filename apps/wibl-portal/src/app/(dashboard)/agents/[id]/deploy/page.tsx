"use client";

import React, { useState } from 'react';
import {
    ArrowLeft,
    Bot,
    Globe,
    MessageCircle,
    Slack,
    Smartphone,
    Check,
    Copy,
    Rocket,
    CheckCircle2,
    Settings,
    Monitor,
    Terminal,
    Loader2,
    Sun,
    Moon
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { useHeaderConfig } from '@/components/layouts/DashboardContext';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

// --- Types ---

interface Channel {
    id: string;
    name: string;
    icon: React.ReactNode;
    desc: string;
    complexity: 'Simple' | 'Medium' | 'Complex';
    setupSteps: string[];
}

interface WidgetOptions {
    position: 'bottom-right' | 'bottom-left' | 'center';
    primaryColor: string;
    greeting: string;
    theme: 'light' | 'dark';
    previewDevice: 'desktop' | 'mobile';
}

// --- Config ---

const CHANNELS: Channel[] = [
    {
        id: 'web',
        name: 'Web Widget',
        icon: <Globe size={24} />,
        desc: 'Embed a chat bubble on your website',
        complexity: 'Simple',
        setupSteps: ['Customize visual settings', 'Copy the script tag', 'Paste into your <head>']
    },
    {
        id: 'whatsapp',
        name: 'WhatsApp',
        icon: <MessageCircle size={24} />,
        desc: 'Connect to your business WhatsApp account',
        complexity: 'Medium',
        setupSteps: ['Scan QR code', 'Configure business profile', 'Verify number']
    },
    {
        id: 'telegram',
        name: 'Telegram',
        icon: <Bot size={24} />,
        desc: 'Deploy your agent as a Telegram bot',
        complexity: 'Simple',
        setupSteps: ['Create bot via @BotFather', 'Paste API token', 'Set commands']
    },
    {
        id: 'slack',
        name: 'Slack',
        icon: <Slack size={24} />,
        desc: 'Add agent to your Slack workspace',
        complexity: 'Simple',
        setupSteps: ['Install app via OAuth', 'Choose channels', 'Set bot name']
    },
    {
        id: 'discord',
        name: 'Discord',
        icon: <Bot size={24} />,
        desc: 'Add bot to your Discord server',
        complexity: 'Medium',
        setupSteps: ['Create App in Dev Portal', 'Add Bot user', 'Paste Token']
    },
    {
        id: 'api',
        name: 'Custom API',
        icon: <Terminal size={24} />,
        desc: 'Direct access via REST API',
        complexity: 'Complex',
        setupSteps: ['Generate API Key', 'Configure webhook URL', 'Integrate with SDK']
    }
];

// --- Utilities ---

function generateWidgetCode(agentId: string, options: WidgetOptions, framework: 'html' | 'react' | 'vue' = 'html'): string {
    if (framework === 'react') {
        return `
import { WiblWidget } from '@wibl/react';

function App() {
  return (
    <WiblWidget
      agentId="${agentId}"
      position="${options.position}"
      primaryColor="${options.primaryColor}"
      greeting="${options.greeting}"
      theme="${options.theme}"
    />
  );
}
    `.trim();
    }

    if (framework === 'vue') {
        return `
<template>
  <WiblWidget
    agentId="${agentId}"
    :position="'${options.position}'"
    :primaryColor="'${options.primaryColor}'"
    :greeting="'${options.greeting}'"
    :theme="'${options.theme}'"
  />
</template>

<script setup>
import { WiblWidget } from '@wibl/vue';
</script>
    `.trim();
    }

    return `
<!-- Wibl Chat Widget -->
<script>
  window.wiblConfig = {
    agentId: '${agentId}',
    position: '${options.position}',
    primaryColor: '${options.primaryColor}',
    greeting: '${options.greeting}',
    theme: '${options.theme}'
  };
</script>
<script src="https://cdn.wibl.io/widget.js" async></script>
  `.trim();
}

// --- Page Component ---

export default function AgentDeployPage() {
    const params = useParams();
    const router = useRouter();
    const agentId = params.id as string;

    const [selectedChannels, setSelectedChannels] = useState<string[]>(['web']);
    const [activeFramework, setActiveFramework] = useState<'html' | 'react' | 'vue'>('html');
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployProgress, setDeployProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [copied, setCopied] = useState(false);

    const [widgetOptions, setWidgetOptions] = useState<WidgetOptions>({
        position: 'bottom-right',
        primaryColor: '#4ECDC4',
        greeting: 'How can I assist you today?',
        theme: 'light',
        previewDevice: 'desktop'
    });

    useHeaderConfig({
        title: 'Deployment',
        breadcrumbs: [
            { label: 'Agents', href: '/agents' },
            { label: 'Agent Details', href: `/agents/${agentId}` },
            { label: 'Deploy' }
        ],
    });

    const handleDeploy = () => {
        setIsDeploying(true);
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            setDeployProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    setIsDeploying(false);
                    setIsComplete(true);
                }, 500);
            }
        }, 100);
    };

    const copyCode = () => {
        const code = generateWidgetCode(agentId, widgetOptions, activeFramework);
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-4">
                    <Link href={`/agents/${agentId}`}>
                        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={16} />}>
                            Back to Agent
                        </Button>
                    </Link>
                    <div className="h-8 w-px bg-navy-100 mx-2" />
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white font-display font-black">
                            A
                        </div>
                        <div>
                            <h1 className="text-xl font-display font-black text-navy-800">Support Agent</h1>
                            <Badge variant="warning" size="sm">Draft</Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Left: Channel Selection (2 cols) */}
                <div className="lg:col-span-2 space-y-12">
                    <section className="space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-display font-black text-navy-700">Choose Channels</h2>
                            <p className="text-navy-500 font-medium">Where should your agent be active?</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {CHANNELS.map(channel => (
                                <ChannelCard
                                    key={channel.id}
                                    channel={channel}
                                    isSelected={selectedChannels.includes(channel.id)}
                                    onToggle={() => {
                                        if (selectedChannels.includes(channel.id)) {
                                            if (selectedChannels.length > 1) {
                                                setSelectedChannels(selectedChannels.filter(id => id !== channel.id));
                                            }
                                        } else {
                                            setSelectedChannels([...selectedChannels, channel.id]);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </section>

                    {selectedChannels.includes('web') && (
                        <section className="space-y-6 animate-slide-up">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-display font-black text-navy-700">Web Widget Setup</h2>
                                <p className="text-navy-500 font-medium">Customize your website encounter</p>
                            </div>

                            <Card variant="elevated" className="overflow-hidden p-0">
                                <div className="grid md:grid-cols-2">
                                    {/* Settings */}
                                    <div className="p-8 space-y-6 border-r border-navy-50">
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-navy-400 uppercase tracking-widest">Position</label>
                                            <div className="flex gap-2">
                                                {(['bottom-right', 'bottom-left', 'center'] as const).map(pos => (
                                                    <button
                                                        key={pos}
                                                        onClick={() => setWidgetOptions({ ...widgetOptions, position: pos })}
                                                        className={cn(
                                                            "flex-1 py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                                            widgetOptions.position === pos
                                                                ? "bg-navy-700 text-white shadow-lg"
                                                                : "bg-navy-50 text-navy-400 hover:bg-navy-100"
                                                        )}
                                                    >
                                                        {pos.replace('-', ' ')}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-navy-400 uppercase tracking-widest">Colors</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={widgetOptions.primaryColor}
                                                    onChange={(e) => setWidgetOptions({ ...widgetOptions, primaryColor: e.target.value })}
                                                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-navy-100 border-2"
                                                />
                                                <span className="text-sm font-black text-navy-600 font-mono tracking-tighter uppercase">{widgetOptions.primaryColor}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-navy-400 uppercase tracking-widest">Greeting</label>
                                            <textarea
                                                value={widgetOptions.greeting}
                                                onChange={(e) => setWidgetOptions({ ...widgetOptions, greeting: e.target.value })}
                                                className="w-full bg-navy-50 border-2 border-transparent focus:border-wibl-teal rounded-xl px-4 py-3 outline-none transition-all font-medium text-sm h-24 resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Preview */}
                                    <div className={cn(
                                        "p-8 flex flex-col items-center transition-colors duration-300",
                                        widgetOptions.theme === 'dark' ? "bg-navy-900" : "bg-navy-50/50"
                                    )}>
                                        <div className="flex items-center justify-between w-full mb-6">
                                            <span className={cn(
                                                "text-xs font-black uppercase tracking-widest",
                                                widgetOptions.theme === 'dark' ? "text-navy-400" : "text-navy-400"
                                            )}>Live Preview</span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setWidgetOptions({ ...widgetOptions, theme: widgetOptions.theme === 'light' ? 'dark' : 'light' })}
                                                    className={cn(
                                                        "p-1.5 rounded-lg transition-all",
                                                        widgetOptions.theme === 'dark' ? "bg-white/10 text-white" : "bg-white shadow-sm text-navy-600"
                                                    )}
                                                >
                                                    {widgetOptions.theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                                                </button>
                                                <div className="w-px h-4 bg-navy-200/20 my-auto mx-1" />
                                                <button onClick={() => setWidgetOptions({ ...widgetOptions, previewDevice: 'desktop' })} className={cn("p-1.5 rounded-lg", widgetOptions.previewDevice === 'desktop' ? "bg-white shadow-sm text-wibl-teal" : "text-navy-300")}>
                                                    <Monitor size={16} />
                                                </button>
                                                <button onClick={() => setWidgetOptions({ ...widgetOptions, previewDevice: 'mobile' })} className={cn("p-1.5 rounded-lg", widgetOptions.previewDevice === 'mobile' ? "bg-white shadow-sm text-wibl-teal" : "text-navy-300")}>
                                                    <Smartphone size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className={cn(
                                            "rounded-2xl shadow-2xl transition-all duration-500 relative border-4",
                                            widgetOptions.theme === 'dark' ? "bg-navy-800 border-navy-700" : "bg-white border-navy-100",
                                            widgetOptions.previewDevice === 'desktop' ? "w-full aspect-video" : "w-48 aspect-[9/16]"
                                        )}>
                                            {/* Mock website content */}
                                            <div className="p-4 space-y-2 opacity-10">
                                                <div className={cn("w-2/3 h-4 rounded-full", widgetOptions.theme === 'dark' ? "bg-white" : "bg-navy-900")} />
                                                <div className={cn("w-full h-2 rounded-full", widgetOptions.theme === 'dark' ? "bg-white" : "bg-navy-900")} />
                                                <div className={cn("w-full h-2 rounded-full", widgetOptions.theme === 'dark' ? "bg-white" : "bg-navy-900")} />
                                            </div>

                                            {/* Widget bubble */}
                                            <div
                                                className={cn(
                                                    "absolute w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 scale-75",
                                                    widgetOptions.position === 'bottom-right' ? "bottom-4 right-4" :
                                                        widgetOptions.position === 'bottom-left' ? "bottom-4 left-4" : "bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2"
                                                )}
                                                style={{ backgroundColor: widgetOptions.primaryColor }}
                                            >
                                                <MessageCircle size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-4">
                                        {(['html', 'react', 'vue'] as const).map(lib => (
                                            <button
                                                key={lib}
                                                onClick={() => setActiveFramework(lib)}
                                                className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest transition-all pb-1 border-b-2",
                                                    activeFramework === lib ? "text-wibl-teal border-wibl-teal" : "text-navy-300 border-transparent hover:text-navy-400"
                                                )}
                                            >
                                                {lib}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={copyCode}
                                        className="flex items-center gap-2 text-xs font-black text-wibl-teal hover:text-wibl-sky transition-colors"
                                    >
                                        {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                                        {copied ? 'Copied!' : 'Copy Snippet'}
                                    </button>
                                </div>
                                <div className="bg-navy-900 rounded-2xl p-6 font-mono text-sm text-teal-300 overflow-x-auto whitespace-pre border-4 border-navy-800 shadow-xl min-h-[200px]">
                                    {generateWidgetCode(agentId, widgetOptions, activeFramework)}
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                {/* Right: Summary & Action */}
                <div className="space-y-8">
                    <Card variant="elevated" padding="lg" className="sticky top-24 bg-white/80 backdrop-blur-sm border-navy-50">
                        <h3 className="text-xl font-display font-black text-navy-800 mb-6">Deployment Summary</h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-navy-500 font-medium">Selected Channels</span>
                                <span className="font-black text-navy-700">{selectedChannels.length}</span>
                            </div>
                            <div className="space-y-2">
                                {CHANNELS.filter(c => selectedChannels.includes(c.id)).map(c => (
                                    <div key={c.id} className="flex items-center gap-2 p-2 bg-navy-50 rounded-lg">
                                        <div className="text-wibl-teal">{c.icon}</div>
                                        <span className="text-xs font-black text-navy-800">{c.name}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-4 border-t border-navy-50 flex justify-between items-center">
                                <span className="text-sm text-navy-500 font-medium">Complexity</span>
                                <Badge variant="info" size="sm">Medium</Badge>
                            </div>
                        </div>

                        <Button
                            variant="coral"
                            size="lg"
                            className="w-full h-16 text-lg shadow-wibl-coral animate-bounce-hover"
                            onClick={handleDeploy}
                            disabled={isDeploying || isComplete}
                            leftIcon={isDeploying ? <Loader2 className="animate-spin" size={24} /> : <Rocket size={24} />}
                        >
                            {isDeploying ? 'Deploying...' : isComplete ? 'Deployed ✅' : `Launch Agent!`}
                        </Button>

                        {isDeploying && (
                            <div className="mt-4 space-y-2 animate-fade-in">
                                <div className="flex justify-between items-center text-[10px] font-black text-navy-400 uppercase tracking-widest">
                                    <span>Provisioning Resources...</span>
                                    <span>{deployProgress}%</span>
                                </div>
                                <div className="h-2 bg-navy-50 rounded-full overflow-hidden">
                                    <div className="h-full gradient-brand animate-pulse transition-all duration-300" style={{ width: `${deployProgress}%` }} />
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Setup Tips */}
                    <div className="p-6 bg-gradient-subtle rounded-wibl border border-navy-50 space-y-4">
                        <div className="flex items-center gap-2 text-wibl-teal">
                            <Settings size={18} />
                            <h4 className="font-black text-xs uppercase tracking-widest">Dev Best Practices</h4>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-xs text-navy-600 font-medium leading-relaxed">
                                <Badge variant="teal" size="sm" className="shrink-0 h-5 w-5 flex items-center justify-center p-0">1</Badge>
                                Test on a staging environment before public launch.
                            </li>
                            <li className="flex gap-3 text-xs text-navy-600 font-medium leading-relaxed">
                                <Badge variant="teal" size="sm" className="shrink-0 h-5 w-5 flex items-center justify-center p-0">2</Badge>
                                Configure safety boundaries for your agent response length.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {isComplete && <SuccessOverlay agentName="Support Agent" onDashboard={() => router.push('/dashboard')} />}
        </div>
    );
}

// --- Sub-components ---

function ChannelCard({
    channel,
    isSelected,
    onToggle
}: {
    channel: Channel,
    isSelected: boolean,
    onToggle: () => void
}) {
    return (
        <Card
            hoverable={!isSelected}
            onClick={onToggle}
            className={cn(
                "relative cursor-pointer transition-all duration-300 p-6 group h-full",
                isSelected
                    ? "border-wibl-teal ring-4 ring-wibl-teal/5 bg-white scale-[1.02] shadow-xl"
                    : "bg-white border-navy-50 hover:bg-navy-50/30"
            )}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                    isSelected ? "gradient-brand text-white shadow-lg" : "bg-navy-50 text-navy-400 group-hover:scale-110"
                )}>
                    {channel.icon}
                </div>
                {isSelected && (
                    <div className="bg-wibl-teal text-white p-1 rounded-full animate-fade-in">
                        <Check size={14} />
                    </div>
                )}
            </div>
            <div className="space-y-2">
                <h3 className="font-display font-black text-navy-800 text-lg">{channel.name}</h3>
                <p className="text-xs text-navy-500 font-medium leading-relaxed">{channel.desc}</p>
            </div>

            <div className="mt-6 flex items-center gap-2">
                <span className="text-[10px] font-black text-navy-300 uppercase tracking-widest">Complexity:</span>
                <span className={cn(
                    "text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full",
                    channel.complexity === 'Simple' ? "bg-teal-50 text-teal-600" :
                        channel.complexity === 'Medium' ? "bg-amber-50 text-amber-600" : "bg-coral/10 text-coral"
                )}>
                    {channel.complexity}
                </span>
            </div>

            {isSelected && (
                <div className="mt-6 pt-6 border-t border-navy-50 space-y-3 animate-slide-up">
                    <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Setup Steps</p>
                    <div className="space-y-2">
                        {channel.setupSteps.map((step, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-navy-600 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-wibl-teal" />
                                {step}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}

function SuccessOverlay({ agentName, onDashboard }: { agentName: string, onDashboard: () => void }) {
    return (
        <div className="fixed inset-0 bg-white/95 z-[100] flex items-center justify-center animate-fade-in overflow-hidden">
            {/* Particles */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-wibl-mint rounded-full blur-[100px] animate-pulse-soft" />
                <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-wibl-coral rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
            </div>

            <div className="max-w-md w-full text-center px-6 relative z-10">
                <div className="mb-10 flex justify-center">
                    <div className="w-24 h-24 rounded-full gradient-brand flex items-center justify-center text-white scale-[2] shadow-2xl animate-bounce">
                        <CheckCircle2 size={48} />
                    </div>
                </div>

                <div className="space-y-4 mb-12">
                    <h2 className="text-4xl font-display font-black text-navy-800 leading-tight">
                        {agentName} is Live!
                    </h2>
                    <p className="text-navy-500 font-medium text-lg">
                        Your agent is now active and ready to handle conversations across your selected channels.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <Button variant="primary" size="lg" className="h-16 text-lg" onClick={onDashboard}>
                        Enter Workspace
                    </Button>
                    <button className="text-navy-400 font-black text-xs uppercase tracking-widest hover:text-navy-600 transition-colors">
                        View Deployment Logs
                    </button>
                </div>
            </div>
        </div>
    );
}
