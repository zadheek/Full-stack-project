const mongoose = require('mongoose');

// Function to generate booking reference
const generateBookingReference = () => {
  return 'BK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: [true, 'Show is required']
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Movie is required']
  },
  seats: [{
    seatNumber: {
      type: String,
      required: true
    },
    row: {
      type: String,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount must be positive']
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'cash'],
    default: 'stripe'
  },
  paymentIntentId: {
    type: String
  },
  bookingReference: {
    type: String,
    unique: true,
    default: generateBookingReference // Use default function
  }
}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ user: 1, bookingDate: -1 });
bookingSchema.index({ bookingReference: 1 });
bookingSchema.index({ status: 1, paymentStatus: 1 });

module.exports = mongoose.model('Booking', bookingSchema);