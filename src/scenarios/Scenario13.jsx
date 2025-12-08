import React, { useEffect, useRef, useState } from 'react';
import { ScenarioCard } from '../components/ScenarioCard';
import { useFileUpload } from '../hooks/useFileUpload';
import { useXPath } from '../contexts/XPathContext';
import { getFullXPath } from '../utils/fileUtils';

export function Scenario13() {
    const portalRef = useRef(null);
    const heavyDOMRef = useRef(null);
    const { handleFileChange, fileListRef, statusRef } = useFileUpload(13, 'portal-heavy-input');
    const { showXPath } = useXPath();
    const [portalVisible, setPortalVisible] = useState(false);
    
    useEffect(() => {
        if (portalVisible && heavyDOMRef.current) {
            heavyDOMRef.current.innerHTML = '';
            for (let i = 0; i < 300; i++) {
                const div = document.createElement('div');
                div.className = 'dom-layer';
                div.textContent = `Portal Element ${i + 1}`;
                heavyDOMRef.current.appendChild(div);
            }
        }
    }, [portalVisible]);
    
    const openPortal = () => {
        setPortalVisible(true);
    };
    
    const closePortal = () => {
        setPortalVisible(false);
    };
    
    const showInputLocation = () => {
        if (!portalVisible) {
            openPortal();
            setTimeout(() => {
                const input = document.getElementById('portal-heavy-input');
                if (input) {
                    showXPath(getFullXPath(input));
                }
            }, 100);
        } else {
            const input = document.getElementById('portal-heavy-input');
            if (input) {
                showXPath(getFullXPath(input));
            }
        }
    };
    
    return (
        <ScenarioCard
            number={13}
            title="Portal + Heavy DOM + Hidden"
            description="File input rendered in portal with heavy DOM, hidden behind divs"
            badges={[{ type: 'warning', text: 'Portal' }]}
        >
            <div className="controls-bar">
                <button className="reveal-button" onClick={showInputLocation}>
                    📍 Show Input Location
                </button>
                <button className="click-here-button" onClick={() => {
                    if (!portalVisible) openPortal();
                    setTimeout(() => {
                        const input = document.getElementById('portal-heavy-input');
                        if (input) input.click();
                    }, 100);
                }}>
                    📁 Upload - Scenario 13
                </button>
            </div>
            <div className="test-area">
                <button className="upload-button" id="portal-heavy-trigger" onClick={openPortal}>
                    Open Portal with Heavy DOM
                </button>
                <div className="file-list" ref={fileListRef} id="portal-heavy-list"></div>
                <div className="status" ref={statusRef} id="portal-heavy-status"></div>
            </div>
            {portalVisible && (
                <div className="portal-container" ref={portalRef} id="portal-heavy-container">
                    <h3>Portal with Heavy DOM</h3>
                    <div className="heavy-dom-container" style={{ height: '200px', position: 'relative' }}>
                        <div ref={heavyDOMRef} id="portal-heavy-dom"></div>
                        <input
                            type="file"
                            id="portal-heavy-input"
                            name="scenario-13-upload"
                            multiple
                            onChange={handleFileChange}
                            style={{ position: 'absolute', top: '50px', left: '50px', zIndex: 1 }}
                        />
                        <div className="z-index-layer" style={{ zIndex: 10, top: '40px', left: '40px', width: '200px', height: '80px' }}>
                            Portal Overlay
                        </div>
                    </div>
                    <div className="file-list" id="portal-heavy-upload-list"></div>
                    <button className="upload-button" onClick={closePortal} style={{ marginTop: '10px' }}>
                        Close
                    </button>
                </div>
            )}
        </ScenarioCard>
    );
}

