export default function Loader({ size = 'md', className = '' }) {
    const sizeMap = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`${sizeMap[size] || sizeMap.md} border-primary border-t-transparent rounded-full animate-spin`} />
        </div>
    );
}

export function PageLoader() {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader size="lg" />
            <p className="text-sm text-text-muted animate-pulse">Loading...</p>
        </div>
    );
}

export function EmptyState({ title = 'No data found', description = '' }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-background border-2 border-dashed border-border
        flex items-center justify-center mb-4">
                <span className="text-2xl text-text-muted font-light">?</span>
            </div>
            <h3 className="text-base font-semibold text-text mb-1">{title}</h3>
            {description && <p className="text-sm text-text-muted max-w-xs">{description}</p>}
        </div>
    );
}
