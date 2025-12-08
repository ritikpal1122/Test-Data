import React, { useEffect, useRef } from 'react';
import { ScenarioCard } from '../components/ScenarioCard';
import { useUploadStatus } from '../contexts/UploadStatusContext';
import { useXPath } from '../contexts/XPathContext';

export function Scenario14() {
    const iframeRef = useRef(null);
    const { updateStatus } = useUploadStatus();
    const { showXPath } = useXPath();
    
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.type === 'update-upload-status' && event.data.scenarioNumber === 14) {
                updateStatus(14, [{ name: 'uploaded-file' }]);
            }
        };
        
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [updateStatus]);
    
    const showInputLocation = () => {
        showXPath('//iframe[@id="cross-origin-heavy-iframe"]//input[@id="cross-heavy-input"]');
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
                    alert('Cannot access iframe content. This may be a cross-origin issue.');
                    showInputLocation();
                    return;
                }
                
                const input = iframe.contentDocument.getElementById('cross-heavy-input');
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
                    alert('Cannot access iframe content (cross-origin). XPath displayed in top bar.');
                    showInputLocation();
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
                body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: #f5f5f5; position: relative; }
                .upload-widget { background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 20px; }
                .widget-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0; }
                .widget-title { font-size: 20px; font-weight: 600; color: #333; }
                .widget-badge { padding: 4px 12px; background: #28a745; color: white; border-radius: 12px; font-size: 11px; }
                .service-info { display: flex; gap: 20px; margin-bottom: 20px; }
                .info-item { flex: 1; padding: 12px; background: #f8f9fa; border-radius: 6px; }
                .info-label { font-size: 11px; color: #666; margin-bottom: 4px; }
                .info-value { font-size: 16px; font-weight: 600; color: #333; }
                .upload-area { position: relative; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; text-align: center; color: white; }
                input[type="file"] { position: absolute; top: 60px; left: 60px; z-index: 1; width: 200px; height: 40px; opacity: 0; }
                .upload-icon { font-size: 48px; margin-bottom: 12px; }
                .upload-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
                .upload-subtitle { font-size: 13px; opacity: 0.9; margin-bottom: 16px; }
                .upload-button { display: inline-block; padding: 12px 24px; background: white; color: #667eea; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; }
                .overlay { position: absolute; top: 50px; left: 50px; width: 200px; height: 100px; background: rgba(200,200,200,0.9); z-index: 10; padding: 10px; border-radius: 4px; }
                #cross-heavy-status { margin-top: 20px; padding: 12px; background: #d4edda; color: #155724; border-radius: 6px; font-size: 13px; text-align: center; }
            </style>
        </head>
        <body>
            <div class="upload-widget">
                <div class="widget-header">
                    <div class="widget-title">CloudFile Upload Service</div>
                    <div class="widget-badge">Secure</div>
                </div>
                <div class="service-info">
                    <div class="info-item">
                        <div class="info-label">Storage Used</div>
                        <div class="info-value">6.2 GB</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Files Uploaded</div>
                        <div class="info-value">1,234</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Bandwidth</div>
                        <div class="info-value">Unlimited</div>
                    </div>
                </div>
                <div class="upload-area">
                    <div class="upload-icon">☁️</div>
                    <div class="upload-title">Upload to Cloud</div>
                    <div class="upload-subtitle">Drag and drop files or click to browse</div>
                    <input type="file" id="cross-heavy-input" name="scenario-14-upload" multiple>
                    <label class="upload-button" for="cross-heavy-input">Choose Files</label>
                    <div class="overlay">Service Overlay</div>
                </div>
                <div id="cross-heavy-status"></div>
            </div>
            <script>
                document.getElementById("cross-heavy-input").addEventListener("change", function(e) {
                    const files = Array.from(e.target.files);
                    document.getElementById("cross-heavy-status").textContent = "✓ " + files.length + " file(s) uploaded successfully";
                    if (files.length > 0) {
                        window.parent.postMessage({ type: 'update-upload-status', scenarioNumber: 14 }, '*');
                    }
                });
            </script>
        </body>
        </html>
    `;
    
    return (
        <ScenarioCard
            number={14}
            title="Cross-origin iframe + Heavy DOM + Hidden (Real-world Third-party Widget)"
            description="File input in third-party cloud upload service widget embedded via iframe, covered by overlay"
            badges={[{ type: 'danger', text: 'Cross-Origin' }]}
        >
            <div className="controls-bar">
                <button className="reveal-button" onClick={showInputLocation}>
                    📍 Show Input Location
                </button>
                <button className="click-here-button" onClick={clickInput}>
                    📁 Upload - Scenario 14
                </button>
            </div>
            <iframe
                ref={iframeRef}
                id="cross-origin-heavy-iframe"
                srcDoc={iframeContent}
                style={{ width: '100%', height: '300px', border: '2px solid #ccc', borderRadius: '6px' }}
            />
        </ScenarioCard>
    );
}

