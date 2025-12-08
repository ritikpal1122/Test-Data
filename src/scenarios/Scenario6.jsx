import React, { useEffect, useRef } from 'react';
import { ScenarioCard } from '../components/ScenarioCard';
import { useUploadStatus } from '../contexts/UploadStatusContext';
import { useXPath } from '../contexts/XPathContext';

export function Scenario6() {
    const iframeRef = useRef(null);
    const { updateStatus } = useUploadStatus();
    const { showXPath } = useXPath();
    
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.type === 'update-upload-status' && event.data.scenarioNumber === 6) {
                updateStatus(6, [{ name: 'uploaded-file' }]);
            }
        };
        
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [updateStatus]);
    
    const showInputLocation = () => {
        showXPath('//iframe[@id="iframe-heavy-hidden"]//input[@id="iframe-heavy-input"]');
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
                    alert('Cannot access iframe content.');
                    return;
                }
                
                const input = iframe.contentDocument.getElementById('iframe-heavy-input');
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
                body { margin: 0; padding: 20px; font-family: Arial; position: relative; }
                .heavy-container { position: relative; padding: 10px; }
                .overlay { position: absolute; top: 50px; left: 50px; width: 200px; height: 100px; background: rgba(200,200,200,0.9); z-index: 10; padding: 10px; }
                input[type="file"] { position: absolute; top: 60px; left: 60px; z-index: 1; width: 200px; height: 40px; }
                .dom-layer { padding: 5px; margin: 2px; border: 1px solid #ccc; }
            </style>
        </head>
        <body>
            <div class="heavy-container" id="iframe-heavy-dom"></div>
            <input type="file" id="iframe-heavy-input" name="scenario-6-upload" multiple>
            <div class="overlay">Overlay covering input</div>
            <div id="iframe-status" style="margin-top: 200px; color: green;"></div>
            <script>
                const container = document.getElementById("iframe-heavy-dom");
                for (let i = 0; i < 100; i++) {
                    const div = document.createElement("div");
                    div.className = "dom-layer";
                    div.textContent = "DOM Element " + i;
                    container.appendChild(div);
                }
                document.getElementById("iframe-heavy-input").addEventListener("change", function(e) {
                    const files = Array.from(e.target.files);
                    document.getElementById("iframe-status").textContent = files.length + " file(s) selected";
                    if (files.length > 0) {
                        window.parent.postMessage({ type: 'update-upload-status', scenarioNumber: 6 }, '*');
                    }
                });
            </script>
        </body>
        </html>
    `;
    
    return (
        <ScenarioCard
            number={6}
            title="iframe + Heavy DOM + Hidden"
            description="File input in iframe with heavy DOM, covered by overlay"
            badges={[{ type: 'danger', text: 'Complex' }]}
        >
            <div className="controls-bar">
                <button className="reveal-button" onClick={showInputLocation}>
                    📍 Show Input Location
                </button>
                <button className="click-here-button" onClick={clickInput}>
                    📁 Click Here to Upload (in iframe)
                </button>
            </div>
            <iframe
                ref={iframeRef}
                id="iframe-heavy-hidden"
                srcDoc={iframeContent}
                style={{ width: '100%', height: '300px', border: '2px solid #ccc', borderRadius: '6px' }}
            />
        </ScenarioCard>
    );
}

