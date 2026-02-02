"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface HeaderConfig {
    title?: string;
    breadcrumbs?: { label: string; href?: string }[];
    actions?: React.ReactNode;
}

interface DashboardContextValue {
    headerConfig: HeaderConfig;
    setHeaderConfig: (config: HeaderConfig) => void;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const [headerConfig, setHeaderConfig] = useState<HeaderConfig>({
        title: 'Dashboard',
    });

    return (
        <DashboardContext.Provider value={{ headerConfig, setHeaderConfig }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within DashboardProvider');
    }
    return context;
}

// Hook to set header config from pages
export function useHeaderConfig(config: HeaderConfig) {
    const { setHeaderConfig } = useDashboard();

    useEffect(() => {
        setHeaderConfig({
            title: config.title || '',
            breadcrumbs: config.breadcrumbs,
            actions: config.actions,
        });
    }, [config.title, JSON.stringify(config.breadcrumbs), setHeaderConfig]);
    // Note: actions are intentionally excluded from deps to prevent re-renders
}
