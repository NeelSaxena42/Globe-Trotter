const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const authMiddleware = require('../middleware/auth');

// All personal trip routes require authentication
router.use(authMiddleware);

router.get('/', tripController.getUserTrips);
router.get('/:id', tripController.getTrip);
router.post('/', tripController.createTrip);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);
router.post('/:id/share', tripController.shareTrip);

module.exports = router;
