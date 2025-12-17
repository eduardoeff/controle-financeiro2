// src/models/Circle.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Circle = sequelize.define('Circle', {
  name: { type: DataTypes.STRING, allowNull: false },
  maxMembers: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 6 },
  ownerUserId: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Circle;