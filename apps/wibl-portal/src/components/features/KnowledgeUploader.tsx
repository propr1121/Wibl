"use client";

import React, { useState, useCallback } from 'react';
import {
    Upload,
    Link as LinkIcon,
    FileText,
    HelpCircle,
    Search,
    X,
    Plus,
    Trash2,
    File,
    AlertCircle,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { Button, Input, Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

type UploaderTab = 'upload' | 'url' | 'text' | 'qa';

interface KnowledgeUploaderProps {
    agentId?: string | null;
    onSuccess: (item: any) => void;
    onCancel: () => void;
}

export default function KnowledgeUploader({ agentId, onSuccess, onCancel }: KnowledgeUploaderProps) {
    const [activeTab, setActiveTab] = useState<UploaderTab>('upload');
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Form states
    const [url, setUrl] = useState('');
    const [textTitle, setTextTitle] = useState('');
    const [textContent, setTextContent] = useState('');
    const [qaPairs, setQaPairs] = useState([{ question: '', answer: '' }]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileUpload(files);
        }
    }, []);

    const handleFileUpload = async (files: File[]) => {
        setIsProcessing(true);
        try {
            // In a real app, we'd upload to S3/Supabase Storage first
            // For now, we'll simulate metadata persistence
            const response = await fetch('/api/knowledge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'document',
                    title: files[0].name,
                    agent_id: agentId,
                    file_path: `/uploads/${files[0].name}`
                }),
            });

            if (response.ok) {
                const item = await response.json();
                onSuccess(item);
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUrlSubmit = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/knowledge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'url',
                    title: new URL(url).hostname,
                    source_url: url,
                    agent_id: agentId
                }),
            });

            if (response.ok) {
                const item = await response.json();
                onSuccess(item);
            }
        } catch (error) {
            console.error('Crawl failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTextSubmit = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/knowledge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'text',
                    title: textTitle,
                    content: textContent,
                    agent_id: agentId
                }),
            });

            if (response.ok) {
                const item = await response.json();
                onSuccess(item);
            }
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAddQaPair = () => {
        setQaPairs([...qaPairs, { question: '', answer: '' }]);
    };

    const removeQaPair = (index: number) => {
        setQaPairs(qaPairs.filter((_, i) => i !== index));
    };

    const updateQaPair = (index: number, field: 'question' | 'answer', value: string) => {
        const next = [...qaPairs];
        next[index][field] = value;
        setQaPairs(next);
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            {/* Tabs */}
            <div className="flex p-1 bg-navy-50 rounded-xl overflow-hidden">
                {(['upload', 'url', 'text', 'qa'] as UploaderTab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "flex-1 py-2 px-4 rounded-lg text-sm font-black transition-all capitalize",
                            activeTab === tab
                                ? "bg-white text-navy-800 shadow-sm"
                                : "text-navy-400 hover:text-navy-600"
                        )}
                    >
                        {tab === 'qa' ? 'Q&A' : tab}
                    </button>
                ))}
            </div>

            {/* Content areas */}
            <div className="min-h-[300px] flex flex-col">
                {activeTab === 'upload' && (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={cn(
                            "flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 transition-all duration-300",
                            isDragging
                                ? "border-wibl-teal bg-teal-50/50 scale-[1.01]"
                                : "border-navy-100 bg-white"
                        )}
                    >
                        {isProcessing ? (
                            <div className="text-center animate-pulse">
                                <Loader2 className="w-12 h-12 text-wibl-teal animate-spin mx-auto mb-4" />
                                <p className="text-navy-500 font-bold">Processing your files...</p>
                                <div className="mt-4 w-48 h-1.5 bg-navy-50 rounded-full overflow-hidden mx-auto">
                                    <div className="h-full gradient-brand animate-progress" style={{ width: '60%' }} />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-2xl bg-gradient-subtle flex items-center justify-center text-wibl-teal mb-4 group-hover:scale-110 transition-transform">
                                    <Upload size={32} />
                                </div>
                                <h3 className="text-xl font-display font-black text-navy-800 mb-2">
                                    Drag files here or click to browse
                                </h3>
                                <p className="text-navy-400 font-medium text-sm text-center mb-6">
                                    Supports PDF, DOCX, TXT, MD, CSV
                                </p>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                >
                                    Choose Files
                                </Button>
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    multiple
                                    onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))}
                                />
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'url' && (
                    <Card className="p-8 space-y-6 animate-fade-in">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-navy-400 uppercase tracking-widest">Website URL</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-300" size={18} />
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://example.com/docs"
                                        className="w-full bg-navy-50 border-2 border-transparent focus:border-wibl-teal rounded-xl pl-12 pr-4 py-3 outline-none transition-all font-medium"
                                    />
                                </div>
                                <Button
                                    variant="primary"
                                    disabled={!url || isProcessing}
                                    onClick={handleUrlSubmit}
                                >
                                    Fetch
                                </Button>
                            </div>
                        </div>
                        <div className="p-4 bg-teal-50/50 rounded-xl flex items-start gap-3">
                            <CheckCircle2 className="text-wibl-teal shrink-0 mt-0.5" size={18} />
                            <p className="text-sm text-teal-800 font-medium leading-relaxed">
                                Wibl will automatically crawl the page and extract key information. This usually takes sub-10 seconds.
                            </p>
                        </div>
                    </Card>
                )}

                {activeTab === 'text' && (
                    <Card className="p-8 space-y-4 animate-fade-in">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-navy-400 uppercase tracking-widest">Knowledge Title</label>
                            <input
                                type="text"
                                value={textTitle}
                                onChange={(e) => setTextTitle(e.target.value)}
                                placeholder="e.g., Shipping Policy 2024"
                                className="w-full bg-navy-50 border-2 border-transparent focus:border-wibl-teal rounded-xl px-4 py-3 outline-none transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-black text-navy-400 uppercase tracking-widest">Content</label>
                                <span className="text-[10px] font-black text-navy-300">{textContent.length} characters</span>
                            </div>
                            <textarea
                                value={textContent}
                                onChange={(e) => setTextContent(e.target.value)}
                                placeholder="Paste or type relevant information here..."
                                className="w-full h-48 bg-navy-50 border-2 border-transparent focus:border-wibl-teal rounded-xl px-4 py-3 outline-none transition-all font-medium resize-none"
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                            <Button
                                variant="primary"
                                disabled={!textTitle || !textContent || isProcessing}
                                onClick={handleTextSubmit}
                            >
                                Save Content
                            </Button>
                        </div>
                    </Card>
                )}

                {activeTab === 'qa' && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="space-y-4 max-h-[400px] overflow-y-auto px-1 pr-2">
                            {qaPairs.map((pair, idx) => (
                                <Card key={idx} className="p-6 relative group border-navy-50 border-2 hover:border-wibl-teal transition-colors">
                                    <button
                                        onClick={() => removeQaPair(idx)}
                                        className="absolute top-4 right-4 text-navy-300 hover:text-coral transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-black">Q</div>
                                                <label className="text-xs font-black text-navy-400 uppercase tracking-widest">Question</label>
                                            </div>
                                            <input
                                                value={pair.question}
                                                onChange={(e) => updateQaPair(idx, 'question', e.target.value)}
                                                className="w-full bg-canvas rounded-lg px-3 py-2 text-sm font-medium border border-transparent focus:border-wibl-teal outline-none"
                                                placeholder="What is the refund policy?"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-coral-50 text-coral flex items-center justify-center text-xs font-black">A</div>
                                                <label className="text-xs font-black text-navy-400 uppercase tracking-widest">Answer</label>
                                            </div>
                                            <textarea
                                                value={pair.answer}
                                                onChange={(e) => updateQaPair(idx, 'answer', e.target.value)}
                                                className="w-full h-20 bg-canvas rounded-lg px-3 py-2 text-sm font-medium border border-transparent focus:border-wibl-teal outline-none resize-none"
                                                placeholder="Explain the answer in detail..."
                                            />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-navy-50">
                            <button
                                onClick={handleAddQaPair}
                                className="flex items-center gap-2 text-wibl-teal font-black text-xs uppercase tracking-widest hover:text-wibl-sky transition-colors"
                            >
                                <Plus size={16} /> Add another pair
                            </button>
                            <div className="flex gap-3">
                                <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => onSuccess({ type: 'qa_pair', title: 'Q&A Set' })}
                                >
                                    Save {qaPairs.length} Pairs
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                .animate-progress {
                    animation: progress 1.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
