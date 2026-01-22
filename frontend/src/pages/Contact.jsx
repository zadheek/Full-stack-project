import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });

  const handleSubmit = () => {
    if (formData.fullName && formData.email && formData.message) {
      console.log('Form submitted:', formData);
      alert('Thank you for contacting us! We will get back to you soon.');
      setFormData({ fullName: '', email: '', message: '' });
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact-page">
      {/* Hero Banner */}
      <div className="contact-hero">
        <div className="contact-hero-bg"></div>
        <div className="contact-hero-content">
          <h1>Contact Us</h1>
          <p className="contact-breadcrumb">
          </p>
        </div>
      </div>

      <div className="contact-container">
        {/* Support Cards */}
        <div className="support-cards">
          <div className="support-card">
            <div className="support-card-number">1</div>
            <h3>Customer Support</h3>
            <p>
              Need assistance with bookings, payments, or seat selection? Our support team is always ready.
            </p>
            <p>
              Enjoy a smooth and worry-free movie booking experience.
            </p>
            <p className="contact-info">+94 11 234 5678</p>
          </div>

          <div className="support-card">
            <div className="support-card-number">2</div>
            <h3>Business Inquiries</h3>
            <p>
              Are you a cinema or service partner looking to collaborate and expand your reach?
            </p>
            <p>
              Grow your reach with MOVIENEST.
            </p>
            <p className="contact-info">info.Movienest@gmail.com</p>
          </div>

          <div className="support-card">
            <div className="support-card-number">3</div>
            <h3>Feedback and Suggestions</h3>
            <p>
              We value your input! Share your feedback or suggestions on how we can improve MovieNest.
            </p>
            <p>
              Your opinions help us create a better platform and provide a better experience for everyone. Reach out to us with your thoughts and ideas.
            </p>
            <p className="contact-info">Fill below Form</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <h2 className="contact-form-title">Feel Free to Write us</h2>
          <h2 className="contact-form-subtitle">Anytime</h2>

          <div className="contact-form-wrapper">
            <div className="form-row">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="form-input"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Message</label>
              <textarea
                name="message"
                placeholder="Enter your message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className="form-textarea"
              ></textarea>
            </div>

            <p className="form-disclaimer">
              By submitting this form, You agree to the processing of the submitted personal data in accordance with{' '}
              <a href="/privacy">MovieNest Privacy Policy</a>, including the transfer of data to the Sri Lanka.
            </p>

            <p className="form-disclaimer">
              By submitting this form, you agree to receive information from MovieNest related to our services, events, and promotions. You may unsubscribe at any time by following the instructions in those communications.
            </p>

            <div className="form-submit-wrapper">
              <button onClick={handleSubmit} className="contact-submit-btn">
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="contact-info-cards">
          <div className="contact-info-card">
            <div className="contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h3>Visit Our location</h3>
            <p>123 Cinema Road, Colombo, Sri Lanka</p>
          </div>

          <div className="contact-info-card">
            <div className="contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>
            <h3>Send Us a Mail To</h3>
            <p>info.Movienest@support.com</p>
          </div>

          <div className="contact-info-card">
            <div className="contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <h3>Call for Services</h3>
            <p>(+880) 954-62-228-11</p>
            <p>(+880) 954-62-228-10</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;