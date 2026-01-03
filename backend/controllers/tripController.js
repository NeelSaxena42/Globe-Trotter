const { Trip } = require('../models');

// Get all trips for a user
exports.getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']],
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single trip
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: { id: req.params.id, userId: req.userId },
    });
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new trip
exports.createTrip = async (req, res) => {
  try {
    const { name, description, destination, startDate, endDate, budget, activities, cities, coverImage } = req.body;
    
    const trip = await Trip.create({
      name,
      description,
      destination,
      startDate,
      endDate,
      budget,
      activities,
      cities,
      coverImage,
      userId: req.userId,
    });
    
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a trip
exports.updateTrip = async (req, res) => {
  try {
    const { name, description, destination, startDate, endDate, budget, activities, cities, coverImage } = req.body;
    
    const trip = await Trip.findOne({
      where: { id: req.params.id, userId: req.userId },
    });
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    await trip.update({
      name,
      description,
      destination,
      startDate,
      endDate,
      budget,
      activities,
      cities,
      coverImage
    });
    
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a trip
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: { id: req.params.id, userId: req.userId },
    });
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    await trip.destroy();
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Share trip to community
exports.shareTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    await trip.update({
      isShared: true,
      sharedAt: new Date()
    });

    res.json({ message: 'Trip shared to community', trip });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
