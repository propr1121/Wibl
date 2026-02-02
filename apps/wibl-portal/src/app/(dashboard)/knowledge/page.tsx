"use client";

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    FileText,
    Link as LinkIcon,
    Type,
    HelpCircle,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Database,
    File,
    Zap,
    Cpu,
    BookOpen,
    MoreVertical,
    Filter
} from 'lucide-react';
import { Button, Card, Badge, Input, Modal, Avatar } from '@/components/ui';
import { useHeaderConfig } from '@/components/layouts/DashboardContext';
import KnowledgeUploader from '@/components/features/KnowledgeUploader';
import { cn } from '@/lib/utils';

// --- Types ---

type KnowledgeType = 'all' | 'document' | 'url' | 'text' | 'qa_pair';
type StatusType = 'all' | 'pending' | 'processing' | 'ready' | 'failed';

interface KnowledgeItem {
    id: string;
    type: KnowledgeType;
    title: string;
    status: StatusType;
    tokens: number;
    chunks: number;
    agent: string | null;
    createdAt: string;
}

// --- Mock Data ---

const MOCK_KNOWLEDGE: KnowledgeItem[] = [
    { id: '1', type: 'document', title: 'Product Integration Guide.pdf', status: 'ready', tokens: 12500, chunks: 42, agent: 'Customer Bot', createdAt: '2 hours ago' },
    { id: '2', type: 'url', title: 'https://docs.wibl.ai/faq', status: 'processing', tokens: 0, chunks: 0, agent: null, createdAt: '15 mins ago' },
    { id: '3', type: 'text', title: 'Returns Policy V2', status: 'ready', tokens: 3200, chunks: 12, agent: 'Support Bot', createdAt: '1 day ago' },
    { id: '4', type: 'qa_pair', title: 'Sales Q&A Set', status: 'ready', tokens: 8400, chunks: 24, agent: 'Sales Bot', createdAt: '3 days ago' },
    { id: '5', type: 'document', title: 'Technical Specs.docx', status: 'failed', tokens: 0, chunks: 0, agent: null, createdAt: '2 hours ago' },
];

const MOCK_AGENTS = [
    { id: '1', name: 'Customer Bot', initial: 'C' },
    { id: '2', name: 'Support Bot', initial: 'S' },
    { id: '3', name: 'Sales Bot', initial: 'B' },
];

// --- Main Page ---

export default function KnowledgePage() {
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [agents, setAgents] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<KnowledgeType>('all');
    const [statusFilter, setStatusFilter] = useState<StatusType>('all');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);

    useHeaderConfig({
        breadcrumbs: [{ label: 'Overview', href: '/dashboard' }, { label: 'Library', href: '/knowledge' }],
    });

    const fetchData = async () => {
        try {
            const [itemsRes, agentsRes] = await Promise.all([
                fetch('/api/knowledge'),
                fetch('/api/agents')
            ]);

            if (itemsRes.ok) setItems(await itemsRes.json());
            if (agentsRes.ok) setAgents(await agentsRes.json());
        } catch (error) {
            console.error('Failed to fetch library data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Polling for processing status
        const interval = setInterval(async () => {
            const hasProcessing = items.some(item => item.processing_status === 'processing');
            if (hasProcessing) {
                const res = await fetch('/api/knowledge');
                if (res.ok) setItems(await res.json());
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [items.length]); // Re-evaluate if we should poll when items change

    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || item.processing_status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    const handleUploadSuccess = (newItem: any) => {
        setIsUploadModalOpen(false);
        setItems([newItem, ...items]);
    };

    return (
        <div className="space-y-12 pb-20 max-w-[1400px] mx-auto animate-reveal relative overflow-hidden">
            {/* Background Orbs for Premium feel */}
            <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-wibl-mint/5 rounded-full blur-[140px] pointer-events-none orb-animated" />
            <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-wibl-teal/5 rounded-full blur-[120px] pointer-events-none orb-animated-slow" />

            {/* Header / Intro */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-wibl-teal uppercase tracking-[0.3em] mb-1">Intelligence Repository</p>
                    <h1 className="text-3xl lg:text-4xl font-display font-black text-navy-900 tracking-tighter">
                        Your <span className="text-gradient">Library.</span>
                    </h1>
                </div>
                <Button
                    variant="primary"
                    size="lg"
                    leftIcon={<Plus size={20} />}
                    onClick={() => setIsUploadModalOpen(true)}
                    className="shadow-glow px-8 h-14"
                >
                    Add Intelligence Asset
                </Button>
            </div>

            {/* Filters Bar */}
            <Card variant="elevated" padding="sm" className="bg-white/80 backdrop-blur-sm sticky top-4 z-10 border-navy-50 shadow-lg">
                <div className="flex flex-col lg:flex-row gap-6 items-center">
                    {/* Search */}
                    <div className="relative flex-1 w-full lg:w-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-300" size={18} />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search library..."
                            className="pl-12 bg-navy-50/50 border-none focus:ring-2 focus:ring-wibl-teal/20"
                        />
                    </div>

                    {/* Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 w-full lg:w-auto no-scrollbar">
                        <Filter size={16} className="text-navy-400 mr-2 shrink-0" />
                        {(['all', 'document', 'url', 'text', 'qa_pair'] as KnowledgeType[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTypeFilter(t)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all",
                                    typeFilter === t
                                        ? "gradient-brand text-white shadow-wibl"
                                        : "bg-navy-50 text-navy-400 hover:bg-navy-100"
                                )}
                            >
                                {t === 'qa_pair' ? 'Q&A' : t}
                            </button>
                        ))}
                    </div>

                    {/* Status Select */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as StatusType)}
                        className="bg-navy-50 text-navy-600 font-black text-xs uppercase tracking-widest px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-wibl-teal/20 cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="ready">Ready</option>
                        <option value="processing">Processing</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card variant="elevated" padding="lg" className="bg-white/80 backdrop-blur-sm border-navy-50 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-wibl-teal/10 flex items-center justify-center text-wibl-teal">
                            <Database size={24} />
                        </div>
                        <h3 className="text-sm font-black text-navy-400 uppercase tracking-widest">Total Assets</h3>
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-5xl font-display font-black text-navy-900 tabular-nums tracking-tighter">
                            {items.length}
                        </p>
                        <p className="text-sm font-bold text-navy-300">
                            {items.filter(i => i.processing_status === 'ready').length} ready
                        </p>
                    </div>
                </Card>
                <Card variant="elevated" padding="lg" className="bg-white/80 backdrop-blur-sm border-navy-50 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-wibl-mint/10 flex items-center justify-center text-wibl-mint">
                            <Cpu size={24} />
                        </div>
                        <h3 className="text-sm font-black text-navy-400 uppercase tracking-widest">Total Intelligence</h3>
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-5xl font-display font-black text-navy-900 tabular-nums tracking-tighter">
                            {items.reduce((acc, i) => acc + (i.total_tokens || 0), 0).toLocaleString()}
                        </p>
                        <p className="text-sm font-bold text-navy-300">
                            tokens
                        </p>
                    </div>
                </Card>
                <Card variant="elevated" padding="lg" className="bg-white/80 backdrop-blur-sm border-navy-50 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-wibl-coral/10 flex items-center justify-center text-wibl-coral">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-sm font-black text-navy-400 uppercase tracking-widest">Deployed Agents</h3>
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-5xl font-display font-black text-navy-900 tabular-nums tracking-tighter">
                            {new Set(items.filter(i => i.agent_id).map(i => i.agent_id)).size}
                        </p>
                        <p className="text-sm font-bold text-navy-300">
                            of {agents.length} available
                        </p>
                    </div>
                </Card>
            </div>

            {/* Desktop View: Table */}
            <div className="hidden lg:block bg-white rounded-[2.5rem] border border-navy-50 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-navy-50">
                            <th className="px-8 py-6 text-[10px] font-black text-navy-400 uppercase tracking-widest">Knowledge Asset</th>
                            <th className="px-8 py-6 text-[10px] font-black text-navy-400 uppercase tracking-widest">Type</th>
                            <th className="px-8 py-6 text-[10px] font-black text-navy-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black text-navy-400 uppercase tracking-widest">Intelligence</th>
                            <th className="px-8 py-6 text-[10px] font-black text-navy-400 uppercase tracking-widest">Deployment</th>
                            <th className="px-8 py-6 text-[10px] font-black text-navy-400 uppercase tracking-widest">Age</th>
                            <th className="px-8 py-6"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-50/50">
                        {filteredItems.map((item) => (
                            <tr key={item.id} className="group hover:bg-navy-50/30 transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                                            item.type === 'document' ? "bg-blue-50 text-blue-500" :
                                                item.type === 'url' ? "bg-wibl-teal/10 text-wibl-teal" :
                                                    item.type === 'text' ? "bg-amber-50 text-amber-500" :
                                                        "bg-purple-50 text-purple-500"
                                        )}>
                                            {item.type === 'document' ? <FileText size={18} /> :
                                                item.type === 'url' ? <LinkIcon size={18} /> :
                                                    item.type === 'text' ? <Type size={18} /> :
                                                        <HelpCircle size={18} />}
                                        </div>
                                        <span className="text-sm font-black text-navy-800 tracking-tight">{item.title}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-[10px] font-black text-navy-400 uppercase tracking-widest">{item.type}</td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2">
                                        {item.processing_status === 'ready' ? (
                                            <div className="flex items-center gap-2 text-wibl-mint">
                                                <CheckCircle2 size={16} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                                            </div>
                                        ) : item.processing_status === 'processing' ? (
                                            <div className="flex items-center gap-2 text-wibl-sky">
                                                <Loader2 size={16} className="animate-spin" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Indexing...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-coral">
                                                <AlertCircle size={16} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Failed</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-navy-800 tabular-nums">{item.total_tokens?.toLocaleString() || 0} tokens</span>
                                        <span className="text-[9px] font-bold text-navy-300 uppercase tracking-widest mt-0.5">{item.chunk_count || 0} fragments</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    {item.agent_id ? (
                                        <div className="flex items-center gap-2">
                                            <Avatar fallback={agents.find(a => a.id === item.agent_id)?.name?.[0] || '?'} size="sm" />
                                            <span className="text-[11px] font-black text-navy-500 uppercase tracking-tight">
                                                {agents.find(a => a.id === item.agent_id)?.name}
                                            </span>
                                        </div>
                                    ) : (
                                        <Badge variant="teal" className="text-[9px] font-black opacity-40 bg-navy-50 text-navy-400 border-transparent">Unassigned</Badge>
                                    )}
                                </td>
                                <td className="px-8 py-5 text-[10px] font-black text-navy-400 uppercase tracking-widest">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="sm" className="p-2.5 bg-navy-50 hover:bg-navy-100 transition-colors">
                                            <MoreVertical size={16} className="text-navy-400" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredItems.length === 0 && (
                    <div className="py-32 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 rounded-full bg-navy-50 flex items-center justify-center text-navy-200 mb-8">
                            <BookOpen size={48} />
                        </div>
                        <h3 className="text-2xl font-display font-black text-navy-900 mb-2">Knowledge vault is empty</h3>
                        <p className="text-navy-500 font-medium mb-10 max-w-sm">No assets match your current filters. Clear filters or add new knowledge.</p>
                        <Button variant="primary" size="lg" leftIcon={<Plus size={20} />} onClick={() => setIsUploadModalOpen(true)}>
                            Add Knowledge Asset
                        </Button>
                    </div>
                )}
            </div>

            {/* Mobile View: Grid */}
            {filteredItems.length === 0 && !isLoading && ( // Only show empty state if no items and not loading
                <EmptyState onAction={() => setIsUploadModalOpen(true)} />
            )}
            {filteredItems.length > 0 && ( // Only show grid if there are items
                <div className="grid grid-cols-1 gap-6 animate-fade-in lg:hidden">
                    {filteredItems.map((item) => (
                        <KnowledgeItemRow
                            key={item.id}
                            item={item}
                            onAssign={() => {
                                setSelectedItem(item);
                                setIsAssignModalOpen(true);
                            }}
                            onEdit={() => {
                                setSelectedItem(item);
                                setIsEditModalOpen(true);
                            }}
                            agents={agents} // Pass agents to the row component
                        />
                    ))}
                </div>
            )}


            {/* Modals */}
            <Modal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                title="Add to Knowledge Base"
            >
                <KnowledgeUploader
                    onSuccess={handleUploadSuccess}
                    onCancel={() => setIsUploadModalOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                title="Assign Knowledge to Agent"
            >
                <div className="space-y-6">
                    <p className="text-navy-500 font-medium">
                        Which agent should have access to <span className="text-navy-800 font-black">"{selectedItem?.title}"</span>?
                    </p>
                    <div className="space-y-3">
                        {agents.map(agent => ( // Use real agents
                            <button
                                key={agent.id}
                                className="w-full flex items-center gap-4 p-4 bg-navy-50 hover:bg-white border-2 border-transparent hover:border-wibl-teal rounded-2xl transition-all group"
                                onClick={() => setIsAssignModalOpen(false)}
                            >
                                <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white font-black">
                                    {agent.initial}
                                </div>
                                <span className="flex-1 text-left font-black text-navy-800">{agent.name}</span>
                                <Plus size={18} className="text-navy-300 group-hover:text-wibl-teal" />
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Knowledge"
            >
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-navy-400 uppercase tracking-widest">Knowledge Title</label>
                        <Input
                            value={selectedItem?.title || ''}
                            onChange={(e) => selectedItem && setSelectedItem({ ...selectedItem, title: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={() => setIsEditModalOpen(false)}>Save Changes</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

// --- Sub-components ---

// Enhanced Knowledge Item Component
function KnowledgeItemRow({ item, onEdit, onAssign, agents }: { item: any, onEdit: () => void, onAssign: () => void, agents: any[] }) {
    const Icon = item.type === 'document' ? FileText : item.type === 'url' ? LinkIcon : item.type === 'text' ? Type : HelpCircle;

    return (
        <Card
            variant="elevated"
            padding="none"
            hoverable
            className="group overflow-hidden border-navy-50/50 bg-white/60 backdrop-blur-sm transition-all duration-300"
        >
            <div className="flex flex-col md:flex-row md:items-center p-6 sm:p-8 gap-6 sm:gap-10">
                {/* Type Icon */}
                <div className="w-16 h-16 rounded-[20px] bg-navy-50 flex items-center justify-center shrink-0 border border-navy-100 group-hover:border-wibl-teal/30 transition-all duration-500">
                    <Icon className="text-navy-400 group-hover:text-wibl-teal transition-colors" size={24} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-display font-black text-navy-900 tracking-tighter truncate max-w-sm">
                            {item.title}
                        </h3>
                        <Badge
                            variant={item.processing_status === 'ready' ? 'teal' : item.processing_status === 'failed' ? 'error' : 'warning'}
                            size="sm"
                            className="font-black uppercase tracking-widest text-[9px]"
                        >
                            {item.processing_status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest bg-navy-50 px-2 py-0.5 rounded-md">
                            {item.type.replace('_', ' ')}
                        </p>
                        <span className="w-1 h-1 rounded-full bg-navy-200" />
                        <p className="text-[10px] font-bold text-navy-300 uppercase tracking-tight">Source ID: {item.id.padStart(4, '0')}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="px-10 flex items-center gap-12 border-y md:border-y-0 md:border-x border-navy-50/50 h-12">
                    <div className="text-center min-w-[80px]">
                        <p className="text-xl font-display font-black text-navy-900 tabular-nums tracking-tighter leading-none">
                            {((item.total_tokens || 0) / 1000).toFixed(1)}k
                        </p>
                        <p className="text-[9px] font-black text-navy-400 uppercase tracking-widest mt-1">Tokens</p>
                    </div>
                    <div className="text-center min-w-[80px] hidden sm:block">
                        <p className="text-xl font-display font-black text-navy-900 tabular-nums tracking-tighter leading-none">
                            {item.chunk_count || 0}
                        </p>
                        <p className="text-[9px] font-black text-navy-400 uppercase tracking-widest mt-1">Fragments</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 min-w-[200px]">
                    {item.agent_id ? (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white text-xs font-black">
                                {agents.find(a => a.id === item.agent_id)?.name?.[0] || '?'}
                            </div>
                            <span className="text-[11px] font-black text-navy-800 uppercase tracking-tighter">
                                {agents.find(a => a.id === item.agent_id)?.name || 'Loading...'}
                            </span>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onAssign}
                            className="text-[10px] font-black uppercase tracking-widest hover:text-wibl-teal"
                        >
                            Deploy to Agent
                        </Button>
                    )}

                    <Button variant="ghost" size="md" className="p-2" onClick={onEdit}>
                        <MoreVertical size={20} className="text-navy-300 hover:text-navy-900" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}

function EmptyState({ onAction }: { onAction: () => void }) {
    return (
        <Card variant="elevated" padding="lg" className="text-center py-20 flex flex-col items-center">
            {/* Abstract Illustration */}
            <div className="relative w-48 h-32 mb-10">
                {/* Papers */}
                <div className="absolute top-0 left-1/4 w-12 h-16 bg-white border-2 border-navy-50 rounded-lg shadow-xl -rotate-12 animate-float" style={{ animationDelay: '0s' }} />
                <div className="absolute top-4 left-1/3 w-12 h-16 bg-white border-2 border-navy-50 rounded-lg shadow-xl rotate-6 animate-float" style={{ animationDelay: '1s' }} />

                {/* Brain/Core */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-24 gradient-brand rounded-full opacity-20 blur-2xl animate-pulse-soft" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-navy-900 rounded-3xl rotate-45 flex items-center justify-center shadow-2xl">
                    <Database className="text-wibl-teal -rotate-45" size={32} />
                </div>

                {/* Arcs */}
                <div className="absolute bottom-10 left-0 w-24 h-24 border-t-2 border-l-2 border-wibl-teal/20 rounded-tl-full -rotate-12" />
                <div className="absolute bottom-10 right-0 w-20 h-20 border-t-2 border-r-2 border-wibl-coral/20 rounded-tr-full rotate-12" />
            </div>

            <h3 className="text-2xl lg:text-3xl font-display font-black text-navy-800 mb-3">
                Your library is empty
            </h3>
            <p className="text-navy-500 font-medium text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Upload documents, paste URLs, or add Q&A pairs to train your agents with your specific business data.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="coral" size="lg" onClick={onAction} leftIcon={<Plus size={20} />}>
                    Upload Documents
                </Button>
                <Button variant="secondary" size="lg" onClick={onAction}>
                    Add Q&A Pair
                </Button>
            </div>
        </Card>
    );
}
