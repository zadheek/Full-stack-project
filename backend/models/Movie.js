const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['poster', 'banner', 'thumbnail', 'gallery'],
    required: true
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  altText: {
    type: String,
    default: ''
  }
}, { _id: true });

const videoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['trailer', 'teaser', 'behind-scenes'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  }
}, { _id: true });

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  genre: [{
    type: String,
    required: true,
    trim: true
  }],
  language: {
    type: String,
    required: [true, 'Language is required'],
    trim: true
  },
  releaseDate: {
    type: Date,
    required: [true, 'Release date is required']
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be between 0 and 10'],
    max: [10, 'Rating must be between 0 and 10'],
    default: 0
  },
  director: {
    type: String,
    required: [true, 'Director is required'],
    trim: true
  },
  cast: [{
    type: String,
    required: true,
    trim: true
  }],
  images: [imageSchema],
  videos: [videoSchema],
  status: {
    type: String,
    enum: ['upcoming', 'now-showing', 'ended'],
    default: 'upcoming'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
movieSchema.index({ title: 1 });
movieSchema.index({ status: 1, isActive: 1 });
movieSchema.index({ releaseDate: -1 });

module.exports = mongoose.model('Movie', movieSchema);