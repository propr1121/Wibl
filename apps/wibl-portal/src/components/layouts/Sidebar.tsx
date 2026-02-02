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
    User,
    Clock,
    Activity,
    Shield
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
    { name: 'Overview', href: '/dashboard', icon: LayoutGrid },
    { name: 'Workforce', href: '/agents', icon: Activity },
    { name: 'Library', href: '/knowledge', icon: BookOpen },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({
    isCollapsed = false,
    onToggleCollapse,
    isMobileOpen = false,
    onMobileClose
}: SidebarProps) {
    const pathname = usePathname();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [now, setNow] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

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
                    'fixed top-0 left-0 h-screen bg-white/80 backdrop-blur-xl border-r border-navy-100 z-50 transition-all duration-300 ease-in-out flex flex-col shadow-[1px_0_20px_rgba(0,0,0,0.02)]',
                    isCollapsed ? 'w-[72px]' : 'w-64',
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-canvas-subtle/50 to-transparent pointer-events-none" />
                {/* Header - Synchronized h-16 for alignment */}
                <div className={cn(
                    "h-16 min-h-[64px] flex items-center relative border-b border-navy-100",
                    isCollapsed ? "justify-center px-0" : "justify-between px-4"
                )}>
                    {!isCollapsed && (
                        <Logo size="sm" variant="full" />
                    )}
                    {isCollapsed && (
                        <Logo size="sm" variant="icon" className="translate-x-[2.5px]" />
                    )}

                    {/* Desktop collapse toggle */}
                    {onToggleCollapse && (
                        <button
                            onClick={onToggleCollapse}
                            className={cn(
                                "hidden lg:flex items-center justify-center w-6 h-6 rounded-md hover:bg-canvas-muted transition-all transition-colors",
                                isCollapsed ? "absolute -right-3 top-5 bg-white border border-navy-100 shadow-premium-sm z-10" : ""
                            )}
                            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {isCollapsed ? (
                                <ChevronRight size={14} className="text-navy-400" />
                            ) : (
                                <ChevronLeft size={16} className="text-navy-400" />
                            )}
                        </button>
                    )}
                </div>

                {/* Live Status & Clock - Relocated to 1/3rd down (Upper Mid) */}
                {!isCollapsed && (
                    <div className="mx-3 mt-4 mb-2 p-4 bg-navy-900/5 border border-navy-100/50 rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wibl-teal opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-wibl-teal"></span>
                                </span>
                                <span className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Active Ops</span>
                            </div>
                            <span className="text-[10px] font-black text-wibl-teal uppercase tracking-widest">v2.4.1</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-display font-black text-navy-800 tabular-nums">{timeString}</span>
                            <span className="text-[10px] font-bold text-navy-400 uppercase tracking-widest opacity-60">{dateString}</span>
                        </div>
                    </div>
                )}


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
                                    'flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold transition-all duration-200 relative group',
                                    isActive
                                        ? 'bg-white text-wibl-teal shadow-premium-sm ring-1 ring-navy-50'
                                        : 'text-navy-400 hover:bg-canvas-muted/50 hover:text-navy-700',
                                    isCollapsed && 'justify-center'
                                )}
                            >
                                {/* Active indicator accent */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-wibl-teal rounded-r-full shadow-[0_0_10px_rgba(0,242,234,0.5)]" />
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

                {/* Support & Help - Relocated to Lower Footer */}
                <div className="px-3 py-2">
                    <Link
                        href="/support"
                        onClick={onMobileClose}
                        className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold text-navy-400 hover:bg-canvas-muted/50 hover:text-navy-700 transition-all duration-200 relative group',
                            isCollapsed && 'justify-center'
                        )}
                    >
                        <HelpCircle size={20} className="shrink-0 text-navy-400 group-hover:text-navy-700" />
                        {!isCollapsed && <span className="text-sm">Support & Help</span>}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-3 py-1.5 bg-navy-700 text-white text-xs font-bold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                Support & Help
                            </div>
                        )}
                    </Link>
                </div>

                {/* User section */}
                <div className="border-t border-navy-50 p-3">
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className={cn(
                                'w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 relative group overflow-hidden',
                                showUserMenu ? 'bg-navy-900 text-white' : 'hover:bg-canvas-muted',
                                isCollapsed && 'justify-center'
                            )}
                        >
                            {/* Texture/Background */}
                            {showUserMenu && <div className="absolute inset-0 bg-gradient-to-br from-wibl-teal/20 to-transparent opacity-50" />}

                            <Avatar
                                size={isCollapsed ? 'sm' : 'md'}
                                fallback={user.name.split(' ').map(n => n[0]).join('')}
                                ring={!showUserMenu}
                                className={cn(showUserMenu && "border-2 border-wibl-teal/50 shadow-glow-teal")}
                            />

                            {!isCollapsed && (
                                <div className="flex-1 text-left min-w-0 relative z-10">
                                    <div className="flex items-center justify-between gap-1">
                                        <p className={cn("text-[11px] font-black uppercase tracking-tight truncate", showUserMenu ? "text-white" : "text-navy-800")}>
                                            {user.name}
                                        </p>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-wibl-teal animate-pulse" />
                                            <span className="text-[8px] font-black text-wibl-teal">PRO</span>
                                        </div>
                                    </div>
                                    <p className={cn("text-[9px] font-bold truncate opacity-50 uppercase tracking-tighter", showUserMenu ? "text-white" : "text-navy-400")}>
                                        {user.email}
                                    </p>
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
