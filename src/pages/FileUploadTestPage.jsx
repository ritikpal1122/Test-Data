import React, { useEffect } from 'react';
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
    
    // Scroll to section on page load if hash is present
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            setTimeout(() => {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, []);
    
    return (
        <UploadStatusProvider>
            <XPathProvider>
                <XPathNavBar />
                <button
                    onClick={() => navigate('/')}
                    style={{
                        position: 'fixed',
                        top: '10px',
                        right: '20px',
                        zIndex: 10005,
                        background: '#667eea',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.95em',
                        transition: 'all 0.3s ease',
                        fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#5568d3';
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#667eea';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    ← Back to Home
                </button>
                
                <div className="container" style={{ paddingTop: '0px' }}>
                    <StatusDisplayPanel />
                    <div className="header" style={{ marginTop: '20px' }}>
                        <h1>🔍 Comprehensive File Upload Test - Complex DOM Scenarios</h1>
                        <p>Testing file uploads in complex, heavy DOM structures with overlapping elements</p>
                    </div>
                    
                    <div className="scenario-grid">
                        <div id="scenario-1"><Scenario1 /></div>
                        <div id="scenario-2"><Scenario2 /></div>
                        <div id="scenario-3"><Scenario3 /></div>
                        <div id="scenario-4"><Scenario4 /></div>
                        <div id="scenario-5"><Scenario5 /></div>
                        <div id="scenario-6"><Scenario6 /></div>
                        <div id="scenario-7"><Scenario7 /></div>
                        <div id="scenario-8"><Scenario8 /></div>
                        <div id="scenario-9"><Scenario9 /></div>
                        <div id="scenario-10"><Scenario10 /></div>
                        <div id="scenario-11"><Scenario11 /></div>
                        <div id="scenario-12"><Scenario12 /></div>
                        <div id="scenario-13"><Scenario13 /></div>
                        <div id="scenario-14"><Scenario14 /></div>
                        <div id="scenario-15"><Scenario15 /></div>
                    </div>
                </div>
            </XPathProvider>
        </UploadStatusProvider>
    );
}

