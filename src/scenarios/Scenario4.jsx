import React, { useEffect, useRef, useState } from 'react';
import { ScenarioCard } from '../components/ScenarioCard';
import { useFileUpload } from '../hooks/useFileUpload';
import { findAndClickInput } from '../utils/fileUtils';
import { useXPath } from '../contexts/XPathContext';
import { getFullXPath } from '../utils/fileUtils';

export function Scenario4() {
    const containerRef = useRef(null);
    const { handleFileChange, fileListRef, statusRef } = useFileUpload(4, 'wide-branching-input');
    const { showXPath } = useXPath();
    const [markerVisible, setMarkerVisible] = useState(false);
    const markerRef = useRef(null);
    const labelRef = useRef(null);
    
    useEffect(() => {
        if (!containerRef.current) return;
        
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.id = 'wide-branching-input';
        input.name = 'scenario-4-upload';
        input.style.cssText = 'position: absolute; top: 50px; left: 50px; z-index: 1;';
        input.addEventListener('change', handleFileChange);
        containerRef.current.appendChild(input);
        
        for (let i = 0; i < 1000; i++) {
            const div = document.createElement('div');
            div.className = 'complex-item';
            div.textContent = `Sibling Element ${i + 1}`;
            containerRef.current.appendChild(div);
        }
        
        // Add markers
        setTimeout(() => {
            const inputEl = document.getElementById('wide-branching-input');
            if (inputEl && containerRef.current) {
                const rect = inputEl.getBoundingClientRect();
                const containerRect = containerRef.current.getBoundingClientRect();
                const top = rect.top - containerRect.top + containerRef.current.scrollTop;
                const left = rect.left - containerRect.left + containerRef.current.scrollLeft;
                
                const marker = document.createElement('div');
                marker.className = 'input-marker';
                marker.id = 'marker-wide-branching';
                marker.style.cssText = `position: absolute; top: ${top}px; left: ${left}px; width: ${rect.width}px; height: ${rect.height}px; z-index: 1000; display: none;`;
                containerRef.current.appendChild(marker);
                markerRef.current = marker;
                
                const label = document.createElement('div');
                label.className = 'input-label';
                label.id = 'label-wide-branching';
                label.textContent = '📎 File Input (1000+ siblings)';
                label.style.cssText = `position: absolute; top: ${Math.max(0, top - 30)}px; left: ${left}px; z-index: 1001; display: none;`;
                containerRef.current.appendChild(label);
                labelRef.current = label;
            }
        }, 100);
    }, [handleFileChange]);
    
    const toggleMarker = () => {
        setMarkerVisible(!markerVisible);
        if (markerRef.current) markerRef.current.style.display = markerVisible ? 'none' : 'block';
        if (labelRef.current) labelRef.current.style.display = markerVisible ? 'none' : 'block';
        if (!markerVisible) {
            const input = document.getElementById('wide-branching-input');
            if (input) {
                showXPath(getFullXPath(input));
            }
        }
    };
    
    const clickInput = () => {
        findAndClickInput('wide-branching-input').catch(err => {
            console.error('Error clicking input:', err);
        });
    };
    
    return (
        <ScenarioCard
            number={4}
            title="Heavy DOM - Wide Branching (1000+ elements)"
            description="File input in DOM with 1000+ sibling elements"
            badges={[{ type: 'danger', text: 'Performance' }]}
        >
            <div className="controls-bar">
                <button className="reveal-button" onClick={toggleMarker}>
                    📍 Show Input Location
                </button>
                <button className="click-here-button" onClick={clickInput}>
                    📁 Click Here to Upload
                </button>
            </div>
            <div className="test-area">
                <div className="heavy-dom-container" ref={containerRef} id="wide-branching-container"></div>
                <div className="file-list" ref={fileListRef} id="wide-branching-list"></div>
                <div className="status" ref={statusRef} id="wide-branching-status"></div>
            </div>
        </ScenarioCard>
    );
}

