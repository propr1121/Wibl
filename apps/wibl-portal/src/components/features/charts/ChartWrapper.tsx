"use client";

import React from 'react';
import { Card, Button, LoadingDots } from '@/components/ui';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChartWrapperProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    isLoading?: boolean;
    error?: string;
    onRetry?: () => void;
    className?: string;
    actions?: React.ReactNode;
}

export function ChartWrapper({
    title,
    subtitle,
    children,
    isLoading = false,
    error,
    onRetry,
    className,
    actions,
}: ChartWrapperProps) {
    return (
        <Card variant="elevated" padding="lg" className={cn('', className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-display font-black text-navy-700">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-sm text-navy-400 font-medium mt-1">
                            {subtitle}
                        </p>
                    )}
                </div>
                {actions && <div>{actions}</div>}
            </div>

            {/* Content */}
            <div className="relative min-h-[300px]">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-wibl z-10">
                        <div className="text-center space-y-4">
                            <LoadingDots color="gradient" size="lg" />
                            <p className="text-sm text-navy-400 font-medium">Loading data...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-canvas-subtle rounded-wibl z-10">
                        <div className="text-center space-y-4 max-w-sm">
                            <div className="w-16 h-16 rounded-full bg-coral/10 flex items-center justify-center mx-auto">
                                <AlertCircle size={32} className="text-coral" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-navy-700 mb-1">
                                    Unable to load chart
                                </p>
                                <p className="text-xs text-navy-400 font-medium">
                                    {error}
                                </p>
                            </div>
                            {onRetry && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    leftIcon={<RefreshCw size={14} />}
                                    onClick={onRetry}
                                >
                                    Retry
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {!isLoading && !error && (
                    <div className="w-full h-full">
                        {children}
                    </div>
                )}
            </div>
        </Card>
    );
}

// Loading skeleton for charts
export function ChartSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            {/* Y-axis labels */}
            <div className="flex justify-between items-center">
                <div className="h-3 w-8 bg-navy-100 rounded" />
                <div className="h-3 w-8 bg-navy-100 rounded" />
                <div className="h-3 w-8 bg-navy-100 rounded" />
            </div>

            {/* Chart area */}
            <div className="h-[250px] bg-gradient-to-t from-wibl-mint/5 to-transparent rounded-wibl border border-navy-100" />

            {/* X-axis labels */}
            <div className="flex justify-between">
                {[...Array(7)].map((_, i) => (
                    <div key={i} className="h-3 w-12 bg-navy-100 rounded" />
                ))}
            </div>
        </div>
    );
}
