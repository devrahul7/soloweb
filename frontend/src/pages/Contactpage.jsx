import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import '../cssfolder/ContactPage.css';
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        setTimeout(() => {
            alert(`Thank you, ${formData.name}! Your message has been received. We'll get back to you soon.`);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <>
            <Navbar />
            <div className="contact-page-container">
                {/* Hero Section */}
                <section className="contact-hero">
                    <div className="hero-content">
                        <h1>Contact Page</h1>
                        <p>Get in touch with EcoSajha - Your trusted recycling partner</p>
                        <div className="hero-decoration">
                            <span className="eco-icon">🌱</span>
                            <span className="eco-icon">♻️</span>
                            <span className="eco-icon">🌍</span>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <section className="contact-content">
                    <div className="contact-grid">
                        {/* Contact Form */}
                        <div className="form-section">
                            <div className="form-header">
                                <h2>Send us a Message</h2>
                                <p>We'd love to hear from you! Fill out the form below and we'll respond as soon as possible.</p>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email Address *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="subject">Subject *</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="What's this about?"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="6"
                                        placeholder="Tell us more about your inquiry..."
                                        required
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="btn-content">
                                            <span className="spinner"></span>
                                            Sending...
                                        </span>
                                    ) : (
                                        <span className="btn-content">
                                            Send Message
                                            <span className="btn-arrow">→</span>
                                        </span>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="info-section">
                            <div className="contact-cards">
                                <div className="contact-card">
                                    <div className="card-icon">📧</div>
                                    <h3>Email Us</h3>
                                    <p>support@ecosajha.com</p>
                                    <p>info@ecosajha.com</p>
                                </div>

                                <div className="contact-card">
                                    <div className="card-icon">📞</div>
                                    <h3>Call Us</h3>
                                    <p>+977 1234 567890</p>
                                    <p>+977 9876 543210</p>
                                </div>

                                <div className="contact-card">
                                    <div className="card-icon">📍</div>
                                    <h3>Visit Us</h3>
                                    <p>123 Eco Street</p>
                                    <p>Green City, Nepal</p>
                                </div>

                                <div className="contact-card">
                                    <div className="card-icon">🕒</div>
                                    <h3>Working Hours</h3>
                                    <p>Mon - Fri: 8:00 AM - 6:00 PM</p>
                                    <p>Sat: 9:00 AM - 4:00 PM</p>
                                </div>
                            </div>

                            <div className="additional-info">
                                <h3>Quick Response Guarantee</h3>
                                <p>We respond to all inquiries within 24 hours. For urgent matters, please call us directly.</p>
                                
                             
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}
