const { Trip, User, Like, Save } = require('../models');

// Get all shared trips for community
exports.getCommunityTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      where: { isShared: true },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['username']
        }
      ],
      order: [['sharedAt', 'DESC']]
    });
    
    // Map to include sharedBy field as expected by frontend
    const results = trips.map(t => ({
      ...t.toJSON(),
      sharedBy: t.owner?.username || 'Traveler'
    }));
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle like on a community trip
exports.toggleLike = async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const userId = req.userId;

    const existingLike = await Like.findOne({
      where: { userId, tripId }
    });

    const trip = await Trip.findByPk(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (existingLike) {
      await existingLike.destroy();
      await trip.decrement('likesCount');
      return res.json({ message: 'Trip unliked', likesCount: trip.likesCount - 1 });
    } else {
      await Like.create({ userId, tripId });
      await trip.increment('likesCount');
      return res.json({ message: 'Trip liked', likesCount: trip.likesCount + 1 });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Save a trip from community to personal collection
exports.saveTrip = async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const userId = req.userId;

    const trip = await Trip.findByPk(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if already saved
    const existingSave = await Save.findOne({ where: { userId, tripId } });
    if (existingSave) {
      return res.status(400).json({ message: 'Trip already saved' });
    }

    // Create save entry
    await Save.create({ userId, tripId });
    await trip.increment('savesCount');

    // Also create a copy of the trip for the user (optional, but requested by frontend logic)
    // The frontend logic for "saveFromCommunity" actually creates a new trip in the user's collection
    const clonedTrip = await Trip.create({
      name: `${trip.name} (Saved)`,
      description: trip.description,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: trip.budget,
      activities: trip.activities,
      cities: trip.cities,
      coverImage: trip.coverImage,
      userId: userId,
      isShared: false
    });

    res.json({ message: 'Trip saved successfully', clonedTrip });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
