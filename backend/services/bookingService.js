const Booking = require('../models/Booking');
const Show = require('../models/Show');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class BookingService {
  // Generate booking reference helper
  generateBookingReference() {
    return 'BK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  async createBooking(userId, bookingData) {
    const show = await Show.findOne({ _id: bookingData.show, isActive: true })
      .populate('movie');
    
    if (!show) {
      throw new Error('Show not found');
    }

    // Check seat availability
    const requestedSeats = bookingData.seats.map(s => s.seatNumber);
    const bookedSeatNumbers = show.bookedSeats.map(s => s.seatNumber);
    const unavailableSeats = requestedSeats.filter(seat => 
      bookedSeatNumbers.includes(seat)
    );

    if (unavailableSeats.length > 0) {
      throw new Error(`Seats ${unavailableSeats.join(', ')} are already booked`);
    }

    if (show.availableSeats < bookingData.seats.length) {
      throw new Error('Not enough available seats');
    }

    const totalAmount = show.price * bookingData.seats.length;

    // Create booking with explicit bookingReference
    const booking = await Booking.create({
      user: userId,
      show: show._id,
      movie: show.movie._id,
      seats: bookingData.seats,
      totalAmount,
      paymentMethod: bookingData.paymentMethod,
      bookingReference: this.generateBookingReference() // Explicit generation
    });

    // Update show seats
    show.bookedSeats.push(...bookingData.seats.map(seat => ({
      seatNumber: seat.seatNumber,
      row: seat.row,
      status: 'reserved'
    })));
    show.availableSeats -= bookingData.seats.length;
    await show.save();

    return await booking.populate(['user', 'show', 'movie']);
  }

  async createPaymentIntent(bookingId) {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId: booking._id.toString(),
        bookingReference: booking.bookingReference
      }
    });

    booking.paymentIntentId = paymentIntent.id;
    await booking.save();

    return {
      clientSecret: paymentIntent.client_secret,
      booking
    };
  }

  async confirmPayment(bookingId) {
    const booking = await Booking.findById(bookingId).populate(['show', 'movie']);
    if (!booking) {
      throw new Error('Booking not found');
    }

    booking.status = 'confirmed';
    booking.paymentStatus = 'completed';
    await booking.save();

    // Update show booked seats status
    const show = await Show.findById(booking.show._id);
    booking.seats.forEach(seat => {
      const bookedSeat = show.bookedSeats.find(
        s => s.seatNumber === seat.seatNumber
      );
      if (bookedSeat) {
        bookedSeat.status = 'booked';
      }
    });
    await show.save();

    return booking;
  }

  async getUserBookings(userId) {
    const bookings = await Booking.find({ user: userId })
      .populate(['show', 'movie'])
      .sort({ bookingDate: -1 });
    
    return bookings;
  }

  async getAllBookings(filters = {}) {
    const query = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.paymentStatus) {
      query.paymentStatus = filters.paymentStatus;
    }

    const bookings = await Booking.find(query)
      .populate(['user', 'show', 'movie'])
      .sort({ bookingDate: -1 });
    
    return bookings;
  }

  async getBookingById(bookingId) {
    const booking = await Booking.findById(bookingId)
      .populate(['user', 'show', 'movie']);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    return booking;
  }

  async cancelBooking(bookingId, userId) {
    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status === 'cancelled') {
      throw new Error('Booking already cancelled');
    }

    booking.status = 'cancelled';
    await booking.save();

    // Release seats
    const show = await Show.findById(booking.show);
    booking.seats.forEach(seat => {
      const index = show.bookedSeats.findIndex(
        s => s.seatNumber === seat.seatNumber
      );
      if (index > -1) {
        show.bookedSeats.splice(index, 1);
      }
    });
    show.availableSeats += booking.seats.length;
    await show.save();

    return booking;
  }
}

module.exports = new BookingService();