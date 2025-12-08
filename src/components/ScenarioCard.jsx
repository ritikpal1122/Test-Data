import React from 'react';
import { useUploadStatus } from '../contexts/UploadStatusContext';

export function ScenarioCard({ 
    number, 
    title, 
    description, 
    badges = [], 
    children 
}) {
    const { statuses } = useUploadStatus();
    const status = statuses[number];
    const isUploaded = status?.uploaded || false;
    
    const copyLink = () => {
        const url = `${window.location.origin}${window.location.pathname}#scenario-${number}`;
        navigator.clipboard.writeText(url);
    };
    
    return (
        <div className="scenario-card">
            <div className="scenario-title">
                {number}. {title}
                {badges.map((badge, idx) => (
                    <span key={idx} className={badge.type === 'warning' ? 'warning-badge' : 'danger-badge'}>
                        {badge.text}
                    </span>
                ))}
                <span className={`upload-status-badge ${isUploaded ? 'uploaded' : 'not-uploaded'}`}>
                    {isUploaded ? 'Uploaded' : 'Not Uploaded'}
                </span>
                <button
                    onClick={copyLink}
                    style={{
                        padding: '4px 10px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: '500',
                        marginLeft: '8px'
                    }}
                    title="Copy direct link to this scenario"
                >
                    🔗 Copy Link
                </button>
            </div>
            <div className="scenario-description">{description}</div>
            {children}
        </div>
    );
}

