import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('NudgeBuddy ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '1.5rem', background: '#fef2f2', border: '2px solid #ef4444', borderRadius: '16px', margin: '1rem', color: '#991b1b', fontFamily: 'sans-serif' }}>
          <h3 style={{ margin: '0 0 0.5rem' }}>🌿 NudgeBuddy Sanctuary Notice</h3>
          <p style={{ fontSize: '0.85rem' }}>A minor glitch occurred. Click below to refresh your sanctuary:</p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{ padding: '0.4rem 0.8rem', background: '#2d6a4f', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            Reload Sanctuary
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
