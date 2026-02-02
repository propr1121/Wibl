"use client";

import React, { useState } from 'react';
import { Button, Badge } from '@/components/ui';
import { Bell, Home, ChevronRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface DashboardHeaderProps {
    title?: string;
    breadcrumbs?: { label: string; href?: string }[];
    actions?: React.ReactNode;
    onMenuClick?: () => void;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
}

export function DashboardHeader({
    title,
    breadcrumbs = [],
    actions,
    onMenuClick
}: DashboardHeaderProps) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            title: 'New agent created',
            message: 'Customer Support Bot is now live',
            time: '5m ago',
            type: 'success',
            read: false,
        },
        {
            id: '2',
            title: 'Usage approaching limit',
            message: 'You have used 85% of your monthly message quota',
            time: '1h ago',
            type: 'warning',
            read: false,
        },
        {
            id: '3',
            title: 'Integration connected',
            message: 'Slack integration is now active',
            time: '2h ago',
            type: 'info',
            read: true,
        },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return '✓';
            case 'warning':
                return '⚠';
            case 'error':
                return '✕';
            default:
                return 'ℹ';
        }
    };

    const getNotificationColor = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return 'text-wibl-teal bg-wibl-teal/10';
            case 'warning':
                return 'text-coral bg-coral/10';
            case 'error':
                return 'text-coral bg-coral/10';
            default:
                return 'text-wibl-sky bg-wibl-sky/10';
        }
    };

    return (
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-navy-100 h-16 flex items-center shrink-0 transition-shadow">
            <div className="px-6 lg:px-8 w-full">
                <div className="flex items-center justify-between gap-4">
                    {/* Left: Mobile menu + Breadcrumbs + Title */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                        {/* Mobile menu button */}
                        {onMenuClick && (
                            <button
                                onClick={onMenuClick}
                                className="lg:hidden p-2 hover:bg-canvas-muted rounded-wibl-sm transition-colors"
                                aria-label="Open menu"
                            >
                                <Menu size={20} className="text-navy-600" />
                            </button>
                        )}

                        <div className="min-w-0 flex-1">
                            {/* Breadcrumbs */}
                            {breadcrumbs.length > 0 && (
                                <nav className="flex items-center gap-2 mb-1 overflow-x-auto">
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-1 text-xs font-bold text-navy-400 hover:text-wibl-teal transition-colors"
                                    >
                                        <Home size={14} />
                                    </Link>
                                    {breadcrumbs.map((crumb, index) => (
                                        <React.Fragment key={index}>
                                            <ChevronRight size={14} className="text-navy-300 shrink-0" />
                                            {crumb.href ? (
                                                <Link
                                                    href={crumb.href}
                                                    className="text-xs font-bold text-navy-400 hover:text-wibl-teal transition-colors whitespace-nowrap"
                                                >
                                                    {crumb.label}
                                                </Link>
                                            ) : (
                                                <span className="text-xs font-bold text-navy-700 whitespace-nowrap">
                                                    {crumb.label}
                                                </span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </nav>
                            )}

                            {/* Page title */}
                            {title && (
                                <h1 className="text-2xl md:text-3xl font-display font-black text-navy-700 truncate">
                                    {title}
                                </h1>
                            )}
                        </div>
                    </div>

                    {/* Right: Actions + Notifications */}
                    <div className="flex items-center gap-3 shrink-0">
                        {actions}

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 hover:bg-canvas-muted rounded-wibl-sm transition-colors"
                                aria-label="Notifications"
                            >
                                <Bell size={20} className="text-navy-600" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral text-white text-[10px] font-black rounded-full flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-wibl shadow-wibl-lg border border-navy-100 max-h-[480px] overflow-hidden flex flex-col">
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-navy-50">
                                        <h3 className="font-display font-black text-navy-700">
                                            Notifications
                                        </h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllAsRead}
                                                className="text-xs font-black text-wibl-teal hover:text-wibl-sky transition-colors"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>

                                    {/* Notifications list */}
                                    <div className="overflow-y-auto flex-1">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center">
                                                <p className="text-sm text-navy-400 font-medium">
                                                    No notifications yet
                                                </p>
                                            </div>
                                        ) : (
                                            notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className={cn(
                                                        'px-4 py-3 border-b border-navy-50 hover:bg-canvas-subtle transition-colors cursor-pointer',
                                                        !notification.read && 'bg-wibl-mint/5'
                                                    )}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className={cn(
                                                            'shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black',
                                                            getNotificationColor(notification.type)
                                                        )}>
                                                            {getNotificationIcon(notification.type)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                                <p className="text-sm font-black text-navy-700">
                                                                    {notification.title}
                                                                </p>
                                                                {!notification.read && (
                                                                    <div className="w-2 h-2 bg-wibl-teal rounded-full shrink-0 mt-1" />
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-navy-500 font-medium mb-1">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-[10px] text-navy-400 font-bold uppercase tracking-wider">
                                                                {notification.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="px-4 py-3 border-t border-navy-50">
                                        <Link
                                            href="/notifications"
                                            className="text-xs font-black text-wibl-teal hover:text-wibl-sky transition-colors block text-center"
                                            onClick={() => setShowNotifications(false)}
                                        >
                                            View all notifications
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
