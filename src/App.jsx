import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { FileUploadTestPage } from './pages/FileUploadTestPage';

function App() {
    console.log('App component rendering...');
    
    try {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/test/file-upload" element={<FileUploadTestPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        );
    } catch (error) {
        console.error('Error in App component:', error);
        return (
            <div style={{ padding: '20px', color: 'red', background: 'white' }}>
                <h1>Error Loading App</h1>
                <p>{error.message}</p>
                <pre>{error.stack}</pre>
            </div>
        );
    }
}

export default App;

