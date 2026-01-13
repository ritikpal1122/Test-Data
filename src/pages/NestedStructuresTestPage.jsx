import React, { useState, useEffect, useRef } from 'react';

export const NestedStructuresTestPage = () => {
    const [clickCount, setClickCount] = useState({});
    const [inputValues, setInputValues] = useState({});
    const [lastClicked, setLastClicked] = useState('No button clicked yet');

    // Refs for nested structures
    const nestedIframe1Ref = useRef(null);
    const nestedIframe2Ref = useRef(null);
    const nestedShadowHost1Ref = useRef(null);
    const nestedShadowHost2Ref = useRef(null);
    const iframeInShadowRef = useRef(null);
    const shadowInIframeRef = useRef(null);
    const shadowInIframeHostRef = useRef(null);

    // Generate dynamic IDs
    const generateId = (prefix) => {
        return `${prefix}-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString(36)}`;
    };

    // Listen for messages from iframes and shadow DOM
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.type === 'button-clicked') {
                setLastClicked(event.data.buttonName);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Initialize nested iframes
    useEffect(() => {
        // Nested Iframes - Outer iframe
        if (nestedIframe1Ref.current) {
            const outerIframe = nestedIframe1Ref.current;
            const innerContent = `<!DOCTYPE html><html><head><style>body { margin: 0; padding: 20px; font-family: Arial; background: #e0e0e0; } h4 { color: #555; } .container { display: flex; flex-wrap: wrap; gap: 10px; } button { padding: 8px 16px; margin: 5px; background: #10b981; color: white; border: none; border-radius: 5px; cursor: pointer; } input { padding: 8px; margin: 5px; border: 2px solid #10b981; border-radius: 5px; width: 180px; }</style></head><body><h4>Inner Iframe - Nested Iframes Test</h4><div class="container"><button id="inner-btn-1" onclick="window.parent.parent.postMessage({type: 'button-clicked', buttonName: 'Inner Button 1 (Nested Iframes)'}, '*')">Inner Button 1</button><button id="inner-btn-2" onclick="window.parent.parent.postMessage({type: 'button-clicked', buttonName: 'Inner Button 2 (Nested Iframes)'}, '*')">Inner Button 2</button><input id="inner-input-1" type="text" placeholder="Inner Input 1" /><input id="inner-input-2" type="text" placeholder="Inner Input 2" /></div></body></html>`;
            
            const outerContent = `<!DOCTYPE html><html><head><style>body { margin: 0; padding: 20px; font-family: Arial; background: #f0f0f0; } h3 { color: #333; } .container { background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; display: flex; flex-wrap: wrap; gap: 10px; } button { padding: 10px 20px; margin: 5px; background: #3182ce; color: white; border: none; border-radius: 5px; cursor: pointer; } input { padding: 8px; margin: 5px; border: 2px solid #3182ce; border-radius: 5px; width: 200px; } iframe { width: 100%; height: 300px; border: 2px solid #3182ce; border-radius: 5px; margin-top: 10px; }</style></head><body><h3>Outer Iframe - Nested Iframes Test</h3><div class="container"><button id="outer-btn-1" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Outer Button 1 (Nested Iframes)'}, '*')">Outer Button 1</button><button id="outer-btn-2" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Outer Button 2 (Nested Iframes)'}, '*')">Outer Button 2</button><input id="outer-input-1" type="text" placeholder="Outer Input 1" /><input id="outer-input-2" type="text" placeholder="Outer Input 2" /></div><iframe id="inner-iframe" src="about:blank" onload="setTimeout(function(){const innerIframe = document.getElementById('inner-iframe');innerIframe.contentDocument.open();innerIframe.contentDocument.write(atob('${btoa(innerContent)}'));innerIframe.contentDocument.close();}, 50);"></iframe></body></html>`;
            
            outerIframe.contentDocument.open();
            outerIframe.contentDocument.write(outerContent);
            outerIframe.contentDocument.close();
        }
    }, []);

    // Initialize nested shadow DOM
    useEffect(() => {
        // Nested Shadow DOM - Outer shadow
        if (nestedShadowHost1Ref.current && !nestedShadowHost1Ref.current.shadowRoot) {
            const outerShadow = nestedShadowHost1Ref.current.attachShadow({ mode: 'open' });
            const innerShadowHTML = `<style>:host { display: block; } h4 { color: #555; margin-top: 0; } .container { display: flex; flex-wrap: wrap; gap: 10px; } button { padding: 8px 16px; margin: 5px; background: #ec4899; color: white; border: none; border-radius: 5px; cursor: pointer; } input { padding: 8px; margin: 5px; border: 2px solid #ec4899; border-radius: 5px; width: 180px; }</style><h4>Inner Shadow DOM - Nested Shadow DOM Test</h4><div class="container"><button id="inner-shadow-btn-1" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Inner Shadow Button 1 (Nested Shadow DOM)'}, '*')">Inner Shadow Button 1</button><button id="inner-shadow-btn-2" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Inner Shadow Button 2 (Nested Shadow DOM)'}, '*')">Inner Shadow Button 2</button><input id="inner-shadow-input-1" type="text" placeholder="Inner Shadow Input 1" /><input id="inner-shadow-input-2" type="text" placeholder="Inner Shadow Input 2" /></div>`;
            
            outerShadow.innerHTML = `<style>:host { display: block; padding: 20px; background: #f0f0f0; border-radius: 8px; } h3 { color: #333; margin-top: 0; } .container { background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; display: flex; flex-wrap: wrap; gap: 10px; } button { padding: 10px 20px; margin: 5px; background: #9c27b0; color: white; border: none; border-radius: 5px; cursor: pointer; } input { padding: 8px; margin: 5px; border: 2px solid #9c27b0; border-radius: 5px; width: 200px; } #inner-shadow-host { margin-top: 15px; padding: 15px; background: #e0e0e0; border-radius: 5px; }</style><h3>Outer Shadow DOM - Nested Shadow DOM Test</h3><div class="container"><button id="outer-shadow-btn-1" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Outer Shadow Button 1 (Nested Shadow DOM)'}, '*')">Outer Shadow Button 1</button><button id="outer-shadow-btn-2" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Outer Shadow Button 2 (Nested Shadow DOM)'}, '*')">Outer Shadow Button 2</button><input id="outer-shadow-input-1" type="text" placeholder="Outer Shadow Input 1" /><input id="outer-shadow-input-2" type="text" placeholder="Outer Shadow Input 2" /></div><div id="inner-shadow-host"></div><script>setTimeout(function(){const innerHost = document.getElementById('inner-shadow-host');const innerShadow = innerHost.attachShadow({ mode: 'open' });innerShadow.innerHTML = atob('${btoa(innerShadowHTML)}');}, 100);</script>`;
        }
    }, []);

    // Initialize iframe within shadow DOM
    useEffect(() => {
        if (iframeInShadowRef.current && !iframeInShadowRef.current.shadowRoot) {
            const shadow = iframeInShadowRef.current.attachShadow({ mode: 'open' });
            const iframeContent = `<!DOCTYPE html><html><head><style>body { margin: 0; padding: 20px; font-family: Arial; background: #fff3cd; } h4 { color: #856404; } .container { display: flex; flex-wrap: wrap; gap: 10px; } button { padding: 8px 16px; margin: 5px; background: #d97706; color: white; border: none; border-radius: 5px; cursor: pointer; } input { padding: 8px; margin: 5px; border: 2px solid #d97706; border-radius: 5px; width: 180px; }</style></head><body><h4>Iframe Inside Shadow DOM</h4><div class="container"><button id="iframe-btn-1" onclick="window.parent.parent.postMessage({type: 'button-clicked', buttonName: 'Iframe Button 1 (Iframe in Shadow DOM)'}, '*')">Iframe Button 1</button><button id="iframe-btn-2" onclick="window.parent.parent.postMessage({type: 'button-clicked', buttonName: 'Iframe Button 2 (Iframe in Shadow DOM)'}, '*')">Iframe Button 2</button><input id="iframe-input-1" type="text" placeholder="Iframe Input 1" /><input id="iframe-input-2" type="text" placeholder="Iframe Input 2" /></div></body></html>`;
            
            shadow.innerHTML = `<style>:host { display: block; padding: 20px; background: #f0f0f0; border-radius: 8px; } h3 { color: #333; margin-top: 0; } .container { background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; display: flex; flex-wrap: wrap; gap: 10px; } button { padding: 10px 20px; margin: 5px; background: #f59e0b; color: white; border: none; border-radius: 5px; cursor: pointer; } input { padding: 8px; margin: 5px; border: 2px solid #f59e0b; border-radius: 5px; width: 200px; } iframe { width: 100%; height: 300px; border: 2px solid #f59e0b; border-radius: 5px; margin-top: 10px; }</style><h3>Shadow DOM - Iframe Within Shadow DOM Test</h3><div class="container"><button id="shadow-btn-1" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Shadow Button 1 (Iframe in Shadow DOM)'}, '*')">Shadow Button 1</button><button id="shadow-btn-2" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Shadow Button 2 (Iframe in Shadow DOM)'}, '*')">Shadow Button 2</button><input id="shadow-input-1" type="text" placeholder="Shadow Input 1" /><input id="shadow-input-2" type="text" placeholder="Shadow Input 2" /></div><iframe id="iframe-in-shadow" src="about:blank" onload="setTimeout(function(){const iframe = document.getElementById('iframe-in-shadow');iframe.contentDocument.open();iframe.contentDocument.write(atob('${btoa(iframeContent)}'));iframe.contentDocument.close();}, 50);"></iframe>`;
        }
    }, []);

    // Initialize shadow DOM within iframe
    useEffect(() => {
        if (nestedIframe2Ref.current) {
            const iframe = nestedIframe2Ref.current;
            const shadowHTML = `<style>:host { display: block; } h4 { color: #991b1b; margin-top: 0; } .container { display: flex; flex-wrap: wrap; gap: 10px; } button { padding: 8px 16px; margin: 5px; background: #dc2626; color: white; border: none; border-radius: 5px; cursor: pointer; } input { padding: 8px; margin: 5px; border: 2px solid #dc2626; border-radius: 5px; width: 180px; }</style><h4>Shadow DOM Inside Iframe</h4><div class="container"><button id="shadow-btn-1" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Shadow Button 1 (Shadow DOM in Iframe)'}, '*')">Shadow Button 1</button><button id="shadow-btn-2" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Shadow Button 2 (Shadow DOM in Iframe)'}, '*')">Shadow Button 2</button><input id="shadow-input-1" type="text" placeholder="Shadow Input 1" /><input id="shadow-input-2" type="text" placeholder="Shadow Input 2" /></div>`;
            
            const iframeContent = `<!DOCTYPE html><html><head><style>body { margin: 0; padding: 20px; font-family: Arial; background: #f0f0f0; } h3 { color: #333; } .container { background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; display: flex; flex-wrap: wrap; gap: 10px; } button { padding: 10px 20px; margin: 5px; background: #ef4444; color: white; border: none; border-radius: 5px; cursor: pointer; } input { padding: 8px; margin: 5px; border: 2px solid #ef4444; border-radius: 5px; width: 200px; } #shadow-host { margin-top: 15px; padding: 15px; background: #fee2e2; border-radius: 5px; }</style></head><body><h3>Iframe - Shadow DOM Within Iframe Test</h3><div class="container"><button id="iframe-btn-1" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Iframe Button 1 (Shadow DOM in Iframe)'}, '*')">Iframe Button 1</button><button id="iframe-btn-2" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Iframe Button 2 (Shadow DOM in Iframe)'}, '*')">Iframe Button 2</button><input id="iframe-input-1" type="text" placeholder="Iframe Input 1" /><input id="iframe-input-2" type="text" placeholder="Iframe Input 2" /></div><div id="shadow-host"></div><script>setTimeout(function(){const shadowHost = document.getElementById('shadow-host');const shadow = shadowHost.attachShadow({ mode: 'open' });shadow.innerHTML = atob('${btoa(shadowHTML)}');}, 100);</script></body></html>`;
            
            iframe.contentDocument.open();
            iframe.contentDocument.write(iframeContent);
            iframe.contentDocument.close();
        }
    }, []);

    const handleButtonClick = (id) => {
        setClickCount(prev => ({
            ...prev,
            [id]: (prev[id] || 0) + 1
        }));
    };

    const handleInputChange = (id, value) => {
        setInputValues(prev => ({
            ...prev,
            [id]: value
        }));
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px 20px'
        }}>
            {/* Top Navbar */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '15px 20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                zIndex: 1000,
                borderBottom: '3px solid #667eea'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    <span style={{
                        fontWeight: 'bold',
                        color: '#667eea',
                        fontSize: '1.1em'
                    }}>
                        Last Clicked:
                    </span>
                    <span style={{
                        color: '#333',
                        fontSize: '1em',
                        padding: '8px 15px',
                        background: '#f0f0f0',
                        borderRadius: '6px',
                        flex: 1
                    }}>
                        {lastClicked}
                    </span>
                </div>
            </div>

            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                marginTop: '80px'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    color: 'white',
                    marginBottom: '30px',
                    fontSize: '2.5em',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}>
                    🏗️ Nested Structures Test Page
                </h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
                    gap: '30px',
                    marginBottom: '30px'
                }}>
                    {/* Nested Iframes */}
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                        <h2 style={{ color: '#3182ce', marginTop: 0 }}>1. Nested Iframes</h2>
                        <iframe
                            ref={nestedIframe1Ref}
                            style={{
                                width: '100%',
                                height: '400px',
                                border: '2px solid #3182ce',
                                borderRadius: '8px'
                            }}
                            title="Nested Iframes"
                        />
                    </div>

                    {/* Nested Shadow DOM */}
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                        <h2 style={{ color: '#9c27b0', marginTop: 0 }}>2. Nested Shadow DOM</h2>
                        <div
                            ref={nestedShadowHost1Ref}
                            style={{
                                minHeight: '400px',
                                border: '2px solid #9c27b0',
                                borderRadius: '8px'
                            }}
                        />
                    </div>

                    {/* Iframe within Shadow DOM */}
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                        <h2 style={{ color: '#f59e0b', marginTop: 0 }}>3. Iframe Within Shadow DOM</h2>
                        <div
                            ref={iframeInShadowRef}
                            style={{
                                minHeight: '400px',
                                border: '2px solid #f59e0b',
                                borderRadius: '8px'
                            }}
                        />
                    </div>

                    {/* Shadow DOM within Iframe */}
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                        <h2 style={{ color: '#ef4444', marginTop: 0 }}>4. Shadow DOM Within Iframe</h2>
                        <iframe
                            ref={nestedIframe2Ref}
                            style={{
                                width: '100%',
                                height: '400px',
                                border: '2px solid #ef4444',
                                borderRadius: '8px'
                            }}
                            title="Shadow DOM in Iframe"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

