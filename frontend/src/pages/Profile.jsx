import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageLoader } from '../components/Loader';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const toast = useToast();
    const [form, setForm] = useState({ name: '', email: '', phone: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const userId = user?.id || user?._id;
            if (userId) {
                const res = await axiosClient.get(`/users/${userId}`);
                const data = res.data.data || res.data;
                setForm({ name: data.name || '', email: data.email || '', phone: data.phone || '' });
            } else {
                setForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
            }
        } catch {
            setForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const userId = user?.id || user?._id;
            const res = await axiosClient.put(`/users/${userId}`, form);
            const data = res.data.data || res.data;
            updateUser({ ...user, ...data });
            toast.success('Profile updated');
            setEditing(false);
        } catch {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-text">Profile</h1>

            <div className="bg-surface rounded-2xl border border-border overflow-hidden">
                {/* Avatar header */}
                <div className="bg-gradient-to-r from-primary to-primary-dark p-8 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur 
            flex items-center justify-center text-white text-2xl font-bold mb-3">
                        {form.name ? form.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <h2 className="text-lg font-bold text-white">{form.name || 'User'}</h2>
                    <p className="text-sm text-white/70">{user?.role || 'Citizen'}</p>
                </div>

                {/* Profile form */}
                <div className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                disabled={!editing}
                                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200
                  ${editing
                                        ? 'border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary'
                                        : 'border-transparent bg-background text-text cursor-default'
                                    }`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                disabled={!editing}
                                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200
                  ${editing
                                        ? 'border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary'
                                        : 'border-transparent bg-background text-text cursor-default'
                                    }`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                disabled={!editing}
                                placeholder="Not provided"
                                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200
                  ${editing
                                        ? 'border-border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary'
                                        : 'border-transparent bg-background text-text cursor-default'
                                    }`}
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            {editing ? (
                                <>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 py-3 bg-primary text-white text-sm font-semibold rounded-xl
                      hover:bg-primary-dark disabled:opacity-50 transition-all duration-200
                      shadow-lg shadow-primary/25"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setEditing(false); fetchProfile(); }}
                                        className="px-6 py-3 bg-background border border-border text-text-secondary text-sm font-medium
                      rounded-xl hover:bg-border/50 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setEditing(true)}
                                    className="flex-1 py-3 bg-primary text-white text-sm font-semibold rounded-xl
                    hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-primary/25"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
