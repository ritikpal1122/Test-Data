import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadStatusProvider } from '../contexts/UploadStatusContext';
import { XPathProvider } from '../contexts/XPathContext';
import { XPathNavBar } from '../components/XPathNavBar';
import { UploadStatusNavBar } from '../components/UploadStatusNavBar';
import { StatusDisplayPanel } from '../components/StatusDisplayPanel';
import { Scenario1 } from '../scenarios/Scenario1';
import { Scenario2 } from '../scenarios/Scenario2';
import { Scenario3 } from '../scenarios/Scenario3';
import { Scenario4 } from '../scenarios/Scenario4';
import { Scenario5 } from '../scenarios/Scenario5';
import { Scenario6 } from '../scenarios/Scenario6';
import { Scenario7 } from '../scenarios/Scenario7';
import { Scenario8 } from '../scenarios/Scenario8';
import { Scenario9 } from '../scenarios/Scenario9';
import { Scenario10 } from '../scenarios/Scenario10';
import { Scenario11 } from '../scenarios/Scenario11';
import { Scenario12 } from '../scenarios/Scenario12';
import { Scenario13 } from '../scenarios/Scenario13';
import { Scenario14 } from '../scenarios/Scenario14';
import { Scenario15 } from '../scenarios/Scenario15';

export function FileUploadTestPage() {
    const navigate = useNavigate();
    
    return (
        <UploadStatusProvider>
            <XPathProvider>
                <div style={{
                    position: 'fixed',
                    top: '60px',
                    left: '20px',
                    zIndex: 10002,
                    background: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    cursor: 'pointer'
                }}
                onClick={() => navigate('/')}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#667eea';
                    e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = 'black';
                }}
                >
                    ← Back to Home
                </div>
                
                <XPathNavBar />
                <div className="container">
                    <div className="header">
                        <h1>🔍 Comprehensive File Upload Test - Complex DOM Scenarios</h1>
                        <p>Testing file uploads in complex, heavy DOM structures with overlapping elements</p>
                    </div>
                    
                    <StatusDisplayPanel />
                    
                    <div className="scenario-grid">
                        <Scenario1 />
                        <Scenario2 />
                        <Scenario3 />
                        <Scenario4 />
                        <Scenario5 />
                        <Scenario6 />
                        <Scenario7 />
                        <Scenario8 />
                        <Scenario9 />
                        <Scenario10 />
                        <Scenario11 />
                        <Scenario12 />
                        <Scenario13 />
                        <Scenario14 />
                        <Scenario15 />
                    </div>
                </div>
            </XPathProvider>
        </UploadStatusProvider>
    );
}

