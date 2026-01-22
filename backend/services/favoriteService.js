const User = require('../models/User');
const Movie = require('../models/Movie');

class FavoriteService {
  async addToFavorites(userId, movieId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const movie = await Movie.findOne({ _id: movieId, isActive: true });
    if (!movie) {
      throw new Error('Movie not found');
    }

    // Check if already in favorites
    if (user.favorites.includes(movieId)) {
      throw new Error('Movie already in favorites');
    }

    user.favorites.push(movieId);
    await user.save();

    return await this.getFavorites(userId);
  }

  async removeFromFavorites(userId, movieId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.favorites = user.favorites.filter(
      fav => fav.toString() !== movieId.toString()
    );
    await user.save();

    return await this.getFavorites(userId);
  }

  async getFavorites(userId) {
    const user = await User.findById(userId).populate('favorites');
    if (!user) {
      throw new Error('User not found');
    }

    // Filter out inactive movies
    const activeFavorites = user.favorites.filter(movie => movie && movie.isActive);
    
    return activeFavorites;
  }

  async checkFavorite(userId, movieId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isFavorite = user.favorites.some(
      fav => fav.toString() === movieId.toString()
    );

    return { isFavorite };
  }
}

module.exports = new FavoriteService();