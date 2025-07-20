import React from 'react';
import '../cssfolder/Footer.css';
import { useNavigate } from "react-router-dom";


const Footer = () => {
      const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          
          {/* Company Info */}
          <div className="footer-section">
            <h3 className="footer-title">EcoSajha   Recycle</h3>
            <p className="footer-text">
              Making the world cleaner, one recyclable at a time. Join us in creating a sustainable future.
            </p>
            <div className="footer-social">
              <a onClick={() => { navigate('/')}} className="footer-link">
                <svg className="footer-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
             
              <a onClick={() => { navigate('/')}} className="footer-link">
                <svg className="footer-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.74.097.118.11.221.081.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.747-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a onClick={() => { navigate('/')}} className="footer-link footer-text-small">Home</a>
              </li>
              <li>
                <a onClick={() => { navigate('/about')}} className="footer-link footer-text-small">About Us</a>
              </li>
              <li>
                <a onClick={() => { navigate('/services')}} className="footer-link footer-text-small">Services</a>
              </li>
              <li>
                <a onClick={() => { navigate('/contact')}} className="footer-link footer-text-small">Contact</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Contact Us</h4>
            <div>
              <p className="footer-text-small footer-contact-info">
                📍 dilibazar Street<br />
                Kathmandu, ward no 31
              </p>
              <p className="footer-text-small footer-contact-info">📞 +977 9742869215</p>
              <p className="footer-text-small footer-contact-info">✉️ ecosajha123@gmail.com</p>
              <p className="footer-text-small footer-contact-info">
                🕒 Mon-Fri: 8AM-6PM<br />
                Sat: 9AM-4PM
              </p>
            </div>
          </div>

        </div>
        {/* <hr/> <hr /> */}

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 EcoRecycle. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a   onClick={() => { navigate('/')}} className="footer-link footer-text-small">Privacy Policy</a>
            <a onClick={() => { navigate('/')}} className="footer-link footer-text-small">Terms of Service</a>
            <a onClick={() => { navigate('/')}} className="footer-link footer-text-small">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
