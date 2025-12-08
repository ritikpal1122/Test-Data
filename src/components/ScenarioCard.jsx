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
            </div>
            <div className="scenario-description">{description}</div>
            {children}
        </div>
    );
}

