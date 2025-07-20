import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import dustbinImage from '../assets/dustbin.png';
import Footer from '../components/Footer';
import '../cssfolder/Aboutpage.css';

const Aboutpage = () => {
  const navigate = useNavigate();

  // Enhanced benefits data
  const benefits = [
    {
      icon: '🌍',
      title: 'Eco-Friendly',
      description: 'Help reduce environmental impact through proper waste management and sustainable practices',
      color: '#4CAF50'
    },
    {
      icon: '🚚',
      title: 'Convenient',
      description: 'Schedule pickups at your convenience from your doorstep with flexible timing',
      color: '#2196F3'
    },
    {
      icon: '💰',
      title: 'Earn Money',
      description: 'Get paid competitive rates for your recyclable waste materials instantly',
      color: '#FF9800'
    },
    {
      icon: '⚡',
      title: 'Fast Service',
      description: 'Quick response time with same-day pickup available in most areas',
      color: '#9C27B0'
    },
    {
      icon: '🔒',
      title: 'Secure & Safe',
      description: 'Licensed professionals handle your waste responsibly with full insurance coverage',
      color: '#607D8B'
    },
    {
      icon: '📱',
      title: 'Smart Tracking',
      description: 'Track your pickup status and earnings in real-time through our mobile app',
      color: '#795548'
    }
  ];

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationDelay = `${entry.target.dataset.delay}ms`;
            entry.target.classList.add('ecosajha-animate-card');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe benefit cards
    document.querySelectorAll('.ecosajha-benefit-card').forEach((card, index) => {
      card.dataset.delay = index * 150;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const styles = {
    ecosajhaContainer: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'Arial, sans-serif'
    },
    ecosajhaHowItWorksSection: {
      padding: '3rem 1rem',
      textAlign: 'center'
    },
    ecosajhaSectionContainer: {
      maxWidth: '1000px', // Reduced from 1280px
      margin: '0 auto'
    },
    ecosajhaSectionTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '2rem',
      background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    ecosajhaImagePlaceholder: {
      maxWidth: '800px', // Reduced from 1190px
      margin: '0 auto',
      padding: '0 1rem'
    },
    ecosajhaImageStyle: {
      width: '100%',
      maxWidth: '750px', // Added max-width constraint
      height: 'auto',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      border: '2px solid #e8f5e8',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    }
  };

  return (
    <>
      <Navbar/>
      <div style={styles.ecosajhaContainer}>
        
        {/* Enhanced Hero Section */}
        <section className="ecosajha-hero-section">
          <div className="ecosajha-hero-content-wrapper">
            <h1>Waste Collection Made Easy</h1>
            <p>Schedule a pickup for your waste</p>
            
            <div className="ecosajha-hero-action-buttons">
              <button 
                onClick={() => navigate('/login')} 
                className="ecosajha-request-pickup-btn"
              >
                Request Pickup
              </button>
              <button 
                className="ecosajha-what-we-buy-btn" 
                onClick={() => { navigate('/')}}
              >
                What We Buy
              </button>
            </div>

            {/* Service Highlights - Fixed positioning */}
            <div className="ecosajha-service-highlights-container">
              <div className="ecosajha-service-highlight-card">
                <div className="ecosajha-service-icon-wrapper">
                  <span>📞</span>
                </div>
                <h3>Quick Booking</h3>
                <p>Schedule in 2 minutes</p>
              </div>
              <div className="ecosajha-service-highlight-card">
                <div className="ecosajha-service-icon-wrapper">
                  <span>🚚</span>
                </div>
                <h3>Free Pickup</h3>
                <p>No hidden charges</p>
              </div>
              <div className="ecosajha-service-highlight-card">
                <div className="ecosajha-service-icon-wrapper">
                  <span>💰</span>
                </div>
                <h3>Instant Payment</h3>
                <p>Get paid immediately</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section - With reduced image size */}
        <section style={styles.ecosajhaHowItWorksSection}>
          <div style={styles.ecosajhaSectionContainer}>
            <h2 style={styles.ecosajhaSectionTitle}>How it works</h2>
            <div style={styles.ecosajhaImagePlaceholder}>
              <img 
                src="/src/assets/ecosajhawork.png" 
                alt="How it works process" 
                style={styles.ecosajhaImageStyle} 
              />
            </div>
          </div>
        </section>

        {/* Enhanced Why EcoSajha Section */}
        <section className="ecosajha-benefits-section">
          <div className="ecosajha-benefits-container">
            <h2 className="ecosajha-benefits-title">Why Choose EcoSajha?</h2>
            <p className="ecosajha-benefits-subtitle">
              Experience the difference with our comprehensive Recycling management solution
            </p>
            <div className="ecosajha-benefits-grid-layout">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="ecosajha-benefit-card"
                  style={{ '--card-color': benefit.color }}
                >
                  <div className="ecosajha-benefit-icon-container">
                    <span>{benefit.icon}</span>
                  </div>
                  <h3 className="ecosajha-benefit-card-title">{benefit.title}</h3>
                  <p className="ecosajha-benefit-card-description">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer/>
      </div>
    </>
  );
};

export default Aboutpage;
