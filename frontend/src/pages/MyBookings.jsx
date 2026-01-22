import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [isAuthenticated, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingsAPI.cancelBooking(bookingId);
      alert('Booking cancelled successfully!');
      fetchBookings();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to cancel booking'));
    }
  };

  const viewReceipt = (booking) => {
    navigate(`/receipt/${booking._id}`);
  };

  const downloadReceipt = (booking) => {
    const receiptContent = `
CINEMA BOOKING RECEIPT
═══════════════════════════════════════

Booking Reference: ${booking.bookingReference}
Date: ${new Date(booking.bookingDate).toLocaleDateString()}

MOVIE DETAILS
───────────────────────────────────────
Title: ${booking.movie?.title}
Show Date: ${new Date(booking.show?.showDate).toLocaleDateString()}
Show Time: ${booking.show?.showTime}
Screen: ${booking.show?.screen}

SEAT INFORMATION
───────────────────────────────────────
Seats: ${booking.seats.map(s => s.seatNumber).join(', ')}
Number of Seats: ${booking.seats.length}

PAYMENT DETAILS
───────────────────────────────────────
Total Amount: $${booking.totalAmount.toFixed(2)}
Payment Method: ${booking.paymentMethod}
Payment Status: ${booking.paymentStatus}
Booking Status: ${booking.status}

═══════════════════════════════════════
Thank you for your booking!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-${booking.bookingReference}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return booking.status === 'confirmed' || booking.status === 'pending';
    if (filter === 'completed') return booking.status === 'completed';
    if (filter === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  return (
    <div className="bookings-page">
      <div className="bookings-wrapper">
        <h1>My Bookings</h1>
        
        <div className="filters">
          <button 
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button 
            className={filter === 'cancelled' ? 'active' : ''}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="empty">
            <h2>No bookings found</h2>
            <p>You haven't made any bookings yet.</p>
            <button onClick={() => navigate('/movies')}>Browse Movies</button>
          </div>
        ) : (
          <div className="bookings-grid">
            {filteredBookings.map(booking => (
              <div key={booking._id} className="booking-card">
                <div className="card-content">
                  <img 
                    src={booking.movie?.images?.[0]?.url || 'https://via.placeholder.com/150x225'} 
                    alt={booking.movie?.title}
                    className="poster"
                  />

                  <div className="details">
                    <h3>{booking.movie?.title}</h3>
                    
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="label">Date</span>
                        <span className="value">
                          {new Date(booking.show?.showDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="info-item">
                        <span className="label">Time</span>
                        <span className="value">{booking.show?.showTime}</span>
                      </div>

                      <div className="info-item">
                        <span className="label">Screen</span>
                        <span className="value">{booking.show?.screen}</span>
                      </div>

                      <div className="info-item">
                        <span className="label">Seats</span>
                        <span className="value">
                          {booking.seats.map(s => s.seatNumber).join(', ')}
                        </span>
                      </div>

                      <div className="info-item">
                        <span className="label">Reference</span>
                        <span className="value ref">{booking.bookingReference}</span>
                      </div>

                      <div className="info-item">
                        <span className="label">Amount</span>
                        <span className="value price">Rs. {booking.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="badges">
                      <span className={`badge ${booking.status}`}>
                        {booking.status}
                      </span>
                      <span className={`badge ${booking.paymentStatus}`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="actions">
                  <button onClick={() => viewReceipt(booking)}>
                    View Receipt
                  </button>
                  <button onClick={() => downloadReceipt(booking)}>
                    Download
                  </button>
                  {(booking.status === 'pending' || booking.status === 'confirmed') && (
                    <button 
                      className="cancel"
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;