import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { FileUploadTestPage } from './pages/FileUploadTestPage';
import { AutohealTestPage } from './pages/AutohealTestPage';
import { CanvasTestPage } from './pages/CanvasTestPage';
import { FlutterViewTestPage } from './pages/FlutterViewTestPage';
import { EventListenerOverrideTestPage } from './pages/EventListenerOverrideTestPage';
import IframeShadowDOMTestPage from './pages/IframeShadowDOMTestPage';
import { GeolocationTestPage } from './pages/GeolocationTestPage';
import { ExplicitWaitTestPage } from './pages/ExplicitWaitTestPage';
import { DynamicPositionTestPage } from './pages/DynamicPositionTestPage';
import { NestedStructuresTestPage } from './pages/NestedStructuresTestPage';
import { NestedStructuresDynamicPage } from './pages/NestedStructuresDynamicPage';
import NestedShadowDOMPage from './pages/NestedShadowDOMPage';
import { CompleteCanvasPage } from './pages/CompleteCanvasPage';
import { BrowserDialogsTestPage } from './pages/BrowserDialogsTestPage';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
    console.log('App component rendering...');
    
    try {
        return (
            <ErrorBoundary>
                <Router>
                    <Routes>
                        <Route path="/" element={<ErrorBoundary><HomePage /></ErrorBoundary>} />
                        <Route path="/test/file-upload" element={<ErrorBoundary><FileUploadTestPage /></ErrorBoundary>} />
                        <Route path="/test/autoheal" element={<ErrorBoundary><AutohealTestPage /></ErrorBoundary>} />
                        <Route path="/test/canvas" element={<ErrorBoundary><CanvasTestPage /></ErrorBoundary>} />
                        <Route path="/test/flutter-view" element={<ErrorBoundary><FlutterViewTestPage /></ErrorBoundary>} />
                        <Route path="/test/event-listener-override" element={<ErrorBoundary><EventListenerOverrideTestPage /></ErrorBoundary>} />
                        <Route path="/test/iframe-shadow-dom" element={<ErrorBoundary><IframeShadowDOMTestPage /></ErrorBoundary>} />
                        <Route path="/test/geolocation" element={<ErrorBoundary><GeolocationTestPage /></ErrorBoundary>} />
                        <Route path="/test/explicit-wait" element={<ErrorBoundary><ExplicitWaitTestPage /></ErrorBoundary>} />
                        <Route path="/test/dynamic-position" element={<ErrorBoundary><DynamicPositionTestPage /></ErrorBoundary>} />
                        <Route path="/test/nested-structures" element={<ErrorBoundary><NestedStructuresTestPage /></ErrorBoundary>} />
                        <Route path="/test/nested-structures-dynamic" element={<ErrorBoundary><NestedStructuresDynamicPage /></ErrorBoundary>} />
                        <Route path="/test/nested-shadow-dom" element={<ErrorBoundary><NestedShadowDOMPage /></ErrorBoundary>} />
                        <Route path="/test/complete-canvas" element={<ErrorBoundary><CompleteCanvasPage /></ErrorBoundary>} />
                        <Route path="/test/browser-dialogs" element={<ErrorBoundary><BrowserDialogsTestPage /></ErrorBoundary>} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </ErrorBoundary>
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

