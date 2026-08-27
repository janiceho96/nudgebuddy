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
        <div style={{ padding: '1.2rem', background: '#fef2f2', border: '1.5px solid #f87171', borderRadius: '16px', margin: '0.8rem', color: '#991b1b', fontFamily: 'sans-serif' }}>
          <h3 style={{ margin: '0 0 0.4rem', fontSize: '0.95rem' }}>🌿 NudgeBuddy Sanctuary Recovery</h3>
          <p style={{ fontSize: '0.78rem', margin: '0 0 0.6rem 0', color: '#7f1d1d' }}>
            A temporary glitch was caught. Choose how you'd like to proceed:
          </p>
          {this.state.error && (
            <pre style={{ fontSize: '0.68rem', background: '#fee2e2', padding: '0.4rem 0.6rem', borderRadius: '8px', overflowX: 'auto', marginBottom: '0.75rem', whiteSpace: 'pre-wrap' }}>
              {this.state.error.message}
            </pre>
          )}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{ padding: '0.45rem 0.8rem', background: '#2d6a4f', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem' }}
            >
              🔄 Reload Sanctuary
            </button>
            <button
              onClick={() => {
                try { localStorage.removeItem('nudgebuddy_state_v1'); } catch {}
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{ padding: '0.45rem 0.8rem', background: '#ffffff', color: '#991b1b', border: '1px solid #f87171', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem' }}
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
