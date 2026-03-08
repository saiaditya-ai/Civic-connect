import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import IssueCard from '../components/IssueCard';
import Modal from '../components/Modal';
import { PageLoader, EmptyState } from '../components/Loader';

const CATEGORIES = ['All', 'Roads', 'Water', 'Electricity', 'Sanitation', 'Public Safety', 'Parks', 'Other'];
const STATUSES = ['All', 'OPEN', 'IN_PROGRESS', 'RESOLVED'];
const PAGE_SIZE = 9;

export default function Issues() {
    const [issues, setIssues] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [status, setStatus] = useState('All');
    const [page, setPage] = useState(1);
    const [deleteId, setDeleteId] = useState(null);
    const { user } = useAuth();
    const toast = useToast();

    const fetchIssues = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get('/issues');
            setIssues(res.data.data || res.data || []);
        } catch {
            toast.error('Failed to load issues');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    useEffect(() => {
        let result = [...issues];
        if (search) {
            const s = search.toLowerCase();
            result = result.filter(
                (i) => i.title?.toLowerCase().includes(s) || i.description?.toLowerCase().includes(s)
            );
        }
        if (category !== 'All') {
            result = result.filter((i) => i.category === category);
        }
        if (status !== 'All') {
            result = result.filter((i) => i.status === status);
        }
        setFiltered(result);
        setPage(1);
    }, [search, category, status, issues]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await axiosClient.delete(`/issues/${deleteId}`);
            toast.success('Issue deleted');
            setDeleteId(null);
            fetchIssues();
        } catch {
            toast.error('Failed to delete issue');
        }
    };

    const canDelete = (issue) => {
        if (!user) return false;
        return user.role === 'ADMIN' || user.id === issue.userId || user._id === issue.userId;
    };

    if (loading) return <PageLoader />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-text">All Issues</h1>
                <p className="text-sm text-text-muted">{filtered.length} issue{filtered.length !== 1 ? 's' : ''} found</p>
            </div>

            {/* Filters */}
            <div className="bg-surface rounded-2xl border border-border p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Search */}
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">Search</label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search issues..."
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text text-sm
                placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                transition-all duration-200"
                        />
                    </div>
                    {/* Category */}
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text text-sm
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    {/* Status */}
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text text-sm
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                        >
                            {STATUSES.map((s) => (
                                <option key={s} value={s}>{s === 'IN_PROGRESS' ? 'In Progress' : s === 'All' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Issues grid */}
            {paged.length === 0 ? (
                <EmptyState
                    title="No issues found"
                    description={search || category !== 'All' || status !== 'All' ? 'Try adjusting your filters.' : 'No issues have been reported yet.'}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {paged.map((issue) => (
                        <IssueCard
                            key={issue.id || issue._id}
                            issue={issue}
                            showDelete={canDelete(issue)}
                            onDelete={(id) => setDeleteId(id)}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 text-sm font-medium rounded-xl border border-border bg-surface
              hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        Previous
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200
                  ${p === page
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                        : 'bg-surface border border-border hover:bg-background'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 text-sm font-medium rounded-xl border border-border bg-surface
              hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Delete Modal */}
            <Modal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                title="Delete Issue"
                onConfirm={handleDelete}
                confirmLabel="Delete"
                confirmStyle="danger"
            >
                <p className="text-sm text-text-secondary">
                    Are you sure you want to delete this issue? This action cannot be undone.
                </p>
            </Modal>
        </div>
    );
}
