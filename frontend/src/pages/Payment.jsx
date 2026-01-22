import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { bookingsAPI } from '../services/api';
import './Payment.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ show, selectedSeats, totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create booking
      const bookingResponse = await bookingsAPI.createBooking({
        show: show._id,
        seats: selectedSeats,
        paymentMethod: 'stripe'
      });

      const booking = bookingResponse.data.data;

      // Create payment intent
      const paymentIntentResponse = await bookingsAPI.createPaymentIntent(booking._id);
      const clientSecret = paymentIntentResponse.data.data.clientSecret;

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)
          }
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm booking
        await bookingsAPI.confirmPayment(booking._id);
        navigate('/success', { state: { booking } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="card-input">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#fff',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                '::placeholder': {
                  color: '#888',
                },
              },
              invalid: {
                color: '#ff4444',
              },
            },
          }}
        />
      </div>
      
      {error && <div className="error-msg">{error}</div>}
      
      <button 
        type="submit" 
        disabled={!stripe || processing}
        className="pay-btn"
      >
        {processing ? 'Processing...' : `Pay Rs. ${totalAmount}`}
      </button>
    </form>
  );
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { show, selectedSeats, totalAmount } = location.state || {};

  if (!show || !selectedSeats) {
    navigate('/movies');
    return null;
  }

  return (
    <div className="payment-page">
      <div className="payment-wrapper">
        <h1 className="payment-title">Complete Payment</h1>
        
        <div className="payment-content">
          {/* Order Summary */}
          <div className="summary-section">
            <h2>Order Summary</h2>
            
            <div className="summary-item">
              <span className="label">Movie</span>
              <span className="value">{show.movie?.title}</span>
            </div>

            <div className="summary-item">
              <span className="label">Date & Time</span>
              <span className="value">
                {new Date(show.showDate).toLocaleDateString()} - {show.showTime}
              </span>
            </div>

            <div className="summary-item">
              <span className="label">Screen</span>
              <span className="value">{show.screen}</span>
            </div>

            <div className="summary-item">
              <span className="label">Seats</span>
              <span className="value">
                {selectedSeats.map(s => s.seatNumber).join(', ')}
              </span>
            </div>

            <div className="summary-item">
              <span className="label">Number of Seats</span>
              <span className="value">{selectedSeats.length}</span>
            </div>

            <div className="divider"></div>

            <div className="summary-item total">
              <span className="label">Total Amount</span>
              <span className="value">Rs. {totalAmount}</span>
            </div>
          </div>

          {/* Payment Form */}
          <div className="payment-section">
            <h2>Payment Details</h2>
            <p className="payment-desc">Enter your card information to complete the booking</p>
            
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                show={show} 
                selectedSeats={selectedSeats} 
                totalAmount={totalAmount} 
              />
            </Elements>

            <div className="secure-info">
              <span>🔒</span>
              <span>Your payment information is secure and encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;