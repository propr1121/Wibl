"use client";

import React, { useState } from 'react';
import { Logo, Avatar, Badge } from '@/components/ui';
import {
    TrendingUp,
    LayoutGrid,
    Bot,
    BookOpen,
    Plug,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    LogOut,
    CreditCard,
    User
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
    isMobileOpen?: boolean;
    onMobileClose?: () => void;
}

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { name: 'My Agents', href: '/agents', icon: Bot },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
    { name: 'Knowledge Base', href: '/knowledge', icon: BookOpen },
    { name: 'Tool Integrations', href: '/tools', icon: Plug },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle },
];

export function Sidebar({
    isCollapsed = false,
    onToggleCollapse,
    isMobileOpen = false,
    onMobileClose
}: SidebarProps) {
    const pathname = usePathname();
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Mock user data - replace with real auth data
    const user = {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: null,
        plan: 'Pro',
    };

    return (
        <>
            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-navy-900/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onMobileClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 h-screen bg-white border-r border-navy-100 z-50 transition-all duration-300 ease-in-out flex flex-col',
                    isCollapsed ? 'w-[72px]' : 'w-64',
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-navy-50">
                    {!isCollapsed && (
                        <Logo size="sm" variant="full" />
                    )}
                    {isCollapsed && (
                        <Logo size="sm" variant="icon" className="mx-auto" />
                    )}

                    {/* Desktop collapse toggle */}
                    {onToggleCollapse && (
                        <button
                            onClick={onToggleCollapse}
                            className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md hover:bg-canvas-muted transition-colors"
                            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {isCollapsed ? (
                                <ChevronRight size={16} className="text-navy-400" />
                            ) : (
                                <ChevronLeft size={16} className="text-navy-400" />
                            )}
                        </button>
                    )}
                </div>

                {/* Gradient accent line */}
                <div className="h-0.5 gradient-brand" />

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onMobileClose}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-wibl-sm font-bold transition-all duration-200 relative group',
                                    isActive
                                        ? 'bg-gradient-subtle text-wibl-teal'
                                        : 'text-navy-600 hover:bg-canvas-muted hover:text-navy-700',
                                    isCollapsed && 'justify-center'
                                )}
                            >
                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-wibl-teal rounded-r-full" />
                                )}

                                <Icon
                                    size={20}
                                    className={cn(
                                        'shrink-0 transition-colors',
                                        isActive ? 'text-wibl-teal' : 'text-navy-500 group-hover:text-navy-700'
                                    )}
                                />

                                {!isCollapsed && (
                                    <span className="text-sm">{item.name}</span>
                                )}

                                {/* Tooltip for collapsed state */}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-2 px-3 py-1.5 bg-navy-700 text-white text-xs font-bold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div className="border-t border-navy-50 p-3">
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className={cn(
                                'w-full flex items-center gap-3 p-3 rounded-wibl-sm hover:bg-canvas-muted transition-all duration-200',
                                isCollapsed && 'justify-center'
                            )}
                        >
                            <Avatar
                                size="md"
                                fallback={user.name.split(' ').map(n => n[0]).join('')}
                                ring
                            />

                            {!isCollapsed && (
                                <div className="flex-1 text-left min-w-0">
                                    <p className="text-sm font-black text-navy-700 truncate">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-navy-400 font-medium truncate">
                                        {user.email}
                                    </p>
                                    {user.plan && (
                                        <Badge variant="gradient" size="sm" className="mt-1">
                                            {user.plan}
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </button>

                        {/* User menu dropdown */}
                        {showUserMenu && (
                            <div className={cn(
                                'absolute bottom-full mb-2 bg-white rounded-wibl shadow-wibl-lg border border-navy-100 py-2 z-50',
                                isCollapsed ? 'left-full ml-2 w-48' : 'left-0 right-0'
                            )}>
                                <Link
                                    href="/settings/profile"
                                    className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-navy-700 hover:bg-canvas-muted transition-colors"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <User size={16} className="text-navy-500" />
                                    Profile Settings
                                </Link>
                                <Link
                                    href="/settings/billing"
                                    className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-navy-700 hover:bg-canvas-muted transition-colors"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <CreditCard size={16} className="text-navy-500" />
                                    Billing
                                </Link>
                                <hr className="my-2 border-navy-50" />
                                <button
                                    className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-coral hover:bg-coral/5 transition-colors w-full"
                                    onClick={() => {
                                        setShowUserMenu(false);
                                        // Handle sign out
                                    }}
                                >
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
