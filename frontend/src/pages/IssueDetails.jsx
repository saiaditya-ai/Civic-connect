import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CommentSection from '../components/CommentSection';
import Modal from '../components/Modal';
import { PageLoader } from '../components/Loader';

const statusStyles = {
    OPEN: 'bg-primary/10 text-primary border-primary/20',
    IN_PROGRESS: 'bg-warning/10 text-warning border-warning/20',
    RESOLVED: 'bg-success/10 text-success border-success/20',
};

const statusLabels = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
};

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];

export default function IssueDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDelete, setShowDelete] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    const fetchIssue = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get(`/issues/${id}`);
            setIssue(res.data.data || res.data);
        } catch {
            toast.error('Failed to load issue details');
            navigate('/issues');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssue();
    }, [id]);

    const handleDelete = async () => {
        try {
            await axiosClient.delete(`/issues/${id}`);
            toast.success('Issue deleted');
            navigate('/issues');
        } catch {
            toast.error('Failed to delete issue');
        }
    };

    const handleStatusUpdate = async () => {
        if (!newStatus) return;
        try {
            await axiosClient.put(`/issues/${id}/status`, { status: newStatus });
            toast.success('Status updated');
            setShowStatus(false);
            fetchIssue();
        } catch {
            toast.error('Failed to update status');
        }
    };

    const canModify = () => {
        if (!user) return false;
        return user.role === 'ADMIN' || user.id === issue?.userId || user._id === issue?.userId;
    };

    if (loading) return <PageLoader />;
    if (!issue) return null;

    const status = issue.status || 'OPEN';

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Back */}
            <button
                onClick={() => navigate('/issues')}
                className="text-sm text-primary font-semibold hover:underline"
            >
                Back to Issues
            </button>

            {/* Issue card */}
            <div className="bg-surface rounded-2xl border border-border overflow-hidden">
                {/* Image */}
                {issue.image && (
                    <div className="w-full max-h-80 overflow-hidden">
                        <img src={issue.image} alt={issue.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="p-6 sm:p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                        <h1 className="text-2xl font-bold text-text">{issue.title}</h1>
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold border
              whitespace-nowrap self-start ${statusStyles[status] || statusStyles.OPEN}`}>
                            {statusLabels[status] || status}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-text-secondary text-sm leading-relaxed mb-6">{issue.description}</p>

                    {/* Meta grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {issue.category && (
                            <div className="bg-background rounded-xl p-4">
                                <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Category</p>
                                <p className="text-sm font-semibold text-text">{issue.category}</p>
                            </div>
                        )}
                        {(issue.latitude || issue.location) && (
                            <div className="bg-background rounded-xl p-4">
                                <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Location</p>
                                <p className="text-sm font-semibold text-text">
                                    {issue.location || `${issue.latitude}, ${issue.longitude}`}
                                </p>
                            </div>
                        )}
                        <div className="bg-background rounded-xl p-4">
                            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Created</p>
                            <p className="text-sm font-semibold text-text">
                                {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                }) : 'Unknown'}
                            </p>
                        </div>
                        <div className="bg-background rounded-xl p-4">
                            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Status</p>
                            <p className="text-sm font-semibold text-text">{statusLabels[status] || status}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    {canModify() && (
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                            <button
                                onClick={() => { setNewStatus(status); setShowStatus(true); }}
                                className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl
                  hover:bg-primary-dark transition-colors duration-200"
                            >
                                Update Status
                            </button>
                            <button
                                onClick={() => setShowDelete(true)}
                                className="px-5 py-2.5 bg-danger/10 text-danger text-sm font-medium rounded-xl
                  hover:bg-danger hover:text-white transition-all duration-200"
                            >
                                Delete Issue
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Comments */}
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8">
                <CommentSection issueId={id} />
            </div>

            {/* Delete Modal */}
            <Modal
                isOpen={showDelete}
                onClose={() => setShowDelete(false)}
                title="Delete Issue"
                onConfirm={handleDelete}
                confirmLabel="Delete"
                confirmStyle="danger"
            >
                <p className="text-sm text-text-secondary">
                    Are you sure you want to delete this issue? This action cannot be undone.
                </p>
            </Modal>

            {/* Status Modal */}
            <Modal
                isOpen={showStatus}
                onClose={() => setShowStatus(false)}
                title="Update Status"
                onConfirm={handleStatusUpdate}
                confirmLabel="Update"
                confirmStyle="primary"
            >
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">New Status</label>
                    <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text text-sm
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                    >
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{statusLabels[s]}</option>
                        ))}
                    </select>
                </div>
            </Modal>
        </div>
    );
}
