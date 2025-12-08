import React, { useEffect, useRef, useState } from 'react';
import { ScenarioCard } from '../components/ScenarioCard';
import { useFileUpload } from '../hooks/useFileUpload';
import { findAndClickInput } from '../utils/fileUtils';
import { useXPath } from '../contexts/XPathContext';
import { getFullXPath } from '../utils/fileUtils';

export function Scenario5() {
    const containerRef = useRef(null);
    const { handleFileChange, fileListRef, statusRef } = useFileUpload(5, 'heavy-hidden-input');
    const { showXPath } = useXPath();
    const [markerVisible, setMarkerVisible] = useState(false);
    const markerRef = useRef(null);
    const labelRef = useRef(null);
    
    useEffect(() => {
        if (!containerRef.current) return;
        
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.id = 'heavy-hidden-input';
        input.name = 'scenario-5-upload';
        input.style.cssText = 'position: absolute; top: 150px; left: 150px; z-index: 1; width: 200px; height: 40px;';
        input.addEventListener('change', handleFileChange);
        containerRef.current.appendChild(input);
        
        for (let i = 0; i < 500; i++) {
            const div = document.createElement('div');
            div.className = 'dom-layer';
            div.textContent = `Heavy DOM Element ${i + 1}`;
            containerRef.current.appendChild(div);
        }
        
        // Add markers
        setTimeout(() => {
            const inputEl = document.getElementById('heavy-hidden-input');
            if (inputEl) {
                const marker = document.createElement('div');
                marker.className = 'input-marker';
                marker.id = 'marker-heavy-hidden';
                marker.style.cssText = 'position: absolute; top: 150px; left: 150px; width: 200px; height: 40px; display: none; z-index: 1000;';
                document.getElementById('test-area-heavy-hidden').appendChild(marker);
                markerRef.current = marker;
                
                const label = document.createElement('div');
                label.className = 'input-label';
                label.id = 'label-heavy-hidden';
                label.textContent = '📎 File Input (Heavy DOM + Hidden)';
                label.style.cssText = 'position: absolute; top: 130px; left: 150px; display: none; z-index: 1001;';
                document.getElementById('test-area-heavy-hidden').appendChild(label);
                labelRef.current = label;
            }
        }, 100);
    }, [handleFileChange]);
    
    const toggleMarker = () => {
        setMarkerVisible(!markerVisible);
        if (markerRef.current) markerRef.current.style.display = markerVisible ? 'none' : 'block';
        if (labelRef.current) labelRef.current.style.display = markerVisible ? 'none' : 'block';
        if (!markerVisible) {
            const input = document.getElementById('heavy-hidden-input');
            if (input) {
                showXPath(getFullXPath(input));
            }
        }
    };
    
    const clickInput = () => {
        findAndClickInput('heavy-hidden-input').catch(err => {
            console.error('Error clicking input:', err);
        });
    };
    
    return (
        <ScenarioCard
            number={5}
            title="Heavy DOM + Hidden Behind Divs"
            description="File input in heavy DOM tree AND covered by multiple divs"
            badges={[{ type: 'danger', text: 'Worst Case' }]}
        >
            <div className="controls-bar">
                <button className="reveal-button" onClick={toggleMarker}>
                    📍 Show Input Location
                </button>
                <button className="click-here-button" onClick={clickInput}>
                    📁 Upload - Scenario 5
                </button>
            </div>
            <div className="test-area" id="test-area-heavy-hidden" style={{ height: '300px' }}>
                <div className="heavy-dom-container" ref={containerRef} id="heavy-hidden-container" style={{ height: '200px' }}></div>
                <input
                    type="file"
                    id="heavy-hidden-input"
                    name="scenario-5-upload"
                    multiple
                    onChange={handleFileChange}
                    style={{ position: 'absolute', top: '150px', left: '150px', zIndex: 1, width: '200px', height: '40px' }}
                />
                <div className="z-index-layer" style={{ zIndex: 10, top: '140px', left: '140px', width: '250px', height: '100px' }}>
                    Overlay covering input in heavy DOM
                </div>
                <div className="file-list" ref={fileListRef} id="heavy-hidden-list" style={{ position: 'relative', zIndex: 15, marginTop: '250px' }}></div>
                <div className="status" ref={statusRef} id="heavy-hidden-status" style={{ position: 'relative', zIndex: 15 }}></div>
            </div>
        </ScenarioCard>
    );
}

