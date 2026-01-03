const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const authMiddleware = require('../middleware/auth');

// Publicly available routes
router.get('/', communityController.getCommunityTrips);

// Routes requiring authentication
router.post('/like/:tripId', authMiddleware, communityController.toggleLike);
router.post('/save/:tripId', authMiddleware, communityController.saveTrip);

module.exports = router;
