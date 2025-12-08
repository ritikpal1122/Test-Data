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
                    .heavy-container { position: relative; padding: 10px; height: 200px; overflow: auto; }
                    .dom-layer { padding: 5px; margin: 2px; border: 1px solid #ccc; }
                    .overlay { position: absolute; top: 40px; left: 40px; width: 200px; height: 80px; background: rgba(200,200,200,0.9); z-index: 10; padding: 10px; }
                </style>
                <div id="inner-shadow-host-nested"></div>
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
                    .heavy-container { position: relative; padding: 10px; height: 150px; overflow: auto; }
                    .dom-layer { padding: 5px; margin: 2px; border: 1px solid #ccc; }
                    input[type="file"] { position: absolute; top: 50px; left: 50px; z-index: 1; }
                    .overlay { position: absolute; top: 40px; left: 40px; width: 200px; height: 80px; background: rgba(200,200,200,0.9); z-index: 10; padding: 10px; }
                    .file-list { margin-top: 150px; padding: 10px; background: #f0f0f0; border-radius: 4px; }
                    .status { margin-top: 10px; padding: 10px; background: #d4edda; color: #155724; border-radius: 4px; }
                </style>
                <div class="heavy-container" id="nested-shadow-heavy-dom"></div>
                <input type="file" id="nested-shadow-heavy-input" name="scenario-8-upload" multiple>
                <div class="overlay">Nested Shadow Overlay</div>
                <div class="file-list" id="nested-shadow-heavy-list"></div>
                <div class="status" id="nested-shadow-heavy-status"></div>
            `;
            
            const nestedShadowHeavyDOM = inner.getElementById('nested-shadow-heavy-dom');
            for (let i = 0; i < 150; i++) {
                const div = document.createElement('div');
                div.className = 'dom-layer';
                div.textContent = `Nested Shadow Element ${i + 1}`;
                nestedShadowHeavyDOM.appendChild(div);
            }
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
            title="Nested Shadow DOM + Heavy DOM + Hidden"
            description="File input in nested Shadow DOMs with heavy DOM, covered by overlays"
            badges={[{ type: 'danger', text: 'Very Complex' }]}
        >
            <div className="controls-bar">
                <button className="reveal-button" onClick={showInputLocation}>
                    📍 Show Input Location
                </button>
                <button className="click-here-button" onClick={clickInput}>
                    📁 Click Here to Upload
                </button>
            </div>
            <div className="test-area" ref={containerRef} id="nested-shadow-heavy-container" style={{ height: '300px' }}></div>
        </ScenarioCard>
    );
}

