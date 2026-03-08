export default function NotificationItem({ notification, onMarkRead }) {
    const isUnread = !notification.read;

    return (
        <div
            className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200
        ${isUnread
                    ? 'bg-primary/5 border-primary/20 shadow-sm'
                    : 'bg-surface border-border hover:bg-background'
                }`}
        >
            {/* Unread indicator */}
            <div className="pt-1.5 flex-shrink-0">
                <span className={`block w-2.5 h-2.5 rounded-full
          ${isUnread ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-text-muted/20'}`}
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm ${isUnread ? 'font-semibold text-text' : 'text-text-secondary'}`}>
                    {notification.message || notification.text}
                </p>
                <p className="text-xs text-text-muted mt-1">
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : ''}
                </p>
            </div>

            {/* Mark as read */}
            {isUnread && onMarkRead && (
                <button
                    onClick={() => onMarkRead(notification.id || notification._id)}
                    className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-primary
            bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors duration-200"
                >
                    Mark read
                </button>
            )}
        </div>
    );
}
