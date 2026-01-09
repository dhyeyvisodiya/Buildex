import React from 'react';

const Footer = ({ navigateTo }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: 'var(--charcoal-slate)',
      color: 'var(--primary-text)',
      borderTop: '3px solid var(--construction-gold)',
      marginTop: 'auto'
    }}>
      <div className="container-fluid py-5">
        <div className="row g-4">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center mb-3">
              <img
                src="/images/buildex.png"
                alt="Buildex Logo"
                style={{
                  height: '90px',
                  width: 'auto',
                  marginRight: '12px',
                  filter: 'brightness(0) invert(1) drop-shadow(0 2px 4px rgba(200, 162, 74, 0.3))'
                }}
              />
              <div>
                <h5 style={{ color: 'var(--primary-text)', fontWeight: '700', marginBottom: '0' }}>Buildex</h5>
                <small style={{ fontSize: '0.7rem', color: 'var(--muted-text)' }}>Building Your Dreams</small>
              </div>
            </div>
            <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              India's most trusted platform for verified new property schemes and smart rental management.
              Connecting you with authentic builders and quality properties.
            </p>
            <div className="social-links mt-3">
              <a href="https://www.facebook.com" target="_blank" className="me-3" style={{ color: 'var(--construction-gold)', fontSize: '1.5rem', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => e.target.style.color = '#E6C86E'}
                onMouseLeave={(e) => e.target.style.color = 'var(--construction-gold)'}
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://www.twitter.com" target="_blank" className="me-3" style={{ color: 'var(--construction-gold)', fontSize: '1.5rem', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => e.target.style.color = '#E6C86E'}
                onMouseLeave={(e) => e.target.style.color = 'var(--construction-gold)'}
              >
                <i className="bi bi-twitter"></i>
              </a>
              <a href="https://www.linkedin.com/in/dhyey-visodiya" target="_blank" className="me-3" style={{ color: 'var(--construction-gold)', fontSize: '1.5rem', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => e.target.style.color = '#E6C86E'}
                onMouseLeave={(e) => e.target.style.color = 'var(--construction-gold)'}
              >
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="https://www.instagram.com/dhyey_visodiya" target="_blank" className="me-3" style={{ color: 'var(--construction-gold)', fontSize: '1.5rem', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => e.target.style.color = '#E6C86E'}
                onMouseLeave={(e) => e.target.style.color = 'var(--construction-gold)'}
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://www.youtube.com" target="_blank" style={{ color: 'var(--construction-gold)', fontSize: '1.5rem', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => e.target.style.color = '#E6C86E'}
                onMouseLeave={(e) => e.target.style.color = 'var(--construction-gold)'}
              >
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '1rem' }}>Quick Links</h6>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li className="mb-2">
                <button
                  onClick={() => navigateTo('home')}
                  className="btn btn-link p-0 text-decoration-none"
                  style={{ fontSize: '0.9rem', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => { e.target.style.color = 'var(--construction-gold)'; e.target.style.paddingLeft = '5px'; }}
                  onMouseLeave={(e) => { e.target.style.color = 'var(--section-divider)'; e.target.style.paddingLeft = '0'; }}
                >
                  <i className="bi bi-chevron-right me-1"></i>Home
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => navigateTo('property-list')}
                  className="btn btn-link p-0 text-decoration-none"
                  style={{ fontSize: '0.9rem', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => { e.target.style.color = 'var(--construction-gold)'; e.target.style.paddingLeft = '5px'; }}
                  onMouseLeave={(e) => { e.target.style.color = 'var(--secondary-text)'; e.target.style.paddingLeft = '0'; }}
                >
                  <i className="bi bi-chevron-right me-1"></i>Properties
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => navigateTo('compare')}
                  className="btn btn-link p-0 text-decoration-none"
                  style={{ fontSize: '0.9rem', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => { e.target.style.color = 'var(--construction-gold)'; e.target.style.paddingLeft = '5px'; }}
                  onMouseLeave={(e) => { e.target.style.color = 'var(--secondary-text)'; e.target.style.paddingLeft = '0'; }}
                >
                  <i className="bi bi-chevron-right me-1"></i>Compare
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => navigateTo('wishlist')}
                  className="btn btn-link p-0 text-decoration-none"
                  style={{ fontSize: '0.9rem', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => { e.target.style.color = 'var(--construction-gold)'; e.target.style.paddingLeft = '5px'; }}
                  onMouseLeave={(e) => { e.target.style.color = 'var(--secondary-text)'; e.target.style.paddingLeft = '0'; }}
                >
                  <i className="bi bi-chevron-right me-1"></i>Wishlist
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-3 col-md-6">
            <h6 style={{ color: 'var(--construction-gold)', fontWeight: '600', marginBottom: '1rem', fontSize: '1rem' }}>Our Services</h6>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li className="mb-2" style={{ fontSize: '0.9rem' }}>
                <i className="bi bi-check-circle-fill me-2" style={{ color: 'var(--construction-gold)' }}></i>
                Property Verification
              </li>
              <li className="mb-2" style={{ color: 'white', fontSize: '0.9rem' }}>
                <i className="bi bi-check-circle-fill me-2" style={{ color: 'var(--construction-gold)' }}></i>
                Builder Authentication
              </li>
              <li className="mb-2" style={{ color: 'white', fontSize: '0.9rem' }}>
                <i className="bi bi-check-circle-fill me-2" style={{ color: 'var(--construction-gold)' }}></i>
                Smart Rental Management
              </li>
              <li className="mb-2" style={{ color: 'white', fontSize: '0.9rem' }}>
                <i className="bi bi-check-circle-fill me-2" style={{ color: 'var(--construction-gold)' }}></i>
                360° Virtual Tours
              </li>
              <li className="mb-2" style={{ fontSize: '0.9rem' }}>
                <i className="bi bi-check-circle-fill me-2" style={{ color: 'var(--construction-gold)' }}></i>
                Property Comparison
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6">
            <h6 style={{ color: 'var(--construction-gold)', fontWeight: '600', marginBottom: '1rem', fontSize: '1rem' }}>Contact Us</h6>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li className="mb-3 d-flex align-items-start">
                <i className="bi bi-geo-alt-fill me-2 mt-1" style={{ color: 'var(--construction-gold)', fontSize: '1.1rem' }}></i>
                <span style={{ color: 'white', fontSize: '0.9rem' }}>
                  DDIT College Road,<br />Nadiad, Gujarat 387001
                </span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <i className="bi bi-telephone-fill me-2" style={{ color: 'var(--construction-gold)', fontSize: '1.1rem' }}></i>
                <span style={{ color: 'white', fontSize: '0.9rem' }}>+91 9913191735</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <i className="bi bi-envelope-fill me-2" style={{ color: 'var(--construction-gold)', fontSize: '1.1rem' }}></i>
                <span style={{ color: 'white', fontSize: '0.9rem' }}>info@buildex.com</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <i className="bi bi-clock-fill me-2" style={{ color: 'var(--construction-gold)', fontSize: '1.1rem' }}></i>
                <span style={{ fontSize: '0.9rem' }}>Mon - Sat: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="row mt-4 pt-4" style={{ borderTop: '1px solid rgba(200, 162, 74, 0.2)' }}>
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p style={{ fontSize: '0.85rem', marginBottom: '0' }}>
              © {currentYear} Buildex. All rights reserved. | Built with excellence for builders and buyers.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <a href="#" className="me-3 text-decoration-none" style={{ fontSize: '0.85rem', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--construction-gold)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--primary-text)'}
            >
              Privacy Policy
            </a>
            <a href="#" className="me-3 text-decoration-none" style={{ fontSize: '0.85rem', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--construction-gold)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--primary-text)'}
            >
              Terms & Conditions
            </a>
            <a href="#" className="me-3 text-decoration-none" style={{ fontSize: '0.85rem', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--construction-gold)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--primary-text)'}
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
