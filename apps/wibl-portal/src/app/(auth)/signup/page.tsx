"use client";

import React, { useReducer, useEffect, useState } from 'react';
import { Logo, Button, Input, ChatBubble, LoadingDots, Card, GradientBorder } from '@/components/ui';
import { Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// Flow state management
type SignupStep = 'email' | 'magic-link-sent' | 'name' | 'business' | 'plan' | 'success';

interface SignupState {
  step: SignupStep;
  email: string;
  name: string;
  business: string;
  plan: 'starter' | 'professional' | 'enterprise' | null;
  isLoading: boolean;
  error: string | null;
}

type SignupAction =
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'SEND_MAGIC_LINK' }
  | { type: 'MAGIC_LINK_SENT' }
  | { type: 'MAGIC_LINK_ERROR'; error: string }
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_BUSINESS'; business: string }
  | { type: 'SELECT_PLAN'; plan: SignupState['plan'] }
  | { type: 'COMPLETE_SIGNUP' }
  | { type: 'RESET' };

function signupReducer(state: SignupState, action: SignupAction): SignupState {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.email, error: null };
    case 'SEND_MAGIC_LINK':
      return { ...state, isLoading: true, error: null };
    case 'MAGIC_LINK_SENT':
      return { ...state, step: 'magic-link-sent', isLoading: false };
    case 'MAGIC_LINK_ERROR':
      return { ...state, isLoading: false, error: action.error };
    case 'SET_NAME':
      return { ...state, name: action.name, step: 'business' };
    case 'SET_BUSINESS':
      return { ...state, business: action.business, step: 'plan' };
    case 'SELECT_PLAN':
      return { ...state, plan: action.plan };
    case 'COMPLETE_SIGNUP':
      return { ...state, step: 'success' };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const initialState: SignupState = {
  step: 'email',
  email: '',
  name: '',
  business: '',
  plan: null,
  isLoading: false,
  error: null,
};

export default function SignupPage() {
  const [state, dispatch] = useReducer(signupReducer, initialState);
  const [showConfetti, setShowConfetti] = useState(false);
  const supabase = createClient();

  // Persist state to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wibl-signup-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.step !== 'success') {
          // Restore state except for success to avoid confusion
          Object.assign(initialState, parsed);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    if (state.step !== 'email') {
      localStorage.setItem('wibl-signup-state', JSON.stringify(state));
    }
  }, [state]);

  // Handle magic link callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('verified') === 'true') {
      // User clicked magic link, move to name step
      dispatch({ type: 'SET_NAME', name: '' });
    }
  }, []);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SEND_MAGIC_LINK' });

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: state.email,
        options: {
          emailRedirectTo: `${window.location.origin}/signup?verified=true`,
        },
      });

      if (error) throw error;
      dispatch({ type: 'MAGIC_LINK_SENT' });
    } catch (error) {
      dispatch({ type: 'MAGIC_LINK_ERROR', error: (error as Error).message });
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    if (name.trim()) {
      dispatch({ type: 'SET_NAME', name });
    }
  };

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const business = formData.get('business') as string;
    if (business.trim()) {
      dispatch({ type: 'SET_BUSINESS', business });
    }
  };

  const handlePlanSelect = (plan: SignupState['plan']) => {
    dispatch({ type: 'SELECT_PLAN', plan });
    setTimeout(() => {
      dispatch({ type: 'COMPLETE_SIGNUP' });
      setShowConfetti(true);
    }, 500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-canvas-light via-wibl-mint/5 to-wibl-sky/5">
      {/* Decorative gradient shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-wibl-mint/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-wibl-sky/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#5EEBBE', '#4ECDC4', '#45B7D1', '#FF6B6B'][Math.floor(Math.random() * 4)],
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="relative min-h-screen flex flex-col max-w-2xl mx-auto p-6 sm:p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <Logo size="lg" variant="full" animated />
        </div>

        {/* Chat Container */}
        <div className="flex-1 space-y-6 mb-24">
          {/* Step 1: Email */}
          {state.step === 'email' && (
            <>
              <ChatBubble variant="assistant" animated>
                <div className="space-y-2">
                  <p className="font-bold">Hey there! 👋</p>
                  <p>
                    I'm Wibl, and I help you build AI agents without writing a single line of code. 
                    Ready to get started? Just drop your email below.
                  </p>
                </div>
              </ChatBubble>

              <form onSubmit={handleSendMagicLink} className="space-y-4 animate-slide-up">
                <Input
                  label="Email Address"
                  type="email"
                  value={state.email}
                  onChange={(e) => dispatch({ type: 'SET_EMAIL', email: e.target.value })}
                  error={state.error || undefined}
                  required
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="coral"
                  size="lg"
                  className="w-full"
                  isLoading={state.isLoading}
                  disabled={!state.email || state.isLoading}
                >
                  Continue
                </Button>
              </form>
            </>
          )}

          {/* Step 2: Magic Link Sent */}
          {state.step === 'magic-link-sent' && (
            <>
              <ChatBubble variant="assistant" animated>
                <div className="space-y-2">
                  <p className="font-bold">Perfect! ✨</p>
                  <p>
                    I just sent a magic link to <span className="text-wibl-teal font-black">{state.email}</span>. 
                    Click it to continue - I'll be right here waiting!
                  </p>
                </div>
              </ChatBubble>

              <div className="flex flex-col items-center gap-6 animate-slide-up">
                <LoadingDots color="gradient" size="lg" />
                <Button
                  variant="ghost"
                  onClick={() => dispatch({ type: 'SEND_MAGIC_LINK' })}
                >
                  Resend link
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Name */}
          {state.step === 'name' && (
            <>
              <ChatBubble variant="assistant" animated>
                <div className="space-y-2">
                  <p className="font-bold">Welcome back! 🎉</p>
                  <p>What should I call you?</p>
                </div>
              </ChatBubble>

              <form onSubmit={handleNameSubmit} className="space-y-4 animate-slide-up">
                <Input
                  label="Your Name"
                  name="name"
                  type="text"
                  required
                  autoFocus
                />
                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Continue
                </Button>
              </form>
            </>
          )}

          {/* Step 4: Business */}
          {state.step === 'business' && (
            <>
              <ChatBubble variant="user" timestamp="Just now">
                {state.name}
              </ChatBubble>

              <ChatBubble variant="assistant" animated>
                <div className="space-y-2">
                  <p className="font-bold">Nice to meet you, {state.name}! 👋</p>
                  <p>Tell me a bit about your business - what do you do?</p>
                </div>
              </ChatBubble>

              <form onSubmit={handleBusinessSubmit} className="space-y-4 animate-slide-up">
                <div className="space-y-2">
                  <label className="text-sm font-black text-navy-700">About your business</label>
                  <textarea
                    name="business"
                    rows={4}
                    className="w-full px-4 py-3 bg-canvas-muted border-2 border-navy-100 rounded-wibl-sm focus:border-wibl-teal focus:shadow-[0_0_0_4px_rgba(78,205,196,0.1)] focus:bg-white outline-none transition-all duration-200 font-medium text-navy-700 resize-none"
                    placeholder="e.g., We help small businesses with marketing automation..."
                    required
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Continue
                </Button>
              </form>
            </>
          )}

          {/* Step 5: Plan Selection */}
          {state.step === 'plan' && (
            <>
              <ChatBubble variant="user" timestamp="Just now">
                {state.business}
              </ChatBubble>

              <ChatBubble variant="assistant" animated>
                <div className="space-y-2">
                  <p className="font-bold">Sounds interesting! 🚀</p>
                  <p>Let's pick a plan that fits your needs. You can always change this later.</p>
                </div>
              </ChatBubble>

              <div className="grid sm:grid-cols-3 gap-4 animate-slide-up">
                <PlanCard
                  name="Starter"
                  price="$29"
                  features={['1 AI Agent', '1,000 messages/mo', 'Email support']}
                  selected={state.plan === 'starter'}
                  onSelect={() => handlePlanSelect('starter')}
                />
                <PlanCard
                  name="Professional"
                  price="$79"
                  features={['5 AI Agents', '10,000 messages/mo', 'Priority support']}
                  selected={state.plan === 'professional'}
                  onSelect={() => handlePlanSelect('professional')}
                  featured
                />
                <PlanCard
                  name="Enterprise"
                  price="Custom"
                  features={['Unlimited agents', 'Unlimited messages', 'Dedicated support']}
                  selected={state.plan === 'enterprise'}
                  onSelect={() => handlePlanSelect('enterprise')}
                />
              </div>
            </>
          )}

          {/* Step 6: Success */}
          {state.step === 'success' && (
            <>
              <ChatBubble variant="assistant" animated>
                <div className="space-y-2">
                  <p className="font-bold">You're all set! 🚀</p>
                  <p>Let's build your first AI agent.</p>
                </div>
              </ChatBubble>

              <div className="animate-slide-up">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Enter Dashboard
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
}

// Plan Card Component
interface PlanCardProps {
  name: string;
  price: string;
  features: string[];
  selected: boolean;
  onSelect: () => void;
  featured?: boolean;
}

function PlanCard({ name, price, features, selected, onSelect, featured }: PlanCardProps) {
  const CardWrapper = selected ? GradientBorder : 'div';
  const wrapperProps = selected ? { animated: true, width: 2 } : {};

  return (
    <CardWrapper {...wrapperProps}>
      <button
        onClick={onSelect}
        className={`
          w-full text-left p-6 rounded-wibl transition-all duration-200
          ${selected ? 'bg-white' : 'bg-canvas-subtle hover:bg-white border-2 border-navy-100 hover:border-wibl-teal/30'}
          ${featured ? 'ring-2 ring-wibl-teal ring-offset-4' : ''}
          hover:scale-[1.02] active:scale-[0.98]
        `}
      >
        {featured && (
          <Badge variant="gradient" className="mb-3">
            Popular
          </Badge>
        )}
        <div className="space-y-4">
          <div>
            <h3 className="font-display font-black text-xl text-navy-700">{name}</h3>
            <p className="text-3xl font-display font-black text-gradient mt-2">{price}</p>
            {price !== 'Custom' && <p className="text-xs text-navy-400 font-bold">/month</p>}
          </div>
          <ul className="space-y-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-navy-600">
                <Check size={16} className="text-wibl-teal shrink-0 mt-0.5" />
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </button>
    </CardWrapper>
  );
}

// Simple Badge component for featured tag
function Badge({ variant, className, children }: { variant: string; className?: string; children: React.ReactNode }) {
  return (
    <span className={`inline-block px-3 py-1 text-xs font-black rounded-full gradient-brand text-white ${className}`}>
      {children}
    </span>
  );
}
