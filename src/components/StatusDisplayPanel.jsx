import React from 'react';
import { useUploadStatus } from '../contexts/UploadStatusContext';

export function StatusDisplayPanel() {
    const { statuses, mostRecentScenario } = useUploadStatus();
    
    // Show only the most recently uploaded scenario
    const recentStatus = mostRecentScenario ? statuses[mostRecentScenario] : null;
    const hasRecentUpload = recentStatus?.uploaded && recentStatus?.files && recentStatus.files.length > 0;
    
    return (
        <div style={{ 
            position: 'sticky',
            top: '0px',
            zIndex: 10003,
            background: '#f8f9fa', 
            border: '2px solid #dee2e6', 
            borderRadius: '0 0 6px 6px', 
            padding: '10px 15px', 
            marginBottom: '15px',
            marginLeft: '0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
            <h2 style={{ 
                margin: '0 0 8px 0', 
                color: '#333',
                fontSize: '1.1em',
                fontWeight: 'bold'
            }}>🧪 Upload Status & Assertions</h2>
            {!hasRecentUpload ? (
                <div style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    color: '#666',
                    background: 'white',
                    borderRadius: '4px',
                    border: '1px dashed #ddd',
                    fontSize: '0.9em'
                }}>
                    <p style={{ margin: 0 }}>
                        No files uploaded yet. Upload a file to any scenario to see it here.
                    </p>
                </div>
            ) : (
                <div style={{ 
                    padding: '8px 10px', 
                    background: 'white', 
                    borderRadius: '4px', 
                    border: '2px solid #28a745',
                    boxShadow: '0 1px 4px rgba(40, 167, 69, 0.2)'
                }}>
                    <div style={{ 
                        marginBottom: '6px',
                        fontSize: '0.9em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <strong style={{ fontSize: '0.95em' }}>Scenario {mostRecentScenario}:</strong>
                        <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '0.9em' }}>
                            ✓ Uploaded
                        </span>
                    </div>
                    {recentStatus.files.length > 0 && (
                        <div style={{ 
                            marginTop: '6px', 
                            paddingTop: '6px', 
                            borderTop: '1px solid #ddd',
                            fontSize: '0.85em'
                        }}>
                            <strong style={{ color: '#666', fontSize: '0.9em' }}>Files:</strong>
                            <div style={{ 
                                marginTop: '4px',
                                color: '#333',
                                lineHeight: '1.4'
                            }}>
                                {recentStatus.files.map((file, idx) => (
                                    <div key={idx} style={{ 
                                        margin: '2px 0',
                                        paddingLeft: '8px',
                                        fontSize: '0.85em'
                                    }}>
                                        • {file.name || `File ${idx + 1}`}
                                        {file.size && (
                                            <span style={{ color: '#666', fontSize: '0.8em', marginLeft: '6px' }}>
                                                ({(file.size / 1024).toFixed(2)} KB)
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
