import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuToggle }) {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-border">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                {/* Menu toggle for mobile */}
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden flex flex-col gap-1.5 p-2 -ml-2 rounded-lg hover:bg-background transition-colors"
                    aria-label="Toggle menu"
                >
                    <span className="block w-5 h-0.5 bg-text rounded-full" />
                    <span className="block w-5 h-0.5 bg-text rounded-full" />
                    <span className="block w-5 h-0.5 bg-text rounded-full" />
                </button>

                {/* Page title - hidden on mobile to save space */}
                <div className="hidden lg:block">
                    <h2 className="text-lg font-semibold text-text">Civic Dashboard</h2>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-4 ml-auto">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-text">{user?.name || 'User'}</p>
                        <p className="text-xs text-text-muted">{user?.role || 'Citizen'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark
            flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
}
