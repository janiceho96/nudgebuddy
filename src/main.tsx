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
        <div style={{ padding: '1.5rem', background: '#ffffff', border: '3px solid #121826', borderRadius: '16px', margin: '1rem', color: '#121826', fontFamily: 'sans-serif', boxShadow: '4px 4px 0px #121826' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>👾 NudgeBuddy Reset</h3>
          <p style={{ fontSize: '0.85rem', marginBottom: '0.8rem' }}>A minor glitch occurred. Click below to refresh:</p>
          {this.state.error && (
            <pre style={{ fontSize: '0.72rem', background: '#f1f5f9', padding: '0.5rem', borderRadius: '8px', overflowX: 'auto', marginBottom: '0.8rem', whiteSpace: 'pre-wrap' }}>
              {this.state.error.message}
            </pre>
          )}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{ padding: '0.5rem 1rem', background: '#121826', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}
            >
              🔄 Reload App
            </button>
            <button
              onClick={() => {
                try { localStorage.removeItem('nudgebuddy_state_v1'); } catch {}
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{ padding: '0.5rem 1rem', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}
            >
              🧹 Clear Cache & Reset
            </button>
          </div>
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
