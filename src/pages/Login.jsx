import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = ({ onLoginSuccess, navigateTo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page animate__animated animate__fadeIn" style={{
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
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(200,162,74,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '400px',
        height: '400px',
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
              {/* Logo/Icon */}
              <div className="text-center mb-4">
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #C8A24A, #9E7C2F)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 10px 30px rgba(200,162,74,0.3)'
                }}>
                  <i className="bi bi-building fs-1" style={{ color: 'var(--charcoal-slate)' }}></i>
                </div>
                <h2 className="fw-bold" style={{ color: '#FFFFFF', marginBottom: '8px' }}>Welcome Back</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>Sign in to your Buildex account</p>
              </div>

              {error && (
                <div className="animate__animated animate__shakeX" style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  color: '#FCA5A5',
                  fontSize: '0.9rem'
                }}>
                  <i className="bi bi-exclamation-circle me-2"></i>{error}
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
                      e.target.style.borderColor = '#C8A24A';
                      e.target.style.boxShadow = '0 0 0 3px rgba(200,162,74,0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>

                {/* Password Field with Toggle */}
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                    <i className="bi bi-lock me-2"></i>Password
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        padding: '14px 50px 14px 16px',
                        color: '#FFFFFF',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#C8A24A';
                        e.target.style.boxShadow = '0 0 0 3px rgba(200,162,74,0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                        e.target.style.boxShadow = 'none';
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#C8A24A'}
                      onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} fs-5`}></i>
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-end mb-4">
                  <button
                    type="button"
                    onClick={() => navigateTo && navigateTo('forgot-password')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#C8A24A',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn w-100"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #C8A24A, #9E7C2F)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px',
                    color: 'var(--charcoal-slate)',
                    fontWeight: '700',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(200,162,74,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(200,162,74,0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(200,162,74,0.3)';
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="d-flex align-items-center my-4">
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                <span style={{ color: 'rgba(255,255,255,0.4)', padding: '0 16px', fontSize: '0.85rem' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '12px', fontSize: '0.95rem' }}>
                  Don't have an account?
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo && navigateTo('register')}
                  className="btn w-100"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    padding: '12px',
                    color: '#FFFFFF',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                    e.target.style.borderColor = '#C8A24A';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                  }}
                >
                  Create Account
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

export default Login;