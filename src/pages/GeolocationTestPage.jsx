import React, { useState } from 'react';

export const GeolocationTestPage = () => {
    const [status, setStatus] = useState('Waiting for user action…');
    const [coords, setCoords] = useState({ lat: null, lon: null });
    const [error, setError] = useState(null);

    const handleGetLocation = () => {
        setError(null);

        if (!navigator.geolocation) {
            setStatus('❌ Geolocation is not supported by this browser.');
            setError('Geolocation API not available');
            return;
        }

        // Show browser alert for permission request
        alert('This page will request your location permission. Please allow access to get your current location.');

        setStatus('⏳ Requesting location… (browser may show a permission popup)');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(6);
                const lon = position.coords.longitude.toFixed(6);
                setCoords({ lat, lon });
                setStatus('✅ Location received');
            },
            (err) => {
                setStatus(`❌ Error - ${err.message}`);
                setError(err.message);
            }
        );
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px 20px',
            boxSizing: 'border-box'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                background: 'white',
                borderRadius: '16px',
                padding: '30px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
                <h1 style={{ fontSize: '2em', marginBottom: '10px', color: '#1a202c' }}>
                    📍 Geolocation Test Page
                </h1>
                <button
                    onClick={handleGetLocation}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#3182ce',
                        color: 'white',
                        fontSize: '16px',
                        cursor: 'pointer',
                        marginBottom: '20px'
                    }}
                >
                    Get Current Location
                </button>

                <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#2d3748' }}>
                    Status: {status}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <div style={{
                        padding: '10px',
                        background: '#f7fafc',
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        fontSize: '14px'
                    }}>
                        Latitude: {coords.lat ?? 'N/A'}, Longitude: {coords.lon ?? 'N/A'}
                    </div>
                </div>

                {coords.lat && coords.lon && (
                    <div style={{ marginTop: '10px' }}>
                        <h2 style={{ fontSize: '1.1em', marginBottom: '8px', color: '#2d3748' }}>
                            Map (centered on detected location)
                        </h2>
                        <div style={{
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid #e2e8f0',
                            marginBottom: '8px'
                        }}>
                            <iframe
                                title="Current location map"
                                style={{ width: '100%', height: '320px', border: '0' }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://www.google.com/maps?q=${coords.lat},${coords.lon}&z=15&output=embed`}
                            />
                        </div>
                        <a
                            href={`https://www.google.com/maps?q=${coords.lat},${coords.lon}&z=15`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '13px', color: '#3182ce', textDecoration: 'underline' }}
                        >
                            Open in Google Maps
                        </a>
                    </div>
                )}

                {error && (
                    <div style={{ marginTop: '10px', color: '#e53e3e', fontSize: '14px' }}>
                        Error detail: {error}
                    </div>
                )}
            </div>
        </div>
    );
};


