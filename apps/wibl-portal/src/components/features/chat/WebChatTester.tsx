"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input, Avatar, Badge } from '@/components/ui';
import { Send, Bot, User, Loader2, Sparkles, MessageSquare, ShieldCheck, Wifi, WifiOff, Settings2, FileText, BarChart2, Code2, Maximize2, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    state?: 'delta' | 'final' | 'error';
    citations?: Array<{
        title: string;
        source: string;
        relevance: number;
    }>;
}

interface WebChatTesterProps {
    gatewayUrl: string;
    authToken: string;
    agentName: string;
}

export function WebChatTester({ gatewayUrl, authToken, agentName, agentId }: WebChatTesterProps & { agentId?: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>('disconnected');
    const [editingMsg, setEditingMsg] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const [sessionKey, setSessionKey] = useState<string | null>(null);
    const [activeArtifact, setActiveArtifact] = useState<{ type: 'doc' | 'chart' | 'code', title: string, content: string } | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const pendingRequests = useRef<Map<string, { resolve: (val: any) => void, reject: (err: any) => void }>>(new Map());

    // Connect to Gateway
    useEffect(() => {
        const connect = () => {
            setStatus('connecting');
            const ws = new WebSocket(gatewayUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                // Handshake
                const connectFrame = {
                    type: 'req',
                    id: crypto.randomUUID(),
                    method: 'connect',
                    params: {
                        minProtocol: 1,
                        maxProtocol: 1,
                        client: {
                            id: 'wibl-portal-tester',
                            displayName: 'Wibl Tester',
                            version: '1.0.0',
                            platform: 'browser',
                            mode: 'cli',
                            instanceId: crypto.randomUUID()
                        },
                        auth: { token: authToken },
                        role: 'operator',
                        scopes: ['operator.admin', 'operator.write', 'operator.read']
                    }
                };
                ws.send(JSON.stringify(connectFrame));
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    // Handle Response
                    if (data.type === 'res' || (data.id && (data.ok !== undefined || data.error !== undefined))) {
                        const pending = pendingRequests.current.get(data.id);
                        if (pending) {
                            if (data.ok) pending.resolve(data.payload);
                            else pending.reject(data.error);
                            pendingRequests.current.delete(data.id);
                        }

                        // Success connect
                        if (data.ok && data.payload?.auth) {
                            setStatus('connected');
                            // Create or get a session
                            if (!sessionKey) {
                                // For the tester, we can just use a 'default-test-session'
                                setSessionKey('test-session-' + crypto.randomUUID().slice(0, 8));
                            }
                        }
                    }

                    // Handle Events (Push)
                    if (data.type === 'evt' || data.event) {
                        if (data.event === 'chat') {
                            const payload = data.payload;
                            handleChatEvent(payload);
                        }
                    }
                } catch (err) {
                    console.error('Failed to parse WS message:', err);
                }
            };

            ws.onerror = (err) => {
                console.error('WS Error:', err);
                setStatus('error');
            };

            ws.onclose = () => {
                setStatus('disconnected');
                wsRef.current = null;
            };
        };

        connect();
        return () => {
            wsRef.current?.close();
        };
    }, [gatewayUrl, authToken]);

    const handleChatEvent = (payload: any) => {
        const { state, message, runId, payload: chatPayload } = payload;

        setMessages(prev => {
            const existingIdx = prev.findIndex(m => m.id === runId);
            const content = message?.content?.[0]?.text || '';
            const citations = chatPayload?.citations || [];

            // Artifact detection
            if (state === 'final') {
                if (content.includes('[CANVAS_DOC]')) {
                    const docContent = content.split('[CANVAS_DOC]')[1].split('[/CANVAS_DOC]')[0];
                    setActiveArtifact({ type: 'doc', title: 'Generated Document', content: docContent });
                } else if (content.includes('[CANVAS_CHART]')) {
                    const chartContent = content.split('[CANVAS_CHART]')[1].split('[/CANVAS_CHART]')[0];
                    setActiveArtifact({ type: 'chart', title: 'Data Visualization', content: chartContent });
                } else if (content.includes('[CANVAS_CODE]')) {
                    const codeContent = content.split('[CANVAS_CODE]')[1].split('[/CANVAS_CODE]')[0];
                    setActiveArtifact({ type: 'code', title: 'System Logic Export', content: codeContent });
                }
            }

            if (existingIdx >= 0) {
                const updated = [...prev];
                updated[existingIdx] = {
                    ...updated[existingIdx],
                    content: state === 'delta' ? (updated[existingIdx].content + content) : (content || updated[existingIdx].content),
                    state: state,
                    citations: state === 'final' ? citations : updated[existingIdx].citations
                };
                return updated;
            } else {
                return [...prev, {
                    id: runId,
                    role: 'assistant',
                    content: content,
                    timestamp: new Date(),
                    state: state,
                    citations: citations
                }];
            }
        });
    };

    const sendRequest = (method: string, params: any) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            throw new Error('Gateway not connected');
        }
        const id = crypto.randomUUID();
        const frame = { type: 'req', id, method, params };
        wsRef.current.send(JSON.stringify(frame));
        return new Promise((resolve, reject) => {
            pendingRequests.current.set(id, { resolve, reject });
        });
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleCorrection = async (msgId: string) => {
        setIsSavingEdit(true);
        try {
            const msgIdx = messages.findIndex(m => m.id === msgId);
            const userMsg = messages.slice(0, msgIdx).reverse().find(m => m.role === 'user');

            if (!userMsg) throw new Error('Could not find corresponding user message');

            const response = await fetch('/api/knowledge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'text',
                    title: `Correction: ${userMsg.content.slice(0, 30)}...`,
                    content: `Question: ${userMsg.content}\nAnswer: ${editContent}`,
                    agentId: agentId
                }),
            });

            if (response.ok) {
                setMessages(prev => prev.map(m => m.id === msgId ? { ...m, content: editContent } : m));
                setEditingMsg(null);
            }
        } catch (err) {
            console.error('Failed to save correction:', err);
        } finally {
            setIsSavingEdit(false);
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || status !== 'connected' || !sessionKey) return;

        const runId = crypto.randomUUID();
        const userMsg: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');

        try {
            await sendRequest('chat.send', {
                sessionKey: sessionKey,
                message: input,
                idempotencyKey: runId
            });
        } catch (err) {
            console.error('Failed to send chat:', err);
            setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: 'Error: Failed to reach the agent engine.',
                timestamp: new Date(),
                state: 'error'
            }]);
        }
    };

    const isTyping = messages.some(m => m.role === 'assistant' && m.state === 'delta');

    return (
        <Card variant="glass" className="h-[650px] flex flex-col overflow-hidden border-navy-50/40 shadow-2xl relative">
            {/* Connection Overlay */}
            {status !== 'connected' && (
                <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-500">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-navy-50 flex items-center justify-center mx-auto">
                            {status === 'connecting' ? <Loader2 className="animate-spin text-wibl-teal" size={32} /> : <WifiOff className="text-coral" size={32} />}
                        </div>
                        <div>
                            <p className="text-sm font-black text-navy-900 uppercase tracking-widest">
                                {status === 'connecting' ? 'Gateway Handshake...' : 'Engine Offline'}
                            </p>
                            <p className="text-[11px] font-medium text-navy-400 mt-1">
                                {status === 'connecting' ? 'Securing WebSocket tunnel' : 'Ensure the local agent process is running.'}
                            </p>
                        </div>
                        {status === 'error' && (
                            <Button variant="primary" size="sm" onClick={() => window.location.reload()} className="mt-4">Retry Sync</Button>
                        )}
                    </div>
                </div>
            )}

            {/* Chat Header */}
            <div className="p-5 border-b border-navy-50/50 bg-white/70 backdrop-blur-md flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar size="sm" fallback={agentName[0]} className="ring-2 ring-wibl-teal/20" />
                        <div className={cn(
                            "absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full shadow-sm",
                            status === 'connected' ? "bg-green-500" : "bg-navy-200"
                        )} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-[13px] font-black text-navy-900 uppercase tracking-tight">{agentName}</p>
                            <Badge variant="teal" size="sm" className="text-[7px] py-0 h-4 px-1.5 opacity-80">Local Agent</Badge>
                        </div>
                        <p className="text-[10px] text-navy-400 font-bold uppercase tracking-[0.15em] mt-0.5">Instance: {sessionKey ? sessionKey.slice(-8) : 'Pending'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy-50 border border-navy-100/50">
                        <Wifi size={12} className={cn(status === 'connected' ? "text-green-500" : "text-navy-300")} />
                        <span className="text-[9px] font-black uppercase text-navy-400 tracking-widest">{status === 'connected' ? '19482 ACTIVE' : 'TUNNEL CLOSED'}</span>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-canvas-subtle/20 to-white"
            >
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-navy-50 flex items-center justify-center text-wibl-teal mb-2 shadow-inner">
                            <MessageSquare size={40} />
                        </div>
                        <div className="max-w-[240px]">
                            <p className="text-[11px] font-black text-navy-900 uppercase tracking-[0.2em] mb-2 leading-none">Intelligence Initialized</p>
                            <p className="text-[11px] font-medium text-navy-400 leading-relaxed">Your agent is listening on the local gateway. Send a message to begin the session.</p>
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex gap-5 animate-in fade-in slide-in-from-bottom-3 duration-500",
                            msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-500 hover:scale-110 shadow-sm",
                            msg.role === 'user' ? "bg-navy-900 border-navy-700 text-white" : "bg-white border-navy-100 text-wibl-teal"
                        )}>
                            {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                        </div>
                        <div className={cn(
                            "max-w-[85%] p-5 rounded-[1.5rem] text-[14px] leading-relaxed shadow-sm transition-all duration-300 relative group/msg",
                            msg.role === 'user'
                                ? "bg-navy-900 text-white rounded-tr-none hover:bg-navy-800"
                                : "bg-white border border-navy-50 text-navy-900 rounded-tl-none hover:border-wibl-teal/20"
                        )}>
                            {editingMsg === msg.id ? (
                                <div className="space-y-3">
                                    <textarea
                                        className="w-full bg-navy-50 border border-navy-100 rounded-xl p-3 text-navy-900 focus:ring-1 focus:ring-wibl-teal outline-none min-h-[100px]"
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button size="sm" variant="ghost" className="text-[10px]" onClick={() => setEditingMsg(null)}>Cancel</Button>
                                        <Button size="sm" variant="primary" className="text-[10px]" onClick={() => handleCorrection(msg.id)} isLoading={isSavingEdit}>Save & Train</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                            )}

                            {msg.role === 'assistant' && !editingMsg && (
                                <button
                                    onClick={() => { setEditingMsg(msg.id); setEditContent(msg.content); }}
                                    className="absolute -right-10 top-2 opacity-0 group-hover/msg:opacity-40 hover:!opacity-100 transition-opacity p-2 text-navy-400 hover:text-wibl-teal"
                                    title="Correct this response"
                                >
                                    <Settings2 size={14} />
                                </button>
                            )}

                            {msg.citations && msg.citations.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-navy-50 space-y-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles size={10} className="text-wibl-teal" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-navy-400">Knowledge Citations</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {msg.citations.map((cite, i) => (
                                            <div key={i} className="flex items-center gap-2 px-2 py-1 bg-navy-50 rounded-lg border border-navy-100/50 hover:bg-white hover:border-wibl-teal/30 transition-all cursor-help group/cite">
                                                <Badge variant="teal" size="sm" className="h-3 text-[7px] px-1 font-black bg-wibl-teal/20 text-wibl-teal border-transparent">
                                                    {Math.round(cite.relevance * 100)}%
                                                </Badge>
                                                <span className="text-[10px] font-bold text-navy-500 truncate max-w-[120px]">{cite.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className={cn(
                                "mt-3 text-[9px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2",
                                msg.role === 'user' ? "justify-end" : "justify-start"
                            )}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {msg.state === 'delta' && <Loader2 size={8} className="animate-spin text-wibl-teal" />}
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-5 animate-pulse">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white border border-navy-100 text-wibl-teal shadow-sm">
                            <Bot size={18} />
                        </div>
                        <div className="bg-white border border-navy-50 p-5 rounded-[1.5rem] rounded-tl-none shadow-sm flex gap-1.5 items-center">
                            <div className="w-2 h-2 bg-wibl-teal/40 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-wibl-teal/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-2 h-2 bg-wibl-teal/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-navy-100/50 z-10">
                <div className="relative group">
                    <Input
                        placeholder="Message your agent engine..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="pr-14 h-16 bg-navy-50/50 border-navy-100 hover:border-wibl-teal/30 focus:border-wibl-teal/50 rounded-[1.25rem] text-[14px] font-medium transition-all duration-300"
                        disabled={status !== 'connected'}
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        className="absolute right-3 top-3 h-10 w-10 p-0 shadow-glow rounded-xl transition-transform active:scale-95"
                        disabled={!input.trim() || status !== 'connected' || isTyping}
                    >
                        <Send size={20} />
                    </Button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={12} className="text-wibl-teal" />
                        <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest leading-none">End-to-End Encrypted Tunnel</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sparkles size={12} className="text-wibl-teal opacity-60" />
                        <p className="text-[10px] font-black text-navy-300 uppercase tracking-widest leading-none">Clawdbot Core v1.4.2</p>
                    </div>
                </div>
            </form>
            {/* Artifact Canvas (Side Panel) */}
            {activeArtifact && (
                <div className="absolute top-5 right-5 bottom-5 w-[450px] bg-white border border-navy-50 rounded-[2.5rem] shadow-2xl z-[60] flex flex-col animate-in slide-in-from-right-8 duration-500 overflow-hidden">
                    <div className="p-6 border-b border-navy-50 flex items-center justify-between bg-white/80 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-wibl-teal shadow-lg">
                                {activeArtifact.type === 'doc' ? <FileText size={20} /> : activeArtifact.type === 'chart' ? <BarChart2 size={20} /> : <Code2 size={20} />}
                            </div>
                            <div>
                                <h3 className="text-[13px] font-black text-navy-900 uppercase tracking-tight">{activeArtifact.title}</h3>
                                <p className="text-[10px] font-bold text-navy-400 uppercase tracking-widest">{activeArtifact.type.toUpperCase()} ARTIFACT</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveArtifact(null)}
                            className="p-2 hover:bg-navy-50 rounded-full transition-colors"
                        >
                            <X size={20} className="text-navy-400" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {activeArtifact.type === 'doc' ? (
                            <div className="prose prose-sm prose-navy max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: activeArtifact.content }} />
                            </div>
                        ) : activeArtifact.type === 'chart' ? (
                            <div className="h-full flex flex-col items-center justify-center space-y-6">
                                <div className="w-64 h-64 border-4 border-wibl-teal/20 rounded-full border-t-wibl-teal animate-[spin_10s_linear_infinite]" />
                                <div className="text-center">
                                    <p className="text-lg font-display font-black text-navy-900">Virtualizing Analytics...</p>
                                    <p className="text-[11px] font-black text-navy-400 uppercase tracking-widest mt-1">Aggregating workforce metrics</p>
                                </div>
                            </div>
                        ) : (
                            <pre className="p-6 bg-navy-900 rounded-[2rem] text-wibl-teal font-mono text-xs overflow-x-auto shadow-inner">
                                <code>{activeArtifact.content}</code>
                            </pre>
                        )}
                    </div>

                    <div className="p-6 bg-navy-50/50 border-t border-navy-50">
                        <Button className="w-full bg-navy-900 text-white hover:bg-navy-800 text-[10px] font-black uppercase tracking-widest h-12 shadow-glow">
                            Download as Protocol
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
}

// Internal standard Badge if not available from UI but we saw it in index.ts so we should use it from there.
// However, to avoid import issues in this specific environment, I'll keep the local one but use standardized styles.
