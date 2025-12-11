import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const IframeShadowDOMTestPage = () => {
    const navigate = useNavigate();
    
    // Function to get scenario from URL hash
    const getScenarioFromHash = () => {
        const hash = window.location.hash;
        if (hash) {
            const match = hash.match(/scenario(\d+)/i);
            if (match) {
                const scenarioNum = parseInt(match[1], 10);
                if (scenarioNum >= 1 && scenarioNum <= 9) {
                    return scenarioNum;
                }
            }
        }
        return 1; // Default to first scenario
    };
    
    const [activeScenario, setActiveScenario] = useState(getScenarioFromHash());
    
    // Update active scenario when hash changes
    useEffect(() => {
        const handleHashChange = () => {
            const scenarioFromHash = getScenarioFromHash();
            setActiveScenario(scenarioFromHash);
        };
        
        // Check hash on mount
        handleHashChange();
        
        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange);
        
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);
    
    // Function to update scenario and URL hash
    const handleScenarioChange = (scenarioId) => {
        setActiveScenario(scenarioId);
        window.location.hash = `scenario${scenarioId}`;
    };

    // Scenario 1: Normal iframe with inputs and buttons
    const iframe1Ref = useRef(null);

    // Scenario 2: Shadow DOM with inputs and buttons
    const shadowHost2Ref = useRef(null);
    const shadowRoot2Ref = useRef(null);

    // Scenario 3: Iframe inside Shadow DOM
    const shadowHost3Ref = useRef(null);
    const shadowRoot3Ref = useRef(null);
    const iframe3Ref = useRef(null);

    // Scenario 4: Shadow DOM inside iframe
    const iframe4Ref = useRef(null);
    const shadowHost4Ref = useRef(null);
    const shadowRoot4Ref = useRef(null);

    // Scenario 5: Nested iframes (iframe in iframe)
    const iframe5OuterRef = useRef(null);
    const iframe5InnerRef = useRef(null);

    // Scenario 6: Shadow DOM with slots
    const shadowHost6Ref = useRef(null);
    const shadowRoot6Ref = useRef(null);

    // Scenario 7: Iframe with Shadow DOM and slots
    const iframe7Ref = useRef(null);
    const shadowHost7Ref = useRef(null);
    const shadowRoot7Ref = useRef(null);

    // Scenario 8: Auto-healing iframe (elements change position and locators on refresh)
    const iframe8Ref = useRef(null);

    // Scenario 9: PostMessage blocking test (child to parent frame communication)
    const iframe9Ref = useRef(null);
    const [iframeStatus, setIframeStatus] = useState({ message: 'Ready to send messages...', messageCount: 0, isSuccess: true });

    // Listen for postMessages from child frames
    useEffect(() => {
        const handleMessage = (event) => {
            // Check if this is a status update message
            if (event.data && event.data.type === 'status-update') {
                setIframeStatus({
                    message: event.data.status,
                    messageCount: event.data.messageCount || 0,
                    isSuccess: event.data.isSuccess !== false
                });
            }
        };

        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    useEffect(() => {
        // Scenario 1: Normal iframe
        if (iframe1Ref.current) {
            const iframe = iframe1Ref.current;
            const content = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
                        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
                        h2 { color: #333; }
                        .form-group { margin-bottom: 15px; }
                        label { display: block; margin-bottom: 5px; font-weight: bold; }
                        input, select, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
                        button { padding: 10px 20px; margin: 5px; border: none; border-radius: 4px; cursor: pointer; }
                        .btn-primary { background: #007bff; color: white; }
                        .btn-secondary { background: #6c757d; color: white; }
                        .btn-success { background: #28a745; color: white; }
                        .btn-danger { background: #dc3545; color: white; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Normal Iframe - All Input Types</h2>
                        <form id="form1">
                            <div class="form-group">
                                <label>Text Input:</label>
                                <input type="text" id="text-input" name="text" placeholder="Enter text" />
                            </div>
                            <div class="form-group">
                                <label>Email Input:</label>
                                <input type="email" id="email-input" name="email" placeholder="Enter email" />
                            </div>
                            <div class="form-group">
                                <label>Password Input:</label>
                                <input type="password" id="password-input" name="password" placeholder="Enter password" />
                            </div>
                            <div class="form-group">
                                <label>Number Input:</label>
                                <input type="number" id="number-input" name="number" placeholder="Enter number" />
                            </div>
                            <div class="form-group">
                                <label>Date Input:</label>
                                <input type="date" id="date-input" name="date" />
                            </div>
                            <div class="form-group">
                                <label>Time Input:</label>
                                <input type="time" id="time-input" name="time" />
                            </div>
                            <div class="form-group">
                                <label>Color Input:</label>
                                <input type="color" id="color-input" name="color" />
                            </div>
                            <div class="form-group">
                                <label>Range Input:</label>
                                <input type="range" id="range-input" name="range" min="0" max="100" />
                            </div>
                            <div class="form-group">
                                <label>Checkbox:</label>
                                <input type="checkbox" id="checkbox-input" name="checkbox" />
                            </div>
                            <div class="form-group">
                                <label>Radio Buttons:</label>
                                <input type="radio" id="radio1" name="radio" value="option1" />
                                <label for="radio1">Option 1</label>
                                <input type="radio" id="radio2" name="radio" value="option2" />
                                <label for="radio2">Option 2</label>
                            </div>
                            <div class="form-group">
                                <label>File Input:</label>
                                <input type="file" id="file-input" name="file" />
                            </div>
                            <div class="form-group">
                                <label>Select Dropdown:</label>
                                <select id="select-input" name="select">
                                    <option value="">Choose...</option>
                                    <option value="1">Option 1</option>
                                    <option value="2">Option 2</option>
                                    <option value="3">Option 3</option>
                                    <option value="4">Option 4</option>
                                    <option value="5">Option 5</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Tel Input:</label>
                                <input type="tel" id="tel-input" name="tel" placeholder="Enter phone number" />
                            </div>
                            <div class="form-group">
                                <label>URL Input:</label>
                                <input type="url" id="url-input" name="url" placeholder="Enter URL" />
                            </div>
                            <div class="form-group">
                                <label>Search Input:</label>
                                <input type="search" id="search-input" name="search" placeholder="Search..." />
                            </div>
                            <div class="form-group">
                                <label>Month Input:</label>
                                <input type="month" id="month-input" name="month" />
                            </div>
                            <div class="form-group">
                                <label>Week Input:</label>
                                <input type="week" id="week-input" name="week" />
                            </div>
                            <div class="form-group">
                                <label>Datetime Local:</label>
                                <input type="datetime-local" id="datetime-input" name="datetime" />
                            </div>
                            <div class="form-group">
                                <label>Textarea:</label>
                                <textarea id="textarea-input" name="textarea" rows="4" placeholder="Enter text"></textarea>
                            </div>
                            <div class="form-group">
                                <label>Multi-Select:</label>
                                <select id="multi-select" name="multi" multiple style="height: 120px;">
                                    <option value="1">Option 1</option>
                                    <option value="2">Option 2</option>
                                    <option value="3">Option 3</option>
                                    <option value="4">Option 4</option>
                                    <option value="5">Option 5</option>
                                    <option value="6">Option 6</option>
                                    <option value="7">Option 7</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Select with Optgroups:</label>
                                <select id="optgroup-select" name="optgroup">
                                    <option value="">Choose...</option>
                                    <optgroup label="Group 1">
                                        <option value="1">Option 1</option>
                                        <option value="2">Option 2</option>
                                        <option value="3">Option 3</option>
                                    </optgroup>
                                    <optgroup label="Group 2">
                                        <option value="4">Option 4</option>
                                        <option value="5">Option 5</option>
                                        <option value="6">Option 6</option>
                                    </optgroup>
                                    <optgroup label="Group 3">
                                        <option value="7">Option 7</option>
                                        <option value="8">Option 8</option>
                                    </optgroup>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Multiple Checkboxes Group 1:</label>
                                <input type="checkbox" id="check1" name="checks" value="1" />
                                <label for="check1">Checkbox 1</label>
                                <input type="checkbox" id="check2" name="checks" value="2" />
                                <label for="check2">Checkbox 2</label>
                                <input type="checkbox" id="check3" name="checks" value="3" />
                                <label for="check3">Checkbox 3</label>
                            </div>
                            <div class="form-group">
                                <label>Multiple Checkboxes Group 2:</label>
                                <input type="checkbox" id="check4" name="checks2" value="4" />
                                <label for="check4">Checkbox 4</label>
                                <input type="checkbox" id="check5" name="checks2" value="5" />
                                <label for="check5">Checkbox 5</label>
                                <input type="checkbox" id="check6" name="checks2" value="6" />
                                <label for="check6">Checkbox 6</label>
                            </div>
                            <div class="form-group">
                                <label>Radio Group 1:</label>
                                <input type="radio" id="radio1" name="radio" value="option1" />
                                <label for="radio1">Option 1</label>
                                <input type="radio" id="radio2" name="radio" value="option2" />
                                <label for="radio2">Option 2</label>
                                <input type="radio" id="radio3" name="radio" value="option3" />
                                <label for="radio3">Option 3</label>
                            </div>
                            <div class="form-group">
                                <label>Radio Group 2:</label>
                                <input type="radio" id="radio4" name="radio2" value="a" />
                                <label for="radio4">Option A</label>
                                <input type="radio" id="radio5" name="radio2" value="b" />
                                <label for="radio5">Option B</label>
                                <input type="radio" id="radio6" name="radio2" value="c" />
                                <label for="radio6">Option C</label>
                            </div>
                            <div class="form-group">
                                <button type="button" id="button-normal" class="btn-primary">Normal Button</button>
                                <button type="submit" id="submit-button" class="btn-success">Submit Button</button>
                                <button type="reset" id="reset-button" class="btn-secondary">Reset Button</button>
                                <button type="button" id="danger-button" class="btn-danger">Danger Button</button>
                            </div>
                            <div class="form-group">
                                <button type="button" id="click-button-1" onclick="alert('Button 1 clicked')">Click Me 1</button>
                                <button type="button" id="click-button-2" onclick="alert('Button 2 clicked')">Click Me 2</button>
                                <button type="button" id="click-button-3" onclick="alert('Button 3 clicked')">Click Me 3</button>
                                <button type="button" id="click-button-4" onclick="alert('Button 4 clicked')" style="background: #ffc107; color: #000;">Click Me 4</button>
                            </div>
                            <div class="form-group">
                                <button type="button" id="action-button-1" onclick="alert('Action 1')" style="background: #17a2b8; color: white;">Action 1</button>
                                <button type="button" id="action-button-2" onclick="alert('Action 2')" style="background: #6f42c1; color: white;">Action 2</button>
                                <button type="button" id="action-button-3" onclick="alert('Action 3')" style="background: #e83e8c; color: white;">Action 3</button>
                            </div>
                            <div class="form-group">
                                <a href="#" id="link-1" onclick="alert('Link 1 clicked'); return false;">Clickable Link 1</a> |
                                <a href="#" id="link-2" onclick="alert('Link 2 clicked'); return false;">Clickable Link 2</a> |
                                <a href="#" id="link-3" onclick="alert('Link 3 clicked'); return false;">Clickable Link 3</a> |
                                <a href="#" id="link-4" onclick="alert('Link 4 clicked'); return false;">Clickable Link 4</a>
                            </div>
                            <div class="form-group">
                                <div id="clickable-div-1" onclick="alert('Div 1 clicked')" style="padding: 10px; background: #007bff; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Clickable Div 1</div>
                                <div id="clickable-div-2" onclick="alert('Div 2 clicked')" style="padding: 10px; background: #28a745; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Clickable Div 2</div>
                                <div id="clickable-div-3" onclick="alert('Div 3 clicked')" style="padding: 10px; background: #dc3545; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Clickable Div 3</div>
                                <div id="clickable-div-4" onclick="alert('Div 4 clicked')" style="padding: 10px; background: #ffc107; color: #000; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Clickable Div 4</div>
                            </div>
                            <div class="form-group">
                                <span id="clickable-span-1" onclick="alert('Span 1 clicked')" style="padding: 8px; background: #6c757d; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Clickable Span 1</span>
                                <span id="clickable-span-2" onclick="alert('Span 2 clicked')" style="padding: 8px; background: #17a2b8; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Clickable Span 2</span>
                                <span id="clickable-span-3" onclick="alert('Span 3 clicked')" style="padding: 8px; background: #6f42c1; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Clickable Span 3</span>
                            </div>
                        </form>
                    </div>
                </body>
                </html>
            `;
            iframe.srcdoc = content;
        }

        // Shadow DOM scenarios (2, 3, 6) are handled in the second useEffect to ensure DOM is ready

        // Scenario 4: Shadow DOM inside iframe
        if (iframe4Ref.current) {
            const iframe = iframe4Ref.current;
            const content = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial; padding: 20px; background: #d1ecf1; }
                        h2 { color: #0c5460; }
                        #shadow-host { margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <h2>Shadow DOM Inside Iframe</h2>
                    <div id="shadow-host"></div>
                    <script>
                        const host = document.getElementById('shadow-host');
                        const shadowRoot = host.attachShadow({ mode: 'open' });
                        shadowRoot.innerHTML = \`
                            <style>
                                :host { display: block; padding: 20px; background: white; border-radius: 8px; }
                                .form-group { margin-bottom: 15px; }
                                label { display: block; margin-bottom: 5px; font-weight: bold; }
                                input, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
                                button { padding: 10px 20px; margin: 5px; border: none; border-radius: 4px; cursor: pointer; background: #007bff; color: white; }
                            </style>
                            <h3>📧 Contact Us Form</h3>
                            <form>
                                <div class="form-group">
                                    <label>Your Name:</label>
                                    <input type="text" id="shadow-iframe-text" placeholder="Jane Smith" />
                                </div>
                                <div class="form-group">
                                    <label>Email:</label>
                                    <input type="email" id="shadow-iframe-email" placeholder="jane@example.com" />
                                </div>
                                <div class="form-group">
                                    <label>Phone:</label>
                                    <input type="tel" id="shadow-iframe-tel" placeholder="+1 234 567 8900" />
                                </div>
                                <div class="form-group">
                                    <label>Subject:</label>
                                    <select id="shadow-iframe-select">
                                        <option value="">Select Subject</option>
                                        <optgroup label="Support">
                                            <option value="technical">Technical Issue</option>
                                            <option value="billing">Billing Question</option>
                                            <option value="feature">Feature Request</option>
                                        </optgroup>
                                        <optgroup label="General">
                                            <option value="feedback">Feedback</option>
                                            <option value="partnership">Partnership</option>
                                        </optgroup>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Priority:</label>
                                    <input type="radio" id="shadow-iframe-radio1" name="shadow-iframe-radio" value="low" />
                                    <label for="shadow-iframe-radio1">Low</label>
                                    <input type="radio" id="shadow-iframe-radio2" name="shadow-iframe-radio" value="medium" />
                                    <label for="shadow-iframe-radio2">Medium</label>
                                    <input type="radio" id="shadow-iframe-radio3" name="shadow-iframe-radio" value="high" />
                                    <label for="shadow-iframe-radio3">High</label>
                                </div>
                                <div class="form-group">
                                    <label>Message:</label>
                                    <textarea id="shadow-iframe-textarea" rows="5" placeholder="Please describe your inquiry..."></textarea>
                                </div>
                                <div class="form-group">
                                    <label>Attach File:</label>
                                    <input type="file" id="shadow-iframe-file" />
                                </div>
                                <div class="form-group">
                                    <label>Preferred Contact Method:</label>
                                    <input type="checkbox" id="shadow-iframe-check1" />
                                    <label for="shadow-iframe-check1">Email</label>
                                    <input type="checkbox" id="shadow-iframe-check2" />
                                    <label for="shadow-iframe-check2">Phone</label>
                                    <input type="checkbox" id="shadow-iframe-check3" />
                                    <label for="shadow-iframe-check3">SMS</label>
                                </div>
                                <div class="form-group">
                                    <label>Best Time to Contact:</label>
                                    <input type="time" id="shadow-iframe-time" />
                                </div>
                                <div class="form-group">
                                    <button type="submit" id="shadow-iframe-submit">Send Message</button>
                                    <button type="button" id="shadow-iframe-button" onclick="alert('Save Draft')">Save Draft</button>
                                    <button type="reset" id="shadow-iframe-reset" style="background: #6c757d; color: white;">Clear</button>
                                </div>
                                <div class="form-group">
                                    <a href="#" id="shadow-iframe-link-1" onclick="alert('FAQ'); return false;">FAQ</a> |
                                    <a href="#" id="shadow-iframe-link-2" onclick="alert('Live Chat'); return false;">Live Chat</a>
                                </div>
                                <div class="form-group">
                                    <div id="shadow-iframe-clickable-1" onclick="alert('Schedule Callback')" style="padding: 10px; background: #28a745; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Schedule Callback</div>
                                </div>
                            </form>
                        \`;
                    </script>
                </body>
                </html>
            `;
            iframe.srcdoc = content;
        }

        // Scenario 5: Nested iframes (iframe in iframe)
        if (iframe5OuterRef.current) {
            const outerIframe = iframe5OuterRef.current;
            const outerContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial; padding: 20px; background: #f8d7da; }
                        h2 { color: #721c24; }
                        iframe { width: 100%; height: 400px; border: 2px solid #dc3545; border-radius: 4px; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <h2>Outer Iframe</h2>
                    <form>
                        <div style="margin-bottom: 15px;">
                            <label>Text Input (Outer):</label>
                            <input type="text" id="outer-text" placeholder="Enter text" style="width: 100%; padding: 8px;" />
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Email Input (Outer):</label>
                            <input type="email" id="outer-email" placeholder="Enter email" style="width: 100%; padding: 8px;" />
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Tel Input (Outer):</label>
                            <input type="tel" id="outer-tel" placeholder="Enter phone" style="width: 100%; padding: 8px;" />
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>URL Input (Outer):</label>
                            <input type="url" id="outer-url" placeholder="Enter URL" style="width: 100%; padding: 8px;" />
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Number Input (Outer):</label>
                            <input type="number" id="outer-number" placeholder="Enter number" style="width: 100%; padding: 8px;" />
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Date Input (Outer):</label>
                            <input type="date" id="outer-date" style="width: 100%; padding: 8px;" />
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Time Input (Outer):</label>
                            <input type="time" id="outer-time" style="width: 100%; padding: 8px;" />
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Month Input (Outer):</label>
                            <input type="month" id="outer-month" style="width: 100%; padding: 8px;" />
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Week Input (Outer):</label>
                            <input type="week" id="outer-week" style="width: 100%; padding: 8px;" />
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Search Input (Outer):</label>
                            <input type="search" id="outer-search" placeholder="Search..." style="width: 100%; padding: 8px;" />
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Color Input (Outer):</label>
                            <input type="color" id="outer-color" style="width: 100%; padding: 8px; height: 40px;" />
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Range Input (Outer):</label>
                            <input type="range" id="outer-range" min="0" max="100" style="width: 100%;" />
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Datetime Local (Outer):</label>
                            <input type="datetime-local" id="outer-datetime" style="width: 100%; padding: 8px;" />
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>File Input (Outer):</label>
                            <input type="file" id="outer-file" style="width: 100%; padding: 8px;" />
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Textarea (Outer):</label>
                            <textarea id="outer-textarea" rows="4" placeholder="Enter text" style="width: 100%; padding: 8px; box-sizing: border-box;"></textarea>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Select (Outer):</label>
                            <select id="outer-select" style="width: 100%; padding: 8px;">
                                <option value="">Choose...</option>
                                <option value="1">Option 1</option>
                                <option value="2">Option 2</option>
                                <option value="3">Option 3</option>
                                <option value="4">Option 4</option>
                                <option value="5">Option 5</option>
                            </select>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Multi-Select (Outer):</label>
                            <select id="outer-multi" multiple style="width: 100%; padding: 8px; height: 100px;">
                                <option value="1">Option 1</option>
                                <option value="2">Option 2</option>
                                <option value="3">Option 3</option>
                                <option value="4">Option 4</option>
                                <option value="5">Option 5</option>
                                <option value="6">Option 6</option>
                            </select>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Select with Optgroups (Outer):</label>
                            <select id="outer-optgroup" style="width: 100%; padding: 8px;">
                                <option value="">Choose...</option>
                                <optgroup label="Group X">
                                    <option value="x1">Option X1</option>
                                    <option value="x2">Option X2</option>
                                    <option value="x3">Option X3</option>
                                </optgroup>
                                <optgroup label="Group Y">
                                    <option value="y1">Option Y1</option>
                                    <option value="y2">Option Y2</option>
                                    <option value="y3">Option Y3</option>
                                </optgroup>
                            </select>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Checkboxes Group 1 (Outer):</label>
                            <input type="checkbox" id="outer-check1" />
                            <label for="outer-check1">Check 1</label>
                            <input type="checkbox" id="outer-check2" />
                            <label for="outer-check2">Check 2</label>
                            <input type="checkbox" id="outer-check3" />
                            <label for="outer-check3">Check 3</label>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Checkboxes Group 2 (Outer):</label>
                            <input type="checkbox" id="outer-check4" />
                            <label for="outer-check4">Check 4</label>
                            <input type="checkbox" id="outer-check5" />
                            <label for="outer-check5">Check 5</label>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Radio Group 1 (Outer):</label>
                            <input type="radio" id="outer-radio1" name="outer-radio" value="1" />
                            <label for="outer-radio1">Radio 1</label>
                            <input type="radio" id="outer-radio2" name="outer-radio" value="2" />
                            <label for="outer-radio2">Radio 2</label>
                            <input type="radio" id="outer-radio3" name="outer-radio" value="3" />
                            <label for="outer-radio3">Radio 3</label>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Radio Group 2 (Outer):</label>
                            <input type="radio" id="outer-radio4" name="outer-radio2" value="a" />
                            <label for="outer-radio4">Radio A</label>
                            <input type="radio" id="outer-radio5" name="outer-radio2" value="b" />
                            <label for="outer-radio5">Radio B</label>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <button type="button" id="outer-button" style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px;">Outer Button</button>
                            <button type="submit" id="outer-submit" style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px;">Outer Submit</button>
                            <button type="reset" id="outer-reset" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px;">Outer Reset</button>
                            <button type="button" id="outer-click-1" onclick="alert('Outer Click 1')" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px;">Click 1</button>
                            <button type="button" id="outer-click-2" onclick="alert('Outer Click 2')" style="padding: 10px 20px; background: #ffc107; color: #000; border: none; border-radius: 4px; cursor: pointer; margin: 5px;">Click 2</button>
                            <button type="button" id="outer-click-3" onclick="alert('Outer Click 3')" style="padding: 10px 20px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px;">Click 3</button>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <a href="#" id="outer-link-1" onclick="alert('Outer Link 1'); return false;">Link 1</a> |
                            <a href="#" id="outer-link-2" onclick="alert('Outer Link 2'); return false;">Link 2</a> |
                            <a href="#" id="outer-link-3" onclick="alert('Outer Link 3'); return false;">Link 3</a> |
                            <a href="#" id="outer-link-4" onclick="alert('Outer Link 4'); return false;">Link 4</a>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <div id="outer-clickable-1" onclick="alert('Outer Div 1')" style="padding: 10px; background: #dc3545; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Clickable Div 1</div>
                            <div id="outer-clickable-2" onclick="alert('Outer Div 2')" style="padding: 10px; background: #007bff; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Clickable Div 2</div>
                            <div id="outer-clickable-3" onclick="alert('Outer Div 3')" style="padding: 10px; background: #28a745; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Clickable Div 3</div>
                            <div id="outer-clickable-4" onclick="alert('Outer Div 4')" style="padding: 10px; background: #ffc107; color: #000; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Clickable Div 4</div>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <span id="outer-span-1" onclick="alert('Outer Span 1')" style="padding: 8px; background: #6c757d; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Clickable Span 1</span>
                            <span id="outer-span-2" onclick="alert('Outer Span 2')" style="padding: 8px; background: #17a2b8; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Clickable Span 2</span>
                        </div>
                    </form>
                    <iframe id="inner-iframe" srcdoc="
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial; padding: 20px; background: #d4edda; }
                                h3 { color: #155724; }
                                .form-group { margin-bottom: 15px; }
                                label { display: block; margin-bottom: 5px; font-weight: bold; }
                                input, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
                                button { padding: 10px 20px; margin: 5px; border: none; border-radius: 4px; cursor: pointer; background: #28a745; color: white; }
                            </style>
                        </head>
                        <body>
                            <h3>Inner Iframe (Nested)</h3>
                            <form>
                                <div class="form-group">
                                    <label>Text Input (Inner):</label>
                                    <input type="text" id="inner-text" placeholder="Enter text" />
                                </div>
                                <div class="form-group">
                                    <label>Email Input (Inner):</label>
                                    <input type="email" id="inner-email" placeholder="Enter email" />
                                </div>
                                <div class="form-group">
                                    <label>Password Input (Inner):</label>
                                    <input type="password" id="inner-password" placeholder="Enter password" />
                                </div>
                                <div class="form-group">
                                    <label>Tel Input (Inner):</label>
                                    <input type="tel" id="inner-tel" placeholder="Enter phone" />
                                </div>
                                <div class="form-group">
                                    <label>URL Input (Inner):</label>
                                    <input type="url" id="inner-url" placeholder="Enter URL" />
                                </div>
                                <div class="form-group">
                                    <label>Number Input (Inner):</label>
                                    <input type="number" id="inner-number" placeholder="Enter number" />
                                </div>
                                <div class="form-group">
                                    <label>Date Input (Inner):</label>
                                    <input type="date" id="inner-date" />
                                </div>
                                <div class="form-group">
                                    <label>Month Input (Inner):</label>
                                    <input type="month" id="inner-month" />
                                </div>
                                <div class="form-group">
                                    <label>Week Input (Inner):</label>
                                    <input type="week" id="inner-week" />
                                </div>
                                <div class="form-group">
                                    <label>Time Input (Inner):</label>
                                    <input type="time" id="inner-time" />
                                </div>
                                <div class="form-group">
                                    <label>Search Input (Inner):</label>
                                    <input type="search" id="inner-search" placeholder="Search..." />
                                </div>
                                <div class="form-group">
                                    <label>Color Input (Inner):</label>
                                    <input type="color" id="inner-color" />
                                </div>
                                <div class="form-group">
                                    <label>Range Input (Inner):</label>
                                    <input type="range" id="inner-range" min="0" max="100" />
                                </div>
                                <div class="form-group">
                                    <label>Datetime Local (Inner):</label>
                                    <input type="datetime-local" id="inner-datetime" />
                                </div>
                                <div class="form-group">
                                    <label>File Input (Inner):</label>
                                    <input type="file" id="inner-file" />
                                </div>
                                <div class="form-group">
                                    <label>Textarea (Inner):</label>
                                    <textarea id="inner-textarea" rows="4" placeholder="Enter text"></textarea>
                                </div>
                                <div class="form-group">
                                    <label>Select (Inner):</label>
                                    <select id="inner-select">
                                        <option value="">Choose...</option>
                                        <option value="1">Option 1</option>
                                        <option value="2">Option 2</option>
                                        <option value="3">Option 3</option>
                                        <option value="4">Option 4</option>
                                        <option value="5">Option 5</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Multi-Select (Inner):</label>
                                    <select id="inner-multi" multiple style="height: 100px;">
                                        <option value="1">Option 1</option>
                                        <option value="2">Option 2</option>
                                        <option value="3">Option 3</option>
                                        <option value="4">Option 4</option>
                                        <option value="5">Option 5</option>
                                        <option value="6">Option 6</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Select with Optgroups (Inner):</label>
                                    <select id="inner-optgroup">
                                        <option value="">Choose...</option>
                                        <optgroup label="Group A">
                                            <option value="a1">Option A1</option>
                                            <option value="a2">Option A2</option>
                                            <option value="a3">Option A3</option>
                                        </optgroup>
                                        <optgroup label="Group B">
                                            <option value="b1">Option B1</option>
                                            <option value="b2">Option B2</option>
                                            <option value="b3">Option B3</option>
                                        </optgroup>
                                        <optgroup label="Group C">
                                            <option value="c1">Option C1</option>
                                            <option value="c2">Option C2</option>
                                        </optgroup>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Checkboxes Group 1 (Inner):</label>
                                    <input type="checkbox" id="inner-check1" />
                                    <label for="inner-check1">Check 1</label>
                                    <input type="checkbox" id="inner-check2" />
                                    <label for="inner-check2">Check 2</label>
                                    <input type="checkbox" id="inner-check3" />
                                    <label for="inner-check3">Check 3</label>
                                </div>
                                <div class="form-group">
                                    <label>Checkboxes Group 2 (Inner):</label>
                                    <input type="checkbox" id="inner-check4" />
                                    <label for="inner-check4">Check 4</label>
                                    <input type="checkbox" id="inner-check5" />
                                    <label for="inner-check5">Check 5</label>
                                    <input type="checkbox" id="inner-check6" />
                                    <label for="inner-check6">Check 6</label>
                                </div>
                                <div class="form-group">
                                    <label>Radio Group 1 (Inner):</label>
                                    <input type="radio" id="inner-radio1" name="inner-radio" value="1" />
                                    <label for="inner-radio1">Radio 1</label>
                                    <input type="radio" id="inner-radio2" name="inner-radio" value="2" />
                                    <label for="inner-radio2">Radio 2</label>
                                    <input type="radio" id="inner-radio3" name="inner-radio" value="3" />
                                    <label for="inner-radio3">Radio 3</label>
                                </div>
                                <div class="form-group">
                                    <label>Radio Group 2 (Inner):</label>
                                    <input type="radio" id="inner-radio4" name="inner-radio2" value="a" />
                                    <label for="inner-radio4">Radio A</label>
                                    <input type="radio" id="inner-radio5" name="inner-radio2" value="b" />
                                    <label for="inner-radio5">Radio B</label>
                                    <input type="radio" id="inner-radio6" name="inner-radio2" value="c" />
                                    <label for="inner-radio6">Radio C</label>
                                </div>
                                <div class="form-group">
                                    <button type="button" id="inner-button">Inner Button</button>
                                    <button type="submit" id="inner-submit">Inner Submit</button>
                                    <button type="reset" id="inner-reset">Inner Reset</button>
                                    <button type="button" id="inner-click-1" onclick="alert('Inner Click 1')">Click 1</button>
                                    <button type="button" id="inner-click-2" onclick="alert('Inner Click 2')">Click 2</button>
                                    <button type="button" id="inner-click-3" onclick="alert('Inner Click 3')">Click 3</button>
                                </div>
                                <div class="form-group">
                                    <button type="button" id="inner-action-1" onclick="alert('Inner Action 1')" style="background: #ffc107; color: #000;">Action 1</button>
                                    <button type="button" id="inner-action-2" onclick="alert('Inner Action 2')" style="background: #17a2b8; color: white;">Action 2</button>
                                    <button type="button" id="inner-action-3" onclick="alert('Inner Action 3')" style="background: #6f42c1; color: white;">Action 3</button>
                                </div>
                                <div class="form-group">
                                    <a href="#" id="inner-link-1" onclick="alert('Inner Link 1'); return false;">Link 1</a> |
                                    <a href="#" id="inner-link-2" onclick="alert('Inner Link 2'); return false;">Link 2</a> |
                                    <a href="#" id="inner-link-3" onclick="alert('Inner Link 3'); return false;">Link 3</a> |
                                    <a href="#" id="inner-link-4" onclick="alert('Inner Link 4'); return false;">Link 4</a>
                                </div>
                                <div class="form-group">
                                    <div id="inner-clickable-1" onclick="alert('Inner Div 1')" style="padding: 10px; background: #28a745; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Clickable Div 1</div>
                                    <div id="inner-clickable-2" onclick="alert('Inner Div 2')" style="padding: 10px; background: #007bff; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Clickable Div 2</div>
                                    <div id="inner-clickable-3" onclick="alert('Inner Div 3')" style="padding: 10px; background: #dc3545; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Clickable Div 3</div>
                                    <div id="inner-clickable-4" onclick="alert('Inner Div 4')" style="padding: 10px; background: #ffc107; color: #000; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Clickable Div 4</div>
                                </div>
                                <div class="form-group">
                                    <span id="inner-span-1" onclick="alert('Inner Span 1')" style="padding: 8px; background: #6c757d; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Clickable Span 1</span>
                                    <span id="inner-span-2" onclick="alert('Inner Span 2')" style="padding: 8px; background: #17a2b8; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Clickable Span 2</span>
                                </div>
                            </form>
                        </body>
                        </html>
                    "></iframe>
                </body>
                </html>
            `;
            outerIframe.srcdoc = outerContent;
        }

        // Scenario 6 is handled in the second useEffect

        // Scenario 7: Iframe with Shadow DOM and slots
        if (activeScenario === 7 && iframe7Ref.current) {
            const iframe = iframe7Ref.current;
            const content = `<!DOCTYPE html><html><head><style>body { font-family: Arial; padding: 20px; background: #cfe2ff; } h2 { color: #084298; margin-bottom: 20px; } #shadow-host { margin-top: 20px; min-height: 500px; }</style></head><body><h2>🎫 Iframe with Shadow DOM and Slots</h2><div id="shadow-host"></div><script>const host = document.getElementById('shadow-host');const shadowRoot = host.attachShadow({ mode: 'open' });shadowRoot.innerHTML = '<style>:host { display: block; padding: 20px; background: white; border-radius: 8px; min-height: 500px; } .form-group { margin-bottom: 15px; } label { display: block; margin-bottom: 5px; font-weight: bold; } input, select, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; } button { padding: 10px 20px; margin: 5px; border: none; border-radius: 4px; cursor: pointer; background: #007bff; color: white; } slot { display: block; margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px; } a { color: #007bff; text-decoration: none; margin: 0 5px; } a:hover { text-decoration: underline; }</style><h3>🎫 Event Booking Form</h3><form><div class="form-group"><label>Event Name:</label><input type="text" id="iframe-slot-text" placeholder="Conference 2024" /></div><div class="form-group"><label>Email:</label><input type="email" id="iframe-slot-email" placeholder="attendee@example.com" /></div><div class="form-group"><label>Phone:</label><input type="tel" id="iframe-slot-tel" placeholder="+1 234 567 8900" /></div><div class="form-group"><label>Event Date:</label><input type="date" id="iframe-slot-date" /></div><div class="form-group"><label>Event Time:</label><input type="time" id="iframe-slot-time" /></div><div class="form-group"><label>Event Type:</label><select id="iframe-slot-select"><option value="">Select Type</option><optgroup label="Professional"><option value="conference">Conference</option><option value="workshop">Workshop</option><option value="seminar">Seminar</option></optgroup><optgroup label="Social"><option value="party">Party</option><option value="networking">Networking</option></optgroup></select></div><div class="form-group"><label>Number of Tickets:</label><input type="number" id="iframe-slot-number" placeholder="1" min="1" max="10" /></div><div class="form-group"><label>Ticket Type:</label><input type="radio" id="iframe-slot-radio1" name="iframe-slot-radio" value="standard" /><label for="iframe-slot-radio1">Standard</label><input type="radio" id="iframe-slot-radio2" name="iframe-slot-radio" value="vip" /><label for="iframe-slot-radio2">VIP</label><input type="radio" id="iframe-slot-radio3" name="iframe-slot-radio" value="premium" /><label for="iframe-slot-radio3">Premium</label></div><div class="form-group"><label>Add-ons:</label><input type="checkbox" id="iframe-slot-check1" /><label for="iframe-slot-check1">Catering</label><input type="checkbox" id="iframe-slot-check2" /><label for="iframe-slot-check2">Parking</label><input type="checkbox" id="iframe-slot-check3" /><label for="iframe-slot-check3">Materials</label></div><div class="form-group"><label>Special Requests:</label><textarea id="iframe-slot-textarea" rows="3" placeholder="Any special requirements..."></textarea></div><div class="form-group"><label>Payment Method:</label><select id="iframe-slot-optgroup"><option value="">Select Payment</option><optgroup label="Card"><option value="credit">Credit Card</option><option value="debit">Debit Card</option></optgroup><optgroup label="Digital"><option value="paypal">PayPal</option><option value="crypto">Cryptocurrency</option></optgroup></select></div><div class="form-group"><button type="submit" id="iframe-slot-submit">Book Now</button><button type="button" id="iframe-slot-button" onclick="alert(\\'Save for Later\\')">Save Draft</button><button type="reset" id="iframe-slot-reset" style="background: #6c757d; color: white;">Clear</button></div><div class="form-group"><a href="#" id="iframe-slot-link-1" onclick="alert(\\'View Events\\'); return false;">View All Events</a> | <a href="#" id="iframe-slot-link-2" onclick="alert(\\'Cancel Booking\\'); return false;">Cancel</a></div><div class="form-group"><div id="iframe-slot-clickable-1" onclick="alert(\\'Check Availability\\')" style="padding: 10px; background: #28a745; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Check Availability</div><div id="iframe-slot-clickable-2" onclick="alert(\\'View Calendar\\')" style="padding: 10px; background: #007bff; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">View Calendar</div></div><slot name="iframe-slot-content"></slot><slot name="iframe-slot-extra"></slot></form>';const slotContent = document.createElement('div');slotContent.slot = 'iframe-slot-content';slotContent.innerHTML = '<p><strong>💳 Payment Details:</strong></p><input type="text" id="iframe-slotted-text" placeholder="Cardholder Name" style="width: 100%; padding: 8px; margin: 5px 0; box-sizing: border-box;" /><input type="tel" id="iframe-slotted-tel" placeholder="Card Number" style="width: 100%; padding: 8px; margin: 5px 0; box-sizing: border-box;" /><input type="month" id="iframe-slotted-month" placeholder="Expiry" style="width: 100%; padding: 8px; margin: 5px 0; box-sizing: border-box;" /><button type="button" id="iframe-slotted-button" onclick="alert(\\'Process Payment\\')" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 5px;">Process Payment</button><a href="#" id="iframe-slotted-link" onclick="alert(\\'Payment Security\\'); return false;" style="margin-left: 10px;">Security Info</a>';host.appendChild(slotContent);const slotContentExtra = document.createElement('div');slotContentExtra.slot = 'iframe-slot-extra';slotContentExtra.innerHTML = '<p><strong>📋 Additional Options:</strong></p><input type="checkbox" id="iframe-slotted-check" /><label for="iframe-slotted-check">Email Confirmation</label><input type="checkbox" id="iframe-slotted-check2" /><label for="iframe-slotted-check2">SMS Reminder</label><input type="datetime-local" id="iframe-slotted-date" style="width: 100%; padding: 8px; margin: 5px 0; box-sizing: border-box;" /><button type="button" id="iframe-slotted-btn-1" onclick="alert(\\'Apply Discount\\')" style="padding: 8px 16px; background: #ffc107; color: #000; border: none; border-radius: 4px; cursor: pointer; margin: 5px;">Apply Discount</button><div id="iframe-slotted-div-1" onclick="alert(\\'View Terms\\')" style="padding: 8px; background: #17a2b8; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Terms & Conditions</div>';host.appendChild(slotContentExtra);</script></body></html>`;
            iframe.srcdoc = content;
        }

        // Scenario 8: Auto-healing iframe (elements change position and locators on refresh)
        if (activeScenario === 8 && iframe8Ref.current) {
            const iframe = iframe8Ref.current;
            const randomId = () => 'el_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            const randomClass = () => 'cls_' + Math.random().toString(36).substr(2, 6);
            const randomDataAttr = () => 'data-' + Math.random().toString(36).substr(2, 8);
            
            const content = `<!DOCTYPE html><html><head><style>body { font-family: Arial; padding: 20px; background: #f8f9fa; } h2 { color: #dc3545; margin-bottom: 20px; border-bottom: 2px solid #dc3545; padding-bottom: 10px; } .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 4px; margin-bottom: 20px; color: #856404; } .form-group { margin-bottom: 15px; } label { display: block; margin-bottom: 5px; font-weight: bold; color: #333; } input, select, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; } button { padding: 10px 20px; margin: 5px; border: none; border-radius: 4px; cursor: pointer; background: #007bff; color: white; } a { color: #007bff; text-decoration: none; margin: 0 5px; } a:hover { text-decoration: underline; }</style></head><body><h2>🔄 Auto-Healing Form (Elements Change on Refresh)</h2><div class="warning"><strong>⚠️ Warning:</strong> This form uses auto-healing technology. Element IDs, names, positions, and attributes change randomly on every page refresh!</div><form id="autoheal-form"><div class="form-group"><label>Full Name:</label><input type="text" id="name-field" name="name" placeholder="Enter your name" /></div><div class="form-group"><label>Email Address:</label><input type="email" id="email-field" name="email" placeholder="your.email@example.com" /></div><div class="form-group"><label>Phone Number:</label><input type="tel" id="phone-field" name="phone" placeholder="+1 234 567 8900" /></div><div class="form-group"><label>Date of Birth:</label><input type="date" id="dob-field" name="dob" /></div><div class="form-group"><label>Country:</label><select id="country-field" name="country"><option value="">Select Country</option><option value="us">United States</option><option value="uk">United Kingdom</option><option value="ca">Canada</option><option value="au">Australia</option><option value="de">Germany</option></select></div><div class="form-group"><label>Profile Picture:</label><input type="file" id="file-field" name="file" accept="image/*" /></div><div class="form-group"><label>Theme Color:</label><input type="color" id="color-field" name="color" value="#007bff" /></div><div class="form-group"><label>Volume:</label><input type="range" id="range-field" name="range" min="0" max="100" value="50" /></div><div class="form-group"><label>Preferred Languages (Multi-select):</label><select id="lang-field" name="languages" multiple style="height: 100px;"><option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option><option value="de">German</option><option value="zh">Chinese</option></select></div><div class="form-group"><label>Notification Preferences:</label><input type="checkbox" id="check1-field" name="notifications" value="email" /><label for="check1-field">Email</label><input type="checkbox" id="check2-field" name="notifications" value="sms" /><label for="check2-field">SMS</label><input type="checkbox" id="check3-field" name="notifications" value="push" /><label for="check3-field">Push</label></div><div class="form-group"><label>Account Type:</label><input type="radio" id="radio1-field" name="account-type" value="free" /><label for="radio1-field">Free</label><input type="radio" id="radio2-field" name="account-type" value="premium" /><label for="radio2-field">Premium</label><input type="radio" id="radio3-field" name="account-type" value="enterprise" /><label for="radio3-field">Enterprise</label></div><div class="form-group"><label>Bio:</label><textarea id="bio-field" name="bio" rows="4" placeholder="Tell us about yourself..."></textarea></div><div class="form-group"><button type="submit" id="submit-btn">Submit</button><button type="button" id="preview-btn" onclick="alert('Preview')">Preview</button><button type="reset" id="reset-btn" style="background: #6c757d; color: white;">Reset</button></div><div class="form-group"><a href="#" id="link1" onclick="alert('Privacy Policy'); return false;">Privacy</a> | <a href="#" id="link2" onclick="alert('Terms'); return false;">Terms</a> | <a href="#" id="link3" onclick="alert('Help'); return false;">Help</a></div><div class="form-group"><div id="clickable1" onclick="alert('Export')" style="padding: 10px; background: #28a745; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Export Data</div><div id="clickable2" onclick="alert('Delete')" style="padding: 10px; background: #dc3545; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Delete Account</div></div></form><script>(function(){const randomId=()=>'el_'+Math.random().toString(36).substr(2,9)+'_'+Date.now();const randomClass=()=>'cls_'+Math.random().toString(36).substr(2,6);const randomDataAttr=()=>'data-'+Math.random().toString(36).substr(2,8);const formGroups=document.querySelectorAll('.form-group');const form=document.querySelector('form');const groupsArray=Array.from(formGroups);for(let i=groupsArray.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[groupsArray[i],groupsArray[j]]=[groupsArray[j],groupsArray[i]];}groupsArray.forEach(group=>{const newGroup=group.cloneNode(true);group.parentNode.removeChild(group);form.appendChild(newGroup);});const allElements=document.querySelectorAll('input,select,textarea,button,a,div[onclick]');allElements.forEach((el)=>{const newId=randomId();const oldId=el.id;el.id=newId;if(oldId){const label=document.querySelector('label[for="'+oldId+'"]');if(label)label.setAttribute('for',newId);}if(el.name){el.name='field_'+Math.random().toString(36).substr(2,8);}el.className=(el.className||'')+' '+randomClass();el.setAttribute(randomDataAttr(),Math.random().toString(36).substr(2,10));el.setAttribute('data-testid','test_'+Math.random().toString(36).substr(2,8));const offsetX=(Math.random()-0.5)*30;const offsetY=(Math.random()-0.5)*30;if(offsetX!==0||offsetY!==0){el.style.position='relative';el.style.left=offsetX+'px';el.style.top=offsetY+'px';}});if(form){form.id='form_'+Math.random().toString(36).substr(2,9);}console.log('🔄 Auto-healing applied: Element positions and locators randomized on refresh');})();</script></body></html>`;
            iframe.srcdoc = content;
        }

        // Scenario 9: PostMessage blocking test
        if (activeScenario === 9 && iframe9Ref.current) {
            const iframe = iframe9Ref.current;
            const content = `<!DOCTYPE html><html><head><style>body { font-family: Arial; padding: 20px; background: #e7f3ff; } h2 { color: #004085; margin-bottom: 20px; border-bottom: 2px solid #004085; padding-bottom: 10px; } .info-box { background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 4px; margin-bottom: 20px; color: #0c5460; } .test-section { background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #ddd; } .button-group { margin: 10px 0; } button { padding: 10px 20px; margin: 5px; border: none; border-radius: 4px; cursor: pointer; background: #007bff; color: white; font-size: 14px; } button:hover { background: #0056b3; } .success { background: #28a745; } .danger { background: #dc3545; } .warning { background: #ffc107; color: #000; } .form-group { margin-bottom: 15px; } label { display: block; margin-bottom: 5px; font-weight: bold; } input, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }</style></head><body><h2>📨 PostMessage Communication Test</h2><div class="info-box"><strong>ℹ️ Test Purpose:</strong> This iframe attempts to send postMessages to the parent frame. If messages are blocked, tagification in child frames will fail. Check the parent frame log to see if messages are received.</div><div class="test-section"><h3>Test Controls</h3><div class="button-group"><button onclick="sendTestMessage('simple')">Send Simple Message</button><button onclick="sendTestMessage('tagify')" class="success">Send Tagify Message</button><button onclick="sendTestMessage('data')" class="warning">Send Data Message</button><button onclick="sendMultipleMessages()" class="danger">Send Multiple Messages</button></div></div><div class="test-section"><h3>Form Elements (for Tagification Test)</h3><form id="test-form"><div class="form-group"><label>Tags Input:</label><input type="text" id="tags-input" placeholder="Enter tags (comma separated)" /></div><div class="form-group"><label>Email:</label><input type="email" id="email-input" placeholder="test@example.com" /></div><div class="form-group"><label>Category:</label><select id="category-select"><option value="">Select Category</option><option value="tech">Technology</option><option value="design">Design</option><option value="marketing">Marketing</option></select></div><div class="form-group"><button type="button" onclick="triggerTagify()" class="success">Trigger Tagify Event</button><button type="button" onclick="sendFormData()">Send Form Data</button></div></form></div><script>let messageCount = 0;function sendStatusUpdate(message, isSuccess) {try {window.parent.postMessage({type: 'status-update',status: message,messageCount: messageCount,isSuccess: isSuccess}, '*');} catch (e) {console.error('Failed to send status update:', e);}}function updateStatus(message, isSuccess) {const statusMessage = (isSuccess ? '✅' : '❌') + ' ' + message;sendStatusUpdate(statusMessage, isSuccess);}function sendTestMessage(type) {messageCount++;const messages = {'simple': {type: 'test', message: 'Simple test message from iframe', timestamp: Date.now()},'tagify': {type: 'tagify', action: 'init', element: 'tags-input', timestamp: Date.now()},'data': {type: 'data', payload: {tags: ['tag1', 'tag2'], value: 'test value'}, timestamp: Date.now()}};const message = messages[type] || messages.simple;try {window.parent.postMessage(message, '*');const statusMsg = 'Message sent: ' + type + ' (' + JSON.stringify(message).substring(0, 50) + '...)';updateStatus(statusMsg, true);console.log('📤 PostMessage sent:', message);} catch (e) {updateStatus('Error sending message: ' + e.message, false);console.error('❌ PostMessage error:', e);}}function sendMultipleMessages() {for (let i = 0; i < 5; i++) {setTimeout(() => {sendTestMessage('simple');}, i * 200);}}function triggerTagify() {const input = document.getElementById('tags-input');if (input) {input.value = 'tag1, tag2, tag3';input.dispatchEvent(new Event('input', { bubbles: true }));input.dispatchEvent(new Event('change', { bubbles: true }));messageCount++;const message = {type: 'tagify',action: 'tagified',element: 'tags-input',value: input.value,timestamp: Date.now()};try {window.parent.postMessage(message, '*');updateStatus('Tagify event triggered and message sent', true);console.log('📤 Tagify message sent:', message);} catch (e) {updateStatus('Error sending tagify message: ' + e.message, false);}}}function sendFormData() {const form = document.getElementById('test-form');const formData = new FormData(form);const data = {};formData.forEach((value, key) => {data[key] = value;});messageCount++;const message = {type: 'form-data',data: data,timestamp: Date.now()};try {window.parent.postMessage(message, '*');updateStatus('Form data sent successfully', true);console.log('📤 Form data sent:', message);} catch (e) {updateStatus('Error sending form data: ' + e.message, false);}}setInterval(() => {const heartbeat = {type: 'heartbeat',timestamp: Date.now(),iframeId: 'test-iframe-9'};try {window.parent.postMessage(heartbeat, '*');} catch (e) {console.error('Heartbeat failed:', e);}}, 5000);sendStatusUpdate('Ready to send messages...', true);console.log('📨 PostMessage test iframe loaded. Ready to send messages.');</script></body></html>`;
            iframe.srcdoc = content;
        }
    }, [activeScenario]);

    // Separate useEffect to ensure Shadow DOM is created after DOM updates
    useEffect(() => {
        const timer = setTimeout(() => {
            // Scenario 2: Shadow DOM
            if (activeScenario === 2 && shadowHost2Ref.current && !shadowRoot2Ref.current) {
                const shadowRoot = shadowHost2Ref.current.attachShadow({ mode: 'open' });
                shadowRoot2Ref.current = shadowRoot;
                
                shadowRoot.innerHTML = `
                    <style>
                        :host { display: block; padding: 20px; background: #e8f4f8; border-radius: 8px; min-height: 600px; width: 100%; box-sizing: border-box; }
                        .container { background: white; padding: 20px; border-radius: 8px; width: 100%; box-sizing: border-box; }
                        h3 { color: #0066cc; margin-bottom: 15px; }
                        .form-group { margin-bottom: 15px; }
                        label { display: block; margin-bottom: 5px; font-weight: bold; color: #333; }
                        input, select, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
                        button { padding: 10px 20px; margin: 5px; border: none; border-radius: 4px; cursor: pointer; }
                        .btn-primary { background: #007bff; color: white; }
                        .btn-success { background: #28a745; color: white; }
                    </style>
                    <div class="container">
                        <h3>👤 User Profile Settings</h3>
                        <form id="shadow-form">
                            <div class="form-group">
                                <label>Full Name:</label>
                                <input type="text" id="shadow-text" name="text" placeholder="John Doe" />
                            </div>
                            <div class="form-group">
                                <label>Email Address:</label>
                                <input type="email" id="shadow-email" name="email" placeholder="john@example.com" />
                            </div>
                            <div class="form-group">
                                <label>Phone Number:</label>
                                <input type="tel" id="shadow-tel" name="tel" placeholder="+1 234 567 8900" />
                            </div>
                            <div class="form-group">
                                <label>Date of Birth:</label>
                                <input type="date" id="shadow-date" name="date" />
                            </div>
                            <div class="form-group">
                                <label>Profile Picture:</label>
                                <input type="file" id="shadow-file" name="file" accept="image/*" />
                            </div>
                            <div class="form-group">
                                <label>Country:</label>
                                <select id="shadow-select" name="select">
                                    <option value="">Select Country</option>
                                    <option value="us">United States</option>
                                    <option value="uk">United Kingdom</option>
                                    <option value="ca">Canada</option>
                                    <option value="au">Australia</option>
                                    <option value="de">Germany</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Theme Color:</label>
                                <input type="color" id="shadow-color" name="color" value="#007bff" />
                            </div>
                            <div class="form-group">
                                <label>Notification Volume:</label>
                                <input type="range" id="shadow-range" name="range" min="0" max="100" value="50" />
                            </div>
                            <div class="form-group">
                                <label>Preferred Language:</label>
                                <select id="shadow-multi-select" name="multi" multiple style="height: 100px;">
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                    <option value="zh">Chinese</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Notification Preferences:</label>
                                <input type="checkbox" id="shadow-check1" name="checks" value="email" />
                                <label for="shadow-check1">Email Notifications</label>
                                <input type="checkbox" id="shadow-check2" name="checks" value="sms" />
                                <label for="shadow-check2">SMS Notifications</label>
                                <input type="checkbox" id="shadow-check3" name="checks" value="push" />
                                <label for="shadow-check3">Push Notifications</label>
                            </div>
                            <div class="form-group">
                                <label>Account Type:</label>
                                <input type="radio" id="shadow-radio1" name="shadow-radio" value="free" />
                                <label for="shadow-radio1">Free</label>
                                <input type="radio" id="shadow-radio2" name="shadow-radio" value="premium" />
                                <label for="shadow-radio2">Premium</label>
                                <input type="radio" id="shadow-radio3" name="shadow-radio" value="enterprise" />
                                <label for="shadow-radio3">Enterprise</label>
                            </div>
                            <div class="form-group">
                                <label>Bio:</label>
                                <textarea id="shadow-textarea" name="textarea" rows="4" placeholder="Tell us about yourself..."></textarea>
                            </div>
                            <div class="form-group">
                                <button type="submit" id="shadow-submit" class="btn-success">Save Profile</button>
                                <button type="button" id="shadow-button" class="btn-primary">Preview</button>
                                <button type="reset" id="shadow-reset" style="background: #6c757d; color: white;">Reset</button>
                            </div>
                            <div class="form-group">
                                <a href="#" id="shadow-link-1" onclick="alert('Privacy Policy'); return false;">Privacy Policy</a> |
                                <a href="#" id="shadow-link-2" onclick="alert('Terms of Service'); return false;">Terms</a> |
                                <a href="#" id="shadow-link-3" onclick="alert('Help Center'); return false;">Help</a>
                            </div>
                            <div class="form-group">
                                <div id="shadow-clickable-1" onclick="alert('Export Data')" style="padding: 10px; background: #007bff; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Export Data</div>
                                <div id="shadow-clickable-2" onclick="alert('Delete Account')" style="padding: 10px; background: #dc3545; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Delete Account</div>
                            </div>
                        </form>
                    </div>
                `;
            }

            // Scenario 3: Iframe inside Shadow DOM
            if (activeScenario === 3 && shadowHost3Ref.current && !shadowRoot3Ref.current) {
                const shadowRoot = shadowHost3Ref.current.attachShadow({ mode: 'open' });
                shadowRoot3Ref.current = shadowRoot;
                
                const iframeContent = `<!DOCTYPE html><html><head><style>body { font-family: Arial; padding: 20px; background: #f0f0f0; } .form-group { margin-bottom: 15px; } label { display: block; margin-bottom: 5px; font-weight: bold; } input, select, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; } button { padding: 10px 20px; margin: 5px; border: none; border-radius: 4px; cursor: pointer; background: #007bff; color: white; } a { color: #007bff; text-decoration: none; margin: 0 5px; } a:hover { text-decoration: underline; }</style></head><body><h2>🛍️ Product Search & Filter</h2><form><div class="form-group"><label>Search Products:</label><input type="search" id="iframe-shadow-search" placeholder="Search for products..." /></div><div class="form-group"><label>Category:</label><select id="iframe-shadow-select"><option value="">All Categories</option><optgroup label="Electronics"><option value="laptop">Laptops</option><option value="phone">Phones</option><option value="tablet">Tablets</option></optgroup><optgroup label="Clothing"><option value="shirt">Shirts</option><option value="pants">Pants</option><option value="shoes">Shoes</option></optgroup><optgroup label="Home"><option value="furniture">Furniture</option><option value="decor">Decor</option></optgroup></select></div><div class="form-group"><label>Price Range:</label><input type="range" id="iframe-shadow-range" min="0" max="1000" value="500" /></div><div class="form-group"><label>Brands (Multi-select):</label><select id="iframe-shadow-multi" multiple style="height: 100px;"><option value="brand1">Brand A</option><option value="brand2">Brand B</option><option value="brand3">Brand C</option><option value="brand4">Brand D</option></select></div><div class="form-group"><label>Availability:</label><input type="radio" id="iframe-shadow-radio1" name="iframe-shadow-radio" value="in-stock" /><label for="iframe-shadow-radio1">In Stock</label><input type="radio" id="iframe-shadow-radio2" name="iframe-shadow-radio" value="out-of-stock" /><label for="iframe-shadow-radio2">Out of Stock</label><input type="radio" id="iframe-shadow-radio3" name="iframe-shadow-radio" value="all" /><label for="iframe-shadow-radio3">All</label></div><div class="form-group"><label>Features:</label><input type="checkbox" id="iframe-shadow-check1" /><label for="iframe-shadow-check1">Free Shipping</label><input type="checkbox" id="iframe-shadow-check2" /><label for="iframe-shadow-check2">On Sale</label><input type="checkbox" id="iframe-shadow-check3" /><label for="iframe-shadow-check3">New Arrival</label></div><div class="form-group"><label>Color Preference:</label><input type="color" id="iframe-shadow-color" value="#000000" /></div><div class="form-group"><label>Sort By:</label><select id="iframe-shadow-optgroup"><option value="">Default</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Highest Rated</option><option value="newest">Newest First</option></select></div><div class="form-group"><label>Additional Notes:</label><textarea id="iframe-shadow-textarea" rows="3" placeholder="Any special requirements..."></textarea></div><div class="form-group"><button type="submit" id="iframe-shadow-submit">Apply Filters</button><button type="button" id="iframe-shadow-button" onclick="alert('Clear Filters')">Clear</button><button type="button" id="iframe-shadow-click-1" onclick="alert('Save Search')">Save Search</button></div><div class="form-group"><a href="#" id="iframe-shadow-link-1" onclick="alert('View All Products'); return false;">View All</a> | <a href="#" id="iframe-shadow-link-2" onclick="alert('Advanced Search'); return false;">Advanced</a></div><div class="form-group"><div id="iframe-shadow-clickable-1" onclick="alert('Quick View')" style="padding: 10px; background: #28a745; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Quick View</div><div id="iframe-shadow-clickable-2" onclick="alert('Compare Products')" style="padding: 10px; background: #007bff; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Compare</div></div></form></body></html>`;
                
                shadowRoot.innerHTML = `
                    <style>
                        :host { display: block; padding: 20px; background: #fff3cd; border-radius: 8px; min-height: 600px; width: 100%; box-sizing: border-box; }
                        h3 { color: #856404; margin-bottom: 15px; }
                        iframe { width: 100%; height: 600px; border: 2px solid #ffc107; border-radius: 4px; }
                    </style>
                    <h3>Iframe Inside Shadow DOM</h3>
                    <iframe id="iframe-in-shadow"></iframe>
                `;
                
                // Set iframe content after it's created
                const iframe = shadowRoot.querySelector('#iframe-in-shadow');
                if (iframe) {
                    iframe.srcdoc = iframeContent;
                }
            }

            // Scenario 6: Shadow DOM with slots
            if (activeScenario === 6 && shadowHost6Ref.current && !shadowRoot6Ref.current) {
                const shadowRoot = shadowHost6Ref.current.attachShadow({ mode: 'open' });
                shadowRoot6Ref.current = shadowRoot;
                
                shadowRoot.innerHTML = `
                    <style>
                        :host { display: block; padding: 20px; background: #e2e3e5; border-radius: 8px; min-height: 600px; width: 100%; box-sizing: border-box; }
                        .container { background: white; padding: 20px; border-radius: 8px; width: 100%; box-sizing: border-box; }
                        h3 { color: #383d41; margin-bottom: 15px; }
                        .form-group { margin-bottom: 15px; }
                        label { display: block; margin-bottom: 5px; font-weight: bold; }
                        input, select, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
                        button { padding: 10px 20px; margin: 5px; border: none; border-radius: 4px; cursor: pointer; }
                        .btn-primary { background: #007bff; color: white; }
                        .btn-success { background: #28a745; color: white; }
                        slot { display: block; margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px; }
                    </style>
                    <div class="container">
                        <h3>📊 Dashboard Widgets</h3>
                        <form id="slot-form">
                            <div class="form-group">
                                <label>Widget Title:</label>
                                <input type="text" id="slot-text" name="text" placeholder="Sales Overview" />
                            </div>
                            <div class="form-group">
                                <label>Widget Type:</label>
                                <select id="slot-select" name="select">
                                    <option value="">Select Type</option>
                                    <optgroup label="Charts">
                                        <option value="line">Line Chart</option>
                                        <option value="bar">Bar Chart</option>
                                        <option value="pie">Pie Chart</option>
                                    </optgroup>
                                    <optgroup label="Metrics">
                                        <option value="kpi">KPI Card</option>
                                        <option value="table">Data Table</option>
                                    </optgroup>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Refresh Interval (seconds):</label>
                                <input type="number" id="slot-number" name="number" placeholder="60" min="10" />
                            </div>
                            <div class="form-group">
                                <label>Date Range:</label>
                                <input type="date" id="slot-date" name="date" />
                            </div>
                            <div class="form-group">
                                <label>Time Range:</label>
                                <input type="time" id="slot-time" name="time" />
                            </div>
                            <div class="form-group">
                                <label>Widget Color:</label>
                                <input type="color" id="slot-color" name="color" value="#007bff" />
                            </div>
                            <div class="form-group">
                                <label>Opacity:</label>
                                <input type="range" id="slot-range" name="range" min="0" max="100" value="100" />
                            </div>
                            <div class="form-group">
                                <label>Data Sources (Multi-select):</label>
                                <select id="slot-multi-select" name="multi" multiple style="height: 100px;">
                                    <option value="api1">API Source 1</option>
                                    <option value="api2">API Source 2</option>
                                    <option value="db1">Database 1</option>
                                    <option value="db2">Database 2</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Display Options:</label>
                                <input type="checkbox" id="slot-check1" name="checks" value="legend" />
                                <label for="slot-check1">Show Legend</label>
                                <input type="checkbox" id="slot-check2" name="checks" value="grid" />
                                <label for="slot-check2">Show Grid</label>
                                <input type="checkbox" id="slot-check3" name="checks" value="tooltip" />
                                <label for="slot-check3">Show Tooltips</label>
                            </div>
                            <div class="form-group">
                                <label>Size:</label>
                                <input type="radio" id="slot-radio1" name="slot-radio" value="small" />
                                <label for="slot-radio1">Small</label>
                                <input type="radio" id="slot-radio2" name="slot-radio" value="medium" />
                                <label for="slot-radio2">Medium</label>
                                <input type="radio" id="slot-radio3" name="slot-radio" value="large" />
                                <label for="slot-radio3">Large</label>
                            </div>
                            <div class="form-group">
                                <label>Notes:</label>
                                <textarea id="slot-textarea" name="textarea" rows="3" placeholder="Additional widget notes..."></textarea>
                            </div>
                            <div class="form-group">
                                <button type="submit" id="slot-submit" class="btn-success">Save Widget</button>
                                <button type="button" id="slot-button" class="btn-primary">Preview</button>
                                <button type="button" id="slot-click-1" onclick="alert('Reset to Defaults')">Reset</button>
                            </div>
                            <div class="form-group">
                                <a href="#" id="slot-link-1" onclick="alert('Widget Gallery'); return false;">Widget Gallery</a> |
                                <a href="#" id="slot-link-2" onclick="alert('Export Config'); return false;">Export</a>
                            </div>
                            <div class="form-group">
                                <div id="slot-clickable-1" onclick="alert('Add Widget')" style="padding: 10px; background: #28a745; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Add Widget</div>
                                <div id="slot-clickable-2" onclick="alert('Remove Widget')" style="padding: 10px; background: #dc3545; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Remove</div>
                            </div>
                        </form>
                        <slot name="custom-content"></slot>
                        <slot name="additional-inputs"></slot>
                        <slot name="extra-buttons"></slot>
                    </div>
                `;
                
                // Add slotted content
                const slotContent1 = document.createElement('div');
                slotContent1.slot = 'custom-content';
                slotContent1.innerHTML = '<p><strong>📈 Chart Configuration:</strong></p><input type="text" id="slotted-text" placeholder="Chart Title" style="width: 100%; padding: 8px; margin: 5px 0; box-sizing: border-box;" /><select id="slotted-select" style="width: 100%; padding: 8px; margin: 5px 0; box-sizing: border-box;"><option value="">Chart Style</option><option value="smooth">Smooth Lines</option><option value="stepped">Stepped</option><option value="bars">Bars</option></select><button type="button" id="slotted-button" onclick="alert(\'Apply Chart Style\')" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 5px;">Apply Style</button>';
                shadowHost6Ref.current.appendChild(slotContent1);
                
                const slotContent2 = document.createElement('div');
                slotContent2.slot = 'additional-inputs';
                slotContent2.innerHTML = '<p><strong>⚙️ Advanced Settings:</strong></p><input type="number" id="slotted-number" placeholder="Max Data Points" style="width: 100%; padding: 8px; margin: 5px 0; box-sizing: border-box;" /><input type="datetime-local" id="slotted-date" style="width: 100%; padding: 8px; margin: 5px 0; box-sizing: border-box;" /><input type="checkbox" id="slotted-check" /><label for="slotted-check">Auto-refresh</label><a href="#" id="slotted-link" onclick="alert(\'Settings Help\'); return false;">Help</a>';
                shadowHost6Ref.current.appendChild(slotContent2);
                
                const slotContent3 = document.createElement('div');
                slotContent3.slot = 'extra-buttons';
                slotContent3.innerHTML = '<p><strong>🎨 Quick Actions:</strong></p><button type="button" id="slotted-btn-1" onclick="alert(\'Duplicate Widget\')" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px;">Duplicate</button><button type="button" id="slotted-btn-2" onclick="alert(\'Share Widget\')" style="padding: 8px 16px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px;">Share</button><div id="slotted-div-1" onclick="alert(\'Full Screen\')" style="padding: 8px; background: #6f42c1; color: white; border-radius: 4px; cursor: pointer; display: inline-block; margin: 5px;">Full Screen</div>';
                shadowHost6Ref.current.appendChild(slotContent3);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [activeScenario]);

    const scenarios = [
        {
            id: 1,
            title: 'Normal Iframe',
            description: 'Standard iframe with all input types and buttons',
            ref: iframe1Ref
        },
        {
            id: 2,
            title: 'Shadow DOM',
            description: 'Shadow DOM with inputs and buttons',
            ref: shadowHost2Ref
        },
        {
            id: 3,
            title: 'Iframe Inside Shadow DOM',
            description: 'Iframe embedded within Shadow DOM',
            ref: shadowHost3Ref
        },
        {
            id: 4,
            title: 'Shadow DOM Inside Iframe',
            description: 'Shadow DOM created inside an iframe',
            ref: iframe4Ref
        },
        {
            id: 5,
            title: 'Nested Iframes',
            description: 'Iframe within iframe (nested)',
            ref: iframe5OuterRef
        },
        {
            id: 6,
            title: 'Shadow DOM with Slots',
            description: 'Shadow DOM using slot elements',
            ref: shadowHost6Ref
        },
        {
            id: 7,
            title: 'Iframe + Shadow DOM + Slots',
            description: 'Combination of iframe, Shadow DOM, and slots',
            ref: iframe7Ref
        },
        {
            id: 8,
            title: 'Auto-Healing Iframe',
            description: 'Elements change position and locators on every refresh',
            ref: iframe8Ref
        },
        {
            id: 9,
            title: 'PostMessage Blocking Test',
            description: 'Test if postMessages from child frames are blocked',
            ref: iframe9Ref
        }
    ];

    return (
        <div style={{
            height: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px',
            overflow: 'hidden',
            boxSizing: 'border-box'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                background: 'white',
                borderRadius: '16px',
                padding: '30px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                height: 'calc(100vh - 40px)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxSizing: 'border-box'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    paddingBottom: '15px',
                    borderBottom: '2px solid #e5e7eb',
                    flexShrink: 0
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '2.5em',
                            color: '#333',
                            marginBottom: '10px',
                            fontWeight: 'bold'
                        }}>
                            🧪 Iframe & Shadow DOM Test Page
                        </h1>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#666'
                        }}>
                            Comprehensive test data with all iframe types, Shadow DOM, and input/button combinations
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

                {/* Main Layout: Left Sidebar (Scenarios) + Right Content (Inputs) */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '300px 1fr',
                    gap: '20px',
                    flex: 1,
                    overflow: 'hidden',
                    minHeight: 0
                }}>
                    {/* Left Side: Scenario Navigation */}
                    <div style={{
                        background: '#f9fafb',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '2px solid #e5e7eb',
                        overflowY: 'auto',
                        height: '100%',
                        boxSizing: 'border-box'
                    }}>
                        <h3 style={{
                            color: '#333',
                            marginBottom: '20px',
                            fontSize: '1.2em',
                            fontWeight: 'bold',
                            paddingBottom: '15px',
                            borderBottom: '2px solid #e5e7eb'
                        }}>
                            📋 Scenarios
                        </h3>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            {scenarios.map(scenario => (
                                <button
                                    key={scenario.id}
                                    onClick={() => handleScenarioChange(scenario.id)}
                                    style={{
                                        padding: '15px',
                                        background: activeScenario === scenario.id ? '#667eea' : 'white',
                                        color: activeScenario === scenario.id ? 'white' : '#333',
                                        border: `2px solid ${activeScenario === scenario.id ? '#667eea' : '#e5e7eb'}`,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        transition: 'all 0.2s ease',
                                        textAlign: 'left',
                                        boxShadow: activeScenario === scenario.id ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (activeScenario !== scenario.id) {
                                            e.currentTarget.style.background = '#f3f4f6';
                                            e.currentTarget.style.borderColor = '#667eea';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (activeScenario !== scenario.id) {
                                            e.currentTarget.style.background = 'white';
                                            e.currentTarget.style.borderColor = '#e5e7eb';
                                        }
                                    }}
                                >
                                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                        Scenario {scenario.id}
                                    </div>
                                    <div style={{ fontSize: '12px', opacity: 0.9 }}>
                                        {scenario.title}
                                    </div>
                                    <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '5px' }}>
                                        {scenario.description}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Scenario Content (Inputs) */}
                    <div style={{
                        background: '#f9fafb',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '2px solid #e5e7eb',
                        overflowY: 'auto',
                        height: '100%',
                        boxSizing: 'border-box'
                    }}>
                        {activeScenario ? (
                            (() => {
                                const scenario = scenarios.find(s => s.id === activeScenario);
                                return (
                                    <div>
                                        <h2 style={{
                                            color: '#333',
                                            marginBottom: '10px',
                                            fontSize: '1.5em',
                                            fontWeight: 'bold'
                                        }}>
                                            Scenario {scenario.id}: {scenario.title}
                                        </h2>
                                        <p style={{
                                            color: '#666',
                                            marginBottom: '20px',
                                            fontSize: '14px',
                                            paddingBottom: '15px',
                                            borderBottom: '2px solid #e5e7eb'
                                        }}>
                                            {scenario.description}
                                        </p>
                                        <div style={{
                                            background: 'white',
                                            borderRadius: '8px',
                                            padding: '15px',
                                            border: '1px solid #e5e7eb',
                                            minHeight: '500px'
                                        }}>
                                            {scenario.id === 1 && <iframe ref={iframe1Ref} style={{ width: '100%', height: '600px', border: 'none', borderRadius: '4px' }} />}
                                            {scenario.id === 2 && <div ref={shadowHost2Ref} id={`shadow-host-${scenario.id}`} style={{ width: '100%', minHeight: '600px', display: 'block' }}></div>}
                                            {scenario.id === 3 && <div ref={shadowHost3Ref} id={`shadow-host-${scenario.id}`} style={{ width: '100%', minHeight: '600px', display: 'block' }}></div>}
                                            {scenario.id === 4 && <iframe ref={iframe4Ref} style={{ width: '100%', height: '600px', border: 'none', borderRadius: '4px' }} />}
                                            {scenario.id === 5 && <iframe ref={iframe5OuterRef} style={{ width: '100%', height: '600px', border: 'none', borderRadius: '4px' }} />}
                                            {scenario.id === 6 && <div ref={shadowHost6Ref} id={`shadow-host-${scenario.id}`} style={{ width: '100%', minHeight: '600px', display: 'block' }}></div>}
                                            {scenario.id === 7 && <iframe ref={iframe7Ref} style={{ width: '100%', height: '600px', border: 'none', borderRadius: '4px' }} />}
                                            {scenario.id === 8 && <iframe ref={iframe8Ref} style={{ width: '100%', height: '600px', border: 'none', borderRadius: '4px' }} />}
                                            {scenario.id === 9 && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                    <div style={{ 
                                                        background: iframeStatus.isSuccess ? '#d4edda' : '#f8d7da', 
                                                        border: `2px solid ${iframeStatus.isSuccess ? '#28a745' : '#dc3545'}`, 
                                                        padding: '15px', 
                                                        borderRadius: '8px',
                                                        color: iframeStatus.isSuccess ? '#155724' : '#721c24'
                                                    }}>
                                                        <h3 style={{ marginTop: 0, marginBottom: '10px', fontSize: '16px' }}>
                                                            📊 Message Status
                                                        </h3>
                                                        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
                                                            {iframeStatus.message}
                                                        </div>
                                                        <div style={{ fontSize: '12px', opacity: 0.8 }}>
                                                            Total messages sent: {iframeStatus.messageCount}
                                                        </div>
                                                    </div>
                                                    <iframe 
                                                        ref={iframe9Ref} 
                                                        style={{ 
                                                            width: '100%', 
                                                            height: '500px', 
                                                            border: '2px solid #007bff', 
                                                            borderRadius: '4px' 
                                                        }} 
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()
                        ) : (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '500px',
                                color: '#999'
                            }}>
                                <div style={{ fontSize: '4em', marginBottom: '20px' }}>👈</div>
                                <h3 style={{ fontSize: '1.3em', marginBottom: '10px' }}>
                                    Select a Scenario
                                </h3>
                                <p style={{ fontSize: '14px' }}>
                                    Choose a scenario from the left sidebar to view its inputs and buttons
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IframeShadowDOMTestPage;

