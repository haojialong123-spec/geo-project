import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- Error Boundary Component ---
// This prevents the "White Screen of Death" by catching errors in the component tree.
interface Props {
  children?: ReactNode;
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
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
          <h1 style={{ color: '#e11d48' }}>系统启动出错 (Runtime Error)</h1>
          <p>请截图联系开发者或检查控制台(F12)日志。</p>
          <div style={{ 
            backgroundColor: '#f1f5f9', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'left', 
            marginTop: '20px',
            overflow: 'auto',
            maxHeight: '300px'
          }}>
            <code style={{ color: '#475569' }}>
              {this.state.error?.toString()}
            </code>
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#0f172a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            刷新页面
          </button>
        </div>
      );
    }

    // Use type assertion to avoid "Property 'props' does not exist on type 'ErrorBoundary'" error
    return (this as any).props.children;
  }
}

// --- Mount Application ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);