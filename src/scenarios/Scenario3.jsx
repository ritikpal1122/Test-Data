import React, { useEffect, useRef, useState } from 'react';
import { ScenarioCard } from '../components/ScenarioCard';
import { useFileUpload } from '../hooks/useFileUpload';
import { findAndClickInput } from '../utils/fileUtils';
import { useXPath } from '../contexts/XPathContext';
import { getFullXPath } from '../utils/fileUtils';

export function Scenario3() {
    const containerRef = useRef(null);
    const { handleFileChange, fileListRef, statusRef } = useFileUpload(3, 'deep-nesting-input');
    const { showXPath } = useXPath();
    const [markerVisible, setMarkerVisible] = useState(false);
    const markerRef = useRef(null);
    const labelRef = useRef(null);
    
    useEffect(() => {
        if (!containerRef.current) return;
        
        function createDeepNesting(container, depth, currentDepth = 0) {
            if (currentDepth >= depth) {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.id = 'deep-nesting-input';
                input.style.cssText = 'position: absolute; top: 10px; left: 10px; z-index: 1;';
                input.addEventListener('change', handleFileChange);
                container.appendChild(input);
                return container;
            }
            const div = document.createElement('div');
            div.className = 'dom-layer deep';
            div.style.cssText = `position: relative; padding: ${20 - currentDepth}px; margin: 5px; border: 1px solid #ccc; background: ${currentDepth % 2 === 0 ? '#f9f9f9' : '#ffffff'};`;
            div.textContent = `Level ${currentDepth + 1}`;
            container.appendChild(div);
            createDeepNesting(div, depth, currentDepth + 1);
            return container;
        }
        
        createDeepNesting(containerRef.current, 50);
        
        // Add markers
        setTimeout(() => {
            const input = document.getElementById('deep-nesting-input');
            if (input && containerRef.current) {
                const rect = input.getBoundingClientRect();
                const containerRect = containerRef.current.getBoundingClientRect();
                const top = rect.top - containerRect.top + containerRef.current.scrollTop;
                const left = rect.left - containerRect.left + containerRef.current.scrollLeft;
                
                const marker = document.createElement('div');
                marker.className = 'input-marker';
                marker.id = 'marker-deep-nesting';
                marker.style.cssText = `position: absolute; top: ${top}px; left: ${left}px; width: ${rect.width}px; height: ${rect.height}px; z-index: 1000; display: none;`;
                containerRef.current.appendChild(marker);
                markerRef.current = marker;
                
                const label = document.createElement('div');
                label.className = 'input-label';
                label.id = 'label-deep-nesting';
                label.textContent = '📎 File Input (50 levels deep)';
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
            const input = document.getElementById('deep-nesting-input');
            if (input) {
                showXPath(getFullXPath(input));
            }
        }
    };
    
    const clickInput = () => {
        findAndClickInput('deep-nesting-input').catch(err => {
            console.error('Error clicking input:', err);
        });
    };
    
    return (
        <ScenarioCard
            number={3}
            title="Heavy DOM - Deep Nesting (50 levels)"
            description="File input nested 50 levels deep in DOM tree"
            badges={[{ type: 'danger', text: 'Max Stack Risk' }]}
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
                <div className="heavy-dom-container" ref={containerRef} id="deep-nesting-container"></div>
                <div className="file-list" ref={fileListRef} id="deep-nesting-list"></div>
                <div className="status" ref={statusRef} id="deep-nesting-status"></div>
            </div>
        </ScenarioCard>
    );
}

