import React, { useState, useEffect } from 'react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <div 
          className="back-to-top animate__animated animate__fadeIn"
          onClick={scrollToTop}
          title="Back to Top"
        >
          <i className="bi bi-arrow-up" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}></i>
        </div>
      )}
    </>
  );
};

export default BackToTop;
