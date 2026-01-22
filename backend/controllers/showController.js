const showService = require('../services/showService');
const { createShowDto, updateShowDto } = require('../dtos/showBookingDto');

class ShowController {
  async createShow(req, res) {
    try {
      const { error } = createShowDto.validate(req.body);
      if (error) {
        return res.status(400).json({ 
          success: false, 
          message: error.details[0].message 
        });
      }

      const show = await showService.createShow(req.body);
      res.status(201).json({
        success: true,
        data: show
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllShows(req, res) {
    try {
      const filters = {
        movie: req.query.movie,
        date: req.query.date
      };

      const shows = await showService.getAllShows(filters);
      res.status(200).json({
        success: true,
        count: shows.length,
        data: shows
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getShowById(req, res) {
    try {
      const show = await showService.getShowById(req.params.id);
      res.status(200).json({
        success: true,
        data: show
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateShow(req, res) {
    try {
      const { error } = updateShowDto.validate(req.body);
      if (error) {
        return res.status(400).json({ 
          success: false, 
          message: error.details[0].message 
        });
      }

      const show = await showService.updateShow(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: show
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteShow(req, res) {
    try {
      await showService.deleteShow(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Show deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getShowsByMovie(req, res) {
    try {
      const shows = await showService.getShowsByMovie(req.params.movieId);
      res.status(200).json({
        success: true,
        count: shows.length,
        data: shows
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

// backend/controllers/bookingController.js
const bookingService = require('../services/bookingService');
const { createBookingDto } = require('../dtos/showBookingDto');

class BookingController {
  async createBooking(req, res) {
    try {
      const { error } = createBookingDto.validate(req.body);
      if (error) {
        return res.status(400).json({ 
          success: false, 
          message: error.details[0].message 
        });
      }

      const booking = await bookingService.createBooking(req.user.id, req.body);
      res.status(201).json({
        success: true,
        data: booking
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async createPaymentIntent(req, res) {
    try {
      const result = await bookingService.createPaymentIntent(req.params.bookingId);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async confirmPayment(req, res) {
    try {
      const booking = await bookingService.confirmPayment(req.params.bookingId);
      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getUserBookings(req, res) {
    try {
      const bookings = await bookingService.getUserBookings(req.user.id);
      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllBookings(req, res) {
    try {
      const filters = {
        status: req.query.status,
        paymentStatus: req.query.paymentStatus
      };

      const bookings = await bookingService.getAllBookings(filters);
      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getBookingById(req, res) {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async cancelBooking(req, res) {
    try {
      const booking = await bookingService.cancelBooking(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = {
  showController: new ShowController(),
  bookingController: new BookingController()
};