const Movie = require('../models/Movie');

class MovieService {
  async createMovie(movieData) {
    const movie = await Movie.create(movieData);
    return movie;
  }

  async getAllMovies(filters = {}) {
    const query = { isActive: true };
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.genre) {
      query.genre = { $in: [filters.genre] };
    }
    
    if (filters.language) {
      query.language = filters.language;
    }

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { director: { $regex: filters.search, $options: 'i' } }
      ];
    }

    const movies = await Movie.find(query).sort({ releaseDate: -1 });
    return movies;
  }

  async getMovieById(movieId) {
    const movie = await Movie.findOne({ _id: movieId, isActive: true });
    if (!movie) {
      throw new Error('Movie not found');
    }
    return movie;
  }

  async updateMovie(movieId, updateData) {
    const movie = await Movie.findOneAndUpdate(
      { _id: movieId, isActive: true },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!movie) {
      throw new Error('Movie not found');
    }
    
    return movie;
  }

  async deleteMovie(movieId) {
    const movie = await Movie.findOneAndUpdate(
      { _id: movieId },
      { isActive: false },
      { new: true }
    );
    
    if (!movie) {
      throw new Error('Movie not found');
    }
    
    return movie;
  }

  async getUpcomingMovies() {
    const movies = await Movie.find({
      status: 'upcoming',
      isActive: true
    }).sort({ releaseDate: 1 });
    
    return movies;
  }

  async getNowShowingMovies() {
    const movies = await Movie.find({
      status: 'now-showing',
      isActive: true
    }).sort({ releaseDate: -1 });
    
    return movies;
  }
}

module.exports = new MovieService();