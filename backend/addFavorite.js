require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Movie = require('./models/Movie');

const addFavorite = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Replace with your email
    const user = await User.findOne({ email: 'vita@gmail.com' });
    
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    // Get first movie
    const movie = await Movie.findOne({ isActive: true });
    
    if (!movie) {
      console.log('No movies found');
      process.exit(1);
    }

    console.log('User:', user.name);
    console.log('Adding movie:', movie.title);

    // Add to favorites
    if (!user.favorites.includes(movie._id)) {
      user.favorites.push(movie._id);
      await user.save();
      console.log('✅ Added to favorites!');
    } else {
      console.log('Already in favorites');
    }

    // Check result
    const updatedUser = await User.findById(user._id).populate('favorites');
    console.log('\nTotal favorites:', updatedUser.favorites.length);
    updatedUser.favorites.forEach((fav, index) => {
      console.log(`${index + 1}. ${fav.title}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

addFavorite();