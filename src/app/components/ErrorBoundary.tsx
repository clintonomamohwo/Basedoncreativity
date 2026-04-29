import { Component, ReactNode } from 'react';
import { COLORS, FONTS } from '../../lib/constants';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="min-h-screen flex items-center justify-center px-6"
          style={{ background: '#1A1F4B' }}
        >
          <div className="max-w-lg text-center">
            <div
              className="mb-6"
              style={{
                fontFamily: FONTS.heading,
                fontSize: 'clamp(2rem, 8vw, 3rem)',
                color: COLORS.gold,
                fontWeight: 700,
              }}
            >
              Something went wrong
            </div>
            <p
              className="mb-8"
              style={{
                fontFamily: FONTS.body,
                fontSize: '1.125rem',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.6,
              }}
            >
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre
                className="mb-8 p-4 rounded text-left overflow-auto"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  color: COLORS.gold,
                  fontSize: '0.875rem',
                  maxHeight: '200px',
                }}
              >
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-lg"
              style={{
                background: COLORS.gold,
                color: '#0A1628',
                fontFamily: FONTS.heading,
                fontWeight: 700,
                fontSize: '0.875rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
