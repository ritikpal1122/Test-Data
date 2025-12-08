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
                    .heavy-container { position: relative; padding: 10px; height: 200px; overflow: auto; }
                    .dom-layer { padding: 5px; margin: 2px; border: 1px solid #ccc; }
                    input[type="file"] { position: absolute; top: 50px; left: 50px; z-index: 1; }
                    .overlay { position: absolute; top: 40px; left: 40px; width: 200px; height: 80px; background: rgba(200,200,200,0.9); z-index: 10; padding: 10px; }
                    .file-list { margin-top: 150px; padding: 10px; background: #f0f0f0; border-radius: 4px; }
                    .status { margin-top: 10px; padding: 10px; background: #d4edda; color: #155724; border-radius: 4px; }
                </style>
                <div class="heavy-container" id="shadow-heavy-dom"></div>
                <input type="file" id="shadow-heavy-input" name="scenario-7-upload" multiple>
                <div class="overlay">Shadow DOM Overlay</div>
                <div class="file-list" id="shadow-heavy-list"></div>
                <div class="status" id="shadow-heavy-status"></div>
            `;
            
            const shadowHeavyDOM = shadow.getElementById('shadow-heavy-dom');
            for (let i = 0; i < 200; i++) {
                const div = document.createElement('div');
                div.className = 'dom-layer';
                div.textContent = `Shadow DOM Element ${i + 1}`;
                shadowHeavyDOM.appendChild(div);
            }
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
            title="Shadow DOM + Heavy DOM + Hidden"
            description="File input in Shadow DOM with heavy tree, covered by overlay"
            badges={[{ type: 'danger', text: 'Complex' }]}
        >
            <div className="controls-bar">
                <button className="reveal-button" onClick={showInputLocation}>
                    📍 Show Input Location
                </button>
                <button className="click-here-button" onClick={clickInput}>
                    📁 Click Here to Upload
                </button>
            </div>
            <div className="test-area" ref={containerRef} id="shadow-heavy-hidden-container" style={{ height: '300px' }}></div>
        </ScenarioCard>
    );
}

