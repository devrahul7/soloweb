import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../cssfolder/Navbar.css';

export default function EcoSajhaNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/login', label: 'Login' },
    { path: '/register', label: 'Register' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="ecosajha-navbar">
      <div className="ecosajha-navbar-container">
        {/* Logo */}
        <div 
          className="ecosajha-logo-wrapper"
          onClick={() => handleNavigation('/')}
        >
          <img 
            src="/logo.png" 
            alt="EcoSajha" 
            className="ecosajha-logo-icon"
          />
          <span className="ecosajha-logo-text">EcoSajha Recycle</span>
        </div>

        {/* Desktop Navigation */}
        <div className="ecosajha-nav-desktop">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`ecosajha-nav-link ${
                location.pathname === item.path ? 'ecosajha-nav-link-active' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="ecosajha-menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="ecosajha-menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`ecosajha-mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="ecosajha-mobile-nav-links">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`ecosajha-mobile-nav-link ${
                location.pathname === item.path ? 'ecosajha-mobile-nav-link-active' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
