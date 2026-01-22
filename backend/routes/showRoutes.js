const express = require('express');
const router = express.Router();
const { showController } = require('../controllers/showController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', showController.getAllShows);
router.get('/movie/:movieId', showController.getShowsByMovie);
router.get('/:id', showController.getShowById);

// Admin routes
router.post('/', protect, authorize('admin'), showController.createShow);
router.put('/:id', protect, authorize('admin'), showController.updateShow);
router.delete('/:id', protect, authorize('admin'), showController.deleteShow);

module.exports = router;