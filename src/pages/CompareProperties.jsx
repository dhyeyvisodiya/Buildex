import React from 'react';
import PropertyCard from '../components/PropertyCard';

const CompareProperties = ({ compareList, removeFromCompare, navigateTo }) => {
  if (compareList.length === 0) {
    return (
      <div className="compare-properties-page" style={{ minHeight: '100vh', background: 'var(--charcoal-slate)' }}>
        <div className="container-fluid py-4">
          {/* Page Header */}
          <div className="mb-4">
            <div style={{
              background: 'linear-gradient(135deg, var(--charcoal-slate) 0%, var(--card-bg) 100%)',
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

              <h1 className="fw-bold mb-2" style={{ color: 'var(--primary-text)' }}>
                <i className="bi bi-arrow-left-right me-3"></i>
                Compare Properties
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                Compare properties side by side to find your perfect match
              </p>
            </div>
          </div>

          <div className="text-center py-5" style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <i className="bi bi-arrow-left-right" style={{ fontSize: '3rem', color: '#3B82F6' }}></i>
            </div>
            <h4 style={{ color: 'var(--primary-text)' }}>No Properties to Compare</h4>
            <p style={{ color: 'var(--secondary-text)', maxWidth: '400px', margin: '0 auto 24px' }}>
              Add properties to compare them side by side and make informed decisions
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
              <i className="bi bi-search me-2"></i>Browse Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="compare-properties-page animate__animated animate__fadeIn" style={{ minHeight: '100vh', background: 'var(--charcoal-slate)' }}>
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
                  <i className="bi bi-arrow-left-right me-3"></i>
                  Compare Properties
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                  Comparing {compareList.length} properties
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
                <i className="bi bi-plus-circle me-2"></i>Add More
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <div className="table-responsive">
            <table className="table mb-0" style={{ borderCollapse: 'separate' }}>
              <thead>
                <tr style={{ background: 'var(--card-bg)' }}>
                  <th style={{
                    color: 'var(--primary-text)',
                    fontWeight: '700',
                    padding: '20px 24px',
                    fontSize: '0.95rem',
                    borderBottom: '2px solid #E2E8F0',
                    minWidth: '150px'
                  }}>
                    Feature
                  </th>
                  {compareList.map(property => (
                    <th key={property.id} className="text-center" style={{
                      minWidth: '220px',
                      padding: '20px',
                      borderBottom: '2px solid #E2E8F0'
                    }}>
                      <div className="d-flex flex-column align-items-center">
                        <button
                          className="btn btn-sm mb-3"
                          onClick={() => removeFromCompare(property.id)}
                          style={{
                            background: '#FEE2E2',
                            color: '#EF4444',
                            borderRadius: '8px',
                            fontWeight: '600',
                            padding: '6px 12px',
                            fontSize: '0.8rem',
                            border: '1px solid var(--construction-gold)'
                          }}
                        >
                          <i className="bi bi-x-lg me-1"></i>Remove
                        </button>
                        <span style={{ color: 'var(--primary-text)', fontWeight: '700', fontSize: '1rem' }}>{property.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Price', key: 'price', format: (p) => p.purpose === 'Buy' ? p.price : p.rent, highlight: true },
                  { label: 'Type', key: 'type' },
                  { label: 'Purpose', key: 'purpose', badge: true },
                  { label: 'Area', key: 'area' },
                  { label: 'City', key: 'city' },
                  { label: 'Locality', key: 'locality' },
                  { label: 'Possession', key: 'possession' },
                  { label: 'Amenities', key: 'amenities', format: (p) => p.amenities && p.amenities.join(', ') }
                ].map((row, idx) => (
                  <tr key={row.key} style={{ background: idx % 2 === 0 ? 'var(--card-bg)' : 'rgba(255,255,255,0.02)' }}>
                    <th style={{
                      color: 'var(--primary-text)',
                      fontWeight: '600',
                      padding: '16px 24px',
                      borderBottom: '1px solid #E2E8F0'
                    }}>
                      {row.label}
                    </th>
                    {compareList.map(property => (
                      <td key={property.id} className="text-center" style={{
                        padding: '16px',
                        borderBottom: '1px solid #E2E8F0'
                      }}>
                        {row.badge ? (
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            background: property[row.key] === 'Buy' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                            color: property[row.key] === 'Buy' ? '#10B981' : '#3B82F6'
                          }}>
                            {property[row.key]}
                          </span>
                        ) : row.highlight ? (
                          <span style={{ color: 'var(--construction-gold)', fontWeight: '700', fontSize: '1.1rem' }}>
                            {row.format(property) || '-'}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--muted-text)', fontWeight: '500' }}>
                            {row.format ? row.format(property) : property[row.key] || '-'}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th style={{
                    color: 'var(--primary-text)',
                    fontWeight: '600',
                    padding: '20px 24px'
                  }}>
                    Actions
                  </th>
                  {compareList.map(property => (
                    <td key={property.id} className="text-center" style={{ padding: '20px' }}>
                      <button
                        className="btn"
                        onClick={() => navigateTo('property-detail', property)}
                        style={{
                          background: 'linear-gradient(135deg, var(--construction-gold), var(--deep-bronze))',
                          color: 'var(--primary-text)',
                          padding: '10px 24px',
                          borderRadius: '10px',
                          fontWeight: '600',
                          border: 'none'
                        }}
                      >
                        <i className="bi bi-eye me-2"></i>View Details
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareProperties;