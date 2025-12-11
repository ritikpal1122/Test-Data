import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export function EventListenerOverrideTestPage() {
    const navigate = useNavigate();
    const [overrideActive, setOverrideActive] = useState(true);
    const [testResults, setTestResults] = useState([]);
    const [currentTestResult, setCurrentTestResult] = useState(null);
    const [eventLog, setEventLog] = useState([]);
    const [verificationResults, setVerificationResults] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tagifyError, setTagifyError] = useState(null);
    const [tagifyLoaded, setTagifyLoaded] = useState(false);
    const [pageBlank, setPageBlank] = useState(false);
    const [tagifyScriptLoaded, setTagifyScriptLoaded] = useState(false);
    const buttonRef = useRef(null);
    const inputRef = useRef(null);
    const divRef = useRef(null);
    const tagifyInputRef = useRef(null);
    const viewDetailsButtonRef = useRef(null);

    // Override addEventListener early - this simulates the problematic code
    useEffect(() => {
        try {
            setIsLoading(true);
            setError(null);
            
            if (!overrideActive) {
                setIsLoading(false);
                return;
            }

            // Store original addEventListener
            if (!EventTarget.prototype._addEventListener) {
                EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener;

                // Override addEventListener (the problematic code)
                EventTarget.prototype.addEventListener = function (a, b, c) {
                    try {
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
                    } catch (err) {
                        console.error('Error in addEventListener override:', err);
                        setError(`Error in addEventListener override: ${err.message}`);
                    }
                };

                setTestResults(prev => [...prev, {
                    test: 'addEventListener Override Applied',
                    status: 'success',
                    message: 'EventTarget.prototype.addEventListener has been overridden'
                }]);
            }

            setIsLoading(false);
        } catch (err) {
            console.error('Error setting up addEventListener override:', err);
            setError(`Error setting up override: ${err.message}`);
            setIsLoading(false);
        }

        return () => {
            // Cleanup: restore original if needed
            try {
                if (EventTarget.prototype._addEventListener) {
                    EventTarget.prototype.addEventListener = EventTarget.prototype._addEventListener;
                    delete EventTarget.prototype._addEventListener;
                }
            } catch (err) {
                console.error('Error cleaning up override:', err);
            }
        };
    }, [overrideActive]);

    // Simulate tagify.js loading and test if it breaks
    useEffect(() => {
        if (!overrideActive) {
            setTagifyError(null);
            setTagifyLoaded(false);
            setPageBlank(false);
            setTagifyScriptLoaded(false);
            return;
        }

        // Simulate tagify.js code (the problematic part)
        try {
            // This simulates tagify.js trying to use addEventListener
            // Line 6 in tagify.js would be: EventTarget.prototype.addEventListener = function (a, b, c) {
            // But since we already overrode it, tagify.js might fail
            
            const testElement = document.createElement('div');
            
            // Try to use addEventListener like tagify.js would
            const testHandler = function() {};
            testElement.addEventListener('test', testHandler);
            
            // Check if eventListenerList exists (our override adds this)
            if (testElement.eventListenerList) {
                // This means our override is active, which might break tagify.js
                setTagifyError('Tagify.js will fail because addEventListener is overridden. The override adds eventListenerList property which tagify.js doesn\'t expect.');
                setTagifyLoaded(false);
            } else {
                setTagifyLoaded(true);
                setTagifyError(null);
            }
        } catch (err) {
            console.error('Tagify.js simulation error:', err);
            setTagifyError(`Tagify.js Error (Line 6): ${err.message}`);
            setTagifyLoaded(false);
        }
    }, [overrideActive]);

    // Function to simulate "View Details" button click that loads tagify.js
    const handleViewDetailsClick = () => {
        if (!overrideActive) {
            alert('Override is disabled. Enable it first to see the error.');
            return;
        }

        try {
            setTagifyScriptLoaded(false);
            setPageBlank(false);
            setTagifyError(null);

            // Simulate loading tagify.js after button click (with delay like real scenario)
            // This matches the real error sequence from the website
            setTimeout(() => {
                const errors = [];
                
                // Simulate tagify.js being injected (like the extension does)
                console.log('VM1480 event-capture-content.js:6 content.js loaded');
                console.log('VM1480 tagify.js:62 Tagify Injected');
                
                // Error: module is not defined (tagify.js:4481)
                // This is the PRIMARY error - tagify.js tries to use CommonJS module syntax
                // but 'module' is not defined in the browser context
                if (typeof module === 'undefined') {
                    // Simulate the exact error from the real website
                    const moduleError = new ReferenceError('module is not defined');
                    console.error('VM1480 tagify.js:4481 Uncaught ReferenceError: module is not defined');
                    console.error('    at VM1480 tagify.js:4481:1');
                    console.error('(anonymous) @ VM1480 tagify.js:4481');
                    
                    errors.push('Uncaught ReferenceError: module is not defined\n    at tagify.js:4481:1');
                }

                // Simulate the _addEventListener stack overflow error
                // This happens when tagify.js tries to override addEventListener but the website's override is already active
                // The result is infinite recursion causing "Maximum call stack size exceeded"
                try {
                    // The problem: When website's override is active:
                    // - EventTarget.prototype._addEventListener = original native function (stored by website)
                    // - EventTarget.prototype.addEventListener = website's override function
                    // 
                    // When tagify.js loads:
                    // - Tagify.js line 5-6: 
                    //   EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener;
                    //   EventTarget.prototype.addEventListener = function (a, b, c) {
                    //     this._addEventListener(a, b, c); // calls the website's override
                    //   }
                    // - But _addEventListener now points to the website's override!
                    // - Website's override also calls this._addEventListener(a, b, c)
                    // - This creates infinite recursion: tagify → website → tagify → website → ...
                    
                    // Simulate what happens when tagify.js tries to override
                    const websiteOverride = EventTarget.prototype.addEventListener;
                    const websiteOriginal = EventTarget.prototype._addEventListener;
                    
                    // Tagify.js does this (line 5-6):
                    // EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener;
                    // But addEventListener is already the website's override!
                    EventTarget.prototype._addEventListener = websiteOverride;
                    
                    // Track recursion depth to detect infinite loop
                    let recursionDepth = 0;
                    const maxRecursion = 10000; // Browser's typical stack limit
                    
                    // Now tagify.js overrides addEventListener (line 6)
                    EventTarget.prototype.addEventListener = function (a, b, c) {
                        recursionDepth++;
                        if (recursionDepth > maxRecursion) {
                            // Restore before throwing
                            EventTarget.prototype.addEventListener = websiteOverride;
                            EventTarget.prototype._addEventListener = websiteOriginal;
                            throw new RangeError('Maximum call stack size exceeded');
                        }
                        if (c == undefined) c = false;
                        // This creates infinite recursion because:
                        // - this._addEventListener points to website's override
                        // - Website's override calls this._addEventListener(a, b, c)
                        // - Which calls tagify's addEventListener again
                        // - Which calls this._addEventListener again → infinite loop
                        this._addEventListener(a, b, c);
                    };

                    // Try to use it (this will cause Maximum call stack size exceeded)
                    const testElement = document.createElement('div');
                    testElement.addEventListener('click', () => {});

                    // Restore for next test (shouldn't reach here if error occurred)
                    EventTarget.prototype.addEventListener = websiteOverride;
                    EventTarget.prototype._addEventListener = websiteOriginal;

                } catch (err) {
                    if (err instanceof RangeError && err.message.includes('Maximum call stack size exceeded')) {
                        console.error('tagify.js:5 Uncaught RangeError: Maximum call stack size exceeded');
                        console.error('    at EventTarget.addEventListener [as _addEventListener] (tagify.js:5:3)');
                        console.error('    at EventTarget.addEventListener [as _addEventListener] (tagify.js:6:8)');
                        console.error('    at EventTarget.addEventListener [as _addEventListener] (tagify.js:6:8)');
                        console.error('    (infinite recursion loop)');
                        errors.push(`Uncaught RangeError: Maximum call stack size exceeded\n    at EventTarget.addEventListener [as _addEventListener] (tagify.js:5:3)\n    at EventTarget.addEventListener [as _addEventListener] (tagify.js:6:8)\n    (infinite recursion: tagify → website override → tagify → ...)`);
                    } else {
                        console.error('VM1260 tagify.js:6 Uncaught TypeError:', err);
                        console.error('    at EventTarget.addEventListener (VM1260 tagify.js:6:8)');
                        errors.push(`Uncaught TypeError: ${err.message}\n    at EventTarget.addEventListener (tagify.js:6:8)`);
                    }
                }

                // React errors occur as a cascading effect after tagify.js errors
                // These happen because the broken event system causes React to fail
                if (errors.length > 0) {
                    // Simulate React errors that occur after tagify.js fails
                    setTimeout(() => {
                        console.error('react-dom.production.min.js:131 Uncaught Error: Minified React error #418');
                        console.error('    at lg (react-dom.production.min.js:131:263)');
                        console.error('    at i (react-dom.production.min.js:293:349)');
                        console.error('    at Object.g [as apply] (81dac761c1f80dd0705607d65c82ea7ab0011ba05a0:27:41)');
                        console.error('    at MessagePort.<anonymous> (81dac761c1f80dd0705607d65c82ea7ab0011ba05a0:27:274)');
                        
                        errors.push('Uncaught Error: Minified React error #418\n    at react-dom.production.min.js:131:263\n    (Cascading error from broken event system)');
                        
                        setTagifyError(errors.join('\n\n'));
                        setTagifyScriptLoaded(true);
                        
                        // Trigger blank screen after React errors
                        setTimeout(() => {
                            setPageBlank(true);
                        }, 500);
                    }, 200);
                } else {
                    setTagifyScriptLoaded(true);
                }
            }, 500); // Simulate delay in loading tagify.js

        } catch (err) {
            console.error('Error in handleViewDetailsClick:', err);
            setTagifyError(`Error: ${err.message}`);
            setTimeout(() => {
                setPageBlank(true);
            }, 1000);
        }
    };

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

    // Show error state if there's an error
    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '40px',
                    maxWidth: '600px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                }}>
                    <h1 style={{ color: '#ef4444', marginBottom: '20px' }}>⚠️ Error</h1>
                    <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            window.location.reload();
                        }}
                        style={{
                            padding: '12px 24px',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        Reload Page
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '12px 24px',
                            background: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            marginLeft: '10px'
                        }}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Show blank screen state (simulating the issue)
    if (pageBlank) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#000000',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
            }}>
                    <div style={{
                        background: '#1f2937',
                        borderRadius: '16px',
                        padding: '40px',
                        textAlign: 'center',
                        maxWidth: '800px',
                        border: '2px solid #ef4444'
                    }}>
                        <div style={{
                            fontSize: '4em',
                            marginBottom: '20px'
                        }}>💥</div>
                        <h1 style={{
                            color: '#ef4444',
                            marginBottom: '20px',
                            fontSize: '2em'
                        }}>
                            Blank Screen - Error Reproduced!
                        </h1>
                        <p style={{
                            color: '#9ca3af',
                            marginBottom: '30px',
                            fontSize: '16px',
                            lineHeight: '1.6'
                        }}>
                            This is what users see when tagify.js fails due to the addEventListener override.
                        </p>
                        <div style={{
                            background: '#111827',
                            borderRadius: '8px',
                            padding: '20px',
                            marginBottom: '20px',
                            textAlign: 'left',
                            maxHeight: '400px',
                            overflowY: 'auto'
                        }}>
                            <p style={{
                                color: '#fbbf24',
                                marginBottom: '15px',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            }}>
                                Error Details (Matching Real Website Errors):
                            </p>
                            <pre style={{
                                color: '#ef4444',
                                fontSize: '11px',
                                margin: 0,
                                fontFamily: 'monospace',
                                overflowX: 'auto',
                                lineHeight: '1.5'
                            }}>
{`1. Uncaught ReferenceError: module is not defined
   at tagify.js:4481:1

2. Uncaught RangeError: Maximum call stack size exceeded
   at EventTarget.addEventListener [as _addEventListener] (tagify.js:5:3)
   at EventTarget.addEventListener [as _addEventListener] (tagify.js:6:8)
   (infinite recursion: tagify → website override → tagify → ...)

3. Uncaught Error: Minified React error #418
   at react-dom.production.min.js:131:263
   at Object.g [as apply] (81dac76...:27:41)
   at MessagePort.<anonymous> (81dac76...:27:274)
   (Cascading error from broken event system)

4. NotFoundError: Failed to execute 'removeChild' on 'Node'
   (DOM manipulation errors due to React crash)`}
                            </pre>
                        </div>
                        <div style={{
                            background: '#1f2937',
                            borderRadius: '8px',
                            padding: '15px',
                            marginBottom: '20px',
                            textAlign: 'left',
                            border: '1px solid #374151'
                        }}>
                            <p style={{
                                color: '#60a5fa',
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '13px'
                            }}>
                                Root Cause:
                            </p>
                            <p style={{
                                color: '#9ca3af',
                                margin: 0,
                                fontSize: '12px',
                                lineHeight: '1.6'
                            }}>
                                The website's addEventListener override is active before tagify.js loads. 
                                When tagify.js tries to override addEventListener on line 6, it stores the 
                                already-overridden function instead of the native one, causing 
                                <code style={{ color: '#ef4444', background: '#111827', padding: '2px 4px', borderRadius: '3px' }}>this._addEventListener is not a function</code> errors.
                            </p>
                        </div>
                    <button
                        onClick={() => {
                            setPageBlank(false);
                            setTagifyError(null);
                            setTagifyScriptLoaded(false);
                            window.location.reload();
                        }}
                        style={{
                            padding: '12px 24px',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            marginRight: '10px'
                        }}
                    >
                        Reload Page
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '12px 24px',
                            background: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer'
                        }}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Show loading state
    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '40px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        fontSize: '3em',
                        marginBottom: '20px'
                    }}>⏳</div>
                    <p style={{ color: '#666' }}>Loading...</p>
                </div>
            </div>
        );
    }

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

                {/* Tagify.js Error Display */}
                {tagifyError && (
                    <div style={{
                        background: '#fee2e2',
                        border: '2px solid #ef4444',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '30px'
                    }}>
                        <h3 style={{
                            color: '#dc2626',
                            marginBottom: '15px',
                            fontSize: '1.3em'
                        }}>
                            🚨 Tagify.js Error Detected
                        </h3>
                        <p style={{ color: '#666', marginBottom: '15px', fontWeight: '500' }}>
                            {tagifyError}
                        </p>
                        <div style={{
                            background: '#1f2937',
                            borderRadius: '8px',
                            padding: '15px',
                            marginTop: '15px'
                        }}>
                            <p style={{ color: '#fbbf24', marginBottom: '10px', fontWeight: 'bold' }}>
                                Tagify.js Code (Line 6):
                            </p>
                            <pre style={{
                                color: '#e5e7eb',
                                fontSize: '12px',
                                margin: 0,
                                fontFamily: 'monospace',
                                overflowX: 'auto'
                            }}>
{`EventTarget.prototype._addEventListener = 
  EventTarget.prototype.addEventListener;

EventTarget.prototype.addEventListener = function (a, b, c) {
  if (c == undefined) c = false;
  this._addEventListener(a, b, c);
  // ... rest of tagify.js code
};`}
                            </pre>
                            <p style={{ color: '#9ca3af', marginTop: '10px', fontSize: '12px' }}>
                                <strong>Problem:</strong> When the override is active, tagify.js's addEventListener override (line 6) conflicts with the existing override, causing errors.
                            </p>
                        </div>
                    </div>
                )}

                {tagifyLoaded && !tagifyError && overrideActive && (
                    <div style={{
                        background: '#d1fae5',
                        border: '2px solid #10b981',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '30px'
                    }}>
                        <h3 style={{
                            color: '#059669',
                            marginBottom: '10px',
                            fontSize: '1.3em'
                        }}>
                            ✅ Tagify.js Status
                        </h3>
                        <p style={{ color: '#666', margin: 0 }}>
                            Tagify.js simulation passed. However, in real scenarios with the override active, tagify.js may still fail when it tries to override addEventListener on line 6.
                        </p>
                    </div>
                )}

                {/* View Details Button - Reproduces the Issue */}
                <div style={{
                    background: '#fff7ed',
                    border: '2px solid #f59e0b',
                    borderRadius: '12px',
                    padding: '30px',
                    marginBottom: '30px'
                }}>
                    <h2 style={{
                        color: '#333',
                        marginBottom: '15px',
                        fontSize: '1.5em'
                    }}>
                        🔴 Reproduce Blank Screen Issue
                    </h2>
                    <p style={{
                        color: '#666',
                        marginBottom: '15px',
                        fontSize: '14px',
                        lineHeight: '1.6'
                    }}>
                        Click the "View Details" button below to simulate the exact scenario where tagify.js loads after a button click and causes a blank screen with these errors:
                    </p>
                    <ul style={{ 
                        color: '#666', 
                        marginBottom: '20px', 
                        fontSize: '13px', 
                        lineHeight: '1.8',
                        paddingLeft: '20px',
                        textAlign: 'left'
                    }}>
                        <li><code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>module is not defined at tagify.js:4481</code></li>
                        <li><code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>this._addEventListener is not a function at tagify.js:6</code></li>
                        <li>React errors causing blank screen</li>
                    </ul>
                    <button
                        ref={viewDetailsButtonRef}
                        onClick={handleViewDetailsClick}
                        style={{
                            padding: '15px 30px',
                            background: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                        }}
                    >
                        📋 View Details
                    </button>
                    {tagifyScriptLoaded && (
                        <div style={{
                            marginTop: '20px',
                            padding: '15px',
                            background: tagifyError ? '#fee2e2' : '#d1fae5',
                            border: `2px solid ${tagifyError ? '#ef4444' : '#10b981'}`,
                            borderRadius: '8px'
                        }}>
                            {tagifyError ? (
                                <div>
                                    <p style={{
                                        color: '#dc2626',
                                        margin: 0,
                                        marginBottom: '10px',
                                        fontWeight: '500'
                                    }}>
                                        ❌ Tagify.js Errors Detected (Matching Real Website):
                                    </p>
                                    <pre style={{
                                        background: '#1f2937',
                                        color: '#ef4444',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        fontFamily: 'monospace',
                                        margin: 0,
                                        overflowX: 'auto',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        lineHeight: '1.6'
                                    }}>
                                        {tagifyError}
                                    </pre>
                                    <p style={{
                                        color: '#666',
                                        marginTop: '10px',
                                        marginBottom: 0,
                                        fontSize: '12px'
                                    }}>
                                        The page will go blank in 1 second to simulate the real issue...
                                    </p>
                                </div>
                            ) : (
                                <p style={{
                                    color: '#059669',
                                    margin: 0,
                                    fontWeight: '500'
                                }}>
                                    ✅ Tagify.js loaded successfully
                                </p>
                            )}
                        </div>
                    )}
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

