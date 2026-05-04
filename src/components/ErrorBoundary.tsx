import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
          <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
            <h1 className="text-2xl font-bold text-red-700">
              Something went wrong
            </h1>
            <p className="mt-3 text-slate-600">
              The application encountered an unexpected error.
            </p>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
