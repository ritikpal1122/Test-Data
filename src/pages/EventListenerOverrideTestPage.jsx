import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export function EventListenerOverrideTestPage() {
    const navigate = useNavigate();
    const [overrideActive, setOverrideActive] = useState(true);
    const [testResults, setTestResults] = useState([]);
    const [currentTestResult, setCurrentTestResult] = useState(null);
    const [eventLog, setEventLog] = useState([]);
    const [verificationResults, setVerificationResults] = useState([]);
    const buttonRef = useRef(null);
    const inputRef = useRef(null);
    const divRef = useRef(null);

    // Override addEventListener early - this simulates the problematic code
    useEffect(() => {
        if (!overrideActive) return;

        // Store original addEventListener
        if (!EventTarget.prototype._addEventListener) {
            EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener;

            // Override addEventListener (the problematic code)
            EventTarget.prototype.addEventListener = function (a, b, c) {
                if (c == undefined) c = false;
                this._addEventListener(a, b, c);

                if (!this.eventListenerList) this.eventListenerList = {};
                if (!this.eventListenerList[a]) this.eventListenerList[a] = [];

                this.eventListenerList[a].push({ listener: b, options: c });

                // Log the override
                setEventLog(prev => [...prev, {
                    type: 'addEventListener',
                    event: a,
                    target: this.tagName || this.constructor.name,
                    timestamp: new Date().toISOString()
                }]);
            };

            setTestResults(prev => [...prev, {
                test: 'addEventListener Override Applied',
                status: 'success',
                message: 'EventTarget.prototype.addEventListener has been overridden'
            }]);
        }

        return () => {
            // Cleanup: restore original if needed
            if (EventTarget.prototype._addEventListener) {
                EventTarget.prototype.addEventListener = EventTarget.prototype._addEventListener;
                delete EventTarget.prototype._addEventListener;
            }
        };
    }, [overrideActive]);

    // Test 1: Button click event
    useEffect(() => {
        if (!buttonRef.current || !overrideActive) return;

        const button = buttonRef.current;
        let clickWorked = false;

        const handleClick = () => {
            clickWorked = true;
            setTestResults(prev => [...prev, {
                test: 'Button Click Event',
                status: 'success',
                message: 'Button click event listener fired successfully'
            }]);
        };

        try {
            button.addEventListener('click', handleClick);
            setTestResults(prev => [...prev, {
                test: 'Button addEventListener Call',
                status: 'success',
                message: 'addEventListener called on button element'
            }]);
        } catch (error) {
            setTestResults(prev => [...prev, {
                test: 'Button addEventListener Call',
                status: 'error',
                message: `Error: ${error.message}`
            }]);
        }

        return () => {
            if (button && button.removeEventListener) {
                button.removeEventListener('click', handleClick);
            }
        };
    }, [overrideActive]);

    // Test 2: Input change event
    useEffect(() => {
        if (!inputRef.current || !overrideActive) return;

        const input = inputRef.current;
        let changeWorked = false;

        const handleChange = () => {
            changeWorked = true;
            setTestResults(prev => [...prev, {
                test: 'Input Change Event',
                status: 'success',
                message: 'Input change event listener fired successfully'
            }]);
        };

        try {
            input.addEventListener('change', handleChange);
            setTestResults(prev => [...prev, {
                test: 'Input addEventListener Call',
                status: 'success',
                message: 'addEventListener called on input element'
            }]);
        } catch (error) {
            setTestResults(prev => [...prev, {
                test: 'Input addEventListener Call',
                status: 'error',
                message: `Error: ${error.message}`
            }]);
        }

        return () => {
            if (input && input.removeEventListener) {
                input.removeEventListener('change', handleChange);
            }
        };
    }, [overrideActive]);

    // Test 3: Window load event
    useEffect(() => {
        if (!overrideActive) return;

        const handleLoad = () => {
            setTestResults(prev => [...prev, {
                test: 'Window Load Event',
                status: 'success',
                message: 'Window load event listener fired'
            }]);
        };

        try {
            window.addEventListener('load', handleLoad);
            setTestResults(prev => [...prev, {
                test: 'Window addEventListener Call',
                status: 'success',
                message: 'addEventListener called on window object'
            }]);
        } catch (error) {
            setTestResults(prev => [...prev, {
                test: 'Window addEventListener Call',
                status: 'error',
                message: `Error: ${error.message}`
            }]);
        }

        return () => {
            window.removeEventListener('load', handleLoad);
        };
    }, [overrideActive]);

    // Test 4: Document click event
    useEffect(() => {
        if (!overrideActive) return;

        const handleDocumentClick = (e) => {
            setEventLog(prev => [...prev, {
                type: 'documentClick',
                target: e.target.tagName || 'Unknown',
                timestamp: new Date().toISOString()
            }]);
        };

        try {
            document.addEventListener('click', handleDocumentClick);
            setTestResults(prev => [...prev, {
                test: 'Document addEventListener Call',
                status: 'success',
                message: 'addEventListener called on document object'
            }]);
        } catch (error) {
            setTestResults(prev => [...prev, {
                test: 'Document addEventListener Call',
                status: 'error',
                message: `Error: ${error.message}`
            }]);
        }

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [overrideActive]);

    // Test 5: Custom element with event listener
    useEffect(() => {
        if (!divRef.current || !overrideActive) return;

        const div = divRef.current;
        let mouseEnterWorked = false;

        const handleMouseEnter = () => {
            mouseEnterWorked = true;
            setTestResults(prev => [...prev, {
                test: 'Div MouseEnter Event',
                status: 'success',
                message: 'MouseEnter event listener fired successfully'
            }]);
        };

        try {
            div.addEventListener('mouseenter', handleMouseEnter);
            setTestResults(prev => [...prev, {
                test: 'Div addEventListener Call',
                status: 'success',
                message: 'addEventListener called on div element'
            }]);
        } catch (error) {
            setTestResults(prev => [...prev, {
                test: 'Div addEventListener Call',
                status: 'error',
                message: `Error: ${error.message}`
            }]);
        }

        return () => {
            if (div && div.removeEventListener) {
                div.removeEventListener('mouseenter', handleMouseEnter);
            }
        };
    }, [overrideActive]);

    const handleToggleOverride = () => {
        setOverrideActive(!overrideActive);
        setTestResults([]);
        setEventLog([]);
    };

    const handleClearLogs = () => {
        setTestResults([]);
        setCurrentTestResult(null);
        setEventLog([]);
        setVerificationResults([]);
    };

    // Show only the most recent test result
    useEffect(() => {
        if (testResults.length === 0) {
            setCurrentTestResult(null);
            return;
        }

        // Show only the latest result
        const latestResult = testResults[testResults.length - 1];
        setCurrentTestResult(latestResult);
    }, [testResults]);

    // Verification functions
    const verifyOverrideActive = () => {
        const results = [];
        
        // Check 1: Verify override exists
        const hasOverride = EventTarget.prototype.addEventListener !== EventTarget.prototype._addEventListener;
        results.push({
            check: 'Override Function Exists',
            status: hasOverride ? 'success' : 'error',
            message: hasOverride 
                ? 'EventTarget.prototype.addEventListener is overridden' 
                : 'EventTarget.prototype.addEventListener is NOT overridden',
            details: hasOverride 
                ? 'The override is active and intercepting addEventListener calls'
                : 'The native addEventListener is being used'
        });

        // Check 2: Verify _addEventListener exists
        const hasOriginal = typeof EventTarget.prototype._addEventListener === 'function';
        results.push({
            check: 'Original Function Stored',
            status: hasOriginal ? 'success' : 'error',
            message: hasOriginal 
                ? 'Original addEventListener is stored in _addEventListener' 
                : 'Original addEventListener is NOT stored',
            details: hasOriginal 
                ? 'The original function is preserved and can be restored'
                : 'The original function is missing - this could cause issues'
        });

        // Check 3: Verify eventListenerList property
        const testElement = document.createElement('div');
        testElement.addEventListener('click', () => {});
        const hasListenerList = testElement.hasOwnProperty('eventListenerList') || 
                               testElement.eventListenerList !== undefined;
        results.push({
            check: 'eventListenerList Property',
            status: hasListenerList ? 'success' : 'error',
            message: hasListenerList 
                ? 'eventListenerList property is being created' 
                : 'eventListenerList property is NOT being created',
            details: hasListenerList 
                ? 'The override is tracking event listeners in eventListenerList'
                : 'The override is not creating the eventListenerList property'
        });

        // Check 4: Test if extension scripts would be affected
        try {
            const testFunc = function() {};
            testElement.addEventListener('test', testFunc);
            const listenerExists = testElement.eventListenerList && 
                                  testElement.eventListenerList.test && 
                                  testElement.eventListenerList.test.length > 0;
            results.push({
                check: 'Event Listener Tracking',
                status: listenerExists ? 'success' : 'error',
                message: listenerExists 
                    ? 'Event listeners are being tracked correctly' 
                    : 'Event listeners are NOT being tracked',
                details: listenerExists 
                    ? 'The override is successfully intercepting and tracking listeners'
                    : 'The override is not working as expected'
            });
        } catch (error) {
            results.push({
                check: 'Event Listener Tracking',
                status: 'error',
                message: `Error testing listener tracking: ${error.message}`,
                details: 'This indicates the override may be breaking functionality'
            });
        }

        // Check 5: Verify console for errors (this would be done manually)
        results.push({
            check: 'Console Errors Check',
            status: 'warning',
            message: 'Check browser console for errors',
            details: 'Open DevTools (F12) and check the Console tab for any errors related to addEventListener or extension scripts'
        });

        // Check 6: Verify extension script loading
        results.push({
            check: 'Extension Script Detection',
            status: 'info',
            message: 'Check if extension scripts are loaded',
            details: 'In DevTools, go to Sources tab and check if tagify.js or other extension scripts are loaded. If they fail to load or have errors, the override may be the cause.'
        });

        setVerificationResults(results);
        return results;
    };

    const verifyExtensionScripts = () => {
        const results = [];
        
        // Check for tagify.js
        const scripts = Array.from(document.querySelectorAll('script'));
        const tagifyScript = scripts.find(s => s.src && s.src.includes('tagify'));
        results.push({
            check: 'Tagify Script Detection',
            status: tagifyScript ? 'success' : 'warning',
            message: tagifyScript 
                ? 'Tagify script found in DOM' 
                : 'Tagify script not found in DOM (may be injected by extension)',
            details: tagifyScript 
                ? `Script source: ${tagifyScript.src}`
                : 'Extension scripts are typically injected dynamically. Check Network tab in DevTools.'
        });

        // Check for extension-related globals
        const hasTagifyGlobal = typeof window.tagify !== 'undefined' || 
                                typeof window.Tagify !== 'undefined';
        results.push({
            check: 'Tagify Global Object',
            status: hasTagifyGlobal ? 'success' : 'warning',
            message: hasTagifyGlobal 
                ? 'Tagify global object exists' 
                : 'Tagify global object not found',
            details: hasTagifyGlobal 
                ? 'Tagify is loaded and accessible'
                : 'Tagify may not be loaded or may have failed due to the override'
        });

        // Check for event listener issues in extension context
        results.push({
            check: 'Extension Event Listeners',
            status: 'info',
            message: 'Check extension event listeners',
            details: 'In DevTools Console, run: document.querySelectorAll("*").forEach(el => console.log(el.eventListenerList || "No listener list"))'
        });

        setVerificationResults(prev => [...prev, ...results]);
        return results;
    };

    const runFullVerification = () => {
        setVerificationResults([]);
        verifyOverrideActive();
        setTimeout(() => {
            verifyExtensionScripts();
        }, 500);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return '#10b981';
            case 'error': return '#ef4444';
            case 'warning': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                background: 'white',
                borderRadius: '16px',
                padding: '40px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px',
                    paddingBottom: '20px',
                    borderBottom: '3px solid #667eea'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '2.5em',
                            color: '#333',
                            marginBottom: '10px',
                            fontWeight: 'bold'
                        }}>
                            🔧 EventListener Override Test
                        </h1>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#666'
                        }}>
                            Test page to reproduce addEventListener override issues with Chrome extensions
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '12px 24px',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }}
                    >
                        ← Back to Home
                    </button>
                </div>

                {/* Override Status */}
                <div style={{
                    background: overrideActive ? '#fee2e2' : '#d1fae5',
                    border: `2px solid ${overrideActive ? '#ef4444' : '#10b981'}`,
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '30px'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h3 style={{
                                color: overrideActive ? '#dc2626' : '#059669',
                                marginBottom: '10px',
                                fontSize: '1.3em'
                            }}>
                                {overrideActive ? '⚠️ Override ACTIVE' : '✅ Override DISABLED'}
                            </h3>
                            <p style={{ color: '#666', margin: 0 }}>
                                {overrideActive
                                    ? 'EventTarget.prototype.addEventListener is currently overridden. This may break extension scripts.'
                                    : 'EventTarget.prototype.addEventListener is using the native implementation.'}
                            </p>
                        </div>
                        <button
                            onClick={handleToggleOverride}
                            style={{
                                padding: '12px 24px',
                                background: overrideActive ? '#ef4444' : '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            {overrideActive ? 'Disable Override' : 'Enable Override'}
                        </button>
                    </div>
                </div>

                {/* Test Controls */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '30px',
                    marginBottom: '30px'
                }}>
                    {/* Test Elements */}
                    <div style={{
                        background: '#f9fafb',
                        borderRadius: '12px',
                        padding: '30px',
                        border: '2px solid #e5e7eb'
                    }}>
                        <h2 style={{
                            color: '#333',
                            marginBottom: '20px',
                            fontSize: '1.5em'
                        }}>
                            🧪 Test Elements
                        </h2>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                        }}>
                            <button
                                ref={buttonRef}
                                onClick={() => {
                                    setTestResults(prev => [...prev, {
                                        test: 'Button Manual Click',
                                        status: 'success',
                                        message: 'Button was clicked manually'
                                    }]);
                                }}
                                style={{
                                    padding: '15px 30px',
                                    background: '#667eea',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                Click Me (Button Test)
                            </button>

                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Type here (Input Test)"
                                onChange={() => {
                                    setTestResults(prev => [...prev, {
                                        test: 'Input Manual Change',
                                        status: 'success',
                                        message: 'Input value was changed'
                                    }]);
                                }}
                                style={{
                                    padding: '15px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}
                            />

                            <div
                                ref={divRef}
                                style={{
                                    padding: '20px',
                                    background: '#f3f4f6',
                                    borderRadius: '8px',
                                    border: '2px dashed #9ca3af',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#e5e7eb';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#f3f4f6';
                                }}
                            >
                                Hover Me (Div MouseEnter Test)
                            </div>
                        </div>
                    </div>

                    {/* Test Results */}
                    <div style={{
                        background: '#f9fafb',
                        borderRadius: '12px',
                        padding: '30px',
                        border: '2px solid #e5e7eb',
                        maxHeight: '500px',
                        overflowY: 'auto'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <h2 style={{
                                color: '#333',
                                fontSize: '1.5em',
                                margin: 0
                            }}>
                                📊 Test Results
                            </h2>
                            <button
                                onClick={handleClearLogs}
                                style={{
                                    padding: '8px 16px',
                                    background: '#6b7280',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                }}
                            >
                                Clear
                            </button>
                        </div>
                         <div style={{
                             display: 'flex',
                             flexDirection: 'column',
                             gap: '10px',
                             minHeight: '100px'
                         }}>
                             {!currentTestResult ? (
                                 <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                                     No test results yet. Interact with elements to see results.
                                 </p>
                             ) : (
                                 <div
                                     key={testResults.length}
                                     style={{
                                         padding: '12px',
                                         background: 'white',
                                         borderRadius: '8px',
                                         border: `2px solid ${getStatusColor(currentTestResult.status)}`,
                                         borderLeft: `6px solid ${getStatusColor(currentTestResult.status)}`,
                                         animation: 'slideIn 0.3s ease-out',
                                         opacity: 1,
                                         transform: 'translateX(0)'
                                     }}
                                 >
                                     <div style={{
                                         display: 'flex',
                                         justifyContent: 'space-between',
                                         alignItems: 'start',
                                         marginBottom: '5px'
                                     }}>
                                         <strong style={{ color: '#333' }}>
                                             {currentTestResult.test}
                                         </strong>
                                         <span style={{
                                             padding: '4px 8px',
                                             background: getStatusColor(currentTestResult.status),
                                             color: 'white',
                                             borderRadius: '4px',
                                             fontSize: '11px',
                                             fontWeight: 'bold'
                                         }}>
                                             {currentTestResult.status.toUpperCase()}
                                         </span>
                                     </div>
                                     <p style={{
                                         color: '#666',
                                         fontSize: '13px',
                                         margin: 0
                                     }}>
                                         {currentTestResult.message}
                                     </p>
                                 </div>
                             )}
                         </div>

                         {/* Event Listener Log - Below Test Result */}
                         <div style={{
                             marginTop: '20px',
                             paddingTop: '20px',
                             borderTop: '2px solid #e5e7eb'
                         }}>
                             <h3 style={{
                                 color: '#333',
                                 marginBottom: '15px',
                                 fontSize: '1.2em'
                             }}>
                                 📝 Event Listener Log
                             </h3>
                             <div style={{
                                 background: 'white',
                                 borderRadius: '8px',
                                 padding: '15px',
                                 maxHeight: '250px',
                                 overflowY: 'auto',
                                 fontFamily: 'monospace',
                                 fontSize: '11px',
                                 border: '1px solid #e5e7eb'
                             }}>
                                 {eventLog.length === 0 ? (
                                     <p style={{ color: '#9ca3af', fontStyle: 'italic', margin: 0 }}>
                                         No events logged yet. Event listeners will be logged here when added.
                                     </p>
                                 ) : (
                                     [...eventLog].reverse().map((log, index) => (
                                         <div
                                             key={eventLog.length - 1 - index}
                                             style={{
                                                 padding: '6px',
                                                 borderBottom: '1px solid #e5e7eb',
                                                 color: '#333'
                                             }}
                                         >
                                             <span style={{ color: '#667eea' }}>[{log.timestamp}]</span>{' '}
                                             <span style={{ color: '#10b981' }}>{log.type}</span>{' '}
                                             on <span style={{ color: '#f59e0b' }}>{log.target}</span>
                                             {log.event && (
                                                 <> - Event: <span style={{ color: '#ef4444' }}>{log.event}</span></>
                                             )}
                                         </div>
                                     ))
                                 )}
                             </div>
                         </div>
                     </div>
                 </div>

                {/* Verification Section */}
                <div style={{
                    background: '#f0f9ff',
                    borderRadius: '12px',
                    padding: '30px',
                    marginTop: '30px',
                    border: '2px solid #3b82f6'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}>
                        <h2 style={{
                            color: '#333',
                            fontSize: '1.5em',
                            margin: 0
                        }}>
                            ✅ Verification Tools
                        </h2>
                        <button
                            onClick={runFullVerification}
                            style={{
                                padding: '12px 24px',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                            }}
                        >
                            Run Verification
                        </button>
                    </div>

                    {verificationResults.length > 0 && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            marginTop: '20px'
                        }}>
                            {verificationResults.map((result, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: '15px',
                                        background: 'white',
                                        borderRadius: '8px',
                                        border: `2px solid ${getStatusColor(result.status)}`,
                                        borderLeft: `6px solid ${getStatusColor(result.status)}`
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'start',
                                        marginBottom: '8px'
                                    }}>
                                        <strong style={{ color: '#333', fontSize: '15px' }}>
                                            {result.check}
                                        </strong>
                                        <span style={{
                                            padding: '4px 10px',
                                            background: getStatusColor(result.status),
                                            color: 'white',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            fontWeight: 'bold'
                                        }}>
                                            {result.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p style={{
                                        color: '#666',
                                        fontSize: '14px',
                                        margin: '5px 0',
                                        fontWeight: '500'
                                    }}>
                                        {result.message}
                                    </p>
                                    <p style={{
                                        color: '#9ca3af',
                                        fontSize: '12px',
                                        margin: 0,
                                        fontStyle: 'italic'
                                    }}>
                                        {result.details}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {verificationResults.length === 0 && (
                        <div style={{
                            padding: '20px',
                            background: 'white',
                            borderRadius: '8px',
                            textAlign: 'center',
                            color: '#9ca3af'
                        }}>
                            <p style={{ margin: 0, fontStyle: 'italic' }}>
                                Click "Run Verification" to check if the override is active and working correctly
                            </p>
                        </div>
                    )}

                    {/* Step-by-step verification guide */}
                    <div style={{
                        marginTop: '30px',
                        padding: '20px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{
                            color: '#333',
                            marginBottom: '15px',
                            fontSize: '1.2em'
                        }}>
                            📋 Step-by-Step Verification Guide
                        </h3>
                        <ol style={{
                            color: '#666',
                            lineHeight: '2',
                            paddingLeft: '20px'
                        }}>
                            <li><strong>Enable the override</strong> (it's enabled by default)</li>
                            <li><strong>Click "Run Verification"</strong> to check override status</li>
                            <li><strong>Open DevTools</strong> (F12 or Right-click → Inspect)</li>
                            <li><strong>Check Console tab</strong> for any errors related to addEventListener</li>
                            <li><strong>Check Sources tab</strong> to see if extension scripts (tagify.js) are loaded</li>
                            <li><strong>Check Network tab</strong> to see if extension scripts are being loaded</li>
                            <li><strong>In Console, run:</strong> <code style={{
                                background: '#f3f4f6',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '12px'
                            }}>EventTarget.prototype.addEventListener.toString()</code></li>
                            <li><strong>Verify the output</strong> shows the override function, not the native one</li>
                            <li><strong>Test with your extension</strong> - load the extension and navigate to this page</li>
                            <li><strong>Check if tagify.js works</strong> - try using extension features that depend on tagify</li>
                        </ol>
                    </div>

                    {/* Console commands */}
                    <div style={{
                        marginTop: '20px',
                        padding: '20px',
                        background: '#1f2937',
                        borderRadius: '8px',
                        color: 'white'
                    }}>
                        <h3 style={{
                            color: 'white',
                            marginBottom: '15px',
                            fontSize: '1.1em'
                        }}>
                            💻 Console Commands for Verification
                        </h3>
                        <div style={{
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            lineHeight: '1.8'
                        }}>
                            <div style={{ marginBottom: '10px' }}>
                                <strong style={{ color: '#60a5fa' }}>// Check if override is active:</strong><br/>
                                <code style={{ color: '#e5e7eb' }}>
                                    {'EventTarget.prototype.addEventListener.toString().includes("eventListenerList")'}
                                </code>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong style={{ color: '#60a5fa' }}>// Check original function:</strong><br/>
                                <code style={{ color: '#e5e7eb' }}>
                                    {'typeof EventTarget.prototype._addEventListener'}
                                </code>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong style={{ color: '#60a5fa' }}>// Test event listener tracking:</strong><br/>
                                <code style={{ color: '#e5e7eb' }}>
                                    {'const el = document.createElement("div"); el.addEventListener("test", () => {}); console.log(el.eventListenerList);'}
                                </code>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong style={{ color: '#60a5fa' }}>// Check for tagify:</strong><br/>
                                <code style={{ color: '#e5e7eb' }}>
                                    {'typeof window.tagify !== "undefined" || typeof window.Tagify !== "undefined"'}
                                </code>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong style={{ color: '#60a5fa' }}>// Check all elements with event listeners:</strong><br/>
                                <code style={{ color: '#e5e7eb' }}>
                                    {'document.querySelectorAll("*").forEach(el => { if (el.eventListenerList) console.log(el.tagName, el.eventListenerList); });'}
                                </code>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong style={{ color: '#60a5fa' }}>// Get function source code:</strong><br/>
                                <code style={{ color: '#e5e7eb' }}>
                                    {'EventTarget.prototype.addEventListener.toString()'}
                                </code>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Code Example */}
                <div style={{
                    background: '#1f2937',
                    borderRadius: '12px',
                    padding: '30px',
                    marginTop: '30px',
                    color: 'white'
                }}>
                    <h2 style={{
                        color: 'white',
                        marginBottom: '20px',
                        fontSize: '1.5em'
                    }}>
                        💻 Override Code (Reproducing the Issue)
                    </h2>
                    <pre style={{
                        background: '#111827',
                        padding: '20px',
                        borderRadius: '8px',
                        overflowX: 'auto',
                        fontSize: '13px',
                        lineHeight: '1.6',
                        color: '#e5e7eb'
                    }}>
{`EventTarget.prototype._addEventListener = 
  EventTarget.prototype.addEventListener;

EventTarget.prototype.addEventListener = function (a, b, c) {
  if (c == undefined) c = false;
  this._addEventListener(a, b, c);

  if (!this.eventListenerList) this.eventListenerList = {};
  if (!this.eventListenerList[a]) this.eventListenerList[a] = [];

  this.eventListenerList[a].push({ listener: b, options: c });
};`}
                    </pre>
                    <p style={{
                        color: '#9ca3af',
                        marginTop: '15px',
                        fontSize: '14px'
                    }}>
                        ⚠️ <strong>Issue:</strong> This override can break Chrome extension scripts (like tagify.js) 
                        that rely on the native addEventListener implementation, especially when the override 
                        is applied before the extension scripts load.
                    </p>
                </div>
            </div>
        </div>
    );
}

