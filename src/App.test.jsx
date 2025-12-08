// Temporary test file to check if React is working
import React from 'react';

export default function AppTest() {
    console.log('AppTest rendering');
    return (
        <div style={{ padding: '20px', background: 'white', color: 'black' }}>
            <h1>✅ React is Working!</h1>
            <p>If you see this, React is mounting correctly.</p>
        </div>
    );
}

