import React from 'react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ 
                    padding: '20px', 
                    margin: '20px', 
                    background: 'white', 
                    border: '2px solid red',
                    borderRadius: '8px'
                }}>
                    <h1 style={{ color: 'red' }}>⚠️ Error Loading Application</h1>
                    <h2>{this.state.error && this.state.error.toString()}</h2>
                    <details style={{ marginTop: '10px' }}>
                        <summary>Error Details</summary>
                        <pre style={{ 
                            background: '#f5f5f5', 
                            padding: '10px', 
                            overflow: 'auto',
                            maxHeight: '400px'
                        }}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

