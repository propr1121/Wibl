"use client";

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    FileText,
    Link as LinkIcon,
    Type,
    HelpCircle,
    MoreVertical,
    Filter,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Database,
    File
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
    const [items, setItems] = useState<KnowledgeItem[]>(MOCK_KNOWLEDGE);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<KnowledgeType>('all');
    const [statusFilter, setStatusFilter] = useState<StatusType>('all');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);

    useHeaderConfig({
        title: 'Knowledge Base',
        breadcrumbs: [{ label: 'Knowledge', href: '/knowledge' }],
    });

    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    const handleUploadSuccess = (newItem: any) => {
        setIsUploadModalOpen(false);
        const item: KnowledgeItem = {
            id: Math.random().toString(),
            type: newItem.type,
            title: newItem.title,
            status: 'processing',
            tokens: 0,
            chunks: 0,
            agent: null,
            createdAt: 'Just now'
        };
        setItems([item, ...items]);
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="animate-fade-in">
                    <h1 className="text-4xl font-display font-black text-navy-700 mb-2">
                        Knowledge Base
                    </h1>
                    <p className="text-navy-500 font-medium text-lg">
                        Teach your agents with documents, URLs, and Q&A pairs
                    </p>
                </div>
                <Button
                    variant="coral"
                    size="lg"
                    leftIcon={<Plus size={20} />}
                    onClick={() => setIsUploadModalOpen(true)}
                    className="shadow-wibl-coral"
                >
                    Add Knowledge
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
                            placeholder="Search knowledge..."
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

            {/* Grid View */}
            {filteredItems.length === 0 ? (
                <EmptyState onAction={() => setIsUploadModalOpen(true)} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {filteredItems.map((item, idx) => (
                        <KnowledgeCard
                            key={item.id}
                            item={item}
                            delay={idx * 50}
                            onAssign={() => {
                                setSelectedItem(item);
                                setIsAssignModalOpen(true);
                            }}
                            onEdit={() => {
                                setSelectedItem(item);
                                setIsEditModalOpen(true);
                            }}
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
                        {MOCK_AGENTS.map(agent => (
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

function KnowledgeCard({
    item,
    delay,
    onAssign,
    onEdit
}: {
    item: KnowledgeItem,
    delay: number,
    onAssign: () => void,
    onEdit: () => void
}) {
    const icons = {
        document: <FileText className="text-navy-400" size={24} />,
        url: <LinkIcon className="text-wibl-teal" size={24} />,
        text: <Type className="text-wibl-sky" size={24} />,
        qa_pair: <HelpCircle className="text-wibl-coral" size={24} />,
        all: <Database size={24} />
    };

    const statusConfig = {
        ready: { variant: 'teal' as const, icon: <CheckCircle2 size={12} />, label: 'Ready' },
        processing: { variant: 'info' as const, icon: <Loader2 size={12} className="animate-spin" />, label: 'Processing' },
        pending: { variant: 'warning' as const, icon: <Clock size={12} />, label: 'Pending' },
        failed: { variant: 'error' as const, icon: <AlertCircle size={12} />, label: 'Failed' },
        all: { variant: 'info' as const, icon: null, label: '' }
    };

    return (
        <Card
            hoverable
            className="group animate-slide-up relative overflow-hidden flex flex-col h-full bg-white border-navy-50 hover:shadow-xl transition-all"
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Status gradient indicator */}
            <div className={cn(
                "absolute top-0 left-0 w-1.5 h-full",
                item.status === 'ready' ? "bg-wibl-teal" :
                    item.status === 'processing' ? "bg-wibl-sky" :
                        item.status === 'failed' ? "bg-wibl-coral" : "bg-navy-200"
            )} />

            <div className="p-6 flex-1 space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-inner transition-all">
                        {icons[item.type]}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Badge
                            variant={statusConfig[item.status].variant}
                            size="sm"
                            className="flex items-center gap-1.5"
                        >
                            {statusConfig[item.status].icon}
                            {statusConfig[item.status].label}
                        </Badge>
                        <span className="text-[10px] font-black text-navy-300 uppercase tracking-widest">{item.createdAt}</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <h3 className="text-xl font-display font-black text-navy-800 line-clamp-2 leading-tight group-hover:text-wibl-teal transition-colors">
                        {item.title}
                    </h3>
                    <p className="text-xs font-black text-navy-400 uppercase tracking-widest">{item.type.replace('_', ' ')}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-navy-50">
                    <div>
                        <p className="text-[10px] font-black text-navy-300 uppercase tracking-widest mb-0.5">Tokens</p>
                        <p className="font-display font-black text-navy-700">{item.status === 'ready' ? item.tokens.toLocaleString() : '--'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-navy-300 uppercase tracking-widest mb-0.5">Chunks</p>
                        <p className="font-display font-black text-navy-700">{item.status === 'ready' ? item.chunks : '--'}</p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 bg-navy-50/50 flex items-center justify-between border-t border-navy-50">
                <div className="flex items-center gap-2">
                    {item.agent ? (
                        <div className="flex items-center gap-1.5">
                            <Badge variant="info" size="sm" className="rounded-full">
                                {item.agent}
                            </Badge>
                        </div>
                    ) : (
                        <span className="text-[10px] font-bold text-navy-400 italic">Unassigned</span>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onAssign}
                        className="p-2 text-navy-400 hover:text-wibl-teal transition-colors hover:bg-white rounded-lg shadow-sm"
                        title="Assign to agent"
                    >
                        <Plus size={16} />
                    </button>
                    <button className="p-2 text-navy-400 hover:text-coral transition-colors hover:bg-white rounded-lg shadow-sm">
                        <MoreVertical size={16} />
                    </button>
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
                Your knowledge base is empty
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
