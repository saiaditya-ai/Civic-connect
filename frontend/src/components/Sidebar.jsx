import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Report Issue', path: '/report-issue' },
    { label: 'All Issues', path: '/issues' },
    { label: 'Nearby Issues', path: '/nearby' },
    { label: 'Notifications', path: '/notifications' },
    { label: 'Profile', path: '/profile' },
];

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-72 bg-surface border-r border-border
          flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Brand */}
                <div className="px-6 py-6 border-b border-border">
                    <Link to="/dashboard" className="block">
                        <h1 className="text-xl font-bold text-primary tracking-tight">CivicConnect</h1>
                        <p className="text-xs text-text-muted mt-1 tracking-wide uppercase">Issue Reporting System</p>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    <ul className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                      transition-all duration-200
                      ${isActive
                                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                                : 'text-text-secondary hover:bg-background hover:text-text'
                                            }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full flex-shrink-0
                      ${isActive ? 'bg-white' : 'bg-text-muted/40'}`}
                                        />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-border">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
              text-danger hover:bg-danger/10 transition-all duration-200"
                    >
                        <span className="w-2 h-2 rounded-full bg-danger flex-shrink-0" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
