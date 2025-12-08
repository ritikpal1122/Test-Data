import React, { useEffect, useRef } from 'react';
import { ScenarioCard } from '../components/ScenarioCard';
import { useUploadStatus } from '../contexts/UploadStatusContext';
import { useXPath } from '../contexts/XPathContext';

export function Scenario9() {
    const iframeRef = useRef(null);
    const { updateStatus } = useUploadStatus();
    const { showXPath } = useXPath();
    
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.type === 'update-upload-status' && event.data.scenarioNumber === 9) {
                updateStatus(9, [{ name: 'uploaded-file' }]);
            }
        };
        
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [updateStatus]);
    
    const showInputLocation = () => {
        showXPath('//iframe[@id="iframe-shadow-heavy-iframe"]//input[@id="shadow-iframe-input"] (in Shadow DOM)');
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
                
                const shadowHost = iframe.contentDocument.getElementById('shadow-host');
                if (!shadowHost || !shadowHost.shadowRoot) {
                    if (attempt < 10) {
                        setTimeout(() => tryClick(attempt + 1), 300);
                        return;
                    }
                    alert('Shadow DOM not accessible.');
                    return;
                }
                
                const input = shadowHost.shadowRoot.getElementById('shadow-iframe-input');
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
                    alert('Cannot access iframe content (cross-origin).');
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
                body { margin: 0; padding: 20px; font-family: Arial; }
                .overlay { position: absolute; top: 50px; left: 50px; width: 200px; height: 100px; background: rgba(200,200,200,0.9); z-index: 10; padding: 10px; }
            </style>
        </head>
        <body>
            <div id="shadow-host"></div>
            <div class="overlay">Overlay</div>
            <script>
                const host = document.getElementById("shadow-host");
                const shadow = host.attachShadow({ mode: "open" });
                shadow.innerHTML = \`
                    <style>
                        .heavy-container { position: relative; padding: 10px; }
                        input[type="file"] { position: absolute; top: 60px; left: 60px; z-index: 1; }
                        .dom-layer { padding: 5px; margin: 2px; border: 1px solid #ccc; }
                    </style>
                    <div class="heavy-container" id="shadow-heavy-dom"></div>
                    <input type="file" id="shadow-iframe-input" name="scenario-9-upload" multiple>
                    <div id="shadow-iframe-status" style="margin-top: 200px; color: green;"></div>
                \`;
                const container = shadow.getElementById("shadow-heavy-dom");
                for (let i = 0; i < 100; i++) {
                    const div = document.createElement("div");
                    div.className = "dom-layer";
                    div.textContent = "Shadow DOM Element " + i;
                    container.appendChild(div);
                }
                shadow.getElementById("shadow-iframe-input").addEventListener("change", function(e) {
                    const files = Array.from(e.target.files);
                    shadow.getElementById("shadow-iframe-status").textContent = files.length + " file(s) selected";
                    if (files.length > 0) {
                        window.parent.postMessage({ type: 'update-upload-status', scenarioNumber: 9 }, '*');
                    }
                });
            </script>
        </body>
        </html>
    `;
    
    return (
        <ScenarioCard
            number={9}
            title="iframe + Shadow DOM + Heavy DOM + Hidden"
            description="All complexities combined: iframe containing Shadow DOM with heavy DOM and hidden input"
            badges={[{ type: 'danger', text: 'Extreme' }]}
        >
            <div className="controls-bar">
                <button className="reveal-button" onClick={showInputLocation}>
                    📍 Show Input Location
                </button>
                <button className="click-here-button" onClick={clickInput}>
                    📁 Upload - Scenario 9
                </button>
            </div>
            <iframe
                ref={iframeRef}
                id="iframe-shadow-heavy-iframe"
                srcDoc={iframeContent}
                style={{ width: '100%', height: '300px', border: '2px solid #ccc', borderRadius: '6px' }}
            />
        </ScenarioCard>
    );
}

