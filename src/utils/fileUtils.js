export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFullXPath(element, context = document) {
    if (!element) return '';
    
    if (element.id) {
        const idPath = `//*[@id="${element.id}"]`;
        if (context !== document) {
            return `(iframe or shadow context) ${idPath}`;
        }
        return idPath;
    }
    
    if (element.name) {
        return `//input[@name="${element.name}"]`;
    }
    
    if (element.type === 'file') {
        const typePath = `//input[@type="file"]`;
        if (context !== document) {
            return `(iframe or shadow context) ${typePath}`;
        }
        return typePath;
    }
    
    const parts = [];
    let current = element;
    
    while (current && current !== context && current.nodeType === Node.ELEMENT_NODE) {
        let index = 0;
        let sibling = current.previousElementSibling;
        
        while (sibling) {
            if (sibling.nodeName === current.nodeName) {
                index++;
            }
            sibling = sibling.previousElementSibling;
        }
        
        const tagName = current.nodeName.toLowerCase();
        const pathIndex = index > 0 ? `[${index + 1}]` : '';
        
        let attrStr = '';
        if (current.className) {
            const classes = current.className.trim().split(/\s+/).filter(c => c).join('.');
            if (classes) attrStr = `[@class="${classes}"]`;
        }
        
        parts.unshift(tagName + pathIndex + attrStr);
        current = current.parentElement;
    }
    
    const path = '/' + parts.join('/');
    if (context !== document) {
        return `(iframe or shadow context) ${path}`;
    }
    return path;
}

export function findAndClickInput(inputId, maxAttempts = 10) {
    return new Promise((resolve, reject) => {
        function tryClick(attempt = 0) {
            let input = document.getElementById(inputId);
            
            if (!input) {
                const containerIds = [
                    'deep-nesting-container',
                    'wide-branching-container',
                    'heavy-hidden-container',
                    'test-area-heavy-hidden'
                ];
                
                for (const containerId of containerIds) {
                    const container = document.getElementById(containerId);
                    if (container) {
                        input = container.querySelector(`#${inputId}`);
                        if (input) break;
                        
                        const inputs = container.querySelectorAll('input[type="file"]');
                        for (let inp of inputs) {
                            if (inp.id === inputId) {
                                input = inp;
                                break;
                            }
                        }
                        if (input) break;
                        
                        if (inputs.length > 0 && (inputId.includes('deep-nesting') || inputId.includes('wide-branching'))) {
                            input = inputs[0];
                            break;
                        }
                    }
                }
            }
            
            if (!input) {
                const allInputs = document.querySelectorAll('input[type="file"]');
                for (let inp of allInputs) {
                    if (inp.id === inputId) {
                        input = inp;
                        break;
                    }
                }
            }
            
            if (input) {
                try {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                        input.click();
                        resolve(input);
                    }, 100);
                    return;
                } catch (e) {
                    console.error('Error clicking input:', e);
                    reject(e);
                    return;
                }
            }
            
            if (attempt < maxAttempts) {
                setTimeout(() => tryClick(attempt + 1), 300);
            } else {
                const allInputs = document.querySelectorAll('input[type="file"]');
                const partialMatch = inputId.replace('-input', '');
                for (let inp of allInputs) {
                    if (inp.id && (inp.id === inputId || inp.id.includes(partialMatch))) {
                        try {
                            inp.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            setTimeout(() => {
                                inp.click();
                                resolve(inp);
                            }, 100);
                            return;
                        } catch (e) {
                            console.error('Error clicking matched input:', e);
                        }
                    }
                }
                reject(new Error('File input not found after multiple attempts'));
            }
        }
        
        tryClick();
    });
}

