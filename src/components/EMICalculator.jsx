import React, { useState, useEffect } from 'react';

const EMICalculator = ({ propertyPrice, onClose }) => {
    const [principal, setPrincipal] = useState(propertyPrice ? parseInt(propertyPrice.replace(/[₹,Crores]/g, '').trim()) * 10000000 : 5000000);
    const [interestRate, setInterestRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);
    const [emi, setEmi] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);

    useEffect(() => {
        calculateEMI();
    }, [principal, interestRate, tenure]);

    const calculateEMI = () => {
        const P = principal;
        const R = interestRate / 12 / 100;
        const N = tenure * 12;

        if (R === 0) {
            const monthlyEMI = P / N;
            setEmi(Math.round(monthlyEMI));
            setTotalPayment(Math.round(P));
            setTotalInterest(0);
        } else {
            const monthlyEMI = P * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1);
            const totalPay = monthlyEMI * N;
            const totalInt = totalPay - P;

            setEmi(Math.round(monthlyEMI));
            setTotalPayment(Math.round(totalPay));
            setTotalInterest(Math.round(totalInt));
        }
    };

    const formatCurrency = (amount) => {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(2)} Cr`;
        } else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(2)} Lac`;
        } else {
            return `₹${amount.toLocaleString('en-IN')}`;
        }
    };

    const principalPercentage = (principal / totalPayment) * 100 || 50;
    const interestPercentage = (totalInterest / totalPayment) * 100 || 50;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
        }}>
            <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                    padding: '24px',
                    borderRadius: '24px 24px 0 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h4 style={{ color: '#FFFFFF', margin: 0, fontWeight: '700' }}>
                            <i className="bi bi-calculator me-2" style={{ color: '#C8A24A' }}></i>
                            EMI Calculator
                        </h4>
                        <p style={{ color: 'rgba(255,255,255,0.6)', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
                            Plan your home loan payments
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: 'white',
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div style={{ padding: '24px' }}>
                    {/* Loan Amount Slider */}
                    <div style={{ marginBottom: '28px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label style={{ color: '#64748B', fontWeight: '500' }}>Loan Amount</label>
                            <span style={{
                                background: 'linear-gradient(135deg, #C8A24A20, #C8A24A10)',
                                color: '#9E7C2F',
                                padding: '6px 14px',
                                borderRadius: '8px',
                                fontWeight: '700',
                                fontSize: '1rem'
                            }}>
                                {formatCurrency(principal)}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="500000"
                            max="100000000"
                            step="100000"
                            value={principal}
                            onChange={(e) => setPrincipal(parseInt(e.target.value))}
                            style={{
                                width: '100%',
                                height: '8px',
                                borderRadius: '4px',
                                background: `linear-gradient(to right, #C8A24A 0%, #C8A24A ${(principal - 500000) / (100000000 - 500000) * 100}%, #E2E8F0 ${(principal - 500000) / (100000000 - 500000) * 100}%, #E2E8F0 100%)`,
                                appearance: 'none',
                                cursor: 'pointer'
                            }}
                        />
                        <div className="d-flex justify-content-between mt-1">
                            <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>₹5 Lac</span>
                            <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>₹10 Cr</span>
                        </div>
                    </div>

                    {/* Interest Rate Slider */}
                    <div style={{ marginBottom: '28px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label style={{ color: '#64748B', fontWeight: '500' }}>Interest Rate (p.a.)</label>
                            <span style={{
                                background: 'linear-gradient(135deg, #3B82F620, #3B82F610)',
                                color: '#2563EB',
                                padding: '6px 14px',
                                borderRadius: '8px',
                                fontWeight: '700',
                                fontSize: '1rem'
                            }}>
                                {interestRate}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="15"
                            step="0.1"
                            value={interestRate}
                            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                            style={{
                                width: '100%',
                                height: '8px',
                                borderRadius: '4px',
                                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(interestRate - 5) / 10 * 100}%, #E2E8F0 ${(interestRate - 5) / 10 * 100}%, #E2E8F0 100%)`,
                                appearance: 'none',
                                cursor: 'pointer'
                            }}
                        />
                        <div className="d-flex justify-content-between mt-1">
                            <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>5%</span>
                            <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>15%</span>
                        </div>
                    </div>

                    {/* Loan Tenure Slider */}
                    <div style={{ marginBottom: '32px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label style={{ color: '#64748B', fontWeight: '500' }}>Loan Tenure</label>
                            <span style={{
                                background: 'linear-gradient(135deg, #10B98120, #10B98110)',
                                color: '#059669',
                                padding: '6px 14px',
                                borderRadius: '8px',
                                fontWeight: '700',
                                fontSize: '1rem'
                            }}>
                                {tenure} Years
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="30"
                            step="1"
                            value={tenure}
                            onChange={(e) => setTenure(parseInt(e.target.value))}
                            style={{
                                width: '100%',
                                height: '8px',
                                borderRadius: '4px',
                                background: `linear-gradient(to right, #10B981 0%, #10B981 ${(tenure - 1) / 29 * 100}%, #E2E8F0 ${(tenure - 1) / 29 * 100}%, #E2E8F0 100%)`,
                                appearance: 'none',
                                cursor: 'pointer'
                            }}
                        />
                        <div className="d-flex justify-content-between mt-1">
                            <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>1 Year</span>
                            <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>30 Years</span>
                        </div>
                    </div>

                    {/* EMI Result */}
                    <div style={{
                        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                        borderRadius: '16px',
                        padding: '24px',
                        textAlign: 'center',
                        marginBottom: '24px'
                    }}>
                        <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 8px 0', fontSize: '0.9rem' }}>
                            Your Monthly EMI
                        </p>
                        <h2 style={{
                            color: '#C8A24A',
                            margin: 0,
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            textShadow: '0 2px 10px rgba(200,162,74,0.3)'
                        }}>
                            ₹{emi.toLocaleString('en-IN')}
                        </h2>
                    </div>

                    {/* Payment Breakdown */}
                    <div className="row g-3 mb-4">
                        <div className="col-6">
                            <div style={{
                                background: '#F8FAFC',
                                borderRadius: '12px',
                                padding: '16px',
                                textAlign: 'center',
                                border: '1px solid #E2E8F0'
                            }}>
                                <p style={{ color: '#64748B', margin: '0 0 4px 0', fontSize: '0.85rem' }}>Total Interest</p>
                                <h5 style={{ color: '#EF4444', margin: 0, fontWeight: '700' }}>{formatCurrency(totalInterest)}</h5>
                            </div>
                        </div>
                        <div className="col-6">
                            <div style={{
                                background: '#F8FAFC',
                                borderRadius: '12px',
                                padding: '16px',
                                textAlign: 'center',
                                border: '1px solid #E2E8F0'
                            }}>
                                <p style={{ color: '#64748B', margin: '0 0 4px 0', fontSize: '0.85rem' }}>Total Payment</p>
                                <h5 style={{ color: '#0F172A', margin: 0, fontWeight: '700' }}>{formatCurrency(totalPayment)}</h5>
                            </div>
                        </div>
                    </div>

                    {/* Visual Breakdown Bar */}
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '8px' }}>Payment Breakdown</p>
                        <div style={{
                            display: 'flex',
                            height: '12px',
                            borderRadius: '6px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${principalPercentage}%`,
                                background: 'linear-gradient(90deg, #10B981, #059669)',
                                transition: 'width 0.3s ease'
                            }}></div>
                            <div style={{
                                width: `${interestPercentage}%`,
                                background: 'linear-gradient(90deg, #EF4444, #DC2626)',
                                transition: 'width 0.3s ease'
                            }}></div>
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                            <span style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: '600' }}>
                                <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>
                                Principal ({principalPercentage.toFixed(0)}%)
                            </span>
                            <span style={{ color: '#EF4444', fontSize: '0.8rem', fontWeight: '600' }}>
                                <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>
                                Interest ({interestPercentage.toFixed(0)}%)
                            </span>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <p style={{
                        color: '#94A3B8',
                        fontSize: '0.75rem',
                        textAlign: 'center',
                        margin: 0,
                        padding: '12px',
                        background: '#F8FAFC',
                        borderRadius: '8px'
                    }}>
                        <i className="bi bi-info-circle me-1"></i>
                        This is an approximate calculation. Actual EMI may vary based on the lender's terms.
                    </p>
                </div>

                {/* Custom range input styles */}
                <style>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            background: #FFFFFF;
            border: 3px solid #C8A24A;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            transition: all 0.2s ease;
          }
          
          input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(200,162,74,0.4);
          }
          
          input[type="range"]::-moz-range-thumb {
            width: 24px;
            height: 24px;
            background: #FFFFFF;
            border: 3px solid #C8A24A;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          }
        `}</style>
            </div>
        </div>
    );
};

export default EMICalculator;
