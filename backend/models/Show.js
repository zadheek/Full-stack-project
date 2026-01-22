const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Movie is required']
  },
  showDate: {
    type: Date,
    required: [true, 'Show date is required']
  },
  showTime: {
    type: String,
    required: [true, 'Show time is required']
  },
  screen: {
    type: String,
    required: [true, 'Screen is required']
  },
  totalSeats: {
    type: Number,
    required: [true, 'Total seats is required'],
    min: [1, 'Total seats must be at least 1']
  },
  availableSeats: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  bookedSeats: [{
    seatNumber: String,
    row: String,
    status: {
      type: String,
      enum: ['booked', 'reserved'],
      default: 'booked'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
showSchema.index({ movie: 1, showDate: 1, showTime: 1 });
showSchema.index({ showDate: 1, isActive: 1 });

// Set availableSeats before saving if not set
showSchema.pre('save', function(next) {
  if (this.isNew && this.availableSeats === undefined) {
    this.availableSeats = this.totalSeats;
  }
  next();
});

module.exports = mongoose.model('Show', showSchema);