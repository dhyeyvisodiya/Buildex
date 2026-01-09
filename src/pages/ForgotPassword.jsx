import React, { useState } from 'react';

const ForgotPassword = ({ navigateTo }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setMessage({ type: 'error', text: 'Please enter your email address' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage({ type: 'error', text: 'Please enter a valid email address' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setMessage({
                type: 'success',
                text: 'If an account exists with this email, you will receive password reset instructions.'
            });
        }, 1500);
    };

    return (
        <div className="forgot-password-page animate__animated animate__fadeIn" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--charcoal-slate) 0%, var(--card-bg) 50%, var(--charcoal-slate) 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background decorations */}
            <div style={{
                position: 'absolute',
                top: '15%',
                left: '10%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(200,162,74,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 6s ease-in-out infinite'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '15%',
                right: '10%',
                width: '350px',
                height: '350px',
                background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 8s ease-in-out infinite reverse'
            }} />

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5 col-lg-4">
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '24px',
                            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            padding: '40px',
                            position: 'relative'
                        }}>
                            {/* Header */}
                            <div className="text-center mb-4">
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                                    borderRadius: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px',
                                    boxShadow: '0 10px 30px rgba(59,130,246,0.3)'
                                }}>
                                    <i className="bi bi-key fs-1" style={{ color: '#FFFFFF' }}></i>
                                </div>
                                <h2 className="fw-bold" style={{ color: '#FFFFFF', marginBottom: '8px' }}>Forgot Password?</h2>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
                                    No worries, we'll send you reset instructions
                                </p>
                            </div>

                            {/* Messages */}
                            {message.text && (
                                <div className="animate__animated animate__fadeIn" style={{
                                    background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                    borderRadius: '12px',
                                    padding: '12px 16px',
                                    marginBottom: '20px',
                                    color: message.type === 'success' ? '#6EE7B7' : '#FCA5A5',
                                    fontSize: '0.9rem'
                                }}>
                                    <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2`}></i>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Email Field */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                                        <i className="bi bi-envelope me-2"></i>Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            padding: '14px 16px',
                                            color: 'var(--primary-text)',
                                            fontSize: '0.95rem',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#3B82F6';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="btn w-100"
                                    disabled={loading}
                                    style={{
                                        background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '14px',
                                        color: '#FFFFFF',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 15px rgba(59,130,246,0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading) {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 8px 25px rgba(59,130,246,0.4)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(59,130,246,0.3)';
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-send me-2"></i>Send Reset Link
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Back to Login */}
                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={() => navigateTo && navigateTo('login')}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'rgba(255,255,255,0.7)',
                                        fontSize: '0.95rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        margin: '0 auto',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = '#C8A24A'}
                                    onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}
                                >
                                    <i className="bi bi-arrow-left"></i>
                                    Back to Sign In
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .form-control::placeholder {
          color: rgba(255,255,255,0.3);
        }
      `}</style>
        </div>
    );
};

export default ForgotPassword;
