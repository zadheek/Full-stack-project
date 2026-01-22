const Joi = require('joi');

// Register DTO
const registerDto = Joi.object({
  name: Joi.string().max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().allow('').optional(),
  role: Joi.string().valid('user', 'admin').default('user')
});

// Login DTO
const loginDto = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = {
  registerDto,
  loginDto
};