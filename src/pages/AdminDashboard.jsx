import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getAllBuilders,
  updateBuilderStatus,
  getAllProperties,
  updatePropertyStatus,
  getAllComplaints,
  updateComplaintStatus
} from '../../api/apiService';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // State management from database
  const [builders, setBuilders] = useState([]);
  const [properties, setProperties] = useState([]);
  const [complaints, setComplaints] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch builders
      const buildersResult = await getAllBuilders();
      if (buildersResult.success) {
        setBuilders(buildersResult.data);
      }

      // Fetch properties
      const propertiesResult = await getAllProperties();
      if (propertiesResult.success) {
        setProperties(propertiesResult.data);
      }

      // Fetch complaints
      const complaintsResult = await getAllComplaints();
      if (complaintsResult.success) {
        setComplaints(complaintsResult.data);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleVerifyBuilder = async (id) => {
    try {
      const result = await updateBuilderStatus(id, 'active');
      if (result.success) {
        setBuilders(prev => prev.map(b => b.id === id ? { ...b, status: 'active' } : b));
      }
    } catch (error) {
      console.error('Error verifying builder:', error);
    }
  };

  const handleBlockBuilder = async (id) => {
    try {
      const result = await updateBuilderStatus(id, 'blocked');
      if (result.success) {
        setBuilders(prev => prev.map(b => b.id === id ? { ...b, status: 'blocked' } : b));
      }
    } catch (error) {
      console.error('Error blocking builder:', error);
    }
  };

  const handleUnblockBuilder = async (id) => {
    try {
      const result = await updateBuilderStatus(id, 'active');
      if (result.success) {
        setBuilders(prev => prev.map(b => b.id === id ? { ...b, status: 'active' } : b));
      }
    } catch (error) {
      console.error('Error unblocking builder:', error);
    }
  };

  const handleApproveProperty = async (id) => {
    try {
      const result = await updatePropertyStatus(id, 'approved');
      if (result.success) {
        setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
      }
    } catch (error) {
      console.error('Error approving property:', error);
    }
  };

  const handleBlockProperty = async (id) => {
    try {
      const result = await updatePropertyStatus(id, 'blocked');
      if (result.success) {
        setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'blocked' } : p));
      }
    } catch (error) {
      console.error('Error blocking property:', error);
    }
  };

  const handleResolveComplaint = async (id) => {
    try {
      const result = await updateComplaintStatus(id, 'resolved');
      if (result.success) {
        setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'resolved' } : c));
      }
    } catch (error) {
      console.error('Error resolving complaint:', error);
    }
  };

  const stats = {
    totalBuilders: builders.length,
    pendingVerifications: builders.filter(b => b.status === 'pending').length,
    totalProperties: properties.length,
    pendingProperties: properties.filter(p => p.status === 'pending').length,
    openComplaints: complaints.filter(c => c.status === 'open').length
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'bi-grid' },
    { id: 'builders', label: 'Builders', icon: 'bi-people' },
    { id: 'properties', label: 'Properties', icon: 'bi-building' },
    { id: 'complaints', label: 'Complaints', icon: 'bi-exclamation-triangle' }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-dashboard-page" style={{ minHeight: '100vh', background: 'var(--off-white)' }}>
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
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%'
              }} />

              <div className="d-flex align-items-center gap-4">
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="bi bi-shield-check fs-1" style={{ color: 'var(--construction-gold)' }}></i>
                </div>
                <div>
                  <h2 className="fw-bold mb-1" style={{ color: 'var(--primary-text)' }}>
                    Admin Dashboard
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                    Manage builders, properties, and resolve complaints
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
                  border: activeTab === tab.id ? 'none' : '1px solid var(--card-border)',
                  color: activeTab === tab.id ? 'var(--off-white)' : 'var(--muted-text)',
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
            <div className="spinner-border" style={{ color: '#7C3AED' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {!loading && activeTab === 'overview' && (
          <div className="row g-4">
            {/* Stats Cards */}
            {[
              { label: 'Total Builders', value: stats.totalBuilders, icon: 'bi-people', color: '#7C3AED', bgColor: '#EDE9FE' },
              { label: 'Pending Verifications', value: stats.pendingVerifications, icon: 'bi-clock-history', color: '#F59E0B', bgColor: '#FEF3C7' },
              { label: 'Total Properties', value: stats.totalProperties, icon: 'bi-building', color: '#3B82F6', bgColor: '#DBEAFE' },
              { label: 'Pending Approvals', value: stats.pendingProperties, icon: 'bi-hourglass-split', color: '#10B981', bgColor: '#D1FAE5' },
              { label: 'Open Complaints', value: stats.openComplaints, icon: 'bi-exclamation-triangle', color: '#EF4444', bgColor: '#FEE2E2' }
            ].map((stat, index) => (
              <div className="col-md-4 col-6" key={index}>
                <div style={{
                  background: 'var(--card-bg)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: 'none',
                  boxShadow: 'var(--card-shadow)'
                }}>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{
                      width: '56px',
                      height: '56px',
                      background: stat.bgColor,
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

            {/* Platform Health */}
            <div className="col-12">
              <div style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                padding: '24px',
                border: 'none'
              }}>
                <h5 className="fw-bold mb-4" style={{ color: 'var(--primary-text)' }}>Platform Health</h5>
                <div className="row g-4">
                  <div className="col-md-4">
                    <div style={{ padding: '20px', background: '#F0FDF4', borderRadius: '12px' }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="bi bi-check-circle-fill" style={{ color: '#10B981' }}></i>
                        <span style={{ fontWeight: '600', color: '#0F172A' }}>Database</span>
                      </div>
                      <p style={{ color: '#64748B', margin: 0, fontSize: '0.9rem' }}>Connected to NeonDB</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div style={{ padding: '20px', background: '#F0FDF4', borderRadius: '12px' }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="bi bi-check-circle-fill" style={{ color: '#10B981' }}></i>
                        <span style={{ fontWeight: '600', color: '#0F172A' }}>API Status</span>
                      </div>
                      <p style={{ color: '#64748B', margin: 0, fontSize: '0.9rem' }}>All Systems Normal</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div style={{ padding: '20px', background: '#F0FDF4', borderRadius: '12px' }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="bi bi-check-circle-fill" style={{ color: '#10B981' }}></i>
                        <span style={{ fontWeight: '600', color: '#0F172A' }}>Auth Service</span>
                      </div>
                      <p style={{ color: '#64748B', margin: 0, fontSize: '0.9rem' }}>Running Smoothly</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Builders Tab */}
        {!loading && activeTab === 'builders' && (
          <div style={{
            background: '#0F1E33',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E2E8F0'
          }}>
            <h5 className="fw-bold mb-4" style={{ color: '#0F172A' }}>
              <i className="bi bi-people me-2" style={{ color: '#7C3AED' }}></i>
              Builder Management ({builders.length})
            </h5>

            {builders.length === 0 ? (
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
                  <i className="bi bi-people" style={{ fontSize: '3rem', color: '#A78BFA' }}></i>
                </div>
                <h5 style={{ color: '#0F172A' }}>No registered builders</h5>
                <p style={{ color: '#64748B', maxWidth: '400px', margin: '0 auto' }}>
                  When builders register on the platform, they will appear here for verification
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Builder Name</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Email</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Phone</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Properties</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Status</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {builders.map(builder => (
                      <tr key={builder.id}>
                        <td style={{ color: '#0F172A', fontWeight: '500' }}>{builder.full_name || builder.username}</td>
                        <td style={{ color: '#64748B' }}>{builder.email}</td>
                        <td style={{ color: '#64748B' }}>{builder.phone || '-'}</td>
                        <td style={{ color: '#64748B' }}>{builder.property_count || 0}</td>
                        <td>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            background: builder.status === 'active' ? '#D1FAE5' : builder.status === 'blocked' ? '#FEE2E2' : '#FEF3C7',
                            color: builder.status === 'active' ? '#059669' : builder.status === 'blocked' ? '#DC2626' : '#D97706'
                          }}>
                            {builder.status === 'active' ? 'Verified' : builder.status === 'blocked' ? 'Blocked' : 'Pending'}
                          </span>
                        </td>
                        <td>
                          {builder.status === 'pending' && (
                            <>
                              <button
                                className="btn btn-sm me-2"
                                style={{ background: '#10B981', color: 'white', borderRadius: '6px' }}
                                onClick={() => handleVerifyBuilder(builder.id)}
                              >
                                Verify
                              </button>
                              <button
                                className="btn btn-sm"
                                style={{ background: '#EF4444', color: 'white', borderRadius: '6px' }}
                                onClick={() => handleBlockBuilder(builder.id)}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {builder.status === 'active' && (
                            <button
                              className="btn btn-sm"
                              style={{ background: '#EF4444', color: 'white', borderRadius: '6px' }}
                              onClick={() => handleBlockBuilder(builder.id)}
                            >
                              Block
                            </button>
                          )}
                          {builder.status === 'blocked' && (
                            <button
                              className="btn btn-sm"
                              style={{ background: '#10B981', color: 'white', borderRadius: '6px' }}
                              onClick={() => handleUnblockBuilder(builder.id)}
                            >
                              Unblock
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Properties Tab */}
        {!loading && activeTab === 'properties' && (
          <div style={{
            background: '#0F1E33',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E2E8F0'
          }}>
            <h5 className="fw-bold mb-4" style={{ color: '#0F172A' }}>
              <i className="bi bi-building me-2" style={{ color: '#3B82F6' }}></i>
              Property Management ({properties.length})
            </h5>

            {properties.length === 0 ? (
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
                  <i className="bi bi-building" style={{ fontSize: '3rem', color: '#60A5FA' }}></i>
                </div>
                <h5 style={{ color: '#0F172A' }}>No properties listed</h5>
                <p style={{ color: '#64748B', maxWidth: '400px', margin: '0 auto' }}>
                  Properties added by builders will appear here for monitoring
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Property</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Builder</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Type</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>City</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Status</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map(property => (
                      <tr key={property.id}>
                        <td style={{ color: '#0F172A', fontWeight: '500' }}>{property.name}</td>
                        <td style={{ color: '#64748B' }}>{property.builder_name || '-'}</td>
                        <td style={{ color: '#64748B' }}>{property.type}</td>
                        <td style={{ color: '#64748B' }}>{property.city || '-'}</td>
                        <td>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            background: property.status === 'approved' ? '#D1FAE5' : property.status === 'blocked' ? '#FEE2E2' : '#FEF3C7',
                            color: property.status === 'approved' ? '#059669' : property.status === 'blocked' ? '#DC2626' : '#D97706'
                          }}>
                            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          {property.status === 'pending' && (
                            <>
                              <button
                                className="btn btn-sm me-2"
                                style={{ background: '#10B981', color: 'white', borderRadius: '6px' }}
                                onClick={() => handleApproveProperty(property.id)}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-sm"
                                style={{ background: '#EF4444', color: 'white', borderRadius: '6px' }}
                                onClick={() => handleBlockProperty(property.id)}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {property.status === 'approved' && (
                            <button
                              className="btn btn-sm"
                              style={{ background: '#EF4444', color: 'white', borderRadius: '6px' }}
                              onClick={() => handleBlockProperty(property.id)}
                            >
                              Block
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Complaints Tab */}
        {!loading && activeTab === 'complaints' && (
          <div style={{
            background: '#0F1E33',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E2E8F0'
          }}>
            <h5 className="fw-bold mb-4" style={{ color: '#0F172A' }}>
              <i className="bi bi-exclamation-triangle me-2" style={{ color: '#EF4444' }}></i>
              Complaints ({complaints.length})
            </h5>

            {complaints.length === 0 ? (
              <div className="text-center py-5">
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: 'linear-gradient(135deg, #D1FAE520, #D1FAE510)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <i className="bi bi-check-circle" style={{ fontSize: '3rem', color: '#34D399' }}></i>
                </div>
                <h5 style={{ color: '#0F172A' }}>No complaints</h5>
                <p style={{ color: '#64748B', maxWidth: '400px', margin: '0 auto' }}>
                  Great! There are no pending complaints to review
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Property</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Complainant</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Issue</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Date</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Status</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map(complaint => (
                      <tr key={complaint.id}>
                        <td style={{ color: '#0F172A', fontWeight: '500' }}>{complaint.property_name || '-'}</td>
                        <td style={{ color: '#64748B' }}>{complaint.complainant_name || '-'}</td>
                        <td style={{ color: '#64748B', maxWidth: '200px' }}>{complaint.issue}</td>
                        <td style={{ color: '#64748B' }}>{formatDate(complaint.created_at)}</td>
                        <td>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            background: complaint.status === 'resolved' ? '#D1FAE5' : '#FEF3C7',
                            color: complaint.status === 'resolved' ? '#059669' : '#D97706'
                          }}>
                            {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          {complaint.status === 'open' && (
                            <button
                              className="btn btn-sm"
                              style={{ background: '#10B981', color: 'white', borderRadius: '6px' }}
                              onClick={() => handleResolveComplaint(complaint.id)}
                            >
                              Resolve
                            </button>
                          )}
                          {complaint.status === 'resolved' && (
                            <span style={{ color: '#64748B', fontSize: '0.9rem' }}>Closed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
