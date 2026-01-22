import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import './Receipt.css';

const Receipt = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await bookingsAPI.getBookingById(bookingId);
      setBooking(response.data.data);
    } catch (error) {
      console.error('Error fetching booking:', error);
      alert('Error loading receipt');
      navigate('/my-bookings');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const receiptContent = `
CINEMA BOOKING RECEIPT
═══════════════════════════════════════

Booking Reference: ${booking.bookingReference}
Date: ${new Date(booking.bookingDate).toLocaleDateString()}

CUSTOMER: ${booking.user?.name}
EMAIL: ${booking.user?.email}

MOVIE: ${booking.movie?.title}
DATE: ${new Date(booking.show?.showDate).toLocaleDateString()}
TIME: ${booking.show?.showTime}
SCREEN: ${booking.show?.screen}

SEATS: ${booking.seats.map(s => s.seatNumber).join(', ')}

TOTAL: $${booking.totalAmount.toFixed(2)}
PAYMENT: ${booking.paymentMethod.toUpperCase()}
STATUS: ${booking.status.toUpperCase()}

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

  if (loading) {
    return <div className="loading">Loading receipt...</div>;
  }

  if (!booking) {
    return <div className="loading">Booking not found</div>;
  }

  return (
    <div className="receipt-page">
      <div className="receipt-wrapper">
        <div className="receipt-actions no-print">
          <button onClick={() => navigate('/my-bookings')}>← Back</button>
          <div>
            <button onClick={handlePrint}>Print</button>
            <button onClick={handleDownload}>Download</button>
          </div>
        </div>

        <div className="receipt">
          <div className="receipt-header">
            <h1>Booking Receipt</h1>
            <div className="ref">{booking.bookingReference}</div>
          </div>

          <div className="receipt-body">
            <div className="section">
              <div className="row">
                <span>Customer</span>
                <span>{booking.user?.name}</span>
              </div>
              <div className="row">
                <span>Email</span>
                <span>{booking.user?.email}</span>
              </div>
            </div>

            <div className="divider"></div>

            <div className="section">
              <div className="row">
                <span>Movie</span>
                <span>{booking.movie?.title}</span>
              </div>
              <div className="row">
                <span>Date</span>
                <span>
                  {new Date(booking.show?.showDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="row">
                <span>Time</span>
                <span>{booking.show?.showTime}</span>
              </div>
              <div className="row">
                <span>Screen</span>
                <span>{booking.show?.screen}</span>
              </div>
            </div>

            <div className="divider"></div>

            <div className="section">
              <div className="row">
                <span>Seats</span>
                <span>{booking.seats.map(s => s.seatNumber).join(', ')}</span>
              </div>
              <div className="row">
                <span>Quantity</span>
                <span>{booking.seats.length}</span>
              </div>
            </div>

            <div className="divider"></div>

            <div className="section">
              <div className="row total">
                <span>Total Amount</span>
                <span>${booking.totalAmount.toFixed(2)}</span>
              </div>
              <div className="row">
                <span>Payment</span>
                <span>{booking.paymentMethod.toUpperCase()}</span>
              </div>
              <div className="row">
                <span>Status</span>
                <span className={`badge ${booking.status}`}>{booking.status}</span>
              </div>
            </div>
          </div>

          <div className="receipt-footer">
            <p>Thank you for your booking!</p>
            <p>Please arrive 15 minutes early</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;