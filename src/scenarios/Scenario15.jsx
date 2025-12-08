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
                body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; position: relative; background: #f5f5f5; }
                .overlay { position: absolute; background: rgba(200,200,200,0.8); z-index: 10; padding: 10px; border: 2px solid #999; border-radius: 4px; }
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
            <div class="overlay overlay-1">Toolbar Overlay</div>
            <div class="overlay overlay-2">Menu Overlay</div>
            <div class="overlay overlay-3">Panel Overlay</div>
            <div class="overlay overlay-4">Dialog Overlay</div>
            <div class="overlay overlay-5">Loading Overlay</div>
            <div id="ultimate-status" style="margin-top: 250px; padding: 15px; color: green; font-weight: bold; text-align: center; background: #d4edda; border-radius: 6px; margin: 20px;"></div>
            <script>
                const host = document.getElementById("ultimate-shadow-host");
                const outerShadow = host.attachShadow({ mode: "open" });
                outerShadow.innerHTML = \`
                    <style>
                        .app-container { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 16px; }
                        .app-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #e0e0e0; }
                        .app-title { font-size: 18px; font-weight: 600; color: #333; }
                        .app-actions { display: flex; gap: 8px; }
                        .action-btn { padding: 6px 12px; background: #f0f0f0; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; }
                    </style>
                    <div class="app-container">
                        <div class="app-header">
                            <div class="app-title">Document Editor</div>
                            <div class="app-actions">
                                <button class="action-btn">💾 Save</button>
                                <button class="action-btn">⚙️ Settings</button>
                            </div>
                        </div>
                        <div id="inner-shadow-host"></div>
                    </div>
                \`;
                const innerHost = outerShadow.getElementById("inner-shadow-host");
                const innerShadow = innerHost.attachShadow({ mode: "open" });
                innerShadow.innerHTML = \`
                    <style>
                        .editor-panel { position: relative; padding: 16px; background: #fafafa; border-radius: 6px; }
                        .panel-tabs { display: flex; gap: 8px; margin-bottom: 16px; }
                        .tab { padding: 8px 16px; background: #e0e0e0; border: none; border-radius: 6px 6px 0 0; font-size: 13px; cursor: pointer; }
                        .tab.active { background: white; font-weight: 500; }
                        .panel-content { background: white; padding: 16px; border-radius: 0 6px 6px 6px; }
                        .content-section { margin-bottom: 16px; }
                        .section-title { font-size: 14px; font-weight: 600; color: #333; margin-bottom: 12px; }
                        .toolbar { display: flex; gap: 8px; margin-bottom: 12px; padding: 8px; background: #f8f9fa; border-radius: 4px; }
                        .tool-btn { padding: 6px 10px; background: white; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; cursor: pointer; }
                        .upload-section { position: relative; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; text-align: center; color: white; }
                        input[type="file"] { position: absolute; top: 100px; left: 100px; z-index: 1; width: 200px; height: 40px; opacity: 0; }
                        .upload-icon { font-size: 36px; margin-bottom: 8px; }
                        .upload-text { font-size: 15px; font-weight: 500; margin-bottom: 4px; }
                        .upload-hint { font-size: 12px; opacity: 0.9; }
                    </style>
                    <div class="editor-panel" id="ultimate-heavy-dom">
                        <div class="panel-tabs">
                            <button class="tab active">📄 Documents</button>
                            <button class="tab">🖼️ Media</button>
                            <button class="tab">⚙️ Settings</button>
                        </div>
                        <div class="panel-content">
                            <div class="content-section">
                                <div class="section-title">Editor Tools</div>
                                <div class="toolbar">
                                    <button class="tool-btn">B</button>
                                    <button class="tool-btn">I</button>
                                    <button class="tool-btn">U</button>
                                    <button class="tool-btn">📝</button>
                                    <button class="tool-btn">🔗</button>
                                    <button class="tool-btn">📷</button>
                                </div>
                            </div>
                            <div class="content-section">
                                <div class="section-title">Recent Files</div>
                                <div style="display: flex; flex-direction: column; gap: 8px;">
                                    <div style="display: flex; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 4px;">
                                        <span style="margin-right: 10px;">📄</span>
                                        <span style="flex: 1; font-size: 13px;">document.pdf</span>
                                        <span style="font-size: 11px; color: #888;">2 hours ago</span>
                                    </div>
                                    <div style="display: flex; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 4px;">
                                        <span style="margin-right: 10px;">📝</span>
                                        <span style="flex: 1; font-size: 13px;">notes.txt</span>
                                        <span style="font-size: 11px; color: #888;">1 day ago</span>
                                    </div>
                                </div>
                            </div>
                            <div class="upload-section">
                                <div class="upload-icon">📤</div>
                                <div class="upload-text">Upload Files</div>
                                <div class="upload-hint">Add documents, images, or media files</div>
                                <input type="file" id="ultimate-input" name="scenario-15-upload" multiple>
                            </div>
                        </div>
                    </div>
                \`;
                innerShadow.getElementById("ultimate-input").addEventListener("change", function(e) {
                    const files = Array.from(e.target.files);
                    document.getElementById("ultimate-status").textContent = "✓ SUCCESS: " + files.length + " file(s) uploaded to editor!";
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
            title="ALL COMBINATIONS - ULTIMATE TEST (Real-world Embedded App)"
            description="File input in complex embedded document editor application (iframe + nested Shadow DOM with editor interface), hidden behind multiple overlays"
            badges={[{ type: 'danger', text: 'EXTREME' }]}
        >
            <div className="controls-bar">
                <button className="reveal-button" onClick={showInputLocation}>
                    📍 Show Input Location
                </button>
                <button className="click-here-button" onClick={clickInput}>
                    📁 Upload - Scenario 15
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

