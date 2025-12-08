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
                body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: #f5f5f5; }
                .overlay { position: absolute; top: 50px; left: 50px; width: 200px; height: 100px; background: rgba(200,200,200,0.9); z-index: 10; padding: 10px; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div id="shadow-host"></div>
            <div class="overlay">Loading overlay</div>
            <script>
                const host = document.getElementById("shadow-host");
                const shadow = host.attachShadow({ mode: "open" });
                shadow.innerHTML = \`
                    <style>
                        .media-library { position: relative; padding: 16px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                        .library-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #e0e0e0; }
                        .library-title { font-size: 18px; font-weight: 600; color: #333; }
                        .library-actions { display: flex; gap: 8px; }
                        .action-btn { padding: 6px 12px; background: #f0f0f0; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; }
                        .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 12px; margin-bottom: 16px; }
                        .media-item { position: relative; aspect-ratio: 1; border-radius: 6px; overflow: hidden; background: #f8f9fa; border: 2px solid #e0e0e0; }
                        .media-thumbnail { width: 100%; height: 100%; object-fit: cover; }
                        .media-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #ccc; }
                        .media-label { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: white; padding: 4px; font-size: 10px; text-align: center; }
                        .upload-section { position: relative; padding: 20px; background: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; text-align: center; }
                        input[type="file"] { position: absolute; top: 60px; left: 60px; z-index: 1; width: 200px; height: 40px; opacity: 0; }
                        .upload-icon { font-size: 36px; margin-bottom: 8px; }
                        .upload-text { font-size: 14px; font-weight: 500; color: #333; margin-bottom: 4px; }
                        .upload-hint { font-size: 12px; color: #666; }
                        .upload-btn { display: inline-block; margin-top: 12px; padding: 10px 20px; background: #667eea; color: white; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; }
                        #shadow-iframe-status { margin-top: 12px; padding: 10px; background: #d4edda; color: #155724; border-radius: 4px; font-size: 13px; text-align: center; }
                    </style>
                    <div class="media-library" id="shadow-heavy-dom">
                        <div class="library-header">
                            <div class="library-title">Media Library</div>
                            <div class="library-actions">
                                <button class="action-btn">📁 View All</button>
                                <button class="action-btn">🔍 Search</button>
                            </div>
                        </div>
                        <div class="media-grid">
                            <div class="media-item">
                                <div class="media-placeholder">🖼️</div>
                                <div class="media-label">Image 1</div>
                            </div>
                            <div class="media-item">
                                <div class="media-placeholder">📷</div>
                                <div class="media-label">Photo 2</div>
                            </div>
                            <div class="media-item">
                                <div class="media-placeholder">🎬</div>
                                <div class="media-label">Video 3</div>
                            </div>
                            <div class="media-item">
                                <div class="media-placeholder">📄</div>
                                <div class="media-label">Doc 4</div>
                            </div>
                            <div class="media-item">
                                <div class="media-placeholder">🎵</div>
                                <div class="media-label">Audio 5</div>
                            </div>
                            <div class="media-item">
                                <div class="media-placeholder">📦</div>
                                <div class="media-label">File 6</div>
                            </div>
                        </div>
                        <div class="upload-section">
                            <div class="upload-icon">📤</div>
                            <div class="upload-text">Add New Media</div>
                            <div class="upload-hint">Upload images, videos, or documents</div>
                            <input type="file" id="shadow-iframe-input" name="scenario-9-upload" multiple>
                            <label class="upload-btn" for="shadow-iframe-input">Choose Files</label>
                        </div>
                    </div>
                    <div id="shadow-iframe-status"></div>
                \`;
                shadow.getElementById("shadow-iframe-input").addEventListener("change", function(e) {
                    const files = Array.from(e.target.files);
                    shadow.getElementById("shadow-iframe-status").textContent = files.length + " file(s) selected successfully";
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
            title="iframe + Shadow DOM + Heavy DOM + Hidden (Real-world Embedded Widget)"
            description="File input in iframe containing Shadow DOM media library widget with grid layout, covered by overlay"
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

