import React from 'react';
import { useUploadStatus } from '../contexts/UploadStatusContext';

export function StatusDisplayPanel() {
    const { statuses } = useUploadStatus();
    
    // Filter to show only uploaded scenarios
    const uploadedScenarios = Array.from({ length: 15 }, (_, i) => {
        const scenarioNum = i + 1;
        const status = statuses[scenarioNum];
        if (status?.uploaded && status?.files && status.files.length > 0) {
            return { scenarioNum, status };
        }
        return null;
    }).filter(item => item !== null);
    
    return (
        <div style={{ 
            position: 'sticky',
            top: '20px',
            zIndex: 1000,
            background: '#f8f9fa', 
            border: '2px solid #dee2e6', 
            borderRadius: '8px', 
            padding: '20px', 
            marginBottom: '30px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}>
            <h2 style={{ marginBottom: '15px', color: '#333' }}>🧪 Upload Status & Assertions</h2>
            {uploadedScenarios.length === 0 ? (
                <div style={{ 
                    padding: '30px', 
                    textAlign: 'center', 
                    color: '#666',
                    background: 'white',
                    borderRadius: '4px',
                    border: '1px dashed #ddd'
                }}>
                    <p style={{ margin: 0, fontSize: '1.1em' }}>
                        No files uploaded yet. Upload a file to any scenario to see it here.
                    </p>
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '10px', 
                    maxHeight: '500px', 
                    overflowY: 'auto',
                    paddingRight: '5px'
                }}
                className="status-panel-scroll"
                >
                    {uploadedScenarios.map(({ scenarioNum, status }) => {
                        const files = status.files || [];
                        
                        return (
                            <div key={scenarioNum} style={{ 
                                padding: '12px', 
                                background: 'white', 
                                borderRadius: '4px', 
                                border: '2px solid #28a745',
                                boxShadow: '0 2px 8px rgba(40, 167, 69, 0.2)'
                            }}>
                                <div style={{ marginBottom: '8px' }}>
                                    <strong>Scenario {scenarioNum}:</strong>{' '}
                                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                                        ✓ Uploaded
                                    </span>
                                </div>
                                {files.length > 0 && (
                                    <div style={{ 
                                        marginTop: '8px', 
                                        paddingTop: '8px', 
                                        borderTop: '1px solid #ddd',
                                        fontSize: '0.9em'
                                    }}>
                                        <strong style={{ color: '#666' }}>Files:</strong>
                                        <ul style={{ 
                                            margin: '4px 0 0 0', 
                                            paddingLeft: '20px',
                                            color: '#333',
                                            listStyle: 'disc'
                                        }}>
                                            {files.map((file, idx) => (
                                                <li key={idx} style={{ margin: '2px 0' }}>
                                                    {file.name || `File ${idx + 1}`}
                                                    {file.size && (
                                                        <span style={{ color: '#666', fontSize: '0.85em', marginLeft: '8px' }}>
                                                            ({(file.size / 1024).toFixed(2)} KB)
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
