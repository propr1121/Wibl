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
    ArrowRight,
    ArrowLeft,
    Plus,
    Upload,
    Link as LinkIcon,
    SkipForward,
    Send,
    Rocket,
    CheckCircle2
} from 'lucide-react';
import { Button, Card, Badge, Avatar, ChatBubble, Logo, LoadingDots, Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// --- Types ---

type InputType = 'textarea' | 'confirm-or-edit' | 'visual-cards' | 'multi-select-chips' | 'choice' | 'agent-preview' | 'channel-select';

interface WizardOption {
    id?: string;
    label?: string;
    value?: string;
    icon?: string | React.ReactNode;
    title?: string;
    desc?: string;
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
}

interface WizardContext {
    purpose: string;
    parsedPurpose?: string;
    suggestedName: string;
    name: string;
    personality: string;
    capabilities: string[];
    knowledgeType: string;
    channels: string[];
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
    | { type: 'ADD_MESSAGE'; role: 'wibl' | 'user'; content: React.ReactNode; type?: InputType }
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
    personality: '',
    capabilities: [],
    knowledgeType: '',
    channels: [],
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
                messages: [...state.messages, { id: Math.random().toString(), role: action.role, content: action.content, type: action.type }]
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
        wiblMessage: "Hey! 👋 Let's bring your AI agent to life. What do you want it to help with? Just describe it naturally - I'll figure out the details.",
        inputType: 'textarea',
        placeholder: "e.g., Help customers find products and answer questions about shipping...",
        validation: { minLength: 10 },
    },
    {
        id: 'clarify',
        wiblMessage: (ctx) => `Got it! So you need an agent that ${ctx.parsedPurpose}. I'm thinking "${ctx.suggestedName}" as a name - sound good?`,
        inputType: 'confirm-or-edit',
        options: [
            { label: 'Perfect! 👍', value: 'confirm' },
            { label: 'Let me tweak the name', value: 'edit' },
        ],
    },
    {
        id: 'personality',
        wiblMessage: "What vibe should your agent have? Pick the personality that matches your brand.",
        inputType: 'visual-cards',
        options: [
            { id: 'professional', icon: '👔', title: 'Professional', desc: 'Formal and business-like', color: 'navy' },
            { id: 'friendly', icon: '😊', title: 'Friendly', desc: 'Warm and approachable', color: 'teal', recommended: true },
            { id: 'casual', icon: '🤙', title: 'Casual', desc: 'Relaxed and informal', color: 'mint' },
            { id: 'custom', icon: '✨', title: 'Custom', desc: 'Define your own style', color: 'gradient' },
        ],
    },
    {
        id: 'capabilities',
        wiblMessage: "What should your agent be able to do? Select all that apply - you can always add more later.",
        inputType: 'multi-select-chips',
        options: [
            { label: 'Answer FAQs', icon: <HelpCircle size={18} />, value: 'faq' },
            { label: 'Search knowledge base', icon: <Search size={18} />, value: 'knowledge' },
            { label: 'Book appointments', icon: <Calendar size={18} />, value: 'booking' },
            { label: 'Process orders', icon: <ShoppingCart size={18} />, value: 'orders' },
            { label: 'Escalate to human', icon: <User size={18} />, value: 'handover' },
            { label: 'Send notifications', icon: <Bell size={18} />, value: 'alerts' },
        ],
    },
    {
        id: 'knowledge',
        wiblMessage: "Does your agent need any documents or info to reference? You can skip this and add later.",
        inputType: 'choice',
        options: [
            { label: '📄 Upload documents', value: 'upload' },
            { label: '🔗 Import from URL', value: 'url' },
            { label: '⏭️ Skip for now', value: 'skip' },
        ],
    },
    {
        id: 'preview',
        wiblMessage: (ctx) => `Here's your agent! Meet ${ctx.name}. Give it a test run below - ask it anything!`,
        inputType: 'agent-preview',
    },
    {
        id: 'deploy',
        wiblMessage: "Looking good! 🎉 Where should we deploy your agent?",
        inputType: 'channel-select',
        options: [
            { label: 'Web Chat', value: 'web', icon: <Bot size={18} /> },
            { label: 'WhatsApp', value: 'whatsapp', icon: '🟢' },
            { label: 'Slack', value: 'slack', icon: '#️⃣' },
            { label: 'Discord', value: 'discord', icon: '👾' },
        ],
    },
];

// --- Main Page Component ---

export default function AgentWizardPage() {
    const [state, dispatch] = useReducer(wizardReducer, INITIAL_STATE);
    const [inputValue, setInputValue] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial greeting
    useEffect(() => {
        if (state.messages.length === 0) {
            startStep(0);
        }
    }, []);

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [state.messages, state.isThinking]);

    const startStep = async (index: number) => {
        const step = WIZARD_FLOW[index];
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
            type: step.inputType
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
        } else if (currentStep.id === 'clarify') {
            if (value === 'edit') {
                // This would normally trigger a sub-flow, for now just accept next
            }
        } else if (currentStep.id === 'personality') {
            updates.personality = value;
        } else if (currentStep.id === 'capabilities') {
            updates.capabilities = value;
        } else if (currentStep.id === 'knowledge') {
            updates.knowledgeType = value;
        } else if (currentStep.id === 'deploy') {
            updates.channels = value;
        }

        dispatch({ type: 'UPDATE_CONTEXT', updates });

        // Logic for next step
        if (state.currentStepIndex < WIZARD_FLOW.length - 1) {
            dispatch({ type: 'NEXT_STEP' });
            setTimeout(() => {
                startStep(state.currentStepIndex + 1);
                setIsProcessing(false);
            }, 500);
        } else {
            // Success!
            setIsProcessing(false);
            dispatch({ type: 'COMPLETE' });
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
                <div className="relative mb-8 group">
                    {/* Pulsing ring */}
                    <div className={cn(
                        "absolute inset-[-15px] rounded-full border-2 border-dashed border-wibl-teal opacity-30 transition-all duration-1000",
                        state.isThinking ? "animate-spin-slow opacity-100 scale-110 border-solid" : "animate-pulse-soft"
                    )} />

                    <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-full gradient-brand p-1 shadow-2xl relative z-10 flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-navy-900 flex items-center justify-center overflow-hidden">
                            <div className="text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-navy-200">
                                W
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center z-10">
                    <h2 className="text-3xl lg:text-4xl font-display font-black text-white mb-2">
                        Wibl
                    </h2>
                    <p className="text-navy-300 font-medium text-lg mb-12">
                        Your AI agent assistant
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
                        onClick={() => dispatch({ type: 'PREV_STEP' })}
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
                    className="flex-1 overflow-y-auto px-6 py-12 lg:px-12 scroll-smooth"
                >
                    <div className="max-w-3xl mx-auto space-y-8">
                        {state.messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex flex-col gap-2 animate-slide-up",
                                    msg.role === 'user' ? "items-end" : "items-start"
                                )}
                            >
                                <div className={cn(
                                    "px-6 py-4 rounded-3xl text-lg font-medium shadow-sm max-w-[90%]",
                                    msg.role === 'user'
                                        ? "bg-navy-100 text-navy-800 rounded-tr-none"
                                        : "bg-white text-navy-700 rounded-tl-none border-l-4 border-l-wibl-teal"
                                )}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {state.isThinking && (
                            <div className="flex flex-col gap-2 items-start animate-slide-up">
                                <div className="px-6 py-4 rounded-3xl bg-white rounded-tl-none border-l-4 border-l-navy-200">
                                    <LoadingDots />
                                </div>
                            </div>
                        )}

                        {/* Custom Input Components rendered in parallel with the last message if applicable */}
                        {state.messages.length > 0 && state.messages[state.messages.length - 1].role === 'wibl' && !state.isThinking && (
                            <div className="animate-fade-in mt-4">
                                <WizardInput
                                    type={WIZARD_FLOW[state.currentStepIndex].inputType}
                                    options={WIZARD_FLOW[state.currentStepIndex].options}
                                    placeholder={WIZARD_FLOW[state.currentStepIndex].placeholder}
                                    onSubmit={handleUserInput}
                                    context={state.context}
                                />
                            </div>
                        )}
                    </div>
                </div>

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
    context
}: {
    type: InputType,
    options?: WizardOption[],
    placeholder?: string,
    onSubmit: (val: any, display?: string) => void,
    context: WizardContext
}) {
    const [value, setValue] = useState<any>('');

    if (type === 'textarea') {
        const [text, setText] = useState('');
        return (
            <div className="max-w-3xl mx-auto w-full space-y-4">
                <textarea
                    autoFocus
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-32 bg-white rounded-2xl border-2 border-navy-100 p-6 text-lg focus:ring-4 focus:ring-wibl-teal/10 focus:border-wibl-teal outline-none transition-all resize-none shadow-sm"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && text.length >= 10) {
                            e.preventDefault();
                            onSubmit(text);
                        }
                    }}
                />
                <div className="flex justify-between items-center px-2">
                    <p className="text-xs font-bold text-navy-400 uppercase tracking-widest">
                        Press Enter to confirm
                    </p>
                    <Button
                        variant="teal"
                        disabled={text.length < 10}
                        onClick={() => onSubmit(text)}
                        rightIcon={<ArrowRight size={18} />}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        );
    }

    if (type === 'confirm-or-edit') {
        return (
            <div className="flex flex-wrap gap-4 max-w-3xl mx-auto">
                {options?.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => onSubmit(opt.value, opt.label)}
                        className="px-8 py-4 bg-white border-2 border-navy-100 rounded-full font-bold text-navy-700 hover:border-wibl-teal hover:shadow-wibl transition-all flex items-center gap-2 group"
                    >
                        {opt.label}
                        <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                ))}
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
        return (
            <div className="max-w-3xl mx-auto w-full space-y-6">
                <div className="flex flex-wrap gap-3">
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
                                "flex items-center gap-2 px-5 py-3 rounded-full font-bold transition-all border-2",
                                selected.includes(opt.value!)
                                    ? "gradient-brand text-white border-transparent shadow-wibl scale-105"
                                    : "bg-white text-navy-600 border-navy-100 hover:border-wibl-teal"
                            )}
                        >
                            {opt.icon}
                            {opt.label}
                            {selected.includes(opt.value!) && <Check size={16} />}
                        </button>
                    ))}
                </div>
                <div className="flex justify-end">
                    <Button
                        variant="teal"
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
        return (
            <div className="flex flex-wrap gap-4 max-w-3xl mx-auto">
                {options?.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => onSubmit(opt.value, opt.label)}
                        className="px-8 py-4 bg-white border-2 border-navy-100 rounded-2xl font-bold text-navy-700 hover:border-wibl-teal hover:shadow-lg transition-all flex items-center gap-3 transform hover:-translate-y-1 active:scale-95"
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        );
    }

    if (type === 'agent-preview') {
        return (
            <div className="max-w-3xl mx-auto w-full space-y-6">
                <Card variant="elevated" className="gradient-brand p-1">
                    <div className="bg-white rounded-wibl p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center text-white text-3xl font-display font-black shadow-lg">
                                {context.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-2xl font-display font-black text-navy-800">
                                    {context.name}
                                </h3>
                                <div className="flex gap-2 mt-1">
                                    <Badge variant="teal" size="sm" className="capitalize">{context.personality}</Badge>
                                    <Badge variant="info" size="sm">{context.capabilities.length} Capabilties</Badge>
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
                        variant="teal"
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
        // Simplified confetti effect using manual particles
        const container = document.getElementById('confetti-container');
        if (!container) return;

        const colors = ['#00F2EA', '#FF3D6E', '#00D1C1', '#1A2B4C'];
        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute w-2 h-2 rounded-full animate-confetti';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = '-20px';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(particle);
        }
    }, []);

    return (
        <div className="absolute inset-0 bg-white/95 z-30 flex items-center justify-center overflow-hidden animate-fade-in">
            <div id="confetti-container" className="absolute inset-0 pointer-events-none" />

            <div className="max-w-md w-full text-center px-6 z-40">
                <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 rounded-full gradient-brand flex items-center justify-center text-white scale-[2] shadow-2xl animate-float">
                        <Check size={48} />
                    </div>
                </div>

                <h2 className="text-4xl font-display font-black text-navy-800 mb-2">
                    {name} is alive! 🎉
                </h2>
                <p className="text-navy-500 font-medium text-lg mb-10">
                    Your new AI agent is ready to start working.
                </p>

                <div className="flex flex-col gap-4">
                    <Link href="/dashboard" className="w-full">
                        <Button variant="teal" size="lg" className="w-full h-14 text-lg">
                            Go to Dashboard
                        </Button>
                    </Link>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-navy-400 font-bold hover:text-navy-600 transition-colors py-2"
                    >
                        Create another agent
                    </button>
                </div>
            </div>

            <style jsx global>{`
                @keyframes confetti {
                    0% { transform: translateY(0) rotate(0); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                .animate-confetti {
                    animation: confetti ease-in infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0) scale(2); }
                    50% { transform: translateY(-10px) scale(2.05); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
