import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function CompleteCanvasPage() {
    const navigate = useNavigate();
    const [clickHistory, setClickHistory] = useState([]);
    const [hoveredElement, setHoveredElement] = useState(null);
    const [inputValues, setInputValues] = useState({});
    const [activeInput, setActiveInput] = useState(null);
    const canvasRef = useRef(null);
    const elementsRef = useRef([]);

    // Track click events
    const handleClick = (elementName, elementType = 'button') => {
        const timestamp = new Date().toLocaleTimeString();
        const newClick = {
            id: Date.now(),
            element: elementName,
            type: elementType,
            time: timestamp,
            action: 'click'
        };
        setClickHistory(prev => [newClick, ...prev].slice(0, 50));
    };

    // Track hover events
    const handleHover = (elementName, isHovering) => {
        if (isHovering) {
            setHoveredElement(elementName);
        } else {
            setHoveredElement(null);
        }
    };

    // Clear input value
    const handleClearInput = (inputId) => {
        setInputValues(prev => {
            const newValues = { ...prev };
            delete newValues[inputId];
            return newValues;
        });
        handleClick(`Input ${inputId} (cleared)`, 'input');
        drawCanvas();
    };

    // Clear all inputs
    const handleClearAllInputs = () => {
        setInputValues({});
        handleClick('All Inputs (cleared)', 'action');
        drawCanvas();
    };

    // Clear click history
    const handleClearHistory = () => {
        setClickHistory([]);
    };

    // Button colors
    const buttonColors = [
        { bg: '#667eea', hover: '#5568d3', text: 'white' },
        { bg: '#f59e0b', hover: '#d97706', text: 'white' },
        { bg: '#10b981', hover: '#059669', text: 'white' },
        { bg: '#ef4444', hover: '#dc2626', text: 'white' },
        { bg: '#8b5cf6', hover: '#7c3aed', text: 'white' },
        { bg: '#ec4899', hover: '#db2777', text: 'white' },
        { bg: '#06b6d4', hover: '#0891b2', text: 'white' },
        { bg: '#f97316', hover: '#ea580c', text: 'white' }
    ];

    const getRandomColor = (index) => buttonColors[index % buttonColors.length];

    // Check if two rectangles overlap
    const checkOverlap = (rect1, rect2, padding = 5) => {
        return !(
            rect1.x + rect1.width + padding < rect2.x ||
            rect2.x + rect2.width + padding < rect1.x ||
            rect1.y + rect1.height + padding < rect2.y ||
            rect2.y + rect2.height + padding < rect1.y
        );
    };

    // Check if position is valid (no overlaps and within bounds)
    const isValidPosition = (newRect, existingRects, bounds) => {
        // Check boundaries
        if (newRect.x < bounds.padding || 
            newRect.y < bounds.padding ||
            newRect.x + newRect.width > bounds.width - bounds.padding ||
            newRect.y + newRect.height > bounds.height - bounds.padding) {
            return false;
        }
        
        // Check overlaps
        for (const existing of existingRects) {
            if (checkOverlap(newRect, existing)) {
                return false;
            }
        }
        
        return true;
    };

    // Generate random position with collision detection
    const generateRandomPosition = (existingRects, bounds, elementWidth, elementHeight, maxAttempts = 100) => {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const x = bounds.padding + Math.random() * (bounds.width - bounds.padding * 2 - elementWidth);
            const y = bounds.padding + Math.random() * (bounds.height - bounds.padding * 2 - elementHeight);
            
            const newRect = { x, y, width: elementWidth, height: elementHeight };
            
            if (isValidPosition(newRect, existingRects, bounds)) {
                return newRect;
            }
        }
        
        // Fallback: grid position if random fails
        const cols = Math.floor((bounds.width - bounds.padding * 2) / (elementWidth + 10));
        const index = existingRects.length;
        const row = Math.floor(index / cols);
        const col = index % cols;
        return {
            x: bounds.padding + col * (elementWidth + 10),
            y: bounds.padding + row * (elementHeight + 10),
            width: elementWidth,
            height: elementHeight
        };
    };

    // Calculate element positions with random placement and collision detection
    const calculatePositions = () => {
        if (typeof window === 'undefined') return { buttons: [], inputs: [] };
        
        const navbarHeight = 140;
        const canvasPadding = 10;
        const headerHeight = 60; // Header + clear button area
        const availableHeight = window.innerHeight - navbarHeight;
        const availableWidth = window.innerWidth;
        const canvasHeight = availableHeight - canvasPadding * 2;
        const canvasWidth = availableWidth - canvasPadding * 2;
        
        const elementWidth = 140;
        const elementHeight = 40;
        const inputClearWidth = 32;
        const inputTotalWidth = elementWidth + inputClearWidth + 6;
        
        const bounds = {
            padding: 10,
            width: canvasWidth,
            height: canvasHeight,
            startY: headerHeight + 10 // Start after header
        };
        
        const existingRects = [];
        const buttons = [];
        const buttonCount = 12;
        
        // Generate random button positions
        for (let i = 0; i < buttonCount; i++) {
            const rect = generateRandomPosition(existingRects, {
                ...bounds,
                height: bounds.height - 100 // Reserve space for inputs
            }, elementWidth, elementHeight);
            
            buttons.push({
                id: `btn-${i}`,
                type: 'button',
                x: rect.x,
                y: rect.y,
                width: elementWidth,
                height: elementHeight,
                text: `Button ${i + 1}`,
                color: getRandomColor(i)
            });
            
            existingRects.push(rect);
        }
        
        // Generate random input positions
        const inputs = [];
        const inputCount = 8;
        
        for (let i = 0; i < inputCount; i++) {
            const rect = generateRandomPosition(existingRects, bounds, inputTotalWidth, elementHeight);
            
            inputs.push({
                id: `input-${i}`,
                type: 'input',
                x: rect.x,
                y: rect.y,
                width: elementWidth,
                height: elementHeight,
                placeholder: `Input ${i + 1}`,
                clearX: rect.x + elementWidth + 6,
                clearY: rect.y,
                clearWidth: inputClearWidth,
                clearHeight: elementHeight
            });
            
            // Add both input and clear button to existing rects
            existingRects.push(rect);
            existingRects.push({
                x: rect.x + elementWidth + 6,
                y: rect.y,
                width: inputClearWidth,
                height: elementHeight
            });
        }
        
        return { buttons, inputs, canvasWidth, canvasHeight };
    };

    const [dimensions] = useState(() => {
        if (typeof window !== 'undefined') {
            const navbarHeight = 140;
            const availableHeight = window.innerHeight - navbarHeight;
            const availableWidth = window.innerWidth;
            return { availableHeight, availableWidth, navbarHeight };
        }
        return { availableHeight: 600, availableWidth: 1200, navbarHeight: 140 };
    });

    const [elements] = useState(() => {
        if (typeof window !== 'undefined') {
            // Generate new random positions on each page load/refresh
            const pos = calculatePositions();
            if (pos.buttons && pos.inputs) {
                elementsRef.current = [...pos.buttons, ...pos.inputs];
                console.log('Canvas elements positioned:', {
                    buttons: pos.buttons.length,
                    inputs: pos.inputs.length,
                    timestamp: new Date().toISOString()
                });
            }
            return pos;
        }
        return { buttons: [], inputs: [], canvasWidth: 1200, canvasHeight: 600 };
    });

    // Draw canvas
    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || !elements || !elements.canvasWidth) return;
        
        const ctx = canvas.getContext('2d');
        const { canvasWidth, canvasHeight } = elements;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw background
        const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
        gradient.addColorStop(0, '#f5f7fa');
        gradient.addColorStop(1, '#c3cfe2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw header
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(10, 10, canvasWidth - 20, 35);
        ctx.fillStyle = '#333';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🎨 Interactive Canvas', canvasWidth / 2, 33);
        
        // Draw clear all button
        const clearAllX = canvasWidth / 2 - 50;
        const clearAllY = 55;
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(clearAllX, clearAllY, 100, 30);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🗑️ Clear All', clearAllX + 50, clearAllY + 20);
        
        // Store clear all button
        const clearAllBtn = {
            id: 'clear-all',
            type: 'button',
            x: clearAllX,
            y: clearAllY,
            width: 100,
            height: 30
        };
        if (!elementsRef.current.find(e => e.id === 'clear-all')) {
            elementsRef.current.push(clearAllBtn);
        }
        
        // Draw buttons
        elements.buttons.forEach(btn => {
            const isHovered = hoveredElement === btn.text;
            const color = isHovered ? btn.color.hover : btn.color.bg;
            
            // Button background
            ctx.fillStyle = color;
            ctx.fillRect(btn.x, btn.y, btn.width, btn.height);
            
            // Button border
            ctx.strokeStyle = isHovered ? '#fff' : 'rgba(0,0,0,0.2)';
            ctx.lineWidth = 2;
            ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);
            
            // Button text
            ctx.fillStyle = btn.color.text;
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(btn.text, btn.x + btn.width / 2, btn.y + btn.height / 2);
        });
        
        // Draw inputs
        elements.inputs.forEach(input => {
            const isActive = activeInput === input.id;
            const isHovered = hoveredElement === input.placeholder;
            
            // Input background
            ctx.fillStyle = isActive ? '#f0f9ff' : 'white';
            ctx.fillRect(input.x, input.y, input.width, input.height);
            
            // Input border
            ctx.strokeStyle = isActive ? '#2563eb' : (isHovered ? '#3b82f6' : '#3b82f6');
            ctx.lineWidth = isActive ? 3 : 2;
            ctx.strokeRect(input.x, input.y, input.width, input.height);
            
            // Input text or placeholder
            const currentValue = inputValues[input.id] || '';
            ctx.fillStyle = currentValue ? '#333' : '#999';
            ctx.font = '14px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            const displayText = currentValue || input.placeholder;
            
            // Measure text to handle overflow
            const maxWidth = input.width - 16;
            let textToShow = displayText;
            const metrics = ctx.measureText(textToShow);
            if (metrics.width > maxWidth && currentValue) {
                // Show end of text if too long
                while (ctx.measureText('...' + textToShow).width > maxWidth && textToShow.length > 0) {
                    textToShow = textToShow.substring(1);
                }
                textToShow = '...' + textToShow;
            }
            
            ctx.fillText(textToShow, input.x + 8, input.y + input.height / 2);
            
            // Draw cursor if active
            if (isActive) {
                const cursorX = input.x + 8 + (currentValue ? ctx.measureText(currentValue).width : 0);
                ctx.fillStyle = '#2563eb';
                ctx.fillRect(cursorX, input.y + 8, 2, input.height - 16);
            }
            
            // Clear button for input
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(input.clearX, input.clearY, input.clearWidth, input.clearHeight);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('✕', input.clearX + input.clearWidth / 2, input.clearY + input.clearHeight / 2);
        });
    };

    // Handle canvas click
    const handleCanvasClick = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check all elements
        for (const element of elementsRef.current) {
            if (x >= element.x && x <= element.x + element.width &&
                y >= element.y && y <= element.y + element.height) {
                
                if (element.id === 'clear-all') {
                    handleClearAllInputs();
                    return;
                }
                
                if (element.type === 'button') {
                    handleClick(element.text, 'button');
                    drawCanvas();
                    return;
                }
                
                if (element.type === 'input') {
                    // Check if clicked on clear button
                    if (x >= element.clearX && x <= element.clearX + element.clearWidth &&
                        y >= element.clearY && y <= element.clearY + element.clearHeight) {
                        handleClearInput(element.id);
                        return;
                    }
                    
                    // Clicked on input - activate for typing
                    setActiveInput(element.id);
                    handleClick(`${element.placeholder} (focused)`, 'input');
                    drawCanvas();
                    // Focus canvas for keyboard events
                    canvas.focus();
                    return;
                }
            }
        }
        
        // Clicked outside - deactivate input
        if (activeInput) {
            setActiveInput(null);
            drawCanvas();
        }
    };

    // Handle canvas mouse move
    const handleCanvasMouseMove = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        let found = null;
        for (const element of elementsRef.current) {
            // Check clear button for inputs
            if (element.type === 'input' && 
                x >= element.clearX && x <= element.clearX + element.clearWidth &&
                y >= element.clearY && y <= element.clearY + element.clearHeight) {
                found = `${element.placeholder} (clear)`;
                break;
            }
            
            // Check main element
            if (x >= element.x && x <= element.x + element.width &&
                y >= element.y && y <= element.y + element.height) {
                if (element.type === 'button') {
                    found = element.text;
                } else if (element.type === 'input') {
                    found = element.placeholder;
                }
                break;
            }
        }
        
        if (found !== hoveredElement) {
            handleHover(found, found !== null);
            drawCanvas();
        }
        
        // Change cursor
        canvas.style.cursor = found ? 'pointer' : 'default';
    };

    // Handle keyboard input
    const handleKeyDown = useCallback((e) => {
        if (!activeInput) return;
        
        const currentValue = inputValues[activeInput] || '';
        
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newValue = currentValue.slice(0, -1);
            setInputValues(prev => {
                const updated = { ...prev };
                if (newValue) {
                    updated[activeInput] = newValue;
                } else {
                    delete updated[activeInput];
                }
                return updated;
            });
            if (newValue) {
                const timestamp = new Date().toLocaleTimeString();
                const newClick = {
                    id: Date.now(),
                    element: `Input ${activeInput} (typed: "${newValue}")`,
                    type: 'input',
                    time: timestamp,
                    action: 'click'
                };
                setClickHistory(prev => [newClick, ...prev].slice(0, 50));
            }
            // Redraw will happen via useEffect when inputValues changes
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentValue) {
                const timestamp = new Date().toLocaleTimeString();
                const newClick = {
                    id: Date.now(),
                    element: `Input ${activeInput} (submitted: "${currentValue}")`,
                    type: 'input',
                    time: timestamp,
                    action: 'click'
                };
                setClickHistory(prev => [newClick, ...prev].slice(0, 50));
            }
            setActiveInput(null);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setActiveInput(null);
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            // Regular character input
            e.preventDefault();
            const newValue = currentValue + e.key;
            setInputValues(prev => ({ ...prev, [activeInput]: newValue }));
            const timestamp = new Date().toLocaleTimeString();
            const newClick = {
                id: Date.now(),
                element: `Input ${activeInput} (typed: "${newValue}")`,
                type: 'input',
                time: timestamp,
                action: 'click'
            };
            setClickHistory(prev => [newClick, ...prev].slice(0, 50));
            // Redraw will happen via useEffect when inputValues changes
        }
    }, [activeInput, inputValues]);

    // Draw on mount and updates
    useEffect(() => {
        drawCanvas();
    }, [hoveredElement, inputValues, activeInput]);

    // Add keyboard event listener
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        canvas.setAttribute('tabindex', '0'); // Make canvas focusable
        canvas.addEventListener('keydown', handleKeyDown);
        
        return () => {
            canvas.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
            {/* Top Navigation Bar - Shows Click History */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '140px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '15px 20px',
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5em', fontWeight: 'bold' }}>
                        🎯 Interactive Canvas - Click Tracker
                    </h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                padding: '8px 16px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: '2px solid white',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                            }}
                        >
                            🏠 Home
                        </button>
                        <button
                            onClick={handleClearHistory}
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
                            🗑️ Clear History
                        </button>
                        {hoveredElement && (
                            <div style={{
                                padding: '8px 16px',
                                background: 'rgba(16, 185, 129, 0.8)',
                                border: '2px solid white',
                                borderRadius: '8px',
                                fontWeight: 'bold'
                            }}>
                                🖱️ Hovering: {hoveredElement}
                            </div>
                        )}
                    </div>
                </div>
                <div style={{
                    fontSize: '0.9em',
                    opacity: 0.9,
                    marginBottom: '8px'
                }}>
                    Total Clicks: <strong>{clickHistory.length}</strong> | 
                    {hoveredElement && ` Currently Hovering: ${hoveredElement}`}
                </div>
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    maxHeight: '60px',
                    overflowY: 'auto'
                }}>
                    {clickHistory.length === 0 ? (
                        <div style={{ opacity: 0.7, fontStyle: 'italic' }}>
                            No clicks yet. Start clicking buttons and interacting with inputs!
                        </div>
                    ) : (
                        clickHistory.map((click) => (
                            <div
                                key={click.id}
                                style={{
                                    padding: '6px 12px',
                                    background: click.type === 'button' ? 'rgba(16, 185, 129, 0.3)' : 
                                               click.type === 'input' ? 'rgba(59, 130, 246, 0.3)' : 
                                               'rgba(251, 191, 36, 0.3)',
                                    border: `2px solid ${click.type === 'button' ? '#10b981' : 
                                                    click.type === 'input' ? '#3b82f6' : '#fbbf24'}`,
                                    borderRadius: '6px',
                                    fontSize: '0.85em',
                                    whiteSpace: 'nowrap',
                                    animation: 'fadeIn 0.3s ease'
                                }}
                            >
                                <strong>{click.element}</strong> <span style={{ opacity: 0.8 }}>@{click.time}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* HTML5 Canvas - No DOM elements, everything is drawn */}
            <div style={{
                position: 'absolute',
                top: `${dimensions.navbarHeight}px`,
                left: 0,
                right: 0,
                bottom: 0,
                height: `${dimensions.availableHeight}px`,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px',
                boxSizing: 'border-box',
                background: '#f0f0f0'
            }}>
                <canvas
                    ref={canvasRef}
                    width={elements?.canvasWidth || dimensions.availableWidth - 20}
                    height={elements?.canvasHeight || dimensions.availableHeight - 20}
                    onClick={handleCanvasClick}
                    onMouseMove={handleCanvasMouseMove}
                    tabIndex={0}
                    style={{
                        border: '3px solid #667eea',
                        borderRadius: '8px',
                        cursor: 'default',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        outline: 'none'
                    }}
                />
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
