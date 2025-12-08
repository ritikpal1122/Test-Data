import { useRef, useCallback } from 'react';
import { useUploadStatus } from '../contexts/UploadStatusContext';
import { useXPath } from '../contexts/XPathContext';
import { getFullXPath, formatFileSize } from '../utils/fileUtils';

export function useFileUpload(scenarioNumber, inputId) {
    const { updateStatus } = useUploadStatus();
    const { showXPath } = useXPath();
    const fileListRef = useRef(null);
    const statusRef = useRef(null);
    
    const handleFileChange = useCallback((event) => {
        const files = Array.from(event.target.files || []);
        
        if (fileListRef.current) {
            fileListRef.current.innerHTML = '';
            files.forEach(file => {
                const div = document.createElement('div');
                div.className = 'file-item';
                div.textContent = `${file.name} (${formatFileSize(file.size)})`;
                fileListRef.current.appendChild(div);
            });
        }
        
        if (statusRef.current) {
            statusRef.current.textContent = `${files.length} file(s) selected`;
            statusRef.current.className = 'status success';
        }
        
        if (files.length > 0) {
            updateStatus(scenarioNumber, files);
        }
    }, [scenarioNumber, updateStatus]);
    
    const showInputLocation = useCallback(() => {
        const input = document.getElementById(inputId);
        if (input) {
            const xpath = getFullXPath(input);
            showXPath(xpath);
        }
    }, [inputId, showXPath]);
    
    const clickInput = useCallback(() => {
        const input = document.getElementById(inputId);
        if (input) {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                input.click();
            }, 100);
        }
    }, [inputId]);
    
    return {
        handleFileChange,
        showInputLocation,
        clickInput,
        fileListRef,
        statusRef
    };
}

