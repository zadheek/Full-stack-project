const Joi = require('joi');

// Image schema
const imageSchema = Joi.object({
  url: Joi.string().uri().required(),
  type: Joi.string().valid('poster', 'banner', 'thumbnail', 'gallery').required(),
  isPrimary: Joi.boolean().default(false),
  altText: Joi.string().allow('').default('')
});

// Video schema
const videoSchema = Joi.object({
  url: Joi.string().uri().required(),
  type: Joi.string().valid('trailer', 'teaser', 'behind-scenes').required(),
  title: Joi.string().required(),
  duration: Joi.number().min(1).required(),
  thumbnailUrl: Joi.string().uri().allow('').default('')
});

// Create movie DTO - UPDATED
const createMovieDto = Joi.object({
  title: Joi.string().max(200).required(),
  description: Joi.string().max(2000).required(),
  duration: Joi.number().min(1).required(),
  genre: Joi.array().items(Joi.string()).min(1).required(),
  language: Joi.string().required(),
  releaseDate: Joi.date().required(),
  rating: Joi.number().min(0).max(10).default(0),
  director: Joi.string().required(),
  cast: Joi.array().items(Joi.string()).min(1).required(),
  images: Joi.array().items(imageSchema).min(1).required(),
  videos: Joi.array().items(videoSchema).default([]),
  status: Joi.string().valid('upcoming', 'now-showing', 'ended').default('upcoming'),
  // Allow unknown fields (posterUrl, posterType) - they'll be removed before saving
  posterUrl: Joi.string().optional(),
  posterType: Joi.string().optional()
}).unknown(false); // Don't allow other unknown fields

// Update movie DTO - UPDATED
const updateMovieDto = Joi.object({
  title: Joi.string().max(200),
  description: Joi.string().max(2000),
  duration: Joi.number().min(1),
  genre: Joi.array().items(Joi.string()).min(1),
  language: Joi.string(),
  releaseDate: Joi.date(),
  rating: Joi.number().min(0).max(10),
  director: Joi.string(),
  cast: Joi.array().items(Joi.string()).min(1),
  images: Joi.array().items(imageSchema),
  videos: Joi.array().items(videoSchema),
  status: Joi.string().valid('upcoming', 'now-showing', 'ended'),
  isActive: Joi.boolean(),
  // Allow unknown fields
  posterUrl: Joi.string().optional(),
  posterType: Joi.string().optional()
}).unknown(false);

module.exports = {
  createMovieDto,
  updateMovieDto
};