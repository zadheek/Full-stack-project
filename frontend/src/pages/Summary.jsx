import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Summary.css';

const Summary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { show, selectedSeats } = location.state || {};

  // Redirect if no booking data
  if (!show || !selectedSeats) {
    navigate('/movies');
    return null;
  }

  // Calculate prices
  const ticketPrice = show.price;
  const numberOfSeats = selectedSeats.length;
  const subtotal = ticketPrice * numberOfSeats;
  const tax = subtotal * 0.18; // 18% tax
  const finalTotal = subtotal + tax;

  const handleProceedToPayment = () => {
    navigate('/payment', { 
      state: { 
        show, 
        selectedSeats, 
        totalAmount: finalTotal 
      } 
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="summary-page">
      <div className="summary-container">
        {/* Page Header */}
        <div className="summary-header">
          <h1>Booking Summary</h1>
          <p>Review your booking details before payment</p>
        </div>

        {/* Main Content Grid */}
        <div className="summary-content">
          {/* Left Column - Movie & Seats Details */}
          <div className="summary-left">
            
            {/* Movie Details Card */}
            <div className="summary-card movie-card">
              <div className="card-header">
                <h2>Movie Details</h2>
              </div>
              <div className="movie-info">
                <div className="summary-info-row">
                  <span className="label">Movie</span>
                  <span className="value">{show.movie?.title}</span>
                </div>
                <div className="summary-info-row">
                  <span className="label">Date</span>
                  <span className="value">
                    {new Date(show.showDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="summary-info-row">
                  <span className="label">Time</span>
                  <span className="value">{show.showTime}</span>
                </div>
                <div className="summary-info-row">
                  <span className="label">Screen</span>
                  <span className="value">{show.screen}</span>
                </div>
              </div>
            </div>

            {/* Seats Card */}
            <div className="summary-card seats-card">
              <div className="card-header">
                <h2>Selected Seats</h2>
              </div>
              <div className="seats-grid">
                {selectedSeats.map((seat, index) => (
                  <div key={index} className="seat-chip">
                    {seat.seatNumber}
                  </div>
                ))}
              </div>
              <div className="seats-count">
                {numberOfSeats} {numberOfSeats === 1 ? 'Seat' : 'Seats'} Selected
              </div>
            </div>

          </div>

          {/* Right Column - Price Summary */}
          <div className="summary-right">
            <div className="summary-card price-card">
              <div className="card-header">
                <h2>Payment Summary</h2>
              </div>

              {/* Price Breakdown */}
              <div className="price-details">
                <div className="price-item">
                  <span className="price-label">
                    Ticket Price × {numberOfSeats}
                  </span>
                  <span className="price-value">Rs. {ticketPrice.toFixed(2)}</span>
                </div>

                <div className="price-item">
                  <span className="price-label">Subtotal</span>
                  <span className="price-value">Rs. {subtotal.toFixed(2)}</span>
                </div>

                <div className="price-item">
                  <span className="price-label">Tax & Fees (18%)</span>
                  <span className="price-value">Rs. {tax.toFixed(2)}</span>
                </div>

                <div className="price-divider"></div>

                <div className="price-item total">
                  <span className="price-label">Total Amount</span>
                  <span className="price-value">Rs. {finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="btn-back" onClick={handleBack}>
                  ← Back
                </button>
                <button className="btn-proceed" onClick={handleProceedToPayment}>
                  Continue
                </button>
              </div>

              {/* Security Note */}
              <div className="payment-note">
                <p>Your payment information is secure and encrypted</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Summary;