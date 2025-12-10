import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadStatusProvider } from '../contexts/UploadStatusContext';

function CanvasTestPageContent() {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [activeInput, setActiveInput] = useState(null);
    const [inputText, setInputText] = useState('');
    const [selectedMenu, setSelectedMenu] = useState('dashboard');
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [notifications, setNotifications] = useState([
        { id: 1, text: 'New user registered', time: '2m ago', read: false },
        { id: 2, text: 'System update available', time: '1h ago', read: false },
        { id: 3, text: 'Payment received', time: '3h ago', read: true }
    ]);
    const [customAlert, setCustomAlert] = useState(null); // { message: string, type: 'info' | 'success' | 'warning' | 'error' }
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        country: '',
        gender: '',
        dateOfBirth: '',
        comments: ''
    });
    const [formActiveInput, setFormActiveInput] = useState(null);

    // Update canvas size based on container
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setCanvasSize({ width: rect.width, height: rect.height });
            }
        };
        
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const CANVAS_WIDTH = canvasSize.width || window.innerWidth;
    const CANVAS_HEIGHT = canvasSize.height || window.innerHeight;

    // Login form positions
    const loginForm = {
        x: CANVAS_WIDTH / 2 - 250,
        y: CANVAS_HEIGHT / 2 - 250,
        width: 500,
        height: 450,
        titleY: CANVAS_HEIGHT / 2 - 200,
        usernameInput: { x: CANVAS_WIDTH / 2 - 220, y: CANVAS_HEIGHT / 2 - 120, width: 440, height: 50 },
        passwordInput: { x: CANVAS_WIDTH / 2 - 220, y: CANVAS_HEIGHT / 2 - 50, width: 440, height: 50 },
        loginButton: { x: CANVAS_WIDTH / 2 - 120, y: CANVAS_HEIGHT / 2 + 30, width: 240, height: 55 },
        errorY: CANVAS_HEIGHT / 2 + 5
    };

    // Dashboard layout
    const sidebar = { x: 0, y: 0, width: 260, height: CANVAS_HEIGHT };
    const header = { x: 260, y: 0, width: CANVAS_WIDTH - 260, height: 80 };
    const content = { x: 260, y: 80, width: CANVAS_WIDTH - 260, height: CANVAS_HEIGHT - 80 };

    const menuItems = [
        { id: 'dashboard', label: '📊 Dashboard', y: 140 },
        { id: 'analytics', label: '📈 Analytics', y: 190 },
        { id: 'users', label: '👥 Users', y: 240 },
        { id: 'form', label: '📝 Form', y: 290 },
        { id: 'settings', label: '⚙️ Settings', y: 340 },
        { id: 'reports', label: '📄 Reports', y: 390 },
        { id: 'messages', label: '💬 Messages', y: 440 }
    ];

    // Check if point is inside a rectangle
    const isPointInRect = (x, y, rect) => {
        return x >= rect.x && x <= rect.x + rect.width &&
               y >= rect.y && y <= rect.y + rect.height;
    };

    // Draw rounded rectangle
    const drawRoundedRect = (ctx, x, y, width, height, radius, fillColor, strokeColor, lineWidth = 1) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        
        if (fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }
        if (strokeColor) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        }
    };

    // Draw button with gradient
    const drawButton = (ctx, rect, text, isActive = false, isPrimary = false) => {
        if (isPrimary) {
            const gradient = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.height);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            drawRoundedRect(ctx, rect.x, rect.y, rect.width, rect.height, 12, gradient, 'transparent', 0);
        } else {
            const bgColor = isActive ? '#667eea' : '#f3f4f6';
            drawRoundedRect(ctx, rect.x, rect.y, rect.width, rect.height, 10, bgColor, 'transparent', 0);
        }
        
        ctx.fillStyle = isActive || isPrimary ? '#ffffff' : '#374151';
        ctx.font = '500 15px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, rect.x + rect.width / 2, rect.y + rect.height / 2);
    };

    // Draw input field
    const drawInput = (ctx, rect, value, placeholder, isActive = false) => {
        const bgColor = isActive ? '#ffffff' : '#f8f9fa';
        const borderColor = isActive ? '#667eea' : '#e1e5e9';
        const borderWidth = isActive ? 2.5 : 1.5;
        
        drawRoundedRect(ctx, rect.x, rect.y, rect.width, rect.height, 10, bgColor, borderColor, borderWidth);
        
        ctx.fillStyle = value ? '#1a1a1a' : '#9ca3af';
        ctx.font = '15px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(value || placeholder, rect.x + 18, rect.y + rect.height / 2);
        
        if (isActive) {
            const textWidth = ctx.measureText(value || placeholder).width;
            const cursorX = rect.x + 18 + textWidth;
            ctx.fillStyle = '#667eea';
            ctx.fillRect(cursorX, rect.y + 15, 2, 22);
        }
    };

    // Draw stat card with shadow effect
    const drawStatCard = (ctx, x, y, width, height, title, value, change, icon, color = '#667eea') => {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        drawRoundedRect(ctx, x + 2, y + 2, width, height, 16, 'rgba(0, 0, 0, 0.05)', 'transparent', 0);
        
        // Card
        drawRoundedRect(ctx, x, y, width, height, 16, '#ffffff', '#e5e7eb', 1);
        
        // Icon background
        const iconBg = ctx.createLinearGradient(x + 20, y + 20, x + 80, y + 80);
        iconBg.addColorStop(0, color);
        iconBg.addColorStop(1, color + '80');
        drawRoundedRect(ctx, x + 20, y + 20, 60, 60, 12, iconBg, 'transparent', 0);
        
        // Icon
        ctx.fillStyle = '#ffffff';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(icon, x + 50, y + 60);
        
        // Title
        ctx.fillStyle = '#6b7280';
        ctx.font = '13px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(title, x + 20, y + 100);
        
        // Value
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 32px Arial';
        ctx.fillText(value, x + 20, y + 130);
        
        // Change
        ctx.fillStyle = change > 0 ? '#10b981' : '#ef4444';
        ctx.font = '12px Arial';
        ctx.fillText(`${change > 0 ? '↑' : '↓'} ${Math.abs(change)}%`, x + 20, y + 155);
    };

    // Draw chart bar
    const drawBar = (ctx, x, y, width, height, color) => {
        const gradient = ctx.createLinearGradient(x, y, x, y + height);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color + '80');
        drawRoundedRect(ctx, x, y, width, height, 6, gradient, 'transparent', 0);
    };

    // Draw notification badge
    const drawNotificationBadge = (ctx, x, y, count) => {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(count.toString(), x, y);
    };

    // Draw custom alert/modal
    const drawCustomAlert = (ctx) => {
        if (!customAlert) return;
        
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // Alert box
        const alertWidth = 500;
        const alertHeight = 200;
        const alertX = (CANVAS_WIDTH - alertWidth) / 2;
        const alertY = (CANVAS_HEIGHT - alertHeight) / 2;
        
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        drawRoundedRect(ctx, alertX + 5, alertY + 5, alertWidth, alertHeight, 16, 'rgba(0, 0, 0, 0.2)', 'transparent', 0);
        
        // Alert background
        const alertColors = {
            info: { bg: '#dbeafe', border: '#3b82f6', icon: 'ℹ️' },
            success: { bg: '#d1fae5', border: '#10b981', icon: '✓' },
            warning: { bg: '#fef3c7', border: '#f59e0b', icon: '⚠️' },
            error: { bg: '#fee2e2', border: '#ef4444', icon: '✕' }
        };
        
        const colors = alertColors[customAlert.type] || alertColors.info;
        drawRoundedRect(ctx, alertX, alertY, alertWidth, alertHeight, 16, '#ffffff', colors.border, 2);
        
        // Icon
        ctx.fillStyle = colors.border;
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(colors.icon, CANVAS_WIDTH / 2, alertY + 60);
        
        // Message
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(customAlert.message, CANVAS_WIDTH / 2, alertY + 120);
        
        // OK button
        const okButton = { x: CANVAS_WIDTH / 2 - 60, y: alertY + 150, width: 120, height: 40 };
        drawButton(ctx, okButton, 'OK', false, true);
        window._alertOkButton = okButton;
    };

    // Render login form
    const renderLoginForm = (ctx) => {
        // Background gradient
        const bgGradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        bgGradient.addColorStop(0, '#667eea');
        bgGradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // Login card with shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        drawRoundedRect(ctx, loginForm.x + 5, loginForm.y + 5, loginForm.width, loginForm.height, 20, 'rgba(0, 0, 0, 0.1)', 'transparent', 0);
        
        drawRoundedRect(ctx, loginForm.x, loginForm.y, loginForm.width, loginForm.height, 20, '#ffffff', 'transparent', 0);
        
        // Title
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Welcome Back', CANVAS_WIDTH / 2, loginForm.titleY);
        
        ctx.fillStyle = '#6b7280';
        ctx.font = '16px Arial';
        ctx.fillText('Sign in to your account', CANVAS_WIDTH / 2, loginForm.titleY + 40);
        
        // Input fields
        ctx.fillStyle = '#374151';
        ctx.font = '500 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Username', loginForm.usernameInput.x, loginForm.usernameInput.y - 25);
        drawInput(ctx, loginForm.usernameInput, username, 'Enter username', activeInput === 'username');
        
        ctx.fillText('Password', loginForm.passwordInput.x, loginForm.passwordInput.y - 25);
        const passwordDisplay = password ? '*'.repeat(password.length) : '';
        drawInput(ctx, loginForm.passwordInput, passwordDisplay, 'Enter password', activeInput === 'password');
        
        // Error message
        if (loginError) {
            ctx.fillStyle = '#dc2626';
            ctx.font = '13px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(loginError, CANVAS_WIDTH / 2, loginForm.errorY);
        }
        
        // Login button
        drawButton(ctx, loginForm.loginButton, 'Sign In', false, true);
        
        // Help text
        ctx.fillStyle = '#9ca3af';
        ctx.font = '13px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Use: Admin / Admin', CANVAS_WIDTH / 2, loginForm.y + loginForm.height - 30);
    };

    // Render dashboard
    const renderDashboard = (ctx) => {
        // Sidebar with gradient
        const sidebarGradient = ctx.createLinearGradient(sidebar.x, sidebar.y, sidebar.x, sidebar.y + sidebar.height);
        sidebarGradient.addColorStop(0, '#1f2937');
        sidebarGradient.addColorStop(1, '#111827');
        ctx.fillStyle = sidebarGradient;
        ctx.fillRect(sidebar.x, sidebar.y, sidebar.width, sidebar.height);
        
        // Logo/Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Admin Panel', 30, 50);
        
        // Divider
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, 80);
        ctx.lineTo(sidebar.width - 30, 80);
        ctx.stroke();
        
        // Menu items
        menuItems.forEach(item => {
            const isActive = selectedMenu === item.id;
            const rect = { x: 15, y: item.y - 25, width: sidebar.width - 30, height: 45 };
            const bgColor = isActive ? '#667eea' : 'transparent';
            drawRoundedRect(ctx, rect.x, rect.y, rect.width, rect.height, 10, bgColor, 'transparent', 0);
            ctx.fillStyle = isActive ? '#ffffff' : '#d1d5db';
            ctx.font = '500 15px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.label, rect.x + 20, rect.y + rect.height / 2);
            window[`_menu_${item.id}`] = rect;
        });
        
        // Logout button
        const logoutRect = { x: 15, y: CANVAS_HEIGHT - 70, width: sidebar.width - 30, height: 45 };
        drawButton(ctx, logoutRect, '🚪 Logout', false);
        window._logoutButton = logoutRect;
        
        // Header with gradient
        const headerGradient = ctx.createLinearGradient(header.x, header.y, header.x, header.y + header.height);
        headerGradient.addColorStop(0, '#ffffff');
        headerGradient.addColorStop(1, '#f9fafb');
        ctx.fillStyle = headerGradient;
        ctx.fillRect(header.x, header.y, header.width, header.height);
        
        // Header border
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(header.x, header.y + header.height);
        ctx.lineTo(header.x + header.width, header.y + header.height);
        ctx.stroke();
        
        // Header content
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Dashboard', header.x + 40, header.y + 50);
        
        // Search bar
        const searchRect = { x: header.x + header.width - 400, y: header.y + 25, width: 320, height: 35 };
        drawInput(ctx, searchRect, '', 'Search...', activeInput === 'search');
        window._searchInput = searchRect;
        
        // Notifications icon
        const unreadCount = notifications.filter(n => !n.read).length;
        ctx.fillStyle = '#6b7280';
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🔔', header.x + header.width - 50, header.y + 45);
        if (unreadCount > 0) {
            drawNotificationBadge(ctx, header.x + header.width - 30, header.y + 30, unreadCount);
        }
        window._notificationsButton = { x: header.x + header.width - 70, y: header.y + 20, width: 50, height: 50 };
        
        // Content area
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(content.x, content.y, content.width, content.height);
        
        // Render based on selected menu
        if (selectedMenu === 'dashboard') {
            renderDashboardContent(ctx);
        } else if (selectedMenu === 'analytics') {
            renderAnalyticsContent(ctx);
        } else if (selectedMenu === 'users') {
            renderUsersContent(ctx);
        } else if (selectedMenu === 'form') {
            renderFormContent(ctx);
        } else if (selectedMenu === 'settings') {
            renderSettingsContent(ctx);
        } else if (selectedMenu === 'reports') {
            renderReportsContent(ctx);
        } else if (selectedMenu === 'messages') {
            renderMessagesContent(ctx);
        }
    };

    // Dashboard content
    const renderDashboardContent = (ctx) => {
        const padding = 30;
        const cardSpacing = 20;
        const cardWidth = Math.floor((content.width - padding * 2 - cardSpacing * 3) / 4);
        
        // Stats cards - ensure proper alignment
        const cardX1 = content.x + padding;
        const cardX2 = cardX1 + cardWidth + cardSpacing;
        const cardX3 = cardX2 + cardWidth + cardSpacing;
        const cardX4 = cardX3 + cardWidth + cardSpacing;
        const cardY = content.y + padding;
        
        drawStatCard(ctx, cardX1, cardY, cardWidth, 180, 'Total Users', '12,345', 12.5, '👥', '#667eea');
        drawStatCard(ctx, cardX2, cardY, cardWidth, 180, 'Revenue', '$45,678', 8.2, '💰', '#10b981');
        drawStatCard(ctx, cardX3, cardY, cardWidth, 180, 'Orders', '1,234', -3.1, '📦', '#f59e0b');
        drawStatCard(ctx, cardX4, cardY, cardWidth, 180, 'Growth', '23.5%', 5.7, '📈', '#ef4444');
        
        // Chart area
        const chartWidth = content.width - padding * 2;
        const chartHeight = 350;
        const chartY = content.y + padding + 200;
        drawRoundedRect(ctx, content.x + padding, chartY, chartWidth, chartHeight, 16, '#ffffff', '#e5e7eb', 1);
        
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Sales Overview', content.x + padding + 30, chartY + 40);
        
        // Bar chart
        const chartData = [65, 80, 45, 90, 70, 55, 85, 95, 60, 75];
        const chartX = content.x + padding + 50;
        const chartBarY = chartY + 100;
        const chartAreaWidth = chartWidth - 100;
        const chartAreaHeight = 220;
        const barWidth = 50;
        const spacing = Math.floor((chartAreaWidth - (chartData.length * barWidth)) / (chartData.length - 1));
        const maxValue = 100;
        
        chartData.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartAreaHeight;
            const x = chartX + index * (barWidth + spacing);
            const y = chartBarY + chartAreaHeight - barHeight;
            drawBar(ctx, x, y, barWidth, barHeight, '#667eea');
            
            // Value label
            ctx.fillStyle = '#374151';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value.toString(), x + barWidth / 2, y - 8);
        });
        
        // Activity feed
        const activityY = chartY + chartHeight + padding;
        const activityWidth = 400;
        const activityCardX = content.x + padding;
        drawRoundedRect(ctx, activityCardX, activityY, activityWidth, 200, 16, '#ffffff', '#e5e7eb', 1);
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Recent Activity', activityCardX + 30, activityY + 30);
        
        const activities = [
            'New user registered',
            'Order #1234 completed',
            'Payment received',
            'System backup completed',
            'Report generated'
        ];
        
        ctx.fillStyle = '#6b7280';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        activities.forEach((activity, index) => {
            ctx.fillText(`• ${activity}`, activityCardX + 30, activityY + 65 + (index * 25));
        });
        
        // Quick actions
        const actionsX = activityCardX + activityWidth + cardSpacing;
        const actionsWidth = content.width - activityWidth - padding * 2 - cardSpacing;
        drawRoundedRect(ctx, actionsX, activityY, actionsWidth, 200, 16, '#ffffff', '#e5e7eb', 1);
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Quick Actions', actionsX + 30, activityY + 30);
        
        const actions = [
            { icon: '➕', label: 'Add User', x: 30 },
            { icon: '📊', label: 'View Reports', x: 180 },
            { icon: '⚙️', label: 'Settings', x: 330 },
            { icon: '📧', label: 'Send Email', x: 480 }
        ];
        
        actions.forEach(action => {
            const actionRect = { x: actionsX + action.x, y: activityY + 65, width: 130, height: 55 };
            drawButton(ctx, actionRect, `${action.icon} ${action.label}`, false);
            const key = action.label.replace(' ', '_');
            window[`_action_${key}`] = actionRect;
        });
    };

    // Analytics content
    const renderAnalyticsContent = (ctx) => {
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Analytics Dashboard', content.x + 40, content.y + 50);
        
        const padding = 40;
        const totalSpacing = padding * 2;
        const availableWidth = content.width - padding * 2 - totalSpacing;
        const cardWidth = Math.floor(availableWidth / 2);
        const cardHeight = 150;
        
        const metrics = [
            { label: 'Page Views', value: '125,430', change: 15.3, icon: '👁️', color: '#667eea' },
            { label: 'Unique Visitors', value: '45,230', change: 8.7, icon: '👤', color: '#10b981' },
            { label: 'Bounce Rate', value: '32.5%', change: -5.2, icon: '📉', color: '#f59e0b' },
            { label: 'Avg. Session', value: '4m 32s', change: 12.1, icon: '⏱️', color: '#ef4444' }
        ];
        
        metrics.forEach((metric, index) => {
            const col = index % 2;
            const row = Math.floor(index / 2);
            const x = content.x + padding + col * (cardWidth + padding);
            const y = content.y + 100 + row * (cardHeight + padding);
            drawStatCard(ctx, x, y, cardWidth, cardHeight, metric.label, metric.value, metric.change, metric.icon, metric.color);
        });
    };

    // Users content
    const renderUsersContent = (ctx) => {
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('User Management', content.x + 40, content.y + 50);
        
        const tableX = content.x + 40;
        const tableWidth = content.width - 80;
        const tableHeaderY = content.y + 100;
        
        // Table header
        drawRoundedRect(ctx, tableX, tableHeaderY, tableWidth, 60, 12, '#f3f4f6', '#e5e7eb', 1);
        const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Actions'];
        const colWidths = [80, 200, 300, 150, 120, 180];
        let xPos = tableX + 20;
        
        headers.forEach((header, index) => {
            ctx.fillStyle = '#374151';
            ctx.font = '600 15px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(header, xPos, tableHeaderY + 35);
            xPos += colWidths[index];
        });
        
        // Table rows
        const users = [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
            { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Moderator', status: 'Active' }
        ];
        
        users.forEach((user, rowIndex) => {
            const rowY = tableHeaderY + 70 + (rowIndex * 70);
            drawRoundedRect(ctx, tableX, rowY, tableWidth, 60, 12, '#ffffff', '#e5e7eb', 1);
            
            xPos = tableX + 20;
            [user.id, user.name, user.email, user.role, user.status].forEach((cell, cellIndex) => {
                ctx.fillStyle = '#111827';
                ctx.font = '14px Arial';
                ctx.textAlign = 'left';
                ctx.fillText(cell.toString(), xPos, rowY + 35);
                xPos += colWidths[cellIndex];
            });
            
            // Action buttons - properly aligned
            const editRect = { x: xPos, y: rowY + 15, width: 70, height: 30 };
            const deleteRect = { x: xPos + 80, y: rowY + 15, width: 70, height: 30 };
            drawButton(ctx, editRect, 'Edit', false);
            drawButton(ctx, deleteRect, 'Delete', false);
            window[`_edit_${user.id}`] = editRect;
            window[`_delete_${user.id}`] = deleteRect;
        });
    };

    // Form content
    const renderFormContent = (ctx) => {
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('User Registration Form', content.x + 40, content.y + 50);
        
        const formX = content.x + 40;
        const formY = content.y + 100;
        const formWidth = content.width - 80;
        const inputWidth = (formWidth - 30) / 2;
        const inputHeight = 50;
        const rowSpacing = 70;
        
        // Form container
        drawRoundedRect(ctx, formX, formY, formWidth, 650, 16, '#ffffff', '#e5e7eb', 1);
        
        // First row: First Name, Last Name
        let currentY = formY + 40;
        ctx.fillStyle = '#374151';
        ctx.font = '500 13px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('First Name', formX + 30, currentY - 22);
        const firstNameRect = { x: formX + 30, y: currentY, width: inputWidth, height: inputHeight };
        drawInput(ctx, firstNameRect, formData.firstName, 'Enter first name', formActiveInput === 'firstName');
        window._form_firstName = firstNameRect;
        
        ctx.fillText('Last Name', formX + 30 + inputWidth + 30, currentY - 22);
        const lastNameRect = { x: formX + 30 + inputWidth + 30, y: currentY, width: inputWidth, height: inputHeight };
        drawInput(ctx, lastNameRect, formData.lastName, 'Enter last name', formActiveInput === 'lastName');
        window._form_lastName = lastNameRect;
        
        // Second row: Email, Phone
        currentY += rowSpacing;
        ctx.fillText('Email', formX + 30, currentY - 22);
        const emailRect = { x: formX + 30, y: currentY, width: inputWidth, height: inputHeight };
        drawInput(ctx, emailRect, formData.email, 'Enter email address', formActiveInput === 'email');
        window._form_email = emailRect;
        
        ctx.fillText('Phone', formX + 30 + inputWidth + 30, currentY - 22);
        const phoneRect = { x: formX + 30 + inputWidth + 30, y: currentY, width: inputWidth, height: inputHeight };
        drawInput(ctx, phoneRect, formData.phone, 'Enter phone number', formActiveInput === 'phone');
        window._form_phone = phoneRect;
        
        // Third row: Address
        currentY += rowSpacing;
        ctx.fillText('Address', formX + 30, currentY - 22);
        const addressRect = { x: formX + 30, y: currentY, width: formWidth - 60, height: inputHeight };
        drawInput(ctx, addressRect, formData.address, 'Enter street address', formActiveInput === 'address');
        window._form_address = addressRect;
        
        // Fourth row: City, Zip Code
        currentY += rowSpacing;
        ctx.fillText('City', formX + 30, currentY - 22);
        const cityRect = { x: formX + 30, y: currentY, width: inputWidth, height: inputHeight };
        drawInput(ctx, cityRect, formData.city, 'Enter city', formActiveInput === 'city');
        window._form_city = cityRect;
        
        ctx.fillText('Zip Code', formX + 30 + inputWidth + 30, currentY - 22);
        const zipCodeRect = { x: formX + 30 + inputWidth + 30, y: currentY, width: inputWidth, height: inputHeight };
        drawInput(ctx, zipCodeRect, formData.zipCode, 'Enter zip code', formActiveInput === 'zipCode');
        window._form_zipCode = zipCodeRect;
        
        // Fifth row: Country, Gender
        currentY += rowSpacing;
        ctx.fillText('Country', formX + 30, currentY - 22);
        const countryRect = { x: formX + 30, y: currentY, width: inputWidth, height: inputHeight };
        drawInput(ctx, countryRect, formData.country, 'Enter country', formActiveInput === 'country');
        window._form_country = countryRect;
        
        ctx.fillText('Gender', formX + 30 + inputWidth + 30, currentY - 22);
        const genderRect = { x: formX + 30 + inputWidth + 30, y: currentY, width: inputWidth, height: inputHeight };
        drawInput(ctx, genderRect, formData.gender, 'Male / Female / Other', formActiveInput === 'gender');
        window._form_gender = genderRect;
        
        // Sixth row: Date of Birth
        currentY += rowSpacing;
        ctx.fillText('Date of Birth', formX + 30, currentY - 22);
        const dobRect = { x: formX + 30, y: currentY, width: inputWidth, height: inputHeight };
        drawInput(ctx, dobRect, formData.dateOfBirth, 'YYYY-MM-DD', formActiveInput === 'dateOfBirth');
        window._form_dateOfBirth = dobRect;
        
        // Seventh row: Comments (textarea)
        currentY += rowSpacing;
        ctx.fillText('Comments', formX + 30, currentY - 22);
        const commentsRect = { x: formX + 30, y: currentY, width: formWidth - 60, height: 100 };
        drawInput(ctx, commentsRect, formData.comments, 'Enter any additional comments', formActiveInput === 'comments', true);
        window._form_comments = commentsRect;
        
        // Submit and Reset buttons
        currentY += 120;
        const submitButton = { x: formX + formWidth - 280, y: currentY, width: 120, height: 50 };
        const resetButton = { x: formX + formWidth - 140, y: currentY, width: 120, height: 50 };
        drawButton(ctx, submitButton, 'Submit', false, true);
        drawButton(ctx, resetButton, 'Reset', false);
        window._form_submit = submitButton;
        window._form_reset = resetButton;
    };

    // Settings content
    const renderSettingsContent = (ctx) => {
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 28px Arial';
        ctx.fillText('Settings', content.x + 40, content.y + 50);
        
        const settings = [
            { label: 'Profile Settings', y: 120 },
            { label: 'Notification Preferences', y: 220 },
            { label: 'Security Settings', y: 320 },
            { label: 'Privacy Settings', y: 420 }
        ];
        
        settings.forEach(setting => {
            drawRoundedRect(ctx, content.x + 40, content.y + setting.y, content.width - 80, 90, 16, '#ffffff', '#e5e7eb', 1);
            ctx.fillStyle = '#111827';
            ctx.font = '600 18px Arial';
            ctx.fillText(setting.label, content.x + 60, content.y + setting.y + 35);
            
            const toggleRect = { x: content.x + content.width - 200, y: content.y + setting.y + 25, width: 120, height: 40 };
            drawButton(ctx, toggleRect, 'Configure', false);
            window[`_setting_${setting.label.replace(' ', '_')}`] = toggleRect;
        });
    };

    // Reports content
    const renderReportsContent = (ctx) => {
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 28px Arial';
        ctx.fillText('Reports', content.x + 40, content.y + 50);
        
        const reports = [
            { name: 'Monthly Sales Report', date: '2024-01-15', size: '2.5 MB' },
            { name: 'User Activity Report', date: '2024-01-14', size: '1.8 MB' },
            { name: 'Financial Summary', date: '2024-01-13', size: '3.2 MB' },
            { name: 'System Performance', date: '2024-01-12', size: '1.5 MB' }
        ];
        
        reports.forEach((report, index) => {
            const y = content.y + 120 + (index * 110);
            drawRoundedRect(ctx, content.x + 40, y, content.width - 80, 90, 16, '#ffffff', '#e5e7eb', 1);
            
            ctx.fillStyle = '#111827';
            ctx.font = '600 18px Arial';
            ctx.fillText(report.name, content.x + 60, y + 30);
            
            ctx.fillStyle = '#6b7280';
            ctx.font = '14px Arial';
            ctx.fillText(`Date: ${report.date} | Size: ${report.size}`, content.x + 60, y + 60);
            
            const downloadRect = { x: content.x + content.width - 200, y: y + 25, width: 120, height: 40 };
            drawButton(ctx, downloadRect, 'Download', false);
            window[`_download_${index}`] = downloadRect;
        });
    };

    // Messages content
    const renderMessagesContent = (ctx) => {
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 28px Arial';
        ctx.fillText('Messages', content.x + 40, content.y + 50);
        
        notifications.forEach((notification, index) => {
            const y = content.y + 120 + (index * 100);
            drawRoundedRect(ctx, content.x + 40, y, content.width - 80, 80, 16, notification.read ? '#ffffff' : '#f0f9ff', '#e5e7eb', 1);
            
            ctx.fillStyle = '#111827';
            ctx.font = '600 16px Arial';
            ctx.fillText(notification.text, content.x + 60, y + 30);
            
            ctx.fillStyle = '#6b7280';
            ctx.font = '13px Arial';
            ctx.fillText(notification.time, content.x + 60, y + 55);
            
            if (!notification.read) {
                ctx.fillStyle = '#667eea';
                ctx.beginPath();
                ctx.arc(content.x + content.width - 100, y + 40, 8, 0, 2 * Math.PI);
                ctx.fill();
            }
        });
    };

    // Main render function
    const render = () => {
        const canvas = canvasRef.current;
        if (!canvas || CANVAS_WIDTH === 0 || CANVAS_HEIGHT === 0) return;
        
        // Handle high DPI displays to prevent blurriness
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = CANVAS_WIDTH;
        const displayHeight = CANVAS_HEIGHT;
        
        // Set actual size in memory (scaled for DPR)
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        
        // Scale the canvas back down using CSS
        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';
        
        // Scale the drawing context so everything draws at the correct size
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        // Clear canvas
        ctx.clearRect(0, 0, displayWidth, displayHeight);
        
        if (!isLoggedIn) {
            renderLoginForm(ctx);
        } else {
            renderDashboard(ctx);
        }
        
        // Render custom alert on top
        if (customAlert) {
            drawCustomAlert(ctx);
        }
    };

    // Handle canvas click
    const handleCanvasClick = (e) => {
        if (!canvasRef.current) return;
        
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // No need to scale since we're using CSS scaling
        const canvasX = x;
        const canvasY = y;
        
        if (!isLoggedIn) {
            if (isPointInRect(canvasX, canvasY, loginForm.usernameInput)) {
                setActiveInput('username');
                setInputText(username);
            } else if (isPointInRect(canvasX, canvasY, loginForm.passwordInput)) {
                setActiveInput('password');
                setInputText(password);
            } else if (isPointInRect(canvasX, canvasY, loginForm.loginButton)) {
                handleLogin();
                setActiveInput(null);
            } else {
                setActiveInput(null);
            }
        } else {
            // Menu clicks
            menuItems.forEach(item => {
                if (window[`_menu_${item.id}`] && isPointInRect(canvasX, canvasY, window[`_menu_${item.id}`])) {
                    setSelectedMenu(item.id);
                }
            });
            
            // Logout
            if (window._logoutButton && isPointInRect(canvasX, canvasY, window._logoutButton)) {
                handleLogout();
            }
            
            // Search
            if (window._searchInput && isPointInRect(canvasX, canvasY, window._searchInput)) {
                setActiveInput('search');
                setInputText('');
            }
            
            // Notifications
            if (window._notificationsButton && isPointInRect(canvasX, canvasY, window._notificationsButton)) {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            }
            
            // Custom alert OK button
            if (customAlert && window._alertOkButton && isPointInRect(canvasX, canvasY, window._alertOkButton)) {
                setCustomAlert(null);
                render();
                return;
            }
            
            // Quick action buttons
            if (window._action_Add_User && isPointInRect(canvasX, canvasY, window._action_Add_User)) {
                setCustomAlert({ message: 'Add User functionality clicked', type: 'info' });
            }
            if (window._action_View_Reports && isPointInRect(canvasX, canvasY, window._action_View_Reports)) {
                setSelectedMenu('reports');
            }
            if (window._action_Settings && isPointInRect(canvasX, canvasY, window._action_Settings)) {
                setSelectedMenu('settings');
            }
            if (window._action_Send_Email && isPointInRect(canvasX, canvasY, window._action_Send_Email)) {
                setCustomAlert({ message: 'Send Email functionality clicked', type: 'info' });
            }
            
            // User management buttons
            for (let i = 1; i <= 4; i++) {
                if (window[`_edit_${i}`] && isPointInRect(canvasX, canvasY, window[`_edit_${i}`])) {
                    setCustomAlert({ message: `Edit user ${i} clicked`, type: 'info' });
                }
                if (window[`_delete_${i}`] && isPointInRect(canvasX, canvasY, window[`_delete_${i}`])) {
                    setCustomAlert({ message: `Delete user ${i}? This action cannot be undone.`, type: 'warning' });
                }
            }
            
            // Settings buttons
            if (window._setting_Profile_Settings && isPointInRect(canvasX, canvasY, window._setting_Profile_Settings)) {
                setCustomAlert({ message: 'Profile Settings opened', type: 'success' });
            }
            if (window._setting_Notification_Preferences && isPointInRect(canvasX, canvasY, window._setting_Notification_Preferences)) {
                setCustomAlert({ message: 'Notification Preferences opened', type: 'success' });
            }
            if (window._setting_Security_Settings && isPointInRect(canvasX, canvasY, window._setting_Security_Settings)) {
                setCustomAlert({ message: 'Security Settings opened', type: 'success' });
            }
            if (window._setting_Privacy_Settings && isPointInRect(canvasX, canvasY, window._setting_Privacy_Settings)) {
                setCustomAlert({ message: 'Privacy Settings opened', type: 'success' });
            }
            
            // Report download buttons
            for (let i = 0; i < 4; i++) {
                if (window[`_download_${i}`] && isPointInRect(canvasX, canvasY, window[`_download_${i}`])) {
                    setCustomAlert({ message: `Report ${i + 1} download started`, type: 'success' });
                }
            }
            
            // Form inputs and buttons
            if (selectedMenu === 'form') {
                if (window._form_firstName && isPointInRect(canvasX, canvasY, window._form_firstName)) {
                    setFormActiveInput('firstName');
                    setInputText(formData.firstName);
                } else if (window._form_lastName && isPointInRect(canvasX, canvasY, window._form_lastName)) {
                    setFormActiveInput('lastName');
                    setInputText(formData.lastName);
                } else if (window._form_email && isPointInRect(canvasX, canvasY, window._form_email)) {
                    setFormActiveInput('email');
                    setInputText(formData.email);
                } else if (window._form_phone && isPointInRect(canvasX, canvasY, window._form_phone)) {
                    setFormActiveInput('phone');
                    setInputText(formData.phone);
                } else if (window._form_address && isPointInRect(canvasX, canvasY, window._form_address)) {
                    setFormActiveInput('address');
                    setInputText(formData.address);
                } else if (window._form_city && isPointInRect(canvasX, canvasY, window._form_city)) {
                    setFormActiveInput('city');
                    setInputText(formData.city);
                } else if (window._form_zipCode && isPointInRect(canvasX, canvasY, window._form_zipCode)) {
                    setFormActiveInput('zipCode');
                    setInputText(formData.zipCode);
                } else if (window._form_country && isPointInRect(canvasX, canvasY, window._form_country)) {
                    setFormActiveInput('country');
                    setInputText(formData.country);
                } else if (window._form_gender && isPointInRect(canvasX, canvasY, window._form_gender)) {
                    setFormActiveInput('gender');
                    setInputText(formData.gender);
                } else if (window._form_dateOfBirth && isPointInRect(canvasX, canvasY, window._form_dateOfBirth)) {
                    setFormActiveInput('dateOfBirth');
                    setInputText(formData.dateOfBirth);
                } else if (window._form_comments && isPointInRect(canvasX, canvasY, window._form_comments)) {
                    setFormActiveInput('comments');
                    setInputText(formData.comments);
                } else if (window._form_submit && isPointInRect(canvasX, canvasY, window._form_submit)) {
                    // Validate and submit
                    const requiredFields = ['firstName', 'lastName', 'email'];
                    const missingFields = requiredFields.filter(field => !formData[field]);
                    if (missingFields.length > 0) {
                        setCustomAlert({ message: `Please fill in: ${missingFields.join(', ')}`, type: 'warning' });
                    } else {
                        setCustomAlert({ message: 'Form submitted successfully!', type: 'success' });
                    }
                } else if (window._form_reset && isPointInRect(canvasX, canvasY, window._form_reset)) {
                    setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        address: '',
                        city: '',
                        zipCode: '',
                        country: '',
                        gender: '',
                        dateOfBirth: '',
                        comments: ''
                    });
                    setFormActiveInput(null);
                    setInputText('');
                    setCustomAlert({ message: 'Form reset successfully', type: 'info' });
                } else {
                    setFormActiveInput(null);
                }
            }
        }
        
        render();
    };

    // Handle keyboard input
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Handle login inputs
            if (activeInput && !isLoggedIn) {
                if (e.key === 'Enter' && activeInput) {
                    e.preventDefault();
                    if (activeInput === 'username') {
                        setActiveInput('password');
                        setInputText(password);
                    } else if (activeInput === 'password') {
                        handleLogin();
                    }
                    return;
                }
                
                if (e.key === 'Backspace') {
                    e.preventDefault();
                    setInputText(prev => {
                        const newText = prev.slice(0, -1);
                        if (activeInput === 'username') {
                            setUsername(newText);
                        } else if (activeInput === 'password') {
                            setPassword(newText);
                        }
                        return newText;
                    });
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    setActiveInput(null);
                    setInputText('');
                } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    setInputText(prev => {
                        const newText = prev + e.key;
                        if (activeInput === 'username') {
                            setUsername(newText);
                        } else if (activeInput === 'password') {
                            setPassword(newText);
                        }
                        return newText;
                    });
                }
            }
            
            // Handle form inputs
            if (formActiveInput && isLoggedIn && selectedMenu === 'form') {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    // Move to next field (simple implementation)
                    const fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode', 'country', 'gender', 'dateOfBirth', 'comments'];
                    const currentIndex = fields.indexOf(formActiveInput);
                    if (currentIndex < fields.length - 1) {
                        setFormActiveInput(fields[currentIndex + 1]);
                        setInputText(formData[fields[currentIndex + 1]]);
                    }
                    return;
                }
                
                if (e.key === 'Backspace') {
                    e.preventDefault();
                    setInputText(prev => {
                        const newText = prev.slice(0, -1);
                        setFormData(prevData => ({ ...prevData, [formActiveInput]: newText }));
                        return newText;
                    });
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    setFormActiveInput(null);
                    setInputText('');
                } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    setInputText(prev => {
                        const newText = prev + e.key;
                        setFormData(prevData => ({ ...prevData, [formActiveInput]: newText }));
                        return newText;
                    });
                }
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeInput, password, formActiveInput, formData, isLoggedIn, selectedMenu]);

    const handleLogin = () => {
        setLoginError('');
        if (username === 'Admin' && password === 'Admin') {
            setIsLoggedIn(true);
            setLoginError('');
            setActiveInput(null);
            setInputText('');
        } else {
            setLoginError('Invalid credentials. Please use Admin/Admin');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setPassword('');
        setSelectedMenu('dashboard');
        setActiveInput(null);
        setInputText('');
    };

    useEffect(() => {
        render();
    }, [isLoggedIn, username, password, loginError, activeInput, selectedMenu, notifications, inputText, canvasSize, customAlert, formData, formActiveInput]);

    return (
        <UploadStatusProvider>
            <div 
                ref={containerRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    margin: 0,
                    overflow: 'hidden'
                }}
            >
                <canvas
                    ref={canvasRef}
                    id="canvas-test-area"
                    onClick={handleCanvasClick}
                    style={{
                        cursor: 'pointer',
                        display: 'block',
                        width: '100%',
                        height: '100%'
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
                        zIndex: 1000,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.2s ease'
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
        </UploadStatusProvider>
    );
}

export function CanvasTestPage() {
    return <CanvasTestPageContent />;
}
