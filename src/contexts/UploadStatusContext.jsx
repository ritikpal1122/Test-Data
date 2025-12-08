import React, { createContext, useContext, useState, useEffect } from 'react';
import { createUploadStatusStore } from '../utils/uploadStatus';

const UploadStatusContext = createContext();

export function UploadStatusProvider({ children }) {
    const [store] = useState(() => createUploadStatusStore());
    const [statuses, setStatuses] = useState(store.getAllStatuses());
    const [mostRecentScenario, setMostRecentScenario] = useState(null);
    
    useEffect(() => {
        const unsubscribe = store.subscribe((newStatuses, mostRecent) => {
            setStatuses(newStatuses);
            setMostRecentScenario(mostRecent);
        });
        return unsubscribe;
    }, [store]);
    
    const updateStatus = (scenarioNumber, files) => {
        store.updateStatus(scenarioNumber, files);
    };
    
    return (
        <UploadStatusContext.Provider value={{ statuses, updateStatus, mostRecentScenario }}>
            {children}
        </UploadStatusContext.Provider>
    );
}

export function useUploadStatus() {
    const context = useContext(UploadStatusContext);
    if (!context) {
        throw new Error('useUploadStatus must be used within UploadStatusProvider');
    }
    return context;
}

