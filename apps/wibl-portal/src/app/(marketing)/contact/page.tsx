"use client";

import React, { useState } from 'react';
import {
    Mail,
    MapPin,
    MessageSquare,
    Twitter,
    Linkedin,
    Github,
    ArrowRight,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { Button, Card, Badge, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-canvas-light">
            <section className="pt-32 pb-24 text-center space-y-6">
                <Badge variant="teal" size="md">GET IN TOUCH</Badge>
                <h1 className="text-5xl md:text-7xl font-display font-black text-navy-800 tracking-tighter">
                    We're here to <br />
                    <span className="text-gradient">help you build.</span>
                </h1>
                <p className="text-xl text-navy-500 font-medium max-w-2xl mx-auto">
                    Have questions about Wibl? Our team typically responds within 24 hours.
                </p>
            </section>

            <section className="max-w-7xl mx-auto px-6 pb-32">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Form */}
                    <Card variant="elevated" className="p-8 md:p-12 shadow-wibl border-navy-50 rounded-[2.5rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 gradient-brand opacity-5 blur-2xl" />

                        {submitted ? (
                            <div className="py-20 text-center space-y-6 animate-slide-up">
                                <div className="w-20 h-20 rounded-full bg-teal-50 text-wibl-teal flex items-center justify-center mx-auto shadow-sm">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h2 className="text-3xl font-display font-black text-navy-800 tracking-tighter">Message Received!</h2>
                                <p className="text-navy-500 font-medium max-w-xs mx-auto">
                                    Thank you for reaching out. A member of our team will be in touch shortly.
                                </p>
                                <Button variant="ghost" onClick={() => setSubmitted(false)}>Send another message</Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-navy-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <Input placeholder="John Doe" required className="h-14 bg-navy-50/50 border-navy-100" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-navy-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <Input type="email" placeholder="john@company.com" required className="h-14 bg-navy-50/50 border-navy-100" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-navy-400 uppercase tracking-widest ml-1">Subject</label>
                                    <Input placeholder="How can we help?" required className="h-14 bg-navy-50/50 border-navy-100" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-navy-400 uppercase tracking-widest ml-1">Department</label>
                                    <select className="w-full h-14 bg-navy-50/50 border-2 border-navy-100 rounded-2xl px-4 font-medium text-navy-600 outline-none focus:border-wibl-teal transition-all appearance-none cursor-pointer">
                                        <option>General Inquiry</option>
                                        <option>Sales & Partnerships</option>
                                        <option>Technical Support</option>
                                        <option>Billing Questions</option>
                                        <option>Security & Compliance</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-navy-400 uppercase tracking-widest ml-1">Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        placeholder="How can we help you?"
                                        className="w-full bg-navy-50/50 border-2 border-navy-100 rounded-2xl px-4 py-4 font-medium text-navy-600 outline-none focus:border-wibl-teal transition-all resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="w-full h-16 text-lg font-bold"
                                    disabled={isSubmitting}
                                    leftIcon={isSubmitting ? <Loader2 className="animate-spin" size={24} /> : undefined}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>
                        )}
                    </Card>

                    {/* Contact Info */}
                    <div className="space-y-12 lg:pl-12">
                        <div className="space-y-8">
                            <h2 className="text-3xl font-display font-black text-navy-800 tracking-tighter">Connection points.</h2>
                            <p className="text-lg text-navy-500 font-medium leading-relaxed">
                                Prefer direct contact? Reach out through our official channels or visit our virtual headquarters.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-6 items-start group">
                                <div className="w-12 h-12 rounded-xl bg-teal-50 text-wibl-teal flex items-center justify-center shrink-0 group-hover:gradient-brand group-hover:text-white transition-all duration-300">
                                    <Mail size={20} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-navy-400 uppercase tracking-widest">Email Us</p>
                                    <p className="text-xl font-display font-black text-navy-800 hover:text-wibl-teal transition-colors cursor-pointer">hello@wibl.io</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start group">
                                <div className="w-12 h-12 rounded-xl bg-teal-50 text-wibl-teal flex items-center justify-center shrink-0 group-hover:gradient-brand group-hover:text-white transition-all duration-300">
                                    <MapPin size={20} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-navy-400 uppercase tracking-widest">Headquarters</p>
                                    <p className="text-xl font-display font-black text-navy-800 leading-tight">
                                        Virtual First - Registered in <br />
                                        <span className="text-wibl-teal">Lisbon, Portugal</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start group">
                                <div className="w-12 h-12 rounded-xl bg-teal-50 text-wibl-teal flex items-center justify-center shrink-0 group-hover:gradient-brand group-hover:text-white transition-all duration-300">
                                    <MessageSquare size={20} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-navy-400 uppercase tracking-widest">Community</p>
                                    <p className="text-xl font-display font-black text-navy-800 hover:text-wibl-teal transition-colors cursor-pointer">Join our Discord</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 space-y-6">
                            <p className="text-xs font-black text-navy-300 uppercase tracking-widest">Follow the evolution</p>
                            <div className="flex gap-4">
                                <button className="w-12 h-12 rounded-xl bg-white border border-navy-50 text-navy-600 flex items-center justify-center hover:bg-navy-800 hover:text-white transition-all shadow-sm"><Twitter size={20} /></button>
                                <button className="w-12 h-12 rounded-xl bg-white border border-navy-50 text-navy-600 flex items-center justify-center hover:bg-navy-800 hover:text-white transition-all shadow-sm"><Linkedin size={20} /></button>
                                <button className="w-12 h-12 rounded-xl bg-white border border-navy-50 text-navy-600 flex items-center justify-center hover:bg-navy-800 hover:text-white transition-all shadow-sm"><Github size={20} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
