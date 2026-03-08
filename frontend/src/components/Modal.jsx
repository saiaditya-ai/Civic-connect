export default function Modal({ isOpen, onClose, title, children, onConfirm, confirmLabel = 'Confirm', confirmStyle = 'danger' }) {
    if (!isOpen) return null;

    const confirmBtnStyles = {
        danger: 'bg-danger hover:bg-danger-light text-white',
        primary: 'bg-primary hover:bg-primary-dark text-white',
        success: 'bg-success hover:bg-success-light text-white',
    };

    return (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-surface rounded-2xl shadow-2xl border border-border
        w-full max-w-md animate-[scaleIn_0.2s_ease-out] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-border">
                    <h3 className="text-lg font-bold text-text">{title}</h3>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    {children}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-background/50 border-t border-border flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-text-secondary bg-surface border border-border
              rounded-xl hover:bg-background transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    {onConfirm && (
                        <button
                            onClick={onConfirm}
                            className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-colors duration-200
                ${confirmBtnStyles[confirmStyle] || confirmBtnStyles.danger}`}
                        >
                            {confirmLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
