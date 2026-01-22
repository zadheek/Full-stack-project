const movieService = require('../services/movieService');
const { createMovieDto, updateMovieDto } = require('../dtos/movieDto');

class MovieController {
  async createMovie(req, res) {
    try {
      const { error } = createMovieDto.validate(req.body);
      if (error) {
        return res.status(400).json({ 
          success: false, 
          message: error.details[0].message 
        });
      }

      const movie = await movieService.createMovie(req.body);
      res.status(201).json({
        success: true,
        data: movie
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllMovies(req, res) {
    try {
      const filters = {
        status: req.query.status,
        genre: req.query.genre,
        language: req.query.language,
        search: req.query.search
      };

      const movies = await movieService.getAllMovies(filters);
      res.status(200).json({
        success: true,
        count: movies.length,
        data: movies
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getMovieById(req, res) {
    try {
      const movie = await movieService.getMovieById(req.params.id);
      res.status(200).json({
        success: true,
        data: movie
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateMovie(req, res) {
    try {
      const { error } = updateMovieDto.validate(req.body);
      if (error) {
        return res.status(400).json({ 
          success: false, 
          message: error.details[0].message 
        });
      }

      const movie = await movieService.updateMovie(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: movie
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteMovie(req, res) {
    try {
      await movieService.deleteMovie(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Movie deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getUpcomingMovies(req, res) {
    try {
      const movies = await movieService.getUpcomingMovies();
      res.status(200).json({
        success: true,
        count: movies.length,
        data: movies
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getNowShowingMovies(req, res) {
    try {
      const movies = await movieService.getNowShowingMovies();
      res.status(200).json({
        success: true,
        count: movies.length,
        data: movies
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new MovieController();