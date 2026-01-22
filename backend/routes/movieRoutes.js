const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', movieController.getAllMovies);
router.get('/upcoming', movieController.getUpcomingMovies);
router.get('/now-showing', movieController.getNowShowingMovies);
router.get('/:id', movieController.getMovieById);

// Admin routes
router.post('/', protect, authorize('admin'), movieController.createMovie);
router.put('/:id', protect, authorize('admin'), movieController.updateMovie);
router.delete('/:id', protect, authorize('admin'), movieController.deleteMovie);

module.exports = router;