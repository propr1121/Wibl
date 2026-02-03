"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Legacy Agent Creation Flow (Scripted Wizard)
 * This has been replaced by the conversational Wibl AI Architect (/builder).
 * Redirecting all traffic to ensure a premium AI experience.
 */
export default function LegacyNewAgentPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/builder');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white selection:bg-wibl-teal selection:text-white">
            <div className="text-center space-y-8 animate-reveal">
                {/* Brand Logo for context during redirect */}
                <div className="w-16 h-16 rounded-2xl bg-navy-900 flex items-center justify-center mx-auto shadow-premium-sm">
                    <span className="text-2xl font-display font-black"><span className="text-wibl-teal">W</span><span className="text-white">.</span></span>
                </div>

                <div className="space-y-4">
                    <div className="w-10 h-10 border-4 border-wibl-teal border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_15px_rgba(78,205,196,0.3)]" />
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-wibl-teal uppercase tracking-[0.3em]">Simply Connected</p>
                        <p className="text-sm font-black text-navy-400 uppercase tracking-widest">Launching AI Architect...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
