import React, { useState } from 'react';
import EMICalculator from '../components/EMICalculator';
import { createEnquiry, createRentRequest } from '../../api/apiService';
import { useAuth } from '../contexts/AuthContext';

const PropertyDetail = ({ property, navigateTo, addToCompare, addToWishlist }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showRentModal, setShowRentModal] = useState(false);
  const [showEMICalculator, setShowEMICalculator] = useState(false);
  const { currentUser } = useAuth();
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [enquiryForm, setEnquiryForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [rentForm, setRentForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    moveInDate: '',
    message: ''
  });

  const handleEnquiryChange = (e) => {
    setEnquiryForm({ ...enquiryForm, [e.target.name]: e.target.value });
  };

  const handleRentChange = (e) => {
    setRentForm({ ...rentForm, [e.target.name]: e.target.value });
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await createEnquiry({
        propertyId: property.id,
        userId: currentUser?.id,
        builderId: property.builder_id,
        ...enquiryForm,
        enquiryType: 'buy'
      });
      if (result.success) {
        setMessage({ type: 'success', text: 'Enquiry sent successfully!' });
        setTimeout(() => {
          setShowEnquiryModal(false);
          setMessage({ type: '', text: '' });
          setEnquiryForm({ fullName: '', email: '', phone: '', message: '' });
        }, 2000);
      } else {
        setMessage({ type: 'error', text: 'Failed to send enquiry.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await createRentRequest({
        propertyId: property.id,
        userId: currentUser?.id,
        builderId: property.builder_id,
        moveInDate: rentForm.moveInDate,
        message: rentForm.message
      });
      // Also create an enquiry record for message tracking if needed, or just rely on rent request
      // Ideally rent request table should have message column or link to enquiry. 
      // Current schema for rent_requests doesn't have message, so let's send enquiry too or just ignore message for now?
      // Schema check: rent_requests has no message column. Enquiries does.
      // Let's create an enquiry of type 'rent' as well to store the message.
      await createEnquiry({
        propertyId: property.id,
        userId: currentUser?.id,
        builderId: property.builder_id,
        fullName: rentForm.fullName,
        email: rentForm.email,
        phone: rentForm.phone,
        message: rentForm.message,
        enquiryType: 'rent'
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Rent request sent successfully!' });
        setTimeout(() => {
          setShowRentModal(false);
          setMessage({ type: '', text: '' });
          setRentForm({ fullName: '', email: '', phone: '', moveInDate: '', message: '' });
        }, 2000);
      } else {
        setMessage({ type: 'error', text: 'Failed to send request.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = `Check out ${property?.name} on Buildex`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
      default:
        break;
    }
  };

  if (!property) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center">
          <h2>Property not found</h2>
          <button className="btn btn-primary mt-3" onClick={() => navigateTo('property-list')}>
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
    );
  };

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
    <div className="property-detail-page animate__animated animate__fadeIn" style={{ minHeight: '100vh', background: 'var(--off-white)', color: 'var(--primary-text)' }}>
      <div className="container-fluid">
        {/* Back Button */}
        <div className="mb-3">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigateTo('property-list')}
            style={{
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              border: '1px solid var(--construction-gold)',
              color: 'var(--construction-gold)',
              background: 'transparent'
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
            ← Back to Properties
          </button>
        </div>

        {/* Property Header */}
        <div className="row mb-4 animate__animated animate__fadeInUp">
          <div className="col-md-8">
            <h1>{property.name}</h1>
            <p style={{ color: 'var(--secondary-text)' }}>
              {property.locality}, {property.city} • <span className="badge bg-secondary">{property.builder_name || 'Builder/Owner'}</span>
            </p>
          </div>
          <div className="col-md-4 text-md-end">
            <h2>{property.purpose === 'Buy' ? property.price : property.rent}</h2>
            <span className={`badge ${getAvailabilityClass(property.availability)} fs-6`}>
              {getAvailabilityText(property.availability)}
            </span>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="gallery-section mb-5 animate__animated animate__fadeInUp animate__delay-1s">
          <div className="gallery-container position-relative">
            {property.images && property.images.length > 0 ? (
              <>
                <img
                  src={property.images[currentImageIndex]}
                  className="property-gallery w-100"
                  alt={property.name}
                  style={{ borderRadius: '12px', height: '400px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x400?text=Image+Load+Error';
                  }}
                />
                {property.images.length > 1 && (
                  <>
                    <button
                      className="btn btn-primary position-absolute"
                      style={{
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        background: 'linear-gradient(90deg, var(--construction-gold), var(--deep-bronze))',
                        border: 'none',
                        color: 'var(--primary-text)'
                      }}
                      onClick={prevImage}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-50%) scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(-50%) scale(1)';
                      }}
                    >
                      ‹
                    </button>
                    <button
                      className="btn btn-primary position-absolute"
                      style={{
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        background: 'linear-gradient(90deg, var(--construction-gold), var(--deep-bronze))',
                        border: 'none',
                        color: 'var(--primary-text)'
                      }}
                      onClick={nextImage}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-50%) scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(-50%) scale(1)';
                      }}
                    >
                      ›
                    </button>
                  </>
                )}
                <div className="text-center mt-2">
                  <span className="badge bg-primary" style={{ backgroundColor: 'var(--construction-gold)', color: 'var(--primary-text)' }}>
                    {currentImageIndex + 1} of {property.images.length}
                  </span>
                </div>
              </>
            ) : (
              <div className="property-gallery bg-light d-flex align-items-center justify-content-center rounded" style={{ height: '400px' }}>
                <span className="text-muted">No Images Available</span>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-outline-primary"
              onClick={() => addToCompare(property)}
              style={{
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                border: '1px solid var(--construction-gold)',
                color: 'var(--construction-gold)',
                background: 'transparent'
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
              <i className="bi bi-arrow-left-right me-1"></i> Add to Compare
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => addToWishlist(property)}
              style={{
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                border: '1px solid #EF4444',
                color: '#EF4444',
                background: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#FEF2F2';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <i className="bi bi-heart me-1"></i> Add to Wishlist
            </button>
            {property.brochure_url && (
              <a
                href={property.brochure_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-secondary"
                style={{
                  borderRadius: '8px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  border: '1px solid #94A3B8',
                  color: '#64748B',
                  background: 'transparent',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#F1F5F9';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(148, 163, 184, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <i className="bi bi-file-pdf me-1"></i> Brochure
              </a>
            )}
          </div>
        </div>

        <div className="row">
          {/* Details Section */}
          <div className="col-lg-8">
            <div className="details-section mb-5 animate__animated animate__fadeInUp animate__delay-2s">
              <h3>Property Details</h3>
              <div className="row g-3">
                <div className="col-md-6">
                  <p><strong>Property Type:</strong> {property.type}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Area:</strong> {property.area}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Possession:</strong> {property.possession}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Construction Status:</strong> {property.construction_status || property.constructionStatus}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Purpose:</strong> {property.purpose}</p>
                </div>
              </div>

              <h4 className="mt-4">Amenities</h4>
              <div className="row g-2">
                {property.amenities && property.amenities.map((amenity, index) => (
                  <div className="col-auto" key={index}>
                    <span className="badge" style={{ backgroundColor: '#C8A24A', color: '#0B1220' }}>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Section */}
            {property.google_map_link && (
              <div className="map-section mb-5 animate__animated animate__fadeInUp animate__delay-3s">
                <h3>Location</h3>
                <div className="map-container bg-light rounded" style={{ height: '300px', overflow: 'hidden' }}>
                  <iframe
                    src={property.google_map_link}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Property Location"
                  ></iframe>
                </div>
              </div>
            )}

            {/* 360 View Section */}
            {property.virtual_tour_link && (
              <div className="view-section mb-5 animate__animated animate__fadeInUp animate__delay-4s">
                <h3>360° Virtual Tour</h3>
                <div className="street-view rounded" style={{ backgroundColor: '#F1F5F9' }}>
                  <div className="text-center p-5">
                    <i className="bi bi-camera fs-1 mb-3" style={{ color: '#94A3B8' }}></i>
                    <p>Interactive 360° view of the property</p>
                    <a
                      href={property.virtual_tour_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{
                        borderRadius: '8px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        background: 'linear-gradient(90deg, #C8A24A, #9E7C2F)',
                        border: 'none',
                        color: '#0B1220',
                        display: 'inline-block',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#9E7C2F';
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 6px 16px rgba(158, 124, 47, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(90deg, #C8A24A, #9E7C2F)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(158, 124, 47, 0.3)';
                      }}
                    >
                      View Virtual Tour
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Panel */}
          <div className="col-lg-4">
            <div className="action-panel sticky-top animate__animated animate__fadeInUp animate__delay-2s">
              <div className="card" style={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
                border: '1px solid #E2E8F0'
              }}>
                <div className="card-body">
                  <h4 className="card-title">Interested in this property?</h4>
                  <p className="card-text">Get in touch with our experts for more information.</p>

                  {property.purpose === 'Buy' ? (
                    <button
                      className="btn btn-primary w-100 mb-2"
                      onClick={() => setShowEnquiryModal(true)}
                      style={{
                        borderRadius: '8px',
                        fontWeight: '600',
                        padding: '12px',
                        transition: 'all 0.3s ease',
                        background: 'linear-gradient(90deg, #C8A24A, #9E7C2F)',
                        border: 'none',
                        color: '#0B1220'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#9E7C2F';
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 6px 16px rgba(158, 124, 47, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(90deg, #C8A24A, #9E7C2F)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(158, 124, 47, 0.3)';
                      }}
                    >
                      Send Buy Enquiry
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary w-100 mb-2"
                      onClick={() => setShowRentModal(true)}
                      style={{
                        borderRadius: '8px',
                        fontWeight: '600',
                        padding: '12px',
                        transition: 'all 0.3s ease',
                        background: 'linear-gradient(90deg, #C8A24A, #9E7C2F)',
                        border: 'none',
                        color: '#0B1220'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#9E7C2F';
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 6px 16px rgba(158, 124, 47, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(90deg, #C8A24A, #9E7C2F)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(158, 124, 47, 0.3)';
                      }}
                    >
                      Request for Rent
                    </button>
                  )}

                  <button
                    className="btn btn-outline-secondary w-100"
                    style={{
                      borderRadius: '8px',
                      fontWeight: '600',
                      padding: '12px',
                      transition: 'all 0.3s ease',
                      border: '1px solid #94A3B8',
                      color: '#64748B',
                      background: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#F1F5F9';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(148, 163, 184, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Schedule a Visit
                  </button>

                  {/* EMI Calculator Button */}
                  {property.purpose === 'Buy' && (
                    <button
                      className="btn w-100 mt-2"
                      onClick={() => setShowEMICalculator(true)}
                      style={{
                        borderRadius: '8px',
                        fontWeight: '600',
                        padding: '12px',
                        transition: 'all 0.3s ease',
                        background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                        border: 'none',
                        color: '#FFFFFF'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <i className="bi bi-calculator me-2"></i>Calculate EMI
                    </button>
                  )}

                  {/* Share Section */}
                  <div className="mt-4 pt-3" style={{ borderTop: '1px solid #E2E8F0' }}>
                    <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '12px' }}>
                      <i className="bi bi-share me-2"></i>Share this property
                    </p>
                    <div className="d-flex gap-2">
                      <button
                        className="btn flex-grow-1"
                        onClick={() => handleShare('whatsapp')}
                        style={{
                          background: '#25D366',
                          color: 'white',
                          borderRadius: '8px',
                          padding: '10px',
                          border: 'none'
                        }}
                      >
                        <i className="bi bi-whatsapp"></i>
                      </button>
                      <button
                        className="btn flex-grow-1"
                        onClick={() => handleShare('facebook')}
                        style={{
                          background: '#1877F2',
                          color: 'white',
                          borderRadius: '8px',
                          padding: '10px',
                          border: 'none'
                        }}
                      >
                        <i className="bi bi-facebook"></i>
                      </button>
                      <button
                        className="btn flex-grow-1"
                        onClick={() => handleShare('twitter')}
                        style={{
                          background: '#1DA1F2',
                          color: 'white',
                          borderRadius: '8px',
                          padding: '10px',
                          border: 'none'
                        }}
                      >
                        <i className="bi bi-twitter"></i>
                      </button>
                      <button
                        className="btn flex-grow-1"
                        onClick={() => handleShare('copy')}
                        style={{
                          background: copied ? '#10B981' : '#64748B',
                          color: 'white',
                          borderRadius: '8px',
                          padding: '10px',
                          border: 'none',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <i className={`bi ${copied ? 'bi-check' : 'bi-link-45deg'}`}></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >

      {/* EMI Calculator Modal */}
      {
        showEMICalculator && (
          <EMICalculator
            propertyPrice={property.price}
            onClose={() => setShowEMICalculator(false)}
          />
        )
      }

      {/* Buy Enquiry Modal */}
      {
        showEnquiryModal && (
          <div className="modal show d-block animate__animated animate__fadeIn" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content" style={{ borderRadius: '12px', background: 'var(--card-bg)', color: 'var(--primary-text)', border: '1px solid #E2E8F0' }}>
                <div className="modal-header" style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <h5 className="modal-title">Buy Enquiry for {property.name}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEnquiryModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleEnquirySubmit}>
                    {message.text && (
                      <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                        {message.text}
                      </div>
                    )}
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={enquiryForm.fullName}
                        onChange={handleEnquiryChange}
                        required
                        className="form-control"
                        style={{
                          borderColor: '#CBD5E1',
                          borderRadius: '8px',
                          padding: '10px',
                          color: 'var(--primary-text)',
                          backgroundColor: 'var(--card-bg)'
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={enquiryForm.email}
                        onChange={handleEnquiryChange}
                        required
                        className="form-control"
                        style={{
                          borderColor: '#CBD5E1',
                          borderRadius: '8px',
                          padding: '10px',
                          color: 'var(--primary-text)',
                          backgroundColor: 'var(--card-bg)'
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={enquiryForm.phone}
                        onChange={handleEnquiryChange}
                        required
                        className="form-control"
                        style={{
                          borderColor: '#CBD5E1',
                          borderRadius: '8px',
                          padding: '10px',
                          color: 'var(--primary-text)',
                          backgroundColor: 'var(--card-bg)'
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Message</label>
                      <textarea
                        name="message"
                        value={enquiryForm.message}
                        onChange={handleEnquiryChange}
                        required
                        className="form-control"
                        rows="3"
                        style={{
                          borderColor: '#CBD5E1',
                          borderRadius: '8px',
                          padding: '10px',
                          color: 'var(--primary-text)',
                          backgroundColor: 'var(--card-bg)'
                        }}
                      ></textarea>
                    </div>
                    <div className="modal-footer border-0 p-0 mt-3">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowEnquiryModal(false)}
                        style={{
                          borderRadius: '8px',
                          fontWeight: '600',
                          border: '1px solid #94A3B8',
                          color: '#64748B',
                          background: 'transparent'
                        }}
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-primary"
                        style={{
                          borderRadius: '8px',
                          fontWeight: '600',
                          background: 'linear-gradient(90deg, #C8A24A, #9E7C2F)',
                          border: 'none',
                          color: '#0B1220'
                        }}
                      >
                        {submitting ? 'Sending...' : 'Submit Enquiry'}
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </div>
        )
      }

      {/* Rent Request Modal */}
      {
        showRentModal && (
          <div className="modal show d-block animate__animated animate__fadeIn" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content" style={{ borderRadius: '12px', background: 'var(--card-bg)', color: 'var(--primary-text)', border: '1px solid #E2E8F0' }}>
                <div className="modal-header" style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <h5 className="modal-title">Rent Request for {property.name}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowRentModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleRentSubmit}>
                    {message.text && (
                      <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                        {message.text}
                      </div>
                    )}
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={rentForm.fullName}
                        onChange={handleRentChange}
                        required
                        className="form-control"
                        style={{
                          borderColor: '#CBD5E1',
                          borderRadius: '8px',
                          padding: '10px',
                          color: 'var(--primary-text)',
                          backgroundColor: 'var(--card-bg)'
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={rentForm.email}
                        onChange={handleRentChange}
                        required
                        className="form-control"
                        style={{
                          borderColor: '#CBD5E1',
                          borderRadius: '8px',
                          padding: '10px',
                          color: 'var(--primary-text)',
                          backgroundColor: 'var(--card-bg)'
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={rentForm.phone}
                        onChange={handleRentChange}
                        required
                        className="form-control"
                        style={{
                          borderColor: '#CBD5E1',
                          borderRadius: '8px',
                          padding: '10px',
                          color: 'var(--primary-text)',
                          backgroundColor: 'var(--card-bg)'
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Move-in Date</label>
                      <input
                        type="date"
                        name="moveInDate"
                        value={rentForm.moveInDate}
                        onChange={handleRentChange}
                        required
                        className="form-control"
                        style={{
                          borderColor: '#CBD5E1',
                          borderRadius: '8px',
                          padding: '10px',
                          color: 'var(--primary-text)',
                          backgroundColor: 'var(--card-bg)'
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Message</label>
                      <textarea
                        name="message"
                        value={rentForm.message}
                        onChange={handleRentChange}
                        className="form-control"
                        rows="3"
                        style={{
                          borderColor: '#CBD5E1',
                          borderRadius: '8px',
                          padding: '10px',
                          color: 'var(--primary-text)',
                          backgroundColor: 'var(--card-bg)'
                        }}
                      ></textarea>
                    </div>
                    <div className="modal-footer border-0 p-0 mt-3">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowRentModal(false)}
                        style={{
                          borderRadius: '8px',
                          fontWeight: '600',
                          border: '1px solid #94A3B8',
                          color: '#64748B',
                          background: 'transparent'
                        }}
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-primary"
                        style={{
                          borderRadius: '8px',
                          fontWeight: '600',
                          background: 'linear-gradient(90deg, #C8A24A, #9E7C2F)',
                          border: 'none',
                          color: '#0B1220'
                        }}
                      >
                        {submitting ? 'Sending...' : 'Submit Request'}
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </div>
        )
      }

      {/* Modal backdrop */}
      {
        (showEnquiryModal || showRentModal) && (
          <div className="modal-backdrop show"></div>
        )
      }
    </div >
  );
};

export default PropertyDetail;
