import React from 'react';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
    const navigate = useNavigate();
    
    const testCategories = [
        {
            id: 'file-upload',
            title: '📁 File Upload Tests',
            description: 'Comprehensive file upload testing with 15 complex DOM scenarios',
            icon: '📁',
            color: '#667eea'
        },
        {
            id: 'autoheal',
            title: '🔄 Autoheal Tests',
            description: 'Test autohealing with dynamic position changes and text verification',
            icon: '🔄',
            color: '#f59e0b'
        },
        {
            id: 'canvas',
            title: '🎨 Canvas Tests',
            description: 'Interactive canvas testing with login flow and drawing capabilities',
            icon: '🎨',
            color: '#9c27b0'
        },
        {
            id: 'flutter-view',
            title: '🦋 Flutter View Tests',
            description: 'Test Flutter web view elements with Shadow DOM structure',
            icon: '🦋',
            color: '#00d4aa'
        },
        {
            id: 'form-input',
            title: '📝 Form Input Tests',
            description: 'Test various form inputs and validation scenarios',
            icon: '📝',
            color: '#48bb78',
            comingSoon: true
        },
        {
            id: 'button-click',
            title: '🖱️ Button Click Tests',
            description: 'Test button interactions and event handling',
            icon: '🖱️',
            color: '#ed8936',
            comingSoon: true
        },
        {
            id: 'dropdown-select',
            title: '📋 Dropdown & Select Tests',
            description: 'Test dropdown menus and select elements',
            icon: '📋',
            color: '#9f7aea',
            comingSoon: true
        },
        {
            id: 'drag-drop',
            title: '🎯 Drag & Drop Tests',
            description: 'Test drag and drop functionality',
            icon: '🎯',
            color: '#f56565',
            comingSoon: true
        },
        {
            id: 'modal-dialog',
            title: '💬 Modal & Dialog Tests',
            description: 'Test modal dialogs and popups',
            icon: '💬',
            color: '#4299e1',
            comingSoon: true
        }
    ];
    
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px 20px'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                background: 'white',
                borderRadius: '16px',
                padding: '40px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '50px',
                    paddingBottom: '30px',
                    borderBottom: '3px solid #667eea'
                }}>
                    <h1 style={{
                        fontSize: '3em',
                        color: '#333',
                        marginBottom: '15px',
                        fontWeight: 'bold'
                    }}>
                        🧪 Test Data Web Application
                    </h1>
                    <p style={{
                        fontSize: '1.2em',
                        color: '#666',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Comprehensive testing scenarios for various web components and interactions
                    </p>
                </div>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '25px',
                    marginTop: '40px'
                }}>
                    {testCategories.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => !category.comingSoon && navigate(`/test/${category.id}`)}
                            style={{
                                background: category.comingSoon ? '#f7fafc' : 'white',
                                border: `3px solid ${category.color}`,
                                borderRadius: '12px',
                                padding: '30px',
                                cursor: category.comingSoon ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                opacity: category.comingSoon ? 0.6 : 1,
                                boxShadow: category.comingSoon ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }}
                            onMouseEnter={(e) => {
                                if (!category.comingSoon) {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = `0 8px 24px ${category.color}40`;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!category.comingSoon) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                                }
                            }}
                        >
                            {category.comingSoon && (
                                <div style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: '#ffc107',
                                    color: '#333',
                                    padding: '5px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.8em',
                                    fontWeight: 'bold'
                                }}>
                                    Coming Soon
                                </div>
                            )}
                            
                            <div style={{
                                fontSize: '4em',
                                marginBottom: '20px',
                                textAlign: 'center'
                            }}>
                                {category.icon}
                            </div>
                            
                            <h2 style={{
                                fontSize: '1.5em',
                                color: '#333',
                                marginBottom: '15px',
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}>
                                {category.title}
                            </h2>
                            
                            <p style={{
                                color: '#666',
                                fontSize: '1em',
                                textAlign: 'center',
                                lineHeight: '1.6'
                            }}>
                                {category.description}
                            </p>
                            
                            {!category.comingSoon && (
                                <div style={{
                                    marginTop: '20px',
                                    textAlign: 'center'
                                }}>
                                    <button
                                        style={{
                                            background: category.color,
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px 30px',
                                            borderRadius: '8px',
                                            fontSize: '1em',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            boxShadow: `0 4px 12px ${category.color}60`
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                            e.currentTarget.style.boxShadow = `0 6px 16px ${category.color}80`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.boxShadow = `0 4px 12px ${category.color}60`;
                                        }}
                                    >
                                        Start Testing →
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                
                <div style={{
                    marginTop: '50px',
                    padding: '20px',
                    background: '#f7fafc',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <p style={{ color: '#666', margin: 0 }}>
                        💡 <strong>Tip:</strong> Select a test category above to begin testing various web component scenarios
                    </p>
                </div>
            </div>
        </div>
    );
}

