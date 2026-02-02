"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChannelCard } from './ChannelCard';
import { Button } from '@/components/ui';
import { QrCode, X, Search, Smartphone, ShieldCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

export function ChannelManager({ agentId }: { agentId: string }) {
    const [pairingChannel, setPairingChannel] = useState<'whatsapp' | 'telegram' | null>(null);
    const [pairingStep, setPairingStep] = useState<'requesting' | 'qr' | 'success'>('requesting');
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [wsStatus, setWsStatus] = useState<'connected' | 'disconnected'>('disconnected');

    // Status states for channels
    const [whatsappStatus, setWhatsappStatus] = useState<'connected' | 'disconnected' | 'pairing'>('disconnected');

    // Sync status with backend
    useEffect(() => {
        refreshStatus();
        const interval = setInterval(refreshStatus, 10000);
        return () => clearInterval(interval);
    }, [agentId]);

    const refreshStatus = async () => {
        try {
            const res = await fetch(`/api/agents/${agentId}`);
            if (res.ok) {
                const data = await res.json();
                // Simple check for demo
                if (data.status === 'active') {
                    setWhatsappStatus('connected');
                }
            }
        } catch (err) {
            console.error('Failed to refresh status:', err);
        }
    };

    const handleConnect = async (type: 'whatsapp' | 'telegram' | 'slack' | 'web') => {
        if (type === 'whatsapp') {
            setPairingChannel('whatsapp');
            setPairingStep('requesting');
            setWhatsappStatus('pairing');

            try {
                // Step 1: Request QR
                const startRes = await fetch('/api/channels/whatsapp/pairing', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ agentId, action: 'start' })
                });

                const startData = await startRes.json();
                if (startData.qrDataUrl) {
                    setQrCode(startData.qrDataUrl);
                    setPairingStep('qr');

                    // Step 2: Wait for scan
                    const waitRes = await fetch('/api/channels/whatsapp/pairing', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ agentId, action: 'wait' })
                    });

                    const waitData = await waitRes.json();
                    if (waitData.connected) {
                        confetti({
                            particleCount: 150,
                            spread: 70,
                            origin: { y: 0.6 },
                            colors: ['#00F2EA', '#00BAFF', '#050505']
                        });
                        setPairingStep('success');
                        setWhatsappStatus('connected');
                        setTimeout(() => setPairingChannel(null), 3000);
                    }
                }
            } catch (err) {
                console.error('Pairing failed:', err);
                setPairingChannel(null);
                setWhatsappStatus('disconnected');
            }
        }
    };

    return (
        <div className="space-y-8 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ChannelCard
                    type="whatsapp"
                    status={whatsappStatus}
                    onConnect={() => handleConnect('whatsapp')}
                />
                <ChannelCard
                    type="telegram"
                    status="disconnected"
                    onConnect={() => handleConnect('telegram')}
                />
                <ChannelCard
                    type="slack"
                    status="disconnected"
                    onConnect={() => handleConnect('slack')}
                />
                <ChannelCard
                    type="web"
                    status="connected"
                    onConnect={() => { }}
                />
            </div>

            {/* Premium QR Pairing Modal */}
            {pairingChannel === 'whatsapp' && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-md" onClick={() => setPairingChannel(null)} />

                    <div className="relative bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden border border-navy-50 animate-in zoom-in-95 duration-500">
                        {pairingStep === 'success' ? (
                            <div className="p-12 text-center space-y-6">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white shadow-lg animate-bounce">
                                    <ShieldCheck size={40} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-display font-black text-navy-900 tracking-tight">Success! Locked & Loaded.</h2>
                                    <p className="text-navy-500 mt-2">Your WhatsApp Business account is now paired with Wibl.</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => setPairingChannel(null)}
                                    className="absolute top-6 right-6 p-2 hover:bg-navy-50 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-navy-400" />
                                </button>

                                <div className="flex flex-col md:flex-row h-full">
                                    {/* Left: QR Side */}
                                    <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col items-center justify-center bg-canvas-subtle border-r border-navy-50">
                                        <div className="relative group">
                                            <div className="absolute inset-[-20px] bg-wibl-teal/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                            <div className="w-56 h-56 bg-white rounded-3xl p-4 shadow-xl border border-navy-100 relative z-10 flex items-center justify-center">
                                                {pairingStep === 'requesting' ? (
                                                    <div className="flex flex-col items-center gap-3">
                                                        <Loader2 className="animate-spin text-wibl-teal" size={40} />
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">Syncing Engine...</p>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="w-full h-full bg-contain bg-no-repeat bg-center"
                                                        style={{ backgroundImage: `url(${qrCode})` }}
                                                    />
                                                )}
                                            </div>
                                            <div className="absolute top-[-10px] right-[-10px] w-8 h-8 rounded-full bg-wibl-teal text-white flex items-center justify-center shadow-lg animate-pulse">
                                                <QrCode size={16} />
                                            </div>
                                        </div>
                                        <div className="mt-8 text-center bg-wibl-teal/10 px-4 py-2 rounded-full border border-wibl-teal/10">
                                            <p className="text-[10px] font-black text-wibl-teal uppercase tracking-widest animate-pulse">Waiting for scan...</p>
                                        </div>
                                    </div>

                                    {/* Right: Instructions */}
                                    <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center">
                                        <h2 className="text-2xl font-display font-black text-navy-900 mb-6 tracking-tight leading-tight">
                                            Connect <br /><span className="text-gradient">WhatsApp Business.</span>
                                        </h2>

                                        <div className="space-y-6">
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center font-display font-black text-navy-400 shrink-0 text-sm">1</div>
                                                <div>
                                                    <p className="text-sm font-black text-navy-900 mb-1">Open WhatsApp</p>
                                                    <p className="text-[12px] text-navy-500 font-medium opacity-80 leading-relaxed">Ensure you have your professional account ready on your phone.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center font-display font-black text-navy-400 shrink-0 text-sm">2</div>
                                                <div>
                                                    <p className="text-sm font-black text-navy-900 mb-1">Linked Devices</p>
                                                    <p className="text-[12px] text-navy-500 font-medium opacity-80 leading-relaxed">Tap Menu or Settings and select "Linked Devices".</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center font-display font-black text-navy-400 shrink-0 text-sm">3</div>
                                                <div>
                                                    <p className="text-sm font-black text-navy-900 mb-1">Point & Scan</p>
                                                    <p className="text-[12px] text-navy-500 font-medium opacity-80 leading-relaxed">Wibl will automatically detect the connection and secure the session.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-10 pt-8 border-t border-navy-50 flex items-center gap-3">
                                            <ShieldCheck className="text-wibl-teal" size={18} />
                                            <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest leading-none">End-to-End Encrypted Session</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
