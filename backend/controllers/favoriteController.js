const favoriteService = require('../services/favoriteService');

class FavoriteController {
  async addToFavorites(req, res) {
    try {
      const { movieId } = req.body;
      const favorites = await favoriteService.addToFavorites(req.user.id, movieId);
      
      res.status(200).json({
        success: true,
        message: 'Added to favorites',
        data: favorites
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async removeFromFavorites(req, res) {
    try {
      const { movieId } = req.params;
      const favorites = await favoriteService.removeFromFavorites(req.user.id, movieId);
      
      res.status(200).json({
        success: true,
        message: 'Removed from favorites',
        data: favorites
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getFavorites(req, res) {
    try {
      const favorites = await favoriteService.getFavorites(req.user.id);
      
      res.status(200).json({
        success: true,
        count: favorites.length,
        data: favorites
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async checkFavorite(req, res) {
    try {
      const { movieId } = req.params;
      const result = await favoriteService.checkFavorite(req.user.id, movieId);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new FavoriteController();