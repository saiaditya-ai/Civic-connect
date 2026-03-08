import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import IssueCard from '../components/IssueCard';
import { PageLoader, EmptyState } from '../components/Loader';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
    const [recentIssues, setRecentIssues] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            try {
                setLoading(true);
                const [issuesRes, notifRes] = await Promise.allSettled([
                    axiosClient.get('/issues'),
                    axiosClient.get('/notifications'),
                ]);

                if (cancelled) return;

                if (issuesRes.status === 'fulfilled') {
                    const rawData = issuesRes.value.data;
                    const issues = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.data) ? rawData.data : [];
                    setRecentIssues(issues.slice(0, 5));
                    setStats({
                        total: issues.length,
                        open: issues.filter((i) => i.status === 'OPEN').length,
                        inProgress: issues.filter((i) => i.status === 'IN_PROGRESS').length,
                        resolved: issues.filter((i) => i.status === 'RESOLVED').length,
                    });
                }

                if (notifRes.status === 'fulfilled') {
                    const rawData = notifRes.value.data;
                    const notifs = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.data) ? rawData.data : [];
                    setNotifications(notifs.filter((n) => !n.read).slice(0, 5));
                }
            } catch {
                // silently handled
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchData();
        return () => { cancelled = true; };
    }, []);

    if (loading) return <PageLoader />;

    const statCards = [
        { label: 'Total Issues', value: stats.total, bgClass: 'bg-primary/10', textClass: 'text-primary' },
        { label: 'Open', value: stats.open, bgClass: 'bg-primary/10', textClass: 'text-primary' },
        { label: 'In Progress', value: stats.inProgress, bgClass: 'bg-warning/10', textClass: 'text-warning' },
        { label: 'Resolved', value: stats.resolved, bgClass: 'bg-success/10', textClass: 'text-success' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text">
                    Welcome back, <span className="text-primary">{user?.name || 'User'}</span>
                </h1>
                <p className="text-text-muted text-sm mt-1">Here is an overview of civic issues in your area.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className={`${card.bgClass} rounded-2xl p-5 border border-border
              hover:shadow-lg transition-all duration-300`}
                    >
                        <p className="text-sm font-medium text-text-secondary mb-1">{card.label}</p>
                        <p className={`text-3xl font-bold ${card.textClass}`}>{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                    to="/report-issue"
                    className="bg-primary text-white rounded-2xl p-5 hover:bg-primary-dark
            transition-all duration-300 shadow-lg shadow-primary/20"
                >
                    <h3 className="text-base font-bold mb-1">Report Issue</h3>
                    <p className="text-sm text-white/70">Submit a new civic issue</p>
                </Link>
                <Link
                    to="/nearby"
                    className="bg-surface border border-border rounded-2xl p-5 hover:shadow-lg
            transition-all duration-300"
                >
                    <h3 className="text-base font-bold text-text mb-1">Nearby Issues</h3>
                    <p className="text-sm text-text-muted">View issues near your location</p>
                </Link>
                <Link
                    to="/notifications"
                    className="bg-surface border border-border rounded-2xl p-5 hover:shadow-lg
            transition-all duration-300 relative"
                >
                    <h3 className="text-base font-bold text-text mb-1">Notifications</h3>
                    <p className="text-sm text-text-muted">
                        {notifications.length > 0 ? `${notifications.length} unread` : 'All caught up'}
                    </p>
                    {notifications.length > 0 && (
                        <span className="absolute top-4 right-4 w-3 h-3 rounded-full bg-danger animate-pulse" />
                    )}
                </Link>
            </div>

            {/* Recent Issues */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-text">Recent Issues</h2>
                    <Link to="/issues" className="text-sm text-primary font-semibold hover:underline">
                        View all
                    </Link>
                </div>
                {recentIssues.length === 0 ? (
                    <EmptyState title="No issues yet" description="Be the first to report a civic issue." />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {recentIssues.map((issue) => (
                            <IssueCard key={issue.id || issue._id} issue={issue} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
