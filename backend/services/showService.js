const Show = require('../models/Show');
const Movie = require('../models/Movie');

class ShowService {
  async createShow(showData) {
    const movie = await Movie.findOne({ _id: showData.movie, isActive: true });
    if (!movie) {
      throw new Error('Movie not found');
    }

    const show = await Show.create({
      ...showData,
      availableSeats: showData.totalSeats
    });

    return await show.populate('movie');
  }

  async getAllShows(filters = {}) {
    const query = { isActive: true };
    
    if (filters.movie) {
      query.movie = filters.movie;
    }
    
    if (filters.date) {
      const startDate = new Date(filters.date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(filters.date);
      endDate.setHours(23, 59, 59, 999);
      query.showDate = { $gte: startDate, $lte: endDate };
    }

    const shows = await Show.find(query)
      .populate('movie')
      .sort({ showDate: 1, showTime: 1 });
    
    return shows;
  }

  async getShowById(showId) {
    const show = await Show.findOne({ _id: showId, isActive: true })
      .populate('movie');
    
    if (!show) {
      throw new Error('Show not found');
    }
    
    return show;
  }

  async updateShow(showId, updateData) {
    const show = await Show.findOneAndUpdate(
      { _id: showId, isActive: true },
      updateData,
      { new: true, runValidators: true }
    ).populate('movie');
    
    if (!show) {
      throw new Error('Show not found');
    }
    
    return show;
  }

  async deleteShow(showId) {
    const show = await Show.findOneAndUpdate(
      { _id: showId },
      { isActive: false },
      { new: true }
    );
    
    if (!show) {
      throw new Error('Show not found');
    }
    
    return show;
  }

  async getShowsByMovie(movieId) {
    const shows = await Show.find({
      movie: movieId,
      isActive: true,
      showDate: { $gte: new Date() }
    })
      .populate('movie')
      .sort({ showDate: 1, showTime: 1 });
    
    return shows;
  }
}

module.exports = new ShowService();