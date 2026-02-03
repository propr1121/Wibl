"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Menu,
    X,
    ChevronRight,
    BookOpen,
    Cpu,
    Database,
    ShieldCheck,
    Share2,
    Terminal,
    ExternalLink,
    Github,
    Copy,
    Check,
    Zap
} from 'lucide-react';
import { Button, Logo, Badge, Card } from '@/components/ui';
import { cn } from '@/lib/utils';

// --- Docs Config ---

const DOCS_NAV = [
    {
        title: 'Getting Started',
        links: [
            { name: 'Introduction', href: '/docs' },
            { name: 'Quickstart Guide', href: '/docs/quickstart' },
            { name: 'Core Concepts', href: '/docs/concepts' },
        ]
    },
    {
        title: 'Agent Building',
        links: [
            { name: 'Conversational Creator', href: '/docs/builder' },
            { name: 'Personality Settings', href: '/docs/personality' },
            { name: 'Context Optimization', href: '/docs/context' },
        ]
    },
    {
        title: 'Data & Knowledge',
        links: [
            { name: 'Knowledge Bases', href: '/docs/kb' },
            { name: 'Document Chunking', href: '/docs/chunking' },
            { name: 'URL Scanning', href: '/docs/scanning' },
        ]
    },
    {
        title: 'Deployment',
        links: [
            { name: 'Web Widget', href: '/docs/web' },
            { name: 'WhatsApp API', href: '/docs/whatsapp' },
            { name: 'Slack & Discord', href: '/docs/social' },
            { name: 'REST API', href: '/docs/api' },
        ]
    },
    {
        title: 'Security',
        links: [
            { name: 'Data Privacy', href: '/docs/privacy' },
            { name: 'Prompt Injection', href: '/docs/injection' },
            { name: 'Compliance', href: '/docs/compliance' },
        ]
    }
];

// --- Documentation Page Component ---

export default function DocsPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Docs Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-navy-50 h-16 flex items-center px-6">
                <div className="flex-1 flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <Logo size="sm" />
                            <span className="font-display font-black text-xl text-navy-800 tracking-tighter">Wibl</span>
                            <Badge variant="teal" size="sm" className="ml-2 bg-navy-50 border-transparent text-navy-400">Docs</Badge>
                        </Link>

                        <div className="hidden md:flex items-center bg-navy-50 rounded-lg px-3 py-1.5 w-64 border border-navy-100 group">
                            <Search size={14} className="text-navy-300 group-focus-within:text-wibl-teal transition-colors" />
                            <input
                                type="text"
                                placeholder="Search documentation..."
                                className="bg-transparent border-none text-xs font-medium outline-none ml-2 w-full text-navy-600 placeholder:text-navy-300"
                            />
                            <span className="text-[10px] font-black text-navy-200 uppercase tracking-widest px-1.5 border border-navy-100 rounded">CMD+K</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-bold text-navy-600 hover:text-wibl-teal transition-colors">Login</Link>
                        <Link href="/builder">
                            <Button variant="primary" size="sm">New Agent</Button>
                        </Link>
                        <button className="md:hidden p-2 text-navy-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            <div className="pt-16 max-w-7xl mx-auto flex">
                {/* Sidebar */}
                <aside className={cn(
                    "fixed md:sticky top-16 h-[calc(100vh-64px)] w-64 border-r border-navy-50 bg-white z-40 transition-transform md:translate-x-0 overflow-y-auto p-8",
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    <nav className="space-y-8">
                        {DOCS_NAV.map((section) => (
                            <div key={section.title} className="space-y-3">
                                <h4 className="text-[10px] font-black text-navy-300 uppercase tracking-[0.2em]">{section.title}</h4>
                                <ul className="space-y-1">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="block py-1 text-sm font-bold text-navy-600 hover:text-wibl-teal transition-colors border-l-2 border-transparent hover:border-wibl-teal/20 pl-3 -ml-[1px]"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0 p-8 md:p-12 lg:p-20 max-w-4xl animate-fade-in">
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <Badge variant="teal" size="sm">DOCUMENTATION</Badge>
                            <h1 className="text-4xl md:text-6xl font-display font-black text-navy-800 tracking-tighter">Introduction</h1>
                            <p className="text-xl text-navy-500 font-medium leading-relaxed">
                                Welcome to the Wibl documentation. Wibl is a conversational platform that empowers you to build enterprise-grade AI agents without writing code.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <Card variant="elevated" className="p-6 border-navy-50 hover:border-wibl-teal transition-all group overflow-hidden">
                                <div className="relative z-10 space-y-4">
                                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-wibl-teal flex items-center justify-center shrink-0">
                                        <Zap size={20} />
                                    </div>
                                    <h3 className="font-display font-black text-navy-800">Quickstart</h3>
                                    <p className="text-sm text-navy-500 font-medium">Get your first AI agent live in under 5 minutes.</p>
                                    <Link href="/docs/quickstart" className="inline-flex items-center gap-2 text-xs font-black text-wibl-teal uppercase tracking-widest mt-2">
                                        Go to Quickstart <ChevronRight size={14} />
                                    </Link>
                                </div>
                            </Card>
                            <Card variant="elevated" className="p-6 border-navy-50 hover:border-wibl-teal transition-all group overflow-hidden">
                                <div className="relative z-10 space-y-4">
                                    <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-700 flex items-center justify-center shrink-0">
                                        <BookOpen size={20} />
                                    </div>
                                    <h3 className="font-display font-black text-navy-800">API Reference</h3>
                                    <p className="text-sm text-navy-500 font-medium">Detailed specifications for our REST API and SDKs.</p>
                                    <Link href="/docs/api" className="inline-flex items-center gap-2 text-xs font-black text-wibl-teal uppercase tracking-widest mt-2">
                                        Explore API <ChevronRight size={14} />
                                    </Link>
                                </div>
                            </Card>
                        </div>

                        <hr className="border-navy-50" />

                        <div className="space-y-8">
                            <h2 className="text-3xl font-display font-black text-navy-800 tracking-tighter">Core Concepts</h2>
                            <p className="text-navy-600 font-medium leading-relaxed">
                                Wibl is built around three fundamental pillars that work together to create a "Simply Connected" AI experience.
                            </p>

                            <div className="space-y-12">
                                <article className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Cpu size={24} className="text-wibl-teal" />
                                        <h3 className="text-xl font-display font-black text-navy-700">The Conversational Creator</h3>
                                    </div>
                                    <p className="text-navy-500 text-sm leading-relaxed">
                                        Unlike traditional builders that use flowcharts, Wibl uses a conversational interface to define logic. When you describe a requirement, our engine generates the underlying agent parameters, fallback logic, and tool triggers dynamically.
                                    </p>
                                </article>

                                <article className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Database size={24} className="text-wibl-coral" />
                                        <h3 className="text-xl font-display font-black text-navy-700">Unified Knowledge Model</h3>
                                    </div>
                                    <p className="text-navy-500 text-sm leading-relaxed">
                                        Wibl agents use Retrieval-Augmented Generation (RAG) to ensure accuracy. Your documents are not just "given" to the AI; they are transformed into a multi-layer knowledge graph that the agent queries with every user interaction.
                                    </p>
                                </article>

                                <article className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Share2 size={24} className="text-wibl-sky" />
                                        <h3 className="text-xl font-display font-black text-navy-700">Abstracted Deployment</h3>
                                    </div>
                                    <p className="text-navy-500 text-sm leading-relaxed">
                                        We handle the platform-specific formatting. Whether it's the UI constraints of WhatsApp or the rich block structure of Slack, Wibl delivers the same intelligent experience adapted perfectly to the channel.
                                    </p>
                                </article>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-3xl font-display font-black text-navy-800 tracking-tighter">Integration Example</h2>
                            <div className="relative group">
                                <div className="absolute top-4 right-4 z-10">
                                    <button
                                        onClick={() => copyToClipboard('npm install @wibl/react')}
                                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all backdrop-blur-sm"
                                    >
                                        {copied ? <Check size={14} className="text-wibl-mint" /> : <Copy size={14} />}
                                    </button>
                                </div>
                                <div className="bg-navy-900 rounded-2xl p-8 font-mono text-sm text-teal-300 overflow-x-auto border-4 border-navy-800 shadow-xl">
                                    <pre><code>{`// 1. Install the SDK
npm install @wibl/react

// 2. Wrap your app
import { WiblProvider } from '@wibl/react';

function Root() {
  return (
    <WiblProvider agentId="agent_783k2">
      <App />
    </WiblProvider>
  );
}`}</code></pre>
                                </div>
                            </div>
                        </div>

                        {/* Doc Footer */}
                        <div className="pt-20 border-t border-navy-50 flex justify-between items-center text-xs font-black text-navy-300 uppercase tracking-widest">
                            <div className="flex gap-8">
                                <Link href="#" className="hover:text-navy-600 transition-colors">Previous: Quickstart</Link>
                                <Link href="#" className="hover:text-navy-600 transition-colors">Next: Core Concepts</Link>
                            </div>
                            <div className="flex gap-4">
                                <Link href="#" className="flex items-center gap-1 hover:text-navy-600 transition-colors"><Github size={12} /> Edit this page</Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <style jsx global>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: var(--navy-50);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--navy-100);
        }
      `}</style>
        </div>
    );
}
