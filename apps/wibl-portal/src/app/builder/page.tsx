'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Clock, Zap, Check, LayoutDashboard, RefreshCw, X, Telescope } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import { LoadingDots } from '@/components/ui/loading-dots';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface AgentConfig {
    name?: string;
    purpose?: string;
    description?: string;
    personality?: string;
    channels?: string[];
    integrations?: Record<string, any>;
    safetySettings?: string[];
    responseStyle?: string;
    personalityDetail?: string;
}

export default function AIAgentBuilder() {
    const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isThinking, setThinking] = useState(false);
    const [extractedConfig, setExtractedConfig] = useState<AgentConfig>({});
    const [phase, setPhase] = useState<'discovery' | 'configuration' | 'validation' | 'complete'>('discovery');
    const [isComplete, setIsComplete] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const [isDeployed, setIsDeployed] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isThinking]);

    // Start conversation on mount
    useEffect(() => {
        startConversation();
    }, []);

    const startConversation = async () => {
        setThinking(true);
        try {
            const response = await fetch('/api/wizard/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId }),
            });

            const data = await response.json();

            setMessages([{
                role: 'assistant',
                content: data.message,
                timestamp: new Date(),
            }]);

            if (data.extractedData) {
                setExtractedConfig(prev => ({ ...prev, ...data.extractedData }));
            }

            setPhase(data.phase);
            setIsComplete(data.isComplete);
        } catch (error) {
            console.error('Failed to start conversation:', error);
        } finally {
            setThinking(false);
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || isThinking || isDeployed) return;

        const userMessage: Message = {
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setThinking(true);

        try {
            const response = await fetch('/api/wizard/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    message: userMessage.content,
                }),
            });

            const data = await response.json();

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.message,
                timestamp: new Date(),
            }]);

            if (data.extractedData) {
                setExtractedConfig(prev => ({ ...prev, ...data.extractedData }));
            }

            setPhase(data.phase);
            setIsComplete(data.isComplete);
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble connecting. Please try again.",
                timestamp: new Date(),
            }]);
        } finally {
            setThinking(false);
        }
    };

    const handleDeploy = async () => {
        setIsDeploying(true);
        try {
            // Prepare payload for /api/agents
            const payload = {
                name: extractedConfig.name || 'New AI Agent',
                description: extractedConfig.purpose || extractedConfig.description || 'Built with Wibl AI',
                avatar_url: null,
                personality: {
                    tone: extractedConfig.personality || 'professional',
                    customTraits: extractedConfig.personalityDetail ? [extractedConfig.personalityDetail] : [],
                    greetingMessage: `Hello! I'm ${extractedConfig.name || 'your agent'}. How can I help you today?`,
                },
                capabilities: {
                    allowedActions: [],
                    restrictedTopics: ["General advice only", "No legal advice"],
                },
                knowledge_source_ids: [],
                tool_connection_ids: [],
                context_rules: {
                    systemPromptAdditions: `Context Style: ${extractedConfig.responseStyle || 'Normal'}`,
                    responseFormat: 'conversational',
                    maxTokens: 2000,
                },
                deployment: {
                    status: 'active',
                    channels: extractedConfig.channels || ['web'],
                    gatewayUrl: null,
                    deployedAt: null,
                },
                security: {
                    inputSanitization: true,
                    outputValidation: extractedConfig.safetySettings?.includes('validation') || false,
                    promptInjectionProtection: extractedConfig.safetySettings?.includes('sandbox') ? 'strict' : 'basic',
                    piiRedaction: extractedConfig.safetySettings?.includes('redaction') || false,
                    rateLimits: {
                        requestsPerMinute: 60,
                        tokensPerHour: 100000,
                    },
                },
            };

            const response = await fetch('/api/agents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to deploy agent');
            }

            // Success celebration!
            setIsDeployed(true);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#00F2EA', '#FF3D6E', '#1A2B4C']
            });
        } catch (error) {
            console.error('Error deploying agent:', error);
        } finally {
            setIsDeploying(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const getPhaseInfo = () => {
        const phases = {
            discovery: { label: 'Discovery', icon: Telescope, color: 'text-wibl-teal' },
            configuration: { label: 'Configuration', icon: Zap, color: 'text-blue-600' },
            validation: { label: 'Validation', icon: CheckCircle2, color: 'text-green-600' },
            complete: { label: 'Complete', icon: CheckCircle2, color: 'text-green-600' },
        };
        // Use discovery as fallback if phase is undefined or unknown
        return phases[phase as keyof typeof phases] || phases.discovery;
    };

    const phaseInfo = getPhaseInfo();
    const PhaseIcon = phaseInfo.icon || Sparkles;

    return (
        <div className="h-screen bg-white z-50 flex flex-col lg:flex-row overflow-hidden font-sans">
            {isDeployed && <SuccessOverlay name={extractedConfig.name || 'Agent'} />}

            {/* Left Column: Wibl Guide & Brand (35%) */}
            <div className="w-full lg:w-[32%] bg-navy-900 flex flex-col items-center justify-center p-8 lg:p-12 relative overflow-hidden shrink-0">
                {/* Background effects */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500 opacity-20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-coral-dark opacity-10 blur-[120px] rounded-full" />

                {/* Back Button */}
                <Link
                    href="/agents"
                    className="absolute top-8 left-8 text-navy-400 hover:text-white transition-colors flex items-center gap-2 font-black uppercase tracking-wider text-xs z-20"
                >
                    <ArrowRight size={16} className="rotate-180" /> Back to Dashboard
                </Link>

                {/* Wibl Mascot / Pulsating Logo */}
                <div className="relative mb-12 group">
                    {/* Glowing outer rings */}
                    <div className="absolute inset-[-40px] rounded-full bg-teal-400/10 blur-[80px] animate-pulse-soft" />
                    <div className={cn(
                        "absolute inset-[-25px] rounded-full border border-teal-400/20 transition-all duration-1000",
                        isThinking ? "animate-spin-slow opacity-100 scale-110 border-solid border-teal-400/40" : "opacity-40"
                    )} />

                    <div className="w-40 h-40 lg:w-52 lg:h-52 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 p-1.5 shadow-[0_0_100px_rgba(0,242,234,0.12)] relative z-10 flex items-center justify-center transition-all duration-500 hover:animate-logo-pulsate">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden p-16 lg:p-20">
                            <div className="text-4xl lg:text-5xl font-display font-black relative">
                                <span className="text-teal-500 leading-none uppercase">W</span>
                                <span className="text-navy-900 leading-none absolute left-[82%] bottom-0">.</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center z-10">
                    <h2 className="text-3xl lg:text-5xl font-display font-black mb-2 tracking-tight">
                        <span className="text-teal-400">W</span><span className="text-white">ibl</span><span className="text-teal-400">.</span>
                    </h2>
                    <p className="text-navy-300 font-bold text-lg mb-16 opacity-50 tracking-wide uppercase text-[10px]">
                        Conversational Builder
                    </p>

                    {/* Phase Tracker Dots (Simplified from old stepped dots) */}
                    <div className="flex items-center justify-center gap-3">
                        {['discovery', 'configuration', 'validation', 'complete'].map((p, i) => (
                            <div
                                key={p}
                                title={p.charAt(0).toUpperCase() + p.slice(1)}
                                className={cn(
                                    "w-3 h-3 rounded-full transition-all duration-500",
                                    phase === p ? "w-8 bg-teal-400 scale-110 shadow-lg shadow-teal-400/40" :
                                        messages.some(m => m.role === 'assistant') && i <= ['discovery', 'configuration', 'validation', 'complete'].indexOf(phase)
                                            ? "bg-teal-400/60" : "bg-navy-700/50"
                                )}
                            />
                        ))}
                    </div>
                    <div className="flex flex-col items-center mt-8">
                        <p className="text-navy-500 font-black uppercase tracking-[0.3em] text-[11px] border-b border-navy-800 pb-1 mb-2 w-12 text-center">
                            Phase
                        </p>
                        <p className="text-teal-400 font-black uppercase tracking-[0.2em] text-[10px] opacity-90">
                            {phaseInfo.label}
                        </p>
                    </div>
                </div>

                {/* Bottom Guide Text */}
                <div className="absolute bottom-12 left-0 right-0 px-12 text-center text-navy-400 text-xs font-medium opacity-40">
                    Proprietary Wisdom-First Architecture &copy; 2026 Wibl.
                </div>
            </div>

            {/* Main Builder Area: Chat + Extraction */}
            <div className="flex-1 flex overflow-hidden relative bg-canvas-subtle">

                {/* Middle Section: Chat Interface */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <div className="border-b border-navy-100 bg-white/80 backdrop-blur-sm z-10">
                        <div className="mx-auto w-full px-8 py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl font-bold text-navy-900">Agent Architect</h1>
                                    <p className="text-xs text-navy-500 mt-1">
                                        Describe your mission. We'll build the brain together.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-navy-50 rounded-lg border border-navy-100 shrink-0">
                                        <PhaseIcon size={14} className={phaseInfo.color} />
                                        <span className="text-xs font-bold text-navy-700 uppercase tracking-tight">{phaseInfo.label}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto scroll-smooth">
                        <div className="max-w-3xl mx-auto px-8 py-8 space-y-8">
                            {messages.map((message, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex gap-4 items-start animate-reveal",
                                        message.role === 'user' && "flex-row-reverse"
                                    )}
                                >
                                    {/* Avatar */}
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border",
                                        message.role === 'user'
                                            ? "bg-navy-900 border-navy-700"
                                            : "bg-gradient-to-br from-teal-400 to-teal-600 border-teal-500"
                                    )}>
                                        {message.role === 'user' ? (
                                            <span className="text-[10px] font-bold text-white">ME</span>
                                        ) : (
                                            <div className="text-sm font-display font-black relative">
                                                <span className="text-white leading-none uppercase">W</span>
                                                <span className="text-navy-900 leading-none absolute left-[82%] bottom-0">.</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Message */}
                                    <div className={cn(
                                        "max-w-[85%] sm:max-w-xl text-[14px] leading-relaxed whitespace-pre-line",
                                        message.role === 'user'
                                            ? "px-6 py-4 bg-navy-900 text-white rounded-2xl shadow-sm"
                                            : "text-navy-800 py-1"
                                    )}>
                                        {message.content}
                                    </div>
                                </div>
                            ))}

                            {/* Thinking Indicator */}
                            {isThinking && (
                                <div className="flex gap-4 items-start animate-reveal opacity-50">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border bg-gradient-to-br from-teal-400 to-teal-600 border-teal-500">
                                        <div className="text-sm font-display font-black relative">
                                            <span className="text-white leading-none uppercase">W</span>
                                            <span className="text-navy-900 leading-none absolute left-[82%] bottom-0">.</span>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <LoadingDots color="gray" size="sm" />
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-navy-100 bg-white/80 backdrop-blur-sm z-10 px-8 py-6">
                        <div className="max-w-3xl mx-auto">
                            <div className="relative">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Brief your agent architect..."
                                    disabled={isThinking || isComplete || isDeployed}
                                    className="w-full min-h-[56px] max-h-[200px] bg-white border border-navy-100 rounded-2xl px-6 py-4 pr-16 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 resize-none disabled:bg-navy-50 disabled:text-navy-400 shadow-premium-sm transition-all"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim() || isThinking || isComplete || isDeployed}
                                    className={cn(
                                        "absolute bottom-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                        input.trim() && !isThinking && !isComplete && !isDeployed
                                            ? "bg-teal-500 text-white hover:bg-teal-600 shadow-lg shadow-teal-500/20"
                                            : "bg-navy-100 text-navy-300 cursor-not-allowed"
                                    )}
                                >
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                            <p className="text-center text-[9px] font-bold text-navy-300 uppercase tracking-widest mt-4 opacity-60">
                                WIBL AI ENGINE v4.2 &bull; Contextually Aware &bull; Strictly Private
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Config Sidebar */}
                <div className="w-80 lg:w-96 border-l border-navy-100 bg-white flex flex-col shrink-0 hidden xl:flex">
                    {/* Sidebar Header */}
                    <div className="px-6 py-6 pb-2">
                        <h2 className="text-[10px] font-black text-navy-900 uppercase tracking-[0.2em] flex items-center gap-2">
                            Intelligence Store
                        </h2>
                        <p className="text-[10px] text-navy-400 font-bold uppercase tracking-tight opacity-60 mt-1">
                            Extracted logic & personality traits
                        </p>
                    </div>

                    {/* Config Items */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {Object.keys(extractedConfig).length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <Clock size={40} className="mx-auto text-navy-100 mb-4" />
                                <p className="text-[11px] text-navy-300 font-bold uppercase tracking-widest">
                                    Listening for directives...
                                </p>
                            </div>
                        ) : (
                            <>
                                {extractedConfig.name && (
                                    <ConfigItem
                                        label="Agent Name"
                                        value={extractedConfig.name}
                                        icon="✨"
                                    />
                                )}
                                {extractedConfig.purpose && (
                                    <ConfigItem
                                        label="Mission"
                                        value={extractedConfig.purpose}
                                        icon="🎯"
                                    />
                                )}
                                {extractedConfig.personality && (
                                    <ConfigItem
                                        label="Persona"
                                        value={extractedConfig.personality}
                                        icon="🎭"
                                    />
                                )}
                                {extractedConfig.channels && extractedConfig.channels.length > 0 && (
                                    <ConfigItem
                                        label="Activation"
                                        value={extractedConfig.channels.join(', ')}
                                        icon="📡"
                                    />
                                )}
                                {extractedConfig.integrations && Object.keys(extractedConfig.integrations).length > 0 && (
                                    <ConfigItem
                                        label="Neural Links"
                                        value={Object.keys(extractedConfig.integrations).join(', ')}
                                        icon="🔌"
                                    />
                                )}
                            </>
                        )}
                    </div>

                    {/* Action Button */}
                    {(isComplete || phase === 'validation' || phase === 'complete') && (
                        <div className="border-t border-navy-100 p-6 bg-navy-50/30">
                            <button
                                onClick={handleDeploy}
                                disabled={isDeploying || isDeployed}
                                className={cn(
                                    "w-full py-4 font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-premium flex items-center justify-center gap-3",
                                    isDeploying || isDeployed
                                        ? "bg-navy-100 text-navy-300 cursor-not-allowed"
                                        : "bg-teal-500 text-white hover:bg-teal-600 shadow-teal-500/20 active:scale-95"
                                )}
                            >
                                {isDeploying ? (
                                    <RefreshCw className="animate-spin" size={18} />
                                ) : (
                                    <Zap size={18} />
                                )}
                                {isDeploying ? 'Deploying...' : 'Activate Agent'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
                @keyframes logo-pulsate {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                .animate-logo-pulsate {
                    animation: logo-pulsate 4s ease-in-out infinite;
                }
                @keyframes pulse-soft {
                    0%, 100% { transform: scale(1); opacity: 0.1; }
                    50% { transform: scale(1.1); opacity: 0.15; }
                }
                .animate-pulse-soft {
                    animation: pulse-soft 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

function ConfigItem({ label, value, icon }: { label: string; value: string; icon: string }) {
    return (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 animate-reveal">
            <div className="flex items-start gap-3">
                <span className="text-2xl">{icon}</span>
                <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        {label}
                    </div>
                    <div className="text-sm text-slate-900 font-medium break-words leading-tight">
                        {value}
                    </div>
                </div>
                <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
            </div>
        </div>
    );
}

function SuccessOverlay({ name }: { name: string }) {
    return (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xl z-[100] flex items-center justify-center animate-fade-in overflow-hidden">
            <div className="max-w-md w-full text-center px-10 animate-reveal">
                <div className="mb-10 flex justify-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 p-1 shadow-2xl relative">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center text-white animate-bounce-subtle">
                                <Check size={40} strokeWidth={3} />
                            </div>
                        </div>
                        <div className="absolute -inset-4 border border-teal-500/20 rounded-full animate-ping-slow" />
                    </div>
                </div>

                <div className="space-y-4 mb-10">
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        {name} <span className="text-teal-600">is Live.</span>
                    </h2>
                    <p className="text-slate-600 font-medium text-lg leading-relaxed">
                        Your AI agent is now provisioned, secured, and ready for deployment.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <Link href="/dashboard" className="w-full">
                        <button className="w-full h-14 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all transform active:scale-95 flex items-center justify-center gap-2">
                            <LayoutDashboard size={20} />
                            Go to Dashboard
                        </button>
                    </Link>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-slate-500 font-bold uppercase text-[11px] tracking-widest hover:text-teal-600 transition-all"
                    >
                        Create another agent
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes reveal {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes ping-slow {
                    0% { transform: scale(1); opacity: 0.3; }
                    100% { transform: scale(1.6); opacity: 0; }
                }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
                .animate-reveal { animation: reveal 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
                .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
                .animate-ping-slow { animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
            `}</style>
        </div>
    );
}
