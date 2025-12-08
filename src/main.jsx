import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'

console.log('main.jsx loaded');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
} else {
  console.log('Root element found, mounting React...');
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
    console.log('React mounted successfully');
  } catch (error) {
    console.error('Error mounting React:', error);
    rootElement.innerHTML = `<div style="padding: 20px; color: red; background: white;">
      <h1>Fatal Error</h1>
      <p>${error.message}</p>
      <pre>${error.stack}</pre>
    </div>`;
  }
}

