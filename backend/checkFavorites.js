require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkFavorites = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Find your user (replace with your email)
    const user = await User.findOne({ email: 'vita@gmail.com' }).populate('favorites');
    
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    console.log('User:', user.name);
    console.log('Email:', user.email);
    console.log('Favorites count:', user.favorites.length);
    console.log('\nFavorite Movies:');
    user.favorites.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} (${movie._id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkFavorites();