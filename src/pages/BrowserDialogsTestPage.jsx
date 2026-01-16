import React, { useState, useEffect } from 'react';

export function BrowserDialogsTestPage() {
    const [results, setResults] = useState([]);
    const [geolocationStatus, setGeolocationStatus] = useState('Not requested');
    const [cameraStatus, setCameraStatus] = useState('Not requested');
    const [microphoneStatus, setMicrophoneStatus] = useState('Not requested');
    const [notificationStatus, setNotificationStatus] = useState('Not requested');
    const [clipboardStatus, setClipboardStatus] = useState('Not requested');

    const addResult = (type, message, result = null) => {
        const timestamp = new Date().toLocaleTimeString();
        setResults(prev => [{
            id: Date.now(),
            type,
            message,
            result,
            timestamp
        }, ...prev].slice(0, 100));
    };

    // Alert Dialog
    const handleAlert = () => {
        try {
            alert('This is an alert dialog!\n\nYou can use this to display important messages to users.');
            addResult('alert', 'Alert dialog shown', 'User clicked OK');
        } catch (error) {
            addResult('alert', 'Error showing alert', error.message);
        }
    };

    const handleAlertWithInfo = () => {
        try {
            alert('Alert with Information:\n\n• Item 1\n• Item 2\n• Item 3\n\nClick OK to continue.');
            addResult('alert', 'Info alert shown', 'User clicked OK');
        } catch (error) {
            addResult('alert', 'Error showing info alert', error.message);
        }
    };

    const handleAlertWarning = () => {
        try {
            alert('⚠️ WARNING!\n\nThis is a warning message. Please proceed with caution.');
            addResult('alert', 'Warning alert shown', 'User clicked OK');
        } catch (error) {
            addResult('alert', 'Error showing warning alert', error.message);
        }
    };

    // Confirm Dialog
    const handleConfirm = () => {
        try {
            const result = confirm('This is a confirm dialog!\n\nDo you want to proceed?');
            addResult('confirm', 'Confirm dialog shown', result ? 'User clicked OK' : 'User clicked Cancel');
        } catch (error) {
            addResult('confirm', 'Error showing confirm', error.message);
        }
    };

    const handleConfirmDelete = () => {
        try {
            const result = confirm('⚠️ Delete Confirmation\n\nAre you sure you want to delete this item?\n\nThis action cannot be undone.');
            addResult('confirm', 'Delete confirmation shown', result ? 'User confirmed deletion' : 'User cancelled');
        } catch (error) {
            addResult('confirm', 'Error showing delete confirm', error.message);
        }
    };

    const handleConfirmSave = () => {
        try {
            const result = confirm('💾 Save Changes?\n\nYou have unsaved changes. Do you want to save before leaving?');
            addResult('confirm', 'Save confirmation shown', result ? 'User chose to save' : 'User chose not to save');
        } catch (error) {
            addResult('confirm', 'Error showing save confirm', error.message);
        }
    };

    // Prompt Dialog
    const handlePrompt = () => {
        try {
            const result = prompt('This is a prompt dialog!\n\nPlease enter your name:');
            if (result === null) {
                addResult('prompt', 'Prompt dialog shown', 'User clicked Cancel');
            } else if (result === '') {
                addResult('prompt', 'Prompt dialog shown', 'User entered empty string');
            } else {
                addResult('prompt', 'Prompt dialog shown', `User entered: "${result}"`);
            }
        } catch (error) {
            addResult('prompt', 'Error showing prompt', error.message);
        }
    };

    const handlePromptPassword = () => {
        try {
            const result = prompt('🔒 Enter Password:\n\nPlease enter your password:');
            if (result === null) {
                addResult('prompt', 'Password prompt shown', 'User clicked Cancel');
            } else {
                addResult('prompt', 'Password prompt shown', `Password entered (length: ${result.length})`);
            }
        } catch (error) {
            addResult('prompt', 'Error showing password prompt', error.message);
        }
    };

    const handlePromptEmail = () => {
        try {
            const result = prompt('📧 Enter Email:\n\nPlease enter your email address:', 'user@example.com');
            if (result === null) {
                addResult('prompt', 'Email prompt shown', 'User clicked Cancel');
            } else {
                addResult('prompt', 'Email prompt shown', `Email entered: "${result}"`);
            }
        } catch (error) {
            addResult('prompt', 'Error showing email prompt', error.message);
        }
    };

    // BeforeUnload Event
    const handleBeforeUnload = () => {
        try {
            window.addEventListener('beforeunload', (e) => {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                return e.returnValue;
            });
            addResult('beforeunload', 'BeforeUnload event listener added', 'Try navigating away or closing the tab');
        } catch (error) {
            addResult('beforeunload', 'Error adding beforeunload', error.message);
        }
    };

    const handleRemoveBeforeUnload = () => {
        try {
            window.removeEventListener('beforeunload', () => {});
            addResult('beforeunload', 'BeforeUnload event listener removed', 'You can now leave without warning');
        } catch (error) {
            addResult('beforeunload', 'Error removing beforeunload', error.message);
        }
    };

    // Geolocation Permission
    const handleGeolocation = async () => {
        try {
            if (!navigator.geolocation) {
                setGeolocationStatus('Not supported');
                addResult('geolocation', 'Geolocation API not supported', null);
                return;
            }

            setGeolocationStatus('Requesting...');
            addResult('geolocation', 'Requesting geolocation permission', 'Waiting for user...');

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setGeolocationStatus('Granted');
                    addResult('geolocation', 'Geolocation permission granted', `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
                },
                (error) => {
                    setGeolocationStatus(`Denied: ${error.message}`);
                    addResult('geolocation', 'Geolocation permission denied', error.message);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } catch (error) {
            setGeolocationStatus(`Error: ${error.message}`);
            addResult('geolocation', 'Error requesting geolocation', error.message);
        }
    };

    // Camera Permission
    const handleCamera = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setCameraStatus('Not supported');
                addResult('camera', 'Camera API not supported', null);
                return;
            }

            setCameraStatus('Requesting...');
            addResult('camera', 'Requesting camera permission', 'Waiting for user...');

            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setCameraStatus('Granted');
            addResult('camera', 'Camera permission granted', 'Stream active');
            
            // Stop the stream immediately
            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            setCameraStatus(`Denied: ${error.message}`);
            addResult('camera', 'Camera permission denied', error.message);
        }
    };

    // Microphone Permission
    const handleMicrophone = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setMicrophoneStatus('Not supported');
                addResult('microphone', 'Microphone API not supported', null);
                return;
            }

            setMicrophoneStatus('Requesting...');
            addResult('microphone', 'Requesting microphone permission', 'Waiting for user...');

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMicrophoneStatus('Granted');
            addResult('microphone', 'Microphone permission granted', 'Stream active');
            
            // Stop the stream immediately
            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            setMicrophoneStatus(`Denied: ${error.message}`);
            addResult('microphone', 'Microphone permission denied', error.message);
        }
    };

    // Camera + Microphone Permission
    const handleCameraAndMicrophone = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                addResult('camera+microphone', 'Media API not supported', null);
                return;
            }

            addResult('camera+microphone', 'Requesting camera and microphone permissions', 'Waiting for user...');

            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setCameraStatus('Granted');
            setMicrophoneStatus('Granted');
            addResult('camera+microphone', 'Camera and microphone permissions granted', 'Stream active');
            
            // Stop the stream immediately
            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            addResult('camera+microphone', 'Camera/microphone permission denied', error.message);
        }
    };

    // Notifications Permission
    const handleNotifications = async () => {
        try {
            if (!('Notification' in window)) {
                setNotificationStatus('Not supported');
                addResult('notifications', 'Notifications API not supported', null);
                return;
            }

            if (Notification.permission === 'granted') {
                setNotificationStatus('Already granted');
                // Show a test notification
                new Notification('Test Notification', {
                    body: 'Notifications are already enabled!',
                    icon: '🔔'
                });
                addResult('notifications', 'Notification shown', 'Permission already granted');
                return;
            }

            if (Notification.permission === 'denied') {
                setNotificationStatus('Denied');
                addResult('notifications', 'Notifications permission denied', 'User previously denied');
                return;
            }

            setNotificationStatus('Requesting...');
            addResult('notifications', 'Requesting notifications permission', 'Waiting for user...');

            const permission = await Notification.requestPermission();
            setNotificationStatus(permission);
            
            if (permission === 'granted') {
                new Notification('Permission Granted!', {
                    body: 'You will now receive notifications.',
                    icon: '✅'
                });
                addResult('notifications', 'Notifications permission granted', 'Test notification sent');
            } else {
                addResult('notifications', 'Notifications permission denied', permission);
            }
        } catch (error) {
            setNotificationStatus(`Error: ${error.message}`);
            addResult('notifications', 'Error requesting notifications', error.message);
        }
    };

    // Clipboard Permission
    const handleClipboardRead = async () => {
        try {
            if (!navigator.clipboard) {
                setClipboardStatus('Not supported');
                addResult('clipboard', 'Clipboard API not supported', null);
                return;
            }

            setClipboardStatus('Requesting...');
            addResult('clipboard', 'Requesting clipboard read permission', 'Waiting for user...');

            const text = await navigator.clipboard.readText();
            setClipboardStatus('Granted');
            addResult('clipboard', 'Clipboard read permission granted', `Content: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
        } catch (error) {
            setClipboardStatus(`Denied: ${error.message}`);
            addResult('clipboard', 'Clipboard read permission denied', error.message);
        }
    };

    const handleClipboardWrite = async () => {
        try {
            if (!navigator.clipboard) {
                setClipboardStatus('Not supported');
                addResult('clipboard', 'Clipboard API not supported', null);
                return;
            }

            const testText = `Test clipboard write - ${new Date().toLocaleTimeString()}`;
            await navigator.clipboard.writeText(testText);
            setClipboardStatus('Write successful');
            addResult('clipboard', 'Clipboard write successful', `Wrote: "${testText}"`);
        } catch (error) {
            setClipboardStatus(`Error: ${error.message}`);
            addResult('clipboard', 'Clipboard write failed', error.message);
        }
    };

    // Downloads (Trigger download)
    const handleDownload = () => {
        try {
            const blob = new Blob(['This is a test download file.\n\nCreated at: ' + new Date().toISOString()], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `test-download-${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            addResult('downloads', 'Download triggered', 'File download started');
        } catch (error) {
            addResult('downloads', 'Error triggering download', error.message);
        }
    };

    const handleDownloadImage = () => {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#4f46e5';
            ctx.fillRect(0, 0, 200, 200);
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.fillText('Test Image', 50, 100);
            
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `test-image-${Date.now()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
            addResult('downloads', 'Image download triggered', 'PNG image download started');
        } catch (error) {
            addResult('downloads', 'Error triggering image download', error.message);
        }
    };

    // Popups
    const handlePopup = () => {
        try {
            const popup = window.open('', 'testPopup', 'width=400,height=300,left=100,top=100');
            if (popup) {
                popup.document.write(`
                    <html>
                        <head><title>Test Popup</title></head>
                        <body style="font-family: Arial; padding: 20px; background: #f3f4f6;">
                            <h2>Test Popup Window</h2>
                            <p>This is a test popup window.</p>
                            <p>It should be blocked by popup blockers if enabled.</p>
                            <button onclick="window.close()" style="padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                        </body>
                    </html>
                `);
                addResult('popups', 'Popup window opened', 'Popup opened successfully');
            } else {
                addResult('popups', 'Popup blocked', 'Popup was blocked by browser');
            }
        } catch (error) {
            addResult('popups', 'Error opening popup', error.message);
        }
    };

    const handlePopupWithURL = () => {
        try {
            const popup = window.open('https://www.example.com', 'examplePopup', 'width=600,height=400');
            if (popup) {
                addResult('popups', 'Popup with URL opened', 'Opened example.com in popup');
            } else {
                addResult('popups', 'Popup with URL blocked', 'Popup was blocked by browser');
            }
        } catch (error) {
            addResult('popups', 'Error opening popup with URL', error.message);
        }
    };

    const handlePopupDelayed = () => {
        try {
            setTimeout(() => {
                const popup = window.open('', 'delayedPopup', 'width=400,height=300');
                if (popup) {
                    popup.document.write('<html><body><h2>Delayed Popup</h2><p>This popup opened after 1 second.</p></body></html>');
                    addResult('popups', 'Delayed popup opened', 'Popup opened after 1 second delay');
                } else {
                    addResult('popups', 'Delayed popup blocked', 'Delayed popup was blocked');
                }
            }, 1000);
            addResult('popups', 'Delayed popup scheduled', 'Will open in 1 second');
        } catch (error) {
            addResult('popups', 'Error scheduling delayed popup', error.message);
        }
    };

    const clearResults = () => {
        setResults([]);
    };

    return (
        <div style={{ minHeight: '100vh', position: 'relative', fontFamily: 'Arial, sans-serif' }}>
            {/* Top Bar - Test Results */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '180px',
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                color: 'white',
                padding: '15px 20px',
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5em', fontWeight: 'bold' }}>
                        📊 Test Results ({results.length})
                    </h2>
                    <button
                        onClick={clearResults}
                        style={{
                            padding: '8px 16px',
                            background: 'rgba(239, 68, 68, 0.8)',
                            border: '2px solid white',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.8)';
                        }}
                    >
                        🗑️ Clear Results
                    </button>
                </div>
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    maxHeight: '120px',
                    overflowY: 'auto'
                }}>
                    {results.length === 0 ? (
                        <div style={{ opacity: 0.7, fontStyle: 'italic', width: '100%' }}>
                            No test results yet. Click buttons below to test dialogs and permissions.
                        </div>
                    ) : (
                        results.map(result => (
                            <div
                                key={result.id}
                                style={{
                                    padding: '8px 12px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    border: `2px solid ${getResultBorderColor(result.type)}`,
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    minWidth: '200px',
                                    maxWidth: '300px'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <strong>{result.type.toUpperCase()}</strong>
                                    <span style={{ opacity: 0.8, fontSize: '11px' }}>{result.timestamp}</span>
                                </div>
                                <div style={{ marginBottom: '4px', fontSize: '11px' }}>{result.message}</div>
                                {result.result && (
                                    <div style={{ opacity: 0.9, fontSize: '10px', fontStyle: 'italic' }}>
                                        {result.result.length > 40 ? result.result.substring(0, 40) + '...' : result.result}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div style={{ marginTop: '180px', padding: '20px', maxWidth: '1400px', marginLeft: 'auto', marginRight: 'auto' }}>
                <h1 style={{ color: '#1f2937', marginBottom: '10px' }}>🔔 Browser Dialogs & Permissions Test Page</h1>
                <p style={{ color: '#6b7280', marginBottom: '30px' }}>
                    Test all browser dialogs (alert, confirm, prompt, beforeunload) and permission APIs (geolocation, camera, microphone, notifications, clipboard, downloads, popups)
                </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                {/* Browser Dialogs Section */}
                <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <h2 style={{ color: '#4f46e5', marginTop: 0, marginBottom: '20px' }}>🔹 Browser Dialogs</h2>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ color: '#374151', fontSize: '16px', marginBottom: '10px' }}>Alert Dialogs</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button onClick={handleAlert} style={buttonStyle}>Show Alert</button>
                            <button onClick={handleAlertWithInfo} style={buttonStyle}>Show Info Alert</button>
                            <button onClick={handleAlertWarning} style={buttonStyle}>Show Warning Alert</button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ color: '#374151', fontSize: '16px', marginBottom: '10px' }}>Confirm Dialogs</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button onClick={handleConfirm} style={buttonStyle}>Show Confirm</button>
                            <button onClick={handleConfirmDelete} style={buttonStyle}>Delete Confirmation</button>
                            <button onClick={handleConfirmSave} style={buttonStyle}>Save Confirmation</button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ color: '#374151', fontSize: '16px', marginBottom: '10px' }}>Prompt Dialogs</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button onClick={handlePrompt} style={buttonStyle}>Show Prompt</button>
                            <button onClick={handlePromptPassword} style={buttonStyle}>Password Prompt</button>
                            <button onClick={handlePromptEmail} style={buttonStyle}>Email Prompt</button>
                        </div>
                    </div>

                    <div>
                        <h3 style={{ color: '#374151', fontSize: '16px', marginBottom: '10px' }}>BeforeUnload Event</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button onClick={handleBeforeUnload} style={buttonStyle}>Add BeforeUnload Warning</button>
                            <button onClick={handleRemoveBeforeUnload} style={buttonStyle}>Remove BeforeUnload</button>
                        </div>
                    </div>
                </div>

                {/* Browser Permissions Section */}
                <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <h2 style={{ color: '#10b981', marginTop: 0, marginBottom: '20px' }}>🔹 Browser Permissions</h2>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ color: '#374151', fontSize: '16px', marginBottom: '10px' }}>📍 Geolocation</h3>
                        <div style={{ marginBottom: '10px', padding: '8px', background: '#fff', borderRadius: '4px', fontSize: '14px' }}>
                            Status: <strong>{geolocationStatus}</strong>
                        </div>
                        <button onClick={handleGeolocation} style={buttonStyle}>Request Location</button>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ color: '#374151', fontSize: '16px', marginBottom: '10px' }}>📷 Camera</h3>
                        <div style={{ marginBottom: '10px', padding: '8px', background: '#fff', borderRadius: '4px', fontSize: '14px' }}>
                            Status: <strong>{cameraStatus}</strong>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button onClick={handleCamera} style={buttonStyle}>Request Camera</button>
                            <button onClick={handleCameraAndMicrophone} style={buttonStyle}>Camera + Microphone</button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ color: '#374151', fontSize: '16px', marginBottom: '10px' }}>🎤 Microphone</h3>
                        <div style={{ marginBottom: '10px', padding: '8px', background: '#fff', borderRadius: '4px', fontSize: '14px' }}>
                            Status: <strong>{microphoneStatus}</strong>
                        </div>
                        <button onClick={handleMicrophone} style={buttonStyle}>Request Microphone</button>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ color: '#374151', fontSize: '16px', marginBottom: '10px' }}>🔔 Notifications</h3>
                        <div style={{ marginBottom: '10px', padding: '8px', background: '#fff', borderRadius: '4px', fontSize: '14px' }}>
                            Status: <strong>{notificationStatus}</strong>
                        </div>
                        <button onClick={handleNotifications} style={buttonStyle}>Request Notifications</button>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ color: '#374151', fontSize: '16px', marginBottom: '10px' }}>📋 Clipboard</h3>
                        <div style={{ marginBottom: '10px', padding: '8px', background: '#fff', borderRadius: '4px', fontSize: '14px' }}>
                            Status: <strong>{clipboardStatus}</strong>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button onClick={handleClipboardRead} style={buttonStyle}>Read Clipboard</button>
                            <button onClick={handleClipboardWrite} style={buttonStyle}>Write to Clipboard</button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ color: '#374151', fontSize: '16px', marginBottom: '10px' }}>💾 Downloads</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button onClick={handleDownload} style={buttonStyle}>Download Text File</button>
                            <button onClick={handleDownloadImage} style={buttonStyle}>Download Image</button>
                        </div>
                    </div>

                    <div>
                        <h3 style={{ color: '#374151', fontSize: '16px', marginBottom: '10px' }}>🪟 Popups</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button onClick={handlePopup} style={buttonStyle}>Open Popup</button>
                            <button onClick={handlePopupWithURL} style={buttonStyle}>Open Popup (URL)</button>
                            <button onClick={handlePopupDelayed} style={buttonStyle}>Delayed Popup (1s)</button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}

const buttonStyle = {
    padding: '12px 20px',
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background 0.2s'
};

const getResultBorderColor = (type) => {
    const colors = {
        alert: '#f59e0b',
        confirm: '#3b82f6',
        prompt: '#6366f1',
        beforeunload: '#ec4899',
        geolocation: '#10b981',
        camera: '#f59e0b',
        microphone: '#f59e0b',
        'camera+microphone': '#f59e0b',
        notifications: '#3b82f6',
        clipboard: '#6366f1',
        downloads: '#10b981',
        popups: '#ec4899'
    };
    return colors[type] || '#9ca3af';
};

