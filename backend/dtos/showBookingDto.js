const Joi = require('joi');

// Create show DTO
const createShowDto = Joi.object({
  movie: Joi.string().hex().length(24).required(),
  showDate: Joi.date().required(),
  showTime: Joi.string().required(),
  screen: Joi.string().required(),
  totalSeats: Joi.number().min(1).required(),
  price: Joi.number().min(0).required()
});

// Update show DTO
const updateShowDto = Joi.object({
  movie: Joi.string().hex().length(24),
  showDate: Joi.date(),
  showTime: Joi.string(),
  screen: Joi.string(),
  totalSeats: Joi.number().min(1),
  price: Joi.number().min(0),
  isActive: Joi.boolean()
});

// Create booking DTO
const createBookingDto = Joi.object({
  show: Joi.string().hex().length(24).required(),
  seats: Joi.array().items(
    Joi.object({
      seatNumber: Joi.string().required(),
      row: Joi.string().required()
    })
  ).min(1).required(),
  paymentMethod: Joi.string().valid('stripe', 'paypal', 'cash').default('stripe')
});

module.exports = {
  createShowDto,
  updateShowDto,
  createBookingDto
};