import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['Roads', 'Water', 'Electricity', 'Sanitation', 'Public Safety', 'Parks', 'Other'];

export default function ReportIssue() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        latitude: '',
        longitude: '',
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const getLocation = () => {
        if (!navigator.geolocation) {
            toast.warning('Geolocation is not supported by your browser');
            return;
        }
        setGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setForm((prev) => ({
                    ...prev,
                    latitude: pos.coords.latitude.toFixed(6),
                    longitude: pos.coords.longitude.toFixed(6),
                }));
                toast.success('Location captured');
                setGettingLocation(false);
            },
            () => {
                toast.error('Unable to get your location');
                setGettingLocation(false);
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.description || !form.category) {
            toast.warning('Please fill in title, description, and category.');
            return;
        }
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('category', form.category);
            if (form.latitude && form.longitude) {
                formData.append('latitude', form.latitude);
                formData.append('longitude', form.longitude);
            }
            if (image) {
                formData.append('image', image);
            }
            await axiosClient.post('/issues', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Issue reported successfully!');
            navigate('/issues');
        } catch {
            toast.error('Failed to report issue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-text">Report a New Issue</h1>
                <p className="text-sm text-text-muted mt-1">Help improve your community by reporting civic issues.</p>
            </div>

            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Issue Title</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Brief description of the issue"
                            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm
                placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                transition-all duration-200"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Provide details about the issue..."
                            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm
                placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                resize-none transition-all duration-200"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Category</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                        >
                            <option value="">Select a category</option>
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Image upload */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Upload Image</label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full text-sm text-text-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-xl
                  file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary
                  hover:file:bg-primary/20 file:cursor-pointer file:transition-colors"
                            />
                        </div>
                        {preview && (
                            <div className="mt-3 relative">
                                <img src={preview} alt="Preview" className="w-full max-h-48 object-cover rounded-xl border border-border" />
                                <button
                                    type="button"
                                    onClick={() => { setImage(null); setPreview(null); }}
                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-danger text-white text-sm font-bold
                    flex items-center justify-center hover:bg-danger-light transition-colors"
                                >
                                    x
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Location</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input
                                type="text"
                                name="latitude"
                                value={form.latitude}
                                onChange={handleChange}
                                placeholder="Latitude"
                                className="px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm
                  placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                  transition-all duration-200"
                            />
                            <input
                                type="text"
                                name="longitude"
                                value={form.longitude}
                                onChange={handleChange}
                                placeholder="Longitude"
                                className="px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm
                  placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                  transition-all duration-200"
                            />
                            <button
                                type="button"
                                onClick={getLocation}
                                disabled={gettingLocation}
                                className="px-4 py-3 bg-background border border-border text-text text-sm font-medium rounded-xl
                  hover:bg-border/50 disabled:opacity-50 transition-all duration-200"
                            >
                                {gettingLocation ? 'Getting...' : 'Use GPS'}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary text-white text-sm font-semibold rounded-xl
              hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 shadow-lg shadow-primary/25"
                    >
                        {loading ? 'Submitting...' : 'Submit Issue Report'}
                    </button>
                </form>
            </div>
        </div>
    );
}
