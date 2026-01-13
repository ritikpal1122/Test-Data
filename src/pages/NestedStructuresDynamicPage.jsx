import React, { useState, useEffect, useRef } from 'react';

export const NestedStructuresDynamicPage = () => {
    const [clickCount, setClickCount] = useState({});
    const [inputValues, setInputValues] = useState({});
    const [elementPositions, setElementPositions] = useState({});
    const [lastClicked, setLastClicked] = useState('No button clicked yet');

    // Refs for nested structures
    const nestedIframe1Ref = useRef(null);
    const nestedIframe2Ref = useRef(null);
    const nestedShadowHost1Ref = useRef(null);
    const nestedShadowHost2Ref = useRef(null);
    const iframeInShadowRef = useRef(null);
    const shadowInIframeRef = useRef(null);
    const shadowInIframeHostRef = useRef(null);

    // Generate dynamic IDs
    const generateId = (prefix) => {
        return `${prefix}-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString(36)}`;
    };

    // Generate random positions for elements without overlaps and within boundaries
    const generateRandomPositions = () => {
        const positions = {};
        
        // Element dimensions
        const buttonWidth = 150;
        const buttonHeight = 40;
        const inputWidth = 200;
        const inputHeight = 35;
        const defaultSpacing = 10; // Default spacing between elements
        
        // Helper function to check if two rectangles overlap with given spacing
        const rectanglesOverlap = (rect1, rect2, spacingValue) => {
            return !(rect1.left + rect1.width + spacingValue < rect2.left ||
                     rect2.left + rect2.width + spacingValue < rect1.left ||
                     rect1.top + rect1.height + spacingValue < rect2.top ||
                     rect2.top + rect2.height + spacingValue < rect1.top);
        };
        
        // Generate positions for each section with specific boundaries
        const sections = [
            {
                prefix: 'outer',
                elements: ['btn-1', 'btn-2', 'input-1', 'input-2'],
                maxWidth: 560,
                maxHeight: 180, // Increased to accommodate 50px spacing
                minTop: 50,
                minLeft: 20,
                spacing: 50 // 50px gap for this section
            },
            {
                prefix: 'inner',
                elements: ['btn-1', 'btn-2', 'input-1', 'input-2'],
                maxWidth: 560,
                maxHeight: 250,
                minTop: 50,
                minLeft: 20,
                spacing: 50 // 50px gap for this section
            },
            {
                prefix: 'outer-shadow',
                elements: ['btn-1', 'btn-2', 'input-1', 'input-2'],
                maxWidth: 560,
                maxHeight: 180, // Increased to accommodate 50px spacing
                minTop: 50,
                minLeft: 20,
                spacing: 50 // 50px gap for this section
            },
            {
                prefix: 'inner-shadow',
                elements: ['btn-1', 'btn-2', 'btn-3', 'btn-4', 'input-1', 'input-2'],
                maxWidth: 530,
                maxHeight: 250, // Increased to accommodate 6 elements with 50px spacing
                minTop: 50,
                minLeft: 15,
                spacing: 50 // 50px gap for this section
            },
            {
                prefix: 'shadow',
                elements: ['btn-1', 'btn-2', 'input-1', 'input-2'],
                maxWidth: 560,
                maxHeight: 180, // Increased to accommodate 50px spacing in 2x2 grid (2 rows × (40px + 50px) = 180px)
                minTop: 50,
                minLeft: 20,
                spacing: 50 // 50px gap for this section
            },
            {
                prefix: 'iframe',
                elements: ['btn-1', 'btn-2', 'btn-3', 'btn-4', 'input-1', 'input-2'],
                maxWidth: 560,
                maxHeight: 250,
                minTop: 20,
                minLeft: 20,
                spacing: 50 // 50px gap for this section
            },
            {
                prefix: 'iframe',
                suffix: '-2',
                elements: ['btn-1-2', 'btn-2-2', 'input-1-2', 'input-2-2'],
                maxWidth: 560,
                maxHeight: 120,
                minTop: 50,
                minLeft: 20
            },
            {
                prefix: 'shadow',
                suffix: '-2',
                elements: ['btn-1-2', 'btn-2-2', 'input-1-2', 'input-2-2'],
                maxWidth: 530,
                maxHeight: 180,
                minTop: 15,
                minLeft: 15
            }
        ];
        
        sections.forEach(section => {
            const sectionPositions = [];
            const elementTypes = [];
            
            // Get spacing for this section (default or custom)
            const sectionSpacing = section.spacing || defaultSpacing;
            
            // First, collect all element info
            section.elements.forEach((elementId) => {
                const fullId = section.suffix ? `${section.prefix}-${elementId}${section.suffix}` : `${section.prefix}-${elementId}`;
                const isInput = elementId.includes('input');
                elementTypes.push({
                    id: fullId,
                    width: isInput ? inputWidth : buttonWidth,
                    height: isInput ? inputHeight : buttonHeight
                });
            });
            
            // Shuffle elements for randomness
            const shuffled = [...elementTypes].sort(() => Math.random() - 0.5);
            
            // Calculate available space
            const availableWidth = section.maxWidth - section.minLeft;
            const availableHeight = section.maxHeight - section.minTop;
            
            // Determine optimal grid layout
            const maxElementWidth = Math.max(...shuffled.map(e => e.width));
            const maxElementHeight = Math.max(...shuffled.map(e => e.height));
            
            // Try different column configurations to find the best fit
            let bestConfig = null;
            let bestScore = -1;
            
            for (let testCols = 1; testCols <= shuffled.length; testCols++) {
                const testRows = Math.ceil(shuffled.length / testCols);
                const requiredWidth = testCols * maxElementWidth + (testCols - 1) * sectionSpacing;
                const requiredHeight = testRows * maxElementHeight + (testRows - 1) * sectionSpacing;
                
                if (requiredWidth <= availableWidth && requiredHeight <= availableHeight) {
                    // This configuration fits
                    const score = testCols * testRows; // Prefer configurations that use space efficiently
                    if (score > bestScore) {
                        bestScore = score;
                        bestConfig = { cols: testCols, rows: testRows };
                    }
                }
            }
            
            // If no perfect fit, use the configuration that fits best
            if (!bestConfig) {
                // Find configuration that fits in width
                let cols = Math.floor((availableWidth + sectionSpacing) / (maxElementWidth + sectionSpacing));
                cols = Math.max(1, Math.min(cols, shuffled.length));
                let rows = Math.ceil(shuffled.length / cols);
                
                // Check if it fits in height, if not adjust
                const requiredHeight = rows * (maxElementHeight + sectionSpacing) - sectionSpacing;
                if (requiredHeight > availableHeight) {
                    rows = Math.floor((availableHeight + sectionSpacing) / (maxElementHeight + sectionSpacing));
                    rows = Math.max(1, rows);
                    cols = Math.ceil(shuffled.length / rows);
                    cols = Math.min(cols, Math.floor((availableWidth + sectionSpacing) / (maxElementWidth + sectionSpacing)));
                }
                
                bestConfig = { cols, rows };
            }
            
            const { cols, rows } = bestConfig;
            
            // Calculate cell dimensions with exact spacing
            const cellWidth = (availableWidth - (cols - 1) * sectionSpacing) / cols;
            const cellHeight = (availableHeight - (rows - 1) * sectionSpacing) / rows;
            
            // Create grid positions in order (no shuffling to ensure proper grid)
            const gridPositions = [];
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const index = row * cols + col;
                    if (index < shuffled.length) {
                        gridPositions.push({
                            row,
                            col,
                            element: shuffled[index]
                        });
                    }
                }
            }
            
            // Assign positions with guaranteed no overlap
            gridPositions.forEach(({ row, col, element }) => {
                // Calculate cell boundaries using section-specific spacing
                const cellLeft = section.minLeft + col * (cellWidth + sectionSpacing);
                const cellTop = section.minTop + row * (cellHeight + sectionSpacing);
                const cellRight = cellLeft + cellWidth;
                const cellBottom = cellTop + cellHeight;
                
                // Position element in cell (centered, but ensure it fits)
                let newPos = {
                    top: cellTop + Math.max(0, (cellHeight - element.height) / 2),
                    left: cellLeft + Math.max(0, (cellWidth - element.width) / 2)
                };
                
                // Ensure element doesn't go outside cell boundaries
                newPos.top = Math.max(cellTop, Math.min(newPos.top, cellBottom - element.height));
                newPos.left = Math.max(cellLeft, Math.min(newPos.left, cellRight - element.width));
                
                // Ensure within section bounds
                newPos.top = Math.max(section.minTop, Math.min(newPos.top, section.maxHeight - element.height));
                newPos.left = Math.max(section.minLeft, Math.min(newPos.left, section.maxWidth - element.width));
                
                // Verify no overlap with existing positions using section-specific spacing
                const newRect = {
                    left: newPos.left,
                    top: newPos.top,
                    width: element.width,
                    height: element.height
                };
                
                let hasOverlap = false;
                for (const existingRect of sectionPositions) {
                    if (rectanglesOverlap(newRect, existingRect, sectionSpacing)) {
                        hasOverlap = true;
                        break;
                    }
                }
                
                // If overlap detected, use cell boundaries strictly
                if (hasOverlap) {
                    // Place at top-left of cell
                    newPos = {
                        top: cellTop,
                        left: cellLeft
                    };
                    
                    // Ensure within bounds
                    newPos.top = Math.max(section.minTop, Math.min(newPos.top, section.maxHeight - element.height));
                    newPos.left = Math.max(section.minLeft, Math.min(newPos.left, section.maxWidth - element.width));
                    
                    // Verify this position
                    const testRect = {
                        left: newPos.left,
                        top: newPos.top,
                        width: element.width,
                        height: element.height
                    };
                    
                    hasOverlap = false;
                    for (const existingRect of sectionPositions) {
                        if (rectanglesOverlap(testRect, existingRect, sectionSpacing)) {
                            hasOverlap = true;
                            break;
                        }
                    }
                    
                    // If still overlapping, use exact grid positioning with section spacing
                    if (hasOverlap) {
                        // Calculate exact grid position with proper spacing
                        const gridColWidth = maxElementWidth + sectionSpacing;
                        const gridRowHeight = maxElementHeight + sectionSpacing;
                        
                        newPos = {
                            top: section.minTop + row * gridRowHeight,
                            left: section.minLeft + col * gridColWidth
                        };
                        
                        // Final boundary check
                        newPos.top = Math.max(section.minTop, Math.min(newPos.top, section.maxHeight - element.height));
                        newPos.left = Math.max(section.minLeft, Math.min(newPos.left, section.maxWidth - element.width));
                        
                        // Final overlap check
                        const finalRect = {
                            left: newPos.left,
                            top: newPos.top,
                            width: element.width,
                            height: element.height
                        };
                        
                        hasOverlap = false;
                        for (const existingRect of sectionPositions) {
                            if (rectanglesOverlap(finalRect, existingRect, sectionSpacing)) {
                                hasOverlap = true;
                                break;
                            }
                        }
                    }
                }
                
                // Final boundary check
                newPos.top = Math.max(section.minTop, Math.min(newPos.top, section.maxHeight - element.height));
                newPos.left = Math.max(section.minLeft, Math.min(newPos.left, section.maxWidth - element.width));
                
                // Store position
                sectionPositions.push({
                    left: newPos.left,
                    top: newPos.top,
                    width: element.width,
                    height: element.height
                });
                
                positions[element.id] = {
                    top: newPos.top,
                    left: newPos.left
                };
            });
        });
        
        return positions;
    };

    // Listen for messages from iframes and shadow DOM
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.type === 'button-clicked') {
                setLastClicked(event.data.buttonName);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Initialize element positions on mount and refresh
    useEffect(() => {
        setElementPositions(generateRandomPositions());
    }, []);

    // Initialize nested iframes with dynamic positions
    useEffect(() => {
        if (nestedIframe1Ref.current && Object.keys(elementPositions).length > 0) {
            const pos = elementPositions;
            const outerIframe = nestedIframe1Ref.current;
            const innerContent = `<!DOCTYPE html><html><head><style>body { margin: 0; padding: 20px; font-family: Arial; background: #e0e0e0; position: relative; overflow: hidden; } h4 { color: #555; margin: 0 0 10px 0; } button { padding: 8px 16px; margin: 0; background: #10b981; color: white; border: none; border-radius: 5px; cursor: pointer; position: absolute; box-sizing: border-box; } input { padding: 8px; margin: 0; border: 2px solid #10b981; border-radius: 5px; width: 180px; position: absolute; box-sizing: border-box; }</style></head><body><h4>Inner Iframe - Nested Iframes Test (Dynamic Positions)</h4><button id="inner-btn-1" onclick="window.parent.parent.postMessage({type: 'button-clicked', buttonName: 'Inner Button 1 (Nested Iframes)'}, '*')" style="top: ${pos['inner-btn-1']?.top || 50}px; left: ${pos['inner-btn-1']?.left || 50}px;">Inner Button 1</button><button id="inner-btn-2" onclick="window.parent.parent.postMessage({type: 'button-clicked', buttonName: 'Inner Button 2 (Nested Iframes)'}, '*')" style="top: ${pos['inner-btn-2']?.top || 50}px; left: ${pos['inner-btn-2']?.left || 200}px;">Inner Button 2</button><input id="inner-input-1" type="text" placeholder="Inner Input 1" style="top: ${pos['inner-input-1']?.top || 100}px; left: ${pos['inner-input-1']?.left || 50}px;" /><input id="inner-input-2" type="text" placeholder="Inner Input 2" style="top: ${pos['inner-input-2']?.top || 100}px; left: ${pos['inner-input-2']?.left || 200}px;" /></body></html>`;
            
            const outerContent = `<!DOCTYPE html><html><head><style>body { margin: 0; padding: 20px; font-family: Arial; background: #f0f0f0; position: relative; overflow: visible; } h3 { color: #333; margin: 0 0 10px 0; } button { padding: 10px 20px; margin: 0; background: #3182ce; color: white; border: none; border-radius: 5px; cursor: pointer; position: absolute; box-sizing: border-box; z-index: 10; } input { padding: 8px; margin: 0; border: 2px solid #3182ce; border-radius: 5px; width: 200px; position: absolute; box-sizing: border-box; z-index: 10; } iframe { width: 100%; height: 300px; border: 2px solid #3182ce; border-radius: 5px; margin-top: 20px; }</style></head><body><h3>Outer Iframe - Nested Iframes Test (Dynamic Positions)</h3><button id="outer-btn-1" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Outer Button 1 (Nested Iframes)'}, '*')" style="top: ${pos['outer-btn-1']?.top || 50}px; left: ${pos['outer-btn-1']?.left || 50}px;">Outer Button 1</button><button id="outer-btn-2" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Outer Button 2 (Nested Iframes)'}, '*')" style="top: ${pos['outer-btn-2']?.top || 50}px; left: ${pos['outer-btn-2']?.left || 250}px;">Outer Button 2</button><input id="outer-input-1" type="text" placeholder="Outer Input 1" style="top: ${pos['outer-input-1']?.top || 100}px; left: ${pos['outer-input-1']?.left || 50}px;" /><input id="outer-input-2" type="text" placeholder="Outer Input 2" style="top: ${pos['outer-input-2']?.top || 100}px; left: ${pos['outer-input-2']?.left || 250}px;" /><iframe id="inner-iframe" src="about:blank" onload="setTimeout(function(){const innerIframe = document.getElementById('inner-iframe');innerIframe.contentDocument.open();innerIframe.contentDocument.write(atob('${btoa(innerContent)}'));innerIframe.contentDocument.close();}, 50);"></iframe></body></html>`;
            
            outerIframe.contentDocument.open();
            outerIframe.contentDocument.write(outerContent);
            outerIframe.contentDocument.close();
        }
    }, [elementPositions]);

    // Initialize nested shadow DOM with dynamic positions
    useEffect(() => {
        if (nestedShadowHost1Ref.current && !nestedShadowHost1Ref.current.shadowRoot && Object.keys(elementPositions).length > 0) {
            const pos = elementPositions;
            const outerShadow = nestedShadowHost1Ref.current.attachShadow({ mode: 'open' });
            // Create inner shadow HTML with all 4 buttons and 2 inputs, using better fallback positions
            const btn1Top = pos['inner-shadow-btn-1']?.top || 50;
            const btn1Left = pos['inner-shadow-btn-1']?.left || 15;
            const btn2Top = pos['inner-shadow-btn-2']?.top || 50;
            const btn2Left = pos['inner-shadow-btn-2']?.left || 215;
            const btn3Top = pos['inner-shadow-btn-3']?.top || 100;
            const btn3Left = pos['inner-shadow-btn-3']?.left || 15;
            const btn4Top = pos['inner-shadow-btn-4']?.top || 100;
            const btn4Left = pos['inner-shadow-btn-4']?.left || 215;
            const input1Top = pos['inner-shadow-input-1']?.top || 150;
            const input1Left = pos['inner-shadow-input-1']?.left || 15;
            const input2Top = pos['inner-shadow-input-2']?.top || 150;
            const input2Left = pos['inner-shadow-input-2']?.left || 215;
            
            const innerShadowHTML = `<style>:host { display: block; position: relative; min-height: 250px; height: auto; overflow: visible !important; } h4 { color: #555; margin-top: 0; margin-bottom: 10px; height: 30px; } button { padding: 8px 16px; margin: 0; background: #ec4899; color: white; border: none; border-radius: 5px; cursor: pointer; position: absolute !important; box-sizing: border-box; z-index: 100; visibility: visible !important; display: block !important; opacity: 1 !important; } input { padding: 8px; margin: 0; border: 2px solid #ec4899; border-radius: 5px; width: 180px; position: absolute !important; box-sizing: border-box; z-index: 100; visibility: visible !important; display: block !important; opacity: 1 !important; }</style><h4>Inner Shadow DOM - Nested Shadow DOM Test (Dynamic Positions)</h4><button id="inner-shadow-btn-1" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Inner Shadow Button 1 (Nested Shadow DOM)'}, '*')" style="top: ${btn1Top}px !important; left: ${btn1Left}px !important; position: absolute !important; visibility: visible !important; display: block !important; opacity: 1 !important;">Inner Shadow Button 1</button><button id="inner-shadow-btn-2" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Inner Shadow Button 2 (Nested Shadow DOM)'}, '*')" style="top: ${btn2Top}px !important; left: ${btn2Left}px !important; position: absolute !important; visibility: visible !important; display: block !important; opacity: 1 !important;">Inner Shadow Button 2</button><button id="inner-shadow-btn-3" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Inner Shadow Button 3 (Nested Shadow DOM)'}, '*')" style="top: ${btn3Top}px !important; left: ${btn3Left}px !important; position: absolute !important; visibility: visible !important; display: block !important; opacity: 1 !important;">Inner Shadow Button 3</button><button id="inner-shadow-btn-4" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Inner Shadow Button 4 (Nested Shadow DOM)'}, '*')" style="top: ${btn4Top}px !important; left: ${btn4Left}px !important; position: absolute !important; visibility: visible !important; display: block !important; opacity: 1 !important;">Inner Shadow Button 4</button><input id="inner-shadow-input-1" type="text" placeholder="Inner Shadow Input 1" style="top: ${input1Top}px !important; left: ${input1Left}px !important; position: absolute !important; visibility: visible !important; display: block !important; opacity: 1 !important;" /><input id="inner-shadow-input-2" type="text" placeholder="Inner Shadow Input 2" style="top: ${input2Top}px !important; left: ${input2Left}px !important; position: absolute !important; visibility: visible !important; display: block !important; opacity: 1 !important;" />`;
            
            outerShadow.innerHTML = `<style>:host { display: block; padding: 20px; background: #f0f0f0; border-radius: 8px; position: relative; min-height: 450px; overflow: visible; } h3 { color: #333; margin-top: 0; margin-bottom: 10px; height: 30px; } button { padding: 10px 20px; margin: 0; background: #9c27b0; color: white; border: none; border-radius: 5px; cursor: pointer; position: absolute; box-sizing: border-box; max-width: 200px; } input { padding: 8px; margin: 0; border: 2px solid #9c27b0; border-radius: 5px; width: 200px; position: absolute; box-sizing: border-box; max-width: 200px; } #inner-shadow-host { margin-top: 15px; padding: 15px; background: #e0e0e0; border-radius: 5px; position: relative; min-height: 350px; height: auto; overflow: visible !important; }</style><h3>Outer Shadow DOM - Nested Shadow DOM Test (Dynamic Positions)</h3><button id="outer-shadow-btn-1" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Outer Shadow Button 1 (Nested Shadow DOM)'}, '*')" style="top: ${pos['outer-shadow-btn-1']?.top || 50}px; left: ${pos['outer-shadow-btn-1']?.left || 50}px;">Outer Shadow Button 1</button><button id="outer-shadow-btn-2" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Outer Shadow Button 2 (Nested Shadow DOM)'}, '*')" style="top: ${pos['outer-shadow-btn-2']?.top || 50}px; left: ${pos['outer-shadow-btn-2']?.left || 250}px;">Outer Shadow Button 2</button><input id="outer-shadow-input-1" type="text" placeholder="Outer Shadow Input 1" style="top: ${pos['outer-shadow-input-1']?.top || 100}px; left: ${pos['outer-shadow-input-1']?.left || 50}px;" /><input id="outer-shadow-input-2" type="text" placeholder="Outer Shadow Input 2" style="top: ${pos['outer-shadow-input-2']?.top || 100}px; left: ${pos['outer-shadow-input-2']?.left || 250}px;" /><div id="inner-shadow-host"></div><script>(function(){setTimeout(function(){try{const innerHost = document.getElementById('inner-shadow-host');if(innerHost && !innerHost.shadowRoot){const innerShadow = innerHost.attachShadow({ mode: 'open' });const html = atob('${btoa(innerShadowHTML)}');innerShadow.innerHTML = html;console.log('Inner shadow DOM created with', html.split('<button').length - 1, 'buttons');const buttons = innerShadow.querySelectorAll('button');console.log('Found', buttons.length, 'buttons in inner shadow DOM');buttons.forEach((btn, i) => {console.log('Button', i+1, ':', btn.id, 'at', btn.style.top, btn.style.left);});}}catch(e){console.error('Error creating inner shadow:', e);}}, 200);})();</script>`;
        }
    }, [elementPositions]);

    // Initialize iframe within shadow DOM with dynamic positions
    useEffect(() => {
        if (iframeInShadowRef.current && !iframeInShadowRef.current.shadowRoot && Object.keys(elementPositions).length > 0) {
            const pos = elementPositions;
            const shadow = iframeInShadowRef.current.attachShadow({ mode: 'open' });
            // Create iframe content with all 4 buttons and 2 inputs
            const iframeBtn1Top = pos['iframe-btn-1']?.top || 20;
            const iframeBtn1Left = pos['iframe-btn-1']?.left || 20;
            const iframeBtn2Top = pos['iframe-btn-2']?.top || 20;
            const iframeBtn2Left = pos['iframe-btn-2']?.left || 220;
            const iframeBtn3Top = pos['iframe-btn-3']?.top || 70;
            const iframeBtn3Left = pos['iframe-btn-3']?.left || 20;
            const iframeBtn4Top = pos['iframe-btn-4']?.top || 70;
            const iframeBtn4Left = pos['iframe-btn-4']?.left || 220;
            const iframeInput1Top = pos['iframe-input-1']?.top || 120;
            const iframeInput1Left = pos['iframe-input-1']?.left || 20;
            const iframeInput2Top = pos['iframe-input-2']?.top || 120;
            const iframeInput2Left = pos['iframe-input-2']?.left || 220;
            
            const iframeContent = `<!DOCTYPE html><html><head><style>body { margin: 0; padding: 20px; font-family: Arial; background: #fff3cd; position: relative; overflow: visible !important; min-height: 200px; height: auto; } h4 { color: #856404; margin: 0 0 10px 0; height: 30px; } button { padding: 8px 16px; margin: 0; background: #d97706; color: white; border: none; border-radius: 5px; cursor: pointer; position: absolute !important; box-sizing: border-box; z-index: 100; visibility: visible !important; display: block !important; opacity: 1 !important; } input { padding: 8px; margin: 0; border: 2px solid #d97706; border-radius: 5px; width: 180px; position: absolute !important; box-sizing: border-box; z-index: 100; visibility: visible !important; display: block !important; opacity: 1 !important; }</style></head><body><h4>Iframe Inside Shadow DOM (Dynamic Positions)</h4><button id="iframe-btn-1" onclick="window.parent.parent.postMessage({type: 'button-clicked', buttonName: 'Iframe Button 1 (Iframe in Shadow DOM)'}, '*')" style="top: ${iframeBtn1Top}px !important; left: ${iframeBtn1Left}px !important; position: absolute !important; visibility: visible !important; display: block !important; opacity: 1 !important;">Iframe Button 1</button><button id="iframe-btn-2" onclick="window.parent.parent.postMessage({type: 'button-clicked', buttonName: 'Iframe Button 2 (Iframe in Shadow DOM)'}, '*')" style="top: ${iframeBtn2Top}px !important; left: ${iframeBtn2Left}px !important; position: absolute !important; visibility: visible !important; display: block !important; opacity: 1 !important;">Iframe Button 2</button><button id="iframe-btn-3" onclick="window.parent.parent.postMessage({type: 'button-clicked', buttonName: 'Iframe Button 3 (Iframe in Shadow DOM)'}, '*')" style="top: ${iframeBtn3Top}px !important; left: ${iframeBtn3Left}px !important; position: absolute !important; visibility: visible !important; display: block !important; opacity: 1 !important;">Iframe Button 3</button><button id="iframe-btn-4" onclick="window.parent.parent.postMessage({type: 'button-clicked', buttonName: 'Iframe Button 4 (Iframe in Shadow DOM)'}, '*')" style="top: ${iframeBtn4Top}px !important; left: ${iframeBtn4Left}px !important; position: absolute !important; visibility: visible !important; display: block !important; opacity: 1 !important;">Iframe Button 4</button><input id="iframe-input-1" type="text" placeholder="Iframe Input 1" style="top: ${iframeInput1Top}px !important; left: ${iframeInput1Left}px !important; position: absolute !important; visibility: visible !important; display: block !important; opacity: 1 !important;" /><input id="iframe-input-2" type="text" placeholder="Iframe Input 2" style="top: ${iframeInput2Top}px !important; left: ${iframeInput2Left}px !important; position: absolute !important; visibility: visible !important; display: block !important; opacity: 1 !important;" /></body></html>`;
            
            shadow.innerHTML = `<style>:host { display: block; padding: 20px; background: #f0f0f0; border-radius: 8px; position: relative; min-height: 450px; overflow: visible; } h3 { color: #333; margin-top: 0; margin-bottom: 10px; height: 30px; } button { padding: 10px 20px; margin: 0; background: #f59e0b; color: white; border: none; border-radius: 5px; cursor: pointer; position: absolute; box-sizing: border-box; max-width: 200px; } input { padding: 8px; margin: 0; border: 2px solid #f59e0b; border-radius: 5px; width: 200px; position: absolute; box-sizing: border-box; max-width: 200px; } iframe { width: 100%; height: 400px; border: 2px solid #f59e0b; border-radius: 5px; margin-top: 20px; }</style><h3>Shadow DOM - Iframe Within Shadow DOM Test (Dynamic Positions)</h3><button id="shadow-btn-1" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Shadow Button 1 (Iframe in Shadow DOM)'}, '*')" style="top: ${pos['shadow-btn-1']?.top || 50}px; left: ${pos['shadow-btn-1']?.left || 50}px;">Shadow Button 1</button><button id="shadow-btn-2" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Shadow Button 2 (Iframe in Shadow DOM)'}, '*')" style="top: ${pos['shadow-btn-2']?.top || 50}px; left: ${pos['shadow-btn-2']?.left || 250}px;">Shadow Button 2</button><input id="shadow-input-1" type="text" placeholder="Shadow Input 1" style="top: ${pos['shadow-input-1']?.top || 100}px; left: ${pos['shadow-input-1']?.left || 50}px;" /><input id="shadow-input-2" type="text" placeholder="Shadow Input 2" style="top: ${pos['shadow-input-2']?.top || 100}px; left: ${pos['shadow-input-2']?.left || 250}px;" /><iframe id="iframe-in-shadow" src="about:blank" onload="setTimeout(function(){try{const iframe = document.getElementById('iframe-in-shadow');if(iframe && iframe.contentDocument){iframe.contentDocument.open();iframe.contentDocument.write(atob('${btoa(iframeContent)}'));iframe.contentDocument.close();console.log('Iframe content written with', atob('${btoa(iframeContent)}').split('<button').length - 1, 'buttons');const iframeButtons = iframe.contentDocument.querySelectorAll('button');console.log('Found', iframeButtons.length, 'buttons in iframe');iframeButtons.forEach((btn, i) => {console.log('Iframe Button', i+1, ':', btn.id, 'at', btn.style.top, btn.style.left);});}}catch(e){console.error('Error writing iframe content:', e);}}, 150);"></iframe>`;
        }
    }, [elementPositions]);

    // Initialize shadow DOM within iframe with dynamic positions
    useEffect(() => {
        if (nestedIframe2Ref.current && Object.keys(elementPositions).length > 0) {
            const pos = elementPositions;
            const iframe = nestedIframe2Ref.current;
            const shadowHTML = `<style>:host { display: block; position: relative; min-height: 200px; overflow: hidden; } h4 { color: #991b1b; margin-top: 0; margin-bottom: 10px; } button { padding: 8px 16px; margin: 0; background: #dc2626; color: white; border: none; border-radius: 5px; cursor: pointer; position: absolute; box-sizing: border-box; } input { padding: 8px; margin: 0; border: 2px solid #dc2626; border-radius: 5px; width: 180px; position: absolute; box-sizing: border-box; }</style><h4>Shadow DOM Inside Iframe (Dynamic Positions)</h4><button id="shadow-btn-1-2" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Shadow Button 1 (Shadow DOM in Iframe)'}, '*')" style="top: ${pos['shadow-btn-1-2']?.top || 50}px; left: ${pos['shadow-btn-1-2']?.left || 50}px;">Shadow Button 1</button><button id="shadow-btn-2-2" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Shadow Button 2 (Shadow DOM in Iframe)'}, '*')" style="top: ${pos['shadow-btn-2-2']?.top || 50}px; left: ${pos['shadow-btn-2-2']?.left || 200}px;">Shadow Button 2</button><input id="shadow-input-1-2" type="text" placeholder="Shadow Input 1" style="top: ${pos['shadow-input-1-2']?.top || 100}px; left: ${pos['shadow-input-1-2']?.left || 50}px;" /><input id="shadow-input-2-2" type="text" placeholder="Shadow Input 2" style="top: ${pos['shadow-input-2-2']?.top || 100}px; left: ${pos['shadow-input-2-2']?.left || 200}px;" />`;
            
            const iframeContent = `<!DOCTYPE html><html><head><style>body { margin: 0; padding: 20px; font-family: Arial; background: #f0f0f0; position: relative; overflow: hidden; } h3 { color: #333; margin: 0 0 10px 0; } button { padding: 10px 20px; margin: 0; background: #ef4444; color: white; border: none; border-radius: 5px; cursor: pointer; position: absolute; box-sizing: border-box; } input { padding: 8px; margin: 0; border: 2px solid #ef4444; border-radius: 5px; width: 200px; position: absolute; box-sizing: border-box; } #shadow-host { margin-top: 115px; padding: 15px; background: #fee2e2; border-radius: 5px; position: relative; min-height: 200px; overflow: hidden; }</style></head><body><h3>Iframe - Shadow DOM Within Iframe Test (Dynamic Positions)</h3><button id="iframe-btn-1-2" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Iframe Button 1 (Shadow DOM in Iframe)'}, '*')" style="top: ${pos['iframe-btn-1-2']?.top || 50}px; left: ${pos['iframe-btn-1-2']?.left || 50}px;">Iframe Button 1</button><button id="iframe-btn-2-2" onclick="window.parent.postMessage({type: 'button-clicked', buttonName: 'Iframe Button 2 (Shadow DOM in Iframe)'}, '*')" style="top: ${pos['iframe-btn-2-2']?.top || 50}px; left: ${pos['iframe-btn-2-2']?.left || 250}px;">Iframe Button 2</button><input id="iframe-input-1-2" type="text" placeholder="Iframe Input 1" style="top: ${pos['iframe-input-1-2']?.top || 100}px; left: ${pos['iframe-input-1-2']?.left || 50}px;" /><input id="iframe-input-2-2" type="text" placeholder="Iframe Input 2" style="top: ${pos['iframe-input-2-2']?.top || 100}px; left: ${pos['iframe-input-2-2']?.left || 250}px;" /><div id="shadow-host"></div><script>setTimeout(function(){const shadowHost = document.getElementById('shadow-host');const shadow = shadowHost.attachShadow({ mode: 'open' });shadow.innerHTML = atob('${btoa(shadowHTML)}');}, 100);</script></body></html>`;
            
            iframe.contentDocument.open();
            iframe.contentDocument.write(iframeContent);
            iframe.contentDocument.close();
        }
    }, [elementPositions]);

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
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px 20px'
        }}>
            {/* Top Navbar */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '15px 20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                zIndex: 1000,
                borderBottom: '3px solid #667eea'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    <span style={{
                        fontWeight: 'bold',
                        color: '#667eea',
                        fontSize: '1.1em'
                    }}>
                        Last Clicked:
                    </span>
                    <span style={{
                        color: '#333',
                        fontSize: '1em',
                        padding: '8px 15px',
                        background: '#f0f0f0',
                        borderRadius: '6px',
                        flex: 1
                    }}>
                        {lastClicked}
                    </span>
                </div>
            </div>

            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                marginTop: '80px'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    color: 'white',
                    marginBottom: '30px',
                    fontSize: '2.5em',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}>
                    🔄 Nested Structures Dynamic Test Page
                </h1>
                <p style={{
                    textAlign: 'center',
                    color: 'white',
                    marginBottom: '30px',
                    fontSize: '1.2em',
                    opacity: 0.9
                }}>
                    Elements change position on every page refresh
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
                    gap: '30px',
                    marginBottom: '30px'
                }}>
                    {/* Nested Iframes */}
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                        <h2 style={{ color: '#3182ce', marginTop: 0 }}>1. Nested Iframes (Dynamic)</h2>
                        <iframe
                            ref={nestedIframe1Ref}
                            style={{
                                width: '100%',
                                height: '400px',
                                border: '2px solid #3182ce',
                                borderRadius: '8px'
                            }}
                            title="Nested Iframes"
                        />
                    </div>

                    {/* Nested Shadow DOM */}
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                        <h2 style={{ color: '#9c27b0', marginTop: 0 }}>2. Nested Shadow DOM (Dynamic)</h2>
                        <div
                            ref={nestedShadowHost1Ref}
                            style={{
                                minHeight: '400px',
                                border: '2px solid #9c27b0',
                                borderRadius: '8px'
                            }}
                        />
                    </div>

                    {/* Iframe within Shadow DOM */}
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                        <h2 style={{ color: '#f59e0b', marginTop: 0 }}>3. Iframe Within Shadow DOM (Dynamic)</h2>
                        <div
                            ref={iframeInShadowRef}
                            style={{
                                minHeight: '400px',
                                border: '2px solid #f59e0b',
                                borderRadius: '8px'
                            }}
                        />
                    </div>

                    {/* Shadow DOM within Iframe */}
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                        <h2 style={{ color: '#ef4444', marginTop: 0 }}>4. Shadow DOM Within Iframe (Dynamic)</h2>
                        <iframe
                            ref={nestedIframe2Ref}
                            style={{
                                width: '100%',
                                height: '400px',
                                border: '2px solid #ef4444',
                                borderRadius: '8px'
                            }}
                            title="Shadow DOM in Iframe"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

