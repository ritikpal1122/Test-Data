import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadStatusProvider, useUploadStatus } from '../contexts/UploadStatusContext';

function AutohealTestPageContent() {
    const navigate = useNavigate();
    const { updateStatus } = useUploadStatus();
    // Initialize with random positions
    const getRandomPosition = () => ({
        top: Math.floor(Math.random() * 180) + 20,
        left: Math.floor(Math.random() * 280) + 20
    });

    const [positions, setPositions] = useState(() => ({
        normal: getRandomPosition(),
        shadow: getRandomPosition(),
        shadowInIframe: getRandomPosition(),
        iframeInShadow: getRandomPosition()
    }));

    const updatePosition = useCallback((scenario, top, left) => {
        setPositions(prev => ({
            ...prev,
            [scenario]: { top, left }
        }));
    }, []);

    // Scroll to section on page load if hash is present
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            setTimeout(() => {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, []);

    return (
        <div style={{ padding: '20px', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <button
                onClick={() => navigate('/')}
                style={{
                    position: 'fixed',
                    top: '10px',
                    right: '20px',
                    zIndex: 10005,
                    background: '#667eea',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
            >
                ← Back to Home
            </button>

            <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '60px' }}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '30px', marginBottom: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>🔄 Autoheal Testing Page</h1>
                    <p style={{ margin: 0, color: '#666', marginBottom: '10px' }}>Test autohealing capabilities with dynamic position changes</p>
                    <div style={{ padding: '10px', background: '#e7f3ff', borderRadius: '6px', fontSize: '13px', color: '#0066cc' }}>
                        ⚡ Positions are randomized on every browser refresh. You can also manually adjust positions using the controls below.
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px' }}>
                    {/* Scenario 1: Normal */}
                    <div id="scenario-1">
                        <NormalScenario
                            position={positions.normal}
                            onPositionChange={(top, left) => updatePosition('normal', top, left)}
                            onFileUpload={(files) => updateStatus(16, files)}
                        />
                    </div>

                    {/* Scenario 2: Shadow DOM */}
                    <div id="scenario-2">
                        <ShadowDOMScenario
                            position={positions.shadow}
                            onPositionChange={(top, left) => updatePosition('shadow', top, left)}
                            onFileUpload={(files) => updateStatus(17, files)}
                        />
                    </div>

                    {/* Scenario 3: Shadow DOM in iframe */}
                    <div id="scenario-3">
                        <ShadowInIframeScenario
                            position={positions.shadowInIframe}
                            onPositionChange={(top, left) => updatePosition('shadowInIframe', top, left)}
                            onFileUpload={(files) => updateStatus(18, files)}
                        />
                    </div>

                    {/* Scenario 4: iframe in Shadow DOM */}
                    <div id="scenario-4">
                        <IframeInShadowScenario
                            position={positions.iframeInShadow}
                            onPositionChange={(top, left) => updatePosition('iframeInShadow', top, left)}
                            onFileUpload={(files) => updateStatus(19, files)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Scenario 1: Normal
function NormalScenario({ position, onPositionChange, onFileUpload }) {
    const containerRef = useRef(null);
    const [text, setText] = useState('Autoheal Test Text - Normal');

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            onFileUpload(files);
        }
    };

    const copyLink = () => {
        const url = `${window.location.origin}${window.location.pathname}#scenario-1`;
        navigator.clipboard.writeText(url);
    };

    return (
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>Scenario 1: Normal DOM</h2>
                <button
                    onClick={copyLink}
                    style={{
                        padding: '6px 12px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                    }}
                >
                    🔗 Copy Link
                </button>
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#666' }}>Text to Verify:</label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                />
            </div>
            <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Top:</label>
                    <input
                        type="number"
                        value={position.top}
                        onChange={(e) => onPositionChange(parseInt(e.target.value), position.left)}
                        style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Left:</label>
                    <input
                        type="number"
                        value={position.left}
                        onChange={(e) => onPositionChange(position.top, parseInt(e.target.value))}
                        style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                    />
                </div>
            </div>
            <div
                ref={containerRef}
                style={{
                    position: 'relative',
                    height: '250px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    padding: '15px'
                }}
            >
                <div style={{ marginBottom: '10px', padding: '10px', background: '#e3f2fd', borderRadius: '4px', fontSize: '14px', color: '#1976d2' }}>
                    {text}
                </div>
                <input
                    type="file"
                    id="normal-autoheal-input"
                    name="normal-autoheal-upload"
                    multiple
                    onChange={handleFileChange}
                    style={{
                        position: 'absolute',
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                        zIndex: 1,
                        width: '200px',
                        height: '40px'
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                        width: '200px',
                        height: '40px',
                        background: '#007bff',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        pointerEvents: 'none',
                        fontSize: '13px',
                        fontWeight: '500'
                    }}
                    onClick={() => document.getElementById('normal-autoheal-input').click()}
                >
                    📁 Upload Files
                </div>
            </div>
        </div>
    );
}

// Scenario 2: Shadow DOM
function ShadowDOMScenario({ position, onPositionChange, onFileUpload }) {
    const containerRef = useRef(null);
    const shadowRootRef = useRef(null);
    const [text, setText] = useState('Autoheal Test Text - Shadow DOM');

    const updateShadowContent = useCallback(() => {
        if (!shadowRootRef.current) return;

        shadowRootRef.current.innerHTML = `
            <style>
                .shadow-container { position: relative; padding: 15px; background: #fff3e0; border-radius: 8px; height: 250px; }
                .shadow-text { margin-bottom: 10px; padding: 10px; background: #ffe0b2; border-radius: 4px; font-size: 14px; color: #e65100; }
                .shadow-upload-btn { position: absolute; width: 200px; height: 40px; background: #ff9800; color: white; display: flex; align-items: center; justify-content: center; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500; pointer-events: none; }
            </style>
            <div class="shadow-container">
                <div class="shadow-text">${text}</div>
                <input type="file" id="shadow-autoheal-input" name="shadow-autoheal-upload" multiple style="position: absolute; top: ${position.top}px; left: ${position.left}px; z-index: 1; width: 200px; height: 40px; opacity: 0;">
                <div class="shadow-upload-btn" style="top: ${position.top}px; left: ${position.left}px;" onclick="document.getElementById('shadow-autoheal-input').click()">📁 Upload Files</div>
            </div>
        `;

        const input = shadowRootRef.current.getElementById('shadow-autoheal-input');
        if (input) {
            input.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                if (files.length > 0) {
                    onFileUpload(files);
                }
            });
        }
    }, [position.top, position.left, text, onFileUpload]);

    useEffect(() => {
        if (!containerRef.current) return;

        let shadow = containerRef.current.shadowRoot;
        if (!shadow) {
            shadow = containerRef.current.attachShadow({ mode: 'open' });
        }
        shadowRootRef.current = shadow;

        updateShadowContent();
    }, [updateShadowContent]);

    const copyLink = () => {
        const url = `${window.location.origin}${window.location.pathname}#scenario-2`;
        navigator.clipboard.writeText(url);
    };

    return (
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>Scenario 2: Shadow DOM</h2>
                <button
                    onClick={copyLink}
                    style={{
                        padding: '6px 12px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                    }}
                >
                    🔗 Copy Link
                </button>
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#666' }}>Text to Verify:</label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                />
            </div>
            <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Top:</label>
                    <input
                        type="number"
                        value={position.top}
                        onChange={(e) => onPositionChange(parseInt(e.target.value), position.left)}
                        style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Left:</label>
                    <input
                        type="number"
                        value={position.left}
                        onChange={(e) => onPositionChange(position.top, parseInt(e.target.value))}
                        style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                    />
                </div>
            </div>
            <div
                ref={containerRef}
                style={{
                    border: '2px solid #ff9800',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}
            ></div>
        </div>
    );
}

// Scenario 3: Shadow DOM in iframe
function ShadowInIframeScenario({ position, onPositionChange, onFileUpload }) {
    const iframeRef = useRef(null);
    const [text, setText] = useState('Autoheal Test Text - Shadow in Iframe');

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.type === 'update-upload-status' && event.data.scenarioNumber === 18) {
                onFileUpload([{ name: 'uploaded-file' }]);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onFileUpload]);

    // Recalculate iframe content when position or text changes
    const iframeContent = useMemo(() => `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { margin: 0; padding: 20px; font-family: Arial; background: #f3e5f5; }
            </style>
        </head>
        <body>
            <div id="shadow-host"></div>
            <script>
                const host = document.getElementById("shadow-host");
                const shadow = host.attachShadow({ mode: "open" });
                shadow.innerHTML = \`
                    <style>
                        .iframe-shadow-container { position: relative; padding: 15px; background: #fff3e0; border-radius: 8px; height: 250px; }
                        .iframe-shadow-text { margin-bottom: 10px; padding: 10px; background: #ffe0b2; border-radius: 4px; font-size: 14px; color: #e65100; }
                        .iframe-shadow-upload-btn { position: absolute; width: 200px; height: 40px; background: #9c27b0; color: white; display: flex; align-items: center; justify-content: center; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500; pointer-events: none; }
                    </style>
                    <div class="iframe-shadow-container">
                        <div class="iframe-shadow-text">${text}</div>
                        <input type="file" id="shadow-iframe-autoheal-input" name="shadow-iframe-autoheal-upload" multiple style="position: absolute; top: ${position.top}px; left: ${position.left}px; z-index: 1; width: 200px; height: 40px; opacity: 0;">
                        <div class="iframe-shadow-upload-btn" style="top: ${position.top}px; left: ${position.left}px;" onclick="document.getElementById('shadow-iframe-autoheal-input').click()">📁 Upload Files</div>
                    </div>
                \`;
                shadow.getElementById("shadow-iframe-autoheal-input").addEventListener("change", function(e) {
                    const files = Array.from(e.target.files);
                    if (files.length > 0) {
                        window.parent.postMessage({ type: 'update-upload-status', scenarioNumber: 18 }, '*');
                    }
                });
            </script>
        </body>
        </html>
    `, [position.top, position.left, text]);

    const copyLink = () => {
        const url = `${window.location.origin}${window.location.pathname}#scenario-3`;
        navigator.clipboard.writeText(url);
    };

    return (
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>Scenario 3: Shadow DOM in iframe</h2>
                <button
                    onClick={copyLink}
                    style={{
                        padding: '6px 12px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                    }}
                >
                    🔗 Copy Link
                </button>
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#666' }}>Text to Verify:</label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                />
            </div>
            <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Top:</label>
                    <input
                        type="number"
                        value={position.top}
                        onChange={(e) => onPositionChange(parseInt(e.target.value), position.left)}
                        style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Left:</label>
                    <input
                        type="number"
                        value={position.left}
                        onChange={(e) => onPositionChange(position.top, parseInt(e.target.value))}
                        style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                    />
                </div>
            </div>
            <iframe
                ref={iframeRef}
                key={`shadow-iframe-${position.top}-${position.left}-${text}`}
                srcDoc={iframeContent}
                style={{ width: '100%', height: '290px', border: '2px solid #9c27b0', borderRadius: '8px' }}
            />
        </div>
    );
}

// Scenario 4: iframe in Shadow DOM
function IframeInShadowScenario({ position, onPositionChange, onFileUpload }) {
    const containerRef = useRef(null);
    const shadowRootRef = useRef(null);
    const [text, setText] = useState('Autoheal Test Text - Iframe in Shadow');

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.type === 'update-upload-status' && event.data.scenarioNumber === 19) {
                onFileUpload([{ name: 'uploaded-file' }]);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onFileUpload]);

    const updateShadowContent = useCallback(() => {
        if (!shadowRootRef.current) return;

        const iframeContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { margin: 0; padding: 20px; font-family: Arial; background: #e8f5e9; }
                </style>
            </head>
            <body>
                <div style="margin-bottom: 10px; padding: 10px; background: #c8e6c9; border-radius: 4px; font-size: 14px; color: #2e7d32;">
                    ${text}
                </div>
                <input type="file" id="iframe-shadow-autoheal-input" name="iframe-shadow-autoheal-upload" multiple style="position: absolute; top: ${position.top}px; left: ${position.left}px; z-index: 1; width: 200px; height: 40px; opacity: 0;">
                <div style="position: absolute; top: ${position.top}px; left: ${position.left}px; width: 200px; height: 40px; background: #4caf50; color: white; display: flex; align-items: center; justify-content: center; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500; pointer-events: none;" onclick="document.getElementById('iframe-shadow-autoheal-input').click()">📁 Upload Files</div>
                <script>
                    document.getElementById("iframe-shadow-autoheal-input").addEventListener("change", function(e) {
                        const files = Array.from(e.target.files);
                        if (files.length > 0) {
                            window.parent.postMessage({ type: 'update-upload-status', scenarioNumber: 19 }, '*');
                        }
                    });
                </script>
            </body>
            </html>
        `;

        shadowRootRef.current.innerHTML = `
            <style>
                .shadow-iframe-wrapper { position: relative; border: 2px solid #4caf50; border-radius: 8px; overflow: hidden; }
            </style>
            <div class="shadow-iframe-wrapper">
                <iframe src="data:text/html;charset=utf-8,${encodeURIComponent(iframeContent)}" style="width: 100%; height: 290px; border: none;"></iframe>
            </div>
        `;
    }, [position.top, position.left, text]);

    useEffect(() => {
        if (!containerRef.current) return;

        let shadow = containerRef.current.shadowRoot;
        if (!shadow) {
            shadow = containerRef.current.attachShadow({ mode: 'open' });
        }
        shadowRootRef.current = shadow;

        updateShadowContent();
    }, [updateShadowContent]);

    const copyLink = () => {
        const url = `${window.location.origin}${window.location.pathname}#scenario-4`;
        navigator.clipboard.writeText(url);
    };

    return (
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>Scenario 4: iframe in Shadow DOM</h2>
                <button
                    onClick={copyLink}
                    style={{
                        padding: '6px 12px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                    }}
                >
                    🔗 Copy Link
                </button>
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#666' }}>Text to Verify:</label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                />
            </div>
            <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Top:</label>
                    <input
                        type="number"
                        value={position.top}
                        onChange={(e) => onPositionChange(parseInt(e.target.value), position.left)}
                        style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Left:</label>
                    <input
                        type="number"
                        value={position.left}
                        onChange={(e) => onPositionChange(position.top, parseInt(e.target.value))}
                        style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                    />
                </div>
            </div>
            <div
                ref={containerRef}
                style={{
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}
            ></div>
        </div>
    );
}

export function AutohealTestPage() {
    return (
        <UploadStatusProvider>
            <AutohealTestPageContent />
        </UploadStatusProvider>
    );
}

