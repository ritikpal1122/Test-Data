import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export function ExplicitWaitTestPage() {
    const navigate = useNavigate();
    const [activePanels, setActivePanels] = useState(['startPanel']);
    const [eventLog, setEventLog] = useState([]);
    const [executionTime, setExecutionTime] = useState(0);
    const [currentPanelName, setCurrentPanelName] = useState('');
    const [stickyNotifications, setStickyNotifications] = useState({
        scroll: 'Interaction Status: Waiting for action...',
        click: 'Interaction Status: Waiting for action...',
        input: 'Interaction Status: Waiting for action...'
    });
    
    const timerIntervalRef = useRef(null);
    const executionStartTimeRef = useRef(0);
    const resetBtnRef = useRef(null);

    // Panel IDs in order
    const panelIds = ['startPanel', 'clickPanel', 'inputPanel', 'loadPanel', 'batchPanel', 'modalPanel'];
    const placeholderIds = ['placeholder2', 'placeholder3', 'placeholder4', 'placeholder5', 'placeholder6'];

    // Utility functions
    const randomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const testLog = (logEl, msg) => {
        if (!logEl) return;
        const div = document.createElement('div');
        div.textContent = msg;
        logEl.prepend(div);
        logEl.scrollTop = 0;
    };

    const delayedFetch = (url, delayMs) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                fetch(url)
                    .then(resolve)
                    .catch(reject);
            }, delayMs);
        });
    };

    const updateStickyNotification = (message, target = 'click') => {
        setStickyNotifications(prev => ({
            ...prev,
            [target]: message
        }));
        
        setEventLog(prev => [...prev, { message, target, timestamp: new Date().toISOString() }]);
        
        // Add active class to notification element
        const notificationIdMap = {
            'click': 'stickyNotificationForClick',
            'input': 'stickyNotificationForInput',
            'scroll': 'stickyNotificationForScroll'
        };
        const notificationEl = document.getElementById(notificationIdMap[target] || 'stickyNotificationForClick');
        if (notificationEl) {
            notificationEl.classList.add('active');
            // Remove active state after 2 seconds
            setTimeout(() => {
                notificationEl.classList.remove('active');
            }, 2000);
        }
    };

    const startExecutionTimer = (panelName) => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
        
        executionStartTimeRef.current = performance.now();
        setCurrentPanelName(panelName);
        
        timerIntervalRef.current = setInterval(() => {
            const currentTime = performance.now();
            const elapsedSeconds = ((currentTime - executionStartTimeRef.current) / 1000).toFixed(2);
            setExecutionTime(parseFloat(elapsedSeconds));
        }, 10);
    };

    const stopExecutionTimer = () => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
        
        const endTime = performance.now();
        const totalTime = ((endTime - executionStartTimeRef.current) / 1000).toFixed(2);
        setExecutionTime(parseFloat(totalTime));
        return totalTime;
    };

    const activateNextPanel = (currentIndex) => {
        if (currentIndex < panelIds.length) {
            const nextPanelId = panelIds[currentIndex];
            setActivePanels(prev => [...prev, nextPanelId]);
            
            // Hide placeholder
            const placeholder = document.getElementById(placeholderIds[currentIndex - 1]);
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            
            // Show next panel
            const nextPanel = document.getElementById(nextPanelId);
            if (nextPanel) {
                nextPanel.classList.add('active');
                enablePanelElements(nextPanel);
            }
            
            if (resetBtnRef.current) {
                resetBtnRef.current.classList.add('visible');
            }
            
            updateStickyNotification(`Step ${currentIndex} completed! Step ${currentIndex + 1} is now active.`);
        } else {
            updateStickyNotification('All steps completed! You can now interact with any panel.');
        }
    };

    const setPanelInteractivity = (panelEl, enabled) => {
        if (!panelEl) return;
        panelEl.querySelectorAll('button, input, select, textarea').forEach(el => {
            el.disabled = !enabled;
        });
    };

    const disablePanelElements = (panelEl) => setPanelInteractivity(panelEl, false);
    const enablePanelElements = (panelEl) => setPanelInteractivity(panelEl, true);

    const resetSequence = () => {
        window.location.reload();
    };

    // Initialize: disable all panels except startPanel
    useEffect(() => {
        panelIds.forEach((panelId, index) => {
            if (panelId !== 'startPanel') {
                const panel = document.getElementById(panelId);
                if (panel) {
                    disablePanelElements(panel);
                }
            }
        });
    }, []);

    // Panel 1: Start button - random intervals
    useEffect(() => {
        const btn = document.getElementById('startBtn');
        const logEl = document.getElementById('startLog');
        const durationInput = document.getElementById('startDuration');
        const delayInput = document.getElementById('startDelay');
        
        if (!btn || !logEl) return;

        let timer, end;
        let activePromises = [];

        const handleStart = () => {
            const duration = parseInt(durationInput?.value) || 5000;
            const delay = parseInt(delayInput?.value) || 0;

            startExecutionTimer('Start Random API Calls');
            updateStickyNotification('Start Random API Calls: "Start" button clicked');

            btn.disabled = true;
            logEl.innerHTML = '';
            end = Date.now() + duration;

            const doCall = () => {
                if (Date.now() > end) {
                    Promise.all(activePromises).then(() => {
                        clearTimeout(timer);
                        const totalTime = stopExecutionTimer();
                        testLog(logEl, `⏹️ Done (Total time: ${totalTime}s)`);
                        btn.disabled = false;
                        activateNextPanel(1);
                    });
                    return;
                }

                const id = randomInt(1, 100);
                testLog(logEl, `🕒 Requesting post ${id}...`);

                const promise = delayedFetch(`https://jsonplaceholder.typicode.com/posts/${id}`, delay)
                    .then(r => r.json())
                    .then(j => {
                        const elapsed = delay ? `(+${delay}ms)` : '';
                        testLog(logEl, `✅ ${j.id}: ${j.title.slice(0, 30)} ${elapsed}`);
                        activePromises = activePromises.filter(p => p !== promise);
                    })
                    .catch(e => {
                        testLog(logEl, `❌ ${e}`);
                        activePromises = activePromises.filter(p => p !== promise);
                    });

                activePromises.push(promise);
                timer = setTimeout(doCall, randomInt(200, 1000));
            };

            doCall();
        };

        btn.addEventListener('click', handleStart);
        return () => btn.removeEventListener('click', handleStart);
    }, []);

    // Panel 2: Clickable button - fixed interval
    useEffect(() => {
        const btn = document.getElementById('clickBtn');
        const logEl = document.getElementById('clickLog');
        const durationInput = document.getElementById('clickDuration');
        const intervalInput = document.getElementById('clickInterval');
        const delayInput = document.getElementById('clickDelay');

        if (!btn || !logEl) return;

        const handleClick = () => {
            const duration = parseInt(durationInput?.value) || 5000;
            const interval = parseInt(intervalInput?.value) || 200;
            const delay = parseInt(delayInput?.value) || 0;

            startExecutionTimer('Click to Flood API');
            updateStickyNotification('Click to Flood API: "Get flood details" button clicked', 'click');

            btn.disabled = true;
            logEl.innerHTML = '';
            const end = Date.now() + duration;
            let activePromises = [];

            const iv = setInterval(() => {
                if (Date.now() > end) {
                    clearInterval(iv);
                    Promise.all(activePromises).then(() => {
                        const totalTime = stopExecutionTimer();
                        testLog(logEl, `⏹️ Stopped (Total time: ${totalTime}s)`);
                        btn.disabled = false;
                        activateNextPanel(2);
                    });
                    return;
                }

                const userId = randomInt(1, 10);
                testLog(logEl, `🕒 Requesting user ${userId}...`);

                const promise = delayedFetch(`https://jsonplaceholder.typicode.com/users/${userId}`, delay)
                    .then(r => r.json())
                    .then(j => {
                        const elapsed = delay ? `(+${delay}ms)` : '';
                        testLog(logEl, `👤 ${j.id}: ${j.name} ${elapsed}`);
                        activePromises = activePromises.filter(p => p !== promise);
                    })
                    .catch(e => {
                        testLog(logEl, `❌ ${e}`);
                        activePromises = activePromises.filter(p => p !== promise);
                    });

                activePromises.push(promise);
            }, interval);
        };

        btn.addEventListener('click', handleClick);
        return () => btn.removeEventListener('click', handleClick);
    }, []);

    // Panel 3: Input - on Enter, random interval API calls
    useEffect(() => {
        const input = document.getElementById('apiInput');
        const logEl = document.getElementById('inputLog');
        const durationInput = document.getElementById('inputDuration');
        const delayInput = document.getElementById('inputDelay');

        if (!input || !logEl) return;

        let timer, end;

        const handleScroll = () => {
            if (!logEl) return;
            const scrollTop = logEl.scrollTop;
            const scrollHeight = logEl.scrollHeight - logEl.clientHeight;
            const percentage = Math.round((scrollTop / scrollHeight) * 100);
            console.log(`Scroll in Post search: ${percentage}%`);
            updateStickyNotification(`Scroll in Post search: ${percentage}%`, 'scroll');
        };

        logEl.addEventListener('scroll', handleScroll);

        const handleKeyDown = (e) => {
            if (e.key !== 'Enter') return;

            startExecutionTimer('Search for Post');
            const duration = parseInt(durationInput?.value) || 5000;
            const delay = parseInt(delayInput?.value) || 0;

            updateStickyNotification(`Type & Enter: Enter pressed with value "${input.value}"`, 'input');

            input.disabled = true;
            logEl.innerHTML = '';
            end = Date.now() + duration;

            const doCall = () => {
                if (Date.now() > end) {
                    clearTimeout(timer);
                    testLog(logEl, '⏹️ Done');
                    input.disabled = false;
                    activateNextPanel(3);
                    return;
                }

                const commentId = randomInt(1, 500);
                testLog(logEl, `🕒 Requesting comment ${commentId}...`);

                delayedFetch(`https://jsonplaceholder.typicode.com/comments/${commentId}`, delay)
                    .then(r => r.json())
                    .then(j => {
                        const elapsed = delay ? `(+${delay}ms)` : '';
                        testLog(logEl, `✉️ ${j.id}: ${j.name.slice(0, 30)} ${elapsed}`);
                    })
                    .catch(e => testLog(logEl, `❌ ${e}`));

                timer = setTimeout(doCall, randomInt(300, 700));
            };

            doCall();
        };

        input.addEventListener('keydown', handleKeyDown);
        return () => {
            input.removeEventListener('keydown', handleKeyDown);
            logEl.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Panel 4: Load content into scrollable div
    useEffect(() => {
        const btn = document.getElementById('loadContentBtn');
        const container = document.getElementById('scrollSection');
        const delayInput = document.getElementById('loadDelay');

        if (!btn || !container) return;

        const handleLoad = () => {
            startExecutionTimer('Load Scrollable Content');
            const delay = parseInt(delayInput?.value) || 0;

            updateStickyNotification('Load Scrollable Content: "Load Posts" button clicked', 'scroll');

            btn.disabled = true;
            container.innerHTML = 'Loading…';

            delayedFetch('https://jsonplaceholder.typicode.com/posts', delay)
                .then(r => r.json())
                .then(list => {
                    container.innerHTML = '';
                    const elapsed = delay ? `(loaded after ${delay}ms delay)` : '';
                    const header = document.createElement('div');
                    header.textContent = `Loaded ${list.slice(0, 20).length} posts ${elapsed}`;
                    header.style.fontWeight = 'bold';
                    header.style.marginBottom = '8px';
                    container.appendChild(header);

                    list.slice(0, 20).forEach(item => {
                        const div = document.createElement('div');
                        div.textContent = `${item.id}: ${item.title}`;
                        container.appendChild(div);
                    });

                    activateNextPanel(4);
                    btn.disabled = false;
                })
                .catch(e => {
                    container.textContent = `Error: ${e}`;
                    btn.disabled = false;
                });
        };

        btn.addEventListener('click', handleLoad);
        return () => btn.removeEventListener('click', handleLoad);
    }, []);

    // Panel 5: Batch API Calls
    useEffect(() => {
        const btn = document.getElementById('batchBtn');
        const logEl = document.getElementById('batchLog');
        const countInput = document.getElementById('batchCount');
        const delayInput = document.getElementById('batchDelay');

        if (!btn || !logEl) return;

        const handleBatch = () => {
            const count = Math.min(parseInt(countInput?.value) || 5, 20);
            const delay = parseInt(delayInput?.value) || 0;

            startExecutionTimer('Batch API Calls');
            btn.disabled = true;
            logEl.innerHTML = '';
            testLog(logEl, `Starting ${count} parallel API calls...`);

            const startTime = Date.now();
            const promises = [];

            for (let i = 0; i < count; i++) {
                const id = randomInt(1, 100);
                testLog(logEl, `🕒 [${i + 1}/${count}] Requesting post ${id}...`);

                const promise = delayedFetch(`https://jsonplaceholder.typicode.com/posts/${id}`, delay)
                    .then(r => r.json())
                    .then(j => {
                        const elapsed = delay ? `(+${delay}ms)` : '';
                        testLog(logEl, `✅ [${i + 1}/${count}] Post ${j.id}: ${j.title.slice(0, 30)} ${elapsed}`);
                        return j;
                    })
                    .catch(e => {
                        testLog(logEl, `❌ [${i + 1}/${count}] Error: ${e}`);
                        throw e;
                    });

                promises.push(promise);
            }

            Promise.allSettled(promises).then(() => {
                const totalTime = stopExecutionTimer();
                const totalTimeMs = Date.now() - startTime;
                testLog(logEl, `⏹️ All ${count} calls completed in ${totalTimeMs}ms (Total time: ${totalTime}s)`);
                btn.disabled = false;

                activateNextPanel(5);

                setTimeout(() => {
                    const modalPanel = document.getElementById('modalPanel');
                    const placeholder6 = document.getElementById('placeholder6');
                    if (modalPanel && placeholder6) {
                        modalPanel.classList.add('active');
                        placeholder6.style.display = 'none';
                    }
                }, 100);
            });
        };

        btn.addEventListener('click', handleBatch);
        return () => btn.removeEventListener('click', handleBatch);
    }, []);

    // Panel 6: Modal upload
    useEffect(() => {
        const openBtn = document.getElementById('openModalBtn');
        const overlay = document.getElementById('modalOverlay');
        const closeBtn = document.getElementById('closeModalBtn');
        const logEl = document.getElementById('modalLog');
        const durationInput = document.getElementById('modalDuration');
        const delayInput = document.getElementById('modalDelay');

        if (!openBtn || !overlay || !closeBtn || !logEl) return;

        let timer, end;
        let activePromises = [];

        const handleOpen = () => {
            const duration = parseInt(durationInput?.value) || 3000;
            const delay = parseInt(delayInput?.value) || 0;

            startExecutionTimer('Modal Upload');
            openBtn.disabled = true;
            logEl.innerHTML = '';
            testLog(logEl, `🔄 Making API calls for ${duration}ms before opening modal...`);
            end = Date.now() + duration;

            const doCall = () => {
                if (Date.now() > end) {
                    Promise.all(activePromises).then(() => {
                        clearTimeout(timer);
                        const totalTime = stopExecutionTimer();
                        testLog(logEl, `⏹️ API calls complete (Total time: ${totalTime}s), opening modal...`);
                        overlay.classList.add('active');
                        openBtn.disabled = false;
                    });
                    return;
                }

                const photoId = randomInt(1, 200);
                testLog(logEl, `🕒 Requesting photo ${photoId}...`);

                const promise = delayedFetch(`https://jsonplaceholder.typicode.com/photos/${photoId}`, delay)
                    .then(r => r.json())
                    .then(j => {
                        const elapsed = delay ? `(+${delay}ms)` : '';
                        testLog(logEl, `🖼️ ${j.id}: ${j.title.slice(0, 30)} ${elapsed}`);
                        activePromises = activePromises.filter(p => p !== promise);
                    })
                    .catch(e => {
                        testLog(logEl, `❌ ${e}`);
                        activePromises = activePromises.filter(p => p !== promise);
                    });

                activePromises.push(promise);
                timer = setTimeout(doCall, randomInt(300, 800));
            };

            doCall();
        };

        const handleClose = () => {
            overlay.classList.remove('active');
            testLog(logEl, '🔒 Modal closed');
            activateNextPanel(6);
        };

        openBtn.addEventListener('click', handleOpen);
        closeBtn.addEventListener('click', handleClose);
        
        return () => {
            openBtn.removeEventListener('click', handleOpen);
            closeBtn.removeEventListener('click', handleClose);
        };
    }, []);

    // Reset button
    useEffect(() => {
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtnRef.current = resetBtn;
            resetBtn.addEventListener('click', resetSequence);
            return () => resetBtn.removeEventListener('click', resetSequence);
        }
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px 20px',
            boxSizing: 'border-box'
        }}
        className="explicit-wait-page"
        >
            <style>{`
                .explicit-wait-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    grid-template-areas: 
                        "panel1 panel2 panel3"
                        "panel4 panel5 panel6";
                    gap: 20px;
                    max-width: 1200px;
                    margin: auto;
                }
                .panel-wrapper {
                    position: relative;
                }
                .panel {
                    background: white;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    opacity: 0;
                    visibility: hidden;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 0;
                    overflow: hidden;
                    transition: opacity 0.5s, visibility 0.5s, height 0.5s;
                }
                .panel.active {
                    opacity: 1;
                    visibility: visible;
                    height: auto;
                    position: relative;
                    overflow: visible;
                }
                #startPanel {
                    opacity: 1;
                    visibility: visible;
                    height: auto;
                    overflow: visible;
                }
                .panel-placeholder {
                    background: #f7fafc;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    text-align: center;
                    color: #718096;
                    font-style: italic;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 200px;
                    border: 2px dashed #cbd5e0;
                }
                .panel h2 {
                    margin-top: 0;
                    font-size: 1.2rem;
                    color: #2d3748;
                    margin-bottom: 15px;
                }
                .log {
                    margin-top: 10px;
                    max-height: 150px;
                    overflow-y: auto;
                    background: #f7fafc;
                    padding: 10px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    line-height: 1.5;
                    font-family: monospace;
                }
                .scroll-section {
                    height: 150px;
                    overflow-y: auto;
                    border: 1px solid #e2e8f0;
                    padding: 10px;
                    background: #f7fafc;
                    border-radius: 8px;
                    font-size: 0.9rem;
                }
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    visibility: hidden;
                    z-index: 1000;
                    padding: 20px;
                }
                .modal-overlay.active {
                    visibility: visible;
                }
                .modal {
                    background: white;
                    padding: 30px;
                    border-radius: 12px;
                    width: 350px;
                    max-width: 100%;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                }
                .control-row {
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                }
                .control-row label {
                    font-size: 0.9rem;
                    color: #4a5568;
                    font-weight: 500;
                    min-width: 100px;
                }
                .control-row input {
                    max-width: 100px;
                    padding: 6px 10px;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    touch-action: manipulation;
                    -webkit-appearance: none;
                    appearance: none;
                }
                .control-row input[type="number"] {
                    -moz-appearance: textfield;
                }
                .control-row input[type="number"]::-webkit-outer-spin-button,
                .control-row input[type="number"]::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                .sticky-notification {
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    background: #4a6fa5;
                    color: white;
                    padding: 15px;
                    margin-bottom: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    text-align: center;
                    font-weight: bold;
                    transition: background-color 0.3s;
                    font-size: 0.9rem;
                }
                .sticky-notification.active {
                    background-color: #5cb85c;
                }
                .reset-button {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    display: none;
                    z-index: 1000;
                    transition: all 0.3s ease;
                }
                .reset-button.visible {
                    display: block;
                }
                .reset-button:hover {
                    background: #c82333;
                    transform: scale(1.05);
                }
                .panel-wrapper:nth-child(1) { grid-area: panel1; }
                .panel-wrapper:nth-child(2) { grid-area: panel2; }
                .panel-wrapper:nth-child(3) { grid-area: panel3; }
                .panel-wrapper:nth-child(4) { grid-area: panel4; }
                .panel-wrapper:nth-child(5) { grid-area: panel5; }
                .panel-wrapper:nth-child(6) { grid-area: panel6; }
                button {
                    padding: 10px 20px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.95rem;
                    min-height: 44px;
                    touch-action: manipulation;
                }
                button:hover:not(:disabled) {
                    background: #5568d3;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }
                button:disabled {
                    background: #cbd5e0;
                    cursor: not-allowed;
                    transform: none;
                }

                /* Mobile Responsive Styles */
                @media (max-width: 768px) {
                    .explicit-wait-page {
                        padding: 20px 10px !important;
                    }
                    .main-container {
                        padding: 20px 15px !important;
                        border-radius: 12px !important;
                    }
                    .header-section {
                        margin-bottom: 25px !important;
                        padding-bottom: 20px !important;
                    }
                    .page-title {
                        font-size: 1.8em !important;
                        margin-bottom: 10px !important;
                    }
                    .page-description {
                        font-size: 0.95em !important;
                    }
                    .back-button {
                        top: 5px !important;
                        right: 10px !important;
                        padding: 8px 12px !important;
                        font-size: 0.85em !important;
                    }
                    .explicit-wait-container {
                        grid-template-columns: 1fr;
                        grid-template-areas: 
                            "panel1"
                            "panel2"
                            "panel3"
                            "panel4"
                            "panel5"
                            "panel6";
                        gap: 15px;
                    }
                    .panel {
                        padding: 15px;
                    }
                    .panel h2 {
                        font-size: 1.1rem;
                        margin-bottom: 12px;
                    }
                    .panel-placeholder {
                        padding: 15px;
                        min-height: 150px;
                        font-size: 0.9rem;
                    }
                    .control-row {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 8px;
                    }
                    .control-row label {
                        min-width: auto;
                        width: 100%;
                        font-size: 0.85rem;
                    }
                    .control-row input {
                        width: 100%;
                        max-width: 100%;
                        padding: 8px;
                    }
                    .log {
                        max-height: 120px;
                        font-size: 0.85rem;
                        padding: 8px;
                    }
                    .scroll-section {
                        height: 120px;
                        font-size: 0.85rem;
                        padding: 8px;
                    }
                    .sticky-notification {
                        padding: 12px;
                        font-size: 0.85rem;
                        margin-bottom: 15px;
                    }
                    .modal-overlay {
                        padding: 10px !important;
                    }
                    .modal {
                        width: 90%;
                        max-width: 350px;
                        padding: 20px;
                    }
                    .reset-button {
                        bottom: 15px;
                        right: 15px;
                        padding: 10px 16px;
                        font-size: 0.9rem;
                    }
                    button {
                        width: 100%;
                        padding: 12px 20px;
                        font-size: 1rem;
                    }
                }

                @media (max-width: 480px) {
                    .explicit-wait-page {
                        padding: 15px 8px !important;
                    }
                    .main-container {
                        padding: 15px 12px !important;
                        border-radius: 10px !important;
                    }
                    .header-section {
                        margin-bottom: 20px !important;
                        padding-bottom: 15px !important;
                    }
                    .page-title {
                        font-size: 1.5em !important;
                        margin-bottom: 8px !important;
                    }
                    .page-description {
                        font-size: 0.9em !important;
                    }
                    .back-button {
                        top: 5px !important;
                        right: 8px !important;
                        padding: 6px 10px !important;
                        font-size: 0.8em !important;
                    }
                    .panel {
                        padding: 12px;
                    }
                    .panel h2 {
                        font-size: 1rem;
                    }
                    .panel-placeholder {
                        padding: 12px;
                        min-height: 120px;
                        font-size: 0.85rem;
                    }
                    .sticky-notification {
                        padding: 10px;
                        font-size: 0.8rem;
                    }
                    .log {
                        max-height: 100px;
                        font-size: 0.8rem;
                    }
                    .scroll-section {
                        height: 100px;
                        font-size: 0.8rem;
                    }
                    .reset-button {
                        bottom: 10px;
                        right: 10px;
                        padding: 8px 12px;
                        font-size: 0.85rem;
                    }
                    button {
                        padding: 10px 16px;
                        font-size: 0.95rem;
                    }
                }

                /* Tablet Styles */
                @media (min-width: 769px) and (max-width: 1024px) {
                    .explicit-wait-page {
                        padding: 30px 15px !important;
                    }
                    .main-container {
                        padding: 30px 25px !important;
                    }
                    .explicit-wait-container {
                        grid-template-columns: repeat(2, 1fr);
                        grid-template-areas: 
                            "panel1 panel2"
                            "panel3 panel4"
                            "panel5 panel6";
                    }
                    .page-title {
                        font-size: 2.2em !important;
                    }
                }

                /* Prevent zoom on input focus on iOS */
                @media screen and (max-width: 768px) {
                    input[type="text"],
                    input[type="number"] {
                        font-size: 16px !important;
                    }
                }
            `}</style>

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
                    fontFamily: 'inherit',
                    minHeight: '44px',
                    touchAction: 'manipulation'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#5568d3';
                    e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#667eea';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
                className="back-button"
            >
                ← Back to Home
            </button>

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                background: 'white',
                borderRadius: '16px',
                padding: '40px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
            className="main-container"
            >
                <div style={{
                    textAlign: 'center',
                    marginBottom: '40px',
                    paddingBottom: '30px',
                    borderBottom: '3px solid #667eea'
                }}
                className="header-section"
                >
                    <h1 style={{
                        fontSize: '2.5em',
                        color: '#333',
                        marginBottom: '15px',
                        fontWeight: 'bold',
                        marginTop: 0
                    }}
                    className="page-title"
                    >
                        ⏳ Explicit Wait Test on Element
                    </h1>
                    <p style={{
                        fontSize: '1.1em',
                        color: '#666',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}
                    className="page-description"
                    >
                        Test explicit wait scenarios with sequential panel activation and API call delays
                    </p>
                </div>

                <div className="sticky-notification" id="stickyNotificationForScroll">
                    {stickyNotifications.scroll}
                </div>
                <div className="sticky-notification" id="stickyNotificationForClick">
                    {stickyNotifications.click}
                </div>
                <div className="sticky-notification" id="stickyNotificationForInput">
                    {stickyNotifications.input}
                </div>
                <div className="sticky-notification" id="execution-time-display">
                    {currentPanelName ? `${currentPanelName} - Execution Time: ${executionTime.toFixed(2)}s` : 'Execution Time: 0.00s'}
                </div>

                <div className="explicit-wait-container">
                {/* Panel 1: Start button */}
                <div className="panel-wrapper">
                    <div className="panel active" id="startPanel">
                        <h2>Start Random API Calls</h2>
                        <div className="control-row">
                            <label htmlFor="startDuration">Duration (ms):</label>
                            <input type="number" id="startDuration" defaultValue="5000" min="1000" step="1000" />
                        </div>
                        <div className="control-row">
                            <label htmlFor="startDelay">Delay (ms):</label>
                            <input type="number" id="startDelay" defaultValue="0" min="0" step="100" />
                        </div>
                        <button id="startBtn">Start</button>
                        <div className="log" id="startLog"></div>
                    </div>
                </div>

                {/* Panel 2: Clickable button */}
                <div className="panel-wrapper">
                    <div className="panel-placeholder" id="placeholder2">Waiting for step 1 to complete...</div>
                    <div className="panel" id="clickPanel">
                        <h2>Click to Flood API</h2>
                        <div className="control-row">
                            <label htmlFor="clickDuration">Duration (ms):</label>
                            <input type="number" id="clickDuration" defaultValue="5000" min="1000" step="1000" />
                        </div>
                        <div className="control-row">
                            <label htmlFor="clickInterval">Interval (ms):</label>
                            <input type="number" id="clickInterval" defaultValue="200" min="50" step="50" />
                        </div>
                        <div className="control-row">
                            <label htmlFor="clickDelay">Delay (ms):</label>
                            <input type="number" id="clickDelay" defaultValue="100" min="0" step="100" />
                        </div>
                        <button id="clickBtn">Get flood details</button>
                        <div className="log" id="clickLog"></div>
                    </div>
                </div>

                {/* Panel 3: Input box */}
                <div className="panel-wrapper">
                    <div className="panel-placeholder" id="placeholder3">Waiting for step 2 to complete...</div>
                    <div className="panel" id="inputPanel">
                        <h2>Search for a post</h2>
                        <div className="control-row">
                            <label htmlFor="inputDuration">Duration (ms):</label>
                            <input type="number" id="inputDuration" defaultValue="5000" min="1000" step="1000" />
                        </div>
                        <div className="control-row">
                            <label htmlFor="inputDelay">Delay (ms):</label>
                            <input type="number" id="inputDelay" defaultValue="100" min="0" step="100" />
                        </div>
                        <input type="text" id="apiInput" placeholder="Search for a post" style={{ width: '95%', padding: '8px' }} />
                        <div className="log" id="inputLog"></div>
                    </div>
                </div>

                {/* Panel 4: Load content */}
                <div className="panel-wrapper">
                    <div className="panel-placeholder" id="placeholder4">Waiting for step 3 to complete...</div>
                    <div className="panel" id="loadPanel">
                        <h2>Load Scrollable Content</h2>
                        <div className="control-row">
                            <label htmlFor="loadDelay">Delay (ms):</label>
                            <input type="number" id="loadDelay" defaultValue="100" min="0" step="100" />
                        </div>
                        <button id="loadContentBtn">Load Posts</button>
                        <div className="scroll-section" id="scrollSection"></div>
                    </div>
                </div>

                {/* Panel 5: Batch API Calls */}
                <div className="panel-wrapper">
                    <div className="panel-placeholder" id="placeholder5">Waiting for step 4 to complete...</div>
                    <div className="panel" id="batchPanel">
                        <h2>Batch API Calls</h2>
                        <div className="control-row">
                            <label htmlFor="batchCount">Parallel Calls:</label>
                            <input type="number" id="batchCount" defaultValue="5" min="1" max="20" step="1" />
                        </div>
                        <div className="control-row">
                            <label htmlFor="batchDelay">Delay (ms):</label>
                            <input type="number" id="batchDelay" defaultValue="100" min="0" step="100" />
                        </div>
                        <button id="batchBtn">Execute Batch</button>
                        <div className="log" id="batchLog"></div>
                    </div>
                </div>

                {/* Panel 6: Modal upload */}
                <div className="panel-wrapper">
                    <div className="panel-placeholder" id="placeholder6">Waiting for step 5 to complete...</div>
                    <div className="panel" id="modalPanel">
                        <h2>Open Upload Modal</h2>
                        <div className="control-row">
                            <label htmlFor="modalDuration">API Duration (ms):</label>
                            <input type="number" id="modalDuration" defaultValue="3000" min="1000" step="1000" />
                        </div>
                        <div className="control-row">
                            <label htmlFor="modalDelay">API Delay (ms):</label>
                            <input type="number" id="modalDelay" defaultValue="100" min="0" step="100" />
                        </div>
                        <button id="openModalBtn">Upload File</button>
                        <div className="log" id="modalLog"></div>
                    </div>
                </div>
                </div>

                {/* Modal */}
                <div className="modal-overlay" id="modalOverlay">
                    <div className="modal">
                        <h3 style={{ marginTop: 0, color: '#2d3748' }}>Upload a File</h3>
                        <input 
                            type="file" 
                            id="fileInput" 
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                marginBottom: '15px'
                            }}
                        />
                        <button id="closeModalBtn" style={{ width: '100%' }}>Close</button>
                    </div>
                </div>

                {/* Reset button */}
                <button id="resetBtn" className="reset-button">Reset Sequence</button>
            </div>
        </div>
    );
}

