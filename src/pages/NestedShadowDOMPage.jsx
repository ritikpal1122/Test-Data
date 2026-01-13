import React, { useRef, useEffect, useState } from 'react';

const NestedShadowDOMPage = () => {
    const outerShadowHostRef = useRef(null);
    const iframeInShadowHostRef = useRef(null);
    const [lastClicked, setLastClicked] = useState('None');

    // Listen for messages from shadow DOM
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.type === 'button-clicked') {
                setLastClicked(event.data.buttonName);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Initialize nested shadow DOM
    useEffect(() => {
        if (outerShadowHostRef.current && !outerShadowHostRef.current.shadowRoot) {
            const outerShadow = outerShadowHostRef.current.attachShadow({ mode: 'open' });
            
            // Inner shadow DOM HTML with buttons and inputs
            const innerShadowHTML = `
                <style>
                    :host {
                        display: block;
                        position: relative;
                        padding: 20px;
                        background: #e8f5e9;
                        border-radius: 8px;
                        min-height: 300px;
                    }
                    h4 {
                        color: #2e7d32;
                        margin-top: 0;
                        margin-bottom: 15px;
                    }
                    .controls-container {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 15px;
                        margin-bottom: 15px;
                    }
                    button {
                        padding: 10px 20px;
                        background: #4caf50;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                        min-width: 150px;
                    }
                    button:hover {
                        background: #45a049;
                    }
                    input {
                        padding: 10px;
                        border: 2px solid #4caf50;
                        border-radius: 5px;
                        min-width: 200px;
                    }
                    input:focus {
                        outline: none;
                        border-color: #2e7d32;
                    }
                </style>
                <h4>Inner Shadow DOM - Buttons and Inputs</h4>
                <div class="controls-container">
                    <button id="inner-btn-1" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Inner Shadow Button 1'}, '*')">
                        Inner Button 1
                    </button>
                    <button id="inner-btn-2" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Inner Shadow Button 2'}, '*')">
                        Inner Button 2
                    </button>
                    <button id="inner-btn-3" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Inner Shadow Button 3'}, '*')">
                        Inner Button 3
                    </button>
                    <input id="inner-input-1" type="text" placeholder="Inner Input 1" />
                    <input id="inner-input-2" type="text" placeholder="Inner Input 2" />
                    <input id="inner-input-3" type="text" placeholder="Inner Input 3" />
                </div>
            `;

            // Outer shadow DOM HTML
            outerShadow.innerHTML = `
                <style>
                    :host {
                        display: block;
                        padding: 20px;
                        background: #f3e5f5;
                        border-radius: 8px;
                        min-height: 500px;
                    }
                    h3 {
                        color: #7b1fa2;
                        margin-top: 0;
                        margin-bottom: 15px;
                    }
                    .controls-container {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 15px;
                        margin-bottom: 20px;
                    }
                    button {
                        padding: 10px 20px;
                        background: #9c27b0;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                        min-width: 150px;
                    }
                    button:hover {
                        background: #7b1fa2;
                    }
                    input {
                        padding: 10px;
                        border: 2px solid #9c27b0;
                        border-radius: 5px;
                        min-width: 200px;
                    }
                    input:focus {
                        outline: none;
                        border-color: #7b1fa2;
                    }
                    #inner-shadow-host {
                        margin-top: 20px;
                        padding: 15px;
                        background: #fce4ec;
                        border-radius: 5px;
                        min-height: 350px;
                    }
                </style>
                <h3>Outer Shadow DOM - Buttons and Inputs</h3>
                <div class="controls-container">
                    <button id="outer-btn-1" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Outer Shadow Button 1'}, '*')">
                        Outer Button 1
                    </button>
                    <button id="outer-btn-2" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Outer Shadow Button 2'}, '*')">
                        Outer Button 2
                    </button>
                    <button id="outer-btn-3" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Outer Shadow Button 3'}, '*')">
                        Outer Button 3
                    </button>
                    <input id="outer-input-1" type="text" placeholder="Outer Input 1" />
                    <input id="outer-input-2" type="text" placeholder="Outer Input 2" />
                    <input id="outer-input-3" type="text" placeholder="Outer Input 3" />
                </div>
                <div id="inner-shadow-host"></div>
            `;
            
            // Create inner shadow DOM directly from React
            setTimeout(() => {
                try {
                    const innerHost = outerShadow.getElementById('inner-shadow-host');
                    if (innerHost && !innerHost.shadowRoot) {
                        const innerShadow = innerHost.attachShadow({ mode: 'open' });
                        innerShadow.innerHTML = innerShadowHTML;
                        console.log('Inner shadow DOM created successfully with', innerShadow.querySelectorAll('button').length, 'buttons');
                    } else {
                        console.error('Inner host not found or already has shadow root');
                    }
                } catch (e) {
                    console.error('Error creating inner shadow DOM:', e);
                }
            }, 200);
        }
    }, []);

    // Initialize iframe within shadow DOM
    useEffect(() => {
        if (iframeInShadowHostRef.current && !iframeInShadowHostRef.current.shadowRoot) {
            const shadow = iframeInShadowHostRef.current.attachShadow({ mode: 'open' });
            
            // Iframe content with buttons and inputs
            const iframeContent = `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: #fff3cd;
        }
        h4 {
            color: #856404;
            margin-top: 0;
            margin-bottom: 15px;
        }
        .controls-container {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 15px;
        }
        button {
            padding: 10px 20px;
            background: #d97706;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            min-width: 150px;
        }
        button:hover {
            background: #b45309;
        }
        input {
            padding: 10px;
            border: 2px solid #d97706;
            border-radius: 5px;
            min-width: 200px;
        }
        input:focus {
            outline: none;
            border-color: #b45309;
        }
    </style>
</head>
<body>
    <h4>Iframe Inside Shadow DOM - Buttons and Inputs</h4>
    <div class="controls-container">
        <button id="iframe-btn-1" onclick="window.parent.parent.postMessage({type: 'button-clicked', buttonName: 'Iframe Button 1 (Iframe in Shadow DOM)'}, '*')">
            Iframe Button 1
        </button>
        <button id="iframe-btn-2" onclick="window.parent.parent.postMessage({type: 'button-clicked', buttonName: 'Iframe Button 2 (Iframe in Shadow DOM)'}, '*')">
            Iframe Button 2
        </button>
        <button id="iframe-btn-3" onclick="window.parent.parent.postMessage({type: 'button-clicked', buttonName: 'Iframe Button 3 (Iframe in Shadow DOM)'}, '*')">
            Iframe Button 3
        </button>
        <input id="iframe-input-1" type="text" placeholder="Iframe Input 1" />
        <input id="iframe-input-2" type="text" placeholder="Iframe Input 2" />
        <input id="iframe-input-3" type="text" placeholder="Iframe Input 3" />
    </div>
</body>
</html>`;

            shadow.innerHTML = `
                <style>
                    :host {
                        display: block;
                        padding: 20px;
                        background: #f0f0f0;
                        border-radius: 8px;
                        min-height: 400px;
                        margin-top: 30px;
                    }
                    h3 {
                        color: #333;
                        margin-top: 0;
                        margin-bottom: 15px;
                    }
                    button {
                        padding: 10px 20px;
                        background: #f59e0b;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                        min-width: 150px;
                    }
                    button:hover {
                        background: #d97706;
                    }
                    input {
                        padding: 10px;
                        border: 2px solid #f59e0b;
                        border-radius: 5px;
                        min-width: 200px;
                    }
                    input:focus {
                        outline: none;
                        border-color: #d97706;
                    }
                    .controls-container {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 15px;
                        margin-bottom: 20px;
                    }
                    iframe {
                        width: 100%;
                        height: 400px;
                        border: 2px solid #f59e0b;
                        border-radius: 5px;
                        margin-top: 10px;
                    }
                </style>
                <h3>Shadow DOM - Iframe Within Shadow DOM Test</h3>
                <div class="controls-container">
                    <button id="shadow-btn-1" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Shadow Button 1 (Iframe in Shadow DOM)'}, '*')">
                        Shadow Button 1
                    </button>
                    <button id="shadow-btn-2" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Shadow Button 2 (Iframe in Shadow DOM)'}, '*')">
                        Shadow Button 2
                    </button>
                    <button id="shadow-btn-3" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Shadow Button 3 (Iframe in Shadow DOM)'}, '*')">
                        Shadow Button 3
                    </button>
                    <input id="shadow-input-1" type="text" placeholder="Shadow Input 1" />
                    <input id="shadow-input-2" type="text" placeholder="Shadow Input 2" />
                    <input id="shadow-input-3" type="text" placeholder="Shadow Input 3" />
                </div>
                <iframe id="iframe-in-shadow" src="about:blank"></iframe>
            `;
            
            // Load iframe content directly from React
            setTimeout(() => {
                try {
                    const iframe = shadow.getElementById('iframe-in-shadow');
                    if (iframe) {
                        const loadIframeContent = () => {
                            try {
                                if (iframe.contentDocument) {
                                    iframe.contentDocument.open();
                                    iframe.contentDocument.write(iframeContent);
                                    iframe.contentDocument.close();
                                    console.log('Iframe content written successfully with', iframe.contentDocument.querySelectorAll('button').length, 'buttons');
                                }
                            } catch (e) {
                                console.error('Error writing iframe content:', e);
                            }
                        };
                        
                        if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                            loadIframeContent();
                        } else {
                            iframe.onload = loadIframeContent;
                        }
                    } else {
                        console.error('Iframe not found in shadow DOM');
                    }
                } catch (e) {
                    console.error('Error accessing iframe:', e);
                }
            }, 300);
        }
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                background: '#2196F3',
                color: 'white',
                padding: '15px 20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                zIndex: 1000,
                fontWeight: 'bold',
                fontSize: '16px'
            }}>
                Last Clicked: {lastClicked}
            </div>
            
            <div style={{ marginTop: '70px' }}>
                <h1 style={{ color: '#333', marginBottom: '20px' }}>
                    Nested Shadow DOM Test Page
                </h1>
                <p style={{ color: '#666', marginBottom: '30px' }}>
                    This page demonstrates nested Shadow DOM structures with buttons and inputs.
                    Click any button to see it displayed in the top navbar.
                </p>
                
                <div ref={outerShadowHostRef} style={{ marginTop: '20px' }}></div>
                
                <div ref={iframeInShadowHostRef} style={{ marginTop: '30px' }}></div>
            </div>
        </div>
    );
};

export default NestedShadowDOMPage;

