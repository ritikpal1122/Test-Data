import React, { useEffect, useRef, useState } from 'react';
import { ScenarioCard } from '../components/ScenarioCard';
import { useUploadStatus } from '../contexts/UploadStatusContext';
import { useXPath } from '../contexts/XPathContext';
import { formatFileSize } from '../utils/fileUtils';

export function Scenario8() {
    const containerRef = useRef(null);
    const { updateStatus } = useUploadStatus();
    const { showXPath } = useXPath();
    const [outerShadow, setOuterShadow] = useState(null);
    const [innerShadow, setInnerShadow] = useState(null);
    
    useEffect(() => {
        if (!containerRef.current) return;
        
        // Check if shadow root already exists (React StrictMode mounts twice)
        let outer = containerRef.current.shadowRoot;
        if (!outer) {
            outer = containerRef.current.attachShadow({ mode: 'open' });
        }
        setOuterShadow(outer);
        
        // Only set innerHTML if shadow is empty (first mount)
        if (!outer.innerHTML || outer.innerHTML.trim() === '') {
            outer.innerHTML = `
                <style>
                    .modal-container { position: relative; padding: 0; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); overflow: hidden; }
                    .modal-header { padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
                    .modal-title { font-size: 22px; font-weight: 600; margin-bottom: 5px; }
                    .modal-subtitle { font-size: 14px; opacity: 0.9; }
                    .modal-body { padding: 20px; }
                    .overlay { position: absolute; top: 40px; left: 40px; width: 200px; height: 80px; background: rgba(200,200,200,0.9); z-index: 10; padding: 10px; border-radius: 4px; font-size: 12px; }
                </style>
                <div class="modal-container">
                    <div class="modal-header">
                        <div class="modal-title">File Upload Dialog</div>
                        <div class="modal-subtitle">Upload your files securely</div>
                    </div>
                    <div class="modal-body">
                        <div id="inner-shadow-host-nested"></div>
                    </div>
                    <div class="overlay">Modal Overlay</div>
                </div>
            `;
        }
        
        const innerHost = outer.getElementById('inner-shadow-host-nested');
        if (!innerHost) return;
        
        // Check if inner shadow root already exists
        let inner = innerHost.shadowRoot;
        if (!inner) {
            inner = innerHost.attachShadow({ mode: 'open' });
        }
        setInnerShadow(inner);
        
        // Only set innerHTML if shadow is empty (first mount)
        if (!inner.innerHTML || inner.innerHTML.trim() === '') {
            inner.innerHTML = `
                <style>
                    .content-wrapper { position: relative; }
                    .info-section { margin-bottom: 20px; }
                    .info-title { font-size: 16px; font-weight: 600; color: #333; margin-bottom: 12px; }
                    .info-text { font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 12px; }
                    .feature-list { list-style: none; padding: 0; margin: 0 0 20px 0; }
                    .feature-item { display: flex; align-items: center; padding: 8px 0; font-size: 14px; color: #555; }
                    .feature-icon { margin-right: 10px; font-size: 16px; }
                    .progress-section { margin-bottom: 20px; }
                    .progress-bar { width: 100%; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
                    .progress-fill { height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); width: 65%; }
                    .progress-text { font-size: 12px; color: #888; }
                    .file-upload-zone { position: relative; padding: 24px; background: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; text-align: center; }
                    input[type="file"] { position: absolute; top: 50px; left: 50px; z-index: 1; width: 200px; height: 40px; opacity: 0; }
                    .upload-icon { font-size: 48px; margin-bottom: 12px; }
                    .upload-title { font-size: 16px; font-weight: 600; color: #333; margin-bottom: 8px; }
                    .upload-subtitle { font-size: 13px; color: #666; margin-bottom: 16px; }
                    .upload-button { display: inline-block; padding: 10px 24px; background: #667eea; color: white; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; }
                    .overlay { position: absolute; top: 40px; left: 40px; width: 200px; height: 80px; background: rgba(200,200,200,0.9); z-index: 10; padding: 10px; border-radius: 4px; font-size: 12px; }
                    .file-list { margin-top: 150px; padding: 10px; background: #f0f0f0; border-radius: 4px; }
                    .status { margin-top: 10px; padding: 10px; background: #d4edda; color: #155724; border-radius: 4px; }
                </style>
                <div class="content-wrapper" id="nested-shadow-heavy-dom">
                    <div class="info-section">
                        <div class="info-title">Upload Information</div>
                        <div class="info-text">Select multiple files to upload. Your files will be processed securely and stored in your account.</div>
                    </div>
                    
                    <div class="feature-list">
                        <div class="feature-item">
                            <span class="feature-icon">🔒</span>
                            <span>Secure file encryption</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">⚡</span>
                            <span>Fast upload speeds</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">📱</span>
                            <span>Access from any device</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">☁️</span>
                            <span>Cloud storage included</span>
                        </div>
                    </div>
                    
                    <div class="progress-section">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="progress-text">Storage used: 65% (6.5 GB of 10 GB)</div>
                    </div>
                    
                    <div class="file-upload-zone">
                        <div class="upload-icon">📤</div>
                        <div class="upload-title">Drag & Drop Files Here</div>
                        <div class="upload-subtitle">or click the button below to browse</div>
                        <input type="file" id="nested-shadow-heavy-input" name="scenario-8-upload" multiple>
                        <label class="upload-button" for="nested-shadow-heavy-input">Choose Files</label>
                        <div class="overlay">Widget Overlay</div>
                        <div style="margin-top: 12px; font-size: 11px; color: #999;">Maximum file size: 50MB per file</div>
                    </div>
                </div>
                <div class="file-list" id="nested-shadow-heavy-list"></div>
                <div class="status" id="nested-shadow-heavy-status"></div>
            `;
        }
        
        // Always set up event listener (in case it was removed)
        const input = inner.getElementById('nested-shadow-heavy-input');
        const list = inner.getElementById('nested-shadow-heavy-list');
        const status = inner.getElementById('nested-shadow-heavy-status');
        
        if (input && !input.hasAttribute('data-listener-attached')) {
            input.setAttribute('data-listener-attached', 'true');
            input.addEventListener('change', function(e) {
                const files = Array.from(e.target.files);
                if (list) {
                    list.innerHTML = '';
                    files.forEach(file => {
                        const div = document.createElement('div');
                        div.textContent = file.name + ' (' + formatFileSize(file.size) + ')';
                        list.appendChild(div);
                    });
                }
                if (status) {
                    status.textContent = files.length + ' file(s) selected';
                }
                if (files.length > 0) {
                    updateStatus(8, files);
                }
            });
        }
    }, [updateStatus]);
    
    const showInputLocation = () => {
        if (innerShadow) {
            showXPath('//*[@id="nested-shadow-heavy-container"]//input[@id="nested-shadow-heavy-input"] (in Nested Shadow DOM)');
        }
    };
    
    const clickInput = () => {
        if (!innerShadow) return;
        
        function tryClick(attempt = 0) {
            const input = innerShadow.getElementById('nested-shadow-heavy-input');
            if (input) {
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => {
                    input.click();
                }, 200);
            } else if (attempt < 10) {
                setTimeout(() => tryClick(attempt + 1), 400);
            }
        }
        
        tryClick();
    };
    
    return (
        <ScenarioCard
            number={8}
            title="Nested Shadow DOM + Heavy DOM + Hidden (Real-world Component Composition)"
            description="File input in nested Shadow DOM Web Components (parent modal dialog containing child upload widget), covered by overlays"
            badges={[{ type: 'danger', text: 'Very Complex' }]}
        >
            <div className="controls-bar">
                <button className="reveal-button" onClick={showInputLocation}>
                    📍 Show Input Location
                </button>
                <button className="click-here-button" onClick={clickInput}>
                    📁 Upload - Scenario 8
                </button>
            </div>
            <div className="test-area" ref={containerRef} id="nested-shadow-heavy-container" style={{ height: '300px' }}></div>
        </ScenarioCard>
    );
}

