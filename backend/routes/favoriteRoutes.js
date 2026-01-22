const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.post('/', favoriteController.addToFavorites);
router.get('/', favoriteController.getFavorites);
router.delete('/:movieId', favoriteController.removeFromFavorites);
router.get('/check/:movieId', favoriteController.checkFavorite);

module.exports = router;