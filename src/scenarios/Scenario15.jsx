import React, { useEffect, useRef } from 'react';
import { ScenarioCard } from '../components/ScenarioCard';
import { useUploadStatus } from '../contexts/UploadStatusContext';
import { useXPath } from '../contexts/XPathContext';

export function Scenario15() {
    const iframeRef = useRef(null);
    const { updateStatus } = useUploadStatus();
    const { showXPath } = useXPath();
    
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.type === 'update-upload-status' && event.data.scenarioNumber === 15) {
                updateStatus(15, [{ name: 'uploaded-file' }]);
            }
        };
        
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [updateStatus]);
    
    const showInputLocation = () => {
        showXPath('//iframe[@id="ultimate-test-iframe"]//input[@id="ultimate-input"] (in Nested Shadow DOM)');
    };
    
    const clickInput = () => {
        const iframe = iframeRef.current;
        if (!iframe) return;
        
        function tryClick(attempt = 0) {
            try {
                if (!iframe.contentDocument) {
                    if (attempt < 15) {
                        setTimeout(() => tryClick(attempt + 1), 300);
                        return;
                    }
                    alert('iframe content not accessible.');
                    return;
                }
                
                const shadowHost = iframe.contentDocument.getElementById('ultimate-shadow-host');
                if (!shadowHost || !shadowHost.shadowRoot) {
                    if (attempt < 10) {
                        setTimeout(() => tryClick(attempt + 1), 300);
                        return;
                    }
                    alert('Outer Shadow DOM not accessible.');
                    return;
                }
                
                const innerHost = shadowHost.shadowRoot.getElementById('inner-shadow-host');
                if (!innerHost || !innerHost.shadowRoot) {
                    if (attempt < 10) {
                        setTimeout(() => tryClick(attempt + 1), 300);
                        return;
                    }
                    alert('Inner Shadow DOM not accessible.');
                    return;
                }
                
                const input = innerHost.shadowRoot.getElementById('ultimate-input');
                if (input) {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                        input.click();
                        showInputLocation();
                    }, 200);
                } else if (attempt < 10) {
                    setTimeout(() => tryClick(attempt + 1), 400);
                }
            } catch (e) {
                if (attempt < 5) {
                    setTimeout(() => tryClick(attempt + 1), 300);
                } else {
                    alert('Cannot access iframe content.');
                }
            }
        }
        
        tryClick();
    };
    
    const iframeContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { margin: 0; padding: 20px; font-family: Arial; position: relative; }
                .overlay { position: absolute; background: rgba(200,200,200,0.8); z-index: 10; padding: 10px; border: 2px solid #999; }
                .overlay-1 { top: 50px; left: 50px; width: 180px; height: 80px; z-index: 10; }
                .overlay-2 { top: 60px; left: 60px; width: 180px; height: 80px; z-index: 11; }
                .overlay-3 { top: 70px; left: 70px; width: 180px; height: 80px; z-index: 12; }
                .overlay-4 { top: 80px; left: 80px; width: 180px; height: 80px; z-index: 13; }
                .overlay-5 { top: 90px; left: 90px; width: 180px; height: 80px; z-index: 14; }
                input[type="file"] { position: absolute; top: 100px; left: 100px; z-index: 1; }
            </style>
        </head>
        <body>
            <div id="ultimate-shadow-host"></div>
            <div class="overlay overlay-1">Overlay 1</div>
            <div class="overlay overlay-2">Overlay 2</div>
            <div class="overlay overlay-3">Overlay 3</div>
            <div class="overlay overlay-4">Overlay 4</div>
            <div class="overlay overlay-5">Overlay 5 - Covers Input</div>
            <div id="ultimate-status" style="margin-top: 250px; color: green; font-weight: bold;"></div>
            <script>
                const host = document.getElementById("ultimate-shadow-host");
                const outerShadow = host.attachShadow({ mode: "open" });
                outerShadow.innerHTML = \`
                    <div id="inner-shadow-host"></div>
                \`;
                const innerHost = outerShadow.getElementById("inner-shadow-host");
                const innerShadow = innerHost.attachShadow({ mode: "open" });
                innerShadow.innerHTML = \`
                    <style>
                        .heavy-container { position: relative; padding: 10px; }
                        .dom-layer { padding: 3px; margin: 1px; border: 1px solid #ccc; font-size: 10px; }
                    </style>
                    <div class="heavy-container" id="ultimate-heavy-dom"></div>
                    <input type="file" id="ultimate-input" name="scenario-15-upload" multiple>
                \`;
                const container = innerShadow.getElementById("ultimate-heavy-dom");
                function createDeepDOM(parent, depth, width) {
                    if (depth === 0) {
                        for (let i = 0; i < 20; i++) {
                            const div = document.createElement("div");
                            div.className = "dom-layer";
                            div.textContent = "Element " + i;
                            parent.appendChild(div);
                        }
                        return;
                    }
                    for (let i = 0; i < width; i++) {
                        const div = document.createElement("div");
                        div.className = "dom-layer";
                        createDeepDOM(div, depth - 1, width);
                        parent.appendChild(div);
                    }
                }
                createDeepDOM(container, 5, 3);
                innerShadow.getElementById("ultimate-input").addEventListener("change", function(e) {
                    const files = Array.from(e.target.files);
                    document.getElementById("ultimate-status").textContent = "SUCCESS: " + files.length + " file(s) selected in ultimate test!";
                    if (files.length > 0) {
                        window.parent.postMessage({ type: 'update-upload-status', scenarioNumber: 15 }, '*');
                    }
                });
            </script>
        </body>
        </html>
    `;
    
    return (
        <ScenarioCard
            number={15}
            title="ALL COMBINATIONS - ULTIMATE TEST"
            description="iframe + Nested Shadow DOM + Heavy DOM (1000+ elements, 30 levels deep) + Hidden behind 5 overlays + Slot + Portal"
            badges={[{ type: 'danger', text: 'EXTREME' }]}
        >
            <div className="controls-bar">
                <button className="reveal-button" onClick={showInputLocation}>
                    📍 Show Input Location
                </button>
                <button className="click-here-button" onClick={clickInput}>
                    📁 Click Here to Upload
                </button>
            </div>
            <div className="test-area" style={{ height: '400px' }}>
                <iframe
                    ref={iframeRef}
                    id="ultimate-test-iframe"
                    srcDoc={iframeContent}
                    style={{ width: '100%', height: '350px', border: '2px solid #ccc', borderRadius: '6px' }}
                />
            </div>
        </ScenarioCard>
    );
}

