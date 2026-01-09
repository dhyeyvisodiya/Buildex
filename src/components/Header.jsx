import React, { useState } from 'react';

const Header = ({ currentPage, navigateTo, compareCount, wishlistCount, currentUser, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="shadow-sm" style={{
      backgroundColor: '#0A1B2E',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '8px 0',
      animation: 'fadeInDown 0.5s ease'
    }}>
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            <button
              className="navbar-brand btn btn-link text-decoration-none d-flex align-items-center"
              onClick={() => navigateTo('home')}
              style={{
                transition: 'all 0.3s ease',
                padding: '0'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img
                src="/images/buildex.png"
                alt="Buildex Logo"
                style={{
                  height: '55px',
                  width: 'auto',
                  marginRight: '12px',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2)) brightness(1.1)'
                }}
              />
              <div className="d-flex flex-column align-items-start">
                <h2 className="mb-0" style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '1.3rem' }}>Buildex</h2>
                <small className="d-none d-md-block" style={{ fontSize: '0.75rem', color: '#C8A24A', lineHeight: '1', fontWeight: '600' }}>Verified New Schemes & Smart Rental</small>
              </div>
            </button>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}
            >
              <span className="navbar-toggler-icon" style={{
                backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.9%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\")"
              }}></span>
            </button>

            <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-decoration-none ${currentPage === 'home' ? 'fw-bold' : ''}`}
                    style={{
                      color: currentPage === 'home' ? '#C8A24A' : 'rgba(255, 255, 255, 0.9)',
                      position: 'relative',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => { navigateTo('home'); setIsMenuOpen(false); }}
                    onMouseEnter={(e) => e.target.style.color = '#C8A24A'}
                    onMouseLeave={(e) => e.target.style.color = currentPage === 'home' ? '#C8A24A' : 'rgba(255, 255, 255, 0.9)'}
                  >
                    Home
                    {currentPage === 'home' && (
                      <span style={{
                        position: 'absolute',
                        bottom: '-5px',
                        left: '0',
                        right: '0',
                        height: '3px',
                        backgroundColor: '#C8A24A',
                        borderRadius: '3px',
                        animation: 'expandWidth 0.3s ease'
                      }}></span>
                    )}
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-decoration-none ${currentPage === 'property-list' ? 'fw-bold' : ''}`}
                    style={{
                      color: currentPage === 'property-list' ? '#C8A24A' : 'rgba(255, 255, 255, 0.9)',
                      position: 'relative',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => { navigateTo('property-list'); setIsMenuOpen(false); }}
                    onMouseEnter={(e) => e.target.style.color = '#C8A24A'}
                    onMouseLeave={(e) => e.target.style.color = currentPage === 'property-list' ? '#C8A24A' : 'rgba(255, 255, 255, 0.9)'}
                  >
                    Properties
                    {currentPage === 'property-list' && (
                      <span style={{
                        position: 'absolute',
                        bottom: '-5px',
                        left: '0',
                        right: '0',
                        height: '3px',
                        backgroundColor: '#C8A24A',
                        borderRadius: '3px',
                        animation: 'expandWidth 0.3s ease'
                      }}></span>
                    )}
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-decoration-none ${currentPage === 'compare' ? 'fw-bold' : ''}`}
                    style={{
                      color: currentPage === 'compare' ? '#C8A24A' : 'rgba(255, 255, 255, 0.9)',
                      position: 'relative',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => { navigateTo('compare'); setIsMenuOpen(false); }}
                    onMouseEnter={(e) => e.target.style.color = '#C8A24A'}
                    onMouseLeave={(e) => e.target.style.color = currentPage === 'compare' ? '#C8A24A' : 'rgba(255, 255, 255, 0.9)'}
                  >
                    Compare {compareCount > 0 && <span className="badge bg-primary" style={{ backgroundColor: '#C8A24A' }}>{compareCount}</span>}
                    {currentPage === 'compare' && (
                      <span style={{
                        position: 'absolute',
                        bottom: '-5px',
                        left: '0',
                        right: '0',
                        height: '3px',
                        backgroundColor: '#C8A24A',
                        borderRadius: '3px',
                        animation: 'expandWidth 0.3s ease'
                      }}></span>
                    )}
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-decoration-none ${currentPage === 'wishlist' ? 'fw-bold' : ''}`}
                    style={{
                      color: currentPage === 'wishlist' ? '#C8A24A' : 'rgba(255, 255, 255, 0.9)',
                      position: 'relative',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => { navigateTo('wishlist'); setIsMenuOpen(false); }}
                    onMouseEnter={(e) => e.target.style.color = '#C8A24A'}
                    onMouseLeave={(e) => e.target.style.color = currentPage === 'wishlist' ? '#C8A24A' : 'rgba(255, 255, 255, 0.9)'}
                  >
                    Wishlist {wishlistCount > 0 && <span className="badge bg-primary" style={{ backgroundColor: '#C8A24A' }}>{wishlistCount}</span>}
                    {currentPage === 'wishlist' && (
                      <span style={{
                        position: 'absolute',
                        bottom: '-5px',
                        left: '0',
                        right: '0',
                        height: '3px',
                        backgroundColor: '#C8A24A',
                        borderRadius: '3px',
                        animation: 'expandWidth 0.3s ease'
                      }}></span>
                    )}
                  </button>
                </li>
              </ul>

              <ul className="navbar-nav">
                {currentUser ? (
                  // User is logged in
                  <li className="nav-item dropdown">
                    <button
                      className="nav-link dropdown-toggle btn btn-link text-decoration-none d-flex align-items-center"
                      data-bs-toggle="dropdown"
                      style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                    >
                      <i className="bi bi-person-circle me-1"></i>
                      <span className="ms-1">{currentUser.fullName || currentUser.username || currentUser.email.split('@')[0]}</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end animate__animated animate__fadeIn">
                      <li className="dropdown-header">
                        Signed in as<br />
                        <strong>{currentUser.fullName || currentUser.username || currentUser.email}</strong>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            if (currentUser.role === 'admin') {
                              navigateTo('admin-dashboard');
                            } else if (currentUser.role === 'builder') {
                              navigateTo('builder-dashboard');
                            } else {
                              navigateTo('user-dashboard');
                            }
                            setIsMenuOpen(false);
                          }}
                          style={{ transition: 'all 0.2s ease' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <i className="bi bi-speedometer2 me-2"></i>
                          Dashboard
                        </button>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => { onLogout(); setIsMenuOpen(false); }}
                          style={{ transition: 'all 0.2s ease' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <i className="bi bi-box-arrow-right me-2"></i>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                ) : (
                  // User is not logged in
                  <>
                    <li className="nav-item">
                      <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => navigateTo('login')}
                        style={{
                          border: '1px solid #FFFFFF',
                          color: '#FFFFFF',
                          background: 'transparent',
                          borderRadius: '8px',
                          fontWeight: '600',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        Login
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="btn btn-primary"
                        onClick={() => navigateTo('register')}
                        style={{
                          background: '#C8A24A',
                          border: 'none',
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          height: '40px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#9E7C2F';
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(200, 162, 74, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#C8A24A';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        Register
                      </button>
                    </li>
                  </>
                )}

                {/* Dashboards dropdown - only shown when user is logged in and is admin */}

              </ul>
            </div>
          </div>
        </nav>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;