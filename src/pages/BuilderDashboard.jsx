import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getPropertiesByBuilder,
  createProperty,
  updateProperty,
  deleteProperty,
  getBuilderEnquiries,
  updateEnquiryStatus,
  getRentRequestsByBuilder,
  updateRentRequestStatus
} from '../../api/apiService';

const BuilderDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState(null);

  // Form state for adding/editing property
  const [propertyForm, setPropertyForm] = useState({
    name: '',
    type: '',
    purpose: '',
    price: '',
    rent: '',
    area: '',
    city: '',
    locality: '',
    possession: '',
    constructionStatus: '',
    description: '',
    bedrooms: '',
    bathrooms: '',
    amenities: '',
    images: [],
    availability: 'available',
    brochureUrl: '',
    googleMapLink: '',
    virtualTourLink: ''
  });

  // State management from database
  const [properties, setProperties] = useState([]);
  const [buyEnquiries, setBuyEnquiries] = useState([]);
  const [rentRequests, setRentRequests] = useState([]);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  // Fetch data on mount
  useEffect(() => {
    if (currentUser?.id) {
      fetchBuilderData();
    }
  }, [currentUser]);

  const fetchBuilderData = async () => {
    setLoading(true);
    try {
      // Fetch properties
      const propertiesResult = await getPropertiesByBuilder(currentUser.id);
      if (propertiesResult.success) {
        setProperties(propertiesResult.data);
      }

      // Fetch enquiries
      const enquiriesResult = await getBuilderEnquiries(currentUser.id);
      if (enquiriesResult.success) {
        setBuyEnquiries(enquiriesResult.data);
      }

      // Fetch rent requests
      const rentResult = await getRentRequestsByBuilder(currentUser.id);
      if (rentResult.success) {
        setRentRequests(rentResult.data);
      }
    } catch (error) {
      console.error('Error fetching builder data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })).then(base64Images => {
      setPropertyForm(prev => {
        const currentImages = Array.isArray(prev.images) ? prev.images : [];
        return { ...prev, images: [...currentImages, ...base64Images] };
      });
    }).catch(err => console.error('Image upload failed', err));
  };

  const handleSubmitProperty = async (e) => {
    e.preventDefault();

    // Validation
    const requiredFields = ['name', 'type', 'purpose', 'price'];
    const missingField = requiredFields.find(field => !propertyForm[field]);

    if (missingField) {
      setFormMessage({ type: 'error', text: 'Please fill in all required fields' });

      // Auto-scroll to the missing field
      // We need to wait a tick for the error message to render (optional) or just scroll immediately
      // Assuming inputs have 'name' attribute matching the field name
      const element = document.querySelector(`[name="${missingField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }

      return;
    }

    setLoading(true);
    try {
      if (editMode && editingPropertyId) {
        // Update existing property
        const result = await updateProperty(editingPropertyId, propertyForm);
        if (result.success) {
          setProperties(prev => prev.map(p => p.id === editingPropertyId ? result.data : p));
          resetForm();
          setFormMessage({ type: 'success', text: 'Property updated successfully!' });
        } else {
          setFormMessage({ type: 'error', text: result.error || 'Failed to update property' });
        }
      } else {
        // Create new property
        const result = await createProperty({
          builderId: currentUser.id,
          ...propertyForm
        });
        if (result.success) {
          setProperties(prev => [...prev, result.data]);
          resetForm();
          setFormMessage({ type: 'success', text: 'Property added successfully! Pending admin approval.' });
        } else {
          setFormMessage({ type: 'error', text: result.error || 'Failed to add property' });
        }
      }
    } catch (error) {
      setFormMessage({ type: 'error', text: 'Failed to save property' });
    } finally {
      setLoading(false);
      setTimeout(() => setFormMessage({ type: '', text: '' }), 5000);
    }
  };

  const resetForm = () => {
    setPropertyForm({
      name: '',
      type: '',
      purpose: '',
      price: '',
      rent: '',
      area: '',
      city: '',
      locality: '',
      possession: '',
      constructionStatus: '',
      description: '',
      bedrooms: '',
      bathrooms: '',
      amenities: '',
      images: [],
      availability: 'available',
      brochureUrl: '',
      googleMapLink: '',
      virtualTourLink: ''
    });
    setEditMode(false);
    setEditingPropertyId(null);
  };

  const handleEditProperty = (property) => {
    setPropertyForm({
      name: property.name || '',
      type: property.type || '',
      purpose: property.purpose || '',
      price: property.price || '',
      rent: property.rent || '',
      area: property.area || '',
      city: property.city || '',
      locality: property.locality || '',
      possession: property.possession || '',
      constructionStatus: property.construction_status || '',
      description: property.description || '',
      bedrooms: property.bedrooms || '',
      bathrooms: property.bathrooms || '',
      amenities: Array.isArray(property.amenities) ? property.amenities.join(', ') : (property.amenities || ''),
      images: Array.isArray(property.images) ? property.images : (property.images ? property.images.split(',') : []),
      availability: property.availability || 'available',
      brochureUrl: property.brochure_url || '',
      googleMapLink: property.google_map_link || '',
      virtualTourLink: property.virtual_tour_link || ''
    });
    setEditMode(true);
    setEditingPropertyId(property.id);
    setActiveTab('add-property');
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    try {
      const result = await deleteProperty(id);
      if (result.success) {
        setProperties(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleApproveEnquiry = async (id) => {
    try {
      const result = await updateEnquiryStatus(id, 'approved');
      if (result.success) {
        setBuyEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: 'approved' } : e));
      }
    } catch (error) {
      console.error('Error approving enquiry:', error);
    }
  };

  const handleRejectEnquiry = async (id) => {
    try {
      const result = await updateEnquiryStatus(id, 'rejected');
      if (result.success) {
        setBuyEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected' } : e));
      }
    } catch (error) {
      console.error('Error rejecting enquiry:', error);
    }
  };

  const handleApproveRent = async (id) => {
    try {
      const result = await updateRentRequestStatus(id, 'approved');
      if (result.success) {
        setRentRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
      }
    } catch (error) {
      console.error('Error approving rent request:', error);
    }
  };

  const handleRejectRent = async (id) => {
    try {
      const result = await updateRentRequestStatus(id, 'rejected');
      if (result.success) {
        setRentRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
      }
    } catch (error) {
      console.error('Error rejecting rent request:', error);
    }
  };

  const stats = {
    totalProperties: properties.length,
    pendingEnquiries: buyEnquiries.filter(e => e.status === 'pending').length,
    pendingRentRequests: rentRequests.filter(r => r.status === 'pending').length,
    approvedProperties: properties.filter(p => p.status === 'approved').length
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'bi-grid' },
    { id: 'add-property', label: 'Add Property', icon: 'bi-plus-circle' },
    { id: 'my-properties', label: 'My Properties', icon: 'bi-building' },
    { id: 'buy-enquiries', label: 'Enquiries', icon: 'bi-envelope' },
    { id: 'rent-requests', label: 'Rent Requests', icon: 'bi-key' }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="builder-dashboard-page" style={{ minHeight: '100vh', background: 'var(--off-white)' }}>
      <div className="container-fluid py-4">
        {/* Dashboard Header */}
        <div className="row mb-4">
          <div className="col-12">
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
                background: 'radial-gradient(circle, rgba(200,162,74,0.1) 0%, transparent 70%)',
                borderRadius: '50%'
              }} />

              <div className="d-flex align-items-center gap-4">
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'var(--construction-gold)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="bi bi-person-workspace fs-1" style={{ color: 'var(--charcoal-slate)' }}></i>
                </div>
                <div>
                  <h2 className="fw-bold mb-1" style={{ color: 'var(--primary-text)' }}>
                    Builder Dashboard
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                    Welcome, {currentUser?.full_name || currentUser?.username || 'Builder/Owner'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <div className="d-flex gap-2 flex-wrap">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'var(--construction-gold)' : 'var(--card-bg)',
                  border: activeTab === tab.id ? 'none' : '1px solid #E2E8F0',
                  color: activeTab === tab.id ? '#0F172A' : '#64748B',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                <i className={`bi ${tab.icon} me-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#C8A24A' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {!loading && activeTab === 'overview' && (
          <div className="row g-4">
            {/* Stats Cards */}
            {[
              { label: 'Total Properties', value: stats.totalProperties, icon: 'bi-building', color: '#C8A24A' },
              { label: 'Approved', value: stats.approvedProperties, icon: 'bi-check-circle', color: '#10B981' },
              { label: 'Pending Enquiries', value: stats.pendingEnquiries, icon: 'bi-envelope', color: '#3B82F6' },
              { label: 'Rent Requests', value: stats.pendingRentRequests, icon: 'bi-key', color: '#8B5CF6' }
            ].map((stat, index) => (
              <div className="col-md-3 col-6" key={index}>
                <div style={{
                  background: 'var(--card-bg)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: 'var(--card-shadow)',
                  border: 'none',
                  height: '100%'
                }}>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{
                      width: '56px',
                      height: '56px',
                      background: index === 0 ? '#112A46' :
                        index === 1 ? 'rgba(46, 204, 113, 0.15)' :
                          index === 2 ? 'rgba(243, 156, 18, 0.15)' :
                            'rgba(155, 89, 182, 0.15)',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className={`bi ${stat.icon} fs-4`} style={{ color: stat.color }}></i>
                    </div>
                    <div>
                      <h3 className="fw-bold mb-0" style={{ color: 'var(--primary-text)', fontSize: '1.5rem' }}>{stat.value}</h3>
                      <p style={{ color: 'var(--secondary-text)', margin: 0, fontSize: '0.85rem' }}>{stat.label}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            <div className="col-12">
              <div style={{
                background: '#0F1E33',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #E2E8F0'
              }}>
                <h5 className="fw-bold mb-4" style={{ color: 'var(--primary-text)' }}>Quick Actions</h5>
                <div className="d-flex gap-3 flex-wrap">
                  <button
                    onClick={() => setActiveTab('add-property')}
                    className="btn"
                    style={{
                      background: 'linear-gradient(135deg, #C8A24A, #9E7C2F)',
                      color: '#0F172A',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      border: 'none'
                    }}
                  >
                    <i className="bi bi-plus-circle me-2"></i>Add New Property
                  </button>
                  <button
                    onClick={() => setActiveTab('buy-enquiries')}
                    className="btn"
                    style={{
                      background: '#0F1E33',
                      color: '#64748B',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      border: '1px solid #E2E8F0'
                    }}
                  >
                    <i className="bi bi-envelope me-2"></i>View Enquiries ({stats.pendingEnquiries})
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Property Tab */}
        {!loading && activeTab === 'add-property' && (
          <div style={{
            background: '#0F1E33',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #E2E8F0'
          }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0" style={{ color: 'var(--primary-text)' }}>
                <i className={`bi ${editMode ? 'bi-pencil' : 'bi-plus-circle'} me-2`} style={{ color: 'var(--construction-gold)' }}></i>
                {editMode ? 'Edit Property' : 'Add New Property'}
              </h5>
              {editMode && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-sm"
                  style={{ color: '#64748B', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                >
                  <i className="bi bi-x-lg me-1"></i>Cancel Edit
                </button>
              )}
            </div>

            {formMessage.text && (
              <div className={`alert ${formMessage.type === 'success' ? 'alert-success' : 'alert-danger'} mb-4`} style={{ borderRadius: '12px' }}>
                {formMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmitProperty}>
              <div className="row g-4">
                {/* Property Name */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Property Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={propertyForm.name}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter property name"
                    style={{ borderRadius: '10px', padding: '12px 16px', border: '1px solid #E2E8F0' }}
                  />
                </div>

                {/* Property Type */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Property Type *</label>
                  <select
                    name="type"
                    value={propertyForm.type}
                    onChange={handleInputChange}
                    className="form-select"
                    style={{ borderRadius: '10px', padding: '12px 16px', border: '1px solid #E2E8F0' }}
                  >
                    <option value="">Select Type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="House">House</option>
                    <option value="Plot">Plot</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Office">Office Space</option>
                    <option value="Farmhouse">Farmhouse</option>
                    <option value="Guest House">Guest House</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Warehouse">Warehouse</option>
                  </select>
                </div>


                {/* Purpose */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Purpose *</label>
                  <select
                    name="purpose"
                    value={propertyForm.purpose}
                    onChange={handleInputChange}
                    className="form-select"
                    style={{ borderRadius: '10px', padding: '12px 16px', border: '1px solid #E2E8F0' }}
                  >
                    <option value="">Select Purpose</option>
                    <option value="Buy">For Sale</option>
                    <option value="Rent">For Rent</option>
                  </select>
                </div>

                {/* Price */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>
                    {propertyForm.purpose === 'Rent' ? 'Monthly Rent *' : 'Price *'}
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={propertyForm.price}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder={propertyForm.purpose === 'Rent' ? '₹ Monthly rent' : '₹ Enter price'}
                    style={{ borderRadius: '10px', padding: '12px 16px', border: '1px solid #E2E8F0' }}
                  />
                </div>

                {/* Area */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Area (sq.ft)</label>
                  <input
                    type="text"
                    name="area"
                    value={propertyForm.area}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="e.g., 1200"
                    style={{ borderRadius: '10px', padding: '12px 16px', border: '1px solid #E2E8F0' }}
                  />
                </div>

                {/* Bedrooms */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Bedrooms</label>
                  <select
                    name="bedrooms"
                    value={propertyForm.bedrooms}
                    onChange={handleInputChange}
                    className="form-select"
                    style={{ borderRadius: '10px', padding: '12px 16px', border: '1px solid #E2E8F0' }}
                  >
                    <option value="">Select</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>

                {/* Bathrooms */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Bathrooms</label>
                  <select
                    name="bathrooms"
                    value={propertyForm.bathrooms}
                    onChange={handleInputChange}
                    className="form-select"
                    style={{ borderRadius: '10px', padding: '12px 16px', border: '1px solid #E2E8F0' }}
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4+</option>
                  </select>
                </div>

                {/* City */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={propertyForm.city}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter city"
                    style={{ borderRadius: '10px', padding: '12px 16px', border: '1px solid #E2E8F0' }}
                  />
                </div>

                {/* Locality */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Locality</label>
                  <input
                    type="text"
                    name="locality"
                    value={propertyForm.locality}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter locality/area"
                    style={{ borderRadius: '10px', padding: '12px 16px', border: '1px solid #E2E8F0' }}
                  />
                </div>

                {/* Possession Status */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Possession Status</label>
                  <select
                    name="possession"
                    value={propertyForm.possession}
                    onChange={handleInputChange}
                    className="form-select"
                    style={{ borderRadius: '10px', padding: '12px 16px', border: '1px solid #E2E8F0' }}
                  >
                    <option value="">Select Status</option>
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Immediate">Immediate</option>
                  </select>
                </div>

                {/* Construction Status */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Construction Status</label>
                  <select
                    name="constructionStatus"
                    value={propertyForm.constructionStatus}
                    onChange={handleInputChange}
                    className="form-select"
                    style={{ borderRadius: '10px', padding: '12px 16px', background: 'var(--off-white)', color: 'var(--primary-text)', border: 'none' }}
                  >
                    <option value="">Select Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="New Launch">New Launch</option>
                  </select>
                </div>

                {/* Availability Status */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Availability Status</label>
                  <select
                    name="availability"
                    value={propertyForm.availability}
                    onChange={handleInputChange}
                    className="form-select"
                    style={{ borderRadius: '10px', padding: '12px 16px', background: 'var(--off-white)', color: 'var(--primary-text)', border: 'none' }}
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold Out</option>
                    <option value="booked">Booked</option>
                  </select>
                </div>

                {/* Brochure URL */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Brochure URL</label>
                  <input
                    type="text"
                    name="brochureUrl"
                    value={propertyForm.brochureUrl}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Link to PDF brochure"
                    style={{ borderRadius: '10px', padding: '12px 16px', border: '1px solid #E2E8F0' }}
                  />
                </div>

                {/* Google Map Link */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Google Map Link</label>
                  <input
                    type="text"
                    name="googleMapLink"
                    value={propertyForm.googleMapLink}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Map location URL"
                    style={{ borderRadius: '10px', padding: '12px 16px', border: '1px solid #E2E8F0' }}
                  />
                </div>

                {/* Virtual Tour Link */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Virtual Tour Link</label>
                  <input
                    type="text"
                    name="virtualTourLink"
                    value={propertyForm.virtualTourLink}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Video/3D tour URL"
                    style={{ borderRadius: '10px', padding: '12px 16px', border: '1px solid #E2E8F0' }}
                  />
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ color: '#0F172A' }}>Description</label>
                  <textarea
                    name="description"
                    value={propertyForm.description}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="4"
                    placeholder="Describe the property features, location advantages, nearby facilities..."
                    style={{ borderRadius: '10px', padding: '12px 16px', border: '1px solid #E2E8F0' }}
                  />
                </div>

                {/* Amenities */}
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ color: '#0F172A' }}>Amenities</label>
                  <input
                    type="text"
                    name="amenities"
                    value={propertyForm.amenities}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter amenities separated by commas (e.g., Pool, Gym, Parking, Garden)"
                    style={{ borderRadius: '10px', padding: '12px 16px', border: '1px solid #E2E8F0' }}
                  />
                </div>

                {/* Images */}
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Property Images</label>
                  <div className="mb-3">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="form-control mb-2"
                      style={{ background: 'var(--off-white)', color: 'var(--primary-text)', border: 'none' }}
                    />
                  </div>
                  <input
                    style={{ borderRadius: '10px', padding: '12px 16px', background: 'var(--off-white)', color: 'var(--primary-text)', border: 'none' }}
                    readOnly
                    value={Array.isArray(propertyForm.images) ? `${propertyForm.images.length} images selected` : ''}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 d-flex gap-3" style={{ borderTop: '1px solid #E2E8F0' }}>
                <button
                  type="submit"
                  className="btn"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #C8A24A, #9E7C2F)',
                    color: '#0F172A',
                    padding: '14px 32px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    border: 'none'
                  }}
                >
                  {loading ? 'Saving...' : editMode ? (
                    <><i className="bi bi-check-circle me-2"></i>Update Property</>
                  ) : (
                    <><i className="bi bi-plus-circle me-2"></i>Add Property</>
                  )}
                </button>
                {editMode && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn"
                    style={{
                      background: '#F1F5F9',
                      color: '#64748B',
                      padding: '14px 32px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      border: '1px solid #E2E8F0'
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div >
        )}

        {/* My Properties Tab */}
        {
          !loading && activeTab === 'my-properties' && (
            <div style={{
              background: '#0F1E33',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #E2E8F0'
            }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0" style={{ color: '#0F172A' }}>
                  <i className="bi bi-building me-2" style={{ color: '#C8A24A' }}></i>
                  My Properties ({properties.length})
                </h5>
                <button
                  onClick={() => setActiveTab('add-property')}
                  className="btn btn-sm"
                  style={{
                    background: 'linear-gradient(135deg, #C8A24A, #9E7C2F)',
                    color: '#0F172A',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    border: 'none'
                  }}
                >
                  <i className="bi bi-plus me-1"></i>Add New
                </button>
              </div>

              {properties.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'var(--construction-gold)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <i className="bi bi-building" style={{ fontSize: '3rem', color: '#C8A24A' }}></i>
                  </div>
                  <h5 style={{ color: '#0F172A' }}>No properties listed yet</h5>
                  <p style={{ color: '#64748B', maxWidth: '400px', margin: '0 auto' }}>
                    Start by adding your first property to get it listed on the platform
                  </p>
                  <button
                    onClick={() => setActiveTab('add-property')}
                    className="btn mt-3"
                    style={{
                      background: 'linear-gradient(135deg, #C8A24A, #9E7C2F)',
                      color: '#0F172A',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      border: 'none'
                    }}
                  >
                    <i className="bi bi-plus-circle me-2"></i>Add Property
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Property</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Type</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Price</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Status</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map(property => (
                        <tr key={property.id}>
                          <td style={{ color: '#0F172A', fontWeight: '500' }}>{property.name}</td>
                          <td style={{ color: '#64748B' }}>{property.type}</td>
                          <td style={{ color: '#C8A24A', fontWeight: '600' }}>{property.price || property.rent}</td>
                          <td>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              background: property.status === 'approved' ? '#D1FAE5' : property.status === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                              color: property.status === 'approved' ? '#059669' : property.status === 'rejected' ? '#DC2626' : '#D97706'
                            }}>
                              {property.status === 'approved' ? 'Approved' : property.status === 'rejected' ? 'Rejected' : 'Pending'}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm me-2"
                              style={{ color: '#3B82F6' }}
                              onClick={() => handleEditProperty(property)}
                              title="Edit Property"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{ color: '#EF4444' }}
                              onClick={() => handleDeleteProperty(property.id)}
                              title="Delete Property"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        }

        {/* Buy Enquiries Tab */}
        {
          !loading && activeTab === 'buy-enquiries' && (
            <div style={{
              background: '#0F1E33',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #E2E8F0'
            }}>
              <h5 className="fw-bold mb-4" style={{ color: '#0F172A' }}>
                <i className="bi bi-envelope me-2" style={{ color: '#3B82F6' }}></i>
                Buy Enquiries ({buyEnquiries.length})
              </h5>

              {buyEnquiries.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, #DBEAFE20, #DBEAFE10)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <i className="bi bi-envelope-open" style={{ fontSize: '3rem', color: '#60A5FA' }}></i>
                  </div>
                  <h5 style={{ color: '#0F172A' }}>No enquiries yet</h5>
                  <p style={{ color: '#64748B' }}>
                    When buyers show interest in your properties, their enquiries will appear here
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Property</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Customer</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Date</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Status</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buyEnquiries.map(enquiry => (
                        <tr key={enquiry.id}>
                          <td style={{ color: '#0F172A' }}>{enquiry.property_name}</td>
                          <td style={{ color: '#64748B' }}>{enquiry.customer_name || enquiry.full_name}</td>
                          <td style={{ color: '#64748B' }}>{formatDate(enquiry.created_at)}</td>
                          <td>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              background: enquiry.status === 'approved' ? '#D1FAE5' : enquiry.status === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                              color: enquiry.status === 'approved' ? '#059669' : enquiry.status === 'rejected' ? '#DC2626' : '#D97706'
                            }}>
                              {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            {enquiry.status === 'pending' && (
                              <>
                                <button
                                  className="btn btn-sm me-2"
                                  style={{ background: '#10B981', color: 'white', borderRadius: '6px' }}
                                  onClick={() => handleApproveEnquiry(enquiry.id)}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-sm"
                                  style={{ background: '#EF4444', color: 'white', borderRadius: '6px' }}
                                  onClick={() => handleRejectEnquiry(enquiry.id)}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        }

        {/* Rent Requests Tab */}
        {
          !loading && activeTab === 'rent-requests' && (
            <div style={{
              background: '#0F1E33',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #E2E8F0'
            }}>
              <h5 className="fw-bold mb-4" style={{ color: '#0F172A' }}>
                <i className="bi bi-key me-2" style={{ color: '#8B5CF6' }}></i>
                Rent Requests ({rentRequests.length})
              </h5>

              {rentRequests.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, #EDE9FE20, #EDE9FE10)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <i className="bi bi-key" style={{ fontSize: '3rem', color: '#A78BFA' }}></i>
                  </div>
                  <h5 style={{ color: '#0F172A' }}>No rent requests</h5>
                  <p style={{ color: '#64748B' }}>
                    Rental requests for your properties will appear here
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Property</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Customer</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Date</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Status</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rentRequests.map(request => (
                        <tr key={request.id}>
                          <td style={{ color: '#0F172A' }}>{request.property_name}</td>
                          <td style={{ color: '#64748B' }}>{request.customer_name}</td>
                          <td style={{ color: '#64748B' }}>{formatDate(request.created_at)}</td>
                          <td>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              background: request.status === 'approved' ? '#D1FAE5' : '#FEF3C7',
                              color: request.status === 'approved' ? '#059669' : '#D97706'
                            }}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            {request.status === 'pending' && (
                              <>
                                <button
                                  className="btn btn-sm me-2"
                                  style={{ background: '#10B981', color: 'white', borderRadius: '6px' }}
                                  onClick={() => handleApproveRent(request.id)}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-sm"
                                  style={{ background: '#EF4444', color: 'white', borderRadius: '6px' }}
                                  onClick={() => handleRejectRent(request.id)}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        }
      </div >
    </div >
  );
};

export default BuilderDashboard;
