"use client";

import React, { useReducer, useState, useEffect, useRef } from 'react';
import {
    Bot,
    HelpCircle,
    Search,
    Calendar,
    ShoppingCart,
    User,
    Bell,
    Check,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Plus,
    Upload,
    Link as LinkIcon,
    SkipForward,
    Smile,
    Hash,
    MessageSquare,
    Globe,
    FileText,
    Sparkles,
    MessageCircle,
    Send,
    Database,
    Rocket
} from 'lucide-react';
import { Button, Card, Badge, Avatar, ChatBubble, Logo, LoadingDots, Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// --- Types ---

type InputType = 'textarea' | 'confirm-or-edit' | 'visual-cards' | 'multi-select-chips' | 'choice' | 'agent-preview' | 'channel-select' | 'identity-picker';

interface WizardOption {
    id?: string;
    label?: string;
    value?: string;
    icon?: string | React.ReactNode;
    title?: string;
    desc?: string;
    info?: string;
    color?: string;
    recommended?: boolean;
}

interface Step {
    id: string;
    wiblMessage: string | ((ctx: WizardContext) => string);
    inputType: InputType;
    placeholder?: string;
    options?: WizardOption[];
    validation?: { minLength?: number };
    shouldShow?: (ctx: WizardContext) => boolean;
}

interface WizardContext {
    purpose: string;
    parsedPurpose?: string;
    suggestedName: string;
    name: string;
    avatar: string;
    personality: string;
    capabilities: string[];
    knowledgeType: string;
    tools: string[];
    channels: string[];
    safetySettings: string[];
    personalityDetail?: string;
    knowledgeDetail?: string;
    responseStyle: 'fast' | 'natural';
}

interface Message {
    id: string;
    role: 'wibl' | 'user';
    content: React.ReactNode;
    type?: InputType;
}

interface WizardState {
    currentStepIndex: number;
    messages: Message[];
    context: WizardContext;
    isThinking: boolean;
    isComplete: boolean;
}

type WizardAction =
    | { type: 'ADD_MESSAGE'; role: 'wibl' | 'user'; content: React.ReactNode; inputType?: InputType }
    | { type: 'SET_THINKING'; status: boolean }
    | { type: 'UPDATE_CONTEXT'; updates: Partial<WizardContext> }
    | { type: 'NEXT_STEP' }
    | { type: 'PREV_STEP' }
    | { type: 'COMPLETE' };

// --- Initial State & Reducer ---

const INITIAL_CONTEXT: WizardContext = {
    purpose: '',
    suggestedName: '',
    name: '',
    avatar: 'wibl-1',
    personality: '',
    capabilities: [],
    knowledgeType: '',
    tools: [],
    channels: [],
    safetySettings: ['redaction', 'sandbox'],
    personalityDetail: '',
    knowledgeDetail: '',
    responseStyle: 'natural',
};

const INITIAL_STATE: WizardState = {
    currentStepIndex: 0,
    messages: [],
    context: INITIAL_CONTEXT,
    isThinking: false,
    isComplete: false,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
    switch (action.type) {
        case 'ADD_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, { id: Math.random().toString(), role: action.role, content: action.content, type: action.inputType }]
            };
        case 'SET_THINKING':
            return { ...state, isThinking: action.status };
        case 'UPDATE_CONTEXT':
            return { ...state, context: { ...state.context, ...action.updates } };
        case 'NEXT_STEP':
            return { ...state, currentStepIndex: state.currentStepIndex + 1 };
        case 'PREV_STEP':
            return { ...state, currentStepIndex: Math.max(0, state.currentStepIndex - 1) };
        case 'COMPLETE':
            return { ...state, isComplete: true };
        default:
            return state;
    }
}

// --- Wizard Configuration ---

const WIZARD_FLOW: Step[] = [
    {
        id: 'purpose',
        wiblMessage: "Let's bring your AI agent to life. What's the core mission?\n\nDescribe the task they'll focus on.",
        inputType: 'textarea',
        placeholder: "e.g., Handle customer refunds, schedule viewings via Google Calendar, or manage a waitlist...",
        validation: { minLength: 10 },
    },
    {
        id: 'identity',
        wiblMessage: (ctx) => `Mission accepted. Now, let's give your agent an identity. What shall we call them?`,
        inputType: 'identity-picker',
    },
    {
        id: 'personality',
        wiblMessage: "What vibe should your agent have? Pick the personality that matches your brand.",
        inputType: 'visual-cards',
        options: [
            { id: 'professional', icon: <User size={24} />, title: 'Professional', desc: 'Formal and business-like', color: 'navy' },
            { id: 'friendly', icon: <Smile size={24} />, title: 'Friendly', desc: 'Warm and approachable', color: 'teal', recommended: true },
            { id: 'casual', icon: <MessageSquare size={18} />, title: 'Casual', desc: 'Relaxed and informal', color: 'mint' },
            { id: 'custom', icon: <Sparkles size={24} />, title: 'Custom', desc: 'Define your own style', color: 'gradient' },
        ],
    },
    {
        id: 'personality-custom',
        wiblMessage: "I love a unique brand voice. Go ahead and describe the persona in your own words—how does your agent talk and act?",
        inputType: 'textarea',
        placeholder: "e.g., A witty tech guru who uses emojis, or a ultra-precise mathematical investigator...",
        shouldShow: (ctx) => ctx.personality === 'custom',
    },
    {
        id: 'knowledge',
        wiblMessage: "High-intelligence agents require deep knowledge. How will they learn your business logic?",
        inputType: 'choice',
        options: [
            { label: 'Upload Documents (PDF/XLS)', value: 'upload', icon: <FileText size={18} />, info: "Ground your agent in your own proprietary data by uploading business PDFs or spreadsheets." },
            { label: 'Crawl Domain URL', value: 'url', icon: <Globe size={18} />, info: "The agent will intelligently crawl your website to answer questions about your products and services." },
            { label: 'Use Vector Memory', value: 'memory', icon: <Database size={18} />, info: "Enables long-term memory (RAG) so the agent remembers past interactions and user preferences." },
            { label: 'Skip for now', value: 'skip', icon: <SkipForward size={18} />, info: "You can always add knowledge sources later through the dashboard." },
        ],
    },
    {
        id: 'knowledge-upload',
        wiblMessage: "Perfect. Upload the documents you want your agent to study. I'll analyze them for key insights immediately.",
        inputType: 'textarea', // Using textarea as a proxy for 'dropzone' simulation for now
        placeholder: "Drag and drop files here, or describe the content of the files you'll provide...",
        shouldShow: (ctx) => ctx.knowledgeType === 'upload',
    },
    {
        id: 'knowledge-url',
        wiblMessage: "Enter the website domain you'd like me to crawl. I'll intelligently map out the structure and content.",
        inputType: 'textarea',
        placeholder: "e.g., https://yourcompany.com/support",
        shouldShow: (ctx) => ctx.knowledgeType === 'url',
    },
    {
        id: 'tools',
        wiblMessage: "To execute tasks, agents need tools. Which integrations should we activate?",
        inputType: 'multi-select-chips',
        options: [
            { label: 'Google Calendar API', icon: <Calendar size={18} />, value: 'calendar', info: "Empower your agent to manage your schedule, browse availability, and book meetings." },
            { label: 'Enterprise CRM', icon: <Database size={18} />, value: 'crm', info: "Directly sync with HubSpot or Salesforce to update leads and track conversion data." },
            { label: 'Real-time Web Search', icon: <Search size={18} />, value: 'search', info: "Gives your agent access to Google/Brave search to pull current events and live data." },
            { label: 'Secure Payments', icon: <ShoppingCart size={18} />, value: 'stripe', info: "Allows the agent to generate secure payment links and handle transactions via Stripe." },
            { label: 'Auto-Tasker', icon: <Rocket size={18} />, value: 'cron', info: "Schedule background jobs like follow-up reminders or automated status reports." },
        ],
    },
    {
        id: 'advanced',
        wiblMessage: "Wibl. is built on security. Let's configure the safety and performance layers.",
        inputType: 'multi-select-chips',
        options: [
            { label: 'PII Redaction', icon: <CheckCircle2 size={18} />, value: 'redaction', info: "Automatically identifies and masks sensitive data like emails, card numbers, and PII." },
            { label: 'Strict Sandbox', icon: <MessageCircle size={18} />, value: 'sandbox', info: "Enforces a secure compute environment where the agent cannot access unauthorized data." },
            { label: 'Natural Response Delay', icon: <Smile size={18} />, value: 'natural_delay', info: "Simulates more realistic, 'human-like' typing rhythms to improve user trust and engagement." },
            { label: 'Output Validation', icon: <Check size={18} />, value: 'validation', info: "Runs deep analysis on every agent response to prevent prompt injection or leaked info." },
        ],
    },
    {
        id: 'channels',
        wiblMessage: "Last step. Where will your agent live? Select your communication channels.",
        inputType: 'multi-select-chips',
        options: [
            { label: 'WhatsApp Business', icon: <MessageCircle size={18} />, value: 'whatsapp', info: "Connect to your verified WhatsApp Business account for direct customer engagement." },
            { label: 'Web Widget', icon: <Globe size={18} />, value: 'web', info: "Embed a sleek chat interface directly on your website or landing page." },
            { label: 'Slack Enterprise', icon: <Hash size={18} />, value: 'slack', info: "Integrate with your Slack workspace to handle internal inquiries and automated support." },
            { label: 'Telegram Bot', icon: <Rocket size={18} />, value: 'telegram', info: "Launch a custom bot on Telegram for lightweight, high-speed mobile interaction." },
        ],
    },
    {
        id: 'preview',
        wiblMessage: (ctx) => `All systems green. Give ${ctx.name} a final test run before we go live.`,
        inputType: 'agent-preview',
    },
];

// --- Main Page Component ---

export default function AgentWizardPage() {
    const [state, dispatch] = useReducer(wizardReducer, INITIAL_STATE);
    const [inputValue, setInputValue] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial greeting - using a ref to prevent double-execution in strict mode
    const initialStarted = useRef(false);
    useEffect(() => {
        if (!initialStarted.current && state.messages.length === 0) {
            initialStarted.current = true;
            startStep(0);
        }
    }, []);

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [state.messages, state.isThinking]);

    const findNextStepIndex = (fromIndex: number, currentContext: WizardContext): number => {
        for (let i = fromIndex + 1; i < WIZARD_FLOW.length; i++) {
            const step = WIZARD_FLOW[i];
            const ss = step.shouldShow;
            if (typeof ss !== 'function' || ss(currentContext)) {
                return i;
            }
        }
        return -1;
    };

    const findPrevStepIndex = (fromIndex: number, currentContext: WizardContext): number => {
        for (let i = fromIndex - 1; i >= 0; i--) {
            const step = WIZARD_FLOW[i];
            const ss = step.shouldShow;
            if (typeof ss !== 'function' || ss(currentContext)) {
                return i;
            }
        }
        return -1;
    };

    const startStep = async (index: number) => {
        const step = WIZARD_FLOW[index];
        const ss = step.shouldShow;
        if (typeof ss === 'function' && !ss(state.context)) {
            // Skip this step and move to next
            const nextIdx = findNextStepIndex(index, state.context);
            if (nextIdx !== -1) {
                startStep(nextIdx);
                dispatch({ type: 'NEXT_STEP' });
            }
            return;
        }

        dispatch({ type: 'SET_THINKING', status: true });

        // Dynamic wait time based on message length
        const message = typeof step.wiblMessage === 'function' ? step.wiblMessage(state.context) : step.wiblMessage;
        const waitTime = Math.min(2000, message.length * 15);

        await new Promise(resolve => setTimeout(resolve, waitTime));

        dispatch({ type: 'SET_THINKING', status: false });
        dispatch({
            type: 'ADD_MESSAGE',
            role: 'wibl',
            content: message,
            inputType: step.inputType
        });
    };

    const handleUserInput = async (value: any, displayValue?: string) => {
        const currentStep = WIZARD_FLOW[state.currentStepIndex];

        // Add user message
        dispatch({
            type: 'ADD_MESSAGE',
            role: 'user',
            content: displayValue || (typeof value === 'string' ? value : JSON.stringify(value))
        });

        setIsProcessing(true);

        // Update context based on step
        const updates: Partial<WizardContext> = {};
        if (currentStep.id === 'purpose') {
            // Mock AI parsing
            updates.purpose = value;
            updates.parsedPurpose = value.length > 30 ? value.substring(0, 30) + '...' : value;
            updates.suggestedName = value.split(' ')[0] + 'Bot';
            updates.name = updates.suggestedName;
        } else if (currentStep.id === 'identity') {
            updates.name = value.name;
            updates.avatar = value.avatar;
        } else if (currentStep.id === 'personality') {
            updates.personality = value;
        } else if (currentStep.id === 'personality-custom') {
            updates.personalityDetail = value;
        } else if (currentStep.id === 'knowledge') {
            updates.knowledgeType = value;
        } else if (currentStep.id === 'knowledge-upload' || currentStep.id === 'knowledge-url') {
            updates.knowledgeDetail = value;
        } else if (currentStep.id === 'tools') {
            updates.tools = value;
        } else if (currentStep.id === 'advanced') {
            updates.safetySettings = value;
            updates.responseStyle = value.includes('natural_delay') ? 'natural' : 'fast';
        } else if (currentStep.id === 'channels') {
            updates.channels = value;
        }

        dispatch({ type: 'UPDATE_CONTEXT', updates });

        const nextContext = { ...state.context, ...updates };
        const nextStepIndex = findNextStepIndex(state.currentStepIndex, nextContext);

        if (nextStepIndex !== -1) {
            dispatch({ type: 'NEXT_STEP' });
            setTimeout(() => {
                startStep(nextStepIndex);
                setIsProcessing(false);
            }, 500);
        } else {
            // Success! PERSIST TO BACKEND
            await saveAgent(nextContext);
        }
    };

    const saveAgent = async (ctx: WizardContext) => {
        setIsProcessing(true);
        try {
            const payload = {
                name: ctx.name,
                description: ctx.purpose,
                avatar_url: ctx.avatar.startsWith('http') ? ctx.avatar : null,
                personality: {
                    tone: ctx.personality,
                    customTraits: ctx.personalityDetail ? [ctx.personalityDetail] : [],
                    greetingMessage: `Hello! I'm ${ctx.name}. How can I help you today?`,
                },
                capabilities: {
                    allowedActions: ctx.capabilities,
                    restrictedTopics: ["General advice only", "No legal advice"],
                },
                knowledge_source_ids: [],
                tool_connection_ids: [],
                context_rules: {
                    systemPromptAdditions: `Context Style: ${ctx.responseStyle}`,
                    responseFormat: 'conversational',
                    maxTokens: 2000,
                },
                deployment: {
                    status: 'active',
                    channels: ctx.channels,
                    gatewayUrl: null, // Set by backend during provisioning
                    deployedAt: null,
                },
                security: {
                    inputSanitization: true,
                    outputValidation: ctx.safetySettings.includes('validation'),
                    promptInjectionProtection: ctx.safetySettings.includes('sandbox') ? 'strict' : 'basic',
                    piiRedaction: ctx.safetySettings.includes('redaction'),
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
                throw new Error('Failed to save agent');
            }

            dispatch({ type: 'COMPLETE' });
        } catch (error) {
            console.error('Error saving agent:', error);
            // In a real app, show a toast here
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col lg:flex-row overflow-hidden font-sans">
            {/* Left Column: Wibl Guide (40%) */}
            <div className="w-full lg:w-[40%] bg-navy-900 flex flex-col items-center justify-center p-8 lg:p-12 relative overflow-hidden shrink-0">
                {/* Background effects */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-wibl-teal opacity-20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-wibl-coral opacity-10 blur-[120px] rounded-full" />

                {/* Wibl Mascot */}
                <div className="relative mb-12 group">
                    {/* Glowing outer rings */}
                    <div className="absolute inset-[-40px] rounded-full bg-wibl-teal/10 blur-[80px] animate-pulse-soft" />
                    <div className={cn(
                        "absolute inset-[-25px] rounded-full border border-wibl-teal/20 transition-all duration-1000",
                        state.isThinking ? "animate-spin-slow opacity-100 scale-110 border-solid border-wibl-teal/40" : "opacity-40"
                    )} />

                    <div className="w-40 h-40 lg:w-56 lg:h-56 rounded-full gradient-brand p-1.5 shadow-[0_0_100px_rgba(0,242,234,0.12)] relative z-10 flex items-center justify-center transition-all duration-500 hover:scale-110 cursor-pointer vitality-trigger">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden p-16 lg:p-24">
                            <span className="text-4xl lg:text-5xl font-display font-black tracking-tighter mb-0.5">
                                <span className="text-wibl-teal leading-none uppercase">W</span><span className="text-navy-900 leading-none">.</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="text-center z-10">
                    <h2 className="text-3xl lg:text-5xl font-display font-black mb-2 tracking-tight">
                        <span className="text-wibl-teal">W</span><span className="text-white">ibl</span><span className="text-wibl-teal">.</span>
                    </h2>
                    <p className="text-navy-300 font-bold text-lg mb-16 opacity-50 tracking-wide">
                        Create your agent
                    </p>

                    {/* Progress Dots */}
                    <div className="flex items-center justify-center gap-3">
                        {WIZARD_FLOW.map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-3 h-3 rounded-full transition-all duration-500",
                                    i === state.currentStepIndex ? "w-8 gradient-brand scale-110 shadow-wibl" :
                                        i < state.currentStepIndex ? "bg-wibl-teal" : "bg-navy-700/50"
                                )}
                            />
                        ))}
                    </div>
                    <p className="text-navy-500 font-black uppercase tracking-widest text-xs mt-6">
                        Step {state.currentStepIndex + 1} of {WIZARD_FLOW.length}
                    </p>
                </div>

                {/* Back Button (Small) */}
                {state.currentStepIndex > 0 && (
                    <button
                        onClick={() => {
                            const prevIndex = findPrevStepIndex(state.currentStepIndex, state.context);
                            if (prevIndex !== -1) {
                                // For now, we'll just reload the state at that index 
                                // In a real app we'd roll back messages too, but for this demo a simple jump is fine
                                dispatch({ type: 'PREV_STEP' }); // Still just -1 for now
                                startStep(prevIndex);
                            }
                        }}
                        className="absolute top-8 left-8 text-navy-400 hover:text-white transition-colors flex items-center gap-2 font-black uppercase tracking-wider text-xs"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                )}
            </div>

            {/* Right Column: Chat Interface (60%) */}
            <div className="flex-1 flex flex-col bg-canvas-subtle relative min-w-0">
                {/* Chat Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto pt-24 pb-64 px-6 lg:px-12 scroll-smooth"
                >
                    <div className="max-w-2xl mx-auto space-y-10">
                        {state.messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex gap-4 animate-reveal",
                                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                {/* Avatar */}
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-navy-100 bg-white group-hover:scale-105 transition-transform",
                                    msg.role === 'user' ? "mt-1" : "mt-1"
                                )}>
                                    {msg.role === 'user' ? (
                                        <span className="text-[10px] font-black text-navy-400">ME</span>
                                    ) : (
                                        <span className="text-xs font-display font-black tracking-tighter">
                                            <span className="text-wibl-teal">W</span><span className="text-navy-900">.</span>
                                        </span>
                                    )}
                                </div>

                                <div className={cn(
                                    "px-6 py-4 rounded-2xl text-sm font-normal leading-relaxed shadow-premium-sm transition-all hover:shadow-premium-md whitespace-pre-line",
                                    msg.role === 'user'
                                        ? "bg-navy-900 text-white"
                                        : "bg-white/80 text-navy-700 border border-navy-100 backdrop-blur-sm"
                                )}>
                                    {/* Gradient accent removed for cleaner look */}
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {state.isThinking && (
                            <div className="flex gap-4 items-start animate-reveal">
                                <div className="w-10 h-10 rounded-xl bg-white border border-navy-100 flex items-center justify-center text-navy-900 font-display font-black text-xs shrink-0 shadow-sm">
                                    <span className="text-wibl-teal">W</span>.
                                </div>
                                <div className="px-4 py-3 rounded-2xl bg-white border border-navy-100 shadow-sm">
                                    <LoadingDots color="gray" size="sm" />
                                </div>
                            </div>
                        )}

                        {/* Special selection inputs render in-flow (Cards, Chips, Choices) */}
                        {state.messages.length > 0 &&
                            state.messages[state.messages.length - 1].role === 'wibl' &&
                            !state.isThinking &&
                            WIZARD_FLOW[state.currentStepIndex].inputType !== 'textarea' && (
                                <div className="animate-reveal mt-8">
                                    <WizardInput
                                        type={WIZARD_FLOW[state.currentStepIndex].inputType}
                                        options={WIZARD_FLOW[state.currentStepIndex].options}
                                        placeholder={WIZARD_FLOW[state.currentStepIndex].placeholder}
                                        onSubmit={handleUserInput}
                                        context={state.context}
                                        currentStepId={WIZARD_FLOW[state.currentStepIndex].id}
                                    />
                                </div>
                            )}
                    </div>
                </div>

                {/* Stable Command Bar (Only for textarea type) */}
                {WIZARD_FLOW[state.currentStepIndex].inputType === 'textarea' && !state.isThinking && !state.isComplete && (
                    <div className="p-8 pb-16 bg-gradient-to-t from-canvas-subtle via-canvas-subtle/80 to-transparent relative z-20">
                        <div className="max-w-2xl mx-auto space-y-4">
                            <WizardInput
                                type="textarea"
                                placeholder={WIZARD_FLOW[state.currentStepIndex].placeholder}
                                onSubmit={handleUserInput}
                                context={state.context}
                                currentStepId={WIZARD_FLOW[state.currentStepIndex].id}
                            />
                            <p className="text-center text-[10px] font-bold text-navy-300 uppercase tracking-[0.2em] opacity-60">
                                Wibl. uses secure AI to help build your perfect agent experience.
                            </p>
                        </div>
                    </div>
                )}

                {state.isComplete && <SuccessOverlay name={state.context.name} />}
            </div>

            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
                @keyframes bounce-sm {
                   0%, 100% { transform: translateY(0); }
                   50% { transform: translateY(-4px); }
                }
                .animate-bounce-hover:hover {
                    animation: bounce-sm 0.5s ease-in-out infinite;
                }
                @keyframes pulse-soft {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.2; transform: scale(1.05); }
                }
                .animate-pulse-soft {
                    animation: pulse-soft 3s ease-in-out infinite;
                }
                @keyframes reveal {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-reveal {
                    animation: reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes reveal-fast {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-reveal-fast {
                    animation: reveal-fast 0.2s ease-out forwards;
                }
                @keyframes vitality {
                    0%, 100% { 
                        box-shadow: 0 0 80px rgba(78, 205, 196, 0.1); 
                        transform: scale(1.1);
                    }
                    50% { 
                        box-shadow: 0 0 120px rgba(78, 205, 196, 0.25); 
                        transform: scale(1.13);
                    }
                }
                .vitality-trigger:hover {
                    animation: vitality 1.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

// --- Sub-components ---

function WizardInput({
    type,
    options,
    placeholder,
    onSubmit,
    context,
    currentStepId // Add this parameter
}: {
    type: InputType,
    options?: WizardOption[],
    placeholder?: string,
    onSubmit: (val: any, display?: string) => void,
    context: WizardContext,
    currentStepId?: string  // Add this type
}) {
    const [value, setValue] = useState<any>('');

    if (type === 'textarea') {
        const [text, setText] = useState('');
        const [validation, setValidation] = useState<{
            isValid: boolean;
            feedback?: string;
            suggestions?: string[];
        } | null>(null);
        const [isValidating, setIsValidating] = useState(false);
        const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

        // Debounced AI validation
        const validateInput = async (input: string) => {
            if (input.trim().length < 10) {
                setValidation(null);
                return;
            }

            setIsValidating(true);

            try {
                // Call AI validation endpoint
                const response = await fetch('/api/wizard/validate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        stepId: currentStepId, // Use the passed parameter
                        input: input.trim()
                    })
                });

                const result = await response.json();
                setValidation(result);
            } catch (error) {
                console.error('Validation failed:', error);
                // Fail open - don't block user
                setValidation({ isValid: true });
            } finally {
                setIsValidating(false);
            }
        };

        const handleTextChange = (value: string) => {
            setText(value);

            // Clear previous timer
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            // Debounce validation (wait 1s after user stops typing)
            debounceTimerRef.current = setTimeout(() => {
                validateInput(value);
            }, 1000);
        };

        const handleSubmit = () => {
            if (text.length < 10) return;

            // Check validation before submitting
            if (validation && !validation.isValid) {
                // Show feedback prominently
                return;
            }

            onSubmit(text);
        };

        const canSubmit = text.length >= 10 && (!validation || validation.isValid);

        return (
            <div className="relative">
                {/* Removed gradient glow for cleaner look */}
                <div className="relative">
                    <textarea
                        autoFocus
                        value={text}
                        onChange={(e) => handleTextChange(e.target.value)}
                        placeholder={placeholder}
                        className={cn(
                            "w-full min-h-[120px] bg-white border p-5 px-6 pr-14 text-[15px] font-normal text-navy-800 placeholder:text-navy-400 rounded-2xl shadow-sm focus:ring-2 focus:border-transparent outline-none transition-all resize-none",
                            validation && !validation.isValid
                                ? "border-wibl-coral/60 focus:ring-wibl-coral/20"
                                : "border-navy-200 focus:ring-wibl-teal/20"
                        )}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && canSubmit) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />
                    {/* Send button - smaller, cleaner, bottom-right corner like Claude */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-3">
                        {isValidating && (
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-navy-400">
                                <LoadingDots />
                                <span>Checking</span>
                            </div>
                        )}
                        <button
                            onClick={handleSubmit}
                            className={cn(
                                "w-8 h-8 p-0 rounded-lg flex items-center justify-center transform active:scale-95 transition-all duration-200 outline-none",
                                canSubmit
                                    ? "bg-wibl-teal text-white hover:bg-wibl-teal/90"
                                    : "bg-navy-100 text-navy-300 cursor-not-allowed"
                            )}
                            disabled={!canSubmit}
                            aria-label="Continue"
                        >
                            <ArrowRight size={16} className="transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Validation Feedback */}
                {validation && !validation.isValid && (
                    <div className="mt-3 animate-reveal">
                        <div className="bg-wibl-coral/5 border border-wibl-coral/20 rounded-xl p-3.5">
                            <div className="flex items-start gap-2.5">
                                <div className="w-6 h-6 rounded-full bg-wibl-coral/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <HelpCircle size={14} className="text-wibl-coral" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[13px] font-medium text-navy-700 mb-2">
                                        {validation.feedback}
                                    </p>
                                    {validation.suggestions && validation.suggestions.length > 0 && (
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-semibold text-navy-400 uppercase tracking-wide">
                                                Try something like:
                                            </p>
                                            {validation.suggestions.map((suggestion, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        setText(suggestion);
                                                        handleTextChange(suggestion);
                                                    }}
                                                    className="block w-full text-left text-[13px] text-wibl-teal hover:text-wibl-teal/80 transition-colors font-normal"
                                                >
                                                    → {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Indicator */}
                {validation && validation.isValid && text.length >= 15 && (
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-wibl-teal animate-reveal">
                        <CheckCircle2 size={12} />
                        <span>Looks good</span>
                    </div>
                )}
            </div>
        );
    }

    if (type === 'identity-picker') {
        const [name, setName] = useState(context.suggestedName || '');
        const [customAvatar, setCustomAvatar] = useState<string | null>(null);
        const fileInputRef = useRef<HTMLInputElement>(null);

        const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setCustomAvatar(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        };

        return (
            <div className="max-w-xl mx-auto w-full space-y-8 animate-reveal">
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest ml-1">Agent Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Agent name..."
                        className="w-full px-6 py-4 bg-white border border-navy-100 rounded-2xl text-lg font-bold text-navy-800 focus:border-wibl-teal focus:ring-4 focus:ring-wibl-teal/5 outline-none transition-all shadow-premium-sm"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest ml-1">Agent Avatar</label>
                    <div className="flex items-center gap-6 p-6 bg-white border border-navy-100 rounded-2xl shadow-premium-sm">
                        <div
                            className="w-24 h-24 rounded-2xl bg-canvas flex flex-col items-center justify-center cursor-pointer hover:border-wibl-teal border-2 border-dashed border-navy-100 transition-all overflow-hidden relative group shrink-0"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {customAvatar ? (
                                <img src={customAvatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <Upload size={24} className="text-navy-300 group-hover:text-wibl-teal transition-colors" />
                                    <span className="text-[10px] font-black text-navy-400 mt-2">UPLOAD</span>
                                </>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-navy-800 mb-1">Brand Identity</h4>
                            <p className="text-xs text-navy-500 leading-relaxed">
                                Upload a professional brand logo or a high-quality photo for your agent.
                                Recommended size: 512x512px.
                            </p>
                            {customAvatar && (
                                <button
                                    onClick={() => setCustomAvatar(null)}
                                    className="text-[10px] font-black text-wibl-coral uppercase tracking-widest mt-3 hover:underline"
                                >
                                    Remove Image
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <Button
                    variant="primary"
                    className="w-full h-14 text-lg font-bold gradient-brand border-none shadow-premium-lg hover:shadow-glow-teal"
                    onClick={() => onSubmit({ name, avatar: customAvatar || 'wibl-default' }, name)}
                >
                    Confirm Identity
                </Button>
            </div>
        );
    }

    if (type === 'visual-cards') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto w-full">
                {options?.map(opt => (
                    <Card
                        key={opt.id}
                        hoverable
                        onClick={() => onSubmit(opt.id, opt.title)}
                        className={cn(
                            "relative overflow-hidden cursor-pointer group transition-all duration-300 transform active:scale-95",
                            "hover:ring-4 hover:ring-wibl-teal/20"
                        )}
                    >
                        {opt.recommended && (
                            <div className="absolute top-0 right-0 bg-wibl-teal text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl z-10">
                                Recommended
                            </div>
                        )}
                        <div className="flex items-start gap-4">
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center text-3xl",
                                opt.color === 'navy' ? "bg-navy-50 text-navy-600" :
                                    opt.color === 'teal' ? "bg-teal-50 text-teal-600" :
                                        opt.color === 'mint' ? "bg-mint-50 text-mint-600" :
                                            "gradient-brand text-white"
                            )}>
                                {opt.icon}
                            </div>
                            <div>
                                <h4 className="font-display font-black text-navy-800 text-xl group-hover:text-wibl-teal transition-colors">
                                    {opt.title}
                                </h4>
                                <p className="text-navy-500 font-medium text-sm">
                                    {opt.desc}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (type === 'multi-select-chips') {
        const [selected, setSelected] = useState<string[]>([]);
        const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

        return (
            <div className="max-w-3xl mx-auto w-full space-y-6">
                <div className="flex flex-wrap gap-2.5">
                    {options?.map(opt => (
                        <button
                            key={opt.value}
                            onMouseEnter={() => setHoveredInfo(opt.info || null)}
                            onMouseLeave={() => setHoveredInfo(null)}
                            onClick={() => {
                                const next = selected.includes(opt.value!)
                                    ? selected.filter(s => s !== opt.value)
                                    : [...selected, opt.value!];
                                setSelected(next);
                            }}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all border",
                                selected.includes(opt.value!)
                                    ? "gradient-brand text-white border-transparent shadow-wibl scale-105"
                                    : "bg-white text-navy-500 border-navy-100 hover:border-wibl-teal"
                            )}
                        >
                            {opt.icon}
                            {opt.label}
                            {selected.includes(opt.value!) && <Check size={14} />}
                        </button>
                    ))}
                </div>

                {/* Information reveal box */}
                <div className="min-h-[60px] flex items-center justify-center">
                    {hoveredInfo ? (
                        <div className="bg-wibl-teal/5 border border-wibl-teal/20 px-6 py-3 rounded-2xl animate-reveal-fast backdrop-blur-sm w-full">
                            <p className="text-[13px] text-navy-700 font-medium leading-relaxed">
                                <span className="font-black text-[10px] text-wibl-teal uppercase tracking-widest mr-3">Deep Dive</span>
                                {hoveredInfo}
                            </p>
                        </div>
                    ) : (
                        <p className="text-[10px] font-black text-navy-300 uppercase tracking-[0.3em] opacity-40">
                            Hover an option for more context
                        </p>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button
                        variant="primary"
                        disabled={selected.length === 0}
                        onClick={() => onSubmit(selected, `Selected ${selected.length} capabilities`)}
                        rightIcon={<ArrowRight size={18} />}
                    >
                        Looks good
                    </Button>
                </div>
            </div>
        );
    }

    if (type === 'choice') {
        const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

        return (
            <div className="max-w-2xl mx-auto w-full space-y-6">
                <div className="flex flex-wrap gap-3 justify-center">
                    {options?.map(opt => (
                        <button
                            key={opt.value}
                            onMouseEnter={() => setHoveredInfo(opt.info || null)}
                            onMouseLeave={() => setHoveredInfo(null)}
                            onClick={() => onSubmit(opt.value, opt.label)}
                            className="px-6 py-2.5 bg-white border border-navy-100 rounded-full font-bold text-[13px] text-navy-500 hover:border-wibl-teal hover:text-wibl-teal hover:shadow-premium-sm transition-all flex items-center justify-center gap-2 transform active:scale-95"
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Context Indicator */}
                <div className="min-h-[40px] flex items-center justify-center">
                    {hoveredInfo && (
                        <div className="bg-canvas border border-navy-100 px-6 py-2 rounded-full animate-reveal-fast shadow-premium-sm">
                            <p className="text-[11px] text-navy-500 font-medium">
                                <span className="font-bold text-wibl-teal/60 mr-2 lowercase italic">i.</span>
                                {hoveredInfo}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (type === 'agent-preview') {
        return (
            <div className="max-w-3xl mx-auto w-full space-y-6">
                <Card variant="elevated" className="gradient-brand p-1">
                    <div className="bg-white rounded-wibl p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center text-white text-3xl font-display font-black shadow-lg overflow-hidden shrink-0">
                                {context.avatar && context.avatar.startsWith('data:image') ? (
                                    <img src={context.avatar} alt={context.name} className="w-full h-full object-cover" />
                                ) : (
                                    context.name.charAt(0)
                                )}
                            </div>
                            <div>
                                <h3 className="text-2xl font-display font-black text-navy-800">
                                    {context.name}
                                </h3>
                                <div className="flex gap-2 mt-1">
                                    <Badge variant="teal" size="sm" className="capitalize">{context.personality}</Badge>
                                    <Badge variant="info" size="sm">{context.capabilities.length} Skills</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="bg-navy-50 rounded-2xl p-4 mb-6">
                            <p className="text-navy-600 italic text-sm">
                                "Hi! I'm {context.name}. How can I assist you today?"
                            </p>
                        </div>

                        <div className="border-t border-navy-100 pt-6">
                            <p className="text-xs font-black text-navy-400 uppercase tracking-widest mb-4">Quick Test</p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="flex-1 bg-canvas rounded-full px-5 py-2 border-2 border-navy-50 focus:border-wibl-teal outline-none text-sm transition-all"
                                />
                                <button className="w-10 h-10 rounded-full gradient-brand text-white flex items-center justify-center shrink-0">
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </Card>
                <div className="flex justify-end">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => onSubmit('preview_confirmed', "Looks great!")}
                        rightIcon={<ArrowRight size={18} />}
                    >
                        Next: Deployment
                    </Button>
                </div>
            </div>
        );
    }

    if (type === 'channel-select') {
        const [selected, setSelected] = useState<string[]>(['web']);
        return (
            <div className="max-w-3xl mx-auto w-full space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {options?.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                const next = selected.includes(opt.value!)
                                    ? selected.filter(s => s !== opt.value)
                                    : [...selected, opt.value!];
                                setSelected(next);
                            }}
                            className={cn(
                                "flex flex-col items-center gap-3 p-6 rounded-3xl font-bold transition-all border-2",
                                selected.includes(opt.value!)
                                    ? "bg-white border-wibl-teal ring-4 ring-wibl-teal/10 scale-105"
                                    : "bg-white text-navy-400 border-navy-50 hover:border-navy-200"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl",
                                selected.includes(opt.value!) ? "gradient-brand text-white" : "bg-navy-50"
                            )}>
                                {opt.icon}
                            </div>
                            <span className={cn("text-xs uppercase tracking-widest", selected.includes(opt.value!) ? "text-navy-800" : "text-navy-400")}>
                                {opt.label}
                            </span>
                            {selected.includes(opt.value!) && (
                                <div className="absolute top-2 right-2 text-wibl-teal">
                                    <CheckCircle2 size={16} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
                <div className="flex justify-end">
                    <Button
                        variant="coral"
                        size="lg"
                        className="animate-bounce"
                        onClick={() => onSubmit(selected, `Deploy to ${selected.join(', ')}`)}
                        leftIcon={<Rocket size={20} />}
                    >
                        Launch Agent!
                    </Button>
                </div>
            </div>
        );
    }

    return null;
}

function SuccessOverlay({ name }: { name: string }) {
    useEffect(() => {
        const container = document.getElementById('confetti-container');
        if (!container) return;

        const colors = ['#00F2EA', '#FF3D6E', '#00D1C1', '#1A2B4C', '#000000'];
        for (let i = 0; i < 120; i++) {
            const particle = document.createElement('div');
            // Using squares/rects for a more premium "tumble" look
            const isSquare = Math.random() > 0.5;
            particle.className = `absolute ${isSquare ? 'w-2 h-2' : 'w-1.5 h-3'} rounded-sm animate-confetti`;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = '-20px';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animationDelay = Math.random() * 4 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 2.5) + 's';
            particle.style.transform = `rotate(${Math.random() * 360}deg)`;
            container.appendChild(particle);
        }
    }, []);

    return (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xl z-50 flex items-center justify-center overflow-hidden animate-fade-in">
            <div id="confetti-container" className="absolute inset-0 pointer-events-none opacity-40 shadow-[inset_0_0_200px_rgba(0,0,0,0.05)]" />

            <div className="max-w-md w-full text-center px-10 z-[60] animate-reveal">
                <div className="mb-12 flex justify-center">
                    <div className="w-32 h-32 rounded-full gradient-brand p-1.5 shadow-[0_0_60px_rgba(0,242,234,0.3)] relative">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-inner">
                            <div className="w-20 h-20 rounded-full gradient-brand flex items-center justify-center text-white shadow-xl animate-bounce-subtle">
                                <Check size={36} strokeWidth={3} />
                            </div>
                        </div>
                        {/* Decorative Rings */}
                        <div className="absolute -inset-4 border border-wibl-teal/20 rounded-full animate-ping-slow opacity-30" />
                        <div className="absolute -inset-8 border border-wibl-teal/10 rounded-full animate-ping-slow opacity-20" style={{ animationDelay: '0.8s' }} />
                    </div>
                </div>

                <div className="space-y-4 mb-12">
                    <h2 className="text-4xl lg:text-5xl font-display font-black text-navy-900 tracking-tight">
                        {name || 'Agent'} <span className="text-wibl-teal">is Live.</span>
                    </h2>
                    <div className="space-y-2">
                        <p className="text-navy-400 font-medium text-lg leading-relaxed max-w-[280px] mx-auto opacity-80">
                            Your new AI agent is built, secured, and ready for deployment.
                        </p>
                        <p className="text-[11px] font-bold text-navy-300 uppercase tracking-widest max-w-[240px] mx-auto leading-relaxed">
                            Fine-tuning and detailed logic settings can be refined later from your dashboard.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    <Link href="/dashboard" className="w-full">
                        <Button variant="primary" className="w-full h-14 text-lg font-bold gradient-brand border-none shadow-premium-lg hover:shadow-glow-teal hover:scale-[1.02] transition-all transform active:scale-95">
                            Launch to Dashboard
                        </Button>
                    </Link>
                    <button
                        onClick={() => window.location.reload()}
                        className="group flex items-center justify-center gap-2 text-navy-400 font-black uppercase text-[10px] tracking-[0.3em] hover:text-navy-800 transition-all py-2"
                    >
                        <span>Build another experience</span>
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </button>
                </div>
            </div>

            <style jsx global>{`
                @keyframes confetti {
                    0% { transform: translateY(0) rotate(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                .animate-confetti {
                    animation: confetti linear infinite;
                }
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 3s ease-in-out infinite;
                }
                @keyframes ping-slow {
                    0% { transform: scale(1); opacity: 0.3; }
                    50% { opacity: 0.15; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                .animate-ping-slow {
                    animation: ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
            `}</style>
        </div>
    );
}
