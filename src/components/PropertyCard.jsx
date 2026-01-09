import React from 'react';

const PropertyCard = ({ property, navigateTo, addToCompare, addToWishlist }) => {
  const getAvailabilityClass = (availability) => {
    switch (availability) {
      case 'available': return 'badge-available';
      case 'booked': return 'badge-booked';
      case 'sold': return 'badge-sold';
      default: return 'badge-secondary';
    }
  };

  const getAvailabilityText = (availability) => {
    switch (availability) {
      case 'available': return 'Available';
      case 'booked': return 'Booked';
      case 'sold': return 'Sold';
      default: return 'Unknown';
    }
  };

  return (
    <div className="property-card card h-100 animate__animated animate__fadeInUp" style={{
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(15, 23, 42, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.08)';
      }}>
      <div className="position-relative">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            className="property-image card-img-top"
            alt={property.name}
            style={{ height: '200px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = '<div class="property-image bg-light d-flex align-items-center justify-content-center" style="height: 200px"><span class="text-muted">Image Error</span></div>';
            }}
          />
        ) : (
          <div className="property-image bg-light d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
            <span className="text-muted">No Image</span>
          </div>
        )}
        <span className={`availability-badge ${getAvailabilityClass(property.availability)}`}>
          {getAvailabilityText(property.availability)}
        </span>
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{property.name}</h5>
        <p className="card-text text-muted small">{property.locality}, {property.city}</p>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold fs-5">
              {property.purpose === 'Buy' ? property.price : property.rent}
            </span>
            <span className="badge" style={{ backgroundColor: 'var(--construction-gold)', color: 'var(--primary-text)' }}>{property.type}</span>
          </div>

          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-primary"
              onClick={() => navigateTo('property-detail', property)}
              style={{
                background: 'linear-gradient(90deg, var(--construction-gold), var(--deep-bronze))',
                border: 'none',
                color: 'var(--primary-text)',
                borderRadius: '6px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--deep-bronze)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(158, 124, 47, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(90deg, var(--construction-gold), var(--deep-bronze))';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(158, 124, 47, 0.3)';
              }}
            >
              View Details
            </button>
            <div className="btn-group" role="group">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => addToCompare(property)}
                style={{
                  border: '1px solid var(--construction-gold)',
                  color: 'var(--construction-gold)',
                  background: 'transparent',
                  borderRadius: '6px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#F5F0E6';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(200, 162, 74, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Compare
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => addToWishlist(property)}
                style={{
                  border: '1px solid var(--construction-gold)',
                  color: 'var(--construction-gold)',
                  background: 'transparent',
                  borderRadius: '6px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#F5F0E6';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(200, 162, 74, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <i className="bi bi-heart"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;