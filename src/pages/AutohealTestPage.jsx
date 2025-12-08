import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadStatusProvider, useUploadStatus } from '../contexts/UploadStatusContext';
import { getFullXPath } from '../utils/fileUtils';

// Generate position-based locator for the file input element (not the button)
function getPositionBasedLocator(inputElement, buttonPosition, context = document, shadowHostSelector = null) {
    if (!inputElement || inputElement.type !== 'file') return '';
    
    // Ensure we have the file input element, not the button
    const input = inputElement.tagName === 'INPUT' && inputElement.type === 'file' 
        ? inputElement 
        : null;
    
    if (!input) return '';
    
    // Add position information
    const positionInfo = `[position: top=${buttonPosition.top}px, left=${buttonPosition.left}px]`;
    
    // For Shadow DOM, provide JavaScript-based locator
    if (context !== document || shadowHostSelector) {
        let jsLocator = '';
        if (shadowHostSelector) {
            // Shadow DOM: JavaScript code to access the element
            if (input.id) {
                jsLocator = `document.querySelector('${shadowHostSelector}').shadowRoot.querySelector('#${input.id}')`;
            } else if (input.name) {
                jsLocator = `document.querySelector('${shadowHostSelector}').shadowRoot.querySelector('input[name="${input.name}"]')`;
            } else {
                jsLocator = `document.querySelector('${shadowHostSelector}').shadowRoot.querySelector('input[type="file"]')`;
            }
        } else {
            // Iframe context
            if (input.id) {
                jsLocator = `iframe.contentDocument.querySelector('#${input.id}')`;
            } else if (input.name) {
                jsLocator = `iframe.contentDocument.querySelector('input[name="${input.name}"]')`;
            } else {
                jsLocator = `iframe.contentDocument.querySelector('input[type="file"]')`;
            }
        }
        return `JavaScript: ${jsLocator} ${positionInfo}`;
    }
    
    // For normal DOM, use XPath
    let locator = '';
    if (input.id) {
        locator = `//input[@type="file" and @id="${input.id}"]`;
    } else if (input.name) {
        locator = `//input[@type="file" and @name="${input.name}"]`;
    } else {
        // Generate full XPath for the input element
        locator = getFullXPath(input, context);
        // Ensure it specifies file input type
        if (!locator.includes('input[@type="file"]')) {
            locator = locator.replace(/\/input\[/, '/input[@type="file"][');
        }
    }
    
    return `XPath: ${locator} ${positionInfo}`;
}

function AutohealTestPageContent() {
    const navigate = useNavigate();
    const { updateStatus } = useUploadStatus();
    // Initialize with random button positions (text position is fixed)
    const getRandomPosition = () => ({
        top: Math.floor(Math.random() * 180) + 20,
        left: Math.floor(Math.random() * 280) + 20
    });

    // Fixed text positions
    const fixedTextPosition = { top: 20, left: 20 };

    const [positions, setPositions] = useState(() => ({
        normal: { button: getRandomPosition(), text: fixedTextPosition },
        shadow: { button: getRandomPosition(), text: fixedTextPosition },
        shadowInIframe: { button: getRandomPosition(), text: fixedTextPosition },
        iframeInShadow: { button: getRandomPosition(), text: fixedTextPosition }
    }));

    const updatePosition = useCallback((scenario, type, top, left) => {
        setPositions(prev => ({
            ...prev,
            [scenario]: {
                ...prev[scenario],
                [type]: { top, left }
            }
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
                            onButtonPositionChange={(top, left) => updatePosition('normal', 'button', top, left)}
                            onTextPositionChange={(top, left) => updatePosition('normal', 'text', top, left)}
                            onFileUpload={(files) => updateStatus(16, files)}
                        />
                    </div>

                    {/* Scenario 2: Shadow DOM */}
                    <div id="scenario-2">
                        <ShadowDOMScenario
                            position={positions.shadow}
                            onButtonPositionChange={(top, left) => updatePosition('shadow', 'button', top, left)}
                            onTextPositionChange={(top, left) => updatePosition('shadow', 'text', top, left)}
                            onFileUpload={(files) => updateStatus(17, files)}
                        />
                    </div>

                    {/* Scenario 3: Shadow DOM in iframe */}
                    <div id="scenario-3">
                        <ShadowInIframeScenario
                            position={positions.shadowInIframe}
                            onButtonPositionChange={(top, left) => updatePosition('shadowInIframe', 'button', top, left)}
                            onTextPositionChange={(top, left) => updatePosition('shadowInIframe', 'text', top, left)}
                            onFileUpload={(files) => updateStatus(18, files)}
                        />
                    </div>

                    {/* Scenario 4: iframe in Shadow DOM */}
                    <div id="scenario-4">
                        <IframeInShadowScenario
                            position={positions.iframeInShadow}
                            onButtonPositionChange={(top, left) => updatePosition('iframeInShadow', 'button', top, left)}
                            onTextPositionChange={(top, left) => updatePosition('iframeInShadow', 'text', top, left)}
                            onFileUpload={(files) => updateStatus(19, files)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Scenario 1: Normal
function NormalScenario({ position, onButtonPositionChange, onTextPositionChange, onFileUpload }) {
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const { statuses } = useUploadStatus();
    const [text, setText] = useState('Autoheal Test Text - Normal');
    const uploadedFiles = statuses[16]?.files || [];

    // Ensure input position updates when button position changes
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.top = `${position.button.top}px`;
            inputRef.current.style.left = `${position.button.left}px`;
        }
    }, [position.button.top, position.button.left]);

    const handleFileChange = useCallback((e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            // Get the file input element (not the button)
            const input = inputRef.current || e.target;
            // Read position directly from DOM element's style (most current)
            const computedStyle = window.getComputedStyle(input);
            const currentTop = parseInt(input.style.top) || parseInt(computedStyle.top) || position.button.top;
            const currentLeft = parseInt(input.style.left) || parseInt(computedStyle.left) || position.button.left;
            const currentPosition = { top: currentTop, left: currentLeft };
            const locator = getPositionBasedLocator(input, currentPosition);
            const filesWithLocator = files.map(file => ({
                ...file,
                locator: locator
            }));
            onFileUpload(filesWithLocator);
        }
    }, [position.button, onFileUpload]);

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
            {uploadedFiles.length > 0 && (
                <div style={{ marginBottom: '15px', padding: '10px', background: '#d4edda', borderRadius: '6px', border: '1px solid #c3e6cb' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#155724', marginBottom: '6px' }}>Uploaded Files:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {uploadedFiles.map((file, idx) => (
                            <div key={idx} style={{ fontSize: '11px', color: '#155724', padding: '4px 8px', background: 'white', borderRadius: '4px' }}>
                                <div style={{ marginBottom: '4px' }}>
                                    📄 {file.name || `File ${idx + 1}`}
                                    {file.size && (
                                        <span style={{ color: '#666', marginLeft: '6px', fontSize: '10px' }}>
                                            ({(file.size / 1024).toFixed(2)} KB)
                                        </span>
                                    )}
                                </div>
                                {file.locator && (
                                    <div style={{ fontSize: '10px', color: '#0066cc', marginTop: '4px', padding: '4px', background: '#e7f3ff', borderRadius: '3px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                        🔍 Locator: {file.locator}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#666' }}>Text to Verify:</label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>Button Position:</div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Top:</label>
                        <input
                            type="number"
                            value={position.button.top}
                            onChange={(e) => onButtonPositionChange(parseInt(e.target.value), position.button.left)}
                            style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Left:</label>
                        <input
                            type="number"
                            value={position.button.left}
                            onChange={(e) => onButtonPositionChange(position.button.top, parseInt(e.target.value))}
                            style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                        />
                    </div>
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
                <div style={{ 
                    position: 'absolute',
                    top: `${position.text.top}px`,
                    left: `${position.text.left}px`,
                    padding: '10px',
                    background: '#e3f2fd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: '#1976d2',
                    zIndex: 2
                }}>
                    {text}
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    id="normal-autoheal-input"
                    name="normal-autoheal-upload"
                    multiple
                    onChange={handleFileChange}
                    style={{
                        position: 'absolute',
                        top: `${position.button.top}px`,
                        left: `${position.button.left}px`,
                        zIndex: 1,
                        width: '200px',
                        height: '40px'
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: `${position.button.top}px`,
                        left: `${position.button.left}px`,
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
                    User 1 Input
                </div>
            </div>
        </div>
    );
}

// Scenario 2: Shadow DOM
function ShadowDOMScenario({ position, onButtonPositionChange, onTextPositionChange, onFileUpload }) {
    const containerRef = useRef(null);
    const shadowRootRef = useRef(null);
    const { statuses } = useUploadStatus();
    const [text, setText] = useState('Autoheal Test Text - Shadow DOM');
    const uploadedFiles = statuses[17]?.files || [];

    const updateShadowContent = useCallback(() => {
        if (!shadowRootRef.current) return;

        shadowRootRef.current.innerHTML = `
            <style>
                .shadow-container { position: relative; padding: 15px; background: #fff3e0; border-radius: 8px; height: 250px; }
                .shadow-text { position: absolute; padding: 10px; background: #ffe0b2; border-radius: 4px; font-size: 14px; color: #e65100; z-index: 2; }
                .shadow-upload-btn { position: absolute; width: 200px; height: 40px; background: #ff9800; color: white; display: flex; align-items: center; justify-content: center; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500; pointer-events: none; }
            </style>
            <div class="shadow-container">
                <div class="shadow-text" style="top: ${position.text.top}px; left: ${position.text.left}px;">${text}</div>
                <input type="file" id="shadow-autoheal-input" name="shadow-autoheal-upload" multiple style="position: absolute; top: ${position.button.top}px; left: ${position.button.left}px; z-index: 1; width: 200px; height: 40px; opacity: 0;">
                <div class="shadow-upload-btn" style="top: ${position.button.top}px; left: ${position.button.left}px;" onclick="document.getElementById('shadow-autoheal-input').click()">User 2 Input</div>
            </div>
        `;

        const input = shadowRootRef.current.getElementById('shadow-autoheal-input');
        if (input) {
            input.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                if (files.length > 0) {
                    // Get shadow host selector
                    const shadowHost = containerRef.current;
                    const hostId = shadowHost && shadowHost.id ? shadowHost.id : 'shadow-host-scenario-2';
                    const shadowHostSelector = '#' + hostId;
                    // Get current position from input style (reflects current state)
                    // Read directly from the input's inline style which is set by the template
                    const styleTop = input.style.top;
                    const styleLeft = input.style.left;
                    const currentTop = styleTop ? parseInt(styleTop) : position.button.top;
                    const currentLeft = styleLeft ? parseInt(styleLeft) : position.button.left;
                    const currentPosition = { top: currentTop, left: currentLeft };
                    const locator = getPositionBasedLocator(input, currentPosition, shadowRootRef.current, shadowHostSelector);
                    const filesWithLocator = files.map(file => ({
                        ...file,
                        locator: locator
                    }));
                    onFileUpload(filesWithLocator);
                }
            });
        }
    }, [position.button.top, position.button.left, position.text.top, position.text.left, text, onFileUpload]);

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
            {uploadedFiles.length > 0 && (
                <div style={{ marginBottom: '15px', padding: '10px', background: '#d4edda', borderRadius: '6px', border: '1px solid #c3e6cb' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#155724', marginBottom: '6px' }}>Uploaded Files:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {uploadedFiles.map((file, idx) => (
                            <div key={idx} style={{ fontSize: '11px', color: '#155724', padding: '4px 8px', background: 'white', borderRadius: '4px' }}>
                                <div style={{ marginBottom: '4px' }}>
                                    📄 {file.name || `File ${idx + 1}`}
                                    {file.size && (
                                        <span style={{ color: '#666', marginLeft: '6px', fontSize: '10px' }}>
                                            ({(file.size / 1024).toFixed(2)} KB)
                                        </span>
                                    )}
                                </div>
                                {file.locator && (
                                    <div style={{ fontSize: '10px', color: '#0066cc', marginTop: '4px', padding: '4px', background: '#e7f3ff', borderRadius: '3px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                        🔍 Locator: {file.locator}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#666' }}>Text to Verify:</label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>Button Position:</div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Top:</label>
                        <input
                            type="number"
                            value={position.button.top}
                            onChange={(e) => onButtonPositionChange(parseInt(e.target.value), position.button.left)}
                            style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Left:</label>
                        <input
                            type="number"
                            value={position.button.left}
                            onChange={(e) => onButtonPositionChange(position.button.top, parseInt(e.target.value))}
                            style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                        />
                    </div>
                </div>
            </div>
            <div
                ref={containerRef}
                id="shadow-host-scenario-2"
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
function ShadowInIframeScenario({ position, onButtonPositionChange, onTextPositionChange, onFileUpload }) {
    const iframeRef = useRef(null);
    const { statuses } = useUploadStatus();
    const [text, setText] = useState('Autoheal Test Text - Shadow in Iframe');
    const uploadedFiles = statuses[18]?.files || [];

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.type === 'update-upload-status' && event.data.scenarioNumber === 18) {
                if (event.data.files) {
                    onFileUpload(event.data.files);
                } else {
                    onFileUpload([{ name: 'uploaded-file' }]);
                }
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
                        .iframe-shadow-text { position: absolute; padding: 10px; background: #ffe0b2; border-radius: 4px; font-size: 14px; color: #e65100; z-index: 2; }
                        .iframe-shadow-upload-btn { position: absolute; width: 200px; height: 40px; background: #9c27b0; color: white; display: flex; align-items: center; justify-content: center; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500; pointer-events: none; }
                    </style>
                    <div class="iframe-shadow-container">
                        <div class="iframe-shadow-text" style="top: ${position.text.top}px; left: ${position.text.left}px;">${text}</div>
                        <input type="file" id="shadow-iframe-autoheal-input" name="shadow-iframe-autoheal-upload" multiple style="position: absolute; top: ${position.button.top}px; left: ${position.button.left}px; z-index: 1; width: 200px; height: 40px; opacity: 0;">
                        <div class="iframe-shadow-upload-btn" style="top: ${position.button.top}px; left: ${position.button.left}px;" onclick="document.getElementById('shadow-iframe-autoheal-input').click()">User 3 Input</div>
                    </div>
                \`;
                const input = shadow.getElementById("shadow-iframe-autoheal-input");
                if (input) {
                    input.addEventListener("change", function(e) {
                        const files = Array.from(e.target.files);
                        if (files.length > 0) {
                            // Get XPath from shadow DOM context with position
                            let xpath = '';
                            if (input.id) {
                                xpath = '//*[@id="shadow-iframe-autoheal-input"]';
                            } else if (input.name) {
                                xpath = '//input[@name="shadow-iframe-autoheal-upload"]';
                            } else {
                                xpath = '//input[@type="file"]';
                            }
                            // Read position directly from input element's style
                            const buttonTop = parseInt(input.style.top) || ${position.button.top};
                            const buttonLeft = parseInt(input.style.left) || ${position.button.left};
                            xpath = 'JavaScript: document.getElementById("iframe-scenario-3").contentDocument.getElementById("shadow-host-iframe-scenario-3").shadowRoot.querySelector("input[id=\\"shadow-iframe-autoheal-input\\"]") [position: top=' + buttonTop + 'px, left=' + buttonLeft + 'px]';
                            
                            const filesWithLocator = files.map(function(file) {
                                return {
                                    name: file.name,
                                    size: file.size,
                                    locator: xpath
                                };
                            });
                            
                            window.parent.postMessage({ 
                                type: 'update-upload-status', 
                                scenarioNumber: 18,
                                files: filesWithLocator
                            }, '*');
                        }
                    });
                }
            </script>
        </body>
        </html>
    `, [position.button.top, position.button.left, position.text.top, position.text.left, text]);

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
            {uploadedFiles.length > 0 && (
                <div style={{ marginBottom: '15px', padding: '10px', background: '#d4edda', borderRadius: '6px', border: '1px solid #c3e6cb' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#155724', marginBottom: '6px' }}>Uploaded Files:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {uploadedFiles.map((file, idx) => (
                            <div key={idx} style={{ fontSize: '11px', color: '#155724', padding: '4px 8px', background: 'white', borderRadius: '4px' }}>
                                <div style={{ marginBottom: '4px' }}>
                                    📄 {file.name || `File ${idx + 1}`}
                                    {file.size && (
                                        <span style={{ color: '#666', marginLeft: '6px', fontSize: '10px' }}>
                                            ({(file.size / 1024).toFixed(2)} KB)
                                        </span>
                                    )}
                                </div>
                                {file.locator && (
                                    <div style={{ fontSize: '10px', color: '#0066cc', marginTop: '4px', padding: '4px', background: '#e7f3ff', borderRadius: '3px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                        🔍 Locator: {file.locator}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#666' }}>Text to Verify:</label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>Button Position:</div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Top:</label>
                        <input
                            type="number"
                            value={position.button.top}
                            onChange={(e) => onButtonPositionChange(parseInt(e.target.value), position.button.left)}
                            style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Left:</label>
                        <input
                            type="number"
                            value={position.button.left}
                            onChange={(e) => onButtonPositionChange(position.button.top, parseInt(e.target.value))}
                            style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                        />
                    </div>
                </div>
            </div>
            <iframe
                ref={iframeRef}
                key={`shadow-iframe-${position.button.top}-${position.button.left}-${position.text.top}-${position.text.left}-${text}`}
                srcDoc={iframeContent}
                style={{ width: '100%', height: '290px', border: '2px solid #9c27b0', borderRadius: '8px' }}
            />
            {uploadedFiles.length > 0 && (
                <div style={{ marginTop: '15px', padding: '12px', background: '#d4edda', borderRadius: '6px', border: '1px solid #c3e6cb' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#155724', marginBottom: '8px' }}>Uploaded Files:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {uploadedFiles.map((file, idx) => (
                            <div key={idx} style={{ fontSize: '12px', color: '#155724', padding: '6px', background: 'white', borderRadius: '4px' }}>
                                📄 {file.name || `File ${idx + 1}`}
                                {file.size && (
                                    <span style={{ color: '#666', marginLeft: '8px', fontSize: '11px' }}>
                                        ({(file.size / 1024).toFixed(2)} KB)
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Scenario 4: iframe in Shadow DOM
function IframeInShadowScenario({ position, onButtonPositionChange, onTextPositionChange, onFileUpload }) {
    const containerRef = useRef(null);
    const shadowRootRef = useRef(null);
    const { statuses } = useUploadStatus();
    const [text, setText] = useState('Autoheal Test Text - Iframe in Shadow');
    const uploadedFiles = statuses[19]?.files || [];

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.type === 'update-upload-status' && event.data.scenarioNumber === 19) {
                if (event.data.files) {
                    onFileUpload(event.data.files);
                } else {
                    onFileUpload([{ name: 'uploaded-file' }]);
                }
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
                <div style="position: absolute; top: ${position.text.top}px; left: ${position.text.left}px; padding: 10px; background: #c8e6c9; border-radius: 4px; font-size: 14px; color: #2e7d32; z-index: 2;">
                    ${text}
                </div>
                <input type="file" id="iframe-shadow-autoheal-input" name="iframe-shadow-autoheal-upload" multiple style="position: absolute; top: ${position.button.top}px; left: ${position.button.left}px; z-index: 1; width: 200px; height: 40px; opacity: 0;">
                <div style="position: absolute; top: ${position.button.top}px; left: ${position.button.left}px; width: 200px; height: 40px; background: #4caf50; color: white; display: flex; align-items: center; justify-content: center; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500; pointer-events: none;" onclick="document.getElementById('iframe-shadow-autoheal-input').click()">User 4 Input</div>
                <script>
                    const input = document.getElementById("iframe-shadow-autoheal-input");
                    if (input) {
                        input.addEventListener("change", function(e) {
                            const files = Array.from(e.target.files);
                            if (files.length > 0) {
                                // Get XPath from iframe context with position
                                let xpath = '';
                                if (input.id) {
                                    xpath = '//*[@id="iframe-shadow-autoheal-input"]';
                                } else if (input.name) {
                                    xpath = '//input[@name="iframe-shadow-autoheal-upload"]';
                                } else {
                                    xpath = '//input[@type="file"]';
                                }
                                // Read position directly from input element's style
                                const buttonTop = parseInt(input.style.top) || ${position.button.top};
                                const buttonLeft = parseInt(input.style.left) || ${position.button.left};
                                xpath = 'JavaScript: window.parent.document.getElementById("shadow-host-scenario-4").shadowRoot.querySelector("iframe").contentDocument.querySelector("input[id=\\"iframe-shadow-autoheal-input\\"]") [position: top=' + buttonTop + 'px, left=' + buttonLeft + 'px]';
                                
                                const filesWithLocator = files.map(function(file) {
                                    return {
                                        name: file.name,
                                        size: file.size,
                                        locator: xpath
                                    };
                                });
                                
                                window.parent.postMessage({ 
                                    type: 'update-upload-status', 
                                    scenarioNumber: 19,
                                    files: filesWithLocator
                                }, '*');
                            }
                        });
                    }
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
    }, [position.button.top, position.button.left, position.text.top, position.text.left, text]);

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
            {uploadedFiles.length > 0 && (
                <div style={{ marginBottom: '15px', padding: '10px', background: '#d4edda', borderRadius: '6px', border: '1px solid #c3e6cb' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#155724', marginBottom: '6px' }}>Uploaded Files:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {uploadedFiles.map((file, idx) => (
                            <div key={idx} style={{ fontSize: '11px', color: '#155724', padding: '4px 8px', background: 'white', borderRadius: '4px' }}>
                                <div style={{ marginBottom: '4px' }}>
                                    📄 {file.name || `File ${idx + 1}`}
                                    {file.size && (
                                        <span style={{ color: '#666', marginLeft: '6px', fontSize: '10px' }}>
                                            ({(file.size / 1024).toFixed(2)} KB)
                                        </span>
                                    )}
                                </div>
                                {file.locator && (
                                    <div style={{ fontSize: '10px', color: '#0066cc', marginTop: '4px', padding: '4px', background: '#e7f3ff', borderRadius: '3px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                        🔍 Locator: {file.locator}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#666' }}>Text to Verify:</label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>Button Position:</div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Top:</label>
                        <input
                            type="number"
                            value={position.button.top}
                            onChange={(e) => onButtonPositionChange(parseInt(e.target.value), position.button.left)}
                            style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Left:</label>
                        <input
                            type="number"
                            value={position.button.left}
                            onChange={(e) => onButtonPositionChange(position.button.top, parseInt(e.target.value))}
                            style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                        />
                    </div>
                </div>
            </div>
            <div
                ref={containerRef}
                style={{
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}
            ></div>
            {uploadedFiles.length > 0 && (
                <div style={{ marginTop: '15px', padding: '12px', background: '#d4edda', borderRadius: '6px', border: '1px solid #c3e6cb' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#155724', marginBottom: '8px' }}>Uploaded Files:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {uploadedFiles.map((file, idx) => (
                            <div key={idx} style={{ fontSize: '12px', color: '#155724', padding: '6px', background: 'white', borderRadius: '4px' }}>
                                📄 {file.name || `File ${idx + 1}`}
                                {file.size && (
                                    <span style={{ color: '#666', marginLeft: '8px', fontSize: '11px' }}>
                                        ({(file.size / 1024).toFixed(2)} KB)
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
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

