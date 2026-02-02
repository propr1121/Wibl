"use client";

import React, { useState } from 'react';
import { useHeaderConfig } from '@/components/layouts/DashboardContext';
import { Card, Button, Badge, Avatar } from '@/components/ui';
import { Bell, Check, Trash2, Filter, MoreVertical, Search, Zap, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    category: 'system' | 'agent' | 'billing';
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        title: 'New agent created',
        message: 'Customer Support Bot is now live and ready to handle incoming chats.',
        time: '5m ago',
        type: 'success',
        read: false,
        category: 'agent',
    },
    {
        id: '2',
        title: 'Usage approaching limit',
        message: 'You have used 85% of your monthly message quota. Consider upgrading for uninterrupted service.',
        time: '1h ago',
        type: 'warning',
        read: false,
        category: 'billing',
    },
    {
        id: '3',
        title: 'Integration connected',
        message: 'Slack integration is now active for workspace: Wibl Teams.',
        time: '2h ago',
        type: 'info',
        read: true,
        category: 'system',
    },
    {
        id: '4',
        title: 'Security Alert',
        message: 'Untrusted IP detected attempting to access Agent API keys. Access was blocked.',
        time: '5h ago',
        type: 'error',
        read: true,
        category: 'system',
    },
    {
        id: '5',
        title: 'Monthly Analytics Ready',
        message: 'Your monthly intelligence report is now available for review.',
        time: '1 day ago',
        type: 'success',
        read: true,
        category: 'system',
    },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useHeaderConfig({
        breadcrumbs: [{ label: 'Overview', href: '/dashboard' }, { label: 'Notifications', href: '/notifications' }],
    });

    const unreadCount = notifications.filter(n => !n.read).length;
    const filteredNotifications = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div className="space-y-12 pb-20 max-w-[1000px] mx-auto relative animate-reveal">
            {/* Background Orbs */}
            <div className="absolute top-[-5%] right-[-10%] w-[400px] h-[400px] bg-wibl-teal/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Notifications Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-wibl-teal uppercase tracking-[0.3em] mb-1">Activity Command</p>
                    <h1 className="text-3xl lg:text-4xl font-display font-black text-navy-900 tracking-tighter">
                        Notification <span className="text-gradient">Center.</span>
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={markAllRead}
                        disabled={unreadCount === 0}
                        className="font-black uppercase tracking-widest text-[10px]"
                    >
                        Mark all as read
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setFilter('all')}
                    className={cn(
                        "px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                        filter === 'all' ? "bg-navy-900 text-white shadow-premium-sm" : "text-navy-400 hover:text-navy-600"
                    )}
                >
                    All Notifications
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={cn(
                        "px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                        filter === 'unread' ? "bg-navy-900 text-white shadow-premium-sm" : "text-navy-400 hover:text-navy-600"
                    )}
                >
                    Unread
                    {unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-wibl-teal text-navy-900 flex items-center justify-center text-[10px] scale-90">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </div>

            {/* List */}
            <Card variant="premium" className="bg-white/80 border-navy-50/50 backdrop-blur-md overflow-hidden p-0">
                <div className="divide-y divide-navy-50">
                    {filteredNotifications.length === 0 ? (
                        <div className="p-20 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-navy-50 flex items-center justify-center mx-auto text-navy-200">
                                <Bell size={32} />
                            </div>
                            <p className="text-navy-400 font-medium">You're all caught up. No new notifications.</p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onDelete={deleteNotification}
                            />
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}

function NotificationItem({ notification, onDelete }: { notification: Notification; onDelete: (id: string) => void }) {
    const getIcon = () => {
        switch (notification.type) {
            case 'success': return <CheckCircle2 className="text-wibl-teal" />;
            case 'warning': return <AlertCircle className="text-coral" />;
            case 'error': return <AlertCircle className="text-coral" />;
            default: return <Info className="text-wibl-sky" />;
        }
    };

    return (
        <div className={cn(
            "p-6 flex gap-6 group transition-colors relative",
            !notification.read ? "bg-wibl-teal/5" : "hover:bg-canvas-subtle"
        )}>
            {!notification.read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-wibl-teal" />
            )}

            <div className={cn(
                "w-12 h-12 rounded-xl shrink-0 flex items-center justify-center shadow-sm",
                notification.read ? "bg-navy-50" : "bg-white"
            )}>
                {getIcon()}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-4">
                    <h3 className={cn(
                        "text-sm font-black tracking-tight",
                        notification.read ? "text-navy-700" : "text-navy-900"
                    )}>
                        {notification.title}
                    </h3>
                    <span className="text-[10px] font-bold text-navy-300 uppercase tracking-widest shrink-0 mt-0.5">
                        {notification.time}
                    </span>
                </div>
                <p className="text-xs text-navy-500 font-medium leading-relaxed max-w-2xl">
                    {notification.message}
                </p>
                <div className="flex items-center gap-3 pt-2">
                    <Badge variant="outlined" size="sm" className="bg-white/50 border-navy-100 text-navy-400">
                        {notification.category}
                    </Badge>
                </div>
            </div>

            <div className="flex items-start opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onDelete(notification.id)}
                    className="p-2 hover:bg-coral/10 hover:text-coral rounded-lg text-navy-300 transition-colors"
                    title="Delete"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}
