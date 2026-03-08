import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useToast } from '../context/ToastContext';
import { PageLoader, EmptyState } from '../components/Loader';

const statusLabels = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
};

let LeafletComponents = null;

export default function NearbyIssues() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [center, setCenter] = useState([20.5937, 78.9629]);
    const [view, setView] = useState('list');
    const [mapReady, setMapReady] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setCenter([pos.coords.latitude, pos.coords.longitude]);
                },
                () => { }
            );
        }
        fetchNearby();
        // Dynamically import leaflet to avoid SSR issues
        loadMapComponents();
    }, []);

    const loadMapComponents = async () => {
        try {
            const [rl, L] = await Promise.all([
                import('react-leaflet'),
                import('leaflet'),
            ]);
            await import('leaflet/dist/leaflet.css');

            // Fix default marker icon
            delete L.default.Icon.Default.prototype._getIconUrl;
            L.default.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            LeafletComponents = {
                MapContainer: rl.MapContainer,
                TileLayer: rl.TileLayer,
                Marker: rl.Marker,
                Popup: rl.Popup,
            };
            setMapReady(true);
        } catch {
            // Map not available
        }
    };

    const fetchNearby = async () => {
        try {
            setLoading(true);
            let result = [];
            try {
                const res = await axiosClient.get('/issues/nearby');
                const rawData = res.data;
                result = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.data) ? rawData.data : [];
            } catch {
                try {
                    const res = await axiosClient.get('/issues');
                    const rawData = res.data;
                    const allIssues = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.data) ? rawData.data : [];
                    result = allIssues.filter((i) => i.latitude && i.longitude);
                } catch {
                    // no data
                }
            }
            setIssues(result);
        } catch {
            toast.error('Failed to load nearby issues');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <PageLoader />;

    const MapView = () => {
        if (!mapReady || !LeafletComponents) {
            return (
                <div className="bg-surface rounded-2xl border border-border p-12 text-center">
                    <p className="text-text-muted text-sm">Map is loading...</p>
                </div>
            );
        }

        const { MapContainer, TileLayer, Marker, Popup } = LeafletComponents;

        return (
            <div className="bg-surface rounded-2xl border border-border overflow-hidden" style={{ height: '500px' }}>
                <MapContainer
                    center={center}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {issues.map((issue) => (
                        issue.latitude && issue.longitude && (
                            <Marker
                                key={issue.id || issue._id}
                                position={[parseFloat(issue.latitude), parseFloat(issue.longitude)]}
                            >
                                <Popup>
                                    <div className="min-w-[180px]">
                                        <h3 className="font-bold text-sm mb-1">{issue.title}</h3>
                                        <p className="text-xs text-gray-600 mb-2">
                                            {statusLabels[issue.status] || issue.status}
                                        </p>
                                        <Link
                                            to={`/issues/${issue.id || issue._id}`}
                                            className="text-xs text-blue-600 font-semibold hover:underline"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    ))}
                </MapContainer>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text">Nearby Issues</h1>
                    <p className="text-sm text-text-muted mt-1">{issues.length} issues with location data</p>
                </div>
                <div className="flex rounded-xl border border-border overflow-hidden">
                    <button
                        onClick={() => setView('map')}
                        className={`px-4 py-2 text-sm font-medium transition-colors
              ${view === 'map' ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:bg-background'}`}
                    >
                        Map View
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`px-4 py-2 text-sm font-medium transition-colors
              ${view === 'list' ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:bg-background'}`}
                    >
                        List View
                    </button>
                </div>
            </div>

            {issues.length === 0 ? (
                <EmptyState
                    title="No nearby issues"
                    description="No issues with location data found."
                />
            ) : view === 'map' ? (
                <MapView />
            ) : (
                <div className="space-y-3">
                    {issues.map((issue) => (
                        <Link
                            key={issue.id || issue._id}
                            to={`/issues/${issue.id || issue._id}`}
                            className="block bg-surface rounded-2xl border border-border p-5 hover:shadow-lg
                transition-all duration-300"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-base font-semibold text-text">{issue.title}</h3>
                                    <p className="text-sm text-text-muted mt-1">
                                        {issue.latitude}, {issue.longitude}
                                    </p>
                                </div>
                                <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                                    {statusLabels[issue.status] || issue.status}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
