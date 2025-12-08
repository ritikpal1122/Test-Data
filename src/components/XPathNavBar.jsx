import React from 'react';
import { useXPath } from '../contexts/XPathContext';

export function XPathNavBar() {
    const { xpath, isVisible, hideXPath, copyXPath } = useXPath();
    const [copied, setCopied] = React.useState(false);
    
    if (!isVisible) return null;
    
    const handleCopy = async () => {
        const success = await copyXPath();
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    
    return (
        <div className="top-nav-bar">
            <div className="xpath-nav-content">
                <div className="xpath-label">XPath:</div>
                <div className="xpath-value">{xpath}</div>
                <div className="xpath-actions">
                    <button 
                        className={`xpath-copy-btn ${copied ? 'copied' : ''}`}
                        onClick={handleCopy}
                    >
                        {copied ? '✓ Copied!' : '📋 Copy'}
                    </button>
                    <button 
                        className="xpath-close-btn"
                        onClick={hideXPath}
                        title="Close"
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
}

