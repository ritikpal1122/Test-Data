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
            
            // Create realistic modal content
            const modalContent = document.createElement('div');
            modalContent.style.cssText = 'padding: 20px; background: white; border-radius: 8px; max-width: 500px;';
            
            // Header
            const header = document.createElement('div');
            header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0;';
            header.innerHTML = `
                <div>
                    <div style="font-size: 20px; font-weight: 600; color: #333; margin-bottom: 4px;">Upload Files</div>
                    <div style="font-size: 13px; color: #666;">Select files from your device</div>
                </div>
                <button style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">×</button>
            `;
            modalContent.appendChild(header);
            
            // File type tabs
            const tabs = document.createElement('div');
            tabs.style.cssText = 'display: flex; gap: 8px; margin-bottom: 20px;';
            tabs.innerHTML = `
                <div style="padding: 8px 16px; background: #007bff; color: white; border-radius: 6px; font-size: 13px; cursor: pointer;">📄 Files</div>
                <div style="padding: 8px 16px; background: #f0f0f0; color: #666; border-radius: 6px; font-size: 13px; cursor: pointer;">🖼️ Images</div>
                <div style="padding: 8px 16px; background: #f0f0f0; color: #666; border-radius: 6px; font-size: 13px; cursor: pointer;">📹 Videos</div>
            `;
            modalContent.appendChild(tabs);
            
            // Recent uploads section
            const recentSection = document.createElement('div');
            recentSection.style.cssText = 'margin-bottom: 20px;';
            recentSection.innerHTML = `
                <div style="font-size: 14px; font-weight: 500; color: #333; margin-bottom: 12px;">Recent Uploads</div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 6px;">
                        <div style="font-size: 20px; margin-right: 12px;">📄</div>
                        <div style="flex: 1;">
                            <div style="font-size: 13px; font-weight: 500; color: #333;">document.pdf</div>
                            <div style="font-size: 11px; color: #888;">Uploaded 2 hours ago</div>
                        </div>
                        <div style="font-size: 11px; color: #666;">2.4 MB</div>
                    </div>
                    <div style="display: flex; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 6px;">
                        <div style="font-size: 20px; margin-right: 12px;">🖼️</div>
                        <div style="flex: 1;">
                            <div style="font-size: 13px; font-weight: 500; color: #333;">image.jpg</div>
                            <div style="font-size: 11px; color: #888;">Uploaded yesterday</div>
                        </div>
                        <div style="font-size: 11px; color: #666;">1.8 MB</div>
                    </div>
                    <div style="display: flex; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 6px;">
                        <div style="font-size: 20px; margin-right: 12px;">📹</div>
                        <div style="flex: 1;">
                            <div style="font-size: 13px; font-weight: 500; color: #333;">video.mp4</div>
                            <div style="font-size: 11px; color: #888;">Uploaded 3 days ago</div>
                        </div>
                        <div style="font-size: 11px; color: #666;">15.2 MB</div>
                    </div>
                </div>
            `;
            modalContent.appendChild(recentSection);
            
            // Upload area
            const uploadArea = document.createElement('div');
            uploadArea.style.cssText = 'position: relative; padding: 24px; background: #f0f7ff; border: 2px dashed #007bff; border-radius: 8px; text-align: center;';
            uploadArea.innerHTML = `
                <div style="font-size: 36px; margin-bottom: 12px;">📤</div>
                <div style="font-size: 15px; font-weight: 500; color: #333; margin-bottom: 6px;">Drop files here or click to browse</div>
                <div style="font-size: 12px; color: #666; margin-bottom: 16px;">Supports: PDF, JPG, PNG, MP4 (Max 50MB)</div>
            `;
            modalContent.appendChild(uploadArea);
            
            // Footer buttons
            const footer = document.createElement('div');
            footer.style.cssText = 'display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e0e0e0;';
            footer.innerHTML = `
                <button style="padding: 10px 20px; background: #f0f0f0; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">Cancel</button>
                <button style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">Upload</button>
            `;
            modalContent.appendChild(footer);
            
            heavyDOMRef.current.appendChild(modalContent);
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
            title="Portal + Heavy DOM + Hidden (Real-world Upload Modal)"
            description="File input in modal dialog rendered via React Portal with upload interface, covered by overlay"
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
                    Open Upload Modal
                </button>
                <div className="file-list" ref={fileListRef} id="portal-heavy-list"></div>
                <div className="status" ref={statusRef} id="portal-heavy-status"></div>
            </div>
            {portalVisible && (
                <div className="portal-container" ref={portalRef} id="portal-heavy-container" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10000, background: 'rgba(0,0,0,0.5)', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'relative', maxHeight: '90vh', overflow: 'auto' }}>
                        <div className="heavy-dom-container" style={{ position: 'relative' }}>
                            <div ref={heavyDOMRef} id="portal-heavy-dom"></div>
                            <input
                                type="file"
                                id="portal-heavy-input"
                                name="scenario-13-upload"
                                multiple
                                onChange={handleFileChange}
                                style={{ position: 'absolute', top: '200px', left: '150px', zIndex: 1, width: '200px', height: '40px', opacity: 0 }}
                            />
                            <div className="z-index-layer" style={{ zIndex: 10, top: '190px', left: '140px', width: '220px', height: '100px' }}>
                                Modal Overlay
                            </div>
                        </div>
                        <div className="file-list" id="portal-heavy-upload-list"></div>
                    </div>
                </div>
            )}
        </ScenarioCard>
    );
}

