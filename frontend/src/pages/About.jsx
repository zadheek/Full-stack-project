import React from 'react';
import './About.css';

export default function AboutUs() {
  return (
    <div className="about-page-container">
      <div className="about-hero-section">
        <div 
          className="about-hero-background"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200)',
          }}
        ></div>
        <div className="about-hero-content">
          <h1 className="about-hero-title">About Us</h1>
        </div>
      </div>

      <div className="about-main-content">
        <div className="about-story-section">
          <div className="about-image-collage">
            <div className="about-image-card about-image-card-1">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop" 
                alt="Professional woman"
              />
            </div>
            <div className="about-image-card about-image-card-2">
              <img 
                src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&h=500&fit=crop" 
                alt="Business meeting"
              />
            </div>
            <div className="about-image-card about-image-card-3">
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop" 
                alt="Money"
              />
            </div>
            
            <div className="about-experience-badge">
              <div className="about-badge-number">5+</div>
              <div className="about-badge-text">Years of</div>
              <div className="about-badge-text">Experience</div>
            </div>
          </div>

          <div className="about-story-content">
            <h2 className="about-story-title">
              Get to know the <span className="about-highlight">story behind</span>
            </h2>
            <h2 className="about-story-subtitle">MovieNest</h2>
            
            <p className="about-story-description">
              MovieNest is your trusted, locally-driven platform designed to make movie ticket booking 
              effortless and enjoyable. Built with a passion for cinema and convenience, our dedicated 
              team ensures every booking is handled with care and accuracy. With a strong focus on 
              supporting local businesses and venues, we take pride in connecting you to the silver films and 
              theaters with speed and efficiency. As MovieNest, we believe in turning every movie night 
              into a seamless experience, giving you more time to enjoy the films and less time on the 
              screen.
            </p>

            <div className="about-features-list">
              <div className="about-feature-item">
                <svg className="about-check-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>Instant Booking Confirmed</span>
              </div>
              <div className="about-feature-item">
                <svg className="about-check-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>Secure Payment Guaranteed</span>
              </div>
              <div className="about-feature-item">
                <svg className="about-check-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>Family-Friendly Experience</span>
              </div>
            </div>

            <button className="about-cta-button">
              Book Your Ticket
            </button>
          </div>
        </div>

        <div className="about-stats-section">
          <h2 className="about-stats-title">
            Elevate Your Movie Booking Experience
          </h2>

          <div className="about-stats-grid">
            <div className="about-stat-item">
              <div className="about-stat-number">12K+</div>
              <div className="about-stat-label">Movies</div>
            </div>
            <div className="about-stat-item">
              <div className="about-stat-number">150M+</div>
              <div className="about-stat-label">Tickets</div>
            </div>
            <div className="about-stat-item">
              <div className="about-stat-number">25K+</div>
              <div className="about-stat-label">Users</div>
            </div>
            <div className="about-stat-item">
              <div className="about-stat-number">7+</div>
              <div className="about-stat-label">Theaters</div>
            </div>
            <div className="about-stat-item">
              <div className="about-stat-number">1.2M+</div>
              <div className="about-stat-label">Bookings</div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-goal-section">
        <div className="about-goal-content">
          <div className="about-goal-grid">
            <div className="about-goal-text">
              <h2 className="about-goal-title">Our Goal</h2>
              <p className="about-goal-subtitle">What Drives Us at MovieNest</p>
              
              <p className="about-goal-description">
                The goal of MovieNest is to provide a seamless, secure, and enjoyable way for individuals to book movie tickets without the hassle of queues or complicated processes. By offering a simple booking platform, MovieNest aims to cater to the entertainment needs of users with a focus on convenience, speed, and satisfaction.
              </p>

              <ul className="about-goal-list">
                <li className="about-goal-item">
                  <span className="about-bullet">•</span>
                  <span><strong>Simplify Movie Access:</strong> Allow users to check and book tickets instantly from their preferred theaters, eliminating the need for physical visits or long waits.</span>
                </li>
                <li className="about-goal-item">
                  <span className="about-bullet">•</span>
                  <span><strong>Ensure Secure Payments:</strong> Implement advanced security measures to protect user data and guarantee safe, hassle-free transactions.</span>
                </li>
                <li className="about-goal-item">
                  <span className="about-bullet">•</span>
                  <span><strong>Deliver Exceptional Experience:</strong> Provide a smooth and timely booking process, meeting expectations in terms of speed, accuracy, and ease of use.</span>
                </li>
                <li className="about-goal-item">
                  <span className="about-bullet">•</span>
                  <span><strong>Build Trust and Community:</strong> Establish MovieNest as a trusted and dependable platform for all movie lovers, fostering long-term relationships and shared cinematic experiences.</span>
                </li>
              </ul>
            </div>

            <div className="about-goal-image-container">
              <div className="about-goal-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600&h=600&fit=crop" 
                  alt="Cinema elements" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}