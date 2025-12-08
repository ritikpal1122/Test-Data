import React, { useEffect, useRef, useState } from 'react';
import { ScenarioCard } from '../components/ScenarioCard';
import { useFileUpload } from '../hooks/useFileUpload';
import { useXPath } from '../contexts/XPathContext';
import { getFullXPath } from '../utils/fileUtils';

export function Scenario10() {
    const root1Ref = useRef(null);
    const root2Ref = useRef(null);
    const root3Ref = useRef(null);
    const { handleFileChange, fileListRef, statusRef } = useFileUpload(10, 'react-multi-heavy-input-0');
    const { showXPath } = useXPath();
    const [markerVisible, setMarkerVisible] = useState(false);
    
    useEffect(() => {
        const roots = [
            { ref: root1Ref, id: 'react-root-1-heavy', index: 0 },
            { ref: root2Ref, id: 'react-root-2-heavy', index: 1 },
            { ref: root3Ref, id: 'react-root-3-heavy', index: 2 }
        ];
        
        roots.forEach(({ ref, id, index }) => {
            if (!ref.current) return;
            
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.id = `react-multi-heavy-input-${index}`;
            input.name = `scenario-10-upload-${index}`;
            input.style.cssText = 'position: absolute; top: 50px; left: 50px; z-index: 1;';
            input.addEventListener('change', handleFileChange);
            ref.current.appendChild(input);
            
            for (let i = 0; i < 200; i++) {
                const div = document.createElement('div');
                div.className = 'dom-layer';
                div.style.cssText = 'padding: 3px; margin: 1px; border: 1px solid #ccc; font-size: 10px;';
                div.textContent = `Root ${index + 1} - Element ${i + 1}`;
                ref.current.appendChild(div);
            }
            
            const overlay = document.createElement('div');
            overlay.className = 'z-index-layer';
            overlay.style.cssText = 'z-index: 10; top: 40px; left: 40px; width: 200px; height: 80px;';
            overlay.textContent = `Overlay Root ${index + 1}`;
            ref.current.appendChild(overlay);
        });
    }, [handleFileChange]);
    
    const showInputLocation = () => {
        const input = document.getElementById('react-multi-heavy-input-0');
        if (input) {
            showXPath(getFullXPath(input));
        }
    };
    
    const clickInputs = () => {
        const roots = ['react-root-1-heavy', 'react-root-2-heavy', 'react-root-3-heavy'];
        roots.forEach((rootId, index) => {
            const root = document.getElementById(rootId);
            if (root) {
                const input = root.querySelector(`#react-multi-heavy-input-${index}`);
                if (input) {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                        input.click();
                    }, 200);
                }
            }
        });
    };
    
    return (
        <ScenarioCard
            number={10}
            title="React Multi-root + Heavy DOM + Hidden"
            description="Multiple React roots with heavy DOM trees, file input hidden behind divs"
            badges={[{ type: 'danger', text: 'Max Stack Risk' }]}
        >
            <div className="controls-bar">
                <button className="reveal-button" onClick={showInputLocation}>
                    📍 Show All Input Locations
                </button>
                <button className="click-here-button" onClick={clickInputs}>
                    📁 Click All Inputs
                </button>
            </div>
            <div className="test-area" style={{ height: '400px' }}>
                <div ref={root1Ref} id="react-root-1-heavy" style={{ position: 'relative', height: '120px', overflow: 'auto', border: '1px solid #ccc', marginBottom: '10px' }}></div>
                <div ref={root2Ref} id="react-root-2-heavy" style={{ position: 'relative', height: '120px', overflow: 'auto', border: '1px solid #ccc', marginBottom: '10px' }}></div>
                <div ref={root3Ref} id="react-root-3-heavy" style={{ position: 'relative', height: '120px', overflow: 'auto', border: '1px solid #ccc' }}></div>
                <div className="file-list" ref={fileListRef} id="react-multi-heavy-list" style={{ position: 'relative', zIndex: 20 }}></div>
                <div className="status" ref={statusRef} id="react-multi-heavy-status" style={{ position: 'relative', zIndex: 20 }}></div>
            </div>
        </ScenarioCard>
    );
}

