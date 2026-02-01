"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/layouts/Sidebar';
import { DashboardHeader } from '@/components/layouts/DashboardHeader';
import { HelpWidget } from '@/components/features/HelpWidget';
import { DashboardProvider, useDashboard } from '@/components/layouts/DashboardContext';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

function DashboardLayoutInner({ children }: DashboardLayoutProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const { headerConfig } = useDashboard();

    return (
        <div className="min-h-screen bg-canvas-subtle">
            {/* Sidebar */}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                isMobileOpen={isMobileSidebarOpen}
                onMobileClose={() => setIsMobileSidebarOpen(false)}
            />

            {/* Main content */}
            <div
                className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
                    }`}
            >
                {/* Header */}
                <DashboardHeader
                    title={headerConfig.title}
                    breadcrumbs={headerConfig.breadcrumbs}
                    actions={headerConfig.actions}
                    onMenuClick={() => setIsMobileSidebarOpen(true)}
                />

                {/* Page content */}
                <main className="p-6 lg:p-8">
                    <div className="max-w-screen-xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Help Widget */}
            <HelpWidget />
        </div>
    );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <DashboardProvider>
            <DashboardLayoutInner>{children}</DashboardLayoutInner>
        </DashboardProvider>
    );
}
