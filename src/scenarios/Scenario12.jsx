import React, { useEffect, useRef, useState } from 'react';
import { ScenarioCard } from '../components/ScenarioCard';
import { useFileUpload } from '../hooks/useFileUpload';
import { useXPath } from '../contexts/XPathContext';
import { getFullXPath } from '../utils/fileUtils';

export function Scenario12() {
    const { handleFileChange, showInputLocation, clickInput, fileListRef, statusRef } = useFileUpload(12, 'slot-heavy-input');
    const markerRef = useRef(null);
    const labelRef = useRef(null);
    const [markerVisible, setMarkerVisible] = useState(false);
    
    useEffect(() => {
        class CustomUploadSlotHeavy extends HTMLElement {
            constructor() {
                super();
                // Check if shadow root already exists (React StrictMode)
                if (!this.shadowRoot) {
                    const shadow = this.attachShadow({ mode: 'open' });
                    shadow.innerHTML = `
                        <style>
                            ::slotted(input[type="file"]) {
                                padding: 10px;
                                margin: 10px 0;
                            }
                            ::slotted(.heavy-dom-container) {
                                position: relative;
                            }
                        </style>
                        <slot name="file-input"></slot>
                    `;
                }
            }
        }
        
        if (!customElements.get('custom-upload-slot-heavy')) {
            customElements.define('custom-upload-slot-heavy', CustomUploadSlotHeavy);
        }
    }, []);
    
    const toggleMarker = () => {
        setMarkerVisible(!markerVisible);
        if (markerRef.current) markerRef.current.style.display = markerVisible ? 'none' : 'block';
        if (labelRef.current) labelRef.current.style.display = markerVisible ? 'none' : 'block';
        if (!markerVisible) {
            const input = document.getElementById('slot-heavy-input');
            if (input) {
                showXPath(getFullXPath(input));
            }
        }
    };
    
    return (
        <ScenarioCard
            number={12}
            title="Slot + Heavy DOM + Hidden"
            description="File input in slot element with heavy DOM, covered by overlay"
            badges={[{ type: 'danger', text: 'Complex' }]}
        >
            <div className="controls-bar">
                <button className="reveal-button" onClick={toggleMarker}>
                    📍 Show Input Location
                </button>
                <button className="click-here-button" onClick={clickInput}>
                    📁 Click Here to Upload
                </button>
            </div>
            <div className="test-area" id="test-area-slot-heavy" style={{ height: '300px', position: 'relative' }}>
                <custom-upload-slot-heavy>
                    <div className="heavy-dom-container" style={{ height: '150px', position: 'relative' }}>
                        <input
                            type="file"
                            slot="file-input"
                            id="slot-heavy-input"
                            name="scenario-12-upload"
                            multiple
                            onChange={handleFileChange}
                            style={{ position: 'absolute', top: '50px', left: '50px', zIndex: 1, width: '200px', height: '40px' }}
                        />
                        <div
                            ref={markerRef}
                            className="input-marker"
                            id="marker-slot-heavy"
                            style={{ top: '50px', left: '50px', width: '200px', height: '40px', display: 'none', zIndex: 1000 }}
                        />
                        <div
                            ref={labelRef}
                            className="input-label"
                            id="label-slot-heavy"
                            style={{ top: '30px', left: '50px', display: 'none', zIndex: 1001 }}
                        >
                            📎 File Input in Slot
                        </div>
                        <div className="z-index-layer" style={{ zIndex: 10, top: '40px', left: '40px', width: '200px', height: '80px' }}>
                            Overlay in slot
                        </div>
                    </div>
                </custom-upload-slot-heavy>
                <div className="file-list" ref={fileListRef} id="slot-heavy-list" style={{ position: 'relative', zIndex: 15, marginTop: '160px' }}></div>
                <div className="status" ref={statusRef} id="slot-heavy-status" style={{ position: 'relative', zIndex: 15 }}></div>
            </div>
        </ScenarioCard>
    );
}

