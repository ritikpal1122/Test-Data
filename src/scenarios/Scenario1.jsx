import React, { useRef, useEffect } from 'react';
import { ScenarioCard } from '../components/ScenarioCard';
import { useFileUpload } from '../hooks/useFileUpload';

export function Scenario1() {
    const { handleFileChange, showInputLocation, clickInput, fileListRef, statusRef } = useFileUpload(1, 'hidden-behind-1');
    const markerRef = useRef(null);
    const labelRef = useRef(null);
    const [markerVisible, setMarkerVisible] = React.useState(false);
    
    const toggleMarker = () => {
        setMarkerVisible(!markerVisible);
        if (markerRef.current) markerRef.current.style.display = markerVisible ? 'none' : 'block';
        if (labelRef.current) labelRef.current.style.display = markerVisible ? 'none' : 'block';
        if (!markerVisible) showInputLocation();
    };
    
    return (
        <ScenarioCard
            number={1}
            title="Hidden Behind Single Div"
            description="File input covered by a div with higher z-index"
            badges={[{ type: 'warning', text: 'Z-Index Issue' }]}
        >
            <div className="controls-bar">
                <button className="reveal-button" onClick={toggleMarker}>
                    📍 Show Input Location
                </button>
                <button className="click-here-button" onClick={clickInput}>
                    📁 Click Here to Upload
                </button>
            </div>
            <div className="test-area" id="test-area-hidden-behind-1">
                <input
                    type="file"
                    id="hidden-behind-1"
                    multiple
                    onChange={handleFileChange}
                    style={{ position: 'absolute', top: '50px', left: '50px', zIndex: 1, width: '200px', height: '40px' }}
                />
                <div
                    ref={markerRef}
                    className="input-marker"
                    id="marker-hidden-behind-1"
                    style={{ top: '50px', left: '50px', width: '200px', height: '40px', display: 'none' }}
                />
                <div
                    ref={labelRef}
                    className="input-label"
                    id="label-hidden-behind-1"
                    style={{ top: '30px', left: '50px', display: 'none' }}
                >
                    📎 File Input Here
                </div>
                <div className="overlay-div clickable" style={{ zIndex: 10 }}>
                    <p>This div covers the file input</p>
                </div>
                <div className="file-list" ref={fileListRef} id="hidden-behind-1-list"></div>
                <div className="status" ref={statusRef} id="hidden-behind-1-status"></div>
            </div>
        </ScenarioCard>
    );
}

