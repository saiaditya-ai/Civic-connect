import { Link } from 'react-router-dom';

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

export default function IssueCard({ issue, onDelete, showDelete = false }) {
    const status = issue.status || 'OPEN';

    return (
        <div className="bg-surface rounded-2xl border border-border p-5 hover:shadow-lg hover:shadow-primary/5
      transition-all duration-300 group">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-base font-semibold text-text group-hover:text-primary transition-colors line-clamp-2">
                    {issue.title}
                </h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border
          whitespace-nowrap ${statusStyles[status] || statusStyles.OPEN}`}>
                    {statusLabels[status] || status}
                </span>
            </div>

            {/* Description */}
            <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                {issue.description || 'No description provided.'}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap gap-3 mb-4">
                {issue.category && (
                    <span className="text-xs font-medium text-text-muted bg-background px-3 py-1 rounded-lg">
                        {issue.category}
                    </span>
                )}
                <span className="text-xs text-text-muted">
                    {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : ''}
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-border">
                <Link
                    to={`/issues/${issue.id || issue._id}`}
                    className="flex-1 text-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl
            hover:bg-primary-dark transition-colors duration-200"
                >
                    View Details
                </Link>
                {showDelete && (
                    <button
                        onClick={() => onDelete && onDelete(issue.id || issue._id)}
                        className="px-4 py-2 bg-danger/10 text-danger text-sm font-medium rounded-xl
              hover:bg-danger hover:text-white transition-all duration-200"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}
