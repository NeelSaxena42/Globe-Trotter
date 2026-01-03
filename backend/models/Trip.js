const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  coverImage: {
    type: DataTypes.STRING,
  },
  budget: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  activities: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  cities: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  isShared: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  sharedAt: {
    type: DataTypes.DATE,
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  savesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
});

module.exports = Trip;
