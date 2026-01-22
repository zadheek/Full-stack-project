const express = require('express');
const router = express.Router();
const { bookingController } = require('../controllers/showController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, bookingController.createBooking);
router.post('/:bookingId/payment-intent', protect, bookingController.createPaymentIntent);
router.post('/:bookingId/confirm', protect, bookingController.confirmPayment);
router.get('/my-bookings', protect, bookingController.getUserBookings);
router.get('/:id', protect, bookingController.getBookingById);
router.put('/:id/cancel', protect, bookingController.cancelBooking);

// Admin routes
router.get('/', protect, authorize('admin'), bookingController.getAllBookings);

module.exports = router;