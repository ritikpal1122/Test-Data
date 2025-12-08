import React, { createContext, useContext, useState } from 'react';

const XPathContext = createContext();

export function XPathProvider({ children }) {
    const [xpath, setXpath] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    
    const showXPath = (newXpath) => {
        setXpath(newXpath);
        setIsVisible(true);
        document.body.classList.add('has-nav');
    };
    
    const hideXPath = () => {
        setXpath('');
        setIsVisible(false);
        document.body.classList.remove('has-nav');
    };
    
    const copyXPath = async () => {
        if (xpath) {
            try {
                await navigator.clipboard.writeText(xpath);
                return true;
            } catch (err) {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = xpath;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                return true;
            }
        }
        return false;
    };
    
    return (
        <XPathContext.Provider value={{ xpath, isVisible, showXPath, hideXPath, copyXPath }}>
            {children}
        </XPathContext.Provider>
    );
}

export function useXPath() {
    const context = useContext(XPathContext);
    if (!context) {
        throw new Error('useXPath must be used within XPathProvider');
    }
    return context;
}

