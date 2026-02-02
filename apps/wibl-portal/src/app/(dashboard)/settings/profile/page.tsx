"use client";

import React, { useState } from 'react';
import { useHeaderConfig } from '@/components/layouts/DashboardContext';
import { Card, Button, Input, Avatar, Badge, GradientBorder } from '@/components/ui';
import { User, Mail, Shield, Camera, Globe, Lock, Bell, Zap, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
    const [isSaving, setIsSaving] = useState(false);

    useHeaderConfig({
        breadcrumbs: [
            { label: 'Overview', href: '/dashboard' },
            { label: 'Settings', href: '/settings' },
            { label: 'Profile', href: '/settings/profile' }
        ],
    });

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    return (
        <div className="space-y-12 pb-20 max-w-[1000px] mx-auto animate-reveal relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-5%] right-[-10%] w-[500px] h-[500px] bg-wibl-teal/5 rounded-full blur-[140px] pointer-events-none" />

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-wibl-teal uppercase tracking-[0.3em] mb-1">Personal Identity</p>
                    <h1 className="text-3xl lg:text-4xl font-display font-black text-navy-900 tracking-tighter">
                        Profile <span className="text-gradient">Settings.</span>
                    </h1>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Avatar & Quick Info */}
                <div className="space-y-6">
                    <Card variant="premium" padding="lg" className="bg-white/80 border-navy-50/50 backdrop-blur-md text-center">
                        <div className="relative inline-block mb-6">
                            <div className="w-32 h-32 rounded-full gradient-brand p-1 shadow-glow-teal">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white">
                                    <span className="text-4xl font-display font-black text-navy-800">JD</span>
                                </div>
                            </div>
                            <button className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-navy-900 text-white flex items-center justify-center shadow-premium-lg hover:scale-110 transition-transform">
                                <Camera size={16} />
                            </button>
                        </div>
                        <div className="space-y-1 mb-6">
                            <h2 className="text-xl font-display font-black text-navy-800">John Doe</h2>
                            <p className="text-sm text-navy-400 font-medium">Chief of Intelligence</p>
                        </div>
                        <Badge variant="teal" size="md" className="w-full justify-center py-2 font-black uppercase tracking-widest text-[9px]">
                            Pro Account
                        </Badge>
                    </Card>

                    <Card variant="outlined" padding="md" className="bg-canvas-subtle/50">
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-navy-400 uppercase tracking-widest">Account Health</h3>
                            <div className="space-y-3">
                                <HealthMetric label="Security Score" value="98%" color="text-wibl-teal" />
                                <HealthMetric label="API Integrity" value="Stable" color="text-wibl-mint" />
                                <HealthMetric label="Data Residency" value="EU (Dublin)" color="text-navy-400" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right: Form Settings */}
                <div className="lg:col-span-2 space-y-8">
                    <Card variant="premium" padding="lg" className="bg-white/80 border-navy-50/50 backdrop-blur-md">
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="First Name" placeholder="John" />
                                <FormField label="Last Name" placeholder="Doe" />
                                <FormField label="Email Address" placeholder="john@example.com" fullWidth />
                                <FormField label="Operation Title" placeholder="Chief of Intelligence" fullWidth />
                            </div>

                            <hr className="border-navy-50" />

                            <div className="space-y-6">
                                <h3 className="text-lg font-display font-black text-navy-800 tracking-tight">Security & Privacy</h3>
                                <div className="space-y-4">
                                    <SecurityOption
                                        icon={<Lock size={18} />}
                                        title="Two-Factor Authentication"
                                        desc="Add an extra layer of security to your account."
                                        enabled
                                    />
                                    <SecurityOption
                                        icon={<Shield size={18} />}
                                        title="Session Management"
                                        desc="View and manage your active login sessions."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="px-12 h-14 shadow-glow"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Synchronizing...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card variant="outlined" padding="lg" className="border-coral/20 bg-coral/5 border-dashed">
                        <div className="flex items-center justify-between gap-8">
                            <div className="space-y-1">
                                <h3 className="text-sm font-black text-navy-800 uppercase tracking-tight">Danger Zone</h3>
                                <p className="text-xs text-navy-500 font-medium">Permanently delete your profile and all intelligence data.</p>
                            </div>
                            <Button variant="secondary" className="text-coral hover:bg-coral hover:text-white border-coral/20 h-10 px-6 text-[10px] font-black uppercase tracking-widest transition-all">
                                Deactivate
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function FormField({ label, placeholder, fullWidth = false }: any) {
    return (
        <div className={cn("space-y-2", fullWidth && "md:col-span-2")}>
            <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest ml-1">{label}</label>
            <input
                type="text"
                placeholder={placeholder}
                className="w-full bg-navy-50/50 border-2 border-transparent focus:border-wibl-teal focus:bg-white rounded-xl px-5 py-3 outline-none transition-all font-medium text-navy-800"
            />
        </div>
    );
}

function HealthMetric({ label, value, color }: any) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-navy-400 uppercase tracking-tight">{label}</span>
            <span className={cn("text-[10px] font-black uppercase tracking-widest", color)}>{value}</span>
        </div>
    );
}

function SecurityOption({ icon, title, desc, enabled = false }: any) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-navy-50/50 hover:bg-navy-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-navy-400 group-hover:text-wibl-teal transition-colors">
                    {icon}
                </div>
                <div>
                    <h4 className="text-sm font-black text-navy-800">{title}</h4>
                    <p className="text-[10px] text-navy-400 font-medium">{desc}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                {enabled && <Badge variant="teal" size="sm" className="px-2 py-0.5 font-black uppercase tracking-tighter text-[8px]">Enabled</Badge>}
                <ChevronRight size={18} className="text-navy-300" />
            </div>
        </div>
    );
}
