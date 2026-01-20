import React, { useState } from 'react';

export function ModalDialogTestPage() {
    const [activeModal, setActiveModal] = useState(null);
    const [lastAction, setLastAction] = useState('No actions yet');
    const [formValues, setFormValues] = useState({ name: '', email: '' });

    const openModal = (modalKey, actionText) => {
        setActiveModal(modalKey);
        setLastAction(actionText);
    };

    const closeModal = (actionText) => {
        setActiveModal(null);
        if (actionText) {
            setLastAction(actionText);
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setLastAction(`Form submitted: ${formValues.name || 'N/A'} / ${formValues.email || 'N/A'}`);
        setActiveModal(null);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
                <h1 style={{ color: '#111827', marginBottom: '10px' }}>💬 Modal Test Page</h1>
                <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                    Five modal dialogs for UI testing.
                </p>

                <div style={{ marginBottom: '20px', padding: '12px 16px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <strong>Last action:</strong> {lastAction}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                        <h2 style={{ marginTop: 0, color: '#4f46e5' }}>Modals (5)</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button style={buttonStyle} onClick={() => openModal('basic', 'Opened basic modal')}>Basic Modal</button>
                            <button style={buttonStyle} onClick={() => openModal('confirm', 'Opened confirm modal')}>Confirm Modal</button>
                            <button style={buttonStyle} onClick={() => openModal('form', 'Opened form modal')}>Form Modal</button>
                            <button style={buttonStyle} onClick={() => openModal('image', 'Opened image modal')}>Image Modal</button>
                            <button style={buttonStyle} onClick={() => openModal('scroll', 'Opened scroll modal')}>Scrollable Modal</button>
                        </div>
                    </div>
                </div>
            </div>

            {activeModal && (
                <div style={modalOverlayStyle} onClick={() => closeModal('Modal dismissed')}>
                    <div style={modalCardStyle} onClick={(event) => event.stopPropagation()}>
                        {activeModal === 'basic' && (
                            <>
                                <h3 style={{ marginTop: 0 }}>Basic Modal</h3>
                                <p>This is a simple modal dialog.</p>
                                <div style={modalActionsStyle}>
                                    <button style={secondaryButtonStyle} onClick={() => closeModal('Basic modal closed')}>Close</button>
                                </div>
                            </>
                        )}

                        {activeModal === 'confirm' && (
                            <>
                                <h3 style={{ marginTop: 0 }}>Confirm Modal</h3>
                                <p>Do you want to proceed with this action?</p>
                                <div style={modalActionsStyle}>
                                    <button style={secondaryButtonStyle} onClick={() => closeModal('Confirm modal cancelled')}>Cancel</button>
                                    <button style={primaryButtonStyle} onClick={() => closeModal('Confirm modal accepted')}>Confirm</button>
                                </div>
                            </>
                        )}

                        {activeModal === 'form' && (
                            <>
                                <h3 style={{ marginTop: 0 }}>Form Modal</h3>
                                <form onSubmit={handleFormSubmit}>
                                    <label style={formLabelStyle}>
                                        Name
                                        <input
                                            style={inputStyle}
                                            value={formValues.name}
                                            onChange={(event) => setFormValues((prev) => ({ ...prev, name: event.target.value }))}
                                            placeholder="Enter a name"
                                        />
                                    </label>
                                    <label style={formLabelStyle}>
                                        Email
                                        <input
                                            style={inputStyle}
                                            value={formValues.email}
                                            onChange={(event) => setFormValues((prev) => ({ ...prev, email: event.target.value }))}
                                            placeholder="name@example.com"
                                        />
                                    </label>
                                    <div style={modalActionsStyle}>
                                        <button type="button" style={secondaryButtonStyle} onClick={() => closeModal('Form modal cancelled')}>Cancel</button>
                                        <button type="submit" style={primaryButtonStyle}>Save</button>
                                    </div>
                                </form>
                            </>
                        )}

                        {activeModal === 'image' && (
                            <>
                                <h3 style={{ marginTop: 0 }}>Image Modal</h3>
                                <div style={{ height: '180px', borderRadius: '8px', background: 'linear-gradient(135deg, #4f46e5, #9333ea)' }} />
                                <p style={{ marginTop: '12px' }}>Use this for image preview or media details.</p>
                                <div style={modalActionsStyle}>
                                    <button style={primaryButtonStyle} onClick={() => closeModal('Image modal closed')}>Got it</button>
                                </div>
                            </>
                        )}

                        {activeModal === 'scroll' && (
                            <>
                                <h3 style={{ marginTop: 0 }}>Scrollable Modal</h3>
                                <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '8px' }}>
                                    <p>Long content for scrolling.</p>
                                    <p>Section 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                    <p>Section 2: Integer nec odio. Praesent libero. Sed cursus ante dapibus.</p>
                                    <p>Section 3: Sed nisi. Nulla quis sem at nibh elementum imperdiet.</p>
                                    <p>Section 4: Duis sagittis ipsum. Praesent mauris. Fusce nec tellus.</p>
                                    <p>Section 5: Donec sodales sagittis magna. Sed consequat, leo eget bibendum.</p>
                                    <p>Section 6: Aenean commodo ligula eget dolor. Aenean massa.</p>
                                </div>
                                <div style={modalActionsStyle}>
                                    <button style={secondaryButtonStyle} onClick={() => closeModal('Scrollable modal closed')}>Close</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

const buttonStyle = {
    padding: '12px 18px',
    borderRadius: '8px',
    border: 'none',
    background: '#4f46e5',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'left'
};

const modalOverlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    zIndex: 2000
};

const modalCardStyle = {
    width: '100%',
    maxWidth: '520px',
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)'
};

const modalActionsStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
};

const primaryButtonStyle = {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    background: '#4f46e5',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer'
};

const secondaryButtonStyle = {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #cbd5f5',
    background: '#eef2ff',
    color: '#3730a3',
    fontWeight: '600',
    cursor: 'pointer'
};

const formLabelStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '12px',
    fontSize: '14px',
    color: '#374151'
};

const inputStyle = {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '14px'
};
