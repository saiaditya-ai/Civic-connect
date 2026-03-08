import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function CommentSection({ issueId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { user } = useAuth();
    const toast = useToast();

    const fetchComments = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get(`/issues/${issueId}/comments`);
            setComments(res.data.data || res.data || []);
        } catch {
            setComments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (issueId) fetchComments();
    }, [issueId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            setSubmitting(true);
            await axiosClient.post(`/issues/${issueId}/comments`, { text: newComment });
            setNewComment('');
            toast.success('Comment added');
            fetchComments();
        } catch {
            toast.error('Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await axiosClient.delete(`/comments/${commentId}`);
            toast.success('Comment deleted');
            fetchComments();
        } catch {
            toast.error('Failed to delete comment');
        }
    };

    const canDelete = (comment) => {
        if (!user) return false;
        return user.role === 'ADMIN' || user.id === comment.userId || user._id === comment.userId;
    };

    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold text-text mb-4">Comments</h3>

            {/* Add comment form */}
            <form onSubmit={handleSubmit} className="mb-6">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm
            placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
            resize-none transition-all duration-200"
                />
                <div className="flex justify-end mt-2">
                    <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className="px-5 py-2 bg-primary text-white text-sm font-medium rounded-xl
              hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200"
                    >
                        {submitting ? 'Posting...' : 'Post Comment'}
                    </button>
                </div>
            </form>

            {/* Comments list */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-8 text-text-muted text-sm">
                    No comments yet. Be the first to comment.
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div
                            key={comment.id || comment._id}
                            className="bg-background rounded-xl p-4 border border-border/50"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center
                    text-xs font-bold text-primary">
                                        {(comment.userName || comment.user?.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-semibold text-text">
                                        {comment.userName || comment.user?.name || 'Anonymous'}
                                    </span>
                                    <span className="text-xs text-text-muted">
                                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                                    </span>
                                </div>
                                {canDelete(comment) && (
                                    <button
                                        onClick={() => handleDelete(comment.id || comment._id)}
                                        className="text-xs text-danger hover:text-danger-light font-medium
                      transition-colors duration-200"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                            <p className="text-sm text-text-secondary pl-9">{comment.text || comment.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
