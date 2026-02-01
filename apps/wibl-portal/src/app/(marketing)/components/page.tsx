"use client";

import React, { useState } from 'react';
import {
    Button,
    Input,
    Card,
    Badge,
    Avatar,
    ChatBubble,
    LoadingDots,
    Modal,
    GradientBorder,
    Logo
} from '@/components/ui';
import { Send, Search, Sparkles, Rocket } from 'lucide-react';

export default function ComponentShowcasePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-canvas-light p-8">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <Logo size="xl" variant="full" animated className="mx-auto" />
                    <h1 className="text-5xl font-display font-black text-gradient">
                        WIBL Component Library
                    </h1>
                    <p className="text-navy-400 text-lg font-bold">
                        Simply connected. Fluid, organic, modern design system.
                    </p>
                </div>

                {/* Buttons */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-display font-black text-navy-700">Buttons</h2>
                    <Card variant="elevated" padding="lg">
                        <div className="space-y-6">
                            {/* Primary Buttons */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-black text-navy-500 uppercase tracking-wider">Primary Variant</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Button variant="primary" size="sm">Small Button</Button>
                                    <Button variant="primary" size="md">Medium Button</Button>
                                    <Button variant="primary" size="lg">Large Button</Button>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <Button variant="primary" leftIcon={<Sparkles size={18} />}>
                                        With Left Icon
                                    </Button>
                                    <Button variant="primary" rightIcon={<Rocket size={18} />}>
                                        With Right Icon
                                    </Button>
                                    <Button variant="primary" isLoading>
                                        Loading State
                                    </Button>
                                </div>
                            </div>

                            {/* Secondary Buttons */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-black text-navy-500 uppercase tracking-wider">Secondary Variant</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Button variant="secondary">Secondary</Button>
                                    <Button variant="secondary" leftIcon={<Search size={18} />}>
                                        Search
                                    </Button>
                                </div>
                            </div>

                            {/* Ghost & Coral */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-black text-navy-500 uppercase tracking-wider">Other Variants</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Button variant="ghost">Ghost Button</Button>
                                    <Button variant="coral" rightIcon={<Send size={18} />}>
                                        Coral CTA
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Inputs */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-display font-black text-navy-700">Inputs</h2>
                    <Card variant="elevated" padding="lg">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
                            />
                            <Input
                                label="Password"
                                type="password"
                                helperText="Must be at least 8 characters"
                            />
                            <Input
                                label="Search"
                                leftElement={<Search size={18} />}
                                placeholder="Search anything..."
                            />
                            <Input
                                label="With Error"
                                error="This field is required"
                                defaultValue="Invalid input"
                            />
                        </div>
                    </Card>
                </section>

                {/* Cards */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-display font-black text-navy-700">Cards</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card variant="elevated" padding="md" hoverable>
                            <h3 className="font-display font-black text-lg mb-2">Elevated Card</h3>
                            <p className="text-navy-400">Hover me for lift effect!</p>
                        </Card>
                        <Card variant="outlined" padding="md">
                            <h3 className="font-display font-black text-lg mb-2">Outlined Card</h3>
                            <p className="text-navy-400">Clean and minimal</p>
                        </Card>
                        <Card variant="gradient" padding="md" glowing>
                            <h3 className="font-display font-black text-lg mb-2">Gradient Card</h3>
                            <p className="text-navy-400">Subtle gradient background</p>
                        </Card>
                    </div>
                </section>

                {/* Badges */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-display font-black text-navy-700">Badges</h2>
                    <Card variant="elevated" padding="lg">
                        <div className="flex flex-wrap gap-3">
                            <Badge variant="success">Active</Badge>
                            <Badge variant="warning">Pending</Badge>
                            <Badge variant="error">Failed</Badge>
                            <Badge variant="info">Info</Badge>
                            <Badge variant="teal">WIBL Teal</Badge>
                            <Badge variant="gradient">Gradient</Badge>
                            <Badge variant="gradient" size="sm">Small</Badge>
                        </div>
                    </Card>
                </section>

                {/* Avatars */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-display font-black text-navy-700">Avatars</h2>
                    <Card variant="elevated" padding="lg">
                        <div className="flex flex-wrap items-center gap-6">
                            <Avatar size="sm" fallback="JD" />
                            <Avatar size="md" fallback="AB" status="online" />
                            <Avatar size="lg" fallback="CD" status="busy" ring />
                            <Avatar size="xl" fallback="EF" status="offline" />
                        </div>
                    </Card>
                </section>

                {/* Chat Bubbles */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-display font-black text-navy-700">Chat Bubbles</h2>
                    <Card variant="elevated" padding="lg">
                        <div className="space-y-4 max-w-2xl">
                            <ChatBubble variant="user" timestamp="2:45 PM">
                                Hey! Can you help me build an AI agent?
                            </ChatBubble>
                            <ChatBubble variant="assistant" timestamp="2:45 PM" animated>
                                Of course! I'd be happy to help you build an AI agent. What kind of agent are you looking to create?
                            </ChatBubble>
                            <ChatBubble variant="system">
                                Agent created successfully
                            </ChatBubble>
                        </div>
                    </Card>
                </section>

                {/* Gradient Border */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-display font-black text-navy-700">Gradient Border</h2>
                    <GradientBorder animated width={3}>
                        <div className="p-8 space-y-2">
                            <h3 className="font-display font-black text-2xl text-gradient">
                                Premium Feature
                            </h3>
                            <p className="text-navy-400">
                                This card has an animated gradient border that showcases the WIBL brand colors.
                            </p>
                            <div className="flex gap-3 pt-4">
                                <Button variant="primary" size="sm">Get Started</Button>
                                <Button variant="ghost" size="sm">Learn More</Button>
                            </div>
                        </div>
                    </GradientBorder>
                </section>

                {/* Loading States */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-display font-black text-navy-700">Loading States</h2>
                    <Card variant="elevated" padding="lg">
                        <div className="flex items-center gap-8">
                            <div className="text-center space-y-2">
                                <LoadingDots color="gradient" size="md" />
                                <p className="text-xs text-navy-400">Gradient</p>
                            </div>
                            <div className="text-center space-y-2">
                                <LoadingDots color="teal" size="lg" />
                                <p className="text-xs text-navy-400">Teal Large</p>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Modal Demo */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-display font-black text-navy-700">Modal</h2>
                    <Card variant="elevated" padding="lg">
                        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                            Open Modal
                        </Button>
                    </Card>
                </section>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Example Modal"
                    size="md"
                >
                    <div className="space-y-4">
                        <p className="text-navy-600">
                            This is a modal with portal-based rendering, backdrop blur, and smooth animations.
                        </p>
                        <Input label="Your Name" placeholder="Enter your name" />
                        <div className="flex gap-3 pt-4">
                            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                                Confirm
                            </Button>
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
