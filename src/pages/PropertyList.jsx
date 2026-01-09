import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import { getProperties } from '../../api/apiService';

const PropertyList = ({ navigateTo, addToCompare, addToWishlist }) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);

  const [filters, setFilters] = useState({
    type: '',
    purpose: '',
    city: '',
    locality: '',
    search: ''
  });

  // Fetch properties from database on mount
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const result = await getProperties();
      if (result.success) {
        setProperties(result.data);
        setFilteredProperties(result.data);

        // Extract unique cities
        const uniqueCities = [...new Set(result.data.map(p => p.city).filter(Boolean))];
        setCities(uniqueCities);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when they change
  useEffect(() => {
    let result = properties;

    if (filters.type) {
      result = result.filter(property => property.type === filters.type);
    }

    if (filters.purpose) {
      result = result.filter(property => property.purpose === filters.purpose);
    }

    if (filters.city) {
      result = result.filter(property => property.city === filters.city);
      // Update localities for selected city
      const cityLocalities = [...new Set(
        properties.filter(p => p.city === filters.city).map(p => p.locality).filter(Boolean)
      )];
      setLocalities(cityLocalities);
    }

    if (filters.locality) {
      result = result.filter(property => property.locality === filters.locality);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(property =>
        property.name.toLowerCase().includes(searchTerm) ||
        property.city.toLowerCase().includes(searchTerm) ||
        property.locality.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredProperties(result);
  }, [filters, properties]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'city' ? { locality: '' } : {})
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      purpose: '',
      city: '',
      locality: '',
      search: ''
    });
    setLocalities([]);
  };

  return (
    <div className="property-list-page animate__animated animate__fadeIn" style={{ minHeight: '100vh', background: 'var(--off-white)' }}>
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
              background: 'radial-gradient(circle, rgba(200,162,74,0.1) 0%, transparent 70%)',
              borderRadius: '50%'
            }} />

            <h1 className="fw-bold mb-2" style={{ color: 'var(--primary-text)' }}>
              <i className="bi bi-building me-3" style={{ color: 'var(--construction-gold)' }}></i>
              Find Your Perfect Property
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              Browse verified properties from trusted builders
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <h5 className="fw-bold mb-4" style={{ color: 'var(--primary-text)' }}>
            <i className="bi bi-funnel me-2" style={{ color: 'var(--construction-gold)' }}></i>
            Filter Properties
          </h5>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="input-group">
              <span className="input-group-text" style={{ background: 'var(--off-white)', border: 'none', color: 'var(--construction-gold)' }}>
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by property name, city, or locality..."
                style={{
                  background: 'var(--off-white)',
                  border: 'none',
                  color: 'var(--primary-text)',
                  padding: '12px'
                }}
              />
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Property Type</label>
              <select
                className="form-select"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                style={{
                  borderRadius: '10px',
                  padding: '12px 16px',
                  background: 'var(--off-white)',
                  color: 'var(--primary-text)',
                  border: 'none',
                  fontSize: '0.95rem'
                }}
              >
                <option value="">All Types</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Purpose</label>
              <select
                className="form-select"
                name="purpose"
                value={filters.purpose}
                onChange={handleFilterChange}
                style={{
                  borderRadius: '10px',
                  padding: '12px 16px',
                  background: 'var(--off-white)',
                  color: 'var(--primary-text)',
                  border: 'none',
                  fontSize: '0.95rem'
                }}
              >
                <option value="">Both</option>
                <option value="Buy">Buy</option>
                <option value="Rent">Rent</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Price Range (Max)</label>
              <select
                className="form-select"
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                style={{
                  borderRadius: '10px',
                  padding: '12px 16px',
                  background: 'var(--off-white)',
                  color: 'var(--primary-text)',
                  border: 'none',
                  fontSize: '0.95rem'
                }}
              >
                <option value="">Any Price</option>
                <option value="100000">Up to $100,000</option>
                <option value="250000">Up to $250,000</option>
                <option value="500000">Up to $500,000</option>
                <option value="1000000">Up to $1,000,000</option>
                <option value="2000000">Up to $2,000,000</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>City</label>
              <select
                className="form-select"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                style={{
                  borderRadius: '10px',
                  padding: '12px 16px',
                  background: 'var(--off-white)',
                  color: 'var(--primary-text)',
                  border: 'none',
                  fontSize: '0.95rem'
                }}
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Locality</label>
              <select
                className="form-select"
                name="locality"
                value={filters.locality}
                onChange={handleFilterChange}
                disabled={!filters.city}
                style={{
                  borderRadius: '10px',
                  padding: '12px 16px',
                  background: 'var(--off-white)',
                  color: 'var(--primary-text)',
                  border: 'none',
                  fontSize: '0.95rem',
                  opacity: filters.city ? 1 : 0.6
                }}
              >
                <option value="">All Localities</option>
                {localities.map(locality => (
                  <option key={locality} value={locality}>{locality}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 d-flex gap-3">
            <button
              className="btn"
              onClick={clearFilters}
              style={{
                background: '#0F1E33',
                color: '#64748B',
                padding: '10px 24px',
                borderRadius: '10px',
                fontWeight: '600',
                border: '1px solid #E2E8F0'
              }}
            >
              <i className="bi bi-x-circle me-2"></i>Clear Filters
            </button>
            <button
              className="btn"
              onClick={fetchProperties}
              style={{
                background: 'linear-gradient(135deg, #C8A24A, #9E7C2F)',
                color: '#0F172A',
                padding: '10px 24px',
                borderRadius: '10px',
                fontWeight: '600',
                border: 'none'
              }}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>Refresh
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-3">
            <span style={{
              background: 'linear-gradient(135deg, #C8A24A, #9E7C2F)',
              color: '#0F172A',
              padding: '8px 16px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '1.1rem'
            }}>
              {filteredProperties.length}
            </span>
            <h5 className="mb-0" style={{ color: '#0F172A' }}>Properties Found</h5>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#C8A24A' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3" style={{ color: '#64748B' }}>Loading properties...</p>
          </div>
        )}

        {/* Property Cards */}
        {!loading && filteredProperties.length > 0 ? (
          <div className="row g-4">
            {filteredProperties.map((property, index) => (
              <div className="col-lg-4 col-md-6 animate__animated animate__fadeInUp" key={property.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <PropertyCard
                  property={property}
                  navigateTo={navigateTo}
                  addToCompare={addToCompare}
                  addToWishlist={addToWishlist}
                />
              </div>
            ))}
          </div>
        ) : !loading && (
          <div className="text-center py-5" style={{
            background: '#0F1E33',
            borderRadius: '16px',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #C8A24A20, #C8A24A10)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <i className="bi bi-search" style={{ fontSize: '3rem', color: '#C8A24A' }}></i>
            </div>
            <h4 style={{ color: '#0F172A' }}>No properties found</h4>
            <p style={{ color: '#64748B', maxWidth: '400px', margin: '0 auto 20px' }}>
              Try adjusting your filters or check back later for new listings
            </p>
            <button
              className="btn"
              onClick={clearFilters}
              style={{
                background: 'linear-gradient(135deg, #C8A24A, #9E7C2F)',
                color: '#0F172A',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                border: 'none'
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
