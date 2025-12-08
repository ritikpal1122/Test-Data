import React, { useRef, useState } from 'react';
import { ScenarioCard } from '../components/ScenarioCard';
import { useFileUpload } from '../hooks/useFileUpload';
import { useXPath } from '../contexts/XPathContext';
import { getFullXPath } from '../utils/fileUtils';

export function Scenario11() {
    const { handleFileChange, showInputLocation, clickInput, fileListRef, statusRef } = useFileUpload(11, 'virtualized-hidden-input');
    const { showXPath } = useXPath();
    
    const scrollToInput = () => {
        const input = document.getElementById('virtualized-hidden-input');
        if (input) {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                showXPath(getFullXPath(input));
            }, 500);
        }
    };
    
    return (
        <ScenarioCard
            number={11}
            title="Virtualized DOM + Hidden"
            description="File input in virtualized/lazy-loaded DOM, hidden behind overlay"
            badges={[{ type: 'warning', text: 'Lazy Load' }]}
        >
            <div className="controls-bar">
                <button className="reveal-button" onClick={scrollToInput}>
                    📍 Scroll to Input
                </button>
                <button className="click-here-button" onClick={clickInput}>
                    📁 Click Here to Upload
                </button>
            </div>
            <div className="test-area" style={{ height: '300px' }}>
                <div className="heavy-dom-container" id="virtualized-container" style={{ height: '200px' }}>
                    <div style={{ height: '5000px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '2000px', left: '50px' }}>
                            <input
                                type="file"
                                id="virtualized-hidden-input"
                                name="scenario-11-upload"
                                multiple
                                onChange={handleFileChange}
                                style={{ position: 'relative', zIndex: 1 }}
                            />
                            <div className="z-index-layer" style={{ zIndex: 10, top: '-10px', left: '-10px', width: '250px', height: '80px' }}>
                                Overlay in virtualized scroll
                            </div>
                        </div>
                    </div>
                </div>
                <div className="file-list" ref={fileListRef} id="virtualized-hidden-list"></div>
                <div className="status" ref={statusRef} id="virtualized-hidden-status"></div>
            </div>
        </ScenarioCard>
    );
}

