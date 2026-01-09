import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null 
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, var(--charcoal-slate) 0%, #1E293B 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6">
                <div className="card animate__animated animate__fadeIn" style={{ 
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                  border: '1px solid var(--card-border)',
                  backgroundColor: 'var(--card-bg)'
                }}>
                  <div className="card-body p-5 text-center">
                    {/* Error Icon */}
                    <div className="mb-4">
                      <i className="bi bi-exclamation-triangle-fill" style={{ 
                        fontSize: '5rem', 
                        color: '#EF4444',
                        filter: 'drop-shadow(0 4px 8px rgba(239, 68, 68, 0.3))'
                      }}></i>
                    </div>

                    {/* Error Message */}
                    <h2 style={{ 
                      color: 'var(--primary-text)', 
                      fontWeight: '700',
                      marginBottom: '1rem' 
                    }}>
                      Oops! Something went wrong
                    </h2>
                    <p style={{ 
                      color: 'var(--muted-text)', 
                      fontSize: '1rem',
                      marginBottom: '1.5rem',
                      lineHeight: '1.6'
                    }}>
                      We're sorry for the inconvenience. An unexpected error has occurred. 
                      Our team has been notified and is working to fix the issue.
                    </p>

                    {/* Error Details (only in development) */}
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                      <div className="alert alert-danger text-start mb-4" style={{ 
                        borderRadius: '8px',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        color: '#991B1B'
                      }}>
                        <h6 className="alert-heading" style={{ fontWeight: '600' }}>Error Details:</h6>
                        <p className="mb-2" style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
                          {this.state.error.toString()}
                        </p>
                        {this.state.errorInfo && (
                          <details style={{ fontSize: '0.8rem' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '0.5rem' }}>
                              Stack Trace
                            </summary>
                            <pre style={{ 
                              whiteSpace: 'pre-wrap', 
                              fontSize: '0.75rem',
                              backgroundColor: '#FEE2E2',
                              padding: '10px',
                              borderRadius: '4px',
                              maxHeight: '200px',
                              overflow: 'auto'
                            }}>
                              {this.state.errorInfo.componentStack}
                            </pre>
                          </details>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-center gap-3">
                      <button 
                        className="btn btn-primary"
                        onClick={this.handleReset}
                        style={{
                          background: 'linear-gradient(90deg, var(--construction-gold), var(--deep-bronze))',
                          border: 'none',
                          color: 'var(--primary-text)',
                          borderRadius: '8px',
                          fontWeight: '600',
                          padding: '12px 30px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'var(--deep-bronze)';
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 6px 16px rgba(158, 124, 47, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'linear-gradient(90deg, var(--construction-gold), var(--deep-bronze))';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <i className="bi bi-house-door-fill me-2"></i>
                        Go to Home
                      </button>
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => window.location.reload()}
                        style={{
                          border: '1px solid var(--section-divider)',
                          color: 'var(--secondary-text)',
                          borderRadius: '8px',
                          fontWeight: '600',
                          padding: '12px 30px',
                          transition: 'all 0.3s ease',
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'var(--off-white)';
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Reload Page
                      </button>
                    </div>

                    {/* Support Info */}
                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--card-border)' }}>
                      <p style={{ 
                        color: 'var(--muted-text)', 
                        fontSize: '0.85rem',
                        marginBottom: '0.5rem'
                      }}>
                        Need help? Contact our support team:
                      </p>
                      <div className="d-flex justify-content-center gap-3">
                        <a href="mailto:support@buildex.com" className="text-decoration-none" style={{ 
                          color: 'var(--construction-gold)',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease'
                        }}
                          onMouseEnter={(e) => e.target.style.color = 'var(--deep-bronze)'}
                          onMouseLeave={(e) => e.target.style.color = 'var(--construction-gold)'}
                        >
                          <i className="bi bi-envelope-fill me-1"></i>
                          support@buildex.com
                        </a>
                        <span style={{ color: 'var(--section-divider)' }}>|</span>
                        <a href="tel:+911800123567" className="text-decoration-none" style={{ 
                          color: 'var(--construction-gold)',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease'
                        }}
                          onMouseEnter={(e) => e.target.style.color = 'var(--deep-bronze)'}
                          onMouseLeave={(e) => e.target.style.color = 'var(--construction-gold)'}
                        >
                          <i className="bi bi-telephone-fill me-1"></i>
                          1800-123-4567
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
