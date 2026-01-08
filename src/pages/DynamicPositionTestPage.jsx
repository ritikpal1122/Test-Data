import React, { useState, useEffect } from 'react';

export const DynamicPositionTestPage = () => {
    const [elements, setElements] = useState([]);
    const [clickCount, setClickCount] = useState({});
    const [inputValues, setInputValues] = useState({});
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Handle window resize for mobile responsiveness
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Generate random positions for elements on each page load without overlaps
    useEffect(() => {
        // Responsive element dimensions - smaller on mobile to fit more on screen
        const elementWidth = isMobile ? 100 : 220;
        const elementHeight = isMobile ? 60 : 120;
        const padding = isMobile ? 5 : 20;
        const spacing = isMobile ? 3 : 8;
        const topOffset = isMobile ? 5 : 100;

        // Full page dimensions
        const pageWidth = window.innerWidth;
        const pageHeight = window.innerHeight;
        
        // On mobile, limit to viewport height to prevent scrolling
        const maxHeight = isMobile ? pageHeight : pageHeight;

        // Calculate number of columns that fit
        const availableWidth = pageWidth - padding * 2;
        const cols = Math.max(1, Math.floor(availableWidth / (elementWidth + spacing)));
        
        // Calculate column width (centered on desktop, left-aligned on mobile)
        const totalColumnsWidth = cols * elementWidth + (cols - 1) * spacing;
        const startLeft = isMobile ? padding : (pageWidth - totalColumnsWidth) / 2;
        
        // Calculate max rows that fit on screen
        const maxRows = Math.floor((maxHeight) / (elementHeight + spacing));

        // Generate random dynamic ID
        const generateDynamicId = (prefix) => {
            const randomStr = Math.random().toString(36).substring(2, 9);
            const timestamp = Date.now().toString(36);
            return `${prefix}-${randomStr}-${timestamp}`;
        };

        const elementTypes = [
            { type: 'button', id: generateDynamicId('btn'), label: 'Click Me 1', color: '#3182ce' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Click Me 2', color: '#10b981' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Click Me 3', color: '#f59e0b' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Click Me 4', color: '#ef4444' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Click Me 5', color: '#6366f1' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Click Me 6', color: '#8b5cf6' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Click Me 7', color: '#ec4899' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Click Me 8', color: '#06b6d4' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Click Me 9', color: '#14b8a6' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Click Me 10', color: '#f97316' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Click Me 11', color: '#dc2626' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Click Me 12', color: '#7c3aed' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Click Me 13', color: '#059669' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Click Me 14', color: '#ea580c' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Click Me 15', color: '#be123c' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Click Me 16', color: '#1e40af' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Click Me 17', color: '#7c2d12' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Click Me 18', color: '#581c87' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Click Me 19', color: '#064e3b' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Click Me 20', color: '#831843' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Submit', color: '#dc2626' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Reset', color: '#7c3aed' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Save', color: '#059669' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Cancel', color: '#ea580c' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Delete', color: '#be123c' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Update', color: '#0284c7' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Edit', color: '#ca8a04' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Add', color: '#16a34a' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Remove', color: '#dc2626' },
            { type: 'button', id: generateDynamicId('btn'), label: 'Clear', color: '#64748b' },
            { type: 'input', id: generateDynamicId('input'), label: 'Input Field 1', placeholder: 'Type here...', color: '#8b5cf6' },
            { type: 'input', id: generateDynamicId('input'), label: 'Input Field 2', placeholder: 'Enter text...', color: '#ec4899' },
            { type: 'input', id: generateDynamicId('input'), label: 'Input Field 3', placeholder: 'Your name...', color: '#06b6d4' },
            { type: 'input', id: generateDynamicId('input'), label: 'Email', placeholder: 'email@example.com', color: '#14b8a6' },
            { type: 'input', id: generateDynamicId('input'), label: 'Password', placeholder: 'Enter password', type: 'password', color: '#f97316' },
            { type: 'input', id: generateDynamicId('input'), label: 'Phone', placeholder: 'Enter phone...', color: '#3b82f6' },
            { type: 'input', id: generateDynamicId('input'), label: 'Address', placeholder: 'Enter address...', color: '#10b981' },
            { type: 'input', id: generateDynamicId('input'), label: 'City', placeholder: 'Enter city...', color: '#f59e0b' },
            { type: 'input', id: generateDynamicId('input'), label: 'Zip Code', placeholder: 'Enter zip...', color: '#8b5cf6' },
            { type: 'input', id: generateDynamicId('input'), label: 'Country', placeholder: 'Enter country...', color: '#ec4899' },
            { type: 'input', id: generateDynamicId('input'), label: 'Username', placeholder: 'Enter username...', color: '#6366f1' },
            { type: 'input', id: generateDynamicId('input'), label: 'First Name', placeholder: 'Enter first name...', color: '#8b5cf6' },
            { type: 'input', id: generateDynamicId('input'), label: 'Last Name', placeholder: 'Enter last name...', color: '#ec4899' },
            { type: 'input', id: generateDynamicId('input'), label: 'Company', placeholder: 'Enter company...', color: '#06b6d4' },
            { type: 'input', id: generateDynamicId('input'), label: 'Website', placeholder: 'Enter website...', color: '#14b8a6' },
            { type: 'input', id: generateDynamicId('input'), label: 'Date', placeholder: 'Enter date...', type: 'date', color: '#f97316' },
            { type: 'input', id: generateDynamicId('input'), label: 'Time', placeholder: 'Enter time...', type: 'time', color: '#3b82f6' },
            { type: 'input', id: generateDynamicId('input'), label: 'Number', placeholder: 'Enter number...', type: 'number', color: '#10b981' },
            { type: 'input', id: generateDynamicId('input'), label: 'Search', placeholder: 'Search...', color: '#f59e0b' },
            { type: 'input', id: generateDynamicId('input'), label: 'Comments', placeholder: 'Enter comments...', color: '#8b5cf6' }
        ];

        // Track current row for each column
        const columnRows = new Array(cols).fill(0);
        
        // Shuffle elements for random column assignment on each refresh
        const shuffledElements = [...elementTypes].sort(() => Math.random() - 0.5);
        
        const positionedElements = shuffledElements.map((el, index) => {
            // Assign to column (round-robin or random)
            const colIndex = index % cols;
            let row = columnRows[colIndex];
            
            // On mobile, wrap to next column if row exceeds max
            if (isMobile && row >= maxRows) {
                // Find column with least rows
                const minRowIndex = columnRows.indexOf(Math.min(...columnRows));
                row = columnRows[minRowIndex];
                columnRows[minRowIndex] = row + 1;
            } else {
                // Update row for this column
                columnRows[colIndex] = row + 1;
            }
            
            const left = startLeft + colIndex * (elementWidth + spacing);
            const top = topOffset + padding + row * (elementHeight + spacing);
            
            return {
                ...el,
                position: {
                    top: top + 'px',
                    left: left + 'px'
                },
                zIndex: 1
            };
        });

        setElements(positionedElements);
        
        // Initialize click counts
        const initialClicks = {};
        const initialValues = {};
        elementTypes.forEach(el => {
            initialClicks[el.id] = 0;
            initialValues[el.id] = '';
        });
        setClickCount(initialClicks);
        setInputValues(initialValues);
    }, [isMobile]); // Re-run when mobile state changes

    const handleButtonClick = (id) => {
        setClickCount(prev => ({
            ...prev,
            [id]: (prev[id] || 0) + 1
        }));
    };

    const handleInputChange = (id, value) => {
        setInputValues(prev => ({
            ...prev,
            [id]: value
        }));
    };

    return (
        <div style={{
            height: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: isMobile ? '5px' : '20px',
            position: 'relative',
            overflow: isMobile ? 'hidden' : 'auto'
        }}>
            {elements.map((element) => (
                <div
                    key={element.id}
                    style={{
                        position: 'absolute',
                        top: element.position.top,
                        left: element.position.left,
                        zIndex: element.zIndex,
                        background: 'white',
                        padding: isMobile ? '5px' : '15px',
                        borderRadius: isMobile ? '6px' : '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        width: isMobile ? '100px' : '220px',
                        transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    {element.type === 'button' ? (
                        <div>
                            <button
                                id={element.id}
                                onClick={() => handleButtonClick(element.id)}
                                style={{
                                    width: '100%',
                                    padding: isMobile ? '4px 6px' : '12px',
                                    background: element.color,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: isMobile ? '4px' : '6px',
                                    cursor: 'pointer',
                                    fontSize: isMobile ? '9px' : '14px',
                                    fontWeight: 'bold',
                                    boxShadow: `0 2px 8px ${element.color}60`,
                                    lineHeight: isMobile ? '1.2' : '1.5'
                                }}
                            >
                                {element.label}
                            </button>
                            {clickCount[element.id] > 0 && (
                                <div style={{
                                    marginTop: isMobile ? '4px' : '8px',
                                    fontSize: isMobile ? '8px' : '12px',
                                    color: '#666',
                                    textAlign: 'center'
                                }}>
                                    {clickCount[element.id]}x
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: isMobile ? '3px' : '6px',
                                fontSize: isMobile ? '8px' : '12px',
                                fontWeight: 'bold',
                                color: '#2d3748'
                            }}>
                                {element.label}
                            </label>
                            <input
                                id={element.id}
                                type={element.type || 'text'}
                                placeholder={element.placeholder}
                                value={inputValues[element.id] || ''}
                                onChange={(e) => handleInputChange(element.id, e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: isMobile ? '4px 6px' : '10px',
                                    border: `2px solid ${element.color}`,
                                    borderRadius: isMobile ? '4px' : '6px',
                                    fontSize: isMobile ? '9px' : '14px',
                                    boxSizing: 'border-box',
                                    outline: 'none'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = element.color;
                                    e.target.style.boxShadow = `0 0 0 3px ${element.color}30`;
                                }}
                                onBlur={(e) => {
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            {inputValues[element.id] && (
                                <div style={{
                                    marginTop: isMobile ? '3px' : '6px',
                                    fontSize: isMobile ? '8px' : '11px',
                                    color: '#10b981',
                                    textAlign: 'center'
                                }}>
                                    ✓
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}

        </div>
    );
};

