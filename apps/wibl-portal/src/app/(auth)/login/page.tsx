"use client";

import React from 'react';
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowRight, Github } from "lucide-react";
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-wibl-mint selection:text-wibl-navy">
            <div className="fixed inset-0 pointer-events-none -z-10 bg-wibl-subtle opacity-30" />

            <div className="w-full max-w-md space-y-8 animate-slide-up">
                <div className="text-center space-y-2">
                    <Logo className="justify-center h-10" />
                    <h1 className="text-3xl font-display font-black text-navy-700 pt-4">Welcome Back</h1>
                    <p className="text-navy-400 font-bold">Simply connected. Continue your journey.</p>
                </div>

                <Card variant="elevated" padding="lg" className="space-y-6">
                    <div className="space-y-4">
                        <Button variant="secondary" className="w-full justify-center gap-3">
                            <Github size={20} /> Continue with GitHub
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-navy-100" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-navy-300 font-bold">Or with email</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Input label="Email Address" type="email" required />
                            <Button variant="primary" size="lg" className="w-full">
                                Send Magic Link <ArrowRight size={18} />
                            </Button>
                        </div>
                    </div>
                </Card>

                <p className="text-center text-sm font-bold text-navy-400">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-wibl-teal hover:underline px-1">
                        Create one with Wibl
                    </Link>
                </p>
            </div>
        </div>
    );
}
