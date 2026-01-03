const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Save = sequelize.define('Save', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
}, {
  timestamps: true,
});

module.exports = Save;
