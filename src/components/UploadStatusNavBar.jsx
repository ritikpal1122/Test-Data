import React, { useState, useEffect } from 'react';
import { useUploadStatus } from '../contexts/UploadStatusContext';

export function UploadStatusNavBar() {
    const { statuses } = useUploadStatus();
    const [collapsed, setCollapsed] = useState(false);
    
    useEffect(() => {
        // Ensure body has the class on mount
        document.body.classList.add('has-upload-nav');
        
        return () => {
            // Cleanup on unmount
            document.body.classList.remove('has-upload-nav');
        };
    }, []);
    
    useEffect(() => {
        if (collapsed) {
            document.body.classList.remove('has-upload-nav');
        } else {
            document.body.classList.add('has-upload-nav');
        }
    }, [collapsed]);
    
    const uploadedCount = Object.values(statuses).filter(s => s.uploaded).length;
    
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };
    
    const refreshStatus = () => {
        // Status is already reactive through context
        window.location.reload();
    };
    
    return (
        <div className={`upload-status-navbar ${collapsed ? 'collapsed' : ''}`}>
            <div className="upload-status-title">
                📊 Upload Status: <span style={{ color: uploadedCount === 15 ? '#fff' : uploadedCount > 0 ? '#ffc107' : '#ffc107' }}>
                    {uploadedCount}/15 Uploaded
                </span>
            </div>
            {!collapsed && (
                <div className="upload-status-scenarios">
                    {Array.from({ length: 15 }, (_, i) => {
                        const scenarioNum = i + 1;
                        const status = statuses[scenarioNum];
                        const isUploaded = status?.uploaded || false;
                        
                        return (
                            <div
                                key={scenarioNum}
                                className={`scenario-status-item ${isUploaded ? 'uploaded' : 'not-uploaded'}`}
                                title={`Scenario ${scenarioNum}: ${isUploaded ? 'Uploaded' : 'Not Uploaded'}`}
                            >
                                S{scenarioNum}: {isUploaded ? '✓' : '✗'}
                            </div>
                        );
                    })}
                </div>
            )}
            <div className="upload-nav-actions">
                <button 
                    className="upload-nav-btn toggle"
                    onClick={toggleCollapse}
                    title="Toggle Navbar"
                >
                    {collapsed ? '+' : '−'}
                </button>
                <button 
                    className="upload-nav-btn"
                    onClick={refreshStatus}
                    title="Refresh"
                >
                    🔄
                </button>
            </div>
        </div>
    );
}

