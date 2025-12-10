import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function FlutterViewTestPage() {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [currentPage, setCurrentPage] = useState('home'); // home, login, products, about, contact
    const [cartItems, setCartItems] = useState([]);
    const [products] = useState([
        { id: 1, name: 'Product 1', price: 29.99, image: '🛍️' },
        { id: 2, name: 'Product 2', price: 49.99, image: '📱' },
        { id: 3, name: 'Product 3', price: 79.99, image: '💻' },
        { id: 4, name: 'Product 4', price: 99.99, image: '⌚' },
        { id: 5, name: 'Product 5', price: 129.99, image: '🎧' },
        { id: 6, name: 'Product 6', price: 159.99, image: '📷' }
    ]);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear container
        containerRef.current.innerHTML = '';

        // Create Flutter view structure
        const flutterView = document.createElement('flutter-view');
        flutterView.setAttribute('flt-view-id', '0');
        flutterView.setAttribute('tabindex', '0');
        flutterView.style.cssText = 'position: absolute; inset: 0px; width: 100%; height: 100%;';

        // Create flt-glass-pane
        const glassPane = document.createElement('flt-glass-pane');
        const shadowRoot = glassPane.attachShadow({ mode: 'open' });

        // Create flt-scene-host
        const sceneHost = document.createElement('flt-scene-host');
        sceneHost.style.cssText = 'pointer-events: none;';

        // Create flt-canvas-container
        const canvasContainer = document.createElement('flt-canvas-container');
        const canvas = document.createElement('canvas');
        canvas.setAttribute('aria-hidden', 'true');
        const canvasWidth = 2346;
        const canvasHeight = 2012;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.cssText = 'position: absolute; width: 100%; height: 100%;';
        
        // Draw background on canvas
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
        gradient.addColorStop(0, '#f0f4f8');
        gradient.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        canvasContainer.appendChild(canvas);
        sceneHost.appendChild(canvasContainer);

        // Add styles to shadow root
        const style = document.createElement('style');
        style.id = 'flt-internals-stylesheet';
        style.textContent = `
            flt-scene-host {
                font: normal normal 14px sans-serif;
            }
            flt-semantics input[type=range] {
                appearance: none;
                -webkit-appearance: none;
                width: 100%;
                position: absolute;
                border: none;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
            }
            input::selection {
                background-color: transparent;
            }
            textarea::selection {
                background-color: transparent;
            }
            flt-semantics input, flt-semantics textarea, flt-semantics [contentEditable="true"] {
                caret-color: transparent;
            }
            .flt-text-editing::placeholder {
                opacity: 0;
            }
            :focus {
                outline: none;
            }
            .transparentTextEditing:-webkit-autofill,
            .transparentTextEditing:-webkit-autofill:hover,
            .transparentTextEditing:-webkit-autofill:focus,
            .transparentTextEditing:-webkit-autofill:active {
                opacity: 0 !important;
            }
        `;
        shadowRoot.appendChild(style);
        shadowRoot.appendChild(sceneHost);

        glassPane.appendChild(shadowRoot);

        // Create flt-text-editing-host
        const textEditingHost = document.createElement('flt-text-editing-host');

        // First form - Mobile number
        const form1 = document.createElement('form');
        form1.setAttribute('novalidate', '');
        form1.setAttribute('method', 'post');
        form1.setAttribute('action', '#');
        form1.className = 'transparentTextEditing';
        form1.style.cssText = 'white-space: pre-wrap; padding: 0px; opacity: 1; color: transparent; background: transparent; outline: none; border: none; resize: none; transform-origin: 0px 0px 0px; width: 0px; height: 0px; caret-color: transparent; top: -9999px; left: -9999px;';

        const input1 = document.createElement('input');
        input1.setAttribute('tabindex', '-1');
        input1.setAttribute('placeholder', 'Enter mobile number');
        input1.setAttribute('autocomplete', 'on');
        input1.setAttribute('autocorrect', 'on');
        input1.className = 'flt-text-editing transparentTextEditing';
        input1.id = 'flutter-mobile-input';
        input1.name = 'flutter-mobile-input';
        input1.type = 'tel';
        input1.style.cssText = 'forced-color-adjust: none; white-space: pre-wrap; position: absolute; top: -9999px; left: -9999px; padding: 0px; opacity: 1; color: transparent; background: transparent; caret-color: transparent; outline: none; border: none; resize: none; text-shadow: none; overflow: hidden; transform-origin: 0px 0px 0px; font: 16px Roboto_regular, -apple-system, BlinkMacSystemFont, sans-serif; width: 0px; height: 0px; transform: matrix(1, 0, 0, 1, 1263.69, 300.641);';
        
        input1.addEventListener('input', (e) => {
            setMobileNumber(e.target.value);
        });

        const submit1 = document.createElement('input');
        submit1.setAttribute('tabindex', '-1');
        submit1.className = 'submitBtn';
        submit1.type = 'submit';
        submit1.style.cssText = 'white-space: pre-wrap; padding: 0px; opacity: 1; color: transparent; background: transparent; outline: none; border: none; resize: none; transform-origin: 0px 0px 0px; top: -9999px; left: -9999px; width: 0px; height: 0px; caret-color: transparent;';

        form1.appendChild(input1);
        form1.appendChild(submit1);
        textEditingHost.appendChild(form1);

        // Second form - Password
        const form2 = document.createElement('form');
        form2.setAttribute('novalidate', '');
        form2.setAttribute('method', 'post');
        form2.setAttribute('action', '#');
        form2.className = 'transparentTextEditing';
        form2.style.cssText = 'white-space: pre-wrap; padding: 0px; opacity: 1; color: transparent; background: transparent; outline: none; border: none; resize: none; transform-origin: 0px 0px 0px; width: 0px; height: 0px; caret-color: transparent; top: -9999px; left: -9999px;';

        const input2 = document.createElement('input');
        input2.setAttribute('tabindex', '-1');
        input2.type = 'password';
        input2.setAttribute('placeholder', 'Enter password');
        input2.name = 'off';
        input2.id = 'off';
        input2.setAttribute('autocomplete', 'off');
        input2.setAttribute('autocorrect', 'off');
        input2.className = 'flt-text-editing transparentTextEditing';
        input2.id = 'flutter-password-input';
        input2.name = 'flutter-password-input';
        input2.style.cssText = 'forced-color-adjust: none; white-space: pre-wrap; position: absolute; top: -9999px; left: -9999px; padding: 0px; opacity: 1; color: transparent; background: transparent; caret-color: transparent; outline: none; border: none; resize: none; text-shadow: none; overflow: hidden; transform-origin: 0px 0px 0px; font: 16px Roboto_regular, -apple-system, BlinkMacSystemFont, sans-serif; width: 0px; height: 0px; transform: matrix(1, 0, 0, 1, 1236.5, 302);';
        
        input2.addEventListener('input', (e) => {
            setPassword(e.target.value);
        });

        const submit2 = document.createElement('input');
        submit2.setAttribute('tabindex', '-1');
        submit2.className = 'submitBtn';
        submit2.type = 'submit';
        submit2.style.cssText = 'white-space: pre-wrap; padding: 0px; opacity: 1; color: transparent; background: transparent; outline: none; border: none; resize: none; transform-origin: 0px 0px 0px; top: -9999px; left: -9999px; width: 0px; height: 0px; caret-color: transparent;';

        form2.appendChild(input2);
        form2.appendChild(submit2);
        textEditingHost.appendChild(form2);

        // Create flt-semantics-host
        const semanticsHost = document.createElement('flt-semantics-host');
        semanticsHost.style.cssText = 'position: absolute; transform-origin: 0px 0px 0px; transform: scale(0.5);';

        // Add global styles
        const globalStyle = document.createElement('style');
        globalStyle.id = 'flt-text-editing-stylesheet';
        globalStyle.textContent = `
            flutter-view flt-scene-host {
                font: normal normal 14px sans-serif;
            }
            flutter-view flt-semantics input[type=range] {
                appearance: none;
                -webkit-appearance: none;
                width: 100%;
                position: absolute;
                border: none;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
            }
            flutter-view input::selection {
                background-color: transparent;
            }
            flutter-view textarea::selection {
                background-color: transparent;
            }
            flutter-view flt-semantics input,
            flutter-view flt-semantics textarea,
            flutter-view flt-semantics [contentEditable="true"] {
                caret-color: transparent;
            }
            flutter-view .flt-text-editing::placeholder {
                opacity: 0;
            }
            flutter-view:focus {
                outline: none;
            }
            flutter-view .transparentTextEditing:-webkit-autofill,
            flutter-view .transparentTextEditing:-webkit-autofill:hover,
            flutter-view .transparentTextEditing:-webkit-autofill:focus,
            flutter-view .transparentTextEditing:-webkit-autofill:active {
                opacity: 0 !important;
            }
        `;

        flutterView.appendChild(glassPane);
        flutterView.appendChild(textEditingHost);
        flutterView.appendChild(semanticsHost);
        flutterView.appendChild(globalStyle);

        containerRef.current.appendChild(flutterView);

        // Create visible website UI
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: auto; z-index: 1000; background: white; overflow-y: auto; min-height: 100vh;';
        
        // Navigation Bar
        const nav = document.createElement('nav');
        nav.style.cssText = 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);';
        
        const logo = document.createElement('div');
        logo.textContent = '🦋 Flutter Store';
        logo.style.cssText = 'font-size: 24px; font-weight: bold; color: white;';
        nav.appendChild(logo);
        
        const navLinks = document.createElement('div');
        navLinks.style.cssText = 'display: flex; gap: 30px;';
        
        const pages = [
            { id: 'home', label: 'Home' },
            { id: 'products', label: 'Products' },
            { id: 'about', label: 'About' },
            { id: 'contact', label: 'Contact' },
            { id: 'login', label: 'Login' }
        ];
        
        pages.forEach(page => {
            const link = document.createElement('button');
            link.textContent = page.label;
            link.id = `nav-${page.id}`;
            link.style.cssText = 'background: none; border: none; color: white; font-size: 16px; font-weight: 500; cursor: pointer; padding: 8px 16px; border-radius: 6px; transition: all 0.3s ease;';
            link.addEventListener('mouseenter', () => {
                link.style.background = 'rgba(255, 255, 255, 0.2)';
            });
            link.addEventListener('mouseleave', () => {
                link.style.background = 'none';
            });
            link.addEventListener('click', () => {
                setCurrentPage(page.id);
            });
            navLinks.appendChild(link);
        });
        
        const cartBadge = document.createElement('div');
        cartBadge.id = 'cart-badge';
        cartBadge.style.cssText = 'position: relative; cursor: pointer;';
        const cartIcon = document.createElement('div');
        cartIcon.textContent = '🛒';
        cartIcon.style.cssText = 'font-size: 24px;';
        cartBadge.appendChild(cartIcon);
        if (cartItems.length > 0) {
            const badge = document.createElement('span');
            badge.textContent = cartItems.length;
            badge.style.cssText = 'position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;';
            cartBadge.appendChild(badge);
        }
        navLinks.appendChild(cartBadge);
        nav.appendChild(navLinks);
        overlay.appendChild(nav);
        
        // Main Content Area
        const mainContent = document.createElement('div');
        mainContent.id = 'main-content';
        mainContent.style.cssText = 'min-height: calc(100vh - 200px); padding: 40px;';
        overlay.appendChild(mainContent);
        
        // Footer
        const footer = document.createElement('footer');
        footer.style.cssText = 'background: #1f2937; color: white; padding: 30px 40px; text-align: center;';
        footer.innerHTML = '<p style="margin: 0;">© 2024 Flutter Store. All rights reserved.</p>';
        overlay.appendChild(footer);
        
        containerRef.current.appendChild(overlay);
        
        // Sync values
        input1.value = mobileNumber;
        input2.value = password;

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [mobileNumber, password, currentPage, cartItems]);

    // Render page content
    useEffect(() => {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        mainContent.innerHTML = '';

        if (currentPage === 'home') {
            renderHomePage(mainContent);
        } else if (currentPage === 'login') {
            renderLoginPage(mainContent);
        } else if (currentPage === 'products') {
            renderProductsPage(mainContent);
        } else if (currentPage === 'about') {
            renderAboutPage(mainContent);
        } else if (currentPage === 'contact') {
            renderContactPage(mainContent);
        }
    }, [currentPage, cartItems, products, mobileNumber, password, submitted]);

    const renderHomePage = (container) => {
        container.innerHTML = `
            <div style="max-width: 1200px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 60px;">
                    <h1 style="font-size: 48px; color: #111827; margin-bottom: 20px;">Welcome to Flutter Store</h1>
                    <p style="font-size: 20px; color: #6b7280; margin-bottom: 30px;">Your one-stop shop for amazing products</p>
                    <button id="shop-now-btn" style="padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; font-size: 18px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                        Shop Now
                    </button>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 60px;">
                    <div style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 20px;">🚀</div>
                        <h3 style="color: #111827; margin-bottom: 10px;">Fast Delivery</h3>
                        <p style="color: #6b7280;">Get your products delivered quickly</p>
                    </div>
                    <div style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 20px;">🔒</div>
                        <h3 style="color: #111827; margin-bottom: 10px;">Secure Payment</h3>
                        <p style="color: #6b7280;">Your transactions are safe and secure</p>
                    </div>
                    <div style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 20px;">⭐</div>
                        <h3 style="color: #111827; margin-bottom: 10px;">Best Quality</h3>
                        <p style="color: #6b7280;">Only the finest products for you</p>
                    </div>
                </div>
                
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 60px; border-radius: 16px; text-align: center; color: white;">
                    <h2 style="font-size: 36px; margin-bottom: 20px;">Special Offer</h2>
                    <p style="font-size: 20px; margin-bottom: 30px;">Get 20% off on your first order!</p>
                    <button id="claim-offer-btn" style="padding: 14px 32px; background: white; color: #667eea; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer;">
                        Claim Offer
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('shop-now-btn')?.addEventListener('click', () => setCurrentPage('products'));
        document.getElementById('claim-offer-btn')?.addEventListener('click', () => setCurrentPage('products'));
    };

    const renderLoginPage = (container) => {
        container.innerHTML = `
            <div style="max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);">
                <h2 style="text-align: center; color: #111827; margin-bottom: 30px; font-size: 32px;">Login</h2>
                
                <label style="display: block; margin-bottom: 8px; color: #374151; font-size: 14px; font-weight: 500;">Mobile Number</label>
                <input 
                    id="visible-mobile-input" 
                    type="tel" 
                    placeholder="Enter mobile number" 
                    value="${mobileNumber}"
                    style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 16px; margin-bottom: 20px; box-sizing: border-box;"
                />
                
                <label style="display: block; margin-bottom: 8px; color: #374151; font-size: 14px; font-weight: 500;">Password</label>
                <input 
                    id="visible-password-input" 
                    type="password" 
                    placeholder="Enter password" 
                    value="${password}"
                    style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 16px; margin-bottom: 20px; box-sizing: border-box;"
                />
                
                <button 
                    id="login-submit-btn" 
                    style="width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;"
                >
                    Sign In
                </button>
                
                ${submitted ? `
                    <div style="margin-top: 20px; padding: 15px; background: #d1fae5; border: 2px solid #10b981; border-radius: 8px; color: #065f46; text-align: center;">
                        <strong>✓ Login Successful!</strong>
                    </div>
                ` : ''}
            </div>
        `;
        
        const mobileInput = document.getElementById('visible-mobile-input');
        const passwordInput = document.getElementById('visible-password-input');
        const submitBtn = document.getElementById('login-submit-btn');
        
        if (mobileInput) {
            mobileInput.addEventListener('input', (e) => {
                setMobileNumber(e.target.value);
                const flutterInput = document.getElementById('flutter-mobile-input');
                if (flutterInput) flutterInput.value = e.target.value;
            });
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                setPassword(e.target.value);
                const flutterInput = document.getElementById('flutter-password-input');
                if (flutterInput) flutterInput.value = e.target.value;
            });
        }
        
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                if (mobileNumber && password) {
                    setSubmitted(true);
                }
            });
        }
    };

    const renderProductsPage = (container) => {
        container.innerHTML = `
            <div style="max-width: 1200px; margin: 0 auto;">
                <h1 style="font-size: 36px; color: #111827; margin-bottom: 40px; text-align: center;">Our Products</h1>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
                    ${products.map(product => `
                        <div style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center; transition: transform 0.3s ease;">
                            <div style="font-size: 64px; margin-bottom: 20px;">${product.image}</div>
                            <h3 style="color: #111827; margin-bottom: 10px; font-size: 20px;">${product.name}</h3>
                            <p style="color: #667eea; font-size: 24px; font-weight: bold; margin-bottom: 20px;">$${product.price}</p>
                            <button 
                                id="add-to-cart-${product.id}" 
                                style="width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;"
                            >
                                Add to Cart
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        products.forEach(product => {
            const btn = document.getElementById(`add-to-cart-${product.id}`);
            if (btn) {
                btn.addEventListener('click', () => {
                    setCartItems(prev => [...prev, product]);
                });
            }
        });
    };

    const renderAboutPage = (container) => {
        container.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto;">
                <h1 style="font-size: 36px; color: #111827; margin-bottom: 30px; text-align: center;">About Us</h1>
                
                <div style="background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin-bottom: 30px;">
                    <h2 style="color: #111827; margin-bottom: 20px;">Our Story</h2>
                    <p style="color: #6b7280; line-height: 1.8; margin-bottom: 20px;">
                        Flutter Store was founded with a vision to provide the best shopping experience 
                        for customers worldwide. We believe in quality, innovation, and customer satisfaction.
                    </p>
                    <p style="color: #6b7280; line-height: 1.8;">
                        Our team is dedicated to bringing you the latest and greatest products at competitive prices. 
                        We source our products from trusted suppliers and ensure every item meets our high standards.
                    </p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                    <div style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                        <h3 style="color: #111827; margin-bottom: 15px;">Our Mission</h3>
                        <p style="color: #6b7280; line-height: 1.6;">
                            To make quality products accessible to everyone while maintaining the highest standards of service.
                        </p>
                    </div>
                    <div style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                        <h3 style="color: #111827; margin-bottom: 15px;">Our Values</h3>
                        <p style="color: #6b7280; line-height: 1.6;">
                            Integrity, quality, and customer-first approach guide everything we do.
                        </p>
                    </div>
                </div>
            </div>
        `;
    };

    const renderContactPage = (container) => {
        container.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto;">
                <h1 style="font-size: 36px; color: #111827; margin-bottom: 40px; text-align: center;">Contact Us</h1>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; margin-bottom: 40px;">
                    <div style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 15px;">📧</div>
                        <h3 style="color: #111827; margin-bottom: 10px;">Email</h3>
                        <p style="color: #6b7280;">support@flutterstore.com</p>
                    </div>
                    <div style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 15px;">📞</div>
                        <h3 style="color: #111827; margin-bottom: 10px;">Phone</h3>
                        <p style="color: #6b7280;">+1 (555) 123-4567</p>
                    </div>
                </div>
                
                <div style="background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #111827; margin-bottom: 30px;">Send us a Message</h2>
                    <form id="contact-form">
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; color: #374151; font-size: 14px; font-weight: 500;">Name</label>
                            <input type="text" style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 16px; box-sizing: border-box;" />
                        </div>
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; color: #374151; font-size: 14px; font-weight: 500;">Email</label>
                            <input type="email" style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 16px; box-sizing: border-box;" />
                        </div>
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; color: #374151; font-size: 14px; font-weight: 500;">Message</label>
                            <textarea rows="5" style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 16px; box-sizing: border-box; resize: vertical;"></textarea>
                        </div>
                        <button type="submit" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Message sent successfully!');
            });
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'white',
            padding: 0,
            margin: 0,
            overflow: 'hidden'
        }}>
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            />

            <button
                onClick={() => navigate('/')}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    padding: '12px 24px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    zIndex: 10000
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#5568d3';
                    e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#667eea';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                ← Back to Home
            </button>
        </div>
    );
}
