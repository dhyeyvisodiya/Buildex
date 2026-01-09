import React from 'react';
import PropertyCard from '../components/PropertyCard';

const Wishlist = ({ wishlist, removeFromWishlist, navigateTo }) => {
  return (
    <div className="wishlist-page animate__animated animate__fadeIn" style={{ minHeight: '100vh', background: 'var(--charcoal-slate)' }}>
      <div className="container-fluid py-4">
        {/* Page Header */}
        <div className="mb-4">
          <div style={{
            background: 'linear-gradient(135deg, var(--card-bg) 0%, var(--charcoal-slate) 100%)',
            borderRadius: '20px',
            padding: '32px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%'
            }} />

            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="fw-bold mb-2" style={{ color: 'var(--primary-text)' }}>
                  <i className="bi bi-heart-fill me-3"></i>
                  Your Wishlist
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                  {wishlist.length} {wishlist.length === 1 ? 'property' : 'properties'} saved
                </p>
              </div>
              <button
                className="btn"
                onClick={() => navigateTo('property-list')}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                <i className="bi bi-search me-2"></i>Browse More
              </button>
            </div>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-5" style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, #FEE2E2, #FECACA)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <i className="bi bi-heart" style={{ fontSize: '3.5rem', color: '#EF4444' }}></i>
            </div>
            <h4 style={{ color: 'var(--primary-text)', marginBottom: '12px' }}>Your wishlist is empty</h4>
            <p style={{ color: 'var(--secondary-text)', maxWidth: '400px', margin: '0 auto 24px' }}>
              Save properties that interest you by clicking the heart icon to view them later
            </p>
            <button
              className="btn"
              onClick={() => navigateTo('property-list')}
              style={{
                background: 'linear-gradient(135deg, var(--construction-gold), var(--deep-bronze))',
                color: 'var(--primary-text)',
                padding: '12px 32px',
                borderRadius: '12px',
                fontWeight: '600',
                border: 'none'
              }}
            >
              <i className="bi bi-building me-2"></i>Explore Properties
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {wishlist.map((property, index) => (
              <div
                className="col-lg-4 col-md-6 animate__animated animate__fadeInUp"
                key={property.id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="position-relative">
                  <PropertyCard
                    property={property}
                    navigateTo={navigateTo}
                    addToCompare={() => { }}
                    addToWishlist={() => { }}
                  />
                  <button
                    className="btn position-absolute"
                    style={{
                      top: '10px',
                      right: '10px',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0',
                      background: 'var(--danger-color)',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => removeFromWishlist(property.id)}
                  >
                    <i className="bi bi-x-lg" style={{ color: '#FFFFFF', fontSize: '1rem' }}></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;