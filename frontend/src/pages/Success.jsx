import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Success.css';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};

  if (!booking) {
    navigate('/movies');
    return null;
  }

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h2>Booking Confirmed!</h2>
        <p className="booking-ref">Booking Reference: {booking.bookingReference}</p>
        
        <div className="booking-details">
          <h3>Booking Details</h3>
          <p><strong>Movie:</strong> {booking.movie?.title}</p>
          <p><strong>Date:</strong> {new Date(booking.show?.showDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {booking.show?.showTime}</p>
          <p><strong>Screen:</strong> {booking.show?.screen}</p>
          <p><strong>Seats:</strong> {booking.seats.map(s => s.seatNumber).join(', ')}</p>
          <p className="total"><strong>Total Paid:</strong> ${booking.totalAmount}</p>
        </div>

        <div className="success-actions">
          <button 
            className="btn-primary" 
            onClick={() => navigate('/my-bookings')}
          >
            View My Bookings
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => navigate(`/receipt/${booking._id}`)}
          >
            View Receipt
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => navigate('/movies')}
          >
            Book More Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;