import React from 'react';
import './Footer.css';
import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Social Media Section */}
        <div className="social-section">
          <h3 className="social-title">Follow us on</h3>
          <div className="social-icons">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaLinkedin />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="footer-nav">
          <a href="/" className="footer-link">Home</a>
          <a href="/movies" className="footer-link">Explore</a>
          <a href="/about" className="footer-link">About</a>
          <a href="/contact" className="footer-link">Contact</a>
        </nav>

        {/* Copyright */}
        <div className="footer-copyright">
          <p>Copyright © 2026 - MOVIENEST</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;