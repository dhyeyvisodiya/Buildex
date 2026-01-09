import React, { useState, useEffect } from 'react';

const Home = ({ navigateTo }) => {
  // Animated counter hook
  const useCounter = (end, duration = 2000) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, [end, duration]);
    return count;
  };

  // Statistics
  const totalProperties = useCounter(500);
  const happyCustomers = useCounter(2500);
  const citiesCovered = useCounter(15);
  const verifiedBuilders = useCounter(120);

  // Testimonials data
  const testimonials = [
    { name: "Rahul Sharma", role: "Home Buyer", text: "Buildex made my dream of owning a home come true! The verification process gave me confidence.", rating: 5, image: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Priya Patel", role: "Investor", text: "Excellent platform for property investment. The comparison feature helped me make smart decisions.", rating: 5, image: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Amit Kumar", role: "Builder Partner", text: "As a builder, Buildex has helped us reach genuine buyers. Great partnership!", rating: 5, image: "https://randomuser.me/api/portraits/men/67.jpg" }
  ];

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section animate__animated animate__fadeIn" style={{
        background: 'linear-gradient(135deg, var(--charcoal-slate) 0%, #1E293B 50%, #0F172A 100%)',
        borderBottom: '1px solid var(--card-border)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* Animated background elements */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(200,162,74,0.1) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 6s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(200,162,74,0.08) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 8s ease-in-out infinite reverse' }} />

        <div className="container-fluid py-5" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="mb-3">
                <span style={{
                  background: 'linear-gradient(90deg, rgba(200,162,74,0.2), rgba(200,162,74,0.1))',
                  padding: '8px 16px',
                  borderRadius: '50px',
                  fontSize: '0.85rem',
                  color: '#C8A24A',
                  border: '1px solid rgba(200,162,74,0.3)'
                }}>
                  🏆 #1 Verified Real Estate Platform in India
                </span>
              </div>
              <h1 className="display-3 fw-bold mb-3 animate__animated animate__fadeInUp" style={{ lineHeight: 1.1 }}>
                Find Your <span style={{ background: 'linear-gradient(90deg, #C8A24A, #E6C86E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dream Home</span> Today
              </h1>
              <p className="lead mb-4 animate__animated animate__fadeInUp animate__delay-1s" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem' }}>
                Verified New Schemes & Smart Rental Management Platform. Discover properties from trusted builders with complete transparency.
              </p>

              <div className="d-flex gap-3 animate__animated animate__fadeInUp animate__delay-3s">
                <button
                  className="btn btn-primary px-4 py-3"
                  onClick={() => navigateTo('property-list', { purpose: 'Buy' })}
                  style={{
                    background: 'linear-gradient(90deg, var(--construction-gold), var(--deep-bronze))',
                    border: 'none',
                    color: 'var(--primary-text)',
                    boxShadow: '0 4px 20px rgba(158, 124, 47, 0.4)',
                    transition: 'all 0.3s ease',
                    borderRadius: '12px',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(158, 124, 47, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 20px rgba(158, 124, 47, 0.4)';
                  }}
                >
                  <i className="bi bi-house-door me-2"></i>Buy Property
                </button>
                <button
                  className="btn px-4 py-3"
                  onClick={() => navigateTo('property-list', { purpose: 'Rent' })}
                  style={{
                    border: '2px solid var(--construction-gold)',
                    color: 'var(--construction-gold)',
                    background: 'transparent',
                    transition: 'all 0.3s ease',
                    borderRadius: '12px',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(200,162,74,0.1)';
                    e.target.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="bi bi-key me-2"></i>Rent Property
                </button>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div className="hero-image-container animate__animated animate__fadeInRight" style={{
                height: '450px',
                overflow: 'hidden',
                borderRadius: '24px',
                backgroundImage: "url('/images/hero.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
              }}>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Statistics Counter Section */}
      <section className="stats-section py-5" style={{
        background: 'linear-gradient(135deg, var(--charcoal-slate) 0%, #1E293B 100%)',
        position: 'relative'
      }}>
        <div className="container-fluid">
          <div className="row g-4 text-center">
            <div className="col-md-3 col-6">
              <div className="stat-card p-4" style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(200,162,74,0.2)'
              }}>
                <div className="d-flex justify-content-center mb-3">
                  <div style={{
                    background: 'linear-gradient(135deg, #C8A24A, #9E7C2F)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-building fs-4" style={{ color: '#0F172A' }}></i>
                  </div>
                </div>
                <h2 className="fw-bold mb-1" style={{ color: '#C8A24A', fontSize: '2.5rem' }}>{totalProperties}+</h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>Properties Listed</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card p-4" style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(200,162,74,0.2)'
              }}>
                <div className="d-flex justify-content-center mb-3">
                  <div style={{
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-people-fill fs-4 text-white"></i>
                  </div>
                </div>
                <h2 className="fw-bold mb-1" style={{ color: '#10B981', fontSize: '2.5rem' }}>{happyCustomers}+</h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>Happy Customers</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card p-4" style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(200,162,74,0.2)'
              }}>
                <div className="d-flex justify-content-center mb-3">
                  <div style={{
                    background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-geo-alt-fill fs-4 text-white"></i>
                  </div>
                </div>
                <h2 className="fw-bold mb-1" style={{ color: '#3B82F6', fontSize: '2.5rem' }}>{citiesCovered}+</h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>Cities Covered</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card p-4" style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(200,162,74,0.2)'
              }}>
                <div className="d-flex justify-content-center mb-3">
                  <div style={{
                    background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-shield-check fs-4 text-white"></i>
                  </div>
                </div>
                <h2 className="fw-bold mb-1" style={{ color: '#8B5CF6', fontSize: '2.5rem' }}>{verifiedBuilders}+</h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>Verified Builders</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="features-section py-5 animate__animated animate__fadeIn" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="container-fluid">
          <div className="text-center mb-5">
            <span style={{ color: '#C8A24A', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Why Choose Us
            </span>
            <h2 className="fw-bold mt-2" style={{ color: 'var(--primary-text)' }}>Why Choose Buildex?</h2>
          </div>
          <div className="row g-4">
            {[
              { icon: 'bi-shield-check', title: 'Verified Builders', desc: 'All our builders are verified for authenticity and reliability.', color: '#10B981' },
              { icon: 'bi-house-door', title: 'New Schemes Only', desc: 'Access to latest property schemes and upcoming projects.', color: '#3B82F6' },
              { icon: 'bi-camera-video', title: '360° Virtual Tour', desc: 'Experience properties virtually with our immersive technology.', color: '#8B5CF6' },
              { icon: 'bi-graph-up-arrow', title: 'Smart Rent Management', desc: 'Efficiently manage your rental properties with our tools.', color: '#F59E0B' }
            ].map((feature, index) => (
              <div className="col-lg-3 col-md-6" key={index}>
                <div className="feature-card text-center p-4 rounded h-100" style={{
                  backgroundColor: 'var(--card-bg)',
                  boxShadow: 'var(--card-shadow)',
                  border: 'none',
                  transition: 'all 0.3s ease',
                  borderRadius: '16px'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(15, 23, 42, 0.12)';
                    e.currentTarget.style.borderColor = feature.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.06)';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                  }}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}10)`,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <i className={`bi ${feature.icon} fs-3`} style={{ color: feature.color }}></i>
                  </div>
                  <h5 className="fw-bold" style={{ color: 'var(--primary-text)' }}>{feature.title}</h5>
                  <p style={{ color: 'var(--secondary-text)', margin: 0 }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works py-5" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="container-fluid">
          <div className="text-center mb-5">
            <span style={{ color: '#C8A24A', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Simple Process
            </span>
            <h2 className="fw-bold mt-2" style={{ color: 'var(--primary-text)' }}>How Buildex Works</h2>
          </div>
          <div className="row g-4">
            {[
              { step: 1, icon: 'bi-search', title: 'Browse Properties', desc: 'Explore our curated collection of verified properties for sale or rent.' },
              { step: 2, icon: 'bi-chat-dots', title: 'Connect with Builders', desc: 'Direct communication with verified builders and property managers.' },
              { step: 3, icon: 'bi-check-circle', title: 'Close the Deal', desc: 'Complete your transaction with our secure and transparent process.' }
            ].map((item, index) => (
              <div className="col-md-4" key={index}>
                <div className="step-card p-4 rounded text-center h-100" style={{
                  backgroundColor: 'var(--card-bg)',
                  boxShadow: 'var(--card-shadow)',
                  border: 'none',
                  transition: 'all 0.3s ease',
                  borderRadius: '16px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(15, 23, 42, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.06)';
                  }}>
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    fontSize: '6rem',
                    fontWeight: '800',
                    color: 'rgba(200,162,74,0.08)'
                  }}>{item.step}</div>

                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #C8A24A, #9E7C2F)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <i className={`bi ${item.icon} fs-4`} style={{ color: '#0F172A' }}></i>
                  </div>
                  <h5 className="fw-bold" style={{ color: 'var(--primary-text)' }}>{item.title}</h5>
                  <p style={{ color: 'var(--secondary-text)', margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
};

export default Home;
