import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useToast } from '../context/ToastContext';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const toast = useToast();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.name || !form.email || !form.password) {
            setError('Name, email, and password are required.');
            return;
        }
        try {
            setLoading(true);
            await axiosClient.post('/auth/register', form);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-surface to-background px-4">
            <div className="w-full max-w-md">
                {/* Branding */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary tracking-tight">CivicConnect</h1>
                    <p className="text-text-muted text-sm mt-2">Join your community's issue reporting platform</p>
                </div>

                {/* Card */}
                <div className="bg-surface rounded-2xl shadow-xl shadow-primary/5 border border-border p-8">
                    <h2 className="text-xl font-bold text-text mb-6">Create your account</h2>

                    {error && (
                        <div className="mb-4 px-4 py-3 bg-danger/10 border border-danger/20 rounded-xl text-sm text-danger font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm
                  placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                  transition-all duration-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm
                  placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                  transition-all duration-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm
                  placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                  transition-all duration-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Phone <span className="text-text-muted">(optional)</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm
                  placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                  transition-all duration-200"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary text-white text-sm font-semibold rounded-xl
                hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 shadow-lg shadow-primary/25"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-text-muted mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
