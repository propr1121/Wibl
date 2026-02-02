"use client";

import React, { useState } from 'react';
import { Button, Input, ChatBubble, Logo } from '@/components/ui';
import { X, Send, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    variant: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export function HelpWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            variant: 'assistant',
            content: "Hi! I'm here to help. What can I assist you with today?",
            timestamp: 'Just now',
        },
    ]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            variant: 'user',
            content: message,
            timestamp: 'Just now',
        };

        setMessages([...messages, userMessage]);
        setMessage('');

        // Simulate assistant response
        setTimeout(() => {
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                variant: 'assistant',
                content: "Thanks for your question! I'm processing your request and will get back to you shortly.",
                timestamp: 'Just now',
            };
            setMessages(prev => [...prev, assistantMessage]);
        }, 1000);
    };

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50 group">
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-wibl-mint to-wibl-teal shadow-wibl-lg hover:shadow-glow transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95 group"
                    aria-label="Open help"
                >
                    <span className="text-xl font-display font-black tracking-tighter mt-0.5">
                        <span className="text-navy-900 leading-none">W</span><span className="text-white leading-none">.</span>
                    </span>
                </button>

                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-navy-700 text-white text-xs font-bold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                    Need help?
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "fixed bottom-6 right-6 z-50 bg-white rounded-wibl shadow-wibl-lg border border-navy-100 flex flex-col transition-all duration-300",
                isMinimized ? "w-80 h-14" : "w-96 h-[600px]"
            )}
        >
            {/* Header */}
            <div className="gradient-brand px-4 py-3 rounded-t-wibl flex items-center justify-between shadow-premium-sm relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                        <span className="text-sm font-display font-black tracking-tighter mt-0.5">
                            <span className="text-navy-900">W</span><span className="text-white">.</span>
                        </span>
                    </div>
                    <div>
                        <h3 className="text-sm font-display font-black text-white">
                            Wibl Support
                        </h3>
                        <p className="text-[10px] text-white/80 font-medium">
                            We're here to help
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="w-8 h-8 rounded-md hover:bg-white/20 transition-colors flex items-center justify-center"
                        aria-label={isMinimized ? "Maximize" : "Minimize"}
                    >
                        <Minimize2 size={16} className="text-white" />
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-8 h-8 rounded-md hover:bg-white/20 transition-colors flex items-center justify-center"
                        aria-label="Close help"
                    >
                        <X size={16} className="text-white" />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-canvas-subtle">
                        {messages.map((msg) => (
                            <ChatBubble
                                key={msg.id}
                                variant={msg.variant}
                                timestamp={msg.timestamp}
                                animated
                            >
                                {msg.content}
                            </ChatBubble>
                        ))}
                    </div>

                    {/* Quick actions */}
                    <div className="px-4 py-2 border-t border-navy-50 bg-white">
                        <p className="text-xs font-black text-navy-500 mb-2 uppercase tracking-wider">
                            Quick actions
                        </p>
                        <div className="flex gap-2">
                            <button
                                className="px-3 py-1.5 text-xs font-bold bg-canvas-muted hover:bg-wibl-teal/10 hover:text-wibl-teal rounded-wibl-xs transition-colors"
                                onClick={() => setMessage('How do I create an agent?')}
                            >
                                Create agent
                            </button>
                            <button
                                className="px-3 py-1.5 text-xs font-bold bg-canvas-muted hover:bg-wibl-teal/10 hover:text-wibl-teal rounded-wibl-xs transition-colors"
                                onClick={() => setMessage('View documentation')}
                            >
                                Docs
                            </button>
                        </div>
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-navy-50 bg-white rounded-b-wibl">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 bg-canvas-muted border-2 border-transparent focus:border-wibl-teal focus:bg-white rounded-wibl-sm outline-none text-sm font-medium transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!message.trim()}
                                className="w-10 h-10 rounded-wibl-sm gradient-brand text-white hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                aria-label="Send message"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}
