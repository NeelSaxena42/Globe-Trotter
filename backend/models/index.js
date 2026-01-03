const User = require('./User');
const Trip = require('./Trip');
const Like = require('./Like');
const Save = require('./Save');

// User <-> Trip (Personal trips)
User.hasMany(Trip, { foreignKey: 'userId', as: 'personalTrips' });
Trip.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// User <-> Like <-> Trip (Likes relationship)
User.belongsToMany(Trip, { through: Like, foreignKey: 'userId', otherKey: 'tripId', as: 'likedTrips' });
Trip.belongsToMany(User, { through: Like, foreignKey: 'tripId', otherKey: 'userId', as: 'likedByUsers' });

// User <-> Save <-> Trip (Saves relationship)
User.belongsToMany(Trip, { through: Save, foreignKey: 'userId', otherKey: 'tripId', as: 'savedTrips' });
Trip.belongsToMany(User, { through: Save, foreignKey: 'tripId', otherKey: 'userId', as: 'savedByUsers' });

module.exports = {
  User,
  Trip,
  Like,
  Save
};
