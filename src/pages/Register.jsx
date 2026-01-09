import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Register = ({ onRegisterSuccess, navigateTo }) => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const { register, verifyOtp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!showOtp) {
        // Step 1: Register (Initiate)
        const result = await register(username, email, password, fullName, phone, role);
        if (result.success) {
          if (result.requiresOtp) {
            setShowOtp(true);
            setLoading(false);
          } else {
            onRegisterSuccess(result.user);
          }
        } else {
          setError(result.message);
          setLoading(false);
        }
      } else {
        // Step 2: Verify OTP
        const result = await verifyOtp(email, otp);
        if (result.success) {
          onRegisterSuccess(result.user);
        } else {
          setError(result.message || 'Invalid OTP');
          setLoading(false);
        }
      }
    } catch (err) {
      setError('Failed to register. Please try again.');
      setLoading(false);
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '14px 16px',
    color: 'var(--primary-text)',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease'
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#C8A24A';
    e.target.style.boxShadow = '0 0 0 3px rgba(200,162,74,0.1)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="register-page animate__animated animate__fadeIn" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--charcoal-slate) 0%, var(--card-bg) 50%, var(--charcoal-slate) 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '40px 0'
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'absolute',
        top: '5%',
        right: '5%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(200,162,74,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '5%',
        left: '5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
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
                  background: 'linear-gradient(135deg, #C8A24A, #9E7C2F)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 10px 30px rgba(200,162,74,0.3)'
                }}>
                  <i className="bi bi-person-plus fs-1" style={{ color: 'var(--charcoal-slate)' }}></i>
                </div>
                <h2 className="fw-bold" style={{ color: '#FFFFFF', marginBottom: '8px' }}>Create Account</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>Join Buildex today</p>
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
                <div className="row">
                  {/* Username */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                      <i className="bi bi-person me-2"></i>Username *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose username"
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      required
                    />
                  </div>

                  {/* Full Name */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                      <i className="bi bi-person-badge me-2"></i>Full Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                    <i className="bi bi-envelope me-2"></i>Email Address *
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                    <i className="bi bi-phone me-2"></i>Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                <div className="row">
                  {/* Password */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                      <i className="bi bi-lock me-2"></i>Password *
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        style={{ ...inputStyle, paddingRight: '45px' }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
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
                          cursor: 'pointer'
                        }}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                      <i className="bi bi-lock-fill me-2"></i>Confirm *
                    </label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        style={{ ...inputStyle, paddingRight: '45px' }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'transparent',
                          border: 'none',
                          color: 'rgba(255,255,255,0.5)',
                          cursor: 'pointer'
                        }}
                      >
                        <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Account Type */}
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                    <i className="bi bi-person-gear me-2"></i>Account Type
                  </label>
                  <div className="d-flex gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('user')}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '12px',
                        border: role === 'user' ? '2px solid #C8A24A' : '1px solid rgba(255,255,255,0.1)',
                        background: role === 'user' ? 'rgba(200,162,74,0.1)' : 'rgba(255,255,255,0.03)',
                        color: role === 'user' ? '#C8A24A' : 'rgba(255,255,255,0.7)',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                    >
                      <i className="bi bi-person me-2"></i>Regular User
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('builder')}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '12px',
                        border: role === 'builder' ? '2px solid #C8A24A' : '1px solid rgba(255,255,255,0.1)',
                        background: role === 'builder' ? 'rgba(200,162,74,0.1)' : 'rgba(255,255,255,0.03)',
                        color: role === 'builder' ? '#C8A24A' : 'rgba(255,255,255,0.7)',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                    >
                      <i className="bi bi-building me-2"></i>Builder/Owner
                    </button>
                  </div>
                </div>

                {/* OTP Input - Only show if showOtp is true */}
                {showOtp && (
                  <div className="mb-4 animate__animated animate__fadeIn">
                    <label className="form-label fw-semibold" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                      <i className="bi bi-shield-lock me-2"></i>Enter OTP sent to email
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      style={{ ...inputStyle, textAlign: 'center', letterSpacing: '5px', fontSize: '1.2rem' }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      maxLength={6}
                      required={showOtp}
                    />
                  </div>
                )}

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
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : (
                    <>
                      {showOtp ? (
                        <><i className="bi bi-check-circle me-2"></i>Verify & Register</>
                      ) : (
                        <><i className="bi bi-person-plus me-2"></i>Create Account</>
                      )}
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

              {/* Login Link */}
              <div className="text-center">
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '12px', fontSize: '0.95rem' }}>
                  Already have an account?
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo && navigateTo('login')}
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
                  Sign In Instead
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

export default Register;