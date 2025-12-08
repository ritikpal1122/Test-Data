// Upload status management
const INPUT_TO_SCENARIO = {
    'hidden-behind-1': 1,
    'hidden-behind-multi': 2,
    'deep-nesting-input': 3,
    'wide-branching-input': 4,
    'heavy-hidden-input': 5,
    'iframe-heavy-input': 6,
    'shadow-heavy-input': 7,
    'nested-shadow-heavy-input': 8,
    'shadow-iframe-input': 9,
    'react-multi-heavy-input-0': 10,
    'react-multi-heavy-input-1': 10,
    'react-multi-heavy-input-2': 10,
    'virtualized-hidden-input': 11,
    'slot-heavy-input': 12,
    'portal-heavy-input': 13,
    'cross-heavy-input': 14,
    'ultimate-input': 15
};

export function getScenarioFromInputId(inputId) {
    return INPUT_TO_SCENARIO[inputId] || null;
}

export function createUploadStatusStore() {
    const statuses = {};
    const listeners = new Set();
    let mostRecentScenario = null;
    let mostRecentTimestamp = null;
    
    for (let i = 1; i <= 15; i++) {
        statuses[i] = { uploaded: false, files: [], timestamp: null };
    }
    
    return {
        getStatus(scenarioNumber) {
            return statuses[scenarioNumber] || { uploaded: false, files: [], timestamp: null };
        },
        
        getAllStatuses() {
            return { ...statuses };
        },
        
        getMostRecent() {
            return mostRecentScenario;
        },
        
        updateStatus(scenarioNumber, files) {
            const timestamp = Date.now();
            statuses[scenarioNumber] = {
                uploaded: files && files.length > 0,
                files: files || [],
                timestamp: files && files.length > 0 ? timestamp : null
            };
            
            // Update most recent if this is a new upload
            if (files && files.length > 0) {
                if (!mostRecentTimestamp || timestamp > mostRecentTimestamp) {
                    mostRecentScenario = scenarioNumber;
                    mostRecentTimestamp = timestamp;
                }
            }
            
            listeners.forEach(listener => listener({ ...statuses }, mostRecentScenario));
        },
        
        subscribe(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        }
    };
}

