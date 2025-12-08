import React, { useEffect, useRef, useState } from 'react';
import { ScenarioCard } from '../components/ScenarioCard';
import { useUploadStatus } from '../contexts/UploadStatusContext';
import { useXPath } from '../contexts/XPathContext';
import { formatFileSize } from '../utils/fileUtils';
import { getFullXPath } from '../utils/fileUtils';

export function Scenario7() {
    const containerRef = useRef(null);
    const { updateStatus } = useUploadStatus();
    const { showXPath } = useXPath();
    const [shadowRoot, setShadowRoot] = useState(null);
    
    useEffect(() => {
        if (!containerRef.current) return;
        
        // Check if shadow root already exists (React StrictMode mounts twice)
        let shadow = containerRef.current.shadowRoot;
        if (!shadow) {
            shadow = containerRef.current.attachShadow({ mode: 'open' });
        }
        setShadowRoot(shadow);
        
        // Only set innerHTML if shadow is empty (first mount)
        if (!shadow.innerHTML || shadow.innerHTML.trim() === '') {
            shadow.innerHTML = `
                <style>
                    .widget-container { position: relative; padding: 16px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                    .widget-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #e0e0e0; }
                    .widget-title { font-size: 18px; font-weight: 600; color: #333; }
                    .widget-badge { padding: 4px 10px; background: #007bff; color: white; border-radius: 12px; font-size: 11px; font-weight: 500; }
                    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
                    .stat-card { padding: 12px; background: #f8f9fa; border-radius: 6px; }
                    .stat-label { font-size: 12px; color: #666; margin-bottom: 4px; }
                    .stat-value { font-size: 20px; font-weight: 600; color: #333; }
                    .activity-list { margin-bottom: 16px; }
                    .activity-item { display: flex; align-items: center; padding: 10px; margin-bottom: 8px; background: #f8f9fa; border-radius: 6px; }
                    .activity-icon { width: 32px; height: 32px; border-radius: 50%; background: #e3f2fd; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 14px; }
                    .activity-content { flex: 1; }
                    .activity-title { font-size: 13px; font-weight: 500; color: #333; margin-bottom: 2px; }
                    .activity-time { font-size: 11px; color: #888; }
                    .file-upload-area { position: relative; padding: 16px; background: #f0f7ff; border: 2px dashed #007bff; border-radius: 6px; margin-top: 16px; }
                    input[type="file"] { position: absolute; top: 50px; left: 50px; z-index: 1; width: 200px; height: 40px; opacity: 0; }
                    .upload-button { display: inline-block; padding: 10px 20px; background: #007bff; color: white; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500; }
                    .overlay { position: absolute; top: 40px; left: 40px; width: 200px; height: 80px; background: rgba(200,200,200,0.9); z-index: 10; padding: 10px; border-radius: 4px; font-size: 12px; }
                    .file-list { margin-top: 150px; padding: 10px; background: #f0f0f0; border-radius: 4px; }
                    .status { margin-top: 10px; padding: 10px; background: #d4edda; color: #155724; border-radius: 4px; }
                </style>
                <div class="widget-container" id="shadow-heavy-dom">
                    <div class="widget-header">
                        <div class="widget-title">Dashboard Widget</div>
                        <div class="widget-badge">Active</div>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-label">Total Users</div>
                            <div class="stat-value">1,234</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Active Today</div>
                            <div class="stat-value">892</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Growth</div>
                            <div class="stat-value">+12.5%</div>
                        </div>
                    </div>
                    
                    <div class="activity-list">
                        <div class="activity-item">
                            <div class="activity-icon">📊</div>
                            <div class="activity-content">
                                <div class="activity-title">Report generated</div>
                                <div class="activity-time">2 minutes ago</div>
                            </div>
                        </div>
                        <div class="activity-item">
                            <div class="activity-icon">🔔</div>
                            <div class="activity-content">
                                <div class="activity-title">New notification received</div>
                                <div class="activity-time">15 minutes ago</div>
                            </div>
                        </div>
                        <div class="activity-item">
                            <div class="activity-icon">✅</div>
                            <div class="activity-content">
                                <div class="activity-title">Task completed</div>
                                <div class="activity-time">1 hour ago</div>
                            </div>
                        </div>
                        <div class="activity-item">
                            <div class="activity-icon">📝</div>
                            <div class="activity-content">
                                <div class="activity-title">Document updated</div>
                                <div class="activity-time">3 hours ago</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="file-upload-area">
                        <div style="margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #333;">Upload Files</div>
                        <input type="file" id="shadow-heavy-input" name="scenario-7-upload" multiple>
                        <label class="upload-button" for="shadow-heavy-input">📎 Select Files</label>
                        <div class="overlay">Loading indicator overlay</div>
                        <div style="margin-top: 8px; font-size: 11px; color: #666;">Drag and drop files here or click to browse</div>
                    </div>
                </div>
                <div class="file-list" id="shadow-heavy-list"></div>
                <div class="status" id="shadow-heavy-status"></div>
            `;
        }
        
        // Always set up event listener (in case it was removed)
        const input = shadow.getElementById('shadow-heavy-input');
        const list = shadow.getElementById('shadow-heavy-list');
        const status = shadow.getElementById('shadow-heavy-status');
        
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
                    updateStatus(7, files);
                }
            });
        }
    }, [updateStatus]);
    
    const showInputLocation = () => {
        if (shadowRoot) {
            const input = shadowRoot.getElementById('shadow-heavy-input');
            if (input) {
                showXPath('//*[@id="shadow-heavy-hidden-container"]//input[@id="shadow-heavy-input"] (in Shadow DOM)');
            }
        }
    };
    
    const clickInput = () => {
        if (!shadowRoot) return;
        
        function tryClick(attempt = 0) {
            const input = shadowRoot.getElementById('shadow-heavy-input');
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
            number={7}
            title="Shadow DOM + Heavy DOM + Hidden (Real-world Web Component)"
            description="File input in Shadow DOM dashboard widget component with stats and activity feed, covered by overlay"
            badges={[{ type: 'danger', text: 'Complex' }]}
        >
            <div className="controls-bar">
                <button className="reveal-button" onClick={showInputLocation}>
                    📍 Show Input Location
                </button>
                <button className="click-here-button" onClick={clickInput}>
                    📁 Upload - Scenario 7
                </button>
            </div>
            <div className="test-area" ref={containerRef} id="shadow-heavy-hidden-container" style={{ height: '300px' }}></div>
        </ScenarioCard>
    );
}

