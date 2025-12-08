import React, { useRef, useState } from 'react';
import { ScenarioCard } from '../components/ScenarioCard';
import { useFileUpload } from '../hooks/useFileUpload';

export function Scenario2() {
    const { handleFileChange, showInputLocation, clickInput, fileListRef, statusRef } = useFileUpload(2, 'hidden-behind-multi');
    const markerRef = useRef(null);
    const labelRef = useRef(null);
    const [markerVisible, setMarkerVisible] = useState(false);
    
    const toggleMarker = () => {
        setMarkerVisible(!markerVisible);
        if (markerRef.current) markerRef.current.style.display = markerVisible ? 'none' : 'block';
        if (labelRef.current) labelRef.current.style.display = markerVisible ? 'none' : 'block';
        if (!markerVisible) showInputLocation();
    };
    
    return (
        <ScenarioCard
            number={2}
            title="Hidden Behind Multiple Overlapping Divs"
            description="File input covered by multiple overlapping divs with different z-indexes"
            badges={[{ type: 'danger', text: 'Complex' }]}
        >
            <div className="controls-bar">
                <button className="reveal-button" onClick={toggleMarker}>
                    📍 Show Input Location
                </button>
                <button className="click-here-button" onClick={clickInput}>
                    📁 Upload - Scenario 2
                </button>
            </div>
            <div className="test-area" id="test-area-hidden-behind-multi" style={{ height: '250px' }}>
                <input
                    type="file"
                    id="hidden-behind-multi"
                    name="scenario-2-upload"
                    multiple
                    onChange={handleFileChange}
                    style={{ position: 'absolute', top: '100px', left: '100px', zIndex: 1, width: '200px', height: '40px' }}
                />
                <div
                    ref={markerRef}
                    className="input-marker"
                    id="marker-hidden-behind-multi"
                    style={{ top: '100px', left: '100px', width: '200px', height: '40px', display: 'none', zIndex: 1000 }}
                />
                <div
                    ref={labelRef}
                    className="input-label"
                    id="label-hidden-behind-multi"
                    style={{ top: '80px', left: '100px', display: 'none', zIndex: 1001 }}
                >
                    📎 File Input Here (Under Layers)
                </div>
                <div className="z-index-layer z-index-1">Layer 1 (z-index: 1)</div>
                <div className="z-index-layer z-index-2">Layer 2 (z-index: 2)</div>
                <div className="z-index-layer z-index-3">Layer 3 (z-index: 3)</div>
                <div className="z-index-layer z-index-4">Layer 4 (z-index: 4)</div>
                <div className="z-index-layer z-index-5">Layer 5 (z-index: 5) - Covers Input</div>
                <div className="file-list" ref={fileListRef} id="hidden-behind-multi-list" style={{ position: 'relative', zIndex: 10, marginTop: '200px' }}></div>
                <div className="status" ref={statusRef} id="hidden-behind-multi-status" style={{ position: 'relative', zIndex: 10 }}></div>
            </div>
        </ScenarioCard>
    );
}

