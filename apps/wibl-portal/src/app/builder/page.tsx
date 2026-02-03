'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Clock, Zap, Check, LayoutDashboard, RefreshCw, X } from 'lucide-react';
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
            discovery: { label: 'Discovery', icon: Sparkles, color: 'text-purple-600' },
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
        <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex overflow-hidden relative">
            {isDeployed && <SuccessOverlay name={extractedConfig.name || 'Agent'} />}

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm z-10">
                    <div className="max-w-4xl mx-auto px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Create Your AI Agent</h1>
                                <p className="text-sm text-slate-600 mt-1">
                                    Let's have a conversation to build the perfect agent for you
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 shrink-0">
                                    <PhaseIcon size={16} className={phaseInfo.color} />
                                    <span className="text-sm font-medium text-slate-700">{phaseInfo.label}</span>
                                </div>
                                <Link href="/agents">
                                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                                        <X size={24} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto scroll-smooth">
                    <div className="max-w-4xl mx-auto px-8 py-8 space-y-6">
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
                                        ? "bg-slate-900 border-slate-700"
                                        : "bg-gradient-to-br from-teal-400 to-teal-600 border-teal-500"
                                )}>
                                    {message.role === 'user' ? (
                                        <span className="text-[10px] font-bold text-white">ME</span>
                                    ) : (
                                        <span className="text-sm font-black text-white">W</span>
                                    )}
                                </div>

                                {/* Message */}
                                <div className={cn(
                                    "max-w-[85%] sm:max-w-2xl text-[15px] leading-relaxed whitespace-pre-line",
                                    message.role === 'user'
                                        ? "px-6 py-4 bg-slate-900 text-white rounded-2xl shadow-sm"
                                        : "text-slate-800 py-1"
                                )}>
                                    {message.content}
                                </div>
                            </div>
                        ))}

                        {/* Thinking Indicator */}
                        {isThinking && (
                            <div className="flex gap-4 items-start animate-reveal">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border bg-gradient-to-br from-teal-400 to-teal-600 border-teal-500">
                                    <span className="text-sm font-black text-white">W</span>
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
                <div className="border-t border-slate-200 bg-white/80 backdrop-blur-sm z-10">
                    <div className="max-w-4xl mx-auto px-8 py-6">
                        <div className="relative">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message..."
                                disabled={isThinking || isComplete || isDeployed}
                                className="w-full min-h-[80px] max-h-[200px] bg-white border border-slate-300 rounded-2xl px-6 py-4 pr-16 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none disabled:bg-slate-50 disabled:text-slate-400 shadow-sm transition-all"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || isThinking || isComplete || isDeployed}
                                className={cn(
                                    "absolute bottom-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                    input.trim() && !isThinking && !isComplete && !isDeployed
                                        ? "bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/30"
                                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                )}
                            >
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Config Sidebar */}
            <div className="w-96 border-l border-slate-200 bg-white flex flex-col shrink-0 hidden lg:flex">
                {/* Sidebar Header */}
                <div className="border-b border-slate-200 px-6 py-6">
                    <h2 className="text-lg font-bold text-slate-900">Agent Configuration</h2>
                    <p className="text-sm text-slate-600 mt-1">
                        Real-time extraction from our conversation
                    </p>
                </div>

                {/* Config Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {Object.keys(extractedConfig).length === 0 ? (
                        <div className="text-center py-12">
                            <Clock size={48} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-sm text-slate-500">
                                As we chat, I'll extract your agent's configuration here
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
                                    label="Purpose"
                                    value={extractedConfig.purpose}
                                    icon="🎯"
                                />
                            )}
                            {extractedConfig.personality && (
                                <ConfigItem
                                    label="Personality"
                                    value={extractedConfig.personality}
                                    icon="🎭"
                                />
                            )}
                            {extractedConfig.channels && extractedConfig.channels.length > 0 && (
                                <ConfigItem
                                    label="Channels"
                                    value={extractedConfig.channels.join(', ')}
                                    icon="📡"
                                />
                            )}
                            {extractedConfig.integrations && Object.keys(extractedConfig.integrations).length > 0 && (
                                <ConfigItem
                                    label="Integrations"
                                    value={Object.keys(extractedConfig.integrations).join(', ')}
                                    icon="🔌"
                                />
                            )}
                        </>
                    )}
                </div>

                {/* Action Button */}
                {(isComplete || phase === 'validation') && (
                    <div className="border-t border-slate-200 p-6 bg-slate-50/50">
                        <button
                            onClick={handleDeploy}
                            disabled={isDeploying || isDeployed}
                            className={cn(
                                "w-full py-4 font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2",
                                isDeploying || isDeployed
                                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-700 hover:to-teal-600 shadow-teal-600/30"
                            )}
                        >
                            {isDeploying ? (
                                <RefreshCw className="animate-spin" size={20} />
                            ) : (
                                <Zap size={20} />
                            )}
                            {isDeploying ? 'Deploying...' : 'Deploy Agent →'}
                        </button>
                    </div>
                )}
            </div>
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
