import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useToast } from '../context/ToastContext';
import NotificationItem from '../components/NotificationItem';
import { PageLoader, EmptyState } from '../components/Loader';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        let cancelled = false;

        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get('/notifications');
                if (cancelled) return;
                const rawData = res.data;
                const notifs = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.data) ? rawData.data : [];
                setNotifications(notifs);
            } catch {
                if (!cancelled) setNotifications([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchNotifications();
        return () => { cancelled = true; };
    }, []);

    const handleMarkRead = async (id) => {
        try {
            await axiosClient.patch(`/notifications/${id}/read`);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id || n._id === id ? { ...n, read: true } : n))
            );
            toast.success('Marked as read');
        } catch {
            toast.error('Failed to update notification');
        }
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    if (loading) return <PageLoader />;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text">Notifications</h1>
                    <p className="text-sm text-text-muted mt-1">
                        {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-danger text-white text-sm font-bold">
                        {unreadCount}
                    </span>
                )}
            </div>

            {notifications.length === 0 ? (
                <EmptyState
                    title="No notifications"
                    description="You will receive notifications when someone interacts with your issues."
                />
            ) : (
                <div className="space-y-3">
                    {notifications.map((notif) => (
                        <NotificationItem
                            key={notif.id || notif._id}
                            notification={notif}
                            onMarkRead={handleMarkRead}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
